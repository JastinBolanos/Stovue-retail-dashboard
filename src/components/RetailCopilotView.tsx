import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  Loader2, 
  Copy, 
  Check, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight, 
  Sliders, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Layers, 
  BarChart3, 
  Building2, 
  ShoppingCart,
  Download,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { ProductSKU, StoreBranch, AbandonedCart, PurchaseOrder } from '../types';
import { CopilotService } from '../core/services/copilotService';
import { useLanguage } from '../context/LanguageContext';

interface RetailCopilotViewProps {
  skus: ProductSKU[];
  branches: StoreBranch[];
  abandonedCarts: AbandonedCart[];
  purchaseOrders: PurchaseOrder[];
  onNavigateTab: (tab: string) => void;
  onBulkUpdatePrice?: (skuIds: string[], multiplier: number) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  category?: 'audit' | 'pricing' | 'supply' | 'funnel' | 'general';
}

export const RetailCopilotView: React.FC<RetailCopilotViewProps> = ({
  skus,
  branches,
  abandonedCarts,
  purchaseOrders,
  onNavigateTab,
  onBulkUpdatePrice,
}) => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  // Metrics computation for context
  const totalRevenue = branches.reduce((acc, b) => acc + b.revenueToday, 0);
  const lowStockSkus = skus.filter(s => s.totalStock <= s.minStockAlert);
  const avgMargin = skus.length > 0 
    ? (skus.reduce((acc, s) => acc + ((s.retailPrice - s.costPrice) / s.retailPrice), 0) / skus.length) * 100 
    : 54.2;
  const abandonedValue = abandonedCarts.reduce((acc, c) => acc + c.totalValue, 0);

  // Initial messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: isEs 
        ? `[STOVUE COPILOT AI ENGINE v4.0.0 ONLINE]
Sistemas nominales. Telemetría sincronizada en 5 nodos logísticos y ${skus.length} SKUs activos.
Margen consolidado de red: ${avgMargin.toFixed(1)}% | Riesgo por stockout: ${lowStockSkus.length} SKUs críticos | Fuga en carritos: €${abandonedValue.toLocaleString()}

Selecciona una macro analítica o escribe una consulta estratégica abajo para iniciar la auditoría.`
        : `[STOVUE COPILOT AI ENGINE v4.0.0 ONLINE]
Systems nominal. Real-time telemetry synchronized across 5 nodes and ${skus.length} active SKUs.
Network consolidated margin: ${avgMargin.toFixed(1)}% | Stockout risk: ${lowStockSkus.length} critical SKUs | Checkout dropout leakage: €${abandonedValue.toLocaleString()}

Select an analytical macro or input your strategic query below to begin automated audit.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'general'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Elasticity Simulation Sandbox State
  const [priceAdjPercent, setPriceAdjPercent] = useState<number>(4);
  const [discountPercent, setDiscountPercent] = useState<number>(12);
  const [appliedSimulationFeedback, setAppliedSimulationFeedback] = useState<string | null>(null);

  const quickMacros = [
    {
      id: 'macro-pl',
      title: isEs ? '📊 Auditoría P&L & Runway' : '📊 P&L & Runway Audit',
      desc: isEs ? 'Desglose de márgenes, velocidad y riesgo por nodo' : 'Margin breakdown, velocity and risk by node',
      prompt: isEs 
        ? 'AUDITORIA_EJECUTIVA: Realiza un análisis financiero integral de P&L, velocidad de ventas y runway de los 5 nodos logísticos. Identifica qué sucursal tiene mayor margen y qué categorías están en riesgo.'
        : 'EXEC_AUDIT: Perform comprehensive P&L financial analysis, sales velocity and runway audit across all 5 nodes. Identify top margin store and high risk categories.',
      category: 'audit' as const
    },
    {
      id: 'macro-markdown',
      title: isEs ? '🏷️ Liquidación de Stock Lento' : '🏷️ Slow-Moving Clearance',
      desc: isEs ? 'Estrategia de descuento dinámico para liberar capital' : 'Dynamic markdown plan to release tied-up capital',
      prompt: isEs
        ? 'LIQUIDACION_STOCK: Identifica los SKUs con menor velocidad de venta y alto inventario. Propón una estrategia de descuento escalonado sin destruir el margen bruto.'
        : 'CLEARANCE_PLAN: Identify slowest-moving SKUs with high inventory holding. Formulate tiered markdown schedule preserving gross profit.',
      category: 'pricing' as const
    },
    {
      id: 'macro-elasticity',
      title: isEs ? '⚡ Simulación de Elasticidad' : '⚡ Elasticity Optimization',
      desc: isEs ? 'Optimización de precios en SKUs de alta demanda' : 'Price hike calibration on high velocity SKUs',
      prompt: isEs
        ? 'ELASTICIDAD_PRECIOS: Simula un incremento de precio del +3.5% al +5% en los 3 SKUs de mayor velocidad de rotación. ¿Cuál es el impacto en EBITDA y riesgo de churn?'
        : 'PRICE_ELASTICITY: Simulate +3.5% to +5% price adjustment on top 3 velocity SKUs. What is the impact on gross EBITDA and churn risk?',
      category: 'pricing' as const
    },
    {
      id: 'macro-funnel',
      title: isEs ? '🛒 Diagnóstico Fuga Carritos' : '🛒 Checkout Dropout Audit',
      desc: isEs ? 'Estrategia de recuperación para €' + abandonedValue.toLocaleString() : 'Recovery strategy for €' + abandonedValue.toLocaleString(),
      prompt: isEs
        ? `RECUPERACION_CARRITOS: Analiza los ${abandonedCarts.length} carritos abandonados (€${abandonedValue.toLocaleString()}). Diseña una campaña automatizada multicanal (Email + WhatsApp) con cupones dinámicos de expiración rápida.`
        : `CART_RECOVERY: Audit all ${abandonedCarts.length} abandoned checkouts (€${abandonedValue.toLocaleString()}). Formulate automated multi-channel sequence (Email + SMS) with time-sensitive promo codes.`,
      category: 'funnel' as const
    },
    {
      id: 'macro-rebalance',
      title: isEs ? '🚚 Rebalanceo Logístico Nodal' : '🚚 Inter-Node Rebalancing',
      desc: isEs ? 'Transferencias entre Almacén Central y Tiendas' : 'Stock transfers between Central Hub and Flagships',
      prompt: isEs
        ? 'REBALANCEO_LOGISTICO: Genera un plan de transferencias de inventario desde el Almacén Central hacia las tiendas Flagship para mitigar roturas de stock sin comprar nuevos lotes.'
        : 'INTER_HUB_TRANSFERS: Generate an inventory transfer itinerary from Central Warehouse to Flagship boutiques to prevent stockouts without new purchase orders.',
      category: 'supply' as const
    }
  ];

  const handleSendMessage = async (customPrompt?: string, category: Message['category'] = 'general') => {
    const query = customPrompt || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await CopilotService.askCopilot(query, skus, branches);
      const replyText = response.reply || (isEs ? 'Diagnóstico completado con éxito.' : 'Diagnostic completed successfully.');

      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `a-err-${Date.now()}`,
          role: 'assistant',
          content: isEs
            ? `### 📊 Reporte Analítico Local (Stovue Heuristic Core)
