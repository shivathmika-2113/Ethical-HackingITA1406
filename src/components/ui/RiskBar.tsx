import { useEffect, useState } from 'react';

export function RiskBar({
  label,
  score,
  delay = 0,
}: {
  label: string;
  score: number;
  delay?: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 100 + delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  const color =
    score >= 80 ? 'bg-critical-500'
    : score >= 60 ? 'bg-high-500'
    : score >= 40 ? 'bg-medium-500'
    : 'bg-brand-500';

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-600 w-40 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="text-sm font-mono font-semibold text-slate-700 w-8 text-right">{score}</span>
    </div>
  );
}
