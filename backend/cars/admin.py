from django.contrib import admin
from .models import Car, CarImage

class CarImageInline(admin.TabularInline):
    model = CarImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary']
    readonly_fields = ['created_at']

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ['brand', 'name', 'year', 'price', 'fuel', 'transmission', 'featured', 'created_at']
    list_filter = ['brand', 'fuel', 'transmission', 'featured', 'category', 'created_at']
    search_fields = ['brand', 'name', 'description']
    list_editable = ['featured']
    inlines = [CarImageInline]
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('name', 'brand', 'year', 'category')
        }),
        ('Preço e Especificações', {
            'fields': ('price', 'fuel', 'transmission', 'mileage', 'color')
        }),
        ('Localização e Status', {
            'fields': ('location', 'featured')
        }),
        ('Descrição', {
            'fields': ('description',)
        }),
    )

@admin.register(CarImage)
class CarImageAdmin(admin.ModelAdmin):
    list_display = ['car', 'alt_text', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['car__brand', 'car__name', 'alt_text']
    list_editable = ['is_primary']
