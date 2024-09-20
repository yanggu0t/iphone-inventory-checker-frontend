import { BackendResponse } from "@/service/api";

export type ModelsResponse = BackendResponse<Models>;
export type Models = Model[];
export type Model = {
  id: string;
  name: string;
  capacities: string[];
  colors: Color[];
  part_numbers: PartNumber[];
};
export type PartNumber = {
  capacity: string;
  color: string;
  part_number: string;
};
export type Color = {
  code: string;
  name: string;
};

export type LocalesResponse = BackendResponse<Locale[]>;
export type Locale = {
  country: string;
  id: string;
  lang_tag: string;
};
