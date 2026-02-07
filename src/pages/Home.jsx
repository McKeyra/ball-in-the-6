import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  PlayCircle, Tv, Settings, Eye, ClipboardList, BarChart3, Activity,
  PlusCircle, Edit, Users, List, LayoutDashboard, TrendingUp,
  UserPlus, User, FileText, Trophy, BookOpen, Calendar,
  Zap, MessageSquare, Heart, Globe, Award, Store,
  ShieldCheck, Trash2, ChevronRight,
  Search, Grid3X3, Clock, Smartphone, Palette, Bell,
  Handshake, HeartPulse, Kanban, ClipboardCheck,
  UserCheck, Megaphone, HeartHandshake, Target, Building2, Truck,
  FileSpreadsheet, AlertTriangle, ArrowLeftRight, CalendarClock, Package, MapPin,
  ClipboardEdit, Star, MessageCircle, ThumbsUp, UserCog, Sliders, Building,
  ScrollText, Stethoscope, Scale, Scan, Medal, Crown, FilePenLine
} from "lucide-react";

/* ───────────────────── helpers ───────────────────── */

function formatTimeAgo(dateStr) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return "";
  }
}

/* ───────────────────── data ───────────────────── */

const TABS = [
  { id: "apps", label: "Apps", icon: Grid3X3 },
  { id: "forms", label: "Forms", icon: FilePenLine },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "whitelabel", label: "White Label", icon: Smartphone },
];

// All forms organized by category
const FORM_CATEGORIES = [
  {
    id: "registration",
    title: "Registration",
    color: "#c9a962",
    forms: [
      { label: "Player Registration", page: "PlayerRegistration", icon: UserPlus, desc: "Enroll players with medical, contact, and waiver info" },
      { label: "Coach Registration", page: "CoachRegistration", icon: UserCheck, desc: "Coach application with certifications" },
      { label: "Referee Registration", page: "RefereeRegistration", icon: Megaphone, desc: "Official signup with qualifications" },
      { label: "Volunteer Registration", page: "VolunteerRegistration", icon: HeartHandshake, desc: "Community volunteer signup" },
      { label: "Tryout Registration", page: "TryoutRegistration", icon: Target, desc: "Rep team tryout signup" },
      { label: "Program Signup", page: "ProgramSignup", icon: BookOpen, desc: "Camp and clinic registration" },
    ]
  },
  {
    id: "applications",
    title: "Applications",
    color: "#4A90E2",
    forms: [
      { label: "Sponsor Application", page: "SponsorApplication", icon: Handshake, desc: "Partner/sponsor application" },
      { label: "League Application", page: "LeagueApplication", icon: Trophy, desc: "New league membership" },
      { label: "Facility Partner", page: "FacilityPartner", icon: Building2, desc: "Gym/venue partnership" },
      { label: "Vendor Application", page: "VendorApplication", icon: Truck, desc: "Merchandise/food vendor" },
    ]
  },
  {
    id: "operational",
    title: "Operational",
    color: "#8BC9A8",
    forms: [
      { label: "Game Report", page: "GameReport", icon: FileSpreadsheet, desc: "Post-game coach report" },
      { label: "Incident Report", page: "IncidentReport", icon: AlertTriangle, desc: "Safety/conduct incident" },
      { label: "Transfer Request", page: "TransferRequest", icon: ArrowLeftRight, desc: "Player team transfer" },
      { label: "Schedule Request", page: "ScheduleRequest", icon: CalendarClock, desc: "Game schedule change" },
      { label: "Equipment Request", page: "EquipmentRequest", icon: Package, desc: "Uniforms and gear order" },
      { label: "Facility Booking", page: "FacilityBooking", icon: MapPin, desc: "Court/gym reservation" },
    ]
  },
  {
    id: "feedback",
    title: "Feedback",
    color: "#FFB088",
    forms: [
      { label: "Season Survey", page: "SeasonSurvey", icon: ClipboardEdit, desc: "End-of-season feedback" },
      { label: "Coach Evaluation", page: "CoachEvaluation", icon: Star, desc: "Coaching staff evaluation" },
      { label: "Event Feedback", page: "EventFeedback", icon: MessageCircle, desc: "Tournament/event feedback" },
      { label: "NPS Survey", page: "NPSSurvey", icon: ThumbsUp, desc: "Net Promoter Score" },
    ]
  },
  {
    id: "settings",
    title: "Settings",
    color: "#9B59B6",
    forms: [
      { label: "Parent Profile", page: "ParentProfileSetup", icon: UserCog, desc: "Parent portal setup" },
      { label: "Team Settings", page: "TeamSettingsForm", icon: Sliders, desc: "Team branding and policies" },
      { label: "League Settings", page: "LeagueSettingsForm", icon: Settings, desc: "League rules and structure" },
      { label: "Org Setup", page: "OrganizationSetup", icon: Building, desc: "Organization configuration" },
    ]
  },
  {
    id: "compliance",
    title: "Compliance",
    color: "#E25C5C",
    forms: [
      { label: "Waiver & Consent", page: "WaiverConsent", icon: ScrollText, desc: "Digital waivers" },
      { label: "Medical Form", page: "MedicalForm", icon: Stethoscope, desc: "Health information" },
      { label: "Code of Conduct", page: "CodeOfConduct", icon: Scale, desc: "Sportsmanship agreement" },
      { label: "Background Check", page: "BackgroundCheck", icon: Scan, desc: "Background verification" },
    ]
  },
  {
    id: "recognition",
    title: "Recognition",
    color: "#F4DD8E",
    forms: [
      { label: "Award Nomination", page: "AwardNomination", icon: Medal, desc: "Nominate for awards" },
      { label: "Hall of Fame", page: "HallOfFame", icon: Crown, desc: "Hall of Fame nomination" },
    ]
  },
];

