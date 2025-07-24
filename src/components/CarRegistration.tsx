import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Save, 
  X, 
  Car, 
  Upload,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Fuel,
  Gauge,
  Palette,
  MapPin,
  Info
} from "lucide-react";
import { cars } from "@/data/cars";
import { formatPrice, formatNumber } from "@/lib/mozambique-utils";

interface CarFormData {
  name: string;
  brand: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  color: string;
  location: string;
  category: string;
  description: string;
  featured: boolean;
  images: string[];
}

const initialFormData: CarFormData = {
  name: '',
  brand: '',
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  fuel: 'Flex',
  transmission: 'Manual',
  color: '',
  location: '',
  category: 'Sedan',
  description: '',
  featured: false,
  images: []
};

interface CarRegistrationProps {
  onCarCreated: (car: CarFormData) => void;
}

export const CarRegistration: React.FC<CarRegistrationProps> = ({ onCarCreated }) => {
  const [formData, setFormData] = useState<CarFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Get unique values for dropdowns
  const brands = Array.from(new Set(cars.map(car => car.brand))).sort();
  const categories = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Pickup', 'Van', 'Conversível', 'Crossover'];
  const fuelTypes = ['Gasolina', 'Etanol', 'Flex', 'Diesel', 'Híbrido', 'Elétrico'];
  const transmissionTypes = ['Manual', 'Automático', 'CVT', 'Semi-automático'];
  const locations = ['Maputo', 'Matola', 'Beira', 'Nampula', 'Chimoio', 'Nacala', 'Quelimane', 'Tete', 'Xai-Xai', 'Lichinga'];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.brand.trim()) newErrors.brand = 'Marca é obrigatória';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Ano inválido';
    }
    if (formData.price <= 0) newErrors.price = 'Preço deve ser maior que zero';
    if (formData.mileage < 0) newErrors.mileage = 'Quilometragem não pode ser negativa';
    if (!formData.color.trim()) newErrors.color = 'Cor é obrigatória';
    if (!formData.location.trim()) newErrors.location = 'Localização é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CarFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onCarCreated(formData);
      setFormData(initialFormData);
      setCurrentStep(1);
      setErrors({});
    } catch (error) {
      console.error('Erro ao cadastrar carro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: 'Informações Básicas',
      description: 'Dados principais do veículo',
      icon: <Car className="h-5 w-5" />
    },
    {
      title: 'Especificações',
      description: 'Detalhes técnicos e características',
      icon: <Info className="h-5 w-5" />
    },
    {
      title: 'Localização e Extras',
      description: 'Localização e recursos adicionais',
      icon: <MapPin className="h-5 w-5" />
    }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Modelo *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Civic Touring"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
                <Label htmlFor="brand">Marca *</Label>
                <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
                  <SelectTrigger className={errors.brand ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                    <SelectItem value="other">Outra marca...</SelectItem>
                  </SelectContent>
                </Select>
                {errors.brand && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.brand}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Ano *</Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  className={errors.year ? 'border-red-500' : ''}
                />
                {errors.year && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.year}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                  />
                </div>
                {formData.price > 0 && (
                  <p className="text-sm text-gray-600">{formatPrice(formData.price)}</p>
                )}
                {errors.price && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.price}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Cor *</Label>
                <div className="relative">
                  <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="color"
                    placeholder="Ex: Branco Pérola"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className={`pl-10 ${errors.color ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.color && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.color}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mileage">Quilometragem</Label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="0"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                    className={`pl-10 ${errors.mileage ? 'border-red-500' : ''}`}
                  />
                </div>
                {formData.mileage > 0 && (
                  <p className="text-sm text-gray-600">{formatNumber(formData.mileage)} km</p>
                )}
                {errors.mileage && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.mileage}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel">Combustível</Label>
                <Select value={formData.fuel} onValueChange={(value) => handleInputChange('fuel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o combustível" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map(fuel => (
                      <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">Transmissão</Label>
                <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a transmissão" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissionTypes.map(transmission => (
                      <SelectItem key={transmission} value={transmission}>{transmission}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva as características e diferenciais do veículo..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">Localização *</Label>
              <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                <SelectTrigger className={errors.location ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione a localização" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.location}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
              <Label htmlFor="featured" className="flex items-center gap-2">
                <span>Destacar este veículo</span>
                <Badge variant="secondary">Premium</Badge>
              </Label>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resumo do Cadastro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Veículo</p>
                  <p className="font-semibold">{formData.brand} {formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ano</p>
                  <p className="font-semibold">{formData.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Preço</p>
                  <p className="font-semibold text-green-600">{formatPrice(formData.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Localização</p>
                  <p className="font-semibold">{formData.location}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Carro</h1>
          <p className="text-gray-600">Adicione um novo veículo ao inventário</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Etapa {currentStep} de {steps.length}
        </Badge>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;

              return (
                <div key={stepNumber} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isCompleted ? 'bg-green-500 border-green-500 text-white' :
                    isActive ? 'bg-blue-500 border-blue-500 text-white' :
                    'bg-white border-gray-300 text-gray-500'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : step.icon}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`absolute top-5 w-full h-0.5 ${
                      stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    } -z-10`} style={{ left: '50%', width: '100%' }} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {steps[currentStep - 1].icon}
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            <Separator className="my-6" />

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Anterior
              </Button>

              <div className="flex gap-2">
                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Salvando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Cadastrar Carro
                      </div>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarRegistration;
