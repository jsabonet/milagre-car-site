from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import get_object_or_404

from .models import ContactMessage
from .serializers import (
    ContactMessageCreateSerializer,
    ContactMessageListSerializer,
    ContactMessageDetailSerializer,
    ContactMessageUpdateSerializer,
    ContactMessageStatsSerializer
)

class ContactMessageViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar mensagens de contato"""
    
    queryset = ContactMessage.objects.all()
    
    def get_serializer_class(self):
        """Retornar serializer baseado na ação"""
        if self.action == 'create':
            return ContactMessageCreateSerializer
        elif self.action in ['list']:
            return ContactMessageListSerializer
        elif self.action in ['retrieve']:
            return ContactMessageDetailSerializer
        elif self.action in ['update', 'partial_update']:
            return ContactMessageUpdateSerializer
        return ContactMessageDetailSerializer
    
    def get_permissions(self):
        """Definir permissões baseadas na ação"""
        if self.action == 'create':
            # Qualquer pessoa pode enviar mensagem
            permission_classes = [permissions.AllowAny]
        else:
            # Apenas admins podem ver/gerenciar mensagens
            permission_classes = [permissions.IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filtrar queryset baseado nos parâmetros"""
        queryset = ContactMessage.objects.all()
        
        # Apenas admins podem ver todas as mensagens
        if not self.request.user.is_authenticated:
            return queryset.none()
        
        # Filtros
        status_filter = self.request.query_params.get('status', None)
        priority_filter = self.request.query_params.get('priority', None)
        subject_filter = self.request.query_params.get('subject', None)
        is_read_filter = self.request.query_params.get('is_read', None)
        search = self.request.query_params.get('search', None)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
            
        if subject_filter:
            queryset = queryset.filter(subject=subject_filter)
            
        if is_read_filter is not None:
            is_read = is_read_filter.lower() == 'true'
            queryset = queryset.filter(is_read=is_read)
        
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(email__icontains=search) |
                Q(message__icontains=search) |
                Q(phone__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """Criar nova mensagem de contato"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Verificar rate limiting (máximo 5 mensagens por IP por hora)
        client_ip = self.get_client_ip(request)
        one_hour_ago = timezone.now() - timedelta(hours=1)
        recent_messages = ContactMessage.objects.filter(
            ip_address=client_ip,
            created_at__gte=one_hour_ago
        ).count()
        
        if recent_messages >= 5:
            return Response(
                {'error': 'Muitas mensagens enviadas. Tente novamente em 1 hora.'},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'message': 'Mensagem enviada com sucesso!',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    def retrieve(self, request, *args, **kwargs):
        """Recuperar mensagem e marcar como lida"""
        instance = self.get_object()
        
        # Marcar como lida se não estiver
        if not instance.is_read:
            instance.mark_as_read()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Marcar mensagem como lida"""
        message = self.get_object()
        message.mark_as_read()
        return Response({'status': 'Mensagem marcada como lida'})
    
    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        """Responder à mensagem"""
        message = self.get_object()
        response_text = request.data.get('response', '')
        
        if not response_text:
            return Response(
                {'error': 'Resposta não pode estar vazia'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        message.set_response(response_text)
        
        serializer = self.get_serializer(message)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Obter estatísticas das mensagens"""
        # Contadores básicos
        total_messages = ContactMessage.objects.count()
        new_messages = ContactMessage.objects.filter(status='new').count()
        in_progress_messages = ContactMessage.objects.filter(status='in_progress').count()
        resolved_messages = ContactMessage.objects.filter(status='resolved').count()
        unread_messages = ContactMessage.objects.filter(is_read=False).count()
        urgent_messages = ContactMessage.objects.filter(priority='urgent').count()
        
        # Mensagens por período
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        today_messages = ContactMessage.objects.filter(
            created_at__date=today
        ).count()
        
        week_messages = ContactMessage.objects.filter(
            created_at__date__gte=week_ago
        ).count()
        
        # Tempo médio de resposta (em horas)
        responded_messages = ContactMessage.objects.filter(
            responded_at__isnull=False
        )
        
        avg_response_time = 0
        if responded_messages.exists():
            total_response_time = sum([
                (msg.responded_at - msg.created_at).total_seconds() / 3600
                for msg in responded_messages
            ])
            avg_response_time = total_response_time / responded_messages.count()
        
        # Estatísticas por assunto
        subject_stats = dict(
            ContactMessage.objects.values('subject').annotate(
                count=Count('id')
            ).values_list('subject', 'count')
        )
        
        # Distribuição por status
        status_distribution = dict(
            ContactMessage.objects.values('status').annotate(
                count=Count('id')
            ).values_list('status', 'count')
        )
        
        stats_data = {
            'total_messages': total_messages,
            'new_messages': new_messages,
            'in_progress_messages': in_progress_messages,
            'resolved_messages': resolved_messages,
            'unread_messages': unread_messages,
            'urgent_messages': urgent_messages,
            'today_messages': today_messages,
            'week_messages': week_messages,
            'avg_response_time': round(avg_response_time, 2),
            'subject_stats': subject_stats,
            'status_distribution': status_distribution,
        }
        
        serializer = ContactMessageStatsSerializer(data=stats_data)
        serializer.is_valid()
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Obter mensagens recentes (últimas 10)"""
        recent_messages = self.get_queryset()[:10]
        serializer = self.get_serializer(recent_messages, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def urgent(self, request):
        """Obter mensagens urgentes"""
        urgent_messages = self.get_queryset().filter(
            Q(priority='urgent') | 
            Q(priority='high') |
            Q(created_at__lte=timezone.now() - timedelta(days=2), status='new')
        )
        serializer = self.get_serializer(urgent_messages, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """Atualização em lote de mensagens"""
        message_ids = request.data.get('ids', [])
        update_data = request.data.get('data', {})
        
        if not message_ids:
            return Response(
                {'error': 'IDs das mensagens são obrigatórios'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        updated_count = ContactMessage.objects.filter(
            id__in=message_ids
        ).update(**update_data)
        
        return Response({
            'updated_count': updated_count,
            'message': f'{updated_count} mensagens atualizadas'
        })
    
    def get_client_ip(self, request):
        """Obter IP do cliente"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
