import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  StarOff,
  Copy,
  Download,
  Upload,
  MoreHorizontal,
  Check
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Car } from "@/data/cars";

interface AdminCarTableProps {
  cars: Car[];
  onEdit?: (car: Car) => void;
  onDelete?: (carId: string) => void;
  onToggleFeatured?: (carId: string) => void;
  onBulkAction?: (action: string, carIds: string[]) => void;
}

const AdminCarTable = ({ 
  cars, 
  onEdit, 
  onDelete, 
  onToggleFeatured, 
  onBulkAction 
}: AdminCarTableProps) => {
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

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

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedCars(cars.map(car => car.id));
    } else {
      setSelectedCars([]);
    }
  };

  const handleSelectCar = (carId: string, checked: boolean) => {
    if (checked) {
      setSelectedCars(prev => [...prev, carId]);
    } else {
      setSelectedCars(prev => prev.filter(id => id !== carId));
      setSelectAll(false);
    }
  };

  const handleBulkAction = (action: string) => {
    if (onBulkAction && selectedCars.length > 0) {
      onBulkAction(action, selectedCars);
      setSelectedCars([]);
      setSelectAll(false);
    }
  };

  const getStatusColor = (car: Car) => {
    // Simula diferentes status baseado em características do carro
    if (car.featured) return "bg-green-100 text-green-800";
    if (car.year < 2020) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusText = (car: Car) => {
    if (car.featured) return "Destaque";
    if (car.year < 2020) return "Promoção";
    return "Ativo";
  };

  return (
    <div className="space-y-4">
      {/* Ações em Massa */}
      {selectedCars.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-900">
            {selectedCars.length} veículo(s) selecionado(s)
          </span>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction('feature')}
              className="gap-2"
            >
              <Star className="h-4 w-4" />
              Destacar
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction('unfeature')}
              className="gap-2"
            >
              <StarOff className="h-4 w-4" />
              Remover Destaque
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction('export')}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction('delete')}
              className="gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Detalhes</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-muted-foreground">
                    <p className="text-lg font-medium">Nenhum veículo encontrado</p>
                    <p className="text-sm">Ajuste os filtros ou adicione novos veículos</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              cars.map((car) => (
                <TableRow key={car.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedCars.includes(car.id)}
                      onCheckedChange={(checked) => 
                        handleSelectCar(car.id, checked as boolean)
                      }
                      aria-label={`Selecionar ${car.name}`}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={car.images[0]}
                        alt={car.name}
                        className="w-16 h-12 object-cover rounded border"
                      />
                      <div>
                        <p className="font-medium">{car.name}</p>
                        <p className="text-sm text-muted-foreground">{car.brand}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {car.category}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>📅 {car.year}</div>
                      <div>🛣️ {formatMileage(car.mileage)}</div>
                      <div>⛽ {car.fuel}</div>
                      {car.transmission && <div>⚙️ {car.transmission}</div>}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-semibold text-lg">
                      {formatPrice(car.price)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getStatusColor(car)}>
                      {getStatusText(car)}
                    </Badge>
                    {car.featured && (
                      <Star className="h-4 w-4 text-yellow-500 ml-2 inline" />
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{Math.floor(Math.random() * 1000)} visualizações</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">
                          {Math.floor(Math.random() * 20)} leads
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Adicionado há {Math.floor(Math.random() * 30) + 1} dias
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => onEdit?.(car)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => onToggleFeatured?.(car.id)}
                        className="h-8 w-8 p-0"
                      >
                        {car.featured ? (
                          <StarOff className="h-4 w-4" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Imagens
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => onDelete?.(car.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCarTable;
