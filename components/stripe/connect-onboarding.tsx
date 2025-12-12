"use client";

import React, { useState } from "react";
import {
  Building2,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  Clock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStripeConnect } from "@/contexts/StripeConnectContext";
import { ConnectOnboardingState } from "@/lib/api/stripe-connect";

const benefits = [
  {
    icon: Zap,
    title: "Accept Payments Instantly",
    description: "Start accepting card payments at your events right away",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Bank-grade security with automatic fraud protection",
  },
  {
    icon: Clock,
    title: "Fast Payouts",
    description: "Get your money deposited directly to your bank account",
  },
];

const steps = [
  {
    number: 1,
    title: "Business Details",
    description: "Tell us about your business",
  },
  {
    number: 2,
    title: "Identity Verification",
    description: "Verify your identity securely",
  },
  {
    number: 3,
    title: "Bank Account",
    description: "Add your payout destination",
  },
];

interface ConnectOnboardingProps {
  className?: string;
}

export function ConnectOnboarding({ className }: ConnectOnboardingProps) {
  const {
    connectStatus,
    isLoading,
    onboardingState,
    startOnboarding,
    continueOnboarding,
    refreshStatus,
  } = useStripeConnect();

  const [isStarting, setIsStarting] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleStartOnboarding = async () => {
    setIsStarting(true);
    try {
      const url = await startOnboarding();
      if (url) {
        window.location.href = url;
      }
    } finally {
      setIsStarting(false);
    }
  };

  const handleContinueOnboarding = async () => {
    setIsContinuing(true);
    try {
      const url = await continueOnboarding();
      if (url) {
        window.location.href = url;
      }
    } finally {
      setIsContinuing(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      await refreshStatus();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // User hasn't started onboarding yet
  if (onboardingState === "not_started") {
    return (
      <div className={cn("space-y-8", className)}>
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            First Step
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Set Up Your Payment Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Before you can customize your app and start taking payments, you&apos;ll need to connect your business account.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Steps Preview */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            What you&apos;ll need
          </h3>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {step.number}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-gray-300 dark:text-gray-700 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            onClick={handleStartOnboarding}
            disabled={isStarting}
            className="w-full md:w-auto min-w-[200px]"
          >
            {isStarting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Secured by Stripe. Your information is encrypted.
          </p>
        </div>
      </div>
    );
  }

  // User started but hasn't completed onboarding
  if (onboardingState === "incomplete" || onboardingState === "pending_verification") {
    const requirementsCount = connectStatus?.requirementsCurrentlyDue?.length || 0;
    const isPendingVerification = onboardingState === "pending_verification";

    return (
      <div className={cn("space-y-6", className)}>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-3 rounded-full",
              isPendingVerification
                ? "bg-blue-100 dark:bg-blue-900/20"
                : "bg-amber-100 dark:bg-amber-900/20"
            )}>
              {isPendingVerification ? (
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              ) : (
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {isPendingVerification
                  ? "Verification in Progress"
                  : "Complete Your Setup"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {isPendingVerification
                  ? "We're reviewing your information. This usually takes a few minutes."
                  : requirementsCount > 0
                  ? `You have ${requirementsCount} item${requirementsCount > 1 ? "s" : ""} remaining to complete your setup.`
                  : "Almost there! Complete a few more steps to start accepting payments."}
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleContinueOnboarding}
                  disabled={isContinuing}
                >
                  {isContinuing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      {isPendingVerification ? "Check Status" : "Continue Setup"}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRefreshStatus}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((step) => {
              const isCompleted = step === 1 || (step === 2 && connectStatus?.detailsSubmitted);
              const isCurrent = (step === 2 && !connectStatus?.detailsSubmitted) || (step === 3 && connectStatus?.detailsSubmitted && !isPendingVerification);

              return (
                <React.Fragment key={step}>
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                      isCompleted
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div
                      className={cn(
                        "flex-1 h-1 rounded-full",
                        isCompleted
                          ? "bg-green-200 dark:bg-green-900/40"
                          : "bg-gray-200 dark:bg-gray-800"
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-xs text-gray-500">Details</span>
            <span className="text-xs text-gray-500">Verify</span>
            <span className="text-xs text-gray-500">Bank</span>
          </div>
        </div>
      </div>
    );
  }

  // User is restricted or disabled
  if (onboardingState === "restricted" || onboardingState === "disabled") {
    const isDisabled = onboardingState === "disabled";

    return (
      <div className={cn("space-y-6", className)}>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {isDisabled ? "Account Disabled" : "Action Required"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {isDisabled
                  ? connectStatus?.disabledReason || "Your account has been disabled. Please contact support."
                  : "Your account has some past due requirements that need attention."}
              </p>

              {connectStatus?.requirementsPastDue && connectStatus.requirementsPastDue.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                    Past due items:
                  </p>
                  <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                    {connectStatus.requirementsPastDue.slice(0, 5).map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        {req.replace(/_/g, " ")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleContinueOnboarding}
                  disabled={isContinuing}
                >
                  {isContinuing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Resolve Issues
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRefreshStatus}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is fully onboarded - this component shouldn't render in this case
  // but handle it gracefully
  return null;
}

// Compact version for showing in sidebars or smaller spaces
export function ConnectOnboardingBanner({ className }: ConnectOnboardingProps) {
  const { onboardingState, isLoading, continueOnboarding } = useStripeConnect();
  const [isContinuing, setIsContinuing] = useState(false);

  const handleContinue = async () => {
    setIsContinuing(true);
    try {
      const url = await continueOnboarding();
      if (url) {
        window.location.href = url;
      }
    } finally {
      setIsContinuing(false);
    }
  };

  if (isLoading || onboardingState === "active") {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-4 border border-primary/20",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <CreditCard className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-white text-sm">
            {onboardingState === "not_started"
              ? "Set up payments"
              : "Complete setup"}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {onboardingState === "not_started"
              ? "Start accepting payments"
              : "Finish your account setup"}
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleContinue}
          disabled={isContinuing}
        >
          {isContinuing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
