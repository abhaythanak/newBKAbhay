'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useAuth } from '@/hooks/useAuth';
import { Flame, LogOut, User as UserIcon } from 'lucide-react';

export function Navbar() {
  const { user } = useAuthStore();
  const { logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-950/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-tr from-pink-500 to-rose-500 p-2 rounded-xl">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
              DevTinder
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/5 rounded-full px-4 py-1.5 border border-white/10">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="bg-neutral-800 p-1 rounded-full">
                      <UserIcon className="w-5 h-5 text-neutral-400" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-white">{user.firstName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-neutral-400 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-white hover:text-pink-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-neutral-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
