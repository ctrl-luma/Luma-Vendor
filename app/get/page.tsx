"use client";

import React, { useEffect, useState } from "react";
import { Smartphone, Apple, Loader2 } from "lucide-react";

// Placeholder URLs - replace with actual app store links
const APP_LINKS = {
  ios: "#",
  android: "#",
  fallback: "/download",
};

type DeviceType = "ios" | "android" | "unknown";

function detectDevice(): DeviceType {
  if (typeof window === "undefined") return "unknown";

  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "ios";
  }

  if (/android/i.test(userAgent)) {
    return "android";
  }

  return "unknown";
}

export default function GetAppPage() {
  const [device, setDevice] = useState<DeviceType>("unknown");
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const detectedDevice = detectDevice();
    setDevice(detectedDevice);

    if (detectedDevice === "ios" && APP_LINKS.ios !== "#") {
      window.location.href = APP_LINKS.ios;
    } else if (detectedDevice === "android" && APP_LINKS.android !== "#") {
      window.location.href = APP_LINKS.android;
    } else {
      setIsRedirecting(false);
    }
  }, []);

  if (isRedirecting && device !== "unknown") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-400">
            Redirecting to {device === "ios" ? "App Store" : "Google Play"}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full relative">
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-700 text-white mb-6 shadow-xl shadow-primary/25">
            <Smartphone className="w-10 h-10" />
          </div>
          <h1 className="heading-2 mb-3">Get Luma POS</h1>
          <p className="text-gray-400">Download the app for your device</p>
        </div>

        {/* Download Buttons */}
        <div className="space-y-4">
          <a
            href={APP_LINKS.ios}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10">
              <Apple className="w-12 h-12 text-black" />
              <div className="text-left flex-1">
                <p className="text-xs text-gray-500">Download on the</p>
                <p className="text-xl font-semibold text-black">App Store</p>
              </div>
              {device === "ios" && (
                <span className="text-xs bg-primary text-white px-3 py-1 rounded-full font-medium">
                  Recommended
                </span>
              )}
            </div>
          </a>

          <a
            href={APP_LINKS.android}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10">
              <svg
                viewBox="0 0 24 24"
                className="w-12 h-12 text-black"
                fill="currentColor"
              >
                <path d="M17.523 2.047a.5.5 0 0 0-.7-.047l-2.594 2.264a7.456 7.456 0 0 0-4.458 0L7.177 2a.5.5 0 0 0-.7.047.5.5 0 0 0 .047.7l2.129 1.86A7.5 7.5 0 0 0 4.5 11v.5h15V11a7.5 7.5 0 0 0-4.153-6.393l2.129-1.86a.5.5 0 0 0 .047-.7zM8.5 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM4.5 12.5v7a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-7h-15z" />
              </svg>
              <div className="text-left flex-1">
                <p className="text-xs text-gray-500">Get it on</p>
                <p className="text-xl font-semibold text-black">Google Play</p>
              </div>
              {device === "android" && (
                <span className="text-xs bg-primary text-white px-3 py-1 rounded-full font-medium">
                  Recommended
                </span>
              )}
            </div>
          </a>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-10">
          Scan the QR code or visit this page on your mobile device for the best
          experience.
        </p>
      </div>
    </div>
  );
}
