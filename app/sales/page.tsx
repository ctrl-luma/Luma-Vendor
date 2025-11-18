"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, ReceiptIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  items: number;
  total: number;
  customer: string;
  time: string;
  status: "pending" | "completed" | "refunded";
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    items: 3,
    total: 45.99,
    customer: "Table 5",
    time: "2:34 PM",
    status: "completed"
  },
  {
    id: "ORD-002",
    items: 5,
    total: 89.50,
    customer: "Walk-in",
    time: "2:15 PM",
    status: "pending"
  },
  {
    id: "ORD-003",
    items: 2,
    total: 32.00,
    customer: "Table 12",
    time: "1:45 PM",
    status: "completed"
  }
];

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");

  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 dark:supports-[backdrop-filter]:bg-gray-950/85 border-b border-gray-200 dark:border-gray-800 md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-semibold">Sales</h1>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="pb-20 md:pb-8 md:pt-8">
        <div className="md:max-w-7xl md:mx-auto md:px-4 lg:px-8">
        <div className="p-4">
          <Button
            size="lg"
            className="w-full h-14 text-base"
            onClick={() => {}}
          >
            <Plus className="h-5 w-5 mr-2" />
            New Sale
          </Button>
        </div>

        <div className="px-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("all")}
            >
              All Orders
            </Button>
            <Button
              variant={activeTab === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("pending")}
            >
              Pending
            </Button>
            <Button
              variant={activeTab === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </Button>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="dashboard-card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{order.time}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{order.items} items</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "completed" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {order.status}
                    </span>
                    <Button size="sm" variant="ghost">
                      <ReceiptIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 px-4">
          <div className="dashboard-card p-4">
            <h3 className="font-medium mb-3">Quick Menu</h3>
            <div className="grid grid-cols-3 gap-2">
              {["Coffee", "Sandwich", "Salad", "Burger", "Pizza", "Drinks"].map((item) => (
                <Button
                  key={item}
                  variant="outline"
                  size="sm"
                  className="h-16 flex-col gap-1"
                >
                  <span className="text-xs">{item}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}