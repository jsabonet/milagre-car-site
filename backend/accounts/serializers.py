from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Credenciais inválidas')
            if not user.is_active:
                raise serializers.ValidationError('Conta desativada')
            if not user.is_staff:
                raise serializers.ValidationError('Acesso não autorizado')
            data['user'] = user
            return data
        else:
            raise serializers.ValidationError('Username e password são obrigatórios')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser']
        read_only_fields = ['id']
