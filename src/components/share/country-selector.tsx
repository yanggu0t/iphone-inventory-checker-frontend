import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLocales } from "@/service/api/apple";
import { cn } from "@/utils/tools";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/stores";
import { Spinner } from "../ui/spinner";
import { Card } from "../ui/card";
import { Typography } from "../ui/typography";

interface IProps {
  className?: string;
  setLocalLangTag: (value: string) => void;
}

const CountrySelector = ({ className, setLocalLangTag }: IProps) => {
  const setLangTag = useStore((state) => state.apple.setLangTag);
  const setIsResetForm = useStore((state) => state.apple.setIsResetForm);
  const { data, isLoading } = useQuery({
    queryKey: ["locales"],
    queryFn: async () => {
      const response = await getLocales();
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const handleLanguageChange = (lang: string) => {
    setLangTag(lang);
    setLocalLangTag(lang);
    setIsResetForm(true);
  };

  return (
    <Card className="grid min-h-[100px] min-w-[400px] place-content-center gap-4 px-4 py-8">
      <Typography variant="inlineCode" className="text-center">
        Please select the country you want to check inventory for.
      </Typography>

      <Select onValueChange={handleLanguageChange}>
        <SelectTrigger className={cn("w-full", className)}>
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        {data ? (
          <SelectContent>
            {data.map(({ id, country, lang_tag }) => {
              // if (lang_tag === "cn") return null;
              return (
                <SelectItem key={id} value={lang_tag || "lang-tag"}>
                  {country}
                </SelectItem>
              );
            })}
          </SelectContent>
        ) : (
          <SelectContent className={isLoading ? "h-[300px] w-full" : ""}>
            <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
              <Spinner className="h-10 w-10 text-primary/50" />
            </div>
          </SelectContent>
        )}
      </Select>
    </Card>
  );
};

export default CountrySelector;
