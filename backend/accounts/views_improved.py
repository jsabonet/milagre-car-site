from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from .serializers import LoginSerializer, UserSerializer
import logging

logger = logging.getLogger(__name__)

# Configuração de expiração de token (7 dias)
TOKEN_EXPIRATION_DAYS = 7

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login do administrador com geração de token"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Verificar se é admin
        if not (user.is_staff or user.is_superuser):
            return Response({
                'error': 'Acesso negado. Apenas administradores podem acessar.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        login(request, user)
        
        # Deletar token antigo se existir
        Token.objects.filter(user=user).delete()
        
        # Criar novo token
        token = Token.objects.create(user=user)
        
        # Log de acesso
        logger.info(f"Login bem-sucedido para admin: {user.username} em {timezone.now()}")
        
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'message': 'Login realizado com sucesso',
            'expires_in': TOKEN_EXPIRATION_DAYS * 24 * 60 * 60,  # em segundos
            'token_created': token.created.isoformat()
        })
    return Response({
        'error': 'Credenciais inválidas'
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout do administrador com invalidação do token"""
    try:
        # Log de logout
        logger.info(f"Logout para admin: {request.user.username} em {timezone.now()}")
        
        # Deletar token
        request.user.auth_token.delete()
    except Exception as e:
        logger.warning(f"Erro ao deletar token durante logout: {e}")
    
    logout(request)
    return Response({'message': 'Logout realizado com sucesso'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Perfil do usuário logado"""
    return Response(UserSerializer(request.user).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_admin(request):
    """Verificar se o usuário é administrador"""
    try:
        user = request.user
        
        # Verificar se o token ainda é válido (não expirou)
        token = request.auth
        if token:
            token_age = timezone.now() - token.created
            if token_age > timedelta(days=TOKEN_EXPIRATION_DAYS):
                # Token expirado
                token.delete()
                return Response({
                    'error': 'Token expirado. Faça login novamente.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        is_admin = user.is_staff or user.is_superuser
        
        return Response({
            'is_admin': is_admin,
            'username': user.username,
            'user_id': user.id,
            'token_valid': True,
            'token_created': token.created.isoformat() if token else None
        })
    except Exception as e:
        logger.error(f"Erro ao verificar admin status: {e}")
        return Response({
            'error': 'Erro interno do servidor'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refresh_token(request):
    """Renovar token do usuário"""
    try:
        user = request.user
        
        # Verificar se é admin
        if not (user.is_staff or user.is_superuser):
            return Response({
                'error': 'Acesso negado'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Deletar token antigo
        Token.objects.filter(user=user).delete()
        
        # Criar novo token
        new_token = Token.objects.create(user=user)
        
        logger.info(f"Token renovado para admin: {user.username} em {timezone.now()}")
        
        return Response({
            'token': new_token.key,
            'message': 'Token renovado com sucesso',
            'expires_in': TOKEN_EXPIRATION_DAYS * 24 * 60 * 60,
            'token_created': new_token.created.isoformat()
        })
    except Exception as e:
        logger.error(f"Erro ao renovar token: {e}")
        return Response({
            'error': 'Erro ao renovar token'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Endpoint para verificar se a API está funcionando"""
    return Response({
        'status': 'ok',
        'timestamp': timezone.now().isoformat(),
        'message': 'Milagre Car API está funcionando'
    })
