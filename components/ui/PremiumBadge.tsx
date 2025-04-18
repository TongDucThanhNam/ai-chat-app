import React from "react";
import { cn } from "@/lib/utils";

type PremiumBadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "small";
};

export const PremiumBadge = React.forwardRef<
    HTMLSpanElement,
    PremiumBadgeProps
>(({ children, className, variant = "default", ...props }, ref) => {
    return (
        <span
            ref={ref}
            className={cn(
                "group relative inline-flex animate-rainbow cursor-default items-center justify-center rounded-full border-0 bg-[length:200%] font-medium text-primary-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent]",
                // Size variants
                variant === "default"
                    ? "px-1 py-0.5 text-xs"
                    : "px-1 py-0.5 text-[10px]",
                // before styles - glow effect
                "before:absolute before:bottom-[-40%] before:left-1/2 before:z-0 before:h-1/5 before:w-4/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:[filter:blur(calc(0.5*1rem))]",
                // light mode colors
                "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
                // dark mode colors
                "dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
                className,
            )}
            {...props}
        >
      {children || "Premium"}
    </span>
    );
});

PremiumBadge.displayName = "PremiumBadge";
