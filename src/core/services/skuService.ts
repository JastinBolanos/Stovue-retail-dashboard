import { ProductSKU, SKUStatus, CategoryType, SKUFilterCriteria } from '../domain/models/sku';

export class SKUService {
  /**
   * Calculates gross profit margin as percentage
   */
  static calculateMargin(retailPrice: number, costPrice: number): number {
    if (retailPrice <= 0) return 0;
    return Math.round(((retailPrice - costPrice) / retailPrice) * 100 * 10) / 10;
  }

  /**
   * Calculates absolute profit per unit
   */
  static calculateUnitProfit(retailPrice: number, costPrice: number): number {
    return Math.max(0, retailPrice - costPrice);
  }

  /**
   * Determines status of SKU based on current stock and threshold
   */
  static determineStockStatus(totalStock: number, minStockAlert: number, currentStatus?: SKUStatus): SKUStatus {
    if (currentStatus === 'discontinued') return 'discontinued';
    if (currentStatus === 'in_transit') return 'in_transit';
    if (totalStock <= 0) return 'out_of_stock';
    if (totalStock <= minStockAlert) return 'low_stock';
    return 'active';
  }

  /**
   * Bulk price modification by percentage with minimum safety guard
   */
  static applyBulkPriceChange(skus: ProductSKU[], targetIds: string[], percentageChange: number): ProductSKU[] {
    const factor = 1 + (percentageChange / 100);
    return skus.map(s => {
      if (targetIds.includes(s.id)) {
        const newPrice = Math.round(s.retailPrice * factor);
        return {
          ...s,
          retailPrice: Math.max(s.costPrice + 1, newPrice)
        };
      }
      return s;
    });
  }

  /**
   * Bulk status update
   */
  static applyBulkStatusChange(skus: ProductSKU[], targetIds: string[], status: SKUStatus): ProductSKU[] {
    return skus.map(s => {
      if (targetIds.includes(s.id)) {
        return { ...s, status };
      }
      return s;
    });
  }

  /**
   * Filters and sorts SKU collection based on user criteria
   */
  static filterAndSortSKUs(skus: ProductSKU[], criteria: SKUFilterCriteria): ProductSKU[] {
    let result = [...skus];

    // Text search (SKU code, name, brand, barcode)
    if (criteria.searchTerm.trim()) {
      const term = criteria.searchTerm.toLowerCase().trim();
      result = result.filter(s => 
        s.sku.toLowerCase().includes(term) ||
        s.name.toLowerCase().includes(term) ||
        s.brand.toLowerCase().includes(term) ||
        s.barcode.toLowerCase().includes(term) ||
        s.tags.some(t => t.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (criteria.category && criteria.category !== 'all') {
      result = result.filter(s => s.category === criteria.category);
    }

    // Status filter
    if (criteria.status && criteria.status !== 'all') {
      result = result.filter(s => s.status === criteria.status);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (criteria.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'retailPrice':
          comparison = a.retailPrice - b.retailPrice;
          break;
        case 'totalStock':
          comparison = a.totalStock - b.totalStock;
          break;
        case 'salesVelocityDaily':
          comparison = a.salesVelocityDaily - b.salesVelocityDaily;
          break;
        case 'margin': {
          const marginA = this.calculateMargin(a.retailPrice, a.costPrice);
          const marginB = this.calculateMargin(b.retailPrice, b.costPrice);
          comparison = marginA - marginB;
          break;
        }
      }
      return criteria.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }
}
