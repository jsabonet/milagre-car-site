import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import CarCard from "@/components/CarCard";
import AdvancedCarFilters from "@/components/AdvancedCarFilters";
import CarComparison from "@/components/CarComparison";
import InventoryStats from "@/components/InventoryStats";
import { cars, Car } from "@/data/cars";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/mozambique-utils";
import { 
  ChevronRight, 
  Grid3x3, 
  List, 
  SlidersHorizontal, 
  MapPin, 
  Calendar, 
  Fuel, 
  Gauge, 
  Palette, 
  Settings2,
  Filter,
  GitCompare,
  Map,
  TrendingUp
} from "lucide-react";

export interface ExtendedFilterState {
  search: string;
  category: string;
  priceRange: [number, number];
  yearRange: [number, number];
  brand: string;
  mileageRange: [number, number];
  transmission: string;
  color: string;
  fuelType: string;
  location: string;
  hasAirConditioning: boolean;
  hasPowerSteering: boolean;
}

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'year-new' | 'year-old' | 'mileage-low' | 'recent';
type ViewMode = 'grid' | 'list';
type Density = 'compact' | 'normal' | 'expanded';

const Cars = () => {
  const [filters, setFilters] = useState<ExtendedFilterState>({
    search: "",
    category: "Todos",
    priceRange: [0, 500000],
    yearRange: [2015, 2024],
    brand: "",
    mileageRange: [0, 200000],
    transmission: "",
    color: "",
    fuelType: "",
    location: "",
    hasAirConditioning: false,
    hasPowerSteering: false
  });

  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [density, setDensity] = useState<Density>('normal');
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Filtrar carros
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = filters.search === "" || 
        car.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.brand.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = filters.category === "Todos" || car.category === filters.category;
      const matchesBrand = filters.brand === "" || filters.brand === "Todos" || car.brand === filters.brand;
      const matchesPrice = car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1];
      const matchesYear = car.year >= filters.yearRange[0] && car.year <= filters.yearRange[1];
      const matchesMileage = car.mileage >= filters.mileageRange[0] && car.mileage <= filters.mileageRange[1];
      
      const matchesTransmission = filters.transmission === "" || car.transmission === filters.transmission;
      const matchesColor = filters.color === "" || car.color === filters.color;
      const matchesFuel = filters.fuelType === "" || car.fuel === filters.fuelType;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && 
             matchesYear && matchesMileage && matchesTransmission && matchesColor && matchesFuel;
    });
  }, [cars, filters]);

  // Ordenar carros
  const sortedCars = useMemo(() => {
    const sorted = [...filteredCars];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'year-new':
        return sorted.sort((a, b) => b.year - a.year);
      case 'year-old':
        return sorted.sort((a, b) => a.year - b.year);
      case 'mileage-low':
        return sorted.sort((a, b) => a.mileage - b.mileage);
      case 'recent':
        return sorted.reverse(); // Simula ordenação por data de adição
      default:
        return sorted;
    }
  }, [filteredCars, sortBy]);

  // Paginação
  const totalPages = Math.ceil(sortedCars.length / itemsPerPage);
  const paginatedCars = sortedCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (car: Car) => {
    setSelectedCar(car);
    setShowDialog(true);
  };

  const handleSelectCar = (carId: string) => {
    setSelectedCars(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId].slice(-4) // Máximo 4 carros
    );
  };

  const formatMileage = (mileage: number) => {
    return `${(mileage / 1000).toFixed(0)}k km`;
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "Todos",
      priceRange: [0, 500000],
      yearRange: [2015, 2024],
      brand: "",
      mileageRange: [0, 200000],
      transmission: "",
      color: "",
      fuelType: "",
      location: "",
      hasAirConditioning: false,
      hasPowerSteering: false
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary transition-colors">
              Início
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Carros</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Nosso Inventário Completo
              </h1>
              <p className="text-muted-foreground">
                {sortedCars.length} veículo{sortedCars.length !== 1 ? 's' : ''} disponível{sortedCars.length !== 1 ? 'eis' : ''}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Estatísticas
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className="gap-2"
              >
                <Map className="h-4 w-4" />
                {showMap ? 'Lista' : 'Mapa'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {showStats && (
        <section className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <InventoryStats cars={cars} />
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-24 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filtros Avançados</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpar
                  </Button>
                </div>
                
                <AdvancedCarFilters 
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
            </div>

            {/* Cars Grid/List */}
            <div className="lg:w-3/4">
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-4 bg-card rounded-lg border">
                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Items per page */}
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Ordenar por:</span>
                  <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Mais Relevante</SelectItem>
                      <SelectItem value="price-low">Menor Preço</SelectItem>
                      <SelectItem value="price-high">Maior Preço</SelectItem>
                      <SelectItem value="year-new">Mais Novo</SelectItem>
                      <SelectItem value="year-old">Mais Antigo</SelectItem>
                      <SelectItem value="mileage-low">Menor Quilometragem</SelectItem>
                      <SelectItem value="recent">Adicionados Recentemente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Cars Display */}
              {paginatedCars.length > 0 ? (
                <>
                  <div className={
                    viewMode === 'grid' 
                      ? `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6` 
                      : `space-y-4`
                  }>
                    {paginatedCars.map((car) => (
                      <div key={car.id} className="relative">
                        <CarCard 
                          car={car} 
                          onViewDetails={handleViewDetails}
                          viewMode={viewMode}
                        />
                        
                        {/* Comparison Checkbox */}
                        <div className="absolute top-3 right-3">
                          <input
                            type="checkbox"
                            checked={selectedCars.includes(car.id)}
                            onChange={() => handleSelectCar(car.id)}
                            className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                      >
                        Anterior
                      </Button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                      >
                        Próximo
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <h4 className="text-xl font-semibold text-foreground mb-2">
                      Nenhum carro encontrado
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      Tente ajustar seus filtros para encontrar o carro ideal.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Bar */}
      {selectedCars.length > 0 && (
        <CarComparison
          selectedCarIds={selectedCars}
          cars={cars}
          onRemoveCar={handleSelectCar}
          onClearAll={() => setSelectedCars([])}
        />
      )}

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

export default Cars;
