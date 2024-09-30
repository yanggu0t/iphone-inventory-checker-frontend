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
import { set, useForm, useFormState } from "react-hook-form";
import { useStore } from "@/stores";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { getModels } from "@/service/api/apple";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "@tanstack/react-router";
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
    }),
  ),
});

const SearchForm: React.FC<SearchFormProps> = ({ config }) => {
  const navigate = useNavigate();
  const { search } = config;
  const langTag = getLocalStorage(LOCAL_STORAGE.APPLE_LANG_TAG) as string;
  const setLangTag = useStore((state) => state.apple.setLangTag);
  const setFormData = useStore((state) => state.apple.setFormData);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const formSchema = z.object({
    model: ModelSchema as z.ZodType<Model>,
    storage: z.string({ required_error: "Storage is required" }),
    color: z.string({ required_error: "Color is required" }),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zipCode: "",
      model: undefined,
      storage: undefined,
      color: undefined,
    },
  });

  const formValues = form.getValues();
  const storages = formValues ? formValues.model?.capacities : [];
  const colors = formValues ? formValues.model?.colors : [];

  const onSubmit = () => {
    setFormData(formValues);
  };

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

  if (!search || !modelData) return <Loading />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Carousel
          index={carouselIndex}
          onIndexChange={setCarouselIndex}
          disableDrag
        >
          <CarouselContent className="flex items-start">
            <CarouselItem className="p-3">
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
                        }}
                        className="space-y-2"
                      >
                        {modelData?.map((model) => (
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
            <CarouselItem className="p-3">
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
                        {carouselIndex === 1 &&
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
            <CarouselItem className="p-3">
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
                        {carouselIndex === 2 &&
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
            <CarouselItem className="p-3">
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
                    <FormLabel>請輸入郵遞區號</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-4" type="submit">
                Search
              </Button>
            </CarouselItem>
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
