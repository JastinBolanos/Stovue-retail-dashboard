import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Sparkles, 
  Zap, 
  AlertCircle, 
  Building2,
  Calendar,
  Activity,
  Terminal
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { HOURLY_SALES_TREND, CONVERSION_FUNNEL_DATA } from '../data/mockData';
import { ProductSKU, LiveOrderEvent, StoreBranch } from '../types';

interface DashboardOverviewProps {
  skus: ProductSKU[];
  branches: StoreBranch[];
  selectedBranchId: string;
  liveEvents: LiveOrderEvent[];
  onNavigateTab: (tab: string) => void;
  onOpenCopilot: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  skus,
  branches,
  selectedBranchId,
  liveEvents,
  onNavigateTab,
  onOpenCopilot
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('today');

  const currentBranch = branches.find(b => b.id === selectedBranchId) || branches[0];
  const isGlobal = selectedBranchId === 'branch-all';

  // Computed metrics
  const totalRevenue = isGlobal ? 128450 : currentBranch.revenueToday;
  const totalOrders = isGlobal ? 642 : currentBranch.ordersToday;
  const aov = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00';
  const conversionRate = isGlobal ? '4.82%' : '4.15%';
  const abandonedValue = isGlobal ? 8376 : 2480;

  // Top 5 velocity SKUs
  const topSellingSKUs = [...skus].sort((a, b) => b.salesVelocityDaily - a.salesVelocityDaily).slice(0, 5);

  return (
    <div className="space-y-4 pb-8 font-mono-data text-[#E2E2E2]">
      {/* Top Banner / Breadcrumb & Time filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A1A1A]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight uppercase">
              Omnichannel Sales & Conversion Matrix
            </h1>
            <span className="text-[10px] px-2 py-0.5 bg-[#103319] text-[#00FF41] border border-[#00FF41]/40 uppercase tracking-widest">
              ● LIVE 24H FEED
            </span>
          </div>
          <p className="text-[10px] text-[#666] mt-0.5">
            NODE: <span className="text-[#00FF41] font-bold">{currentBranch.name.toUpperCase()}</span> • TELEMETRY LATENCY: 12MS
          </p>
        </div>

        {/* Time filters & Copilot quick trigger */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-[#0A0A0A] border border-[#1F1F23] text-[10px]">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-2.5 py-1 uppercase tracking-wider transition ${timeRange === 'today' ? 'bg-white text-black font-bold' : 'text-[#888] hover:text-white'}`}
            >
              24H
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1 uppercase tracking-wider transition ${timeRange === '7d' ? 'bg-white text-black font-bold' : 'text-[#888] hover:text-white'}`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 uppercase tracking-wider transition ${timeRange === '30d' ? 'bg-white text-black font-bold' : 'text-[#888] hover:text-white'}`}
            >
              30D
            </button>
          </div>

          <button
            onClick={onOpenCopilot}
            className="px-3 py-1.5 bg-[#0F0F11] hover:bg-[#16161A] text-white text-[10px] font-bold uppercase tracking-wider border border-[#333] hover:border-[#00FF41] transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="h-3 w-3 text-[#00FF41]" />
            AI Audit
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* KPI 1: Total Revenue */}
        <div className="p-4 bg-[#0F0F11] border border-[#1F1F23]">
          <div className="flex items-center justify-between text-[#666] text-[10px] uppercase tracking-wider font-bold">
            <span>Gross Revenue (24h)</span>
            <div className="p-1 bg-[#103319] text-[#00FF41] border border-[#00FF41]/30">
              <DollarSign className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-mono text-[#00FF41] mt-2">
            €{totalRevenue.toLocaleString('es-ES')}
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px]">
            <span className="text-[#00FF41] flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> +14.2% TARGET
            </span>
            <span className="text-[#666]">{totalOrders} Orders</span>
          </div>
        </div>

        {/* KPI 2: Conversion Rate */}
        <div className="p-4 bg-[#0F0F11] border border-[#1F1F23]">
          <div className="flex items-center justify-between text-[#666] text-[10px] uppercase tracking-wider font-bold">
            <span>Checkout Conversion</span>
            <div className="p-1 bg-[#16161A] text-white border border-[#333]">
              <Percent className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-mono text-white mt-2">
            {conversionRate}
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px]">
            <span className="text-[#00FF41] flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> +0.6% Benchmark
            </span>
            <span className="text-[#666]">Goal: 4.0%</span>
          </div>
        </div>

        {/* KPI 3: Average Order Value (AOV) */}
        <div className="p-4 bg-[#0F0F11] border border-[#1F1F23]">
          <div className="flex items-center justify-between text-[#666] text-[10px] uppercase tracking-wider font-bold">
            <span>Avg Ticket (AOV)</span>
            <div className="p-1 bg-[#16161A] text-white border border-[#333]">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-mono text-white mt-2">
            €{aov}
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px]">
            <span className="text-[#00FF41] flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> +€18.40 MoM
            </span>
            <span className="text-[#666]">Margin: 54.2%</span>
          </div>
        </div>

