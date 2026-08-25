import React from 'react';
import { Terminal } from 'lucide-react';

interface TerminalHeaderProps {
  moduleIndex?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  actions?: React.ReactNode;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  moduleIndex,
  title,
  subtitle,
  badge,
  badgeColor = 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30',
  actions
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1A1A1A]">
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2 bg-[#111] border border-[#222] text-[#00FF41]">
          <Terminal className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            {moduleIndex && (
              <span className="text-[10px] font-mono text-[#00FF41]">{moduleIndex} //</span>
            )}
            <h1 className="text-base font-bold font-mono tracking-tight text-white uppercase">
              {title}
            </h1>
            {badge && (
              <span className={`text-[9px] font-mono px-2 py-0.5 uppercase ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-[#666] font-mono mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
};
