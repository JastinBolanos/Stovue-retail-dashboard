import { AbandonedCart, CartItem } from '../domain/models/cart';

export interface CartMetrics {
  totalLostRevenue: number;
  recoverableRevenue: number;
  pendingCount: number;
  recoveredCount: number;
  avgDropoutValue: number;
  recoveryRatePct: number;
}

export class CartRecoveryService {
  /**
   * Computes aggregate metrics from abandoned cart list
   */
  static getMetrics(carts: AbandonedCart[]): CartMetrics {
    const totalLostRevenue = carts.reduce((acc, c) => acc + c.totalValue, 0);
    const pendingCarts = carts.filter(c => c.recoveryStatus === 'pending');
    const recoveredCarts = carts.filter(c => c.recoveryStatus === 'recovered');

    const recoverableRevenue = pendingCarts.reduce((acc, c) => acc + c.totalValue, 0);
    const avgDropoutValue = carts.length > 0 ? Math.round(totalLostRevenue / carts.length) : 0;
    const recoveryRatePct = carts.length > 0 ? Math.round((recoveredCarts.length / carts.length) * 100) : 0;

    return {
      totalLostRevenue,
      recoverableRevenue,
      pendingCount: pendingCarts.length,
      recoveredCount: recoveredCarts.length,
      avgDropoutValue,
      recoveryRatePct
    };
  }

  /**
   * Generates a realistic unique recovery coupon code
   */
  static generateDiscountCode(customerName: string): string {
    const prefix = customerName.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '') || 'VIP';
    const num = Math.floor(10 + Math.random() * 90);
    return `${prefix}-RECOVER${num}`;
  }

  /**
   * Fallback email campaign template builder
   */
  static buildFallbackCampaign(cart: AbandonedCart, discountCode: string): string {
    const itemsList = cart.items.map(i => `• ${i.name} (${i.quantity}x) - €${i.unitPrice}`).join('\n');

    return `ASUNTO: ${cart.customerName}, tus artículos seleccionados en Stovue están reservados ✨

Hola ${cart.customerName},

Hemos detectado que dejaste artículos pendientes en tu carrito de Stovue. Tu inventario está reservado por las próximas 24 horas.

Aplica el cupón exclusivo de recuperación: ${discountCode} para obtener un 15% de DESCUENTO y despacho prioritario.

Artículos Reservados:
${itemsList}

Total con Descuento: €${Math.round(cart.totalValue * 0.85)}

[COMPLETAR MI PEDIDO AHORA]

Canal Alternativo (SMS):
"Stovue: ${cart.customerName}, tu carrito (€${cart.totalValue}) está reservado. Usa '${discountCode}' para 15% OFF hoy. Finaliza aquí: stovue.sh/pay"`;
  }
}
