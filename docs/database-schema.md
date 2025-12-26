# Database Schema with Row-Level Security (RLS)

This document describes the database schema for FlashFusion with Row-Level Security policies implemented on all tables with org_id scoping.

## Overview

All tables include:
- `org_id` column for organization scoping
- RLS policies to enforce organization-level isolation
- Audit trail columns (`created_at`, `updated_at`, `created_by`, `updated_by`)
- Soft delete support with `deleted_at` column

## Schema

### Organizations Table

```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own organization
CREATE POLICY org_isolation_policy ON organizations
    FOR ALL
    USING (id = current_setting('app.current_org_id')::UUID);

-- Index for performance
CREATE INDEX idx_organizations_deleted_at ON organizations(deleted_at) WHERE deleted_at IS NULL;
```

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt with 12+ rounds
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(org_id, email),
    UNIQUE(org_id, username)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see users in their organization
CREATE POLICY user_org_isolation_policy ON users
    FOR ALL
    USING (org_id = current_setting('app.current_org_id')::UUID);

-- Indexes
CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;
```

### Refresh Tokens Table

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own refresh tokens in their organization
CREATE POLICY refresh_token_org_isolation_policy ON refresh_tokens
    FOR ALL
    USING (
        org_id = current_setting('app.current_org_id')::UUID
        AND user_id = current_setting('app.current_user_id')::UUID
    );

-- Indexes
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_org_id ON refresh_tokens(org_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
```

### Audit Trail Table

```sql
CREATE TABLE audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see audit logs for their organization
CREATE POLICY audit_trail_org_isolation_policy ON audit_trail
    FOR SELECT
    USING (org_id = current_setting('app.current_org_id')::UUID);

-- Policy: Only system can insert audit logs
CREATE POLICY audit_trail_insert_policy ON audit_trail
    FOR INSERT
    WITH CHECK (TRUE); -- Handled by trigger, not user

-- Indexes
CREATE INDEX idx_audit_trail_org_id ON audit_trail(org_id);
CREATE INDEX idx_audit_trail_user_id ON audit_trail(user_id);
CREATE INDEX idx_audit_trail_table_name ON audit_trail(table_name);
CREATE INDEX idx_audit_trail_record_id ON audit_trail(record_id);
CREATE INDEX idx_audit_trail_created_at ON audit_trail(created_at DESC);
```

### Products Table (Example)

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    sku VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(org_id, sku)
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see products in their organization
CREATE POLICY products_org_isolation_policy ON products
    FOR ALL
    USING (org_id = current_setting('app.current_org_id')::UUID);

-- Indexes
CREATE INDEX idx_products_org_id ON products(org_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_deleted_at ON products(deleted_at) WHERE deleted_at IS NULL;
```

## Audit Trail Trigger

Create a trigger function to automatically log all changes:

```sql
CREATE OR REPLACE FUNCTION audit_trail_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_trail (
            org_id, user_id, table_name, record_id, action, old_values
        ) VALUES (
            OLD.org_id,
            current_setting('app.current_user_id', true)::UUID,
            TG_TABLE_NAME,
            OLD.id,
            'DELETE',
            row_to_json(OLD)
        );
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_trail (
            org_id, user_id, table_name, record_id, action, old_values, new_values, changed_fields
        ) VALUES (
            NEW.org_id,
            current_setting('app.current_user_id', true)::UUID,
            TG_TABLE_NAME,
            NEW.id,
            'UPDATE',
            row_to_json(OLD),
            row_to_json(NEW),
            ARRAY(
                SELECT jsonb_object_keys(to_jsonb(NEW) - to_jsonb(OLD))
            )
        );
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_trail (
            org_id, user_id, table_name, record_id, action, new_values
        ) VALUES (
            NEW.org_id,
            current_setting('app.current_user_id', true)::UUID,
            TG_TABLE_NAME,
            NEW.id,
            'INSERT',
            row_to_json(NEW)
        );
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to all tables (example for products)
CREATE TRIGGER products_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION audit_trail_trigger();

-- Apply to users table
CREATE TRIGGER users_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trail_trigger();
```

## Updated At Trigger

Create a trigger to automatically update the `updated_at` timestamp:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables (example for products)
CREATE TRIGGER products_updated_at_trigger
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER users_updated_at_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER organizations_updated_at_trigger
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Setting Context for RLS

Before executing queries, set the current organization and user context:

```sql
-- Set organization context
SET LOCAL app.current_org_id = '<organization_uuid>';

-- Set user context
SET LOCAL app.current_user_id = '<user_uuid>';
```

In application code (e.g., PostgreSQL client):

```typescript
async function setRLSContext(client: PoolClient, orgId: string, userId: string) {
  await client.query('SET LOCAL app.current_org_id = $1', [orgId]);
  await client.query('SET LOCAL app.current_user_id = $1', [userId]);
}
```

## Rate Limiting Table

```sql
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    request_count INTEGER DEFAULT 0,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own rate limits
CREATE POLICY rate_limits_org_isolation_policy ON rate_limits
    FOR ALL
    USING (
        org_id = current_setting('app.current_org_id')::UUID
        AND user_id = current_setting('app.current_user_id')::UUID
    );

-- Indexes
CREATE INDEX idx_rate_limits_user_id ON rate_limits(user_id);
CREATE INDEX idx_rate_limits_org_id ON rate_limits(org_id);
CREATE INDEX idx_rate_limits_endpoint ON rate_limits(endpoint);
CREATE INDEX idx_rate_limits_window_start ON rate_limits(window_start);

-- Unique constraint for rate limiting
CREATE UNIQUE INDEX idx_rate_limits_unique ON rate_limits(user_id, endpoint, window_start);
```

## Security Notes

1. **Organization Isolation**: All queries automatically scope to the user's organization via RLS policies
2. **Audit Trail**: All changes are automatically logged with user and timestamp information
3. **Soft Deletes**: Records are never physically deleted, only marked with `deleted_at`
4. **Rate Limiting**: Track and enforce 100 requests/hour/user at database level
5. **Password Storage**: Use bcrypt with minimum 12 rounds (never store plain passwords)
6. **Token Storage**: Store hashed tokens, never plain tokens
7. **Encryption**: Use AES-256 encryption for sensitive fields (implement using pgcrypto extension)

## TLS Configuration

Ensure PostgreSQL connections use TLS 1.3:

```sql
-- In postgresql.conf
ssl = on
ssl_min_protocol_version = 'TLSv1.3'
ssl_ciphers = 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256'
ssl_prefer_server_ciphers = on
```

## Connection String Example

```
postgresql://user:password@host:5432/database?sslmode=require&sslminprotocolversion=TLSv1.3
```
