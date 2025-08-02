from rest_framework import serializers
from .models import ContactMessage
from django.utils import timezone

class ContactMessageCreateSerializer(serializers.ModelSerializer):
    """Serializer para criação de mensagens de contato"""
    
    class Meta:
        model = ContactMessage
        fields = [
            'name', 'email', 'phone', 'subject', 
            'message', 'preferred_contact'
        ]
        
    def validate_email(self, value):
        """Validar formato do email"""
        if not value or '@' not in value:
            raise serializers.ValidationError("E-mail inválido")
        return value.lower()
    
    def validate_phone(self, value):
        """Validar formato do telefone"""
        import re
        # Remove espaços e caracteres especiais
        cleaned_phone = re.sub(r'[^\d+]', '', value)
        if len(cleaned_phone) < 9:
            raise serializers.ValidationError("Telefone deve ter pelo menos 9 dígitos")
        return cleaned_phone
    
    def create(self, validated_data):
        """Criar nova mensagem de contato"""
        # Adicionar IP address se disponível
        request = self.context.get('request')
        if request:
            validated_data['ip_address'] = self.get_client_ip(request)
        
        return ContactMessage.objects.create(**validated_data)
    
    def get_client_ip(self, request):
        """Obter IP do cliente"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class ContactMessageListSerializer(serializers.ModelSerializer):
    """Serializer para listagem de mensagens (admin)"""
    
    subject_display = serializers.CharField(source='get_subject_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    preferred_contact_display = serializers.CharField(source='get_preferred_contact_display', read_only=True)
    days_since_created = serializers.ReadOnlyField()
    urgency_level = serializers.ReadOnlyField()
    is_new = serializers.ReadOnlyField()
    
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 'subject_display',
            'message', 'preferred_contact', 'preferred_contact_display',
            'status', 'status_display', 'priority', 'priority_display',
            'admin_response', 'responded_at', 'created_at', 'updated_at',
            'is_read', 'days_since_created', 'urgency_level', 'is_new'
        ]

class ContactMessageDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalhes completos da mensagem (admin)"""
    
    subject_display = serializers.CharField(source='get_subject_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    preferred_contact_display = serializers.CharField(source='get_preferred_contact_display', read_only=True)
    days_since_created = serializers.ReadOnlyField()
    urgency_level = serializers.ReadOnlyField()
    
    class Meta:
        model = ContactMessage
        fields = '__all__'

class ContactMessageUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualização de mensagens (admin)"""
    
    class Meta:
        model = ContactMessage
        fields = [
            'status', 'priority', 'admin_response', 'is_read'
        ]
    
    def update(self, instance, validated_data):
        """Atualizar mensagem com controle de timestamp"""
        if 'admin_response' in validated_data and validated_data['admin_response']:
            validated_data['responded_at'] = timezone.now()
            if instance.status == 'new':
                validated_data['status'] = 'in_progress'
        
        return super().update(instance, validated_data)

class ContactMessageStatsSerializer(serializers.Serializer):
    """Serializer para estatísticas das mensagens"""
    
    total_messages = serializers.IntegerField()
    new_messages = serializers.IntegerField()
    in_progress_messages = serializers.IntegerField()
    resolved_messages = serializers.IntegerField()
    unread_messages = serializers.IntegerField()
    urgent_messages = serializers.IntegerField()
    today_messages = serializers.IntegerField()
    week_messages = serializers.IntegerField()
    avg_response_time = serializers.FloatField()
    
    # Estatísticas por assunto
    subject_stats = serializers.DictField()
    
    # Estatísticas por status
    status_distribution = serializers.DictField()
