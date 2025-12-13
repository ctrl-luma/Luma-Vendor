"use client";

import React, { useState, useEffect } from "react";
import { MobileHeader } from "@/components/layout/mobile-header";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  HeadphonesIcon,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { billingService, BillingHistoryItem, PaymentInfo } from "@/lib/api/billing";

export default function BillingPage() {
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total_pages: 1,
    total_count: 0,
    has_next: false,
    has_previous: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(true);

  const fetchBillingHistory = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await billingService.getBillingHistory({
        page,
        per_page: pagination.per_page
      });
      setBillingHistory(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to load billing history');
      console.error('Error fetching billing history:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentInfo = async () => {
    try {
      setPaymentLoading(true);
      const info = await billingService.getPaymentInfo();
      setPaymentInfo(info);
    } catch (err) {
      console.error('Error fetching payment info:', err);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleManagePayment = () => {
    if (paymentInfo?.manage_payment_url) {
      window.open(paymentInfo.manage_payment_url, '_blank');
    }
  };

  const handleManageSubscription = () => {
    if (paymentInfo?.manage_subscription_url) {
      window.open(paymentInfo.manage_subscription_url, '_blank');
    }
  };

  useEffect(() => {
    fetchBillingHistory();
    fetchPaymentInfo();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchBillingHistory(newPage);
    }
  };

  const handleDownload = (invoiceUrl: string, invoiceId: string) => {
    if (invoiceUrl) {
      const link = document.createElement('a');
      link.href = invoiceUrl;
      link.download = `invoice-${invoiceId}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400';
      case 'open':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'draft':
        return 'bg-gray-700 text-gray-400';
      case 'void':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-700 text-gray-400';
    }
  };

  return (
    <div className="min-h-full">
      <MobileHeader title="Plan & Billing" />

      <main className="pb-20 md:pb-8">
        <div className="container max-w-5xl space-y-6">
          {/* Subscription Info */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Current Plan</h2>
              {paymentInfo?.subscription_status && (
                <span className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                  paymentInfo.subscription_status === 'active'
                    ? "bg-green-500/20 text-green-400"
                    : paymentInfo.subscription_status === 'past_due'
                    ? "bg-yellow-500/20 text-yellow-400"
                    : paymentInfo.subscription_status === 'trialing'
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-gray-700 text-gray-400"
                )}>
                  {paymentInfo.subscription_status === 'active' && <CheckCircle2 className="h-4 w-4 mr-1" />}
                  {paymentInfo.subscription_status === 'past_due' && <AlertCircle className="h-4 w-4 mr-1" />}
                  {paymentInfo.subscription_status === 'trialing' && <Clock className="h-4 w-4 mr-1" />}
                  {paymentInfo.subscription_status.charAt(0).toUpperCase() + paymentInfo.subscription_status.slice(1).replace('_', ' ')}
                </span>
              )}
            </div>

            {paymentLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-400 mt-2">Loading subscription info...</p>
              </div>
            ) : paymentInfo?.current_plan ? (
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {paymentInfo.current_plan.name}
                  </span>
                  <span className="text-gray-400">
                    {formatAmount(paymentInfo.current_plan.price, paymentInfo.current_plan.currency)}/{paymentInfo.current_plan.interval}
                  </span>
                </div>

                {paymentInfo.current_plan.description && (
                  <p className="text-sm text-gray-400">
                    {paymentInfo.current_plan.description}
                  </p>
                )}

                {paymentInfo.cancel_at ? (
                  <div className="flex items-center gap-2 text-sm text-amber-400 pt-4 border-t border-gray-800">
                    <AlertCircle className="h-4 w-4" />
                    <span>Cancels on: {formatDate(paymentInfo.cancel_at)}</span>
                  </div>
                ) : paymentInfo.next_billing_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 pt-4 border-t border-gray-800">
                    <Clock className="h-4 w-4" />
                    <span>Next billing date: {formatDate(paymentInfo.next_billing_date)}</span>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    onClick={handleManageSubscription}
                    className="btn-secondary"
                  >
                    Manage Subscription
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400 mb-4">No active subscription</p>
                <button
                  onClick={handleManageSubscription}
                  className="btn-primary"
                >
                  View Plans
                </button>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Payment Method</h2>
            </div>

            {paymentLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-400 mt-2">Loading payment info...</p>
              </div>
            ) : paymentInfo?.payment_method ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <CreditCard className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    {paymentInfo.payment_method.type === 'card' ? (
                      <>
                        <p className="font-medium text-white">
                          {paymentInfo.payment_method.brand ?
                            paymentInfo.payment_method.brand.charAt(0).toUpperCase() + paymentInfo.payment_method.brand.slice(1) :
                            'Card'
                          } •••• {paymentInfo.payment_method.last4}
                        </p>
                        {paymentInfo.payment_method.exp_month && paymentInfo.payment_method.exp_year && (
                          <p className="text-sm text-gray-400">
                            Expires {paymentInfo.payment_method.exp_month.toString().padStart(2, '0')}/{paymentInfo.payment_method.exp_year}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-white">
                          {paymentInfo.payment_method.bank_name || 'Bank Account'} •••• {paymentInfo.payment_method.last4}
                        </p>
                        <p className="text-sm text-gray-400">Bank Account</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <button
                    onClick={handleManagePayment}
                    className="btn-secondary"
                  >
                    Change Payment Method
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400 mb-4">No payment method on file</p>
                <button
                  onClick={handleManagePayment}
                  className="btn-primary"
                >
                  Add Payment Method
                </button>
              </div>
            )}
          </div>

          {/* Billing History */}
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Billing History</h2>
                {pagination.total_count > 0 && (
                  <span className="text-sm text-gray-400">
                    {pagination.total_count} total invoices
                  </span>
                )}
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-400 mt-2">Loading billing history...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-red-400">{error}</p>
                <button
                  className="btn-secondary mt-4"
                  onClick={() => fetchBillingHistory(pagination.page)}
                >
                  Retry
                </button>
              </div>
            ) : billingHistory.length === 0 ? (
              <div className="p-8 text-center">
                <CreditCard className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No billing history found</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-800">
                  {billingHistory.map((item) => (
                    <div key={item.id} className="p-4 md:p-6 flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <p className="text-base font-medium text-white">
                          {formatDate(item.date)}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-500">{item.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-white">{formatAmount(item.amount, item.currency)}</p>
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                            getStatusColor(item.status)
                          )}>
                            {item.status}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDownload(item.pdf_url || item.invoice_url || '', item.id)}
                          disabled={!item.pdf_url && !item.invoice_url}
                          className="btn-secondary !px-3 !py-1.5 text-sm disabled:opacity-50"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="p-6 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Page {pagination.page} of {pagination.total_pages}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={!pagination.has_previous}
                          className="btn-secondary !px-3 !py-1.5 text-sm disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                            let pageNum;
                            if (pagination.total_pages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                              pageNum = i + 1;
                            } else if (pagination.page >= pagination.total_pages - 2) {
                              pageNum = pagination.total_pages - 4 + i;
                            } else {
                              pageNum = pagination.page - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={cn(
                                  "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                                  pagination.page === pageNum
                                    ? "bg-primary text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                                )}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={!pagination.has_next}
                          className="btn-secondary !px-3 !py-1.5 text-sm disabled:opacity-50"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Support Section */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 md:p-8 text-white shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <HeadphonesIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Need help choosing?</h3>
                  <p className="text-gray-400">Our team is here to help you find the perfect plan</p>
                </div>
              </div>
              <button
                className="bg-primary hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-xl transition-all shadow-lg shadow-primary/25"
                onClick={() => window.open(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/contact`, '_blank')}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
