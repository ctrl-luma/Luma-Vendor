"use client";

import React, { useState } from "react";
import { Wallet, CreditCard, Calendar, AlertCircle, X } from "lucide-react";
import { MobileHeader } from "@/components/layout/mobile-header";
import { cn } from "@/lib/utils";

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
    <div className="min-h-full">
      <MobileHeader title="Payouts" />

      <main className="pb-20 md:pb-8">
        <div className="container space-y-6">
          {/* Balance Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 text-white shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="relative space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="h-5 w-5 text-primary" />
                  <h2 className="text-sm font-medium text-gray-300">Available Balance</h2>
                </div>
                <p className="text-4xl font-bold">
                  ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Pending</p>
                  <p className="text-lg font-semibold">
                    ${pendingBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Earned Today</p>
                  <p className="text-lg font-semibold">$2,456.78</p>
                </div>
              </div>

              <button
                className="w-full bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/25"
                onClick={() => setShowPayoutModal(true)}
              >
                Cash Out Now
              </button>
            </div>
          </div>

          {/* Payout Options */}
          <div className="card p-6">
            <h3 className="font-medium text-white mb-4">Payout Options</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Instant Payout</p>
                    <p className="text-sm text-gray-400">Arrives in ~30 minutes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">1% fee</p>
                  <p className="text-xs text-gray-500">min $0.50</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Standard Payout</p>
                    <p className="text-sm text-gray-400">Next business day</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">Free</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Accounts */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-white">Bank Accounts</h3>
              <button className="text-sm text-gray-400 hover:text-white transition-colors">
                Manage
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-white">Chase Bank</p>
                    <p className="text-sm text-gray-500">••••4321</p>
                  </div>
                </div>
                <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
                  Default
                </span>
              </div>
            </div>
          </div>

          {/* Payout History */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-medium text-white">Payout History</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {mockPayouts.map((payout) => (
                <div key={payout.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-white">
                        ${payout.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-gray-500">{payout.date}</p>
                    </div>
                    <span className={cn(
                      "text-xs px-3 py-1 rounded-full font-medium capitalize",
                      payout.status === "paid" && "bg-green-500/20 text-green-400",
                      payout.status === "in_transit" && "bg-blue-500/20 text-blue-400",
                      payout.status === "pending" && "bg-yellow-500/20 text-yellow-400",
                      payout.status === "failed" && "bg-red-500/20 text-red-400"
                    )}>
                      {payout.status === "in_transit" ? "In Transit" : payout.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {payout.type === "instant" ? "Instant • " : "Standard • "}
                      {payout.destination}
                    </span>
                    {payout.fee > 0 && (
                      <span className="text-gray-500">
                        Fee: ${payout.fee.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end md:items-center justify-center">
          <div className="bg-gray-900 rounded-t-2xl md:rounded-2xl w-full max-w-lg mx-auto border border-gray-800 animate-in slide-in-from-bottom">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Confirm Payout</h2>
                <button
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => setShowPayoutModal(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-gray-800/50 rounded-xl space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Available Balance</span>
                    <span className="font-medium text-white">
                      ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-400">
                    <span>Instant Payout Fee (1%)</span>
                    <span>-${(availableBalance * 0.01).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 flex justify-between">
                    <span className="font-medium text-gray-300">You&apos;ll Receive</span>
                    <span className="font-semibold text-lg text-white">
                      ${(availableBalance * 0.99).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>Arrives in ~30 minutes to Chase ••••4321</span>
                </div>

                <button
                  className="btn-primary w-full"
                  onClick={() => {
                    setShowPayoutModal(false);
                  }}
                >
                  Confirm Instant Payout
                </button>

                <button
                  className="btn-secondary w-full"
                  onClick={() => setShowPayoutModal(false)}
                >
                  Use Standard Payout (Free, 1-2 days)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
