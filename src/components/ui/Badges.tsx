import type { Severity } from '@/types';

export function SeverityBadge({ severity }: { severity: Severity | 'none' }) {
  const map: Record<string, string> = {
    critical: 'badge-critical',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
    none: 'badge-neutral',
  };
  const label = severity === 'none' ? 'NONE' : severity.toUpperCase();
  return <span className={map[severity]}>{label}</span>;
}

export function StatusDot({ status }: { status: 'healthy' | 'warning' | 'critical' | 'offline' }) {
  const colors: Record<string, string> = {
    healthy: 'bg-success-500',
    warning: 'bg-high-500',
    critical: 'bg-critical-500',
    offline: 'bg-slate-400',
  };
  const pulse = status === 'critical' || status === 'warning';
  return (
    <span className="relative flex h-2.5 w-2.5">
      {pulse && (
        <span className={`absolute inline-flex h-full w-full rounded-full ${colors[status]} opacity-40 animate-ping`} />
      )}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${colors[status]}`} />
    </span>
  );
}

export function RiskScore({ score, size = 'sm' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const color =
    score >= 80 ? 'text-critical-700 bg-critical-50 border-critical-200'
    : score >= 60 ? 'text-high-700 bg-high-50 border-high-200'
    : score >= 40 ? 'text-medium-700 bg-medium-50 border-medium-200'
    : 'text-brand-700 bg-brand-50 border-brand-200';
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };
  return (
    <span className={`inline-flex items-center font-mono font-semibold rounded-lg border ${color} ${sizes[size]}`}>
      {score}
    </span>
  );
}
