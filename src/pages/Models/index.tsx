import Loading from "@/components/share/loading";
import { getModelsStock } from "@/service/api/apple";
import { currentModelStockParams } from "@/service/types/apple";
import { useStore } from "@/stores";
import { formatModelStock } from "@/utils/tools";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import { useState } from "react";
import Result from "@/components/share/result";

const Models = () => {
  const params = useLocation().search as currentModelStockParams;
  const config = useStore((state) => state.apple.config);
  const search = config?.search;
  const [isLive, setIsLive] = useState(false);

  const { data } = useQuery({
    queryKey: ["stock"],
    queryFn: async () => {
      if (!search) return null;
      const response = await getModelsStock({
        path: search.pickupURL,
        params,
      });
      return response.data ?? null;
    },
    gcTime: 0,
    enabled: !!search,
    refetchInterval: isLive && 2000,
    refetchOnWindowFocus: false,
  });

  const formatModel =
    data && "content" in data ? formatModelStock(data.content) : null;

  if (!formatModel) return <Loading />;

  return (
    <div className="p-4">
      <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <Typography variant="h5">Live Search</Typography>
        </div>
        <Switch checked={isLive} onCheckedChange={setIsLive} />
      </div>
      <Result stock={formatModel} />
      {/* <h1>可用型號</h1>
      {formatModel.map((model) => (
        <div key={model.partNumber}>
          <h2>{model.productName}</h2>
          <ul>
            {model.stores.map((store) => (
              <li key={store.storeNumber}>
                {store.storeName} ({store.city}):
                {store.available ? "可用" : "不可用"}
                <p>{store.pickupSearchQuote}</p>
              </li>
            ))}
          </ul>
        </div>
      ))} */}
    </div>
  );
};

export default Models;
