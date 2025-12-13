"use client";

import React from "react";
import { Wallet } from "lucide-react";

export function BalanceBanner() {
  const availableBalance = 1234.56;
  const pendingBalance = 456.78;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 text-white shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Available Balance</h2>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-3xl font-bold">
            ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-white/80">
            +${pendingBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} pending
          </p>
        </div>

        <button className="w-full bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/25">
          Cash Out Now
        </button>
      </div>
    </div>
  );
}
