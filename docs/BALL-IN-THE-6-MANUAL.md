
# BALL IN THE 6 — USER MANUAL
## Toronto's Operating System for Sports
### Version 0.22 | ENUW Inc

---

## TABLE OF CONTENTS

1. Platform Overview
2. System Architecture
3. User Roles & Personas
4. User Flow Diagrams
5. Organization Flow (Creating Programs)
6. Parent Flow (Registration & Monitoring)
7. Payment Module
8. Communication System
9. Player & Coach Flows
10. Admin Operations

---

## 1. PLATFORM OVERVIEW

Ball in the 6 is a sports platform serving Toronto's athletic ecosystem.
It connects organizations, coaches, parents, players, fans, and businesses
through a unified interface covering 40+ sports.

```
┌─────────────────────────────────────────────────────────────────┐
│                      BALL IN THE 6                              │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  COURTS  │  │  GAMES   │  │ PLAYERS  │  │  INTEL   │       │
│  │ Find &   │  │ Live     │  │ Profiles │  │ AI6      │       │
│  │ Book     │  │ Scores   │  │ & Stats  │  │ Analysis │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ PROGRAMS │  │ PAYMENTS │  │ MESSAGES │  │ COMMUNITY│       │
│  │ Leagues  │  │ Fees &   │  │ Direct & │  │ Groups & │       │
│  │ & Camps  │  │ Invoices │  │ Group    │  │ Forums   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                              │
│                                                                 │
│   Web (Next.js 15)    iOS (Capacitor)    Android (Capacitor)   │
│         │                    │                    │             │
└─────────┼────────────────────┼────────────────────┼─────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API LAYER                                 │
│                                                                 │
│   /api/feed    /api/games    /api/courts    /api/intelligence  │
│   /api/programs  /api/payments  /api/messages  /api/health     │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
   ┌────────────┐   ┌──────────────┐   ┌──────────────┐
   │ PostgreSQL │   │ ENUW Auth    │   │ AI6 Engine   │
   │ (DigitalO) │   │ (auth.226)   │   │ Intelligence │
   └────────────┘   └──────────────┘   └──────────────┘
```

---

## 3. USER ROLES & PERSONAS

```
                    ┌───────────────────┐
                    │   BALL IN THE 6   │
                    │     PERSONAS      │
                    └─────────┬─────────┘
                              │
        ┌─────────┬─────────┬─┴───────┬─────────┬─────────┐
        ▼         ▼         ▼         ▼         ▼         ▼
   ┌─────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐
   │  FAN    ││ PLAYER ││ COACH  ││  TEAM  ││  ORG   ││  BIZ   │
   │ (blue)  ││(purple)││(emerald││(orange)││(yellow)││ (pink) │
   │         ││        ││        ││        ││        ││        │
   │ Watch   ││ Play   ││ Train  ││ Manage ││ Run    ││Sponsor │
   │ Cheer   ││ Compete││ Develop││ Roster ││ Leagues││ Sell   │
   │ Score   ││ Grow   ││ Scout  ││ Schedule││ Events ││ Promote│
   └─────────┘└────────┘└────────┘└────────┘└────────┘└────────┘
```

### Role Permissions Matrix

```
Feature              Fan  Player  Coach  Team  Org  Biz  Admin
─────────────────────────────────────────────────────────────────
View Feed             ✓     ✓      ✓      ✓     ✓    ✓     ✓
Post Content          ✓     ✓      ✓      ✓     ✓    ✓     ✓
View Games            ✓     ✓      ✓      ✓     ✓    ✓     ✓
Score Plays           ✓     ✓      ✓      ✓     ✓    ✓     ✓
View Courts           ✓     ✓      ✓      ✓     ✓    ✓     ✓
Shot Charts           ─     ✓      ✓      ✓     ✓    ─     ✓
Create Programs       ─     ─      ✓      ✓     ✓    ─     ✓
Manage Roster         ─     ─      ✓      ✓     ✓    ─     ✓
Process Payments      ─     ─      ─      ✓     ✓    ✓     ✓
Send Invoices         ─     ─      ─      ─     ✓    ✓     ✓
View Intelligence     ✓     ✓      ✓      ✓     ✓    ✓     ✓
Admin Dashboard       ─     ─      ─      ─     ─    ─     ✓
Content Moderation    ─     ─      ─      ─     ─    ─     ✓
User Management       ─     ─      ─      ─     ─    ─     ✓
```

