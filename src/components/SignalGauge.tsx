import React from 'react';

interface SignalGaugeProps {
  score: number; // 0 to 100
  status: 'Good' | 'Average' | 'Poor';
  size?: number;
  label?: string;
  sublabel?: string;
}

export const SignalGauge: React.FC<SignalGaugeProps> = ({
  score,
  status,
  size = 200,
  label = 'Quality Score',
  sublabel,
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;

  // Arc angle: 240 degrees (from 150 deg to 390 deg)
  const arcDegree = 240;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (circumference * arcDegree) / 360;

  const clampedScore = Math.max(0, Math.min(100, score));
  const progressLength = (clampedScore / 100) * arcLength;
  const strokeDashoffset = arcLength - progressLength;

  // Color mapping
  const colorMap = {
    Good: {
      stroke: 'url(#goodGradient)',
      glow: 'shadow-emerald-500/20',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      text: 'text-emerald-400',
    },
    Average: {
      stroke: 'url(#avgGradient)',
      glow: 'shadow-amber-500/20',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      text: 'text-amber-400',
    },
    Poor: {
      stroke: 'url(#poorGradient)',
      glow: 'shadow-rose-500/20',
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      text: 'text-rose-400',
    },
  }[status];

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg
        width={size}
        height={size * 0.88}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="goodGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="avgGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="poorGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f87171" />
          </linearGradient>
        </defs>

        {/* Background track arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          transform={`rotate(150 ${center} ${center})`}
        />

        {/* Active progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colorMap.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(150 ${center} ${center})`}
          className="transition-all duration-1000 ease-out"
        />

        {/* Center score readout */}
        <g transform={`translate(${center}, ${center - 5})`}>
          <text
            x="0"
            y="-4"
            textAnchor="middle"
            className="fill-white font-bold text-4xl tracking-tight"
            style={{ fontSize: '38px', fontWeight: 800 }}
          >
            {Math.round(clampedScore)}
            <tspan fontSize="20" fill="#94a3b8" dx="2">
              %
            </tspan>
          </text>
          <text
            x="0"
            y="26"
            textAnchor="middle"
            className="fill-slate-400 font-medium tracking-wide uppercase"
            style={{ fontSize: '11px', letterSpacing: '0.08em' }}
          >
            {label}
          </text>
        </g>
      </svg>

      {/* Status Pill */}
      <div className="mt-[-10px] flex flex-col items-center">
        <span
          className={`px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-sm ${colorMap.badgeBg}`}
        >
          Signal Status: {status}
        </span>
        {sublabel && (
          <span className="text-xs text-slate-400 mt-1 font-mono">{sublabel}</span>
        )}
      </div>
    </div>
  );
};
