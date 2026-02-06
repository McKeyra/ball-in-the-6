import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function LiveStats() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#121212] to-[#0A0A0A] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Live Stats</h1>
          <p className="text-white/40">Real-time game statistics tracking</p>
        </div>

        <Card className="bg-white/[0.05] border-white/[0.06]">
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/40 mb-2">Live stats tracking coming soon</p>
            <p className="text-sm text-white/30">Track basketball, hockey, soccer, baseball, football & volleyball stats in real-time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}