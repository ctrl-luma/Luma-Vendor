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
      <div className="min-h-full">
        <MobileHeader title="Payment Account" />
        <main className="pb-20 md:pb-8">
          <div className="container">
            <ConnectOnboarding />
          </div>
        </main>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-full">
        <MobileHeader title="Payment Account" />
        <main className="pb-20 md:pb-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (onboardingState === "active") {
      return (
        <span className="badge badge-success px-3 py-1 text-sm">
          <CheckCircle2 className="h-4 w-4 mr-1.5" />
          Active
        </span>
      );
    }
    if (onboardingState === "pending_verification") {
      return (
        <span className="badge badge-primary px-3 py-1 text-sm">
          <Clock className="h-4 w-4 mr-1.5" />
          Pending Verification
        </span>
      );
    }
    if (onboardingState === "restricted" || onboardingState === "disabled") {
      return (
        <span className="badge badge-danger px-3 py-1 text-sm">
          <AlertCircle className="h-4 w-4 mr-1.5" />
          {onboardingState === "disabled" ? "Disabled" : "Restricted"}
        </span>
      );
    }
    return (
      <span className="badge badge-warning px-3 py-1 text-sm">
        <AlertCircle className="h-4 w-4 mr-1.5" />
        Incomplete
      </span>
    );
  };

  return (
    <div className="min-h-full">
      <MobileHeader title="Payment Account" />

      <main className="pb-20 md:pb-8">
        <div className="container space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="heading-2">Stripe Connect</h1>
              <p className="text-gray-400 mt-1">
                Manage your payment account and payout settings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn-secondary !px-4 !py-2"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </button>
              <button
                onClick={handleEditAccount}
                disabled={isEditLoading}
                className="btn-primary !px-4 !py-2"
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
              </button>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Account Status</h2>
              {getStatusBadge()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    connectStatus?.chargesEnabled
                      ? "bg-green-500/20"
                      : "bg-gray-800"
                  )}
                >
                  <CreditCard
                    className={cn(
                      "h-5 w-5",
                      connectStatus?.chargesEnabled
                        ? "text-green-400"
                        : "text-gray-500"
                    )}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Card Payments</p>
                  <p
                    className={cn(
                      "text-sm",
                      connectStatus?.chargesEnabled
                        ? "text-green-400"
                        : "text-gray-500"
                    )}
                  >
                    {connectStatus?.chargesEnabled ? "Enabled" : "Not enabled"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    connectStatus?.payoutsEnabled
                      ? "bg-green-500/20"
                      : "bg-gray-800"
                  )}
                >
                  <Banknote
                    className={cn(
                      "h-5 w-5",
                      connectStatus?.payoutsEnabled
                        ? "text-green-400"
                        : "text-gray-500"
                    )}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Payouts</p>
                  <p
                    className={cn(
                      "text-sm",
                      connectStatus?.payoutsEnabled
                        ? "text-green-400"
                        : "text-gray-500"
                    )}
                  >
                    {connectStatus?.payoutsEnabled ? "Enabled" : "Not enabled"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    connectStatus?.detailsSubmitted
                      ? "bg-green-500/20"
                      : "bg-gray-800"
                  )}
                >
                  <Shield
                    className={cn(
                      "h-5 w-5",
                      connectStatus?.detailsSubmitted
                        ? "text-green-400"
                        : "text-gray-500"
                    )}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Verification</p>
                  <p
                    className={cn(
                      "text-sm",
                      connectStatus?.detailsSubmitted
                        ? "text-green-400"
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
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-300">Action Required</p>
                      <p className="text-sm text-amber-400/80 mt-1">
                        You have {connectStatus.requirementsCurrentlyDue.length} item
                        {connectStatus.requirementsCurrentlyDue.length > 1 ? "s" : ""}{" "}
                        that need attention.
                      </p>
                      <button
                        onClick={handleEditAccount}
                        disabled={isEditLoading}
                        className="mt-3 inline-flex items-center px-4 py-2 rounded-lg border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/10 transition-colors"
                      >
                        Complete Requirements
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Business Information Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Business Information</h2>
              <button
                onClick={handleEditAccount}
                disabled={isEditLoading}
                className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center"
              >
                Edit
                <ExternalLink className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 py-3 border-b border-gray-800">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Business Name</p>
                  <p className="font-medium text-white">
                    {connectStatus?.businessName || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-3 border-b border-gray-800">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium text-white">
                    {connectStatus?.hasConnectedAccount
                      ? new Intl.DisplayNames(["en"], { type: "region" }).of("US")
                      : "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payout Information Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Payout Account</h2>
              <button
                onClick={handleEditAccount}
                disabled={isEditLoading}
                className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center"
              >
                Edit
                <ExternalLink className="h-4 w-4 ml-1" />
              </button>
            </div>

            {connectStatus?.externalAccountLast4 ? (
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-800 rounded-lg">
                  <Banknote className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {connectStatus.externalAccountBankName || "Bank Account"} ••••{" "}
                    {connectStatus.externalAccountLast4}
                  </p>
                  <p className="text-sm text-gray-500">Default payout destination</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Banknote className="h-10 w-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 mb-3">No payout account connected</p>
                <button
                  onClick={handleEditAccount}
                  disabled={isEditLoading}
                  className="btn-secondary !px-4 !py-2"
                >
                  Add Bank Account
                  <ExternalLink className="h-4 w-4 ml-2" />
                </button>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-white">Need help with your account?</h3>
                <p className="text-sm text-gray-400 mt-1">
                  If you have questions about your payment account or need assistance,
                  our support team is here to help.
                </p>
                <button
                  onClick={() =>
                    window.open(
                      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/contact`,
                      "_blank"
                    )
                  }
                  className="mt-3 text-primary text-sm font-medium hover:text-primary-400 transition-colors inline-flex items-center"
                >
                  Contact Support
                  <ExternalLink className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
