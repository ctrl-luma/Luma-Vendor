"use client";

import React from "react";
import { 
  User, 
  Store, 
  Package, 
  Users as UsersIcon, 
  Calendar, 
  CreditCard,
  Smartphone,
  Link2,
  Bell,
  HelpCircle,
  Settings,
  ChevronRight,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  description?: string;
  href: string;
  badge?: string;
}

const menuSections = [
  {
    title: "Business",
    items: [
      { icon: Store, label: "Business Profile", description: "Name, hours, contact", href: "/more/profile" },
      { icon: Package, label: "Menu/Inventory", description: "Products & pricing", href: "/more/inventory" },
      { icon: UsersIcon, label: "Team Management", description: "Staff & permissions", href: "/more/team", badge: "3" },
      { icon: Calendar, label: "Event Settings", description: "Templates & rules", href: "/more/events" }
    ] as MenuItem[]
  },
  {
    title: "Payments",
    items: [
      { icon: CreditCard, label: "Payment Settings", description: "Stripe & tax settings", href: "/more/payments" },
      { icon: Smartphone, label: "Hardware", description: "Readers & printers", href: "/more/hardware" }
    ] as MenuItem[]
  },
  {
    title: "System",
    items: [
      { icon: Link2, label: "Integrations", description: "QuickBooks, Xero", href: "/more/integrations" },
      { icon: Bell, label: "Notifications", description: "Alerts & preferences", href: "/more/notifications" },
      { icon: HelpCircle, label: "Support", description: "Help & contact", href: "/more/support" },
      { icon: Settings, label: "Account", description: "Security & billing", href: "/more/account" }
    ] as MenuItem[]
  }
];

export default function MorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 dark:supports-[backdrop-filter]:bg-gray-950/85 border-b border-gray-200 dark:border-gray-800 md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-semibold">More</h1>
        </div>
      </header>

      <main className="pb-20 md:pb-8 md:pt-8">
        <div className="md:max-w-7xl md:mx-auto md:px-4 lg:px-8">
        <div className="px-4 py-4">
          <div className="dashboard-card p-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">Acme Food Truck</h2>
                <p className="text-sm text-muted-foreground">Premium Plan</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {menuSections.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">
                {section.title}
              </h3>
              <div className="dashboard-card divide-y">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    className="w-full p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors"
                    onClick={() => {}}
                  >
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{item.label}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8 mb-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {}}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>Luma Dashboard v1.0.0</p>
            <p className="mt-1">© 2024 Luma. All rights reserved.</p>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}