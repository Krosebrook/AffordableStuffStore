/**
 * FlashFusion Content Studio Type Definitions
 * 
 * Defines all types for the content generation system including:
 * - Asset types (text, image, video, music)
 * - Brand kit schema
 * - Provenance metadata
 * - Campaign structure
 * - FFPack export format
 */

// Asset types
export type AssetType = 'text' | 'image' | 'video' | 'music';

export interface ProvenanceMetadata {
  model: string;
  provider: string;
  promptHash: string;
  dataset?: string;
  createdAt: Date;
  parameters?: Record<string, unknown>;
}

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  content: string | Blob;
  url?: string;
  orgId: string;
  provenance: ProvenanceMetadata;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

// Brand Kit
export interface BrandColor {
  name: string;
  hex: string;
  usage: 'primary' | 'secondary' | 'accent' | 'neutral';
}

export interface BrandFont {
  name: string;
  family: string;
  weights: number[];
  url?: string;
}

export interface BrandKit {
  id: string;
  name: string;
  orgId: string;
  colors: BrandColor[];
  fonts: BrandFont[];
  logo?: string;
  guidelines?: string;
  tone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandKitValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface BrandKitValidationResult {
  valid: boolean;
  errors: BrandKitValidationError[];
}

// Campaign
export interface CampaignScheduleItem {
  id: string;
  assetId: string;
  scheduledAt: Date;
  platform?: string;
  status: 'pending' | 'published' | 'failed';
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  orgId: string;
  brandKitId?: string;
  assets: string[]; // Asset IDs
  schedule: CampaignScheduleItem[];
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// Marketplace
export interface Pack {
  id: string;
  name: string;
  description: string;
  authorId: string;
  assets: string[]; // Asset IDs
  presets: Preset[];
  price: number;
  currency: string;
  downloads: number;
  rating?: number;
  tags: string[];
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Preset {
  id: string;
  name: string;
  description?: string;
  assetType: AssetType;
  parameters: Record<string, unknown>;
  thumbnail?: string;
}

// Worker job system
export interface GenerationJob {
  id: string;
  type: AssetType;
  orgId: string;
  userId: string;
  prompt: string;
  parameters: Record<string, unknown>;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  maxRetries: number;
  error?: string;
  resultAssetId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// FFPack export format
export interface FFPackAsset {
  type: AssetType;
  name: string;
  content: string;
  provenance: ProvenanceMetadata;
  metadata?: Record<string, unknown>;
}

export interface FFPack {
  version: string;
  name: string;
  description?: string;
  brandKit?: Partial<BrandKit>;
  assets: FFPackAsset[];
  presets?: Preset[];
  exportedAt: Date;
  metadata?: Record<string, unknown>;
}

// Generation request/response types
export interface GenerationRequest {
  type: AssetType;
  prompt: string;
  parameters?: Record<string, unknown>;
  brandKitId?: string;
}

export interface GenerationResponse {
  jobId: string;
  status: 'queued' | 'processing';
  estimatedTime?: number;
}
