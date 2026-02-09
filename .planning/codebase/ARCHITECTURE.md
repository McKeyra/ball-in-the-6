# Architecture

**Analysis Date:** 2026-02-09

## Pattern Overview

**Overall:** Component-based SPA with role-based UI routing and Supabase backend integration

**Key Characteristics:**
- React 18 with functional components and hooks
- Dynamic page registry enabling role-based dashboard routing
- Provider-based state management (AuthContext, GameClockContext, TimeoutContext)
- Real-time synchronization via TanStack React Query
- Supabase as primary backend (Auth, Database, Edge Functions, Storage)
- URL-based navigation with dynamic page loading

## Layers

**Presentation Layer:**
- Purpose: Render UI components and handle user interaction
- Location: `src/components/` and `src/pages/`
- Contains: React components (JSX/TSX), styled with Tailwind CSS and Radix UI
- Depends on: Hooks layer, utilities, API client
- Used by: Router/App entry point

**Hooks & Context Layer:**
- Purpose: Share state across components and provide custom hooks
- Location: `src/hooks/` and `src/components/basketball/` (contexts)
- Contains: Custom hooks, React Context providers (AuthContext, GameClockContext, TimeoutContext)
- Depends on: API client, TanStack React Query
- Used by: Presentation layer components

**API Client Layer:**
- Purpose: Abstract backend communication and provide unified data interface
- Location: `src/api/base44Client.js` (proxy-based Supabase wrapper)
- Contains: Entity accessors (CRUD), Auth methods, Integrations, Edge Functions
- Depends on: Supabase JS SDK
- Used by: Hooks, Context providers, Pages

**Utility Layer:**
- Purpose: Provide shared helper functions and configurations
- Location: `src/utils/` and `src/lib/`
- Contains: URL builders, sport configurations, UI utilities
- Depends on: External libraries (date-fns, lodash)
- Used by: All layers

**Routing Layer:**
- Purpose: Define app routes and role-based page mapping
- Location: `src/App.jsx`, `src/Layout.jsx`, `src/pages.config.js`
- Contains: React Router configuration, auth guard routes, layout wrapper
- Depends on: Pages, AuthContext
- Used by: App root

**Theme & Styling:**
- Purpose: Enforce consistent design across the application
- Location: `src/index.css`, `tailwind.config.js`, `src/components/craft/`
- Contains: Dark theme (base color `#0f0f0f`), accent color (`#c9a962`), Tailwind tokens
- Depends on: Tailwind CSS, PostCSS
- Used by: All components

## Data Flow

**Authentication Flow:**

1. App initializes with `AuthProvider` wrapping the entire app
2. `AuthContext.checkAppState()` called on mount - checks Supabase session
3. If session exists, `base44.auth.me()` fetches user with role from `user_roles` table
4. User state stored in context, triggering dependent queries
5. `Layout.jsx` reads user role and redirects to role-specific dashboard

**Entity Data Flow (Typical Page):**

1. Component mounts (e.g., `CoachDashboard`, `Feed`)
2. Calls `useQuery()` with `base44.entities.EntityName.list()` or `.filter()`
3. Base44 proxy converts to Supabase `.from(table).select()`
4. TanStack Query caches result and manages refetching
5. Component renders with data, mutations update via `useMutation()`
6. Query client invalidates/updates on mutation success

**Real-Time Updates:**

1. `GameClockContext` uses `useQuery` with `refetchInterval` while running
2. Component subscribes to game state via context hook
3. Interval polling (5s) fetches latest game clock/shot clock values
4. `forceUpdate` triggers re-renders to display updated values
5. localStorage persists clock running state across page reloads

**State Management:**

- `AuthContext`: User identity, authentication state, app public settings
- `GameClockContext`: Game clock, shot clock, running state (persisted to localStorage)
- `TimeoutContext`: Team timeouts for current game
- `QueryClient`: Server state caching and synchronization via TanStack React Query
- Local component state: Form inputs, UI toggles, temporary UI state

## Key Abstractions

**Base44 Client (API Wrapper):**
- Purpose: Provide unified interface to Supabase backend, abstracting SDK complexity
- Examples: `src/api/base44Client.js` - entitiesProxy, auth object, integrations object
- Pattern: Proxy-based dynamic entity accessor (PascalCase entity name → snake_case table name)
- Provides: CRUD operations, Auth, Edge Function invocation, File uploads

