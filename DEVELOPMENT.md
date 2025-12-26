# FlashFusion Development Guide

## Initial Setup

1. **Install PNPM** (if not already installed):
```bash
npm install -g pnpm@9.15.1
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Set up environment variables**:
```bash
# Web app
cp apps/web/.env.example apps/web/.env.local

# Workers
cp apps/workers/render/.env.example apps/workers/render/.env.local
cp apps/workers/schedule/.env.example apps/workers/schedule/.env.local
cp apps/workers/insights/.env.example apps/workers/insights/.env.local
```

4. **Configure Supabase**:
   - Create a project at https://supabase.com
   - Copy your project URL and anon key to `.env.local` files
   - Run migrations: `supabase db push`

## Development Workflow

### Start All Services
```bash
pnpm dev
```

This starts:
- Web app on http://localhost:3000
- All worker services in watch mode

### Start Individual Services
```bash
# Web app only
pnpm --filter @flashfusion/web dev

# Specific worker
pnpm --filter @flashfusion/render-worker dev
```

## Building

### Build Everything
```bash
pnpm build
```

### Build Specific Package
```bash
pnpm --filter @flashfusion/web build
```

## Testing

### Unit Tests
```bash
# All tests
pnpm test

# With coverage
pnpm test -- --coverage

# Watch mode
pnpm test -- --watch
```

### E2E Tests
```bash
# All E2E tests
pnpm test:e2e

# Specific browser
pnpm --filter @flashfusion/web test:e2e -- --project=chromium

# Debug mode
pnpm --filter @flashfusion/web test:e2e -- --debug
```

## Code Quality

### Linting
```bash
# Lint everything
pnpm lint

# Lint specific package
pnpm --filter @flashfusion/web lint
```

### Type Checking
```bash
# Type check everything
pnpm type-check

# Type check specific package
pnpm --filter @flashfusion/web type-check
```

## Database Migrations

### Create Migration
```bash
supabase migration new migration_name
```

### Run Migrations
```bash
supabase db push
```

### Reset Database
```bash
supabase db reset
```

## Deployment

### Vercel (Web App)
1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Workers
Deploy to any Node.js hosting:
```bash
# Build worker
pnpm --filter @flashfusion/render-worker build

# Start worker
node apps/workers/render/dist/index.js
```

## Troubleshooting

### Clear Cache
```bash
# Turbo cache
rm -rf .turbo

# Next.js cache
rm -rf apps/web/.next

# Node modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### Common Issues

**Port already in use**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**TypeScript errors**:
```bash
# Rebuild TypeScript
pnpm type-check
```

## Project Structure

```
flashfusion/
├── apps/
│   ├── web/              # Next.js web application
│   └── workers/          # Background workers
├── packages/
│   ├── ui/               # Shared UI components
│   ├── config/           # Shared configurations
│   └── shared/           # Utilities
├── supabase/
│   └── migrations/       # Database schema
├── turbo.json            # Turborepo config
└── pnpm-workspace.yaml   # PNPM workspace config
```

## Best Practices

1. **Always type check before committing**:
   ```bash
   pnpm type-check
   ```

2. **Run tests before pushing**:
   ```bash
   pnpm test
   ```

3. **Keep dependencies updated**:
   ```bash
   pnpm update --interactive --latest
   ```

4. **Use conventional commits**:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `chore:` for maintenance

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
