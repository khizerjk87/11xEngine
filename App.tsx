import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';
import { DatabaseService } from './services/db';
import { UserSettings, Multiplex } from './types';
import { MODEL_PROVIDERS } from './constants';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import AuthScreen from './components/AuthScreen';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [settings, setSettings] = useState<UserSettings>(() => {
    const defaultVariants: Record<string, string> = {};
    MODEL_PROVIDERS.forEach(p => {
      defaultVariants[p.key] = p.variants[0].id;
    });

    return {
      activeModelIds: [MODEL_PROVIDERS[0].variants[0].id],
      providerVariants: defaultVariants
    };
  });

  const [history, setHistory] = useState<Multiplex[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auth Listener & Initial Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setSyncing(true);
        try {
          const [cloudSettings, cloudHistory] = await Promise.all([
            DatabaseService.getSettings(currentUser.uid),
            DatabaseService.getHistory(currentUser.uid)
          ]);
          
          if (cloudSettings) setSettings(cloudSettings);
          if (cloudHistory) setHistory(cloudHistory);
        } catch (error) {
          console.error("Sync Error:", error);
        } finally {
          setSyncing(false);
        }
      } else {
        setHistory([]);
        setCurrentChatId(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync Settings to Cloud
  useEffect(() => {
    if (user && !syncing) {
      DatabaseService.saveSettings(user.uid, settings).catch(console.error);
    }
  }, [settings, user, syncing]);

  const handleToggleProvider = useCallback((providerKey: string) => {
    setSettings(prev => {
      const selectedVariantId = prev.providerVariants[providerKey];
      const activeIds = [...prev.activeModelIds];
      const index = activeIds.indexOf(selectedVariantId);

      if (index > -1) {
        activeIds.splice(index, 1);
      } else {
        activeIds.push(selectedVariantId);
      }

      return { ...prev, activeModelIds: activeIds };
    });
  }, []);

  const handleUpdateVariant = useCallback((providerKey: string, variantId: string) => {
    setSettings(prev => {
      const oldVariantId = prev.providerVariants[providerKey];
      const activeIds = [...prev.activeModelIds];
      
      const index = activeIds.indexOf(oldVariantId);
      if (index > -1) {
        activeIds[index] = variantId;
      }

      return {
        ...prev,
        activeModelIds: activeIds,
        providerVariants: {
          ...prev.providerVariants,
          [providerKey]: variantId
        }
      };
    });
  }, []);

  const handleSaveMultiplex = useCallback(async (multiplex: Multiplex) => {
    if (!user) return;
    setHistory(prev => [multiplex, ...prev]);
    setCurrentChatId(multiplex.id);
    await DatabaseService.saveMultiplex(user.uid, multiplex).catch(console.error);
  }, [user]);

  const handleNewChat = useCallback(() => {
    setCurrentChatId(null);
  }, []);

  const handleDeleteChat = useCallback(async (id: string) => {
    if (!user) return;
    setHistory(prev => prev.filter(c => c.id !== id));
    if (currentChatId === id) setCurrentChatId(null);
    await DatabaseService.deleteMultiplex(user.uid, id).catch(console.error);
  }, [currentChatId, user]);

  const currentChat = useMemo(() => history.find(c => c.id === currentChatId) || null, [history, currentChatId]);

  if (authLoading || (user && syncing)) {
    return (
      <div className="h-screen w-full bg-[#050507] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.4em]">
            {syncing ? 'Synchronizing Cloud Core' : 'Verifying Identity'}
          </p>
          <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-purple-500 animate-progress origin-left"></div>
          </div>
        </div>
        <style>{`
          @keyframes progress {
            0% { transform: scaleX(0) translateX(0); }
            50% { transform: scaleX(0.5) translateX(100%); }
            100% { transform: scaleX(0) translateX(200%); }
          }
          .animate-progress { animation: progress 2s infinite ease-in-out; }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="flex h-screen w-full bg-[#0a0a0c] text-zinc-200 overflow-hidden font-inter relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      {isSidebarOpen && (
        <Sidebar
          history={history}
          currentChatId={currentChatId}
          onSelectChat={setCurrentChatId}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
      )}

      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute left-4 bottom-4 z-50 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
      >
        <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <main className="flex-1 flex flex-col min-w-0 z-10">
        <ChatInterface
          settings={settings}
          currentMultiplex={currentChat}
          onSaveMultiplex={handleSaveMultiplex}
          isStreaming={isStreaming}
          setIsStreaming={setIsStreaming}
          onToggleProvider={handleToggleProvider}
          onUpdateVariant={handleUpdateVariant}
        />
      </main>
    </div>
  );
};

export default App;