from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Modelo de usuário customizado"""
    phone = models.CharField(max_length=20, blank=True, verbose_name="Telefone")
    is_admin = models.BooleanField(default=False, verbose_name="É Administrador")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Corrigir conflitos de reverse accessor
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name="custom_user_set",
        related_query_name="custom_user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="custom_user_set",
        related_query_name="custom_user",
    )
    
    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
