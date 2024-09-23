import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useStore } from "@/stores";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { getLookupAddress, getModels } from "@/service/api/apple";
import { getLocalStorage } from "@/utils/tools";
import { LOCAL_STORAGE } from "@/utils/enums";
import { Input } from "@/components/ui/input";
import { Config, Model } from "@/service/types/apple";
import Loading from "@/components/share/loading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
} from "@/components/core/carousel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Typography } from "@/components/ui/typography";
import { CreateFormSchema } from "@/components/share/form";
import AddressPicker from "@/components/share/address-picker-cn";

interface SearchFormProps {
  config: Config;
}

const ModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  capacities: z.array(z.string()),
  colors: z.array(
    z.object({ code: z.string(), name: z.string(), image: z.string() }),
  ),
  part_numbers: z.array(
    z.object({
      part_number: z.string(),
      color: z.string(),
      capacity: z.string(),
      image_url: z.string(),
    }),
  ),
});

const createFormSchema: CreateFormSchema = (search) =>
  z.object({
    model: ModelSchema as z.ZodType<Model>,
    storage: z.string(),
    color: z.string(),
    zipCode: z
      .string({
        required_error: search.validation?.zip?.requiredError,
      })
      .refine(
        (value) => {
          if (!value) return false;
          const pattern = search.validation?.zip?.pattern;
          if (!pattern) return true;
          return new RegExp(pattern).test(value);
        },
        {
          message: search.validation?.zip?.invalidFormatError,
        },
      ),
  });

