import Loading from "@/components/share/loading";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import { getModelsStock } from "@/service/api/apple";
import { FormSchema } from "@/service/types/apple";
import { useStore } from "@/stores";
import { formatModelStock, getIsEnable } from "@/utils/tools";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useEffect, useMemo, useState } from "react";

const Search = () => {
  const formValues = useStore((state) => state.apple.formData) ?? {};
  const config = useStore((state) => state.apple.config);
  const search = config?.search;
  const { model, storage, color, zipCode } = formValues as FormSchema;
  const currentModel = model?.part_numbers.find(
    (item) => item.color === color && item.capacity === storage,
  );
  const [isLive, setIsLive] = useState(false);

  const isEnable = getIsEnable(formValues);

  const { data, isLoading, isFetching } = useQuery({
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
    refetchInterval: isLive ? 1500 : false,
  });

  const formatStock = data?.content
    ? formatModelStock(data.content)[0]
    : undefined;

  if (!model || !storage || !color || !zipCode)
    return (
      <div className="flex h-1/2 w-full items-center justify-center">
        <Typography variant="h4">
          Please complete the options on the left
        </Typography>
      </div>
    );

  if (!formatStock) return <Loading />;

  const { productName, pickup } = formatStock;
  const { image_url } = currentModel ?? {};

  return (
    <div className="relative flex h-[calc(100%-52px)] flex-col gap-3 overflow-auto p-3">
      {(isLoading || isFetching) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
          <Loading className="text-white" />
        </div>
      )}
      <div className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm">
        <img
          className="mx-auto h-[90px] w-[85.2px] rounded-lg"
          src={image_url}
          alt={productName}
        />
        <Typography className="mx-auto" variant="h5">
          {productName}
        </Typography>
      </div>
      <div className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm">
        <div className="space-y-0.5">
          <Typography variant="h6">Live Search</Typography>
        </div>
        <Switch checked={isLive} onCheckedChange={setIsLive} />
      </div>
      <div className="flex flex-col">
        {pickup.map(
          ({ isAvailable, storeName, pickupMsg, pickupType }, idx) => (
            <Fragment key={idx}>
              <Typography className="rounded-none" variant="inlineCode">
                <span
                  className={isAvailable ? "text-green-600" : "text-red-600"}
                >
                  {isAvailable ? "[ In Stock ] " : "[ Out of Stock ] "}
                </span>
                <span>{` ${storeName} `}</span>
                <span>{pickupMsg}</span>
                <span>{` (${pickupType})`}</span>
              </Typography>
            </Fragment>
          ),
        )}
      </div>
    </div>
  );
};

export default Search;
