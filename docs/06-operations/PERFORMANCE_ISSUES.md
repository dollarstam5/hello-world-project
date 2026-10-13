# Performance Issues & Production Fixes

## Critical Issues

### 1. Radix UI Component Overload
**Status:** 🔴 CRITICAL

- **20+ Radix UI components** imported at bundle level
- Each component adds 10-15KB uncompressed
- Total Radix overhead: **~200KB+**
- Most are not used across the app

**Fix:** Tree-shake unused Radix components
```bash
# Audit actual usage
grep -r "from '@radix-ui" src/ | sort | uniq -c

# Remove unused imports
# Keep only: dialog, dropdown-menu, popover, select, tabs
```

### 2. Framer Motion Bloat
**Status:** 🔴 CRITICAL

- Version: 12.40.0 (~45KB minified)
- Used for basic transitions only
- Can be replaced with CSS animations for 90% of use cases

**Fix:** Replace with Tailwind animations
```bash
# Check actual usage
grep -r "framer-motion\|motion\." src/ | wc -l

# If < 5 uses: remove and use CSS
# If > 20 uses: optimize motion composition
```

### 3. Styles.css Size (37.8 KB)
**Status:** 🟠 HIGH

- Tailwind 4.2.1 should tree-shake, but doesn't
- All utility classes precompiled
- CSS is not splitting by route

**Fix:** Enable CSS code splitting
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    cssCodeSplit: true, // Split CSS by chunk
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['@radix-ui'],
          'query': ['@tanstack/react-query']
        }
      }
    }
  }
});
```

### 4. Monorepo Workspace Duplication
**Status:** 🟠 HIGH

- 4 packages re-bundled together
- Dependencies duplicated per package
- No shared DLL/cache

**Fix:** Consolidate workspace
```bash
# Measure before/after
du -sh dist/

# Option A: Flatten small packages into src/
# Option B: Use pnpm / yarn workspaces with linked deps
```

### 5. Image Loading Strategy Missing
**Status:** 🟠 HIGH

- No lazy loading defined
- No content-visibility optimization
- All images fetched on first render

**Fix:** Add image optimization
```typescript
// src/components/OptimizedImage.tsx
export function OptimizedImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={{ contentVisibility: 'auto' }}
    />
  );
}
```

### 6. Triple State Management
**Status:** 🟠 HIGH

- React Query (for server state)
- Zustand (for client state)
- React Router (for nav state)

**Fix:** Consolidate to React Query + Router
```bash
# Audit Zustand usage
grep -r "useStore\|zustand" src/ | wc -l

# Migrate to React Query for all state
# Remove Zustand if < 50 references
```

### 7. Missing Performance Tests
**Status:** 🟡 MEDIUM

- `check:performance-budget` script exists but no budget file
- No Core Web Vitals tracking
- No Lighthouse CI

**Fix:** Create performance budgets
```javascript
// scripts/check-performance-budgets.ts
const BUDGETS = {
  'main.js': 150_000,      // 150KB
  'vendor.js': 200_000,    // 200KB
  'styles.css': 50_000,    // 50KB
  'ttfb': 600,             // 600ms
  'lcp': 2500,             // 2.5s
  'cls': 0.1,              // < 0.1
};
```

### 8. Supabase Auth Overhead
**Status:** 🟡 MEDIUM

- Full PKCE flow on every route change
- No client-side caching
- No session persistence strategy

**Fix:** Implement session cache
```typescript
// src/lib/auth-cache.ts
const sessionCache = new Map();

export function getCachedSession() {
  const cached = sessionCache.get('auth');
  if (cached && !isExpired(cached)) return cached;
  return null;
}
```

## Production Checklist

- [ ] Audit Radix UI usage (grep analysis)
- [ ] Remove unused components
- [ ] Tree-shake Framer Motion or replace with CSS
- [ ] Enable CSS code splitting in Vite
- [ ] Consolidate workspace packages
- [ ] Add image lazy loading
- [ ] Implement session caching
- [ ] Create performance budget JSON
- [ ] Run Lighthouse CI
- [ ] Measure Core Web Vitals
- [ ] Test on 3G network
- [ ] Test on mobile device

## Expected Results

After fixes:
- Main bundle: **150KB** (from 300KB)
- Styles: **30KB** (from 37.8KB)
- TTI (Time to Interactive): **< 2s** (from 4-5s)
- LCP (Largest Contentful Paint): **< 2.5s**
- CLS (Cumulative Layout Shift): **< 0.1**

## Next Steps

1. Run `npm run audit:bundle` (create this script)
2. Prioritize top 3 fixes
3. Measure improvement per fix
4. Set performance budgets
5. Integrate into CI/CD