---

## 4. COMPLETE USER FLOW — ENTRY TO ENGAGEMENT

### 4.1 New User Onboarding

```
┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────┐
│ /welcome │────▶│/register │────▶│ /onboarding  │────▶│  / (Feed)│
│          │     │          │     │              │     │          │
│ Landing  │     │ Email    │     │ Step 1: Sports    │ Personalized
│ Page     │     │ Password │     │ Step 2: Role │     │ Home Feed│
│ Hero     │     │ DOB      │     │ Step 3: Teams│     │          │
│ CTAs     │     │ (COPPA)  │     │ Step 4: Prefs│     │          │
└──────────┘     └──────────┘     └──────────────┘     └──────────┘
                                         │
                                         │ Age Bracket Detection
                                         ▼
                                  ┌──────────────┐
                                  │ COPPA Check   │
                                  │               │
                                  │ Adult (18+)   │──▶ Full Access
                                  │ Teen (13-17)  │──▶ Limited (no betting)
                                  │ Child (<13)   │──▶ Parental Required
                                  └──────────────┘
```

### 4.2 Main App Navigation

```
┌─────────────────────────────────────────────────────────┐
│  ┌─────┐  BALL IN THE 6            🔍  🔔              │
│  │ ⚡  │  [For You] [Plays] [Games] [Trending]         │
│  └─────┘                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   CONTENT AREA                          │
│                                                         │
│   Feed / Games / Courts / Intelligence / Profile        │
│   Messages / Communities / Leaderboard / Sports         │
│                                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   🏠        🏀        ✏️         📊        👤          │
│   Feed     Games    Post      Intel    Profile         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 5. ORGANIZATION FLOW — CREATING PROGRAMS

This is the core flow for basketball leagues, camps, and training programs.

### 5.1 Organization Registration

```
┌──────────────────────────────────────────────────────────────┐
│                  ORGANIZATION ONBOARDING                      │
└──────────────────────────────────────────────────────────────┘

