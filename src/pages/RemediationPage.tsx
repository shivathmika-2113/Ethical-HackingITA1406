import { useState } from 'react';
import {
  Wrench, CheckCircle2, XCircle, Loader2,
  Shield, Stethoscope, UserCheck, RefreshCw, Settings,
} from 'lucide-react';
import { PageHeader, SectionCard, Tabs } from '@/components/ui/Layout';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { remediations as initialRemediations } from '@/data/mockData';
import type { Remediation } from '@/types';

export function RemediationPage() {
  const toast = useToast();
  const [remediations, setRemediations] = useState<Remediation[]>(initialRemediations);
  const [activeTab, setActiveTab] = useState('pending');
  const [selected, setSelected] = useState<Remediation | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [verified, setVerified] = useState(false);

  const filtered = remediations.filter((r) => {
    if (activeTab === 'pending') return r.approval === 'pending';
    if (activeTab === 'approved') return r.approval === 'approved' && r.status !== 'verified';
    if (activeTab === 'verified') return r.status === 'verified';
    if (activeTab === 'failed') return r.status === 'failed';
    return true;
  });

  const counts = {
    pending: remediations.filter((r) => r.approval === 'pending').length,
    approved: remediations.filter((r) => r.approval === 'approved' && r.status !== 'verified').length,
    verified: remediations.filter((r) => r.status === 'verified').length,
    failed: remediations.filter((r) => r.status === 'failed').length,
  };

  const approve = (id: string) => {
    setRemediations((prev) => prev.map((r) =>
      r.id === id ? { ...r, approval: 'approved', status: 'in-progress' } : r
    ));
    setSelected((prev) => prev ? { ...prev, approval: 'approved', status: 'in-progress' } : null);
    setShowApproveModal(false);
    toast('success', 'Remediation approved — change can now be applied');
  };

  const reject = (id: string) => {
    setRemediations((prev) => prev.map((r) =>
      r.id === id ? { ...r, approval: 'rejected', status: 'failed' } : r
    ));
    toast('info', 'Remediation rejected');
  };

  const applySimulated = (id: string) => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setRemediations((prev) => prev.map((r) =>
        r.id === id ? { ...r, status: 'applied' } : r
      ));
      setSelected((prev) => prev ? { ...prev, status: 'applied' } : null);
      toast('success', 'Configuration change applied in simulation');
    }, 2000);
  };

  const verify = (id: string) => {
    setRemediations((prev) => prev.map((r) =>
      r.id === id ? { ...r, status: 'verified' } : r
    ));
    setSelected((prev) => prev ? { ...prev, status: 'verified' } : null);
    setVerified(true);
    toast('success', 'Re-scan verified — remediation successful');
  };

  const openRemediation = (r: Remediation) => {
    setSelected(r);
    setVerified(r.status === 'verified');
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Remediation Center" subtitle="Controlled remediation workflow with clinical impact assessment and administrator approval" />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Approval', value: counts.pending, icon: UserCheck, color: 'text-medium-600 bg-medium-50' },
          { label: 'Approved / In Progress', value: counts.approved, icon: Settings, color: 'text-brand-600 bg-brand-50' },
          { label: 'Verified', value: counts.verified, icon: CheckCircle2, color: 'text-success-600 bg-success-50' },
          { label: 'Failed', value: counts.failed, icon: XCircle, color: 'text-critical-600 bg-critical-50' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      <SectionCard>
        <Tabs
          tabs={[
            { id: 'pending', label: 'Pending Approval', count: counts.pending },
            { id: 'approved', label: 'Approved', count: counts.approved },
            { id: 'verified', label: 'Verified', count: counts.verified },
            { id: 'failed', label: 'Failed', count: counts.failed },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">No remediations in this category</p>
          )}
          {filtered.map((r) => (
            <div key={r.id} className="card p-4 card-hover">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Wrench size={16} className="text-brand-600" />
                    <h4 className="text-sm font-semibold text-slate-900">{r.finding}</h4>
                  </div>
                  <p className="text-xs text-slate-500 ml-6">{r.action}</p>
                  <div className="flex items-center gap-4 mt-3 ml-6">
                    <div className="flex items-center gap-1.5">
                      <Shield size={14} className="text-slate-400" />
                      <span className="text-xs text-slate-600">{r.assetName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Stethoscope size={14} className="text-slate-400" />
                      <span className="text-xs text-slate-600">{r.clinicalImpact}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${
                    r.approval === 'pending' ? 'badge-medium' :
                    r.approval === 'approved' ? 'badge-success' : 'badge-critical'
                  }`}>
                    {r.approval === 'pending' ? 'Pending' : r.approval === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                  <span className={`badge ${
                    r.status === 'awaiting' ? 'badge-neutral' :
                    r.status === 'verified' ? 'badge-success' :
                    r.status === 'failed' ? 'badge-critical' : 'badge-low'
                  }`}>
                    {r.status === 'awaiting' ? 'Awaiting Authorization' :
                     r.status === 'in-progress' ? 'In Progress' :
                     r.status === 'applied' ? 'Applied' :
                     r.status === 'verified' ? 'Verified' : 'Failed'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 ml-6">
                <button onClick={() => openRemediation(r)} className="btn-secondary text-xs py-2 px-3">
                  View Plan
                </button>
                {r.approval === 'pending' && (
                  <>
                    <button onClick={() => { setSelected(r); setShowApproveModal(true); }} className="btn-primary text-xs py-2 px-3">
                  <CheckCircle2 size={14} />
                  Approve
                </button>
                    <button onClick={() => reject(r.id)} className="btn-secondary text-xs py-2 px-3 text-critical-600 hover:bg-critical-50">
                  <XCircle size={14} />
                  Reject
                </button>
                  </>
                )}
                {r.approval === 'approved' && r.status !== 'verified' && r.status !== 'applied' && (
                  <button onClick={() => applySimulated(r.id)} disabled={simulating} className="btn-primary text-xs py-2 px-3">
                    {simulating ? <Loader2 size={14} className="animate-spin" /> : <Settings size={14} />}
                    Apply Simulated Change
                  </button>
                )}
                {r.status === 'applied' && (
                  <button onClick={() => verify(r.id)} className="btn-primary text-xs py-2 px-3">
                    <RefreshCw size={14} />
                    Verify
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Detail drawer */}
      <Drawer
        open={!!selected && !showApproveModal}
        onClose={() => setSelected(null)}
        title={selected?.finding || ''}
        subtitle={selected?.assetName}
        width="max-w-xl"
      >
        {selected && (
          <div className="space-y-5">
            {/* DEMO badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-50 border border-brand-200">
              <span className="badge badge-primary text-[10px]">DEMO / SIMULATION MODE</span>
              <span className="text-xs text-brand-700">Changes are simulated for safe demonstration</span>
            </div>

            {/* Steps */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Remediation Plan</h4>
              <div className="space-y-2">
                {selected.steps.map((step, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${
                    step.done ? 'bg-success-50 border-success-200' : 'bg-white border-slate-200 opacity-60'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      step.done ? 'bg-success-100 text-success-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step.done ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    <span className={`text-sm font-medium ${step.done ? 'text-success-700' : 'text-slate-500'}`}>
                      Step {i + 1}: {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical impact */}
            <div className="p-4 rounded-xl border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Stethoscope size={16} className="text-high-600" />
                Clinical Impact Assessment
              </h4>
              <p className="text-sm text-slate-600">{selected.clinicalImpact}</p>
            </div>

            {/* Before/After if verified */}
            {verified && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-success-50 border border-success-200">
                  <CheckCircle2 size={18} className="text-success-600" />
                  <p className="text-sm font-semibold text-success-700">Remediation Successful</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-critical-200 bg-critical-50">
                    <p className="text-xs font-semibold text-critical-600 uppercase tracking-wide mb-2">Before</p>
                    {selected.port && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-2xl font-bold text-critical-700">{selected.port}</span>
                        <span className="badge-critical">OPEN</span>
                      </div>
                    )}
                    <p className="text-sm text-slate-600">Security Score: <span className="font-mono font-bold text-critical-700">{selected.beforeScore}</span></p>
                  </div>
                  <div className="p-4 rounded-xl border border-success-200 bg-success-50">
                    <p className="text-xs font-semibold text-success-600 uppercase tracking-wide mb-2">After</p>
                    {selected.port && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-2xl font-bold text-success-700">{selected.port}</span>
                        <span className="badge-success">CLOSED</span>
                      </div>
                    )}
                    <p className="text-sm text-slate-600">Security Score: <span className="font-mono font-bold text-success-700">{selected.afterScore}</span></p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-700">Security Score Improvement</span>
                    <span className="text-sm font-bold text-success-600">+{selected.afterScore - selected.beforeScore} points</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-critical-100 overflow-hidden">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-success-400 to-success-500 transition-all duration-1000" style={{ width: `${selected.afterScore}%` }} />
                    <div className="absolute top-0 h-full w-px bg-slate-400" style={{ left: `${selected.beforeScore}%` }} />
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-slate-500">
                    <span>{selected.beforeScore} (Before)</span>
                    <span>{selected.afterScore} (After)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Approval modal */}
      <Modal
        open={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Administrator Approval Required"
        footer={
          <>
            <button onClick={() => setShowApproveModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => selected && approve(selected.id)} className="btn-primary">
              <UserCheck size={16} />
              Approve Change
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-critical-50 border border-critical-200">
            <Shield size={20} className="text-critical-600" />
            <p className="text-sm text-critical-700 font-medium">This change affects a critical clinical asset.</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Finding</span>
              <span className="font-medium text-slate-900">{selected?.finding}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Asset</span>
              <span className="font-medium text-slate-900">{selected?.assetName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Mode</span>
              <span className="font-medium text-brand-600">DEMO / SIMULATION</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Clinical Impact</span>
              <span className="font-medium text-high-700">Requires validation</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
