export type LiveEventType = 
  | 'new_sale' 
  | 'sale' 
  | 'low_stock_alert' 
  | 'stock_alert' 
  | 'cart_abandoned' 
  | 'cart_recovered' 
  | 'stock_transfer' 
  | 'po_created' 
  | 'price_change';

export type EventSeverity = 'info' | 'success' | 'warning' | 'danger';

export interface LiveOrderEvent {
  id: string;
  timestamp: string;
  type: LiveEventType;
  title: string;
  description: string;
  value?: number;
  branchName: string;
  severity?: EventSeverity;
}

export interface PurchaseOrderItem {
  skuId: string;
  sku: string;
  name: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export type PurchaseOrderStatus = 'draft' | 'sent_supplier' | 'in_transit' | 'received';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  branchDestination: string;
  items: PurchaseOrderItem[];
  totalCost: number;
  status: PurchaseOrderStatus;
  createdAt: string;
  expectedDelivery: string;
  notes?: string;
}
