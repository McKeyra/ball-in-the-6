import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wallet, Calendar, GraduationCap, CreditCard, 
  AlertCircle, CheckCircle, Clock, DollarSign, BookOpen
} from "lucide-react";

export default function ParentDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const mockPayments = [
    { id: 1, description: 'Winter Season Registration', amount: 450, status: 'paid', date: '2024-11-01' },
    { id: 2, description: 'Tournament Entry Fee', amount: 125, status: 'pending', date: '2024-11-15', dueDate: '2024-11-20' },
    { id: 3, description: 'Team Uniform Order', amount: 85, status: 'upcoming', date: '2024-12-01' },
  ];

  const mockSchedule = [
    { id: 1, title: 'Practice', date: '2024-11-16', time: '6:00 PM', location: 'Main Gym' },
    { id: 2, title: 'Game vs Eagles', date: '2024-11-18', time: '7:30 PM', location: 'Home Court' },
    { id: 3, title: 'Team Meeting', date: '2024-11-20', time: '5:00 PM', location: 'Clubhouse' },
  ];

  const mockAcademics = [
    { subject: 'Mathematics', grade: 'A-', progress: 88 },
    { subject: 'English', grade: 'B+', progress: 85 },
    { subject: 'Science', grade: 'A', progress: 92 },
    { subject: 'History', grade: 'B', progress: 80 },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
            Parent Dashboard
          </h1>
          <p className="text-sm md:text-base text-white/40">Manage payments, schedules & academics</p>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <Wallet className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">$0.00</p>
              <p className="text-xs md:text-sm text-white/50">Account Balance</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-red-400" />
                <span className="text-xs px-2 py-1 bg-red-500/30 text-red-300 rounded">Due Soon</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">$125.00</p>
              <p className="text-xs md:text-sm text-white/50">Pending Payments</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                <span className="text-xs px-2 py-1 bg-blue-500/30 text-blue-300 rounded">This Month</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">$660.00</p>
              <p className="text-xs md:text-sm text-white/50">Total Spent</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Payments */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Digital Wallet */}
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardHeader className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#c9a962]/20 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-[#c9a962]" />
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg">Digital Wallet</CardTitle>
                    <p className="text-xs md:text-sm text-white/40">Payments & invoices</p>
                  </div>
                </div>
                <Button className="bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90 min-h-[44px] w-full sm:w-auto">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Add Funds
                </Button>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-3">
                {mockPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-white/[0.05] rounded-lg border border-white/[0.06] gap-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm md:text-base font-medium text-white mb-1">{payment.description}</p>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          payment.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                          payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {payment.status.toUpperCase()}
                        </span>
                        {payment.dueDate && (
                          <span className="text-xs md:text-sm text-white/40">
                            Due: {new Date(payment.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <p className="text-lg md:text-xl font-bold text-white">${payment.amount}</p>
                      {payment.status === 'pending' && (
                        <Button size="sm" className="bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90 min-h-[44px] flex-1 sm:flex-none">
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Academic Tracker */}
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg">Academic Tracker</CardTitle>
                    <p className="text-xs md:text-sm text-white/40">Monitor school performance</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-4">
                {mockAcademics.map((subject, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 md:gap-3">
                        <BookOpen className="w-4 h-4 text-white/40" />
                        <span className="text-sm md:text-base text-white font-medium">{subject.subject}</span>
                      </div>
                      <span className={`text-base md:text-lg font-bold ${
                        subject.grade.startsWith('A') ? 'text-green-400' :
                        subject.grade.startsWith('B') ? 'text-blue-400' :
                        'text-yellow-400'
                      }`}>
                        {subject.grade}
                      </span>
                    </div>
                    <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          subject.progress >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                          subject.progress >= 80 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                          'bg-gradient-to-r from-yellow-500 to-orange-400'
                        }`}
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-white/[0.06] mt-4 min-h-[44px] text-sm md:text-base">
                  View Full Report Card
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Calendar */}
          <div className="space-y-4 md:space-y-6">
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg">Family Calendar</CardTitle>
                    <p className="text-xs md:text-sm text-white/40">Upcoming events</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-3">
                {mockSchedule.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-white/[0.05] rounded-lg border-l-4 border-[#c9a962] min-h-[44px]"
                  >
                    <p className="text-sm md:text-base font-semibold text-white mb-1">{event.title}</p>
                    <div className="space-y-1 text-xs md:text-sm text-white/40">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-white/[0.06] min-h-[44px] text-sm md:text-base">
                  Sync to Calendar
                </Button>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-3">
                <div className="p-3 bg-white/[0.05] rounded-lg flex items-center justify-between min-h-[44px]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-medium text-white">Visa 4242</p>
                      <p className="text-xs text-white/40">Expires 12/25</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Default</span>
                </div>
                <Button variant="outline" className="w-full border-white/[0.06] min-h-[44px] text-sm md:text-base">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}