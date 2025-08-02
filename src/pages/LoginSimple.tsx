import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, User, Eye, EyeOff, Shield } from 'lucide-react';
import { authService } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Rate limiting - bloquear após 3 tentativas
  const MAX_LOGIN_ATTEMPTS = 3;
  const isBlocked = loginAttempts >= MAX_LOGIN_ATTEMPTS;

  // Reset tentativas após 5 minutos
  useEffect(() => {
    if (loginAttempts > 0) {
      const timer = setTimeout(() => {
        setLoginAttempts(0);
        setError('');
      }, 5 * 60 * 1000); // 5 minutos

      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  // Redirect se já estiver logado
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.getToken()) {
        try {
          const isAdmin = await authService.checkAdminStatus();
          if (isAdmin) {
            const redirectTo = (location.state as any)?.from?.pathname || '/admin';
            navigate(redirectTo, { replace: true });
          }
        } catch (error) {
          // Token inválido, continua na página de login
          authService.logout();
        }
      }
    };
    
    checkAuth();
  }, [navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setError('Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(credentials);
      
      // Verificar se é admin
      const isAdmin = await authService.checkAdminStatus();
      
      if (!isAdmin) {
        setError('Acesso negado. Apenas administradores podem acessar esta área.');
        setLoginAttempts(prev => prev + 1);
        authService.logout();
        return;
      }

      // Reset attempts on successful login
      setLoginAttempts(0);

      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${response.user.first_name || response.user.username}!`,
        duration: 4000,
      });

      // Redirect para a página solicitada ou admin
      const redirectTo = (location.state as any)?.from?.pathname || '/admin';
      navigate(redirectTo, { replace: true });
      
    } catch (error: any) {
      setLoginAttempts(prev => prev + 1);
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
      
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        errorMessage = 'Usuário ou senha incorretos.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (error.message?.includes('403')) {
        errorMessage = 'Acesso negado. Apenas administradores podem acessar.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Acesso Administrativo
            </CardTitle>
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              Entre com suas credenciais para acessar o painel administrativo do sistema
            </p>
          </CardHeader>
          
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              {isBlocked && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertDescription className="text-amber-700">
                    Muitas tentativas de login. Por segurança, aguarde alguns minutos.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  Nome de Usuário
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu nome de usuário"
                    value={credentials.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading || isBlocked}
                    autoComplete="username"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading || isBlocked}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading || isBlocked}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200" 
                disabled={loading || !credentials.username || !credentials.password || isBlocked}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando credenciais...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Entrar no Sistema
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-8 text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Lock className="h-3 w-3" />
                <span>Conexão segura e criptografada</span>
              </div>
              
              <p className="text-sm text-gray-500">
                Problemas com acesso? Entre em contato com o{' '}
                <a href="mailto:admin@milagrecar.co.mz" className="text-blue-600 hover:text-blue-700 font-medium">
                  administrador do sistema
                </a>
              </p>
              
              {loginAttempts > 0 && loginAttempts < MAX_LOGIN_ATTEMPTS && (
                <p className="text-xs text-amber-600">
                  Tentativa {loginAttempts} de {MAX_LOGIN_ATTEMPTS}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
