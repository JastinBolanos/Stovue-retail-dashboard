import React from 'react';
import { 
  BarChart3, 
  Package, 
  AlertTriangle, 
  ShoppingCart, 
  Building2, 
  Bot, 
  Layers, 
  Activity,
  Radio,
  Server
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  lowStockCount: number;
  abandonedCartsCount: number;
  totalSKUs: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  lowStockCount,
  abandonedCartsCount,
  totalSKUs,
}) => {
  const { language } = useLanguage();

  const isEs = language === 'es';

  const menuItems = [
    {
      idx: '01',
      id: 'overview',
      label: isEs ? 'Rendimiento & Embudos' : 'Performance & Funnels',
      sublabel: isEs ? 'Matriz de conversión y ventas' : 'Conversion matrix & live sales',
      icon: BarChart3,
      badge: null,
    },
    {
      idx: '02',
      id: 'skus',
      label: isEs ? 'Catálogo Maestro SKU' : 'SKU Master Catalog',
      sublabel: isEs ? 'Precios masivos y márgenes' : 'Bulk price & margin controls',
      icon: Package,
      badge: `${totalSKUs} SKUs`,
    },
    {
      idx: '03',
      id: 'alerts',
      label: isEs ? 'Radar Stock & Órdenes' : 'Inventory Radar & POs',
      sublabel: isEs ? 'Previsión de roturas y compras' : 'Out-of-stock forecast & supply',
      icon: AlertTriangle,
      badge: lowStockCount > 0 ? (isEs ? `${lowStockCount} Crítico` : `${lowStockCount} Critical`) : null,
      badgeColor: 'bg-[#FF4444]/20 text-[#FF4444] border border-[#FF4444]/40',
    },
    {
      idx: '04',
      id: 'carts',
      label: isEs ? 'Carritos Abandonados' : 'Checkout Dropouts',
      sublabel: isEs ? 'Recuperación de GMV con IA' : 'AI-assisted revenue recovery',
      icon: ShoppingCart,
      badge: abandonedCartsCount > 0 ? (isEs ? `${abandonedCartsCount} Retenidos` : `${abandonedCartsCount} Retained`) : null,
      badgeColor: 'bg-[#FFAA00]/20 text-[#FFAA00] border border-[#FFAA00]/40',
    },
    {
      idx: '05',
      id: 'branches',
      label: isEs ? 'Red de Nodos & Hubs' : 'Node Network & Hubs',
      sublabel: isEs ? 'Sincronización omnicanal' : 'Omnichannel multi-store sync',
      icon: Building2,
      badge: isEs ? '5 Nodos' : '5 Nodes',
    },
    {
      idx: '06',
      id: 'copilot',
      label: isEs ? 'Stovue Copilot IA' : 'Stovue Copilot AI',
      sublabel: isEs ? 'Asesoría y auditorías inteligentes' : 'AI analytics & inventory audits',
      icon: Bot,
      badge: 'AI ACTIVE',
      badgeColor: 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40',
    },
  ];

  return (
    <aside className="w-full lg:w-72 bg-[#0A0A0A] border-r border-[#1A1A1A] flex flex-col justify-between p-4 shrink-0 font-mono-data">
      <div className="space-y-4">
        <div className="px-2 pb-2 border-b border-[#1A1A1A] flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#666]">
            {isEs ? 'MÓDULOS DE COMANDO' : 'COMMAND MODULES'}
          </div>
          <span className="text-[9px] text-[#00FF41] uppercase tracking-widest">
            v.9.4.2
          </span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full text-left p-2.5 transition-all flex items-center justify-between cursor-pointer border ${
                  isActive
                    ? 'bg-[#121214] border-l-2 border-l-[#00FF41] border-t-[#222] border-r-[#222] border-b-[#222] text-white'
                    : 'bg-transparent border-transparent text-[#888] hover:text-[#E2E2E2] hover:bg-[#0F0F11] hover:border-[#1F1F23]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`text-[10px] font-mono shrink-0 ${isActive ? 'text-[#00FF41]' : 'text-[#444]'}`}>
                    {item.idx}
                  </span>
                  <div className={`p-1.5 shrink-0 ${isActive ? 'text-[#00FF41]' : 'text-[#666]'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-[#CCC]'}`}>
                      {item.label}
                    </div>
                    <div className="text-[9px] text-[#555] truncate">
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 shrink-0 uppercase tracking-tight ${item.badgeColor || 'bg-[#16161A] text-[#888] border border-[#262626]'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Health Footprint in Sidebar */}
      <div className="mt-6 pt-3 border-t border-[#1A1A1A] space-y-2.5">
        <div className="p-3 bg-[#050505] border border-[#1A1A1A] text-[10px] space-y-2">
          <div className="flex items-center justify-between text-[#888]">
            <span className="flex items-center gap-1.5 text-[#AAA]">
              <Activity className="h-3 w-3 text-[#00FF41]" />
              {isEs ? 'SYNC CLÚSTER POS' : 'POS CLUSTER SYNC'}
            </span>
            <span className="text-[#00FF41] font-bold">100% OK</span>
          </div>
          <div className="flex items-center justify-between text-[#888]">
            <span>{isEs ? 'MARGEN CONSOLIDADO' : 'CONSOLIDATED MARGIN'}</span>
            <span className="text-white font-bold">54.2%</span>
          </div>
          <div className="w-full bg-[#1A1A1A] h-1.5 overflow-hidden">
            <div className="bg-[#00FF41] h-full w-[88%]" />
          </div>
        </div>

        <div className="text-[9px] text-[#444] text-center uppercase tracking-widest">
          SERVER: TOK-04 • LATENCY: 14MS
        </div>
      </div>
    </aside>
  );
};
