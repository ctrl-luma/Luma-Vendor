"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { MetricCard } from "@/components/dashboard/metrics-card";
import { BalanceBanner } from "@/components/dashboard/balance-banner";
import { PerformanceScore } from "@/components/dashboard/performance-score";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useStripeConnect } from "@/contexts/StripeConnectContext";

export default function TodayPage() {
  const router = useRouter();
  const { isOnboarded, isLoading } = useStripeConnect();

  // Redirect to connect page if not onboarded
  useEffect(() => {
    if (!isLoading && !isOnboarded) {
      router.replace("/connect");
    }
  }, [isLoading, isOnboarded, router]);

  // Show loading state while checking onboarding status or redirecting
  if (isLoading || !isOnboarded) {
    return (
      <div className="min-h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
        <MobileHeader title="Today" />
        <main className="pb-4 md:pb-8 md:pt-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  // Show normal dashboard for onboarded users
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <MobileHeader title="Today" />

      <main className="pb-20 md:pb-8 md:pt-8 min-h-full">
        <div className="md:max-w-7xl md:mx-auto md:px-4 lg:px-8">
          <QuickActions />

        <div className="px-4 space-y-4">
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
        </div>
      </main>
    </div>
  );
}