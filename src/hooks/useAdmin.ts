import { useState, useEffect } from 'react';
import { authService } from '@/services/auth';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!authService.isAuthenticated()) {
          setIsAdmin(false);
          return;
        }

        // Verificação rápida com cache primeiro
        if (authService.isAdminCached()) {
          setIsAdmin(true);
          return;
        }

        // Se não há cache, fazer verificação completa
        const adminCheck = await authService.checkAdmin();
        setIsAdmin(adminCheck.is_admin);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao verificar permissões');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { isAdmin, isLoading, error };
}
