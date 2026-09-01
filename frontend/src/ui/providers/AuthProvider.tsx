'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const publicRoutes = ['/login', '/signup', '/'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { useProfile } = useAuth();
  const { data: user, isLoading: isQueryLoading } = useProfile();
  const { isLoading: isStoreLoading, setLoading } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isQueryLoading) {
      setLoading(false);
    }
  }, [isQueryLoading, setLoading]);

  useEffect(() => {
    if (isQueryLoading || isStoreLoading) return;

    const isPublic = publicRoutes.includes(pathname);
    
    if (!user && !isPublic) {
      router.push('/login');
    } else if (user && (pathname === '/login' || pathname === '/signup')) {
      router.push('/feed');
    }
  }, [user, pathname, isQueryLoading, isStoreLoading, router]);

  if (isQueryLoading || isStoreLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  return <>{children}</>;
}
