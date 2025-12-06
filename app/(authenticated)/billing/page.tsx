"use client";

import React from "react";
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
  HeadphonesIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "month",
    description: "Perfect for getting started",
    features: [
      "Up to 5 events per month",
      "Basic analytics",
      "Email support",
      "Standard payment processing",
      "Mobile POS app",
    ],
    limitations: [
      "No team members",
      "Limited customization",
      "7-day data retention",
    ],
    current: true,
    color: "from-gray-500 to-gray-600",
  },
  {
    name: "Pro",
    price: "$149",
    period: "month",
    description: "For growing businesses",
    features: [
      "Unlimited events",
      "Advanced analytics & insights",
      "Priority support",
      "Custom branding",
      "Team collaboration (up to 5)",
      "API access",
      "30-day data retention",
      "Inventory management",
    ],
    limitations: [],
    recommended: true,
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Dedicated account manager",
      "24/7 phone support",
      "Custom integrations",
      "SLA guarantee",
      "Unlimited data retention",
      "Advanced security features",
    ],
    limitations: [],
    color: "from-purple-500 to-pink-600",
  },
];

const billingHistory = [
  {
    date: "Dec 1, 2024",
    amount: "$49.00",
    status: "paid",
    invoice: "#INV-2024-012",
  },
  {
    date: "Nov 1, 2024",
    amount: "$49.00",
    status: "paid",
    invoice: "#INV-2024-011",
  },
  {
    date: "Oct 1, 2024",
    amount: "$49.00",
    status: "paid",
    invoice: "#INV-2024-010",
  },
];

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <MobileHeader title="Plan & Billing" />
      
      <main className="pb-20 md:pb-8 md:pt-8">
        <div className="md:max-w-7xl md:mx-auto px-4 md:px-4 lg:px-8 space-y-8">
          {/* Current Plan */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Current Plan</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Active
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">Starter Plan</span>
                <span className="text-gray-600 dark:text-gray-400">$49/month</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Next billing: January 1, 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  <span>•••• 4242</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button variant="outline" size="sm">
                  Manage Payment Method
                </Button>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Available Plans</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={cn(
                    "relative bg-white dark:bg-gray-900 rounded-xl shadow-sm border-2 transition-all",
                    plan.current 
                      ? "border-gray-300 dark:border-gray-700" 
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700",
                    plan.recommended && "md:scale-105 shadow-lg"
                  )}
                >
                  {plan.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                        Recommended
                      </span>
                    </div>
                  )}
                  
                  <div className="p-6 space-y-4">
                    <div className={cn(
                      "h-2 w-full rounded-full bg-gradient-to-r",
                      plan.color
                    )} />
                    
                    <div>
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {plan.description}
                      </p>
                    </div>
                    
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-gray-600 dark:text-gray-400 ml-1">/{plan.period}</span>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <XCircle className="h-5 w-5 text-gray-400 dark:text-gray-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">{limitation}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant={plan.current ? "outline" : plan.recommended ? "default" : "secondary"}
                      disabled={plan.current}
                    >
                      {plan.current ? "Current Plan" : plan.name === "Enterprise" ? "Contact Sales" : "Upgrade"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">This month</span>
              </div>
              <p className="text-2xl font-semibold">3 / 5</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Events used</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
              </div>
              <p className="text-2xl font-semibold">1 / 1</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Team members</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
              </div>
              <p className="text-2xl font-semibold">$4,823</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Revenue processed</p>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold">Billing History</h2>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {billingHistory.map((item, i) => (
                <div key={i} className="p-4 md:p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{item.invoice}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.date}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{item.amount}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        {item.status}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-800">
              <Button variant="outline" className="w-full md:w-auto">
                View All Invoices
              </Button>
            </div>
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
              <Button variant="secondary" size="sm">
                Schedule a Call
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}