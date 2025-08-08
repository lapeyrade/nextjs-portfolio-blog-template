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
│   └── app/
│       ├── globals.css          # Global styles with Tailwind imports
│       ├── layout.tsx           # Root layout component
│       └── page.tsx             # Homepage component
├── public/                      # Static assets
├── .gitignore                   # Git ignore rules
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration for Tailwind
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
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
- Implement dark/light mode support when needed
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
- **Navigation**: Smooth scrolling navigation with anchor links
- **Sections**: Hero, About, Projects, Contact, Footer
- **Contact Form**: Fully functional form with validation, spam protection, and email integration
- **Interactive Elements**: Hover effects, button animations, card transforms
- **Typography**: Inter font with proper hierarchy
- **Color Scheme**: Purple/pink gradient theme with dark background

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
- [ ] Dark/light mode toggle
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] add a global search bar for the site
- [ ] Security audit and hardening

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
