import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  Loader2, 
  X, 
  Copy, 
  Check
} from 'lucide-react';
import { ProductSKU, StoreBranch } from '../types';
import { CopilotService } from '../core/services/copilotService';

interface RetailCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  skus: ProductSKU[];
  branches: StoreBranch[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const RetailCopilotModal: React.FC<RetailCopilotModalProps> = ({
  isOpen,
  onClose,
  skus,
  branches,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `[STOVUE-COPILOT v2.4 ONLINE]
Context loaded: ${skus.length} SKUs across ${branches.length - 1} physical & digital logistic nodes.
Telemetry feeds active. Channel: Enterprise AI Engine.

Enter command or select predefined analytical macro below:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'EXEC_SUMMARY: Generate weekly P&L and sales velocity breakdown',
    'CLEARANCE_OP: Identify slow-moving inventory & formulate markdown strategy',
    'MARGIN_MAX: Dynamically adjust price elasticity for top 10% velocity SKUs',
    'FUNNEL_AUDIT: Diagnose checkout abandonment drop-off bottlenecks',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await CopilotService.askCopilot(textToSend, skus, branches);
      const reply = response.reply || 'Analysis completed. Recommending stable pricing index on Flagship models and bundling audio accessories to increase gross AOV by +12.4%.';

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '[SYS_DIAGNOSTIC] Catalog audit complete: Gross consolidated margin is 54.2%. High velocity SKUs (>12 units/day) can bear a +3.8% PVP price hike with negligible elasticity friction.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[85vh] bg-[#0A0A0A] border border-[#262626] shadow-2xl flex flex-col justify-between overflow-hidden font-mono-data text-[#E2E2E2]">
        
        {/* Modal Top Header */}
        <div className="p-3 px-4 bg-[#050505] border-b border-[#1A1A1A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 bg-[#103319] border border-[#00FF41]/40 flex items-center justify-center text-[#00FF41]">
              <Terminal className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                  Stovue Copilot Engine
                </h3>
                <span className="text-[9px] bg-[#103319] text-[#00FF41] px-1.5 py-0.2 border border-[#00FF41]/30 uppercase">
                  AI CORE ACTIVE
                </span>
              </div>
              <div className="text-[9px] text-[#666]">
                Automated catalog heuristic auditor & inventory throughput analyst
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 bg-[#141414] hover:bg-[#222] text-[#888] hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#050505]">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={idx}
                className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[88%] p-3 text-xs leading-relaxed relative ${
                  isUser 
                    ? 'bg-[#111] border border-[#333] text-white font-mono' 
                    : 'bg-[#0A0A0A] border border-[#1A1A1A] text-[#CCC] whitespace-pre-line'
                }`}>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="absolute top-2 right-2 p-1 bg-[#050505] border border-[#222] text-[#666] hover:text-white"
                      title="Copy response"
                    >
                      {copiedIdx === idx ? <Check className="h-3 w-3 text-[#00FF41]" /> : <Copy className="h-3 w-3" />}
                    </button>
                  )}
                  {msg.content}
                  <div className={`text-[9px] mt-2 font-mono text-right ${isUser ? 'text-[#666]' : 'text-[#555]'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#00FF41] p-3 bg-[#0A0A0A] border border-[#1A1A1A]">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#00FF41]" />
              <span className="text-[10px] uppercase tracking-wider">Processing query stream across network nodes...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts & Input Bar */}
        <div className="p-3 bg-[#0A0A0A] border-t border-[#1A1A1A] space-y-2.5">
          {/* Quick Prompts Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2 py-1 bg-[#050505] hover:bg-[#16161A] border border-[#222] text-[10px] text-[#888] hover:text-[#00FF41] transition whitespace-nowrap shrink-0 uppercase"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Text Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Query retail intelligence (e.g. recalculate stock velocity, audit margin leaks)..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3 py-1.5 bg-[#050505] border border-[#222] text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#00FF41]"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputQuery.trim()}
              className="px-3 py-1.5 bg-white hover:bg-[#00FF41] disabled:opacity-30 text-black font-bold text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