**Page Registry:**
- Purpose: Define all application routes as centralized configuration
- Examples: `src/pages.config.js` - PAGES object mapping route names to components
- Pattern: Object-based page mapping loaded by `App.jsx` router
- Enables: Dynamic routing, role-based dashboard selection, form page organization

**Context Providers:**
- Purpose: Share complex state across component trees without prop drilling
- Examples: `AuthContext`, `GameClockContext`, `TimeoutContext`
- Pattern: createContext + custom hook wrapper (e.g., useAuth, useGameClock)
- Usage: Wrap consumers in `<ContextProvider>{children}</ContextProvider>`

**Styled UI Component Library:**
- Purpose: Provide reusable, accessible UI components with consistent styling
- Examples: `src/components/ui/` - button, card, dialog, tabs, form, etc.
- Pattern: Radix UI headless components wrapped with Tailwind styling
- Provider: Built using `components.json` Shadcn/ui setup

**Craft-Inspired Theme Components:**
- Purpose: Implement application-specific header, navigation, and color system
- Examples: `src/components/craft/B6Header`, `B6BottomNav`, `B6MobileMenu`, `B6ColorCard`
- Pattern: Custom components using Craft design language (gold accent #c9a962)
- Behavior: Header and bottom nav visible on all pages, mobile menu overlay

**Role-Based Dashboard Routing:**
- Purpose: Automatically redirect authenticated users to appropriate dashboard
- Examples: `Layout.jsx` - maps `user.user_role` to dashboard component
- Pattern: Role → Dashboard mapping object with fallback to Home
- Roles: owner, admin, player, parent, coach, team_admin, league_admin, fan

## Entry Points

**App Root (`src/main.jsx`):**
- Location: `src/main.jsx`
- Triggers: Vite bootstrap on page load
- Responsibilities: React root DOM mount, Redux store if used

**App Component (`src/App.jsx`):**
- Location: `src/App.jsx`
- Triggers: React render tree initialization
- Responsibilities:
  - Wrap app with AuthProvider, QueryClientProvider, Router
  - Define login/register routes
  - Define authenticated app routes via `AuthenticatedApp`
  - Provide Toaster and VisualEditAgent

**Layout Wrapper (`src/Layout.jsx`):**
- Location: `src/Layout.jsx`
- Triggers: Every page render after authentication
- Responsibilities:
  - Provide GameClockProvider and TimeoutProvider
  - Render B6Header, B6BottomNav, B6MobileMenu
  - Extract user role and redirect to dashboard on initial load
  - Render main content with max-width container

**Page Components (`src/pages/*.jsx`):**
- Location: `src/pages/`
- Triggers: Route navigation via React Router
- Responsibilities: Page-specific logic, data fetching, layout composition
- Examples: `CoachDashboard`, `PlayerDashboard`, `Feed`, `Home`

## Error Handling

**Strategy:** Graceful degradation with user-friendly fallback UI

**Patterns:**
- Auth errors caught in `AuthContext.checkAppState()` - defaults to not authenticated
- API errors handled in `base44` entity methods - thrown to component layer
- Components handle errors via `useQuery` error state or try/catch in mutations
- Timeout handling (5s) in auth checks prevents infinite loading
- Supabase connection fallback: app loads with placeholder credentials if env vars missing
- Toast notifications via Sonner for user-facing error feedback

## Cross-Cutting Concerns

**Logging:** Console-based (console.error, console.log) - no centralized logging service

**Validation:**
- Form validation via react-hook-form + Zod schema integration
- Input validation in FormBuilder and form pages
- DB constraints enforced by Supabase row-level security

**Authentication:**
- Supabase Auth (email/password, OAuth providers)
- Role-based access control via user_roles table
- Auth state subscribed globally via AuthContext
- Redirect to login for unauthenticated users (handled in App.jsx)

**Authorization:**
- Role-based UI routing (Layout.jsx dashboard mapping)
- Supabase RLS policies should enforce data access by role
- Client-side role checks in component conditionals

**Caching:**
- TanStack React Query manages server state caching
- localStorage used for: auth_redirect, clockRunning
- No dedicated cache invalidation strategy beyond Query Client

---

*Architecture analysis: 2026-02-09*
