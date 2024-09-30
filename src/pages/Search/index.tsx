import { Typography } from "@/components/ui/typography";
import { getModelsStock } from "@/service/api/apple";
import { FormSchema } from "@/service/types/apple";
import { useStore } from "@/stores";
import { formatModelStock } from "@/utils/tools";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const Search = () => {
  const formValues = useStore((state) => state.apple.formData) ?? {};
  const config = useStore((state) => state.apple.config);
  const search = config?.search;
  const { model, storage, color, zipCode } = formValues as FormSchema;
  const currentModel = model?.part_numbers.find(
    (item) => item.color === color && item.capacity === storage,
  );

  const { data, isLoading } = useQuery({
    queryKey: ["search", formValues],
    queryFn: async () => {
      if (!search) return null;
      const response = await getModelsStock({
        path: search.pickupURL,
        params: {
          "parts.0": currentModel?.part_number || "",
          location: zipCode,
          cppart: "UNLOCKED/WW",
        },
      });
      return response.data ?? null;
    },
    enabled: Object.keys(formValues).length > 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  const formatModel =
    data && "content" in data ? formatModelStock(data.content) : null;

  if (!model || !storage || !color || !zipCode)
    return (
      <div className="flex h-1/2 w-full items-center justify-center">
        <Typography variant="h4">
          Please complete the options on the left
        </Typography>
      </div>
    );

  return <div>Search</div>;
};

export default Search;
