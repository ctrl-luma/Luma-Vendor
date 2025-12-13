'use client';

import { useEffect } from 'react';
import { setupAuthInterceptor } from '@/lib/api/interceptor';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { StripeConnectProvider } from '@/contexts/StripeConnectContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupAuthInterceptor();
  }, []);

  return (
    <AuthContextProvider>
      <SocketProvider>
        <StripeConnectProvider>
          {children}
        </StripeConnectProvider>
      </SocketProvider>
    </AuthContextProvider>
  );
}