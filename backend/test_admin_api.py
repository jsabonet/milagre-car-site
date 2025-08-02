#!/usr/bin/env python3
import requests
import json

# Primeiro, fazer login para obter token
login_url = "http://127.0.0.1:8000/api/auth/login/"
login_data = {
    "username": "admin",
    "password": "admin123"
}

print("=== TESTE API ADMIN ===")

try:
    # Login
    print("1. Fazendo login...")
    login_response = requests.post(login_url, json=login_data)
    print(f"Login Status: {login_response.status_code}")
    
    if login_response.status_code == 200:
        login_result = login_response.json()
        token = login_result.get('token')
        print(f"Token obtido: {token[:20]}...")
        
        # Testar endpoint de mensagens
        messages_url = "http://127.0.0.1:8000/api/contact-messages/"
        headers = {
            'Authorization': f'Token {token}',
            'Content-Type': 'application/json'
        }
        
        print("\n2. Buscando mensagens...")
        messages_response = requests.get(messages_url, headers=headers)
        print(f"Mensagens Status: {messages_response.status_code}")
        
        if messages_response.status_code == 200:
            messages_data = messages_response.json()
            print(f"Total de mensagens retornadas: {len(messages_data.get('results', []))}")
            
            for msg in messages_data.get('results', [])[:3]:
                print(f"- {msg.get('name')}: {msg.get('subject_display', msg.get('subject'))}")
        else:
            print(f"Erro: {messages_response.text}")
            
        # Testar stats
        print("\n3. Buscando estatísticas...")
        stats_url = "http://127.0.0.1:8000/api/contact-messages/stats/"
        stats_response = requests.get(stats_url, headers=headers)
        print(f"Stats Status: {stats_response.status_code}")
        
        if stats_response.status_code == 200:
            stats_data = stats_response.json()
            print(f"Stats: {json.dumps(stats_data, indent=2)}")
        else:
            print(f"Erro stats: {stats_response.text}")
            
    else:
        print(f"Erro no login: {login_response.text}")
        
except Exception as e:
    print(f"Erro: {e}")
