'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, ArrowRight, Loader2, Flame } from 'lucide-react';
import Link from 'next/link';

export function LoginPage() {
  const { loginMutation } = useAuth();
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailId || !password) return;
    loginMutation.mutate({ emailId, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-rose-600/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-tr from-pink-500 to-rose-500 p-3 rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.3)]">
              <Flame className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
          <p className="text-center text-neutral-400 mb-8">Ready to find your next connection?</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-300 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-pink-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-300 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-pink-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl py-3.5 font-semibold text-lg transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-neutral-400 mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-pink-400 hover:text-pink-300 font-medium transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
