import { ProductSKU } from '../domain/models/sku';
import { PurchaseOrder, PurchaseOrderItem } from '../domain/models/order';

export interface InventoryHealthReport {
  overallHealthScore: number; // 0 - 100
  criticalStockCount: number;
  outOfStockCount: number;
  healthyStockCount: number;
  totalUnitsInStock: number;
  totalValuationCost: number;
  totalValuationRetail: number;
  avgRunwayDays: number;
}

export class InventoryService {
  /**
   * Calculates runway days remaining for a SKU based on current stock and daily velocity
   */
  static calculateRunwayDays(totalStock: number, velocityDaily: number): number {
    if (velocityDaily <= 0) return 999;
    return Math.max(0, Math.round(totalStock / velocityDaily));
  }

  /**
   * Identifies SKUs needing urgent reordering
   */
  static getCriticalSKUs(skus: ProductSKU[]): ProductSKU[] {
    return skus.filter(s => s.totalStock <= s.minStockAlert || s.status === 'out_of_stock');
  }

  /**
   * Generates a comprehensive health report
   */
  static getInventoryReport(skus: ProductSKU[]): InventoryHealthReport {
    let critical = 0;
    let outOfStock = 0;
    let healthy = 0;
    let totalUnits = 0;
    let valuationCost = 0;
    let valuationRetail = 0;
    let totalRunway = 0;

    skus.forEach(s => {
      totalUnits += s.totalStock;
      valuationCost += s.costPrice * s.totalStock;
      valuationRetail += s.retailPrice * s.totalStock;
      const runway = this.calculateRunwayDays(s.totalStock, s.salesVelocityDaily);
      totalRunway += runway < 999 ? runway : 60;

      if (s.totalStock === 0) {
        outOfStock++;
      } else if (s.totalStock <= s.minStockAlert) {
        critical++;
      } else {
        healthy++;
      }
    });

    const total = skus.length || 1;
    const healthScore = Math.max(0, Math.min(100, Math.round(((healthy * 1.0 + critical * 0.4) / total) * 100)));

    return {
      overallHealthScore: healthScore,
      criticalStockCount: critical,
      outOfStockCount: outOfStock,
      healthyStockCount: healthy,
      totalUnitsInStock: totalUnits,
      totalValuationCost: valuationCost,
      totalValuationRetail: valuationRetail,
      avgRunwayDays: Math.round(totalRunway / total)
    };
  }

  /**
   * Handles stock increments when receiving a Purchase Order
   */
  static applyPurchaseOrderReceipt(skus: ProductSKU[], po: PurchaseOrder): ProductSKU[] {
    const updated = [...skus];
    po.items.forEach(item => {
      const targetIndex = updated.findIndex(s => s.id === item.skuId);
      if (targetIndex !== -1) {
        const s = updated[targetIndex];
        const newTotal = s.totalStock + item.quantity;
        updated[targetIndex] = {
          ...s,
          totalStock: newTotal,
          status: newTotal <= s.minStockAlert ? 'low_stock' : 'active',
          lastRestocked: new Date().toISOString().split('T')[0]
        };
      }
    });
    return updated;
  }
}