Step 1: Register              Step 2: Verify            Step 3: Setup
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│ Create Org   │          │ Email Verify │          │ Org Profile  │
│ Account      │─────────▶│ + Admin      │─────────▶│ Setup        │
│              │          │ Approval     │          │              │
│ - Org Name   │          │              │          │ - Logo       │
│ - Type       │          │ Background   │          │ - Bio        │
│ - Contact    │          │ check for    │          │ - Location   │
│ - Admin Name │          │ youth orgs   │          │ - Sports     │
│ - Email      │          │              │          │ - Socials    │
└──────────────┘          └──────────────┘          └──────────────┘
```

### 5.2 Program Creation Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    PROGRAM CREATION WIZARD                      │
└────────────────────────────────────────────────────────────────┘

  ORG DASHBOARD
       │
       ▼
  ┌──────────────┐
  │ + New Program│
  └──────┬───────┘
         │
         ▼
  ┌──────────────────────────────────────────────────────────┐
  │ Step 1: PROGRAM TYPE                                     │
  │                                                          │
  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
  │   │ LEAGUE  │  │  CAMP   │  │TRAINING │  │ CLINIC  │  │
  │   │ Season  │  │ Multi-  │  │ Ongoing │  │ One-day │  │
  │   │ based   │  │ day     │  │ weekly  │  │ event   │  │
  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘  │
  └──────────────────────────┬───────────────────────────────┘
                             │
                             ▼
  ┌──────────────────────────────────────────────────────────┐
  │ Step 2: PROGRAM DETAILS                                  │
  │                                                          │
  │   Program Name: [Toronto Metro Youth Basketball League]  │
  │   Sport:        [Basketball ▼]                           │
  │   Age Group:    [U12 ▼]  [U14 ▼]  [U16 ▼]  [U18 ▼]    │
  │   Gender:       [Co-ed ▼]                                │
  │   Skill Level:  [Recreational ▼] [Competitive ▼]        │
  │   Season:       [Spring 2026 ▼]                          │
  │   Start Date:   [2026-04-01]                             │
  │   End Date:     [2026-06-30]                             │
  └──────────────────────────┬───────────────────────────────┘
                             │
                             ▼
  ┌──────────────────────────────────────────────────────────┐
  │ Step 3: SCHEDULE & VENUES                                │
  │                                                          │
  │   Days:     [x] Mon  [ ] Tue  [x] Wed  [ ] Thu  [x] Fri│
  │   Time:     [6:00 PM] to [8:00 PM]                      │
  │   Venue:    [Pan Am Sports Centre ▼]                     │
  │   Court:    [Court A ▼]                                  │
  │                                                          │
  │   Auto-generate schedule?  [Yes]                         │
  │                                                          │
  │   ┌─────────────────────────────────────────────┐       │
  │   │ Generated Schedule Preview                   │       │
  │   │ Apr 01 Mon - Practice    - Pan Am Court A   │       │
  │   │ Apr 03 Wed - Practice    - Pan Am Court A   │       │
  │   │ Apr 05 Fri - Game vs TBD - Pan Am Court A   │       │
  │   │ ...                                          │       │
  │   └─────────────────────────────────────────────┘       │
  └──────────────────────────┬───────────────────────────────┘
                             │
                             ▼
  ┌──────────────────────────────────────────────────────────┐
  │ Step 4: PRICING & PAYMENT                                │
  │                                                          │
  │   Registration Fee:    [$350.00]                         │
  │   Early Bird Discount: [$50 off before Mar 15]           │
  │   Sibling Discount:    [10%]                             │
  │   Payment Plans:       [x] Full  [x] 2-Part  [x] Monthly│
  │   Financial Aid:       [x] Available (application req)   │
  │                                                          │
  │   ┌────────────────────────────────────────────┐        │
  │   │ Payment Plan Breakdown                      │        │
  │   │                                             │        │
  │   │ Full:     $350 at registration              │        │
  │   │ 2-Part:   $175 at reg + $175 midseason      │        │
  │   │ Monthly:  $120/mo x 3 months                │        │
  │   └────────────────────────────────────────────┘        │
  └──────────────────────────┬───────────────────────────────┘
                             │
                             ▼
  ┌──────────────────────────────────────────────────────────┐
  │ Step 5: REQUIREMENTS & WAIVERS                           │
  │                                                          │
  │   [x] Medical clearance required                         │
  │   [x] Liability waiver (auto-generated)                  │
  │   [x] Code of conduct agreement                          │
  │   [x] Photo/video consent                                │
  │   [ ] Background check (coaches only)                    │
  │   [x] Emergency contact required                         │
  │                                                          │
  │   Custom Requirements:                                   │
  │   [+ Add requirement]                                    │
  └──────────────────────────┬───────────────────────────────┘
                             │
                             ▼
  ┌──────────────────────────────────────────────────────────┐
  │ Step 6: PUBLISH                                          │
  │                                                          │
  │   ┌────────────────────────────────────────────┐        │
  │   │ PROGRAM PREVIEW                             │        │
  │   │                                             │        │
  │   │ Toronto Metro Youth Basketball League       │        │
  │   │ Ages 10-14 | Co-ed | Competitive            │        │
  │   │ Spring 2026 | Mon/Wed/Fri 6-8PM            │        │
  │   │ Pan Am Sports Centre                        │        │
  │   │ $350 (early bird $300)                      │        │
  │   │                                             │        │
  │   │ [Edit]  [Save Draft]  [🟢 PUBLISH]         │        │
  │   └────────────────────────────────────────────┘        │
  └──────────────────────────────────────────────────────────┘
```

### 5.3 Organization Dashboard

```
┌────────────────────────────────────────────────────────────────┐
│                    ORG DASHBOARD                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Programs │  │ Players  │  │ Revenue  │  │ Messages │      │
│  │    12    │  │   186    │  │ $28,400  │  │    7     │      │
│  │ Active   │  │ Enrolled │  │ This Qtr │  │ Unread   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                │
│  ACTIVE PROGRAMS                                               │
│  ─────────────────────────────────────────────────────────     │
│  │ Spring Basketball U12  │ 24/30 spots │ $8,400  │ Active│  │
│  │ Spring Basketball U14  │ 28/30 spots │ $9,800  │ Active│  │
│  │ Summer Camp            │  8/40 spots │ $2,400  │ Open  │  │
│  │ Elite Training         │ 12/12 spots │ $7,200  │ Full  │  │
│  ─────────────────────────────────────────────────────────     │
│                                                                │
│  RECENT REGISTRATIONS                                          │
│  ─────────────────────────────────────────────────────────     │
│  │ Tyrese M.  │ U14 League  │ Paid ($350) │ 2h ago    │     │
│  │ Caleb S.   │ U14 League  │ Plan (1/3)  │ 5h ago    │     │
│  │ Ava W.     │ Summer Camp │ Pending     │ Yesterday │     │
│  ─────────────────────────────────────────────────────────     │
│                                                                │
│  [+ New Program]  [View All Players]  [Financial Reports]      │
└────────────────────────────────────────────────────────────────┘
```

