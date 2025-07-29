import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { categories } from "@/data/cars";

interface CarFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  category: string;
  priceRange: [number, number];
  yearRange: [number, number];
  brand: string;
}

const CarFilters = ({ onFiltersChange }: CarFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "Todos",
    priceRange: [0, 50000000],
    yearRange: [1980, 2025],
    brand: ""
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const brands = ["Todos", "Honda", "Toyota", "Volkswagen", "Hyundai", "Jeep", "Chevrolet", "Ford", "Fiat"];

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      search: "",
      category: "Todos",
      priceRange: [0, 50000000],
      yearRange: [1980, 2025],
      brand: ""
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = 
    filters.search !== "" || 
    filters.category !== "Todos" || 
    filters.brand !== "" ||
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 500000 ||
    filters.yearRange[0] > 2015 || 
    filters.yearRange[1] < 2024;

  return (
    <div className="space-y-6">
      {/* Quick Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por modelo, marca..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filters.category === category ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilters({ category })}
              className="text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="ml-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros Avançados
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <label className="text-sm font-medium mb-2 block">Marca</label>
            <Select value={filters.brand} onValueChange={(brand) => updateFilters({ brand })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a marca" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Preço Mínimo</label>
            <Input
              type="number"
              placeholder="0 MZN"
              value={filters.priceRange[0] || ""}
              onChange={(e) => updateFilters({ 
                priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]
              })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Preço Máximo</label>
            <Input
              type="number"
              placeholder="50.000.000 MZN"
              value={filters.priceRange[1] === 50000000 ? "" : filters.priceRange[1]}
              onChange={(e) => updateFilters({ 
                priceRange: [filters.priceRange[0], parseInt(e.target.value) || 50000000]
              })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Ano Mínimo</label>
            <Input
              type="number"
              placeholder="1980"
              value={filters.yearRange[0] || ""}
              onChange={(e) => updateFilters({ 
                yearRange: [parseInt(e.target.value) || 1980, filters.yearRange[1]]
              })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Ano Máximo</label>
            <Input
              type="number"
              placeholder="2025"
              value={filters.yearRange[1] === 2025 ? "" : filters.yearRange[1]}
              onChange={(e) => updateFilters({ 
                yearRange: [filters.yearRange[0], parseInt(e.target.value) || 2025]
              })}
            />
          </div>
        </div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Busca: {filters.search}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ search: "" })}
              />
            </Badge>
          )}
          
          {filters.category !== "Todos" && (
            <Badge variant="secondary" className="gap-1">
              {filters.category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ category: "Todos" })}
              />
            </Badge>
          )}
          
          {filters.brand && filters.brand !== "Todos" && (
            <Badge variant="secondary" className="gap-1">
              {filters.brand}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ brand: "" })}
              />
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto text-xs"
          >
            Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default CarFilters;