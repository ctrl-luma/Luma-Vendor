"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ShoppingCart,
  Wallet,
  BarChart3,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useStripeConnect } from "@/contexts/StripeConnectContext";
import { UserDropdown } from "./user-dropdown";

const tabs = [
  {
    name: "Today",
    href: "/",
    icon: HomeIcon,
    requiresOnboarding: true,
  },
  {
    name: "Sales",
    href: "/sales",
    icon: ShoppingCart,
    requiresOnboarding: true,
  },
  {
    name: "Payouts",
    href: "/payouts",
    icon: Wallet,
    requiresOnboarding: true,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    requiresOnboarding: true,
  },
  {
    name: "Connect",
    href: "/connect",
    icon: Link2,
    requiresOnboarding: false,
  },
];

export function DesktopNav() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { isOnboarded, isLoading: connectLoading } = useStripeConnect();

  // Filter tabs based on onboarding status
  const visibleTabs = tabs.filter(tab => {
    // Always show tabs that don't require onboarding
    if (!tab.requiresOnboarding) return true;
    // Only show tabs requiring onboarding if user is onboarded
    return isOnboarded;
  });

  return (
    <nav className="hidden md:block bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-primary">Luma</h1>
            <div className="flex items-center gap-1">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href;

                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <UserDropdown user={user} logout={logout} />
          </div>
        </div>
      </div>
    </nav>
  );
}