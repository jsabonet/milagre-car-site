from django.utils import timezone
from datetime import timedelta
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)

class TokenExpirationMiddleware:
    """
    Middleware para verificar expiração de tokens automaticamente
    """
    def __init__(self, get_response):
        self.get_response = get_response
        # Configuração de expiração (7 dias)
        self.token_expiration_days = 7

    def __call__(self, request):
        # Verificar expiração de token antes de processar a requisição
        if self.should_check_token(request):
            token_valid = self.check_token_expiration(request)
            if not token_valid:
                return JsonResponse({
                    'error': 'Token expirado. Faça login novamente.',
                    'code': 'TOKEN_EXPIRED'
                }, status=401)

        response = self.get_response(request)
        return response

    def should_check_token(self, request):
        """
        Determina se deve verificar o token para esta requisição
        """
        # Só verificar em rotas da API que requerem autenticação
        if not request.path.startswith('/api/'):
            return False
        
        # Não verificar em rotas públicas
        public_routes = [
            '/api/cars/',  # GET é público
            '/api/categories/',  # GET é público
            '/api/auth/login/',
            '/api/auth/health-check/',
        ]
        
        # Para rotas públicas, só verificar se é POST/PUT/DELETE
        for route in public_routes:
            if request.path.startswith(route) and request.method == 'GET':
                return False
        
        return 'Authorization' in request.headers

    def check_token_expiration(self, request):
        """
        Verifica se o token não expirou
        """
        try:
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Token '):
                return True  # Não é um token, deixar outras validações tratarem
            
            token_key = auth_header.split('Token ')[1]
            token = Token.objects.get(key=token_key)
            
            # Verificar se expirou
            token_age = timezone.now() - token.created
            if token_age > timedelta(days=self.token_expiration_days):
                # Token expirado, deletar
                token.delete()
                logger.info(f"Token expirado removido para usuário: {token.user.username}")
                return False
            
            return True
            
        except Token.DoesNotExist:
            return False
        except Exception as e:
            logger.error(f"Erro ao verificar expiração do token: {e}")
            return True  # Em caso de erro, deixar passar para outras validações
