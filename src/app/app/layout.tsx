'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  LayoutDashboard,
  Building,
  PlusCircle,
  FileCheck2,
  Clock,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Bell,
  RefreshCcw,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { UserRole } from '@/lib/types';

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(storage.getCurrentUser());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setCurrentUser(storage.getCurrentUser());
    });
    return () => unsubscribe();
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
    { label: 'Rental Properties', href: '/app/properties', icon: Building },
    { label: 'New Property', href: '/app/properties/new', icon: PlusCircle },
    { label: 'Audit Timeline', href: '/app/notifications', icon: Clock },
    { label: 'Settings & Data', href: '/app/settings', icon: Settings },
  ];

  const handleRoleSwitch = (role: UserRole) => {
    storage.switchRole(role);
    setRoleMenuOpen(false);
  };

  const handleSignOut = () => {
    router.push('/');
  };

  const handleResetData = () => {
    if (confirm('Reset application back to pristine demo state with Skyline Heights sample data?')) {
      storage.resetToDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F7FAFC] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#0C1B2B] shrink-0">
        {/* Brand */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#16C784] flex items-center justify-center text-[#07111F] shadow-md shadow-[#16C784]/20">
              <Shield className="w-4 h-4 font-black" />
            </div>
            <span className="text-lg font-black text-white tracking-tight">
              Deposit<span className="text-[#16C784]">Guard</span>
            </span>
          </Link>
        </div>

        {/* User Card & Role Switcher */}
        <div className="p-4 border-b border-white/10 bg-[#102438]/40">
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#16C784]/20 border border-[#16C784]/40 flex items-center justify-center text-[#16C784] font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-[#16C784] font-semibold uppercase tracking-wider">
                    {currentUser.role}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
            </button>

            {/* Role dropdown */}
            {roleMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 p-1.5 rounded-xl bg-[#102438] border border-white/10 shadow-2xl z-50 text-xs">
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#94A3B8]">
                  Switch Role / Persona
                </div>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('tenant')}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${
                    currentUser.role === 'tenant'
                      ? 'bg-[#16C784] text-[#07111F] font-bold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  Priya Sharma (Tenant)
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('landlord')}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${
                    currentUser.role === 'landlord'
                      ? 'bg-[#16C784] text-[#07111F] font-bold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  Arjun Mehta (Landlord)
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('property_manager')}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${
                    currentUser.role === 'property_manager'
                      ? 'bg-[#16C784] text-[#07111F] font-bold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  Vikram Rao (Manager)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#16C784] text-[#07111F] shadow-md shadow-[#16C784]/20'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={handleResetData}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-[#9BF5CC] hover:bg-white/5 transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className="h-16 border-b border-white/10 bg-[#0C1B2B] px-4 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <span className="font-bold text-white text-base">DepositGuard</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs font-bold text-[#16C784] uppercase bg-[#16C784]/15 px-2.5 py-0.5 rounded-full">
              {currentUser.role}
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="md:hidden bg-[#0C1B2B] border-b border-white/10 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold ${
                  pathname === item.href
                    ? 'bg-[#16C784] text-[#07111F]'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetData}
                className="text-xs text-[#94A3B8] hover:text-white flex items-center gap-1"
              >
                <RefreshCcw className="w-3 h-3" /> Reset Demo
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Page Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07111F] text-white flex items-center justify-center text-xs text-[#94A3B8]">
          Loading DepositGuard portal...
        </div>
      }
    >
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
