# Portfolio Project

A modern, responsive portfolio website built with Next.js 15, TypeScript, and TailwindCSS.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Package Manager**: PNPM
- **Linting**: ESLint with Next.js config

## 📁 Project Structure

```
porfolio/
├── src/
│   ├── app/
│   │   ├── globals.css                        # Global styles (Tailwind v4 CSS-first)
│   │   ├── layout.tsx                         # Root layout + Web Vitals injector
│   │   ├── page.tsx                           # Homepage
│   │   ├── sitemap.ts                         # Sitemap generator
│   │   ├── robots.ts                          # Robots.txt generator
│   │   ├── opengraph-image.tsx                # Default OG image (1200x630)
│   │   ├── icon.tsx                           # Favicon generator (served as /favicon.ico)
│   │   ├── apple-icon.tsx                     # Apple touch icon (180x180)
│   │   └── blog/
│   │       └── [slug]/
│   │           ├── page.tsx                   # Blog post page (metadata + JSON-LD)
│   │           └── opengraph-image.tsx        # Per-post OG image
│   ├── components/
│   │   └── monitoring/
│   │       └── WebVitals.tsx                  # Sends Web Vitals to /api/web-vitals
│   ├── lib/
│   │   ├── blog.ts                            # Blog utilities (MDX, frontmatter)
│   │   └── seo.ts                             # SEO helpers (siteUrl, absoluteUrl)
│   └── app/api/
│       └── web-vitals/route.ts                # Receives Web Vitals metrics
├── .gitignore                                 # Git ignore rules
├── eslint.config.mjs                          # ESLint configuration
├── next.config.ts                             # Next.js configuration
├── package.json                               # Dependencies and scripts
├── pnpm-lock.yaml                             # PNPM lockfile
├── postcss.config.mjs                         # PostCSS configuration for Tailwind v4
└── tsconfig.json                              # TypeScript configuration
```

## 🌍 Internationalization (i18n)

- **Languages**: English (en) and French (fr)
- **Library**: next-intl for comprehensive i18n support
- **Content Management**: All content centralized in MDX files and JSON messages
- **URL Structure**: `/en/...` and `/fr/...` for locale-specific routes
- **Features**:
  - Automatic locale detection and redirection
  - Language switcher component in header
  - Translated navigation, forms, and UI elements
  - SEO-friendly URL structure
  - Fallback to default locale (English)

### Content Structure
```
src/
├── content/i18n/
│   ├── en/          # English content (MDX files)
│   └── fr/          # French content (MDX files)
├── messages/
│   ├── en.json      # English UI translations
│   └── fr.json      # French UI translations
└── i18n/
    ├── routing.ts   # Route definitions and navigation
    └── request.ts   # i18n configuration
```

## 🛠️ Development Guidelines

### Getting Started
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

### Code Standards
- Use TypeScript for all components and utilities
- Follow Next.js 15 App Router conventions
- Use TailwindCSS v4 for all styling (CSS-first configuration)
- Implement responsive design mobile-first
- Use semantic HTML elements
- Follow accessibility best practices

### Component Guidelines
- Create reusable components in `src/components/`
- Use functional components with hooks
- Implement proper TypeScript types for all props
- Use descriptive component and prop names
- Include JSDoc comments for complex functions

### Styling Guidelines
- Use TailwindCSS v4 utility classes
- Leverage Tailwind's design system (spacing, colors, typography)
- Configure themes using @theme directive in globals.css
- Use CSS variables for custom colors and values
- Implement dark mode support when needed
- Ensure responsive design with Tailwind breakpoints

### Animation Guidelines
- Use Framer Motion for all animations and interactions
- Leverage built-in animation components from `@/components/animations`
- Follow performance best practices (avoid animating layout properties)
- Use scroll-triggered animations for sections that appear on scroll
- Ensure animations are accessible and respect user preferences

### File Organization
- Keep components modular and focused on single responsibility
- Use barrel exports (index.ts files) for clean imports
- Group related files in feature-based directories
- Place shared utilities in `src/lib/` or `src/utils/`

## 🎨 Current Features

- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Modern UI**: Gradient backgrounds, glassmorphism effects, smooth animations
- **Performance Monitoring**: Client-side Web Vitals reported to `/api/web-vitals` and logged on the server
- **Blog MDX polish**: GFM support (tables, task lists), Shiki-based code highlighting via rehype-pretty-code, callouts/admonitions (NOTE/TIP/WARNING/etc.), and automatic mapping of Markdown `img` → `next/image`.
- **SEO + Feeds**: Global and per-post metadata, canonical URLs, Open Graph & Twitter cards, sitemap (`/sitemap.xml`), robots (`/robots.txt`), JSON-LD for blog posts, WebSite + BreadcrumbList JSON-LD, default and per-post OG images, favicon and Apple touch icon, plus RSS (`/rss.xml`) and JSON Feed (`/feed.json`).
- **Navigation**: Smooth scrolling navigation with anchor links
- **Sections**: Hero, About, Projects, Contact, Footer
- **Contact Form**: Fully functional form with validation, spam protection, and email integration
- **Interactive Elements**: Hover effects, button animations, card transforms
- **Typography**: Inter font with proper hierarchy
- **Color Scheme**: Purple/pink gradient theme with dark background
 - **PWA**: Installable app with `/manifest.webmanifest`, theme color, offline fallback (`/offline`), dynamic icons (`/icon-192`, `/icon-512`, `/apple-icon`), and service worker caching

## ♿ Accessibility

- Respects `prefers-reduced-motion` across all Framer Motion components
- Global `:focus-visible` outlines for clear keyboard focus, skip-to-content link, and `main` landmark
- Dev-only axe integration to surface runtime accessibility issues during development

## 📋 Development Workflow for Cursor AI

### When Adding New Features:
1. **Plan**: Break down the feature into smaller tasks
2. **Structure**: Determine if new components/pages are needed
3. **Implement**: Write TypeScript components with proper types
4. **Style**: Use TailwindCSS utilities following the existing design system
5. **Test**: Check responsiveness and functionality
6. **Lint**: Run ESLint and fix any issues

### When Modifying Existing Code:
1. **Read**: Always read the existing file first to understand context
2. **Preserve**: Maintain existing code style and patterns
3. **Extend**: Build upon existing functionality rather than rewriting
4. **Types**: Update TypeScript types when modifying interfaces
5. **Responsive**: Ensure changes work across all screen sizes

### Common Tasks:
- **Adding Components**: Create in `src/components/` with TypeScript
- **New Pages**: Add to `src/app/` following App Router conventions
- **Styling Changes**: Modify TailwindCSS classes, avoid custom CSS
- **Content Updates**: Update text, images, and data in components
- **Performance**: Use Next.js optimization features (Image, Link, etc.)

### File Naming Conventions:
- Components: PascalCase (e.g., `NavBar.tsx`, `ProjectCard.tsx`)
- Pages: lowercase (e.g., `page.tsx`, `layout.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`, `apiHelpers.ts`)
- Types: PascalCase (e.g., `types.ts` with exported interfaces)

## 🔧 Configuration Files

- **package.json**: Dependencies and scripts configuration
- **tsconfig.json**: TypeScript compiler options with Next.js optimizations
- **src/app/globals.css**: TailwindCSS v4 configuration with @theme directive
- **next.config.ts**: Next.js configuration with experimental features
- **eslint.config.mjs**: Linting rules for code quality
- **postcss.config.mjs**: PostCSS configuration for TailwindCSS v4

## 📱 Responsive Breakpoints

- **sm**: 640px and up
- **md**: 768px and up  
- **lg**: 1024px and up
- **xl**: 1280px and up
- **2xl**: 1536px and up

## 🎯 Future Enhancements

