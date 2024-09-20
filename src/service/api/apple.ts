import service from "../middleware";
import { ModelsResponse, LocalesResponse } from "../types/apple";

export const getLocales = (): Promise<LocalesResponse> => {
  return service.get("/api/locales");
};

export const getModels = (): Promise<ModelsResponse> => {
  return service.get("/api/models");
};
