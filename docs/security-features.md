# FlashFusion Security & Compliance Features

This document provides an overview of the security and compliance features implemented in the AffordableStuffStore application as part of the FlashFusion Security & Compliance specification.

## Quick Links

- [Security Policy](../SECURITY.md) - Complete security policy with OWASP Top 10 compliance
- [Database Schema](database-schema.md) - RLS policies and audit trail implementation
- [API Specification](api-specification.md) - API documentation with security features
- [STRIDE Threat Model](stride-threat-model.md) - Threat modeling framework
- [Incident Response](incident-response.md) - Incident response procedures and SLAs

## Features Implemented

### ✅ Input Validation (Zod Schemas)

All user inputs are validated using Zod schemas to prevent injection attacks:

```typescript
import { LoginUserSchema, validateData } from '@/utils/validation';

// Validate login input
const result = validateData(LoginUserSchema, {
  email: userInput.email,
  password: userInput.password
});

if (!result.success) {
  // Handle validation errors
  console.error(result.errors);
}
```

**Available Schemas:**
- `RegisterUserSchema` - User registration
- `LoginUserSchema` - User login
- `ContactFormSchema` - Contact forms
- `SearchQuerySchema` - Search queries
- `ProductSchema` - Product data
- `ValidationPatterns` - Reusable validation patterns

### ✅ Secure Logging (No Secrets)

All logs are automatically sanitized to prevent secret exposure:

```typescript
import { SecureLogger } from '@/utils/security';

const logger = new SecureLogger('MyComponent');

// Logs are automatically sanitized
logger.info('User logged in', {
  email: 'user@example.com',  // Partially redacted
  password: 'secret123',      // Redacted
  token: 'jwt...',            // Redacted
});

// Security events
logger.security('Failed login attempt', { ip: '192.168.1.1' });

// Audit trail
logger.audit('User updated profile', userId, orgId, { field: 'email' });
```

### ✅ JWT Authentication with Refresh Tokens

Complete JWT authentication system with token rotation:

```typescript
import { TokenManager, createApiClient } from '@/utils/auth';

// Login
const apiClient = createApiClient();
const tokens = await apiClient.login('user@example.com', 'password');

// Make authenticated requests (automatic token refresh)
const data = await apiClient.fetch('/api/products');

// Logout
await apiClient.logout();

// Check authentication status
const isAuthenticated = TokenManager.isAuthenticated();
const userInfo = TokenManager.getUserInfo();
```

### ✅ Rate Limiting

Client-side rate limiting tracker (backend enforcement documented):

```typescript
import { RateLimitTracker } from '@/utils/security';

const rateLimiter = new RateLimitTracker(100, 3600000); // 100 req/hour

if (rateLimiter.isAllowed(userId)) {
  // Proceed with request
} else {
  // Rate limit exceeded
  const remaining = rateLimiter.getRemaining(userId);
  console.log(`Rate limit exceeded. Try again later. Remaining: ${remaining}`);
}
```

### ✅ XSS Prevention

Utilities to sanitize user input and prevent XSS attacks:

```typescript
import { escapeHtml, sanitizeUserInput } from '@/utils/security';

// Escape HTML
const safe = escapeHtml('<script>alert("xss")</script>');
// Output: &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;

// Sanitize user input
const sanitized = sanitizeUserInput('User comment <script>bad()</script>');
// Removes script tags and event handlers
```

### ✅ SSRF Prevention

URL validation to prevent Server-Side Request Forgery:

```typescript
import { isUrlSafe } from '@/utils/security';

const url = 'http://192.168.1.1/admin'; // Internal IP
if (!isUrlSafe(url)) {
  throw new Error('URL not allowed');
}

// With domain whitelist
const allowed = isUrlSafe('https://api.example.com', ['example.com', 'api.example.com']);
```

### ✅ Security Headers

Security headers configured for all responses:

**Development/Preview (Vite):**
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy

**Production (Vercel):**
- All above headers plus:
- Strict-Transport-Security (HSTS)
- X-XSS-Protection

### ✅ Database Security

**Row-Level Security (RLS):**
- All tables have RLS policies
- Organization isolation via `org_id` scoping
- User-level isolation where appropriate

**Audit Trail:**
- Automatic logging of all data modifications
- Tracks: user, timestamp, old/new values, IP, user agent
- Immutable audit logs

See [database-schema.md](database-schema.md) for complete schema.

### ✅ Encryption

**TLS 1.3:**
- Minimum TLS version enforced
- Strong cipher suites (AES-256)

