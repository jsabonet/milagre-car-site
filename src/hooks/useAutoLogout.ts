import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

export const useAutoLogout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = useCallback(async (reason: string = 'Sessão expirada') => {
    try {
      await authService.logout();
      
      toast({
        title: "Sessão encerrada",
        description: reason,
        variant: "destructive",
        duration: 5000,
      });
      
      // Redirecionar para login
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Erro no logout automático:', error);
    }
  }, [navigate, toast]);

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    let tokenCheckInterval: NodeJS.Timeout;

    // Verificar token a cada 30 segundos
    const checkTokenValidity = async () => {
      if (!authService.getToken()) {
        return;
      }

      try {
        await authService.checkAdmin();
      } catch (error) {
        logout('Token de acesso inválido ou expirado');
      }
    };

    // Auto logout por inatividade (30 minutos)
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        logout('Sessão encerrada por inatividade');
      }, 30 * 60 * 1000); // 30 minutos
    };

    // Eventos que indicam atividade do usuário
    const userActivityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Adicionar listeners para atividade do usuário
    userActivityEvents.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true);
    });

    // Iniciar timers
    resetInactivityTimer();
    tokenCheckInterval = setInterval(checkTokenValidity, 30000);

    // Listener para quando a aba fica inativa/ativa
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Aba inativa - verificar token quando voltar
        clearInterval(tokenCheckInterval);
      } else {
        // Aba ativa - verificar token imediatamente e reiniciar verificações
        checkTokenValidity();
        tokenCheckInterval = setInterval(checkTokenValidity, 30000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearTimeout(inactivityTimer);
      clearInterval(tokenCheckInterval);
      
      userActivityEvents.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer, true);
      });
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [logout]);

  return { logout };
};
