import {
  CapacitiesSelector,
  ColorSelector,
  CountrySelector,
  ModelSelector,
} from "@/components/share";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useStore } from "@/stores";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getLocales, getModels } from "@/service/api/apple";
import { setLocalStorage } from "@/utils/tools";
import { LOCAL_STORAGE } from "@/utils/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  country: z.string({ required_error: "Country is required" }),
  model: z.string({ required_error: "Model is required" }),
  capacities: z.string({ required_error: "Capacities are required" }),
  color: z.string({ required_error: "Color is required" }),
});

const App = () => {
  const model = useStore((state) => state.apple.model);
  const langTag = useStore((state) => state.apple.langTag);
  const setModel = useStore((state) => state.apple.setModel);
  const setLangTag = useStore((state) => state.apple.setLangTag);

  const capacities = model ? model.capacities : [];
  const colors = model ? model.colors : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: undefined,
      model: undefined,
      capacities: undefined,
      color: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const { data: countryData, isLoading: isCountryLoading } = useQuery({
    queryKey: ["locales"],
    queryFn: async () => {
      const response = await getLocales();
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const handleCountryChange = (value: string) => {
    // 更新表單值
    form.setValue("country", value);
    form.setValue("model", "");

    // 執行原有的 handleLanguageChange 邏輯
    setLocalStorage(LOCAL_STORAGE.APPLE_LANG_TAG, value);
    setLangTag(value);

    // 如果需要觸發表單驗證，可以添加以下行
    form.trigger("country");
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

  return (
    <Card className="h-[550px] w-[400px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>iPhone stock checker</CardTitle>
            <CardDescription>
              A tool to search and find your desired iPhone model
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleCountryChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    {countryData ? (
                      <SelectContent>
                        {countryData.map(({ id, country, lang_tag }) => (
                          <SelectItem key={id} value={lang_tag || "lang-tag"}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    ) : (
                      <SelectContent
                        className={isCountryLoading ? "h-[300px] w-full" : ""}
                      >
                        <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                          <Spinner className="h-10 w-10 text-primary/50" />
                        </div>
                      </SelectContent>
                    )}
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    disabled={!form.getValues().country}
                    value={field.value}
                    onValueChange={handleModelChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    {modelData ? (
                      <SelectContent>
                        {modelData.map(({ name, id }) => (
                          <SelectItem key={id} value={id}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    ) : (
                      <SelectContent className="h-[300px]">
                        <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                          <Spinner className="h-10 w-10 text-primary/50" />
                        </div>
                      </SelectContent>
                    )}
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="capacities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacities</FormLabel>
                  <Select
                    disabled={!form.getValues().model}
                    value={field.value}
                    onValueChange={handleCapacitiesChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a capacities" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {capacities.map((capacity) => (
                        <SelectItem key={capacity} value={capacity}>
                          {capacity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={!form.getValues().model}
                    value={field.value}
                    onValueChange={handleColorChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map(({ code, name }) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            ></FormField>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Search
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default App;
