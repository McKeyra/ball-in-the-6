import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, Shirt, DollarSign, Send, CheckCircle, 
  AlertCircle, Download, Users
} from "lucide-react";

export default function TeamManagerDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const mockInvoices = [
    { id: 1, family: 'Smith Family', amount: 450, status: 'paid', dueDate: '2024-11-01' },
    { id: 2, family: 'Johnson Family', amount: 450, status: 'overdue', dueDate: '2024-10-15' },
    { id: 3, family: 'Williams Family', amount: 450, status: 'pending', dueDate: '2024-11-20' },
  ];

  const mockUniformSizes = [
    { player: 'Alex Smith', jersey: 'YL', shorts: 'YM', warmup: 'YL', status: 'ordered' },
    { player: 'Jordan Lee', jersey: 'M', shorts: 'M', warmup: 'L', status: 'received' },
    { player: 'Taylor Kim', jersey: 'S', shorts: 'M', warmup: 'M', status: 'pending' },
    { player: 'Casey Brown', jersey: 'L', shorts: 'L', warmup: 'L', status: 'ordered' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Team Manager Dashboard 📋
          </h1>
          <p className="text-white/40">Invoicing, uniforms & team operations</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/[0.05] border-white/[0.06]">
            <CardContent className="p-6">
              <DollarSign className="w-8 h-8 text-green-400 mb-3" />
              <p className="text-3xl font-bold text-white">$5,400</p>
              <p className="text-sm text-white/40">Collected</p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.05] border-white/[0.06]">
            <CardContent className="p-6">
              <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
              <p className="text-3xl font-bold text-white">$450</p>
              <p className="text-sm text-white/40">Overdue</p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.05] border-white/[0.06]">
            <CardContent className="p-6">
              <Shirt className="w-8 h-8 text-blue-400 mb-3" />
              <p className="text-3xl font-bold text-white">12/15</p>
              <p className="text-sm text-white/40">Uniforms In</p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.05] border-white/[0.06]">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-purple-400 mb-3" />
              <p className="text-3xl font-bold text-white">15</p>
              <p className="text-sm text-white/40">Team Members</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Invoicing */}
          <Card className="bg-white/[0.05] border-white/[0.06]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <CardTitle>Invoice Management</CardTitle>
                    <p className="text-sm text-white/40">Track payments & send reminders</p>
                  </div>
                </div>
                <Button className="bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90">
                  New Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockInvoices.map((invoice) => (
                <div 
                  key={invoice.id}
                  className="flex items-center justify-between p-4 bg-white/[0.05] rounded-lg border border-white/[0.06]"
                >
                  <div className="flex-1">
                    <p className="font-medium text-white mb-1">{invoice.family}</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                        invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                        invoice.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {invoice.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-white/40">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-xl font-bold text-white">${invoice.amount}</p>
                    </div>
                    {invoice.status !== 'paid' && (
                      <Button size="sm" variant="outline" className="border-white/[0.06]">
                        <Send className="w-4 h-4 mr-2" />
                        Remind
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-white/[0.06]">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </CardContent>
          </Card>

          {/* Uniform Grid */}
          <Card className="bg-white/[0.05] border-white/[0.06]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Shirt className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>Uniform Size Grid</CardTitle>
                    <p className="text-sm text-white/40">Track orders & sizes</p>
                  </div>
                </div>
                <Button className="bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90">
                  Place Order
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left p-3 text-white/40 font-medium">Player</th>
                      <th className="text-center p-3 text-white/40 font-medium">Jersey</th>
                      <th className="text-center p-3 text-white/40 font-medium">Shorts</th>
                      <th className="text-center p-3 text-white/40 font-medium">Warmup</th>
                      <th className="text-center p-3 text-white/40 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUniformSizes.map((item, idx) => (
                      <tr key={idx} className="border-b border-white/[0.06] hover:bg-white/[0.05] transition-colors">
                        <td className="p-3 text-white font-medium">{item.player}</td>
                        <td className="p-3 text-center text-white/50">{item.jersey}</td>
                        <td className="p-3 text-center text-white/50">{item.shorts}</td>
                        <td className="p-3 text-center text-white/50">{item.warmup}</td>
                        <td className="p-3 text-center">
                          <span className={`text-xs px-2 py-1 rounded ${
                            item.status === 'received' ? 'bg-green-500/20 text-green-400' :
                            item.status === 'ordered' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-white/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="w-full mt-4 border-white/[0.06]">
                <Download className="w-4 h-4 mr-2" />
                Export Size Sheet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}