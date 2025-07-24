import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Fuel, Gauge, MapPin } from "lucide-react";

interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  location: string;
  images: string[];
  category: string;
  featured?: boolean;
}

interface CarCardProps {
  car: Car;
  onViewDetails: (car: Car) => void;
  viewMode?: 'grid' | 'list';
}

const CarCard = ({ car, onViewDetails, viewMode = 'grid' }: CarCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return `${(mileage / 1000).toFixed(0)}k km`;
  };

  return (
    <Card className={`group overflow-hidden bg-gradient-card hover:shadow-card transition-all duration-300 hover:scale-[1.02] ${viewMode === 'list' ? 'flex flex-row' : ''}`}>
      <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
        <img
          src={car.images[0] || "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80"}
          alt={car.name}
          className={`object-cover group-hover:scale-110 transition-transform duration-500 ${viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'}`}
        />
        {car.featured && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            Destaque
          </Badge>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {car.category}
          </Badge>
        </div>
      </div>

      <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {car.name}
            </h3>
            <p className="text-muted-foreground text-sm">{car.brand}</p>
          </div>

          <div className={`grid gap-3 text-sm text-muted-foreground ${viewMode === 'list' ? 'grid-cols-4' : 'grid-cols-2'}`}>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              <span>{formatMileage(car.mileage)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4" />
              <span>{car.fuel}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{car.location}</span>
            </div>
          </div>

          <div className={`flex items-center justify-between pt-4 border-t border-border ${viewMode === 'list' ? 'mt-auto' : ''}`}>
            <div>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(car.price)}
              </p>
            </div>
            <Button 
              variant="premium" 
              size="sm"
              onClick={() => onViewDetails(car)}
            >
              Ver Detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;