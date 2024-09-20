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

const CapacitiesSelector = ({ className }: IProps) => {
  const model = useStore((state) => state.apple.model);
  const setCapacities = useStore((state) => state.apple.setCapacities);
  const capacities = model ? model.capacities : [];

  const handleCapacitiesChange = (capacities: string) => {
    setCapacities(capacities);
  };

  return (
    <Select disabled={!model} onValueChange={handleCapacitiesChange}>
      <SelectTrigger className={cn("w-[280px]", className)}>
        <SelectValue placeholder="Select a capacity" />
      </SelectTrigger>
      <SelectContent>
        {capacities.map((capacity) => (
          <SelectItem key={capacity} value={capacity}>
            {capacity}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CapacitiesSelector;
