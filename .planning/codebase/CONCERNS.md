# Codebase Concerns

**Analysis Date:** 2026-02-09

## Tech Debt

**Incomplete Form Mutations:**
- Issue: Multiple form pages contain placeholder TODO comments for mutation implementations
- Files: `src/pages/forms/EquipmentRequest.jsx:496`, `src/pages/forms/TransferRequest.jsx:483`, `src/pages/forms/IncidentReport.jsx:395`, `src/pages/forms/GameReport.jsx:359`, `src/pages/forms/ScheduleRequest.jsx:519`, `src/pages/forms/FacilityBooking.jsx:594`
- Impact: These forms collect data but don't actually persist it to the database. Users will submit forms with no effect, creating confusion and data loss
- Fix approach: Implement actual mutation functions using `base44.entities` for each form, following the pattern in `src/pages/Feed.jsx:61-68` (createPostMutation)

**Large Monolithic Components:**
- Issue: Component files exceed 1000+ lines, mixing UI, logic, and state management
- Files: `src/components/forms/FormBuilder.jsx` (1192 lines), `src/pages/PlayerProfile.jsx` (1068 lines), `src/pages/AddNewProgram.jsx` (1009 lines), `src/pages/LiveGame.jsx` (963 lines)
- Impact: Difficult to test, understand, and modify. High cognitive load for maintenance. Risk of unintended side effects when editing
- Fix approach: Extract components into smaller single-responsibility modules. Move state management to custom hooks. Separate rendering logic from business logic

**Missing Test Coverage:**
- Issue: No test files exist in the codebase (no `__tests__`, `tests/`, `*.test.*`, or `*.spec.*` in src/)
- Files: Entire codebase lacks tests
- Impact: No regression detection, high risk when refactoring, no documentation through tests, cannot verify business logic
- Fix approach: Add Jest/Vitest configuration, write unit tests for utilities and hooks, integration tests for pages, E2E tests for critical flows

## Known Issues

**Missing Error Handling in Forms:**
- Issue: Forms in `src/components/forms/FormBuilder.jsx` render fields but lack validation and error boundary display
- Files: `src/components/forms/FormBuilder.jsx:41-100`, form field components assume valid data
- Impact: Invalid inputs silently fail or crash UI. Users get no feedback about what went wrong
- Workaround: Manually validate before submission, but forms don't expose validation to users
- Fix approach: Add Zod schema validation to FormBuilder, display field-level errors, add error boundary wrapping

**Race Condition in SeedOSBA Data Import:**
- Issue: `src/pages/SeedOSBA.jsx:593` fetches all 200 players and filters them to match team_id, but depends on synchronous filtering without confirming created IDs
- Files: `src/pages/SeedOSBA.jsx:585-612`
- Impact: If bulk creates don't return IDs or fail partially, team/game association will be wrong, causing orphaned records and incorrect team rosters
- Workaround: Re-run seed operation (destructive to existing data)
- Fix approach: Map created player IDs during bulk create, use generated IDs for filtering instead of team_id matching

**Unhandled Promise Rejections in Auth:**
- Issue: `src/lib/AuthContext.jsx:156` has bare catch block that silently ignores role lookup failures
- Files: `src/lib/AuthContext.jsx:145-158`
- Impact: Users defaulting to 'fan' role silently when database lookup fails. No logging or monitoring of auth failures. Cannot debug permission issues
- Fix approach: Log failed role lookups with context, implement retry logic, fall back to explicit 'guest' role instead of 'fan'

**Query Key Invalidation Inconsistency:**
- Issue: React Query cache invalidation uses string array keys `['feed-posts']` but some queries use parameterized keys like `['feed-posts', postId]`
- Files: `src/pages/Feed.jsx:31-64`, `src/pages/LiveGame.jsx:45-80`
- Impact: Partial cache invalidation may miss related queries, leading to stale data. Difficult to reason about cache hierarchy
- Fix approach: Use consistent query key factory pattern: `queryKeys.feedPosts()`, `queryKeys.feedPost(id)` in utility file

## Security Considerations

**Client-side Supabase Anonymous Key Exposure:**
- Risk: `src/api/base44Client.js:4` exposes Supabase anonymous key in client bundle. Although this is intentional for Supabase anonymous auth, the public schema access is unrestricted
- Files: `src/api/base44Client.js:1-14`
- Current mitigation: Supabase RLS (Row Level Security) should be configured in database, but no validation that RLS is actually enabled
- Recommendations:
  1. Document RLS requirements in README and setup instructions
  2. Add health check endpoint that verifies RLS is active on critical tables
  3. Implement row-level security policies for `user_roles`, `game_event`, `player_stat` tables
  4. Audit that anonymous users cannot read/write sensitive data (medical forms, facility booking details)

