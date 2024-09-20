import { useTheme } from "@/components/provider/theme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun, Monitor } from "lucide-react";

interface IProps {
  className?: string;
}

const ThemeSelector = ({ className }: IProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={className}>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="min-w-36">
          <SelectValue placeholder="選擇主題" />
        </SelectTrigger>
        <SelectContent>
          {themes.map(({ code, title, icon: Icon }) => (
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

export default ThemeSelector;

const themes = [
  { code: "light", title: "Light", icon: Sun },
  { code: "dark", title: "Dark", icon: Moon },
  { code: "system", title: "System", icon: Monitor },
];
