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

const App = () => {
  const navigate = useNavigate();
  const langTag = getLocalStorage(
    LOCAL_STORAGE.APPLE_LANG_TAG,
  ) as unknown as string;
  const model = useStore((state) => state.apple.model);
  const search = useStore((state) => state.apple.config?.search);
  const setModel = useStore((state) => state.apple.setModel);
  const setLangTag = useStore((state) => state.apple.setLangTag);

  const capacities = model ? model.capacities : [];
  const colors = model ? model.colors : [];

  const formSchema = z.object({
    model: z.string({ required_error: "型號為必填項" }),
    capacities: z.string({ required_error: "容量為必填項" }),
    color: z.string({ required_error: "顏色為必填項" }),
    zipCode: z
      .string({
        required_error:
          search?.validation?.zip?.requiredError || "郵遞區號為必填項",
      })
      .refine(
        (value) => {
          if (!value) return false;
          const pattern = search?.validation?.zip?.pattern;
          if (!pattern) return true;
          return new RegExp(pattern).test(value);
        },
        {
          message:
            search?.validation?.zip?.invalidFormatError || "郵遞區號格式無效",
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

  const onSubmit = ({ capacities, color }: z.infer<typeof formSchema>) => {
    const zipCode = form.getValues().zipCode;
    const deviceId = model?.part_numbers.find(
      (item) => item.color === color && item.capacity === capacities,
    )?.part_number;
    navigate({
      to: "/app/models",
      search: {
        params: {
          "parts.0": deviceId,
          location: zipCode,
          cppart: "UNLOCKED/WW",
        },
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

  if (!search) return <div>Loading...</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* <CardHeader></CardHeader> */}
        <CardContent className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <Select
                  disabled={!langTag}
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{search?.zipMessage || "Postal code"}</FormLabel>
                <Input
                  {...field}
                  placeholder={search?.zipMessage || "Please enter postal code"}
                  onChange={(e) => field.onChange(e.target.value)}
                />
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" className="w-[100px]">
            Search
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};

export default App;
