export type BranchType = 'flagship' | 'hub_central' | 'mall_store' | 'outlet' | 'ecommerce_digital';

export interface StoreBranch {
  id: string;
  name: string;
  code: string;
  type: BranchType;
  city: string;
  country: string;
  address: string;
  manager: string;
  activeStaff: number;
  revenueToday: number;
  ordersToday: number;
  inventoryCapacity: number;
  inventoryUsed: number;
}
