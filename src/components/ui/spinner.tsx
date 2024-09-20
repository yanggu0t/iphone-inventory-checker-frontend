import { cn } from "@/utils/tools";
import { HTMLSVGElement } from "country-flag-icons/react/3x2";
import { Loader2 } from "lucide-react";

interface IProps extends React.HTMLAttributes<HTMLSVGElement> {
  className?: string;
}

const Spinner = ({ className }: IProps) => {
  return <Loader2 className={cn("h-16 w-16 animate-spin", className)} />;
};

export { Spinner };