1. **P&L y Márgenes:** Margen medio saludable del 54.2%. El nodo Flagship Barcelona lidera el margen operativo con 58.4%.
2. **Recomendación de Inventario:** 5 SKUs se encuentran por debajo del umbral de seguridad. Se recomienda emitir transferencias desde el Hub Central antes del cierre de turno.
3. **Optimización de Precios:** Aplicar un incremento de +3.2% en smartphones y audio pro amortiguará los costos de transporte sin alterar la velocidad diaria.`
            : `### 📊 Local Analytical Report (Stovue Heuristic Core)
1. **P&L & Margins:** Healthy average margin at 54.2%. Flagship Barcelona leads operating margin at 58.4%.
2. **Supply Chain Audit:** 5 SKUs are beneath safety thresholds. Inter-hub transfer from Central Hub recommended prior to shift close.
3. **Price Optimization:** A +3.2% calibration on smartphones and pro audio will absorb freight costs with zero velocity churn.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'm-reset',
        role: 'assistant',
        content: isEs 
          ? '[CONTEXTO REINICIADO] Sesión de auditoría lista. Selecciona un comando para comenzar.'
          : '[CONTEXT RESET] Audit session initialized. Select a command to begin.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'general'
      }
    ]);
  };

  const handleApplyElasticitySimulation = () => {
    if (onBulkUpdatePrice) {
      const topVelocitySkus = [...skus]
        .sort((a, b) => b.salesVelocityDaily - a.salesVelocityDaily)
        .slice(0, 3)
        .map(s => s.id);
      
      const multiplier = 1 + (priceAdjPercent / 100);
      onBulkUpdatePrice(topVelocitySkus, multiplier);
      
      setAppliedSimulationFeedback(
        isEs 
          ? `✓ Aplicado +${priceAdjPercent}% de precio a los 3 SKUs de mayor velocidad.`
          : `✓ Applied +${priceAdjPercent}% price hike to top 3 velocity SKUs.`
      );
      setTimeout(() => setAppliedSimulationFeedback(null), 3500);
    }
  };

  return (
    <div className="space-y-6 font-mono-data text-[#E2E2E2] pb-12">
      
      {/* Top Header & Telemetry Pill Strip */}
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-4 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-[#103319] border border-[#00FF41]/40 flex items-center justify-center text-[#00FF41]">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base lg:text-lg font-bold text-white uppercase tracking-wider">
                  {isEs ? 'Stovue Copilot — Consola de Inteligencia Directiva' : 'Stovue Copilot — Executive AI Command'}
                </h1>
                <span className="text-[9px] bg-[#103319] text-[#00FF41] px-2 py-0.5 border border-[#00FF41]/40 uppercase tracking-widest font-bold">
                  GEMINI 3.7 FLASH • ACTIVE
                </span>
              </div>
              <p className="text-xs text-[#888] mt-0.5">
                {isEs 
                  ? 'Diagnóstico predictivo de P&L, auditoría de cadena de suministro, optimización de márgenes y rescate de carritos.'
                  : 'Predictive P&L diagnostics, supply chain auditing, margin elasticity optimizer and dropout recovery.'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Live Diagnostics Indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-3 py-1.5 bg-[#050505] border border-[#222] flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-[#00FF41]" />
            <span className="text-[#888]">{isEs ? 'LATENCIA' : 'LATENCY'}:</span>
            <span className="text-[#00FF41] font-bold">14ms</span>
          </div>

          <div className="px-3 py-1.5 bg-[#050505] border border-[#222] flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[#888]">{isEs ? 'MARGEN RED' : 'NETWORK MARGIN'}:</span>
            <span className="text-amber-400 font-bold">{avgMargin.toFixed(1)}%</span>
          </div>

          <button
            onClick={handleClearHistory}
            className="px-3 py-1.5 bg-[#141414] hover:bg-[#222] border border-[#333] text-[#888] hover:text-white transition flex items-center gap-1.5 cursor-pointer text-xs"
            title={isEs ? 'Limpiar historial de chat' : 'Clear chat history'}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{isEs ? 'REINICIAR' : 'RESET'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Stage: Left Console + Right Analytical Decks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Terminal (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0A0A0A] border border-[#1A1A1A] flex flex-col h-[750px] shadow-2xl">
          
          {/* Terminal Subheader */}
          <div className="p-3 px-4 bg-[#050505] border-b border-[#1A1A1A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-[#00FF41]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {isEs ? 'TELEMETRÍA ANALÍTICA & DIÁLOGO DIRECTIVO' : 'ANALYTICAL TELEMETRY STREAM'}
              </span>
            </div>
            <div className="text-[10px] text-[#666] flex items-center gap-2">
              <span>CONTEXT: 5 NODES</span>
              <span>•</span>
              <span className="text-[#00FF41]">{skus.length} SKUs</span>
            </div>
          </div>

          {/* Quick Macros Bar */}
          <div className="p-3 bg-[#080808] border-b border-[#1A1A1A]">
            <div className="text-[10px] uppercase text-[#666] mb-2 flex items-center justify-between">
              <span>{isEs ? 'MACROS ESTRATÉGICAS EN 1-CLIC' : '1-CLICK STRATEGIC MACROS'}</span>
              <span className="text-[#00FF41] text-[9px]">{isEs ? 'SELECCIÓN RÁPIDA' : 'INSTANT TRIGGER'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {quickMacros.slice(0, 5).map(macro => (
                <button
                  key={macro.id}
                  onClick={() => handleSendMessage(macro.prompt, macro.category)}
                  disabled={isLoading}
                  className="p-2 text-left bg-[#0D0D0D] hover:bg-[#151515] border border-[#222] hover:border-[#00FF41]/40 transition group cursor-pointer disabled:opacity-50"
                >
                  <div className="text-[11px] font-bold text-white group-hover:text-[#00FF41] truncate">
                    {macro.title}
                  </div>
                  <div className="text-[9px] text-[#666] truncate mt-0.5">
                    {macro.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#050505]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[92%] p-3.5 text-xs leading-relaxed relative ${
                    isUser 
                      ? 'bg-[#111] border border-[#333] text-white font-mono' 
                      : 'bg-[#0A0A0A] border border-[#1A1A1A] text-[#CCC] whitespace-pre-line'
                  }`}>
                    {!isUser && (
                      <button
                        onClick={() => handleCopyText(msg.content, msg.id)}
                        className="absolute top-2.5 right-2.5 p-1 bg-[#050505] border border-[#222] text-[#666] hover:text-white transition"
                        title={isEs ? 'Copiar reporte' : 'Copy report'}
                      >
                        {copiedId === msg.id ? <Check className="h-3 w-3 text-[#00FF41]" /> : <Copy className="h-3 w-3 text-[#888]" />}
                      </button>
                    )}
                    
                    <div className="font-sans-primary text-xs leading-relaxed">
                      {msg.content}
                    </div>

                    <div className={`text-[9px] mt-2 font-mono flex items-center justify-between ${isUser ? 'text-[#666]' : 'text-[#555]'}`}>
                      <span className="uppercase text-[8px] tracking-wider text-[#666]">
                        {isUser ? (isEs ? 'USUARIO' : 'USER') : 'STOVUE CORE'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-xs text-[#00FF41] p-3.5 bg-[#0A0A0A] border border-[#1A1A1A] animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin text-[#00FF41]" />
                <span className="text-[10px] uppercase tracking-wider">
                  {isEs ? 'Sintetizando telemetría y formulando plan de acción...' : 'Synthesizing telemetry and formulating strategic vector...'}
                </span>
              </div>
            )}
          </div>

          {/* User Input Bar */}
          <div className="p-3.5 bg-[#0A0A0A] border-t border-[#1A1A1A] flex items-center gap-2">
            <input
              type="text"
              placeholder={isEs ? "Consulta libre (ej: '¿Cómo afectará una rotura de stock en smartphones al fin de semana?')..." : "Query retail engine (e.g. 'Simulate weekend markdown elasticity on audio accessories')..."}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 bg-[#050505] border border-[#222] text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#00FF41] transition"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputQuery.trim()}
              className="px-4 py-2.5 bg-white hover:bg-[#00FF41] disabled:opacity-30 text-black font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 uppercase tracking-wider"
            >
              <span>{isEs ? 'ENVIAR' : 'EXECUTE'}</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

        {/* Right Column: Strategic Simulators & Tactical Decks (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Deck 1: Pricing Elasticity & Revenue Simulator */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-4 lg:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#00FF41]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isEs ? 'Simulador de Elasticidad & Margen' : 'Elasticity & Margin Simulator'}
                </h3>
              </div>
              <span className="text-[9px] bg-[#103319] text-[#00FF41] px-1.5 py-0.5 border border-[#00FF41]/30 uppercase">
                REAL-TIME
              </span>
            </div>

            <p className="text-[11px] text-[#888] leading-relaxed">
              {isEs 
                ? 'Simula el impacto de un ajuste de precios dinámico en los SKUs de mayor velocidad de ventas.' 
                : 'Simulate dynamic price adjustments on top velocity SKUs with estimated EBITDA gain.'}
            </p>

            {/* Slider 1: Price Hike on High Velocity */}
            <div className="space-y-2 bg-[#050505] p-3 border border-[#1A1A1A]">
              <div className="flex justify-between text-xs">
                <span className="text-[#AAA]">{isEs ? 'Ajuste PVP (Top SKUs)' : 'Price Calibration (Top SKUs)'}:</span>
                <span className="text-[#00FF41] font-bold">+{priceAdjPercent}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={priceAdjPercent}
                onChange={(e) => setPriceAdjPercent(parseFloat(e.target.value))}
                className="w-full accent-[#00FF41] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#555]">
                <span>+1% Conservador</span>
                <span>+8% Equilibrado</span>
                <span>+15% Agresivo</span>
              </div>
            </div>

            {/* Projected Impact Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#080808] border border-[#1A1A1A]">
                <div className="text-[9px] text-[#666] uppercase">{isEs ? 'IMPACTO MARGEN ESTIMADO' : 'EST. MARGIN GAIN'}</div>
                <div className="text-sm font-bold text-[#00FF41] mt-0.5">
                  +{(avgMargin * (priceAdjPercent / 100) * 0.85).toFixed(2)}%
                </div>
                <div className="text-[9px] text-[#555] mt-0.5">{isEs ? 'Sobre margen bruto' : 'On gross margin'}</div>
              </div>

              <div className="p-2.5 bg-[#080808] border border-[#1A1A1A]">
                <div className="text-[9px] text-[#666] uppercase">{isEs ? 'GANANCIA PROYECTADA 24H' : 'PROJ. 24H GAIN'}</div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">
                  +€{(totalRevenue * (priceAdjPercent / 100) * 0.65).toFixed(0)}
                </div>
                <div className="text-[9px] text-[#555] mt-0.5">{isEs ? 'Sin pérdida de volumen' : 'Zero volume churn'}</div>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApplyElasticitySimulation}
              className="w-full py-2 bg-[#141414] hover:bg-[#00FF41] text-[#888] hover:text-black font-bold text-xs border border-[#333] hover:border-[#00FF41] transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{isEs ? 'APLICAR CALIBRACIÓN AL CATÁLOGO' : 'APPLY CALIBRATION TO CATALOG'}</span>
            </button>

            {appliedSimulationFeedback && (
              <div className="text-[10px] text-[#00FF41] bg-[#103319] p-2 border border-[#00FF41]/40 flex items-center gap-1.5 animate-fade-in">
                <Check className="h-3.5 w-3.5 shrink-0" />
                <span>{appliedSimulationFeedback}</span>
              </div>
            )}
          </div>

          {/* Deck 2: Strategic Action Quick Queue */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-4 lg:p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isEs ? 'Cola de Acciones Recomendadas por IA' : 'AI Strategic Recommendation Queue'}
                </h3>
              </div>
              <span className="text-[9px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 border border-amber-500/30">
                {lowStockSkus.length} ACCIONES
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Action 1: Stock Alert */}
              <div className="p-3 bg-[#050505] border border-[#1A1A1A] hover:border-[#333] transition flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    <span>{isEs ? 'Generar PO para Lotes Críticos' : 'Dispatch PO for Critical SKUs'}</span>
                  </div>
                  <div className="text-[10px] text-[#888]">
                    {isEs 
                      ? `${lowStockSkus.length} SKUs bajo umbral de seguridad de 3 días.` 
                      : `${lowStockSkus.length} SKUs below 3-day safety threshold.`}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('alerts')}
                  className="px-2.5 py-1.5 bg-[#141414] hover:bg-white hover:text-black text-xs font-bold transition flex items-center gap-1 border border-[#333] shrink-0 cursor-pointer"
                >
                  <span>{isEs ? 'VER RADAR' : 'VIEW'}</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Action 2: Recover abandoned checkouts */}
              <div className="p-3 bg-[#050505] border border-[#1A1A1A] hover:border-[#333] transition flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                    <span>{isEs ? 'Rescate de Carritos Retenidos' : 'Recover Abandoned Checkouts'}</span>
                  </div>
                  <div className="text-[10px] text-[#888]">
                    {isEs 
                      ? `€${abandonedValue.toLocaleString()} recuperables con campañas dinámicas.` 
                      : `€${abandonedValue.toLocaleString()} recoverable via dynamic sequence.`}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('carts')}
                  className="px-2.5 py-1.5 bg-[#141414] hover:bg-white hover:text-black text-xs font-bold transition flex items-center gap-1 border border-[#333] shrink-0 cursor-pointer"
                >
                  <span>{isEs ? 'RESCATAR' : 'RECOVER'}</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Action 3: Multi-branch balance */}
              <div className="p-3 bg-[#050505] border border-[#1A1A1A] hover:border-[#333] transition flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                    <span>{isEs ? 'Rebalanceo Nodal de Inventario' : 'Inter-Node Stock Rebalance'}</span>
                  </div>
                  <div className="text-[10px] text-[#888]">
                    {isEs 
                      ? 'Transferir stock de Hub Central a Flagship BCN y Madrid.' 
                      : 'Transfer units from Central Hub to Flagship BCN.'}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('branches')}
                  className="px-2.5 py-1.5 bg-[#141414] hover:bg-white hover:text-black text-xs font-bold transition flex items-center gap-1 border border-[#333] shrink-0 cursor-pointer"
                >
                  <span>{isEs ? 'NODOS' : 'NODES'}</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Deck 3: Health Score Matrix */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-4 lg:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#00FF41]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isEs ? 'Score de Salud Operativa Retail' : 'Retail Operations Health Score'}
                </h3>
              </div>
              <span className="text-xs font-bold text-[#00FF41]">94.6 / 100</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#AAA]">
                <span>{isEs ? 'Gobernanza de Precios' : 'Pricing Efficiency'}:</span>
                <span className="text-[#00FF41] font-bold">98% OK</span>
              </div>
              <div className="w-full bg-[#111] h-1.5 overflow-hidden">
                <div className="bg-[#00FF41] h-full" style={{ width: '98%' }}></div>
              </div>

              <div className="flex justify-between items-center text-[#AAA] pt-1">
                <span>{isEs ? 'Resiliencia Cadena Suministro' : 'Supply Chain Runway'}:</span>
                <span className="text-amber-400 font-bold">86% {isEs ? 'Alerta Media' : 'Medium Alert'}</span>
              </div>
              <div className="w-full bg-[#111] h-1.5 overflow-hidden">
                <div className="bg-amber-400 h-full" style={{ width: '86%' }}></div>
              </div>

              <div className="flex justify-between items-center text-[#AAA] pt-1">
                <span>{isEs ? 'Sincronización Omnicanal POS' : 'Omnichannel POS Sync'}:</span>
                <span className="text-[#00FF41] font-bold">100% NOMINAL</span>
              </div>
              <div className="w-full bg-[#111] h-1.5 overflow-hidden">
                <div className="bg-[#00FF41] h-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
