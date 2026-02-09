# External Integrations

**Analysis Date:** 2026-02-09

## APIs & External Services

**LLM/AI:**
- OpenAI (via invoke-llm Edge Function)
  - SDK/Client: Supabase Edge Function wrapper
  - Auth: Environment variable (server-side in `functions/`)
  - Usage: Messenger AI (`functions/messengerAI.ts`), natural language scheduling, player development AI
  - Invocation: `base44.integrations.Core.InvokeLLM({ prompt, response_json_schema })`

**Notion:**
- Notion API - Data export and team record creation
  - SDK/Client: Native fetch in `functions/addToNotion.ts`
  - Auth: `NOTION_ACCESS_TOKEN` environment variable
  - API Version: 2022-06-28
  - Endpoints:
    - POST https://api.notion.com/v1/search - Find databases
    - GET https://api.notion.com/v1/databases/{id} - Get schema
    - POST https://api.notion.com/v1/pages - Create records
  - Usage: Export game reports and team data to Notion
  - Implementation: `functions/addToNotion.ts`, `functions/testNotionAdd.ts`

## Data Storage

**Databases:**
- Supabase PostgreSQL (Database Version: 17)
  - Connection: `VITE_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`
  - Client: `@supabase/supabase-js` v2.49.1
  - Schema: Public schema via Supabase JS SDK
  - Authentication: Uses service role key in Edge Functions, anon key in frontend
  - Tables: sponsor, team_health_score, game, player, game_event, user_roles, messages, and many domain entities
  - Access: Via base44 proxy interface in `src/api/base44Client.js`

**File Storage:**
- Supabase Storage
  - Bucket: 'uploads' - for file uploads (images, documents)
  - Access: Public URLs generated via `getPublicUrl()`
  - Invocation: `base44.integrations.Core.UploadFile({ file })`
  - Usage: Team logos, player photos, documents

**Caching:**
- TanStack React Query - In-memory client-side caching
  - Configuration: `src/lib/query-client.js`
  - Default options: No refetch on window focus, retry once on failure

## Authentication & Identity

**Auth Provider:**
- Supabase Auth
  - Implementation: Custom AuthContext wrapper in `src/lib/AuthContext.jsx`
  - Supports: Email/password authentication
  - Methods:
    - `supabase.auth.getSession()` - Get current session
    - `supabase.auth.getUser(token)` - Get user from token
    - `supabase.auth.onAuthStateChange()` - Listen for auth changes
    - `supabase.auth.signOut()` - Logout
  - User Roles: Fetched from `user_roles` table (role, full_name, organization_id, team_id)
  - Default Role: 'fan' if lookup fails
  - Session Validation: 5-second timeout to prevent infinite loading

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Console logging only
- Base44 appLogs interface: no-op implementation in `src/api/base44Client.js`

## CI/CD & Deployment

**Hosting:**
- Supabase - Backend (PostgreSQL, Auth, Storage, Edge Functions)
- Frontend deployment platform: Not specified (static SPA)

**CI Pipeline:**
- None detected (no GitHub Actions, Vercel config, etc.)

**Edge Functions:**
- Executed by Supabase Deno runtime
- Functions deployed in `functions/` directory:
  - `exportGamePDF.ts` - Generate FIBA-style scoresheet PDFs with game statistics
  - `generateGameReport.ts` - Generate game report documents
  - `messengerAI.ts` - Analyze conversations and translate messages via OpenAI
  - `playerDevelopmentAI.ts` - AI-powered player development recommendations
  - `addToNotion.ts` - Export game data to Notion databases
  - `testNotionAdd.ts` - Test Notion integration

## Environment Configuration

**Required env vars:**
- `VITE_SUPABASE_URL` - Supabase project URL (public)
- `VITE_SUPABASE_ANON_KEY` - Public anonymous key (public)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (private, backend only)
- `NOTION_ACCESS_TOKEN` - Notion integration token (private, Edge Functions only)
- `OPENAI_API_KEY` - OpenAI API key (private, Edge Functions only) - referenced in `supabase/config.toml` for Studio

**Secrets location:**
- `.env` file in project root (never committed to git)
- Supabase Dashboard: Environment variables for production
- Local Supabase: `supabase/config.toml` for OpenAI_API_KEY (Studio only)

## Webhooks & Callbacks

**Incoming:**
- Supabase Realtime: Real-time database subscriptions (schema: public)
- No explicit webhook endpoints detected

**Outgoing:**
- None detected

## Data Flow Patterns

**Frontend to Backend:**
1. Frontend (React) → Supabase JS SDK (base44 wrapper)
2. Direct database queries: Entity CRUD via `base44.entities.EntityName.method()`
3. Edge Functions: Integration calls via `base44.functions.invoke()` or `base44.integrations.Core.method()`

**Edge Functions to External APIs:**
1. Notion API: Search databases, get schema, create pages
2. OpenAI: Via invoke-llm Edge Function (internal routing)

**Real-time Updates:**
- TanStack React Query: Polling-based updates with 3-5 second intervals
- Supabase Auth: Listener pattern for session changes
- No WebSocket subscriptions detected (polling-based approach)

## Integration Security

**Authentication:**
- Frontend: Anonymous key (limited permissions)
- Edge Functions: Service role key (full permissions)
- External APIs: Bearer tokens in Authorization header

**Request Validation:**
- Edge Functions validate authorization via `supabase.auth.getUser(token)`
- Supabase RLS (Row Level Security) enforced on database tables

---

*Integration audit: 2026-02-09*
