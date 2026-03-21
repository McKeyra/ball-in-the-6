# Ball in the 6 — Full App Audit Checklist (198 pages)

## Status Key
- [ ] Not checked
- [x] Verified working
- [!] Fixed during audit

---

## AUTH (2 pages)
- [ ] /login — Login form, redirects to / on success
- [ ] /register — Registration form, redirects to / on success

## PUBLIC (7 pages)
- [ ] /welcome — Landing page
- [ ] /about — About page
- [ ] /onboarding — Onboarding flow
- [ ] /get-started — Role selection (player/coach/parent/org)
- [ ] /get-started/player — Player onboarding
- [ ] /get-started/coach — Coach onboarding
- [ ] /get-started/parent — Parent onboarding
- [ ] /get-started/organization — Organization onboarding

## CORE FEED & NAVIGATION (7 pages)
- [ ] / — Home feed (SocialFeed + TopHeader)
- [ ] /hub — Module hub with quick access cards
- [ ] /compose — Create new post
- [ ] /search — Search
- [ ] /notifications — Notification center
- [ ] /activity — Activity feed
- [ ] /profile — User profile

## GAMES (8 pages)
- [ ] /games — Games listing (upcoming, live, final)
- [ ] /games/setup — Game setup with team selection
- [ ] /games/live/[id] — Live game scoring interface
- [ ] /games/[id] — Game detail
- [ ] /games/[id]/detailed — Detailed game view
- [ ] /games/court-view — Interactive court view
- [ ] /games/stats — Game statistics
- [ ] /games/schedule — Game schedule/calendar

## COURTS (1 page)
- [ ] /courts — Court finder with map

## TEAMS (12 pages)
- [ ] /teams — Teams index
- [ ] /teams/list — Team listing
- [ ] /teams/create — Create new team
- [ ] /teams/register — Team registration
- [ ] /teams/manager — Team manager dashboard
- [ ] /teams/[id] — Team detail
- [ ] /teams/[id]/overview — Team overview
- [ ] /teams/[id]/dashboard — Team dashboard
- [ ] /teams/[id]/management — Team management
- [ ] /teams/[id]/performance — Team performance analytics
- [ ] /teams/[id]/health — Team health dashboard
- [ ] /teams/[id]/edit — Edit team

## PLAYERS (6 pages)
- [ ] /players — Players index
- [ ] /players/[id] — Player detail
- [ ] /players/dashboard — Player dashboard
- [ ] /players/development — Player development tracking
- [ ] /players/management — Player management
- [ ] /players/profiles — Player profiles
- [ ] /players/sheet — Player stat sheet

## SPORTS & STANDINGS (3 pages)
- [ ] /sports — Sports index
- [ ] /sports/[sport] — Sport detail
- [ ] /sports/[sport]/standings — Standings table

## LEAGUES (2 pages)
- [ ] /leagues — League management
- [ ] /leagues/commissioner — Commissioner dashboard

## INTELLIGENCE (1 page)
- [ ] /intelligence — AI sports intelligence

## ATHLETE MODULE (22 pages)
- [ ] /athlete — Athlete dashboard index
- [ ] /athlete/positions — Position analysis
- [ ] /athlete/scouting-radar — Scouting radar
- [ ] /athlete/goat-study — GOAT comparison study
- [ ] /athlete/persona — Persona classifier
- [ ] /athlete/drills — Drill library
- [ ] /athlete/training-plan — Training plan
- [ ] /athlete/benchmarks — Performance benchmarks
- [ ] /athlete/spatial-stats — Spatial statistics
- [ ] /athlete/game-builder — Game builder tool
- [ ] /athlete/film-study — Film study
- [ ] /athlete/mental-game — Mental game training
- [ ] /athlete/nutrition — Nutrition blueprint
- [ ] /athlete/support-network — Support network
- [ ] /athlete/pathway — Pathway navigator
- [ ] /athlete/game-log — Game log
- [ ] /athlete/daily-log — Daily training log
- [ ] /athlete/assessment — Self assessment
- [ ] /athlete/recruiting — Recruiting engine
- [ ] /athlete/find-team — Find a team
- [ ] /athlete/export-profile — Export athlete profile
- [ ] /athlete/stages — Stage selector

