#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'milagre_car.settings')
django.setup()

from categories.models import Category
from cars.models import Car

def create_test_data():
    # Criar categorias
    categories_data = [
        {"name": "Sedan", "description": "Carros sedan confortáveis e elegantes"},
        {"name": "SUV", "description": "Veículos utilitários esportivos"},
        {"name": "Hatchback", "description": "Carros compactos e versáteis"},
        {"name": "Pickup", "description": "Caminhonetes para trabalho e lazer"},
        {"name": "Coupe", "description": "Carros esportivos de duas portas"},
    ]
    
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data["name"],
            defaults=cat_data
        )
        if created:
            print(f"Categoria criada: {category.name}")
        else:
            print(f"Categoria já existe: {category.name}")
    
    # Criar carros
    cars_data = [
        {
            "name": "Corolla",
            "brand": "Toyota",
            "year": 2022,
            "price": 1200000,
            "fuel": "Gasolina",
            "transmission": "Manual",
            "mileage": 25000,
            "color": "Branco",
            "location": "Maputo",
            "description": "Toyota Corolla em excelente estado, com baixa quilometragem e manutenção em dia.",
            "category": Category.objects.get(name="Sedan"),
            "featured": True,
        },
        {
            "name": "CR-V",
            "brand": "Honda",
            "year": 2021,
            "price": 1800000,
            "fuel": "Gasolina",
            "transmission": "Automática",
            "mileage": 35000,
            "color": "Prata",
            "location": "Maputo",
            "description": "Honda CR-V SUV completo, ideal para famílias que buscam conforto e segurança.",
            "category": Category.objects.get(name="SUV"),
            "featured": True,
        },
        {
            "name": "Golf",
            "brand": "Volkswagen",
            "year": 2020,
            "price": 900000,
            "fuel": "Gasolina",
            "transmission": "Manual",
            "mileage": 45000,
            "color": "Azul",
            "location": "Matola",
            "description": "Volkswagen Golf hatchback, econômico e confiável para o dia a dia.",
            "category": Category.objects.get(name="Hatchback"),
            "featured": False,
        },
        {
            "name": "Ranger",
            "brand": "Ford",
            "year": 2023,
            "price": 2200000,
            "fuel": "Diesel",
            "transmission": "Manual",
            "mileage": 15000,
            "color": "Preto",
            "location": "Beira",
            "description": "Ford Ranger pickup robusta, perfeita para trabalho e aventuras.",
            "category": Category.objects.get(name="Pickup"),
            "featured": True,
        },
        {
            "name": "320i",
            "brand": "BMW",
            "year": 2021,
            "price": 2500000,
            "fuel": "Gasolina",
            "transmission": "Automática",
            "mileage": 30000,
            "color": "Cinza",
            "location": "Maputo",
            "description": "BMW 320i sedan premium com acabamento de luxo e performance superior.",
            "category": Category.objects.get(name="Sedan"),
            "featured": True,
        },
        {
            "name": "X-Trail",
            "brand": "Nissan",
            "year": 2020,
            "price": 1600000,
            "fuel": "Gasolina",
            "transmission": "Automática",
            "mileage": 40000,
            "color": "Vermelho",
            "location": "Nampula",
            "description": "Nissan X-Trail SUV familiar com espaço generoso e conforto garantido.",
            "category": Category.objects.get(name="SUV"),
            "featured": False,
        }
    ]
    
    for car_data in cars_data:
        car, created = Car.objects.get_or_create(
            name=car_data["name"],
            brand=car_data["brand"],
            year=car_data["year"],
            defaults=car_data
        )
        if created:
            print(f"Carro criado: {car.brand} {car.name} {car.year}")
        else:
            print(f"Carro já existe: {car.brand} {car.name} {car.year}")

if __name__ == "__main__":
    create_test_data()
    print("Dados de teste criados com sucesso!")