Consider implementing these features:
- [x] Contact form with validation
- [x] Add a honeypot mechanism to the contact form to prevent spam
- [x] Dynamically display the year in the footer (not 2024 hardcoded)
- [x] Blog section with MDX
- [x] Animation library integration (Framer Motion)
- [x] Performance monitoring with Web Vitals
- [x] SEO optimization (metadata, sitemap, robots, JSON-LD, OG images, icons)
- [x] Add Vercel Speed Insights
- [x] Analytics integration (Vercel Analytics)
- [x] Custom pages: improved `not-found` and error pages with helpful navigation
- [x] Accessibility: axe/Lighthouse pass, `prefers-reduced-motion`, focus-visible states
- [x] RSS and JSON feeds for blog (`/rss.xml`, `/feed.json`)
- [x] Blog tags, filters, and pagination (e.g., `/blog/tag/[tag]` and paginated lists)
- [x] MDX polish: code highlighting (Shiki/rehype-pretty-code), callouts/admonitions, map Markdown `img` → `next/image`
- [x] PWA: `manifest.webmanifest`, theme-color, offline fallback, Add to Home Screen
- [x] Structured data: add `WebSite` and `BreadcrumbList` JSON-LD
- [x] Sitemap: real `lastModified` from frontmatter or file mtime
- [x] Words count and improve reading time calculation to blog posts
- [x] Add more dark themes gradient (purple, pink, blue, green, orange, red, etc.) with a toogle button
- [x] Add CGU and Privacy Policy pages
- [x] Add an hamburger menu for mobile
- [x] Refactor the code: the footer is not showing on all pages. Remove code redundancy.
- [x] Fix the footer : don't underline the links, display terms, privacy, contact and below copyright
- [x] Improve the Hamburger menu on mobile : put text on the right and reduce the menu size.
- [x] Global search (site-wide)
- [x] Fix service-worker.js
- [x] Fix header + remove light theme
- [x] Internationalization (i18n) with only English and French for now
    - [x] Add back: "Enjoyed this post? Let's connect and discuss your next project or any questions you might have." and "Read more posts" and "Get in touch" buttons at the end of the blog article
    - [x] Investigate initial loading time to change region.
- [ ] CI/CD: GitHub Actions for lint/build/test on PRs

## 🔧 Environment Variables

Set these in your Vercel project (Production & Preview):

