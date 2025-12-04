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
- Theming via Tailwind CSS 4 with multiple dark gradient variants (ocean, purple, pink, blue, green, orange, red, etc.)
- Framer Motion animation system (page transitions, staggered reveals, scroll-triggered fades)
- Accessible focus management (`:focus-visible`), reduced motion support, skip link
- Polished MDX rendering: GFM (tables, task lists), syntax highlighting (Shiki / rehype-pretty-code), callouts/admonitions, automatic `next/image` mapping
- Interactive components: animated buttons, cards, mobile hamburger menu, language & theme switchers

### Performance & Monitoring
- Web Vitals collection (client) posted to `/api/web-vitals` + server logging with configurable sampling
- Lazy loading of analytics and Speed Insights (Vercel) outside critical path
- Preconnect hints for fonts and critical third-parties
- Service worker for offline fallback and asset caching (installable PWA)
- Bundle analyzer support (`ANALYZE=true bun run build`)
- Turbopack integration for faster builds and HMR
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
- OXLint (linting + formatting + import organization)
- Centralized SEO and blog utility modules
- CI/CD ready (GitHub Actions placeholder friendly)

### Progressive Web App
- `manifest.webmanifest`, offline page, service worker, dynamic icons, theme color

## 3. Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 16.0.7 |
| Language | TypeScript | 5.9.3 |
| Runtime | Bun (required) | 1.3.3 |
| UI | React | 19.2.1 |
| Styling | Tailwind CSS | 4.1.17 |
| Animations | Framer Motion | 12.23.25 |
| Content | MDX (`@mdx-js/react`, `@next/mdx`, `next-mdx-remote`) | 3.1.1 / 16.0.7 / 5.0.0 |
| i18n | next-intl | 4.5.8 |
| Parsing | gray-matter | 4.0.3 |
| Reading Time | reading-time | 1.5.0 |
| Email | resend | 6.5.2 |
| Syntax Highlighting | shiki + rehype-pretty-code | 3.19.0 / 0.14.1 |
| Markdown Extensions | remark-gfm | 4.0.1 |
| Analytics | @vercel/analytics | 1.6.1 |
| Speed Insights | @vercel/speed-insights | 1.3.1 |
| A11y (dev) | @axe-core/react | 4.11.0 |
| Linting & Formatting | oxlint + oxfmt | 1.31.0 / 0.16.0 |
| Package Manager | Bun | 1.3.3 (required) |
| Build Tool | Turbopack | Built into Next.js 16 |
| Bundle Analysis | @next/bundle-analyzer | 16.0.7 |

Additional build tooling: PostCSS 8.5.6, Autoprefixer 10.4.22, @tailwindcss/postcss 4.1.17, Bundle Analyzer 16.0.7.

## 4. Directory Structure (Excerpt)

```
src/
  app/                # App Router entrypoints, routes, metadata, assets
  components/         # Reusable UI + animation primitives
  content/            # MDX content (blog + i18n + legal)
  i18n/               # Routing + request helpers for next-intl
  lib/                # Blog + SEO utilities + email + callouts
  messages/           # JSON translation dictionaries
```

## 5. Getting Started

### Prerequisites
- Bun 1.3.3+ (required as package manager)

### Clone & Install
```bash
git clone https://github.com/<your-username>/portfolio.git
cd portfolio
bun install
```

### Environment Variables
Create `.env.local` (or `.env`) using the provided `.env.example` as a template:
```
RESEND_API_KEY=...
WEBVITALS_API_KEY=...
CONTACT_EMAIL=...
FROM_EMAIL=...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_WEBVITALS_SAMPLE=0.05
NEXT_PUBLIC_WEBVITALS_BATCH_MAX=10
```
Never commit real secrets. Server‑only variables must not use the `NEXT_PUBLIC_` prefix.

### Development
```bash
bun run dev
```
The `dev` script formats & lints the repo (`bun format && bun fix`) before launching `next dev` via Bun/Turbopack at http://localhost:3000.

### Lint & Format
```bash
# Lint only (oxlint --type-aware)
bun run lint

# Auto-fix issues (oxlint --fix --fix-suggestions)
bun run fix

# Format only (oxfmt)
bun run format
```


### Build & Start Production
```bash
bun run build
bun run start
```
Both `build` and `start` scripts run through Bun; `build` formats + lints before calling `next build`, and `start` launches `next start` for the production server.

## 6. Deployment

Optimized for Vercel (zero config). Steps:
1. Push the repository to GitHub.
2. Import the project in Vercel and select the repository.
3. Add required environment variables in Project Settings (Production + Preview).
4. Trigger first deployment (Vercel auto-detects Next.js). 
5. Verify: sitemap, robots, RSS, JSON feed, PWA installability, analytics data.

For custom hosting, run `bun run build` then serve `.next/standalone` (if output configured) or use `next start` behind a reverse proxy.

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
