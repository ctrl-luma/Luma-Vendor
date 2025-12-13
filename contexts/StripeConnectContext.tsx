'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { stripeConnectService, ConnectStatus, ConnectOnboardingState } from '@/lib/api/stripe-connect';
import { useAuth } from './AuthContext';
import { useSocket, SocketEvents } from './SocketContext';

const CACHE_KEY = 'luma_stripe_connect_status';

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

// Type for socket event data
interface ConnectStatusSocketEvent {
  organizationId: string;
  onboardingState: ConnectOnboardingState;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  requirementsCurrentlyDue: string[];
  requirementsPastDue: string[];
  disabledReason: string | null;
  timestamp: string;
}

// Cache helpers
function getCachedStatus(): ConnectStatus | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error('[StripeConnectContext] Error reading cache:', e);
  }
  return null;
}

function setCachedStatus(status: ConnectStatus | null) {
  if (typeof window === 'undefined') return;
  try {
    if (status && status.hasConnectedAccount) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(status));
    } else {
      // Clear cache if no connected account
      localStorage.removeItem(CACHE_KEY);
    }
  } catch (e) {
    console.error('[StripeConnectContext] Error writing cache:', e);
  }
}

function clearCache() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {
    console.error('[StripeConnectContext] Error clearing cache:', e);
  }
}

export function StripeConnectProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { subscribe, isConnected } = useSocket();

  // Initialize from cache for faster initial render
  const [connectStatus, setConnectStatus] = useState<ConnectStatus | null>(() => getCachedStatus());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasInitialized = useRef(false);

  const refreshStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setConnectStatus(null);
      clearCache();
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const status = await stripeConnectService.getStatus();
      setConnectStatus(status);

      // Update cache based on API response
      setCachedStatus(status);
    } catch (err: any) {
      console.error('[StripeConnectContext] Error fetching status:', err);
      setError(err.message || 'Failed to fetch Stripe Connect status');
      // Set default status on error so the UI can still function
      setConnectStatus(defaultConnectStatus);
      // Clear cache on error as we can't trust the cached data
      clearCache();
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch status when auth is ready
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setConnectStatus(null);
      clearCache();
      setIsLoading(false);
      hasInitialized.current = false;
      return;
    }

    if (hasInitialized.current) return;

    hasInitialized.current = true;
    refreshStatus();
  }, [isAuthenticated, authLoading, refreshStatus]);

  // Subscribe to real-time socket updates for connect status
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe<ConnectStatusSocketEvent>(
      SocketEvents.CONNECT_STATUS_UPDATED,
      (data) => {
        console.log('[StripeConnectContext] Received socket update:', data);

        // Update the connect status with the new data from webhook
        const updatedStatus: ConnectStatus = {
          hasConnectedAccount: true,
          onboardingComplete: data.onboardingState === 'active',
          onboardingState: data.onboardingState,
          chargesEnabled: data.chargesEnabled,
          payoutsEnabled: data.payoutsEnabled,
          detailsSubmitted: data.detailsSubmitted,
          requirementsCurrentlyDue: data.requirementsCurrentlyDue,
          requirementsPastDue: data.requirementsPastDue,
          disabledReason: data.disabledReason,
          // Keep existing values for fields not in socket event
          businessName: connectStatus?.businessName ?? null,
          externalAccountLast4: connectStatus?.externalAccountLast4 ?? null,
          externalAccountBankName: connectStatus?.externalAccountBankName ?? null,
        };

        setConnectStatus(updatedStatus);
        // Update cache with new status
        setCachedStatus(updatedStatus);
      }
    );

    return unsubscribe;
  }, [isConnected, subscribe, connectStatus]);

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
