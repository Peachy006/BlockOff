import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const BlockOffLogo = ({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: { wrap: "gap-1.5", icon: "h-4 w-4", text: "text-base" },
    md: { wrap: "gap-2", icon: "h-5 w-5", text: "text-lg" },
    lg: { wrap: "gap-3", icon: "h-8 w-8", text: "text-3xl" },
  }[size];
  return (
    <div className={cn("inline-flex items-center font-semibold tracking-tight text-foreground", sizes.wrap, className)}>
      <span className="inline-flex items-center justify-center rounded-xl bg-accent text-accent-foreground p-1.5">
        <ShieldCheck className={sizes.icon} strokeWidth={2.5} />
      </span>
      <span className={sizes.text}>
        Block<span className="text-accent">Off</span>
      </span>
    </div>
  );
};
