"use client";

import React, { useState } from "react";
import { Search, Filter, ReceiptIcon } from "lucide-react";
import { MobileHeader } from "@/components/layout/mobile-header";
import { cn } from "@/lib/utils";

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
    <div className="min-h-full">
      <MobileHeader title="Sales" />

      {/* Desktop header */}
      <header className="hidden md:block border-b border-gray-800 bg-gray-950/50">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-2">Sales</h1>
              <p className="text-gray-400 mt-1">View and manage your orders</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary !px-4 !py-2">
                <Search className="h-4 w-4 mr-2" />
                Search
              </button>
              <button className="btn-secondary !px-4 !py-2">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-20 md:pb-8 md:pt-6">
        <div className="container">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === "all"
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              )}
            >
              All Orders
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === "pending"
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              )}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === "completed"
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              )}
            >
              Completed
            </button>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="card p-4 hover:border-gray-700 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-white">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{order.items} items</p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs px-3 py-1 rounded-full font-medium",
                      order.status === "completed" && "bg-green-500/20 text-green-400",
                      order.status === "pending" && "bg-yellow-500/20 text-yellow-400",
                      order.status === "refunded" && "bg-red-500/20 text-red-400"
                    )}>
                      {order.status}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                      <ReceiptIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="card p-12 text-center">
              <ReceiptIcon className="h-12 w-12 text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No orders found</h3>
              <p className="text-gray-500">
                {activeTab === "all"
                  ? "You don't have any orders yet."
                  : `No ${activeTab} orders at the moment.`}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
