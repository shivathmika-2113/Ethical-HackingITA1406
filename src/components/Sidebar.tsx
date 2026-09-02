import type { PageId } from '@/types';
import type { LucideIcon } from 'lucide-react';
import {
  ShieldCheck, Network, ScanLine, Server, Bug, Brain, Activity, Map,
  AlertTriangle, Wrench, FileText, Settings, Radio,
} from 'lucide-react';

const navGroups: { label: string; items: { id: PageId; label: string; icon: LucideIcon }[] }[] = [
  {
    label: 'Monitor',
    items: [
      { id: 'overview', label: 'Overview', icon: ShieldCheck },
      { id: 'network-map', label: 'Network Map', icon: Map },
      { id: 'network-discovery', label: 'Network Discovery', icon: Network },
      { id: 'port-scanner', label: 'Port Scanner', icon: ScanLine },
      { id: 'assets', label: 'Assets', icon: Server },
      { id: 'vulnerabilities', label: 'Vulnerabilities', icon: Bug },
    ],
  },
  {
    label: 'Analyze',
    items: [
      { id: 'ai-analyst', label: 'AI Security Analyst', icon: Brain },
      { id: 'threat-detection', label: 'Threat Detection', icon: Activity },
    ],
  },
  {
    label: 'Respond',
    items: [
      { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
      { id: 'remediation', label: 'Remediation', icon: Wrench },
      { id: 'reports', label: 'Reports', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function Sidebar({
  current,
  onNavigate,
}: {
  current: PageId;
  onNavigate: (page: PageId) => void;
}) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center shadow-sm">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">HealthShield AI</h1>
            <p className="text-[11px] text-slate-500 leading-tight">Healthcare Cyber Defense</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = current === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`nav-item w-full ${active ? 'nav-item-active' : ''}`}
                  >
                    <Icon size={18} className={active ? 'text-brand-600' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom status */}
      <div className="border-t border-slate-200 px-4 py-4 space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success-500" />
          </span>
          <span className="text-slate-600 font-medium">Network Monitoring Active</span>
        </div>
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
            <Radio size={16} className="text-brand-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">Demo General Hospital</p>
            <p className="text-[10px] text-slate-500 truncate">Security Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
