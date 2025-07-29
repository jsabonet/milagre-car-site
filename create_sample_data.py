#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append('D:/Projectos/milagre-car-showcase-main/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'milagre_car.settings')
django.setup()

from cars.models import Category, Car

# Criar categorias se não existirem
if not Category.objects.exists():
    categories = [
        {'name': 'Sedan', 'description': 'Carros sedan'},
        {'name': 'SUV', 'description': 'Veículos utilitários esportivos'},
        {'name': 'Hatchback', 'description': 'Carros compactos'},
        {'name': 'Pickup', 'description': 'Camionetas'},
    ]
    for cat_data in categories:
        Category.objects.create(**cat_data)
    print('Categorias criadas!')

# Criar carros se não existirem
if Car.objects.count() < 5:
    sedan = Category.objects.get(name='Sedan')
    suv = Category.objects.get(name='SUV')
    
    cars = [
        {
            'make': 'Toyota',
            'model': 'Corolla',
            'year': 2022,
            'price': 1500000,
            'fuel_type': 'gasolina',
            'transmission': 'manual',
            'mileage': 25000,
            'color': 'Branco',
            'location': 'Maputo',
            'description': 'Toyota Corolla em excelente estado',
            'category': sedan,
            'is_available': True,
            'featured': True
        },
        {
            'make': 'Honda',
            'model': 'CR-V',
            'year': 2021,
            'price': 2200000,
            'fuel_type': 'gasolina',
            'transmission': 'automatic',
            'mileage': 35000,
            'color': 'Preto',
            'location': 'Maputo',
            'description': 'Honda CR-V SUV familiar',
            'category': suv,
            'is_available': True,
            'featured': False
        },
        {
            'make': 'Nissan',
            'model': 'X-Trail',
            'year': 2020,
            'price': 1800000,
            'fuel_type': 'gasolina',
            'transmission': 'automatic',
            'mileage': 45000,
            'color': 'Azul',
            'location': 'Matola',
            'description': 'Nissan X-Trail em bom estado',
            'category': suv,
            'is_available': True,
            'featured': True
        }
    ]
    
    for car_data in cars:
        Car.objects.create(**car_data)
    print('Carros criados!')

print('Dados de exemplo criados com sucesso!')
