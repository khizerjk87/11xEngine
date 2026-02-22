
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  AuthError 
} from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      const authErr = err as AuthError;
      console.error(authErr.code);
      switch(authErr.code) {
        case 'auth/invalid-credential':
          setError('Invalid email or password.');
          break;
        case 'auth/email-already-in-use':
          setError('This email is already registered.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        default:
          setError('An authentication error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#050507] flex items-center justify-center p-6 z-[9999]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Decorative Background Blur */}
        <div className="absolute -inset-4 bg-purple-600/10 blur-3xl opacity-50 rounded-full pointer-events-none"></div>

        <div className="relative bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="relative mb-6">
              <div className="absolute -inset-2 bg-purple-500 rounded-2xl blur opacity-30 animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-fuchsia-700 rounded-2xl flex items-center justify-center shadow-2xl">
                <Zap className="w-8 h-8 text-white fill-white/20" />
              </div>
            </div>
            <h1 className="text-4xl font-mono font-black tracking-tighter text-white mb-2">11X ENGINE</h1>
            <p className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.4em] font-bold">Access Terminal v3.2</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 ml-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@matrix.com"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder:text-zinc-700 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 ml-2">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder:text-zinc-700 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3"
                >
                  <ShieldCheck className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-medium text-red-400 leading-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={loading}
              className="w-full bg-white text-black hover:bg-zinc-200 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 mt-6 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  {isLogin ? 'Initialize Session' : 'Create Credentials'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500 hover:text-purple-400 transition-colors"
            >
              {isLogin ? "No access key? Create Deployment" : "Already registered? Login to Core"}
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 opacity-30 grayscale hover:opacity-60 transition-opacity">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;
