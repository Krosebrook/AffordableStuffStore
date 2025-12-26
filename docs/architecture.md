# Architecture Documentation

## System Overview

AffordableStuffStore is a modern e-commerce web application built with React, Vite, and HeroUI. The application follows a component-based architecture with clear separation of concerns.

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **UI Library**: HeroUI v2
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Internationalization**: i18next
- **Animation**: Framer Motion
- **Type System**: TypeScript

## Architecture Layers

### Presentation Layer

The presentation layer consists of React components organized into:

- **Pages** (`/src/pages`): Top-level route components
- **Components** (`/src/components`): Reusable UI components
- **Layouts** (`/src/layouts`): Page layout templates

### Application Layer

- **Contexts** (`/src/contexts`): React context providers for global state
- **Hooks** (`/src/hooks`): Custom React hooks for shared logic
- **Config** (`/src/config`): Application configuration

### Data Flow

1. User interacts with UI components
2. Components dispatch actions or update context
3. Context providers manage global state
4. Components re-render based on state changes

## Key Components

### Navigation System

- `Navbar`: Main navigation component with responsive design
- `LanguageSwitch`: Language selector component
- Navigation configuration in `src/config/site.ts`

### Internationalization

- i18next configuration in `src/i18n.ts`
- Translation files in `src/locales/base/`
- Lazy loading of translations via HTTP backend
- RTL language support

### Cookie Consent

- Context-based cookie consent management
- Modal-based UI with HeroUI components
- LocalStorage persistence

## Build & Deployment

### Build Process

1. TypeScript compilation
2. Vite bundling with code splitting
3. Manual chunk splitting for HeroUI packages
4. GitHub Pages SPA plugin for deployment

### Code Splitting Strategy

- Vendor packages split into separate chunks
- Route-based code splitting via React Router
- Manual splitting of @heroui packages to optimize bundle size

## Scalability Considerations

- **Component Reusability**: All UI components are modular and reusable
- **Lazy Loading**: Translations and routes are lazy-loaded
- **Code Splitting**: Reduces initial bundle size
- **Type Safety**: TypeScript provides compile-time checks

## Security Architecture

See [security.md](./security.md) for detailed security measures.

## Performance Optimization

See [performance.md](./performance.md) for performance budgets and baselines.

---

## Unknown Unknowns Radar 🔮

### Potential Risks & Considerations

- **Third-party Dependencies**: Future breaking changes in HeroUI, React, or Tailwind CSS
- **Browser Compatibility**: Emerging browser features may require polyfills
- **Scalability**: How the architecture scales with growing number of pages and features
- **State Management**: May need Redux/Zustand as application complexity grows
- **API Integration**: Current architecture doesn't specify backend integration patterns
- **Authentication**: No auth system defined in current architecture
- **Data Persistence**: No strategy for client-side data caching or offline support
- **Analytics Integration**: No clear pattern for integrating analytics tools
- **Error Boundaries**: Error handling strategy needs formalization
- **Performance Monitoring**: Need to establish monitoring for production issues