## COACH (1 page)
- [ ] /coach — Coach dashboard

## FAN (3 pages)
- [ ] /fan/player-stats — Player statistics
- [ ] /fan/daily-rank — Daily rankings
- [ ] /fan/live-scores — Live scores

## VANCE (5 pages)
- [ ] /vance — Vance dashboard (betting predictions)
- [ ] /vance/picks — Vance picks
- [ ] /vance/reports — Vance reports
- [ ] /vance/players — Player analysis
- [ ] /vance/line-movement — Line movement tracker

## COMMUNITY (5 pages)
- [ ] /communities — Communities index
- [ ] /community/feed — Community feed
- [ ] /community/forum — Forum
- [ ] /community/fan-zone — Fan zone
- [ ] /community/fan-pages — Fan pages
- [ ] /community/content — Content hub

## MESSAGING (2 pages)
- [ ] /messages — Messages inbox
- [ ] /messages/[id] — Conversation thread

## STORE & MISC (5 pages)
- [ ] /store — Merchandise store
- [ ] /awards — Awards & recognition
- [ ] /leaderboard — Leaderboard
- [ ] /sponsor-pipeline — Sponsor management
- [ ] /payments — Payments
- [ ] /settings — App settings
- [ ] /profiles — Profile directory

## PROGRAMS (3 pages)
- [ ] /programs — Programs listing
- [ ] /programs/create — Create program
- [ ] /programs/[id] — Program detail

## ORG (3 pages)
- [ ] /org — Organization index
- [ ] /org-dashboard — Org dashboard
- [ ] /org/president — Org president dashboard

## PARENT (4 pages)
- [ ] /parent — Parent index
- [ ] /parent/gameday — Game day view
- [ ] /parent/child/[id] — Child detail

## PARENT HUB (8 pages)
- [ ] /parent-hub — Parent hub index
- [ ] /parent-hub/dashboard — Parent dashboard
- [ ] /parent-hub/announcements — Announcements
- [ ] /parent-hub/documents — Documents
- [ ] /parent-hub/my-children — My children
- [ ] /parent-hub/calendar — Family calendar
- [ ] /parent-hub/messages — Messages
- [ ] /parent-hub/payments — Payments

## COMMAND CENTER (14 pages)
- [ ] /command-center — Command center index
- [ ] /command-center/dashboard — Org dashboard
- [ ] /command-center/campaigns — Campaigns
- [ ] /command-center/contacts — Contacts
- [ ] /command-center/facilities — Facilities
- [ ] /command-center/messages — Messages
- [ ] /command-center/payments — Payments
- [ ] /command-center/programs — Programs
- [ ] /command-center/registrations — Registrations
- [ ] /command-center/reports — Reports
- [ ] /command-center/schedule — Schedule
- [ ] /command-center/settings — Settings
- [ ] /command-center/teams — Teams
- [ ] /command-center/volunteers — Volunteers

## FORMS (30 pages)
- [ ] /forms — Forms index
- [ ] /forms/player-registration
- [ ] /forms/coach-registration
- [ ] /forms/referee-registration
- [ ] /forms/volunteer-registration
- [ ] /forms/medical-form
- [ ] /forms/waiver-consent
- [ ] /forms/league-application
- [ ] /forms/sponsor-application
- [ ] /forms/facility-partner
- [ ] /forms/vendor-application
- [ ] /forms/organization-setup
- [ ] /forms/league-settings
- [ ] /forms/team-settings
- [ ] /forms/schedule-request
- [ ] /forms/facility-booking
- [ ] /forms/equipment-request
- [ ] /forms/coach-evaluation
- [ ] /forms/event-feedback
- [ ] /forms/nps-survey
- [ ] /forms/season-survey
- [ ] /forms/game-report
- [ ] /forms/incident-report
- [ ] /forms/background-check
- [ ] /forms/code-of-conduct
- [ ] /forms/transfer-request
- [ ] /forms/tryout-registration
- [ ] /forms/program-signup
- [ ] /forms/award-nomination
- [ ] /forms/hall-of-fame
- [ ] /forms/parent-profile-setup

