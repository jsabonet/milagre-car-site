from django.db import models

class Category(models.Model):
    """Modelo para categorias de carros"""
    name = models.CharField(max_length=100, unique=True, verbose_name="Nome")
    description = models.TextField(blank=True, verbose_name="Descrição")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")
    
    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    @property
    def car_count(self):
        """Retorna o número de carros nesta categoria"""
        return self.cars.count()
