import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-md hover:shadow-[0_0_15px_rgba(80,160,255,0.6)] backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-primary/90 text-primary-foreground hover:bg-primary hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-primary/50",
        destructive:
          "bg-destructive/90 text-destructive-foreground hover:bg-destructive hover:translate-y-[-2px] hover:shadow-[0_0_15px_rgba(255,60,60,0.6)]",
        outline:
          "border border-input/50 bg-background/30 backdrop-blur-md hover:bg-accent/20 hover:text-accent-foreground hover:border-accent hover:shadow-[0_0_10px_rgba(140,100,255,0.5)]",
        secondary:
          "bg-secondary/90 text-secondary-foreground hover:bg-secondary hover:translate-y-[-2px] hover:shadow-[0_0_15px_rgba(140,100,255,0.6)]",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 hover:text-shadow-sm",
        gradient: "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:brightness-110 hover:translate-y-[-2px] hover:shadow-[0_0_20px_rgba(80,160,255,0.7)] focus:outline-none focus:ring-2 focus:ring-primary/50 active:ring-2 active:ring-primary/70"
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
        xl: "h-14 rounded-md px-10 text-lg"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
