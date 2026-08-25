import React, { useState } from 'react';
import { 
  Package, 
  X, 
  Barcode
} from 'lucide-react';
import { ProductSKU, CategoryType, StoreBranch } from '../types';
import confetti from 'canvas-confetti';

interface CreateSKUModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: StoreBranch[];
  onCreateSKU: (newSKU: ProductSKU) => void;
}

export const CreateSKUModal: React.FC<CreateSKUModalProps> = ({
  isOpen,
  onClose,
  branches,
  onCreateSKU,
}) => {
  const [skuCode, setSkuCode] = useState(`SV-TECH-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('smartphones');
  const [brand, setBrand] = useState('StovueTech');
  const [costPrice, setCostPrice] = useState<number>(120);
  const [retailPrice, setRetailPrice] = useState<number>(299);
  const [totalStock, setTotalStock] = useState<number>(50);
  const [minStockAlert, setMinStockAlert] = useState<number>(20);
  const [supplier, setSupplier] = useState('Foxconn Global Supply');
  const [barcode, setBarcode] = useState(`84370198${Math.floor(10000 + Math.random() * 90000)}`);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&auto=format&fit=crop&q=80');

  if (!isOpen) return null;

  const grossMargin = retailPrice > 0 
    ? (((retailPrice - costPrice) / retailPrice) * 100).toFixed(1)
    : '0.0';

  const profitPerUnit = Math.max(0, retailPrice - costPrice);

  const handleGenerateSKUCode = () => {
    const prefixes: Record<CategoryType, string> = {
      smartphones: 'PHN',
      audio_sound: 'AUD',
      computing_tablets: 'CMP',
      wearables_fitness: 'WRB',
      apparel_techwear: 'APP',
      luxury_outerwear: 'OUT',
      accessories_bags: 'ACC',
    };
    const prefix = prefixes[category] || 'SKU';
    const rand = Math.floor(1000 + Math.random() * 9000);
    setSkuCode(`NX-${prefix}-${rand}`);
    setBarcode(`84370198${Math.floor(10000 + Math.random() * 90000)}`);
  };

  const sampleImages = [
    { label: 'Smartphone', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&auto=format&fit=crop&q=80' },
    { label: 'Auriculares', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80' },
    { label: 'Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80' },
    { label: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80' },
    { label: 'Parka Tech', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&auto=format&fit=crop&q=80' },
    { label: 'Mochila', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !skuCode.trim()) {
      alert('Please complete the product name and SKU code.');
      return;
    }

    const nonGlobalBranches = branches.filter(b => b.id !== 'branch-all');
    const branchStockPortion = Math.floor(totalStock / Math.max(1, nonGlobalBranches.length));

    const newSKU: ProductSKU = {
      id: `sku-${Date.now()}`,
      sku: skuCode,
      name: name.trim(),
      category: category,
      brand: brand.trim(),
      costPrice: costPrice,
      retailPrice: retailPrice,
      totalStock: totalStock,
      minStockAlert: minStockAlert,
      maxCapacity: totalStock * 4,
      barcode: barcode,
      supplier: supplier.trim(),
      branches: nonGlobalBranches.map(b => ({
        branchId: b.id,
        branchName: b.name,
        stock: branchStockPortion,
        reserved: 0
      })),
      status: totalStock <= 0 ? 'out_of_stock' : totalStock <= minStockAlert ? 'low_stock' : 'active',
      salesVelocityDaily: 5.0,
      rating: 5.0,
      returnsRatePct: 0.8,
      image: image,
      tags: ['New Launch', 'Active Catalog'],
      lastRestocked: new Date().toISOString().split('T')[0],
    };

    onCreateSKU(newSKU);
    onClose();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#0A0A0A] border border-[#262626] shadow-2xl p-5 space-y-3 max-h-[90vh] overflow-y-auto font-mono-data text-[#E2E2E2]">
        <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[#00FF41]" />
            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                Create Catalog SKU Record
              </h3>
              <p className="text-[9px] text-[#666]">
                EAN-13 generation & multi-node branch inventory allocation
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-[#666] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* SKU Code */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] uppercase text-[#888]">SKU Code</label>
                <button
                  type="button"
                  onClick={handleGenerateSKUCode}
                  className="text-[9px] text-[#00FF41] hover:underline uppercase"
                >
                  ⚡ Auto-gen
                </button>
              </div>
              <input
                type="text"
                required
                value={skuCode}
                onChange={(e) => setSkuCode(e.target.value.toUpperCase())}
                className="w-full px-2.5 py-1.5 bg-[#050505] border border-[#222] text-xs font-mono text-[#00FF41] font-bold focus:outline-none focus:border-[#00FF41] uppercase"
              />
            </div>

            {/* Barcode */}
            <div>
              <label className="block text-[10px] uppercase text-[#888] mb-1">Barcode EAN-13</label>
              <div className="relative">
                <Barcode className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#555]" />
                <input
                  type="text"
                  required
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-[#050505] border border-[#222] text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]"
                />
              </div>
            </div>

          </div>

          {/* Product Name */}
          <div>
            <label className="block text-[10px] uppercase text-[#888] mb-1">Product Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Stovue Titanium Earbuds Pro ANC"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#050505] border border-[#222] text-xs text-white focus:outline-none focus:border-[#00FF41]"
            />
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-[#888] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-2.5 py-1.5 bg-[#050505] border border-[#222] text-xs text-white focus:outline-none focus:border-[#00FF41]"
              >
                <option value="smartphones">Smartphones</option>
                <option value="audio_sound">Audio & Sound</option>
                <option value="computing_tablets">Computing & Laptops</option>
                <option value="wearables_fitness">Wearables & Fitness</option>
                <option value="apparel_techwear">Apparel & Techwear</option>
                <option value="luxury_outerwear">Luxury Outerwear</option>
                <option value="accessories_bags">Accessories & Bags</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#888] mb-1">Brand / Collection</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#050505] border border-[#222] text-xs text-white focus:outline-none focus:border-[#00FF41]"
              />
            </div>
          </div>

          {/* Pricing & Margins */}
          <div className="p-2.5 bg-[#050505] border border-[#222] space-y-2">
            <div className="text-[10px] text-[#00FF41] uppercase font-bold tracking-wider">
              Financial Margin Structure
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[9px] uppercase text-[#666] mb-1">Cost Price (€)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={costPrice}
                  onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 bg-[#0A0A0A] border border-[#333] text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase text-[#666] mb-1">PVP Retail (€)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 bg-[#0A0A0A] border border-[#333] text-xs font-mono text-white"
                />
              </div>

              <div className="p-1.5 bg-[#0A0A0A] border border-[#333] flex flex-col justify-center">
                <div className="text-[9px] uppercase text-[#666]">Gross Margin</div>
                <div className="text-xs font-bold font-mono text-[#00FF41]">
                  {grossMargin}% (+€{profitPerUnit.toFixed(2)})
                </div>
              </div>
            </div>
          </div>

          {/* Stock & Supplier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] uppercase text-[#888] mb-1">Initial Stock</label>
              <input
                type="number"
                min="0"
                required
                value={totalStock}
                onChange={(e) => setTotalStock(parseInt(e.target.value, 10) || 0)}
                className="w-full px-2 py-1 bg-[#050505] border border-[#222] text-xs font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#888] mb-1">Min Stock Alert</label>
              <input
                type="number"
                min="1"
                required
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(parseInt(e.target.value, 10) || 0)}
                className="w-full px-2 py-1 bg-[#050505] border border-[#222] text-xs font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#888] mb-1">Supplier</label>
              <input
                type="text"
                required
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-2 py-1 bg-[#050505] border border-[#222] text-xs text-white"
              />
            </div>
          </div>

          {/* Sample Images Quick Picker */}
          <div>
            <label className="block text-[10px] uppercase text-[#888] mb-1">Product Media Reference</label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {sampleImages.map((s, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setImage(s.url)}
                  className={`flex items-center gap-1.5 p-1 border text-[10px] transition shrink-0 ${
                    image === s.url ? 'bg-[#103319] border-[#00FF41] text-[#00FF41]' : 'bg-[#050505] border-[#222] text-[#666]'
                  }`}
                >
                  <img src={s.url} alt={s.label} className="h-5 w-5 object-cover" />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1A1A1A]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-[#16161A] hover:bg-[#222] text-[#888] text-[10px] uppercase"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-1 bg-white hover:bg-[#00FF41] text-black font-bold text-[10px] uppercase transition cursor-pointer"
            >
              Commit & Sync SKU
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
