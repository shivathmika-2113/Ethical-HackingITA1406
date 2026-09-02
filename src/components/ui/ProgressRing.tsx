import { useEffect, useState } from 'react';

export function ProgressRing({
  value,
  size = 200,
  strokeWidth = 14,
  label,
  sublabel,
  color,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  const ringColor =
    color ?? (value >= 80 ? '#dc2626' : value >= 60 ? '#ea580c' : value >= 40 ? '#d97706' : '#2570eb');

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={ringColor} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-900">{animated}</span>
        {label && <span className="text-xs font-medium text-slate-500 mt-0.5">{label}</span>}
        {sublabel && <span className="text-[10px] text-slate-400 mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}
