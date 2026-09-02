import { useState, useMemo } from 'react';
import { Search, Server, Stethoscope, Monitor, Cog, Wifi, Radio } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader, SectionCard, Tabs } from '@/components/ui/Layout';
import { StatusDot, RiskScore, SeverityBadge } from '@/components/ui/Badges';
import { Drawer } from '@/components/ui/Drawer';
import { assets } from '@/data/mockData';
import type { Asset } from '@/types';

const typeIcons: Record<string, LucideIcon> = {
  server: Server, database: Server, 'medical-device': Stethoscope,
  workstation: Monitor, admin: Cog, iot: Wifi, gateway: Radio, firewall: Radio,
};

export function AssetsPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selected, setSelected] = useState<Asset | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'risk' | 'ip'>('name');

  const filtered = useMemo(() => {
    let result = assets.filter((a) => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.ip.includes(search);
      const matchTab = activeTab === 'all' ||
        (activeTab === 'servers' && (a.type === 'server' || a.type === 'database')) ||
        (activeTab === 'medical' && a.type === 'medical-device') ||
        (activeTab === 'workstations' && a.type === 'workstation') ||
        (activeTab === 'network' && (a.type === 'gateway' || a.type === 'firewall' || a.type === 'network')) ||
        (activeTab === 'iot' && a.type === 'iot');
      return matchSearch && matchTab;
    });
    result = [...result].sort((a, b) => {
      if (sortBy === 'risk') return b.riskScore - a.riskScore;
      if (sortBy === 'ip') return a.ip.localeCompare(b.ip);
      return a.name.localeCompare(b.name);
    });
    return result;
  }, [search, activeTab, sortBy]);

  const counts = {
    all: assets.length,
    servers: assets.filter((a) => a.type === 'server' || a.type === 'database').length,
    medical: assets.filter((a) => a.type === 'medical-device').length,
    workstations: assets.filter((a) => a.type === 'workstation').length,
    network: assets.filter((a) => a.type === 'gateway' || a.type === 'firewall').length,
    iot: assets.filter((a) => a.type === 'iot').length,
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Asset Inventory" subtitle="Complete inventory of discovered hospital network assets" />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: assets.length, color: 'text-brand-600 bg-brand-50' },
          { label: 'Critical Assets', value: assets.filter((a) => a.criticality === 'critical').length, color: 'text-critical-600 bg-critical-50' },
          { label: 'Requiring Attention', value: assets.filter((a) => a.status !== 'healthy').length, color: 'text-high-600 bg-high-50' },
          { label: 'Medical Devices', value: assets.filter((a) => a.type === 'medical-device').length, color: 'text-teal-600 bg-teal-50' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
              <Server size={18} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <SectionCard>
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets or IPs..."
              className="text-sm outline-none w-48 bg-transparent"
            />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'risk' | 'ip')} className="select text-sm py-2 w-40">
            <option value="name">Sort by Name</option>
            <option value="risk">Sort by Risk</option>
            <option value="ip">Sort by IP</option>
          </select>
        </div>

        <Tabs
          tabs={[
            { id: 'all', label: 'All', count: counts.all },
            { id: 'servers', label: 'Servers', count: counts.servers },
            { id: 'medical', label: 'Medical Devices', count: counts.medical },
            { id: 'workstations', label: 'Workstations', count: counts.workstations },
            { id: 'network', label: 'Network', count: counts.network },
            { id: 'iot', label: 'IoT', count: counts.iot },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {['Asset', 'IP', 'Type', 'Criticality', 'Risk', 'Open Ports', 'Last Scan', 'Status'].map((h) => (
                  <th key={h} className="text-left py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => {
                const Icon = typeIcons[asset.type] || Server;
                return (
                  <tr
                    key={asset.id}
                    onClick={() => setSelected(asset)}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Icon size={16} className="text-slate-600" />
                        </div>
                        <span className="font-medium text-slate-900">{asset.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{asset.ip}</td>
                    <td className="py-2.5 px-3 text-slate-600">{asset.typeName}</td>
                    <td className="py-2.5 px-3">
                      <span className={`badge ${asset.criticality === 'critical' ? 'badge-critical' : asset.criticality === 'high' ? 'badge-high' : 'badge-medium'}`}>
                        {asset.criticality.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3"><RiskScore score={asset.riskScore} /></td>
                    <td className="py-2.5 px-3 text-slate-600">{asset.openPorts.length}</td>
                    <td className="py-2.5 px-3 text-slate-500">{asset.lastScan}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <StatusDot status={asset.status} />
                        <span className="text-slate-600 capitalize">{asset.status}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Asset drawer */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''} subtitle={selected?.ip}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <StatusDot status={selected.status} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 capitalize">{selected.status}</p>
                <p className="text-xs text-slate-500">{selected.typeName}</p>
              </div>
              <RiskScore score={selected.riskScore} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'IP Address', value: selected.ip },
                { label: 'MAC Address', value: selected.mac },
                { label: 'Asset Type', value: selected.typeName },
                { label: 'Operating System', value: selected.os },
                { label: 'Criticality', value: selected.criticality.toUpperCase() },
                { label: 'Last Seen', value: selected.lastSeen },
                { label: 'Last Scan', value: selected.lastScan },
                { label: 'Risk Score', value: `${selected.riskScore} / 100` },
              ].map((d) => (
                <div key={d.label} className="p-3 rounded-xl border border-slate-200">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{d.label}</p>
                  <p className="text-sm font-medium text-slate-700 mt-1">{d.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Open Ports</h4>
              <div className="space-y-1.5">
                {selected.openPorts.map((p) => (
                  <div key={p.port} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-slate-700">{p.port}</span>
                      <span className="text-xs text-slate-500">{p.protocol}</span>
                      <span className="text-sm text-slate-700">{p.service}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{p.version}</span>
                      <SeverityBadge severity={p.risk} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Running Services</h4>
              <div className="flex flex-wrap gap-2">
                {selected.services.map((s) => (
                  <span key={s} className="badge-neutral">{s}</span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Recent Activity</h4>
              <p className="text-sm text-slate-600 p-3 rounded-xl bg-slate-50 border border-slate-200">{selected.recentActivity}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
