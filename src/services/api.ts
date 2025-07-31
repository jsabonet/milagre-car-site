const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Tipos para os dados da API
export interface Car {
  id: number;
  make: string;
  model: string;
  brand: string;
  name: string;
  year: number;
  price: number;
  formatted_price: string;
  fuel_type: string;
  fuel: string;
  transmission: string;
  mileage?: number;
  color?: string;
  location?: string;
  description?: string;
  category: Category;
  category_id?: number;
  images: CarImage[];
  primary_image?: string;
  featured: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  car_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface CarImage {
  id: number;
  image: string;
  image_url?: string;
  alt_text: string;
  is_primary: boolean;
  created_at?: string;
}

export interface CarFilters {
  make?: string;
  model?: string;
  brand?: string;
  name?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  mileage_max?: number;
  fuel_type?: string;
  fuel?: string;
  transmission?: string;
  category?: number;
  featured?: boolean;
  location?: string;
  search?: string;
  ordering?: string;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Check if response has content (status 204 No Content returns empty body)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      // For non-JSON responses, return empty object
      return {} as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Métodos para Cars
  async getCars(filters?: CarFilters): Promise<ApiResponse<Car>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString();
    const endpoint = queryString ? `/cars/?${queryString}` : '/cars/';
    return this.makeRequest<ApiResponse<Car>>(endpoint);
  }

  async getCar(id: number): Promise<Car> {
    return this.makeRequest<Car>(`/cars/${id}/`);
  }

  async createCar(carData: any): Promise<Car> {
    return this.makeRequest<Car>('/cars/', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  }

  async updateCar(id: number, carData: Partial<Car>): Promise<Car> {
    return this.makeRequest<Car>(`/cars/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(carData),
    });
  }

  async deleteCar(id: number): Promise<void> {
    await this.makeRequest<void>(`/cars/${id}/`, {
      method: 'DELETE',
    });
    // Delete operations typically return 204 No Content, so no return value needed
  }

  async getFeaturedCars(): Promise<Car[]> {
    return this.makeRequest<Car[]>('/cars/featured/');
  }

  async getCarStats(): Promise<any> {
    return this.makeRequest('/cars/stats/');
  }

  async toggleCarFeatured(id: number): Promise<{ id: number; featured: boolean; message: string }> {
    return this.makeRequest(`/cars/${id}/toggle_featured/`, {
      method: 'POST',
    });
  }

  async addCarImages(id: number, images: File[]): Promise<{ message: string; images: CarImage[] }> {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });

    return this.makeRequest(`/cars/${id}/add_images/`, {
      method: 'POST',
      headers: {}, // Remove Content-Type para FormData
      body: formData,
    });
  }

  async removeCarImage(carId: number, imageId: number): Promise<{ message: string }> {
    return this.makeRequest(`/cars/${carId}/remove_image/`, {
      method: 'DELETE',
      body: JSON.stringify({ image_id: imageId }),
    });
  }

  async setCarPrimaryImage(carId: number, imageId: number): Promise<any> {
    console.log(`setCarPrimaryImage chamado: carId=${carId}, imageId=${imageId}`);
    const url = `/cars/${carId}/set_primary_image/`;
    console.log(`URL da requisição: ${API_BASE_URL}${url}`);
    
    try {
      const result = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({ image_id: imageId }),
      });
      console.log('setCarPrimaryImage sucesso:', result);
      return result;
    } catch (error) {
      console.error('setCarPrimaryImage erro:', error);
      throw error;
    }
  }

  // Métodos para Categories
  async getCategories(): Promise<ApiResponse<Category>> {
    return this.makeRequest<ApiResponse<Category>>('/categories/');
  }

  async getCategory(id: number): Promise<Category> {
    return this.makeRequest<Category>(`/categories/${id}/`);
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'car_count' | 'created_at' | 'updated_at'>): Promise<Category> {
    return this.makeRequest<Category>('/categories/', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category> {
    return this.makeRequest<Category>(`/categories/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: number): Promise<void> {
    await this.makeRequest<void>(`/categories/${id}/`, {
      method: 'DELETE',
    });
    // Delete operations typically return 204 No Content, so no return value needed
  }

  async getCategoryStats(): Promise<{
    total_categories: number;
    categories_with_cars: number;
    empty_categories: number;
  }> {
    return this.makeRequest('/categories/stats/');
  }
}

export const apiService = new ApiService();
export default apiService;
