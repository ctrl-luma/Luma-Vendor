'use client';

import { ProtectedRoute } from '@/components/providers/protected-route';
import { MobileNav } from '@/components/layout/mobile-nav';
import { DesktopNav } from '@/components/layout/desktop-nav';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col">
        {/* Top glow effect - matches marketing site */}
        <div className="absolute top-0 left-0 right-0 z-[60] pointer-events-none hidden md:block">
          <div className="h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[150px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent z-30 pointer-events-none hidden md:block" />

        <DesktopNav />
        <div className="flex-1 pb-16 md:pb-0 md:pt-20">
          {children}
        </div>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </ProtectedRoute>
  );
}