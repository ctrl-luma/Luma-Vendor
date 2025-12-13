'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { authService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthFromCallback } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    // Prevent multiple executions
    if (status !== 'loading') {
      console.log('[AuthCallback] Skipping - status is:', status);
      return;
    }

    const handleAuthCallback = async () => {
      try {
        console.log('[AuthCallback] Starting auth callback handler');
        console.log('[AuthCallback] Full URL:', window.location.href);
        console.log('[AuthCallback] Hash:', window.location.hash);

        // Get tokens from hash fragment (cross-origin compatible)
        const hash = window.location.hash.substring(1);
        console.log('[AuthCallback] Parsed hash:', hash ? 'has content' : 'empty');

        // If no hash, check if we're already authenticated
        if (!hash) {
          console.log('[AuthCallback] No hash found, checking if already authenticated');
          if (authService.isAuthenticated()) {
            console.log('[AuthCallback] Already authenticated, redirecting to home');
            setStatus('success');
            router.replace('/');
            return;
          }
          console.log('[AuthCallback] Not authenticated, throwing error');
          throw new Error('No authentication data in URL');
        }

        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get('accessToken');
        const refreshToken = hashParams.get('refreshToken');
        const user = hashParams.get('user');

        console.log('[AuthCallback] Tokens found:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasUser: !!user
        });

        if (!accessToken || !refreshToken) {
          throw new Error('Missing authentication tokens');
        }

        // Parse user data
        let userData = null;
        if (user) {
          try {
            userData = JSON.parse(decodeURIComponent(user));
            console.log('[AuthCallback] Parsed user data:', userData);
            authService.saveUser(userData);
          } catch (e) {
            console.error('[AuthCallback] Failed to parse user data:', e);
          }
        }

        // Validate tokens (this also stores them)
        console.log('[AuthCallback] Validating tokens...');
        const isValid = await authService.validateTokens(accessToken, refreshToken);
        console.log('[AuthCallback] Token validation result:', isValid);

        if (!isValid) {
          throw new Error('Invalid authentication tokens');
        }

        // Update AuthContext with the user data
        if (userData) {
          console.log('[AuthCallback] Updating AuthContext with user data');
          setAuthFromCallback(userData);
        }

        setStatus('success');
        console.log('[AuthCallback] Success! Redirecting to home...');

        // Clear sensitive data from URL
        window.history.replaceState({}, document.title, '/auth/callback');

        // Redirect immediately using replace to prevent back navigation
        router.replace('/');

      } catch (error: any) {
        console.error('[AuthCallback] Error:', error);
        setError(error.message || 'Authentication failed');
        setStatus('error');

        // Redirect to login after error
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [searchParams, router, status, setAuthFromCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="card p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Authenticating...
              </h2>
              <p className="text-gray-400">
                Please wait while we log you in
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Authentication Successful
              </h2>
              <p className="text-gray-400">
                Redirecting to your dashboard...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <XCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-400 mb-2">
                {error}
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login...
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
