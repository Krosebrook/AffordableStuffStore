/**
 * Authentication utilities for JWT and refresh tokens
 * Implements OWASP A07:2021 - Identification and Authentication Failures
 * Implements JWT with refresh tokens requirement
 */

/* global fetch, atob, RequestInit */

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
   */
  static setTokens(tokens: TokenPair): void {
    // Store refresh token in httpOnly cookie (server-side) or secure storage
    // For client-side, use localStorage with awareness of XSS risks
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    // In production, refresh token should be httpOnly cookie
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  /**
   * Get access token
   */
  static getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Clear all tokens (logout)
   */
  static clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
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
