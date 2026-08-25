import { CategoryType } from './sku';

export interface CartItem {
  skuId: string;
  skuCode: string;
  name: string;
  category: CategoryType;
  quantity: number;
  unitPrice: number;
  image: string;
}

export type CheckoutStep = 'cart_view' | 'shipping_address' | 'payment_method' | 'card_verification';
export type RecoveryStatus = 'pending' | 'recovered' | 'lost' | 'email_sent';
export type RecoveryProbability = 'high' | 'medium' | 'low';

export interface AbandonedCart {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  totalValue: number;
  abandonedAt: string; // ISO string
  abandonedTimeAgo: string;
  stepAbandoned: CheckoutStep;
  recoveryStatus: RecoveryStatus;
  recoveryProbability: RecoveryProbability;
  discountCode?: string;
  lastActionDate?: string;
}

export interface CartRecoveryCampaign {
  cartId: string;
  customerName: string;
  discountCode: string;
  emailContent: string;
  smsContent?: string;
}
