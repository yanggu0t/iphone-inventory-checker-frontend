import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { US, TW } from "country-flag-icons/react/3x2";

interface IProps {
  className?: string;
}

const LanguageSelector = ({ className }: IProps) => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const languages = [
    { code: "en", title: t("select_lang_en"), icon: US },
    { code: "zh-TW", title: t("select_lang_zh"), icon: TW },
  ];

  return (
    <div className={className}>
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="min-w-36">
          <SelectValue placeholder={t("select_lang_placeholder")} />
        </SelectTrigger>
        <SelectContent>
          {languages.map(({ code, title, icon: Icon }) => (
            <SelectItem key={code} value={code}>
              <div className="flex items-center">
                <Icon className="mr-2 h-4 w-4" />
                {title}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
