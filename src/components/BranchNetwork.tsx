import React from 'react';
import { 
  Building2, 
  MapPin,
  Database,
  Activity,
  Cpu,
  Lock,
  Radio,
  Server
} from 'lucide-react';
import { StoreBranch } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { BRANCH_COMPARISON_DATA } from '../data/mockData';

interface BranchNetworkProps {
  branches: StoreBranch[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
}

export const BranchNetwork: React.FC<BranchNetworkProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch
}) => {
  const nonGlobalBranches = branches.filter(b => b.id !== 'branch-all');

  const getNodeTechConfig = (branch: StoreBranch) => {
    switch (branch.type) {
      case 'hub_central':
        return {
          icon: Database,
          label: 'DATABASE / WMS',
          color: '#00FF41',
          tag: 'DB-STORAGE'
        };
      case 'flagship':
        return {
          icon: Activity,
          label: 'TELEMETRÍA POS',
          color: '#00F0FF',
          tag: 'TELEMETRY'
        };
      case 'mall_store':
        return {
          icon: Cpu,
          label: 'TECNOLOGÍA / IOT',
          color: '#FFAA00',
          tag: 'HARDWARE'
        };
      default:
        return {
          icon: Lock,
          label: 'CRIPTOGRAFÍA / EDGE',
          color: '#00FF41',
          tag: 'CRYPTO-TLS'
        };
    }
  };

  return (
    <div className="space-y-4 pb-8 font-mono-data text-[#E2E2E2]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A1A1A]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight uppercase">
              Branch Network & Logistic Nodes
            </h1>
            <span className="text-[10px] px-2 py-0.5 bg-[#103319] text-[#00FF41] border border-[#00FF41]/40 uppercase">
              {nonGlobalBranches.length} Nodes Online
            </span>
          </div>
          <p className="text-[10px] text-[#666] mt-0.5">
            Distributed stock nodes, localized retail fulfillment throughput & storage capacity
          </p>
        </div>
      </div>

      {/* Chart: Branch Comparison vs Sales Target */}
      <div className="p-4 bg-[#0A0A0A] border border-[#1A1A1A] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Node Revenue Throughput vs Target (€)
            </h3>
            <p className="text-[10px] text-[#666]">
              Real-time comparison across Flagships, Hubs and Express Outlets
            </p>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BRANCH_COMPARISON_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#1A1A1A" vertical={false} />
              <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <YAxis stroke="#555" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#050505', 
                  borderColor: '#262626', 
                  borderRadius: '0px', 
                  color: '#E2E2E2',
                  fontSize: '11px',
                  fontFamily: 'JetBrains Mono'
                }} 
                formatter={(val: any) => [`€${Number(val).toLocaleString('es-ES')}`, 'Amount']}
              />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }} />
              <Bar dataKey="revenue" name="Actual Revenue (€)" fill="#00FF41" radius={[0, 0, 0, 0]} />
              <Bar dataKey="target" name="Target Quota (€)" fill="#333333" stroke="#555555" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {nonGlobalBranches.map((branch) => {
          const isSelected = selectedBranchId === branch.id;
          const capacityPct = ((branch.inventoryUsed / branch.inventoryCapacity) * 100).toFixed(0);
          const techConfig = getNodeTechConfig(branch);
          const TechIcon = techConfig.icon;

          return (
            <div 
              key={branch.id}
              onClick={() => onSelectBranch(branch.id)}
              className={`p-4 border transition-all cursor-pointer space-y-3 group ${
                isSelected 
                  ? 'bg-[#103319]/20 border-[#00FF41]' 
                  : 'bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#333]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className={`h-10 w-10 flex items-center justify-center border transition-all ${
                      isSelected 
                        ? 'bg-[#00FF41] text-black border-[#00FF41] font-bold' 
                        : 'bg-gradient-to-br from-[#121216] to-[#070709] text-white border-[#2A2A30] group-hover:border-[#00FF41]'
                    }`}>
                      <TechIcon 
                        className={`h-5 w-5 ${isSelected ? 'text-black' : ''}`}
                        style={!isSelected ? { color: techConfig.color, filter: `drop-shadow(0 0 4px ${techConfig.color}66)` } : {}}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] font-mono uppercase px-1 py-0.2 bg-[#121214] border border-[#262626] text-[#888]">
                        {techConfig.label}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-tight mt-0.5">
                      {branch.name}
                    </h4>
                    <div className="text-[10px] text-[#666] flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-[#00FF41]" />
                      <span>{branch.address}, {branch.city}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[9px] px-1.5 py-0.5 bg-[#050505] border border-[#333] text-[#00FF41] font-mono">
                  {branch.code}
                </span>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1A1A1A] text-xs">
                <div className="p-2 bg-[#050505] border border-[#1A1A1A]">
                  <div className="text-[9px] text-[#666] uppercase">Today's Rev</div>
                  <div className="text-xs font-bold font-mono text-[#00FF41] mt-0.5">
                    €{branch.revenueToday.toLocaleString('es-ES')}
                  </div>
                </div>

                <div className="p-2 bg-[#050505] border border-[#1A1A1A]">
                  <div className="text-[9px] text-[#666] uppercase">Orders</div>
                  <div className="text-xs font-bold font-mono text-white mt-0.5">
                    {branch.ordersToday}
                  </div>
                </div>

                <div className="p-2 bg-[#050505] border border-[#1A1A1A]">
                  <div className="text-[9px] text-[#666] uppercase">Staff</div>
                  <div className="text-xs font-bold font-mono text-[#888] mt-0.5">
                    {branch.activeStaff} act
                  </div>
                </div>
              </div>

              {/* Warehouse Capacity Meter */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-[#666] text-[10px]">
                  <span className="uppercase">Occupancy Rate</span>
                  <span className="text-white font-mono">{branch.inventoryUsed.toLocaleString()} / {branch.inventoryCapacity.toLocaleString()} ({capacityPct}%)</span>
                </div>
                <div className="w-full bg-[#111] h-1.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      parseInt(capacityPct, 10) > 85 ? 'bg-[#FF4444]' : 'bg-[#00FF41]'
                    }`}
                    style={{ width: `${capacityPct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-[#666] border-t border-[#141414]">
                <span>Manager: <span className="text-[#AAA]">{branch.manager}</span></span>
                <span className="text-[#00FF41] font-mono">
                  {isSelected ? '● ACTIVE NODE FILTER' : 'SELECT NODE →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
