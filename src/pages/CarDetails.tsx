import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Fuel, Gauge, MapPin, Edit, Trash2 } from 'lucide-react';
import { useCar } from '@/hooks/useApi';
import CarImageUpload from '@/components/CarImageUpload';
import CarImageGallery from '@/components/CarImageGallery';
import { formatPrice } from '@/lib/mozambique-utils';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const carId = id ? parseInt(id) : 0;
  
  const { data: car, loading, error, refetch } = useCar(carId);
  const [images, setImages] = useState(car?.images || []);

  const handleImagesUpdated = (newImages: any[]) => {
    setImages(newImages);
    refetch(); // Recarregar dados do carro
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Erro</h2>
              <p className="text-muted-foreground mb-4">
                {error || 'Carro não encontrado'}
              </p>
              <Button onClick={() => navigate('/')}>
                Voltar ao Início
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Car Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    {car.brand} {car.name}
                  </CardTitle>
                  <Badge variant={car.featured ? "default" : "secondary"}>
                    {car.featured ? "Destaque" : "Regular"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {car.formatted_price || formatPrice(car.price)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Categoria: {car.category.name}
                  </p>
                </div>

                <Separator />

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{car.year}</span>
                  </div>
                  
                  {car.mileage && (
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span>{(car.mileage / 1000).toFixed(0)}k km</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span>{car.fuel_type || car.fuel}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{car.location || "Maputo"}</span>
                  </div>
                </div>

                {car.description && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Descrição</h4>
                      <p className="text-muted-foreground">
                        {car.description}
                      </p>
                    </div>
                  </>
                )}

                {/* Actions */}
                <Separator />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Gallery and Management */}
          <div className="space-y-6">
            {/* Car Image Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Galeria de Imagens</CardTitle>
              </CardHeader>
              <CardContent>
                <CarImageGallery 
                  images={car.images} 
                  carName={`${car.brand} ${car.name}`}
                />
              </CardContent>
            </Card>

            {/* Image Management for Admins */}
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Imagens</CardTitle>
              </CardHeader>
              <CardContent>
                <CarImageUpload
                  carId={carId}
                  existingImages={car.images}
                  onImagesUpdated={handleImagesUpdated}
                  maxFiles={10}
                  maxSize={5}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CarDetails;
