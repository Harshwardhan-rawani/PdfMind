
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div 
      className={cn("inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent", className)} 
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
