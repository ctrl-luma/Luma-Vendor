"use client";

import React, { useState, useEffect } from "react";
import { MobileHeader } from "@/components/layout/mobile-header";
import {
  Smartphone,
  Apple,
  QrCode,
  CheckCircle2,
  Star,
  Zap,
  Shield,
  Wifi,
  CreditCard,
  Clock,
} from "lucide-react";

// Placeholder URLs - replace with actual app store links
const APP_LINKS = {
  ios: "#",
  android: "#",
};

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process payments in seconds with tap-to-pay technology",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Wifi,
    title: "Works Offline",
    description: "Continue selling even without an internet connection",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your transactions are protected with end-to-end encryption",
    gradient: "from-primary-500 to-primary-700",
  },
  {
    icon: CreditCard,
    title: "All Payment Types",
    description: "Accept cards, Apple Pay, Google Pay, and contactless",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: Clock,
    title: "Real-Time Sync",
    description: "Sales instantly sync across all your devices",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: Star,
    title: "Smart Analytics",
    description: "Track performance with detailed insights and reports",
    gradient: "from-pink-500 to-rose-600",
  },
];

export default function DownloadPage() {
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    const baseUrl = window.location.origin;
    setQrUrl(`${baseUrl}/get`);
  }, []);

  return (
    <div className="min-h-full">
      <MobileHeader title="Download App" />

      <main className="pb-20 md:pb-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
          </div>

          {/* Top gradient line */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

          <div className="container section-padding relative">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Smartphone className="w-4 h-4" />
                Mobile App Available
              </div>

              <h1 className="heading-1 mb-4">
                Take Payments{" "}
                <span className="text-primary">Anywhere</span>
              </h1>

              <p className="text-lead max-w-2xl mx-auto mb-10">
                Download the Luma POS app to accept payments on the go.
                Available for iPhone and Android devices.
              </p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <a
                  href={APP_LINKS.ios}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full sm:w-auto"
                >
                  <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10">
                    <Apple className="w-10 h-10 text-black" />
                    <div className="text-left">
                      <p className="text-xs text-gray-500">Download on the</p>
                      <p className="text-lg font-semibold text-black">App Store</p>
                    </div>
                  </div>
                </a>

                <a
                  href={APP_LINKS.android}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full sm:w-auto"
                >
                  <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-10 h-10 text-black"
                      fill="currentColor"
                    >
                      <path d="M17.523 2.047a.5.5 0 0 0-.7-.047l-2.594 2.264a7.456 7.456 0 0 0-4.458 0L7.177 2a.5.5 0 0 0-.7.047.5.5 0 0 0 .047.7l2.129 1.86A7.5 7.5 0 0 0 4.5 11v.5h15V11a7.5 7.5 0 0 0-4.153-6.393l2.129-1.86a.5.5 0 0 0 .047-.7zM8.5 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM4.5 12.5v7a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-7h-15z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-xs text-gray-500">Get it on</p>
                      <p className="text-lg font-semibold text-black">Google Play</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* QR Code Section */}
        <section className="container pb-12 md:pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="card p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="flex-shrink-0">
                  <div className="bg-white p-4 rounded-xl shadow-inner">
                    {qrUrl ? (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrUrl)}&bgcolor=ffffff&color=000000&margin=0`}
                        alt="Download QR Code"
                        className="w-40 h-40"
                      />
                    ) : (
                      <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded">
                        <QrCode className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="heading-3 mb-2">Scan to Download</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Point your phone's camera at the QR code to download the app
                    instantly. Works with both iPhone and Android.
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Auto-detects your device type</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container pb-12 md:pb-16">
          <div className="text-center mb-10">
            <h2 className="heading-2 mb-4">
              Everything You Need to{" "}
              <span className="text-primary">Sell Anywhere</span>
            </h2>
            <p className="text-lead max-w-2xl mx-auto">
              Powerful features designed for mobile merchants and event vendors
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group card p-6 hover:border-gray-700"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social Proof */}
        <section className="container pb-12 md:pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="card-highlighted p-8 text-center">
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-xl font-semibold text-white mb-2">
                Trusted by thousands of vendors
              </p>
              <p className="text-gray-400">
                Join the growing community of mobile merchants using Luma POS to
                power their businesses
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
