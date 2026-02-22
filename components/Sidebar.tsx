
import React from 'react';
import { History, MessageSquare, Trash2, Plus, Zap, LogOut } from 'lucide-react';
import { Multiplex } from '../types';
import { auth } from '../services/firebase';

interface SidebarProps {
  history: Multiplex[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  history,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat
}) => {
  return (
    <div className="w-72 h-full flex flex-col bg-[#050507] border-r border-white/5 relative z-20 shadow-2xl">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="relative">
            <div className="absolute -inset-1 bg-purple-500 rounded-xl blur opacity-30 animate-pulse"></div>
            <div className="relative w-11 h-11 bg-gradient-to-br from-purple-600 to-fuchsia-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/40">
              <Zap className="w-6 h-6 text-white fill-white/20" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-mono font-black tracking-tighter leading-none text-white">
              11X
            </h1>
            <p className="text-[9px] font-mono text-purple-400/70 uppercase tracking-[0.3em] mt-1 font-bold">Multiplex Engine</p>
          </div>
        </div>

        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-xl transition-all text-xs font-mono font-bold uppercase tracking-widest text-zinc-300"
        >
          <Plus className="w-4 h-4 text-purple-400" />
          Initialize New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scroll">
        <div className="flex items-center gap-2 px-4 mb-4 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600">
          <History className="w-3.5 h-3.5" />
          Deployments
        </div>

        {history.length === 0 ? (
          <div className="px-4 py-12 text-center opacity-30">
            <p className="text-[10px] text-zinc-500 font-mono italic uppercase tracking-widest">Buffer Empty</p>
          </div>
        ) : (
          history.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                currentChatId === chat.id
                  ? 'bg-purple-500/10 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.05)]'
                  : 'bg-transparent border-transparent hover:bg-white/[0.04]'
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className={`p-2 rounded-lg transition-colors ${currentChatId === chat.id ? 'bg-purple-500/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                <MessageSquare className={`w-3.5 h-3.5 ${currentChatId === chat.id ? 'text-purple-400' : 'text-zinc-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-mono font-bold truncate tracking-tight ${currentChatId === chat.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                  {chat.title || 'NULL_SESSION'}
                </p>
                <p className="text-[9px] text-zinc-600 font-mono mt-0.5">{new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} // {new Date(chat.timestamp).toLocaleDateString()}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-500 transition-all text-zinc-600"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-6 space-y-3">
        <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/20 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] font-mono font-bold text-zinc-400 tracking-widest uppercase">System Core: Online</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">
            Comparing <span className="text-purple-400">5x</span> LMM nodes. Parallel inference enabled.
          </p>
        </div>

        <button 
          onClick={() => auth.signOut()}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-xl transition-all group"
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 group-hover:text-red-400">Terminate Session</span>
          <LogOut className="w-3.5 h-3.5 text-zinc-600 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
