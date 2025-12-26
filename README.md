# FlashFusion Core Architecture

> **⚠️ Architecture Transformation**: This repository has been migrated from a Vite + React template to the **FlashFusion Core Architecture** - a production-ready, enterprise-grade application framework.

## 🎯 What is FlashFusion?

FlashFusion is a modern, full-stack application architecture that combines the best tools and practices for building scalable, secure, and observable applications.

### Key Features

- ⚡ **Next.js 15** with App Router and React Server Components
- 🎨 **Tailwind CSS v4** with custom FlashFusion brand colors
- 🧩 **shadcn/ui** component library for consistent UI
- 📦 **Turborepo + PNPM** monorepo for efficient builds
- 🔐 **Supabase** for authentication, database, and storage
- 👷 **Worker Services** for background processing
- 📊 **Full Observability** with Sentry, PostHog, and OpenTelemetry
- 🧪 **Complete Testing** with Vitest and Playwright
- 🛡️ **Enterprise Security** with RLS, CSP, and CSRF protection

## 📖 Documentation

For complete documentation, see **[FLASHFUSION.md](./FLASHFUSION.md)**

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
pnpm test:e2e
```

## 🏗️ Architecture Overview

```
flashfusion/
├── apps/
│   ├── web/              # Next.js application
│   └── workers/          # Background workers
│       ├── render/       # Render processing
│       ├── schedule/     # Task scheduling
│       └── insights/     # Analytics
├── packages/
│   ├── ui/               # Shared UI components
│   ├── config/           # Shared configurations
│   └── shared/           # Utilities
└── supabase/
    └── migrations/       # Database schema
```

## 🎨 Brand Colors

FlashFusion uses a vibrant, modern color palette:

- **Primary**: `#FF7B00` - Energetic orange
- **Secondary**: `#00B4D8` - Fresh blue
- **Accent**: `#E91E63` - Bold pink

Access these in your code via CSS variables:
```css
color: var(--color-ff-primary);
color: var(--color-ff-secondary);
color: var(--color-ff-accent);
```

## 🔐 Security First

FlashFusion is built with security as a priority:

- ✅ Row Level Security (RLS) policies on all tables
- ✅ Content Security Policy (CSP) headers
- ✅ CSRF token protection
- ✅ Secure environment variable management
- ✅ Regular secrets rotation support

## 📊 Built-in Observability

Monitor your application with confidence:

- **Sentry**: Error tracking and performance monitoring
- **PostHog**: Product analytics and feature flags
- **OpenTelemetry**: Distributed tracing

## 🧪 Testing Strategy

Comprehensive testing setup:

- **Vitest**: Fast unit and integration tests
- **Playwright**: Reliable end-to-end testing
- **Coverage**: Track test coverage automatically

## 🚢 Deployment

Optimized for Vercel Edge deployment:

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

Workers can be deployed separately to any Node.js hosting platform.

## 📚 Technologies

### Frontend
- Next.js 15
- React 19
- Tailwind CSS v4
- shadcn/ui
- Framer Motion

### Backend
- Supabase (PostgreSQL)
- Row Level Security
- Real-time subscriptions
- Storage

### Infrastructure
- Turborepo
- PNPM workspaces
- Vercel Edge Runtime

### Observability
- Sentry
- PostHog
- OpenTelemetry

### Testing
- Vitest
- Playwright
- React Testing Library

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines in [FLASHFUSION.md](./FLASHFUSION.md).

## 📝 License

MIT License - see LICENSE file for details

---

## Migration Notes

### What Changed?

This repository was previously a Vite + React template. It has been transformed into the FlashFusion Core Architecture with:

- ✅ Monorepo structure with Turborepo
- ✅ Next.js 15 replacing Vite
- ✅ shadcn/ui replacing HeroUI
- ✅ Supabase backend integration
- ✅ Worker services for background tasks
- ✅ Full observability stack
- ✅ Comprehensive testing setup
- ✅ Enterprise security features

### Old Files

Some old configuration files are now deprecated:
- `index.html` (Next.js handles this)
- `vite.config.ts` (Using Next.js config)
- HeroUI components (Replaced with shadcn/ui)

These are ignored in `.gitignore` but remain for reference.

---

**Built with ❤️ using the FlashFusion Core Architecture**


## Adding a New Page

This section explains how to create a new page with the default layout and add it to the navigation menus.

### 1. Create the Page Component

First, create a new file in the `src/pages` directory. For example, let's create a "Contact" page:

```tsx
// filepath: src/pages/contact.tsx
import { Trans, useTranslation } from "react-i18next";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>
            <Trans t={t}>contact</Trans>
          </h1>
          <p className="mt-4 text-default-600">
            This is the contact page content. You can add your contact form or information here.
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}
```

### 2. Add Translation Keys

Add the new page's translation key to each language file in the `src/locales/base` directory:

```jsonc
// Add to each language JSON file (en-US.json, fr-FR.json, etc.)
{
  // ... existing translations
  "contact": "Contact" // For English - adjust for other languages
}
```

### 3. Add the Route

Update the `App.tsx` file to include a route for your new page:

```tsx
// filepath: src/App.tsx
import ContactPage from "@/pages/contact";

function App() {
  return (
    <CookieConsentProvider>
      <CookieConsent />
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<DocsPage />} path="/docs" />
        <Route element={<PricingPage />} path="/pricing" />
        <Route element={<BlogPage />} path="/blog" />
        <Route element={<AboutPage />} path="/about" />
        {/* Add the new route */}
        <Route element={<ContactPage />} path="/contact" />
      </Routes>
    </CookieConsentProvider>
  );
}
```

### 4. Add to Navigation Menus

Update the `src/config/site.ts` file to include your new page in both the desktop navigation and mobile menu:

```typescript
// filepath: src/config/site.ts
export const siteConfig = () => ({
  // ... existing config
  navItems: [
    {
      label: i18next.t("home"),
      href: "/",
    },
    {
      label: i18next.t("docs"),
      href: "/docs",
    },
    {
      label: i18next.t("pricing"),
      href: "/pricing",
    },
    {
      label: i18next.t("blog"),
      href: "/blog",
    },
    {
      label: i18next.t("about"),
      href: "/about",
    },
    // Add the new page to desktop navigation
    {
      label: i18next.t("contact"),
      href: "/contact",
    },
  ],
  navMenuItems: [
    {
      label: i18next.t("profile"),
      href: "/profile",
    },
    // ... other mobile menu items
    
    // Add the new page to mobile menu (before logout)
    {
      label: i18next.t("contact"),
      href: "/contact",
    },
    {
      label: i18next.t("logout"),
      href: "/logout",
    },
  ],
  // ... rest of config
});
```

### 5. Test Your New Page

Start your development server and verify that:

- The new page is accessible via its route (e.g., <http://localhost:5173/contact>)
- The page appears in both desktop and mobile navigation menus
- The page title is correctly translated based on the selected language

That's it! You've successfully added a new page with the default layout and included it in the navigation menus.

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
