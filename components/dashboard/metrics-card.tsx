"use client";

import React from "react";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  prefix?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
  prefix = ""
}: MetricCardProps) {
  return (
    <div className="card p-4 hover:border-gray-700 transition-all">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <div className="flex items-baseline justify-between mt-1">
        <p className="text-2xl font-semibold text-white">
          {prefix}{value}
        </p>
        <div className={cn(
          "flex items-center text-xs font-medium",
          changeType === "positive" && "text-green-400",
          changeType === "negative" && "text-red-400",
          changeType === "neutral" && "text-gray-400"
        )}>
          {changeType === "positive" && <ArrowUp className="h-3 w-3 mr-0.5" />}
          {changeType === "negative" && <ArrowDown className="h-3 w-3 mr-0.5" />}
          {changeType === "neutral" && <TrendingUp className="h-3 w-3 mr-0.5" />}
          {change}%
        </div>
      </div>
    </div>
  );
}
