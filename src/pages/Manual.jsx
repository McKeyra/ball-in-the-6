import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PlayCircle, Users, Calendar, Trophy, Settings, ClipboardList, Handshake, Trash2 } from "lucide-react";

export default function Manual() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Court View",
      description: "Live game tracking with scoreboard and player stats",
      icon: PlayCircle,
      page: "CourtView",
      color: "#c9a962"
    },
    {
      title: "Create New Team",
      description: "Add a new team with roster and staff",
      icon: Users,
      page: "CreateTeam",
      color: "#059669"
    },
    {
      title: "League Management",
      description: "Manage games, teams, and schedules",
      icon: Trophy,
      page: "LeagueManagement",
      color: "#7c3aed"
    },
    {
      title: "Schedule New Game",
      description: "Create and schedule games between teams",
      icon: Calendar,
      page: "LeagueManagement",
      color: "#dc2626"
    },
    {
      title: "Programs",
      description: "Manage training, camps, and events",
      icon: ClipboardList,
      page: "Programs",
      color: "#0ea5e9"
    },
    {
      title: "Sponsor Pipeline",
      description: "Track sponsorships and partnerships",
      icon: Handshake,
      page: "SponsorPipeline",
      color: "#f59e0b"
    },
    {
      title: "Cleanup Duplicates",
      description: "Remove duplicate team entries",
      icon: Trash2,
      page: "CleanupDuplicates",
      color: "#ef4444"
    },
    {
      title: "Settings",
      description: "Configure app preferences",
      icon: Settings,
      page: "Settings",
      color: "#6b7280"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white/90 mb-1 md:mb-2">Quick Actions</h1>
          <p className="text-sm md:text-base text-white/60">Navigate to key features and tools</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(createPageUrl(item.page))}
              className="p-4 md:p-6 rounded-2xl md:rounded-3xl text-left transition-all hover:scale-[1.01] active:scale-[0.99] min-h-[100px]"
              style={{
                background: '#1a1a1a',
                boxShadow: '0 10px 26px rgba(0,0,0,.10)'
              }}
            >
              <div
                className="w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4"
                style={{
                  background: item.color,
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.2)'
                }}
              >
                <item.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white/90 mb-1 md:mb-2">{item.title}</h2>
              <p className="text-xs md:text-sm text-white/60">{item.description}</p>
            </button>
          ))}
        </div>

        {/* Related Links */}
        <div className="mt-8 md:mt-10 pt-6 border-t border-white/[0.06]">
          <h2 className="text-lg md:text-xl font-semibold text-white/80 mb-4">Related Links</h2>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <Link to="/login" className="px-4 py-2 min-h-[44px] flex items-center rounded-xl bg-white/[0.05] text-sm text-white/60 hover:text-white/90 hover:bg-white/[0.08] transition-all">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 min-h-[44px] flex items-center rounded-xl bg-white/[0.05] text-sm text-white/60 hover:text-white/90 hover:bg-white/[0.08] transition-all">
              Register
            </Link>
            <button
              onClick={() => navigate(createPageUrl("AddNewProgram"))}
              className="px-4 py-2 min-h-[44px] flex items-center rounded-xl bg-white/[0.05] text-sm text-white/60 hover:text-white/90 hover:bg-white/[0.08] transition-all"
            >
              Add New Program
            </button>
            <button
              onClick={() => navigate(createPageUrl("TeamOverview"))}
              className="px-4 py-2 min-h-[44px] flex items-center rounded-xl bg-white/[0.05] text-sm text-white/60 hover:text-white/90 hover:bg-white/[0.08] transition-all"
            >
              Team Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}