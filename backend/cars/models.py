from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from categories.models import Category

class Car(models.Model):
    """Modelo para carros"""
    
    FUEL_CHOICES = [
        ('Gasolina', 'Gasolina'),
        ('Diesel', 'Diesel'),
    ]
    
    TRANSMISSION_CHOICES = [
        ('Manual', 'Manual'),
        ('Automática', 'Automática'),
        ('CVT', 'CVT'),
        ('Semi-automática', 'Semi-automática'),
    ]
    
    # Informações básicas
    name = models.CharField(max_length=200, verbose_name="Nome do Modelo")
    brand = models.CharField(max_length=100, verbose_name="Marca")
    year = models.IntegerField(
        validators=[MinValueValidator(1990), MaxValueValidator(2030)],
        verbose_name="Ano"
    )
    
    # Preço e financeiro
    price = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        validators=[MinValueValidator(0)],
        verbose_name="Preço (MZN)"
    )
    
    # Especificações técnicas
    mileage = models.IntegerField(
        validators=[MinValueValidator(0)],
        default=0,
        verbose_name="Quilometragem"
    )
    fuel = models.CharField(
        max_length=20, 
        choices=FUEL_CHOICES, 
        default='Gasolina',
        verbose_name="Combustível"
    )
    transmission = models.CharField(
        max_length=20, 
        choices=TRANSMISSION_CHOICES, 
        default='Manual',
        verbose_name="Transmissão"
    )
    color = models.CharField(max_length=50, blank=True, verbose_name="Cor")
    
    # Localização e categoria
    location = models.CharField(max_length=200, blank=True, verbose_name="Localização")
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='cars',
        verbose_name="Categoria"
    )
    
    # Descrição e detalhes
    description = models.TextField(blank=True, verbose_name="Descrição")
    featured = models.BooleanField(default=False, verbose_name="Destaque")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")
    
    class Meta:
        verbose_name = "Carro"
        verbose_name_plural = "Carros"
        ordering = ['-created_at', 'name']
    
    def __str__(self):
        return f"{self.brand} {self.name} ({self.year})"
    
    @property
    def formatted_price(self):
        """Retorna o preço formatado em MZN"""
        return f"{self.price:,.0f} MZN".replace(',', '.')

class CarImage(models.Model):
    """Modelo para imagens dos carros"""
    car = models.ForeignKey(
        Car, 
        on_delete=models.CASCADE, 
        related_name='images',
        verbose_name="Carro"
    )
    image = models.ImageField(
        upload_to='cars/%Y/%m/',
        verbose_name="Imagem"
    )
    alt_text = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Texto Alternativo"
    )
    is_primary = models.BooleanField(default=False, verbose_name="Imagem Principal")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    
    class Meta:
        verbose_name = "Imagem do Carro"
        verbose_name_plural = "Imagens dos Carros"
        ordering = ['-is_primary', 'created_at']
    
    def __str__(self):
        return f"Imagem de {self.car.brand} {self.car.name}"
    
    def save(self, *args, **kwargs):
        # Se esta imagem está marcada como principal, remove o flag das outras
        if self.is_primary:
            CarImage.objects.filter(car=self.car, is_primary=True).update(is_primary=False)
        
        # Auto-gerar alt_text se não fornecido
        if not self.alt_text:
            self.alt_text = f"{self.car.brand} {self.car.name} - {self.car.year}"
        
        super().save(*args, **kwargs)
