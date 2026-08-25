import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  ProductSKU, 
  StoreBranch, 
  AbandonedCart, 
  PurchaseOrder, 
  LiveOrderEvent, 
  SKUStatus, 
  UserProfile 
} from '../core/domain';
import { 
  INITIAL_SKUS, 
  INITIAL_BRANCHES, 
  INITIAL_ABANDONED_CARTS, 
  INITIAL_PURCHASE_ORDERS, 
  INITIAL_LIVE_EVENTS,
  USER_PROFILES
} from '../data/mockData';
import { 
  SKUService, 
  InventoryService, 
  TelemetryService 
} from '../core/services';

export function useRetailEngine() {
  // Session & View State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(USER_PROFILES[0]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('branch-all');

  // Core Domain State
  const [skus, setSkus] = useState<ProductSKU[]>(INITIAL_SKUS);
  const [branches, setBranches] = useState<StoreBranch[]>(INITIAL_BRANCHES);
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>(INITIAL_ABANDONED_CARTS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [liveEvents, setLiveEvents] = useState<LiveOrderEvent[]>(INITIAL_LIVE_EVENTS);

  // Modals & Assistant
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isCreateSKUOpen, setIsCreateSKUOpen] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Auth / Navigation Handlers
  const handleEnterDashboard = useCallback((profile: UserProfile) => {
    setCurrentProfile(profile);
    setIsAuthenticated(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00FF41', '#ffffff', '#333333', '#00AA2B']
    });
  }, []);

  const handleExitToWelcome = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  // Telemetry Simulation Trigger
  const handleSimulateSaleEvent = useCallback(() => {
    const tick = TelemetryService.simulateSale(skus, branches, 'pos');
    if (!tick) return;

    setLiveEvents(prev => [tick.newEvent, ...prev.slice(0, 19)]);
    setBranches(tick.updatedBranches);
    setSkus(tick.updatedSKUs);

    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
  }, [skus, branches]);

  // Real-time background simulation loop
  useEffect(() => {
    if (!isSimulating || !isAuthenticated) return;

    const interval = setInterval(() => {
      const tick = TelemetryService.simulateSale(skus, branches, 'pos');
      if (!tick) return;

      setLiveEvents(prev => [tick.newEvent, ...prev.slice(0, 19)]);
      setBranches(tick.updatedBranches);
      setSkus(tick.updatedSKUs);
    }, 8000);

    return () => clearInterval(interval);
  }, [isSimulating, isAuthenticated, skus, branches]);

  // SKU Management Handlers
  const handleUpdateSKU = useCallback((updatedSKU: ProductSKU) => {
    setSkus(prev => prev.map(s => s.id === updatedSKU.id ? updatedSKU : s));
  }, []);

  const handleCreateSKU = useCallback((newSKU: ProductSKU) => {
    setSkus(prev => [newSKU, ...prev]);
  }, []);

  const handleDeleteSKU = useCallback((skuId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este SKU del catálogo central?')) {
      setSkus(prev => prev.filter(s => s.id !== skuId));
    }
  }, []);

  const handleBulkUpdatePrice = useCallback((selectedIds: string[], percentageChange: number) => {
    setSkus(prev => SKUService.applyBulkPriceChange(prev, selectedIds, percentageChange));
  }, []);

  const handleBulkUpdateStatus = useCallback((selectedIds: string[], status: SKUStatus) => {
    setSkus(prev => SKUService.applyBulkStatusChange(prev, selectedIds, status));
  }, []);

  const handleImportCSV = useCallback((imported: ProductSKU[]) => {
    setSkus(prev => [...imported, ...prev]);
  }, []);

  // Purchase Order Handlers
  const handleCreatePurchaseOrder = useCallback((newPO: PurchaseOrder) => {
    setPurchaseOrders(prev => [newPO, ...prev]);
  }, []);

  const handleReceivePurchaseOrder = useCallback((poId: string) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    // Update PO status
    setPurchaseOrders(prev => prev.map(p => p.id === poId ? { ...p, status: 'received' } : p));

    // Increase SKU stocks via inventory service
    setSkus(prev => InventoryService.applyPurchaseOrderReceipt(prev, po));

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  }, [purchaseOrders]);

  // Cart Recovery Handlers
  const handleUpdateCart = useCallback((updatedCart: AbandonedCart) => {
    setAbandonedCarts(prev => prev.map(c => c.id === updatedCart.id ? updatedCart : c));
  }, []);

  const handleSimulateCartRecovery = useCallback((cartId: string) => {
    const cart = abandonedCarts.find(c => c.id === cartId);
    if (!cart) return;

    setAbandonedCarts(prev => prev.map(c => c.id === cartId ? { ...c, recoveryStatus: 'recovered' } : c));

    // Increment branch revenue
    setBranches(prev => prev.map(b => ({
      ...b,
      revenueToday: b.revenueToday + cart.totalValue,
      ordersToday: b.ordersToday + 1
    })));

    // Emit live telemetry event
    const newEvent = TelemetryService.createCartRecoveredEvent(cart);
    setLiveEvents(prev => [newEvent, ...prev.slice(0, 19)]);
  }, [abandonedCarts]);

  // Computed metrics
  const lowStockCount = skus.filter(s => s.totalStock <= s.minStockAlert).length;
  const abandonedCartsCount = abandonedCarts.filter(c => c.recoveryStatus === 'pending').length;

  return {
    // Session State
    isAuthenticated,
    currentProfile,
    activeTab,
    selectedBranchId,
    isCopilotOpen,
    isCreateSKUOpen,
    isSimulating,
    lowStockCount,
    abandonedCartsCount,

    // Core Domain Data
    skus,
    branches,
    abandonedCarts,
    purchaseOrders,
    liveEvents,

    // State Setters & Actions
    setActiveTab,
    setSelectedBranchId,
    setIsCopilotOpen,
    setIsCreateSKUOpen,
    setIsSimulating,

    // Domain Handlers
    handleEnterDashboard,
    handleExitToWelcome,
    handleSimulateSaleEvent,
    handleUpdateSKU,
    handleCreateSKU,
    handleDeleteSKU,
    handleBulkUpdatePrice,
    handleBulkUpdateStatus,
    handleImportCSV,
    handleCreatePurchaseOrder,
    handleReceivePurchaseOrder,
    handleUpdateCart,
    handleSimulateCartRecovery
  };
}
