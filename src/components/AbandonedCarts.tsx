import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  Percent, 
  DollarSign, 
  Zap, 
  Loader2, 
  Copy, 
  Check,
  X
} from 'lucide-react';
import { AbandonedCart } from '../types';
import { CopilotService } from '../core/services/copilotService';
import confetti from 'canvas-confetti';

interface AbandonedCartsProps {
  carts: AbandonedCart[];
  onUpdateCart: (cart: AbandonedCart) => void;
  onSimulateRecovery: (cartId: string) => void;
}

export const AbandonedCarts: React.FC<AbandonedCartsProps> = ({
  carts,
  onUpdateCart,
  onSimulateRecovery
}) => {
  const [selectedCartForAI, setSelectedCartForAI] = useState<AbandonedCart | null>(null);
  const [generatedCampaign, setGeneratedCampaign] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState('RECOVER-15X');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Statistics
  const totalRetainedValue = carts.reduce((acc, c) => acc + (c.recoveryStatus !== 'recovered' ? c.totalValue : 0), 0);
  const activePendingCarts = carts.filter(c => c.recoveryStatus === 'pending' || c.recoveryStatus === 'email_sent');

  // Generate AI Recovery Email & SMS
  const handleGenerateAICampaign = async (cart: AbandonedCart) => {
    setSelectedCartForAI(cart);
    setIsLoadingAI(true);
    setGeneratedCampaign(null);

    try {
      const result = await CopilotService.generateCartRecoveryCampaign(cart, discountCode);
      setGeneratedCampaign(result.emailCampaign);
    } catch (err) {
      console.error('Failed to generate recovery campaign:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Send Recovery Email
  const handleSendEmail = (cart: AbandonedCart) => {
    onUpdateCart({
      ...cart,
      recoveryStatus: 'email_sent',
      discountCode: discountCode,
      lastActionDate: new Date().toISOString()
    });

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    if (selectedCartForAI?.id === cart.id) {
      setSelectedCartForAI(null);
    }
  };

  // Simulate Recovery
  const handleRecoverCart = (cartId: string) => {
    onSimulateRecovery(cartId);
    confetti({ 
      particleCount: 90, 
      spread: 80, 
      origin: { y: 0.5 },
      colors: ['#00FF41', '#FFAA00', '#00F0FF']
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-4 pb-8 font-mono-data text-[#E2E2E2]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A1A1A]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight uppercase">
              Abandoned Cart Intelligence & AI Recovery
            </h1>
            <span className="text-[10px] px-2 py-0.5 bg-[#332211] text-[#FFAA00] border border-[#FFAA00]/40 uppercase">
              {activePendingCarts.length} At-Risk Sessions
            </span>
          </div>
          <p className="text-[10px] text-[#666] mt-0.5">
            Checkout bottleneck analytics, programmatic AI email dispatches & automated incentive engines
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#0F0F11] border border-[#1F1F23] text-right">
            <div className="text-[9px] uppercase text-[#666]">Retained Cart Value</div>
            <div className="text-base font-bold font-mono text-[#FF4444]">
              €{totalRetainedValue.toLocaleString('es-ES')}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase text-[#666]">Abandonment Rate</div>
            <div className="text-xl font-bold font-mono text-[#FFAA00] mt-0.5">68.2%</div>
            <div className="text-[9px] text-[#666] mt-0.5">Benchmark avg: 70.1%</div>
          </div>
          <div className="p-2 bg-[#050505] text-[#FFAA00] border border-[#332211]">
            <Percent className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3 bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase text-[#666]">AI Recovery Rate</div>
            <div className="text-xl font-bold font-mono text-[#00FF41] mt-0.5">34.8%</div>
            <div className="text-[9px] text-[#00FF41] mt-0.5">+4.2% vs last cycle</div>
          </div>
          <div className="p-2 bg-[#050505] text-[#00FF41] border border-[#103319]">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3 bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase text-[#666]">Rescued Revenue (MTD)</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">€184,200</div>
            <div className="text-[9px] text-[#888] mt-0.5">84 sessions salvaged</div>
          </div>
          <div className="p-2 bg-[#050505] text-white border border-[#222]">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShoppingCart className="h-3.5 w-3.5 text-[#00FF41]" />
            Live Unfinished Checkout Pipeline
          </h3>
          <span className="text-[10px] text-[#666]">
            SORTED BY RETAINED VALUE
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {carts.map((cart) => {
            const isRecovered = cart.recoveryStatus === 'recovered';
            const isEmailSent = cart.recoveryStatus === 'email_sent';

            return (
              <div 
                key={cart.id}
                className={`p-3.5 border transition-all ${
                  isRecovered ? 'bg-[#103319]/10 border-[#00FF41]/40' :
                  isEmailSent ? 'bg-[#0F0F11] border-[#333]' :
                  'bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#333]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  
                  {/* Customer Info & Abandonment details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">
                        {cart.customerName}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
                        cart.recoveryProbability === 'high' ? 'bg-[#103319] text-[#00FF41] border border-[#00FF41]/40' :
                        cart.recoveryProbability === 'medium' ? 'bg-[#332211] text-[#FFAA00] border border-[#FFAA00]/40' :
                        'bg-[#16161A] text-[#666]'
                      }`}>
                        PROB: {cart.recoveryProbability.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-[10px] text-[#888] flex items-center gap-2">
                      <span>{cart.customerEmail}</span>
                      <span>•</span>
                      <span>{cart.customerPhone}</span>
                    </div>

                    <div className="text-[9px] text-[#666] flex items-center gap-2 pt-0.5">
                      <Clock className="h-3 w-3 text-[#666]" />
                      <span>Abandoned {cart.abandonedTimeAgo}</span>
                      <span>•</span>
                      <span className="text-[#FF4444]">
                        Exit Point: {
                          cart.stepAbandoned === 'payment_method' ? 'Payment Gateway' :
                          cart.stepAbandoned === 'shipping_address' ? 'Address Verification' :
                          cart.stepAbandoned === 'card_verification' ? '3D Secure Friction' : 'Cart Review'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Items in Cart Thumbnails */}
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {cart.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-1 bg-[#050505] border border-[#222] text-[10px] shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-7 w-7 object-cover border border-[#333]"
                        />
                        <div>
                          <div className="font-bold text-white max-w-[120px] truncate text-[10px]">
                            {item.name}
                          </div>
                          <div className="text-[9px] text-[#00FF41]">
                            {item.quantity}x €{item.unitPrice}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Total & Action Buttons */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 border-t lg:border-t-0 pt-2 lg:pt-0 border-[#1A1A1A]">
                    <div className="text-left lg:text-right">
                      <div className="text-[9px] text-[#666] uppercase">Cart Value</div>
                      <div className="text-sm font-bold font-mono text-white">
                        €{cart.totalValue.toLocaleString('es-ES')}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isRecovered ? (
                        <div className="px-2.5 py-1 bg-[#103319] text-[#00FF41] border border-[#00FF41]/40 text-[10px] font-bold flex items-center gap-1 uppercase">
                          <CheckCircle2 className="h-3 w-3" /> Converted
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleGenerateAICampaign(cart)}
                            className="px-2.5 py-1 bg-[#0F0F11] hover:bg-[#16161A] text-white border border-[#333] hover:border-[#00FF41] font-bold text-[10px] flex items-center gap-1 uppercase transition cursor-pointer"
                            title="Generate personalized AI recovery copy"
                          >
                            <Sparkles className="h-3 w-3 text-[#00FF41]" />
                            AI Copy
                          </button>

                          <button
                            onClick={() => handleRecoverCart(cart.id)}
                            className="px-2.5 py-1 bg-white hover:bg-[#00FF41] text-black font-bold text-[10px] flex items-center gap-1 uppercase transition cursor-pointer"
                            title="Simulate successful checkout completion"
                          >
                            <Zap className="h-3 w-3" />
                            Rescue
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Email & SMS Campaign Modal */}
      {selectedCartForAI && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0A0A0A] border border-[#262626] p-5 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#00FF41]" />
                <div>
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                    AI Cart Recovery Dispatch Engine
                  </h3>
                  <div className="text-[9px] text-[#666]">
                    Recipient: {selectedCartForAI.customerName} ({selectedCartForAI.customerEmail})
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCartForAI(null)}
                className="text-[#666] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Campaign Config Bar */}
            <div className="flex items-center gap-2 p-2 bg-[#050505] border border-[#222] text-[10px]">
              <span className="text-[#888] uppercase">Incentive Code:</span>
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                className="px-2 py-0.5 bg-[#0A0A0A] border border-[#333] text-[#00FF41] font-mono font-bold focus:outline-none focus:border-[#00FF41] uppercase"
              />
              <button
                onClick={() => handleGenerateAICampaign(selectedCartForAI)}
                disabled={isLoadingAI}
                className="ml-auto px-2 py-0.5 bg-[#0F0F11] hover:bg-[#16161A] text-[#CCC] border border-[#333] flex items-center gap-1 uppercase text-[9px]"
              >
                {isLoadingAI ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Sparkles className="h-2.5 w-2.5 text-[#00FF41]" />}
                Regenerate
              </button>
            </div>

            {/* Generated Campaign Content */}
            <div className="p-3 bg-[#050505] border border-[#222] text-[11px] text-[#E2E2E2] relative min-h-[140px] font-mono leading-relaxed">
              {isLoadingAI ? (
                <div className="flex flex-col items-center justify-center py-10 text-[#666] gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-[#00FF41]" />
                  <span className="text-[10px]">Synthesizing persuasion matrix...</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => copyToClipboard(generatedCampaign || '')}
                    className="absolute top-2 right-2 p-1 bg-[#0A0A0A] hover:bg-[#16161A] text-[#888] hover:text-white border border-[#333]"
                    title="Copy text"
                  >
                    {copiedText ? <Check className="h-3 w-3 text-[#00FF41]" /> : <Copy className="h-3 w-3" />}
                  </button>
                  <div className="whitespace-pre-line pr-6">
                    {generatedCampaign}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[9px] text-[#00FF41] flex items-center gap-1 uppercase">
                <CheckCircle2 className="h-3 w-3" />
                Pixel & Open telemetry enabled
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCartForAI(null)}
                  className="px-2.5 py-1 bg-[#16161A] text-[#888] text-[10px] uppercase"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleSendEmail(selectedCartForAI)}
                  className="px-3.5 py-1 bg-white hover:bg-[#00FF41] text-black font-bold text-[10px] uppercase flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="h-3 w-3" />
                  Dispatch Campaign
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
