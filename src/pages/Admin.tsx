import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BarChart3, 
  Car, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Search,
  Filter,
  X,
  Eye,
  Edit,
  Trash2,
  Star,
  Download,
  Upload,
  Settings
} from "lucide-react";
import { cars } from "@/data/cars";
import ImageUpload from "@/components/ImageUpload";
import BulkActions from "@/components/BulkActions";
import CarRegistration from "@/components/CarRegistration";
import CategoryManagement from "@/components/CategoryManagement";
import MinimalAdmin from "@/components/MinimalAdmin";
import { formatPrice, formatNumber } from "@/lib/mozambique-utils";

// Admin Dashboard Component
const AdminDashboard = () => {
  // Simulate business metrics
  const metrics = {
    totalSales: 2450000,
    monthlyGrowth: 12.5,
    carsInStock: cars.length,
    averageDaysToSell: 18,
    conversionRate: 8.3,
    averageTicket: 45000,
    lowStockAlert: cars.filter(car => Math.random() > 0.8).length,
    stagnantCars: cars.filter(car => Math.random() > 0.7).length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600">Visão geral do desempenho e métricas do negócio</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Mensais</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(metrics.totalSales)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{metrics.monthlyGrowth}% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carros em Estoque</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.carsInStock}</div>
            <p className="text-xs text-muted-foreground">
              {cars.filter(car => Math.random() > 0.2).length} disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.8% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(metrics.averageTicket)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.averageDaysToSell} dias média de venda
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Performance</CardTitle>
            <CardDescription>Indicadores chave de desempenho</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Tempo Médio de Venda</span>
              <Badge variant="secondary">{metrics.averageDaysToSell} dias</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Visualizações por Carro</span>
              <Badge variant="secondary">127/mês</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Test Drives Agendados</span>
              <Badge variant="secondary">34 este mês</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Satisfação do Cliente</span>
              <Badge variant="secondary">4.8/5.0</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alertas e Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.lowStockAlert > 0 && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Estoque Baixo</p>
                  <p className="text-xs text-gray-600">{metrics.lowStockAlert} modelos com pouco estoque</p>
                </div>
              </div>
            )}
            
            {metrics.stagnantCars > 0 && (
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Carros Parados</p>
                  <p className="text-xs text-gray-600">{metrics.stagnantCars} carros há mais de 60 dias</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Meta Atingida</p>
                <p className="text-xs text-gray-600">Vendas do mês superaram expectativa</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Car Registration Component
const CarRegistrationPage = () => {
  const handleCarCreated = (carData: any) => {
    console.log('Novo carro cadastrado:', carData);
    // Here you would typically send the data to your backend
    alert(`Carro ${carData.brand} ${carData.name} cadastrado com sucesso!`);
  };

  return <CarRegistration onCarCreated={handleCarCreated} />;
};

// Category Management Component  
const CategoryManagementPage = () => {
  const handleCategoryCreated = (category: any) => {
    console.log('Nova categoria criada:', category);
  };

  const handleCategoryUpdated = (category: any) => {
    console.log('Categoria atualizada:', category);
  };

  const handleCategoryDeleted = (categoryId: string) => {
    console.log('Categoria excluída:', categoryId);
  };

  return (
    <CategoryManagement
      onCategoryCreated={handleCategoryCreated}
      onCategoryUpdated={handleCategoryUpdated}
      onCategoryDeleted={handleCategoryDeleted}
    />
  );
};
const ImageManagement = () => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const handleFilesUploaded = (files: any[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    console.log('Arquivos enviados:', files);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Imagens</h1>
        <p className="text-gray-600">Sistema profissional de upload e gestão de imagens</p>
      </div>

      <ImageUpload
        onFilesUploaded={handleFilesUploaded}
        maxFiles={20}
        maxSize={10}
        acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/avif']}
      />

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Galeria de Imagens Enviadas</CardTitle>
            <CardDescription>
              {uploadedFiles.length} imagem(ns) carregada(s) com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="group relative">
                  <img
                    src={file.preview}
                    alt="Uploaded"
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
interface AdminSearchProps {
  selectedCars: string[];
  setSelectedCars: (cars: string[]) => void;
  showBulkActions: boolean;
  setShowBulkActions: (show: boolean) => void;
  onBulkActionComplete: (action: string, results: any) => void;
}

const AdminSearch: React.FC<AdminSearchProps> = ({
  selectedCars,
  setSelectedCars,
  showBulkActions,
  setShowBulkActions,
  onBulkActionComplete
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    brand: "all",
    name: "all",
    year: "all",
    priceRange: "all",
    status: "all",
    fuel: "all"
  });
  const [sortBy, setSortBy] = useState("brand");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Get unique values for filters
  const brands = Array.from(new Set(cars.map(car => car.brand))).sort();
  const names = Array.from(new Set(cars.map(car => car.name))).sort();
  const years = Array.from(new Set(cars.map(car => car.year))).sort((a, b) => b - a);
  const fuels = Array.from(new Set(cars.map(car => car.fuel))).sort();

  // Filter and sort cars
  const filteredCars = cars
    .filter(car => {
      const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (car.color && car.color.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesBrand = filters.brand === "all" || car.brand === filters.brand;
      const matchesName = filters.name === "all" || car.name === filters.name;
      const matchesYear = filters.year === "all" || car.year.toString() === filters.year;
      const matchesFuel = filters.fuel === "all" || car.fuel === filters.fuel;
      const isAvailable = Math.random() > 0.3; // Simulate availability
      const matchesStatus = filters.status === "all" || 
                           (filters.status === "available" && isAvailable) ||
                           (filters.status === "sold" && !isAvailable);
      
      const matchesPriceRange = filters.priceRange === "all" || 
                               (filters.priceRange === "0-50000" && car.price <= 50000) ||
                               (filters.priceRange === "50000-100000" && car.price > 50000 && car.price <= 100000) ||
                               (filters.priceRange === "100000+" && car.price > 100000);

      return matchesSearch && matchesBrand && matchesName && matchesYear && 
             matchesFuel && matchesStatus && matchesPriceRange;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCars(filteredCars.map(car => car.id));
    } else {
      setSelectedCars([]);
    }
  };

  const handleSelectCar = (carId: string, checked: boolean) => {
    if (checked) {
      setSelectedCars([...selectedCars, carId]);
    } else {
      setSelectedCars(selectedCars.filter(id => id !== carId));
    }
  };

  const clearFilters = () => {
    setFilters({
      brand: "all",
      name: "all",
      year: "all",
      priceRange: "all",
      status: "all",
      fuel: "all"
    });
    setSearchTerm("");
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== "all").length + (searchTerm ? 1 : 0);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Ação em lote: ${action} para ${selectedCars.length} carros`);
    // Implement bulk actions here
    setSelectedCars([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Busca e Filtros</h1>
          <p className="text-gray-600">Sistema avançado de busca e filtros administrativos</p>
        </div>
        <Button onClick={() => handleBulkAction('export')} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Busca Avançada
            </span>
            {getActiveFiltersCount() > 0 && (
              <Button onClick={clearFilters} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Limpar Filtros ({getActiveFiltersCount()})
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por marca, modelo ou cor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Marca</label>
              <Select value={filters.brand} onValueChange={(value) => setFilters({...filters, brand: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as marcas</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Nome do Modelo</label>
              <Select value={filters.name} onValueChange={(value) => setFilters({...filters, name: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os modelos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os modelos</SelectItem>
                  {names.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Ano</label>
              <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os anos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os anos</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Faixa de Preço</label>
              <Select value={filters.priceRange} onValueChange={(value) => setFilters({...filters, priceRange: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as faixas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as faixas</SelectItem>
                  <SelectItem value="0-50000">Até 50.000 MZN</SelectItem>
                  <SelectItem value="50000-100000">50.000 - 100.000 MZN</SelectItem>
                  <SelectItem value="100000+">Acima de 100.000 MZN</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="sold">Vendido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Combustível</label>
              <Select value={filters.fuel} onValueChange={(value) => setFilters({...filters, fuel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os combustíveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os combustíveis</SelectItem>
                  {fuels.map(fuel => (
                    <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Ordenar por</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand">Marca</SelectItem>
                  <SelectItem value="name">Nome do Modelo</SelectItem>
                  <SelectItem value="year">Ano</SelectItem>
                  <SelectItem value="price">Preço</SelectItem>
                  <SelectItem value="mileage">Quilometragem</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "Crescente" : "Decrescente"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Resultados ({filteredCars.length} carros)
            </CardTitle>
            {selectedCars.length > 0 && (
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowBulkActions(!showBulkActions)} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Ações em Massa ({selectedCars.length})
                </Button>
                <Button onClick={() => handleBulkAction('feature')} variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-1" />
                  Destacar
                </Button>
                <Button onClick={() => handleBulkAction('delete')} variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Select All */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedCars.length === filteredCars.length && filteredCars.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Selecionar todos ({filteredCars.length})
              </label>
            </div>

            {/* Cars Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-12 p-3"></th>
                      <th className="text-left p-3 font-medium">Carro</th>
                      <th className="text-left p-3 font-medium">Preço</th>
                      <th className="text-left p-3 font-medium">Ano</th>
                      <th className="text-left p-3 font-medium">KM</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCars.map((car) => (
                      <tr key={car.id} className="border-t hover:bg-gray-50">
                        <td className="p-3">
                          <Checkbox
                            checked={selectedCars.includes(car.id)}
                            onCheckedChange={(checked) => handleSelectCar(car.id, checked as boolean)}
                          />
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{car.brand} {car.name}</div>
                            <div className="text-sm text-gray-500">{car.color || 'N/A'} • {car.fuel} • {car.transmission || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="p-3 font-medium">{formatPrice(car.price)}</td>
                        <td className="p-3">{car.year}</td>
                        <td className="p-3">{formatNumber(car.mileage)} km</td>
                        <td className="p-3">
                          <Badge variant={Math.random() > 0.3 ? "default" : "secondary"}>
                            {Math.random() > 0.3 ? "Disponível" : "Vendido"}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Admin Component
const Admin = () => {
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>('overview');

  const handleBulkActionComplete = (action: string, results: any) => {
    console.log(`Ação ${action} completada:`, results);
    setSelectedCars([]);
    setShowBulkActions(false);
  };

  const navigateToSection = (section: string) => {
    setCurrentSection(section);
  };

  const getSectionTitle = (section: string) => {
    const titles = {
      overview: 'Painel Inicial',
      dashboard: 'Dashboard Executivo',
      search: 'Busca e Filtros',
      register: 'Cadastrar Novo Carro',
      categories: 'Gestão de Categorias',
      images: 'Upload de Imagens',
      bulk: 'Ações em Massa'
    };
    return titles[section as keyof typeof titles] || 'Painel Administrativo';
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'overview':
        return <MinimalAdmin onNavigateToSection={navigateToSection} />;
      case 'dashboard':
        return <AdminDashboard />;
      case 'search':
        return (
          <div className="space-y-6">
            <AdminSearch 
              selectedCars={selectedCars}
              setSelectedCars={setSelectedCars}
              showBulkActions={showBulkActions}
              setShowBulkActions={setShowBulkActions}
              onBulkActionComplete={handleBulkActionComplete}
            />
            {showBulkActions && (
              <BulkActions
                selectedItems={selectedCars}
                onActionComplete={handleBulkActionComplete}
              />
            )}
          </div>
        );
      case 'register':
        return <CarRegistrationPage />;
      case 'categories':
        return <CategoryManagementPage />;
      case 'images':
        return <ImageManagement />;
      case 'bulk':
        return (
          <BulkActions
            selectedItems={[]}
            onActionComplete={(action, results) => console.log('Bulk action:', action, results)}
          />
        );
      default:
        return <MinimalAdmin onNavigateToSection={navigateToSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegação apenas para seções não-overview */}
      {currentSection !== 'overview' && (
        <>
          {/* Top Navigation Simples */}
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateToSection('overview')}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  ← Voltar ao Painel
                </button>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Online
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumb Simples */}
          <div className="bg-gray-50 border-b">
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Painel</span>
                <span>›</span>
                <span className="text-gray-900 font-medium">{getSectionTitle(currentSection)}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className={currentSection === 'overview' ? '' : 'container mx-auto px-4 py-8'}>
        {renderCurrentSection()}
      </div>
    </div>
  );
};

export default Admin;
