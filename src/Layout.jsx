import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { TimeoutProvider } from "./components/basketball/TimeoutContext";
import { GameClockProvider } from "./components/basketball/GameClockContext";
import GlobalTimeoutDisplay from "./components/basketball/GlobalTimeoutDisplay";
import { B6Header, B6BottomNav, B6MobileMenu } from "./components/craft";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => null);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Redirect to role-specific dashboard
  useEffect(() => {
    if (user && location.pathname === '/') {
      const role = user.user_role || 'fan';
      const dashboardMap = {
        player: 'PlayerDashboard',
        parent: 'ParentDashboard',
        coach: 'CoachDashboard',
        team_admin: 'TeamManagerDashboard',
        league_admin: 'LeagueCommissionerDashboard',
        org_admin: 'OrgPresidentDashboard',
        fan: 'Home',
      };
      navigate(createPageUrl(dashboardMap[role] || 'Home'));
    }
  }, [user, location, navigate]);

  return (
    <GameClockProvider>
      <TimeoutProvider>
        <GlobalTimeoutDisplay />
        <div className="min-h-screen bg-[#0f0f0f] text-white">
          {/* Craft-style Header */}
          <B6Header
            onMenuToggle={() => setMenuOpen(!menuOpen)}
            menuOpen={menuOpen}
          />

          {/* Mobile Menu Overlay */}
          <B6MobileMenu
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
          />

          {/* Main Content - with padding for header and bottom nav */}
          {/* Mobile: pt-20, Tablet+: pt-24, Bottom: pb-24 on mobile, pb-28 on larger */}
          <main className="pt-20 sm:pt-24 pb-24 sm:pb-28 px-3 sm:px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

          {/* Craft-style Bottom Navigation */}
          <B6BottomNav />
        </div>
      </TimeoutProvider>
    </GameClockProvider>
  );
}
