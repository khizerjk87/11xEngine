
import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, DollarSign, BrainCircuit, Plus, Mic, Globe, Image as ImageIcon, Zap, Sparkles, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, ModelResponse, Multiplex, UserSettings } from '../types';
import { ALL_VARIANTS, MODEL_PROVIDERS } from '../constants';
import { OpenRouterService } from '../services/openRouterService';
import MarkdownRenderer from './MarkdownRenderer';
import { ModelController } from './ModelDock';

interface ChatInterfaceProps {
  settings: UserSettings;
  currentMultiplex: Multiplex | null;
  onSaveMultiplex: (multiplex: Multiplex) => void;
  isStreaming: boolean;
  setIsStreaming: (is: boolean) => void;
  onToggleProvider: (key: string) => void;
  onUpdateVariant: (key: string, id: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  settings,
  currentMultiplex,
  onSaveMultiplex,
  isStreaming,
  setIsStreaming,
  onToggleProvider,
  onUpdateVariant
}) => {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState<Record<string, ModelResponse>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentMultiplex) {
      const initialResponses: Record<string, ModelResponse> = {};
      (Object.entries(currentMultiplex.responses) as [string, string][]).forEach(([modelId, content]) => {
        const variantDef = ALL_VARIANTS.find(v => v.id === modelId);
        initialResponses[modelId] = {
          modelId,
          content,
          isStreaming: false,
          tokensUsed: content.length / 4,
          estimatedCost: (content.length / 4000) * (variantDef?.costPerToken || 0)
        };
      });
      setResponses(initialResponses);
    } else {
      setResponses({});
    }
  }, [currentMultiplex]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isStreaming || settings.activeModelIds.length === 0) return;

    const currentPrompt = prompt;
    setPrompt('');
    setIsStreaming(true);

    const initialResponses: Record<string, ModelResponse> = {};
    settings.activeModelIds.forEach((id) => {
      initialResponses[id] = {
        modelId: id,
        content: '',
        isStreaming: true,
        tokensUsed: 0,
        estimatedCost: 0
      };
    });
    setResponses(initialResponses);

    const messages: ChatMessage[] = [{ role: 'user', content: currentPrompt }];
    const finalResponsesMap: Record<string, string> = {};

    const streamPromises = settings.activeModelIds.map((modelId) => {
      return new Promise<void>((resolve) => {
        OpenRouterService.streamChat(
          modelId,
          messages,
          (chunk) => {
            setResponses((prev) => {
              const prevResp = prev[modelId];
              if (!prevResp) return prev;
              const newContent = prevResp.content + chunk;
              const variantDef = ALL_VARIANTS.find(v => v.id === modelId);
              const tokens = newContent.length / 4;
              return {
                ...prev,
                [modelId]: {
                  ...prevResp,
                  content: newContent,
                  tokensUsed: tokens,
                  estimatedCost: tokens * (variantDef?.costPerToken || 0)
                }
              };
            });
          },
          (fullContent) => {
            finalResponsesMap[modelId] = fullContent;
            setResponses((prev) => ({
              ...prev,
              [modelId]: { ...prev[modelId], isStreaming: false }
            }));
            resolve();
          },
          (err) => {
            finalResponsesMap[modelId] = `ERROR: ${err.message}`;
            setResponses((prev) => ({
              ...prev,
              [modelId]: { ...prev[modelId], content: `ERROR: ${err.message}`, isStreaming: false }
            }));
            resolve();
          }
        );
      });
    });

    await Promise.all(streamPromises);
    setIsStreaming(false);

    onSaveMultiplex({
      id: Date.now().toString(),
      title: currentPrompt.slice(0, 40) + (currentPrompt.length > 40 ? '...' : ''),
      prompt: currentPrompt,
      timestamp: Date.now(),
      responses: finalResponsesMap
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      {/* Model Lanes Container */}
      <div className="flex-1 flex h-full overflow-x-auto no-scrollbar">
        {MODEL_PROVIDERS.map((provider) => {
          const selectedVariantId = settings.providerVariants[provider.key];
          const isActive = settings.activeModelIds.includes(selectedVariantId);
          const response = responses[selectedVariantId];
          const variantDef = provider.variants.find(v => v.id === selectedVariantId);

          return (
            <motion.div
              key={provider.key}
              layout
              initial={false}
              animate={{ 
                width: isActive ? '520px' : '260px',
                flexShrink: isActive ? 0 : 0
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className={`h-full flex flex-col border-r border-white/5 relative group ${isActive ? 'bg-transparent' : 'bg-black/10'}`}
            >
              {/* Lane Header */}
              <div className="p-3 bg-[#0a0a0c] z-20 flex items-center justify-center border-b border-white/5">
                <ModelController
                  provider={provider}
                  selectedVariantId={selectedVariantId}
                  isActive={isActive}
                  onToggle={() => onToggleProvider(provider.key)}
                  onSelectVariant={(id) => onUpdateVariant(provider.key, id)}
                  isStreaming={isStreaming}
                />
              </div>

              {/* Lane Content */}
              <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scroll relative">
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.div
                      key="active-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full"
                    >
                      {response?.content ? (
                        <MarkdownRenderer content={response.content} />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-[0.03]">
                          <BrainCircuit className="w-24 h-24 mb-6" />
                          <p className="text-sm font-mono uppercase tracking-[0.5em]">Awaiting Packets</p>
                        </div>
                      )}
                      
                      {/* Cost Overlay */}
                      <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur border border-white/10 rounded-full text-[10px] font-mono text-zinc-400">
                        <DollarSign className="w-3 h-3 text-green-500" />
                        {response?.estimatedCost.toFixed(6) || '0.000000'}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="collapsed-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center pt-20"
                    >
                      <div className="bg-white/[0.03] border border-white/5 rounded-full px-6 py-2.5 flex items-center gap-3 shadow-2xl">
                        <Lock className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Upgrade to unlock</span>
                      </div>
                      
                      <div className="mt-auto mb-10 opacity-[0.05] pointer-events-none">
                        <span className="rotate-180 text-[10px] font-mono text-zinc-800 uppercase tracking-[1em] whitespace-nowrap [writing-mode:vertical-lr]">
                          INACTIVE NODE // {provider.name}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Command Center */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 pointer-events-none z-50">
        <div className="flex flex-col items-center gap-4 pointer-events-auto">
          {/* Top Pill Buttons (Renamed) */}
          <div className="flex gap-2.5">
            <button className="flex items-center gap-2 px-5 py-2 bg-[#27272a]/80 backdrop-blur hover:bg-[#3f3f46] text-white/90 text-[11px] font-bold rounded-full border border-white/10 shadow-xl transition-all group">
              <Zap className="w-3 h-3 text-purple-400 group-hover:animate-pulse" />
              Multiplex
            </button>
            <button className="flex items-center gap-2 px-5 py-2 bg-[#27272a]/80 backdrop-blur hover:bg-[#3f3f46] text-white/90 text-[11px] font-bold rounded-full border border-white/10 shadow-xl transition-all group">
              <Sparkles className="w-3 h-3 text-emerald-400 group-hover:scale-125 transition-transform" />
              Deep Logic
            </button>
          </div>

          {/* Main Input Bar */}
          <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-[28px] blur-2xl opacity-0 group-focus-within:opacity-100 transition duration-700"></div>
            <div className="relative flex items-center bg-[#121214]/95 backdrop-blur-xl border border-white/10 rounded-[24px] px-6 py-3.5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
              <button className="text-zinc-500 hover:text-white transition-colors mr-4">
                <Plus className="w-5 h-5" />
              </button>
              <input
                ref={inputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Initialize inference..."
                className="flex-1 bg-transparent text-white text-[15px] focus:outline-none placeholder:text-zinc-700 font-medium"
              />
              <div className="flex items-center gap-4">
                {isStreaming ? (
                  <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                ) : (
                  <button onClick={() => handleSubmit()} className="text-zinc-500 hover:text-white transition-colors p-1">
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Pill Buttons (Renamed) */}
          <div className="flex gap-2.5">
            <button className="flex items-center gap-2 px-5 py-2 bg-[#18181b]/60 backdrop-blur hover:bg-[#27272a] text-zinc-400 hover:text-zinc-200 text-[11px] font-bold rounded-full border border-white/5 shadow-lg transition-all">
              <Globe className="w-3.5 h-3.5" />
              Live Search
            </button>
            <button className="flex items-center gap-2 px-5 py-2 bg-[#18181b]/60 backdrop-blur hover:bg-[#27272a] text-zinc-400 hover:text-zinc-200 text-[11px] font-bold rounded-full border border-white/5 shadow-lg transition-all">
              <ImageIcon className="w-3.5 h-3.5" />
              Visual Synthesis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
