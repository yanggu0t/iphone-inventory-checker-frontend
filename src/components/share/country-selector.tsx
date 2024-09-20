import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLocales } from "@/service/api/apple";
import { LOCAL_STORAGE } from "@/utils/enums";
import { cn, setLocalStorage } from "@/utils/tools";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useStore } from "@/stores";
import { Spinner } from "../ui/spinner";

interface IProps {
  className?: string;
}

const CountrySelector = ({ className }: IProps) => {
  const setLangTag = useStore((state) => state.apple.setLangTag);
  const { data, isLoading } = useQuery({
    queryKey: ["locales"],
    queryFn: async () => {
      const response = await getLocales();
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const handleLanguageChange = (lang: string) => {
    setLocalStorage(LOCAL_STORAGE.APPLE_LANG_TAG, lang);
    setLangTag(lang);
  };
  return (
    <Select onValueChange={handleLanguageChange}>
      <SelectTrigger className={cn("w-[280px]", className)}>
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      {data ? (
        <SelectContent>
          {data.map(({ id, country, lang_tag }) => (
            <SelectItem key={id} value={lang_tag || "lang-tag"}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      ) : (
        <SelectContent className={isLoading ? "h-[300px] w-full" : ""}>
          <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
            <Spinner className="h-10 w-10 text-primary/50" />
          </div>
        </SelectContent>
      )}
    </Select>
  );
};

export default CountrySelector;
