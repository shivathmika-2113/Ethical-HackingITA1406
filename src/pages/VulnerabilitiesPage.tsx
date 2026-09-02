import { useState, useMemo } from 'react';
import { Search, Bug, Brain, ArrowRight, ShieldCheck } from 'lucide-react';
import { PageHeader, SectionCard, Tabs } from '@/components/ui/Layout';
import { SeverityBadge, RiskScore } from '@/components/ui/Badges';
import { RiskBar } from '@/components/ui/RiskBar';
import { Drawer } from '@/components/ui/Drawer';
import { useToast } from '@/components/ui/Toast';
import { vulnerabilities } from '@/data/mockData';
import type { Vulnerability } from '@/types';

export function VulnerabilitiesPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selected, setSelected] = useState<Vulnerability | null>(null);
  const [showRiskExplained, setShowRiskExplained] = useState(false);

  const filtered = useMemo(() => {
    return vulnerabilities.filter((v) => {
      const matchSearch = v.finding.toLowerCase().includes(search.toLowerCase()) || v.assetName.toLowerCase().includes(search.toLowerCase());
      const matchTab = activeTab === 'all' || v.severity === activeTab;
      return matchSearch && matchTab;
    });
  }, [search, activeTab]);

  const counts = {
    all: vulnerabilities.length,
    critical: vulnerabilities.filter((v) => v.severity === 'critical').length,
    high: vulnerabilities.filter((v) => v.severity === 'high').length,
    medium: vulnerabilities.filter((v) => v.severity === 'medium').length,
    low: vulnerabilities.filter((v) => v.severity === 'low').length,
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Vulnerability Intelligence" subtitle="Security findings detected across the hospital network" />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Critical', value: counts.critical, color: 'text-critical-700 bg-critical-50 border-critical-200' },
          { label: 'High', value: counts.high, color: 'text-high-700 bg-high-50 border-high-200' },
          { label: 'Medium', value: counts.medium, color: 'text-medium-700 bg-medium-50 border-medium-200' },
          { label: 'Low', value: counts.low, color: 'text-brand-700 bg-brand-50 border-brand-200' },
        ].map((s) => (
          <div key={s.label} className={`card p-5 border ${s.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-sm font-medium mt-0.5">{s.label}</p>
              </div>
              <Bug size={24} className="opacity-50" />
            </div>
          </div>
        ))}
      </div>

      <SectionCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vulnerabilities..."
              className="text-sm outline-none w-56 bg-transparent"
            />
          </div>
        </div>

        <Tabs
          tabs={[
            { id: 'all', label: 'All', count: counts.all },
            { id: 'critical', label: 'Critical', count: counts.critical },
            { id: 'high', label: 'High', count: counts.high },
            { id: 'medium', label: 'Medium', count: counts.medium },
            { id: 'low', label: 'Low', count: counts.low },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {['Severity', 'Finding', 'Asset', 'Service', 'Risk Score', 'Detected', 'Status'].map((h) => (
                  <th key={h} className="text-left py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => { setSelected(v); setShowRiskExplained(false); }}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-3"><SeverityBadge severity={v.severity} /></td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{v.finding}</td>
                  <td className="py-2.5 px-3 text-slate-600">{v.assetName}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{v.service}</td>
                  <td className="py-2.5 px-3"><RiskScore score={v.riskScore} /></td>
                  <td className="py-2.5 px-3 text-slate-500">{v.detected}</td>
                  <td className="py-2.5 px-3">
                    <span className={`badge ${v.status === 'open' ? 'badge-critical' : v.status === 'remediated' ? 'badge-success' : 'badge-medium'}`}>
                      {v.status === 'open' ? 'Open' : v.status === 'remediated' ? 'Remediated' : 'In Progress'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Detail drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.finding || ''}
        subtitle={selected ? `${selected.assetName} · ${selected.service}` : ''}
        width="max-w-xl"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <SeverityBadge severity={selected.severity} />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Risk Score</p>
              </div>
              <RiskScore score={selected.riskScore} size="lg" />
            </div>

            {/* Finding */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Finding</h4>
              <p className="text-sm text-slate-600 p-3 rounded-xl bg-slate-50 border border-slate-200">{selected.description}</p>
            </div>

            {/* Affected asset */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Affected Asset</h4>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Bug size={18} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{selected.assetName}</p>
                  <p className="text-xs text-slate-500">{selected.service}</p>
                </div>
              </div>
            </div>

            {/* Technical details */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Technical Details</h4>
              <p className="text-sm text-slate-600 p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">{selected.technicalDetails}</p>
            </div>

            {/* Healthcare impact */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Healthcare Impact</h4>
              <div className="flex items-start gap-2 p-3 rounded-xl bg-high-50 border border-high-200">
                <ShieldCheck size={16} className="text-high-600 mt-0.5 shrink-0" />
                <p className="text-sm text-high-800">{selected.healthcareImpact}</p>
              </div>
            </div>

            {/* Risk calculation */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-900">Risk Calculation</h4>
                <button
                  onClick={() => setShowRiskExplained((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-xs font-semibold hover:bg-brand-100 transition-colors"
                >
                  <Brain size={14} />
                  {showRiskExplained ? 'Hide' : 'Explain Risk'}
                </button>
              </div>
              {showRiskExplained ? (
                <div className="space-y-2.5 p-4 rounded-xl border border-brand-200 bg-brand-50/50 animate-fade-in">
                  <RiskBar label="Technical Exposure" score={Math.min(selected.riskScore + 5, 100)} delay={0} />
                  <RiskBar label="Asset Criticality" score={Math.min(selected.riskScore + 3, 100)} delay={100} />
                  <RiskBar label="Healthcare Impact" score={Math.min(selected.riskScore + 4, 100)} delay={200} />
                  <RiskBar label="Exploitability" score={Math.min(selected.riskScore - 5, 100)} delay={300} />
                  <div className="flex items-center justify-between mt-3 p-3 rounded-xl bg-slate-900 text-white">
                    <span className="text-sm font-medium">Final Risk Score</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{selected.riskScore}</span>
                      <span className="text-sm text-slate-300">/ 100</span>
                      <SeverityBadge severity={selected.severity} />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    AI score is a demonstration prototype score, not a certified medical safety decision.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-sm text-slate-600">Final Risk</span>
                  <div className="flex items-center gap-2">
                    <RiskScore score={selected.riskScore} size="md" />
                    <SeverityBadge severity={selected.severity} />
                  </div>
                </div>
              )}
            </div>

            {/* Recommended remediation */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Recommended Remediation</h4>
              <div className="flex items-start gap-2 p-3 rounded-xl bg-success-50 border border-success-200">
                <ArrowRight size={16} className="text-success-600 mt-0.5 shrink-0" />
                <p className="text-sm text-success-800">{selected.recommendation}</p>
              </div>
            </div>

            {/* Verification status */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Verification Status</h4>
              <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200">
                <span className={`badge ${selected.status === 'open' ? 'badge-critical' : 'badge-success'}`}>
                  {selected.status === 'open' ? 'Awaiting Remediation' : 'Verified'}
                </span>
                {selected.cve && <span className="text-xs font-mono text-slate-500">{selected.cve}</span>}
              </div>
            </div>

            {selected.status === 'open' && (
              <button
                onClick={() => toast('info', 'Remediation plan generated — navigate to Remediation Center')}
                className="btn-primary w-full"
              >
                Generate Remediation Plan
              </button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
