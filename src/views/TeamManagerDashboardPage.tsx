'use client';

import {
  FileText,
  DollarSign,
  Send,
  AlertCircle,
  Download,
  Users,
} from 'lucide-react';

/* ---------- Types ---------- */
interface Invoice {
  id: number;
  family: string;
  amount: number;
  status: 'paid' | 'overdue' | 'pending';
  dueDate: string;
}

interface UniformSize {
  player: string;
  jersey: string;
  shorts: string;
  warmup: string;
  status: 'ordered' | 'received' | 'pending';
}

/* ---------- Component ---------- */
export function TeamManagerDashboardPage(): React.ReactElement {
  const mockInvoices: Invoice[] = [
    { id: 1, family: 'Smith Family', amount: 450, status: 'paid', dueDate: '2024-11-01' },
    { id: 2, family: 'Johnson Family', amount: 450, status: 'overdue', dueDate: '2024-10-15' },
    { id: 3, family: 'Williams Family', amount: 450, status: 'pending', dueDate: '2024-11-20' },
  ];

  const mockUniformSizes: UniformSize[] = [
    { player: 'Alex Smith', jersey: 'YL', shorts: 'YM', warmup: 'YL', status: 'ordered' },
    { player: 'Jordan Lee', jersey: 'M', shorts: 'M', warmup: 'L', status: 'received' },
    { player: 'Taylor Kim', jersey: 'S', shorts: 'M', warmup: 'M', status: 'pending' },
    { player: 'Casey Brown', jersey: 'L', shorts: 'L', warmup: 'L', status: 'ordered' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">Team Manager Dashboard</h1>
          <p className="text-sm md:text-base text-white/40">Invoicing, uniforms & team operations</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { icon: DollarSign, color: 'text-green-400', value: '$5,400', label: 'Collected' },
            { icon: AlertCircle, color: 'text-red-400', value: '$450', label: 'Overdue' },
            { icon: FileText, color: 'text-blue-400', value: '12/15', label: 'Uniforms In' },
            { icon: Users, color: 'text-purple-400', value: '15', label: 'Team Members' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-4 md:p-6">
                <Icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color} mb-2 md:mb-3`} />
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs md:text-sm text-white/40">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Invoicing */}
          <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-semibold">Invoice Management</h2>
                    <p className="text-xs md:text-sm text-white/40">Track payments & send reminders</p>
                  </div>
                </div>
                <button className="bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] px-4 rounded-md font-medium w-full sm:w-auto">
                  New Invoice
                </button>
              </div>

              <div className="space-y-3">
                {mockInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-white/[0.05] rounded-lg border border-white/[0.06] gap-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm md:text-base font-medium text-white mb-1">{invoice.family}</p>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <span
                          className={`text-xs px-2 py-1 rounded font-semibold ${
                            invoice.status === 'paid'
                              ? 'bg-green-500/20 text-green-400'
                              : invoice.status === 'overdue'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {invoice.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-white/40">Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <p className="text-lg md:text-xl font-bold text-white">${invoice.amount}</p>
                      {invoice.status !== 'paid' && (
                        <button className="border border-white/[0.06] min-h-[44px] px-3 rounded-md flex items-center gap-2 text-sm">
                          <Send className="w-4 h-4" />
                          Remind
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button className="w-full border border-white/[0.06] min-h-[44px] rounded-md flex items-center justify-center gap-2 text-sm md:text-base hover:bg-white/[0.05]">
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
              </div>
            </div>
          </div>

          {/* Uniform Grid */}
          <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-semibold">Uniform Size Grid</h2>
                    <p className="text-xs md:text-sm text-white/40">Track orders & sizes</p>
                  </div>
                </div>
                <button className="bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] px-4 rounded-md font-medium w-full sm:w-auto">
                  Place Order
                </button>
              </div>

              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full text-xs md:text-sm min-w-[400px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left p-2 md:p-3 text-white/40 font-medium">Player</th>
                      <th className="text-center p-2 md:p-3 text-white/40 font-medium">Jersey</th>
                      <th className="text-center p-2 md:p-3 text-white/40 font-medium">Shorts</th>
                      <th className="text-center p-2 md:p-3 text-white/40 font-medium">Warmup</th>
                      <th className="text-center p-2 md:p-3 text-white/40 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUniformSizes.map((item, idx) => (
                      <tr key={idx} className="border-b border-white/[0.06] hover:bg-white/[0.05] transition-colors">
                        <td className="p-2 md:p-3 text-white font-medium">{item.player}</td>
                        <td className="p-2 md:p-3 text-center text-white/50">{item.jersey}</td>
                        <td className="p-2 md:p-3 text-center text-white/50">{item.shorts}</td>
                        <td className="p-2 md:p-3 text-center text-white/50">{item.warmup}</td>
                        <td className="p-2 md:p-3 text-center">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              item.status === 'received'
                                ? 'bg-green-500/20 text-green-400'
                                : item.status === 'ordered'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-gray-500/20 text-white/40'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="w-full mt-4 border border-white/[0.06] min-h-[44px] rounded-md flex items-center justify-center gap-2 text-sm md:text-base hover:bg-white/[0.05]">
                <Download className="w-4 h-4" />
                Export Size Sheet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
