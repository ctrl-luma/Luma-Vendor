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
      <div className="relative min-h-screen">
        <DesktopNav />
        <div className="pb-16 md:pb-0 md:pt-16">
          {children}
        </div>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </ProtectedRoute>
  );
}