**File Upload Security:**
- Risk: `src/api/base44Client.js:211-220` accepts any file and uploads with timestamp-based naming, no validation of file type, size, or content
- Files: `src/api/base44Client.js:211-220`
- Current mitigation: Relies on Supabase storage bucket configuration (not visible in codebase)
- Recommendations:
  1. Add client-side file type validation (whitelist JPEG, PNG only for images)
  2. Limit file size to 10MB maximum before upload
  3. Scan uploaded files for malware if handling sensitive documents
  4. Implement virus scanning via Supabase Edge Function before storing

**Hardcoded Credentials in Seed Data:**
- Risk: `src/pages/SeedOSBA.jsx` contains real coach names and team data that could be personal information
- Files: `src/pages/SeedOSBA.jsx:8-407`
- Current mitigation: Data appears to be public team information, but some coach names may be identifiable
- Recommendations:
  1. Use generic placeholder names for demo data (Coach A, Coach B, Player 1, etc.)
  2. Move seed data to separate non-committed file
  3. Never include email addresses, phone numbers, or real birthdates in seed code

## Performance Bottlenecks

**Multiple Simultaneous React Query Requests:**
- Problem: `src/pages/Feed.jsx` and `src/pages/LiveGame.jsx` fire 4-6 independent queries on mount without request batching
- Files: `src/pages/Feed.jsx:30-58`, `src/pages/LiveGame.jsx:45-80`
- Cause: Each `useQuery` triggers independent network request
- Impact: 30-40 concurrent requests on complex pages, slow initial load, wasted bandwidth
- Improvement path:
  1. Batch related queries using single endpoint if backend supports
  2. Implement request deduplication middleware
  3. Use `useQueries` for multiple independent queries with shared fetcher
  4. Lazy-load secondary data (profiles, events) after primary data loads

**Inefficient List Filtering in Memory:**
- Problem: `src/pages/LiveGame.jsx:96-97` and `src/pages/PlayerProfile.jsx:94` filter arrays with `.find()` on every render
- Files: `src/pages/LiveGame.jsx:96-97`, `src/pages/PlayerProfile.jsx:94`
- Cause: No memoization or indexing of lookup tables
- Impact: O(n) lookups on lists of 100+ items, re-computed on every render
- Improvement path:
  1. Create Map/object indexes during data fetch
  2. Memoize lookup functions with `useMemo`
  3. Move data transformation to query selection layer

**Polling Interval Too Frequent:**
- Problem: `src/pages/Feed.jsx:33` refetches every 30 seconds, `src/pages/LiveGame.jsx:70` refetches every 5 seconds
- Files: `src/pages/Feed.jsx:30-34`, `src/pages/LiveGame.jsx:63-71`
- Impact: Unnecessary server load and battery drain on mobile. Feed content rarely changes that frequently
- Improvement path:
  1. Implement WebSocket subscription for real-time updates instead of polling
  2. Increase poll interval to 60-120 seconds for Feed
  3. Keep 5s interval only for LiveGame, but reduce payload size

## Fragile Areas

**SeedOSBA Data Import Process:**
- Files: `src/pages/SeedOSBA.jsx:410-660`
- Why fragile: Complex multi-step data creation with fallback logic depends on:
  1. Bulk operations succeeding or failing predictably (line 445-466)
  2. Filter operations on client-side data (line 520, 556, 617) assuming all teams exist
  3. Async operations completing in order without race conditions (line 572-612)
  4. Database maintaining referential integrity without explicit transaction
- Safe modification:
  1. Wrap entire operation in database transaction if backend supports
  2. Validate team IDs exist before creating dependent data
  3. Use explicit IDs from bulk create response instead of filtering
  4. Add rollback logic on any step failure
- Test coverage: None - this is critical path for test data

**Form State Management in Large Forms:**
- Files: `src/components/forms/FormBuilder.jsx:1-1192`, `src/components/forms/FormFields.jsx:1-703`
- Why fragile: FormBuilder maintains internal state without external validation, field dependencies not enforced
- Safe modification:
  1. Document form field dependency graph before modifying
  2. Test field visibility logic with all permission levels
  3. Validate that required fields appear based on visibility rules
  4. Check that conditional fields don't orphan data
- Test coverage: None - no unit tests for form logic

**Game Clock Synchronization:**
- Files: `src/components/basketball/GameClockContext.jsx`, `src/pages/LiveGame.jsx`
- Why fragile: Multiple components read/write game clock state, no synchronization mechanism
- Safe modification:
  1. Review all useGameClock() hook consumers
  2. Test that pause/resume works consistently across all subscribers
  3. Verify clock state persists correctly across page navigation
  4. Check for double-updates when multiple components trigger updates

