import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: string;
  className?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subValue,
  icon: Icon,
  trend,
  className = '',
  onClick
}) => {
  return (
    <div 
      id={id}
      onClick={onClick}
      className={`p-3.5 bg-[#0D0D0D] border border-[#1A1A1A] flex flex-col justify-between transition-colors ${onClick ? 'cursor-pointer hover:border-[#333]' : ''} ${className}`}
    >
      <div className="flex items-center justify-between text-[#888] mb-1">
        <span className="text-[10px] font-mono tracking-wider uppercase">{title}</span>
        {Icon && <Icon className="h-3.5 w-3.5 text-[#666]" />}
      </div>

      <div className="text-xl font-bold font-mono tracking-tight text-white my-0.5">
        {value}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono mt-1">
        {subValue && <span className="text-[#666]">{subValue}</span>}
        {trend && (
          <span className={`flex items-center gap-0.5 font-bold ${trend.isPositive ? 'text-[#00FF41]' : 'text-[#FF4444]'}`}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
