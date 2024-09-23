import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/utils/tools";

interface IProps {
  className?: string;
}

const Loading = ({ className }: IProps) => {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        className,
      )}
    >
      <Spinner className="opacity-50" />
    </div>
  );
};

export default Loading;