const sections = [
  {
    title: "Game & Live Stats",
    desc: "Track games in real-time, view scores, and analyze performance across all your matchups.",
    items: [
      { label: "Court View", page: "CourtView", icon: PlayCircle, description: "Interactive basketball court with live player positions and real-time stat tracking" },
      { label: "Live Game", page: "LiveGame", icon: Tv, description: "Monitor and manage an active game with live scoring and play-by-play" },
      { label: "Game Setup", page: "GameSetup", icon: Settings, description: "Configure teams, rosters, and game settings before tipoff" },
      { label: "Game View", page: "GameView", icon: Eye, description: "View game details, lineups, and scoring summaries for any matchup" },
      { label: "Box Score", page: "BoxScore", icon: ClipboardList, description: "Traditional box score with per-player stats, shooting splits, and totals" },
      { label: "Detailed Game", page: "DetailedGameView", icon: BarChart3, description: "Deep-dive game analytics with quarter-by-quarter breakdowns" },
      { label: "Live Stats", page: "LiveStats", icon: Activity, description: "Real-time statistical feed across all active games in your organization" },
    ],
  },
  {
    title: "Team Management",
    desc: "Create, organize, and manage your teams, rosters, and performance analytics.",
    items: [
      { label: "Create Team", page: "CreateTeam", icon: PlusCircle, description: "Set up a new team with name, division, age group, and initial roster" },
      { label: "Edit Team", page: "EditTeam", icon: Edit, description: "Modify team details, roster assignments, and coaching staff" },
      { label: "Teams", page: "Teams", icon: Users, description: "Browse all teams in your organization with quick-access cards" },
      { label: "Team List", page: "TeamList", icon: List, description: "Sortable table view of all teams with key stats at a glance" },
      { label: "Team Dashboard", page: "TeamDashboard", icon: LayoutDashboard, description: "Central hub for a single team's schedule, roster, and performance" },
      { label: "Team Detail", page: "TeamDetail", icon: Eye, description: "Detailed profile page for a specific team with full roster and history" },
      { label: "Team Overview", page: "TeamOverview", icon: BarChart3, description: "High-level team analytics including win/loss trends and stat leaders" },
      { label: "Team Performance", page: "TeamPerformance", icon: TrendingUp, description: "Advanced performance metrics, shot charts, and efficiency ratings" },
      { label: "Team Management", page: "TeamManagement", icon: Settings, description: "Administrative tools for roster moves, invites, and team settings" },
      { label: "Team Registration", page: "TeamRegistration", icon: ClipboardCheck, description: "Register a new team with the wizard/form/chat builder" },
    ],
  },
  {
    title: "Player Management",
    desc: "Manage players, track development with AI-powered insights, and view detailed profiles.",
    items: [
      { label: "Player Management", page: "PlayerManagement", icon: UserPlus, description: "Add, edit, and organize players across all your teams" },
      { label: "Player Profile", page: "PlayerProfile", icon: User, description: "Individual player page with bio, stats, and game history" },
      { label: "Player Profiles", page: "PlayerProfiles", icon: Users, description: "Browse and search all registered players in your organization" },
      { label: "Player Sheet", page: "PlayerSheet", icon: FileText, description: "Printable stat sheet with season averages and per-game logs" },
      { label: "Player Development", page: "PlayerDevelopment", icon: TrendingUp, description: "AI-powered growth tracking with skill assessments and improvement plans" },
    ],
  },
  {
    title: "League & Programs",
    desc: "Organize leagues, divisions, programs, schedules, and standings all in one place.",
    items: [
      { label: "League Management", page: "LeagueManagement", icon: Trophy, description: "Create and manage leagues, divisions, and season configurations" },
      { label: "Programs", page: "Programs", icon: BookOpen, description: "View and manage training programs, camps, and clinics" },
      { label: "Add New Program", page: "AddNewProgram", icon: PlusCircle, description: "Create a new program with schedule, pricing, and registration settings" },
      { label: "Schedule", page: "Schedule", icon: Calendar, description: "Master calendar for all games, practices, and events" },
      { label: "Standings", page: "Standings", icon: BarChart3, description: "Live league standings with win/loss records, streaks, and tiebreakers" },
    ],
  },
  {
    title: "Community",
    desc: "Social features, forums, fan engagement, messaging, merchandise, and content publishing.",
    items: [
      { label: "Feed", page: "Feed", icon: Zap, description: "Social feed with game results, player highlights, and community posts" },
      { label: "Forum", page: "Forum", icon: MessageSquare, description: "Discussion boards for teams, leagues, and general basketball talk" },
      { label: "Fan Pages", page: "FanPages", icon: Heart, description: "Team fan pages with follower counts, posts, and engagement" },
      { label: "Fan Zone", page: "FanZone", icon: Globe, description: "Public-facing hub for fans to follow teams and view highlights" },
      { label: "Awards", page: "Awards", icon: Award, description: "Season awards, MVP voting, and achievement badges" },
      { label: "Messenger", page: "Messenger", icon: MessageSquare, description: "Direct messaging between players, coaches, and parents" },
      { label: "Store", page: "Store", icon: Store, description: "Team merchandise shop with custom jerseys, gear, and apparel" },
      { label: "Content", page: "Content", icon: FileText, description: "Publish articles, galleries, polls, and video content" },
    ],
  },
  {
    title: "Dashboards",
    desc: "Role-specific dashboards for coaches, players, parents, managers, commissioners, and admins.",
    items: [
      { label: "Coach", page: "CoachDashboard", icon: ShieldCheck, description: "Coach command center with team stats, upcoming games, and practice plans" },
      { label: "Player", page: "PlayerDashboard", icon: User, description: "Player's personal dashboard with stats, schedule, and development goals" },
      { label: "Parent", page: "ParentDashboard", icon: Users, description: "Parent view with child's schedule, stats, and payment status" },
      { label: "Team Manager", page: "TeamManagerDashboard", icon: ClipboardList, description: "Administrative dashboard for managing team operations and communications" },
      { label: "Commissioner", page: "LeagueCommissionerDashboard", icon: Trophy, description: "League commissioner tools for scheduling, rules, and dispute resolution" },
      { label: "Org President", page: "OrgPresidentDashboard", icon: LayoutDashboard, description: "Organization-level overview with financials, white-label app, and member stats" },
      { label: "Org Dashboard", page: "OrgDashboard", icon: BarChart3, description: "Consolidated analytics across all teams, programs, and revenue" },
      { label: "Dashboard", page: "Dashboard", icon: LayoutDashboard, description: "General-purpose dashboard with quick links and recent activity" },
    ],
  },
  {
    title: "CRM & Operations",
    desc: "Sponsor pipeline, team health scoring, and business intelligence tools.",
    items: [
      { label: "Sponsor Pipeline", page: "SponsorPipeline", icon: Kanban, description: "Kanban board for managing sponsor and partner deals through stages" },
      { label: "Team Health", page: "TeamHealthDashboard", icon: HeartPulse, description: "AI-powered team health scoring with payment, engagement, and retention metrics" },
    ],
  },
  {
    title: "Tools",
    desc: "Utilities, documentation, and maintenance tools.",
    items: [
      { label: "Manual", page: "Manual", icon: BookOpen, description: "User guide and documentation for all platform features" },
      { label: "Cleanup Duplicates", page: "CleanupDuplicates", icon: Trash2, description: "Find and merge duplicate player, team, or game records" },
      { label: "OGH", page: "OGH", icon: Eye, description: "Organization global health check and data integrity monitor" },
    ],
  },
  {
    title: "Registration Forms",
    desc: "Smart forms for players, coaches, referees, volunteers, and program signups.",
    items: [
      { label: "Player Registration", page: "PlayerRegistration", icon: UserPlus, description: "Parent enrolling a player with medical, contact, and waiver info" },
      { label: "Coach Registration", page: "CoachRegistration", icon: UserCheck, description: "Coach application with experience, certifications, and references" },
      { label: "Referee Registration", page: "RefereeRegistration", icon: Megaphone, description: "Official signup with qualifications, availability, and payment prefs" },
      { label: "Volunteer Registration", page: "VolunteerRegistration", icon: HeartHandshake, description: "Community volunteer signup with roles and availability" },
      { label: "Tryout Registration", page: "TryoutRegistration", icon: Target, description: "Rep team tryout signup with stats and highlight video" },
      { label: "Program Signup", page: "ProgramSignup", icon: BookOpen, description: "Camp, clinic, and training program registration" },
    ],
  },
  {
    title: "Application Forms",
    desc: "Applications for sponsors, leagues, facilities, and vendors.",
    items: [
      { label: "Sponsor Application", page: "SponsorApplication", icon: Handshake, description: "Partner/sponsor application with tier selection and goals" },
      { label: "League Application", page: "LeagueApplication", icon: Trophy, description: "New league applying to join the organization" },
      { label: "Facility Partner", page: "FacilityPartner", icon: Building2, description: "Gym/venue partnership application with specs and rates" },
      { label: "Vendor Application", page: "VendorApplication", icon: Truck, description: "Merchandise/food vendor application" },
    ],
  },
  {
    title: "Operational Forms",
    desc: "Game reports, incidents, transfers, scheduling, equipment, and facility bookings.",
    items: [
      { label: "Game Report", page: "GameReport", icon: FileSpreadsheet, description: "Post-game coach report with performance and player notes" },
      { label: "Incident Report", page: "IncidentReport", icon: AlertTriangle, description: "Safety/conduct incident documentation" },
      { label: "Transfer Request", page: "TransferRequest", icon: ArrowLeftRight, description: "Player team transfer request with approvals" },
      { label: "Schedule Request", page: "ScheduleRequest", icon: CalendarClock, description: "Game schedule change request" },
      { label: "Equipment Request", page: "EquipmentRequest", icon: Package, description: "Uniforms and gear order form" },
      { label: "Facility Booking", page: "FacilityBooking", icon: MapPin, description: "Court/gym reservation request" },
    ],
  },
  {
    title: "Feedback Forms",
    desc: "Surveys and evaluations for continuous improvement.",
    items: [
      { label: "Season Survey", page: "SeasonSurvey", icon: ClipboardEdit, description: "End-of-season feedback and satisfaction survey" },
      { label: "Coach Evaluation", page: "CoachEvaluation", icon: Star, description: "Parent evaluation of coaching staff" },
      { label: "Event Feedback", page: "EventFeedback", icon: MessageCircle, description: "Tournament/event feedback form" },
      { label: "NPS Survey", page: "NPSSurvey", icon: ThumbsUp, description: "Net Promoter Score survey" },
    ],
  },
  {
    title: "Settings Forms",
    desc: "Profile setup and configuration forms for parents, teams, leagues, and organizations.",
    items: [
      { label: "Parent Profile", page: "ParentProfileSetup", icon: UserCog, description: "Parent portal onboarding and preferences" },
      { label: "Team Settings", page: "TeamSettingsForm", icon: Sliders, description: "Team branding, colors, and policies" },
      { label: "League Settings", page: "LeagueSettingsForm", icon: Settings, description: "League rules, structure, and scheduling" },
      { label: "Org Setup", page: "OrganizationSetup", icon: Building, description: "Organization branding and integrations" },
    ],
  },
  {
    title: "Compliance Forms",
    desc: "Waivers, medical forms, code of conduct, and background checks.",
    items: [
      { label: "Waiver & Consent", page: "WaiverConsent", icon: ScrollText, description: "Digital liability waivers and consent forms" },
      { label: "Medical Form", page: "MedicalForm", icon: Stethoscope, description: "Player health information and emergency contacts" },
      { label: "Code of Conduct", page: "CodeOfConduct", icon: Scale, description: "Sportsmanship agreement and rules acknowledgment" },
      { label: "Background Check", page: "BackgroundCheck", icon: Scan, description: "Consent for background verification" },
    ],
  },
  {
    title: "Recognition Forms",
    desc: "Award nominations and Hall of Fame submissions.",
    items: [
      { label: "Award Nomination", page: "AwardNomination", icon: Medal, description: "Nominate players for MVP, Most Improved, and more" },
      { label: "Hall of Fame", page: "HallOfFame", icon: Crown, description: "Legacy nomination for Hall of Fame induction" },
    ],
  },
];

