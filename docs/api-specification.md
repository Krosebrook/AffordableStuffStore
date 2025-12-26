# API Specification

## Base URL

```
Production: https://api.flashfusion.com/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All API endpoints (except public ones) require authentication using JWT Bearer tokens.

### Authentication Flow

```
POST /auth/login
POST /auth/refresh
POST /auth/logout
```

#### Login

Request:
```json
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "orgId": "org-uuid",
    "roles": ["user"]
  }
}
```

#### Refresh Token

Request:
```json
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900
}
```

#### Logout

Request:
```json
POST /auth/logout
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

Response:
```json
{
  "message": "Logged out successfully"
}
```

### Using Access Tokens

Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Lifetimes

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days
- Refresh tokens are rotated on each refresh request

## Rate Limiting

All endpoints are rate-limited to prevent abuse.

### Rate Limit Headers

Every API response includes rate limit information:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

### Rate Limit Rules

| Endpoint Category | Limit | Window |
|------------------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| Read Operations | 100 requests | 1 hour |
| Write Operations | 50 requests | 1 hour |
| Search | 30 requests | 1 hour |

### Rate Limit Exceeded Response

```json
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 3600

{
  "error": "Rate limit exceeded",
  "message": "You have exceeded the rate limit of 100 requests per hour",
  "retryAfter": 3600,
  "limit": 100,
  "remaining": 0,
  "resetAt": "2024-01-01T13:00:00Z"
}
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "details": {
    "field": "validation error details"
  },
  "requestId": "unique-request-id"
}
```

### HTTP Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request (validation errors)
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate)
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily unavailable

## Security Headers

All API responses include security headers:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## Request Validation

All requests are validated using Zod schemas. Invalid requests return:

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "validation_error",
  "message": "Request validation failed",
  "details": {
    "email": "Invalid email address",
    "password": "Password must be at least 12 characters"
  }
}
```

## Organization Scoping

All resources are scoped to organizations. The `org_id` is automatically extracted from the JWT token and applied via Row-Level Security (RLS) policies.

Users can only access resources within their organization.

## Audit Trail

All data modifications (CREATE, UPDATE, DELETE) are automatically logged in the audit trail with:
- User ID
- Organization ID
- Timestamp
- Old values
- New values
- Changed fields
- IP address
- User agent

## Pagination

List endpoints support pagination:

```
GET /api/v1/products?page=1&limit=20&sortBy=name&order=asc
```

Response:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## CORS

CORS is configured to allow requests from whitelisted origins only:

```
Access-Control-Allow-Origin: https://app.flashfusion.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

## TLS Configuration

All API connections must use TLS 1.3 with AES-256 encryption:

- Minimum TLS version: 1.3
- Cipher suites: TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256
- HSTS enforced with max-age of 1 year

## Example Endpoints

### Products

```
GET    /api/v1/products          # List products (paginated)
GET    /api/v1/products/:id      # Get product by ID
POST   /api/v1/products          # Create product
PUT    /api/v1/products/:id      # Update product
DELETE /api/v1/products/:id      # Delete product (soft delete)
```

### Users (Admin only)

```
GET    /api/v1/users             # List users in organization
GET    /api/v1/users/:id         # Get user by ID
POST   /api/v1/users             # Create user
PUT    /api/v1/users/:id         # Update user
DELETE /api/v1/users/:id         # Delete user (soft delete)
```

### Audit Trail

```
GET    /api/v1/audit             # List audit logs (filtered by org)
GET    /api/v1/audit/:id         # Get specific audit log entry
```

## Rate Limiting Implementation

Backend implementation example using Redis:

```typescript
import { RateLimiterRedis } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate_limit',
  points: 100, // Number of requests
  duration: 3600, // Per hour
});

async function rateLimitMiddleware(req, res, next) {
  try {
    const userId = req.user.id;
    await rateLimiter.consume(userId);
    
    // Add rate limit headers
    const rateLimitInfo = await rateLimiter.get(userId);
    res.set({
      'X-RateLimit-Limit': 100,
      'X-RateLimit-Remaining': rateLimitInfo.remainingPoints,
      'X-RateLimit-Reset': new Date(Date.now() + rateLimitInfo.msBeforeNext).toISOString(),
    });
    
    next();
  } catch (error) {
    res.status(429).json({
      error: 'rate_limit_exceeded',
      message: 'Too many requests',
      retryAfter: Math.ceil(error.msBeforeNext / 1000),
    });
  }
}
```

## Security Best Practices

1. **Never log sensitive data**: Passwords, tokens, credit cards are redacted from logs
2. **Always use HTTPS**: All connections must use TLS 1.3+
3. **Validate all inputs**: Use Zod schemas for validation
4. **Sanitize outputs**: HTML escape all user-generated content
5. **Use prepared statements**: Prevent SQL injection
6. **Implement CSRF protection**: Use CSRF tokens for state-changing operations
7. **Rate limit all endpoints**: Prevent brute force and DoS attacks
8. **Audit all changes**: Log all data modifications
9. **Enforce RLS**: Organization isolation at database level
10. **Rotate secrets regularly**: JWT secrets, API keys, encryption keys

## Monitoring & Alerting

All API endpoints are monitored for:
- Response time (P50, P95, P99)
- Error rate
- Rate limit violations
- Security events (failed auth, suspicious activity)
- Database query performance

Alerts are triggered based on incident severity:
- **P0**: < 5 minutes (system down, data breach)
- **P1**: < 15 minutes (major functionality broken)
- **P2**: < 1 hour (degraded performance)
- **P3**: < 24 hours (minor issues)
