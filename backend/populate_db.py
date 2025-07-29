#!/usr/bin/env python
import os
import django
import sys

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'milagre_car.settings')
django.setup()

from categories.models import Category
from cars.models import Car

def create_categories():
    """Criar categorias de exemplo"""
    categories_data = [
        {'name': 'Sedan', 'description': 'Carros sedan confortáveis e elegantes'},
        {'name': 'SUV', 'description': 'Veículos utilitários esportivos'},
        {'name': 'Hatchback', 'description': 'Carros compactos e econômicos'},
        {'name': 'Pickup', 'description': 'Caminhonetes para trabalho e lazer'},
        {'name': 'Coupe', 'description': 'Carros esportivos de duas portas'},
        {'name': 'Minivan', 'description': 'Veículos familiares espaçosos'},
    ]
    
    created_categories = []
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        created_categories.append(category)
        if created:
            print(f"Categoria criada: {category.name}")
        else:
            print(f"Categoria já existe: {category.name}")
    
    return created_categories

def create_cars(categories):
    """Criar carros de exemplo"""
    cars_data = [
        {
            'make': 'Toyota',
            'model': 'Corolla',
            'year': 2022,
            'price': 2500000,  # 2.5M MZN
            'fuel_type': 'gasolina',
            'transmission': 'automatic',
            'mileage': 15000,
            'color': 'Branco',
            'location': 'Maputo',
            'description': 'Toyota Corolla 2022 em excelente estado, com ar condicionado, direção hidráulica e sistema de som.',
            'category_name': 'Sedan',
            'featured': True,
        },
        {
            'make': 'Honda',
            'model': 'CR-V',
            'year': 2021,
            'price': 3200000,  # 3.2M MZN
            'fuel_type': 'gasolina',
            'transmission': 'automatic',
            'mileage': 25000,
            'color': 'Preto',
            'location': 'Maputo',
            'description': 'Honda CR-V 2021, SUV confiável com tração nas 4 rodas, ideal para família.',
            'category_name': 'SUV',
            'featured': True,
        },
        {
            'make': 'Mazda',
            'model': 'CX-5',
            'year': 2020,
            'price': 2800000,  # 2.8M MZN
            'fuel_type': 'gasolina',
            'transmission': 'manual',
            'mileage': 35000,
            'color': 'Azul',
            'location': 'Beira',
            'description': 'Mazda CX-5 2020, SUV elegante com excelente consumo de combustível.',
            'category_name': 'SUV',
            'featured': False,
        },
        {
            'make': 'Volkswagen',
            'model': 'Golf',
            'year': 2019,
            'price': 1800000,  # 1.8M MZN
            'fuel_type': 'gasolina',
            'transmission': 'manual',
            'mileage': 45000,
            'color': 'Vermelho',
            'location': 'Maputo',
            'description': 'Volkswagen Golf 2019, hatchback econômico e confiável.',
            'category_name': 'Hatchback',
            'featured': False,
        },
        {
            'make': 'Ford',
            'model': 'Ranger',
            'year': 2023,
            'price': 4500000,  # 4.5M MZN
            'fuel_type': 'diesel',
            'transmission': 'automatic',
            'mileage': 5000,
            'color': 'Cinza',
            'location': 'Nampula',
            'description': 'Ford Ranger 2023, pickup robusta para trabalho e aventura.',
            'category_name': 'Pickup',
            'featured': True,
        },
        {
            'make': 'BMW',
            'model': '320i',
            'year': 2021,
            'price': 3800000,  # 3.8M MZN
            'fuel_type': 'gasolina',
            'transmission': 'automatic',
            'mileage': 20000,
            'color': 'Branco Pérola',
            'location': 'Maputo',
            'description': 'BMW 320i 2021, sedan de luxo com acabamento premium.',
            'category_name': 'Sedan',
            'featured': True,
        }
    ]
    
    # Criar dicionário de categorias
    category_dict = {cat.name: cat for cat in categories}
    
    for car_data in cars_data:
        category_name = car_data.pop('category_name')
        category = category_dict.get(category_name)
        
        if not category:
            print(f"Categoria não encontrada: {category_name}")
            continue
            
        car, created = Car.objects.get_or_create(
            make=car_data['make'],
            model=car_data['model'],
            year=car_data['year'],
            defaults={**car_data, 'category': category}
        )
        
        if created:
            print(f"Carro criado: {car.make} {car.model} {car.year}")
        else:
            print(f"Carro já existe: {car.make} {car.model} {car.year}")

def main():
    print("Populando banco de dados com dados de exemplo...")
    
    # Criar categorias
    categories = create_categories()
    print(f"\nCategorias criadas: {len(categories)}")
    
    # Criar carros
    create_cars(categories)
    
    print("\nBanco de dados populado com sucesso!")
    print(f"Total de categorias: {Category.objects.count()}")
    print(f"Total de carros: {Car.objects.count()}")

if __name__ == '__main__':
    main()
