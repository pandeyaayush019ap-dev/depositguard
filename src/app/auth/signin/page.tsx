'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, UserCheck, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { storage } from '@/lib/storage';
import { DEMO_USERS } from '@/lib/mockData';
import { UserRole } from '@/lib/types';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Find matching demo user or create session user
      const existing = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        storage.setCurrentUser(existing);
      } else {
        storage.setCurrentUser({
          id: `user-${Date.now()}`,
          name: email.split('@')[0],
          email: email,
          role: 'tenant',
          organization: 'Custom Member',
        });
      }
      setIsLoading(false);
      router.push('/app');
    }, 400);
  };

  const handleQuickLogin = (role: UserRole) => {
    storage.switchRole(role);
    router.push('/app');
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F7FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#16C784]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-[#16C784] flex items-center justify-center text-[#07111F] shadow-lg shadow-[#16C784]/20">
              <Shield className="w-5 h-5 font-black" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Deposit<span className="text-[#16C784]">Guard</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Sign in to your rental portal
          </h1>
          <p className="text-xs text-[#94A3B8] mt-2">
            Access your property baseline records and settlement ledgers.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-[#0C1B2B] border border-white/10 p-6 sm:p-8 shadow-2xl">
          {/* Quick Demo Logins Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-[#102438] border border-[#16C784]/20">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#9BF5CC]">
              <Sparkles className="w-4 h-4 text-[#16C784]" />
              <span>Instant Evaluator Logins (One-Click)</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] mb-3">
              Switch roles immediately to test real tenant vs landlord workflows:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('tenant')}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-[#16C784]/20 border border-white/10 text-xs font-bold text-white hover:text-[#9BF5CC] transition-all text-left"
              >
                <div className="font-semibold">Priya Sharma</div>
                <div className="text-[10px] text-[#16C784]">Role: Tenant</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('landlord')}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-sky-500/20 border border-white/10 text-xs font-bold text-white hover:text-sky-300 transition-all text-left"
              >
                <div className="font-semibold">Arjun Mehta</div>
                <div className="text-[10px] text-sky-400">Role: Landlord</div>
              </button>
            </div>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative bg-[#0C1B2B] px-3 text-xs text-[#94A3B8] uppercase font-mono">
              Or sign in with email
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-white/90 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#16C784] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-white/90">
                  Password
                </label>
                <a
                  href="#reset"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset instructions have been simulated for this test environment.');
                  }}
                  className="text-xs text-[#16C784] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#16C784] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#16C784] to-[#12A86E] text-[#07111F] font-bold text-sm shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-[#94A3B8]">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-bold text-[#16C784] hover:underline">
              Sign up free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
