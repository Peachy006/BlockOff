import logo from "./blockoff-logo.png";
import { cn } from "@/lib/utils";

export const BlockOffLogo = ({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: { wrap: "gap-1.5", icon: "h-5 w-5", text: "text-base" },
    md: { wrap: "gap-2", icon: "h-7 w-7", text: "text-lg" },
    lg: { wrap: "gap-3", icon: "h-10 w-10", text: "text-3xl" },
  }[size];
  return (
    <div className={cn("inline-flex items-center font-semibold tracking-tight text-foreground", sizes.wrap, className)}>
      <img src={logo} alt="BlockOff Logo" className={cn("rounded-lg", "object-contain", sizes.icon)} />
      <span className={sizes.text}>
        Block<span className="text-accent">Off</span>
      </span>
    </div>
  );
};
