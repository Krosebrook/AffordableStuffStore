-- FlashFusion Database Schema
-- This migration creates all tables for the FlashFusion application with proper RLS policies,
-- indexes, and cascade delete configurations.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Organizations Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS orgs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id UUID NOT NULL,
  is_public BOOLEAN DEFAULT FALSE
);

-- Index on org owner and created_at
CREATE INDEX IF NOT EXISTS idx_orgs_owner_id ON orgs(owner_id);
CREATE INDEX IF NOT EXISTS idx_orgs_created_at ON orgs(created_at);

-- Enable RLS for orgs
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;

-- RLS Policy for orgs: users can see their own orgs or public orgs
CREATE POLICY orgs_select_policy ON orgs
  FOR SELECT
  USING (owner_id = auth.uid() OR is_public = true);

CREATE POLICY orgs_insert_policy ON orgs
  FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY orgs_update_policy ON orgs
  FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY orgs_delete_policy ON orgs
  FOR DELETE
  USING (owner_id = auth.uid());

-- ============================================================================
-- Members Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE,
  UNIQUE(org_id, user_id)
);

-- Index on org_id and created_at
CREATE INDEX IF NOT EXISTS idx_members_org_id ON members(org_id);
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_created_at ON members(created_at);

-- Enable RLS for members
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- RLS Policy for members
CREATE POLICY members_select_policy ON members
  FOR SELECT
  USING (
    user_id = auth.uid() OR 
    org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()) OR
    is_public = true
  );

CREATE POLICY members_insert_policy ON members
  FOR INSERT
  WITH CHECK (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY members_update_policy ON members
  FOR UPDATE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY members_delete_policy ON members
  FOR DELETE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

-- ============================================================================
-- Brand Kits Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS brand_kits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  colors JSONB,
  fonts JSONB,
  logos JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Index on org_id and created_at
CREATE INDEX IF NOT EXISTS idx_brand_kits_org_id ON brand_kits(org_id);
CREATE INDEX IF NOT EXISTS idx_brand_kits_created_at ON brand_kits(created_at);

-- Enable RLS for brand_kits
ALTER TABLE brand_kits ENABLE ROW LEVEL SECURITY;

-- RLS Policy for brand_kits
CREATE POLICY brand_kits_select_policy ON brand_kits
  FOR SELECT
  USING (
    org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()) OR
    is_public = true
  );

CREATE POLICY brand_kits_insert_policy ON brand_kits
  FOR INSERT
  WITH CHECK (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY brand_kits_update_policy ON brand_kits
  FOR UPDATE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY brand_kits_delete_policy ON brand_kits
  FOR DELETE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

-- ============================================================================
-- Templates Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  content JSONB,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Index on org_id and created_at
CREATE INDEX IF NOT EXISTS idx_templates_org_id ON templates(org_id);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at);

-- Enable RLS for templates
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- RLS Policy for templates
CREATE POLICY templates_select_policy ON templates
  FOR SELECT
  USING (
    org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()) OR
    is_public = true
  );

CREATE POLICY templates_insert_policy ON templates
  FOR INSERT
  WITH CHECK (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY templates_update_policy ON templates
  FOR UPDATE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY templates_delete_policy ON templates
  FOR DELETE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

-- ============================================================================
-- Assets Table (with provenance)
-- ============================================================================
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  provenance JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Index on org_id and created_at
CREATE INDEX IF NOT EXISTS idx_assets_org_id ON assets(org_id);
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets(created_at);

-- Enable RLS for assets
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- RLS Policy for assets
CREATE POLICY assets_select_policy ON assets
  FOR SELECT
  USING (
    org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()) OR
    is_public = true
  );

CREATE POLICY assets_insert_policy ON assets
  FOR INSERT
  WITH CHECK (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY assets_update_policy ON assets
  FOR UPDATE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY assets_delete_policy ON assets
  FOR DELETE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

-- ============================================================================
-- Campaigns Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  settings JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Index on org_id and created_at
CREATE INDEX IF NOT EXISTS idx_campaigns_org_id ON campaigns(org_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);

-- Enable RLS for campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policy for campaigns
CREATE POLICY campaigns_select_policy ON campaigns
  FOR SELECT
  USING (
    org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()) OR
    is_public = true
  );

