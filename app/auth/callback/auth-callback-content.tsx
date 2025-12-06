'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { authService } from '@/lib/api';

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    // Prevent multiple executions
    if (status !== 'loading') {
      return;
    }

    const handleAuthCallback = async () => {
      try {
        // Get tokens from hash fragment (cross-origin compatible)
        const hash = window.location.hash.substring(1);
        
        // If no hash, check if we're already authenticated
        if (!hash) {
          if (authService.isAuthenticated()) {
            setStatus('success');
            router.replace('/');
            return;
          }
          throw new Error('No authentication data in URL');
        }
        
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get('accessToken');
        const refreshToken = hashParams.get('refreshToken');
        const user = hashParams.get('user');
        
        if (!accessToken || !refreshToken) {
          throw new Error('Missing authentication tokens');
        }

        // Store user data first if provided
        if (user) {
          try {
            const userData = JSON.parse(decodeURIComponent(user));
            authService.saveUser(userData);
          } catch (e) {
            // Silently handle parse error
          }
        }

        // Validate tokens (this also stores them)
        const isValid = await authService.validateTokens(accessToken, refreshToken);
        
        if (!isValid) {
          throw new Error('Invalid authentication tokens');
        }

        setStatus('success');
        
        // Clear sensitive data from URL
        window.history.replaceState({}, document.title, '/auth/callback');
        
        // Redirect immediately using replace to prevent back navigation
        router.replace('/');
        
      } catch (error: any) {
        setError(error.message || 'Authentication failed');
        setStatus('error');
        
        // Redirect to login after error
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [searchParams, router, status]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Authenticating...
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Authentication Successful
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {error}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Redirecting to login...
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}