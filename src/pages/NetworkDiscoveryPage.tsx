import { useEffect, useState } from 'react';
import {
  Radar, Play, History, CheckCircle2, Loader2, Server,
  Network as NetIcon, Shield, AlertTriangle, ArrowRight,
} from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/ui/Layout';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { StatusDot, RiskScore } from '@/components/ui/Badges';
import { useToast } from '@/components/ui/Toast';
import { scanSteps, discoveredAssets } from '@/data/mockData';

type ScanState = 'idle' | 'scanning' | 'complete';

export function NetworkDiscoveryPage() {
  const toast = useToast();
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ hosts: 0, ports: 0, services: 0, findings: 0 });
  const [showHistory, setShowHistory] = useState(false);

  const startScan = () => {
    setScanState('scanning');
    setCurrentStep(0);
    setProgress(0);
    setStats({ hosts: 0, ports: 0, services: 0, findings: 0 });
  };

  useEffect(() => {
    if (scanState !== 'scanning') return;
    const stepDuration = 1200;
    const totalSteps = scanSteps.length;
    let step = 0;

    const stepInterval = setInterval(() => {
      step++;
      if (step >= totalSteps) {
        clearInterval(stepInterval);
        setProgress(100);
        setStats({ hosts: 184, ports: 4602, services: 312, findings: 14 });
        setTimeout(() => {
          setScanState('complete');
          toast('success', 'Authorized scan complete — 184 assets discovered');
        }, 500);
        return;
      }
      setCurrentStep(step);
    }, stepDuration);

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 87));
    }, 50);

    const statsInterval = setInterval(() => {
      setStats((s) => ({
        hosts: Math.min(s.hosts + 8, 184),
        ports: Math.min(s.ports + 200, 4602),
        services: Math.min(s.services + 14, 312),
        findings: Math.min(s.findings + 1, 14),
      }));
    }, 100);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearInterval(statsInterval);
    };
  }, [scanState, toast]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Network Discovery"
        subtitle="Identify authorized assets, services and network exposure."
      />

      {/* Scan Configuration */}
      <SectionCard title="Scan Configuration" subtitle="Configure authorized network assessment parameters">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Target Network</label>
            <input className="input font-mono" defaultValue="192.168.1.0/24" placeholder="192.168.1.0/24" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Scan Profile</label>
            <select className="select" defaultValue="standard">
              <option value="quick">Quick Discovery</option>
              <option value="standard">Standard Security Audit</option>
              <option value="deep">Deep Assessment</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Asset Category</label>
            <select className="select" defaultValue="all">
              <option value="all">All Assets</option>
              <option value="servers">Servers</option>
              <option value="workstations">Workstations</option>
              <option value="medical">Medical Devices</option>
              <option value="network">Network Equipment</option>
              <option value="iot">IoT</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Scan Schedule</label>
            <select className="select" defaultValue="now">
              <option value="now">Run Now</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={startScan}
            disabled={scanState === 'scanning'}
            className="btn-primary"
          >
            {scanState === 'scanning' ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {scanState === 'scanning' ? 'Scanning...' : 'Start Authorized Scan'}
          </button>
          <button onClick={() => setShowHistory(true)} className="btn-secondary">
            <History size={16} />
            View Scan History
          </button>
          <div className="flex items-center gap-1.5 ml-auto text-xs text-slate-500">
            <Shield size={14} className="text-success-600" />
            Authorized assessment only
          </div>
        </div>
      </SectionCard>

      {/* Scanning animation */}
      {scanState === 'scanning' && (
        <SectionCard>
          <div className="flex flex-col items-center py-6">
            {/* Radar animation */}
            <div className="relative w-32 h-32 mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-brand-200" />
              <div className="absolute inset-4 rounded-full border-2 border-brand-200" />
              <div className="absolute inset-8 rounded-full border-2 border-brand-200" />
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div
                  className="absolute top-1/2 left-1/2 origin-left h-1 w-16 bg-gradient-to-r from-brand-500 to-transparent"
                  style={{ animation: 'spin 2s linear infinite' }}
                />
              </div>
              <Radar size={28} className="absolute inset-0 m-auto text-brand-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Scanning in Progress</h3>
            <p className="text-sm text-slate-500 mb-6">Performing authorized network assessment</p>

            {/* Progress bar */}
            <div className="w-full max-w-md mb-6">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700">{scanSteps[currentStep]}...</span>
                <span className="font-mono font-semibold text-brand-600">{progress}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-teal-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-1 mb-6 flex-wrap justify-center">
              {scanSteps.map((step, i) => (
                <div key={step} className="flex items-center gap-1">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                    i < currentStep ? 'bg-success-50 text-success-700'
                    : i === currentStep ? 'bg-brand-50 text-brand-700'
                    : 'bg-slate-50 text-slate-400'
                  }`}>
                    {i < currentStep ? <CheckCircle2 size={12} /> : i === currentStep ? <Loader2 size={12} className="animate-spin" /> : <span className="w-3 h-3 rounded-full border border-slate-300" />}
                    {step}
                  </div>
                  {i < scanSteps.length - 1 && <ArrowRight size={12} className="text-slate-300" />}
                </div>
              ))}
            </div>

            {/* Live stats */}
            <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
              {[
                { label: 'Hosts Discovered', value: stats.hosts, icon: Server },
                { label: 'Ports Analyzed', value: stats.ports, icon: NetIcon },
                { label: 'Services Identified', value: stats.services, icon: Shield },
                { label: 'Potential Findings', value: stats.findings, icon: AlertTriangle },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="text-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <Icon size={18} className="text-brand-600 mx-auto mb-1.5" />
                    <AnimatedCounter value={s.value} className="text-2xl font-bold text-slate-900" />
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mt-0.5">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionCard>
      )}

      {/* Scan complete results */}
      {scanState === 'complete' && (
        <SectionCard
          title="Discovered Assets"
          subtitle={`${discoveredAssets.length} assets found on 192.168.1.0/24`}
          action={
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success-50 border border-success-200">
              <CheckCircle2 size={14} className="text-success-600" />
              <span className="text-xs font-semibold text-success-700">Scan Complete</span>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">IP Address</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Hostname</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Type</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Risk</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Open Ports</th>
                </tr>
              </thead>
              <tbody>
                {discoveredAssets.map((asset) => (
                  <tr key={asset.ip} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-700">{asset.ip}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{asset.hostname}</td>
                    <td className="py-2.5 px-3 text-slate-600">{asset.type}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <StatusDot status={asset.status as any} />
                        <span className="text-slate-600 capitalize">{asset.status}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3"><RiskScore score={asset.risk} /></td>
                    <td className="py-2.5 px-3 text-slate-600">{asset.ports}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Scan history modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm animate-fade-in" onClick={() => setShowHistory(false)} />
          <div className="relative bg-white rounded-2xl shadow-pop w-full max-w-lg animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Scan History</h2>
              <button onClick={() => setShowHistory(false)} className="btn-ghost p-2">✕</button>
            </div>
            <div className="px-6 py-4 space-y-2 max-h-96 overflow-y-auto">
              {[
                { date: 'Sep 02, 2026 10:41', type: 'Standard Security Audit', assets: 184, findings: 14, status: 'Complete' },
                { date: 'Sep 01, 2026 02:00', type: 'Quick Discovery', assets: 182, findings: 12, status: 'Complete' },
                { date: 'Aug 31, 2026 02:00', type: 'Quick Discovery', assets: 180, findings: 15, status: 'Complete' },
                { date: 'Aug 30, 2026 10:15', type: 'Deep Assessment', assets: 184, findings: 18, status: 'Complete' },
                { date: 'Aug 29, 2026 02:00', type: 'Quick Discovery', assets: 179, findings: 10, status: 'Complete' },
              ].map((scan, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{scan.type}</p>
                    <p className="text-xs text-slate-500">{scan.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{scan.assets} assets · {scan.findings} findings</p>
                    </div>
                    <span className="badge-success">{scan.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