- `RESEND_API_KEY` – Resend API key for contact form emails
- `CONTACT_EMAIL` – Recipient email for contact form
- `FROM_EMAIL` – Verified sender for Resend
- `NEXT_PUBLIC_SITE_URL` – Public site URL (e.g., https://yourdomain.com) used for canonical/OG URLs

## 📝 Notes for AI Development

- Always use the latest Next.js 15 patterns and conventions
- Prefer App Router over Pages Router
- Use TypeScript strictly - no `any` types
- Implement proper error boundaries and loading states
- Follow the existing design system and color palette
- Ensure all interactive elements have proper accessibility
- Test changes across different screen sizes
- Keep dependencies up to date and minimal

---

**Last Updated**: August 2025
**Next.js Version**: 15.4.6  
**React Version**: 19.1.1  
**TailwindCSS Version**: 4.1.11 (latest)  
**TypeScript Version**: 5.9.2  
**ESLint Version**: 9.32.0  
**Node.js**: Requires Node.js 18.17 or later  
**PNPM Version**: 10.14.0

## 🧭 Audit: Performance, Security & Recommendations

This section summarizes a code audit (performance bottlenecks, suggested optimizations, and potential security risks) with actionable recommendations. Use it as a checklist when hardening and optimizing the project.

### Summary Checklist

- [x] Review service-worker caching strategy and adjust for safe resource caching
- [x] Validate /api endpoints and add rate-limiting or authentication if exposing sensitive logs
- [x] Replace any unsafe use of `dangerouslySetInnerHTML` with safe serializers or strict input validation where feasible
- [x] Avoid blocking synchronous fs calls on the server in hot paths; prefer async APIs
- [x] Limit client-side telemetry to aggregated/minimal data and consider sampling
- [ ] Lock down environment variables and avoid leaking sensitive values to the client

### Performance findings

- Synchronous filesystem operations in `src/lib/blog.ts` (e.g., `fs.readFileSync`, `fs.readdirSync`, `fs.statSync`) read MDX files using blocking calls. These are acceptable during build-time or server-start, but may be problematic if executed per-request on serverless functions or edge runtimes. Consider using async variants (`fs.promises`) or move heavy I/O to build-time (getStaticProps / caching / revalidate) or a dedicated content indexing step.

- The service worker (`src/app/service-worker.js`) currently caches requests by performing network fetches on every GET and writing responses to cache. This can increase latency for cache-first assets and may store large responses (images) unnecessarily. Consider a cache-first strategy for static assets and selective caching for dynamic routes. Also limit `cache.addAll(['/', '/offline'])` to explicitly versioned assets.

- `layout.tsx` registers the service worker on page load by fetching the script with `HEAD` then registering; the inline script runs in the client and uses `fetch` and `navigator.serviceWorker.register`. This is fine, but avoid registering on pages that don't require offline support; consider gated registration behind feature detection and user opt-in for PWAs.

- Generating feeds (`/feed.json`, `/rss.xml`) calls `getAllBlogPosts()` which currently reads files synchronously. These endpoints are revalidated hourly (`revalidate = 3600`), which reduces runtime pressure, but use async I/O where possible to prevent blocking edge/node worker threads during generation.

### Security findings

- `dangerouslySetInnerHTML` is used in `src/app/layout.tsx` to inject JSON-LD and an inline script. The JSON-LD is generated from controlled data (`siteUrl`) — low risk — but inline scripts are a CSP/attack surface consideration. If CSP is enforced, prefer using Next.js `Script` or adding a nonce-based CSP to allow trusted inline scripts.

- The Web Vitals endpoint (`src/app/api/web-vitals/route.ts`) accepts JSON and logs it to the server. There is basic shape validation but no rate limiting or authentication. This endpoint could be abused to spam logs or store malicious payloads. Add stricter validation (types, value ranges), optional sampling, and consider rate-limiting or using an external telemetry ingestion service.

- Environment variables: `src/lib/seo.ts` reads `NEXT_PUBLIC_SITE_URL` into a client-visible constant. Ensure only non-sensitive environment variables are prefixed with NEXT_PUBLIC_*. Secrets like `RESEND_API_KEY` should not be exposed to the client.

- The contact form uses server/email integrations (see `src/app/api/contact/route.ts`) — ensure API keys are stored in server-only env vars and not referenced in client bundles.

### Suggested optimizations (concrete)

1. Replace blocking `fs` calls in `src/lib/blog.ts` with `fs.promises` async equivalents or pre-build an index (JSON) of posts during build step and read that at runtime.

2. Use cache-first strategy in the service worker for static assets and a network-first strategy for API calls that must stay fresh. Limit the size of the cache and periodically purge old entries.

3. Harden `WebVitals` reporting: sample metrics client-side (e.g., 5% sampling) and validate payloads server-side. Optionally forward metrics to a managed APM instead of logging raw payloads.

4. Add Content Security Policy (CSP) and use nonces for inline scripts where possible. Replace `dangerouslySetInnerHTML` for scripts with controlled `Script` components when supported.

5. Add input validation and rate-limiting middleware to any public POST endpoints (contact, web-vitals, search). Consider using a third-party rate-limiter or Vercel Edge middleware where appropriate.

6. Pin and minimize dependencies; keep Shiki/rehype code highlighting in build-time transforms rather than runtime to reduce server load.

7. When serving feeds, stream responses if the dataset grows large and paginate items. Also consider caching the generated feed as a static file during the build.

### Low-risk code improvements to implement now

- Convert `getAllBlogPosts()` to use async I/O and memoize results for the lifetime of a serverless invocation or process.
- Add basic validation in `POST /api/web-vitals` to constrain numeric ranges (e.g., value between 0 and 100000) and string lengths.
- Limit the service worker cache keys to known origins and avoid caching third-party responses.

### Notes: Web Vitals endpoint configuration

- Optional server-side API key: set `WEBVITALS_API_KEY` (server-only) to require an `x-api-key` header for `POST /api/web-vitals`.
- Client sampling rate: set `NEXT_PUBLIC_WEBVITALS_SAMPLE` to a decimal between `0` and `1` (default 0.05) to control client-side sampling of metrics.
 - Client batching & truncation: client-side metrics are batched and truncated to avoid PII. Two client-side configs can be set via env:
   - `NEXT_PUBLIC_WEBVITALS_SAMPLE` (decimal 0-1) — sampling rate, default 0.05
   - `NEXT_PUBLIC_WEBVITALS_BATCH_MAX` (integer) — batch size before immediate flush (default 10)

Quick test (local):

```bash
# send a sample metric
curl -X POST http://localhost:3000/api/web-vitals \
  -H 'Content-Type: application/json' \
  -d '{"name":"CLS","value":0.02,"timestamp":'"$(date +%s%3N)"'}'
```

If `WEBVITALS_API_KEY` is set, include the header:

```bash
curl -X POST http://localhost:3000/api/web-vitals \
  -H 'Content-Type: application/json' \
  -H "x-api-key: $WEBVITALS_API_KEY" \
  -d '{"name":"LCP","value":1200,"timestamp":'"$(date +%s%3N)"'}'
```

### Final notes

This audit targets obvious and medium-impact issues found in the codebase. Prioritize blocking synchronous I/O in request paths, telemetry validation & sampling, and tightening service-worker caching. For production deployments, also run automated security scans (Snyk, npm audit) and a CSP/Lighthouse audit.

---

