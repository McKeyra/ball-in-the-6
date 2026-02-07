import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  Brain, 
  Building2, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

const navigation = [
  { name: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
  { name: "Leads", page: "Leads", icon: Users },
  { name: "Pipeline", page: "Pipeline", icon: Kanban },
  { name: "Scoring", page: "Scoring", icon: Brain },
  { name: "Ventures", page: "Ventures", icon: Building2 },
  { name: "Reports", page: "Reports", icon: BarChart3 },
  { name: "Settings", page: "Settings", icon: Settings },
];

export default function Layout({ children, currentPageName }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (pageName) => {
    const currentPath = location.pathname;
    return currentPath.includes(pageName);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <style>{`
        :root {
          --primary: #1A1A2E;
          --secondary: #16213E;
          --accent: #0F3460;
          --highlight: #E94560;
        }
      `}</style>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50 flex items-center px-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-slate-400 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        <div className="ml-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="font-semibold text-white">ENUW</span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-slate-900/95 backdrop-blur-sm border-r border-slate-800 z-50 transition-all duration-300 
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`p-4 border-b border-slate-800 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <div>
                  <h1 className="font-bold text-white text-lg tracking-tight">ENUW</h1>
                  <p className="text-xs text-slate-500">Command Center</p>
                </div>
              </div>
            )}
            {collapsed && (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.page);
              
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                    ${active 
                      ? 'bg-gradient-to-r from-red-500/20 to-orange-500/10 text-white border border-red-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-red-400' : 'group-hover:text-slate-200'}`} />
                  {!collapsed && (
                    <span className="font-medium text-sm">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          {!collapsed && (
            <div className="p-4 border-t border-slate-800">
              <div className="text-xs text-slate-500 text-center">
                Portfolio Trajectory: <span className="text-emerald-400 font-semibold">$100B</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'} pt-16 lg:pt-0`}>
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}