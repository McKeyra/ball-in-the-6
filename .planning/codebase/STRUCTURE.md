# Codebase Structure

**Analysis Date:** 2026-02-09

## Directory Layout

```
project-root/
├── src/                           # Application source code
│   ├── api/                       # Supabase client and integrations
│   ├── assets/                    # Static images, fonts, media
│   ├── components/                # React components organized by domain
│   │   ├── ui/                    # Reusable Radix UI + Tailwind components
│   │   ├── basketball/            # Basketball game tracking components
│   │   ├── craft/                 # Craft-inspired theme components
│   │   ├── feed/                  # Social feed components
│   │   ├── forms/                 # Form builder and form fields
│   │   ├── game/                  # Game management components
│   │   ├── league/                # League management components
│   │   ├── coach/                 # Coach dashboard components
│   │   ├── dashboard/             # Dashboard metric components
│   │   ├── team/                  # Team management components
│   │   ├── player/                # Player profile components
│   │   └── [other domains]/       # Additional domain-specific components
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Shared utilities and context
│   ├── pages/                     # Page components (route targets)
│   │   └── forms/                 # Form page components
│   ├── utils/                     # Helper functions and configurations
│   ├── App.jsx                    # Root app component with routing
│   ├── Layout.jsx                 # Layout wrapper for authenticated pages
│   ├── main.jsx                   # Vite entry point
│   ├── pages.config.js            # Page registry configuration
│   ├── App.css                    # App-level styles
│   └── index.css                  # Global styles, Tailwind imports
├── supabase/                      # Supabase configuration and migrations
├── functions/                     # Supabase Edge Functions
├── vite.config.js                 # Vite build configuration
├── package.json                   # Dependencies and scripts
├── jsconfig.json                  # Path aliases and JS config
├── tailwind.config.js             # Tailwind CSS configuration
├── components.json                # Shadcn/ui component registry
├── eslint.config.js               # ESLint configuration
├── postcss.config.js              # PostCSS configuration
└── dist/                          # Built output (generated)
```

## Directory Purposes

**`src/api/`:**
- Purpose: Backend API clients and Supabase integration
- Contains: Base44 client wrapper, entity CRUD accessors, Auth wrapper, Edge Function routing
- Key files:
  - `base44Client.js` - Main Supabase wrapper with entity proxy
  - `entities.js` - Entity-specific accessors (if separate)
  - `integrations.js` - Third-party integration clients

**`src/components/ui/`:**
- Purpose: Reusable, unstyled UI primitives from Radix UI
- Contains: Button, Card, Dialog, Form, Input, Select, Tabs, etc. (50+ components)
- Pattern: Shadcn/ui style wrapping with Tailwind classes
- Naming: kebab-case files (button.jsx, dialog.jsx)

**`src/components/basketball/`:**
- Purpose: Basketball-specific game tracking and real-time features
- Contains: Game clock, timeout tracking, player stats, substitutions, event feed
- Key files:
  - `GameClockContext.jsx` - Game clock state management
  - `TimeoutContext.jsx` - Timeout tracking
  - `DesktopCourtView.jsx` - Court visualization
  - `MobileCourtView.jsx` - Mobile-optimized court
  - `ScoreBoard.jsx` - Score display
  - `StatButton.jsx` - Quick stat recording

**`src/components/craft/`:**
- Purpose: Application-specific theme and navigation components
- Contains: Header, Bottom Nav, Mobile Menu, Color system
- Key files:
  - `B6Header.jsx` - Top navigation bar
  - `B6BottomNav.jsx` - Mobile bottom tab bar
  - `B6MobileMenu.jsx` - Mobile sidebar overlay
  - `B6ColorCard.jsx` - Themed card component with color mapping
  - `index.js` - Barrel file exporting all craft components

**`src/components/feed/`:**
- Purpose: Social feed and activity stream components
- Contains: Event cards, game score cards, post cards, product cards
- Pattern: Each card type in separate file (EventCard.jsx, GameScoreCard.jsx, etc.)

**`src/components/league/`:**
- Purpose: League management and scheduling
- Contains: League creation wizard, scheduler, standings, teams section
- Key files:
  - `LeagueCreationWizard.jsx` - Multi-step league setup
  - `LeagueScheduler.jsx` - Schedule builder
  - `StandingsTable.jsx` - League standings display

**`src/components/forms/`:**
- Purpose: Reusable form infrastructure and builders
- Contains: FormBuilder, FormChat, FormFields components
- Pattern: Generic form engine loading configuration from backend
- Usage: Multiple form pages load from `src/pages/forms/` using FormBuilder

**`src/lib/`:**
- Purpose: Core utilities and context providers
- Contains:
  - `AuthContext.jsx` - Authentication and user state
  - `query-client.js` - TanStack Query configuration
  - `NavigationTracker.jsx` - Route tracking utility
  - `VisualEditAgent.jsx` - AI agent for visual editing
  - `PageNotFound.jsx` - 404 error page
  - `utils.js` - Shared utility functions

**`src/hooks/`:**
- Purpose: Custom React hooks for common patterns
- Contains: `use-mobile.jsx` - breakpoint detection hook

**`src/pages/`:**
- Purpose: Page-level components representing full routes
- Pattern: Each page is a route registered in `pages.config.js`
- Naming: PascalCase (CoachDashboard.jsx, PlayerDashboard.jsx)
- Contains:
  - Role-specific dashboards (CoachDashboard, PlayerDashboard, etc.)
  - Feature pages (Feed, Messenger, Teams, etc.)
  - Management pages (LeagueManagement, TeamManagement, etc.)
  - Tool pages (GameView, BoxScore, Standings, etc.)

