"use client";

import React, { useState } from "react";
import { MobileHeader } from "@/components/layout/mobile-header";
import {
  Building2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Banknote,
  Globe,
  Mail,
  Shield,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStripeConnect } from "@/contexts/StripeConnectContext";
import { ConnectOnboarding } from "@/components/stripe/connect-onboarding";

export default function ConnectPage() {
  const {
    connectStatus,
    isLoading,
    isOnboarded,
    onboardingState,
    refreshStatus,
    continueOnboarding,
  } = useStripeConnect();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshStatus();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEditAccount = async () => {
    setIsEditLoading(true);
    try {
      const url = await continueOnboarding();
      if (url) {
        window.location.href = url;
      }
    } finally {
      setIsEditLoading(false);
    }
  };

  // Show onboarding if not completed
  if (!isLoading && !isOnboarded) {
    return (
      <div className="min-h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
        <MobileHeader title="Payment Account" />
        <main className="pb-4 md:pb-8 md:pt-8">
          <div className="max-w-3xl mx-auto px-4 md:px-4 lg:px-8">
            <ConnectOnboarding />
          </div>
        </main>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
        <MobileHeader title="Payment Account" />
        <main className="pb-4 md:pb-8 md:pt-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (onboardingState === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          Active
        </span>
      );
    }
    if (onboardingState === "pending_verification") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
          <Clock className="h-4 w-4" />
          Pending Verification
        </span>
      );
    }
    if (onboardingState === "restricted" || onboardingState === "disabled") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          {onboardingState === "disabled" ? "Disabled" : "Restricted"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
        <AlertCircle className="h-4 w-4" />
        Incomplete
      </span>
    );
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <MobileHeader title="Payment Account" />

      <main className="pb-4 md:pb-8 md:pt-8">
        <div className="md:max-w-4xl md:mx-auto px-4 md:px-4 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Stripe Connect
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your payment account and payout settings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                onClick={handleEditAccount}
                disabled={isEditLoading}
              >
                {isEditLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Edit Account
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Status
              </h2>
              {getStatusBadge()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    connectStatus?.chargesEnabled
                      ? "bg-green-100 dark:bg-green-900/20"
                      : "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <CreditCard
                    className={cn(
                      "h-5 w-5",
                      connectStatus?.chargesEnabled
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400"
                    )}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Card Payments
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      connectStatus?.chargesEnabled
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500"
                    )}
                  >
                    {connectStatus?.chargesEnabled ? "Enabled" : "Not enabled"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    connectStatus?.payoutsEnabled
                      ? "bg-green-100 dark:bg-green-900/20"
                      : "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <Banknote
                    className={cn(
                      "h-5 w-5",
                      connectStatus?.payoutsEnabled
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400"
                    )}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Payouts
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      connectStatus?.payoutsEnabled
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500"
                    )}
                  >
                    {connectStatus?.payoutsEnabled ? "Enabled" : "Not enabled"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    connectStatus?.detailsSubmitted
                      ? "bg-green-100 dark:bg-green-900/20"
                      : "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <Shield
                    className={cn(
                      "h-5 w-5",
                      connectStatus?.detailsSubmitted
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400"
                    )}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Verification
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      connectStatus?.detailsSubmitted
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500"
                    )}
                  >
                    {connectStatus?.detailsSubmitted ? "Complete" : "Incomplete"}
                  </p>
                </div>
              </div>
            </div>

            {/* Requirements Warning */}
            {connectStatus?.requirementsCurrentlyDue &&
              connectStatus.requirementsCurrentlyDue.length > 0 && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-300">
                        Action Required
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                        You have {connectStatus.requirementsCurrentlyDue.length}{" "}
                        item
                        {connectStatus.requirementsCurrentlyDue.length > 1
                          ? "s"
                          : ""}{" "}
                        that need attention.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/20"
                        onClick={handleEditAccount}
                        disabled={isEditLoading}
                      >
                        Complete Requirements
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Business Information Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Business Information
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditAccount}
                disabled={isEditLoading}
              >
                Edit
                <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Business Name
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {connectStatus?.businessName || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Country
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {connectStatus?.hasConnectedAccount
                      ? new Intl.DisplayNames(["en"], { type: "region" }).of(
                          "US"
                        )
                      : "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payout Information Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payout Account
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditAccount}
                disabled={isEditLoading}
              >
                Edit
                <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {connectStatus?.externalAccountLast4 ? (
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Banknote className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {connectStatus.externalAccountBankName || "Bank Account"} ••••{" "}
                    {connectStatus.externalAccountLast4}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Default payout destination
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Banknote className="h-10 w-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-500 mb-3">
                  No payout account connected
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditAccount}
                  disabled={isEditLoading}
                >
                  Add Bank Account
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Need help with your account?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  If you have questions about your payment account or need
                  assistance, our support team is here to help.
                </p>
                <Button
                  variant="link"
                  className="px-0 mt-2 text-primary"
                  onClick={() =>
                    window.open(
                      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/contact`,
                      "_blank"
                    )
                  }
                >
                  Contact Support
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
