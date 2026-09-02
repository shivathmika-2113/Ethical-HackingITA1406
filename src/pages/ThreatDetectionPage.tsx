import { useState, useEffect } from 'react';
import {
  Activity, Network, Lock, Zap, Eye, Radio,
  TrendingUp,
} from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/ui/Layout';
import { SeverityBadge } from '@/components/ui/Badges';
import { liveEventStream, trafficChartData } from '@/data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const threatCards = [
  { icon: Network, label: 'Network Scanning', count: 1, severity: 'high' as const, color: 'text-high-600 bg-high-50' },
  { icon: Lock, label: 'Unauthorized Access', count: 2, severity: 'critical' as const, color: 'text-critical-600 bg-critical-50' },
  { icon: Zap, label: 'DoS Pattern', count: 0, severity: 'low' as const, color: 'text-brand-600 bg-brand-50' },
  { icon: Eye, label: 'Suspicious Communication', count: 1, severity: 'high' as const, color: 'text-high-600 bg-high-50' },
  { icon: Radio, label: 'Malware-like Activity', count: 0, severity: 'low' as const, color: 'text-brand-600 bg-brand-50' },
];

export function ThreatDetectionPage() {
  const [events, setEvents] = useState(liveEventStream.slice(0, 3));
  const [allEvents] = useState(liveEventStream);

  useEffect(() => {
    let i = 3;
    const interval = setInterval(() => {
      if (i >= allEvents.length) { clearInterval(interval); return; }
      setEvents((prev) => [...prev, allEvents[i]]);
      i++;
    }, 1500);
    return () => clearInterval(interval);
  }, [allEvents]);

  return (
    <div className="space-y-5">
      <PageHeader title="Threat Detection" subtitle="Real-time monitoring of network threats and anomalies" />

      {/* Threat type cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {threatCards.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="card card-hover p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${t.color}`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{t.count}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t.label}</p>
              {t.count > 0 && (
                <div className="mt-2">
                  <SeverityBadge severity={t.severity} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Traffic chart */}
      <SectionCard title="Network Activity" subtitle="Events per minute — baseline vs detected activity">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={trafficChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tdDetected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tdBaseline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2570eb" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#2570eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Area type="monotone" dataKey="baseline" stroke="#2570eb" strokeWidth={2} fill="url(#tdBaseline)" name="Normal baseline" animationDuration={1000} />
            <Area type="monotone" dataKey="detected" stroke="#dc2626" strokeWidth={2} fill="url(#tdDetected)" name="Detected activity" animationDuration={1200} />
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

      {/* Live event stream */}
      <SectionCard
        title="Live Event Stream"
        subtitle="Real-time network events as they are detected"
        action={
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-success-50 border border-success-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success-500" />
            </span>
            <span className="text-xs font-semibold text-success-700">Live</span>
          </div>
        }
      >
        <div className="space-y-1.5 max-h-80 overflow-y-auto scrollbar-thin">
          {events.map((event, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors animate-fade-in-up"
            >
              <span className="text-xs font-mono font-semibold text-slate-500 w-20 shrink-0">{event.time}</span>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-mono text-xs text-slate-700 truncate">{event.source}</span>
                <span className="text-slate-300">→</span>
                <span className="font-mono text-xs text-slate-700 truncate">{event.dest}</span>
              </div>
              <span className="text-sm text-slate-600 truncate">{event.event}</span>
              <SeverityBadge severity={event.severity} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Monitoring stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Events / Min', value: '142', icon: Activity, color: 'text-brand-600 bg-brand-50' },
          { label: 'Anomaly Score', value: '0.87', icon: TrendingUp, color: 'text-high-600 bg-high-50' },
          { label: 'Assets Monitored', value: '184', icon: Network, color: 'text-teal-600 bg-teal-50' },
          { label: 'AI Analyses', value: '4,602', icon: Eye, color: 'text-brand-600 bg-brand-50' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
