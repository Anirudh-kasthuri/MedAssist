import React, { useState } from 'react';
import { HeartPulse, ArrowRight, Loader2, ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';
import { login, signup } from '../../services/backendService';
import { User } from '../../types';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      let user;
      if (isLogin) {
        const loginEmail = email.includes('@') ? email : `${email.toLowerCase()}@medassist.ai`;
        user = await login(loginEmail, password);
      } else {
        user = await signup(name, email, password);
      }
      onLogin(user);
    } catch (err: any) {
      console.error("Auth failed", err);
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors">
      <div className="w-full max-w-sm">
        
        {/* Minimal Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg mb-6 transition-colors">
             <HeartPulse className="w-6 h-6 text-white dark:text-black" />
          </div>
          <h1 className="text-2xl font-semibold text-black dark:text-white tracking-tight">MedAssist</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
            {isLogin ? "Welcome back" : "Create account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
              <input 
                type="text" 
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-11 pr-4 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-0 transition-all text-sm"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder={isLogin ? "Email or Username" : "Email Address"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-11 pr-4 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-0 transition-all text-sm"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-11 pr-4 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-0 transition-all text-sm"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center animate-fade-in">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-black dark:bg-white text-white dark:text-black p-4 rounded-2xl hover:opacity-90 transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed group mt-4 font-medium text-sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
           <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-xs font-medium text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
           >
             {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
           </button>
        </div>

        <div className="mt-12 flex justify-center space-x-4 opacity-50">
           <ShieldCheck className="w-4 h-4 text-zinc-400" />
           <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">End-to-End Encrypted</span>
        </div>

      </div>
    </div>
  );
};

export default LoginView;