**`src/pages/forms/`:**
- Purpose: Form pages loaded dynamically via page registry
- Pattern: Each form is a route in pages.config.js PAGES object
- Categories:
  - Registration: PlayerRegistration, CoachRegistration, etc.
  - Applications: SponsorApplication, LeagueApplication, etc.
  - Operational: GameReport, IncidentReport, TransferRequest, etc.
  - Feedback: SeasonSurvey, CoachEvaluation, NPSSurvey, etc.
  - Compliance: WaiverConsent, MedicalForm, CodeOfConduct, etc.
  - Settings: ParentProfileSetup, TeamSettingsForm, LeagueSettingsForm, etc.

**`src/utils/`:**
- Purpose: Shared helper functions and configuration
- Contains:
  - `index.ts` - URL and page helpers (createPageUrl)
  - `sportConfigs.js` - Sport-specific configurations

**`src/assets/`:**
- Purpose: Static media files
- Contains: Images, logos, fonts

**`supabase/`:**
- Purpose: Database schema, migrations, RLS policies
- Contains: SQL migration files for tables, views, functions, policies

**`functions/`:**
- Purpose: Supabase Edge Functions (serverless API handlers)
- Contains: Handlers for invoke-llm, send-email, send-sms, upload files, generate-image, etc.

## Key File Locations

**Entry Points:**
- `src/main.jsx` - React root mount, Vite entry
- `src/App.jsx` - App root component with routing and providers
- `src/Layout.jsx` - Authenticated page wrapper with theme and navigation
- `vite.config.js` - Build configuration

**Configuration:**
- `package.json` - Dependencies, build scripts, version
- `jsconfig.json` - Path aliases (@/* → src/*), TypeScript options
- `tailwind.config.js` - Design tokens, dark mode, spacing
- `components.json` - Shadcn/ui component registry and paths
- `src/pages.config.js` - Page route registry and default page

**Core Logic:**
- `src/api/base44Client.js` - Supabase wrapper and entity proxy
- `src/lib/AuthContext.jsx` - Authentication provider and user state
- `src/components/basketball/GameClockContext.jsx` - Game clock state
- `src/components/basketball/TimeoutContext.jsx` - Timeout tracking

**Testing:**
- No test files detected - testing patterns not established

## Naming Conventions

**Files:**
- Components: PascalCase.jsx (Button.jsx, CoachDashboard.jsx)
- Utilities: camelCase.js (utils.js, sportConfigs.js)
- Context providers: PascalCase.jsx (AuthContext.jsx, GameClockContext.jsx)
- UI components: kebab-case.jsx (button.jsx, card.jsx) following Shadcn pattern

**Directories:**
- Domain-specific: lowercase plural (components, pages, hooks, utils)
- Feature areas: lowercase (ui, basketball, craft, feed, league, forms)

**React Components:**
- Functional components with hooks
- Export default or named exports
- Props destructured in function parameters
- PascalCase naming (exported as component)

**Functions:**
- camelCase for all function names (createPageUrl, toTableName)
- useXxx for custom hooks (useAuth, useGameClock, useMobile)
- Async functions await promises, explicit error handling

**Variables:**
- camelCase for all variable names
- Constant strings: camelCase (not UPPER_CASE)
- Boolean flags: isXxx, hasXxx, canXxx (isRunning, hasError)

**Types & Interfaces:**
- No TypeScript strict mode, JSDoc comments sparse
- Props object passed to functions without type annotations

## Where to Add New Code

**New Feature Page:**
- Primary code: Create `src/pages/FeatureName.jsx`
- Register route: Add to `src/pages.config.js` PAGES object
- Component imports: Use base44, useQuery, components from src/components/
- Layout: Automatically wrapped by Layout.jsx, includes header/nav
- Pattern: Follow structure of existing pages (CoachDashboard, PlayerDashboard)

**New Component/Module:**
- Implementation: `src/components/[domain]/ComponentName.jsx`
- Organization: Place in existing domain folder (team, league, feed, etc.) or create new
- Imports: Use @ alias to import from src (import { Button } from "@/components/ui/button")
- Export: `export default ComponentName` or named export from index.js barrel file

**New Utilities:**
- Shared helpers: `src/utils/index.ts` or domain-specific file
- Sports config: `src/utils/sportConfigs.js`
- URL helpers: `src/utils/index.ts` - export createPageUrl variations

**New Form Page:**
- Location: `src/pages/forms/FormName.jsx`
- Register: Add to `src/pages.config.js` PAGES object in appropriate section (Registration, Applications, etc.)
- Template: Use FormBuilder component or custom form with react-hook-form
- Pattern: See existing forms (PlayerRegistration.jsx, GameReport.jsx)

**Database Layer:**
- Schema changes: `supabase/migrations/` - SQL files numbered sequentially
- RLS policies: SQL in migration files (CREATE POLICY statements)
- Edge Functions: `functions/function-name/index.ts`
- Base44 integration: Method added to `src/api/base44Client.js`

**Custom Hook:**
- Location: `src/hooks/useHookName.jsx` or `src/hooks/index.js`
- Pattern: Follow useAuth, useGameClock examples (Context-based or Query-based)
- Export: Named export or default

## Special Directories

**`dist/`:**
- Purpose: Build output directory
- Generated: Yes - created by `npm run build`
- Committed: No - in .gitignore
- Contents: Minified JS, CSS, assets

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes - created by npm install
- Committed: No - in .gitignore

**`.planning/codebase/`:**
- Purpose: Documentation for GSD commands
- Generated: No - manually maintained
- Committed: Yes
- Contents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md, STACK.md, INTEGRATIONS.md

**`supabase/.temp/`:**
- Purpose: Temporary Supabase CLI files
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-02-09*
