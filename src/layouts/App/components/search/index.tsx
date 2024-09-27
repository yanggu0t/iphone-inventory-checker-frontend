import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { getModels } from "@/service/api/apple";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "@tanstack/react-router";
import { getLocalStorage } from "@/utils/tools";
import { LOCAL_STORAGE } from "@/utils/enums";
import { Input } from "@/components/ui/input";
import { Config } from "@/service/types/apple";
import Loading from "@/components/share/loading";
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
  CarouselNavigation,
} from "@/components/core/carousel";

interface SearchFormProps {
  config: Config;
}

const SearchForm: React.FC<SearchFormProps> = ({ config }) => {
  const navigate = useNavigate();
  const { search } = config;
  const langTag = getLocalStorage(LOCAL_STORAGE.APPLE_LANG_TAG) as string;
  const model = useStore((state) => state.apple.model);
  const setModel = useStore((state) => state.apple.setModel);
  const setLangTag = useStore((state) => state.apple.setLangTag);
  const formRef = useRef<HTMLFormElement>(null);

  const capacities = model ? model.capacities : [];
  const colors = model ? model.colors : [];

  const formSchema = z.object({
    model: z.string({ required_error: "Model is required" }),
    capacities: z.string({ required_error: "Capacity is required" }),
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
      zipCode: undefined,
      model: undefined,
      capacities: undefined,
      color: undefined,
    },
  });

  const onSubmit = ({
    capacities,
    color,
    zipCode,
  }: z.infer<typeof formSchema>) => {
    const deviceId = model?.part_numbers.find(
      (item) => item.color === color && item.capacity === capacities,
    )?.part_number;
    navigate({
      to: "/app/models",
      search: {
        "parts.0": deviceId,
        location: zipCode,
        cppart: "UNLOCKED/WW",
      },
    });
  };

  const { data: modelData } = useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      setLangTag(null);
      setModel(null);
      const response = await getModels();
      return response.data;
    },
    enabled: !!langTag,
    refetchOnWindowFocus: false,
  });

  const handleModelChange = (id: string) => {
    form.setValue("model", id);
    const currentModel = modelData?.find((model) => model.id === id) || null;
    setModel(currentModel);
    form.trigger("model");
  };

  const handleCapacitiesChange = (capacities: string) => {
    form.setValue("capacities", capacities);
    form.trigger("capacities");
  };

  const handleColorChange = (color: string) => {
    form.setValue("color", color);
    form.trigger("color");
  };

  if (!search) return <Loading />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center">
          <Carousel className="h-full">
            <CarouselContent className="h-full">
              <CarouselItem>
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      {/* Your Select component for model */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CarouselItem>
              <CarouselItem>
                <FormField
                  control={form.control}
                  name="capacities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacities</FormLabel>
                      {/* Your Select component for capacities */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CarouselItem>
              <CarouselItem>
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      {/* Your Select component for color */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselNavigation
              className="absolute bottom-0 left-auto right-0 top-auto h-full w-auto flex-col justify-between py-2"
              classNameButton="bg-zinc-800 *:stroke-zinc-50 dark:bg-zinc-200 dark:*:stroke-zinc-800"
              alwaysShow
            />
            {/* <CarouselIndicator className="right-8" /> */}
          </Carousel>
        </div>
      </form>
    </Form>
  );
};

export default SearchForm;
