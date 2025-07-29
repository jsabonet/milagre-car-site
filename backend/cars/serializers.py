from rest_framework import serializers
from .models import Car, CarImage
from categories.serializers import CategoryListSerializer

class CarImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CarImage
        fields = ['id', 'image', 'image_url', 'alt_text', 'is_primary', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

class CarListSerializer(serializers.ModelSerializer):
    category = CategoryListSerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    formatted_price = serializers.SerializerMethodField()
    make = serializers.CharField(source='brand', read_only=True)
    model = serializers.CharField(source='name', read_only=True)
    fuel_type = serializers.CharField(source='fuel', read_only=True)
    
    class Meta:
        model = Car
        fields = [
            'id', 'make', 'model', 'brand', 'name', 'year', 'price', 'formatted_price',
            'fuel_type', 'fuel', 'transmission', 'category', 'primary_image',
            'mileage', 'color', 'location', 'featured', 'created_at'
        ]
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image and primary_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary_image.image.url)
            return primary_image.image.url
        return "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80"
    
    def get_formatted_price(self, obj):
        return f"{obj.price:,.0f} MZN"

class CarDetailSerializer(serializers.ModelSerializer):
    category = CategoryListSerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
    images = CarImageSerializer(many=True, read_only=True)
    formatted_price = serializers.SerializerMethodField()
    
    # Frontend compatibility fields
    make = serializers.CharField(source='brand')
    model = serializers.CharField(source='name')
    fuel_type = serializers.CharField(source='fuel')
    is_available = serializers.BooleanField(default=True, write_only=True)  # Aceita mas ignora
    
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Car
        fields = [
            'id', 'make', 'model', 'brand', 'name', 'year', 'price', 'formatted_price',
            'fuel_type', 'fuel', 'transmission', 'mileage', 'color', 'location',
            'description', 'category', 'category_id', 'images', 'primary_image',
            'featured', 'created_at', 'updated_at', 'is_available'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'formatted_price']
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image and primary_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary_image.image.url)
            return primary_image.image.url
        return "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80"
    
    def get_formatted_price(self, obj):
        return f"{obj.price:,.0f} MZN"
    
    def validate_year(self, value):
        from datetime import datetime
        current_year = datetime.now().year
        if value < 1900 or value > current_year + 1:
            raise serializers.ValidationError(
                f"Ano deve estar entre 1900 e {current_year + 1}"
            )
        return value
    
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Preço deve ser maior que zero")
        return value
    
    def validate_mileage(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Quilometragem não pode ser negativa")
        return value

class CarCreateSerializer(serializers.ModelSerializer):
    images = CarImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Car
        fields = [
            'name', 'brand', 'year', 'price', 'fuel', 'transmission',
            'mileage', 'color', 'location', 'description', 'category', 'featured',
            'images', 'uploaded_images'
        ]
    
    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        car = Car.objects.create(**validated_data)
        
        # Criar imagens
        for index, image in enumerate(uploaded_images):
            CarImage.objects.create(
                car=car,
                image=image,
                is_primary=(index == 0),  # Primeira imagem é primária
                alt_text=f"{car.brand} {car.name} - Imagem {index + 1}"
            )
        
        return car
