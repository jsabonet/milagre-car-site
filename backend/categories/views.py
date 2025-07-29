from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Category
from .serializers import CategorySerializer, CategoryListSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CategoryListSerializer
        return CategorySerializer
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estatísticas das categorias"""
        total = self.get_queryset().count()
        with_cars = self.get_queryset().filter(cars__isnull=False).distinct().count()
        
        return Response({
            'total_categories': total,
            'categories_with_cars': with_cars,
            'empty_categories': total - with_cars
        })
