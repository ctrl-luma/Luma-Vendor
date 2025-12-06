"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserDropdown } from "./user-dropdown";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  title: string;
  className?: string;
}

export function MobileHeader({ title, className }: MobileHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className={cn(
      "sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 dark:supports-[backdrop-filter]:bg-gray-950/85 border-b border-gray-200 dark:border-gray-800 md:hidden",
      className
    )}>
      <div className="flex items-center justify-between px-4 h-14">
        <h1 className="text-xl font-semibold">{title}</h1>
        <UserDropdown user={user} logout={logout} />
      </div>
    </header>
  );
}