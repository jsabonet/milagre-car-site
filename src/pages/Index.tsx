import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CarCard from "@/components/CarCard";
import CarFilters, { FilterState } from "@/components/CarFilters";
import { Footer } from "@/components/Footer";
import { cars, Car } from "@/data/cars";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Fuel, Gauge, MapPin, Palette, Settings2 } from "lucide-react";

const Index = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "Todos",
    priceRange: [0, 500000],
    yearRange: [2015, 2024],
    brand: ""
  });
  
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = filters.search === "" || 
        car.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.brand.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = filters.category === "Todos" || car.category === filters.category;
      
      const matchesBrand = filters.brand === "" || filters.brand === "Todos" || car.brand === filters.brand;
      
      const matchesPrice = car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1];
      
      const matchesYear = car.year >= filters.yearRange[0] && car.year <= filters.yearRange[1];

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesYear;
    });
  }, [cars, filters]);

  const handleViewDetails = (car: Car) => {
    setSelectedCar(car);
    setShowDialog(true);
  };

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <HeroSection />

      {/* Featured Cars Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Carros em Destaque</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Confira nossa seleção especial de veículos com as melhores condições e preços exclusivos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.filter(car => car.featured).map((car) => (
              <CarCard key={car.id} car={car} onViewDetails={handleViewDetails} />
            ))}
          </div>
        </div>
      </section>

      {/* All Cars Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-24">
                <h3 className="text-xl font-bold mb-6 text-foreground">Filtrar Carros</h3>
                <CarFilters onFiltersChange={setFilters} />
              </div>
            </div>

            {/* Cars Grid */}
            <div className="lg:w-3/4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Nosso Catálogo
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {filteredCars.length} veículo{filteredCars.length !== 1 ? 's' : ''} encontrado{filteredCars.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <CarCard key={car.id} car={car} onViewDetails={handleViewDetails} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <h4 className="text-xl font-semibold text-foreground mb-2">
                      Nenhum carro encontrado
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      Tente ajustar seus filtros para encontrar o carro ideal.
                    </p>
                    <Button variant="outline" onClick={() => setFilters({
                      search: "",
                      category: "Todos",
                      priceRange: [0, 500000],
                      yearRange: [2015, 2024],
                      brand: ""
                    })}>
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Car Details Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCar && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedCar.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedCar.images[0]}
                    alt={selectedCar.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCar.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span>{formatMileage(selectedCar.mileage)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCar.fuel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCar.location}</span>
                    </div>
                    {selectedCar.transmission && (
                      <div className="flex items-center gap-2">
                        <Settings2 className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCar.transmission}</span>
                      </div>
                    )}
                    {selectedCar.color && (
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCar.color}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <Badge variant="secondary" className="mb-2">
                      {selectedCar.category}
                    </Badge>
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      {selectedCar.brand}
                    </h3>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-primary mb-2">
                      {formatPrice(selectedCar.price)}
                    </p>
                  </div>
                  
                  {selectedCar.description && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Descrição</h4>
                      <p className="text-muted-foreground">
                        {selectedCar.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <Button variant="premium" className="w-full" size="lg">
                      Entrar em Contato
                    </Button>
                    <Button variant="outline" className="w-full">
                      Agendar Test Drive
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Index;
