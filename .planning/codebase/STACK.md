# Technology Stack

**Analysis Date:** 2026-02-09

## Languages

**Primary:**
- JavaScript (JSX/ES6+) - React frontend components in `src/components/` and `src/pages/`
- TypeScript - Edge functions in `functions/` for server-side logic

**Secondary:**
- SQL - Supabase PostgreSQL schema definitions in SQL migration files
- HTML/CSS - UI templates and styling

## Runtime

**Environment:**
- Node.js (no specific version pinned - @types/node ^22.13.5 installed)
- Browser (modern ES2022+ support required)
- Deno - Supabase Edge Functions runtime (TypeScript executed via Deno)

**Package Manager:**
- npm - Primary package manager
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 18.2.0 - UI framework
- React Router DOM 6.26.0 - Client-side routing
- Vite 6.1.0 - Build tool and dev server

**UI Components:**
- Radix UI (17+ components) - Accessible UI component library (@radix-ui/react-*)
- Tailwind CSS 3.4.17 - Utility-first CSS framework

**Data Management:**
- TanStack React Query 5.84.1 - Server state management and caching
- React Hook Form 7.54.2 - Form state management
- Zod 3.24.2 - TypeScript-first schema validation

**Utilities:**
- Framer Motion 11.16.4 - Animation library
- React Leaflet 4.2.1 - Map visualization
- Recharts 2.15.4 - Charting library
- React Markdown 9.0.1 - Markdown rendering
- Three.js 0.171.0 - 3D graphics library

**Dev/Build:**
- Vite 6.1.0 - Development server and bundler
- TypeScript 5.8.2 - Type checking
- ESLint 9.19.0 - Linting with React plugins
- PostCSS 8.5.3 - CSS preprocessing
- Autoprefixer 10.4.20 - Browser vendor prefixing

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.49.1 - Supabase client SDK for database, auth, storage, and functions
- @tanstack/react-query 5.84.1 - Essential for server state synchronization and real-time data fetching

**Infrastructure:**
- React 18.2.0 - Core framework
- Tailwind CSS 3.4.17 - Styling system
- Vite 6.1.0 - Build/dev infrastructure
- TypeScript 5.8.2 - Type safety

**UI/UX:**
- @radix-ui/* - Accessible component primitives
- Lucide React 0.475.0 - Icon library
- Framer Motion 11.16.4 - Animations
- Next Themes 0.4.4 - Dark mode support

**Document Generation:**
- jsPDF 4.1.0 - PDF generation
- html2canvas 1.4.1 - Canvas-based screenshot/PDF conversion

**Form/Validation:**
- React Hook Form 7.54.2 - Form management
- @hookform/resolvers 4.1.2 - Form validation integration
- Zod 3.24.2 - Schema validation

**Utilities:**
- Lodash 4.17.21 - Utility functions
- Moment 2.30.1 - Date/time manipulation
- Date-fns 3.6.0 - Modern date utilities
- Canvas Confetti 1.9.4 - Celebration animations
- Sonner 2.0.1 - Toast notifications
- React Hot Toast 2.6.0 - Alternative toast library

**Special Features:**
- React Resizable Panels 2.1.7 - Resizable UI panels
- Embla Carousel React 8.5.2 - Carousel component
- Input OTP 1.4.2 - OTP input component
- Cmdk 1.0.0 - Command palette
- Vaul 1.1.2 - Drawer component
- @hello-pangea/dnd 17.0.0 - Drag-and-drop library

## Configuration

**Environment:**
- Supabase configuration via environment variables
  - `VITE_SUPABASE_URL` - Supabase project URL
  - `VITE_SUPABASE_ANON_KEY` - Public anonymous key
  - `SUPABASE_SERVICE_ROLE_KEY` - Service role key (backend only)
  - `NOTION_ACCESS_TOKEN` - For Notion API integration (Edge Functions)

**Build:**
- `vite.config.js` - Path alias `@/` → `./src/`
- `jsconfig.json` - Type checking configuration with JSX support
- `eslint.config.js` - ESLint configuration with React rules
- `tailwind.config.js` - Tailwind CSS configuration (inferred)
- `postcss.config.js` - PostCSS configuration
- `components.json` - Component configuration (likely for shadcn/ui or similar)

## Platform Requirements

**Development:**
- Node.js with npm
- Modern browser with ES2022+ support
- Local Supabase instance (via CLI) for development

**Production:**
- Deployment target: Supabase hosted backend
- Frontend: Static SPA deployment (Vercel, Netlify, or similar)
- Edge Functions: Executed by Supabase (Deno runtime)

---

*Stack analysis: 2026-02-09*
