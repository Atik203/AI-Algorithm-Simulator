import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";
const AUTH_API_URL = `${API_URL}/auth`;

// Token storage keys
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user?: User;
}

class AuthService {
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  // Token management
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(access: string, refresh: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Auth API calls
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await axios.post<AuthResponse>(
        `${AUTH_API_URL}/login/`,
        credentials
      );

      const { access, refresh, user } = response.data;
      this.setTokens(access, refresh);

      // If user data is not in response, fetch it
      const userData = user ?? (await this.fetchCurrentUser());
      this.setUser(userData);

      return userData;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.detail || "Invalid credentials";
        throw new Error(message);
      }
      throw new Error("Login failed. Please try again.");
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      const response = await axios.post<AuthResponse & { user: User }>(
        `${AUTH_API_URL}/register/`,
        data
      );

      const { access, refresh, user } = response.data;
      this.setTokens(access, refresh);
      this.setUser(user);

      return user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errors = error.response.data;
        // Handle validation errors
        if (typeof errors === "object") {
          const firstError = Object.values(errors)[0];
          const message = Array.isArray(firstError)
            ? firstError[0]
            : firstError;
          throw new Error(message as string);
        }
        throw new Error("Registration failed");
      }
      throw new Error("Registration failed. Please try again.");
    }
  }

  async logout(): Promise<void> {
    this.clearTokens();
    // Optional: Call backend to blacklist refresh token
    // await axios.post(`${AUTH_API_URL}/logout/`, { refresh: this.getRefreshToken() });
  }

  async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.post<{ access: string; refresh?: string }>(
        `${AUTH_API_URL}/refresh/`,
        { refresh: refreshToken }
      );

      const { access, refresh: newRefresh } = response.data;

      // Update tokens (some configs rotate refresh tokens)
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      if (newRefresh) {
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh);
      }

      return access;
    } catch (error) {
      this.clearTokens();
      throw new Error("Session expired. Please login again.");
    }
  }

  async fetchCurrentUser(): Promise<User> {
    const response = await axios.get<User>(`${AUTH_API_URL}/me/`, {
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`,
      },
    });
    this.setUser(response.data);
    return response.data;
  }

  // Queue management for token refresh
  private subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  private onTokenRefreshed(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  // Axios interceptor for automatic token injection and refresh
  setupInterceptors(axiosInstance: AxiosInstance): void {
    // Request interceptor - add token to headers
    axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle 401 and refresh token
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // If error is 401 and we haven't retried yet
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          if (this.isRefreshing) {
            // Wait for the token refresh to complete
            return new Promise((resolve) => {
              this.subscribeTokenRefresh((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(axiosInstance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAccessToken();
            this.isRefreshing = false;
            this.onTokenRefreshed(newToken);

            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            this.isRefreshing = false;
            this.clearTokens();
            // Redirect to login page
            window.location.href = "/";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

// Export singleton instance
export const authService = new AuthService();
