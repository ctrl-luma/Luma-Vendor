"use client";

import React from "react";
import Link from "next/link";
import {
  User as UserIcon,
  CreditCard,
  LogOut,
  ChevronDown
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

interface UserDropdownProps {
  user: User | null;
  logout: () => Promise<void>;
}

export function UserDropdown({ user, logout }: UserDropdownProps) {
  if (!user) return null;

  // Get initials
  const getInitials = () => {
    const firstInitial = user.firstName?.[0] || user.email[0];
    const lastInitial = user.lastName?.[0] || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 px-3 hover:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-700 text-white font-medium text-sm">
              {getInitials()}
            </div>
            <div className="hidden lg:flex flex-col items-start">
              {user.firstName && (
                <span className="text-sm font-medium text-gray-300 leading-tight">
                  {user.firstName}
                </span>
              )}
              {user.lastName && (
                <span className="text-sm font-medium text-gray-500 leading-tight">
                  {user.lastName}
                </span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {user.firstName && (
              <p className="text-sm font-medium leading-none text-white">
                {user.firstName}
              </p>
            )}
            {user.lastName && (
              <p className="text-xs leading-none text-gray-500">
                {user.lastName}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="text-gray-300 focus:bg-gray-800 focus:text-white">
            <Link href="/profile" className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="text-gray-300 focus:bg-gray-800 focus:text-white">
            <Link href="/billing" className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Plan & Billing</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuItem onClick={logout} className="text-red-400 focus:bg-gray-800 focus:text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
