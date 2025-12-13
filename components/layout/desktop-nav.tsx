"use client";

import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { useStripeConnect } from "@/contexts/StripeConnectContext";
import { UserDropdown } from "./user-dropdown";

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

export function DesktopNav() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { isOnboarded } = useStripeConnect();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter tabs based on onboarding status
  const visibleTabs = tabs.filter((tab) => {
    if (!tab.requiresOnboarding) return true;
    return isOnboarded;
  });

  return (
    <header className="fixed top-0 z-50 w-full hidden md:block">
      {/* Background that fades in */}
      <div
        style={{
          opacity: scrolled ? 1 : 0,
          transition: "opacity 0.5s ease",
          willChange: "opacity",
        }}
        className="absolute inset-0 bg-gray-900 shadow-lg shadow-black/10 pointer-events-none"
      />
      {/* Blur layer */}
      <div
        style={{
          opacity: scrolled ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
        className="absolute inset-0 backdrop-blur-md pointer-events-none"
      />
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-primary hover:text-primary-400 transition-colors">
              Luma
            </Link>
            <div className="flex items-center gap-1">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href;

                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
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
      </nav>
    </header>
  );
}
