"use client";

import React, { useState, useEffect } from "react";
import { MobileHeader } from "@/components/layout/mobile-header";
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Building,
  Users,
  Zap,
  Shield,
  HeadphonesIcon,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { billingService, BillingHistoryResponse, BillingHistoryItem, PaymentInfo } from "@/lib/api/billing";

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
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'open':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'void':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <MobileHeader title="Plan & Billing" />
      
      <main className="pb-20 md:pb-8 md:pt-8">
        <div className="md:max-w-7xl md:mx-auto px-4 md:px-4 lg:px-8 space-y-8">
          {/* Subscription Info */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Current Plan</h2>
              {paymentInfo?.subscription_status && (
                <span className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                  paymentInfo.subscription_status === 'active' 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : paymentInfo.subscription_status === 'past_due'
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    : paymentInfo.subscription_status === 'trialing'
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading subscription info...</p>
              </div>
            ) : paymentInfo?.current_plan ? (
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {paymentInfo.current_plan.name}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatAmount(paymentInfo.current_plan.price, paymentInfo.current_plan.currency)}/{paymentInfo.current_plan.interval}
                  </span>
                </div>
                
                {paymentInfo.current_plan.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {paymentInfo.current_plan.description}
                  </p>
                )}
                
                {paymentInfo.cancel_at ? (
                  <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <AlertCircle className="h-4 w-4" />
                    <span>Cancels on: {formatDate(paymentInfo.cancel_at)}</span>
                  </div>
                ) : paymentInfo.next_billing_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <Clock className="h-4 w-4" />
                    <span>Next billing date: {formatDate(paymentInfo.next_billing_date)}</span>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleManageSubscription}
                    className="w-full sm:w-auto"
                  >
                    Manage Subscription
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">No active subscription</p>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleManageSubscription}
                >
                  View Plans
                </Button>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Payment Method</h2>
            </div>
            
            {paymentLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading payment info...</p>
              </div>
            ) : paymentInfo?.payment_method ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <CreditCard className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    {paymentInfo.payment_method.type === 'card' ? (
                      <>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {paymentInfo.payment_method.brand ? 
                            paymentInfo.payment_method.brand.charAt(0).toUpperCase() + paymentInfo.payment_method.brand.slice(1) : 
                            'Card'
                          } •••• {paymentInfo.payment_method.last4}
                        </p>
                        {paymentInfo.payment_method.exp_month && paymentInfo.payment_method.exp_year && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Expires {paymentInfo.payment_method.exp_month.toString().padStart(2, '0')}/{paymentInfo.payment_method.exp_year}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {paymentInfo.payment_method.bank_name || 'Bank Account'} •••• {paymentInfo.payment_method.last4}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Bank Account</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleManagePayment}
                    className="w-full sm:w-auto"
                  >
                    Change Payment Method
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">No payment method on file</p>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleManagePayment}
                >
                  Add Payment Method
                </Button>
              </div>
            )}
          </div>


          {/* Billing History */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Billing History</h2>
                {pagination.total_count > 0 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {pagination.total_count} total invoices
                  </span>
                )}
              </div>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading billing history...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => fetchBillingHistory(pagination.page)}
                >
                  Retry
                </Button>
              </div>
            ) : billingHistory.length === 0 ? (
              <div className="p-8 text-center">
                <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">No billing history found</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {billingHistory.map((item) => (
                    <div key={item.id} className="p-4 md:p-6 flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {formatDate(item.date)}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">{item.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">{formatAmount(item.amount, item.currency)}</p>
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                            getStatusColor(item.status)
                          )}>
                            {item.status}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownload(item.pdf_url || item.invoice_url || '', item.id)}
                          disabled={!item.pdf_url && !item.invoice_url}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Page {pagination.page} of {pagination.total_pages}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={!pagination.has_previous}
                          className="flex items-center gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
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
                              <Button
                                key={pageNum}
                                variant={pagination.page === pageNum ? "default" : "ghost"}
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                                className="w-8 h-8 p-0"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={!pagination.has_next}
                          className="flex items-center gap-1"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Support Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 md:p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                <HeadphonesIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Need help choosing?</h3>
                <p className="text-blue-100">Our team is here to help you find the perfect plan</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => window.open(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/contact`, '_blank')}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}