"use client";

import React from "react";
import Link from "next/link";
import { 
  User as UserIcon,
  CreditCard,
  LogOut,
  ChevronDown,
  Moon,
  Sun
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface UserDropdownProps {
  user: User | null;
  logout: () => Promise<void>;
}

export function UserDropdown({ user, logout }: UserDropdownProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!user || !mounted) return null;

  // Get initials
  const getInitials = () => {
    const firstInitial = user.firstName?.[0] || user.email[0];
    const lastInitial = user.lastName?.[0] || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  // Blue gradient for avatar
  const getGradient = () => {
    return 'from-blue-400 to-blue-600';
  };

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 px-3 hover:bg-accent/50">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-white font-medium text-sm",
              getGradient()
            )}>
              {getInitials()}
            </div>
            <div className="hidden lg:flex flex-col items-start">
              {user.firstName && (
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-tight">
                  {user.firstName}
                </span>
              )}
              {user.lastName && (
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-tight">
                  {user.lastName}
                </span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {user.firstName && (
              <p className="text-sm font-medium leading-none">
                {user.firstName}
              </p>
            )}
            {user.lastName && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.lastName}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/billing" className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Plan & Billing</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div 
          className="flex items-center justify-between px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent transition-colors"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <span>Theme</span>
          <div className="relative h-8 w-8 flex items-center justify-center">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}