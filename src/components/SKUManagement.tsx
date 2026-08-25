import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Upload, 
  CheckSquare, 
  Square, 
  Barcode, 
  Edit3, 
  Trash2, 
  Check, 
  X,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import { ProductSKU, CategoryType, SKUStatus, StoreBranch } from '../types';
import confetti from 'canvas-confetti';

interface SKUManagementProps {
  skus: ProductSKU[];
  branches: StoreBranch[];
  onUpdateSKU: (sku: ProductSKU) => void;
  onBulkUpdatePrice: (selectedIds: string[], percentageChange: number) => void;
  onBulkUpdateStatus: (selectedIds: string[], status: SKUStatus) => void;
  onDeleteSKU: (skuId: string) => void;
  onOpenCreateModal: () => void;
  onImportCSV: (imported: ProductSKU[]) => void;
}

export const SKUManagement: React.FC<SKUManagementProps> = ({
  skus,
  branches,
  onUpdateSKU,
  onBulkUpdatePrice,
  onBulkUpdateStatus,
  onDeleteSKU,
  onOpenCreateModal,
  onImportCSV
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [barcodeModalSKU, setBarcodeModalSKU] = useState<ProductSKU | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  // Category labels map
  const categoryLabels: Record<CategoryType, string> = {
    smartphones: 'Smartphones',
    audio_sound: 'Audio & Sonido',
    computing_tablets: 'Computación & Laptops',
    wearables_fitness: 'Wearables & Relojes',
    apparel_techwear: 'Ropa Técnica',
    luxury_outerwear: 'Abrigos de Lujo',
    accessories_bags: 'Accesorios & Mochilas',
  };

  // Filtered SKUs
  const filteredSKUs = useMemo(() => {
    return skus.filter(item => {
      const matchSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.barcode.includes(searchQuery);

      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
      
      const matchBranch = selectedBranch === 'all' || item.branches.some(b => b.branchId === selectedBranch && b.stock > 0);

      return matchSearch && matchCategory && matchStatus && matchBranch;
    });
  }, [skus, searchQuery, selectedCategory, selectedStatus, selectedBranch]);

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredSKUs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSKUs.map(s => s.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Inline Stock Adjust
  const handleAdjustStock = (sku: ProductSKU, delta: number) => {
    const newStock = Math.max(0, sku.totalStock + delta);
    const newStatus: SKUStatus = 
      newStock === 0 ? 'out_of_stock' : 
      newStock <= sku.minStockAlert ? 'low_stock' : 'active';

    const updatedBranches = sku.branches.map(b => ({
      ...b,
      stock: Math.max(0, b.stock + Math.round(delta / Math.max(1, sku.branches.length)))
    }));

    onUpdateSKU({
      ...sku,
      totalStock: newStock,
      status: newStatus,
      branches: updatedBranches
    });
  };

  // Inline Price Save
  const handleSavePrice = (sku: ProductSKU) => {
    if (tempPrice > 0) {
      onUpdateSKU({
        ...sku,
        retailPrice: tempPrice
      });
    }
    setEditingPriceId(null);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const itemsToExport = selectedIds.length > 0 
      ? skus.filter(s => selectedIds.includes(s.id))
      : filteredSKUs;

    const headers = ['SKU,Nombre,Categoría,Marca,Precio_Costo,Precio_Venta,Stock_Total,Alerta_Min,Estado,Codigo_Barras,Proveedor'];
    const rows = itemsToExport.map(s => 
      `"${s.sku}","${s.name}","${s.category}","${s.brand}",${s.costPrice},${s.retailPrice},${s.totalStock},${s.minStockAlert},"${s.status}","${s.barcode}","${s.supplier}"`
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Stovue_SKUs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  // Import CSV parser
  const handleProcessImport = () => {
    if (!importText.trim()) return;

    try {
      const lines = importText.trim().split('\n');
      const newItems: ProductSKU[] = [];

      // Assume first line is header if it contains SKU
      const startIndex = lines[0].toLowerCase().includes('sku') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.replace(/(^"|"$)/g, '').trim());
        if (parts.length >= 6) {
          const skuCode = parts[0] || `NX-SKU-${Date.now() + i}`;
          const name = parts[1] || 'Producto Importado';
          const category = (parts[2] as CategoryType) || 'smartphones';
          const brand = parts[3] || 'Stovue Brand';
          const cost = parseFloat(parts[4]) || 50;
          const price = parseFloat(parts[5]) || 120;
          const stock = parseInt(parts[6], 10) || 25;

          newItems.push({
            id: `sku-import-${Date.now()}-${i}`,
            sku: skuCode,
            name: name,
            category: category,
            brand: brand,
            costPrice: cost,
            retailPrice: price,
            totalStock: stock,
            minStockAlert: 15,
            maxCapacity: 200,
            barcode: `84370198${Math.floor(10000 + Math.random() * 90000)}`,
            supplier: 'Proveedor Importado CSV',
            branches: branches.slice(1).map(b => ({
              branchId: b.id,
              branchName: b.name,
              stock: Math.floor(stock / 4),
              reserved: 0
            })),
            status: stock <= 15 ? 'low_stock' : 'active',
            salesVelocityDaily: 4.5,
            rating: 4.8,
            returnsRatePct: 1.5,
            image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80',
            tags: ['Importado CSV', 'Catálogo Masivo'],
            lastRestocked: new Date().toISOString().split('T')[0],
          });
        }
      }

      if (newItems.length > 0) {
        onImportCSV(newItems);
        setShowImportModal(false);
        setImportText('');
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err) {
      alert('Error al parsear el formato CSV. Por favor verifica los datos.');
    }
  };

  return (
    <div className="space-y-4 pb-8 font-mono-data text-[#E2E2E2]">
      {/* Header Title & Top Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A1A1A]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight uppercase">
              SKU Master Inventory & Pricing Hub
            </h1>
            <span className="text-[10px] px-2 py-0.5 bg-[#103319] text-[#00FF41] border border-[#00FF41]/40 uppercase">
              {skus.length} Active Records
            </span>
          </div>
          <p className="text-[10px] text-[#666] mt-0.5">
            Bulk price manipulation, multi-store stock rebalancing, barcodes & CSV sync
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-1.5 bg-[#0F0F11] hover:bg-[#16161A] text-white text-xs border border-[#333] hover:border-[#00FF41] transition flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="h-3 w-3 text-[#00FF41]" />
            <span className="text-[11px] uppercase">Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-[#0F0F11] hover:bg-[#16161A] text-white text-xs border border-[#333] hover:border-[#00FF41] transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-3 w-3 text-[#00FF41]" />
            <span className="text-[11px] uppercase">Export {selectedIds.length > 0 && `(${selectedIds.length})`}</span>
          </button>

          <button
            id="btn-create-sku-modal"
            onClick={onOpenCreateModal}
            className="px-3.5 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-tighter hover:bg-[#00FF41] transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>New SKU</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-[#0F0F11] border border-[#1F1F23] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#666]" />
            <input
              type="text"
              placeholder="Search SKU, name, brand, barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#050505] border border-[#222] text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#00FF41] transition"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#050505] border border-[#222] text-xs text-[#CCC] focus:outline-none focus:border-[#00FF41] transition cursor-pointer"
            >
              <option value="all">ALL CATEGORIES</option>
              <option value="smartphones">Smartphones</option>
              <option value="audio_sound">Audio & Sonido</option>
              <option value="computing_tablets">Computación & Laptops</option>
              <option value="wearables_fitness">Wearables & Relojes</option>
              <option value="apparel_techwear">Ropa Técnica</option>
              <option value="luxury_outerwear">Abrigos de Lujo</option>
              <option value="accessories_bags">Accesorios & Mochilas</option>
            </select>
          </div>

          {/* Stock Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#050505] border border-[#222] text-xs text-[#CCC] focus:outline-none focus:border-[#00FF41] transition cursor-pointer"
            >
              <option value="all">ALL STOCK LEVELS</option>
              <option value="active">● Healthy Stock (Active)</option>
              <option value="low_stock">▲ Critical Low Stock</option>
              <option value="out_of_stock">✕ Out of Stock</option>
              <option value="discontinued">⚪ Discontinued</option>
            </select>
          </div>

          {/* Branch Stock Filter */}
          <div>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#050505] border border-[#222] text-xs text-[#CCC] focus:outline-none focus:border-[#00FF41] transition cursor-pointer"
            >
              <option value="all">ALL BRANCH NODES</option>
              {branches.slice(1).map(b => (
                <option key={b.id} value={b.id}>NODE: {b.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Bulk Action Bar (when items selected) */}
        {selectedIds.length > 0 && (
          <div className="p-2.5 bg-[#103319]/30 border border-[#00FF41]/40 flex flex-wrap items-center justify-between gap-2 text-xs text-[#00FF41]">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider">{selectedIds.length} SKUs SELECTED</span>
              <button
                onClick={() => setSelectedIds([])}
                className="text-[10px] underline text-[#888] hover:text-white"
              >
                Clear Selection
              </button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#888] text-[10px] uppercase">Bulk Price:</span>
              <button
                onClick={() => onBulkUpdatePrice(selectedIds, 5)}
                className="px-2 py-0.5 bg-[#050505] hover:bg-[#16161A] text-[#00FF41] border border-[#00FF41]/40 font-mono text-[10px]"
              >
                +5%
              </button>
              <button
                onClick={() => onBulkUpdatePrice(selectedIds, 10)}
                className="px-2 py-0.5 bg-[#050505] hover:bg-[#16161A] text-[#00FF41] border border-[#00FF41]/40 font-mono text-[10px]"
              >
                +10%
              </button>
              <button
                onClick={() => onBulkUpdatePrice(selectedIds, -5)}
                className="px-2 py-0.5 bg-[#050505] hover:bg-[#16161A] text-[#FF4444] border border-[#FF4444]/40 font-mono text-[10px]"
              >
                -5%
              </button>
              <button
                onClick={() => onBulkUpdatePrice(selectedIds, -10)}
                className="px-2 py-0.5 bg-[#050505] hover:bg-[#16161A] text-[#FF4444] border border-[#FF4444]/40 font-mono text-[10px]"
              >
                -10%
              </button>

              <div className="h-3 w-px bg-[#333] mx-1" />

              <button
                onClick={() => onBulkUpdateStatus(selectedIds, 'active')}
                className="px-2 py-0.5 bg-[#050505] text-[#00FF41] border border-[#00FF41]/40 text-[10px] uppercase"
              >
                Set Active
              </button>
              <button
                onClick={() => onBulkUpdateStatus(selectedIds, 'discontinued')}
                className="px-2 py-0.5 bg-[#050505] text-[#888] border border-[#333] text-[10px] uppercase"
              >
                Discontinue
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Massive Data Grid Table */}
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-data border-collapse">
            <thead className="bg-[#050505] text-[#666] uppercase text-[9px] tracking-widest border-b border-[#1A1A1A]">
              <tr>
                <th className="p-2.5 w-8 text-center">
                  <button onClick={handleSelectAll} className="cursor-pointer">
                    {selectedIds.length === filteredSKUs.length && filteredSKUs.length > 0 ? (
                      <CheckSquare className="h-3.5 w-3.5 text-[#00FF41]" />
                    ) : (
                      <Square className="h-3.5 w-3.5 text-[#444]" />
                    )}
                  </button>
                </th>
                <th className="p-2.5">SKU & Item Title</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5 text-right">Cost / Margin</th>
                <th className="p-2.5 text-right">PVP Retail</th>
                <th className="p-2.5 text-center">Total Stock</th>
                <th className="p-2.5 text-center">Status</th>
                <th className="p-2.5 text-right">Velocity</th>
                <th className="p-2.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]">
              {filteredSKUs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#666]">
                    NO MATCHING SKUs IN QUERY MATRIX
                  </td>
                </tr>
              ) : (
                filteredSKUs.map((sku) => {
                  const isSelected = selectedIds.includes(sku.id);
                  const isEditingPrice = editingPriceId === sku.id;
                  const grossMargin = (((sku.retailPrice - sku.costPrice) / sku.retailPrice) * 100).toFixed(1);
                  const isCriticalStock = sku.totalStock <= sku.minStockAlert;

                  return (
                    <tr 
                      key={sku.id}
                      className={`hover:bg-[#0F0F11] transition ${isSelected ? 'bg-[#103319]/10' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="p-2.5 text-center">
                        <button onClick={() => handleToggleSelect(sku.id)} className="cursor-pointer">
                          {isSelected ? (
                            <CheckSquare className="h-3.5 w-3.5 text-[#00FF41]" />
                          ) : (
                            <Square className="h-3.5 w-3.5 text-[#444]" />
                          )}
                        </button>
                      </td>

                      {/* Product Name, SKU code & Image */}
                      <td className="p-2.5">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={sku.image} 
                            alt={sku.name} 
                            className="h-8 w-8 object-cover border border-[#222] shrink-0" 
                          />
                          <div>
                            <div className="font-bold text-white text-xs hover:text-[#00FF41] transition">
                              {sku.name}
                            </div>
                            <div className="text-[9px] text-[#666] flex items-center gap-1.5 mt-0.5">
                              <span className="text-[#00FF41] font-mono">{sku.sku}</span>
                              <span>•</span>
                              <span>{sku.brand}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-2.5 text-[#888] text-[10px]">
                        <span className="px-1.5 py-0.5 bg-[#050505] border border-[#222]">
                          {categoryLabels[sku.category] || sku.category}
                        </span>
                      </td>

                      {/* Cost & Gross Margin */}
                      <td className="p-2.5 text-right">
                        <div className="text-[#888] font-mono">€{sku.costPrice}</div>
                        <div className="text-[9px] text-[#00FF41]">
                          Margin: {grossMargin}%
                        </div>
                      </td>

                      {/* Retail Price with fast inline editing */}
                      <td className="p-2.5 text-right">
                        {isEditingPrice ? (
                          <div className="flex items-center justify-end gap-1">
                            <input 
                              type="number" 
                              value={tempPrice}
                              onChange={(e) => setTempPrice(parseFloat(e.target.value) || 0)}
                              className="w-16 px-1 py-0.5 bg-[#050505] border border-[#00FF41] text-xs text-white font-mono text-right"
                              autoFocus
                            />
                            <button 
                              onClick={() => handleSavePrice(sku)}
                              className="p-1 bg-[#00FF41] text-black hover:bg-white"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => setEditingPriceId(null)}
                              className="p-1 bg-[#1A1A1A] text-[#888] hover:text-white"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => {
                              setEditingPriceId(sku.id);
                              setTempPrice(sku.retailPrice);
                            }}
                            className="group cursor-pointer flex items-center justify-end gap-1.5"
                            title="Click to edit price"
                          >
                            <span className="font-mono font-bold text-white text-xs">€{sku.retailPrice}</span>
                            <Edit3 className="h-3 w-3 text-[#444] group-hover:text-[#00FF41] transition" />
                          </div>
                        )}
                      </td>

                      {/* Stock Total with Inline Controls (+ / -) */}
                      <td className="p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleAdjustStock(sku, -1)}
                            className="h-5 w-5 bg-[#050505] hover:bg-[#16161A] border border-[#333] text-[#888] hover:text-white font-bold flex items-center justify-center transition"
                            title="Subtract 1 unit"
                          >
                            -
                          </button>
                          <span className={`font-mono font-bold text-xs min-w-[28px] ${isCriticalStock ? 'text-[#FF4444]' : 'text-white'}`}>
                            {sku.totalStock}
                          </span>
                          <button
                            onClick={() => handleAdjustStock(sku, 1)}
                            className="h-5 w-5 bg-[#050505] hover:bg-[#16161A] border border-[#333] text-[#888] hover:text-white font-bold flex items-center justify-center transition"
                            title="Add 1 unit"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-[9px] text-[#555] mt-0.5">
                          Alert: {sku.minStockAlert}
                        </div>
                      </td>

                      {/* Stock Status Badge */}
                      <td className="p-2.5 text-center">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          sku.status === 'active' ? 'bg-[#103319] text-[#00FF41] border border-[#00FF41]/40' :
                          sku.status === 'low_stock' ? 'bg-[#332211] text-[#FFAA00] border border-[#FFAA00]/40' :
                          sku.status === 'out_of_stock' ? 'bg-[#331111] text-[#FF4444] border border-[#FF4444]/40' :
                          'bg-[#16161A] text-[#666]'
                        }`}>
                          {sku.status === 'active' ? '● NOMINAL' :
                           sku.status === 'low_stock' ? '▲ LOW' :
                           sku.status === 'out_of_stock' ? '✕ DEPLETED' : 'VOID'}
                        </span>
                      </td>

                      {/* Sales Velocity */}
                      <td className="p-2.5 text-right">
                        <div className="text-[#00FF41] font-mono">{sku.salesVelocityDaily} <span className="text-[9px] text-[#666]">u/d</span></div>
                        <div className="text-[9px] text-[#666]">★ {sku.rating}</div>
                      </td>

                      {/* Actions */}
                      <td className="p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setBarcodeModalSKU(sku)}
                            className="p-1 bg-[#050505] hover:bg-[#16161A] text-[#888] hover:text-[#00FF41] border border-[#222] transition"
                            title="Barcode label"
                          >
                            <Barcode className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteSKU(sku.id)}
                            className="p-1 bg-[#050505] hover:bg-[#331111] text-[#888] hover:text-[#FF4444] border border-[#222] transition"
                            title="Delete SKU"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barcode & Printable Label Modal */}
      {barcodeModalSKU && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0A0A0A] border border-[#262626] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Barcode className="h-4 w-4 text-[#00FF41]" />
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                  SKU Barcode & Dispatch Label
                </h3>
              </div>
              <button 
                onClick={() => setBarcodeModalSKU(null)}
                className="text-[#666] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Printable Label Box */}
            <div className="p-4 bg-white text-black text-center space-y-2 border border-black">
              <div className="text-[9px] font-mono font-bold tracking-widest uppercase text-[#555]">
                STOVUE RETAIL LOGISTICS HUB
              </div>
              <div className="font-bold text-xs text-black leading-tight">
                {barcodeModalSKU.name}
              </div>
              <div className="font-mono text-[10px] text-[#444]">
                SKU: {barcodeModalSKU.sku}
              </div>

              {/* Simulated EAN-13 Barcode */}
              <div className="py-2 flex flex-col items-center justify-center">
                <div className="flex items-end justify-center h-12 gap-[2px] bg-white px-2">
                  {barcodeModalSKU.barcode.split('').map((char, i) => {
                    const height = (parseInt(char, 10) % 2 === 0 ? 45 : 35) + (i % 3) * 2;
                    const width = (parseInt(char, 10) % 3 === 0 ? 'w-1' : 'w-[2px]');
                    return (
                      <div 
                        key={i} 
                        className={`bg-black ${width}`} 
                        style={{ height: `${height}px` }} 
                      />
                    );
                  })}
                </div>
                <div className="font-mono text-[10px] tracking-[0.3em] font-bold text-black mt-1">
                  {barcodeModalSKU.barcode}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono font-bold pt-1.5 border-t border-black">
                <span>PVP: €{barcodeModalSKU.retailPrice}.00</span>
                <span>ORIGIN: {barcodeModalSKU.supplier.split(' ')[0]}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3 py-1.5 bg-white hover:bg-[#00FF41] text-black font-bold text-[10px] uppercase flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Label
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0A0A0A] border border-[#262626] p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-[#00FF41]" />
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                  Bulk CSV Ingestion Matrix
                </h3>
              </div>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-[#666] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-[10px] text-[#888]">
              Format: <span className="text-[#00FF41]">SKU, Name, Category, Brand, Cost, Price, Stock</span>
            </p>

            <textarea
              rows={5}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`SV-PHN-NEO,Neo Phone 5G,smartphones,StovueBrand,400,799,50\nSV-AUD-PRO,Pro Earbuds Wireless,audio_sound,StovueAudio,35,99,120`}
              className="w-full p-2.5 bg-[#050505] border border-[#222] text-xs font-mono text-white placeholder-[#444] focus:outline-none focus:border-[#00FF41]"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setImportText(`SV-PHN-NEO-256,Stovue Neo Pro 256GB,smartphones,StovueTech,450,899,40\nSV-CMP-PAD-12,Vantage Pad Ultra 12.9",computing_tablets,Vantage,600,1099,25\nSV-ACC-SLEEVE-14,Leather Commuter Sleeve 14",accessories_bags,AcroTech,20,59,100`)}
                className="text-[10px] text-[#00FF41] hover:underline uppercase"
              >
                Load Sample Batch
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-3 py-1 bg-[#16161A] text-[#888] text-[10px] uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessImport}
                  className="px-3.5 py-1 bg-white hover:bg-[#00FF41] text-black font-bold text-[10px] uppercase transition cursor-pointer"
                >
                  Process CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
