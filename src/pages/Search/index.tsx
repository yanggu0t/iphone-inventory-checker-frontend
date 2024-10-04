import Loading from "@/components/share/loading";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Typography } from "@/components/ui/typography";
import { getModelsStock } from "@/service/api/apple";
import { FormSchema } from "@/service/types/apple";
import { useStore } from "@/stores";
import { formatModelStock, getIsEnable } from "@/utils/tools";
import { useQuery } from "@tanstack/react-query";

const Search = () => {
  const formValues = useStore((state) => state.apple.formData) ?? {};
  const config = useStore((state) => state.apple.config);
  const search = config?.search;
  const { model, storage, color, zipCode } = formValues as FormSchema;
  const currentModel = model?.part_numbers.find(
    (item) => item.color === color && item.capacity === storage,
  );

  const isEnable = getIsEnable(formValues);

  const { data, isLoading } = useQuery({
    queryKey: ["search", formValues],
    queryFn: async () => {
      if (!search) return null;
      const response = await getModelsStock({
        path: search.pickupURL,
        params: {
          "mts.0": "compact",
          "parts.0": currentModel?.part_number || "",
          location: zipCode,
          cppart: "UNLOCKED/WW",
        },
      });
      return response.data ?? null;
    },
    enabled: isEnable,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  const formatModel =
    data && "content" in data ? formatModelStock(data.content)[0] : null;

  const { pickup, delivery, productName } = formatModel ?? {};
  const { image_url } = currentModel ?? {};

  if (!model || !storage || !color || !zipCode)
    return (
      <div className="flex h-1/2 w-full items-center justify-center">
        <Typography variant="h4">
          Please complete the options on the left
        </Typography>
      </div>
    );

  if (!formatModel) return <Loading />;

  return (
    <div className="flex h-[calc(100%-52px)] flex-col overflow-auto p-3">
      <div className="flex items-center gap-2">
        <img
          className="h-[90px] w-[85.2px] rounded-lg"
          src={image_url}
          alt={productName}
        />
        <Typography variant="h5">{productName}</Typography>
      </div>
      <RadioGroup>
        {pickup?.stores.map((item) => {
          return (
            <div className="flex items-center space-x-1 space-y-0 rounded-lg border">
              <RadioGroupItem
                className="sr-only"
                disabled={true}
                value={item.storeNumber}
                id={item.storeNumber}
              />
              <Label className="flex-grow p-4" htmlFor={item.storeNumber}>
                {item.storeName}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default Search;
