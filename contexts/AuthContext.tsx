'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService, apiClient, type User, type LoginCredentials } from '@/lib/api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setAuthFromCallback: (userData: User) => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    console.log('[AuthContext] refreshUser called - fetching /auth/me');
    console.trace('[AuthContext] refreshUser call stack');
    try {
      const userData = await apiClient.get<User>('/auth/me');
      setUser(userData);
      authService.saveUser(userData);
    } catch (error) {
      console.log('[AuthContext] refreshUser error:', error);
      // Silently handle error
    }
  }, []);

  // Use ref to track initialization across renders and strict mode
  const hasInitialized = useRef(false);
  const isInitializing = useRef(false);

  useEffect(() => {
    console.log('[AuthContext] useEffect running, hasInitialized:', hasInitialized.current, 'isInitializing:', isInitializing.current);
    
    // Prevent concurrent initialization
    if (isInitializing.current || hasInitialized.current) {
      console.log('[AuthContext] Already initialized or initializing, skipping');
      return;
    }

    const loadUser = async () => {
      console.log('[AuthContext] Starting loadUser');
      isInitializing.current = true;
      
      try {
        const savedUser = authService.getUser();
        setUser(savedUser);
        
        // Skip refresh on auth pages (login, forgot-password, reset-password)
        const authPages = ['/login', '/forgot-password', '/reset-password'];
        const isAuthPage = authPages.some(page => pathname?.startsWith(page));
        
        console.log('[AuthContext] Pathname:', pathname, 'isAuthPage:', isAuthPage, 'hasUser:', !!savedUser, 'isAuthenticated:', authService.isAuthenticated());
        
        // If we have a saved user and auth token, and we're not on an auth page, refresh from API
        if (savedUser && authService.isAuthenticated() && !isAuthPage) {
          console.log('[AuthContext] Conditions met, calling refreshUser from useEffect');
          await refreshUser();
        }
      } catch (error) {
        console.log('[AuthContext] Error in loadUser:', error);
        // Silently handle error
      } finally {
        setIsLoading(false);
        hasInitialized.current = true;
        isInitializing.current = false;
        console.log('[AuthContext] Initialization complete');
      }
    };

    loadUser();
  }, []); // Empty deps - only run once

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      router.push('/');
    } catch (error: any) {
      setError(error.error || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    // Navigate immediately for better UX
    setUser(null);
    router.push('/login');

    // Handle the API call in the background
    authService.logout().catch(() => {
      // Silently handle error - user is already logged out locally
    });
  }, [router]);

  // Called from auth callback after tokens are stored
  const setAuthFromCallback = useCallback((userData: User) => {
    console.log('[AuthContext] setAuthFromCallback called with user:', userData);
    setUser(userData);
    setIsLoading(false);
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
    setAuthFromCallback,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
}