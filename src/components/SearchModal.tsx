import { useEffect, useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import type { PageId } from '@/types';

const pages: { id: PageId; label: string; group: string }[] = [
  { id: 'overview', label: 'Overview Dashboard', group: 'Monitor' },
  { id: 'network-map', label: 'Hospital Network Map', group: 'Monitor' },
  { id: 'network-discovery', label: 'Network Discovery', group: 'Monitor' },
  { id: 'port-scanner', label: 'Port Scanner', group: 'Monitor' },
  { id: 'assets', label: 'Asset Inventory', group: 'Monitor' },
  { id: 'vulnerabilities', label: 'Vulnerability Center', group: 'Monitor' },
  { id: 'ai-analyst', label: 'AI Security Analyst', group: 'Analyze' },
  { id: 'threat-detection', label: 'Threat Detection', group: 'Analyze' },
  { id: 'incidents', label: 'Security Incidents', group: 'Respond' },
  { id: 'remediation', label: 'Remediation Center', group: 'Respond' },
  { id: 'reports', label: 'Security Reports', group: 'Respond' },
  { id: 'settings', label: 'Settings', group: 'Respond' },
];

export function SearchModal({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
}) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (open) { setQuery(''); setSelected(0); }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && filtered[selected]) { onNavigate(filtered[selected].id); onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const filtered = pages.filter((p) =>
    p.label.toLowerCase().includes(query.toLowerCase()) ||
    p.group.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[55] flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-pop animate-fade-in-up overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200">
          <Search size={18} className="text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search pages, assets, vulnerabilities..."
            className="flex-1 text-sm outline-none placeholder:text-slate-400"
          />
          <kbd className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono font-semibold text-slate-500">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-sm text-slate-400 text-center">No results found</p>
          )}
          {filtered.map((page, i) => (
            <button
              key={page.id}
              onClick={() => { onNavigate(page.id); onClose(); }}
              onMouseEnter={() => setSelected(i)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                selected === i ? 'bg-brand-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 w-16">{page.group}</span>
                <span className="text-sm font-medium text-slate-700">{page.label}</span>
              </div>
              <ArrowRight size={14} className={selected === i ? 'text-brand-600' : 'text-transparent'} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
