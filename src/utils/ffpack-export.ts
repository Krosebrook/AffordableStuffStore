/**
 * FFPack Export Utilities
 * 
 * Handles exporting brand kits, assets, and campaigns as .ffpack.json files
 */

import type { FFPack, Asset, BrandKit, Preset } from '@/types/flashfusion';

/**
 * Export assets and metadata as FFPack format
 */
export function exportFFPack(
  name: string,
  assets: Asset[],
  brandKit?: BrandKit,
  presets?: Preset[],
  description?: string,
): FFPack {
  const ffpack: FFPack = {
    version: '1.0.0',
    name,
    description,
    exportedAt: new Date(),
    assets: assets.map(asset => ({
      type: asset.type,
      name: asset.name,
      content: typeof asset.content === 'string' ? asset.content : '[Binary Data]',
      provenance: asset.provenance,
      metadata: asset.metadata,
    })),
    metadata: {
      totalAssets: assets.length,
      assetTypes: [...new Set(assets.map(a => a.type))],
    },
  };

  if (brandKit) {
    ffpack.brandKit = {
      name: brandKit.name,
      colors: brandKit.colors,
      fonts: brandKit.fonts,
      logo: brandKit.logo,
      guidelines: brandKit.guidelines,
      tone: brandKit.tone,
    };
  }

  if (presets && presets.length > 0) {
    ffpack.presets = presets;
  }

  return ffpack;
}

/**
 * Convert FFPack to JSON string
 */
export function ffpackToJSON(ffpack: FFPack): string {
  return JSON.stringify(ffpack, null, 2);
}

/**
 * Download FFPack as .ffpack.json file
 */
export function downloadFFPack(ffpack: FFPack): void {
  const json = ffpackToJSON(ffpack);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${ffpack.name.replace(/\s+/g, '-').toLowerCase()}.ffpack.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Parse FFPack from JSON string
 */
export function parseFFPack(json: string): FFPack {
  const data = JSON.parse(json);
  
  // Validate required fields
  if (!data.version || !data.name || !data.assets) {
    throw new Error('Invalid FFPack format');
  }

  // Convert date strings back to Date objects
  data.exportedAt = new Date(data.exportedAt);
  data.assets.forEach((asset: any) => {
    asset.provenance.createdAt = new Date(asset.provenance.createdAt);
  });

  return data as FFPack;
}

/**
 * Import FFPack from file
 */
export async function importFFPack(file: File): Promise<FFPack> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const ffpack = parseFFPack(json);
        resolve(ffpack);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Validate FFPack structure
 */
export function validateFFPack(ffpack: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!ffpack.version) {
    errors.push('Missing version field');
  }

  if (!ffpack.name) {
    errors.push('Missing name field');
  }

  if (!ffpack.assets || !Array.isArray(ffpack.assets)) {
    errors.push('Missing or invalid assets field');
  } else {
    ffpack.assets.forEach((asset: any, index: number) => {
      if (!asset.type) {
        errors.push(`Asset ${index}: missing type`);
      }
      if (!asset.name) {
        errors.push(`Asset ${index}: missing name`);
      }
      if (!asset.provenance) {
        errors.push(`Asset ${index}: missing provenance`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
