/**
 * FlashFusion Constants
 * Core constants used throughout the application
 */

// Brand Colors (from problem statement)
export const BRAND_COLORS = {
  primary: "#FF7B00",
  secondary: "#00B4D8",
  accent: "#E91E63",
  background: "#0F172A",
  surface: "#111827",
  text: "#E5E7EB",
} as const;

// Performance Budgets (from problem statement)
export const PERFORMANCE_BUDGETS = {
  TTFB: 150, // ms
  LCP: 2500, // ms
  INP: 200, // ms
  CLS: 0.08,
  JS_SIZE: 180, // KB gzip
  CSS_SIZE: 35, // KB gzip
} as const;

// Typography
export const TYPOGRAPHY = {
  displayFont: "Sora",
  uiFont: "Inter",
  lineHeight: 1.5,
  gridSpacing: 8, // pt
} as const;

// Asset Types
export const ASSET_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
} as const;

// Campaign Channels
export const CHANNELS = {
  TWITTER: "twitter",
  FACEBOOK: "facebook",
  INSTAGRAM: "instagram",
  LINKEDIN: "linkedin",
  EMAIL: "email",
  BLOG: "blog",
} as const;

// Prompt Categories
export const PROMPT_CATEGORIES = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  MUSIC: "music",
  SOCIAL: "social",
  EMAIL: "email",
  BLOG: "blog",
} as const;

// Limits
export const LIMITS = {
  MAX_RETRIES: 3,
  MAX_PROMPT_LENGTH: 2000,
  MAX_ASSETS_PER_CAMPAIGN: 50,
  MAX_TEMPLATES_PER_ORG: 100,
} as const;

// API Endpoints
// Note: These will be implemented as Vercel Edge Functions in production.
// Currently defined as placeholders for client-side routing and type safety.
export const API_ENDPOINTS = {
  CONTENT_GENERATE: "/api/content/generate",
  CAMPAIGNS_DRAFT: "/api/campaigns/draft",
  SCHEDULE: "/api/schedule",
  MARKETPLACE_BROWSE: "/api/marketplace/browse",
  PROMPTS_SUBMIT: "/api/prompts/submit",
} as const;
