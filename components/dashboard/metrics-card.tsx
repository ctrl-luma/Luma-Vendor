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
    <div className="dashboard-card p-4 hover:shadow-lg transition-all hover:-translate-y-0.5">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="flex items-baseline justify-between mt-1">
        <p className="text-2xl font-semibold">
          {prefix}{value}
        </p>
        <div className={cn(
          "flex items-center text-xs font-medium",
          changeType === "positive" && "text-green-600",
          changeType === "negative" && "text-red-600",
          changeType === "neutral" && "text-muted-foreground"
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