**At Rest:**
- AES-256 encryption for sensitive data
- bcrypt (12+ rounds) for passwords
- Token hashing before storage

### ✅ CI/CD Pipeline

Comprehensive GitHub Actions workflow:

1. **Lint** - ESLint code quality checks
2. **Security Scan** - npm audit, Snyk, CodeQL
3. **Test** - Unit tests with coverage
4. **Build** - Production build
5. **E2E** - End-to-end tests
6. **Lighthouse** - Performance and security audits
7. **Deploy** - Automated deployment

### ✅ Incident Response

Incident severity levels with defined SLAs:

| Priority | Response Time | Description |
|----------|--------------|-------------|
| P0 | < 5 minutes | Critical security breach, system down |
| P1 | < 15 minutes | Major functionality broken, significant security issue |
| P2 | < 1 hour | Important feature degraded, moderate security concern |
| P3 | < 24 hours | Minor issues, low-priority security findings |

See [incident-response.md](incident-response.md) for complete procedures.

### ✅ STRIDE Threat Modeling

All new features must complete STRIDE analysis:

- **S**poofing - Identity verification
- **T**ampering - Data integrity
- **R**epudiation - Non-repudiable logging
- **I**nformation Disclosure - Access controls
- **D**enial of Service - Rate limiting
- **E**levation of Privilege - Authorization checks

See [stride-threat-model.md](stride-threat-model.md) for template and examples.

## OWASP Top 10 Compliance

| Category | Status | Implementation |
|----------|--------|----------------|
| A01: Broken Access Control | ✅ | RLS policies, JWT auth, RBAC |
| A02: Cryptographic Failures | ✅ | TLS 1.3, AES-256, bcrypt |
| A03: Injection | ✅ | Zod validation, parameterized queries |
| A04: Insecure Design | ✅ | STRIDE threat modeling |
| A05: Security Misconfiguration | ✅ | Security headers, dependency scanning |
| A06: Vulnerable Components | ✅ | Automated updates, npm audit |
| A07: Authentication Failures | ✅ | JWT + refresh tokens, rate limiting |
| A08: Data Integrity Failures | ✅ | Audit trail, digital signatures |
| A09: Logging Failures | ✅ | Secure logging, log sanitization |
| A10: SSRF | ✅ | URL validation, domain whitelisting |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.yourapp.com

# Security
VITE_JWT_SECRET=your-secure-secret-here
ENCRYPTION_KEY=your-256-bit-encryption-key

# Database (Backend)
DATABASE_URL=postgresql://...?sslmode=require&sslminprotocolversion=TLSv1.3
```

**Never commit `.env` to version control!**

## Usage Examples

### Protecting a Route

```typescript
import { TokenManager } from '@/utils/auth';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  if (!TokenManager.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
}
```

### Validating Form Input

```typescript
import { ContactFormSchema, validateData } from '@/utils/validation';

function ContactForm() {
  const handleSubmit = (data) => {
    const result = validateData(ContactFormSchema, data);
    
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    
    // Submit validated data
    submitForm(result.data);
  };
}
```

### Secure API Request

```typescript
import { createApiClient } from '@/utils/auth';
import { SecureLogger } from '@/utils/security';

const logger = new SecureLogger('API');
const apiClient = createApiClient();

try {
  const products = await apiClient.fetch('/products');
  logger.info('Products fetched successfully');
} catch (error) {
  logger.error('Failed to fetch products', { error: error.message });
}
```

## Testing

### Run Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Lint
npm run lint

# Build
npm run build
```

### Security Testing

The CI/CD pipeline automatically runs:
- ESLint for code quality
- npm audit for dependency vulnerabilities
- CodeQL for security vulnerabilities
- Snyk for comprehensive security scanning

## Deployment

### GitHub Pages

Automatic deployment on push to `main`:

```bash
git push origin main
```

### Other Platforms

Security headers are configured in:
- `vite.config.ts` - Development server
- `vercel.json` - Vercel deployment
- Add similar configuration for other platforms

## Monitoring

Key security metrics to monitor:

- **Failed authentication attempts** - Potential brute force
- **Rate limit violations** - Potential DoS attacks
- **Validation errors** - Potential injection attempts
- **Audit trail** - Data modification tracking
- **Error rates** - Application health

## Support

For security issues:
1. Do NOT open public issues
2. Report via GitHub Security Advisories
3. Contact security team privately

For questions:
- See documentation in `/docs`
- Review code examples in `/src/utils`
- Check SECURITY.md for policies

## License

MIT License - See LICENSE file for details
