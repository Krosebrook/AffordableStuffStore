import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// FlashFusion Pack types
export interface FFPackMetadata {
  author: string;
  tags: string[];
  license: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FFPackTemplate {
  id: string;
  name: string;
  content: string;
  variables?: string[];
}

export interface FFPackBrandKit {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  logo?: string;
}

export interface FFPackAsset {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
}

export interface FFPack {
  name: string;
  version: string;
  templates: FFPackTemplate[];
  brand_kit?: FFPackBrandKit;
  assets: FFPackAsset[];
  metadata: FFPackMetadata;
}

export interface FFPackVersion {
  version: string;
  timestamp: string;
  changes: string;
  pack: FFPack;
}

export interface FFPackWithStats extends FFPack {
  id: string;
  isPublic: boolean;
  upvotes: number;
  downvotes: number;
  authorAvatar?: string;
  versionHistory: FFPackVersion[];
  isFeatured?: boolean;
}
