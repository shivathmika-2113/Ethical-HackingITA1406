import { useState } from 'react';
import {
  AlertTriangle, ArrowRight, Shield, Brain, Activity,
  CheckCircle2, Eye, Link2,
} from 'lucide-react';
import { PageHeader, SectionCard, Tabs } from '@/components/ui/Layout';
import { SeverityBadge, RiskScore } from '@/components/ui/Badges';
import { Drawer } from '@/components/ui/Drawer';
import { useToast } from '@/components/ui/Toast';
import { incidents } from '@/data/mockData';
import type { Incident } from '@/types';

export function IncidentsPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [selected, setSelected] = useState<Incident | null>(null);

  const filtered = incidents.filter((i) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return i.status === 'open';
    if (activeTab === 'investigating') return i.status === 'investigating';
    if (activeTab === 'resolved') return i.status === 'resolved';
    return true;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      open: 'badge-high', investigating: 'badge-critical', contained: 'badge-medium', resolved: 'badge-success',
    };
    return <span className={map[status] || 'badge-neutral'}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Security Incidents" subtitle="Track, investigate and respond to security incidents" />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Incidents', value: incidents.length, color: 'text-critical-600 bg-critical-50' },
          { label: 'Critical', value: incidents.filter((i) => i.severity === 'critical').length, color: 'text-critical-600 bg-critical-50' },
          { label: 'Investigating', value: incidents.filter((i) => i.status === 'investigating').length, color: 'text-high-600 bg-high-50' },
          { label: 'Avg AI Confidence', value: '92%', color: 'text-brand-600 bg-brand-50' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
              <AlertTriangle size={18} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <SectionCard>
        <Tabs
          tabs={[
            { id: 'all', label: 'All', count: incidents.length },
            { id: 'open', label: 'Open', count: incidents.filter((i) => i.status === 'open').length },
            { id: 'investigating', label: 'Investigating', count: incidents.filter((i) => i.status === 'investigating').length },
            { id: 'resolved', label: 'Resolved', count: incidents.filter((i) => i.status === 'resolved').length },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {['Incident ID', 'Severity', 'Type', 'Affected Asset', 'Detected', 'AI Confidence', 'Status'].map((h) => (
                  <th key={h} className="text-left py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => setSelected(inc)}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{inc.id}</td>
                  <td className="py-2.5 px-3"><SeverityBadge severity={inc.severity} /></td>
                  <td className="py-2.5 px-3 text-slate-700">{inc.type}</td>
                  <td className="py-2.5 px-3 text-slate-600">{inc.affectedAsset}</td>
                  <td className="py-2.5 px-3 text-slate-500">{inc.detected}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-brand-500" style={{ width: `${inc.aiConfidence}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{inc.aiConfidence}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">{statusBadge(inc.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Incident investigation drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.id} — ${selected.type}` : ''}
        subtitle={selected?.affectedAsset}
        width="max-w-xl"
      >
        {selected && (
          <div className="space-y-5">
            {/* Summary */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <SeverityBadge severity={selected.severity} />
              {statusBadge(selected.status)}
              <div className="flex-1" />
              <RiskScore score={selected.riskScore} size="md" />
            </div>

            {/* Incident summary */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Incident Summary</h4>
              <p className="text-sm text-slate-600 p-3 rounded-xl bg-slate-50 border border-slate-200">{selected.summary}</p>
            </div>

            {/* Affected assets */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Affected Assets</h4>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200">
                <div className="w-9 h-9 rounded-lg bg-critical-50 flex items-center justify-center">
                  <Shield size={18} className="text-critical-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{selected.affectedAsset}</p>
                  <p className="text-xs text-slate-500">Criticality: {selected.severity.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Event timeline */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Event Timeline</h4>
              <div className="relative pl-6">
                <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-200" />
                {selected.timeline.map((event, i) => (
                  <div key={i} className="relative pb-3">
                    <div className="absolute -left-4 top-1.5 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-brand-100" />
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono font-semibold text-brand-600 w-20 shrink-0">{event.time}</span>
                      <span className="text-sm text-slate-700">{event.event}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Analysis */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Brain size={16} className="text-brand-600" />
                AI Analysis
              </h4>
              <div className="p-4 rounded-xl border border-brand-200 bg-brand-50/50">
                <p className="text-sm text-slate-700">{selected.aiAnalysis}</p>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-brand-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">AI Confidence</span>
                    <span className="text-sm font-bold text-brand-700">{selected.aiConfidence}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Risk Score</span>
                    <RiskScore score={selected.riskScore} />
                  </div>
                </div>
              </div>
            </div>

            {/* Correlated events */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Link2 size={16} className="text-brand-600" />
                Correlated Security Events
              </h4>
              <p className="text-xs text-slate-500 mb-3">{selected.correlationSummary}</p>
              <div className="space-y-2">
                {selected.correlatedEvents.map((ce, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-brand-700">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{ce.type}</p>
                      <p className="text-xs text-slate-500">{ce.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related events */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Related Events</h4>
              <div className="flex flex-wrap gap-2">
                {selected.relatedEvents.map((e) => (
                  <span key={e} className="badge-neutral">{e}</span>
                ))}
              </div>
            </div>

            {/* Recommended actions */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Recommended Actions</h4>
              <div className="space-y-1.5">
                {selected.recommendedActions.map((action, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
                    <ArrowRight size={14} className="text-brand-600 shrink-0" />
                    <span className="text-sm text-slate-700">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Response status */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Response Status</h4>
              <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200">
                <Activity size={16} className="text-high-600" />
                <span className="text-sm font-medium text-slate-700 capitalize">{selected.status}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => toast('info', 'Incident acknowledged — assigned to response team')}
                className="btn-secondary flex-1"
              >
                <Eye size={16} />
                Acknowledge
              </button>
              <button
                onClick={() => toast('success', 'Incident escalated — remediation workflow initiated')}
                className="btn-primary flex-1"
              >
                <CheckCircle2 size={16} />
                Escalate
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
