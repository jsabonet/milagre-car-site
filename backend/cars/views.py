from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count
import logging
from .models import Car, CarImage
from .serializers import CarListSerializer, CarDetailSerializer, CarCreateSerializer, CarImageSerializer
from .filters import CarFilter

logger = logging.getLogger(__name__)

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.select_related('category').prefetch_related('images')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = CarFilter
    search_fields = ['make', 'model', 'description', 'features']
    ordering_fields = ['price', 'year', 'mileage', 'created_at']
    ordering = ['-created_at']
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CarListSerializer
        elif self.action == 'create':
            return CarCreateSerializer
        return CarDetailSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtros personalizados
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        min_year = self.request.query_params.get('min_year')
        max_year = self.request.query_params.get('max_year')
        featured_only = self.request.query_params.get('featured_only')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if min_year:
            queryset = queryset.filter(year__gte=min_year)
        if max_year:
            queryset = queryset.filter(year__lte=max_year)
        if featured_only == 'true':
            queryset = queryset.filter(featured=True)
            
        return queryset
    
    def create(self, request, *args, **kwargs):
        """Override create method to add detailed logging and field mapping"""
        logger.info(f"Creating car with data: {request.data}")
        
        # Create a mutable copy of the data to modify
        data = request.data.copy()
        
        # Map frontend fields to backend fields
        if 'model' in data and 'name' not in data:
            data['name'] = data['model']
        if 'make' in data and 'brand' not in data:
            data['brand'] = data['make']
        if 'fuel_type' in data and 'fuel' not in data:
            data['fuel'] = data['fuel_type']
        
        # Fix transmission values
        if 'transmission' in data:
            transmission_mapping = {
                'manual': 'Manual',
                'automática': 'Automática',
                'automatica': 'Automática',
                'cvt': 'CVT',
                'semi-automática': 'Semi-automática',
                'semi-automatica': 'Semi-automática',
            }
            transmission_value = data['transmission']
            if isinstance(transmission_value, list):
                transmission_value = transmission_value[0]
            lower_value = transmission_value.lower() if transmission_value else ''
            data['transmission'] = transmission_mapping.get(lower_value, transmission_value)
        
        # Fix fuel values
        if 'fuel' in data:
            fuel_mapping = {
                'gasolina': 'Gasolina',
                'diesel': 'Diesel',
            }
            fuel_value = data['fuel']
            if isinstance(fuel_value, list):
                fuel_value = fuel_value[0]
            lower_value = fuel_value.lower() if fuel_value else ''
            data['fuel'] = fuel_mapping.get(lower_value, fuel_value)
        
        logger.info(f"Mapped data: {data}")
        
        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            logger.error(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            self.perform_create(serializer)
            logger.info("Car created successfully")
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            logger.error(f"Error creating car: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Carros em destaque"""
        featured_cars = self.get_queryset().filter(featured=True)[:6]
        serializer = self.get_serializer(featured_cars, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estatísticas dos carros"""
        queryset = self.get_queryset()
        
        stats = {
            'total_cars': queryset.count(),
            'featured_cars': queryset.filter(featured=True).count(),
            'avg_price': queryset.aggregate(avg_price=Avg('price'))['avg_price'] or 0,
            'makes': queryset.values('brand').annotate(count=Count('id')).order_by('-count')[:5],
            'fuel_types': queryset.values('fuel').annotate(count=Count('id')),
            'price_ranges': {
                'under_500k': queryset.filter(price__lt=500000).count(),
                '500k_1m': queryset.filter(price__gte=500000, price__lt=1000000).count(),
                '1m_2m': queryset.filter(price__gte=1000000, price__lt=2000000).count(),
                'over_2m': queryset.filter(price__gte=2000000).count(),
            }
        }
        
        return Response(stats)
    
    @action(detail=True, methods=['post'])
    def toggle_featured(self, request, pk=None):
        """Alternar destaque do carro"""
        car = self.get_object()
        car.featured = not car.featured
        car.save()
        
        return Response({
            'id': car.id,
            'featured': car.featured,
            'message': f'Carro {"adicionado aos destaques" if car.featured else "removido dos destaques"} com sucesso'
        })
    
    @action(detail=True, methods=['post'])
    def add_images(self, request, pk=None):
        """Adicionar imagens ao carro"""
        car = self.get_object()
        images = request.FILES.getlist('images')
        
        if not images:
            return Response(
                {'error': 'Nenhuma imagem fornecida'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created_images = []
        existing_images_count = car.images.count()
        
        for index, image in enumerate(images):
            # Se é a primeira imagem do carro, marca como primária
            is_primary = existing_images_count == 0 and index == 0
            
            car_image = CarImage.objects.create(
                car=car,
                image=image,
                is_primary=is_primary,
                alt_text=f"{car.brand} {car.name} - Imagem {existing_images_count + index + 1}"
            )
            created_images.append(car_image)
        
        serializer = CarImageSerializer(created_images, many=True, context={'request': request})
        
        return Response({
            'message': f'{len(created_images)} imagens adicionadas com sucesso',
            'images': serializer.data
        })
    
    @action(detail=True, methods=['delete'])
    def remove_image(self, request, pk=None):
        """Remover uma imagem específica do carro"""
        car = self.get_object()
        image_id = request.data.get('image_id')
        
        if not image_id:
            return Response(
                {'error': 'ID da imagem é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            car_image = car.images.get(id=image_id)
            was_primary = car_image.is_primary
            car_image.delete()
            
            # Se a imagem removida era primária, definir outra como primária
            if was_primary:
                next_image = car.images.first()
                if next_image:
                    next_image.is_primary = True
                    next_image.save()
            
            return Response({'message': 'Imagem removida com sucesso'})
            
        except CarImage.DoesNotExist:
            return Response(
                {'error': 'Imagem não encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def set_primary_image(self, request, pk=None):
        """Definir uma imagem como primária"""
        car = self.get_object()
        image_id = request.data.get('image_id')
        
        if not image_id:
            return Response(
                {'error': 'ID da imagem é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Remove o flag primário de todas as imagens
            car.images.update(is_primary=False)
            
            # Define a nova imagem como primária
            car_image = car.images.get(id=image_id)
            car_image.is_primary = True
            car_image.save()
            
            return Response({
                'message': 'Imagem definida como primária',
                'image_id': image_id
            })
            
        except CarImage.DoesNotExist:
            return Response(
                {'error': 'Imagem não encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
