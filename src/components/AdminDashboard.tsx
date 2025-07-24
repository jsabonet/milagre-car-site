import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown,
  CarIcon, 
  DollarSign, 
  Users, 
  Eye,
  Clock,
  Star,
  AlertTriangle,
  Calendar,
  Target,
  Award,
  Activity
} from "lucide-react";
import { Car } from "@/data/cars";
import { formatPrice, formatDate } from "@/lib/mozambique-utils";

interface AdminDashboardProps {
  cars: Car[];
}

const AdminDashboard = ({ cars }: AdminDashboardProps) => {
  const businessMetrics = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Simular dados de vendas (em um app real viriam de uma API)
    const simulatedSales = {
      thisMonth: 8,
      lastMonth: 6,
      thisYear: 72,
      lastYear: 58,
      totalRevenue: 1450000,
      lastMonthRevenue: 1200000,
      avgDaysToSell: 18,
      conversionRate: 12.5
    };

    // Simular leads e visualizações
    const simulatedLeads = {
      total: 156,
      thisMonth: 23,
      converted: 19,
      pending: 37
    };

    // Simular visualizações
    const simulatedViews = {
      total: 2847,
      thisMonth: 456,
      uniqueVisitors: 1923
    };

    // Análise do inventário
    const totalCars = cars.length;
    const featuredCars = cars.filter(car => car.featured).length;
    const avgPrice = cars.reduce((sum, car) => sum + car.price, 0) / totalCars;
    const avgYear = cars.reduce((sum, car) => sum + car.year, 0) / totalCars;
    
    // Carros por categoria
    const carsByCategory = cars.reduce((acc, car) => {
      acc[car.category] = (acc[car.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Carros por marca
    const carsByBrand = cars.reduce((acc, car) => {
      acc[car.brand] = (acc[car.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Carros com preços altos (acima da média)
    const expensiveCars = cars.filter(car => car.price > avgPrice).length;
    
    // Carros antigos (mais de 5 anos)
    const oldCars = cars.filter(car => currentYear - car.year > 5).length;

    // Performance por categoria
    const categoryPerformance = Object.entries(carsByCategory).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / totalCars) * 100),
      // Simular interest score
      interestScore: Math.floor(Math.random() * 100) + 1
    }));

    return {
      sales: simulatedSales,
      leads: simulatedLeads,
      views: simulatedViews,
      inventory: {
        total: totalCars,
        featured: featuredCars,
        avgPrice,
        avgYear: Math.round(avgYear),
        expensive: expensiveCars,
        old: oldCars
      },
      categories: categoryPerformance,
      brands: carsByBrand
    };
  }, [cars]);

  const getGrowthIcon = (current: number, previous: number) => {
    const growth = current > previous;
    return growth ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard Administrativo</h2>
          <p className="text-muted-foreground">Visão geral do desempenho do negócio</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Activity className="h-4 w-4" />
          Última atualização: {formatDate(new Date())}
        </Badge>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vendas Este Mês */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vendas Este Mês</p>
                <p className="text-2xl font-bold">{businessMetrics.sales.thisMonth}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(businessMetrics.sales.thisMonth, businessMetrics.sales.lastMonth)}
                  <span className="text-sm text-muted-foreground">
                    {getGrowthPercentage(businessMetrics.sales.thisMonth, businessMetrics.sales.lastMonth)}% vs mês anterior
                  </span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <CarIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receita */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold">{formatPrice(businessMetrics.sales.totalRevenue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(businessMetrics.sales.totalRevenue, businessMetrics.sales.lastMonthRevenue)}
                  <span className="text-sm text-muted-foreground">
                    {getGrowthPercentage(businessMetrics.sales.totalRevenue, businessMetrics.sales.lastMonthRevenue)}% crescimento
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leads Este Mês</p>
                <p className="text-2xl font-bold">{businessMetrics.leads.thisMonth}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">
                    {businessMetrics.sales.conversionRate}% taxa de conversão
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tempo Médio de Venda */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo Médio de Venda</p>
                <p className="text-2xl font-bold">{businessMetrics.sales.avgDaysToSell} dias</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-muted-foreground">
                    Meta: 21 dias
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Performance por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {businessMetrics.categories.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{item.count} carros</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.interestScore}% interesse
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={item.percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-12">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alertas e Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas e Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Carros com muito tempo no estoque */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Carros antigos no estoque</p>
                  <p className="text-sm text-yellow-700">
                    {businessMetrics.inventory.old} carros com mais de 5 anos. 
                    Considere ajustar preços ou promoções.
                  </p>
                </div>
              </div>
            </div>

            {/* Carros em destaque */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Carros em destaque</p>
                  <p className="text-sm text-blue-700">
                    {businessMetrics.inventory.featured} de {businessMetrics.inventory.total} carros estão em destaque.
                    {businessMetrics.inventory.featured < 5 && " Considere destacar mais veículos."}
                  </p>
                </div>
              </div>
            </div>

            {/* Performance de vendas */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Meta de vendas</p>
                  <p className="text-sm text-green-700">
                    Você está {businessMetrics.sales.thisMonth >= 10 ? 'superando' : 'próximo de atingir'} 
                    a meta mensal de 10 vendas. Continue assim!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas do Inventário */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {businessMetrics.inventory.total}
            </div>
            <p className="text-sm text-muted-foreground">Total de Veículos</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {formatPrice(businessMetrics.inventory.avgPrice)}
            </div>
            <p className="text-sm text-muted-foreground">Preço Médio</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {businessMetrics.inventory.avgYear}
            </div>
            <p className="text-sm text-muted-foreground">Ano Médio</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {businessMetrics.views.thisMonth}
            </div>
            <p className="text-sm text-muted-foreground">Visualizações/Mês</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
