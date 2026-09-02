import { useState, useRef } from 'react';
import {
  Shield, Server, Database, Stethoscope, Monitor, Cog,
  Wifi, Radio, ZoomIn, ZoomOut, Search, Filter, RefreshCw,
  Globe, Activity,
} from 'lucide-react';
import { assets } from '@/data/mockData';
import { Drawer } from '@/components/ui/Drawer';
import { PageHeader, SectionCard } from '@/components/ui/Layout';
import { StatusDot, RiskScore, SeverityBadge } from '@/components/ui/Badges';
import type { Asset, AssetType, AssetStatus } from '@/types';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<AssetType, LucideIcon> = {
  gateway: Globe,
  firewall: Shield,
  server: Server,
  database: Database,
  'medical-device': Stethoscope,
  workstation: Monitor,
  admin: Cog,
  iot: Wifi,
  network: Radio,
};

const statusColor: Record<AssetStatus, string> = {
  healthy: '#22c55e',
  warning: '#f97316',
  critical: '#dc2626',
  offline: '#94a3b8',
};

// Connections: pairs of asset indices
const connections: [number, number][] = [
  [0, 1], // gateway -> firewall
  [1, 2], [1, 3], [1, 4], // firewall -> servers
  [2, 5], [3, 6], // servers -> lab/pharmacy
  [4, 7], // database -> admin
  [5, 8], [5, 9], // lab -> workstations
  [6, 10], // pharmacy -> patient monitor
  [7, 11], // admin -> iot
  [2, 4], [3, 5], // cross connections
];

export function NetworkMapPage() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const svgRef = useRef<SVGSVGElement>(null);
  const panStart = useRef({ x: 0, y: 0 });

  const filteredAssets = assets.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.ip.includes(search);
    const matchFilter = filter === 'all' || a.type === filter;
    return matchSearch && matchFilter;
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  };
  const handleMouseUp = () => setIsPanning(false);

  return (
    <div className="space-y-5">
      <PageHeader title="Hospital Network Map" subtitle="Interactive topology of discovered assets and communication paths" />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white">
          <Search size={16} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets or IPs..."
            className="text-sm outline-none w-48 bg-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="select text-sm py-2 w-44">
            <option value="all">All Asset Types</option>
            <option value="gateway">Gateways</option>
            <option value="firewall">Firewalls</option>
            <option value="server">Servers</option>
            <option value="database">Databases</option>
            <option value="medical-device">Medical Devices</option>
            <option value="workstation">Workstations</option>
            <option value="admin">Admin Systems</option>
            <option value="iot">IoT Devices</option>
          </select>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <button onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))} className="btn-secondary p-2.5">
            <ZoomIn size={16} />
          </button>
          <button onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))} className="btn-secondary p-2.5">
            <ZoomOut size={16} />
          </button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="btn-secondary p-2.5">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Map */}
      <SectionCard>
        <div
          className="relative w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-100"
          style={{ height: '600px', cursor: isPanning ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 800 600"
            style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transformOrigin: 'center' }}
          >
            {/* Connections */}
            {connections.map(([from, to], i) => {
              const a = assets[from];
              const b = assets[to];
              const isHighlighted =
                filteredAssets.includes(a) && filteredAssets.includes(b);
              return (
                <line
                  key={i}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={isHighlighted ? '#cbd5e1' : '#e2e8f0'}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  className="transition-all"
                />
              );
            })}

            {/* Nodes */}
            {assets.map((asset) => {
              const Icon = iconMap[asset.type];
              const isSelected = selectedAsset?.id === asset.id;
              const isVisible = filteredAssets.includes(asset);
              const color = statusColor[asset.status];
              return (
                <g
                  key={asset.id}
                  transform={`translate(${asset.x}, ${asset.y})`}
                  className="cursor-pointer transition-all"
                  style={{ opacity: isVisible ? 1 : 0.25 }}
                  onClick={(e) => { e.stopPropagation(); setSelectedAsset(asset); }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {/* Pulse ring for critical/warning */}
                  {(asset.status === 'critical' || asset.status === 'warning') && (
                    <circle r="28" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3">
                      <animate attributeName="r" from="22" to="34" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Node circle */}
                  <circle
                    r="22"
                    fill="white"
                    stroke={color}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}
                  />
                  {/* Icon */}
                  <g transform="translate(-10, -10)">
                    <foreignObject width="20" height="20">
                      <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={16} style={{ color }} />
                      </div>
                    </foreignObject>
                  </g>
                  {/* Label */}
                  <text y="38" textAnchor="middle" className="text-[10px] font-semibold fill-slate-700">
                    {asset.name}
                  </text>
                  <text y="50" textAnchor="middle" className="text-[9px] fill-slate-400 font-mono">
                    {asset.ip}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 px-4 py-3 space-y-2">
            <p className="text-xs font-semibold text-slate-700 mb-1">Node Status</p>
            {[
              { label: 'Healthy', color: '#22c55e' },
              { label: 'Warning', color: '#f97316' },
              { label: 'Critical', color: '#dc2626' },
              { label: 'Offline', color: '#94a3b8' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-xs text-slate-600">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Nodes</p>
                <p className="text-lg font-bold text-slate-900">{assets.length}</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Links</p>
                <p className="text-lg font-bold text-slate-900">{connections.length}</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Zoom</p>
                <p className="text-lg font-bold text-slate-900">{Math.round(zoom * 100)}%</p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Asset Drawer */}
      <Drawer
        open={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        title={selectedAsset?.name || ''}
        subtitle={selectedAsset?.ip}
      >
        {selectedAsset && (
          <div className="space-y-5">
            {/* Status header */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <StatusDot status={selectedAsset.status} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 capitalize">{selectedAsset.status}</p>
                <p className="text-xs text-slate-500">{selectedAsset.typeName}</p>
              </div>
              <RiskScore score={selectedAsset.riskScore} size="md" />
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'IP Address', value: selectedAsset.ip },
                { label: 'MAC Address', value: selectedAsset.mac },
                { label: 'Asset Type', value: selectedAsset.typeName },
                { label: 'Operating System', value: selectedAsset.os },
                { label: 'Criticality', value: selectedAsset.criticality.toUpperCase() },
                { label: 'Last Seen', value: selectedAsset.lastSeen },
                { label: 'Last Scan', value: selectedAsset.lastScan },
                { label: 'Risk Score', value: `${selectedAsset.riskScore} / 100` },
              ].map((d) => (
                <div key={d.label} className="p-3 rounded-xl border border-slate-200">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{d.label}</p>
                  <p className="text-sm font-medium text-slate-700 mt-1">{d.value}</p>
                </div>
              ))}
            </div>

            {/* Open Ports */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Open Ports</h4>
              <div className="space-y-1.5">
                {selectedAsset.openPorts.map((p) => (
                  <div key={p.port} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
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

            {/* Running Services */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Running Services</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAsset.services.map((s) => (
                  <span key={s} className="badge-neutral">{s}</span>
                ))}
              </div>
            </div>

            {/* Vulnerabilities */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Vulnerabilities</h4>
              {selectedAsset.vulnerabilities.length > 0 ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-critical-50 border border-critical-200">
                  <Activity size={16} className="text-critical-600" />
                  <span className="text-sm font-medium text-critical-700">
                    {selectedAsset.vulnerabilities.length} vulnerability{selectedAsset.vulnerabilities.length > 1 ? 'ies' : 'y'} detected
                  </span>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No vulnerabilities detected</p>
              )}
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Recent Activity</h4>
              <p className="text-sm text-slate-600 p-3 rounded-xl bg-slate-50 border border-slate-200">
                {selectedAsset.recentActivity}
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
