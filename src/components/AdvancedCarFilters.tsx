import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X, Filter } from "lucide-react";
import { categories } from "@/data/cars";
import { ExtendedFilterState } from "@/pages/Cars";
import { formatPrice } from "@/lib/mozambique-utils";

interface AdvancedCarFiltersProps {
  filters: ExtendedFilterState;
  onFiltersChange: (filters: ExtendedFilterState) => void;
}

const AdvancedCarFilters = ({ filters, onFiltersChange }: AdvancedCarFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const brands = ["Todos", "Honda", "Toyota", "Volkswagen", "Hyundai", "Jeep", "Chevrolet", "Ford", "Fiat", "BMW", "Mercedes", "Audi"];
  const transmissions = ["Manual", "Automática", "CVT", "Semi-automática"];
  const colors = ["Branco", "Preto", "Prata", "Cinza", "Azul", "Vermelho", "Verde", "Amarelo", "Marrom"];
  const fuelTypes = ["Gasolina", "Diesel"];
  const locations = ["Maputo", "Matola", "Beira", "Nampula", "Chimoio", "Nacala", "Quelimane", "Tete", "Xai-Xai", "Lichinga"];

  const updateFilters = (newFilters: Partial<ExtendedFilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    onFiltersChange(updatedFilters);
  };

  const formatMileage = (value: number) => {
    return `${(value / 1000).toFixed(0)}k km`;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search !== "") count++;
    if (filters.category !== "Todos") count++;
    if (filters.brand !== "" && filters.brand !== "Todos") count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) count++;
    if (filters.yearRange[0] > 1975 || filters.yearRange[1] < 2025) count++;
    if (filters.mileageRange[0] > 0 || filters.mileageRange[1] < 2000000) count++;
    if (filters.transmission !== "") count++;
    if (filters.color !== "") count++;
    if (filters.fuelType !== "") count++;
    if (filters.location !== "") count++;
    if (filters.hasAirConditioning) count++;
    if (filters.hasPowerSteering) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros</CardTitle>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-0 space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Modelo, marca..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Categories */}
        <div className="space-y-2">
          <Label>Categoria</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filters.category === category ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilters({ category })}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Basic Filters */}
        <div className="space-y-4">
          {/* Brand */}
          <div className="space-y-2">
            <Label>Marca</Label>
            <Select value={filters.brand === "" ? "Todos" : filters.brand} onValueChange={(brand) => updateFilters({ brand: brand === "Todos" ? "" : brand })}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as marcas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todas as marcas</SelectItem>
                {brands.filter(b => b !== "Todos").map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Faixa de Preço</Label>
              <span className="text-sm text-muted-foreground">
                {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
              </span>
            </div>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
              max={500000}
              min={0}
              step={5000}
              className="w-full"
            />
          </div>

          {/* Year Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Ano</Label>
              <span className="text-sm text-muted-foreground">
                {filters.yearRange[0]} - {filters.yearRange[1]}
              </span>
            </div>
            <Slider
              value={filters.yearRange}
              onValueChange={(value) => updateFilters({ yearRange: value as [number, number] })}
              max={2025}
              min={1975}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <Separator />

        {/* Advanced Filters Toggle */}
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros Avançados
          </span>
          <span className="text-xs">
            {showAdvanced ? 'Ocultar' : 'Mostrar'}
          </span>
        </Button>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-2">
            {/* Mileage Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Quilometragem</Label>
                <span className="text-sm text-muted-foreground">
                  {formatMileage(filters.mileageRange[0])} - {formatMileage(filters.mileageRange[1])}
                </span>
              </div>
              <Slider
                value={filters.mileageRange}
                onValueChange={(value) => updateFilters({ mileageRange: value as [number, number] })}
                max={2000000}
                min={0}
                step={50000}
                className="w-full"
              />
            </div>

            {/* Transmission */}
            <div className="space-y-2">
              <Label>Transmissão</Label>
              <Select value={filters.transmission} onValueChange={(transmission) => updateFilters({ transmission })}>
                <SelectTrigger>
                  <SelectValue placeholder="Qualquer transmissão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Qualquer transmissão</SelectItem>
                  {transmissions.map((transmission) => (
                    <SelectItem key={transmission} value={transmission}>
                      {transmission}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label>Cor</Label>
              <Select value={filters.color} onValueChange={(color) => updateFilters({ color })}>
                <SelectTrigger>
                  <SelectValue placeholder="Qualquer cor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Qualquer cor</SelectItem>
                  {colors.filter(c => c !== "").map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <Label>Combustível</Label>
              <Select value={filters.fuelType} onValueChange={(fuelType) => updateFilters({ fuelType })}>
                <SelectTrigger>
                  <SelectValue placeholder="Qualquer combustível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Qualquer combustível</SelectItem>
                  {fuelTypes.filter(f => f !== "").map((fuel) => (
                    <SelectItem key={fuel} value={fuel}>
                      {fuel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Localização</Label>
              <Select value={filters.location} onValueChange={(location) => updateFilters({ location })}>
                <SelectTrigger>
                  <SelectValue placeholder="Qualquer localização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Qualquer localização</SelectItem>
                  {locations.filter(l => l !== "").map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Optional Features */}
            <div className="space-y-3">
              <Label>Opcionais</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="air-conditioning"
                  checked={filters.hasAirConditioning}
                  onCheckedChange={(checked) => 
                    updateFilters({ hasAirConditioning: checked as boolean })
                  }
                />
                <Label htmlFor="air-conditioning" className="text-sm font-normal">
                  Ar Condicionado
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="power-steering"
                  checked={filters.hasPowerSteering}
                  onCheckedChange={(checked) => 
                    updateFilters({ hasPowerSteering: checked as boolean })
                  }
                />
                <Label htmlFor="power-steering" className="text-sm font-normal">
                  Direção Hidráulica
                </Label>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Save Search / Alerts */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full">
            Salvar esta busca
          </Button>
          <Button variant="outline" className="w-full">
            Receber alertas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedCarFilters;
