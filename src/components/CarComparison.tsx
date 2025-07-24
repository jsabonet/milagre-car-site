import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GitCompare, X, Calendar, Fuel, Gauge, MapPin, Palette, Settings2 } from "lucide-react";
import { Car } from "@/data/cars";

interface CarComparisonProps {
  selectedCarIds: string[];
  cars: Car[];
  onRemoveCar: (carId: string) => void;
  onClearAll: () => void;
}

const CarComparison = ({ selectedCarIds, cars, onRemoveCar, onClearAll }: CarComparisonProps) => {
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const selectedCars = cars.filter(car => selectedCarIds.includes(car.id));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return `${(mileage / 1000).toFixed(0)}k km`;
  };

  const ComparisonTable = () => (
    <div className="space-y-6">
      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {selectedCars.map((car) => (
          <div key={car.id} className="space-y-3">
            <div className="relative">
              <img
                src={car.images[0]}
                alt={car.name}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => onRemoveCar(car.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-sm">{car.name}</h4>
              <p className="text-xs text-muted-foreground">{car.brand}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Comparison Details */}
      <div className="space-y-4">
        {/* Price */}
        <div>
          <h4 className="font-semibold mb-3 text-foreground">Preço</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {selectedCars.map((car) => (
              <div key={car.id} className="text-center">
                <p className="text-lg font-bold text-primary">{formatPrice(car.price)}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Year */}
        <div>
          <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Ano
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {selectedCars.map((car) => (
              <div key={car.id} className="text-center">
                <p className="text-sm">{car.year}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Mileage */}
        <div>
          <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Quilometragem
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {selectedCars.map((car) => (
              <div key={car.id} className="text-center">
                <p className="text-sm">{formatMileage(car.mileage)}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Fuel */}
        <div>
          <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
            <Fuel className="h-4 w-4" />
            Combustível
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {selectedCars.map((car) => (
              <div key={car.id} className="text-center">
                <p className="text-sm">{car.fuel}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Transmission */}
        <div>
          <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Transmissão
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {selectedCars.map((car) => (
              <div key={car.id} className="text-center">
                <p className="text-sm">{car.transmission || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Color */}
        <div>
          <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Cor
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {selectedCars.map((car) => (
              <div key={car.id} className="text-center">
                <p className="text-sm">{car.color || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Location */}
        <div>
          <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Localização
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {selectedCars.map((car) => (
              <div key={car.id} className="text-center">
                <p className="text-sm">{car.location}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Category */}
        <div>
          <h4 className="font-semibold mb-3 text-foreground">Categoria</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {selectedCars.map((car) => (
              <div key={car.id} className="text-center">
                <Badge variant="secondary">{car.category}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Comparison Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Card className="shadow-lg border-primary/20 bg-card/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {selectedCarIds.length} carro{selectedCarIds.length !== 1 ? 's' : ''} selecionado{selectedCarIds.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedCars.slice(0, 3).map((car) => (
                  <div key={car.id} className="relative">
                    <img
                      src={car.images[0]}
                      alt={car.name}
                      className="w-10 h-10 object-cover rounded border-2 border-primary/20"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
                      onClick={() => onRemoveCar(car.id)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </div>
                ))}
                {selectedCarIds.length > 3 && (
                  <div className="w-10 h-10 bg-muted rounded border-2 border-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium">+{selectedCarIds.length - 3}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Dialog open={showComparisonModal} onOpenChange={setShowComparisonModal}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="premium" 
                      size="sm"
                      disabled={selectedCarIds.length < 2}
                    >
                      Comparar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <GitCompare className="h-5 w-5" />
                        Comparação de Veículos
                      </DialogTitle>
                    </DialogHeader>
                    <ComparisonTable />
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm" onClick={onClearAll}>
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CarComparison;
