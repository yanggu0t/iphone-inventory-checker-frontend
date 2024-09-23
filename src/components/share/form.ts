import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Model } from "@/service/types/apple";

export type CreateFormSchema = (search: {
  validation?: {
    zip?: {
      requiredError?: string;
      pattern?: string;
      invalidFormatError?: string;
    };
  };
}) => z.ZodObject<{
  model: z.ZodType<Model>;
  storage: z.ZodString;
  color: z.ZodString;
  zipCode: z.ZodEffects<z.ZodString>;
}>;

export type SearchFormData = z.infer<ReturnType<CreateFormSchema>>;

export type SearchFormType = UseFormReturn<SearchFormData>;
