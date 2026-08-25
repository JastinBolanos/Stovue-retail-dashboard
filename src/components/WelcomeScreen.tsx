import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Zap, 
  BarChart3, 
  Layers, 
  Boxes,
  ArrowUpRight,
  Radio,
  Terminal,
  Activity,
  Cpu
} from 'lucide-react';
import { USER_PROFILES } from '../data/mockData';
import { UserProfile } from '../types';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface WelcomeScreenProps {
  onEnter: (selectedProfile: UserProfile) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const { t, language } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<UserProfile>(USER_PROFILES[0]);
  const [isEntering, setIsEntering] = useState(false);

  const handleEnterApp = (profile: UserProfile) => {
    setIsEntering(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#00FF41', '#FFFFFF', '#333333', '#00AA2B']
    });
    setTimeout(() => {
      onEnter(profile);
    }, 350);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-[#E2E2E2] font-mono-data overflow-x-hidden flex flex-col justify-between selection:bg-[#00FF41] selection:text-[#050505]">
      {/* Background Subtle Technical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00FF41]/5 blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-[#1A1A1A] bg-[#050505]/90">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-white leading-none">STOVUE</h1>
            <span className="h-2 w-2 rounded-full bg-[#00FF41] animate-pulse" />
          </div>
          <h2 className="text-[10px] font-mono tracking-[0.3em] text-[#666] uppercase">{t('app.tagline')}</h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageToggle />

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#0A0A0A] border border-[#1F1F23] text-[10px] text-[#00FF41] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FF41]" />
            {t('server.nominal')}
          </div>
          
          <button
            onClick={() => handleEnterApp(selectedRole)}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-white text-black text-xs font-bold uppercase tracking-tighter hover:bg-[#00FF41] transition-colors cursor-pointer"
          >
            {t('btn.enterTerminal')}
          </button>
        </div>
      </header>

      {/* Hero Content Section */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Technical Terminal Identity */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill / Access Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F0F11] border border-[#1F1F23] text-[#888] text-[10px] uppercase tracking-widest">
              <Terminal className="h-3 w-3 text-[#00FF41]" />
              <span>{t('access.alpha')}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight tracking-tight">
                {t('welcome.greeting')}<br />
                <span className="font-bold italic text-[#00FF41]">
                  {selectedRole.role === 'executive_ceo' ? t('welcome.ceo') : 
                   selectedRole.role === 'supply_chain_lead' ? t('welcome.supply') :
                   selectedRole.role === 'growth_analyst' ? t('welcome.growth') : t('welcome.store')}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-[#888] max-w-2xl leading-relaxed">
                {t('welcome.desc')}
              </p>
            </div>

            {/* High Density Metric Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 bg-[#0F0F11] border border-[#1F1F23]">
                <div className="text-[10px] uppercase tracking-widest text-[#666] font-bold">{t('metric.revenue')}</div>
                <div className="text-xl font-mono text-[#00FF41] mt-1">€1,402,394</div>
                <div className="text-[10px] text-[#888] mt-0.5">{t('metric.revenueSub')}</div>
              </div>
              <div className="p-3.5 bg-[#0F0F11] border border-[#1F1F23]">
                <div className="text-[10px] uppercase tracking-widest text-[#666] font-bold">{t('metric.conversion')}</div>
                <div className="text-xl font-mono text-white mt-1">4.82%</div>
                <div className="text-[10px] text-[#00FF41] mt-0.5">{t('metric.conversionSub')}</div>
              </div>
              <div className="p-3.5 bg-[#0F0F11] border border-[#1F1F23]">
                <div className="text-[10px] uppercase tracking-widest text-[#666] font-bold">{t('metric.skuMatrix')}</div>
                <div className="text-xl font-mono text-white mt-1">14,820</div>
                <div className="text-[10px] text-[#888] mt-0.5">{t('metric.skuMatrixSub')}</div>
              </div>
              <div className="p-3.5 bg-[#0F0F11] border border-[#1F1F23]">
                <div className="text-[10px] uppercase tracking-widest text-[#666] font-bold">{t('metric.stockHealth')}</div>
                <div className="text-xl font-mono text-[#00FF41] mt-1">99.1%</div>
                <div className="text-[10px] text-[#00FF41] mt-0.5">{t('metric.stockHealthSub')}</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <button
                id="btn-enter-command-center"
                onClick={() => handleEnterApp(selectedRole)}
                disabled={isEntering}
                className="px-6 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#00FF41] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Zap className="h-4 w-4 fill-black" />
                <span>{t('btn.initTerminal')}</span>
                <ChevronRight className="h-4 w-4 stroke-[3]" />
              </button>

              <button
                onClick={() => handleEnterApp(USER_PROFILES[0])}
                className="px-5 py-3.5 bg-[#0A0A0A] hover:bg-[#141414] text-white text-xs font-bold uppercase tracking-widest border border-[#333] hover:border-[#00FF41] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Cpu className="h-4 w-4 text-[#00FF41]" />
                {t('btn.demoCeo')}
              </button>
            </div>

          </div>

          {/* Right Column: High Density Profile Matrix */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] relative">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#00FF41]" />
                  <span className="text-xs uppercase font-bold tracking-wider text-white">
                    {t('profile.select')}
                  </span>
                </div>
                <span className="text-[10px] text-[#00FF41] uppercase tracking-widest">
                  {t('profile.rbac')}
                </span>
              </div>

              {/* Roles List */}
              <div className="space-y-2 mt-4">
                {USER_PROFILES.map((profile, idx) => {
                  const isSelected = selectedRole.id === profile.id;
                  return (
                    <div
                      key={profile.id}
                      onClick={() => setSelectedRole(profile)}
                      className={`p-3 border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'bg-[#111] border-l-2 border-l-[#00FF41] border-t-[#1F1F23] border-r-[#1F1F23] border-b-[#1F1F23]' 
                          : 'bg-[#080808] border-[#16161A] hover:bg-[#0F0F11] hover:border-[#222]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-[#555] font-mono">0{idx + 1}</span>
                        <img 
                          src={profile.avatar} 
                          alt={profile.name} 
                          className={`h-9 w-9 object-cover border ${
                            isSelected ? 'border-[#00FF41]' : 'border-[#2A2A2A]'
                          }`}
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            {profile.name}
                            {isSelected && (
                              <span className="text-[9px] text-[#00FF41]">{t('profile.selected')}</span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#888]">{profile.title}</div>
                          <div className="text-[9px] text-[#555] mt-0.5">
                            {t('profile.node')}: {profile.assignedBranch}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                          isSelected ? 'bg-[#103319] text-[#00FF41] border border-[#00FF41]/40' : 'bg-[#16161A] text-[#666]'
                        }`}>
                          {isSelected ? t('profile.active') : t('profile.choose')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Security Telemetry Footer */}
              <div className="mt-4 p-2.5 bg-[#050505] border border-[#1A1A1A] text-[10px] text-[#666] flex items-center justify-between">
                <span>ENCRYPT: AES-GCM-256</span>
                <span className="text-[#00FF41]">LATENCY: 14ms</span>
              </div>
            </div>

            {/* Quick Feature Matrix Badges */}
            <div className="grid grid-cols-3 gap-2 text-[10px] text-[#777]">
              <div className="p-2 bg-[#0A0A0A] border border-[#1A1A1A] text-center">
                <span className="text-[#00FF41]">01 //</span> RECHARTS
              </div>
              <div className="p-2 bg-[#0A0A0A] border border-[#1A1A1A] text-center">
                <span className="text-[#00FF41]">02 //</span> SKU AUDIT
              </div>
              <div className="p-2 bg-[#0A0A0A] border border-[#1A1A1A] text-center">
                <span className="text-[#00FF41]">03 //</span> AI COPILOT
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 border-t border-[#1A1A1A] text-[10px] text-[#444] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          STOVUE COMMERCE COMMAND • HIGH DENSITY ARCHITECTURE v.9.4.2-LST
        </div>
        <div className="flex items-center gap-4 text-[#555]">
          <span>PORT: 3000</span>
          <span>CLUSTER: US-EAST</span>
          <span className="text-[#00FF41]">STATUS: 100% OPERATIONAL</span>
        </div>
      </footer>
    </div>
  );
};
