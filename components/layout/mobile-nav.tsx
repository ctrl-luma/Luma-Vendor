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
  Download,
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
    requiresOnboarding: false,
  },
  {
    name: "Payouts",
    href: "/payouts",
    icon: Wallet,
    requiresOnboarding: true, // Only Payouts requires onboarding
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    requiresOnboarding: false,
  },
  {
    name: "Connect",
    href: "/connect",
    icon: Link2,
    requiresOnboarding: false,
  },
  {
    name: "Download",
    href: "/download",
    icon: Download,
    requiresOnboarding: false,
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const { isOnboarded } = useStripeConnect();

  // Filter tabs based on onboarding status
  const visibleTabs = tabs.filter((tab) => {
    if (!tab.requiresOnboarding) return true;
    return isOnboarded;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-sm border-t border-gray-800 shadow-lg shadow-black/50 md:hidden">
      <div className="flex items-center justify-around h-16 safe-bottom">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "tap-highlight-transparent flex-1 h-full flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary" : "text-gray-500"
                )}
              />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
