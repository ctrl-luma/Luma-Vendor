"use client";

import React from "react";
import { MetricCard } from "@/components/dashboard/metrics-card";
import { BalanceBanner } from "@/components/dashboard/balance-banner";
import { PerformanceScore } from "@/components/dashboard/performance-score";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { MobileHeader } from "@/components/layout/mobile-header";

export default function TodayPage() {
  return (
    <div className="min-h-full">
      <MobileHeader title="Today" />

      <main className="pb-20 md:pb-8">
        <div className="container space-y-4">
          <BalanceBanner />

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
            <MetricCard
              title="Today's Sales"
              value="2,456.78"
              prefix="$"
              change={12.5}
              changeType="positive"
            />
            <MetricCard
              title="Orders"
              value="48"
              change={8.3}
              changeType="positive"
            />
            <MetricCard
              title="Avg Ticket"
              value="51.18"
              prefix="$"
              change={3.2}
              changeType="positive"
            />
            <MetricCard
              title="Visitors"
              value="142"
              change={-2.1}
              changeType="negative"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
            <div className="md:col-span-1">
              <PerformanceScore score={2456.78} target={3000} />
            </div>
            <div className="md:col-span-2">
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
