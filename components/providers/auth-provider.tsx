'use client';

import { useEffect } from 'react';
import { setupAuthInterceptor } from '@/lib/api/interceptor';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupAuthInterceptor();
  }, []);

  return <>{children}</>;
}