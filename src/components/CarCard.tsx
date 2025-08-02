import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Fuel, Gauge, MapPin, Settings, ChevronLeft, ChevronRight, Images as ImagesIcon } from "lucide-react";
import { formatPrice, formatNumber } from "@/lib/mozambique-utils";
import { Car } from "@/services/api";
import { useState } from "react";
import { AdminOnly } from '@/components/AdminOnly';

interface CarCardProps {
  car: Car;
  onViewDetails: (car: Car) => void;
  viewMode?: 'grid' | 'list';
}

const CarCard = ({ car, onViewDetails, viewMode = 'grid' }: CarCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageNavigation, setShowImageNavigation] = useState(false);

  const formatMileage = (mileage: number) => {
    return `${(mileage / 1000).toFixed(0)}k km`;
  };

  // Corrigido: sempre prioriza imagens secundárias (array de objetos), mas usa primary_image se não houver
  const availableImages = Array.isArray(car.images) && car.images.length > 0
    ? car.images.map(img => ({
        ...img,
        image: img.image_url || img.image,
      }))
    : [{
        id: 0,
        image: car.primary_image || "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80",
        image_url: car.primary_image || "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80",
        alt_text: `${car.make} ${car.model}`,
        is_primary: true
      }];

  const currentImage = availableImages[currentImageIndex];

  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
  };

  const goToPreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + availableImages.length) % availableImages.length);
  };

  return (
    <Card className={`group overflow-hidden bg-gradient-card hover:shadow-card transition-all duration-300 hover:scale-[1.02] ${viewMode === 'list' ? 'flex flex-row' : ''}`}>
      <div 
        className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}
        onMouseEnter={() => setShowImageNavigation(true)}
        onMouseLeave={() => setShowImageNavigation(false)}
      >
        <img
          src={currentImage?.image_url || currentImage?.image}
          alt={currentImage?.alt_text || `${car.make} ${car.model}`}
          className={`object-cover group-hover:scale-110 transition-transform duration-500 ${viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'}`}
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {car.category.name}
          </Badge>
        </div>

        {/* Primary Image Indicator */}
        {currentImage?.is_primary && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-yellow-500 text-black text-xs">
              Principal
            </Badge>
          </div>
        )}

        {/* Multiple Images Indicator */}
        {availableImages.length > 1 && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-black/70 text-white text-xs">
              <ImagesIcon className="h-3 w-3 mr-1" />
              {availableImages.length}
            </Badge>
          </div>
        )}

        {/* Image Navigation */}
        {availableImages.length > 1 && showImageNavigation && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100 z-10"
              onClick={goToPreviousImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100 z-10"
              onClick={goToNextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Dots Indicator */}
        {availableImages.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1">
            {availableImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {car.make} {car.model}
            </h3>
            <p className="text-muted-foreground text-sm">{car.year}</p>
            {car.description && car.description.trim() !== '' && (
              <p className="text-muted-foreground text-xs mt-2 leading-relaxed overflow-hidden" 
                 style={{
                   display: '-webkit-box',
                   WebkitLineClamp: 2,
                   WebkitBoxOrient: 'vertical',
                   textOverflow: 'ellipsis'
                 }}>
                {car.description.length > 120 ? `${car.description.substring(0, 120)}...` : car.description}
              </p>
            )}
          </div>

          <div className={`grid gap-3 text-sm text-muted-foreground ${viewMode === 'list' ? 'grid-cols-5' : 'grid-cols-2'}`}>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{car.year}</span>
            </div>
            {car.mileage && (
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                <span>{formatMileage(car.mileage)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4" />
              <span>{car.fuel_type || car.fuel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{car.location || "Maputo"}</span>
            </div>
          </div>

          <div className={`flex items-center justify-between pt-4 border-t border-border ${viewMode === 'list' ? 'mt-auto' : ''}`}>
            <div>
              <p className="text-2xl font-bold text-primary">{car.formatted_price || formatPrice(car.price)}</p>
              <p className="text-xs text-gray-500 mt-1">
                *Parcelamento disponível
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="premium" 
                size="sm"
                onClick={() => onViewDetails(car)}
              >
                Ver Detalhes
              </Button>
              
              {/* Botão de edição apenas para admins */}
              <AdminOnly>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(`/admin/cars/${car.id}/edit`, '_blank')}
                >
                  Editar
                </Button>
              </AdminOnly>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;