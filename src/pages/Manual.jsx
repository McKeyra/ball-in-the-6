import React from 'react';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { PlayCircle, Users, Calendar, Trophy } from "lucide-react";

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
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <style>{`
        @keyframes shine {
          0% {
            background-position: 0;
          }
          60% {
            background-position: 180px;
          }
          100% {
            background-position: 180px;
          }
        }
        .btn-shine {
          padding: 12px 48px;
          color: #fff;
          background: linear-gradient(to right, #c9a962 0, #fff 10%, #c9a962 20%);
          background-position: 0;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s infinite linear;
          animation-fill-mode: forwards;
          -webkit-text-size-adjust: none;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          white-space: nowrap;
          font-family: "Poppins", sans-serif;
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(createPageUrl(item.page))}
              className="p-6 rounded-3xl text-left transition-all hover:scale-[1.02]"
              style={{
                background: '#1a1a1a',
                boxShadow: '0 10px 26px rgba(0,0,0,.10)'
              }}
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: item.color,
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.2)'
                }}
              >
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white/90 mb-2">{item.title}</h2>
              <p className="text-sm text-white/60">{item.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}