import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/stores";
import { cn } from "@/utils/tools";

interface IProps {
  className?: string;
}

const ColorSelector = ({ className }: IProps) => {
  const model = useStore((state) => state.apple.model);
  const setColor = useStore((state) => state.apple.setColor);
  const colors = model ? model.colors : [];

  const handleColorChange = (color: string) => {
    setColor(color);
  };

  return (
    <Select disabled={!model} onValueChange={handleColorChange}>
      <SelectTrigger className={cn("w-[280px]", className)}>
        <SelectValue placeholder="Select a color" />
      </SelectTrigger>
      <SelectContent>
        {colors.map(({ code, name }) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ColorSelector;
