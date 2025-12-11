import { apiClient } from './client';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  organizationId: string;
  role: string;
  cognitoUsername?: string;
  emailAlerts?: boolean;
  marketingEmails?: boolean;
  weeklyReports?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

class AuthService {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly USER_KEY = 'user';

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    // Extract Cognito username from the access token
    if (response.tokens.accessToken) {
      try {
        const tokenParts = response.tokens.accessToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const cognitoUsername = payload['cognito:username'] || payload.username;
          if (cognitoUsername) {
            response.user.cognitoUsername = cognitoUsername;
          }
        }
      } catch (error) {
      }
    }
    
    this.saveAuthData(response);
    
    return response;
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    
    // Clear auth data immediately for instant logout
    this.clearAuthData();
    
    // If we have a refresh token, try to invalidate it on the server
    // This happens in the background and won't block the user
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken });
      } catch (error) {
        // Silently handle error - user is already logged out locally
      }
    }
  }

  async refreshTokens(): Promise<AuthTokens | null> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();
    
    if (!refreshToken) {
      return null;
    }

    let cognitoUsername: string | undefined;
    
    // First try to get stored Cognito username from user object
    const user = this.getUser();
    if (user?.cognitoUsername) {
      cognitoUsername = user.cognitoUsername;
    } else if (accessToken) {
      // Try to extract Cognito username from the access token
      try {
        const tokenParts = accessToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          cognitoUsername = payload['cognito:username'] || payload.username || payload.email;
        }
      } catch (error) {
      }
    }

    try {
      
      const tokens = await apiClient.post<AuthTokens>('/auth/refresh', {
        refreshToken,
        username: cognitoUsername, // Send Cognito username for SECRET_HASH calculation
      });
      
      
      this.saveTokens(tokens);
      
      return tokens;
    } catch (error: any) {
      this.clearAuthData();
      throw error;
    }
  }

  async checkEmailAvailability(email: string): Promise<{ inUse: boolean }> {
    return await apiClient.post('/auth/check-email', { email });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', {
      token,
      password: newPassword,
    });
  }

  async updateNotificationPreferences(preferences: {
    emailAlerts?: boolean;
    marketingEmails?: boolean;
    weeklyReports?: boolean;
  }): Promise<{
    emailAlerts: boolean;
    marketingEmails: boolean;
    weeklyReports: boolean;
  }> {
    return await apiClient.patch('/auth/notification-preferences', preferences);
  }


  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AuthService.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AuthService.REFRESH_TOKEN_KEY);
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem(AuthService.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  async validateTokens(accessToken: string, refreshToken: string): Promise<boolean> {
    console.log('[AuthService] validateTokens called');
    try {
      // Store tokens temporarily
      const originalAccessToken = this.getAccessToken();
      const originalRefreshToken = this.getRefreshToken();
      
      // Set the tokens to validate
      localStorage.setItem(AuthService.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(AuthService.REFRESH_TOKEN_KEY, refreshToken);
      console.log('[AuthService] Tokens set in localStorage');
      
      // Try to get user info with the provided token
      console.log('[AuthService] Fetching user info to validate tokens');
      const response = await apiClient.get('/auth/me');
      console.log('[AuthService] User info fetched successfully, tokens are valid');
      
      // If successful, the tokens are valid
      return true;
    } catch (error: any) {
      console.log('[AuthService] Token validation failed:', error);
      // If failed, restore original tokens
      this.clearAuthData();
      return false;
    }
  }

  setTokens(tokens: AuthTokens): void {
    this.saveTokens(tokens);
  }

  saveUser(user: User): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
  }

  private saveAuthData(response: LoginResponse): void {
    this.saveTokens(response.tokens);
    this.saveUser(response.user);
  }

  private saveTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(AuthService.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(AuthService.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  private clearAuthData(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(AuthService.ACCESS_TOKEN_KEY);
    localStorage.removeItem(AuthService.REFRESH_TOKEN_KEY);
    localStorage.removeItem(AuthService.USER_KEY);
  }
}

export const authService = new AuthService();