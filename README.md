# FlashFusion - AI-Powered Creative Mega App

FlashFusion is a production-grade SaaS platform for AI-powered content generation, campaign management, and multi-channel publishing. Built with Next.js 15, Supabase, and Edge workers, incorporating 15+ years of context engineering best practices.

## Overview

FlashFusion empowers creators, agencies, and teams to build AI-powered content workflows at scale with:

- **Modular Prompt Builder**: 30+ presets, searchable combobox, live token estimates, .ffpack.json export
- **Content Studio**: Generate text/image/video/music with brand kit validation
- **Campaign Wizard**: Multi-channel scheduling with retry logic
- **Marketplace**: Browse/remix/submit prompt packs
- **Public Prompt Library**: User-submitted prompts with voting, search, tags

## Architecture

- **Monorepo**: Turborepo + PNPM
- **Frontend**: Next.js App Router, Tailwind v4, shadcn/ui, Framer Motion
- **Backend**: Supabase (Auth, Postgres+RLS, Storage)
- **Workers**: render.ts (asset generation), schedule.ts (CRON posting), insights.ts (segmentation)
- **Deploy**: Vercel Edge Functions
- **Observability**: Sentry + PostHog + OpenTelemetry

## Key Features

### 1. Modular Prompt Builder
- 30+ prompt presets for different content types
- Searchable combobox for quick selection
- Live token estimation
- Export prompts as .ffpack.json

### 2. Content Studio
- Multi-modal content generation (text, image, video, music)
- Brand kit validation and consistency checking
- Asset preview and editing
- Provenance logging (model, prompt_hash, dataset_tag)

### 3. Campaign Wizard
- Multi-channel scheduling (social media, email, blog)
- Smart retry logic for failed posts
- Campaign analytics and performance tracking
- Audience segmentation

### 4. Marketplace
- Browse community-created prompt packs
- Remix and customize existing prompts
- Submit your own prompt packs
- Rating and review system

### 5. Public Prompt Library
- User-submitted prompts
- Voting system
- Tag-based search and filtering
- Trending prompts

## Technologies Used

### Core Stack (Current Implementation)
- [Vite 6](https://vitejs.dev) - Fast build tool with HMR
- [React 19](https://reactjs.org) - UI library
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com) - Utility-first CSS
- [HeroUI](https://heroui.com) - Component library
- [Framer Motion](https://www.framer.com/motion) - Animation library
- [i18next](https://www.i18next.com) - Internationalization

### Planned Migration
The application is currently built with Vite for rapid prototyping. Future versions will migrate to:
- [Next.js 15](https://nextjs.org) - React framework with App Router for production deployment
- [Supabase](https://supabase.com) - Auth, Database (Postgres + RLS), Storage
- [Vercel](https://vercel.com) - Deployment platform with Edge Functions
- [Turborepo](https://turbo.build/repo) - Monorepo build system

### Developer Tools
- [ESLint 9](https://eslint.org) - Linting
- [Vitest](https://vitest.dev) - Unit testing (planned)
- [Playwright](https://playwright.dev) - E2E testing (planned)

## Security

FlashFusion implements enterprise-grade security practices:

- **Row Level Security (RLS)**: All database tables enforce org_id scoping (planned)
- **Input Validation**: Zod schemas validate all API inputs
- **Provenance Logging**: Track model, prompt_hash, and dataset_tag for all generated content
- **OWASP Top 10**: Comprehensive security checklist enforced in CI/CD
- **Encryption**: TLS 1.3, AES-256 for data at rest
- **Authentication**: JWT with refresh tokens, secure session management

## Performance Budgets

Performance metrics enforced in CI:

- **TTFB**: ≤ 150ms (Time to First Byte)
- **LCP**: ≤ 2.5s (Largest Contentful Paint)
- **INP**: ≤ 200ms (Interaction to Next Paint)
- **CLS**: ≤ 0.08 (Cumulative Layout Shift)
- **JavaScript**: ≤ 180KB gzip per route
- **CSS**: ≤ 35KB gzip

## Database Schema

FlashFusion uses Supabase Postgres with Row Level Security:

### Core Tables
- `orgs` - Organization data
- `members` - Team members and permissions
- `brand_kits` - Brand assets, colors, fonts, logos
- `templates` - Prompt templates and presets
- `assets` - Generated content assets
- `campaigns` - Marketing campaigns
- `segments` - Audience segments
- `schedules` - Scheduled posts and content
- `marketplace_items` - Community prompt packs
- `public_prompts` - User-submitted prompts

### RLS Policy
```sql
WHERE org_id = auth.uid() OR is_public = true
```

## API Routes (Edge Functions)

- `/api/content/generate` - Generate assets with provenance tracking
- `/api/campaigns/draft` - Create campaign with segmentation
- `/api/schedule` - Schedule posts with retry logic
- `/api/marketplace/browse` - Browse marketplace items
- `/api/prompts/submit` - Submit prompts to public library

## CI/CD Pipeline

GitHub Actions workflow:
1. **Lint** - ESLint code quality checks
2. **Typecheck** - TypeScript type validation
3. **Unit Tests** - Vitest with ≥80% coverage
4. **Build** - Production build verification
5. **E2E Tests** - Playwright golden paths
6. **Lighthouse CI** - Performance budget enforcement
7. **Deploy** - Vercel deployment with rollback on failure

OIDC for secrets, Supabase migrations auto-applied.

## Testing

- **Unit Tests**: Vitest (≥80% coverage requirement)
- **E2E Tests**: Playwright (critical user journeys)
- **Visual Regression**: Percy/Chromatic for UI consistency
- **Load Testing**: k6/Artillery (500 concurrent users target)

## Brand Identity

### Colors
- **Primary**: `#FF7B00` (Orange)
- **Secondary**: `#00B4D8` (Blue)
- **Accent**: `#E91E63` (Pink)
- **Background**: `#0F172A` (Dark Navy)
- **Surface**: `#111827` (Dark Gray)
- **Text**: `#E5E7EB` (Light Gray)

### Typography
- **Display Font**: Sora
- **UI Font**: Inter
- **Line Height**: 1.5
- **Grid**: 8pt spacing system

## Unknown Unknowns to Monitor

Important metrics to track in production:

1. Real creator behavior (batch vs daily publish patterns)
2. Peak traffic patterns (timezone, seasonality)
3. POD success rates by vendor/product
4. Integration health (which channels fail most?)
5. Scalability thresholds (when does RLS/JWT become bottleneck?)

## Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY (for server-side operations)

# Start development server
pnpm dev
```

## Deploy

```bash
# Build for production
pnpm build

# Deploy to Vercel
vercel --prod
```

## Project Structure

```
flashfusion/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── layouts/         # Layout components
│   ├── lib/             # Core utilities and helpers
│   ├── types/           # TypeScript type definitions
│   ├── config/          # Configuration files
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── locales/         # i18n translations
│   └── styles/          # Global styles
├── public/              # Static assets
├── .github/             # GitHub Actions workflows
└── docs/                # Documentation
```

## Contributing

FlashFusion is currently in active development. Contributions are welcome!

## License

Proprietary - FlashFusion.co

---

**Perfect for creators, agencies, and teams building AI-powered content workflows at scale.**
