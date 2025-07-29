from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    car_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'car_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'car_count']

class CategoryListSerializer(serializers.ModelSerializer):
    car_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'car_count']
