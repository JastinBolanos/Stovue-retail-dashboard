import { ProductSKU } from '../domain/models/sku';
import { StoreBranch } from '../domain/models/branch';
import { LiveOrderEvent } from '../domain/models/order';
import { AbandonedCart } from '../domain/models/cart';
import { formatTimestamp } from '../utils/formatters';

export interface TelemetryTickResult {
  newEvent: LiveOrderEvent;
  updatedBranches: StoreBranch[];
  updatedSKUs: ProductSKU[];
}

export class TelemetryService {
  /**
   * Generates a random simulated sale from active SKUs across active physical/digital branches
   */
  static simulateSale(
    skus: ProductSKU[], 
    branches: StoreBranch[], 
    channel: 'pos' | 'online' = 'pos'
  ): TelemetryTickResult | null {
    if (!skus.length || !branches.length) return null;

    const activeSKUs = skus.filter(s => s.totalStock > 0);
    const pool = activeSKUs.length > 0 ? activeSKUs : skus;
    const randomSKU = pool[Math.floor(Math.random() * pool.length)];

    const eligibleBranches = branches.filter(b => b.id !== 'branch-all');
    const randomBranch = eligibleBranches.length > 0 
      ? eligibleBranches[Math.floor(Math.random() * eligibleBranches.length)]
      : branches[0];

    const quantity = Math.floor(1 + Math.random() * 2);
    const totalAmount = randomSKU.retailPrice * quantity;

    const channelDesc = channel === 'pos'
      ? `Canal: POS Tienda Física • Método: Apple Pay / Tarjeta • Terminal #${Math.floor(1000 + Math.random() * 9000)}`
      : `Canal: E-Commerce Web • Pasarela Stripe / 3D-Secure`;

    const newEvent: LiveOrderEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'sale',
      title: `Venta Omnicanal: ${quantity}x ${randomSKU.name}`,
      description: channelDesc,
      timestamp: formatTimestamp(),
      branchName: randomBranch.name,
      value: totalAmount,
      severity: 'success'
    };

    // Update branches
    const updatedBranches = branches.map(b => {
      if (b.id === randomBranch.id || b.id === 'branch-all') {
        return {
          ...b,
          revenueToday: b.revenueToday + totalAmount,
          ordersToday: b.ordersToday + 1
        };
      }
      return b;
    });

    // Update SKUs
    const updatedSKUs = skus.map(s => {
      if (s.id === randomSKU.id && s.totalStock > 0) {
        const newStock = Math.max(0, s.totalStock - quantity);
        return {
          ...s,
          totalStock: newStock,
          status: (newStock === 0 ? 'out_of_stock' : newStock <= s.minStockAlert ? 'low_stock' : 'active') as any
        };
      }
      return s;
    });

    return {
      newEvent,
      updatedBranches,
      updatedSKUs
    };
  }

  /**
   * Generates a cart recovery event
   */
  static createCartRecoveredEvent(cart: AbandonedCart): LiveOrderEvent {
    return {
      id: `evt-rec-${Date.now()}`,
      type: 'cart_recovered',
      title: `⚡ Carrito Rescatado con IA: ${cart.customerName}`,
      description: `Pedido cerrado mediante campaña promocional (${cart.discountCode || 'RECOVER-15X'})`,
      timestamp: formatTimestamp(),
      branchName: 'E-Commerce Online',
      value: cart.totalValue,
      severity: 'success'
    };
  }
}
