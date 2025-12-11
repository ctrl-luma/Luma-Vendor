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
import { useStripeConnect } from "@/contexts/StripeConnectContext";

const tabs = [
  {
    name: "Today",
    href: "/",
    icon: HomeIcon,
    requiresOnboarding: false,
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

export function MobileNav() {
  const pathname = usePathname();
  const { isOnboarded } = useStripeConnect();

  // Filter tabs based on onboarding status
  const visibleTabs = tabs.filter(tab => {
    if (!tab.requiresOnboarding) return true;
    return isOnboarded;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:supports-[backdrop-filter]:bg-gray-950/90 border-t border-gray-200 dark:border-gray-800 shadow-lg md:hidden">
      <div className="flex items-center justify-around h-16 safe-bottom">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "tab-item tap-highlight-transparent flex-1 h-full",
                isActive && "tab-item-active"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}