export type CategoryType = 
  | 'smartphones'
  | 'audio_sound'
  | 'computing_tablets'
  | 'wearables_fitness'
  | 'apparel_techwear'
  | 'luxury_outerwear'
  | 'accessories_bags';

export type SKUStatus = 'active' | 'low_stock' | 'out_of_stock' | 'discontinued' | 'in_transit';

export interface BranchInventory {
  branchId: string;
  branchName: string;
  stock: number;
  reserved: number;
}

export interface ProductSKU {
  id: string;
  sku: string;
  name: string;
  category: CategoryType;
  brand: string;
  costPrice: number;
  retailPrice: number;
  compareAtPrice?: number;
  totalStock: number;
  minStockAlert: number;
  maxCapacity: number;
  barcode: string;
  supplier: string;
  branches: BranchInventory[];
  status: SKUStatus;
  salesVelocityDaily: number; // units sold per day
  rating: number;
  returnsRatePct: number;
  image: string;
  tags: string[];
  lastRestocked: string;
}

export interface SKUFilterCriteria {
  searchTerm: string;
  category: string;
  status: string;
  sortBy: 'name' | 'retailPrice' | 'totalStock' | 'salesVelocityDaily' | 'margin';
  sortOrder: 'asc' | 'desc';
}
