'use client';

import { useEffect } from 'react';
import { setupAuthInterceptor } from '@/lib/api/interceptor';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { StripeConnectProvider } from '@/contexts/StripeConnectContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupAuthInterceptor();
  }, []);

  return (
    <AuthContextProvider>
      <StripeConnectProvider>
        {children}
      </StripeConnectProvider>
    </AuthContextProvider>
  );
}