'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { stripeConnectService, ConnectStatus, ConnectOnboardingState } from '@/lib/api/stripe-connect';
import { useAuth } from './AuthContext';

interface StripeConnectContextValue {
  connectStatus: ConnectStatus | null;
  isLoading: boolean;
  error: string | null;
  isOnboarded: boolean;
  onboardingState: ConnectOnboardingState;
  refreshStatus: () => Promise<void>;
  startOnboarding: (params?: { country?: string; businessType?: 'individual' | 'company' }) => Promise<string | null>;
  continueOnboarding: () => Promise<string | null>;
}

const defaultConnectStatus: ConnectStatus = {
  hasConnectedAccount: false,
  onboardingComplete: false,
  onboardingState: 'not_started',
  chargesEnabled: false,
  payoutsEnabled: false,
  detailsSubmitted: false,
  requirementsCurrentlyDue: [],
  requirementsPastDue: [],
  disabledReason: null,
  businessName: null,
  externalAccountLast4: null,
  externalAccountBankName: null,
};

const StripeConnectContext = createContext<StripeConnectContextValue | undefined>(undefined);

export function StripeConnectProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [connectStatus, setConnectStatus] = useState<ConnectStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasInitialized = useRef(false);

  const refreshStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setConnectStatus(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const status = await stripeConnectService.getStatus();
      setConnectStatus(status);
    } catch (err: any) {
      console.error('[StripeConnectContext] Error fetching status:', err);
      setError(err.message || 'Failed to fetch Stripe Connect status');
      // Set default status on error so the UI can still function
      setConnectStatus(defaultConnectStatus);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch status when auth is ready
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setConnectStatus(null);
      setIsLoading(false);
      hasInitialized.current = false;
      return;
    }

    if (hasInitialized.current) return;

    hasInitialized.current = true;
    refreshStatus();
  }, [isAuthenticated, authLoading, refreshStatus]);

  const startOnboarding = useCallback(async (params?: { country?: string; businessType?: 'individual' | 'company' }) => {
    try {
      setError(null);
      const response = await stripeConnectService.createAccount(params || {});
      // Refresh status after creating account
      await refreshStatus();
      return response.onboardingUrl;
    } catch (err: any) {
      console.error('[StripeConnectContext] Error starting onboarding:', err);
      setError(err.message || 'Failed to start onboarding');
      return null;
    }
  }, [refreshStatus]);

  const continueOnboarding = useCallback(async () => {
    try {
      setError(null);
      const response = await stripeConnectService.getOnboardingLink();
      return response.onboardingUrl;
    } catch (err: any) {
      console.error('[StripeConnectContext] Error getting onboarding link:', err);
      setError(err.message || 'Failed to get onboarding link');
      return null;
    }
  }, []);

  const isOnboarded = connectStatus?.onboardingState === 'active';
  const onboardingState = connectStatus?.onboardingState || 'not_started';

  const value: StripeConnectContextValue = {
    connectStatus,
    isLoading: isLoading || authLoading,
    error,
    isOnboarded,
    onboardingState,
    refreshStatus,
    startOnboarding,
    continueOnboarding,
  };

  return (
    <StripeConnectContext.Provider value={value}>
      {children}
    </StripeConnectContext.Provider>
  );
}

export function useStripeConnect() {
  const context = useContext(StripeConnectContext);
  if (!context) {
    throw new Error('useStripeConnect must be used within a StripeConnectProvider');
  }
  return context;
}
