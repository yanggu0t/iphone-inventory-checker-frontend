import service from "../middleware";
import {
  ModelsResponse,
  LocalesResponse,
  ConfigResponse,
  currentModelStockRequest,
  modelStockResponse,
  LookupAddressRequest,
  LookupAddressResponse,
} from "../types/apple";

export const getLocales = (): Promise<LocalesResponse> => {
  return service.get("/api/locales");
};

export const getModels = (): Promise<ModelsResponse> => {
  return service.get("/api/models");
};

export const getConfig = (): Promise<ConfigResponse> => {
  return service.get("/api/config");
};

export const getModelsStock = (
  request: currentModelStockRequest,
): Promise<modelStockResponse> => {
  return service.get(`/apple${request.path}`, {
    params: request.params,
  });
};

export const getLookupAddress = (
  params?: LookupAddressRequest,
): Promise<LookupAddressResponse> => {
  return service.get("/api/address-lookup", { params });
};
