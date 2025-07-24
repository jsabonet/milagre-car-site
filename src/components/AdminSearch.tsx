import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  SlidersHorizontal,
  Eye,
  Star,
  DollarSign,
  Gauge,
  MapPin,
  Palette,
  Settings2,
  Fuel
} from "lucide-react";
import { Car } from "@/data/cars";

interface AdminSearchFilters {
  search: string;
  brand: string;
  category: string;
  priceRange: [number, number];
  yearRange: [number, number];
  mileageRange: [number, number];
  transmission: string;
  fuel: string;
  color: string;
  location: string;
  featured: boolean | null;
  status: string;
  minViews: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdminSearchProps {
  cars: Car[];
  onFiltersChange: (filteredCars: Car[], filters: AdminSearchFilters) => void;
}

const AdminSearch = ({ cars, onFiltersChange }: AdminSearchProps) => {
  const [filters, setFilters] = useState<AdminSearchFilters>({
    search: "",
    brand: "all",
    category: "all",
    priceRange: [0, 500000],
    yearRange: [2015, 2024],
    mileageRange: [0, 200000],
    transmission: "all",
    fuel: "all",
    color: "all",
    location: "all",
    featured: null,
    status: "all",
    minViews: 0,
    sortBy: "name",
    sortOrder: "asc"
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Extrair valores únicos para os filtros
  const uniqueBrands = [...new Set(cars.map(car => car.brand))].filter(Boolean).sort();
  const uniqueCategories = [...new Set(cars.map(car => car.category))].filter(Boolean).sort();
  const uniqueTransmissions = [...new Set(cars.map(car => car.transmission))].filter(Boolean).sort();
  const uniqueFuels = [...new Set(cars.map(car => car.fuel))].filter(Boolean).sort();
  const uniqueColors = [...new Set(cars.map(car => car.color))].filter(Boolean).sort();
  const uniqueLocations = [...new Set(cars.map(car => car.location))].filter(Boolean).sort();

  // Filtrar e ordenar carros
  const filteredAndSortedCars = useMemo(() => {
    let filtered = cars.filter(car => {
      // Busca por texto
      const searchMatch = filters.search === "" || 
        car.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.id.toLowerCase().includes(filters.search.toLowerCase());

      // Filtros específicos
      const brandMatch = filters.brand === "all" || car.brand === filters.brand;
      const categoryMatch = filters.category === "all" || car.category === filters.category;
      const priceMatch = car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1];
      const yearMatch = car.year >= filters.yearRange[0] && car.year <= filters.yearRange[1];
      const mileageMatch = car.mileage >= filters.mileageRange[0] && car.mileage <= filters.mileageRange[1];
      const transmissionMatch = filters.transmission === "all" || car.transmission === filters.transmission;
      const fuelMatch = filters.fuel === "all" || car.fuel === filters.fuel;
      const colorMatch = filters.color === "all" || car.color === filters.color;
      const locationMatch = filters.location === "all" || car.location === filters.location;
      
      // Filtro de destaque
      const featuredMatch = filters.featured === null || car.featured === filters.featured;
      
      // Status (simulado)
      const statusMatch = filters.status === "all" || 
        (filters.status === "active" && car.featured) ||
        (filters.status === "inactive" && !car.featured) ||
        (filters.status === "low_stock" && Math.random() > 0.7); // Simula baixo estoque

      // Visualizações mínimas (simulado)
      const viewsMatch = Math.floor(Math.random() * 1000) >= filters.minViews;

      return searchMatch && brandMatch && categoryMatch && priceMatch && yearMatch && 
             mileageMatch && transmissionMatch && fuelMatch && colorMatch && locationMatch &&
             featuredMatch && statusMatch && viewsMatch;
    });

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "brand":
          aValue = a.brand.toLowerCase();
          bValue = b.brand.toLowerCase();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "year":
          aValue = a.year;
          bValue = b.year;
          break;
        case "mileage":
          aValue = a.mileage;
          bValue = b.mileage;
          break;
        case "views":
          aValue = Math.floor(Math.random() * 1000); // Simula visualizações
          bValue = Math.floor(Math.random() * 1000);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [cars, filters]);

  // Contar filtros ativos
  useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.brand && filters.brand !== "all") count++;
    if (filters.category && filters.category !== "all") count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) count++;
    if (filters.yearRange[0] > 2015 || filters.yearRange[1] < 2024) count++;
    if (filters.mileageRange[0] > 0 || filters.mileageRange[1] < 200000) count++;
    if (filters.transmission && filters.transmission !== "all") count++;
    if (filters.fuel && filters.fuel !== "all") count++;
    if (filters.color && filters.color !== "all") count++;
    if (filters.location && filters.location !== "all") count++;
    if (filters.featured !== null) count++;
    if (filters.status !== "all") count++;
    if (filters.minViews > 0) count++;
    
    setActiveFiltersCount(count);
  }, [filters]);

  // Notificar mudanças para o componente pai
  useEffect(() => {
    onFiltersChange(filteredAndSortedCars, filters);
  }, [filteredAndSortedCars, filters, onFiltersChange]);

  const updateFilters = (newFilters: Partial<AdminSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      brand: "all",
      category: "all",
      priceRange: [0, 500000],
      yearRange: [2015, 2024],
      mileageRange: [0, 200000],
      transmission: "all",
      fuel: "all",
      color: "all",
      location: "all",
      featured: null,
      status: "all",
      minViews: 0,
      sortBy: "name",
      sortOrder: "asc"
    });
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Barra de Busca Principal */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Campo de busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, marca, ID do veículo..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="pl-10"
              />
            </div>

            {/* Filtros rápidos */}
            <div className="flex flex-wrap gap-2">
              <Select value={filters.brand} onValueChange={(value) => updateFilters({ brand: value })}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as marcas</SelectItem>
                  {uniqueBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.category} onValueChange={(value) => updateFilters({ category: value })}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => updateFilters({ status: value })}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="low_stock">Pouco estoque</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros Avançados
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Ordenação */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Ordenar por:</span>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="brand">Marca</SelectItem>
                <SelectItem value="price">Preço</SelectItem>
                <SelectItem value="year">Ano</SelectItem>
                <SelectItem value="mileage">Quilometragem</SelectItem>
                <SelectItem value="views">Visualizações</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </Button>

            <div className="ml-auto text-sm text-muted-foreground">
              {filteredAndSortedCars.length} de {cars.length} veículos
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros Avançados */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros Avançados
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar Todos
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Faixa de Preço */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Faixa de Preço
                </Label>
                <div className="px-3">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                    max={500000}
                    min={0}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{formatPrice(filters.priceRange[0])}</span>
                    <span>{formatPrice(filters.priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Faixa de Ano */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Ano do Veículo
                </Label>
                <div className="px-3">
                  <Slider
                    value={filters.yearRange}
                    onValueChange={(value) => updateFilters({ yearRange: value as [number, number] })}
                    max={2024}
                    min={2010}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{filters.yearRange[0]}</span>
                    <span>{filters.yearRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Quilometragem */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  Quilometragem (km)
                </Label>
                <div className="px-3">
                  <Slider
                    value={filters.mileageRange}
                    onValueChange={(value) => updateFilters({ mileageRange: value as [number, number] })}
                    max={200000}
                    min={0}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{(filters.mileageRange[0] / 1000).toFixed(0)}k</span>
                    <span>{(filters.mileageRange[1] / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              </div>

              {/* Transmissão */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Transmissão
                </Label>
                <Select value={filters.transmission} onValueChange={(value) => updateFilters({ transmission: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {uniqueTransmissions.map(transmission => (
                      <SelectItem key={transmission} value={transmission}>{transmission}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Combustível */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Fuel className="h-4 w-4" />
                  Combustível
                </Label>
                <Select value={filters.fuel} onValueChange={(value) => updateFilters({ fuel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueFuels.map(fuel => (
                      <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cor */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Cor
                </Label>
                <Select value={filters.color} onValueChange={(value) => updateFilters({ color: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {uniqueColors.map(color => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Localização */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localização
                </Label>
                <Select value={filters.location} onValueChange={(value) => updateFilters({ location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {uniqueLocations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Veículos em Destaque */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Status de Destaque
                </Label>
                <Select 
                  value={filters.featured === null ? "all" : filters.featured.toString()} 
                  onValueChange={(value) => updateFilters({ 
                    featured: value === "all" ? null : value === "true" 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Em destaque</SelectItem>
                    <SelectItem value="false">Não destacados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Visualizações Mínimas */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visualizações Mínimas
                </Label>
                <div className="px-3">
                  <Slider
                    value={[filters.minViews]}
                    onValueChange={(value) => updateFilters({ minViews: value[0] })}
                    max={1000}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    Mín. {filters.minViews} visualizações
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags de Filtros Ativos */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Busca: "{filters.search}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ search: "" })}
              />
            </Badge>
          )}
          {filters.brand && filters.brand !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Marca: {filters.brand}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ brand: "all" })}
              />
            </Badge>
          )}
          {filters.category && filters.category !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Categoria: {filters.category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ category: "all" })}
              />
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ status: "all" })}
              />
            </Badge>
          )}
          {filters.featured !== null && (
            <Badge variant="secondary" className="gap-1">
              Destaque: {filters.featured ? "Sim" : "Não"}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ featured: null })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSearch;
