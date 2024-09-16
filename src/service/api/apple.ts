import service from "../middleware";
import { QueryClient } from "@tanstack/react-query";

export const regionsQueryKey = ["regions"];
export const modelsQueryKey = ["models"];

const getRegions = (): Promise<any> => {
  return service.get("/api/regions");
};

const getModels = (): Promise<any> => {
  return service.get("/api/models");
};

export const fetchRegions = async (queryClient: QueryClient) => {
  return await queryClient.fetchQuery({
    queryKey: regionsQueryKey,
    queryFn: getRegions,
  });
};

export const fetchModels = async (queryClient: QueryClient) => {
  return await queryClient.fetchQuery({
    queryKey: modelsQueryKey,
    queryFn: getModels,
  });
};
