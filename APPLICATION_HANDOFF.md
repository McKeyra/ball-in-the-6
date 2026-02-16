# Ball in the 6 - Application Handoff Document

**Project:** Ball in the 6 - Basketball League Management Platform
**Version:** 0.0.0 (Current Prototype)
**Document Date:** February 15, 2026
**Purpose:** Complete application documentation for enterprise rebuild

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Application Overview](#application-overview)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Database Schema](#database-schema)
6. [Application Structure](#application-structure)
7. [Key Features](#key-features)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Critical Dependencies](#critical-dependencies)
10. [Known Limitations](#known-limitations)
11. [Enterprise Rebuild Recommendations](#enterprise-rebuild-recommendations)
12. [Migration Path](#migration-path)

---

## Executive Summary

**Ball in the 6** is a comprehensive basketball league management platform built as a React SPA prototype. The application provides real-time game tracking, player management, team administration, and community features for Toronto-based basketball organizations.

### Current State
- **Status:** Functional prototype with Supabase backend
- **Users:** Multi-role platform (owners, admins, coaches, players, parents, fans)
- **Scale:** Designed for local leagues with 10-50 teams
- **Deployment:** Supabase-hosted backend, static frontend

### Technical Debt
- **High coupling to Supabase** - Cannot easily migrate to other databases
- **No automated testing** - Manual QA only
- **Minimal error handling** - Limited production-ready error management
- **Ad-hoc state management** - Mix of Context, React Query, and local state
- **Limited scalability** - Polling-based real-time updates, no WebSocket infrastructure

---

## Application Overview

### Purpose
Manage basketball leagues, teams, games, and player development for community sports organizations in Toronto, Ontario.

### Core Capabilities
1. **Live Game Tracking** - Real-time scorekeeping, shot clock, game clock, substitutions
2. **Team Management** - Roster management, lineup builder, team health scoring
3. **League Administration** - Schedule creation, standings, playoff brackets
4. **Player Development** - Stats tracking, performance analytics, training plans
5. **Community Features** - Social feed, forums, fan pages, messaging
6. **Forms & Compliance** - Waivers, medical forms, background checks, registrations
7. **E-Commerce** - Team stores, sponsor management, program sign-ups

### Target Users
- **League Commissioners** - Manage leagues, approve teams, set schedules
- **Organization Owners** - Oversee multiple leagues, manage staff
- **Team Coaches** - Track games, manage rosters, review performance
- **Team Managers** - Handle admin tasks, registrations, payments
- **Players** - View stats, schedules, team info
- **Parents** - Register kids, pay fees, view schedules
- **Fans** - Follow teams, vote on awards, engage in forums

---

## Technology Stack

### Frontend
```json
{
  "framework": "React 18.2.0",
  "build_tool": "Vite 6.1.0",
  "routing": "React Router DOM 6.26.0",
  "ui_library": "Radix UI (17+ components)",
  "styling": "Tailwind CSS 3.4.17",
  "state_management": [
    "TanStack React Query 5.84.1",
    "React Context API",
    "Local component state"
  ],
  "forms": "React Hook Form 7.54.2 + Zod 3.24.2",
  "animations": "Framer Motion 11.16.4",
  "charts": "Recharts 2.15.4",
  "icons": "Lucide React 0.475.0"
}
```

### Backend
```json
{
  "database": "Supabase PostgreSQL",
  "auth": "Supabase Auth (email/password + OAuth)",
  "storage": "Supabase Storage",
  "edge_functions": "Deno/TypeScript",
  "realtime": "Polling (5s intervals via React Query)",
  "file_uploads": "Supabase Storage with public buckets"
}
```

### Development
```json
{
  "language": "JavaScript (JSX/ES6+)",
  "type_checking": "TypeScript 5.8.2 (light usage)",
  "linting": "ESLint 9.19.0",
  "package_manager": "npm",
  "node_version": "Not pinned (22.13.5+ recommended)"
}
```

### Third-Party Integrations
- **jsPDF** - PDF generation for game reports
- **html2canvas** - Screenshot/PDF conversion
- **Moment.js & date-fns** - Date/time manipulation
- **Lodash** - Utility functions
- **Notion API** - Integration for data sync (via Edge Functions)

---

## Architecture

### Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                            │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer (React Components)                      │
│  ├── Pages (src/pages/)                                     │
│  ├── Components (src/components/)                           │
│  └── UI Primitives (src/components/ui/)                     │
├─────────────────────────────────────────────────────────────┤
│  State Management                                           │
│  ├── React Context (Auth, GameClock, Timeouts)             │
│  ├── TanStack Query (Server State)                         │
│  └── Local State (Forms, UI)                               │
├─────────────────────────────────────────────────────────────┤
│  API Client Layer                                           │
│  └── Base44 Client (Supabase Wrapper)                      │
│      ├── Entity Proxy (dynamic CRUD)                       │
│      ├── Auth Methods                                      │
│      ├── Edge Functions                                    │
│      └── Storage                                           │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Platform                         │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL Database (50+ tables)                           │
│  ├── Row Level Security (RLS)                              │
│  ├── Realtime (not actively used)                          │
│  └── PostgREST API                                         │
├─────────────────────────────────────────────────────────────┤
│  Supabase Auth                                              │
│  ├── Email/Password                                        │
│  ├── OAuth Providers                                       │
│  └── JWT Token Management                                  │
├─────────────────────────────────────────────────────────────┤
│  Supabase Storage                                           │
│  └── Public file uploads                                   │
├─────────────────────────────────────────────────────────────┤
│  Edge Functions (Deno/TypeScript)                          │
│  ├── invoke-llm                                            │
│  ├── send-email                                            │
│  ├── send-sms                                              │
│  ├── upload-file                                           │
│  └── generate-image                                        │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

#### Authentication Flow
1. User visits app → `AuthProvider` initializes
2. `checkAppState()` checks Supabase session
3. If session exists → `base44.auth.me()` fetches user + role
4. User state stored in `AuthContext`
5. `Layout.jsx` reads role and redirects to dashboard

#### Entity CRUD Flow
1. Component renders → calls `useQuery(base44.entities.Team.list())`
2. Base44 proxy converts `Team` → `team` table
3. Supabase client executes `.from('team').select()`
4. TanStack Query caches result
5. Component renders data
6. Mutations use `useMutation(base44.entities.Team.update())`
7. On success, Query Client invalidates cache

#### Real-Time Game Flow
1. `LiveGame` page mounts → starts `GameClockContext`
2. Clock runs → interval polling every 5s via React Query
3. Updates persisted to Supabase `game` table
4. All clients fetch updated game state via polling
5. UI re-renders with new scores/clock values

### Key Abstractions

#### 1. Base44 Client (API Wrapper)
**File:** `src/api/base44Client.js`

Proxy-based Supabase wrapper that converts PascalCase entity names to snake_case table names:

```javascript
base44.entities.Team.list() → supabase.from('team').select()
base44.entities.Player.get(id) → supabase.from('player').select().eq('id', id).single()
base44.entities.Game.update(id, data) → supabase.from('game').update(data).eq('id', id)
```

**Provides:**
- CRUD operations for all tables
- Authentication methods
- Edge Function invocation
- File upload integration

#### 2. Page Registry
**File:** `src/pages.config.js`

Centralized route configuration:

```javascript
export const PAGES = {
  "Home": Home,
  "CoachDashboard": CoachDashboard,
  "PlayerDashboard": PlayerDashboard,
  // ... 80+ page components
}
```

Enables dynamic routing and role-based dashboard selection.

#### 3. Role-Based Dashboard Routing
**File:** `src/Layout.jsx`

Automatically redirects users to their dashboard:

```javascript
const dashboardMap = {
  owner: "/OrgDashboard",
  admin: "/Dashboard",
  coach: "/CoachDashboard",
  player: "/PlayerDashboard",
  parent: "/ParentDashboard",
  // ...
}
```

---

## Database Schema

### Core Tables (13)

#### 1. `organization`
Primary organization entity (e.g., "Ball in the 6")
- Stores org name, branding, contact info
- Referenced by leagues, teams, players

#### 2. `league`
Sports league within an organization
- Fields: name, season, sport, status, dates
- References: organization_id

#### 3. `team`
Team roster and metadata
- Fields: name, colors, division, age_group, wins/losses
- References: league_id, organization_id
- JSONB: staff[], roster[]

#### 4. `game`
Game scheduling and tracking
- Fields: home/away teams, scores, status, game_date
- Game state: quarter, time_remaining, fouls, timeouts
- References: home_team_id, away_team_id, league_id

#### 5. `player`
Game-specific player instance
- Fields: name, jersey, position, stats (points, rebounds, etc.)
- References: team_id, game_id
- Ephemeral: Created per game

#### 6. `persistent_player`
Master player records
- Fields: name, contact, bio, medical notes
- References: team_id, organization_id
- Permanent player data

#### 7. `player_base`
Player master database
- Lightweight player registry
- References: current_team_id

#### 8. `game_event`
Play-by-play events
- Fields: event_type, points, quarter, time, position
- References: game_id, player_id, team_id

#### 9. `player_stat`
Aggregated player statistics
- Fields: all basketball stats (FGM, FGA, 3PM, etc.)
- References: player_id, game_id, team_id

#### 10. `schedule_item`
Calendar events (games, practices)
- Fields: title, type, start/end time, location
- References: team_id, game_id

#### 11. `program`
Training programs and camps
- Fields: name, dates, price, capacity
- References: organization_id

#### 12. `team_member`
Team roster membership
- Fields: role, name, contact
- References: team_id, user_id, player_id

#### 13. `coach`
Coach profiles
- Fields: name, contact, certifications, bio
- References: team_id

### Supporting Tables (40+)

**Social & Community (8):**
- `post`, `social_post`, `forum_post`, `forum_reply`
- `fan_page`, `message`, `fan`, `award`

**Compliance & Forms (10):**
- `waiver_consent`, `medical_form`, `code_of_conduct`, `background_check`
- `tryout_registration`, `program_registration`, `application`, `form_template`
- `survey`, `feedback`, `evaluation`

**Infrastructure (7):**
- `venue`, `location`, `opponent`, `sponsor`, `product`, `team_store`
- `referee`, `volunteer`

**User Management (4):**
- `user_profile`, `parent_profile`, `player_profile`, `user_roles`

**Analytics & Tracking (6):**
- `live_stat`, `game_vote`, `team_health_score`
- `training_plan`, `video_analysis`, `poll`

**Content (2):**
- `article`, `gallery`

### Database Files

**Production SQL:**
- `digital-ocean-postgres-setup.sql` - Complete schema for standard PostgreSQL
- **Run this file** on Digital Ocean PostgreSQL to create entire database

**Archived Supabase SQL:**
- `archive/supabase-sql/` - Original Supabase-specific schemas with RLS policies

### Key Relationships

```
organization (1) → (*) league
league (1) → (*) team
team (1) → (*) player
team (1) → (*) persistent_player
game (*) → (1) team (home)
game (*) → (1) team (away)
game (1) → (*) player
game (1) → (*) game_event
player (1) → (*) player_stat
program (1) → (*) program_registration
```

---

## Application Structure

### Directory Tree

```
ball-in-the-6/
├── src/
│   ├── api/                        # Supabase client & integrations
│   │   ├── base44Client.js        # Main Supabase wrapper
│   │   ├── entities.js            # Entity-specific accessors
│   │   └── integrations.js        # Third-party integrations
│   ├── assets/                    # Images, fonts, media
│   ├── components/
│   │   ├── ui/                    # Radix UI primitives (50+ components)
│   │   ├── basketball/            # Game tracking components
│   │   │   ├── GameClockContext.jsx
│   │   │   ├── TimeoutContext.jsx
│   │   │   ├── DesktopCourtView.jsx
│   │   │   └── MobileCourtView.jsx
│   │   ├── craft/                 # Theme components (header, nav)
│   │   │   ├── B6Header.jsx
│   │   │   ├── B6BottomNav.jsx
│   │   │   └── B6MobileMenu.jsx
│   │   ├── coach/                 # Coach-specific components
│   │   ├── dashboard/             # Dashboard widgets
│   │   ├── feed/                  # Social feed cards
│   │   ├── forms/                 # Form builders
│   │   ├── game/                  # Game management
│   │   ├── league/                # League administration
│   │   ├── player/                # Player profiles
│   │   ├── team/                  # Team management
│   │   └── [others]/              # Various domain components
│   ├── hooks/
│   │   └── use-mobile.jsx        # Breakpoint detection
│   ├── lib/
│   │   ├── AuthContext.jsx       # Auth provider
│   │   ├── query-client.js       # TanStack Query config
│   │   ├── NavigationTracker.jsx # Route tracking
│   │   ├── VisualEditAgent.jsx   # AI visual editor
│   │   └── utils.js              # Shared utilities
│   ├── pages/                     # 80+ page components
│   │   ├── Home.jsx
│   │   ├── CoachDashboard.jsx
│   │   ├── PlayerDashboard.jsx
│   │   ├── LiveGame.jsx
│   │   ├── TeamManagement.jsx
│   │   └── forms/                # 25+ form pages
│   │       ├── PlayerRegistration.jsx
│   │       ├── WaiverConsent.jsx
│   │       └── [others]/
│   ├── utils/
│   │   ├── index.ts              # URL helpers
│   │   └── sportConfigs.js       # Sport configurations
│   ├── App.jsx                   # Root component
│   ├── Layout.jsx                # Authenticated layout wrapper
│   ├── main.jsx                  # Vite entry point
│   ├── pages.config.js           # Page registry
│   ├── App.css                   # App styles
│   └── index.css                 # Global styles + Tailwind
├── functions/                     # Supabase Edge Functions
├── archive/
│   └── supabase-sql/             # Archived Supabase SQL files
├── .planning/
│   └── codebase/                 # Documentation
│       ├── ARCHITECTURE.md
│       ├── STRUCTURE.md
│       ├── STACK.md
│       ├── CONVENTIONS.md
│       └── CONCERNS.md
├── digital-ocean-postgres-setup.sql  # Production database schema
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── jsconfig.json                # Path aliases
├── .env                         # Environment variables (not committed)
└── .env.example                 # Environment template
```

### Page Inventory (80+ Pages)

**Dashboards (8):**
- Home, Dashboard, CoachDashboard, PlayerDashboard, ParentDashboard
- OrgDashboard, OrgPresidentDashboard, TeamManagerDashboard

**Game Management (7):**
- LiveGame, GameView, GameSetup, DetailedGameView, BoxScore, CourtView, LiveStats

**Team/League (11):**
- Teams, TeamList, TeamDetail, TeamOverview, TeamManagement, TeamDashboard
- TeamPerformance, TeamHealthDashboard, LeagueManagement, LeagueCommissionerDashboard, Standings

**Players (6):**
- PlayerManagement, PlayerProfile, PlayerProfiles, PlayerSheet, PlayerDevelopment

**Community (6):**
- Feed, Forum, FanPages, FanZone, Messenger, Store

**Programs & Admin (7):**
- Programs, AddNewProgram, Schedule, SponsorPipeline, Awards, Content, Manual

**Forms - Registration (6):**
- PlayerRegistration, CoachRegistration, RefereeRegistration
- VolunteerRegistration, TryoutRegistration, ProgramSignup

**Forms - Applications (4):**
- SponsorApplication, LeagueApplication, FacilityPartner, VendorApplication

**Forms - Operational (6):**
- GameReport, IncidentReport, TransferRequest
- ScheduleRequest, EquipmentRequest, FacilityBooking

**Forms - Feedback (4):**
- SeasonSurvey, CoachEvaluation, EventFeedback, NPSSurvey

**Forms - Settings (4):**
- ParentProfileSetup, TeamSettingsForm, LeagueSettingsForm, OrganizationSetup

**Forms - Compliance (4):**
- WaiverConsent, MedicalForm, CodeOfConduct, BackgroundCheck

**Forms - Recognition (2):**
- AwardNomination, HallOfFame

**Utility Pages (5):**
- Login, Register, CreateTeam, EditTeam, TeamRegistration

**Development Tools (3):**
- CleanupDuplicates, SeedOSBA, OGH

---

## Key Features

### 1. Live Game Tracking
**Pages:** LiveGame, GameView, CourtView, BoxScore
**Components:** GameClockContext, TimeoutContext, DesktopCourtView, MobileCourtView

**Capabilities:**
- Real-time scorekeeping with game clock and shot clock
- Player substitutions with on-court tracking
- Play-by-play event logging (points, fouls, rebounds, etc.)
- Team timeout tracking
- Quarter/period management
- Live stats display (FGM, FGA, 3PM, FT%, etc.)
- Court visualization (desktop and mobile)
- Score export to PDF

**Technical Implementation:**
- Polling-based real-time (5s intervals via React Query)
- Clock state persisted to localStorage
- Game state stored in `game` table
- Events stored in `game_event` table
- Player stats aggregated in `player_stat` table

### 2. Team Management
**Pages:** TeamManagement, TeamDashboard, TeamOverview, TeamPerformance
**Components:** LineupBuilder, TeamHealthScoring

**Capabilities:**
- Team creation and editing
- Roster management (add/remove players)
- Lineup builder with drag-and-drop
- Team branding (colors, logos)
- Performance analytics
- Team health scoring (payment, engagement, attendance, roster)
- Staff management (coaches, managers)

### 3. Player Development
**Pages:** PlayerManagement, PlayerProfile, PlayerDevelopment
**Components:** StatButton, CareerStatsAggregator

**Capabilities:**
- Player profiles with bio and photo
- Career statistics tracking
- Performance trends and charts
- Training plan assignment
- Video analysis tagging
- Player evaluation forms

### 4. League Administration
**Pages:** LeagueManagement, LeagueCommissionerDashboard, Standings
**Components:** LeagueCreationWizard, LeagueScheduler, StandingsTable

**Capabilities:**
- League creation and configuration
- Division management
- Schedule generation
- Standings calculation (wins, losses, points)
- Playoff bracket creation
- Team approval workflow

### 5. Social & Community
**Pages:** Feed, Forum, FanPages, FanZone, Messenger
**Components:** EventCard, GameScoreCard, PostCard

**Capabilities:**
- Social activity feed
- Forum discussions
- Fan page creation
- Direct messaging
- Game voting (MVP, best play)
- Award nominations

### 6. Forms & Registration
**Pages:** 25+ form pages
**Components:** FormBuilder, FormFields, FormChat

**Capabilities:**
- Dynamic form builder loading from JSON configuration
- Player/coach/referee registration
- Program sign-ups
- Waiver and consent forms
- Medical forms
- Background checks
- Sponsor applications
- Surveys and feedback

### 7. Analytics & Reporting
**Pages:** TeamPerformance, TeamHealthDashboard, CoachDashboard
**Components:** Charts (Recharts)

**Capabilities:**
- Team health scoring algorithm
- Player performance metrics
- League standings
- Game reports (PDF export)
- Attendance tracking
- Payment status monitoring

---

## User Roles & Permissions

### Role Hierarchy

```
owner (Super Admin)
  ├── admin (Organization Admin)
  │   ├── league_admin (League Commissioner)
  │   │   └── team_admin (Team Manager)
  │   │       ├── coach
  │   │       └── player
  │   └── parent
  └── fan
```

### Role Definitions

#### 1. Owner
**Access:** Full system access
**Capabilities:**
- Manage organizations
- Assign roles
- Access all data
- Configure system settings

**Dashboard:** `/OrgDashboard`

#### 2. Admin
**Access:** Organization-wide
**Capabilities:**
- Create leagues
- Approve teams
- Manage users
- View all analytics

**Dashboard:** `/Dashboard`

#### 3. League Admin (Commissioner)
**Access:** League-specific
**Capabilities:**
- Create schedules
- Manage teams in league
- Approve registrations
- Edit league settings

**Dashboard:** `/LeagueCommissionerDashboard`

#### 4. Team Admin (Manager)
**Access:** Team-specific
**Capabilities:**
- Manage team roster
- Handle registrations
- Track payments
- Submit forms

**Dashboard:** `/TeamManagerDashboard`

#### 5. Coach
**Access:** Team-specific
**Capabilities:**
- Track games
- Manage lineups
- View player stats
- Create training plans

**Dashboard:** `/CoachDashboard`

#### 6. Player
**Access:** Own profile + team info
**Capabilities:**
- View personal stats
- See team schedule
- Update profile
- Access training materials

**Dashboard:** `/PlayerDashboard`

#### 7. Parent
**Access:** Child player data
**Capabilities:**
- Register children
- Pay fees
- View schedules
- Complete forms

**Dashboard:** `/ParentDashboard`

#### 8. Fan
**Access:** Public content
**Capabilities:**
- View games/schedules
- Follow teams
- Participate in forums
- Vote on awards

**Dashboard:** `/Home`

### Role Implementation

**Database:**
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'fan',
  full_name TEXT,
  organization_id UUID,
  team_id UUID,
  is_active BOOLEAN DEFAULT TRUE
);
```

**Frontend:**
- Role stored in `AuthContext.user.user_role`
- Dashboard routing in `Layout.jsx` via `dashboardMap`
- Component-level role checks via `user.user_role === 'coach'`

**Backend:**
- Supabase RLS policies enforce row-level access
- Role-based policies in `supabase-security-fixes.sql`

---

## Critical Dependencies

### Cannot Be Removed

#### 1. @supabase/supabase-js (2.49.1)
**Why:** Entire app built on Supabase SDK
- Database queries via `.from().select()`
- Authentication via `supabase.auth`
- Storage via `supabase.storage`
- Edge Functions via `supabase.functions`

**Impact if removed:** Complete rewrite required

#### 2. @tanstack/react-query (5.84.1)
**Why:** Core state management pattern
- Server state caching
- Real-time polling
- Mutation handling
- Optimistic updates

**Impact if removed:** Major refactoring of data layer

#### 3. Tailwind CSS (3.4.17)
**Why:** All components styled with Tailwind
- No CSS modules or styled-components
- Inline utility classes throughout

**Impact if removed:** Complete redesign required

#### 4. Radix UI (@radix-ui/*)
**Why:** Foundation of entire UI component library
- 50+ components depend on Radix primitives
- Accessibility built into components

**Impact if removed:** Rebuild all UI components

### Can Be Replaced

#### 1. React Router DOM → Next.js, Remix, TanStack Router
**Effort:** Medium - update routing logic

#### 2. Moment.js → date-fns
**Effort:** Low - already have date-fns installed

#### 3. jsPDF → pdf-lib, PDFKit
**Effort:** Low - isolated to PDF generation functions

#### 4. Lodash → ES6 native methods
**Effort:** Low - reduce bundle size

---

## Known Limitations

### 1. Scalability Issues

**Polling-Based Real-Time:**
- Current: 5-second polling via React Query
- Problem: Not true real-time, high server load
- Impact: Lag in live games, scaling issues with 50+ concurrent games

**No WebSocket Infrastructure:**
- Supabase Realtime not implemented
- Cannot push updates to clients
- Requires client-initiated requests

### 2. Technical Debt

**No Automated Testing:**
- Zero unit tests
- Zero integration tests
- Zero E2E tests
- Manual QA only

**Minimal Error Handling:**
- Console-based logging only
- No error tracking service (Sentry, LogRocket)
- No user error recovery flows
- Timeout handling limited to 5s

**State Management Complexity:**
- Mix of Context, React Query, and local state
- No unified state management strategy
- Difficult to debug state issues

**Type Safety:**
- TypeScript installed but minimally used
- No type definitions for API responses
- No prop type validation
- High risk of runtime errors

### 3. Architectural Limitations

**Tight Supabase Coupling:**
- Cannot migrate to other databases without major rewrite
- Supabase-specific RLS policies
- Edge Functions locked to Deno runtime

**Monolithic Frontend:**
- Single bundle for entire app
- No code splitting by route
- Large initial load time

**No API Layer:**
- Direct database access from frontend
- No business logic on server
- Limited data transformation

**No Caching Strategy:**
- React Query default settings
- No CDN integration
- No service worker for offline

### 4. Security Concerns

**RLS Policy Gaps:**
- Some tables use `USING (true)` policies
- Not all sensitive data properly restricted
- Client-side role checks can be bypassed

**Secrets in Frontend:**
- Supabase anon key exposed (acceptable)
- Service role key should NOT be in frontend

**No Rate Limiting:**
- No protection against abuse
- No request throttling
- Vulnerable to DoS

### 5. UX/Performance Issues

**Mobile Performance:**
- Heavy React component tree
- No virtualization for long lists
- Court view can lag on older devices

**Accessibility:**
- Keyboard navigation incomplete
- Screen reader support limited
- Color contrast issues in dark theme

**Offline Support:**
- No offline capabilities
- No service worker
- Loses state on refresh in some cases

---

## Enterprise Rebuild Recommendations

### 1. Architecture Modernization

#### Backend: Separate API Layer
**Recommendation:** Build dedicated REST/GraphQL API

**Stack Options:**
- **Node.js:** Express, Fastify, or NestJS
- **Go:** Gin, Echo (high performance)
- **Python:** FastAPI, Django REST Framework
- **.NET:** ASP.NET Core Web API

**Benefits:**
- Business logic on server
- Data transformation layer
- Rate limiting and caching
- Better security control
- Multiple client support (mobile, web)

#### Database: PostgreSQL with ORM
**Recommendation:** Use Digital Ocean Managed PostgreSQL + ORM

**ORM Options:**
- **Prisma** (TypeScript-first, excellent DX)
- **Drizzle** (lightweight, type-safe)
- **TypeORM** (mature, feature-rich)

**Benefits:**
- Type-safe queries
- Migration management
- Connection pooling
- Query optimization

#### Frontend: Modern React Framework
**Recommendation:** Next.js or Remix

**Next.js Benefits:**
- Server-side rendering
- API routes
- Image optimization
- File-based routing
- Edge runtime support

**Remix Benefits:**
- Better data loading patterns
- Progressive enhancement
- Nested routing
- Form handling built-in

#### Real-Time: WebSocket Infrastructure
**Recommendation:** Socket.io or Pusher

**Socket.io Benefits:**
- True real-time updates
- Automatic reconnection
- Room-based broadcasting
- Fallback to polling

**Pusher Benefits:**
- Managed service
- Global CDN
- Built-in presence
- Pay-as-you-go pricing

### 2. State Management

**Recommendation:** Zustand + TanStack Query

**Zustand for:**
- UI state
- User preferences
- Global app state

**TanStack Query for:**
- Server state
- Caching
- Background refetching
- Optimistic updates

**Alternative:** Redux Toolkit (if need DevTools, time-travel debugging)

### 3. Testing Strategy

**Unit Tests:**
- Framework: Vitest (Vite-compatible, fast)
- Coverage: 80%+ for business logic
- Tools: @testing-library/react

**Integration Tests:**
- Framework: Playwright or Cypress
- Coverage: Critical user flows
- Tools: MSW for API mocking

**E2E Tests:**
- Framework: Playwright
- Coverage: Happy paths + critical scenarios
- CI/CD integration

### 4. Authentication & Authorization

**Recommendation:** Auth0, Clerk, or custom JWT

**Auth0 Benefits:**
- Enterprise SSO
- Multi-factor authentication
- User management dashboard
- Compliance (SOC 2, GDPR)

**Clerk Benefits:**
- React-first design
- Pre-built UI components
- User profiles built-in
- Webhooks for sync

**Custom JWT:**
- Full control
- Lower cost at scale
- Requires security expertise

### 5. Infrastructure

**Hosting:**
- **Frontend:** Vercel, Netlify, Cloudflare Pages
- **Backend API:** AWS ECS, Google Cloud Run, Railway
- **Database:** Digital Ocean Managed PostgreSQL, AWS RDS

**CDN & Caching:**
- Cloudflare for static assets
- Redis for API response caching
- Database query result caching

**Monitoring:**
- **APM:** Datadog, New Relic
- **Error Tracking:** Sentry
- **Logs:** Logtail, Papertrail
- **Analytics:** PostHog, Mixpanel

### 6. Developer Experience

**TypeScript:**
- Full TypeScript migration
- Strict mode enabled
- API response types generated
- Props validation

**Monorepo:**
- Tool: Turborepo or Nx
- Packages: frontend, backend, shared
- Shared types between frontend/backend

**CI/CD:**
- GitHub Actions
- Automated testing on PR
- Preview deployments
- Automated releases

### 7. Security Enhancements

**API Security:**
- Rate limiting (express-rate-limit, Cloudflare)
- CORS configuration
- Input validation (Zod on backend)
- SQL injection prevention (ORM + parameterized queries)
- XSS protection (helmet.js)

**Authentication:**
- JWT with short expiration
- Refresh token rotation
- Device fingerprinting
- Session management

**Authorization:**
- Role-based access control (RBAC)
- Permission-based access (fine-grained)
- Attribute-based access (ABAC for complex rules)

**Data Protection:**
- Encryption at rest
- Encryption in transit (TLS 1.3)
- PII data masking
- GDPR compliance (data deletion, export)

### 8. Performance Optimization

**Frontend:**
- Code splitting by route
- Lazy loading components
- Virtual scrolling for lists
- Image optimization (next/image)
- Web fonts optimization
- Service worker caching

**Backend:**
- Database query optimization
- Connection pooling
- Redis caching layer
- CDN for static assets
- Gzip/Brotli compression

**Database:**
- Proper indexing strategy
- Query performance monitoring
- Read replicas for scaling
- Database connection pooling
- Query result caching

### 9. Mobile Strategy

**Option 1: Progressive Web App (PWA)**
- Service worker for offline
- Add to home screen
- Push notifications
- Lower development cost

**Option 2: React Native**
- Native mobile apps (iOS + Android)
- Shared business logic with web
- Better performance
- App store presence

**Option 3: Expo**
- React Native with better DX
- Over-the-air updates
- Managed workflow
- Faster iteration

---

## Migration Path

### Phase 1: Stabilization (2-4 weeks)
**Goal:** Prepare current codebase for migration

**Tasks:**
1. Add comprehensive error handling
2. Implement error tracking (Sentry)
3. Add basic logging infrastructure
4. Document all API endpoints
5. Create data export scripts
6. Freeze feature development

**Deliverables:**
- Error tracking dashboard
- API documentation
- Data export tooling
- Migration runbook

### Phase 2: Database Migration (2-3 weeks)
**Goal:** Move to Digital Ocean PostgreSQL

**Tasks:**
1. Run `digital-ocean-postgres-setup.sql`
2. Export data from Supabase
3. Import data to Digital Ocean
4. Validate data integrity
5. Set up database backups
6. Configure connection pooling

**Deliverables:**
- Production database on Digital Ocean
- Automated backup strategy
- Data validation report
- Rollback plan

### Phase 3: Backend API Development (6-8 weeks)
**Goal:** Build dedicated REST API

**Tasks:**
1. Choose stack (Node.js + Express/Fastify recommended)
2. Set up project structure
3. Implement authentication (JWT)
4. Build core entity endpoints
5. Add authorization middleware
6. Implement real-time WebSocket server
7. Add rate limiting
8. Write API tests

**Deliverables:**
- REST API with full CRUD
- WebSocket server for real-time
- API documentation (OpenAPI/Swagger)
- 80%+ test coverage

### Phase 4: Frontend Modernization (8-10 weeks)
**Goal:** Migrate to Next.js and new API

**Tasks:**
1. Set up Next.js project
2. Migrate UI components (keep Radix + Tailwind)
3. Replace Base44 client with API client
4. Implement new auth flow
5. Replace polling with WebSocket
6. Add server-side rendering
7. Optimize performance
8. Add E2E tests

**Deliverables:**
- Next.js production app
- Full feature parity
- Performance benchmarks
- E2E test suite

### Phase 5: Testing & QA (3-4 weeks)
**Goal:** Ensure production readiness

**Tasks:**
1. Load testing (Artillery, k6)
2. Security audit
3. Accessibility audit (WCAG 2.1 AA)
4. Cross-browser testing
5. Mobile testing
6. User acceptance testing
7. Bug fixes

**Deliverables:**
- Load test report
- Security audit report
- Accessibility compliance report
- Bug-free production build

### Phase 6: Deployment & Monitoring (2 weeks)
**Goal:** Launch new platform

**Tasks:**
1. Set up production infrastructure
2. Configure monitoring (Datadog, Sentry)
3. Set up CI/CD pipeline
4. Blue-green deployment
5. Database migration
6. User communication
7. Launch

**Deliverables:**
- Live production system
- Monitoring dashboards
- Incident response plan
- Post-launch support

### Total Timeline: 23-31 weeks (5.5 - 7.5 months)

### Cost Estimate (Rough)

**Development (2 Full-Stack Developers):**
- $100-150k per developer for 6 months
- Total: $200-300k

**Infrastructure (Annual):**
- Database: $50-100/month ($600-1200/year)
- API Hosting: $100-200/month ($1200-2400/year)
- Frontend Hosting: $50-100/month ($600-1200/year)
- Monitoring: $100-200/month ($1200-2400/year)
- Auth Service: $100-500/month ($1200-6000/year)
- Total: $5,800-13,200/year

**Third-Party Services:**
- Error Tracking (Sentry): $1200/year
- APM (Datadog): $3600/year
- CDN (Cloudflare): $2400/year
- Total: $7,200/year

**Grand Total (Year 1):** $213,000 - $320,400

---

## Database Migration Script

The complete database schema is available in:
```
digital-ocean-postgres-setup.sql
```

**To deploy:**
```bash
# Connect to Digital Ocean PostgreSQL
psql -h your-db-host.db.ondigitalocean.com \
     -p 25060 \
     -U doadmin \
     -d ball_in_the_6 \
     --set=sslmode=require \
     -f digital-ocean-postgres-setup.sql
```

---

## Environment Variables

### Current (Supabase)
```bash
VITE_SUPABASE_URL=https://xxeozsqtoetnsqwczuvg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # Should NOT be in frontend
```

### Recommended (Enterprise)
```bash
# Frontend
NEXT_PUBLIC_API_URL=https://api.ballinthe6.com
NEXT_PUBLIC_WS_URL=wss://api.ballinthe6.com
NEXT_PUBLIC_AUTH_DOMAIN=auth.ballinthe6.com

# Backend
DATABASE_URL=postgresql://user:pass@host:5432/ball_in_the_6
REDIS_URL=redis://user:pass@host:6379
JWT_SECRET=your-secret-key
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGINS=https://ballinthe6.com,https://www.ballinthe6.com

# Third-Party
SENTRY_DSN=https://...
DATADOG_API_KEY=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
SENDGRID_API_KEY=...
TWILIO_ACCOUNT_SID=...
STRIPE_SECRET_KEY=...
```

---

## Contact & Support

**Project Owner:** Michael
**Email:** michael@enuw.ca
**GitHub:** https://github.com/McKeyra/ball-in-the-6

**Admin Accounts:**
- Owner: michael@enuw.ca, ai@enuw.ca
- Admin: mugugu@enuw.ca

---

## Appendix: File Manifest

### Critical Files for Migration

**Frontend:**
- `src/api/base44Client.js` - Supabase wrapper (replace with API client)
- `src/lib/AuthContext.jsx` - Auth logic (replace with new auth)
- `src/pages.config.js` - Route registry (port to Next.js)
- `src/Layout.jsx` - App shell (port to Next.js layout)

**Database:**
- `digital-ocean-postgres-setup.sql` - Production schema
- `archive/supabase-sql/seed_data.sql` - Sample data

**Documentation:**
- `.planning/codebase/*.md` - Architecture docs
- `APPLICATION_HANDOFF.md` - This document

### Assets to Preserve
- `src/components/ui/` - Entire UI component library (Radix + Tailwind)
- `src/components/craft/` - Theme components (header, nav, cards)
- `src/components/basketball/` - Game tracking logic
- All page components in `src/pages/` - Port to Next.js

---

## Conclusion

**Ball in the 6** is a functional prototype with comprehensive features for basketball league management. The current architecture is suitable for small-scale deployments but requires significant modernization for enterprise use.

**Key Strengths:**
- Comprehensive feature set
- Clean component architecture
- Good UI/UX foundation
- Well-documented codebase

**Critical Gaps:**
- No automated testing
- Tight Supabase coupling
- Limited scalability
- Security vulnerabilities
- No mobile app strategy

**Recommended Next Steps:**
1. **Short-term (1-3 months):** Stabilize current app, add error tracking, begin backend API development
2. **Medium-term (4-6 months):** Complete backend API, migrate database, begin Next.js migration
3. **Long-term (7-12 months):** Launch enterprise platform, mobile PWA/native apps, scale infrastructure

**Total Investment:** $213k - $320k for year 1 (development + infrastructure)

This handoff document provides all information needed to evaluate, extend, or rebuild the platform. For questions or clarifications, contact the project owner.

---

**Document Version:** 1.0
**Last Updated:** February 15, 2026
**Next Review:** Upon enterprise rebuild kickoff
