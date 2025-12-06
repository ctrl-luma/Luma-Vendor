"use client";

import React, { useState } from "react";
import { Wallet, CreditCard, Calendar, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PayoutRecord {
  id: string;
  amount: number;
  fee: number;
  net: number;
  date: string;
  status: "paid" | "in_transit" | "pending" | "failed";
  type: "instant" | "standard";
  destination: string;
}

const mockPayouts: PayoutRecord[] = [
  {
    id: "po_1234",
    amount: 500.00,
    fee: 5.00,
    net: 495.00,
    date: "Today, 2:30 PM",
    status: "paid",
    type: "instant",
    destination: "Chase ••••4321"
  },
  {
    id: "po_1235",
    amount: 1250.00,
    fee: 0,
    net: 1250.00,
    date: "Yesterday, 5:45 PM",
    status: "paid",
    type: "standard",
    destination: "Chase ••••4321"
  },
  {
    id: "po_1236",
    amount: 325.50,
    fee: 3.26,
    net: 322.24,
    date: "Dec 15, 3:20 PM",
    status: "in_transit",
    type: "instant",
    destination: "Chase ••••4321"
  }
];

export default function PayoutsPage() {
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const availableBalance = 2456.78;
  const pendingBalance = 543.21;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 dark:supports-[backdrop-filter]:bg-gray-950/85 border-b border-gray-200 dark:border-gray-800 md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-semibold">Payouts</h1>
        </div>
      </header>

      <main className="pb-20 md:pb-8 md:pt-8">
        <div className="md:max-w-7xl md:mx-auto md:px-4 lg:px-8">
        <div className="px-4 py-6">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 p-6 text-white">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="h-5 w-5" />
                  <h2 className="text-sm font-medium text-white/90">Available Balance</h2>
                </div>
                <p className="text-4xl font-bold">
                  ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/80">Pending</p>
                  <p className="text-lg font-semibold">
                    ${pendingBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/80">Total Earned Today</p>
                  <p className="text-lg font-semibold">$2,456.78</p>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-white text-blue-600 hover:bg-white/90 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400 h-12 text-base font-semibold"
                onClick={() => setShowPayoutModal(true)}
              >
                Cash Out Now
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-4">
          <div className="dashboard-card p-4">
            <h3 className="font-medium mb-3">Payout Options</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Instant Payout</p>
                    <p className="text-sm text-muted-foreground">Arrives in ~30 minutes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">1% fee</p>
                  <p className="text-xs text-muted-foreground">min $0.50</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Standard Payout</p>
                    <p className="text-sm text-muted-foreground">Next business day</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Free</p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Bank Accounts</h3>
              <Button size="sm" variant="ghost">
                Manage
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Chase Bank</p>
                    <p className="text-sm text-muted-foreground">••••4321</p>
                  </div>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Default</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="p-4 border-b">
              <h3 className="font-medium">Payout History</h3>
            </div>
            <div className="divide-y">
              {mockPayouts.map((payout) => (
                <div key={payout.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">
                        ${payout.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-muted-foreground">{payout.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      payout.status === "paid"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : payout.status === "in_transit"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : payout.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {payout.status === "in_transit" ? "In Transit" : payout.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {payout.type === "instant" ? "Instant • " : "Standard • "}
                      {payout.destination}
                    </span>
                    {payout.fee > 0 && (
                      <span className="text-muted-foreground">
                        Fee: ${payout.fee.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </main>

      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="bg-background rounded-t-2xl w-full max-w-lg mx-auto animate-in slide-in-from-bottom">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Confirm Payout</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPayoutModal(false)}
                >
                  Cancel
                </Button>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Available Balance</span>
                    <span className="font-medium">
                      ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Instant Payout Fee (1%)</span>
                    <span>-${(availableBalance * 0.01).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-medium">You&apos;ll Receive</span>
                    <span className="font-semibold text-lg">
                      ${(availableBalance * 0.99).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>Arrives in ~30 minutes to Chase ••••4321</span>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setShowPayoutModal(false);
                  }}
                >
                  Confirm Instant Payout
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowPayoutModal(false)}
                >
                  Use Standard Payout (Free, 1-2 days)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}