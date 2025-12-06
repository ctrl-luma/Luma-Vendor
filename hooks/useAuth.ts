import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService, apiClient, type User, type LoginCredentials } from '@/lib/api';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const userData = await apiClient.get<User>('/auth/me');
      setUser(userData);
      authService.saveUser(userData);
    } catch (error) {
      // Silently handle error
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = authService.getUser();
        setUser(savedUser);
        
        // If we have a saved user and auth token, refresh from API
        if (savedUser && authService.isAuthenticated()) {
          await refreshUser();
        }
      } catch (error) {
        // Silently handle error
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [refreshUser]);

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
    setIsLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      // Silently handle error
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
    error,
  };
}