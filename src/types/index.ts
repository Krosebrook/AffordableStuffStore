import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// FlashFusion Core Domain Types

// Organization & User Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  org_id: string;
  user_id: string;
  role: "owner" | "admin" | "member" | "viewer";
  created_at: string;
}

// Brand Kit Types
export interface BrandKit {
  id: string;
  org_id: string;
  name: string;
  colors: BrandColors;
  typography: BrandTypography;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface BrandTypography {
  display_font: string;
  ui_font: string;
  line_height: number;
}

// Template & Prompt Types
export interface PromptTemplate {
  id: string;
  org_id: string;
  name: string;
  description: string;
  prompt: string;
  category: PromptCategory;
  tags: string[];
  token_estimate: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export type PromptCategory =
  | "text"
  | "image"
  | "video"
  | "music"
  | "social"
  | "email"
  | "blog";

// Asset Types
export interface Asset {
  id: string;
  org_id: string;
  type: AssetType;
  url: string;
  title: string;
  description?: string;
  provenance: AssetProvenance;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type AssetType = "text" | "image" | "video" | "audio";

/**
 * AssetProvenance - Tracks the origin and generation parameters of AI-generated content
 * This is critical for:
 * - Audit trails and compliance
 * - Reproducing generation results
 * - Dataset attribution and copyright
 * - Model version tracking
 */
export interface AssetProvenance {
  model: string; // AI model used (e.g., "gpt-4", "dall-e-3", "stable-diffusion")
  prompt_hash: string; // SHA-256 hash of the prompt for integrity verification
  dataset_tag?: string; // Training dataset identifier (if applicable)
  generation_params: Record<string, unknown>; // Temperature, top_p, etc.
}

// Campaign Types
export interface Campaign {
  id: string;
  org_id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  segments: string[];
  schedules: Schedule[];
  created_at: string;
  updated_at: string;
}

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "completed";

export interface Schedule {
  id: string;
  campaign_id: string;
  channel: Channel;
  scheduled_at: string;
  status: ScheduleStatus;
  asset_ids: string[];
  retry_count: number;
  max_retries: number;
}

export type Channel =
  | "twitter"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "email"
  | "blog";
export type ScheduleStatus =
  | "pending"
  | "processing"
  | "published"
  | "failed"
  | "cancelled";

// Segment Types
export interface Segment {
  id: string;
  org_id: string;
  name: string;
  criteria: SegmentCriteria;
  member_count: number;
  created_at: string;
}

export interface SegmentCriteria {
  filters: Filter[];
  logic: "AND" | "OR";
}

export interface Filter {
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than";
  value: string | number;
}

// Marketplace Types
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  author_id: string;
  author_name: string;
  prompt_pack: PromptPack;
  price: number;
  rating: number;
  downloads: number;
  tags: string[];
  is_featured: boolean;
  created_at: string;
}

export interface PromptPack {
  version: string;
  prompts: PromptTemplate[];
  metadata: {
    use_cases: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
  };
}

// Public Library Types
export interface PublicPrompt {
  id: string;
  user_id: string;
  username: string;
  title: string;
  prompt: string;
  category: PromptCategory;
  tags: string[];
  votes: number;
  views: number;
  is_featured: boolean;
  created_at: string;
}

export interface PromptVote {
  id: string;
  prompt_id: string;
  user_id: string;
  value: 1 | -1;
  created_at: string;
}