---

## 6. PARENT FLOW — REGISTRATION & MONITORING

### 6.1 Parent Discovers & Registers Child

```
┌────────────────────────────────────────────────────────────────┐
│                     PARENT JOURNEY                              │
└────────────────────────────────────────────────────────────────┘

  DISCOVER                  EVALUATE                 REGISTER
  ─────────                 ────────                 ────────

  ┌──────────┐          ┌──────────────┐         ┌──────────────┐
  │ Browse   │          │ Program      │         │ Register     │
  │ Programs │─────────▶│ Details      │────────▶│ Child        │
  │          │          │              │         │              │
  │ Search   │          │ - Schedule   │         │ - Child Name │
  │ Filter by│          │ - Location   │         │ - DOB        │
  │ - Sport  │          │ - Price      │         │ - Medical    │
  │ - Age    │          │ - Coaches    │         │ - Emergency  │
  │ - Area   │          │ - Reviews    │         │ - Waivers    │
  │ - Price  │          │ - Spots left │         │ - Payment    │
  └──────────┘          └──────────────┘         └──────┬───────┘
                                                        │
         ┌──────────────────────────────────────────────┘
         │
         ▼
  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
  │ Payment      │       │ Confirmation │       │ Parent       │
  │              │──────▶│              │──────▶│ Dashboard    │
  │ - Full pay   │       │ - Receipt    │       │              │
  │ - Plan       │       │ - Schedule   │       │ - Upcoming   │
  │ - Financial  │       │ - What to    │       │ - Messages   │
  │   aid app    │       │   bring      │       │ - Payments   │
  └──────────────┘       └──────────────┘       └──────────────┘
```

### 6.2 Parent Dashboard

```
┌────────────────────────────────────────────────────────────────┐
│                     PARENT DASHBOARD                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  MY CHILDREN                                                   │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ 👦 Tyrese M. (Age 13)                                │     │
│  │    Spring Basketball U14 — B.M.T. Titans              │     │
│  │    Next: Wed Apr 3 @ 6PM — Pan Am Court A             │     │
│  │    Payment: $175/$350 paid (2nd due Apr 15)           │     │
│  │    [View Schedule] [Message Coach] [Pay Balance]      │     │
│  └──────────────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ 👧 Ava M. (Age 10)                                   │     │
│  │    Summer Camp 2026 — Registered                      │     │
│  │    Starts: Jul 1 @ Downsview Park                     │     │
│  │    Payment: Pending ($250)                            │     │
│  │    [View Details] [Complete Payment]                   │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                │
│  UPCOMING EVENTS                                               │
│  ─────────────────────────────────────────────────             │
│  Wed Apr 3   6:00 PM  Practice — Tyrese — Pan Am              │
│  Fri Apr 5   6:00 PM  Game vs Scarborough — Tyrese            │
│  Sat Apr 6  10:00 AM  Skills Clinic — Ava (optional)          │
│                                                                │
│  MESSAGES                                                      │
│  ─────────────────────────────────────────────────             │
│  Coach Mitchell     "Practice moved to Court B..."  2h ago    │
│  League Admin       "Spring schedule updated"       1d ago    │
│  Parent Group Chat  "Carpool for Friday game?"      1d ago    │
│                                                                │
│  PAYMENT SUMMARY                                               │
│  ─────────────────────────────────────────────────             │
│  Total Owed:     $425.00                                       │
│  Paid:           $175.00                                       │
│  Next Due:       $175.00 on Apr 15                             │
│  [View All Invoices]  [Make Payment]                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 6.3 What Parents See — Game Day

```
┌────────────────────────────────────────────────────────────────┐
│                   PARENT — GAME DAY VIEW                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🔴 LIVE  B.M.T. Titans vs Scarborough Elite                  │
│                                                                │
│  ┌────────────────────────────────────────────┐               │
│  │         TITANS  47  -  42  ELITE           │               │
│  │              Q3  |  4:23                    │               │
│  └────────────────────────────────────────────┘               │
│                                                                │
│  YOUR CHILD'S STATS (Tyrese M. #7)                            │
│  ─────────────────────────────────────                         │
│  │ PTS: 12  │ REB: 4  │ AST: 3  │ MIN: 18  │                │
│                                                                │
│  PLAY-BY-PLAY                                                  │
│  ─────────────────────────────────────                         │
│  Q3 4:23  Tyrese M. — 3-pointer! Titans lead 47-42           │
│  Q3 5:01  Timeout — Scarborough Elite                         │
│  Q3 5:45  Tyrese M. — Assist to Caleb S. for layup           │
│                                                                │
│  COACH NOTES                                                   │
│  ─────────────────────────────────────                         │
│  "Great energy from Tyrese tonight. Working on               │
│   ball handling under pressure — see improvement."            │
│                                                                │
│  [Share] [Photos] [Message Coach]                              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 7. PAYMENT MODULE

