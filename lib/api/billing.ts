import { apiClient } from './client';

export interface BillingHistoryItem {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'draft' | 'void';
  description: string;
  invoice_url?: string;
  pdf_url?: string;
}

export interface PaymentMethod {
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string; // for cards: visa, mastercard, etc.
  exp_month?: number; // for cards
  exp_year?: number; // for cards
  bank_name?: string; // for bank accounts
}

export interface SubscriptionPlan {
  name: string;
  price: number; // in cents
  currency: string;
  interval: 'month' | 'year';
  description?: string;
}

export interface PaymentInfo {
  payment_method: PaymentMethod | null;
  manage_payment_url: string;
  next_billing_date?: string;
  subscription_status?: 'active' | 'past_due' | 'canceled' | 'trialing';
  current_plan?: SubscriptionPlan;
  manage_subscription_url?: string;
  cancel_at?: string | null;
  canceled_at?: string | null;
}

export interface BillingHistoryResponse {
  data: BillingHistoryItem[];
  pagination: {
    page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface BillingHistoryParams {
  page?: number;
  per_page?: number;
}

export const billingService = {
  getBillingHistory: async (params: BillingHistoryParams = {}): Promise<BillingHistoryResponse> => {
    const { page = 1, per_page = 20 } = params;
    const searchParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
    });
    
    return apiClient.get<BillingHistoryResponse>(`/billing/history?${searchParams}`);
  },

  getPaymentInfo: async (): Promise<PaymentInfo> => {
    return apiClient.get<PaymentInfo>('/billing/payment-info');
  },
};