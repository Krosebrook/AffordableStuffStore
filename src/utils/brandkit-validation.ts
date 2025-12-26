/**
 * Brand Kit Validation and Linting Utilities
 * 
 * Provides validation and linting for brand kits to ensure
 * consistency and quality of brand assets
 */

import type { BrandKit, BrandKitValidationError, BrandKitValidationResult } from '@/types/flashfusion';

/**
 * Validate a hex color string
 */
function isValidHexColor(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Check if colors have sufficient contrast
 */
function hasGoodContrast(hex1: string, hex2: string): boolean {
  // Simplified contrast check - in production use WCAG contrast ratio
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  
  return ratio >= 3; // Minimum contrast ratio for UI elements
}

/**
 * Validate brand kit structure and content
 */
export function validateBrandKit(brandKit: Partial<BrandKit>): BrandKitValidationResult {
  const errors: BrandKitValidationError[] = [];

  // Validate name
  if (!brandKit.name || brandKit.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Brand kit name is required',
      severity: 'error',
    });
  }

  // Validate colors
  if (!brandKit.colors || brandKit.colors.length === 0) {
    errors.push({
      field: 'colors',
      message: 'At least one color is required',
      severity: 'error',
    });
  } else {
    // Check for primary color
    const hasPrimary = brandKit.colors.some(c => c.usage === 'primary');
    if (!hasPrimary) {
      errors.push({
        field: 'colors',
        message: 'Brand kit should have a primary color',
        severity: 'warning',
      });
    }

    // Validate each color
    brandKit.colors.forEach((color, index) => {
      if (!isValidHexColor(color.hex)) {
        errors.push({
          field: `colors[${index}].hex`,
          message: `Invalid hex color: ${color.hex}`,
          severity: 'error',
        });
      }
      if (!color.name || color.name.trim().length === 0) {
        errors.push({
          field: `colors[${index}].name`,
          message: 'Color name is required',
          severity: 'error',
        });
      }
    });

    // Check contrast between primary and background colors
    const primaryColor = brandKit.colors.find(c => c.usage === 'primary');
    const neutralColor = brandKit.colors.find(c => c.usage === 'neutral');
    
    if (primaryColor && neutralColor) {
      if (!hasGoodContrast(primaryColor.hex, neutralColor.hex)) {
        errors.push({
          field: 'colors',
          message: 'Low contrast between primary and neutral colors',
          severity: 'warning',
        });
      }
    }
  }

  // Validate fonts
  if (!brandKit.fonts || brandKit.fonts.length === 0) {
    errors.push({
      field: 'fonts',
      message: 'At least one font is required',
      severity: 'warning',
    });
  } else {
    brandKit.fonts.forEach((font, index) => {
      if (!font.name || font.name.trim().length === 0) {
        errors.push({
          field: `fonts[${index}].name`,
          message: 'Font name is required',
          severity: 'error',
        });
      }
      if (!font.family || font.family.trim().length === 0) {
        errors.push({
          field: `fonts[${index}].family`,
          message: 'Font family is required',
          severity: 'error',
        });
      }
      if (!font.weights || font.weights.length === 0) {
        errors.push({
          field: `fonts[${index}].weights`,
          message: 'At least one font weight is required',
          severity: 'warning',
        });
      }
    });
  }

  // Check for logo
  if (!brandKit.logo) {
    errors.push({
      field: 'logo',
      message: 'Brand logo is recommended',
      severity: 'warning',
    });
  }

  // Check for guidelines
  if (!brandKit.guidelines || brandKit.guidelines.trim().length === 0) {
    errors.push({
      field: 'guidelines',
      message: 'Brand guidelines help maintain consistency',
      severity: 'warning',
    });
  }

  return {
    valid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
  };
}

/**
 * Lint brand kit for best practices
 */
export function lintBrandKit(brandKit: BrandKit): BrandKitValidationError[] {
  const warnings: BrandKitValidationError[] = [];

  // Check color palette size
  if (brandKit.colors.length < 3) {
    warnings.push({
      field: 'colors',
      message: 'Consider adding more colors (recommended: 3-7 colors)',
      severity: 'warning',
    });
  }
  if (brandKit.colors.length > 10) {
    warnings.push({
      field: 'colors',
      message: 'Too many colors may reduce brand consistency',
      severity: 'warning',
    });
  }

  // Check font variety
  if (brandKit.fonts.length > 3) {
    warnings.push({
      field: 'fonts',
      message: 'Using too many fonts can reduce visual cohesion',
      severity: 'warning',
    });
  }

  // Check tone of voice
  if (!brandKit.tone || brandKit.tone.split(' ').length < 10) {
    warnings.push({
      field: 'tone',
      message: 'Add a more detailed tone of voice description',
      severity: 'warning',
    });
  }

  return warnings;
}