const SearchForm: React.FC<SearchFormProps> = ({ config }) => {
  const { search } = config;
  const langTag = getLocalStorage(LOCAL_STORAGE.APPLE_LANG_TAG) as string;
  const setLangTag = useStore((state) => state.apple.setLangTag);
  const setFormData = useStore((state) => state.apple.setFormData);
  const isResetForm = useStore((state) => state.apple.isResetForm);
  const setIsResetForm = useStore((state) => state.apple.setIsResetForm);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isZipCodeValid, setIsZipCodeValid] = useState(false);
  const formSchema = createFormSchema(search);
  const countryCode = search.countryCode;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      zipCode: "",
      model: undefined,
      storage: undefined,
      color: undefined,
    },
  });

  const formValues = form.getValues();
  const storages = formValues.model?.capacities ?? [];
  const colors = formValues.model?.colors ?? [];

  const { data: modelData } = useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      setLangTag(null);
      const response = await getModels();
      return response.data;
    },
    enabled: !!langTag,
    refetchOnWindowFocus: false,
  });

  const isPro = (m: string) => m.includes("pro");

  const getResetForm = (model: string) => {
    if (!formValues.model) return;
    const currentModel = formValues.model.id;
    if (isPro(model) === isPro(currentModel)) {
      return;
    } else {
      form.resetField("storage");
      form.resetField("color");
    }
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.model) {
        setFormData(value as z.infer<typeof formSchema>);
      } else {
        setFormData(null);
      }

      if (value.zipCode) {
        if (countryCode === "CN") return;
        const pattern = search.validation?.zip?.pattern;
        if (pattern) {
          const regex = new RegExp(pattern);
          setIsZipCodeValid(regex.test(value.zipCode));
        }
      } else {
        setIsZipCodeValid(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [countryCode, form, search.validation?.zip?.pattern, setFormData]);

  useEffect(() => {
    if (isResetForm) {
      form.reset();
      setIsResetForm(false);
    }
  }, [form, isResetForm, setIsResetForm]);

  if (!search || !modelData) return <Loading />;

  return (
    <Form {...form}>
      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <Carousel
          index={carouselIndex}
          onIndexChange={setCarouselIndex}
          disableDrag
        >
          <CarouselContent className="flex items-start">
            <CarouselItem key="zip-code-item" className="p-3">
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <Typography variant="h2" className="mb-4">
                      ZIP.
                      <span className="text-[#86868b]">
                        {` Please provide your postal code.`}
                      </span>
                    </Typography>
                    <FormLabel>
                      {countryCode !== "CN" ? search.zipMessage : "请选择地区"}
                    </FormLabel>
                    <FormControl>
                      {countryCode !== "CN" ? (
                        <Input
                          placeholder={search.validation?.zip?.requiredError}
                          onVolumeChange={field.onChange}
                          {...field}
                        />
                      ) : (
                        <AddressPicker
                          form={form}
                          setIsValid={setIsZipCodeValid}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CarouselItem>

            {[
              isZipCodeValid && (
                <CarouselItem key="zip-code-item" className="p-3">
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <Typography variant="h2">
                          Model.
                          <span className="text-[#86868b]">
                            {` Which is best for you?`}
                          </span>
                        </Typography>
                        <FormControl>
                          <RadioGroup
                            defaultValue={field.value?.id}
                            onValueChange={(value) => {
                              const selectedModel = modelData?.find(
                                (model) => model.id === value,
                              );
                              field.onChange(selectedModel);

                              if (!selectedModel) return;
                              getResetForm(selectedModel.id);
                            }}
                            className="space-y-2"
                          >
                            {carouselIndex === 1 &&
                              modelData?.map((model) => (
                                <FormItem
                                  key={model.id}
                                  className="flex items-center space-x-1 space-y-0 rounded-lg border [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#0071e3]"
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={model.id}
                                      className="sr-only"
                                    />
                                  </FormControl>
                                  <FormLabel className="flex-grow p-4 font-normal">
                                    {model.name}
                                  </FormLabel>
                                </FormItem>
                              ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CarouselItem>
              ),
            ].filter(Boolean)}

            {[
              !!storages.length && (
                <CarouselItem key="storages-item" className="p-3">
                  <FormField
                    control={form.control}
                    name="storage"
                    render={({ field }) => (
                      <FormItem>
                        <Typography variant="h2" className="mb-4">
                          Storage.
                          <span className="text-[#86868b]">
                            {` How much space do you need?`}
                          </span>
                        </Typography>
                        <FormControl>
                          <RadioGroup
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className="space-y-2"
                          >
                            {carouselIndex === 2 &&
                              storages.map((item) => (
                                <FormItem
                                  key={item}
                                  className="flex items-center space-x-1 space-y-0 rounded-lg border [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#0071e3]"
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={item}
                                      className="sr-only"
                                    />
                                  </FormControl>
                                  <FormLabel className="flex-grow p-4 font-normal">
                                    {item}
                                  </FormLabel>
                                </FormItem>
                              ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CarouselItem>
              ),
            ].filter(Boolean)}

            {[
              !!colors.length && (
                <CarouselItem key="color-item" className="p-3">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <Typography variant="h2" className="mb-4">
                          Finish.
                          <span className="text-[#86868b]">
                            {` Pick your favorite.`}
                          </span>
                        </Typography>
                        <FormControl>
                          <RadioGroup
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className="space-y-2"
                          >
                            {carouselIndex === 3 &&
                              colors.map((item) => (
                                <FormItem
                                  key={item.code}
                                  className="flex items-center space-x-1 space-y-0 rounded-lg border [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#0071e3]"
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={item.code}
                                      className="sr-only"
                                    />
                                  </FormControl>
                                  <FormLabel className="flex flex-grow items-center gap-2 p-4 font-normal">
                                    <img
                                      className="aspect-square h-6 w-6 rounded-full"
                                      src={item.image}
                                      alt={item.code}
                                    />
                                    {item.name}
                                  </FormLabel>
                                </FormItem>
                              ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CarouselItem>
              ),
            ].filter(Boolean)}
          </CarouselContent>
          <CarouselNavigation
            className="absolute -bottom-20 left-auto top-auto w-full justify-end gap-2"
            classNameButton="bg-zinc-800 *:stroke-zinc-50 dark:bg-zinc-200 dark:*:stroke-zinc-800"
            alwaysShow
          />
        </Carousel>
      </form>
    </Form>
  );
};

export default SearchForm;
