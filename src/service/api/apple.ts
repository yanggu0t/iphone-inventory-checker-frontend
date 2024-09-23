import { getLocalStorage } from "@/utils/tools";
import service from "../middleware";
import {
  ModelsResponse,
  LocalesResponse,
  ConfigResponse,
} from "../types/apple";
import { LOCAL_STORAGE } from "@/utils/enums";

const lang = getLocalStorage(LOCAL_STORAGE.APPLE_LANG_TAG) as string;

export const getLocales = (): Promise<LocalesResponse> => {
  return service.get("/api/locales");
};

export const getModels = (): Promise<ModelsResponse> => {
  return service.get("/api/models");
};

export const getConfig = (): Promise<ConfigResponse> => {
  return service.get("/api/config");
};

// export const getCurrentModelStock = (request): Promise<any> => {
//   return service.get(`${request.path}`, { request.params });
// };

// export const getCurrentModelRecommendations = (
//   request,
// ): Promise<any> => {
//   return service.get(`${request.path}`, {
//     request.params,
//   });
// };
