#!/usr/bin/env python3
import requests
import json

# Teste da API de mensagens
url = "http://127.0.0.1:8000/api/contact-messages/"

# Dados de teste
test_data = {
    "name": "João Silva",
    "email": "joao@example.com", 
    "phone": "+258841234567",
    "subject": "test_drive",
    "message": "Gostaria de agendar um test drive para um Toyota Corolla",
    "preferred_contact": "whatsapp"
}

try:
    print("Enviando mensagem de teste...")
    response = requests.post(url, json=test_data)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        print("✅ Mensagem criada com sucesso!")
        data = response.json()
        print(f"ID da mensagem: {data.get('id', 'N/A')}")
    else:
        print("❌ Erro ao criar mensagem")
        
except Exception as e:
    print(f"Erro na requisição: {e}")
