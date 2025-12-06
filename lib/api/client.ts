type ApiError = {
  error: string;
  statusCode?: number;
  details?: any;
};

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private async handleResponse<T>(response: Response, endpoint: string, retryCount: number = 0): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        error: 'Request failed',
        statusCode: response.status,
      };

      try {
        const data = await response.json();
        error.error = data.error || data.message || 'Request failed';
        error.details = data;
      } catch {
        error.error = `Request failed with status ${response.status}`;
      }

      // If we get a 401 and haven't retried yet, try to refresh the token
      if (response.status === 401 && retryCount === 0 && endpoint !== '/auth/refresh') {
        try {
          const { authService } = await import('./auth');
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (refreshToken) {
            const tokens = await authService.refreshTokens();
            if (tokens) {
              // Retry the original request
              return this.retryRequest<T>(endpoint, retryCount + 1);
            }
          }
        } catch (refreshError) {
          // Silently handle refresh error
        }
      }

      throw error;
    }

    try {
      return await response.json();
    } catch {
      return {} as T;
    }
  }

  private async retryRequest<T>(endpoint: string, retryCount: number): Promise<T> {
    // This is a simplified retry - in practice, you'd want to store the original request details
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<T>(response, endpoint, retryCount);
  }

  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers: Record<string, string> = {
      ...this.defaultHeaders as Record<string, string>,
      ...customHeaders as Record<string, string>,
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(options?.headers);
    
    const response = await fetch(url, {
      ...options,
      method: 'GET',
      headers,
    });
    
    return this.handleResponse<T>(response, endpoint);
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: this.getHeaders(options?.headers),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response, endpoint);
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      method: 'PUT',
      headers: this.getHeaders(options?.headers),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response, endpoint);
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      method: 'DELETE',
      headers: this.getHeaders(options?.headers),
    });

    return this.handleResponse<T>(response, endpoint);
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      method: 'PATCH',
      headers: this.getHeaders(options?.headers),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response, endpoint);
  }
}

export const apiClient = new ApiClient();
export type { ApiError };