/* ───────────────────── component ───────────────────── */

export default function Home() {
  const [activeTab, setActiveTab] = useState("apps");
  const [searchQuery, setSearchQuery] = useState("");
  const [organization, setOrganization] = useState(null);

  /* ── timeline queries (lazy) ── */
  const { data: games = [], isLoading: gamesLoading } = useQuery({
    queryKey: ["home-games"],
    queryFn: () => base44.entities.Game.list("-game_date", 20),
    enabled: activeTab === "timeline",
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["home-posts"],
    queryFn: () => base44.entities.Post.list("-created_date", 20),
    enabled: activeTab === "timeline",
  });

  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ["home-teams"],
    queryFn: () => base44.entities.Team.list("-created_date", 20),
    enabled: activeTab === "timeline",
  });

  const { data: programs = [] } = useQuery({
    queryKey: ["home-programs"],
    queryFn: () => base44.entities.Program.list("-created_date", 10),
    enabled: activeTab === "timeline",
  });

  /* ── white-label org fetch ── */
  useEffect(() => {
    if (activeTab === "whitelabel") {
      base44.auth.me().then(async (userData) => {
        if (userData?.organization_id) {
          try {
            const orgs = await base44.entities.Organization.filter({ id: userData.organization_id });
            setOrganization(orgs?.[0] || null);
          } catch { /* ignore */ }
        }
      }).catch(() => null);
    }
  }, [activeTab]);

  /* ── computed ── */
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections
      .map((s) => ({
        ...s,
        items: s.items.filter(
          (i) =>
            i.label.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q)
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [searchQuery]);

  const timelineEvents = useMemo(() => {
    const events = [];

    games.forEach((g) => {
      events.push({
        id: `game-${g.id}`,
        type: "game",
        icon: PlayCircle,
        color: "text-emerald-400",
        bgColor: "bg-emerald-400/10",
        title: `${g.home_team_name || "Home"} vs ${g.away_team_name || "Away"}`,
        subtitle:
          g.status === "completed"
            ? `Final: ${g.home_score} – ${g.away_score}`
            : g.status === "live"
            ? `Live: ${g.home_score} – ${g.away_score}`
            : "Scheduled",
        timestamp: g.game_date || g.created_date,
      });
    });

    posts.forEach((p) => {
      events.push({
        id: `post-${p.id}`,
        type: "post",
        icon: MessageSquare,
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        title: p.title || "New Post",
        subtitle:
          (p.content || "").substring(0, 80) +
          ((p.content || "").length > 80 ? "..." : ""),
        timestamp: p.created_date,
      });
    });

    teams.forEach((t) => {
      events.push({
        id: `team-${t.id}`,
        type: "team",
        icon: Users,
        color: "text-purple-400",
        bgColor: "bg-purple-400/10",
        title: t.name || "New Team",
        subtitle: `${t.sport || "Team"} registered`,
        timestamp: t.created_date,
      });
    });

    programs.forEach((pr) => {
      events.push({
        id: `program-${pr.id}`,
        type: "program",
        icon: BookOpen,
        color: "text-[#c9a962]",
        bgColor: "bg-[#c9a962]/10",
        title: pr.name || "New Program",
        subtitle: (pr.description || "Program added").substring(0, 80),
        timestamp: pr.created_date,
      });
    });

    return events
      .filter((e) => e.timestamp)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [games, posts, teams, programs]);

  const isTimelineLoading = gamesLoading || postsLoading || teamsLoading;

  /* ── render: Apps tab ── */
  function renderAppsTab() {
    return (
      <TooltipProvider delayDuration={800}>
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/[0.06] border border-white/[0.06]
              text-white/80 placeholder:text-white/25 text-[15px] font-light
              focus:outline-none focus:ring-1 focus:ring-[#c9a962]/30 focus:border-[#c9a962]/20
              transition-all"
          />
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {filteredSections.length === 0 && (
            <div className="text-center py-20 text-white/30">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-light">No apps match &ldquo;{searchQuery}&rdquo;</p>
            </div>
          )}

          {filteredSections.map((section) => (
            <div
              key={section.title}
              className="rounded-[28px] bg-white/[0.07] border border-white/[0.055] shadow-[0_20px_50px_rgba(0,0,0,.10)] p-8 md:p-10"
            >
              <h2 className="font-serif text-[28px] leading-[1.12] tracking-[-0.01em] text-white mb-2">
                {section.title}
              </h2>
              <p className="text-[15px] leading-[1.65] text-white/[0.45] mb-7">
                {section.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Tooltip key={item.page}>
                      <TooltipTrigger asChild>
                        <Link
                          to={createPageUrl(item.page)}
                          className="group h-[62px] rounded-[18px] bg-white/[0.078] border border-white/[0.06]
                            px-[18px] flex items-center justify-between
                            shadow-[0_10px_26px_rgba(0,0,0,.10)]
                            hover:shadow-[0_14px_32px_rgba(0,0,0,.14)]
                            hover:bg-white/[0.11] transition-all duration-200"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center">
                              <Icon className="w-4 h-4 text-white/[0.55]" />
                            </div>
                            <span className="text-[16px] font-semibold tracking-[-0.01em] text-white/[0.88]">
                              {item.label}
                            </span>
                          </div>
                          <ChevronRight className="w-[18px] h-[18px] text-white/[0.3] group-hover:text-white/[0.55] transition-colors" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[280px]">
                        {item.description}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>
    );
  }

  /* ── render: Timeline tab ── */
  function renderTimelineTab() {
    if (isTimelineLoading) {
      return (
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-[46px] h-[46px] rounded-xl bg-white/[0.06] flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 bg-white/[0.06] rounded w-2/3" />
                <div className="h-3 bg-white/[0.04] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (timelineEvents.length === 0) {
      return (
        <div className="text-center py-20 text-white/30">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-light">No activity yet</p>
          <p className="text-sm mt-1 text-white/20 font-light">
            Games, posts, and updates will appear here
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-[28px] bg-white/[0.07] border border-white/[0.055] shadow-[0_20px_50px_rgba(0,0,0,.10)] p-8 md:p-10">
        <h2 className="font-serif text-[28px] leading-[1.12] tracking-[-0.01em] text-white mb-8">
          Recent Activity
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[22px] top-2 bottom-2 w-px bg-white/[0.06]" />

          {timelineEvents.map((event, index) => {
            const Icon = event.icon;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="relative flex gap-4 pb-6 last:pb-0"
              >
                <div
                  className={`relative z-10 w-[46px] h-[46px] rounded-xl ${event.bgColor}
                    border border-white/[0.06] flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${event.color}`} />
                </div>

                <div className="flex-1 pt-0.5 min-w-0">
                  <p className="text-[15px] font-medium text-white/90 truncate">
                    {event.title}
                  </p>
                  <p className="text-[13px] text-white/40 mt-0.5 leading-relaxed line-clamp-2">
                    {event.subtitle}
                  </p>
                  <p className="text-[11px] text-white/25 mt-1.5 font-light">
                    {formatTimeAgo(event.timestamp)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── render: White Label tab ── */
  function renderWhiteLabelTab() {
    return (
      <div className="rounded-[28px] bg-white/[0.07] border border-white/[0.055] shadow-[0_20px_50px_rgba(0,0,0,.10)] p-8 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#c9a962]/20 rounded-xl flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-[#c9a962]" />
          </div>
          <div>
            <h2 className="font-serif text-[24px] text-white">White-Label App</h2>
            <p className="text-[14px] text-white/40 font-light">
              Your brand in App Store & Google Play
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Phone Mockup */}
          <div className="p-6 bg-gradient-to-br from-white/[0.06] to-transparent rounded-2xl border border-white/[0.06]">
            <div className="aspect-[9/19] bg-black rounded-3xl p-2 shadow-2xl mx-auto max-w-[240px]">
              <div className="w-full h-full bg-gradient-to-br from-[#c9a962] to-[#e8c96a] rounded-2xl flex items-center justify-center">
                <div className="text-center px-4">
                  <Smartphone className="w-16 h-16 text-[#0f0f0f] mx-auto mb-4" />
                  <p className="text-2xl font-bold text-[#0f0f0f]">
                    {organization?.name || "Your Org"}
                  </p>
                  <p className="text-sm text-[#0f0f0f]/60 mt-1">Sports App</p>
                </div>
              </div>
            </div>
          </div>

          {/* Config Cards */}
          <div className="space-y-4">
            {/* App Status */}
            <div className="p-4 rounded-xl bg-white/[0.05] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[14px] text-white/40 font-light">App Status</span>
                <span className="text-xs px-2.5 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg font-medium">
                  In Review
                </span>
              </div>
              <p className="text-[13px] text-white/30 font-light">
                Pending Apple & Google approval
              </p>
            </div>

            {/* App Name */}
            <div className="p-4 rounded-xl bg-white/[0.05] border border-white/[0.06]">
              <span className="text-[14px] text-white/40 font-light">App Name</span>
              <p className="text-white font-medium mt-1">
                {organization?.name || "Your Organization"} Sports
              </p>
            </div>

            {/* Bundle ID */}
            <div className="p-4 rounded-xl bg-white/[0.05] border border-white/[0.06]">
              <span className="text-[14px] text-white/40 font-light">Bundle ID</span>
              <p className="text-[13px] text-white/50 font-mono mt-1">
                com.ballinthe6.app
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="h-11 rounded-xl bg-white/[0.06] border border-white/[0.06]
                text-white/50 text-[14px] font-light flex items-center justify-center gap-2
                hover:bg-white/[0.09] transition-all">
                <Globe className="w-4 h-4" /> Preview Web
              </button>
              <button className="h-11 rounded-xl bg-white/[0.06] border border-white/[0.06]
                text-white/50 text-[14px] font-light flex items-center justify-center gap-2
                hover:bg-white/[0.09] transition-all">
                <Bell className="w-4 h-4" /> Notifications
              </button>
            </div>

            {/* Coming Soon */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.04] text-center">
                <Palette className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-[13px] text-white/25 font-light">Branding</p>
                <p className="text-[11px] text-white/15 mt-0.5">Coming soon</p>
              </div>
              <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.04] text-center">
                <Settings className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-[13px] text-white/25 font-light">Settings</p>
                <p className="text-[11px] text-white/15 mt-0.5">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── render: Forms tab ── */
  function renderFormsTab() {
    return (
      <div className="space-y-6">
        {/* Forms Header */}
        <div className="rounded-[28px] bg-gradient-to-br from-[#c9a962]/20 to-transparent border border-[#c9a962]/20 p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#c9a962]/20 rounded-2xl flex items-center justify-center">
              <FilePenLine className="w-7 h-7 text-[#c9a962]" />
            </div>
            <div>
              <h2 className="font-serif text-[24px] sm:text-[28px] text-white">All Forms</h2>
              <p className="text-[14px] sm:text-[15px] text-white/40 mt-1">
                {FORM_CATEGORIES.reduce((acc, cat) => acc + cat.forms.length, 0)} forms across {FORM_CATEGORIES.length} categories
              </p>
            </div>
          </div>
        </div>

        {/* Category Pills - Horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {FORM_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                document.getElementById(`form-cat-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-all
                bg-white/[0.06] border border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.1]"
              style={{ borderColor: `${cat.color}30` }}
            >
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: cat.color }} />
              {cat.title}
              <span className="ml-1.5 text-white/30">({cat.forms.length})</span>
            </button>
          ))}
        </div>

        {/* Form Categories */}
        {FORM_CATEGORIES.map((category) => (
          <div
            key={category.id}
            id={`form-cat-${category.id}`}
            className="rounded-[24px] bg-white/[0.05] border border-white/[0.06] overflow-hidden scroll-mt-24"
          >
            {/* Category Header */}
            <div
              className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3"
              style={{ backgroundColor: `${category.color}10` }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <h3 className="text-[17px] font-semibold text-white">{category.title}</h3>
              <span className="text-[13px] text-white/40 ml-auto">{category.forms.length} forms</span>
            </div>

            {/* Forms List */}
            <div className="divide-y divide-white/[0.04]">
              {category.forms.map((form) => {
                const Icon = form.icon;
                return (
                  <Link
                    key={form.page}
                    to={createPageUrl(form.page)}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.04] transition-colors group"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: category.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-medium text-white/90 truncate">
                        {form.label}
                      </p>
                      <p className="text-[13px] text-white/40 truncate">
                        {form.desc}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Team Registration - Special Highlight */}
        <div className="rounded-[24px] bg-gradient-to-br from-[#c9a962]/15 to-transparent border border-[#c9a962]/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#c9a962]/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-[#c9a962]" />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-white">Team Registration</p>
                <p className="text-[13px] text-white/40">Register a new team with coach info and season selection</p>
              </div>
            </div>
            <Link
              to={createPageUrl("TeamRegistration")}
              className="px-5 py-2.5 bg-[#c9a962] text-[#0f0f0f] rounded-full text-[14px] font-semibold
                hover:bg-[#d4b46d] transition-all active:scale-95"
            >
              Register Team
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── main render ── */
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 pt-14 pb-6">
        <h1 className="font-serif text-[32px] leading-[1.12] tracking-[-0.01em] text-white">
          Organization Hub
        </h1>
        <p className="mt-2 text-[16px] leading-[1.65] text-white/40">
          Apps, activity, and white-label management
        </p>

        {/* Tab Bar */}
        <div className="mt-6 flex items-center gap-1 p-1 rounded-full bg-white/[0.05] border border-white/[0.06] w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "bg-[#c9a962] text-[#0f0f0f] shadow-lg shadow-[#c9a962]/20"
                    : "text-white/50 hover:text-white/70 hover:bg-white/[0.05]"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "apps" && renderAppsTab()}
            {activeTab === "forms" && renderFormsTab()}
            {activeTab === "timeline" && renderTimelineTab()}
            {activeTab === "whitelabel" && renderWhiteLabelTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
