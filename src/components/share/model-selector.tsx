import { getModels } from "@/service/api/apple";
import { useStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "../ui/spinner";
import { cn } from "@/utils/tools";
import { useEffect } from "react";

interface IProps {
  className?: string;
}

const ModelSelector = ({ className }: IProps) => {
  const langTag = useStore((state) => state.apple.langTag);
  const setLangTag = useStore((state) => state.apple.setLangTag);
  const model = useStore((state) => state.apple.model);
  const setModel = useStore((state) => state.apple.setModel);

  const { data } = useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      setLangTag(null);
      setModel(null);
      const response = await getModels();
      return response.data;
    },
    enabled: !!langTag,
    refetchOnWindowFocus: false,
  });

  const handleModelChange = (id: string) => {
    const currentModel = data?.find((model) => model.id === id) || null;
    setModel(currentModel);
  };

  return (
    <Select
      disabled={!data}
      value={model?.id || ""}
      onValueChange={handleModelChange}
    >
      <SelectTrigger className={cn("w-[280px]", className)}>
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      {data ? (
        <SelectContent>
          {data.map(({ name, id }) => (
            <SelectItem key={id} value={id}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      ) : (
        <SelectContent className="h-[300px]">
          <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
            <Spinner className="h-10 w-10 text-primary/50" />
          </div>
        </SelectContent>
      )}
    </Select>
  );
};

export default ModelSelector;
