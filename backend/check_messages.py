#!/usr/bin/env python3
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'milagre_car.settings')
django.setup()

from contact_messages.models import ContactMessage

print("=== VERIFICAÇÃO DE MENSAGENS ===")
total = ContactMessage.objects.count()
print(f"Total de mensagens no banco: {total}")

if total > 0:
    print("\nMensagens recentes:")
    for msg in ContactMessage.objects.all()[:5]:
        print(f"- ID: {msg.id}")
        print(f"  Nome: {msg.name}")
        print(f"  Email: {msg.email}")
        print(f"  Assunto: {msg.get_subject_display()}")
        print(f"  Status: {msg.get_status_display()}")
        print(f"  Criada em: {msg.created_at}")
        print("---")
else:
    print("Nenhuma mensagem encontrada.")
