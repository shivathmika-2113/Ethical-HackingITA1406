import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ShieldCheck, Server, Network, Bug, AlertTriangle, TrendingUp,
  ArrowUpRight, ArrowDownRight, Activity, Cpu, Eye,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SectionCard } from '@/components/ui/Layout';
import { riskDistribution, securityScoreTrend, trafficChartData } from '@/data/mockData';
import type { PageId } from '@/types';
import {
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid,
} from 'recharts';

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  trend?: string;
  trendUp?: boolean;
  sublabel: string;
  subBreakdown?: { label: string; value: string; color: string }[];
  onClick?: () => void;
}

function KpiCard({ icon: Icon, label, value, suffix, trend, trendUp, sublabel, subBreakdown, onClick }: KpiCardProps) {
  return (
    <button
      onClick={onClick}
      className="card card-hover p-5 text-left group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
          <Icon size={20} className="text-slate-600 group-hover:text-brand-600 transition-colors" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-success-600' : 'text-critical-600'}`}>
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend}
          </div>
        )}
      </div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <AnimatedCounter value={value} className="text-3xl font-bold text-slate-900" />
        {suffix && <span className="text-lg text-slate-400 font-medium">{suffix}</span>}
      </div>
      <p className="text-xs text-slate-500 mt-1">{sublabel}</p>
      {subBreakdown && (
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
          {subBreakdown.map((b) => (
            <div key={b.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${b.color}`} />
              <span className="text-xs text-slate-600">{b.value} {b.label}</span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}

export function OverviewPage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const [score] = useState(72);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Healthcare Cyber Defense Center</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time visibility, risk analysis and controlled response across the hospital network.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KpiCard
          icon={ShieldCheck}
          label="Security Score"
          value={score}
          suffix="/ 100"
          trend="+8.4%"
          trendUp
          sublabel="from previous assessment"
          onClick={() => onNavigate('reports')}
        />
        <KpiCard
          icon={Server}
          label="Active Assets"
          value={184}
          sublabel="172 healthy, 12 requiring attention"
          onClick={() => onNavigate('assets')}
        />
        <KpiCard
          icon={Network}
          label="Open Ports"
          value={23}
          sublabel="6 unexpected"
          onClick={() => onNavigate('port-scanner')}
        />
        <KpiCard
          icon={Bug}
          label="Vulnerabilities"
          value={14}
          sublabel="across all assets"
          subBreakdown={[
            { label: 'Critical', value: '2', color: 'bg-critical-500' },
            { label: 'High', value: '5', color: 'bg-high-500' },
            { label: 'Med', value: '7', color: 'bg-medium-500' },
          ]}
          onClick={() => onNavigate('vulnerabilities')}
        />
        <KpiCard
          icon={AlertTriangle}
          label="Active Incidents"
          value={3}
          sublabel="requiring response"
          subBreakdown={[
            { label: 'Critical', value: '1', color: 'bg-critical-500' },
            { label: 'High', value: '2', color: 'bg-high-500' },
          ]}
          onClick={() => onNavigate('incidents')}
        />
      </div>

      {/* Security Posture + Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard title="Network Security Posture" subtitle="Overall security score based on asset, vulnerability and threat analysis">
          <div className="flex flex-col items-center py-4">
            <ProgressRing value={score} size={180} label="out of 100" sublabel="Moderate Risk" />
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                <TrendingUp size={14} className="text-success-600" />
                <span className="text-xs font-semibold text-success-600">+8.4% improvement</span>
              </div>
              <span className="text-xs text-slate-400">vs last assessment</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Risk Distribution" subtitle="Vulnerabilities by severity level">
          <div className="flex items-center justify-center py-2">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  animationDuration={800}
                >
                  {riskDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {riskDistribution.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                  <span className="text-sm text-slate-600">{r.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{r.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Security Score Trend" subtitle="Last 7 assessments">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={securityScoreTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2570eb" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#2570eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="#2570eb" strokeWidth={2.5} fill="url(#scoreGrad)" animationDuration={1000} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Attack Surface + Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard title="Attack Surface Overview" subtitle="Network exposure summary" className="lg:col-span-1">
          <div className="space-y-3">
            {[
              { icon: Server, label: 'Assets', value: 184, color: 'text-brand-600 bg-brand-50' },
              { icon: Network, label: 'Exposed Services', value: 23, color: 'text-teal-600 bg-teal-50' },
              { icon: Bug, label: 'Vulnerabilities', value: 14, color: 'text-critical-600 bg-critical-50' },
              { icon: Cpu, label: 'Outdated Services', value: 7, color: 'text-high-600 bg-high-50' },
              { icon: Eye, label: 'Suspicious Patterns', value: 4, color: 'text-medium-600 bg-medium-50' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color}`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <AnimatedCounter value={item.value} className="text-xl font-bold text-slate-900" />
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Network Activity" subtitle="Events per minute — baseline vs detected" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trafficChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="detectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2570eb" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#2570eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="baseline" stroke="#2570eb" strokeWidth={2} fill="url(#baselineGrad)" animationDuration={1000} />
              <Area type="monotone" dataKey="detected" stroke="#dc2626" strokeWidth={2} fill="url(#detectedGrad)" animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-brand-500" />
              <span className="text-xs text-slate-500">Normal baseline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-critical-500" />
              <span className="text-xs text-slate-500">Detected activity</span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Lifecycle banner */}
      <SectionCard>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            {['Discover', 'Analyze', 'Prioritize', 'Investigate', 'Approve', 'Remediate', 'Verify'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-xs font-semibold text-slate-700">{step}</span>
                </div>
                {i < 6 && <ArrowUpRight size={14} className="text-slate-300 rotate-45" />}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Activity size={14} className="text-brand-500" />
            <span>Complete cybersecurity lifecycle</span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
