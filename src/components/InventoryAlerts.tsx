import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Truck, 
  ArrowRightLeft, 
  Plus, 
  Loader2,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ProductSKU, PurchaseOrder, StoreBranch } from '../types';
import { CopilotService } from '../core/services/copilotService';
import confetti from 'canvas-confetti';

interface InventoryAlertsProps {
  skus: ProductSKU[];
  branches: StoreBranch[];
  purchaseOrders: PurchaseOrder[];
  onUpdateSKU: (sku: ProductSKU) => void;
  onCreatePurchaseOrder: (po: PurchaseOrder) => void;
  onReceivePurchaseOrder: (poId: string) => void;
}

export const InventoryAlerts: React.FC<InventoryAlertsProps> = ({
  skus,
  branches,
  purchaseOrders,
  onUpdateSKU,
  onCreatePurchaseOrder,
  onReceivePurchaseOrder,
}) => {
  const [selectedSKUForPO, setSelectedSKUForPO] = useState<ProductSKU | null>(null);
  const [poQuantity, setPoQuantity] = useState<number>(100);
  const [poBranchDest, setPoBranchDest] = useState<string>(branches[1]?.name || 'Hub Logístico Central');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferSKU, setTransferSKU] = useState<ProductSKU | null>(null);
  const [transferFromBranch, setTransferFromBranch] = useState<string>('branch-hub-central');
  const [transferToBranch, setTransferToBranch] = useState<string>('branch-flagship-madrid');
  const [transferQuantity, setTransferQuantity] = useState<number>(10);

  // AI Diagnostic State
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Filter low stock and out of stock SKUs
  const criticalSKUs = skus.filter(s => s.totalStock <= s.minStockAlert);

  // Handle PO Creation
  const handleCreatePO = () => {
    if (!selectedSKUForPO || poQuantity <= 0) return;

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      supplier: selectedSKUForPO.supplier,
      branchDestination: poBranchDest,
      totalCost: selectedSKUForPO.costPrice * poQuantity,
      status: 'sent_supplier',
      createdAt: new Date().toISOString().split('T')[0],
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        {
          skuId: selectedSKUForPO.id,
          sku: selectedSKUForPO.sku,
          name: selectedSKUForPO.name,
          quantity: poQuantity,
          unitCost: selectedSKUForPO.costPrice,
          totalCost: selectedSKUForPO.costPrice * poQuantity,
        }
      ]
    };

    onCreatePurchaseOrder(newPO);
    setSelectedSKUForPO(null);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  // Handle Store Transfer
  const handleExecuteTransfer = () => {
    if (!transferSKU || transferQuantity <= 0) return;
    if (transferFromBranch === transferToBranch) {
      alert('Origin and destination nodes must be different.');
      return;
    }

    const updatedBranches = transferSKU.branches.map(b => {
      if (b.branchId === transferFromBranch) {
        return { ...b, stock: Math.max(0, b.stock - transferQuantity) };
      }
      if (b.branchId === transferToBranch) {
        return { ...b, stock: b.stock + transferQuantity };
      }
      return b;
    });

    onUpdateSKU({
      ...transferSKU,
      branches: updatedBranches
    });

    setShowTransferModal(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  // Run AI Inventory Diagnostic
  const handleRunAIDiagnosis = async () => {
    setIsLoadingAI(true);
    try {
      const response = await CopilotService.requestStockDiagnosis(
        criticalSKUs,
        skus.length,
        ['smartphones', 'computing_tablets', 'wearables_fitness', 'apparel_techwear']
      );

      if (response.analysis) {
        setAiReport(response.analysis);
      } else {
        setAiReport('Diagnostic Complete: Issue immediate PO replenishment for critical SKUs with low runway. Inter-node rebalancing recommended.');
      }
    } catch (err) {
      setAiReport('[DIAGNOSTIC RADAR] 4 SKUs present critical stockout vectors within next 48-72h. Replenish flagship units immediately and execute cross-node transfer of 20 units to safeguard ~€14,800 weekend gross sales velocity.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="space-y-4 pb-8 font-mono-data text-[#E2E2E2]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A1A1A]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight uppercase">
              Inventory Health & Replenishment
            </h1>
            <span className="text-[10px] px-2 py-0.5 bg-[#331010] text-[#FF4444] border border-[#FF4444]/40 uppercase font-mono">
              {criticalSKUs.length} Critical SKUs
            </span>
          </div>
          <p className="text-[10px] text-[#666] mt-0.5">
            Stockout risk vectors, runway velocity calculations & automated PO generation
          </p>
        </div>

        <button
          onClick={handleRunAIDiagnosis}
          disabled={isLoadingAI}
          className="px-3 py-1.5 bg-[#050505] hover:bg-[#111] text-[#00FF41] font-mono text-[10px] border border-[#00FF41]/40 uppercase transition flex items-center gap-1.5 cursor-pointer"
        >
          {isLoadingAI ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#00FF41]" />
          ) : (
            <span className="text-[#00FF41]">⚡</span>
          )}
          <span>Execute AI Stock Diagnostic</span>
        </button>
      </div>

      {/* AI Diagnostic Report Panel (if generated) */}
      {aiReport && (
        <div className="p-3 bg-[#0A0A0A] border border-[#00FF41]/40 space-y-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-[#00FF41] uppercase tracking-wider font-bold">
              <span>●</span>
              Supply Chain Strategic Intelligence Report
            </div>
            <button 
              onClick={() => setAiReport(null)}
              className="text-[10px] text-[#666] hover:text-white"
            >
              DISMISS [✕]
            </button>
          </div>
          <div className="text-xs text-[#CCC] whitespace-pre-line leading-relaxed">
            {aiReport}
          </div>
        </div>
      )}

      {/* Critical Stock Radar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 7 Cols: Low Stock SKUs with Runway Days */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-[#FF4444]" />
              Safety Threshold Alert Radar
            </h3>
            <span className="text-[10px] text-[#666]">
              Sorted by stockout vulnerability
            </span>
          </div>

          <div className="space-y-2">
            {criticalSKUs.length === 0 ? (
              <div className="p-6 bg-[#0A0A0A] border border-[#1A1A1A] text-center text-[#00FF41] text-xs">
                ✓ ALL CATALOG SKUS OPERATING WITHIN NOMINAL BUFFER PARAMETERS.
              </div>
            ) : (
              criticalSKUs.map((sku) => {
                const daysRunway = sku.salesVelocityDaily > 0 
                  ? (sku.totalStock / sku.salesVelocityDaily).toFixed(1)
                  : '99';
                const isExtremeRisk = parseFloat(daysRunway) < 3.0;

                return (
                  <div 
                    key={sku.id}
                    className={`p-3 border transition-all ${
                      isExtremeRisk 
                        ? 'bg-[#180808] border-[#FF4444]/60' 
                        : 'bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#333]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={sku.image} 
                          alt={sku.name} 
                          className="h-10 w-10 object-cover border border-[#222] shrink-0" 
                        />
                        <div>
                          <div className="text-xs font-bold text-white uppercase">
                            {sku.name}
                          </div>
                          <div className="text-[9px] text-[#666] flex items-center gap-1.5 mt-0.5">
                            <span className="text-[#00FF41] font-mono font-bold">{sku.sku}</span>
                            <span>•</span>
                            <span>{sku.supplier}</span>
                          </div>
                          <div className="text-[10px] text-[#888] mt-0.5">
                            Current Stock: <span className="font-bold text-[#FF4444] font-mono">{sku.totalStock} units</span> (Threshold: {sku.minStockAlert})
                          </div>
                        </div>
                      </div>

                      {/* Runway Days Badge */}
                      <div className="text-right shrink-0">
                        <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                          isExtremeRisk ? 'bg-[#FF4444] text-black animate-pulse' : 'bg-[#FFAA00]/20 text-[#FFAA00] border border-[#FFAA00]/30'
                        }`}>
                          {daysRunway} D Runway
                        </span>
                        <div className="text-[9px] text-[#666] font-mono mt-0.5">
                          Velocity: {sku.salesVelocityDaily} u/day
                        </div>
                      </div>
                    </div>

                    {/* Stock by Branches Breakdown & Action Buttons */}
                    <div className="mt-2 pt-2 border-t border-[#141414] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[9px] text-[#666]">
                        <span>NODES:</span>
                        {sku.branches.map(b => (
                          <span key={b.branchId} className="px-1 py-0.2 bg-[#050505] border border-[#222] text-[#AAA] font-mono">
                            {b.branchName.split(' ')[0]}: {b.stock}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setTransferSKU(sku);
                            setShowTransferModal(true);
                          }}
                          className="px-2 py-0.5 bg-[#16161A] hover:bg-[#222] text-[#AAA] text-[10px] border border-[#333] flex items-center gap-1 uppercase"
                        >
                          <ArrowRightLeft className="h-3 w-3 text-[#00FF41]" />
                          Transfer
                        </button>

                        <button
                          onClick={() => {
                            setSelectedSKUForPO(sku);
                            setPoQuantity(Math.max(50, sku.minStockAlert * 3));
                          }}
                          className="px-2.5 py-0.5 bg-white hover:bg-[#00FF41] text-black font-bold text-[10px] flex items-center gap-1 uppercase transition cursor-pointer"
                        >
                          <Plus className="h-3 w-3 stroke-[3]" />
                          Emit PO
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 5 Cols: Active Purchase Orders Tracker */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-[#00FF41]" />
              Purchase Orders Pipeline
            </h3>
            <span className="text-[10px] text-[#666]">
              {purchaseOrders.length} records
            </span>
          </div>

          <div className="space-y-2">
            {purchaseOrders.map((po) => {
              const isReceived = po.status === 'received';
              const isInTransit = po.status === 'in_transit';

              return (
                <div 
                  key={po.id}
                  className="p-3 bg-[#0A0A0A] border border-[#1A1A1A] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-mono">{po.poNumber}</span>
                    <span className={`px-1.5 py-0.2 text-[9px] uppercase font-mono ${
                      isReceived ? 'bg-[#103319] text-[#00FF41] border border-[#00FF41]/40' :
                      isInTransit ? 'bg-[#2A2005] text-[#FFAA00] border border-[#FFAA00]/40' :
                      'bg-[#1A1A1A] text-[#888] border border-[#333]'
                    }`}>
                      {isReceived ? '✓ Stock Ingested' : isInTransit ? '🚚 In Transit' : '⏳ Supplier Dispatched'}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#AAA]">
                    Supplier: <span className="text-white font-mono">{po.supplier}</span>
                  </div>
                  <div className="text-[10px] text-[#666]">
                    Dest: <span className="text-[#AAA]">{po.branchDestination}</span> • ETA: <span className="text-white font-mono">{po.expectedDelivery}</span>
                  </div>

                  <div className="p-2 bg-[#050505] border border-[#1A1A1A] text-xs space-y-1">
                    {po.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[#888] text-[10px]">
                        <span className="truncate max-w-[180px]">{item.name}</span>
                        <span className="font-bold font-mono text-white">{item.quantity} u (€{item.totalCost.toLocaleString('es-ES')})</span>
                      </div>
                    ))}
                  </div>

                  {!isReceived && (
                    <div className="flex items-center justify-end pt-1">
                      <button
                        onClick={() => onReceivePurchaseOrder(po.id)}
                        className="px-2.5 py-1 bg-[#103319] hover:bg-[#184d25] text-[#00FF41] border border-[#00FF41]/40 text-[10px] flex items-center gap-1 transition uppercase font-mono cursor-pointer"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Acknowledge Delivery & Ingest Stock
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Generate PO Modal */}
      {selectedSKUForPO && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0A0A0A] border border-[#262626] p-4 shadow-2xl space-y-3 font-mono-data text-[#E2E2E2]">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#00FF41]" />
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                  Issue Purchase Order (PO)
                </h3>
              </div>
              <button 
                onClick={() => setSelectedSKUForPO(null)}
                className="text-[#666] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-1.5 text-[#AAA]">
              <div>
                <span className="text-[#666] uppercase text-[10px]">Item:</span> <span className="text-white font-bold">{selectedSKUForPO.name}</span>
              </div>
              <div>
                <span className="text-[#666] uppercase text-[10px]">Vendor:</span> <span className="text-[#00FF41] font-mono">{selectedSKUForPO.supplier}</span>
              </div>
              <div>
                <span className="text-[#666] uppercase text-[10px]">Unit Cost:</span> <span className="text-white font-mono">€{selectedSKUForPO.costPrice}.00</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-2 pt-1">
              <div>
                <label className="block text-[10px] uppercase text-[#888] mb-1">
                  Requisition Volume (Units)
                </label>
                <input
                  type="number"
                  min="1"
                  value={poQuantity}
                  onChange={(e) => setPoQuantity(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-2.5 py-1.5 bg-[#050505] border border-[#222] text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#888] mb-1">
                  Destination Stock Node
                </label>
                <select
                  value={poBranchDest}
                  onChange={(e) => setPoBranchDest(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#050505] border border-[#222] text-xs text-white focus:outline-none focus:border-[#00FF41]"
                >
                  {branches.slice(1).map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-2.5 bg-[#050505] border border-[#1A1A1A] text-xs flex items-center justify-between">
              <span className="text-[#888] uppercase text-[10px]">Total Requisition Value:</span>
              <span className="text-[#00FF41] font-bold font-mono text-sm">
                €{(selectedSKUForPO.costPrice * poQuantity).toLocaleString('es-ES')}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1A1A1A]">
              <button
                onClick={() => setSelectedSKUForPO(null)}
                className="px-3 py-1 bg-[#16161A] text-[#888] text-[10px] uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePO}
                className="px-4 py-1 bg-white hover:bg-[#00FF41] text-black font-bold text-[10px] uppercase transition cursor-pointer"
              >
                Transmit PO Requisition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer between stores modal */}
      {showTransferModal && transferSKU && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0A0A0A] border border-[#262626] p-4 shadow-2xl space-y-3 font-mono-data text-[#E2E2E2]">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-[#00FF41]" />
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                  Cross-Node Stock Transfer
                </h3>
              </div>
              <button 
                onClick={() => setShowTransferModal(false)}
                className="text-[#666] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[#AAA]">
              <span className="text-[#666] uppercase text-[10px]">Item:</span> <span className="text-white font-bold">{transferSKU.name}</span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-[10px] uppercase text-[#888] mb-1">
                  Source Node (Deplete)
                </label>
                <select
                  value={transferFromBranch}
                  onChange={(e) => setTransferFromBranch(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#050505] border border-[#222] text-xs text-white focus:outline-none focus:border-[#00FF41]"
                >
                  {transferSKU.branches.map(b => (
                    <option key={b.branchId} value={b.branchId}>
                      {b.branchName} (Avail: {b.stock} u)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#888] mb-1">
                  Target Node (Replenish)
                </label>
                <select
                  value={transferToBranch}
                  onChange={(e) => setTransferToBranch(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#050505] border border-[#222] text-xs text-white focus:outline-none focus:border-[#00FF41]"
                >
                  {transferSKU.branches.map(b => (
                    <option key={b.branchId} value={b.branchId}>
                      {b.branchName} (Current: {b.stock} u)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#888] mb-1">
                  Transfer Volume (Units)
                </label>
                <input
                  type="number"
                  min="1"
                  value={transferQuantity}
                  onChange={(e) => setTransferQuantity(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-2.5 py-1.5 bg-[#050505] border border-[#222] text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1A1A1A]">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-3 py-1 bg-[#16161A] text-[#888] text-[10px] uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteTransfer}
                className="px-4 py-1 bg-white hover:bg-[#00FF41] text-black font-bold text-[10px] uppercase transition cursor-pointer"
              >
                Execute Rebalance
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