CREATE POLICY campaigns_insert_policy ON campaigns
  FOR INSERT
  WITH CHECK (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY campaigns_update_policy ON campaigns
  FOR UPDATE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY campaigns_delete_policy ON campaigns
  FOR DELETE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

-- ============================================================================
-- Segments Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  criteria JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Index on org_id and created_at
CREATE INDEX IF NOT EXISTS idx_segments_org_id ON segments(org_id);
CREATE INDEX IF NOT EXISTS idx_segments_created_at ON segments(created_at);

-- Enable RLS for segments
ALTER TABLE segments ENABLE ROW LEVEL SECURITY;

-- RLS Policy for segments
CREATE POLICY segments_select_policy ON segments
  FOR SELECT
  USING (
    org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()) OR
    is_public = true
  );

CREATE POLICY segments_insert_policy ON segments
  FOR INSERT
  WITH CHECK (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY segments_update_policy ON segments
  FOR UPDATE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY segments_delete_policy ON segments
  FOR DELETE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

-- ============================================================================
-- Schedules Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  schedule_type TEXT,
  schedule_config JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Index on org_id and created_at
CREATE INDEX IF NOT EXISTS idx_schedules_org_id ON schedules(org_id);
CREATE INDEX IF NOT EXISTS idx_schedules_created_at ON schedules(created_at);
CREATE INDEX IF NOT EXISTS idx_schedules_campaign_id ON schedules(campaign_id);

-- Enable RLS for schedules
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policy for schedules
CREATE POLICY schedules_select_policy ON schedules
  FOR SELECT
  USING (
    org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()) OR
    is_public = true
  );

CREATE POLICY schedules_insert_policy ON schedules
  FOR INSERT
  WITH CHECK (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY schedules_update_policy ON schedules
  FOR UPDATE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY schedules_delete_policy ON schedules
  FOR DELETE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

-- ============================================================================
-- Marketplace Items Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketplace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  item_type TEXT,
  price DECIMAL(10, 2),
  content JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_public BOOLEAN DEFAULT TRUE
);

-- Index on org_id and created_at
CREATE INDEX IF NOT EXISTS idx_marketplace_items_org_id ON marketplace_items(org_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_created_at ON marketplace_items(created_at);

-- Enable RLS for marketplace_items
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;

-- RLS Policy for marketplace_items
CREATE POLICY marketplace_items_select_policy ON marketplace_items
  FOR SELECT
  USING (
    org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()) OR
    is_public = true
  );

CREATE POLICY marketplace_items_insert_policy ON marketplace_items
  FOR INSERT
  WITH CHECK (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY marketplace_items_update_policy ON marketplace_items
  FOR UPDATE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

CREATE POLICY marketplace_items_delete_policy ON marketplace_items
  FOR DELETE
  USING (org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid()));

-- ============================================================================
-- Public Prompts Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  json JSONB NOT NULL,
  tags TEXT[],
  submitter UUID NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_public BOOLEAN DEFAULT TRUE
);

-- Index on created_at and tags
CREATE INDEX IF NOT EXISTS idx_public_prompts_created_at ON public_prompts(created_at);
CREATE INDEX IF NOT EXISTS idx_public_prompts_tags ON public_prompts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_public_prompts_submitter ON public_prompts(submitter);

-- Enable RLS for public_prompts
ALTER TABLE public_prompts ENABLE ROW LEVEL SECURITY;

-- RLS Policy for public_prompts (anyone can read public prompts)
CREATE POLICY public_prompts_select_policy ON public_prompts
  FOR SELECT
  USING (is_public = true OR submitter = auth.uid());

CREATE POLICY public_prompts_insert_policy ON public_prompts
  FOR INSERT
  WITH CHECK (submitter = auth.uid());

CREATE POLICY public_prompts_update_policy ON public_prompts
  FOR UPDATE
  USING (submitter = auth.uid());

CREATE POLICY public_prompts_delete_policy ON public_prompts
  FOR DELETE
  USING (submitter = auth.uid());

-- ============================================================================
-- Update Triggers
-- ============================================================================
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER update_orgs_updated_at BEFORE UPDATE ON orgs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_kits_updated_at BEFORE UPDATE ON brand_kits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_segments_updated_at BEFORE UPDATE ON segments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON marketplace_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_public_prompts_updated_at BEFORE UPDATE ON public_prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
