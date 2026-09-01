import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-md border border-border bg-card px-3 text-sm outline-none ring-ring placeholder:text-muted-foreground focus-visible:ring-2",
        className,
      )}
      {...props}
    />
  );
}