### 7.1 Payment Flow

```
┌────────────────────────────────────────────────────────────────┐
│                      PAYMENT SYSTEM                             │
└────────────────────────────────────────────────────────────────┘

  ORGANIZATION                          PARENT
  ────────────                          ──────

  Create Program ──▶ Set Price ──▶ Publish
                          │
                          ▼
                    ┌────────────┐
                    │  INVOICE   │
                    │  Generated │
                    │            │
                    │ #INV-2026  │
                    │ $350.00    │
                    └─────┬──────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
        ┌──────────┐┌──────────┐┌──────────┐
        │ FULL PAY ││ 2-PART   ││ MONTHLY  │
        │ $350     ││ $175x2   ││ $120x3   │
        └────┬─────┘└────┬─────┘└────┬─────┘
             │           │           │
             ▼           ▼           ▼
        ┌──────────────────────────────────┐
        │         PAYMENT GATEWAY          │
        │                                  │
        │  ┌────┐  ┌────┐  ┌──────────┐  │
        │  │Visa│  │ MC │  │Interac e │  │
        │  └────┘  └────┘  │Transfer  │  │
        │                   └──────────┘  │
        └────────────────┬─────────────────┘
                         │
                         ▼
        ┌──────────────────────────────────┐
        │           RECEIPT                │
        │                                  │
        │  ✓ Payment Confirmed             │
        │  Amount: $350.00                 │
        │  Program: Spring Basketball U14  │
        │  Player: Tyrese M.               │
        │  Receipt: #REC-20260401-001      │
        │                                  │
        │  [Download PDF] [Email Receipt]  │
        └──────────────────────────────────┘
```

### 7.2 Payment Dashboard (Organization)

```
  FINANCIAL OVERVIEW
  ──────────────────────────────────────────────────────

  Revenue This Quarter          Outstanding Balance
  ┌──────────────────┐         ┌──────────────────┐
  │    $28,400.00    │         │    $4,200.00     │
  │  ▲ 12% vs last  │         │  14 invoices     │
  └──────────────────┘         └──────────────────┘

  Payment Breakdown
  ──────────────────────────────────────────────────────
  Full Payments:        $18,200  (52 players)
  Payment Plans:         $8,400  (24 players, 18 current)
  Financial Aid:         $1,800  (6 players)
  Overdue:              $4,200  (14 players)
  ──────────────────────────────────────────────────────

  RECENT TRANSACTIONS
  ──────────────────────────────────────────────────────
  Mar 20  Tyrese M.     $175.00  Plan 1/2   ✓ Paid
  Mar 19  Caleb S.      $350.00  Full       ✓ Paid
  Mar 18  Ava W.        $250.00  Camp       ⏳ Pending
  Mar 15  Devon C.      $175.00  Plan 2/2   ⚠ Overdue
  ──────────────────────────────────────────────────────

  [Send Reminders]  [Export CSV]  [Generate Report]
```

---

## 8. COMMUNICATION SYSTEM

### 8.1 Message Flow Between Roles

```
┌────────────────────────────────────────────────────────────────┐
│                   COMMUNICATION MAP                             │
└────────────────────────────────────────────────────────────────┘

                    ┌──────────┐
                    │   ORG    │
                    │  Admin   │
                    └────┬─────┘
                         │
            Announcements│Program Updates
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐    ┌──────────┐
    │ COACHES │◀──▶│ PARENTS  │◀──▶│ PARENTS  │
    │         │    │ (Group)  │    │ (Direct) │
    └────┬────┘    └──────────┘    └──────────┘
         │
         │ Practice Notes
         │ Player Feedback
         ▼
    ┌──────────┐
    │ PARENT   │
    │ (of      │
    │  player) │
    └──────────┘

  MESSAGE TYPES:
  ──────────────────────────────────────────
  📢 Announcement  — Org ──▶ All Members
  💬 Direct        — Any ◀──▶ Any
  👥 Group Chat    — Team/Program Members
  📋 Coach Notes   — Coach ──▶ Parent
  🔔 System Alert  — Schedule change, payment due
  ⚠️  Emergency     — Weather cancel, venue change
```

