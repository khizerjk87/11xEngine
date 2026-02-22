
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ExternalLink, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserSettings, ModelProvider } from '../types';
import { MODEL_PROVIDERS } from '../constants';

const ToggleSwitch = ({ active, onToggle, disabled }: { active: boolean, onToggle: () => void, disabled: boolean }) => (
  <button 
    onClick={onToggle}
    disabled={disabled}
    className={`relative w-[38px] h-[20px] rounded-full transition-colors duration-200 outline-none flex items-center shrink-0 ${active ? 'bg-[#10a37f]' : 'bg-[#3e3e42]'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:ring-1 ring-white/10'}`}
  >
    <motion.div 
      animate={{ x: active ? 19 : 2 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="w-[16px] h-[16px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
    />
  </button>
);

interface ModelControllerProps {
  provider: ModelProvider;
  selectedVariantId: string;
  isActive: boolean;
  onToggle: () => void;
  onSelectVariant: (id: string) => void;
  isStreaming: boolean;
}

export const ModelController: React.FC<ModelControllerProps> = ({ 
  provider, 
  selectedVariantId, 
  isActive, 
  onToggle, 
  onSelectVariant,
  isStreaming
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const currentVariant = provider.variants.find(v => v.id === selectedVariantId);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredVariants = provider.variants.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex items-center gap-3 w-full justify-between">
      {/* Parent Brand Header (Text Only) */}
      <div className={`transition-colors shrink-0 ${isActive ? 'text-white' : 'text-zinc-600'}`}>
        <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em]">
          {provider.name}
        </span>
      </div>

      {/* Model Selection Box */}
      <div className="relative flex-1 min-w-0 mx-2">
        <button 
          onClick={() => !isStreaming && setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-2.5 py-1.5 bg-[#1a1a1c] border border-white/5 rounded-lg transition-all w-full justify-between group ${isStreaming ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-white/20'}`}
        >
          <span className="text-[11px] font-bold text-white/90 truncate tracking-tight">
            {currentVariant?.name || 'Select'}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-zinc-600 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              <motion.div 
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute top-full left-0 mt-2 w-72 bg-[#1e1e20] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col"
              >
                <div className="p-2 border-b border-white/10 bg-[#161618]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Filter variants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-[#0c0c0e] border border-white/5 rounded-lg py-1.5 pl-9 pr-3 text-[11px] font-mono text-zinc-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto custom-scroll py-1">
                  {filteredVariants.map((v) => {
                    const isSelected = v.id === selectedVariantId;
                    return (
                      <button
                        key={v.id}
                        onClick={() => {
                          onSelectVariant(v.id);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[11px] font-bold transition-all flex items-center justify-between ${isSelected ? 'text-white bg-purple-500/10' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}`}
                      >
                        {v.name}
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#10a37f]" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href={`https://openrouter.ai/models/${currentVariant?.id}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-zinc-600 hover:text-white transition-colors p-1"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <ToggleSwitch active={isActive} onToggle={onToggle} disabled={isStreaming} />
      </div>
    </div>
  );
};

const ModelDock: React.FC<any> = () => null;
export default ModelDock;
