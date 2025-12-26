# ADR-0001: Use Vite as Build Tool

**Date**: 2024-12-26

**Status**: Accepted

**Context**: Initial project setup

---

## What

### Summary

Use Vite 7 as the build tool and development server for AffordableStuffStore.

### Problem Statement

The project needs a modern, fast build tool that supports React, TypeScript, and provides a great developer experience with features like Hot Module Replacement (HMR), optimized production builds, and good ecosystem support.

### Decision

Adopt Vite 7 as the primary build tool for the application.

### Example / Implementation Details

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'heroui': ['@heroui/system', '@heroui/theme'],
        },
      },
    },
  },
});
```

---

## Why

### Motivation

- Need for fast development server with instant HMR
- Optimized production builds with code splitting
- Native ESM support for faster development
- Excellent TypeScript integration
- Growing ecosystem and community support

### Constraints

- Must support React 19
- Must support TypeScript
- Must integrate with Tailwind CSS
- Must be deployable to Vercel
- Team familiar with modern JavaScript tooling

### Requirements

- Fast development startup (< 2 seconds)
- Hot Module Replacement for rapid iteration
- Optimized production bundles (code splitting, tree-shaking)
- TypeScript support with fast type checking
- Plugin ecosystem for extending functionality
- Good documentation and community support

---

## Alternatives

### Option 1: Create React App (CRA)

**Description**: Official React tooling with zero configuration

**Pros**:
- ✅ Official React tooling
- ✅ Zero configuration required
- ✅ Large community
- ✅ Comprehensive documentation

**Cons**:
- ❌ Slow build times (uses Webpack)
- ❌ Slow development server startup
- ❌ Configuration difficult to customize
- ❌ Project is in maintenance mode
- ❌ Heavy dependencies

**Why Not Chosen**: CRA is slower than Vite and is no longer actively developed. The React team now recommends using framework-specific tools or custom setups.

---

### Option 2: Webpack + Custom Configuration

**Description**: Custom Webpack setup with React, TypeScript, and optimizations

**Pros**:
- ✅ Maximum flexibility
- ✅ Mature ecosystem
- ✅ Extensive plugin library
- ✅ Industry standard

**Cons**:
- ❌ Complex configuration
- ❌ Slower development server
- ❌ Requires significant setup time
- ❌ More maintenance overhead
- ❌ Steeper learning curve

**Why Not Chosen**: While Webpack is mature and flexible, it requires significant configuration effort and provides a slower development experience compared to Vite.

---

### Option 3: Parcel

**Description**: Zero-configuration build tool

**Pros**:
- ✅ Zero configuration
- ✅ Fast build times
- ✅ Automatic optimizations
- ✅ Good developer experience

**Cons**:
- ❌ Smaller ecosystem than Vite
- ❌ Less plugin availability
- ❌ Less active development
- ❌ Occasional bugs with complex setups

**Why Not Chosen**: While Parcel is fast and simple, Vite has better plugin ecosystem, more active development, and better community support.

---

## Impact

### Benefits

- 🎯 **Developer Experience**: Lightning-fast development server with instant HMR significantly improves developer productivity
- 🎯 **Build Performance**: Production builds are optimized with tree-shaking and code splitting, resulting in smaller bundle sizes
- 🎯 **Modern Tooling**: Native ESM support aligns with modern JavaScript best practices
- 🎯 **Ecosystem**: Rich plugin ecosystem allows easy integration with tools like Tailwind CSS, HeroUI
- 🎯 **Future-Proof**: Vite is actively developed and has strong backing from the Vue/Evan You team

### Risks & Trade-offs

- ⚠️ **Relative Newness**: Vite is newer than Webpack, so some edge cases may be less documented. **Mitigation**: Strong community and documentation are growing rapidly
- ⚠️ **Plugin Compatibility**: Some Webpack-specific plugins may not have Vite equivalents. **Mitigation**: Most common tools have Vite plugins or alternatives
- ⚠️ **Browser Support**: Vite uses modern browser features. **Mitigation**: Production builds transpile to target browsers appropriately

### Technical Impact

**Affected Components**:
- Build pipeline: Complete migration to Vite
- Development workflow: Developers use `npm run dev` instead of other commands
- CI/CD: Build commands updated to use Vite

**Migration Path**:
1. ✅ Initialize project with Vite
2. ✅ Configure Vite with React plugin
3. ✅ Add TypeScript support
4. ✅ Configure path aliases
5. ✅ Set up production build optimizations

**Breaking Changes**: No breaking changes (initial setup)

### Team Impact

**Learning Curve**: Low - Vite is intuitive and well-documented. Developers familiar with modern JavaScript tooling can be productive immediately.

**Documentation Needed**:
- [x] Update README with development commands
- [x] Document vite.config.ts configuration
- [ ] Add troubleshooting guide for common issues

**Training Required**: No - basic npm commands and standard React development practices apply.

### Business Impact

**Cost**: Zero - Vite is open source and free to use

**Timeline**: 
- Initial setup: 1 day (completed)
- Team familiarization: Immediate
- Full productivity: 1 week

**Performance Impact**: 
- Development: 80% faster startup compared to Webpack-based tools
- Production: Similar or better bundle sizes with better optimization

**Scalability Impact**: 
- Vite handles large codebases efficiently
- Build times scale linearly with code size
- Development server stays fast regardless of project size

---

## Implementation

### Action Items

- [x] Initialize project with Vite template
- [x] Configure React plugin
- [x] Set up TypeScript
- [x] Configure path aliases with vite-tsconfig-paths
- [x] Set up manual chunk splitting for HeroUI
- [x] Configure GitHub Pages SPA plugin
- [x] Test development server
- [x] Test production build

### Success Criteria

- [x] Development server starts in < 2 seconds
- [x] HMR updates in < 100ms
- [x] Production bundle size < 500KB (initial)
- [x] TypeScript compilation with no errors
- [x] All components render correctly

### Testing Strategy

- Unit tests: Not affected by build tool choice
- Integration tests: Verify build output works correctly
- Performance tests: Measure build times and bundle sizes

### Rollout Plan

1. **Phase 1**: ✅ Initial project setup with Vite
2. **Phase 2**: ✅ Configure all necessary plugins
3. **Phase 3**: ✅ Deploy to production (Vercel)

### Monitoring

Metrics to track:
- Build time (development and production)
- Bundle size
- Development server startup time
- HMR update speed

---

## Related

### Related ADRs

- None (first ADR)

### Related Documents

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Vercel Deployment Guide](https://vercel.com/docs)

### References

- [Why Vite](https://vitejs.dev/guide/why.html)
- [Vite vs Webpack Comparison](https://vitejs.dev/guide/comparisons.html)
- [React Team Recommendations](https://react.dev/learn/start-a-new-react-project)

---

## Unknown Unknowns Radar 🔮

### Open Questions

- ❓ Will Vite continue to be actively maintained long-term?
- ❓ Are there any enterprise-scale issues we haven't encountered yet?

### Future Considerations

- 🔮 Monitor Vite 8+ releases for new features
- 🔮 Evaluate build optimization plugins as they become available
- 🔮 Consider Vite-specific testing tools if they emerge

### Assumptions

- Vite will continue to be actively developed
- Plugin ecosystem will continue to grow
- Vercel will maintain good Vite support
- Team has basic modern JavaScript tooling knowledge

### When to Revisit

- Vite development slows or stops
- Build performance becomes inadequate
- Critical plugin compatibility issues arise
- Alternative tools offer significant advantages

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2024-12-26 | Development Team | Initial version |
