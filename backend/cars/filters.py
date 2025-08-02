import django_filters
from .models import Car

class CarFilter(django_filters.FilterSet):
    make = django_filters.CharFilter(field_name='brand', lookup_expr='icontains')
    model = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    brand = django_filters.CharFilter(lookup_expr='icontains')
    name = django_filters.CharFilter(lookup_expr='icontains')
    year_min = django_filters.NumberFilter(field_name='year', lookup_expr='gte')
    year_max = django_filters.NumberFilter(field_name='year', lookup_expr='lte')
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    mileage_max = django_filters.NumberFilter(field_name='mileage', lookup_expr='lte')
    fuel_type = django_filters.CharFilter(field_name='fuel', lookup_expr='icontains')
    fuel = django_filters.ChoiceFilter(choices=Car.FUEL_CHOICES)
    transmission = django_filters.ChoiceFilter(choices=Car.TRANSMISSION_CHOICES)
    category = django_filters.NumberFilter(field_name='category__id')
    featured = django_filters.BooleanFilter()
    location = django_filters.CharFilter(lookup_expr='icontains')
    color = django_filters.CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = Car
        fields = [
            'make', 'model', 'brand', 'name', 'year_min', 'year_max', 
            'price_min', 'price_max', 'mileage_max', 'fuel_type', 'fuel',
            'transmission', 'category', 'featured', 'location', 'color'
        ]
