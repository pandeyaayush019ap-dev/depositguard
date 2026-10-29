'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, UserCheck, Lock, Mail, User, AlertCircle, Building2 } from 'lucide-react';
import { storage } from '@/lib/storage';
import { UserRole } from '@/lib/types';

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('tenant');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      storage.setCurrentUser({
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        organization: role === 'tenant' ? 'Tenant Member' : role === 'landlord' ? 'Property Owner' : 'Property Manager',
      });
      setIsLoading(false);
      router.push('/app/onboarding');
    }, 400);
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
            Create your DepositGuard account
          </h1>
          <p className="text-xs text-[#94A3B8] mt-2">
            Protect your rental security deposit with verifiable photographic proof.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-[#0C1B2B] border border-white/10 p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Role Segmented Selector */}
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">
                I am registering as a:
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#07111F] border border-white/10">
                <button
                  type="button"
                  onClick={() => setRole('tenant')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    role === 'tenant'
                      ? 'bg-[#16C784] text-[#07111F] shadow'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Tenant / Renter
                </button>
                <button
                  type="button"
                  onClick={() => setRole('landlord')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    role === 'landlord'
                      ? 'bg-[#16C784] text-[#07111F] shadow'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Landlord / Owner
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-white/90 mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#16C784] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-semibold text-white/90 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#16C784] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-xs font-semibold text-white/90 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#16C784] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#16C784] to-[#12A86E] text-[#07111F] font-bold text-sm shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Creating Account...' : 'Continue to Onboarding'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-[#94A3B8]">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-bold text-[#16C784] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
