import React from 'react';
import { useAdmin } from '@/hooks/useAdmin';

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLoading?: boolean;
}

export const AdminOnly: React.FC<AdminOnlyProps> = ({ 
  children, 
  fallback = null, 
  showLoading = false 
}) => {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return showLoading ? <div className="animate-pulse h-8 w-20 bg-muted rounded"></div> : null;
  }

  return isAdmin ? <>{children}</> : <>{fallback}</>;
};

// Componente para uso em contextos onde queremos forçar verificação
export const AdminOnlyStrict: React.FC<AdminOnlyProps> = ({ children, fallback = null }) => {
  const { isAdmin, isLoading, error } = useAdmin();

  if (isLoading || error) {
    return null;
  }

  return isAdmin ? <>{children}</> : <>{fallback}</>;
};
