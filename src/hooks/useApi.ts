import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiService, Car, Category, CarFilters, ApiResponse } from '../services/api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseApiListState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  refetch: () => Promise<void>;
}

// Hook para buscar carros usando React Query
export function useCars(filters?: CarFilters): UseApiListState<Car> {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cars', filters],
    queryFn: () => apiService.getCars(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data: data?.results || [],
    loading: isLoading,
    error: error?.message || null,
    pagination: {
      count: data?.count || 0,
      next: data?.next || null,
      previous: data?.previous || null,
    },
    refetch: async () => {
      await refetch();
    },
  };
}

// Hook para buscar um carro específico
export function useCar(id: number): UseApiState<Car> {
  const [data, setData] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const car = await apiService.getCar(id);
      setData(car);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar carro');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  return {
    data,
    loading,
    error,
    refetch: fetchCar,
  };
}

// Hook para buscar categorias usando React Query
export function useCategories(): UseApiListState<Category> {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data: data?.results || [],
    loading: isLoading,
    error: error?.message || null,
    pagination: {
      count: data?.count || 0,
      next: data?.next || null,
      previous: data?.previous || null,
    },
    refetch: async () => {
      await refetch();
    },
  };
}

// Hook para carros em destaque usando React Query
export function useFeaturedCars(): UseApiState<Car[]> {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['featured-cars'],
    queryFn: () => apiService.getFeaturedCars(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch: async () => {
      await refetch();
    },
  };
}

// Hook para estatísticas usando React Query
export function useCarStats() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['car-stats'],
    queryFn: () => apiService.getCarStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch: async () => {
      await refetch();
    },
  };
}

// Hook para operações de mutação (criar, editar, deletar)
export function useCarMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCar = async (carData: FormData): Promise<Car | null> => {
    try {
      setLoading(true);
      setError(null);
      const newCar = await apiService.createCar(carData);
      return newCar;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar carro');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCar = async (id: number, carData: Partial<Car>): Promise<Car | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedCar = await apiService.updateCar(id, carData);
      return updatedCar;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar carro');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await apiService.deleteCar(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar carro');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await apiService.toggleCarFeatured(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar destaque');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCar,
    updateCar,
    deleteCar,
    toggleFeatured,
    loading,
    error,
  };
}

export function useCategoryMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = async (categoryData: Omit<Category, 'id' | 'car_count' | 'created_at' | 'updated_at'>): Promise<Category | null> => {
    try {
      setLoading(true);
      setError(null);
      const newCategory = await apiService.createCategory(categoryData);
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar categoria');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: number, categoryData: Partial<Category>): Promise<Category | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedCategory = await apiService.updateCategory(id, categoryData);
      return updatedCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar categoria');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await apiService.deleteCategory(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar categoria');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
    error,
  };
}

// Hooks de mutação individuais com React Query
export function useCreateCar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (carData: any) => {
      console.log('Creating car with data:', carData);
      const formData = new FormData();
      
      // Only append non-empty fields
      Object.keys(carData).forEach(key => {
        const value = carData[key];
        if (value !== undefined && value !== null && value !== '') {
          // Convert boolean to string for form data
          if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else if (typeof value === 'number' && !isNaN(value)) {
            formData.append(key, value.toString());
          } else if (typeof value === 'string' && value.trim() !== '') {
            formData.append(key, value.trim());
          }
        }
      });
      
      // Log the form data for debugging
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      return apiService.createCar(formData);
    },
    onSuccess: () => {
      console.log('Car created successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
    onError: (error) => {
      console.error('Error creating car:', error);
    },
  });
}

export function useUpdateCar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiService.updateCar(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
}

export function useDeleteCar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      return apiService.deleteCar(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoryData: Omit<Category, 'id' | 'car_count' | 'created_at' | 'updated_at'>) => {
      return apiService.createCategory(categoryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Category> }) => {
      return apiService.updateCategory(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      return apiService.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
