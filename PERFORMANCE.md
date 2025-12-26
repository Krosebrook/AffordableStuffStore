# FlashFusion Performance Standards

This project implements the FlashFusion performance standards to ensure optimal user experience, accessibility, and performance.

## Performance Budgets

### Core Web Vitals
- **TTFB (Time to First Byte)**: ≤150ms
- **LCP (Largest Contentful Paint)**: ≤2.5s
- **INP (Interaction to Next Paint)**: ≤200ms
- **CLS (Cumulative Layout Shift)**: ≤0.08

### Bundle Size Budgets (per route)
- **JavaScript**: ≤180KB gzipped
- **CSS**: ≤35KB gzipped

### Lighthouse CI
Performance budgets are enforced in CI using Lighthouse CI. See `lighthouserc.json` for detailed configuration.

## Design System

### 8pt Grid System
All spacing follows an 8-point grid system for consistent visual rhythm:
- Base unit: 8px
- Available spacing: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px

Usage in CSS:
```css
margin: var(--spacing-4); /* 16px */
padding: var(--spacing-2); /* 8px */
```

Usage with utility classes:
```html
<div class="space-4">Content</div>
```

### Fluid Typography with Clamp Scale
Typography uses CSS `clamp()` for responsive scaling without media queries:

```css
font-size: var(--font-size-base); /* clamp(1rem, 0.925rem + 0.375vw, 1.125rem) */
```

Available sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl

### Typography Families
- **Display (Headings)**: Sora - `font-family: var(--font-display);`
- **UI (Body/Interface)**: Inter - `font-family: var(--font-ui);`

Usage with utility classes:
```html
<h1 class="font-display">Display Heading</h1>
<p class="font-ui">Body text</p>
```

## Accessibility (WCAG 2.2 AA)

### Compliance Features
1. **Contrast Ratios**: Minimum 4.5:1 for normal text, 3:1 for large text
2. **Focus Indicators**: 2px outline with 2px offset on all interactive elements
3. **Touch Targets**: Minimum 44x44px for all interactive elements
4. **Text Spacing**: Line-height of 1.5, letter-spacing of 0.01em
5. **Color Scheme**: Supports both light and dark modes

### Focus Management
All interactive elements have visible focus indicators:
```css
*:focus-visible {
  outline: 2px solid;
  outline-offset: 2px;
}
```

## Animations

### Framer Motion Configuration
All animations use a consistent cubic-bezier easing: `cubic-bezier(0.4, 0, 0.2, 1)`

Import and use pre-configured animations:
```tsx
import { fadeIn, slideUp, scale } from '@/config/motion';

<motion.div {...fadeIn}>Content</motion.div>
```

Available animations:
- `fadeIn` - Fade in/out
- `slideUp` - Slide up from bottom
- `scale` - Scale with fade
- `slideInRight` - Slide from right
- `slideInLeft` - Slide from left

### Transition Speeds
- **Fast**: 0.15s - Quick interactions
- **Default**: 0.3s - Standard transitions
- **Slow**: 0.5s - Emphasized effects

## Skeleton Loaders

Skeleton components with shimmer effects for loading states:

```tsx
import { Skeleton, SkeletonCard, SkeletonList } from '@/components/skeleton';

<Skeleton width="100%" height="2rem" />
<SkeletonCard />
<SkeletonList items={5} />
```

Available components:
- `Skeleton` - Base skeleton with customization
- `SkeletonText` - Single line text
- `SkeletonAvatar` - Circular avatar
- `SkeletonCard` - Card layout
- `SkeletonButton` - Button shape
- `SkeletonImage` - Image placeholder
- `SkeletonTable` - Table structure
- `SkeletonList` - List items
- `SkeletonGrid` - Grid layout
- `SkeletonPage` - Full page loader

## Edge Runtime

API routes are configured to run on edge runtime for optimal performance:
- Configured in `vercel.json`
- Supports faster cold starts
- Lower latency for API calls

## Build Optimization

### Code Splitting
- Automatic vendor chunking
- Separate chunks for React, Framer Motion, HeroUI, i18n, and Router
- Maximum chunk size: 180KB

### Minification
- Terser with aggressive compression
- Console statements removed in production
- Dead code elimination
- CSS minification

### Assets
- Assets <4KB are inlined
- Images optimized and lazy-loaded
- Fonts preconnected for faster loading

## CI/CD Integration

### GitHub Actions Workflow
The Lighthouse CI runs automatically on every push to ensure:
1. Performance budgets are met
2. Accessibility scores ≥90%
3. Best practices scores ≥90%

To run locally:
```bash
npm run build
npm install -g @lhci/cli
lhci autorun
```

## Development Guidelines

### Before Committing
1. Ensure all spacing uses 8pt grid values
2. Use typography variables for font sizes
3. Include skeleton loaders for async content
4. Use Framer Motion animations with default config
5. Verify accessibility with focus indicators
6. Check bundle sizes with `npm run build`

### Performance Checklist
- [ ] Images are optimized and lazy-loaded
- [ ] Components are code-split appropriately
- [ ] No console.log statements in production code
- [ ] CSS is minimal and scoped
- [ ] Animations use GPU acceleration (transform/opacity)
- [ ] Third-party scripts are deferred or async

## Resources

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Web.dev Performance](https://web.dev/performance/)
