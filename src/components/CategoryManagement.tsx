import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Tag,
  Car,
  AlertCircle,
  CheckCircle,
  Folder,
  FolderPlus
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  carCount: number;
  isActive: boolean;
  createdAt: Date;
}

const initialCategories: Category[] = [
  {
    id: '1',
    name: 'Sedan',
    description: 'Carros sedan tradicionais com 4 portas',
    color: 'blue',
    carCount: 25,
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'SUV',
    description: 'Veículos utilitários esportivos',
    color: 'green',
    carCount: 18,
    isActive: true,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Hatchback',
    description: 'Carros compactos ideais para cidade',
    color: 'orange',
    carCount: 32,
    isActive: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '4',
    name: 'Pickup',
    description: 'Caminhonetes para trabalho e lazer',
    color: 'purple',
    carCount: 12,
    isActive: true,
    createdAt: new Date('2024-02-10')
  },
  {
    id: '5',
    name: 'Conversível',
    description: 'Carros com capota retrátil',
    color: 'red',
    carCount: 5,
    isActive: false,
    createdAt: new Date('2024-02-15')
  }
];

interface CategoryManagementProps {
  onCategoryCreated?: (category: Category) => void;
  onCategoryUpdated?: (category: Category) => void;
  onCategoryDeleted?: (categoryId: string) => void;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  onCategoryCreated,
  onCategoryUpdated,
  onCategoryDeleted
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const colors = [
    { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
    { value: 'green', label: 'Verde', class: 'bg-green-500' },
    { value: 'orange', label: 'Laranja', class: 'bg-orange-500' },
    { value: 'purple', label: 'Roxo', class: 'bg-purple-500' },
    { value: 'red', label: 'Vermelho', class: 'bg-red-500' },
    { value: 'yellow', label: 'Amarelo', class: 'bg-yellow-500' },
    { value: 'pink', label: 'Rosa', class: 'bg-pink-500' },
    { value: 'gray', label: 'Cinza', class: 'bg-gray-500' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome da categoria é obrigatório';
    } else if (categories.some(cat => 
      cat.name.toLowerCase() === formData.name.toLowerCase() && 
      cat.id !== editingCategory?.id
    )) {
      newErrors.name = 'Já existe uma categoria com este nome';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (editingCategory) {
      // Update existing category
      const updatedCategory: Category = {
        ...editingCategory,
        name: formData.name,
        description: formData.description,
        color: formData.color
      };
      
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id ? updatedCategory : cat
      ));
      
      onCategoryUpdated?.(updatedCategory);
      setEditingCategory(null);
    } else {
      // Create new category
      const newCategory: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        description: formData.description,
        color: formData.color,
        carCount: 0,
        isActive: true,
        createdAt: new Date()
      };
      
      setCategories(prev => [...prev, newCategory]);
      onCategoryCreated?.(newCategory);
      setIsCreating(false);
    }

    // Reset form
    setFormData({ name: '', description: '', color: 'blue' });
    setErrors({});
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setIsCreating(false);
    setFormData({ name: '', description: '', color: 'blue' });
    setErrors({});
  };

  const toggleCategoryStatus = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const deleteCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category && category.carCount > 0) {
      alert(`Não é possível excluir a categoria "${category.name}" pois ela possui ${category.carCount} carro(s) cadastrado(s).`);
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      onCategoryDeleted?.(categoryId);
    }
  };

  const getColorClass = (color: string) => {
    const colorConfig = colors.find(c => c.value === color);
    return colorConfig?.class || 'bg-gray-500';
  };

  const activeCategories = categories.filter(cat => cat.isActive);
  const inactiveCategories = categories.filter(cat => !cat.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Categorias</h1>
          <p className="text-gray-600">Organize seus veículos por categorias</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)} 
          className="flex items-center gap-2"
          disabled={isCreating || editingCategory !== null}
        >
          <FolderPlus className="h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-sm text-gray-600">Total de Categorias</p>
              </div>
              <Folder className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{activeCategories.length}</p>
                <p className="text-sm text-gray-600">Ativas</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{inactiveCategories.length}</p>
                <p className="text-sm text-gray-600">Inativas</p>
              </div>
              <X className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {categories.reduce((sum, cat) => sum + cat.carCount, 0)}
                </p>
                <p className="text-sm text-gray-600">Total de Carros</p>
              </div>
              <Car className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingCategory) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </CardTitle>
            <CardDescription>
              {editingCategory ? 'Modifique as informações da categoria' : 'Crie uma nova categoria para organizar seus veículos'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Categoria *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: SUV Compacto"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Cor da Categoria</Label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                        className={`w-8 h-8 rounded-full ${color.class} ${
                          formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva esta categoria de veículos..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={errors.description ? 'border-red-500' : ''}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="space-y-6">
        {/* Active Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Categorias Ativas ({activeCategories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCategories.map(category => (
                <div key={category.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${getColorClass(category.color)}`} />
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">
                        {category.carCount} carro(s)
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Criada em {category.createdAt.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => startEdit(category)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleCategoryStatus(category.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteCategory(category.id)}
                        disabled={category.carCount > 0}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inactive Categories */}
        {inactiveCategories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <X className="h-5 w-5 text-orange-500" />
                Categorias Inativas ({inactiveCategories.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactiveCategories.map(category => (
                  <div key={category.id} className="border rounded-lg p-4 opacity-60">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${getColorClass(category.color)}`} />
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <Badge variant="outline" className="text-orange-600">
                        Inativa
                      </Badge>
                      
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleCategoryStatus(category.id)}
                          title="Reativar categoria"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteCategory(category.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
