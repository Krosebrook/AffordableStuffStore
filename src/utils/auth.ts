/**
 * Authentication utilities for JWT and refresh tokens
 * Implements OWASP A07:2021 - Identification and Authentication Failures
 * Implements JWT with refresh tokens requirement
 */

/* global fetch, atob, RequestInit, sessionStorage, console */
/* eslint-disable no-console */

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedToken {
  userId: string;
  orgId: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
}

/**
 * Token storage keys
 */
const ACCESS_TOKEN_KEY = "flash_fusion_access_token";
const REFRESH_TOKEN_KEY = "flash_fusion_refresh_token";

/**
 * Token Manager
 * Handles storing, retrieving, and managing JWT tokens
 */
export class TokenManager {
  /**
   * Store token pair in secure storage
   *
   * SECURITY NOTE: This implementation uses localStorage for demonstration.
   * In production, you should:
   * 1. Store refresh tokens in httpOnly, Secure, SameSite cookies (backend-managed)
   * 2. Use sessionStorage for access tokens to limit XSS exposure window
   * 3. Implement additional XSS protection (CSP, input sanitization)
   *
   * Example production cookie setup (backend):
   * res.cookie('refreshToken', token, {
   *   httpOnly: true,
   *   secure: true,
   *   sameSite: 'strict',
   *   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
   * });
   */
  static setTokens(tokens: TokenPair): void {
    // Use sessionStorage for access token (cleared on tab close)
    sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);

    // In production, refresh token should ONLY be in httpOnly cookie
    // For demo purposes only - DO NOT use in production without proper XSS protection
    if (import.meta.env.DEV) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    } else {
      // In production, rely on httpOnly cookie for refresh token
      console.warn(
        "Refresh token should be managed via httpOnly cookies in production",
      );
    }
  }

  /**
   * Get access token
   */
  static getAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token
   * In production, this should retrieve from httpOnly cookie via API call
   */
  static getRefreshToken(): string | null {
    if (import.meta.env.DEV) {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    // In production, refresh token is in httpOnly cookie
    // Backend will automatically include it in refresh requests
    return null;
  }

  /**
   * Clear all tokens (logout)
   */
  static clearTokens(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    if (import.meta.env.DEV) {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    // In production, also call backend to clear httpOnly cookie
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();

    if (!token) return false;

    try {
      const decoded = this.decodeToken(token);

      return !this.isTokenExpired(decoded);
    } catch {
      return false;
    }
  }

  /**
   * Decode JWT token (client-side basic decode, not verification)
   * Note: Token verification should be done server-side
   */
  static decodeToken(token: string): DecodedToken {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );

      return JSON.parse(jsonPayload);
    } catch {
      throw new Error("Invalid token format");
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(decoded: DecodedToken): boolean {
    const now = Date.now() / 1000;

    return decoded.exp < now;
  }

  /**
   * Get user info from token
   */
  static getUserInfo(): DecodedToken | null {
    const token = this.getAccessToken();

    if (!token) return null;

    try {
      return this.decodeToken(token);
    } catch {
      return null;
    }
  }
}

/**
 * API client with automatic token refresh
 */
export class AuthenticatedApiClient {
  private baseUrl: string;
  private refreshing: Promise<TokenPair> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make authenticated API request
   */
  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let token = TokenManager.getAccessToken();

    // If token is expired, refresh it
    if (token) {
      try {
        const decoded = TokenManager.decodeToken(token);

        if (TokenManager.isTokenExpired(decoded)) {
          const tokens = await this.refreshAccessToken();

          token = tokens.accessToken;
        }
      } catch {
        // Invalid token, try to refresh
        const tokens = await this.refreshAccessToken();

        token = tokens.accessToken;
      }
    }

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // If unauthorized, try to refresh token and retry
    if (response.status === 401) {
      const tokens = await this.refreshAccessToken();

      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${tokens.accessToken}`,
      };

      const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: retryHeaders,
      });

      if (!retryResponse.ok) {
        throw new Error(`API error: ${retryResponse.statusText}`);
      }

      return retryResponse.json();
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<TokenPair> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshing) {
      return this.refreshing;
    }

    const refreshToken = TokenManager.getRefreshToken();

    if (!refreshToken) {
      TokenManager.clearTokens();
      throw new Error("No refresh token available");
    }

    this.refreshing = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          TokenManager.clearTokens();
          throw new Error("Token refresh failed");
        }

        const tokens: TokenPair = await response.json();

        TokenManager.setTokens(tokens);

        return tokens;
      } finally {
        this.refreshing = null;
      }
    })();

    return this.refreshing;
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<TokenPair> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const tokens: TokenPair = await response.json();

    TokenManager.setTokens(tokens);

    return tokens;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    const refreshToken = TokenManager.getRefreshToken();

    try {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
    } finally {
      TokenManager.clearTokens();
    }
  }
}

/**
 * Create default API client
 * Base URL should be configured via environment variable
 */
export const createApiClient = () => {
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  return new AuthenticatedApiClient(baseUrl);
};
