# Security Guide for FlashFusion

## Overview

FlashFusion is built with security as a core principle. This document outlines the security features and best practices.

## 🔐 Security Features

### 1. Row Level Security (RLS)

All database tables use Postgres Row Level Security to ensure users can only access their own data.

#### Implemented Policies

**render_jobs**:
- Users can view their own render jobs
- Users can create jobs linked to their account
- No public access

**scheduled_tasks**:
- Users can view their own scheduled tasks
- Users can create their own tasks
- No public access

**analytics_events**:
- Users can view their own events
- Any authenticated user can create events
- Events are user-scoped

**insights**:
- All authenticated users can view insights
- Only workers can create insights

#### Testing RLS Policies

```sql
-- Test as authenticated user
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-id-here"}';

-- Try to access data
SELECT * FROM render_jobs;
```

### 2. Content Security Policy (CSP)

Configured in `apps/web/next.config.js`:

```javascript
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://*.supabase.co;
```

#### Customizing CSP

Edit `next.config.js` to adjust CSP headers based on your needs:

```javascript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-inline';"
}
```

### 3. CSRF Protection

Implemented in `apps/web/src/middleware.ts`:

- CSRF tokens generated for each session
- Tokens stored in httpOnly cookies
- Validated on all non-GET requests
- 403 error on token mismatch

#### Using CSRF Tokens

In your API calls:

```typescript
const csrfToken = document.cookie
  .split('; ')
  .find(row => row.startsWith('csrf-token='))
  ?.split('=')[1];

fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-csrf-token': csrfToken,
  },
  body: JSON.stringify(data),
});
```

### 4. Authentication

Powered by Supabase Auth:

- Email/password authentication
- OAuth providers (Google, GitHub, etc.)
- Magic link authentication
- JWT-based sessions
- Automatic token refresh

#### Setting up Auth

```typescript
import { supabase } from '@/lib/supabase';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password',
});

// Sign out
await supabase.auth.signOut();
```

### 5. Environment Variables

Sensitive data is stored in environment variables, never in code.

#### Required Variables

**Web App** (`apps/web/.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
CSRF_SECRET=random-32-char-string
```

**Workers**:
```bash
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Secrets Rotation

Rotate secrets regularly:

1. **Supabase Keys**:
   - Generate new keys in Supabase dashboard
   - Update in Vercel/deployment platform
   - Deploy with zero downtime

2. **CSRF Secret**:
   ```bash
   # Generate new secret
   openssl rand -base64 32
   ```
   - Update in environment variables
   - Redeploy application
   - Users will need to re-authenticate

3. **API Keys**:
   - Rotate Sentry, PostHog keys from dashboards
   - Update environment variables
   - Redeploy

### 6. HTTPS & Secure Headers

All production traffic uses HTTPS. Additional security headers:

- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` - Controls browser features

### 7. Input Validation & Sanitization

Always validate and sanitize user input:

```typescript
// Example validation
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
});

const result = schema.safeParse(userInput);
if (!result.success) {
  // Handle validation errors
}
```

### 8. SQL Injection Prevention

Using Supabase's query builder prevents SQL injection:

```typescript
// Safe - uses parameterized queries
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail);

// NEVER do raw SQL with user input
// const { data } = await supabase.rpc('raw_sql', { 
//   query: `SELECT * FROM users WHERE email = '${userEmail}'` 
// });
```

### 9. Rate Limiting

Implement rate limiting for API endpoints:

```typescript
// Example with Next.js
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
  
  // Handle request
}
```

## 🚨 Security Checklist

Before deploying to production:

- [ ] All environment variables are set
- [ ] RLS policies are enabled on all tables
- [ ] CSP headers are configured
- [ ] CSRF protection is enabled
- [ ] HTTPS is enforced
- [ ] Secrets are rotated
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't include sensitive data
- [ ] Dependencies are up to date
- [ ] Security audit completed

## 🐛 Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Email security@yourcompany.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

## 🔄 Security Updates

Security is an ongoing process. Review and update:

- Dependencies: Weekly
- RLS policies: Monthly
- Secrets: Quarterly
- Security audit: Annually
