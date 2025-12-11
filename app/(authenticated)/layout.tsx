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
      <div className="h-screen flex flex-col">
        <DesktopNav />
        <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </div>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </ProtectedRoute>
  );
}