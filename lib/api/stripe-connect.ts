import { apiClient } from './client';

export type ConnectOnboardingState =
  | 'not_started'
  | 'incomplete'
  | 'pending_verification'
  | 'active'
  | 'restricted'
  | 'disabled';

export interface ConnectStatus {
  hasConnectedAccount: boolean;
  onboardingComplete: boolean;
  onboardingState: ConnectOnboardingState;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  requirementsCurrentlyDue: string[];
  requirementsPastDue: string[];
  disabledReason: string | null;
  businessName: string | null;
  externalAccountLast4: string | null;
  externalAccountBankName: string | null;
}

export interface CreateAccountResponse {
  accountId: string;
  onboardingUrl: string;
}

export interface OnboardingLinkResponse {
  onboardingUrl: string;
}

export interface RefreshStatusResponse {
  onboardingState: ConnectOnboardingState;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

export interface CreateAccountParams {
  country?: string;
  businessType?: 'individual' | 'company';
}

export const stripeConnectService = {
  /**
   * Get the current Stripe Connect onboarding status
   */
  getStatus: async (): Promise<ConnectStatus> => {
    return apiClient.get<ConnectStatus>('/stripe/connect/status');
  },

  /**
   * Create a new Stripe Connect account and get the onboarding URL
   */
  createAccount: async (params: CreateAccountParams = {}): Promise<CreateAccountResponse> => {
    return apiClient.post<CreateAccountResponse>('/stripe/connect/create-account', params);
  },

  /**
   * Generate a new onboarding link for an existing account
   */
  getOnboardingLink: async (): Promise<OnboardingLinkResponse> => {
    return apiClient.post<OnboardingLinkResponse>('/stripe/connect/onboarding-link', {});
  },

  /**
   * Manually refresh the account status from Stripe
   */
  refreshStatus: async (): Promise<RefreshStatusResponse> => {
    return apiClient.post<RefreshStatusResponse>('/stripe/connect/refresh-status', {});
  },
};
