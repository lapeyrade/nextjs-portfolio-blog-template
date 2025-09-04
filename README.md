<div align="center">

# Next.js Portfolio Website

Modern, fast, accessible, internationalized portfolio & blog built with Next.js (App Router), TypeScript, Tailwind CSS, MDX, and progressive enhancement best practices.

</div>

## 1. Overview

This repository contains a production‑ready personal portfolio and technical blog. It showcases projects, writings, and contact options while demonstrating current best practices in performance, accessibility, SEO, i18n, PWA capabilities, and modern Frontend tooling. It is intended as both a starter and a reference implementation.

## 2. Features

### Application & Content
- App Router architecture (no legacy Pages Router)
- MDX blog with frontmatter (reading time, word count, tags, date, slug)
- Internationalization: English and French with locale detection, per-locale routes (`/en`, `/fr`), language switcher, translated UI/messages
- Static + dynamic metadata per page and per post (Open Graph, Twitter, canonical, JSON-LD)
- Structured data: WebSite, BreadcrumbList, Article (blog posts)
- Sitemap (`/sitemap.xml`) + robots (`/robots.txt`) + RSS (`/rss.xml`) + JSON Feed (`/feed.json`)
- Global search (site-wide content lookup)
- Custom error (`error.tsx`) and 404 (`not-found.tsx`) pages per locale

### UI & UX
- Responsive, mobile‑first layout; semantic HTML landmarks
- Theming via Tailwind CSS with multiple dark gradient variants (purple, pink, blue, green, orange, red, etc.)
- Framer Motion animation system (page transitions, staggered reveals, scroll-triggered fades)
- Accessible focus management (`:focus-visible`), reduced motion support, skip link
- Polished MDX rendering: GFM (tables, task lists), syntax highlighting (Shiki / rehype-pretty-code), callouts/admonitions, automatic `next/image` mapping
- Interactive components: animated buttons, cards, mobile hamburger menu, language & theme switchers

### Performance & Monitoring
- Web Vitals collection (client) posted to `/api/web-vitals` + server logging
- Lazy loading of analytics and Speed Insights (Vercel) outside critical path
- Preconnect hints for fonts and critical third-parties
- Modern browser targeting via `browserslist`
- Service worker for offline fallback and asset caching (installable PWA)
- Achieves perfect 100 scores on Google PageSpeed Insights (mobile & desktop) and Vercel Speed Insights

### SEO & Sharing
- Per-route and per-post Open Graph images (static + dynamic)
- Canonical URLs, structured metadata helpers, JSON-LD
- Favicon, Apple touch icon, and maskable PWA icons

### Forms & Email
- Contact form with validation, spam honeypot, and email delivery via Resend API

### Accessibility
- Axe (dev-only) integration for auditing
- Motion reduction compliance and keyboard navigability

### Code Quality & Tooling
- TypeScript strict mode
- Biome (linting + formatting + import organization)
- Centralized SEO and blog utility modules
- CI/CD ready (GitHub Actions placeholder friendly)

### Progressive Web App
- `manifest.webmanifest`, offline page, service worker, dynamic icons, theme color

## 3. Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | >=15.5.0 |
| Language | TypeScript | >=5.9.2 |
| Runtime | Node.js (required) | >=18.17 |
| UI | React | >=19.1.1 |
| Styling | Tailwind CSS | >=4.1.11 |
| Animations | Framer Motion | >=12.23.12 |
| Content | MDX (`@mdx-js/react`, `@next/mdx`) | >=3.1.0 / >=15.5.0 (bridge) |
| i18n | next-intl | >=4.3.4 |
| Parsing | gray-matter | >=4.0.3 |
| Reading Time | reading-time | >=1.5.0 |
| Email | resend | >=6.0.0 |
| Syntax Highlighting | shiki + rehype-pretty-code | >=3.9.2 / >=0.14.1 |
| Markdown Extensions | remark-gfm | >=4.0.1 |
| Analytics | @vercel/analytics | >=1.5.0 |
| Speed Insights | @vercel/speed-insights | >=1.2.0 |
| A11y (dev) | @axe-core/react | >=4.10.2 |
| Linting | @biomejs/biome | >=2.2.2 |
| Package Manager | pnpm | >=10.15.0 |

