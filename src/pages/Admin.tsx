import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Car as CarIcon, Tags, ArrowLeft, Eye, Loader2, Images, X, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/mozambique-utils";
import { useCars, useCategories, useCreateCar, useUpdateCar, useDeleteCar, useCreateCategory, useDeleteCategory } from "@/hooks/useApi";
import { Car, apiService } from "@/services/api";
import CarImageUpload from "@/components/CarImageUpload";
import PrimaryImageUpload from "@/components/PrimaryImageUpload";
import CarImageGallery from "@/components/CarImageGallery";
import SecondaryImagesUpload from "@/components/SecondaryImagesUpload";
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
  const { data: categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories();
  const createCarMutation = useCreateCar();
  const updateCarMutation = useUpdateCar();
  const deleteCarMutation = useDeleteCar();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [newCar, setNewCar] = useState({
    model: "",
    make: "",
    year: "",
    price: "",
    mileage: "",
    fuel_type: "Gasolina",
    location: "Maputo",
    category: "",
    description: "",
    transmission: "Manual",
    color: "",
    featured: false
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]); // Secundárias
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [primaryImagePreview, setPrimaryImagePreview] = useState<string | null>(null);

  const [newCategory, setNewCategory] = useState("");

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    setNewCar({ ...newCar, price: numericValue });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validFiles = files.filter(file => validTypes.includes(file.type));
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Aviso",
        description: "Alguns arquivos foram ignorados. Use apenas imagens JPG, PNG ou WebP.",
        variant: "destructive"
      });
    }
    
    // Limit to 10 images
    const limitedFiles = validFiles.slice(0, 10);
    if (validFiles.length > 10) {
      toast({
        title: "Aviso",
        description: "Máximo de 10 imagens permitidas. Algumas foram removidas.",
        variant: "destructive"
      });
    }
    
    setSelectedImages(limitedFiles);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCar = async () => {
    if (!newCar.model || !newCar.make || !newCar.price || !primaryImage) {
      toast({
        title: "Erro",
        description: !primaryImage ? "A imagem principal é obrigatória" : "Preencha todos os campos obrigatórios",
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

    // Validate minimum price (reasonable minimum for vehicles)
    if (Number(newCar.price) < 1000) {
      toast({
        title: "Erro",
        description: "Preço parece muito baixo. Verifique se inseriu o valor correto em MZN",
        variant: "destructive"
      });
      return;
    }

    if (newCar.year && (isNaN(Number(newCar.year)) || Number(newCar.year) < 1975 || Number(newCar.year) > new Date().getFullYear() + 1)) {
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

      // 1. Cria o carro (apenas dados, sem imagens)
      const createdCar = await createCarMutation.mutateAsync(cleanCarData);

      // Adicione este log para depuração:
      console.log('createdCar:', createdCar);

      // Só faz upload se o carro foi criado e tem id
      if (createdCar && createdCar.id) {
        const formData = new FormData();
        if (primaryImage) {
          formData.append('images', primaryImage);
          formData.append('is_primary', 'true');
          formData.append('alt_text_0', `${newCar.make} ${newCar.model} - Capa`);
        }
        selectedImages.forEach((file, index) => {
          formData.append('images', file);
          formData.append(`alt_text_${index + 1}`, `${newCar.make} ${newCar.model} - Imagem ${index + 1}`);
        });

        if (primaryImage || selectedImages.length > 0) {
          await fetch(`http://127.0.0.1:8000/api/cars/${createdCar.id}/add_images/`, {
            method: 'POST',
            body: formData,
          });
        }
      } else {
        toast({
          title: "Erro",
          description: "Erro ao criar carro (ID não retornado pelo backend)",
          variant: "destructive"
        });
        return;
      }

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
      // Se uma nova imagem principal foi selecionada, faz upload dela
      if (primaryImage) {
        const formData = new FormData();
        formData.append('images', primaryImage); // <-- Corrigido para 'images'
        formData.append('is_primary', 'true');
        formData.append('alt_text_0', `${newCar.make} ${newCar.model} - Capa`);
        try {
          await fetch(`http://127.0.0.1:8000/api/cars/${editingCar.id}/add_images/`, {
            method: 'POST',
            body: formData,
          });
        } catch (imageError) {
          console.error('Erro ao atualizar imagem principal:', imageError);
          toast({
            title: "Aviso",
            description: "Carro atualizado, mas houve erro ao atualizar a imagem principal.",
          });
        }
      }
      // Se houver imagens secundárias novas, faz upload delas
      if (selectedImages.length > 0) {
        const formData = new FormData();
        selectedImages.forEach((file, index) => {
          formData.append('images', file);
          formData.append(`alt_text_${index}`, `${newCar.make} ${newCar.model} - Imagem ${index + 1}`);
        });
        try {
          await fetch(`http://127.0.0.1:8000/api/cars/${editingCar.id}/add_images/`, {
            method: 'POST',
            body: formData,
          });
        } catch (imageError) {
          console.error('Erro ao fazer upload das imagens secundárias:', imageError);
          toast({
            title: "Aviso",
            description: "Carro atualizado, mas houve erro ao enviar imagens secundárias.",
          });
        }
      }
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
      fuel_type: "Gasolina",
      location: "Maputo",
      category: "",
      description: "",
      transmission: "Manual",
      color: "",
      featured: false
    });
    setSelectedImages([]);
    setPrimaryImage(null);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome da categoria",
        variant: "destructive"
      });
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({
        name: newCategory.trim(),
      });

      toast({
        title: "Sucesso",
        description: "Categoria adicionada com sucesso!",
      });

      setNewCategory("");
      setIsAddingCategory(false);
      refetchCategories();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar categoria",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const carCount = cars?.filter(car => car.category.id === categoryId).length || 0;
    
    if (carCount > 0) {
      toast({
        title: "Erro",
        description: `Não é possível excluir esta categoria pois ela possui ${carCount} ${carCount === 1 ? 'carro' : 'carros'} associado${carCount === 1 ? '' : 's'}.`,
        variant: "destructive"
      });
      return;
    }

    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await deleteCategoryMutation.mutateAsync(categoryId);
        toast({
          title: "Sucesso",
          description: "Categoria excluída com sucesso!",
        });
        refetchCategories();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir categoria",
          variant: "destructive"
        });
      }
    }
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car); // car deve conter o array images vindo do backend
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
      transmission: car.transmission || "Manual",
      color: car.color || "",
      featured: car.featured
    });
    // Definir preview da imagem principal existente
    const principal = car.images?.find(img => img.is_primary) || (car.primary_image ? { image: car.primary_image } : null);
    setPrimaryImage(null);
    setPrimaryImagePreview(principal?.image || null);
    setIsAddingCar(true);
  };

  const handleManageImages = (carId: number) => {
    setSelectedCarForImages(carId);
    setShowImageUpload(true);
  };

  const handleImagesUpdated = async (updatedImages: any[]) => {
    console.log('handleImagesUpdated chamado com:', updatedImages);
    console.log('editingCar:', editingCar);
    console.log('selectedCarForImages:', selectedCarForImages);
    
    // Pequeno delay para garantir que o servidor processou a mudança
    setTimeout(async () => {
      console.log('Executando revalidação após delay...');
      
      // Forçar revalidação dos dados
      await refetchCars();
      
      // Se estiver editando um carro, atualizar o preview da imagem principal
      if (editingCar && selectedCarForImages === editingCar.id) {
        console.log('Atualizando preview do carro em edição...');
        // Buscar os dados atualizados do carro
        try {
          const updatedCar = await apiService.getCar(editingCar.id);
          console.log('Dados atualizados do carro:', updatedCar);
          setEditingCar({
            ...editingCar,
            primary_image: updatedCar.primary_image,
            images: updatedCar.images
          });
        } catch (error) {
          console.error('Erro ao buscar dados atualizados do carro:', error);
          // Fallback: usar as imagens passadas pelo componente
          const primaryImage = updatedImages?.find(img => img.is_primary);
          console.log('Usando fallback, primaryImage encontrada:', primaryImage);
          if (primaryImage || updatedImages?.length === 0) {
            setEditingCar({
              ...editingCar,
              primary_image: primaryImage?.image || primaryImage?.image_url || null
            });
          }
        }
      }
    }, 500); // 500ms delay
    
    toast({
      title: "Sucesso", 
      description: "Imagens atualizadas com sucesso!",
    });
  };

  // Adicione esta função dentro do componente Admin
  const handleRemoveExistingImage = async (imageId: number) => {
    if (!editingCar) return;
    try {
      // Chama a API para remover a imagem
      await fetch(`http://127.0.0.1:8000/api/cars/${editingCar.id}/remove_image/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_id: imageId }),
      });
      // Atualiza o estado local removendo a imagem
      setEditingCar({
        ...editingCar,
        images: editingCar.images.filter(img => img.id !== imageId),
      });
      toast({
        title: "Sucesso",
        description: "Imagem removida com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover imagem",
        variant: "destructive"
      });
    }
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
                <p className="text-muted-foreground">MILAGRE CAR & COMÉRCIO</p>
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
                        type="text"
                        min="1000"
                        value={newCar.price || ''}
                        onChange={handlePriceChange}
                        placeholder="Ex: 1500000 (1.5 milhões MZN)"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Digite o valor em MZN (ex: 1500000 para 1.5 milhões)
                      </p>
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
                        <SelectTrigger id="fuel_type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gasolina">Gasolina</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={newCar.category ? newCar.category.toString() : ''} onValueChange={(value) => setNewCar({ ...newCar, category: value })}>
                        <SelectTrigger id="category">
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
                        <SelectTrigger id="transmission">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manual">Manual</SelectItem>
                          <SelectItem value="Automática">Automática</SelectItem>
                          <SelectItem value="Semi-automática">Semi-automática</SelectItem>
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
                    
                    
                    {/* Upload de Imagem Principal */}
                    <div className="md:col-span-2 space-y-4">
                      <PrimaryImageUpload
                        image={editingCar ? editingCar.images?.find(img => img.is_primary) || null : null}
                        onImageChange={setPrimaryImage}
                        previewUrl={editingCar ? primaryImagePreview : null}
                        disabled={false}
                      />
                      <SecondaryImagesUpload
                        files={selectedImages}
                        onFilesChange={setSelectedImages}
                        disabled={false}
                      />
                      {/* Preview das imagens secundárias já cadastradas */}
                      {editingCar?.images && editingCar.images.filter(img => !img.is_primary).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {editingCar.images
                            .filter(img => !img.is_primary)
                            .map((img) => (
                              <div key={img.id} className="relative w-20 h-20 rounded overflow-hidden border bg-gray-100 flex items-center justify-center">
                                <img src={img.image_url || img.image} alt={img.alt_text} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  className="absolute top-0 right-0 bg-white/80 rounded-bl px-1 py-0.5"
                                  onClick={() => handleRemoveExistingImage(img.id)}
                                  title="Remover imagem"
                                >
                                  <span className="text-xs">✕</span>
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    

                    
                    <div className="md:col-span-2">
                      <label htmlFor="featured" className="flex items-center space-x-2">
                        <input
                          id="featured"
                          name="featured"
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
                        <TableHead>Imagens</TableHead>
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
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={car.images && car.images.length > 0 ? "default" : "secondary"}
                                className="text-xs"
                              >
                                <Images className="h-3 w-3 mr-1" />
                                {car.images ? car.images.length : 0}
                              </Badge>
                              {car.primary_image && (
                                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                                  Principal ✓
                                </Badge>
                              )}
                            </div>
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
                    <Label htmlFor="categoryName">Nome da Categoria *</Label>
                    <Input
                      id="categoryName"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Ex: Pickup, Conversível, SUV Compacto"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAddCategory} 
                      variant="premium" 
                      className="flex-1"
                      disabled={createCategoryMutation.isPending}
                    >
                      {createCategoryMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {createCategoryMutation.isPending ? "Criando..." : "Adicionar"}
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategory("");
                      }} 
                      variant="outline" 
                      className="flex-1"
                    >
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
                                onClick={() => handleDeleteCategory(category.id)}
                                title="Excluir categoria"
                                disabled={deleteCategoryMutation.isPending}
                              >
                                {deleteCategoryMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
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


      </div>
    </div>
  );
};

export default Admin;