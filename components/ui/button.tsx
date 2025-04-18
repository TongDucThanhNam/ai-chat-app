import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-small text-sm font-normal ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]",
                outline:
                    "border border-foreground bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                icon:"ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10"
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 px-3",
                lg: "h-10 px-8",
                icon: "h-10 w-10", // Increased from h-9 w-9
                "icon-sm": "h-9 w-9", // Increased from h-8 w-8
                "icon-lg": "h-11 w-11", // Increased from h-10 w-10
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    },
)
Button.displayName = "Button"

export { Button, buttonVariants }

