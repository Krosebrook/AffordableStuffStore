# FlashFusion Supabase Database Schema

This directory contains the Supabase migration files for the FlashFusion database schema.

## Schema Overview

The FlashFusion database consists of the following tables:

### Core Tables

1. **orgs** - Organizations/companies using the platform
   - Primary key: `id` (UUID)
   - Fields: `name`, `owner_id`, `is_public`, timestamps
   - Indexes: `owner_id`, `created_at`

2. **members** - Organization members
   - Primary key: `id` (UUID)
   - Foreign key: `org_id` (references orgs)
   - Fields: `user_id`, `role`, `is_public`, timestamps
   - Indexes: `org_id`, `user_id`, `created_at`
   - Cascade delete: When org is deleted

3. **brand_kits** - Brand identity assets
   - Primary key: `id` (UUID)
   - Foreign key: `org_id` (references orgs)
   - Fields: `name`, `colors`, `fonts`, `logos` (JSONB), `is_public`, timestamps
   - Indexes: `org_id`, `created_at`
   - Cascade delete: When org is deleted

4. **templates** - Reusable templates
   - Primary key: `id` (UUID)
   - Foreign key: `org_id` (references orgs)
   - Fields: `name`, `description`, `content` (JSONB), `thumbnail_url`, `is_public`, timestamps
   - Indexes: `org_id`, `created_at`
   - Cascade delete: When org is deleted

5. **assets** - Media assets with provenance tracking
   - Primary key: `id` (UUID)
   - Foreign key: `org_id` (references orgs)
   - Fields: `name`, `file_url`, `file_type`, `file_size`, `provenance` (JSONB), `metadata` (JSONB), `is_public`, timestamps
   - Indexes: `org_id`, `created_at`
   - Cascade delete: When org is deleted

6. **campaigns** - Marketing campaigns
   - Primary key: `id` (UUID)
   - Foreign key: `org_id` (references orgs)
   - Fields: `name`, `description`, `status`, `settings` (JSONB), `is_public`, timestamps
   - Indexes: `org_id`, `created_at`
   - Cascade delete: When org is deleted

7. **segments** - Audience segments
   - Primary key: `id` (UUID)
   - Foreign key: `org_id` (references orgs)
   - Fields: `name`, `description`, `criteria` (JSONB), `is_public`, timestamps
   - Indexes: `org_id`, `created_at`
   - Cascade delete: When org is deleted

8. **schedules** - Campaign schedules
   - Primary key: `id` (UUID)
   - Foreign keys: `org_id` (references orgs), `campaign_id` (references campaigns)
   - Fields: `name`, `schedule_type`, `schedule_config` (JSONB), `is_public`, timestamps
   - Indexes: `org_id`, `campaign_id`, `created_at`
   - Cascade delete: When org or campaign is deleted

9. **marketplace_items** - Marketplace items for sharing/selling
   - Primary key: `id` (UUID)
   - Foreign key: `org_id` (references orgs)
   - Fields: `name`, `description`, `item_type`, `price`, `content` (JSONB), `is_public` (default TRUE), timestamps
   - Indexes: `org_id`, `created_at`
   - Cascade delete: When org is deleted

10. **public_prompts** - Public AI prompts with voting
    - Primary key: `id` (UUID)
    - Fields: `title`, `json` (JSONB), `tags` (TEXT[]), `submitter` (UUID), `votes`, `is_public` (default TRUE), timestamps
    - Indexes: `created_at`, `tags` (GIN index), `submitter`

## Row Level Security (RLS)

All tables have RLS enabled with the following policy pattern:

- **SELECT**: `USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()) OR is_public = true)`
- **INSERT**: `WITH CHECK (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()))`
- **UPDATE**: `USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()))`
- **DELETE**: `USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()))`

Exception: `public_prompts` table has simplified RLS:
- Anyone can read public prompts
- Only submitters can update/delete their own prompts

## Cascade Deletes

When an organization is deleted, the following tables cascade delete:
- members
- brand_kits
- templates
- assets
- campaigns
- segments
- schedules
- marketplace_items

When a campaign is deleted:
- schedules cascade delete

## Indexes

All tables have indexes on:
- `org_id` (for org-related tables)
- `created_at` (for time-based queries)

Additional indexes:
- `members`: `user_id`
- `schedules`: `campaign_id`
- `public_prompts`: `tags` (GIN index for array operations), `submitter`

## Migrations

To apply the migration to your Supabase project:

```bash
# Using Supabase CLI
supabase db push

# Or apply manually through the Supabase dashboard SQL editor
```

## Timestamps

All tables include:
- `created_at`: Automatically set on insert
- `updated_at`: Automatically updated on every row update via triggers