        {/* KPI 4: Cart Abandonment Loss */}
        <div 
          className="p-4 bg-[#0F0F11] border border-[#1F1F23] hover:border-[#FFAA00] transition cursor-pointer" 
          onClick={() => onNavigateTab('carts')}
        >
          <div className="flex items-center justify-between text-[#666] text-[10px] uppercase tracking-wider font-bold">
            <span>Retained in Dropouts</span>
            <div className="p-1 bg-[#332211] text-[#FFAA00] border border-[#FFAA00]/40">
              <ShoppingCart className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-mono text-[#FFAA00] mt-2">
            €{abandonedValue.toLocaleString('es-ES')}
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px]">
            <span className="text-[#FFAA00] flex items-center gap-0.5 underline">
              AI Recover →
            </span>
            <span className="text-[#666]">68.2% Rate</span>
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 8 Cols: Hourly Revenue & Orders Trend (Recharts AreaChart) */}
        <div className="lg:col-span-8 p-4 bg-[#0A0A0A] border border-[#1A1A1A]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-[#1A1A1A]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#555] font-mono">01 //</span>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Hourly Revenue Pulse & Order Inflow
                </h3>
              </div>
              <p className="text-[10px] text-[#666] mt-0.5">
                Multi-channel POS + eCommerce digital streams synchronized
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 bg-[#00FF41]" />
                <span className="text-[#AAA]">Revenue (€)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 bg-white" />
                <span className="text-[#AAA]">Orders</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_SALES_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF41" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00FF41" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#1A1A1A" vertical={false} />
                <XAxis dataKey="hour" stroke="#444" tick={{ fontSize: 10, fill: '#666' }} />
                <YAxis stroke="#444" tick={{ fontSize: 10, fill: '#666' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#050505', 
                    borderColor: '#262626', 
                    borderRadius: '0px', 
                    color: '#E2E2E2',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px'
                  }} 
                  formatter={(value: any, name: any) => [
                    name === 'revenue' ? `€${Number(value).toLocaleString('es-ES')}` : value, 
                    name === 'revenue' ? 'Revenue' : 'Orders'
                  ]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00FF41" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="orders" stroke="#ffffff" strokeWidth={1.5} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 4 Cols: Live Operations Event Feed */}
        <div className="lg:col-span-4 p-4 bg-[#0A0A0A] border border-[#1A1A1A] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#555] font-mono">02 //</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF41] animate-pulse" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Operations Stream
                </h3>
              </div>
              <span className="text-[9px] text-[#666]">
                {liveEvents.length} EVENTS
              </span>
            </div>

            {/* Events List */}
            <div className="space-y-2 mt-3 max-h-64 overflow-y-auto pr-1">
              {liveEvents.slice(0, 5).map((evt) => (
                <div 
                  key={evt.id} 
                  className="p-2 bg-[#050505] border border-[#1A1A1A] text-[10px] hover:border-[#333] transition"
                >
                  <div className="flex items-center justify-between text-[#666]">
                    <span className="text-[#00FF41] font-bold">{evt.branchName}</span>
                    <span>{evt.timestamp}</span>
                  </div>
                  <div className="text-white font-bold mt-0.5 truncate">
                    {evt.title}
                  </div>
                  <div className="text-[#888] text-[9px] truncate">
                    {evt.description}
                  </div>
                  {evt.value && (
                    <div className="text-[#00FF41] font-mono text-[9px] mt-0.5">
                      +€{evt.value.toLocaleString('es-ES')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#1A1A1A] mt-2">
            <button
              onClick={() => onNavigateTab('skus')}
              className="w-full py-1.5 bg-[#0F0F11] hover:bg-[#16161A] text-[#AAA] hover:text-white text-[10px] uppercase tracking-wider border border-[#222] transition text-center block cursor-pointer"
            >
              Access SKU Catalog Audit →
            </button>
          </div>
        </div>

      </div>

      {/* Secondary Row: Conversion Funnel & Top Selling Velocity SKUs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 6 Cols: Conversion Funnel */}
        <div className="lg:col-span-6 p-4 bg-[#0A0A0A] border border-[#1A1A1A]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1A1A1A]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#555] font-mono">03 //</span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Checkout Funnel Dropout Telemetry
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('carts')}
              className="text-[10px] text-[#00FF41] hover:underline uppercase"
            >
              View Dropouts →
            </button>
          </div>

          <div className="space-y-2">
            {CONVERSION_FUNNEL_DATA.map((step, idx) => {
              const maxCount = CONVERSION_FUNNEL_DATA[0].count;
              const pctOfTotal = ((step.count / maxCount) * 100).toFixed(1);
              return (
                <div key={idx} className="p-2.5 bg-[#050505] border border-[#1A1A1A]">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-white">{step.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono">{step.count.toLocaleString('es-ES')}</span>
                      <span className="text-[#666]">({pctOfTotal}%)</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#1A1A1A] h-1.5 overflow-hidden mt-1.5">
                    <div 
                      className="h-full transition-all duration-500 bg-[#00FF41]"
                      style={{ 
                        width: `${pctOfTotal}%`, 
                        opacity: 1 - (idx * 0.15)
                      }} 
                    />
                  </div>

                  {step.dropRate > 0 && (
                    <div className="text-[9px] text-[#FF4444] mt-1 flex items-center justify-end">
                      <span>Dropout: -{step.dropRate}% vs previous stage</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: Top 5 Sales Velocity SKUs */}
        <div className="lg:col-span-6 p-4 bg-[#0A0A0A] border border-[#1A1A1A]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1A1A1A]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#555] font-mono">04 //</span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Top Velocity SKUs (Units / Day)
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('skus')}
              className="text-[10px] text-[#00FF41] hover:underline uppercase"
            >
              Full Master SKU →
            </button>
          </div>

          <div className="space-y-2">
            {topSellingSKUs.map((sku, rank) => {
              const grossMargin = (((sku.retailPrice - sku.costPrice) / sku.retailPrice) * 100).toFixed(0);
              return (
                <div 
                  key={sku.id}
                  className="p-2.5 bg-[#050505] border border-[#1A1A1A] flex items-center justify-between hover:border-[#333] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-1.5 py-0.5 bg-[#16161A] text-[#00FF41] font-mono text-[10px] border border-[#2A2A2E]">
                      0{rank + 1}
                    </span>
                    <img 
                      src={sku.image} 
                      alt={sku.name} 
                      className="h-8 w-8 object-cover border border-[#222]" 
                    />
                    <div>
                      <div className="text-xs font-bold text-white max-w-[200px] truncate">
                        {sku.name}
                      </div>
                      <div className="text-[9px] text-[#666]">
                        SKU: <span className="text-[#00FF41]">{sku.sku}</span> • Stock: <span className={sku.totalStock < sku.minStockAlert ? 'text-[#FF4444] font-bold' : 'text-[#00FF41]'}>{sku.totalStock}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono text-[#00FF41]">
                      {sku.salesVelocityDaily} u/day
                    </div>
                    <div className="text-[9px] text-[#888]">
                      Margin: {grossMargin}% (+€{sku.retailPrice - sku.costPrice})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