## RECRUITING (15 pages)
- [ ] /recruiting/athlete-dashboard
- [ ] /recruiting/athlete-analytics
- [ ] /recruiting/athlete-events
- [ ] /recruiting/athlete-messages
- [ ] /recruiting/athlete-signup
- [ ] /recruiting/athlete-stats
- [ ] /recruiting/athlete-videos
- [ ] /recruiting/profile-builder
- [ ] /recruiting/recruiter/dashboard
- [ ] /recruiting/recruiter/athlete-search
- [ ] /recruiting/recruiter/athlete-profile-view/[id]
- [ ] /recruiting/recruiter/events
- [ ] /recruiting/recruiter/messages
- [ ] /recruiting/recruiter/signup
- [ ] /recruiting/recruiter/watchlist

## TRAINING MARKETPLACE (11 pages)
- [ ] /training-marketplace/find-trainers
- [ ] /training-marketplace/book-session
- [ ] /training-marketplace/module-player
- [ ] /training-marketplace/xp-dashboard
- [ ] /training-marketplace/training-overview
- [ ] /training-marketplace/trainer/dashboard
- [ ] /training-marketplace/trainer/athletes
- [ ] /training-marketplace/trainer/earnings
- [ ] /training-marketplace/trainer/programs
- [ ] /training-marketplace/trainer/schedule
- [ ] /training-marketplace/trainer/signup

## GM UNIVERSE (10 pages)
- [ ] /gm-universe — Team selection (entry point)
- [ ] /gm-universe/dashboard — GM dashboard
- [ ] /gm-universe/draft — Draft
- [ ] /gm-universe/free-agency — Free agency
- [ ] /gm-universe/game-sim — Game simulation
- [ ] /gm-universe/analytics — GM analytics
- [ ] /gm-universe/roster — Roster management
- [ ] /gm-universe/season — Season management
- [ ] /gm-universe/team-selection — Team selection
- [ ] /gm-universe/trade — Trade center

## VET THEM FIRST (14 pages)
- [ ] /vet-them-first — Index
- [ ] /vet-them-first/admin — Admin panel
- [ ] /vet-them-first/family/dashboard
- [ ] /vet-them-first/family/check-ins
- [ ] /vet-them-first/family/devices
- [ ] /vet-them-first/family/scam-reports
- [ ] /vet-them-first/family/schedule-visits
- [ ] /vet-them-first/family/subscription
- [ ] /vet-them-first/family/vet-contractors
- [ ] /vet-them-first/senior/dashboard
- [ ] /vet-them-first/senior/family-contacts
- [ ] /vet-them-first/senior/get-help
- [ ] /vet-them-first/senior/my-devices
- [ ] /vet-them-first/senior/report-scam

## ADMIN (5 pages)
- [ ] /admin — Admin dashboard
- [ ] /admin/users — User management
- [ ] /admin/games — Game management
- [ ] /admin/content — Content moderation
- [ ] /admin/reports — Reports
- [ ] /admin/settings — Admin settings

---

## CROSS-CUTTING CHECKS
- [ ] Navigation: BottomNav links work (Feed, Games, Post, Courts, More)
- [ ] Navigation: More menu lists all modules and links work
- [ ] Navigation: Hub page cards link to correct routes
- [ ] Navigation: Back buttons/breadcrumbs work on sub-pages
- [ ] Auth: Login → redirects to feed
- [ ] Auth: Unauthenticated → redirects to login
- [ ] Auth: Token passed to API routes
- [ ] Data: Teams API returns real data from PostgreSQL
- [ ] Data: Players API returns real data
- [ ] Data: Games API returns real data
- [ ] Data: Standings API returns real data
- [ ] Data: Courts API returns real data
- [ ] Data: Feed renders posts
- [ ] Imports: No broken imports across all pages
- [ ] Types: No TypeScript errors blocking build
- [ ] Build: Production build succeeds
- [ ] Deploy: Docker image builds
- [ ] Deploy: Container runs on bit6.nuit.wtf
