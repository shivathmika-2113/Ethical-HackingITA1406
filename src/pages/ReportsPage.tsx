import { useState } from 'react';
import {
  Download, Shield, Server, Network, Bug,
  AlertTriangle, Brain, Wrench, TrendingUp, Loader2,
} from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/ui/Layout';
import { useToast } from '@/components/ui/Toast';
import { securityScoreTrend, riskDistribution, trafficChartData } from '@/data/mockData';
import { assets, vulnerabilities, incidents, remediations } from '@/data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';

export function ReportsPage() {
  const toast = useToast();
  const [generating, setGenerating] = useState(false);

  const generateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast('success', 'Security report generated — ready for download');
    }, 2500);
  };

  const reportSections = [
    { icon: Shield, label: 'Hospital Security Posture', value: '72 / 100', color: 'text-brand-600 bg-brand-50' },
    { icon: Server, label: 'Asset Inventory', value: `${assets.length} assets`, color: 'text-teal-600 bg-teal-50' },
    { icon: Network, label: 'Open Ports', value: '23 ports', color: 'text-brand-600 bg-brand-50' },
    { icon: Bug, label: 'Vulnerabilities', value: `${vulnerabilities.length} findings`, color: 'text-critical-600 bg-critical-50' },
    { icon: AlertTriangle, label: 'Threat Events', value: `${incidents.length} incidents`, color: 'text-high-600 bg-high-50' },
    { icon: Brain, label: 'AI Findings', value: '1 insight', color: 'text-brand-600 bg-brand-50' },
    { icon: Wrench, label: 'Remediation History', value: `${remediations.length} actions`, color: 'text-medium-600 bg-medium-50' },
    { icon: TrendingUp, label: 'Security Score Trend', value: '+8.4%', color: 'text-success-600 bg-success-50' },
  ];

  const assetTypeData = [
    { name: 'Servers', count: 5 },
    { name: 'Workstations', count: 3 },
    { name: 'Medical Devices', count: 1 },
    { name: 'Network', count: 2 },
    { name: 'IoT', count: 1 },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Security Reports"
        subtitle="Comprehensive security assessment and audit reporting"
      >
        <button onClick={generateReport} disabled={generating} className="btn-primary">
          {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {generating ? 'Generating...' : 'Generate Security Report'}
        </button>
      </PageHeader>

      {/* Report sections overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {reportSections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
                <Icon size={18} />
              </div>
              <p className="text-lg font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Security Score Trend" subtitle="Last 7 assessments">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={securityScoreTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="reportScoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2570eb" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#2570eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="#2570eb" strokeWidth={2.5} fill="url(#reportScoreGrad)" animationDuration={1000} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Vulnerability Distribution" subtitle="By severity level">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2} animationDuration={800}>
                  {riskDistribution.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {riskDistribution.map((r) => (
              <div key={r.name} className="text-center">
                <span className="inline-block w-2.5 h-2.5 rounded-full mb-1" style={{ background: r.color }} />
                <p className="text-xs text-slate-500">{r.name}</p>
                <p className="text-sm font-bold text-slate-900">{r.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Asset Distribution" subtitle="By asset type">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={assetTypeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="count" fill="#2570eb" radius={[6, 6, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Network Activity Summary" subtitle="Events per minute over last 30 intervals">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trafficChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="reportTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="detected" stroke="#0d9488" strokeWidth={2} fill="url(#reportTraffic)" animationDuration={1000} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Report summary table */}
      <SectionCard title="Report Summary" subtitle="Key findings and metrics">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {['Metric', 'Value', 'Status', 'Trend'].map((h) => (
                  <th key={h} className="text-left py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Security Score', value: '72 / 100', status: 'Medium Risk', trend: '+8.4%', positive: true },
                { metric: 'Total Assets', value: '184', status: 'Healthy', trend: '+2', positive: true },
                { metric: 'Open Ports', value: '23', status: '6 Unexpected', trend: '-1', positive: true },
                { metric: 'Critical Vulnerabilities', value: '2', status: 'Requires Action', trend: '0', positive: false },
                { metric: 'Active Incidents', value: '3', status: 'Investigating', trend: '+1', positive: false },
                { metric: 'Remediation Verified', value: '1', status: 'Complete', trend: '+1', positive: true },
              ].map((row) => (
                <tr key={row.metric} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-900">{row.metric}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{row.value}</td>
                  <td className="py-2.5 px-3 text-slate-600">{row.status}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-xs font-semibold ${row.positive ? 'text-success-600' : 'text-critical-600'}`}>
                      {row.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Generating overlay */}
      {generating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-pop p-8 flex flex-col items-center animate-fade-in-up">
            <Loader2 size={40} className="text-brand-600 animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-900">Generating Security Report...</p>
            <p className="text-xs text-slate-500 mt-1">Compiling findings, charts and recommendations</p>
          </div>
        </div>
      )}
    </div>
  );
}
