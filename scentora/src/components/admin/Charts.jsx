import React from 'react';
import { cx } from '../../utils/helpers';

export function DonutChart({ data = [], size = 200, thickness = 26, label = '' }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = size / 2 - thickness / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const segments = data.map((d) => {
    const start = cumulative;
    cumulative += (d.value / total) * 100;
    return { ...d, start, end: cumulative };
  });

  return (
    <div className="donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={thickness}
        />
        {segments.map((s, i) => {
          const dash = (s.end - s.start) * circumference / 100;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-((s.start / 100) * circumference)}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
      </svg>
      <div className="donut__center">
        <strong>{data.reduce((s, d) => s + d.value, 0)}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export function BarChart({ data = [], height = 220 }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="bar-chart" style={{ height }} role="img" aria-label="Bar chart">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`grid-${i}`}
          className="bar-chart__gridline"
          style={{ bottom: `${(i / 4) * 90}%` }}
          aria-hidden="true"
        />
      ))}
      {data.map((d, i) => (
        <div className="bar-chart__col" key={i} title={`${d.label}: ${d.value}`}>
          <div className="bar-chart__track">
            <div
              className="bar-chart__bar"
              style={{ height: `${Math.max((d.value / max) * 90, 2)}%` }}
            />
          </div>
          <span className="bar-chart__label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function LineChart({ data = [], height = 220, stroke = 'var(--color-accent)' }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d.value - min) / range) * 85;
      return { ...d, x, y };
    });
  const line = points.map((p) => `${p.x},${p.y}`).join(' ');
  const area = `0,100 ${line} 100,100`;

  return (
    <div className="line-chart" style={{ height }} role="img" aria-label="Line chart">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`grid-${i}`}
          className="line-chart__gridline"
          style={{ bottom: `${(i / 4) * 85}%` }}
          aria-hidden="true"
        />
      ))}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="line-chart__svg">
        <polygon points={area} fill={stroke} opacity="0.12" />
        <polyline
          points={line}
          fill="none"
          stroke={stroke}
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      </svg>
      <div className="line-chart__labels">
        {points.map((p, i) => (
          <span key={i} className="line-chart__point" style={{ left: `${p.x}%` }} title={`${p.label}: ${p.value}`} />
        ))}
      </div>
      <div className="line-chart__x">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

export function KPI({ label, value, delta = null, deltaLabel = '', trend = 'up', icon: Icon = null, muted = false }) {
  return (
    <div className={cx('kpi', muted && 'kpi--muted')}>
      {Icon && (
        <span className="kpi__icon">
          <Icon width={20} height={20} />
        </span>
      )}
      <div className="kpi__body">
        <span className="kpi__label">{label}</span>
        <strong className="kpi__value">{value}</strong>
        {delta != null && (
          <span className={cx('kpi__delta', `kpi__delta--${trend}`)}>
            {trend === 'up' ? '▲' : '▼'} {delta}% <em>{deltaLabel}</em>
          </span>
        )}
      </div>
    </div>
  );
}

export function StatBadge({ children, tone = 'neutral' }) {
  return <span className={`stat-badge stat-badge--${tone}`}>{children}</span>;
}