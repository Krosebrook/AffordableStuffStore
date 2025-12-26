/**
 * Security utilities for logging, sanitization, and XSS prevention
 * Implements OWASP A09:2021 - Security Logging and Monitoring Failures
 * Implements OWASP A03:2021 - Injection prevention
 */

/* eslint-disable no-console */
/* global console */

/**
 * Sensitive data patterns to redact from logs
 */
const SENSITIVE_PATTERNS = [
  /password/gi,
  /token/gi,
  /secret/gi,
  /api[_-]?key/gi,
  /access[_-]?token/gi,
  /refresh[_-]?token/gi,
  /authorization/gi,
  /credit[_-]?card/gi,
  /ssn/gi,
  /social[_-]?security/gi,
];

/**
 * Email pattern for redaction
 */
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

/**
 * Credit card pattern for redaction
 */
const CREDIT_CARD_PATTERN = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;

/**
 * JWT token pattern for redaction
 */
const JWT_PATTERN = /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g;

/**
 * Sanitize log data to prevent secret exposure
 * Implements "No secrets in logs" requirement
 */
export function sanitizeForLog(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "string") {
    return sanitizeString(data);
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeForLog);
  }

  if (typeof data === "object") {
    const sanitized: any = {};

    for (const [key, value] of Object.entries(data)) {
      // Redact sensitive keys
      if (isSensitiveKey(key)) {
        sanitized[key] = "***REDACTED***";
      } else {
        sanitized[key] = sanitizeForLog(value);
      }
    }

    return sanitized;
  }

  return data;
}

/**
 * Check if a key name indicates sensitive data
 */
function isSensitiveKey(key: string): boolean {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(key));
}

/**
 * Sanitize a string value
 */
function sanitizeString(str: string): string {
  let sanitized = str;

  // Redact emails (partially)
  sanitized = sanitized.replace(EMAIL_PATTERN, (email) => {
    const parts = email.split("@");

    if (parts.length !== 2) return "***@invalid";

    const [local, domain] = parts;
    const maskedLocal =
      local.length >= 2 ? local.substring(0, 2) + "***" : "***";

    return `${maskedLocal}@${domain}`;
  });

  // Redact credit card numbers
  sanitized = sanitized.replace(CREDIT_CARD_PATTERN, "****-****-****-****");

  // Redact JWT tokens
  sanitized = sanitized.replace(JWT_PATTERN, "***JWT_TOKEN_REDACTED***");

  return sanitized;
}

/**
 * Secure logger that sanitizes all output
 */
export class SecureLogger {
  private context: string;

  constructor(context: string = "App") {
    this.context = context;
  }

  private log(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const sanitizedData = data ? sanitizeForLog(data) : undefined;

    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      ...(sanitizedData && { data: sanitizedData }),
    };

    // In production, send to logging service
    const logMethod =
      level === "error"
        ? console.error
        : level === "warn"
          ? console.warn
          : level === "info"
            ? console.info
            : console.log;

    logMethod(JSON.stringify(logEntry));
  }

  info(message: string, data?: any) {
    this.log("info", message, data);
  }

  warn(message: string, data?: any) {
    this.log("warn", message, data);
  }

  error(message: string, data?: any) {
    this.log("error", message, data);
  }

  debug(message: string, data?: any) {
    if (import.meta.env.DEV) {
      this.log("debug", message, data);
    }
  }

  /**
   * Log security events (authentication, authorization, etc.)
   */
  security(event: string, data?: any) {
    this.log("info", `[SECURITY] ${event}`, data);
  }

  /**
   * Log audit trail events
   */
  audit(action: string, userId?: string, orgId?: string, data?: any) {
    this.log("info", `[AUDIT] ${action}`, {
      userId,
      orgId,
      ...data,
    });
  }
}

/**
 * HTML escape to prevent XSS
 * Implements OWASP A03:2021 - Injection prevention
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sanitize user input for display
 * Removes potentially dangerous HTML/JavaScript
 */
export function sanitizeUserInput(input: string): string {
  // Remove script tags and event handlers
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "");

  // Escape remaining HTML
  sanitized = escapeHtml(sanitized);

  return sanitized;
}

/**
 * Content Security Policy configuration
 */
export const CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'"], // Consider removing unsafe-inline in production
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "img-src": ["'self'", "data:", "https:"],
  "connect-src": ["'self'"],
  "frame-ancestors": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
};

/**
 * Generate CSP header string
 */
export function generateCSPHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
}

/**
 * Security headers configuration for Vite/deployment
 */
export const SECURITY_HEADERS = {
  "Content-Security-Policy": generateCSPHeader(),
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
};

/**
 * Rate limiting tracker (client-side)
 * Server-side rate limiting should be implemented on the API
 */
export class RateLimitTracker {
  private requests: Map<string, number[]> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit: number = 100, windowMs: number = 3600000) {
    // Default: 100 requests per hour
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // Filter out expired requests
    const validRequests = requests.filter((time) => now - time < this.windowMs);

    if (validRequests.length >= this.limit) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);

    return true;
  }

  /**
   * Get remaining requests
   */
  getRemaining(key: string): number {
    const requests = this.requests.get(key) || [];
    const now = Date.now();
    const validRequests = requests.filter((time) => now - time < this.windowMs);

    return Math.max(0, this.limit - validRequests.length);
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.requests.delete(key);
  }
}

/**
 * Create a default rate limiter instance
 */
export const defaultRateLimiter = new RateLimitTracker();

/**
 * Validate URL to prevent SSRF
 * Implements OWASP A10:2021 - Server-Side Request Forgery
 */
export function isUrlSafe(url: string, allowedDomains: string[] = []): boolean {
  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }

    // Block private/internal IP ranges
    const hostname = parsed.hostname;

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.16.") ||
      hostname === "169.254.169.254" // AWS metadata endpoint
    ) {
      return false;
    }

    // If allowlist provided, check domain
    if (allowedDomains.length > 0) {
      return allowedDomains.some((domain) => hostname.endsWith(domain));
    }

    return true;
  } catch {
    return false;
  }
}
