import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Percent, 
  ArrowUpRight, 
  Sparkles, 
  Building2,
  Calendar,
  Activity,
  Terminal,
  Layers
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
import { 
  HOURLY_SALES_TREND, 
  SALES_TREND_7D, 
  SALES_TREND_30D,
  CONVERSION_FUNNEL_DATA,
  CONVERSION_FUNNEL_7D,
  CONVERSION_FUNNEL_30D
} from '../data/mockData';
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

  // Branch proportion factor for non-global views
  const branchRatio = isGlobal ? 1 : Math.max(0.12, currentBranch.revenueToday / 128450);

  // Time-frame dynamic computations
  const getPeriodData = () => {
    switch (timeRange) {
      case '7d': {
        const rawRevenue = isGlobal ? 892300 : Math.round(892300 * branchRatio);
        const rawOrders = isGlobal ? 4494 : Math.round(4494 * branchRatio);
        const rawAbandoned = isGlobal ? 58630 : Math.round(58630 * branchRatio);
        const chartData = SALES_TREND_7D.map(item => ({
          ...item,
          revenue: Math.round(item.revenue * branchRatio),
          orders: Math.round(item.orders * branchRatio)
        }));
        return {
          badge: '● 7-DAY AGGREGATE',
          chartTitle: '7-Day Revenue & Order Inflow Trajectory',
          chartSubtitle: 'Daily consolidated multi-channel telemetry streams',
          timeLabel: '7D',
          revenueLabel: 'Gross Revenue (7D)',
          revenue: rawRevenue,
          orders: rawOrders,
          growthTag: '+18.7% vs PREV 7D',
          conversion: isGlobal ? '4.96%' : '4.32%',
          conversionTag: '+0.74% Benchmark',
          aov: (rawRevenue / rawOrders).toFixed(2),
          aovDiff: '+€16.20 MoM',
          margin: '54.8%',
          abandoned: rawAbandoned,
          recoveryRate: '71.4% Rate',
          chartData,
          funnelData: CONVERSION_FUNNEL_7D.map((f, i) => ({
            ...f,
            count: isGlobal ? f.count : Math.round(f.count * branchRatio)
          })),
          velocityMultiplier: 7,
          velocityUnit: 'u / 7d'
        };
      }
      case '30d': {
        const rawRevenue = isGlobal ? 3840600 : Math.round(3840600 * branchRatio);
        const rawOrders = isGlobal ? 19260 : Math.round(19260 * branchRatio);
        const rawAbandoned = isGlobal ? 251200 : Math.round(251200 * branchRatio);
        const chartData = SALES_TREND_30D.map(item => ({
          ...item,
          revenue: Math.round(item.revenue * branchRatio),
          orders: Math.round(item.orders * branchRatio)
        }));
        return {
          badge: '● 30-DAY CONSOLIDATED',
          chartTitle: '30-Day Multi-Week Revenue & Volume Growth',
          chartSubtitle: 'Aggregated monthly performance across all nodes & digital checkout',
          timeLabel: '30D',
          revenueLabel: 'Gross Revenue (30D)',
          revenue: rawRevenue,
          orders: rawOrders,
          growthTag: '+22.4% vs PREV 30D',
          conversion: isGlobal ? '5.12%' : '4.48%',
          conversionTag: '+0.90% Benchmark',
          aov: (rawRevenue / rawOrders).toFixed(2),
          aovDiff: '+€17.10 MoM',
          margin: '55.1%',
          abandoned: rawAbandoned,
          recoveryRate: '73.8% Rate',
          chartData,
          funnelData: CONVERSION_FUNNEL_30D.map((f, i) => ({
            ...f,
            count: isGlobal ? f.count : Math.round(f.count * branchRatio)
          })),
          velocityMultiplier: 30,
          velocityUnit: 'u / mo'
        };
      }
      case 'today':
      default: {
        const rawRevenue = isGlobal ? 128450 : currentBranch.revenueToday;
        const rawOrders = isGlobal ? 642 : currentBranch.ordersToday;
        const rawAbandoned = isGlobal ? 8376 : 2480;
        const chartData = HOURLY_SALES_TREND.map(item => ({
          ...item,
          revenue: Math.round(item.revenue * branchRatio),
          orders: Math.round(item.orders * branchRatio)
        }));
        return {
          badge: '● LIVE 24H FEED',
          chartTitle: 'Hourly Revenue Pulse & Order Inflow',
          chartSubtitle: 'Multi-channel POS + eCommerce digital streams synchronized',
          timeLabel: '24H',
          revenueLabel: 'Gross Revenue (24H)',
          revenue: rawRevenue,
          orders: rawOrders,
          growthTag: '+14.2% TARGET',
          conversion: isGlobal ? '4.82%' : '4.15%',
          conversionTag: '+0.6% Benchmark',
          aov: (rawRevenue / rawOrders).toFixed(2),
          aovDiff: '+€18.40 MoM',
          margin: '54.2%',
          abandoned: rawAbandoned,
          recoveryRate: '68.2% Rate',
          chartData,
          funnelData: CONVERSION_FUNNEL_DATA.map((f, i) => ({
            ...f,
            count: isGlobal ? f.count : Math.round(f.count * branchRatio)
          })),
          velocityMultiplier: 1,
          velocityUnit: 'u / day'
        };
      }
    }
  };

  const currentPeriod = getPeriodData();

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
            <span className="text-[10px] px-2 py-0.5 bg-[#103319] text-[#00FF41] border border-[#00FF41]/40 uppercase tracking-widest animate-pulse">
              {currentPeriod.badge}
            </span>
          </div>
          <p className="text-[10px] text-[#666] mt-0.5">
            NODE: <span className="text-[#00FF41] font-bold">{currentBranch.name.toUpperCase()}</span> • TELEMETRY LATENCY: 12MS • RANGE: <span className="text-white font-bold">{currentPeriod.timeLabel}</span>
          </p>
        </div>

        {/* Time filters (24H / 7D / 30D) & Copilot quick trigger */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-[#0A0A0A] border border-[#1F1F23] text-[10px]">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1 uppercase tracking-wider transition-all cursor-pointer ${
                timeRange === 'today' 
                  ? 'bg-white text-black font-bold shadow-sm' 
                  : 'text-[#888] hover:text-white hover:bg-[#151515]'
              }`}
            >
              24H
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 uppercase tracking-wider transition-all cursor-pointer ${
                timeRange === '7d' 
                  ? 'bg-white text-black font-bold shadow-sm' 
                  : 'text-[#888] hover:text-white hover:bg-[#151515]'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 uppercase tracking-wider transition-all cursor-pointer ${
                timeRange === '30d' 
                  ? 'bg-white text-black font-bold shadow-sm' 
                  : 'text-[#888] hover:text-white hover:bg-[#151515]'
              }`}
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
        <div className="p-4 bg-[#0F0F11] border border-[#1F1F23] transition-all hover:border-[#333]">
          <div className="flex items-center justify-between text-[#666] text-[10px] uppercase tracking-wider font-bold">
            <span>{currentPeriod.revenueLabel}</span>
            <div className="p-1 bg-[#103319] text-[#00FF41] border border-[#00FF41]/30">
              <DollarSign className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-mono text-[#00FF41] mt-2 font-bold tracking-tight">
            €{currentPeriod.revenue.toLocaleString('es-ES')}
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px]">
            <span className="text-[#00FF41] flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> {currentPeriod.growthTag}
            </span>
            <span className="text-[#666]">{currentPeriod.orders.toLocaleString('es-ES')} Orders</span>
          </div>
        </div>

        {/* KPI 2: Conversion Rate */}
        <div className="p-4 bg-[#0F0F11] border border-[#1F1F23] transition-all hover:border-[#333]">
          <div className="flex items-center justify-between text-[#666] text-[10px] uppercase tracking-wider font-bold">
            <span>Checkout Conversion</span>
            <div className="p-1 bg-[#16161A] text-white border border-[#333]">
              <Percent className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-mono text-white mt-2 font-bold tracking-tight">
            {currentPeriod.conversion}
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px]">
            <span className="text-[#00FF41] flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> {currentPeriod.conversionTag}
            </span>
            <span className="text-[#666]">Goal: 4.0%</span>
          </div>
        </div>

        {/* KPI 3: Average Order Value (AOV) */}
        <div className="p-4 bg-[#0F0F11] border border-[#1F1F23] transition-all hover:border-[#333]">
          <div className="flex items-center justify-between text-[#666] text-[10px] uppercase tracking-wider font-bold">
            <span>Avg Ticket (AOV)</span>
            <div className="p-1 bg-[#16161A] text-white border border-[#333]">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-mono text-white mt-2 font-bold tracking-tight">
            €{currentPeriod.aov}
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px]">
            <span className="text-[#00FF41] flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> {currentPeriod.aovDiff}
            </span>
            <span className="text-[#666]">Margin: {currentPeriod.margin}</span>
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
          <div className="text-2xl font-mono text-[#FFAA00] mt-2 font-bold tracking-tight">
            €{currentPeriod.abandoned.toLocaleString('es-ES')}
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px]">
            <span className="text-[#FFAA00] flex items-center gap-0.5 underline">
              AI Recover →
            </span>
            <span className="text-[#666]">{currentPeriod.recoveryRate}</span>
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 8 Cols: Revenue & Orders Trend (Recharts AreaChart) */}
        <div className="lg:col-span-8 p-4 bg-[#0A0A0A] border border-[#1A1A1A]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-[#1A1A1A]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#555] font-mono">01 //</span>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {currentPeriod.chartTitle}
                </h3>
              </div>
              <p className="text-[10px] text-[#666] mt-0.5">
                {currentPeriod.chartSubtitle}
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
              <AreaChart data={currentPeriod.chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF41" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00FF41" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#1A1A1A" vertical={false} />
                <XAxis dataKey="time" stroke="#444" tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis stroke="#444" tick={{ fontSize: 10, fill: '#888' }} />
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
                Checkout Funnel Telemetry ({currentPeriod.timeLabel})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('carts')}
              className="text-[10px] text-[#00FF41] hover:underline uppercase cursor-pointer"
            >
              View Dropouts →
            </button>
          </div>

          <div className="space-y-2">
            {currentPeriod.funnelData.map((step, idx) => {
              const maxCount = currentPeriod.funnelData[0].count;
              const pctOfTotal = maxCount > 0 ? ((step.count / maxCount) * 100).toFixed(1) : '0.0';
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
                Top Velocity SKUs ({currentPeriod.velocityUnit})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('skus')}
              className="text-[10px] text-[#00FF41] hover:underline uppercase cursor-pointer"
            >
              Full Master SKU →
            </button>
          </div>

          <div className="space-y-2">
            {topSellingSKUs.map((sku, rank) => {
              const grossMargin = (((sku.retailPrice - sku.costPrice) / sku.retailPrice) * 100).toFixed(0);
              const computedVelocity = (sku.salesVelocityDaily * currentPeriod.velocityMultiplier).toFixed(1);
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
                      {computedVelocity} {currentPeriod.velocityUnit}
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
