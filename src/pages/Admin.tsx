import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Car as CarIcon, Tags, ArrowLeft, Eye, Loader2, Images } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/mozambique-utils";
import { useCars, useCategories, useCreateCar, useUpdateCar, useDeleteCar } from "@/hooks/useApi";
import { Car } from "@/services/api";
import CarImageUpload from "@/components/CarImageUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"cars" | "categories">("cars");
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedCarForImages, setSelectedCarForImages] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // API Hooks
  const { data: cars, loading: carsLoading, error: carsError, refetch: refetchCars } = useCars();
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const createCarMutation = useCreateCar();
  const updateCarMutation = useUpdateCar();
  const deleteCarMutation = useDeleteCar();

  const [newCar, setNewCar] = useState({
    model: "",
    make: "",
    year: "",
    price: "",
    mileage: "",
    fuel_type: "gasolina",
    location: "Maputo",
    category: "",
    description: "",
    transmission: "manual",
    color: "",
    is_available: true,
    featured: false
  });

  const [newCategory, setNewCategory] = useState("");

  const handleAddCar = async () => {
    if (!newCar.model || !newCar.make || !newCar.price) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Validate numeric fields
    if (isNaN(Number(newCar.price)) || Number(newCar.price) <= 0) {
      toast({
        title: "Erro",
        description: "Preço deve ser um número válido maior que zero",
        variant: "destructive"
      });
      return;
    }

    if (newCar.year && (isNaN(Number(newCar.year)) || Number(newCar.year) < 1900 || Number(newCar.year) > new Date().getFullYear() + 1)) {
      toast({
        title: "Erro",
        description: "Ano deve ser válido",
        variant: "destructive"
      });
      return;
    }

    if (newCar.mileage && isNaN(Number(newCar.mileage))) {
      toast({
        title: "Erro",
        description: "Quilometragem deve ser um número válido",
        variant: "destructive"
      });
      return;
    }

    try {
      // Clean the data before sending
      const cleanCarData = {
        ...newCar,
        price: Number(newCar.price),
        year: newCar.year ? Number(newCar.year) : undefined,
        mileage: newCar.mileage ? Number(newCar.mileage) : undefined,
        category: newCar.category ? Number(newCar.category) : undefined,
      };

      await createCarMutation.mutateAsync(cleanCarData);
      toast({
        title: "Sucesso",
        description: "Carro adicionado com sucesso!",
      });

      resetForm();
      setIsAddingCar(false);
      refetchCars();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar carro",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCar = async () => {
    if (!editingCar || !newCar.model || !newCar.make || !newCar.price) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateCarMutation.mutateAsync({ id: editingCar.id, data: newCar });
      toast({
        title: "Sucesso",
        description: "Carro atualizado com sucesso!",
      });

      resetForm();
      setEditingCar(null);
      setIsAddingCar(false);
      refetchCars();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar carro",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCar = async (carId: number) => {
    if (confirm("Tem certeza que deseja excluir este carro?")) {
      try {
        await deleteCarMutation.mutateAsync(carId);
        toast({
          title: "Sucesso",
          description: "Carro excluído com sucesso!",
        });
        refetchCars();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir carro",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setNewCar({
      model: "",
      make: "",
      year: "",
      price: "",
      mileage: "",
      fuel_type: "gasolina",
      location: "Maputo",
      category: "",
      description: "",
      transmission: "manual",
      color: "",
      is_available: true,
      featured: false
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome da categoria",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Categoria adicionada com sucesso!",
    });

    setNewCategory("");
    setIsAddingCategory(false);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setNewCar({
      model: car.model,
      make: car.make,
      year: car.year.toString(),
      price: car.price.toString(),
      mileage: car.mileage ? car.mileage.toString() : "",
      fuel_type: car.fuel_type,
      location: car.location || "Maputo",
      category: car.category.id.toString(),
      description: car.description || "",
      transmission: car.transmission || "manual",
      color: car.color || "",
      is_available: car.is_available,
      featured: car.featured
    });
    setIsAddingCar(true);
  };

  const handleManageImages = (carId: number) => {
    setSelectedCarForImages(carId);
    setShowImageUpload(true);
  };

  const handleImagesUpdated = () => {
    refetchCars();
    toast({
      title: "Sucesso",
      description: "Imagens atualizadas com sucesso!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Site
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
                <p className="text-muted-foreground">MILAGRE CAR COMÉRCIO</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-8 max-w-md">
          <button
            onClick={() => setActiveTab("cars")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "cars"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CarIcon className="h-4 w-4" />
            Carros
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "categories"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Tags className="h-4 w-4" />
            Categorias
          </button>
        </div>

        {/* Cars Tab */}
        {activeTab === "cars" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciar Carros</h2>
              <Dialog open={isAddingCar} onOpenChange={(open) => {
                setIsAddingCar(open);
                if (!open) {
                  setEditingCar(null);
                  resetForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="premium">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Carro
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCar ? "Editar Carro" : "Adicionar Novo Carro"}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="model">Modelo *</Label>
                      <Input
                        id="model"
                        value={newCar.model}
                        onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                        placeholder="Ex: Civic Touring"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="make">Marca *</Label>
                      <Input
                        id="make"
                        value={newCar.make}
                        onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                        placeholder="Ex: Honda"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="year">Ano</Label>
                      <Input
                        id="year"
                        type="number"
                        value={newCar.year || ''}
                        onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="price">Preço (MZN) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newCar.price || ''}
                        onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="mileage">Quilometragem</Label>
                      <Input
                        id="mileage"
                        type="number"
                        value={newCar.mileage || ''}
                        onChange={(e) => setNewCar({ ...newCar, mileage: e.target.value })}
                        placeholder="0 km"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fuel_type">Combustível</Label>
                      <Select value={newCar.fuel_type} onValueChange={(value) => setNewCar({ ...newCar, fuel_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gasolina">Gasolina</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={newCar.category ? newCar.category.toString() : ''} onValueChange={(value) => setNewCar({ ...newCar, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="transmission">Transmissão</Label>
                      <Select value={newCar.transmission} onValueChange={(value) => setNewCar({ ...newCar, transmission: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="automatic">Automática</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="color">Cor</Label>
                      <Input
                        id="color"
                        value={newCar.color}
                        onChange={(e) => setNewCar({ ...newCar, color: e.target.value })}
                        placeholder="Ex: Branco Pérola"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Localização</Label>
                      <Input
                        id="location"
                        value={newCar.location}
                        onChange={(e) => setNewCar({ ...newCar, location: e.target.value })}
                        placeholder="Ex: Maputo"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={newCar.description}
                        onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
                        placeholder="Descrição detalhada do veículo..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newCar.featured}
                          onChange={(e) => setNewCar({ ...newCar, featured: e.target.checked })}
                          className="rounded border-input"
                        />
                        <span>Marcar como destaque</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={editingCar ? handleUpdateCar : handleAddCar} 
                      variant="premium" 
                      className="flex-1"
                      disabled={createCarMutation.isPending || updateCarMutation.isPending}
                    >
                      {createCarMutation.isPending || updateCarMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {editingCar ? "Atualizar Carro" : "Adicionar Carro"}
                    </Button>
                    <Button 
                      onClick={() => setIsAddingCar(false)} 
                      variant="outline" 
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {carsError && (
              <Alert>
                <AlertDescription>
                  Erro ao carregar carros: {carsError}
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Lista de Carros ({cars?.length || 0} total)</CardTitle>
              </CardHeader>
              <CardContent>
                {carsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Carregando carros...</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Ano</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cars?.map((car) => (
                        <TableRow key={car.id}>
                          <TableCell className="font-medium">{car.model}</TableCell>
                          <TableCell>{car.make}</TableCell>
                          <TableCell>{car.year}</TableCell>
                          <TableCell>{car.formatted_price || formatPrice(car.price)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{car.category.name}</Badge>
                          </TableCell>
                          <TableCell>
                            {car.featured ? (
                              <Badge className="bg-accent text-accent-foreground">Destaque</Badge>
                            ) : (
                              <Badge variant="outline">Normal</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => navigate(`/car/${car.id}`)}
                                title="Ver detalhes"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleManageImages(car.id)}
                                title="Gerenciar imagens"
                              >
                                <Images className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditCar(car)}
                                title="Editar carro"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeleteCar(car.id)}
                                title="Excluir carro"
                                disabled={deleteCarMutation.isPending}
                              >
                                {deleteCarMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciar Categorias</h2>
              <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                <DialogTrigger asChild>
                  <Button variant="premium">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Categoria</DialogTitle>
                  </DialogHeader>
                  
                  <div>
                    <Label htmlFor="categoryName">Nome da Categoria</Label>
                    <Input
                      id="categoryName"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Ex: Pickup, Conversível, SUV Compacto"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleAddCategory} variant="premium" className="flex-1">
                      Adicionar
                    </Button>
                    <Button onClick={() => setIsAddingCategory(false)} variant="outline" className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Categorias ({categories?.length || 0} total)</CardTitle>
              </CardHeader>
              <CardContent>
                {categoriesLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Carregando categorias...</span>
                  </div>
                ) : categoriesError ? (
                  <Alert>
                    <AlertDescription>
                      Erro ao carregar categorias: {categoriesError}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories?.map((category) => {
                      const carCount = cars?.filter(car => car.category.id === category.id).length || 0;
                      return (
                        <Card key={category.id} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary">{category.name}</Badge>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {}}
                                title="Excluir categoria"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {carCount} {carCount === 1 ? 'carro' : 'carros'}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Image Upload Dialog */}
        <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gerenciar Imagens do Carro</DialogTitle>
            </DialogHeader>
            
            {selectedCarForImages && (
              <CarImageUpload
                carId={selectedCarForImages}
                existingImages={cars?.find(car => car.id === selectedCarForImages)?.images || []}
                onImagesUpdated={handleImagesUpdated}
                maxFiles={10}
                maxSize={5}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;