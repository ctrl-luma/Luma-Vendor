"use client";

import React from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BalanceBanner() {
  const availableBalance = 1234.56;
  const pendingBalance = 456.78;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 p-6 text-white">
      <div className="absolute inset-0 bg-black/10" />
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

        <Button
          size="lg"
          className="w-full bg-white text-blue-600 hover:bg-white/90 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400"
          onClick={() => {}}
        >
          Cash Out Now
        </Button>
      </div>
    </div>
  );
}