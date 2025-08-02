from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.core.exceptions import PermissionDenied
import logging
from .models import Car, CarImage
from .serializers import CarListSerializer, CarDetailSerializer, CarCreateSerializer, CarImageSerializer
from .filters import CarFilter

logger = logging.getLogger(__name__)

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.select_related('category').prefetch_related('images')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = CarFilter
    search_fields = ['brand', 'name', 'description', 'location']  # <-- Corrigido para usar 'brand' e 'name'
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
                'automatic': 'Automática',
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
        
        # Check if description is present
        if 'description' in data:
            logger.info(f"Description found: '{data['description']}'")
        else:
            logger.info("Description field not found in data")
        
        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            logger.error(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            self.perform_create(serializer)
            logger.info("Car created successfully")
            headers = self.get_success_headers(serializer.data)
            # Garante que o campo 'id' está presente na resposta
            response_data = serializer.data
            if 'id' not in response_data and hasattr(serializer.instance, 'id'):
                response_data['id'] = serializer.instance.id
            return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)
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
        import logging
        logger = logging.getLogger("cars")
        car = self.get_object()
        images = request.FILES.getlist('images')

        logger.info(f"[add_images] Carro ID: {car.id}")
        logger.info(f"[add_images] Arquivos recebidos: {[f.name for f in images]}")
        logger.info(f"[add_images] Dados recebidos: {dict(request.data)}")

        if not images:
            logger.warning("[add_images] Nenhuma imagem fornecida")
            return Response(
                {'error': 'Nenhuma imagem fornecida'},
                status=status.HTTP_400_BAD_REQUEST
            )

        created_images = []
        existing_images_count = car.images.count()

        # Buscar alt_texts enviados pelo frontend
        alt_texts = []
        for idx in range(len(images)):
            alt_text = request.data.get(f'alt_text_{idx}', '')
            alt_texts.append(alt_text)
        logger.info(f"[add_images] alt_texts extraídos: {alt_texts}")

        # Verificar se alguma imagem deve ser marcada como primária
        is_primary_flag = request.data.get('is_primary', None)
        logger.info(f"[add_images] is_primary_flag: {is_primary_flag}")
        for index, image in enumerate(images):
            is_primary = False
            if is_primary_flag == 'true' or is_primary_flag is True:
                is_primary = (index == 0)
            elif existing_images_count == 0 and index == 0:
                is_primary = True

            alt_text = alt_texts[index] if index < len(alt_texts) else ''
            logger.info(f"[add_images] Salvando imagem {image.name} (is_primary={is_primary}, alt_text={alt_text})")

            car_image = CarImage.objects.create(
                car=car,
                image=image,
                is_primary=is_primary,
                alt_text=alt_text or f"{car.brand} {car.name} - Imagem {existing_images_count + index + 1}"
            )
            created_images.append(car_image)

        logger.info(f"[add_images] Total de imagens criadas: {len(created_images)}")
        serializer = CarImageSerializer(created_images, many=True, context={'request': request})

        logger.info(f"[add_images] Imagens serializadas: {serializer.data}")

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
        logger.info(f"set_primary_image chamado para carro {pk} com dados: {request.data}")
        
        car = self.get_object()
        image_id = request.data.get('image_id')
        
        if not image_id:
            logger.warning(f"ID da imagem não fornecido para carro {pk}")
            return Response(
                {'error': 'ID da imagem é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            logger.info(f"Removendo flag primário de todas as imagens do carro {pk}")
            # Remove o flag primário de todas as imagens
            car.images.update(is_primary=False)
            
            # Define a nova imagem como primária
            car_image = car.images.get(id=image_id)
            car_image.is_primary = True
            car_image.save()
            
            logger.info(f"Imagem {image_id} definida como primária para carro {pk}")
            
            return Response({
                'message': 'Imagem definida como primária',
                'image_id': image_id
            })
            
        except CarImage.DoesNotExist:
            return Response(
                {'error': 'Imagem não encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def get_permissions(self):
        """Permissões baseadas na ação"""
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'toggle_featured', 'add_images', 'remove_image', 'set_primary_image']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """Verificar se usuário é admin ao criar"""
        if not (self.request.user.is_staff or self.request.user.is_superuser):
            raise PermissionDenied("Apenas administradores podem criar carros")
        serializer.save()
    
    def perform_update(self, serializer):
        """Verificar se usuário é admin ao atualizar"""
        if not (self.request.user.is_staff or self.request.user.is_superuser):
            raise PermissionDenied("Apenas administradores podem editar carros")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Verificar se usuário é admin ao deletar"""
        if not (self.request.user.is_staff or self.request.user.is_superuser):
            raise PermissionDenied("Apenas administradores podem deletar carros")
        instance.delete()

