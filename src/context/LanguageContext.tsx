import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Top Bar & Welcome
    'app.tagline': 'COMMERCE COMMAND [TERMINAL]',
    'server.nominal': 'SERVER: TOK-04 • SYSTEMS NOMINAL',
    'btn.enterTerminal': 'ENTER TERMINAL',
    'btn.initTerminal': 'INITIALIZE TERMINAL',
    'access.alpha': 'ACCESS LEVEL: ALPHA • HIGH DENSITY MODE',
    'welcome.greeting': 'Welcome back,',
    'welcome.ceo': 'Chief Executive',
    'welcome.supply': 'Supply Chain Officer',
    'welcome.growth': 'Growth & Revenue Analyst',
    'welcome.store': 'Store Node Director',
    'welcome.desc': 'Omnichannel retail operations platform with real-time SKU telemetry, algorithmic stock replenishment, and AI checkout dropout recovery.',
    'metric.revenue': 'Live Revenue',
    'metric.revenueSub': '24h Synchronized',
    'metric.conversion': 'Conversion',
    'metric.conversionSub': '+1.4% Target',
    'metric.skuMatrix': 'SKU Matrix',
    'metric.skuMatrixSub': '5 Store Nodes',
    'metric.stockHealth': 'Stock Health',
    'metric.stockHealthSub': 'Zero Critical Stop',
    'profile.select': 'SELECT ACCESS PROFILE',
    'profile.rbac': 'RBAC: ACTIVE',
    'profile.selected': '[SELECTED]',
    'profile.active': 'ACTIVE',
    'profile.choose': 'SELECT',
    'profile.node': 'NODE',
    'btn.demoCeo': 'DEMO PROFILE (CEO 360°)',
    
    // Navbar
    'nav.systemNominal': 'SYS: NOMINAL • 24H SYNC',
    'nav.selectNode': 'SELECT STORE NODE / HUB',
    'nav.simulateOrder': 'SIMULATE ORDER',
    'nav.simulating': 'SIMULATING',
    'nav.lowStock': 'LOW STOCK',
    'nav.dropouts': 'DROPOUTS',
    'nav.copilot': 'AI COPILOT',
    'nav.logout': 'Switch profile or log out',

    // Sidebar
    'nav.overview': 'OPERATIONAL OVERVIEW',
    'nav.skus': 'SKU MATRIX & CATALOG',
    'nav.alerts': 'STOCK HEALTH & RUNWAY',
    'nav.carts': 'CHECKOUT DROPOUTS',
    'nav.branches': 'NODE TELEMETRY',
    'sidebar.engine': 'STOVUE REAL-TIME ENGINE',
    'sidebar.latency': 'LATENCY: 12MS • CLUSTER OK',
    'sidebar.version': 'v9.4.2-LST',

    // Dashboard Overview
    'dash.title': 'Executive Retail Operations Center',
    'dash.subtitle': 'Consolidated omnichannel telemetry & store performance',
    'dash.allBranches': 'Consolidated Network (All Hubs)',
    'dash.grossRevenue': '24H CONSOLIDATED REVENUE',
    'dash.grossTarget': 'vs target trajectory',
    'dash.avgOrderValue': 'AVERAGE ORDER VALUE (AOV)',
    'dash.grossMargin': 'GROSS OPERATING MARGIN',
    'dash.criticalAlerts': 'CRITICAL STOCKOUT VECTORS',
    'dash.viewAlerts': 'View Stock Radar',
    'dash.revenueChartTitle': 'Consolidated Hourly Revenue & Omnichannel Order Flow',
    'dash.channelSplit': 'REVENUE DISTRIBUTION BY CHANNEL',
    'dash.branchComparison': 'STORE NODE REVENUE MATRIX',
    'dash.liveFeedTitle': 'Omnichannel Real-Time Event Stream',
    'dash.liveFeedDesc': 'Direct POS terminals, e-commerce checkout & stock movements',

    // SKU Management
    'sku.title': 'Product SKU Matrix & Inventory Telemetry',
    'sku.subtitle': 'Global catalog control, EAN codes, safety thresholds & cross-node rebalancing',
    'sku.newBtn': '+ NEW SKU PRODUCT',
    'sku.export': 'EXPORT CSV',
    'sku.searchPlaceholder': 'Search SKU, name, category, EAN or supplier...',
    'sku.allCategories': 'ALL CATEGORIES',
    'sku.allStatuses': 'ALL STATUSES',
    'sku.thSKU': 'SKU / CODE',
    'sku.thProduct': 'PRODUCT ITEM',
    'sku.thCategory': 'CATEGORY',
    'sku.thCost': 'COST',
    'sku.thPrice': 'RETAIL',
    'sku.thMargin': 'MARGIN',
    'sku.thStock': 'STOCK LEVEL',
    'sku.thVelocity': 'VELOCITY',
    'sku.thStatus': 'STATUS',
    'sku.thActions': 'ACTIONS',
    'sku.statusActive': 'IN STOCK',
    'sku.statusLow': 'LOW STOCK',
    'sku.statusOut': 'STOCKOUT',

    // Inventory Alerts
    'alerts.title': 'Inventory Health & Replenishment',
    'alerts.subtitle': 'Stockout risk vectors, runway velocity calculations & automated PO generation',
    'alerts.runDiagnosis': 'Execute AI Stock Diagnostic',
    'alerts.criticalCount': 'Critical SKUs',
    'alerts.radarTitle': 'Safety Threshold Alert Radar',
    'alerts.pipelineTitle': 'Purchase Orders Pipeline',
    'alerts.transfer': 'Transfer',
    'alerts.emitPO': 'Emit PO',
    'alerts.runway': 'Runway',
    'alerts.acknowledge': 'Acknowledge Delivery & Ingest Stock',

    // Abandoned Carts
    'carts.title': 'Checkout Dropout & Revenue Recovery Engine',
    'carts.subtitle': 'Algorithmic identification of high-value dropped carts & AI recovery campaigns',
    'carts.totalRecoverable': 'TOTAL RECOVERABLE GMV',
    'carts.potentialRecovery': 'PROJECTED AI RECOVERY',
    'carts.activeDrops': 'ABANDONED SESSIONS',
    'carts.generateAI': 'GENERATE AI CAMPAIGN',
    'carts.markRecovered': 'MARK AS RECOVERED',

    // Branch Network
    'branch.title': 'Store Node Network & Hub Telemetry',
    'branch.subtitle': 'Inter-branch stock balances, capacity metrics, and hourly sales volume',
    'branch.totalNodes': 'ACTIVE STORE NODES',
    'branch.avgOccupancy': 'AVG WAREHOUSE OCCUPANCY',
    'branch.topStore': 'HIGHEST REVENUE NODE',

    // AI Copilot Modal
    'copilot.title': 'STOVUE RETAIL AI COPILOT',
    'copilot.desc': 'Enterprise AI intelligence for inventory optimization, sales velocity & revenue recovery',
    'copilot.placeholder': 'Ask retail copilot (e.g. How to prevent weekend stockout in Barcelona?)...',
    'copilot.send': 'EXECUTE PROMPT',
    'copilot.clear': 'CLEAR CONTEXT'
  },
  es: {
    // Top Bar & Welcome
    'app.tagline': 'CENTRO DE COMANDO COMERCIAL [TERMINAL]',
    'server.nominal': 'SERVIDOR: TOK-04 • SISTEMAS NOMINALES',
    'btn.enterTerminal': 'INGRESAR A TERMINAL',
    'btn.initTerminal': 'INICIALIZAR TERMINAL',
    'access.alpha': 'NIVEL DE ACCESO: ALPHA • MODO ALTA DENSIDAD',
    'welcome.greeting': 'Bienvenido de nuevo,',
    'welcome.ceo': 'Director Ejecutivo (CEO)',
    'welcome.supply': 'Líder de Cadena de Suministro',
    'welcome.growth': 'Analista de Crecimiento & Ingresos',
    'welcome.store': 'Director de Sucursal',
    'welcome.desc': 'Plataforma unificada de retail omnicanal con telemetría en tiempo real de SKUs, reabastecimiento algorítmico y recuperación de carritos con IA.',
    'metric.revenue': 'Ingresos en Vivo',
    'metric.revenueSub': 'Sincronizado 24h',
    'metric.conversion': 'Conversión',
    'metric.conversionSub': '+1.4% vs Objetivo',
    'metric.skuMatrix': 'Matriz de SKUs',
    'metric.skuMatrixSub': '5 Nodos de Tienda',
    'metric.stockHealth': 'Salud de Stock',
    'metric.stockHealthSub': 'Cero Paradas Críticas',
    'profile.select': 'SELECCIONAR PERFIL DE ACCESO',
    'profile.rbac': 'RBAC: ACTIVO',
    'profile.selected': '[SELECCIONADO]',
    'profile.active': 'ACTIVO',
    'profile.choose': 'ELEGIR',
    'profile.node': 'NODO',
    'btn.demoCeo': 'PERFIL DEMO (CEO 360°)',

    // Navbar
    'nav.systemNominal': 'SYS: NOMINAL • SYNC 24H',
    'nav.selectNode': 'SELECCIONAR NODO / ALMACÉN',
    'nav.simulateOrder': 'SIMULAR PEDIDO',
    'nav.simulating': 'SIMULANDO',
    'nav.lowStock': 'STOCK BAJO',
    'nav.dropouts': 'ABANDONOS',
    'nav.copilot': 'COPILOT IA',
    'nav.logout': 'Cambiar rol o salir',

    // Sidebar
    'nav.overview': 'RESUMEN OPERATIVO',
    'nav.skus': 'MATRIZ DE SKUS & CATÁLOGO',
    'nav.alerts': 'SALUD DE STOCK & RUNWAY',
    'nav.carts': 'RECUPERACIÓN DE CARRITOS',
    'nav.branches': 'TELEMETRÍA DE NODOS',
    'sidebar.engine': 'MOTOR EN TIEMPO REAL STOVUE',
    'sidebar.latency': 'LATENCIA: 12MS • CLÚSTER OK',
    'sidebar.version': 'v9.4.2-LST',

    // Dashboard Overview
    'dash.title': 'Centro de Mando Operativo de Retail',
    'dash.subtitle': 'Telemetría omnicanal consolidada y rendimiento por sucursal',
    'dash.allBranches': 'Red Consolidada (Todos los Nodos)',
    'dash.grossRevenue': 'INGRESOS BRUTOS 24H',
    'dash.grossTarget': 'vs trayectoria proyectada',
    'dash.avgOrderValue': 'TICKET MEDIO (AOV)',
    'dash.grossMargin': 'MARGEN OPERATIVO BRUTO',
    'dash.criticalAlerts': 'VECTORES DE RUPTURA DE STOCK',
    'dash.viewAlerts': 'Ver Radar de Stock',
    'dash.revenueChartTitle': 'Ingresos Horarios Consolidados & Flujo Omnicanal de Pedidos',
    'dash.channelSplit': 'DISTRIBUCIÓN DE INGRESOS POR CANAL',
    'dash.branchComparison': 'MATRIZ DE VENTAS POR SUCURSAL',
    'dash.liveFeedTitle': 'Transmisión de Eventos en Tiempo Real',
    'dash.liveFeedDesc': 'Terminales POS directos, checkout e-commerce y movimientos de inventario',

    // SKU Management
    'sku.title': 'Matriz de SKUs & Telemetría de Inventario',
    'sku.subtitle': 'Control de catálogo global, códigos EAN, umbrales de seguridad y rebalanceo entre tiendas',
    'sku.newBtn': '+ NUEVO PRODUCTO SKU',
    'sku.export': 'EXPORTAR CSV',
    'sku.searchPlaceholder': 'Buscar SKU, nombre, categoría, EAN o proveedor...',
    'sku.allCategories': 'TODAS LAS CATEGORÍAS',
    'sku.allStatuses': 'TODOS LOS ESTADOS',
    'sku.thSKU': 'SKU / CÓDIGO',
    'sku.thProduct': 'PRODUCTO',
    'sku.thCategory': 'CATEGORÍA',
    'sku.thCost': 'COSTO',
    'sku.thPrice': 'PVP',
    'sku.thMargin': 'MARGEN',
    'sku.thStock': 'NIVEL DE STOCK',
    'sku.thVelocity': 'VELOCIDAD',
    'sku.thStatus': 'ESTADO',
    'sku.thActions': 'ACCIONES',
    'sku.statusActive': 'EN STOCK',
    'sku.statusLow': 'STOCK BAJO',
    'sku.statusOut': 'AGOTADO',

    // Inventory Alerts
    'alerts.title': 'Salud de Stock & Reabastecimiento',
    'alerts.subtitle': 'Vectores de rotura de inventario, cálculo de runway y generación automática de órdenes de compra',
    'alerts.runDiagnosis': 'Ejecutar Diagnóstico de Stock con IA',
    'alerts.criticalCount': 'SKUs Críticos',
    'alerts.radarTitle': 'Radar de Alertas bajo Umbral de Seguridad',
    'alerts.pipelineTitle': 'Pipeline de Órdenes de Compra (PO)',
    'alerts.transfer': 'Transferir',
    'alerts.emitPO': 'Emitir PO',
    'alerts.runway': 'Días Runway',
    'alerts.acknowledge': 'Registrar Entrega e Ingresar a Stock',

    // Abandoned Carts
    'carts.title': 'Motor de Recuperación de Carritos Abandonados',
    'carts.subtitle': 'Detección algorítmica de abandonos de alto valor y campañas automáticas con IA',
    'carts.totalRecoverable': 'GMV TOTAL RECUPERABLE',
    'carts.potentialRecovery': 'RECUPERACIÓN ESTIMADA IA',
    'carts.activeDrops': 'SESIONES ABANDONADAS',
    'carts.generateAI': 'GENERAR CAMPAÑA IA',
    'carts.markRecovered': 'MARCAR COMO RECUPERADO',

    // Branch Network
    'branch.title': 'Red de Nodos y Almacenes de Tienda',
    'branch.subtitle': 'Balances de existencias entre sucursales, tasas de ocupación y volumen de ventas horario',
    'branch.totalNodes': 'NODOS ACTIVOS EN RED',
    'branch.avgOccupancy': 'OCUPACIÓN MEDIA DE ALMACÉN',
    'branch.topStore': 'SUCURSAL DE MAYOR VENTA',

    // AI Copilot Modal
    'copilot.title': 'STOVUE COPILOT DE RETAIL IA',
    'copilot.desc': 'Inteligencia artificial empresarial para optimización de inventario, rotación y recuperación de ingresos',
    'copilot.placeholder': 'Consulta al asistente (ej. ¿Cómo evitar quiebre de stock en Barcelona el fin de semana?)...',
    'copilot.send': 'EJECUTAR CONSULTA',
    'copilot.clear': 'LIMPIAR CONTEXTO'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('stovue_lang');
    return (saved === 'es' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('stovue_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'es' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
