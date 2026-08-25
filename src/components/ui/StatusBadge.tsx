import React from 'react';
import { SKUStatus } from '../../core/domain/models/sku';

interface StatusBadgeProps {
  status: SKUStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'active':
      return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#103319] text-[#00FF41] border border-[#00FF41]/30 ${className}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#00FF41] animate-pulse" />
          ACTIVE
        </span>
      );
    case 'low_stock':
      return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#332200] text-[#FFAA00] border border-[#FFAA00]/40 ${className}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFAA00]" />
          LOW STOCK
        </span>
      );
    case 'out_of_stock':
      return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#330A0A] text-[#FF4444] border border-[#FF4444]/40 ${className}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF4444]" />
          OUT OF STOCK
        </span>
      );
    case 'in_transit':
      return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#002233] text-[#00CCFF] border border-[#00CCFF]/40 ${className}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#00CCFF]" />
          IN TRANSIT
        </span>
      );
    case 'discontinued':
      return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#1A1A1A] text-[#777] border border-[#333] ${className}`}>
          DISCONTINUED
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#111] text-[#AAA] border border-[#222] ${className}`}>
          {status}
        </span>
      );
  }
};
