from django.db import models
from django.utils import timezone

class ContactMessage(models.Model):
    """Modelo para mensagens de contato dos clientes"""
    
    SUBJECT_CHOICES = [
        ('info_vehicles', 'Informações sobre veículos'),
        ('test_drive', 'Agendamento de test drive'),
        ('financing', 'Financiamento e parcelas'),
        ('sell_car', 'Venda do meu carro'),
        ('support', 'Suporte pós-venda'),
        ('partnership', 'Parcerias comerciais'),
        ('other', 'Outros assuntos'),
    ]
    
    CONTACT_PREFERENCE_CHOICES = [
        ('whatsapp', 'WhatsApp'),
        ('phone', 'Telefone'),
        ('email', 'E-mail'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'Nova'),
        ('in_progress', 'Em Andamento'),
        ('resolved', 'Resolvida'),
        ('closed', 'Fechada'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Baixa'),
        ('normal', 'Normal'),
        ('high', 'Alta'),
        ('urgent', 'Urgente'),
    ]
    
    # Informações do cliente
    name = models.CharField(max_length=200, verbose_name="Nome Completo")
    email = models.EmailField(verbose_name="E-mail")
    phone = models.CharField(max_length=20, verbose_name="Telefone")
    
    # Mensagem
    subject = models.CharField(
        max_length=50, 
        choices=SUBJECT_CHOICES,
        verbose_name="Assunto"
    )
    message = models.TextField(verbose_name="Mensagem")
    preferred_contact = models.CharField(
        max_length=20,
        choices=CONTACT_PREFERENCE_CHOICES,
        blank=True,
        null=True,
        verbose_name="Preferência de Contato"
    )
    
    # Controle administrativo
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='new',
        verbose_name="Status"
    )
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='normal',
        verbose_name="Prioridade"
    )
    
    # Resposta do admin
    admin_response = models.TextField(
        blank=True,
        null=True,
        verbose_name="Resposta do Administrador"
    )
    responded_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="Data da Resposta"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")
    
    # Campos de controle
    is_read = models.BooleanField(default=False, verbose_name="Lida")
    ip_address = models.GenericIPAddressField(
        blank=True,
        null=True,
        verbose_name="Endereço IP"
    )
    
    class Meta:
        verbose_name = "Mensagem de Contato"
        verbose_name_plural = "Mensagens de Contato"
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.name} - {self.get_subject_display()}"
    
    def mark_as_read(self):
        """Marcar mensagem como lida"""
        self.is_read = True
        self.save(update_fields=['is_read'])
    
    def set_response(self, response_text):
        """Definir resposta do administrador"""
        self.admin_response = response_text
        self.responded_at = timezone.now()
        self.status = 'resolved'
        self.save(update_fields=['admin_response', 'responded_at', 'status'])
    
    @property
    def is_new(self):
        """Verificar se é uma mensagem nova"""
        return self.status == 'new'
    
    @property
    def days_since_created(self):
        """Calcular dias desde a criação"""
        return (timezone.now() - self.created_at).days
    
    @property
    def urgency_level(self):
        """Calcular nível de urgência baseado na prioridade e tempo"""
        if self.priority == 'urgent':
            return 4
        elif self.priority == 'high':
            return 3
        elif self.days_since_created > 2:
            return 2
        else:
            return 1