### 8.2 Parent-Coach Communication

```
┌────────────────────────────────────────────────────────────────┐
│  COACH MITCHELL ──▶ PARENT OF TYRESE M.                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────────────┐                  │
│  │ Coach Mitchell                   3:45 PM│                  │
│  │ Hi! Just wanted to share some feedback  │                  │
│  │ from tonight's practice. Tyrese is      │                  │
│  │ showing great improvement on his left   │                  │
│  │ hand dribbling. We're going to work     │                  │
│  │ on pick-and-roll reads next week.       │                  │
│  └─────────────────────────────────────────┘                  │
│                                                                │
│           ┌─────────────────────────────────────────┐         │
│           │                           Parent  3:52 PM│         │
│           │ Thanks Coach! He's been practicing at   │         │
│           │ home too. Quick question — is the Friday│         │
│           │ game still at Pan Am or did the venue   │         │
│           │ change?                                  │         │
│           └─────────────────────────────────────────┘         │
│                                                                │
│  ┌─────────────────────────────────────────┐                  │
│  │ Coach Mitchell                   3:55 PM│                  │
│  │ Still Pan Am, Court A. Game starts at   │                  │
│  │ 6PM sharp. Players should arrive by     │                  │
│  │ 5:30 for warmups. 👍                     │                  │
│  └─────────────────────────────────────────┘                  │
│                                                                │
│  ┌──────────────────────────────────────────────┐             │
│  │ Type a message...               📎  📷  ➤  │             │
│  └──────────────────────────────────────────────┘             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 8.3 Parent Group Chat

```
┌────────────────────────────────────────────────────────────────┐
│  👥 U14 Spring Basketball — Parent Group                       │
│     18 members                                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────────────┐                  │
│  │ Sarah K.                        9:15 AM │                  │
│  │ Anyone want to organize a carpool       │                  │
│  │ for Friday's game at Pan Am? We're      │                  │
│  │ coming from Scarborough and can take    │                  │
│  │ 2 extra kids.                            │                  │
│  └─────────────────────────────────────────┘                  │
│                                                                │
│  ┌─────────────────────────────────────────┐                  │
│  │ Marcus T.                       9:22 AM │                  │
│  │ We're in! Can Marcus Jr. ride with      │                  │
│  │ you? We'll handle the pickup after.     │                  │
│  └─────────────────────────────────────────┘                  │
│                                                                │
│  ┌─────────────────────────────────────────┐                  │
│  │ Parent (You)                    9:30 AM │                  │
│  │ Count us in too! Tyrese can go with     │                  │
│  │ Sarah. I'll bring snacks for the team   │                  │
│  │ — any allergies I should know about?    │                  │
│  └─────────────────────────────────────────┘                  │
│                                                                │
│  📌 PINNED: Game schedule updated — check the app              │
│                                                                │
│  ┌──────────────────────────────────────────────┐             │
│  │ Type a message...               📎  📷  ➤  │             │
│  └──────────────────────────────────────────────┘             │
└────────────────────────────────────────────────────────────────┘
```

---

## 9. PLAYER & COACH FLOWS

### 9.1 Player Experience

```
  PLAYER HOME
  ────────────────────────────────────────────

  ┌──────────────────────────────────────────┐
  │ 🏀 Caleb Smith — #23 PG                 │
  │ B.M.T. Titans | Spring U14              │
  │                                          │
  │ Season Avg: 24.6 PPG | 5.2 APG | 3.8 RPG│
  │ 6-Impact Score: 87.4                     │
  └──────────────────────────────────────────┘

  UPCOMING
  ──────────
  Fri Apr 5   6:00 PM  Game vs Scarborough Elite
  Mon Apr 7   6:00 PM  Practice — Pan Am Court A
  Wed Apr 9   6:00 PM  Practice — Pan Am Court A

  MY STATS                    SHOT CHART
  ──────────                  ──────────
  PPG: 24.6                   ┌─────────────┐
  APG:  5.2                   │   42%  │38% │
  RPG:  3.8                   │  ┌───┐ │    │
  FG%: 48.2                   │  │67%│ │    │
  3PT: 38.5                   │  └───┘ │    │
  FT%: 82.1                   │  52%   │44% │
                               └─────────────┘

  HIGHLIGHTS
  ──────────
  🏀 Game-winner vs North York — Mar 15
  🏀 Triple-double vs Ajax — Mar 8
  🏀 30-point game vs Markham — Mar 1
