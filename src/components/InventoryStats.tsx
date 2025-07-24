import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  CarIcon, 
  DollarSign, 
  Calendar,
  Fuel,
  MapPin,
  Palette
} from "lucide-react";
import { Car } from "@/data/cars";

interface InventoryStatsProps {
  cars: Car[];
}

const InventoryStats = ({ cars }: InventoryStatsProps) => {
  const stats = useMemo(() => {
    // Brand distribution
    const brandStats = cars.reduce((acc, car) => {
      acc[car.brand] = (acc[car.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Category distribution
    const categoryStats = cars.reduce((acc, car) => {
      acc[car.category] = (acc[car.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Fuel type distribution
    const fuelStats = cars.reduce((acc, car) => {
      acc[car.fuel] = (acc[car.fuel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Price ranges
    const priceRanges = {
      "Até R$ 50k": cars.filter(car => car.price <= 50000).length,
      "R$ 50k - R$ 100k": cars.filter(car => car.price > 50000 && car.price <= 100000).length,
      "R$ 100k - R$ 200k": cars.filter(car => car.price > 100000 && car.price <= 200000).length,
      "Acima de R$ 200k": cars.filter(car => car.price > 200000).length,
    };

    // Year distribution
    const yearStats = cars.reduce((acc, car) => {
      const yearRange = car.year >= 2022 ? "2022+" : car.year >= 2020 ? "2020-2021" : car.year >= 2018 ? "2018-2019" : "2015-2017";
      acc[yearRange] = (acc[yearRange] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Average values
    const avgPrice = cars.reduce((sum, car) => sum + car.price, 0) / cars.length;
    const avgYear = cars.reduce((sum, car) => sum + car.year, 0) / cars.length;
    const avgMileage = cars.reduce((sum, car) => sum + car.mileage, 0) / cars.length;

    return {
      brandStats,
      categoryStats,
      fuelStats,
      priceRanges,
      yearStats,
      avgPrice,
      avgYear,
      avgMileage,
      totalCars: cars.length,
      featuredCars: cars.filter(car => car.featured).length
    };
  }, [cars]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return `${(mileage / 1000).toFixed(0)}k km`;
  };

  const getTopItems = (data: Record<string, number>, limit = 5) => {
    return Object.entries(data)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit);
  };

  const getPercentage = (value: number, total: number) => {
    return Math.round((value / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">Estatísticas do Inventário</h3>
        <p className="text-muted-foreground">Visão geral do nosso estoque de veículos</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CarIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalCars}</p>
                <p className="text-sm text-muted-foreground">Total de Veículos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.featuredCars}</p>
                <p className="text-sm text-muted-foreground">Em Destaque</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatPrice(stats.avgPrice)}</p>
                <p className="text-sm text-muted-foreground">Preço Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(stats.avgYear)}</p>
                <p className="text-sm text-muted-foreground">Ano Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Distribuição por Marca
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getTopItems(stats.brandStats).map(([brand, count]) => (
              <div key={brand} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{brand}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{count}</span>
                    <Badge variant="secondary" className="text-xs">
                      {getPercentage(count, stats.totalCars)}%
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={getPercentage(count, stats.totalCars)} 
                  className="h-2" 
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CarIcon className="h-5 w-5" />
              Distribuição por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getTopItems(stats.categoryStats).map(([category, count]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{count}</span>
                    <Badge variant="secondary" className="text-xs">
                      {getPercentage(count, stats.totalCars)}%
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={getPercentage(count, stats.totalCars)} 
                  className="h-2" 
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Price Range Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Distribuição por Preço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.priceRanges).map(([range, count]) => (
              <div key={range} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{range}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{count}</span>
                    <Badge variant="secondary" className="text-xs">
                      {getPercentage(count, stats.totalCars)}%
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={getPercentage(count, stats.totalCars)} 
                  className="h-2" 
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Fuel Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Distribuição por Combustível
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getTopItems(stats.fuelStats).map(([fuel, count]) => (
              <div key={fuel} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{fuel}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{count}</span>
                    <Badge variant="secondary" className="text-xs">
                      {getPercentage(count, stats.totalCars)}%
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={getPercentage(count, stats.totalCars)} 
                  className="h-2" 
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Inventário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {formatPrice(stats.avgPrice)}
              </div>
              <p className="text-sm text-muted-foreground">Preço Médio</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {Math.round(stats.avgYear)}
              </div>
              <p className="text-sm text-muted-foreground">Ano Médio</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {formatMileage(stats.avgMileage)}
              </div>
              <p className="text-sm text-muted-foreground">Quilometragem Média</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryStats;
