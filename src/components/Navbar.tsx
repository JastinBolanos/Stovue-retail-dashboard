import React from 'react';
import { 
  Boxes, 
  Store, 
  Zap, 
  AlertTriangle, 
  ShoppingCart, 
  Bot, 
  LogOut, 
  ChevronDown,
  Terminal,
  Activity
} from 'lucide-react';
import { StoreBranch, UserProfile } from '../types';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentProfile: UserProfile;
  branches: StoreBranch[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
  lowStockCount: number;
  abandonedCartsCount: number;
  onOpenAICopilot: () => void;
  onSimulateEvent: () => void;
  onSwitchProfile: () => void;
  onNavigateTab: (tab: string) => void;
  isSimulating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProfile,
  branches,
  selectedBranchId,
  onSelectBranch,
  lowStockCount,
  abandonedCartsCount,
  onOpenAICopilot,
  onSimulateEvent,
  onSwitchProfile,
  onNavigateTab,
  isSimulating
}) => {
  const { t } = useLanguage();
  const currentBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050505] border-b border-[#1A1A1A] px-4 lg:px-6 py-2 flex items-center justify-between gap-3 font-mono-data">
      {/* Left: Brand Logo & Live Engine Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-base tracking-tighter text-white">STOVUE</span>
              <span className="text-[9px] uppercase tracking-widest text-[#666]">[COMMAND]</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#00FF41] animate-pulse" />
            </div>
            <div className="text-[9px] text-[#00FF41] uppercase tracking-wider flex items-center gap-1">
              {t('nav.systemNominal')}
            </div>
          </div>
        </div>

        {/* Branch Selector Dropdown */}
        <div className="hidden md:flex items-center">
          <div className="relative group">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-[#0A0A0A] border border-[#1F1F23] text-xs text-[#CCC] hover:border-[#00FF41] cursor-pointer">
              <Store className="h-3 w-3 text-[#00FF41]" />
              <span className="max-w-[160px] truncate text-[11px]">{currentBranch.name}</span>
              <ChevronDown className="h-3 w-3 text-[#666]" />
            </div>

            <div className="absolute left-0 mt-1 w-64 bg-[#0A0A0A] border border-[#222] shadow-2xl py-1 hidden group-hover:block z-50">
              <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest text-[#666] border-b border-[#1A1A1A]">
                {t('nav.selectNode')}
              </div>
              {branches.map(b => (
                <button
                  key={b.id}
                  onClick={() => onSelectBranch(b.id)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#141414] transition cursor-pointer ${
                    b.id === selectedBranchId ? 'text-[#00FF41] font-bold bg-[#103319]/20' : 'text-[#888]'
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  <span className="text-[9px] text-[#555] ml-2">{b.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Center: Search & Quick Live Simulation Trigger */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          id="btn-simulate-event"
          onClick={onSimulateEvent}
          disabled={isSimulating}
          className="px-3 py-1 bg-[#0F0F11] hover:bg-[#16161A] text-white text-xs border border-[#333] hover:border-[#00FF41] transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Inyecta una transacción de compra o alerta en tiempo real al feed"
        >
          <Zap className={`h-3 w-3 text-[#00FF41] ${isSimulating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-bold">
            {isSimulating ? t('nav.simulating') : t('nav.simulateOrder')}
          </span>
          <span className="sm:hidden text-[10px]">Sim</span>
        </button>

        {/* Quick Shortcut to SKU Low Stock */}
        <button
          onClick={() => onNavigateTab('alerts')}
          className={`relative px-2.5 py-1 border text-xs flex items-center gap-1.5 transition cursor-pointer ${
            lowStockCount > 0 
              ? 'bg-[#FF4444]/10 border-[#FF4444]/40 text-[#FF4444] hover:bg-[#FF4444]/20' 
              : 'bg-[#0A0A0A] border-[#1F1F23] text-[#666]'
          }`}
          title="Ver alertas de stock bajo"
        >
          <AlertTriangle className="h-3 w-3 text-[#FF4444]" />
          <span className="hidden md:inline text-[11px] uppercase">{t('nav.lowStock')}</span>
          <span className="px-1.5 py-0.2 bg-[#FF4444] text-black font-bold text-[9px]">
            {lowStockCount}
          </span>
        </button>

        {/* Quick Shortcut to Abandoned Carts */}
        <button
          onClick={() => onNavigateTab('carts')}
          className={`relative px-2.5 py-1 border text-xs flex items-center gap-1.5 transition cursor-pointer ${
            abandonedCartsCount > 0 
              ? 'bg-[#FFAA00]/10 border-[#FFAA00]/40 text-[#FFAA00] hover:bg-[#FFAA00]/20' 
              : 'bg-[#0A0A0A] border-[#1F1F23] text-[#666]'
          }`}
          title="Ver carritos abandonados recuperables"
        >
          <ShoppingCart className="h-3 w-3 text-[#FFAA00]" />
          <span className="hidden md:inline text-[11px] uppercase">{t('nav.dropouts')}</span>
          <span className="px-1.5 py-0.2 bg-[#FFAA00] text-black font-bold text-[9px]">
            {abandonedCartsCount}
          </span>
        </button>
      </div>

      {/* Right: Language Toggle, AI Copilot Trigger & User Profile Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Compact Language Toggle in Top Navbar */}
        <LanguageToggle />

        <button
          id="btn-open-copilot"
          onClick={onOpenAICopilot}
          className="px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-tighter hover:bg-[#00FF41] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Bot className="h-3.5 w-3.5 fill-black" />
          <span className="hidden sm:inline">{t('nav.copilot')}</span>
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#1A1A1A]">
          <img 
            src={currentProfile?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'} 
            alt={currentProfile?.name || 'Operator'} 
            className="h-7 w-7 object-cover border border-[#333]"
          />
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
              {currentProfile?.name || 'Operator'}
            </div>
            <div className="text-[9px] text-[#00FF41] uppercase">
              {currentProfile?.title ? currentProfile.title.split('(')[0] : 'SYS_ADMIN'}
            </div>
          </div>

          <button
            onClick={onSwitchProfile}
            className="p-1.5 bg-[#0A0A0A] hover:bg-[#16161A] text-[#666] hover:text-white transition border border-[#222]"
            title={t('nav.logout')}
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