## Scaling Limits

**Player List Query Performance:**
- Current capacity: ~200 players can be fetched and filtered in memory
- Limit: Hitting limit at 1000+ players (e.g., entire regional league). List render will stutter, memory usage will grow linearly
- Scaling path:
  1. Implement server-side pagination with cursor-based offset
  2. Add backend filtering by team/status/position
  3. Implement virtual list rendering for thousands of items
  4. Cache player list with selective invalidation

**Form Builder Rendering:**
- Current capacity: ~50 form fields render smoothly with Framer Motion
- Limit: 100+ field forms cause noticeable lag due to animation overhead
- Scaling path:
  1. Lazy render fields below viewport
  2. Reduce animation complexity for large forms
  3. Implement form submission batching (debounce)
  4. Consider accordion-based form sections instead of single scroll

**Concurrent Live Games:**
- Current capacity: Tracking 2-3 live games with stat updates
- Limit: 5+ concurrent games will cause query refetch storms (every 5s × 5 games = many requests)
- Scaling path:
  1. Implement WebSocket for multi-game real-time updates
  2. Batch stat updates into single request
  3. Use server-sent events instead of polling
  4. Partition game state into per-game subscriptions

## Dependencies at Risk

**moment.js Dependency:**
- Risk: Moment.js is in maintenance mode, bloats bundle (67KB), has known performance issues
- Files: `package.json:58`, used for date formatting (grep shows date-fns imported instead in most files)
- Impact: Dead weight in bundle, slow date operations
- Migration plan:
  1. Replace all `moment()` calls with `date-fns` (already imported in many files)
  2. Remove from package.json
  3. Reduces bundle size by ~60KB

**Deprecated @hello-pangea/dnd:**
- Risk: This is a fork of react-beautiful-dnd (unmaintained), no active development
- Files: `package.json:15`, not used in visible codebase (grep finds no imports)
- Impact: Drag-and-drop features may break in future React versions
- Migration plan:
  1. Check if actually used in dynamic/lazy-loaded components
  2. Replace with dnd-kit (modern, actively maintained)
  3. Remove if unused

**three.js Large Bundle:**
- Risk: 3D rendering library (640KB), currently appears unused
- Files: `package.json:73`, no imports found in codebase
- Impact: 600KB+ wasted bundle space if not used
- Migration plan:
  1. Search all imports for 'three'
  2. Remove if truly unused
  3. Implement as dynamic import if needed for future 3D court visualization

## Missing Critical Features

**No Offline Support:**
- Problem: Application requires constant internet connection, no service worker, no data persistence
- Blocks: Users cannot view cached game data if offline, cannot save form drafts
- Impact: Poor experience on unstable connections, data loss if connection drops during form submission

**No User Notifications:**
- Problem: Form submissions and mutations don't provide clear feedback
- Blocks: Users don't know if action succeeded or failed
- Current: Some pages use `toast` from sonner, others use nothing
- Impact: Users repeat actions thinking they failed

**No Error Recovery:**
- Problem: Failed mutations display no retry option
- Blocks: User must manually retry failed operations
- Impact: Abandoned submissions when network hiccups

## Test Coverage Gaps

**API Integration Layer:**
- What's not tested: `src/api/base44Client.js` - no tests for entity CRUD, filter, bulk operations
- Files: `src/api/base44Client.js:24-250`
- Risk: Regression in query building, error handling, or Supabase SDK changes
- Priority: High - this is the critical data layer

**Authentication Flow:**
- What's not tested: `src/lib/AuthContext.jsx` - no tests for role lookup, auth state changes, timeout handling
- Files: `src/lib/AuthContext.jsx:40-83`
- Risk: Users locked out if auth changes, role lookup silently fails
- Priority: High - this gates access to features

**Form Builder Dynamic Field Rendering:**
- What's not tested: `src/components/forms/FormBuilder.jsx` - no tests for field visibility, validation, dynamic options
- Files: `src/components/forms/FormBuilder.jsx:1-1192`
- Risk: Hidden fields breaking form logic, validation rules not applied
- Priority: High - 20+ forms depend on this

**React Query State Management:**
- What's not tested: Query keys, cache invalidation, refetch logic
- Files: Throughout pages using `useQuery`, `useMutation`, `useQueryClient`
- Risk: Stale data, cache misses, orphaned queries
- Priority: Medium - affects data consistency

**Game Clock and Timeout Logic:**
- What's not tested: Clock management across components, timeout state synchronization
- Files: `src/components/basketball/GameClockContext.jsx`, `src/components/basketball/TimeoutContext.jsx`
- Risk: Clock drift, inconsistent state between components, timer leaks
- Priority: Medium - affects game tracking accuracy

---

*Concerns audit: 2026-02-09*
