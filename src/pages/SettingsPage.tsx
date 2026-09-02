import { useState } from 'react';
import {
  FlaskConical, Check,
} from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/ui/Layout';
import { useToast } from '@/components/ui/Toast';

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-brand-600' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${on ? 'translate-x-5' : ''}`} />
    </button>
  );
}

export function SettingsPage() {
  const toast = useToast();
  const [demoMode, setDemoMode] = useState(true);
  const [aiMonitoring, setAiMonitoring] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [criticalAlerts, setCriticalAlerts] = useState(true);

  return (
    <div className="space-y-5 max-w-4xl">
      <PageHeader title="Settings" subtitle="Configure system preferences and monitoring parameters" />

      {/* Hospital Information */}
      <SectionCard title="Hospital Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Hospital Name</label>
            <input className="input" defaultValue="Demo General Hospital" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Campus</label>
            <input className="input" defaultValue="Main Campus" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Administrator Email</label>
            <input className="input" defaultValue="admin@demohospital.org" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Security Contact</label>
            <input className="input" defaultValue="security@demohospital.org" />
          </div>
        </div>
      </SectionCard>

      {/* Network Configuration */}
      <SectionCard title="Network Configuration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Primary Network (CIDR)</label>
            <input className="input font-mono" defaultValue="192.168.1.0/24" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Secondary Network</label>
            <input className="input font-mono" defaultValue="10.0.0.0/24" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Gateway IP</label>
            <input className="input font-mono" defaultValue="192.168.1.1" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">DNS Server</label>
            <input className="input font-mono" defaultValue="192.168.1.2" />
          </div>
        </div>
      </SectionCard>

      {/* Scan Profiles */}
      <SectionCard title="Scan Profiles">
        <div className="space-y-2">
          {[
            { name: 'Quick Discovery', desc: 'Fast host discovery with basic port check', duration: '~30 sec' },
            { name: 'Standard Security Audit', desc: 'Comprehensive port scan with service detection', duration: '~2 min' },
            { name: 'Deep Assessment', desc: 'Full port range with vulnerability detection', duration: '~10 min' },
          ].map((p) => (
            <div key={p.name} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-900">{p.name}</p>
                <p className="text-xs text-slate-500">{p.desc}</p>
              </div>
              <span className="text-xs font-mono text-slate-500">{p.duration}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Risk Thresholds */}
      <SectionCard title="Risk Thresholds">
        <div className="space-y-4">
          {[
            { label: 'Critical Threshold', value: 80, color: 'bg-critical-500' },
            { label: 'High Threshold', value: 60, color: 'bg-high-500' },
            { label: 'Medium Threshold', value: 40, color: 'bg-medium-500' },
          ].map((t) => (
            <div key={t.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700">{t.label}</span>
                <span className="text-sm font-mono font-semibold text-slate-900">{t.value}</span>
              </div>
              <div className="relative h-2 rounded-full bg-slate-100">
                <div className={`absolute h-full rounded-full ${t.color}`} style={{ width: `${t.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Alert Preferences */}
      <SectionCard title="Alert Preferences">
        <div className="space-y-3">
          {[
            { label: 'Email Notifications', desc: 'Receive security alerts via email', on: emailAlerts, set: setEmailAlerts },
            { label: 'SMS Notifications', desc: 'Receive critical alerts via SMS', on: smsAlerts, set: setSmsAlerts },
            { label: 'Critical Alerts Only', desc: 'Only notify for critical severity findings', on: criticalAlerts, set: setCriticalAlerts },
          ].map((a) => (
            <div key={a.label} className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
              <div>
                <p className="text-sm font-medium text-slate-900">{a.label}</p>
                <p className="text-xs text-slate-500">{a.desc}</p>
              </div>
              <Toggle on={a.on} onChange={a.set} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* AI Monitoring */}
      <SectionCard title="AI Monitoring">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
            <div>
              <p className="text-sm font-medium text-slate-900">AI Threat Detection</p>
              <p className="text-xs text-slate-500">Enable AI-powered anomaly detection and threat classification</p>
            </div>
            <Toggle on={aiMonitoring} onChange={setAiMonitoring} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Anomaly Sensitivity</label>
              <select className="select" defaultValue="medium">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Analysis Interval</label>
              <select className="select" defaultValue="realtime">
                <option value="realtime">Real-time</option>
                <option value="1min">Every 1 minute</option>
                <option value="5min">Every 5 minutes</option>
              </select>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Demo Mode */}
      <SectionCard title="Demo Mode">
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-brand-50 border border-brand-200">
          <div className="flex items-start gap-3">
            <FlaskConical size={20} className="text-brand-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Demo / Simulation Mode</p>
              <p className="text-xs text-slate-600 mt-0.5">Uses simulated network and remediation data for safe demonstration. All scans, findings and remediation actions are simulated and do not affect real systems.</p>
            </div>
          </div>
          <Toggle on={demoMode} onChange={(v) => { setDemoMode(v); toast('info', v ? 'Demo mode enabled' : 'Demo mode disabled'); }} />
        </div>
      </SectionCard>

      {/* User Management */}
      <SectionCard title="User Management">
        <div className="space-y-2">
          {[
            { name: 'Security Administrator', email: 'admin@demohospital.org', role: 'Administrator', status: 'Active' },
            { name: 'Network Analyst', email: 'analyst@demohospital.org', role: 'Analyst', status: 'Active' },
            { name: 'IT Manager', email: 'itmanager@demohospital.org', role: 'Viewer', status: 'Active' },
          ].map((u) => (
            <div key={u.email} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                  {u.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge-neutral">{u.role}</span>
                <span className="badge-success">{u.status}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Save button */}
      <div className="flex justify-end gap-3">
        <button onClick={() => toast('info', 'Changes discarded')} className="btn-secondary">
          Cancel
        </button>
        <button onClick={() => toast('success', 'Settings saved successfully')} className="btn-primary">
          <Check size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
