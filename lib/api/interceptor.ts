import { authService } from './auth';

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export function setupAuthInterceptor() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const response = await originalFetch(input, init);

    if (response.status === 401 && !isRefreshing) {
      const url = input instanceof Request ? input.url : input.toString();
      
      // Don't attempt refresh for auth endpoints
      const authEndpoints = ['/auth/refresh', '/auth/login', '/auth/forgot-password', '/auth/reset-password'];
      const isAuthEndpoint = authEndpoints.some(endpoint => url.includes(endpoint));
      
      if (!isAuthEndpoint) {
        isRefreshing = true;

        if (!refreshPromise) {
          refreshPromise = authService.refreshTokens()
            .then(() => {
              isRefreshing = false;
              refreshPromise = null;
            })
            .catch((error) => {
              isRefreshing = false;
              refreshPromise = null;
              
              authService.logout();
              window.location.href = '/login';
              
              throw error;
            });
        }

        try {
          await refreshPromise;
          
          const newInit = { ...init };
          if (newInit.headers instanceof Headers) {
            newInit.headers.set('Authorization', `Bearer ${authService.getAccessToken()}`);
          } else if (Array.isArray(newInit.headers)) {
            newInit.headers = [...newInit.headers, ['Authorization', `Bearer ${authService.getAccessToken()}`]];
          } else {
            newInit.headers = {
              ...newInit.headers,
              'Authorization': `Bearer ${authService.getAccessToken()}`,
            };
          }
          
          return originalFetch(input, newInit);
        } catch (error) {
          throw error;
        }
      }
    }

    return response;
  };
}