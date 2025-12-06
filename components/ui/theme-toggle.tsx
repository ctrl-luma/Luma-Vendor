"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  variant?: "default" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function ThemeToggle({ variant = "default", size = "default", className }: ThemeToggleProps = {}) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const sizeClasses = {
    default: "h-10 w-10",
    sm: "h-8 w-8",
    lg: "h-12 w-12"
  };

  const iconSizeClasses = {
    default: "h-[1.2rem] w-[1.2rem]",
    sm: "h-4 w-4",
    lg: "h-6 w-6"
  };

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "ghost" ? "hover:bg-accent hover:text-accent-foreground" : "bg-accent hover:bg-accent/90",
        sizeClasses[size],
        className
      )}
    >
      <Sun className={cn(iconSizeClasses[size], "rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0")} />
      <Moon className={cn(iconSizeClasses[size], "absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100")} />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}