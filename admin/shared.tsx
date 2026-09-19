import React from 'react';
import { fmtDate } from './api';

export const LiveBadge: React.FC<{ publishAt: string; isPublished: boolean }> = ({ publishAt, isPublished }) => {
  if (!isPublished) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-700 text-neutral-300">HIDDEN</span>;
  if (new Date(publishAt).getTime() > Date.now())
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">SCHEDULED · {fmtDate(publishAt)}</span>
    );
  return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">LIVE</span>;
};

export const ProgressBar: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs text-neutral-400">
      <span>{label}</span>
      <span>{Math.round(value * 100)}%</span>
    </div>
    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full bg-[#D6A85F] transition-all" style={{ width: `${value * 100}%` }} />
    </div>
  </div>
);

export const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode; className?: string }> = ({
  label,
  hint,
  children,
  className,
}) => (
  <label className={`block ${className ?? ''}`}>
    <span className="label">{label}</span>
    {children}
    {hint && <span className="block text-[11px] text-neutral-500 mt-1">{hint}</span>}
  </label>
);

export const Card: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
  <section className="rounded-2xl bg-[#121212] border border-white/10 p-5">
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-semibold">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);
