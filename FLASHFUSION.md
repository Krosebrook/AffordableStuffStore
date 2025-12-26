# FlashFusion Core Architecture

FlashFusion is a modern, production-ready application architecture built with cutting-edge technologies.

## 🏗️ Architecture Overview

### Stack
- **Frontend**: Next.js 15 + React 19 + Tailwind CSS v4
- **UI Components**: shadcn/ui + Framer Motion
- **Monorepo**: Turborepo + PNPM
- **Backend**: Supabase (Auth + Postgres + RLS + Storage)
- **Workers**: Render, Schedule, and Insights workers
- **Deployment**: Vercel Edge Runtime
- **Observability**: Sentry + PostHog + OpenTelemetry
- **Testing**: Vitest + Playwright
- **Security**: RLS policies, CSP headers, CSRF protection

### Brand Colors
- Primary: `#FF7B00` (--ff-primary)
- Secondary: `#00B4D8` (--ff-secondary)
- Accent: `#E91E63` (--ff-accent)

## 📁 Project Structure

```
flashfusion/
├── apps/
│   ├── web/                    # Next.js web application
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router
│   │   │   ├── components/    # React components
│   │   │   ├── lib/           # Utilities and configurations
│   │   │   └── middleware/    # Next.js middleware
│   │   ├── sentry.*.config.ts # Sentry configurations
│   │   ├── next.config.js     # Next.js configuration
│   │   └── package.json
│   └── workers/
│       ├── render/            # Render processing worker
│       ├── schedule/          # Task scheduling worker
│       └── insights/          # Analytics insights worker
├── packages/
│   ├── ui/                    # Shared UI components (shadcn/ui)
│   ├── config/                # Shared configurations
│   └── shared/                # Shared utilities
├── supabase/
│   └── migrations/            # Database migrations
├── turbo.json                 # Turborepo configuration
├── pnpm-workspace.yaml        # PNPM workspace configuration
└── package.json               # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.0.0
- PNPM >= 9.15.1

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp apps/web/.env.example apps/web/.env.local
```

3. Configure your environment variables in `apps/web/.env.local`:
   - Supabase credentials
   - Sentry DSN
   - PostHog API key
   - CSRF secret

### Development

Start the development server:
```bash
pnpm dev
```

This will start:
- Next.js web app on `http://localhost:3000`
- All worker services in watch mode

### Building

Build all packages:
```bash
pnpm build
```

### Testing

Run unit tests:
```bash
pnpm test
```

Run end-to-end tests:
```bash
pnpm test:e2e
```

## 🔐 Security Features

### Row Level Security (RLS)
All database tables have RLS policies enabled to ensure users can only access their own data:
- `render_jobs`: Users can view and create their own jobs
- `scheduled_tasks`: Users can view and create their own tasks
- `analytics_events`: Users can view their own events and create new ones
- `insights`: Authenticated users can view all insights

### Content Security Policy (CSP)
Configured in `next.config.js` with strict policies:
- Restricts script sources
- Controls style sources
- Limits connection origins

### CSRF Protection
Implemented in middleware:
- CSRF tokens generated for each session
- Tokens validated on non-GET requests
- Stored in httpOnly cookies

### Secrets Rotation
Environment variables should be rotated regularly:
1. Update secrets in your deployment platform (Vercel)
2. Update Supabase API keys if compromised
3. Rotate CSRF secrets periodically

## 📊 Observability

### Sentry
Error tracking and performance monitoring:
- Client-side errors captured
- Server-side errors logged
- Session replay for debugging
- Performance metrics tracked

### PostHog
Product analytics:
- User behavior tracking
- Feature flag management
- A/B testing capabilities
- Funnel analysis

### OpenTelemetry
Distributed tracing:
- API request tracing
- Database query monitoring
- Worker performance tracking

## 🔄 Worker Services

### Render Worker
Processes render jobs from the queue:
- Polls `render_jobs` table every 5 seconds
- Updates job status throughout processing
- Handles failures gracefully

### Schedule Worker
Executes scheduled tasks:
- Checks for due tasks every 10 seconds
- Executes tasks based on type
- Updates task status

### Insights Worker
Generates analytics insights:
- Processes events every 5 minutes
- Aggregates user metrics
- Stores insights in database

## 🗄️ Database Schema

### Tables
- `render_jobs`: Render processing queue
- `scheduled_tasks`: Scheduled task queue
- `analytics_events`: User activity events
- `insights`: Generated analytics insights

See `supabase/migrations/` for detailed schema definitions.

## 🚢 Deployment

### Vercel
The application is optimized for Vercel Edge deployment:
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Workers
Workers can be deployed separately:
- Use containerization (Docker)
- Deploy to your preferred platform
- Ensure they have access to Supabase

## 🛠️ Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting

### Component Development
- Place shared components in `packages/ui`
- Use shadcn/ui components as base
- Apply brand colors using CSS variables

### Testing
- Write unit tests for business logic
- Add E2E tests for critical user flows
- Maintain test coverage above 70%

## 📝 License
MIT

## 🤝 Contributing
Contributions are welcome! Please read our contributing guidelines before submitting PRs.
