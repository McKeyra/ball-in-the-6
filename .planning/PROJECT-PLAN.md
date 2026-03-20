# Ball in the 6 — Complete Project Plan

> **The Operating System for Sports**
> Desktop Web + iOS + Android | 30 Sports | 18 Personas | AI6 Intelligence
> Owner: McKeyra Peter | ENUW Inc | Toronto, Canada

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Tech Stack](#2-tech-stack)
3. [Design System & Tokens](#3-design-system--tokens)
4. [Phase Breakdown (32 Phases)](#4-phase-breakdown)
5. [Database Architecture](#5-database-architecture)
6. [API Architecture](#6-api-architecture)
7. [Sports Engine](#7-sports-engine)
8. [Personas & Roles](#8-personas--roles)
9. [Deployment & Infrastructure](#9-deployment--infrastructure)
10. [Token Estimation](#10-token-estimation)

---

## 1. Architecture Overview

### Platform Targets
| Target | Technology | Distribution |
|--------|-----------|-------------|
| Desktop Web | Next.js 15 (App Router) | Vercel / DigitalOcean |
| iOS | Capacitor 6 (native shell) | App Store |
| Android | Capacitor 6 (native shell) | Google Play |
| PWA | Service Worker + Manifest | Web install |

### Why Next.js + Capacitor (not React Native)
- **One codebase** for web + mobile (no React Native bridge overhead)
- **SSR for SEO** — public profiles, game results, league standings need indexing
- **App Router** — server components reduce client bundle for mobile
- **Capacitor** — wraps the web app in native shell, access to Camera, Push, Haptics, Biometrics
- **Shared design tokens** — Tailwind works identically across all targets
- **Existing code** — ball-in-the-6 and bit6-stats are already React/Tailwind, minimal rewrite

### Monorepo Structure
```
ball-in-the-6/
├── apps/
│   ├── web/                          # Next.js 15 App Router (main app)
│   │   ├── app/                      # App Router pages
│   │   │   ├── (auth)/               # Auth group (login, register, forgot-password)
│   │   │   ├── (public)/             # Public pages (landing, about, pricing)
│   │   │   ├── (app)/                # Authenticated app shell
│   │   │   │   ├── feed/
│   │   │   │   ├── games/
│   │   │   │   ├── courts/
│   │   │   │   ├── compose/
│   │   │   │   ├── intelligence/
│   │   │   │   ├── profile/
│   │   │   │   ├── profiles/
│   │   │   │   ├── teams/
│   │   │   │   ├── leagues/
│   │   │   │   ├── players/
│   │   │   │   ├── schedule/
│   │   │   │   ├── live/[gameId]/    # Live game tracking
│   │   │   │   ├── stats/
│   │   │   │   ├── marketplace/      # Coach/trainer marketplace
│   │   │   │   ├── store/            # Wear US integration
│   │   │   │   ├── messenger/
│   │   │   │   ├── settings/
│   │   │   │   └── admin/            # Admin panel
│   │   │   └── api/                  # API routes
│   │   │       ├── auth/
│   │   │       ├── games/
│   │   │       ├── stats/
│   │   │       ├── players/
│   │   │       ├── teams/
│   │   │       ├── leagues/
│   │   │       ├── intelligence/
│   │   │       ├── marketplace/
│   │   │       ├── webhooks/
│   │   │       └── cron/
│   │   ├── capacitor.config.ts       # Capacitor mobile config
│   │   └── next.config.ts
│   ├── ios/                          # Xcode project (Capacitor generated)
│   └── android/                      # Android Studio project (Capacitor generated)
│
├── packages/
│   ├── ui/                           # Shared UI component library
│   │   ├── primitives/               # Button, Card, Dialog, Input, etc.
│   │   ├── composites/               # ProfileCard, GameCard, StatGrid, etc.
│   │   ├── navigation/               # BottomNav, TopHeader, Sidebar
│   │   ├── sports/                   # Sport-specific components
│   │   │   ├── basketball/           # Court SVG, stat popup, markers
│   │   │   ├── soccer/               # Pitch SVG, stat popup
│   │   │   ├── hockey/               # Rink SVG, stat popup
│   │   │   ├── football/             # Field SVG, stat popup
│   │   │   ├── baseball/             # Diamond SVG, stat popup
│   │   │   ├── tennis/               # Court SVG
│   │   │   ├── volleyball/           # Court SVG
│   │   │   └── _shared/              # InteractiveSurface, PlayerMarker, ZoneDetector
│   │   ├── charts/                   # Shot charts, stat graphs, radar charts
│   │   ├── feed/                     # PlayCard, GameResultCard, etc.
│   │   └── profiles/                 # 6 profile templates
│   │
│   ├── core/                         # Domain layer (ZERO external imports)
│   │   ├── entities/                 # Sport, Game, Player, Team, League, etc.
│   │   ├── value-objects/            # StatEntry, Zone, Score, Period, etc.
│   │   ├── repositories/            # Interface definitions ONLY
│   │   ├── services/                # Domain services (scoring, zone detection)
│   │   └── intelligence/            # AI6 engine (z-score, impact, scouting)
│   │
│   ├── application/                  # Use cases (commands + queries)
│   │   ├── games/                    # StartGame, RecordStat, EndGame, etc.
│   │   ├── players/                  # CreatePlayer, UpdateStats, etc.
│   │   ├── teams/                    # CreateTeam, ManageRoster, etc.
│   │   ├── leagues/                  # CreateLeague, GenerateSchedule, etc.
│   │   ├── intelligence/            # EvaluatePlayer, CompareAthletes, etc.
│   │   ├── marketplace/             # ListCoach, BookTrainer, etc.
│   │   └── commerce/                # ProcessPayment, ManageSubscription
│   │
│   ├── infrastructure/              # Database, Redis, external APIs
│   │   ├── database/                # Prisma client, migrations
│   │   ├── realtime/                # WebSocket server (Socket.io)
│   │   ├── storage/                 # DigitalOcean Spaces (S3)
│   │   ├── cache/                   # Redis Cloud
│   │   ├── email/                   # Transactional email
│   │   ├── push/                    # Push notifications (FCM + APNs)
│   │   └── scraper/                 # Data ingestion (RAMP, Presto, etc.)
│   │
│   ├── config/                       # Shared configs
│   │   ├── tailwind/                # Tailwind preset with tokens
│   │   ├── eslint/
│   │   └── tsconfig/
│   │
│   └── tokens/                       # Design token system
│       ├── colors.ts                 # Color primitives + semantic tokens
│       ├── typography.ts             # Font families, sizes, weights
│       ├── spacing.ts                # Spacing scale
│       ├── radii.ts                  # Border radius tokens
│       ├── shadows.ts               # Shadow tokens
│       ├── motion.ts                # Animation tokens
│       ├── themes/                  # Theme definitions
│       │   ├── light.ts             # DEFAULT — white background
│       │   ├── dark.ts              # Dark mode (void #030303)
│       │   ├── neon-lime.ts         # Original B6 aesthetic
│       │   ├── raptors.ts           # Raptors red + black
│       │   ├── ai6-dark.ts          # AI6 brand theme
│       │   └── custom.ts           # User-defined via settings
│       └── sport-themes/            # Sport-specific color overrides
│           ├── basketball.ts
│           ├── soccer.ts
│           ├── hockey.ts
│           └── ...
│
├── tools/                            # Build tools, scripts
│   ├── capacitor/                   # Mobile build scripts
│   ├── db/                          # Migration scripts
│   └── codegen/                     # Type generation
│
├── turbo.json                        # Turborepo config
├── package.json                      # Root workspace
└── CLAUDE.md                        # Project standards
```

### Dependency Flow
```
UI Components → Application Layer → Domain (Core) ← Infrastructure
     ↓                                                      ↓
  Tokens/Config                                    Database/Redis/APIs
```

Domain never imports Infrastructure. Infrastructure implements Domain interfaces.

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 15+ | App Router, SSR, API routes |
| React | 19 | UI framework |
| TypeScript | 5.8+ | Type safety (strict mode) |
| Tailwind CSS | 4 | Utility-first styling |
| shadcn/ui | latest | Component primitives (Radix UI) |
| TanStack Query | 5 | Server state management |
| Zustand | 5 | Client state (game clock, UI) |
| React Hook Form | 7 | Form management |
| Zod | 3.24+ | Schema validation |
| Motion (Framer) | 12 | Animations |
| Recharts | 2 | Data visualization |
| Lucide React | latest | Icons |
| Socket.io Client | 4 | Real-time game updates |
| Capacitor | 6 | Native mobile shell |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js API Routes | 15 | REST + Server Actions |
| PostgreSQL | 17 | Primary database (DigitalOcean Managed) |
| Prisma | 6 | ORM + migrations |
| Redis Cloud | latest | Caching + pub/sub |
| Socket.io | 4 | WebSocket real-time |
| DigitalOcean Spaces | S3-compat | Object storage (images, video) |
| Anthropic SDK | latest | AI6 intelligence (Claude) |

### Mobile (Capacitor Plugins)
| Plugin | Purpose |
|--------|---------|
| @capacitor/camera | Photo capture for profiles, plays |
| @capacitor/push-notifications | FCM (Android) + APNs (iOS) |
| @capacitor/haptics | Haptic feedback on stat entry |
| @capacitor/share | Native share sheet |
| @capacitor/geolocation | Court finder, location tagging |
| @capacitor/browser | OAuth flows |
| @capacitor/keyboard | Keyboard management |
| @capacitor/status-bar | Status bar styling per theme |
| @capacitor/splash-screen | App launch screen |
| @capacitor/local-notifications | Game reminders |
| @capacitor/biometric | Biometric auth (Face ID, fingerprint) |

### DevOps
| Technology | Purpose |
|-----------|---------|
| Turborepo | Monorepo build orchestration |
| GitHub Actions | CI/CD |
| Vercel | Web deployment |
| DigitalOcean | Database, storage, WebSocket server |
| Vitest | Unit + integration tests |
| Playwright | E2E tests |
| Testing Library | Component tests |

---

## 3. Design System & Tokens

### Theme Architecture

**Default theme: WHITE (light mode)**
All tokens are CSS custom properties that swap when theme changes.

```typescript
// packages/tokens/themes/light.ts (DEFAULT)
export const lightTheme = {
  colors: {
    // Backgrounds
    background: '#FFFFFF',
    surface: '#F5F5F5',
    elevated: '#FFFFFF',
    card: '#FFFFFF',
    muted: '#F1F5F9',

    // Text
    foreground: '#0F172A',
    'foreground-secondary': '#475569',
    'foreground-muted': '#94A3B8',

    // Brand
    primary: '#C8FF00',           // Neon lime (Ball in the 6 signature)
    'primary-foreground': '#1A2E00',
    'primary-hover': '#B8EF00',
    'primary-dim': 'rgba(200, 255, 0, 0.10)',
    'primary-glow': 'rgba(200, 255, 0, 0.08)',

    // Accents (profile-type colors)
    'accent-blue': '#3B82F6',     // Fan
    'accent-purple': '#A855F7',   // Player
    'accent-orange': '#F97316',   // Team
    'accent-emerald': '#10B981',  // Coach
    'accent-yellow': '#EAB308',   // Organization
    'accent-pink': '#EC4899',     // Business
    'accent-cyan': '#06B6D4',     // Intelligence
    'accent-red': '#EF4444',      // Live / destructive

    // Borders
    border: '#E2E8F0',
    'border-subtle': '#F1F5F9',

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Status
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Charts (Recharts)
    'chart-1': '#3B82F6',
    'chart-2': '#22C55E',
    'chart-3': '#F97316',
    'chart-4': '#A855F7',
    'chart-5': '#C8FF00',
    'chart-6': '#EC4899',
  },

  typography: {
    fontFamily: {
      sans: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
      mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace',
    },
    fontSize: {
      'display': ['3rem', { lineHeight: '1.1', fontWeight: '900' }],
      'heading-1': ['2rem', { lineHeight: '1.2', fontWeight: '800' }],
      'heading-2': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
      'heading-3': ['1.25rem', { lineHeight: '1.4', fontWeight: '700' }],
      'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
      'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      'overline': ['0.625rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '0.1em' }],
      'stat-value': ['1.5rem', { lineHeight: '1', fontWeight: '900' }],
      'stat-label': ['0.5rem', { lineHeight: '1', fontWeight: '700', letterSpacing: '0.15em' }],
    },
  },

  spacing: {
    'safe-top': 'env(safe-area-inset-top)',
    'safe-bottom': 'env(safe-area-inset-bottom)',
    'safe-left': 'env(safe-area-inset-left)',
    'safe-right': 'env(safe-area-inset-right)',
    'nav-height': '4rem',
    'bottom-nav': '5rem',
    'header-height': '3.5rem',
  },

  radii: {
    card: '20px',
    'card-lg': '28px',
    'card-xl': '32px',
    button: '12px',
    pill: '9999px',
    avatar: '9999px',
    input: '12px',
  },

  shadows: {
    card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    'card-hover': '0 10px 25px rgba(0,0,0,0.08)',
    'elevated': '0 4px 12px rgba(0,0,0,0.08)',
    'glow-primary': '0 0 30px rgba(200,255,0,0.15)',
    'glow-blue': '0 0 30px rgba(59,130,246,0.15)',
    'glow-purple': '0 0 30px rgba(147,51,234,0.15)',
  },

  motion: {
    duration: {
      instant: '100ms',
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
} as const;
```

```typescript
// packages/tokens/themes/dark.ts
export const darkTheme = {
  colors: {
    background: '#030303',        // Void
    surface: '#0A0A0A',
    elevated: '#111111',
    card: '#0F0F0F',
    muted: '#1A1A1A',
    foreground: '#FAFAFA',
    'foreground-secondary': '#A1A1AA',
    'foreground-muted': '#52525B',
    border: 'rgba(255,255,255,0.06)',
    'border-subtle': 'rgba(255,255,255,0.03)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    // ... same accent colors but adjusted for dark bg
  },
  // shadows use rgba(255,...) instead of rgba(0,...)
} as const;
```

### Profile Token Presets
Each of the 6 profile types has its own color tokens:

| Profile | Gradient | Accent | Badge | Icon |
|---------|----------|--------|-------|------|
| Fan | blue→cyan | blue-500 | Fan | Heart |
| Player | purple→blue | purple-500 | Player | Zap |
| Team | orange→red | orange-500 | Team | Users |
| Coach | emerald→cyan | emerald-500 | Coach | Clipboard |
| Organization | yellow→orange | yellow-500 | Org | Building2 |
| Business | pink→purple | pink-500 | Biz | Store |

### Sport Theme Overrides
Each sport can override accent colors for its interface:

| Sport | Primary | Secondary | Surface Accent |
|-------|---------|-----------|---------------|
| Basketball | #C8102E (Raptors red) | #C8FF00 (lime) | Hardwood tan |
| Soccer | #00A859 (pitch green) | #FFFFFF | Grass green |
| Hockey | #003087 (ice blue) | #CF0A2C | Ice white |
| Football | #3C1A00 (brown) | #FFD700 (gold) | Turf green |
| Baseball | #1C3C6D (navy) | #C41E3A (red) | Diamond tan |
| Tennis | #536B3D (grass) | #E8E052 (ball) | Court blue/clay |
| Volleyball | #F5A623 (sand) | #4A90D9 | Court wood |

---

## 4. Phase Breakdown (32 Phases)

### MILESTONE 1: Foundation (Phases 1-6) — ~8M tokens
> Goal: Functional Next.js app with auth, design system, and basic navigation

#### Phase 1: Project Scaffolding & Monorepo Setup (700K tokens)
- [ ] Initialize Turborepo monorepo with `apps/web`, `packages/*`
- [ ] Next.js 15 App Router with TypeScript strict mode
- [ ] Tailwind CSS 4 with token-driven `@theme` config
- [ ] shadcn/ui initialization with all primitives
- [ ] ESLint + Prettier config
- [ ] Vitest + Playwright setup
- [ ] Path aliases (`@/`, `@b6/ui`, `@b6/core`, etc.)
- [ ] Environment variable schema (Zod-validated)
- [ ] `CLAUDE.md` with project standards
- [ ] Git hooks (Husky + lint-staged)

**Deliverable:** `npm run dev` boots empty app with design system loaded

#### Phase 2: Design Token System & Theme Engine (1.2M tokens)
- [ ] `packages/tokens/` — full token definitions (colors, typography, spacing, radii, shadows, motion)
- [ ] Light theme (DEFAULT — white background)
- [ ] Dark theme (void #030303)
- [ ] Neon Lime theme (original B6 aesthetic)
- [ ] Raptors theme
- [ ] AI6 Dark theme
- [ ] Theme provider with `useTheme()` hook
- [ ] CSS custom property injection via `@theme`
- [ ] Theme persistence (localStorage + user preference in DB)
- [ ] Sport-specific color overrides per theme
- [ ] Profile token presets (6 types)
- [ ] Tailwind preset that consumes tokens
- [ ] Storybook-style token documentation page (internal)
- [ ] Motion tokens (duration, easing curves)
- [ ] Responsive breakpoints formalized as tokens
- [ ] Dark mode `prefers-color-scheme` auto-detection

**Deliverable:** Theme switcher works across all token categories

#### Phase 3: Core UI Component Library (1.5M tokens)
- [ ] **Primitives** (40+ components from shadcn/ui, themed):
  - Button, Card, Dialog, Drawer, Sheet, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Toggle, ToggleGroup, Tabs, Accordion, Badge, Avatar, Skeleton, Progress, Slider, Tooltip, Popover, DropdownMenu, ContextMenu, Command, AlertDialog, Toast (Sonner), HoverCard, Menubar, NavigationMenu, Pagination, Separator, Table, Label, Form, ScrollArea, AspectRatio, Collapsible, Carousel, ResizablePanel
- [ ] **Composites**:
  - StatGrid (configurable columns, color-coded)
  - MetricCard (icon + value + label + trend)
  - ProfileHeader (banner, avatar, info, follow)
  - ProfileCard (compact card for lists)
  - GameCard (teams, scores, status, venue)
  - PlayerCard (photo, stats, position)
  - TeamCard (logo, record, league)
  - CourtCard (image, rating, location)
  - EmptyState (icon + message + CTA)
  - ErrorBoundary (with retry)
  - PageSkeleton (loading states per page type)
  - ConfirmDialog (destructive action confirmation)
  - SearchBar (with filters + suggestions)
  - FilterPills (horizontal scroll, multi-select)
  - InfiniteScroll (virtualized list)
  - PullToRefresh (mobile gesture)
- [ ] **Navigation**:
  - BottomNav (5 tabs, elevated compose, active indicator)
  - TopHeader (logo, search, notifications, profile)
  - Sidebar (desktop, collapsible)
  - Breadcrumb
  - TabBar (page-level tabs)
  - BackButton (mobile navigation)
- [ ] Responsive behavior: BottomNav on mobile, Sidebar on desktop
- [ ] Touch target enforcement (44px minimum)
- [ ] Haptic feedback integration (Capacitor)
- [ ] Component tests for all primitives

**Deliverable:** Full component library with theme support

#### Phase 4: Authentication & User System (1.2M tokens)
- [ ] Auth provider (NextAuth.js v5 or custom)
- [ ] Email/password registration
- [ ] OAuth providers (Google, Apple)
- [ ] Magic link login
- [ ] Biometric auth (Capacitor — Face ID, fingerprint)
- [ ] Registration wizard (role selection → profile setup)
- [ ] Role system: owner, admin, commissioner, team_manager, coach, player, parent, fan
- [ ] Permission matrix (RBAC) — what each role can access
- [ ] Role-based dashboard routing
- [ ] User profile CRUD (name, avatar, bio, location, links)
- [ ] Session management (JWT + refresh tokens)
- [ ] Password reset flow
- [ ] Email verification
- [ ] Account deletion (PIPEDA compliance)
- [ ] Middleware for protected routes
- [ ] API route authentication
- [ ] User preferences storage (theme, notifications, privacy)
- [ ] Onboarding flow (first-time user tutorial)

**Deliverable:** Users can register, login, select role, and reach their dashboard

#### Phase 5: Database Schema & Infrastructure (1.5M tokens)
- [ ] Prisma schema design (55+ models across 12 domains)
- [ ] **Core models**: User, UserProfile, UserRole, Organization, League, Team, Player, PersistentPlayer
- [ ] **Game models**: Game, GameEvent, PlayerStat, GameOfficial
- [ ] **Sports models**: Sport, SportConfig, StatTaxonomy, ZoneDefinition, SurfaceTemplate
- [ ] **Community models**: Post, ForumPost, ForumReply, Message, FanPage, Award, Poll
- [ ] **Marketplace models**: CoachProfile, TrainerListing, Booking, Credential, Review
- [ ] **Commerce models**: Subscription, Payment, Product, TeamStore, SponsorPipeline
- [ ] **Compliance models**: WaiverConsent, MedicalForm, BackgroundCheck, CodeOfConduct
- [ ] **Analytics models**: SeasonAverage, TeamHealthScore, AI6Evaluation, ScoutingReport
- [ ] **Infrastructure models**: Venue, ScheduleItem, Notification, AuditLog
- [ ] Database migrations (Prisma Migrate)
- [ ] Seed data (demo league, teams, players, games)
- [ ] Row-level security policies
- [ ] Database indexes for query performance
- [ ] Redis Cloud setup (session cache, query cache, rate limiting)
- [ ] DigitalOcean Spaces setup (avatar, media, document storage)
- [ ] Connection pooling (PgBouncer or Prisma Accelerate)
- [ ] Database backup automation

**Deliverable:** Full schema deployed, seeded, queries < 50ms

#### Phase 6: Layout Shell & Navigation (800K tokens)
- [ ] App layout with responsive shell:
  - Mobile: TopHeader + Content + BottomNav
  - Tablet: Sidebar (collapsed) + TopBar + Content
  - Desktop: Sidebar (expanded) + TopBar + Content
- [ ] Route groups: `(auth)`, `(public)`, `(app)`, `(admin)`
- [ ] Role-based dashboard redirect on `/`
- [ ] Lazy loading for all page routes
- [ ] Page transitions (Motion)
- [ ] Scroll restoration
- [ ] Deep linking support (Capacitor)
- [ ] Universal navigation state (current sport, active league context)
- [ ] Notification bell with unread count
- [ ] Global search (Command palette / mobile search)
- [ ] Error pages (404, 500, unauthorized)
- [ ] Offline indicator
- [ ] Network status detection

**Deliverable:** Full navigation works across desktop/tablet/mobile

---

### MILESTONE 2: Basketball Core (Phases 7-11) — ~10M tokens
> Goal: Complete basketball experience — stat tracking to analytics

#### Phase 7: Basketball Court Engine (2M tokens)
*Merging bit6-stats CourtView into Next.js*
- [ ] `packages/ui/sports/basketball/` component library
- [ ] InteractiveCourtSVG — full-court SVG with touch/click zones
  - Portrait orientation (mobile)
  - Landscape orientation (tablet/desktop)
  - Responsive scaling with viewBox
  - Zone overlay visualization (paint, mid-range, 3-point, backcourt)
- [ ] 14-zone detection system:
  - Paint (restricted area, ≤4ft)
  - Close range (≤10ft)
  - Mid-range left/right (≤15ft)
  - Long mid-range left/right (≤23.75ft)
  - 3-point corner left/right
  - 3-point wing left/right
  - 3-point top of key
  - Backcourt left/right
- [ ] Court themes (6 visual styles):
  - B6 Signature, AI6 Dark, Varsity Blues, Midnight, Classic Hardwood, Raptors Red
- [ ] Coordinate system: SVG viewport → normalized 0-1 → database storage
- [ ] PlayerMarker components:
  - Basic marker (jersey number + position)
  - Advanced marker (live stats badge: PTS, REB, AST)
  - Drag-to-location interaction (touch + mouse)
  - Spring animation snap-back to neutral
- [ ] StatEntryPopup — zone-aware stat selection:
  - In paint: 2PT Made/Miss, FT, Foul, REB
  - Mid-range: 2PT Made/Miss, REB
  - 3-point: 3PT Made/Miss
  - All zones: AST, STL, BLK, TOV, AND1
- [ ] Player substitution panel (bench drawer)
- [ ] Shot chart visualization (made/missed markers on court)
- [ ] Heat map overlay (shooting percentages by zone)

**Deliverable:** Interactive basketball court with full stat entry

#### Phase 8: Game Engine — Clock, Scoring & Real-Time (2M tokens)
- [ ] GameClockContext — game clock management
  - Configurable quarter length (8/10/12 min)
  - Shot clock (24s, 14s on offensive rebound)
  - Clock start/pause/resume
  - Quarter end detection
  - Overtime handling (configurable length)
- [ ] TimeoutContext — team timeout tracking
  - Configurable timeouts per half
  - Full vs 30-second (20-second) timeouts
  - Timeout remaining display
- [ ] Scoring engine:
  - Points calculation from stat entries
  - Running score display (ScoreHeader component)
  - Quarter-by-quarter scoring summary
- [ ] Foul tracking:
  - Personal fouls per player (foul-out at 5 or 6)
  - Team fouls per quarter
  - Bonus/double-bonus detection
  - Technical foul tracking
- [ ] Game state machine:
  - `pregame` → `in_progress` → `halftime` → `in_progress` → `final`
  - Overtime: `regulation_end` → `overtime` → `final`
  - `paused`, `delayed`, `cancelled` states
- [ ] WebSocket real-time sync (Socket.io):
  - Clock sync every 3 seconds
  - Stat entry broadcast to all viewers
  - Scoreboard live updates
  - Connection recovery + missed event replay
- [ ] Game event log (play-by-play):
  - Chronological event feed
  - Filter by event type, player, quarter
  - Undo last event
  - Event annotations
- [ ] Pre-game setup flow:
  - Select home/away teams (from DB or ad-hoc)
  - Set game rules (quarter length, foul limit, timeouts)
  - Select starters (5 per team)
  - Assign officials
  - Venue + date/time
- [ ] Post-game summary:
  - Final box score
  - Shot chart
  - Play-by-play highlights
  - Player of the game
  - Export (CSV, JSON, PDF)
  - Share (native share sheet)
- [ ] Offline mode:
  - localStorage fallback for stat entry
  - Queue sync when connection restored
  - Conflict resolution for parallel entries
- [ ] Multiple scorer support (2+ people tracking same game)

**Deliverable:** Full live basketball game tracking with real-time sync

#### Phase 9: Basketball Box Score & Statistics (1.5M tokens)
- [ ] Full box score display:
  - Per-player: MIN, PTS, FGM-FGA, 3PM-3PA, FTM-FTA, OREB, DREB, REB, AST, STL, BLK, TOV, PF, +/-
  - Team totals row
  - Shooting percentages (FG%, 3P%, FT%)
  - Quarter-by-quarter scoring summary
- [ ] Advanced analytics calculations:
  - eFG% = (FGM + 0.5 × 3PM) / FGA × 100
  - TS% = PTS / (2 × (FGA + 0.44 × FTA)) × 100
  - AST/TO ratio
  - PER = (PTS + REB + AST + STL + BLK - (FGA-FGM) - (FTA-FTM) - TOV) / Games
  - Usage Rate
  - Offensive/Defensive Rating
  - Plus/Minus
  - Game Score
- [ ] Team analytics:
  - Pace (possessions per game)
  - Net Rating
  - Rebound Rate, Turnover Rate, Assist Rate
  - Points in Paint, Fast Break Points, Bench Points
- [ ] Season averages (materialized view):
  - Per-game averages across all stats
  - Rolling averages (last 5, 10, 20 games)
  - Career averages
- [ ] League leaders:
  - Top 10 per category (PPG, RPG, APG, etc.)
  - Minimum games qualifier
  - Historical leaders
- [ ] Data visualization:
  - Shot chart (court overlay with made/missed)
  - Heat map (zone shooting %)
  - Trend lines (stats over time)
  - Bar charts (per-game breakdown)
  - Radar chart (5-axis player comparison)
  - Pie chart (shot distribution: 2PT/3PT/FT)
  - Game flow chart (score margin over time)
- [ ] Stat comparison tool (player vs player, team vs team)
- [ ] Export: CSV, JSON, PDF (FIBA-style scoresheet), image

**Deliverable:** Complete basketball analytics with visualizations

#### Phase 10: Player Profiles & Development (2M tokens)
- [ ] Player profile page:
  - Profile header (banner, avatar, info, team affiliation)
  - Physical attributes (height, weight, wingspan)
  - Position, jersey #, experience
  - Bio + social links
- [ ] Career stats dashboard:
  - Season-by-season stat table
  - Career totals + per-game averages
  - Full game log (every game played)
  - Filterable by season, league, team
- [ ] Performance visualization:
  - Season shot chart (all shots on court)
  - Stat trend graphs (PPG, RPG, APG over time)
  - Radar chart (scoring, rebounding, playmaking, defense, efficiency)
  - Hot/cold zones (shooting % by zone)
- [ ] Player comparison:
  - Side-by-side stat comparison
  - Overlap radar chart
  - Head-to-head record
- [ ] Development tracking:
  - Training plans assignment
  - Drill library with video
  - Progress metrics (before/after)
  - Goal setting + milestones
  - Coach feedback/notes
- [ ] Recruit Me portal:
  - Highlight reel compilation
  - Shareable public profile link
  - Contact preferences
  - Academic information (for student-athletes)
  - Recruitment status tracking
- [ ] Parent view:
  - Child's stats + game schedule
  - Development progress
  - Coach communication
  - Payment/registration history
- [ ] 6 profile templates (from redesign):
  - Fan, Player, Team, Coach, Organization, Business
  - Each with tokenized colors, gradients, icons
  - Consistent layout with role-specific sections

**Deliverable:** Full player profile system with development tracking

#### Phase 11: Team & League Management (2.5M tokens)
- [ ] Team management:
  - Create/edit team (name, abbreviation, colors, logo)
  - Roster management (add/remove players, set starters)
  - Team dashboard (record, upcoming games, roster health)
  - Team stats aggregate
  - Team store page
- [ ] League management:
  - Create league (name, sport, season, divisions, rules)
  - Division structure (add/remove divisions)
  - Team registration + approval
  - Fee management + payment tracking
- [ ] Schedule generation:
  - Round-robin scheduler
  - Custom schedule builder
  - Natural language scheduler (AI-powered)
  - Venue + time slot assignment
  - Conflict detection (team, venue, referee)
  - Calendar views (month/week/day)
  - Schedule sharing + export (ICS)
- [ ] Standings:
  - Auto-calculated from game results
  - Points system (W×2 + T×1)
  - Win%, point differential, streak, L10
  - Division standings
  - Playoff qualification indicators
  - Tiebreaker rules
- [ ] Referee management:
  - Referee pool
  - Game assignment
  - Availability calendar
  - Performance tracking
  - Payment/fee tracking
- [ ] Game management:
  - Schedule games
  - Assign teams, venue, officials
  - Game status tracking
  - Results entry (manual or live stat)
  - Game reports
  - Incident reports
- [ ] Organization dashboard:
  - Multi-league overview
  - Financial summary
  - User management
  - Content management
  - Sponsor management
- [ ] Commissioner dashboard:
  - League-wide KPIs
  - Rules enforcement
  - Protest/appeal management
  - Season planning tools

**Deliverable:** Full league operations from creation to standings

---

### MILESTONE 3: Community & Engagement (Phases 12-16) — ~8M tokens
> Goal: Social platform with feed, messaging, and engagement features

#### Phase 12: Social Feed System (2M tokens)
- [ ] Feed page with filter tabs (For You, Plays, Games, Courts, Trending)
- [ ] 6 card types (from redesign):
  - **PlayCard** — full card with 3D perspective, scoring buttons (+1/+2/+3), impact counter, assist sharing, confetti, glow effects
  - **NoBleedCard** — compact card with image, author, score
  - **FullWidthCard** — announcement-style wide image
  - **NoBleedSlider** — multi-image carousel
  - **NoBleedHeaderFill** — header image fill
  - **GameResultsCard** — team scores, MVP, status badge
- [ ] Post creation (Compose page):
  - Text post (280 char limit with counter)
  - Photo post (camera + gallery)
  - Video post (short clips)
  - Play submission (highlight with scoring)
  - Game recap auto-generation
  - Location tagging
  - Player/team tagging
  - Poll creation
- [ ] Feed algorithm:
  - Chronological (default)
  - Relevance-based (followed teams, leagues, players)
  - Trending (high engagement rate)
- [ ] Engagement actions:
  - Score (impact points: +1 Solid, +2 Impressive, +3 Legendary)
  - Assist (share/endorse)
  - Comment
  - Save/bookmark
  - Report
- [ ] Impact score system:
  - Accumulates from scoring on posts
  - Displayed on profile
  - Leaderboard ranking
- [ ] Infinite scroll with virtualization
- [ ] Pull-to-refresh (mobile)
- [ ] Push notifications for engagement
- [ ] Content moderation pipeline (report → review → action)

**Deliverable:** Full social feed with 6 card types and engagement

#### Phase 13: Messaging & Communication (1.5M tokens)
- [ ] Direct messaging:
  - 1-on-1 conversations
  - Group messages (team chats, league announcements)
  - Message types: text, image, link, game share, player card
  - Read receipts
  - Typing indicators
  - Real-time via WebSocket
- [ ] Team communication:
  - Team announcements channel
  - Coach → parent broadcasts
  - Game day reminders (auto-generated)
  - Practice schedule notifications
- [ ] Notification center:
  - In-app notifications (bell icon with count)
  - Push notifications (mobile):
    - Game starting soon
    - Score updates (followed games)
    - New message
    - Team announcement
    - Registration confirmation
    - Schedule change
  - Email notifications (configurable frequency)
  - Notification preferences (per-type toggle)
- [ ] Forums:
  - Community discussion boards
  - Thread creation + replies
  - Category system (General, Game Talk, Recruiting, Equipment, etc.)
  - Moderator tools (pin, lock, delete, ban)
  - Search within forums
- [ ] Fan pages:
  - Team fan page
  - Player fan page
  - Auto-populated content (game results, stats)
  - Fan interaction (polls, predictions)

**Deliverable:** Complete communication suite with real-time messaging

#### Phase 14: Search & Discovery (1M tokens)
- [ ] Global search:
  - Command palette (desktop: Cmd+K)
  - Mobile search page
  - Search categories: Players, Teams, Leagues, Courts, Users, Games
  - Recent searches
  - Trending searches
  - Type-ahead suggestions
- [ ] Player discovery:
  - Browse by position, age, location, league
  - Stat-based filters (PPG > 20, etc.)
  - Map view (location-based)
  - "Similar players" recommendations
- [ ] Team discovery:
  - Browse by league, division, location
  - Standings-sorted
  - Open roster spots
- [ ] Court finder:
  - Map integration (React Leaflet → Capacitor Geolocation)
  - Nearby courts
  - Court details (indoor/outdoor, # courts, rating)
  - Active players indicator
  - Check-in system
  - Court photos (user-submitted)
- [ ] League discovery:
  - Browse open leagues
  - Registration links
  - Season schedule preview
  - Fee information

**Deliverable:** Find anything in the platform

#### Phase 15: Awards & Recognition (800K tokens)
- [ ] Award categories:
  - MVP (per game, per season)
  - All-Star selections
  - Scoring champion
  - Defensive player
  - Most improved
  - Rookie of the year
  - Coach of the year
  - Custom awards (league-defined)
- [ ] Voting system:
  - Fan voting (community choice)
  - Coach/commissioner voting (official)
  - Weighted voting (different vote value by role)
  - Voting period management
  - Results reveal page
- [ ] Hall of Fame:
  - Career achievement tracking
  - Nomination process
  - Induction ceremony content
- [ ] Badges & achievements:
  - Game milestones (100 points, 50 games)
  - Community badges (top contributor, verified)
  - Streak badges (consecutive games)
  - Role-based badges

**Deliverable:** Full recognition system with voting

#### Phase 16: NUIT Universal Ranking (1.5M tokens)
- [ ] NUIT ranking engine:
  - Daily rank challenges
  - "Rank Everything" — players, teams, plays, coaches
  - Community consensus rankings
  - Historical ranking tracking
- [ ] Fantasy-style engagement:
  - Pick'em (predict game winners)
  - Props (predict player stats)
  - Confidence picks (weekly)
  - Season-long contests
  - Prize pool management (community)
- [ ] Leaderboard system:
  - Overall platform leaderboard
  - Per-league leaderboards
  - Per-category (predictions, engagement, content)
  - Friends leaderboard
  - Weekly/monthly/all-time views
- [ ] Gamification:
  - XP system
  - Level progression
  - Achievement unlocks
  - Streak mechanics
  - Daily challenges

**Deliverable:** Ranking + gamification driving daily engagement

---

### MILESTONE 4: Multi-Sport Expansion (Phases 17-21) — ~10M tokens
> Goal: Sport-agnostic engine supporting 8 sports (Tier 1 + Tier 2)

#### Phase 17: Sport-Agnostic Engine (2.5M tokens)
- [ ] `packages/core/entities/Sport.ts` — sport definition model:
  - Sport metadata (name, icon, surface type, player count)
  - Stat taxonomy per sport
  - Zone definitions per surface
  - Rule sets (period structure, clock type, scoring)
  - AI6 dimension weights per sport
- [ ] `packages/ui/sports/_shared/` — universal components:
  - `InteractiveSurface` — base component for any playing surface
    - SVG rendering with viewBox
    - Zone detection (polygon hit-testing)
    - Player marker management
    - Drag-to-location gesture handler
    - Touch + mouse support
    - Responsive scaling
  - `ZoneDetector` — configurable zone detection
    - Accepts zone polygon definitions
    - Returns zone name + metadata
    - Visual zone overlay
  - `PlayerMarker` — universal player marker
    - Configurable appearance per sport
    - Stat badge display
    - Position tracking
  - `StatEntryPopup` — zone-aware stat selection
    - Dynamic stat options based on zone + sport
    - Quick-entry buttons
    - Confirmation modal
  - `Scoreboard` — universal scoreboard
    - Configurable columns per sport
    - Period/quarter/half/inning display
  - `GameSetup` — sport-configurable setup wizard
    - Team selection
    - Roster/lineup per sport's requirements
    - Rules customization
- [ ] Sport registry:
  - Register new sports with config
  - Dynamic route: `/live/[gameId]` loads correct sport interface
  - Sport-specific stat options
  - Sport-specific zone maps
- [ ] Unit tests for zone detection across all sports

**Deliverable:** Add a new sport with just config + SVG

#### Phase 18: Soccer Interface (1.5M tokens)
- [ ] Soccer pitch SVG (105m × 68m, regulation markings):
  - Zones: Left/Right wing, Penalty area, Goal area, Center circle, Midfield left/right/center, Defensive third left/right/center, Attacking third left/right/center
- [ ] Soccer stat taxonomy:
  - Goals, Assists, Shots (on target/off target), Passes (completed/attempted), Crosses, Dribbles, Tackles, Interceptions, Clearances, Fouls, Yellow/Red cards, Offsides, Corners, Free kicks, Saves (GK)
- [ ] Soccer game rules:
  - 2 halves × 45 minutes + stoppage time
  - No shot clock
  - Substitution limits (3-5 per match)
  - Yellow/red card system
- [ ] Soccer-specific components:
  - Formation selector (4-4-2, 4-3-3, 3-5-2, etc.)
  - Pass map visualization
  - Touch map (heat map per player)
  - xG (expected goals) calculation
- [ ] Soccer box score format

**Deliverable:** Full soccer game tracking

#### Phase 19: Hockey Interface (1.5M tokens)
- [ ] Hockey rink SVG (200ft × 85ft, regulation markings):
  - Zones: Offensive zone, Neutral zone, Defensive zone, each split into left/right/center
  - Face-off circles, crease, blue lines, red line
- [ ] Hockey stat taxonomy:
  - Goals, Assists, Shots, Saves (G), Plus/Minus, Hits, Blocks, Faceoffs (won/lost), Penalties (PIM), Power play/Shorthanded, TOI
- [ ] Hockey game rules:
  - 3 periods × 20 minutes
  - Overtime (5 min 3-on-3)
  - Shootout
  - Penalty system (minor 2min, major 5min, misconduct 10min)
  - Power play / penalty kill tracking
- [ ] Hockey-specific components:
  - Shot chart on rink
  - Shift length tracker
  - Power play timer
  - Goalie stats panel
- [ ] Hockey box score format

**Deliverable:** Full hockey game tracking

#### Phase 20: Football Interface (2M tokens)
- [ ] Football field SVG (100 yards + end zones):
  - Zones: End zone, Red zone (inside 20), Midfield, Own territory
  - Yard markers, hash marks
- [ ] Football stat taxonomy:
  - **Passing**: Completions, Attempts, Yards, TD, INT, Rating
  - **Rushing**: Carries, Yards, TD, YPC
  - **Receiving**: Receptions, Targets, Yards, TD, YAC
  - **Defense**: Tackles, Sacks, INT, FF, FR, PD, TD
  - **Special Teams**: Punt/Kick return yards, FG made/attempted
  - **Team**: First downs, 3rd down %, Time of possession, Penalties
- [ ] Football game rules:
  - 4 quarters × 12/15 minutes
  - Play clock (25/40 seconds)
  - Down and distance tracking
  - Drive summary
  - Timeout management (3 per half)
- [ ] Football-specific components:
  - Play-by-play with down/distance
  - Drive chart
  - Field position visualization
  - Scoring plays summary
- [ ] Football box score format

**Deliverable:** Full football game tracking

#### Phase 21: Additional Tier 2 Sports (2.5M tokens)
- [ ] **Baseball** — Diamond SVG, 9 innings, batting order, pitch tracking, at-bat results
- [ ] **Tennis** — Court SVG (hard/clay/grass), set/game/point scoring, serve tracking, rally length
- [ ] **Golf** — Hole-by-hole scoring, par/bogey/birdie, course management, handicap
- [ ] **Volleyball** — Court SVG, rally scoring, rotation tracking, set system
- [ ] Each sport gets:
  - Dedicated SVG surface with zone detection
  - Full stat taxonomy
  - Game rule engine
  - Box score format
  - Basic analytics

**Deliverable:** 8 sports fully functional (Basketball + Soccer + Hockey + Football + Baseball + Tennis + Golf + Volleyball)

---

### MILESTONE 5: AI6 Intelligence Layer (Phases 22-24) — ~6M tokens
> Goal: AI-powered scouting, evaluation, and cross-sport intelligence

#### Phase 22: AI6 Scouting Framework (2.5M tokens)
- [ ] 6-dimension evaluation model:
  - **Intuition** — court/field awareness, anticipation, spacing
  - **Intelligence** — decision-making, IQ, pattern recognition
  - **Impact** — game-changing moments, clutch, signature plays
  - **Innovation** — creativity, unique moves, versatility
  - **Integration** — team chemistry, communication, adaptability
  - **Iteration** — growth trajectory, work ethic, coachability
- [ ] 19-column universal scouting matrix:
  - Physical/Skill (8): Ball control, creativity, shooting, off-balance, finishing, open-space, pace, physicality
  - Tactical/IQ (3): Tempo control, playmaking, scoring aggression
  - Defense (3): Physicality, engagement, impact
  - Mentality (5): Competitiveness, Adversity Response Quotient (1.5× weight), effort consistency, leadership, mental-physical connection
- [ ] Sport-specific weight calibration per dimension
- [ ] Composite scoring algorithm
- [ ] Scouting report generation (AI-powered via Claude):
  - Strengths/weaknesses narrative
  - Comparison to similar players
  - Development recommendations
  - Projection model
- [ ] Scout evaluation form (manual assessment entry)
- [ ] Multi-evaluator consensus (aggregate multiple scouts)
- [ ] Evaluation history tracking
- [ ] Recruit visibility portal (public shareable profiles)

**Deliverable:** AI6 scouting produces structured evaluations per player

#### Phase 23: Intelligence Dashboard (2M tokens)
- [ ] Intelligence page (4 tabs from redesign):
  - **Overview** — Platform-wide stats summary, trending metrics
  - **Compare** — Cross-sport normalization + comparison
  - **Athletes** — Individual athlete intelligence cards
  - **Matrix** — Stakeholder perspective matrix (7 views: player, coach, scout, parent, fan, media, business)
- [ ] Cross-sport comparison engine:
  - Z-score normalization across sports
  - Percentile ranking within sport
  - Universal impact score formula: `(efficiency × 0.4 + volume × 0.3 + clutch × 0.3) / leagueAvg × 50`
  - Min-max normalization for visualization
- [ ] Player intelligence card:
  - AI6 score (composite)
  - 6-dimension radar chart
  - Historical trajectory
  - Peer comparison
  - Projection
- [ ] Ad.Vance consensus engine (multi-model evaluation):
  - Claude primary evaluation
  - Cross-reference with stat models
  - Confidence score
  - Consensus narrative
- [ ] AI6 Barometer (universal metric):
  - Single score (0-100) combining all dimensions
  - Sport-agnostic comparison
  - Weekly/monthly movement
- [ ] AI6 Meridian matching:
  - Athletes to programs
  - Coaches to teams
  - Sponsors to organizations
  - Fit score algorithm

**Deliverable:** Full intelligence dashboard with cross-sport analytics

#### Phase 24: Video Analysis Pipeline (MVP) (1.5M tokens)
- [ ] Video upload system:
  - Direct upload (Capacitor camera + gallery)
  - YouTube/Vimeo link import
  - DigitalOcean Spaces storage
  - Transcoding pipeline (multiple qualities)
- [ ] Manual video tagging:
  - Mark timestamps for plays
  - Tag players involved
  - Categorize play type
  - Link to stat entries
- [ ] Highlight reel builder:
  - Select tagged plays
  - Auto-trim to action
  - Add player/stat overlays
  - Export as shareable video
  - Social sharing (native share sheet)
- [ ] Future: AI court detection + action classification (v0.3+)

**Deliverable:** Video upload, tag, and highlight reel compilation

---

### MILESTONE 6: Commerce & Monetization (Phases 25-28) — ~7M tokens
> Goal: Revenue-generating features — marketplace, subscriptions, commerce

#### Phase 25: Coaching & Trainer Marketplace (2M tokens)
- [ ] Coach profile system:
  - Auto-populated stats (seasons coached, win%, players developed)
  - Certification wallet (NCCP, NFHS, NSCA, CPR, concussion)
  - Credential verification workflow
  - Background check integration (mandatory for minors)
  - Review/rating system (from athletes, parents)
  - Availability calendar
  - Booking system
- [ ] Trainer storefront:
  - Service listings (1-on-1, group, camp, virtual)
  - Pricing + packages
  - Booking + payment flow
  - Cancellation/refund policy
  - Photo/video gallery of work
- [ ] Organization recruitment:
  - Post coaching positions
  - Applicant management pipeline
  - Credential requirements filter
  - Bulk messaging
- [ ] AI6 Meridian matching:
  - Coach-to-opportunity matching
  - Trainer-to-client matching
  - Fit score + recommendation
- [ ] Revenue model:
  - Commission on bookings (15-25%)
  - Featured/promoted profiles (premium)
  - Recruitment tools (organization tier)

**Deliverable:** Functional coaching marketplace with bookings

#### Phase 26: Subscription & Payment System (1.5M tokens)
- [ ] Subscription tiers:
  - **Free** — Basic dashboard, community, limited stats
  - **Pro ($9.99/mo)** — Advanced analytics, scouting, export, no ads
  - **Elite ($29.99/mo)** — API access, full AI6, custom reports, priority support
  - **Enterprise (custom)** — B2B, white-label, data licensing
- [ ] Payment processing (Stripe):
  - Subscription management
  - One-time payments (marketplace bookings)
  - Team/league fee collection
  - Payout system (trainer earnings)
  - Invoice generation
  - Refund handling
- [ ] Feature gating:
  - Middleware-level tier checking
  - Graceful upgrade prompts (not hard blocks)
  - Trial periods
  - Promo codes
- [ ] Team/league payment collection:
  - Registration fee collection
  - Season fee installments
  - Payment tracking dashboard (admin)

**Deliverable:** Monetized platform with subscription gating

#### Phase 27: Team Store & Wear US Integration (1.5M tokens)
- [ ] Team store:
  - Custom team merchandise page
  - Product catalog (jerseys, shorts, warmups, accessories)
  - Size selection + quantity
  - Cart + checkout flow
  - Order management
  - Fulfillment tracking
- [ ] Wear US integration:
  - API connection to Wear US catalog
  - Custom branding tool (team logo, colors, names)
  - Bulk ordering for teams/leagues
  - Discount tiers by volume
  - Cross-platform account linking
- [ ] Sponsor pipeline:
  - Sponsor discovery + matching
  - Proposal management
  - Contract tracking
  - ROI analytics for sponsors
  - Sponsor placement (banners, mentions, branded content)

**Deliverable:** E-commerce for team merchandise

#### Phase 28: Betting Intelligence & Fantasy (2M tokens)
- [ ] AI6 Player Intelligence subscription:
  - Dimension reports per player
  - Trend analysis
  - Matchup previews
  - Injury impact modeling
  - Content feed (articles, analysis)
- [ ] Pick'em platform:
  - Game winner predictions
  - Player prop predictions
  - Confidence-weighted picks
  - Streak tracking
  - Community consensus
  - Prize pools (free-to-play)
- [ ] Content-to-commerce pipeline:
  - AI6-powered analysis articles
  - Rankings + power rankings
  - Start/sit recommendations
  - Trade value charts
  - DFS lineup suggestions
- [ ] Responsible gambling:
  - Self-exclusion tools
  - Spending limits
  - Educational content
  - Help resources
  - Age verification
- [ ] Ontario market compliance:
  - AGCO regulatory requirements
  - Data handling standards
  - Advertising restrictions

**Deliverable:** Fantasy/betting intelligence content + pick'em

---

### MILESTONE 7: Platform Operations (Phases 29-32) — ~6M tokens
> Goal: Admin, compliance, mobile deployment, and data pipeline

#### Phase 29: Admin Dashboard (1.5M tokens)
- [ ] Admin panel (from redesign — 8 pages):
  - **Dashboard** — Platform KPIs (users, games, revenue, engagement)
  - **Analytics** — Charts, funnels, cohort analysis
  - **Apps** — Feature flag management
  - **Team** — Staff management
  - **Notifications** — Push/email campaign management
  - **Deployments** — Release management
  - **KEY AI** — AI6 model management
  - **Settings** — Platform configuration
- [ ] User management:
  - User search + profile view
  - Role assignment/modification
  - Account suspension/ban
  - Data export (PIPEDA compliance)
  - Account deletion
- [ ] Content moderation:
  - Reported content queue
  - Review + action workflow
  - Community guidelines enforcement
  - Automated toxicity detection
- [ ] Financial reporting:
  - Revenue dashboard
  - Subscription metrics (MRR, churn, LTV)
  - Payout management
  - Tax reporting

**Deliverable:** Full admin panel for platform operations

#### Phase 30: Forms & Compliance System (1.5M tokens)
- [ ] FormBuilder engine (3 modes from ball-in-the-6):
  - Wizard mode (step-by-step)
  - Form mode (accordion-style)
  - Chat mode (conversational AI)
- [ ] 31 form templates:
  - **Registration (6)**: Player, Coach, Referee, Volunteer, Tryout, Program
  - **Applications (4)**: Sponsor, League, Facility Partner, Vendor
  - **Operational (6)**: Game Report, Incident Report, Transfer, Schedule Request, Equipment, Facility Booking
  - **Feedback (4)**: Season Survey, Coach Evaluation, Event Feedback, NPS
  - **Settings (4)**: Parent Profile, Team Settings, League Settings, Org Setup
  - **Compliance (4)**: Waiver/Consent, Medical Form, Code of Conduct, Background Check
  - **Recognition (2)**: Award Nomination, Hall of Fame
  - All forms: Zod validation, PDF export, submission history
- [ ] PIPEDA compliance:
  - Data collection consent
  - Privacy policy management
  - Data access requests
  - Data deletion workflow
  - Parental consent for under-13
  - Age-appropriate interfaces for 13-17
  - Audit logging

**Deliverable:** Complete forms system with compliance

#### Phase 31: Mobile Deployment — iOS & Android (1.5M tokens)
- [ ] Capacitor 6 integration:
  - `capacitor.config.ts` configuration
  - iOS project generation (Xcode)
  - Android project generation (Android Studio)
- [ ] Native plugins:
  - Camera (profile photos, play uploads)
  - Push notifications (FCM + APNs setup)
  - Haptics (stat entry feedback, scoring)
  - Geolocation (court finder)
  - Share (native share sheet)
  - Biometric auth (Face ID, fingerprint)
  - Status bar (themed per sport/page)
  - Splash screen (animated logo)
  - Local notifications (game reminders)
  - Keyboard (input management)
- [ ] App Store optimization:
  - App icons (all sizes)
  - Screenshots (all device sizes)
  - App description + keywords
  - Privacy labels
  - Review guidelines compliance
- [ ] Google Play optimization:
  - Store listing
  - Screenshots
  - Content rating
  - Data safety section
- [ ] Deep linking:
  - Universal links (iOS)
  - App links (Android)
  - Deferred deep linking (install → open to content)
- [ ] Offline capabilities:
  - Service worker (PWA)
  - Cached game data
  - Offline stat entry queue
  - Sync on reconnect
- [ ] Performance optimization:
  - Image lazy loading
  - Route-based code splitting
  - Prefetching critical routes
  - Bundle size < 500KB initial

**Deliverable:** App Store + Google Play ready builds

#### Phase 32: Data Pipeline & Scraper (1.5M tokens)
- [ ] Data ingestion pipeline:
  - RAMP Interactive scraper (OBA, OSBA, 185 clubs)
  - Presto Sports scraper (OUA, OCAA, U SPORTS)
  - Sidearm Sports scraper (university teams)
  - Pointstreak scraper (CIA Bounce, UPlay)
  - TeamLinkt scraper (TDSSAA schools)
- [ ] Scraper infrastructure:
  - Scrapy + scrapy-playwright
  - Scheduled runs (daily/weekly)
  - Data normalization pipeline
  - Deduplication engine
  - Change detection (new games, updated rosters)
- [ ] Data quality:
  - Validation rules per source
  - Anomaly detection
  - Manual review queue
  - Source reliability scoring
- [ ] API for data consumers:
  - REST API with auth
  - Rate limiting
  - Documentation (OpenAPI)
  - Webhook notifications
  - GraphQL layer (future)
- [ ] PIPEDA compliance:
  - Only scrape public data
  - Voluntary athlete registration as primary source
  - Parental consent workflows
  - Data access/deletion requests

**Deliverable:** Automated data ingestion from 5 Toronto basketball sources

---

## 5. Database Architecture

### Domain Groups (55+ tables)

#### Sports Engine (7 tables)
```
sport                    # 30 sports, tier, surface type, player count
sport_config             # Rules per sport (periods, clock, scoring)
stat_taxonomy            # Stat types per sport (PTS, AST, etc.)
zone_definition          # Zone polygons per surface
surface_template         # SVG template per sport
stat_category            # Grouping (offense, defense, team)
ai6_sport_weight         # AI6 dimension weights per sport
```

#### Users & Auth (6 tables)
```
user                     # Auth record (email, password hash, provider)
user_profile             # Display info (name, avatar, bio, location)
user_role                # Role assignments (user_id, role, org_id)
user_preference          # Settings (theme, notifications, privacy)
user_session             # Active sessions
user_device              # Push notification tokens
```

#### Organizations (5 tables)
```
organization             # Top-level entity
league                   # League within org
division                 # Division within league
season                   # Season period
program                  # Camps, clinics, training programs
```

#### Teams (4 tables)
```
team                     # Team entity (name, colors, logo)
team_member              # Roster (player_id, team_id, role, jersey)
team_staff               # Coaches, managers, trainers
team_health_score        # Computed team health metric
```

#### Players (4 tables)
```
persistent_player        # Master player record (career-spanning)
player_profile           # Extended profile (bio, physical, academic)
player_game              # Per-game instance (roster spot, minutes)
player_development       # Training plans, goals, progress
```

#### Games (6 tables)
```
game                     # Game record (teams, score, status, rules)
game_event               # Play-by-play event log
game_clock               # Clock state (period, time, shot clock)
player_stat              # Aggregated per-game stats
game_official            # Referee assignments
game_report              # Post-game report
```

#### Stats & Analytics (5 tables)
```
stat_entry               # Raw stat event (player, type, zone, coords, time)
season_average           # Materialized view: per-game averages
career_stat              # Career aggregation
shot_chart_data          # Zone-specific shooting data
advanced_metric          # Computed: eFG%, TS%, PER, etc.
```

#### AI6 Intelligence (5 tables)
```
ai6_evaluation           # Scouting evaluation (6 dimensions, 19 columns)
ai6_composite_score      # Overall AI6 score
scouting_report          # AI-generated narrative report
cross_sport_comparison   # Normalized cross-sport metrics
ai6_meridian_match       # Matching scores (athlete↔program, coach↔team)
```

#### Community (8 tables)
```
post                     # Feed posts (6 types)
post_engagement          # Scores, assists, comments
comment                  # Post comments
forum_post               # Forum threads
forum_reply              # Forum responses
message                  # Direct messages
conversation             # Message threads
notification             # In-app notifications
```

#### Marketplace (6 tables)
```
coach_profile            # Coach marketplace profile
trainer_listing          # Service listing
booking                  # Session booking
credential               # Certifications
review                   # Coach/trainer reviews
background_check         # Verification status
```

#### Commerce (6 tables)
```
subscription             # User subscription
payment                  # Payment records
product                  # Store products
order                    # Store orders
sponsor                  # Sponsor entities
sponsor_placement        # Sponsor content placements
```

#### Infrastructure (5 tables)
```
venue                    # Courts, facilities
schedule_item            # Calendar events
media                    # Uploaded files (images, video)
audit_log                # System audit trail
feature_flag             # Feature toggles
```

---

## 6. API Architecture

### REST API Routes (Next.js App Router)
```
/api/auth/
  POST   /register          # Create account
  POST   /login             # Email/password login
  POST   /oauth/[provider]  # OAuth callback
  POST   /magic-link        # Magic link request
  POST   /refresh           # Refresh token
  POST   /logout            # End session
  GET    /me                # Current user

/api/users/
  GET    /[id]              # User profile
  PUT    /[id]              # Update profile
  DELETE /[id]              # Delete account
  PUT    /[id]/preferences  # Update preferences
  GET    /[id]/stats        # User engagement stats

/api/sports/
  GET    /                  # List all sports
  GET    /[sportId]         # Sport config + rules
  GET    /[sportId]/zones   # Zone definitions
  GET    /[sportId]/stats   # Stat taxonomy

/api/games/
  POST   /                  # Create game
  GET    /                  # List games (filters: sport, league, status, date)
  GET    /[id]              # Game details
  PUT    /[id]              # Update game (score, clock, status)
  POST   /[id]/events       # Record game event
  GET    /[id]/events       # Play-by-play
  DELETE /[id]/events/[eid] # Undo event
  GET    /[id]/boxscore     # Box score
  GET    /[id]/shot-chart   # Shot chart data
  POST   /[id]/start        # Start game
  POST   /[id]/end          # End game
  POST   /[id]/substitute   # Player substitution

/api/stats/
  GET    /entries           # Raw stat entries (filters)
  GET    /leaders           # League leaders
  GET    /players/[id]      # Player season stats
  GET    /players/[id]/career # Career stats
  GET    /teams/[id]        # Team stats
  GET    /advanced/[playerId] # Advanced metrics

/api/players/
  POST   /                  # Register player
  GET    /                  # Search players
  GET    /[id]              # Player profile
  PUT    /[id]              # Update player
  GET    /[id]/games        # Game log
  GET    /[id]/development  # Development plan

/api/teams/
  POST   /                  # Create team
  GET    /                  # List teams
  GET    /[id]              # Team details
  PUT    /[id]              # Update team
  GET    /[id]/roster       # Team roster
  POST   /[id]/roster       # Add player to roster
  GET    /[id]/stats        # Team stats
  GET    /[id]/schedule     # Team schedule

/api/leagues/
  POST   /                  # Create league
  GET    /                  # List leagues
  GET    /[id]              # League details
  PUT    /[id]              # Update league
  GET    /[id]/standings    # Standings
  GET    /[id]/schedule     # Full schedule
  POST   /[id]/schedule/generate # Generate schedule
  GET    /[id]/leaders      # League leaders

/api/intelligence/
  GET    /evaluate/[playerId]    # AI6 evaluation
  POST   /compare                # Cross-sport compare
  GET    /barometer/[playerId]   # AI6 barometer score
  POST   /meridian/match         # Matching algorithm
  POST   /scouting-report        # Generate report

/api/marketplace/
  GET    /coaches           # Search coaches
  GET    /coaches/[id]      # Coach profile
  GET    /trainers          # Search trainers
  POST   /bookings          # Book session
  GET    /bookings          # My bookings

/api/feed/
  GET    /                  # Feed posts (paginated)
  POST   /                  # Create post
  POST   /[id]/score        # Score a post
  POST   /[id]/assist       # Assist (share)
  POST   /[id]/comment      # Comment
  GET    /trending          # Trending posts

/api/messages/
  GET    /conversations     # My conversations
  POST   /conversations     # Start conversation
  GET    /conversations/[id] # Messages in thread
  POST   /conversations/[id] # Send message

/api/notifications/
  GET    /                  # My notifications
  PUT    /[id]/read         # Mark read
  PUT    /read-all          # Mark all read

/api/commerce/
  POST   /subscribe         # Create subscription
  PUT    /subscribe         # Update subscription
  DELETE /subscribe         # Cancel subscription
  GET    /products           # Store products
  POST   /orders             # Place order

/api/admin/
  GET    /dashboard          # Admin KPIs
  GET    /users              # User management
  PUT    /users/[id]/role    # Assign role
  GET    /content/reported   # Reported content
  PUT    /content/[id]/moderate # Moderate content
  GET    /revenue            # Financial metrics

/api/webhooks/
  POST   /stripe             # Payment webhook
  POST   /push               # Push notification events

/api/cron/
  POST   /standings          # Recalculate standings
  POST   /averages           # Recalculate season averages
  POST   /scrape             # Run data scrapers
```

### WebSocket Events (Socket.io)
```
game:join           # Join game room
game:leave          # Leave game room
game:clock-sync     # Clock state update (every 3s)
game:stat-entry     # New stat recorded
game:score-update   # Score changed
game:substitution   # Player substitution
game:timeout        # Timeout called
game:period-end     # Period ended
game:final          # Game ended
game:undo           # Event undone
chat:message        # New chat message
chat:typing         # Typing indicator
notification:new    # New notification
```

---

## 7. Sports Engine

### Tier 1 (Launch)
| Sport | Surface | Player Count | Periods | Clock |
|-------|---------|-------------|---------|-------|
| Basketball | Full court (94×50ft) | 5v5 | 4 quarters | Countdown + shot clock |
| Soccer | Pitch (105×68m) | 11v11 | 2 halves | Countdown + stoppage |
| Hockey | Rink (200×85ft) | 5v5+G | 3 periods | Countdown |

### Tier 2 (Phase 2)
| Sport | Surface | Player Count | Periods | Clock |
|-------|---------|-------------|---------|-------|
| Football | Field (100yd) | 11v11 | 4 quarters | Countdown + play clock |
| Baseball | Diamond | 9v9 | 9 innings | No clock |
| Tennis | Court | 1v1/2v2 | Sets/games | No clock |
| Golf | Course | Individual | 18 holes | No clock |
| Volleyball | Court (18×9m) | 6v6 | Sets (rally) | No clock |

### Tier 3 (2027) — Config only, implement surface SVGs
Rugby, Lacrosse, Cricket, Track & Field, Swimming, Gymnastics, Field Hockey, Boxing/MMA

### Tier 4 (2028) — Config only
Curling, Cheerleading, Alpine Skiing, Figure Skating, Rowing, Cycling, Archery, Fencing, Weightlifting, Table Tennis, Badminton, Skateboarding, Surfing, Sport Climbing

---

## 8. Personas & Roles

### 8 Core Roles (with dashboards)
| Role | Dashboard Route | Key Features |
|------|----------------|-------------|
| Owner | /admin | System-wide KPIs, all leagues, org management |
| Admin | /admin | Org metrics, user management, league oversight |
| Commissioner | /dashboard/commissioner | League schedule, standings, rules enforcement |
| Team Manager | /dashboard/team-manager | Roster, registration, payment tracking |
| Coach | /dashboard/coach | Lineup builder, playing time, game prep, stat entry |
| Player | /dashboard/player | Personal stats, schedule, training, development |
| Parent | /dashboard/parent | Child stats, schedule, payment history |
| Fan | / (feed) | Followed teams, games, community, rankings |

### Extended Personas (Phase 3+)
Scout, Media, Brand/Sponsor, Facility Manager, Bettor, Agent, Official/Referee, Trainer, Data Analyst, Educator, Vendor, Volunteer

---

## 9. Deployment & Infrastructure

### Production Environment
| Service | Provider | Details |
|---------|----------|---------|
| Web App | Vercel | Next.js deployment, edge functions |
| Database | DigitalOcean Managed PostgreSQL | Primary data store |
| Redis | Redis Cloud | Cache, rate limiting, pub/sub |
| Object Storage | DigitalOcean Spaces | Bucket: ai6, Region: tor1 |
| WebSocket | DigitalOcean Droplet | Socket.io server (178.128.225.191) |
| DNS | Cloudflare | CDN + DDoS protection |
| Email | Resend | Transactional email |
| Push | Firebase + APNs | Mobile push notifications |
| Payments | Stripe | Subscriptions + marketplace |
| CI/CD | GitHub Actions | Build + test + deploy |
| Monitoring | Vercel Analytics + Sentry | Performance + errors |

### Domains
- `ballinthe6.com` — Main app
- `stats.ballinthe6.com` — Stats/analytics
- `api.ballinthe6.com` — API
- `ws.ballinthe6.com` — WebSocket

---

## 10. Token Estimation

### Phase Token Breakdown
| Phase | Description | Est. Tokens |
|-------|-------------|-------------|
| **M1: Foundation** | | **7.9M** |
| 1 | Project Scaffolding | 700K |
| 2 | Design Tokens & Themes | 1,200K |
| 3 | Core UI Library | 1,500K |
| 4 | Auth & User System | 1,200K |
| 5 | Database & Infrastructure | 1,500K |
| 6 | Layout Shell & Navigation | 800K |
| **M2: Basketball Core** | | **10M** |
| 7 | Basketball Court Engine | 2,000K |
| 8 | Game Engine (Clock, Scoring, RT) | 2,000K |
| 9 | Box Score & Statistics | 1,500K |
| 10 | Player Profiles & Development | 2,000K |
| 11 | Team & League Management | 2,500K |
| **M3: Community** | | **6.8M** |
| 12 | Social Feed System | 2,000K |
| 13 | Messaging & Communication | 1,500K |
| 14 | Search & Discovery | 1,000K |
| 15 | Awards & Recognition | 800K |
| 16 | NUIT Universal Ranking | 1,500K |
| **M4: Multi-Sport** | | **10M** |
| 17 | Sport-Agnostic Engine | 2,500K |
| 18 | Soccer Interface | 1,500K |
| 19 | Hockey Interface | 1,500K |
| 20 | Football Interface | 2,000K |
| 21 | Tier 2 Sports (4 sports) | 2,500K |
| **M5: AI6 Intelligence** | | **6M** |
| 22 | AI6 Scouting Framework | 2,500K |
| 23 | Intelligence Dashboard | 2,000K |
| 24 | Video Analysis (MVP) | 1,500K |
| **M6: Commerce** | | **7M** |
| 25 | Coaching Marketplace | 2,000K |
| 26 | Subscriptions & Payments | 1,500K |
| 27 | Team Store & Wear US | 1,500K |
| 28 | Betting Intelligence & Fantasy | 2,000K |
| **M7: Operations** | | **6M** |
| 29 | Admin Dashboard | 1,500K |
| 30 | Forms & Compliance | 1,500K |
| 31 | Mobile Deployment (iOS/Android) | 1,500K |
| 32 | Data Pipeline & Scraper | 1,500K |
| | | |
| **Testing & QA buffer** | Unit, integration, E2E across all phases | **3.3M** |
| **Iteration & Bug fixes** | Cross-phase integration, edge cases | **3M** |
| | | |
| **TOTAL** | | **~60M tokens** |

### Execution Order
```
M1 (Foundation) → M2 (Basketball) → M3 (Community) → M4 (Multi-Sport) → M5 (Intelligence) → M6 (Commerce) → M7 (Operations)
```

Each milestone is shippable. After M2 you have a usable basketball app. After M3 it's a social sports platform. Each milestone adds a major dimension.

---

## Repos to Merge

### From `ball-in-the-6` (GitHub)
- 60+ pages → migrate to App Router pages
- Supabase client → replace with Prisma
- 50+ DB tables → merge into Prisma schema
- 40+ shadcn components → already in the plan
- Form system (31 forms) → Phase 30
- Role-based auth → Phase 4
- Game tracking basics → enhanced in Phase 8

### From `bit6-stats` (GitHub)
- InteractiveCourtSVG → Phase 7 (enhanced)
- StatEntryPopup (21KB, zone-aware) → Phase 7
- Express API routes → Phase 6 (Next.js API routes)
- PostgreSQL schema → Phase 5 (Prisma)
- 6 court themes → Phase 7
- Coordinate system → Phase 7
- PlayerMarker system → Phase 7

### From `ballinthe6` redesign (~/Desktop/surprise/)
- White theme + neon lime → Phase 2 (default theme)
- 6 card types → Phase 12
- 6 profile templates → Phase 10
- Intelligence engine → Phase 23
- BottomNav design → Phase 6
- Motion patterns → Phase 3
- JetBrains Mono for stats → Phase 2

---

*This plan represents the complete Ball in the 6 platform — from basketball stat tracker to the operating system for sports.*
