import { useEffect, useState } from 'react';
import {
  Play, Loader2, ShieldAlert, ArrowRight, CheckCircle2,
  Wrench, FileCheck, Stethoscope, ClipboardCheck, UserCheck,
  Settings, RefreshCw, AlertTriangle, Lock,
} from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/ui/Layout';
import { SeverityBadge, RiskScore } from '@/components/ui/Badges';
import { RiskBar } from '@/components/ui/RiskBar';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { portScanResults } from '@/data/mockData';
import type { ScanResult } from '@/types';

const stepIcons = [FileCheck, Settings, Stethoscope, ClipboardCheck, UserCheck, Wrench, RefreshCw];

export function PortScannerPage() {
  const toast = useToast();
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [selectedPort, setSelectedPort] = useState<ScanResult | null>(null);
  const [showRemediation, setShowRemediation] = useState(false);
  const [remediationStep, setRemediationStep] = useState(0);
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [approvalGranted, setApprovalGranted] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [remediationDone, setRemediationDone] = useState(false);

  const startScan = () => {
    setScanning(true);
    setProgress(0);
    setResults([]);
  };

  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setScanning(false);
          setResults(portScanResults);
          toast('success', 'Port scan complete — 15 open ports found');
          return 100;
        }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [scanning, toast]);

  const startRemediation = () => {
    setShowRemediation(true);
    setRemediationStep(0);
    setApprovalRequested(false);
    setApprovalGranted(false);
    setRemediationDone(false);
  };

  const advanceStep = () => {
    if (remediationStep < 4) {
      setRemediationStep((s) => s + 1);
    }
  };

  const requestApproval = () => {
    setApprovalRequested(true);
    setShowApprovalModal(true);
  };

  const grantApproval = () => {
    setShowApprovalModal(false);
    setApprovalGranted(true);
    setRemediationStep(5);
    toast('info', 'Administrator approval granted — proceeding with simulated change');
  };

  const applySimulatedChange = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setRemediationStep(6);
      toast('success', 'Configuration change applied in simulation');
    }, 2000);
  };

  const verifyRemediation = () => {
    setRemediationDone(true);
    toast('success', 'Re-scan verified — Port 23 is now CLOSED');
  };

  const isCritical = selectedPort?.risk === 'critical';

  return (
    <div className="space-y-5">
      <PageHeader title="Port & Service Security Scanner" subtitle="Authorized assessment of open ports and running services" />

      {/* Warning banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-medium-50 border border-medium-200">
        <ShieldAlert size={18} className="text-medium-600 shrink-0" />
        <p className="text-sm font-medium text-medium-800">
          Only scan systems and networks for which you have explicit authorization.
        </p>
      </div>

      {/* Scan config */}
      <SectionCard title="Scan Configuration">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Target IP / CIDR</label>
            <input className="input font-mono" defaultValue="192.168.1.10" placeholder="192.168.1.10" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Scan Profile</label>
            <select className="select" defaultValue="standard">
              <option value="quick">Quick</option>
              <option value="standard">Standard</option>
              <option value="enum">Service Enumeration</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Port Range</label>
            <select className="select" defaultValue="common">
              <option value="common">Common Ports</option>
              <option value="1-1024">1-1024</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Service Detection</label>
            <label className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-brand-600" />
              <span className="text-sm text-slate-700">Enable service detection</span>
            </label>
          </div>
        </div>
        <div className="mt-4">
          <button onClick={startScan} disabled={scanning} className="btn-primary">
            {scanning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {scanning ? 'Scanning...' : 'Start Authorized Scan'}
          </button>
        </div>
      </SectionCard>

      {/* Scanning progress */}
      {scanning && (
        <SectionCard>
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Scanning 192.168.1.10...</span>
              <span className="font-mono font-semibold text-brand-600">{progress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-teal-500 transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
              <Loader2 size={12} className="animate-spin" />
              Analyzing ports and identifying services...
            </div>
          </div>
        </SectionCard>
      )}

      {/* Results table */}
      {results.length > 0 && (
        <SectionCard title="Scan Results" subtitle={`${results.length} ports analyzed`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  {['IP', 'Port', 'Protocol', 'Service', 'Version', 'State', 'Expected?', 'Risk'].map((h) => (
                    <th key={h} className="text-left py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedPort(r)}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 px-3 font-mono text-slate-700">{r.ip}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{r.port}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.protocol}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{r.service}</td>
                    <td className="py-2.5 px-3 text-slate-500">{r.version}</td>
                    <td className="py-2.5 px-3">
                      <span className={`badge ${r.state === 'open' ? 'badge-success' : 'badge-neutral'}`}>
                        {r.state.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {r.expected ? (
                        <span className="badge-success">YES</span>
                      ) : (
                        <span className="badge-critical">NO</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3"><SeverityBadge severity={r.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Port detail drawer */}
      <Drawer
        open={!!selectedPort && !showRemediation}
        onClose={() => setSelectedPort(null)}
        title={selectedPort ? `Port ${selectedPort.port}` : ''}
        subtitle={selectedPort ? `${selectedPort.service} · ${selectedPort.ip}` : ''}
      >
        {selectedPort && (
          <div className="space-y-5">
            {/* Port summary */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCritical ? 'bg-critical-50' : 'bg-brand-50'}`}>
                {isCritical ? <AlertTriangle size={24} className="text-critical-600" /> : <Lock size={24} className="text-brand-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">{selectedPort.service} Service</p>
                <p className="text-xs text-slate-500">State: {selectedPort.state.toUpperCase()} · Risk: <SeverityBadge severity={selectedPort.risk} /></p>
              </div>
              <RiskScore score={selectedPort.riskScore} size="lg" />
            </div>

            {/* Why this matters */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Why This Matters</h4>
              <p className="text-sm text-slate-600 p-3 rounded-xl bg-slate-50 border border-slate-200">
                {selectedPort.service === 'Telnet' && 'Telnet provides insecure remote communication and may expose credentials or administrative access.'}
                {selectedPort.service === 'FTP' && 'FTP transmits credentials and data in plaintext, making them susceptible to interception.'}
                {selectedPort.service === 'RDP' && 'RDP exposed without Network Level Authentication is vulnerable to brute-force and credential attacks.'}
                {selectedPort.service === 'SSH' && 'Outdated SSH versions may have known vulnerabilities including user enumeration and weak cipher support.'}
                {(selectedPort.service === 'HTTPS' || selectedPort.service === 'DICOM' || selectedPort.service === 'SMB') && 'This service is expected and running with standard configuration.'}
              </p>
            </div>

            {/* Technical findings */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Technical Findings</h4>
              <div className="space-y-1.5">
                {[
                  { label: 'Encryption', value: selectedPort.service === 'Telnet' || selectedPort.service === 'FTP' ? 'Not available' : 'Available' },
                  { label: 'Authentication Exposure', value: selectedPort.riskScore >= 70 ? 'High' : 'Low' },
                  { label: 'Healthcare Asset', value: 'Yes' },
                  { label: 'Clinical Criticality', value: selectedPort.riskScore >= 70 ? 'High' : 'Medium' },
                ].map((d) => (
                  <div key={d.label} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200">
                    <span className="text-sm text-slate-600">{d.label}</span>
                    <span className="text-sm font-medium text-slate-900">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Risk Assessment */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">AI Risk Assessment</h4>
              <div className="space-y-2.5 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <RiskBar label="Technical Exposure" score={Math.min(selectedPort.riskScore + 5, 100)} delay={0} />
                <RiskBar label="Asset Criticality" score={Math.min(selectedPort.riskScore + 3, 100)} delay={100} />
                <RiskBar label="Healthcare Impact" score={Math.min(selectedPort.riskScore + 4, 100)} delay={200} />
              </div>
              <div className="flex items-center justify-between mt-3 p-3 rounded-xl bg-slate-900 text-white">
                <span className="text-sm font-medium">Final Risk</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{selectedPort.riskScore}</span>
                  <span className="text-sm text-slate-300">/ 100</span>
                  <SeverityBadge severity={selectedPort.risk} />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                AI score is a demonstration prototype score, not a certified medical safety decision.
              </p>
            </div>

            {/* Remediation button */}
            {!selectedPort.expected && (
              <button onClick={startRemediation} className="btn-primary w-full">
                <Wrench size={16} />
                Generate Remediation Plan
              </button>
            )}
          </div>
        )}
      </Drawer>

      {/* Remediation workflow drawer */}
      <Drawer
        open={showRemediation}
        onClose={() => { setShowRemediation(false); setRemediationStep(0); setRemediationDone(false); }}
        title="Remediation Workflow"
        subtitle={selectedPort ? `${selectedPort.service} on ${selectedPort.ip}:${selectedPort.port}` : ''}
        width="max-w-xl"
      >
        {selectedPort && (
          <div className="space-y-5">
            {/* DEMO MODE badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-50 border border-brand-200">
              <span className="badge badge-primary text-[10px]">DEMO / SIMULATION MODE</span>
              <span className="text-xs text-brand-700">Changes are simulated for safe demonstration</span>
            </div>

            {/* Recommended action */}
            <div className="p-4 rounded-xl border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Recommended Action</p>
              <p className="text-sm font-medium text-slate-900">
                {selectedPort.service === 'Telnet' && 'Disable unnecessary Telnet service.'}
                {selectedPort.service === 'FTP' && 'Replace FTP with SFTP and disable anonymous access.'}
                {selectedPort.service === 'RDP' && 'Enforce Network Level Authentication and restrict access.'}
              </p>
            </div>

            {/* Workflow steps */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Remediation Plan</h4>
              <div className="space-y-2">
                {['Validate Asset', 'Check Service Dependency', 'Assess Healthcare / Clinical Impact', 'Generate Change Plan', 'Administrator Approval', 'Apply Change', 'Re-scan & Verify'].map((step, i) => {
                  const Icon = stepIcons[i];
                  const done = i < remediationStep;
                  const current = i === remediationStep;
                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        done ? 'bg-success-50 border-success-200'
                        : current ? 'bg-brand-50 border-brand-300 ring-2 ring-brand-200'
                        : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        done ? 'bg-success-100 text-success-700'
                        : current ? 'bg-brand-100 text-brand-700'
                        : 'bg-slate-100 text-slate-400'
                      }`}>
                        {done ? <CheckCircle2 size={16} /> : simulating && current ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
                      </div>
                      <span className={`text-sm font-medium ${done ? 'text-success-700' : current ? 'text-brand-700' : 'text-slate-500'}`}>
                        Step {i + 1}: {step}
                      </span>
                      {simulating && current && (
                        <span className="ml-auto text-xs text-brand-600 font-medium animate-pulse">Applying...</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clinical impact assessment */}
            {remediationStep >= 2 && remediationStep <= 4 && (
              <div className="p-4 rounded-xl border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Clinical Impact Assessment</h4>
                <div className="space-y-2">
                  {[
                    { q: 'Is this a production asset?', a: 'YES' },
                    { q: 'Is this a critical medical system?', a: 'YES' },
                    { q: 'Could disabling the service affect patient care?', a: 'POTENTIAL IMPACT' },
                    { q: 'Maintenance window available?', a: 'UNKNOWN' },
                    { q: 'Administrator approval required?', a: 'YES' },
                  ].map((item) => (
                    <div key={item.q} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                      <span className="text-sm text-slate-600">{item.q}</span>
                      <span className={`text-sm font-semibold ${item.a === 'YES' ? 'text-critical-700' : item.a === 'POTENTIAL IMPACT' ? 'text-high-700' : 'text-medium-700'}`}>
                        {item.a}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approval required */}
            {remediationStep === 4 && !approvalRequested && (
              <div className="p-4 rounded-xl bg-critical-50 border border-critical-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={18} className="text-critical-600" />
                  <p className="text-sm font-semibold text-critical-700">Change Requires Administrator Approval</p>
                </div>
                <button onClick={requestApproval} className="btn-primary w-full">
                  <UserCheck size={16} />
                  Request Approval
                </button>
              </div>
            )}

            {/* Approval pending */}
            {approvalRequested && !approvalGranted && (
              <div className="p-4 rounded-xl bg-medium-50 border border-medium-200">
                <div className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin text-medium-600" />
                  <p className="text-sm font-semibold text-medium-700">Awaiting administrator approval...</p>
                </div>
              </div>
            )}

            {/* Apply simulated change */}
            {approvalGranted && remediationStep === 5 && !remediationDone && (
              <div className="p-4 rounded-xl bg-brand-50 border border-brand-200">
                <p className="text-sm font-medium text-brand-700 mb-3">Approval granted. Ready to apply simulated change.</p>
                <button onClick={applySimulatedChange} disabled={simulating} className="btn-primary w-full">
                  {simulating ? <Loader2 size={16} className="animate-spin" /> : <Settings size={16} />}
                  {simulating ? 'Applying...' : 'Apply Simulated Change'}
                </button>
              </div>
            )}

            {/* Verify */}
            {remediationStep === 6 && !remediationDone && (
              <button onClick={verifyRemediation} className="btn-primary w-full">
                <RefreshCw size={16} />
                Re-Scan & Verify
              </button>
            )}

            {/* Before/After comparison */}
            {remediationDone && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-success-50 border border-success-200">
                  <CheckCircle2 size={18} className="text-success-600" />
                  <p className="text-sm font-semibold text-success-700">Remediation Successful</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="p-4 rounded-xl border border-critical-200 bg-critical-50">
                    <p className="text-xs font-semibold text-critical-600 uppercase tracking-wide mb-2">Before</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-mono text-2xl font-bold text-critical-700">{selectedPort.port}</span>
                      <span className="badge-critical">OPEN</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Security Score</span>
                        <span className="font-mono font-semibold text-critical-700">58</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Attack Surface</span>
                        <span className="font-mono font-semibold text-critical-700">100%</span>
                      </div>
                    </div>
                  </div>

                  {/* After */}
                  <div className="p-4 rounded-xl border border-success-200 bg-success-50">
                    <p className="text-xs font-semibold text-success-600 uppercase tracking-wide mb-2">After</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-mono text-2xl font-bold text-success-700">{selectedPort.port}</span>
                      <span className="badge-success">CLOSED</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Security Score</span>
                        <span className="font-mono font-semibold text-success-700">86</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Attack Surface</span>
                        <span className="font-mono font-semibold text-success-700">69%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Improvement visualization */}
                <div className="p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-700">Security Score Improvement</span>
                    <span className="text-sm font-bold text-success-600">+28 points</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-critical-100 overflow-hidden">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-success-400 to-success-500 transition-all duration-1000" style={{ width: '86%' }} />
                    <div className="absolute top-0 left-[58%] h-full w-px bg-slate-400" />
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-slate-500">
                    <span>58 (Before)</span>
                    <span>86 (After)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <ArrowRight size={16} className="text-success-600" />
                  <span className="text-sm font-medium text-slate-700">Attack Surface reduced by 31%</span>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {remediationStep < 4 && !approvalRequested && (
              <button onClick={advanceStep} className="btn-primary w-full">
                Continue <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </Drawer>

      {/* Approval modal */}
      <Modal
        open={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title="Administrator Approval Required"
        footer={
          <>
            <button onClick={() => setShowApprovalModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={grantApproval} className="btn-primary">
              <UserCheck size={16} />
              Approve Change
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-critical-50 border border-critical-200">
            <AlertTriangle size={20} className="text-critical-600" />
            <p className="text-sm text-critical-700 font-medium">This change affects a critical clinical asset.</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Asset</span>
              <span className="font-medium text-slate-900">{selectedPort?.ip}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Change</span>
              <span className="font-medium text-slate-900">Close port {selectedPort?.port} ({selectedPort?.service})</span>
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
