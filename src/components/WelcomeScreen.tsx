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
  Cpu,
  Server,
  Network,
  Database,
  Lock,
  KeyRound,
  Binary,
  ScanLine,
  Workflow,
  Wifi,
  Bot
} from 'lucide-react';
import { INITIAL_BRANCHES, USER_PROFILES } from '../data/mockData';
import { UserProfile } from '../types';
import { LanguageToggle } from './LanguageToggle';
import { EnterpriseLoginModal } from './EnterpriseLoginModal';
import { useLanguage } from '../context/LanguageContext';
import { EcgPulseDot } from './EcgPulseDot';
import confetti from 'canvas-confetti';

interface WelcomeScreenProps {
  onEnter: (selectedProfile: UserProfile) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const { t, language } = useLanguage();
  const [isEntering, setIsEntering] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const defaultProfile = USER_PROFILES[0];

  const handleEnterApp = (profile: UserProfile = defaultProfile) => {
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

  const operationalNodes = [
    {
      code: 'MAD-HUB',
      category: language === 'es' ? 'BASE DE DATOS & WMS' : 'DATABASE & WMS CORE',
      name: language === 'es' ? 'Hub Logístico Central Madrid' : 'Central Logistics Hub Madrid',
      type: language === 'es' ? 'WMS & Distribución Automatizada' : 'WMS & Automated Fulfillment',
      metric: language === 'es' ? 'Capacidad: 19,800/25,000 SKUs (79.2%)' : 'Holding: 19,800/25,000 SKUs (79.2%)',
      status: language === 'es' ? 'ONLINE • 100%' : 'ONLINE • 100%',
      color: '#00FF41',
      latency: '8ms',
      techDomain: 'database',
      icon: Database,
      tag: 'DATABASE',
      accentColor: '#00FF41',
      badgeClass: 'text-[#00FF41] border-[#00FF41]/40 bg-[#00FF41]/10'
    },
    {
      code: 'BCN-01',
      category: language === 'es' ? 'TELEMETRÍA LOGÍSTICA' : 'LIVE TELEMETRY STREAM',
      name: language === 'es' ? 'Flagship Store Paseo de Gracia' : 'Flagship Store Paseo de Gracia',
      type: language === 'es' ? 'POS Cluster • 28 Cajas Físicas' : 'POS Cluster • 28 Active Lanes',
      metric: language === 'es' ? '184 Órdenes Hoy • AOV: €230' : '184 Daily Orders • AOV: €230',
      status: language === 'es' ? 'SYNC POS' : 'SYNC POS',
      color: '#00F0FF',
      latency: '12ms',
      techDomain: 'telemetry',
      icon: Activity,
      tag: 'TELEMETRY',
      accentColor: '#00F0FF',
      badgeClass: 'text-[#00F0FF] border-[#00F0FF]/40 bg-[#00F0FF]/10'
    },
    {
      code: 'VLC-02',
      category: language === 'es' ? 'TECNOLOGÍA & IOT' : 'TECH & HARDWARE IOT',
      name: language === 'es' ? 'Boutique Tech Mall El Saler' : 'Boutique Tech Mall El Saler',
      type: language === 'es' ? 'Click & Collect • Retail Físico' : 'Click & Collect • In-Store Retail',
      metric: language === 'es' ? '96 Órdenes Hoy • 14 Operadores' : '96 Daily Orders • 14 Staff',
      status: language === 'es' ? 'ACTIVO' : 'ACTIVE',
      color: '#FFAA00',
      latency: '15ms',
      techDomain: 'technology',
      icon: Cpu,
      tag: 'TECH / IOT',
      accentColor: '#FFAA00',
      badgeClass: 'text-[#FFAA00] border-[#FFAA00]/40 bg-[#FFAA00]/10'
    },
    {
      code: 'DIGITAL-01',
      category: language === 'es' ? 'CRIPTOGRAFÍA TLS 1.3' : 'CRYPTOGRAPHY EDGE',
      name: language === 'es' ? 'Canal E-Commerce Cloud Edge' : 'Omnichannel E-Commerce Edge',
      type: language === 'es' ? 'CDN Global & Checkout Gateway' : 'Global CDN & Checkout Gateway',
      metric: language === 'es' ? '642 Transacciones • SLA 99.99%' : '642 Checkouts • SLA 99.99%',
      status: language === 'es' ? 'NOMINAL' : 'NOMINAL',
      color: '#00FF41',
      latency: '14ms',
      techDomain: 'cryptography',
      icon: Lock,
      tag: 'CRYPTO',
      accentColor: '#00FF41',
      badgeClass: 'text-[#00FF41] border-[#00FF41]/40 bg-[#00FF41]/10'
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-[#E2E2E2] font-mono-data overflow-x-hidden flex flex-col justify-between selection:bg-[#00FF41] selection:text-[#050505]">
      {/* Background Subtle Technical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00FF41]/5 blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-[#1A1A1A] bg-[#050505]/90">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-white leading-none">STOVUE</h1>
            <EcgPulseDot size="lg" className="ml-1 -mt-1" />
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
            onClick={() => setIsLoginModalOpen(true)}
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
                  {t('welcome.ceo')}
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
                onClick={() => setIsLoginModalOpen(true)}
                disabled={isEntering}
                className="px-6 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#00FF41] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Zap className="h-4 w-4 fill-black" />
                <span>{t('btn.initTerminal')}</span>
                <ChevronRight className="h-4 w-4 stroke-[3]" />
              </button>

              <button
                onClick={() => handleEnterApp(defaultProfile)}
                className="px-5 py-3.5 bg-[#0A0A0A] hover:bg-[#141414] text-white text-xs font-bold uppercase tracking-widest border border-[#333] hover:border-[#00FF41] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Cpu className="h-4 w-4 text-[#00FF41]" />
                {t('btn.demoCeo')}
              </button>
            </div>

          </div>

          {/* Right Column: Live Nodes & Logistics Telemetry Monitor */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] relative shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-[#00FF41]" />
                  <span className="text-xs uppercase font-bold tracking-wider text-white">
                    {t('nodes.monitorTitle')}
                  </span>
                </div>
                <span className="text-[10px] text-[#00FF41] uppercase tracking-widest font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00FF41] animate-pulse"></span>
                  {t('nodes.monitorCluster')}
                </span>
              </div>

              {/* Operational Nodes Telemetry List */}
              <div className="space-y-2.5 mt-4">
                {operationalNodes.map((node) => {
                  const NodeIcon = node.icon;
                  return (
                    <div
                      key={node.code}
                      className="p-3 bg-[#080808] border border-[#16161A] hover:border-[#2A2A2A] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        {/* High-Tech Visual Icon Box for Database, Telemetry, Tech/IoT, Cryptography */}
                        <div className="relative group/box shrink-0">
                          <div className="h-10 w-10 sm:h-11 sm:w-11 bg-gradient-to-br from-[#121216] to-[#070709] border border-[#25252B] group-hover:border-[#00FF41] flex flex-col items-center justify-center relative overflow-hidden transition-all shadow-inner">
                            {/* Subtle cyber grid backdrop */}
                            <div className="absolute inset-0 bg-[radial-gradient(#00FF41_1px,transparent_1px)] [background-size:6px_6px] opacity-15 pointer-events-none" />
                            
                            {/* Technology / Database / Telemetry / Cryptography Visual Icon */}
                            <NodeIcon 
                              className="h-5 w-5 transition-transform group-hover:scale-110 relative z-10" 
                              style={{ 
                                color: node.accentColor,
                                filter: `drop-shadow(0 0 6px ${node.accentColor}66)`
                              }} 
                            />
                            
                            {/* Terminal corner tech accents */}
                            <span className="absolute top-0.5 left-0.5 w-1 h-1 border-t border-l border-[#00FF41]/40" />
                            <span className="absolute bottom-0.5 right-0.5 w-1 h-1 border-b border-r border-[#00FF41]/40" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-[#00FF41] transition-colors">
                              {node.name}
                            </span>
                            <span className="text-[9px] font-mono px-1 bg-[#141414] border border-[#222] text-[#888]">
                              {node.code}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[8px] font-mono font-bold px-1 py-0.2 border uppercase ${node.badgeClass}`}>
                              {node.category}
                            </span>
                            <span className="text-[10px] text-[#888]">{node.type}</span>
                          </div>
                          <div className="text-[9px] text-[#555] font-mono mt-0.5">
                            {node.metric}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#103319] text-[#00FF41] border border-[#00FF41]/40 font-bold block">
                          {node.status}
                        </span>
                        <span className="text-[8px] text-[#555] font-mono block mt-1">
                          {node.latency}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Security & Transport Telemetry Footer */}
              <div className="mt-4 p-2.5 bg-[#050505] border border-[#1A1A1A] text-[10px] text-[#666] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#00FF41]" />
                  <span>ENCRYPT: TLS 1.3 • AES-GCM-256</span>
                </span>
                <span className="text-[#00FF41] font-bold">LATENCY: 14ms</span>
              </div>
            </div>

            {/* Quick Feature Matrix Badges with Tech Icons */}
            <div className="grid grid-cols-3 gap-2 text-[10px] text-[#777]">
              <div className="p-2 bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center gap-1.5 hover:border-[#333] transition-colors">
                <BarChart3 className="h-3.5 w-3.5 text-[#00FF41]" />
                <span className="text-white font-mono font-bold">RECHARTS</span>
              </div>
              <div className="p-2 bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center gap-1.5 hover:border-[#333] transition-colors">
                <ShieldCheck className="h-3.5 w-3.5 text-[#00F0FF]" />
                <span className="text-white font-mono font-bold">SKU AUDIT</span>
              </div>
              <div className="p-2 bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center gap-1.5 hover:border-[#333] transition-colors">
                <Bot className="h-3.5 w-3.5 text-[#FFAA00]" />
                <span className="text-white font-mono font-bold">AI COPILOT</span>
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
          <span>CLUSTER: US-EAST</span>
          <span className="text-[#00FF41]">STATUS: 100% OPERATIONAL</span>
        </div>
      </footer>

      {/* Enterprise Login Blocking Modal */}
      <EnterpriseLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onEnterDemo={() => handleEnterApp(defaultProfile)}
      />
    </div>
  );
};
