"use client";

import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  customerName: string;
  time: string;
  status: "completed" | "pending" | "failed";
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    amount: 45.99,
    customerName: "John D.",
    time: "2 min ago",
    status: "completed",
  },
  {
    id: "2",
    amount: 32.50,
    customerName: "Sarah M.",
    time: "5 min ago",
    status: "completed",
  },
  {
    id: "3",
    amount: 128.00,
    customerName: "Mike R.",
    time: "12 min ago",
    status: "pending",
  },
  {
    id: "4",
    amount: 67.25,
    customerName: "Emily K.",
    time: "18 min ago",
    status: "completed",
  },
  {
    id: "5",
    amount: 89.99,
    customerName: "David L.",
    time: "25 min ago",
    status: "failed",
  },
];

export function RecentActivity() {
  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h3 className="font-medium text-white">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-800">
        {mockTransactions.map((transaction) => (
          <div key={transaction.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center",
                transaction.status === "completed" && "bg-green-500/20",
                transaction.status === "pending" && "bg-yellow-500/20",
                transaction.status === "failed" && "bg-red-500/20"
              )}>
                {transaction.status === "completed" && (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                )}
                {transaction.status === "pending" && (
                  <Clock className="h-4 w-4 text-yellow-400" />
                )}
                {transaction.status === "failed" && (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm text-white">{transaction.customerName}</p>
                <p className="text-xs text-gray-500">{transaction.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">
                ${transaction.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className={cn(
                "text-xs capitalize",
                transaction.status === "completed" && "text-green-400",
                transaction.status === "pending" && "text-yellow-400",
                transaction.status === "failed" && "text-red-400"
              )}>
                {transaction.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