Additional build tooling: PostCSS 8.5.6, Autoprefixer 10.4.21, Tailwind PostCSS plugin, Browserslist modern targets.

## 4. Directory Structure (Excerpt)

```
src/
  app/                # App Router entrypoints, routes, metadata, assets
  components/         # Reusable UI + animation primitives
  content/            # MDX content (blog + i18n)
  i18n/               # Routing + request helpers for next-intl
  lib/                # Blog + SEO utilities
  messages/           # JSON translation dictionaries
```

## 5. Getting Started

### Prerequisites
- Node.js 18.17+ (recommend latest LTS)
- pnpm 10.14.0 (or use corepack / npm to install)

### Clone & Install
```bash
git clone https://github.com/<your-username>/portfolio.git
cd portfolio
pnpm install
```

### Environment Variables
Create `.env.local` (or `.env`) using the provided `.env.example` as a template:
```
RESEND_API_KEY=...
CONTACT_EMAIL=...
FROM_EMAIL=...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```
Never commit real secrets. Server‑only variables must not use the `NEXT_PUBLIC_` prefix.

### Development
```bash
pnpm dev
```
Visit http://localhost:3000.

### Lint & Format
```bash
# Lint only
pnpm lint

# Check (lint + format)
pnpm check

# Auto-fix issues
pnpm fix

# Format only
pnpm format
```

### Type Check (if separate)
```bash
pnpm tsc --noEmit
```

### Build & Start Production
```bash
pnpm build
pnpm start
```

## 6. Deployment

Optimized for Vercel (zero config). Steps:
1. Push the repository to GitHub.
2. Import the project in Vercel and select the repository.
3. Add required environment variables in Project Settings (Production + Preview).
4. Trigger first deployment (Vercel auto-detects Next.js). 
5. Verify: sitemap, robots, RSS, JSON feed, PWA installability, analytics data.

For custom hosting, run `pnpm build` then serve `.next/standalone` (if output configured) or use `next start` behind a reverse proxy.

## 7. Contribution Guidelines

Contributions are welcome. Please keep scope focused and quality high.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/meaningful-name`
3. Install dependencies & run dev server
4. Make changes (maintain TypeScript strictness, accessibility, tests where applicable)
5. Run lint/format check + build locally
6. Commit using conventional style (e.g., `feat: add animated header`)
7. Open a Pull Request with a clear description and screenshots (if UI)

Coding standards:
- Prefer functional, typed React components
- Keep components small and cohesive
- Avoid introducing unneeded dependencies
- Follow Tailwind utility-first approach; no large custom CSS blocks
- Ensure all routes have proper metadata

## 8. License

Licensed under the MIT License. You are free to use, modify, and distribute with attribution and inclusion of the license text.

## 9. Roadmap (Completed Highlights)

Implemented:
- [x] PWA (offline + manifest)
- [x] i18n (EN/FR)
- [x] MDX blog with syntax highlighting and callouts
- [x] Site-wide search
- [x] Structured data
- [x] Web Vitals pipeline
- [x] Vercel Analytics + Speed Insights
- [x] Contact form (Resend)
- [x] Accessibility enhancements
- [x] Dynamic OG images
- [x] RSS + JSON feeds
- [x] Improved footer & navigation
- [x] Environment safety script
- [x] Performance optimizations (lazy third-party, preconnect)
- [x] Multi-gradient dark themes

Potential future enhancements may include additional locales, micro-CMS integration, image CDN optimizations, and test automation coverage.

## 10. Acknowledgements

Built with the Next.js ecosystem and open-source libraries listed above.

---

Last Updated: August 2025
