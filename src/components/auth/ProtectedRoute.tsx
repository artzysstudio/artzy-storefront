'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedModules: string[];
}

export const ProtectedRoute = ({ children, allowedModules }: ProtectedRouteProps) => {
  const { user, loading, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        const hasAccess = allowedModules.some(module => hasPermission(module));
        if (!hasAccess) {
          // You can also redirect to a dedicated /unauthorized page
          router.push('/dashboard');
        }
      }
    }
  }, [user, loading, allowedModules, hasPermission, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const hasAccess = allowedModules.some(module => hasPermission(module));
  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
};
