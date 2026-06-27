'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface PermissionGuardProps {
  children: ReactNode;
  requiredModule: string;
}

export const PermissionGuard = ({ children, requiredModule }: PermissionGuardProps) => {
  const { hasPermission, loading, user } = useAuth();

  if (loading || !user) {
    return null;
  }

  if (!hasPermission(requiredModule)) {
    return null;
  }

  return <>{children}</>;
};
