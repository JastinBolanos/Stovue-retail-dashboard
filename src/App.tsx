import React from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { SKUManagement } from './components/SKUManagement';
import { InventoryAlerts } from './components/InventoryAlerts';
import { AbandonedCarts } from './components/AbandonedCarts';
import { BranchNetwork } from './components/BranchNetwork';
import { RetailCopilotView } from './components/RetailCopilotView';
import { RetailCopilotModal } from './components/RetailCopilotModal';
import { CreateSKUModal } from './components/CreateSKUModal';
import { useRetailEngine } from './hooks/useRetailEngine';

export default function App() {
  const {
    // Session & View State
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

    // Navigation & Modal Setters
    setActiveTab,
    setSelectedBranchId,
    setIsCopilotOpen,
    setIsCreateSKUOpen,

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
  } = useRetailEngine();

  // Render Welcome Screen if not authenticated
  if (!isAuthenticated) {
    return <WelcomeScreen onEnter={handleEnterDashboard} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-outfit flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar Header */}
      <Navbar
        currentProfile={currentProfile}
        branches={branches}
        selectedBranchId={selectedBranchId}
        onSelectBranch={setSelectedBranchId}
        lowStockCount={lowStockCount}
        abandonedCartsCount={abandonedCartsCount}
        onOpenAICopilot={() => setIsCopilotOpen(true)}
        onSwitchProfile={handleExitToWelcome}
        onNavigateTab={setActiveTab}
      />

      {/* Main Layout (Sidebar + Content Stage) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Control Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          lowStockCount={lowStockCount}
          abandonedCartsCount={abandonedCartsCount}
          totalSKUs={skus.length}
        />

        {/* Dynamic Center Stage */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <DashboardOverview
              skus={skus}
              branches={branches}
              selectedBranchId={selectedBranchId}
              liveEvents={liveEvents}
              onNavigateTab={setActiveTab}
              onOpenCopilot={() => setIsCopilotOpen(true)}
            />
          )}

          {activeTab === 'skus' && (
            <SKUManagement
              skus={skus}
              branches={branches}
              onUpdateSKU={handleUpdateSKU}
              onBulkUpdatePrice={handleBulkUpdatePrice}
              onBulkUpdateStatus={handleBulkUpdateStatus}
              onDeleteSKU={handleDeleteSKU}
              onOpenCreateModal={() => setIsCreateSKUOpen(true)}
              onImportCSV={handleImportCSV}
            />
          )}

          {activeTab === 'alerts' && (
            <InventoryAlerts
              skus={skus}
              branches={branches}
              purchaseOrders={purchaseOrders}
              onUpdateSKU={handleUpdateSKU}
              onCreatePurchaseOrder={handleCreatePurchaseOrder}
              onReceivePurchaseOrder={handleReceivePurchaseOrder}
            />
          )}

          {activeTab === 'carts' && (
            <AbandonedCarts
              carts={abandonedCarts}
              onUpdateCart={handleUpdateCart}
              onSimulateRecovery={handleSimulateCartRecovery}
            />
          )}

          {activeTab === 'branches' && (
            <BranchNetwork
              branches={branches}
              selectedBranchId={selectedBranchId}
              onSelectBranch={setSelectedBranchId}
            />
          )}

          {activeTab === 'copilot' && (
            <RetailCopilotView
              skus={skus}
              branches={branches}
              abandonedCarts={abandonedCarts}
              purchaseOrders={purchaseOrders}
              onNavigateTab={setActiveTab}
              onBulkUpdatePrice={handleBulkUpdatePrice}
            />
          )}
        </main>

      </div>

      {/* AI Retail Copilot Dialog Modal */}
      <RetailCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        skus={skus}
        branches={branches}
      />

      {/* New SKU Creation Modal */}
      <CreateSKUModal
        isOpen={isCreateSKUOpen}
        onClose={() => setIsCreateSKUOpen(false)}
        branches={branches}
        onCreateSKU={handleCreateSKU}
      />

    </div>
  );
}
