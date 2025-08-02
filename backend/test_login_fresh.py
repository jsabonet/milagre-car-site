#!/usr/bin/env python3
import requests
import json

print("=== TESTE DE LOGIN ===")

# Fazer login
login_url = "http://127.0.0.1:8000/api/auth/login/"
login_data = {
    "username": "admin",
    "password": "admin123"
}

try:
    print("Fazendo login...")
    login_response = requests.post(login_url, json=login_data)
    print(f"Status: {login_response.status_code}")
    
    if login_response.status_code == 200:
        login_result = login_response.json()
        token = login_result.get('token')
        print(f"✅ Login bem-sucedido!")
        print(f"Token: {token}")
        print(f"User: {login_result.get('user', {}).get('username')}")
        
        # Testar API de mensagens
        print("\n=== TESTE API MENSAGENS ===")
        messages_url = "http://127.0.0.1:8000/api/contact-messages/"
        headers = {
            'Authorization': f'Token {token}',
            'Content-Type': 'application/json'
        }
        
        messages_response = requests.get(messages_url, headers=headers)
        print(f"Status mensagens: {messages_response.status_code}")
        
        if messages_response.status_code == 200:
            data = messages_response.json()
            count = len(data.get('results', data))
            print(f"✅ {count} mensagens encontradas")
        else:
            print(f"❌ Erro: {messages_response.text}")
            
    else:
        print(f"❌ Erro no login: {login_response.text}")
        
except Exception as e:
    print(f"❌ Erro: {e}")

print(f"\n🔑 Use este token no localStorage do browser:")
if 'token' in locals():
    print(f"localStorage.setItem('token', '{token}');")
