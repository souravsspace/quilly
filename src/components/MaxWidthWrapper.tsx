import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function MaxWidthWrapper({ children, className }: Props) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-2.5 md:px-20", className)}>
      {children}
    </div>
  );
}
