import { useRef, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CarCard from "@/components/CarCard";
import CarFilters, { FilterState } from "@/components/CarFilters";
import { Footer } from "@/components/Footer";
import { useCars, useFeaturedCars } from "@/hooks/useApi";
import { Car } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Fuel, Gauge, MapPin, Palette, Settings2, Phone, Loader2 } from "lucide-react";
import CarImageCarousel from "@/components/CarImageCarousel";
import { formatPrice } from "@/lib/mozambique-utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "Todos",
    priceRange: [0, 50000000],
    yearRange: [1980, 2025],
    brand: ""
  });
  
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const dialogTitleRef = useRef<HTMLHeadingElement>(null);

  // Buscar carros da API
  const apiFilters = useMemo(() => ({
    search: filters.search || undefined,
    price_min: filters.priceRange[0],
    price_max: filters.priceRange[1],
    year_min: filters.yearRange[0],
    year_max: filters.yearRange[1],
    make: filters.brand && filters.brand !== "Todos" ? filters.brand : undefined,
  }), [filters]);


  const { data: carsData, loading: carsLoading, error: carsError } = useCars(apiFilters);
  const { data: featuredCars, loading: featuredLoading, error: featuredError } = useFeaturedCars();

  // Normalização para garantir que images sempre seja um array com pelo menos uma imagem (ou fallback)
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80";
  const FALLBACK_CAR_IMAGE = {
    id: -1,
    image: FALLBACK_IMAGE,
    image_url: FALLBACK_IMAGE,
    alt_text: "Imagem não disponível",
    is_primary: true,
  };

  // Corrigido: busca as imagens do backend para cada carro (mesmo na listagem)
  const normalizedCars = (carsData || []).map(car => {
    // Se o backend não retorna car.images, cria um array com a primary_image
    let images = [];
    if (Array.isArray(car.images) && car.images.length > 0) {
      images = car.images.map(img => ({
        ...img,
        image: img.image_url || img.image, // Garante que image_url é usado se existir
      }));
    } else if (car.primary_image) {
      images = [{
        ...FALLBACK_CAR_IMAGE,
        image: car.primary_image,
        image_url: car.primary_image,
        is_primary: true,
      }];
    } else {
      images = [FALLBACK_CAR_IMAGE];
    }
    return {
      ...car,
      images,
      primary_image: car.primary_image || images[0]?.image || FALLBACK_IMAGE,
    };
  });
  const normalizedFeaturedCars = (featuredCars || []).map(car => {
    let images = [];
    if (Array.isArray(car.images) && car.images.length > 0) {
      images = car.images.map(img => ({
        ...img,
        image: img.image_url || img.image,
      }));
    } else if (car.primary_image) {
      images = [{
        ...FALLBACK_CAR_IMAGE,
        image: car.primary_image,
        image_url: car.primary_image,
        is_primary: true,
      }];
    } else {
      images = [FALLBACK_CAR_IMAGE];
    }
    return {
      ...car,
      images,
      primary_image: car.primary_image || images[0]?.image || FALLBACK_IMAGE,
    };
  });

  const handleViewDetails = (car: Car) => {
    setSelectedCar(car);
    setShowDialog(true);
    // Foco será movido no useEffect abaixo
  };

  useEffect(() => {
    if (showDialog && dialogTitleRef.current) {
      dialogTitleRef.current.focus();
    }
  }, [showDialog]);

  const formatMileage = (mileage?: number) => {
    if (!mileage) return "N/A";
    return `${(mileage / 1000).toFixed(0)}k km`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main ref={mainRef} id="main-content" tabIndex={-1}>
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

            {featuredLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Carregando carros em destaque...</span>
              </div>
            ) : featuredError ? (
              <Alert>
                <AlertDescription>
                  Erro ao carregar carros em destaque: {featuredError}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {normalizedFeaturedCars.map((car) => (
                  <CarCard key={car.id} car={car} onViewDetails={handleViewDetails} />
                ))}
              </div>
            )}
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
                      {carsData?.length || 0} veículo{(carsData?.length || 0) !== 1 ? 's' : ''} encontrado{(carsData?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {carsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Carregando carros...</span>
                  </div>
                ) : carsError ? (
                  <Alert>
                    <AlertDescription>
                      Erro ao carregar carros: {carsError}
                    </AlertDescription>
                  </Alert>
                ) : normalizedCars.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {normalizedCars.map((car) => (
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
                        priceRange: [0, 5000000],
                        yearRange: [2000, 2025],
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
        <Dialog open={showDialog} onOpenChange={setShowDialog} aria-modal="true">
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedCar && (
              <>
                <DialogHeader>
                  <DialogTitle
                    className="text-2xl font-bold"
                    tabIndex={-1}
                    ref={dialogTitleRef}
                  >
                    {selectedCar.make} {selectedCar.model}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <CarImageCarousel
                      images={selectedCar.images && selectedCar.images.length > 0 ? selectedCar.images : [{
                        id: -1,
                        image: FALLBACK_IMAGE,
                        alt_text: "Imagem não disponível",
                        is_primary: true,
                      }]}
                      aspectRatio="aspect-[4/3]"
                    />
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCar.year}</span>
                      </div>
                      {selectedCar.mileage && (
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          <span>{formatMileage(selectedCar.mileage)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCar.fuel_type || selectedCar.fuel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCar.location || "Maputo"}</span>
                      </div>
                      {selectedCar.transmission && (
                        <div className="flex items-center gap-2">
                          <Settings2 className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedCar.transmission === 'manual' ? 'Manual' : 'Automática'}</span>
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
                        {selectedCar.category.name}
                      </Badge>
                      <h3 className="text-lg font-semibold text-muted-foreground">
                        {selectedCar.brand}
                      </h3>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-3xl font-bold text-primary mb-2">
                        {selectedCar.formatted_price || formatPrice(selectedCar.price)}
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
      </main>

      {/* Subtle Financing CTA - Background section */}
      <section className="py-6 bg-gray-50/30 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-left">
                <p className="text-gray-600 text-sm">
                  💬 <strong>Parcelamento disponível</strong> - Consulte condições e facilitamos para você
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/contact">
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                    <Phone className="h-4 w-4 mr-2" />
                    Consultar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
