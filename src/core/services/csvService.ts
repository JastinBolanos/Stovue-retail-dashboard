import { ProductSKU, CategoryType } from '../domain/models/sku';
import { StoreBranch } from '../domain/models/branch';

export class CSVService {
  /**
   * Generates formatted CSV string from SKU list
   */
  static exportSKUsToCSV(skus: ProductSKU[]): string {
    const headers = ['SKU_CODE', 'NAME', 'CATEGORY', 'BRAND', 'COST_PRICE', 'RETAIL_PRICE', 'TOTAL_STOCK', 'MIN_ALERT', 'BARCODE'];
    const rows = skus.map(s => [
      s.sku,
      `"${s.name.replace(/"/g, '""')}"`,
      s.category,
      `"${s.brand.replace(/"/g, '""')}"`,
      s.costPrice,
      s.retailPrice,
      s.totalStock,
      s.minStockAlert,
      s.barcode
    ]);

    return 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  }

  /**
   * Parses CSV string text into new ProductSKU items
   */
  static parseSKUsCSV(text: string, defaultBranches: StoreBranch[]): ProductSKU[] {
    const lines = text.trim().split('\n');
    const imported: ProductSKU[] = [];

    lines.forEach((line, i) => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const skuCode = parts[0] || `SV-SKU-${Date.now() + i}`;
        const name = parts[1] || 'Producto Importado';
        const category = (parts[2] as CategoryType) || 'smartphones';
        const brand = parts[3] || 'Stovue Brand';
        const cost = parseFloat(parts[4]) || 50;
        const price = parseFloat(parts[5]) || 120;
        const stock = parseInt(parts[6], 10) || 25;

        imported.push({
          id: `sku-import-${Date.now()}-${i}`,
          sku: skuCode,
          name,
          category,
          brand,
          costPrice: cost,
          retailPrice: price,
          totalStock: stock,
          minStockAlert: 15,
          maxCapacity: 200,
          barcode: `${Math.floor(8400000000000 + Math.random() * 999999999)}`,
          supplier: 'Global Logistics Import',
          branches: defaultBranches.filter(b => b.id !== 'branch-all').map(b => ({
            branchId: b.id,
            branchName: b.name,
            stock: Math.floor(stock / 4),
            reserved: 0
          })),
          status: stock <= 0 ? 'out_of_stock' : stock <= 15 ? 'low_stock' : 'active',
          salesVelocityDaily: 2.5,
          rating: 4.8,
          returnsRatePct: 1.2,
          image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60',
          tags: ['imported', 'csv_batch'],
          lastRestocked: new Date().toISOString().split('T')[0]
        });
      }
    });

    return imported;
  }
}
