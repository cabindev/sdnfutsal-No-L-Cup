// components/ui/badge.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/app/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // เพิ่มสี futsal ตามที่กำหนดใน root variables
        "futsal-navy": "border-transparent bg-futsal-navy text-white hover:bg-futsal-navy/90",
        "futsal-blue": "border-transparent bg-futsal-blue text-white hover:bg-futsal-blue/90",
        "futsal-orange": "border-transparent bg-futsal-orange text-white hover:bg-futsal-orange/90",
        "futsal-gold": "border-transparent bg-futsal-gold text-futsal-navy hover:bg-futsal-gold/90",
        "futsal-green": "border-transparent bg-futsal-green text-white hover:bg-futsal-green/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }