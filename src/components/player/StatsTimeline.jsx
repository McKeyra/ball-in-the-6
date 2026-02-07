import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function StatsTimeline({ stats, player }) {
  const groupedStats = stats.reduce((acc, stat) => {
    const date = format(new Date(stat.created_date), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(stat);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-[#D0FF00]" />
        <h2 className="text-xl font-bold text-white">Performance Timeline</h2>
      </div>

      {Object.keys(groupedStats).length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No stats recorded yet. Start tracking your performance!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#D0FF00] via-purple-500 to-blue-500" />

          {Object.entries(groupedStats).map(([date, dateStats]) => (
            <div key={date} className="relative pl-16 pb-8">
              {/* Timeline Dot */}
              <div className="absolute left-4 w-5 h-5 rounded-full bg-[#D0FF00] border-4 border-[#0A0A0A]" />

              <Card className="bg-white/5 border-white/10 hover:border-[#D0FF00]/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-400">
                      {format(new Date(date), 'MMMM d, yyyy')}
                    </p>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300">
                      {dateStats.length} stats
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {dateStats.map((stat, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-lg text-center">
                        <p className="text-2xl font-bold text-[#D0FF00]">{stat.value}</p>
                        <p className="text-xs text-gray-400 mt-1 capitalize">
                          {stat.stat_type.replace(/_/g, ' ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}