```

### 9.2 Coach Experience

```
  COACH DASHBOARD
  ────────────────────────────────────────────

  ┌──────────────────────────────────────────┐
  │ Coach Dwayne Mitchell                     │
  │ NCCP Certified | 15 Years Experience      │
  │ Record: 312-94 (.768)                     │
  └──────────────────────────────────────────┘

  MY TEAMS                    UPCOMING
  ──────────                  ──────────
  U14 Titans (12-2)          Fri — Game vs Scarborough
  U16 Titans (10-4)          Mon — U14 Practice
  Elite Training (8 players) Tue — U16 Practice

  ROSTER — U14 TITANS
  ────────────────────────────────────────────
  #  Name           Pos  PPG   APG   +/-
  23 Caleb Smith    PG   24.6  5.2   +12
   7 Tyrese M.      SG   18.3  3.1   +8
  11 Marcus T.      SF   15.7  2.4   +6
  34 Devon C.       PF   12.1  1.8   +3
  50 Andre W.       C    10.5  0.9   +5

  TOOLS
  ──────────
  [📋 Practice Plans]  [📊 Game Film]
  [💬 Message Parents]  [📝 Player Notes]
  [📅 Schedule]        [💰 Attendance]
```

---

## 10. ADMIN OPERATIONS

```
  ADMIN DASHBOARD
  ────────────────────────────────────────────

  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Users    │  │ Content  │  │ Revenue  │  │ Reports  │
  │  1,247   │  │   342    │  │ $84,200  │  │    12    │
  │ Total    │  │ Posts/wk │  │ Platform │  │ Pending  │
  └──────────┘  └──────────┘  └──────────┘  └──────────┘

  MODERATION QUEUE
  ────────────────────────────────────────────
  3 posts flagged for review
  1 user reported
  2 organizations pending verification

  SYSTEM HEALTH
  ────────────────────────────────────────────
  API:        ✓ Operational
  Auth:       ✓ Operational
  Payments:   ✓ Operational
  Database:   ✓ 23ms avg response
```

---

## APPENDIX A: COMPLETE USER FLOW MAP

```
                           ┌─────────┐
                           │ WELCOME │
                           └────┬────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
              ┌──────────┐           ┌──────────┐
              │  LOGIN   │           │ REGISTER │
              └────┬─────┘           └────┬─────┘
                   │                      │
                   │                      ▼
                   │               ┌────────────┐
                   │               │ ONBOARDING │
                   │               └──────┬─────┘
                   │                      │
                   └──────────┬───────────┘
                              ▼
                        ┌───────────┐
                        │   HOME    │
                        │   FEED    │
                        └─────┬─────┘
                              │
          ┌───────┬───────┬───┴───┬───────┬───────┐
          ▼       ▼       ▼       ▼       ▼       ▼
       ┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐
       │GAMES ││COURTS││SPORTS││INTEL ││SOCIAL││ADMIN │
       └──┬───┘└──┬───┘└──┬───┘└──┬───┘└──┬───┘└──┬───┘
          │       │       │       │       │       │
          ▼       ▼       ▼       ▼       ▼       ▼
       Detail  Shot    Standing Overview Messages Users
       Score   Charts  Leaders  Compare  Groups  Content
       P-by-P  Book    Fixture  Athletes Community Reports
       Sched   Nearby          Matrix   Activity Settings
```

---

## APPENDIX B: TECHNOLOGY STACK

```
  FRONTEND               BACKEND              SERVICES
  ────────               ───────              ────────
  Next.js 15             API Routes           ENUW Auth
  React 19               PostgreSQL           AI6 Engine
  TypeScript 5           Prisma ORM           Stripe/Interac
  Tailwind CSS 4         Redis Cache          DigitalOcean
  Motion.js              WebSocket            Vercel CDN
  Zustand                                     SendGrid
  anime.js
```

---

*Ball in the 6 — ENUW Inc, Toronto, Canada*
*Version 0.22 | March 2026*
