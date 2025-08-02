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

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  subject_display: string;
  message: string;
  preferred_contact: string;
  preferred_contact_display: string;
  status: string;
  status_display: string;
  priority: string;
  priority_display: string;
  admin_response: string;
  responded_at: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  days_since_created: number;
  urgency_level: number;
  is_new: boolean;
  ip_address?: string;
}

export interface MessageStats {
  total_messages: number;
  new_messages: number;
  in_progress_messages: number;
  resolved_messages: number;
  unread_messages: number;
  urgent_messages: number;
  today_messages: number;
  week_messages: number;
  avg_response_time: number;
  subject_stats: { [key: string]: number };
  status_distribution: { [key: string]: number };
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
  color?: string;
  search?: string;
  ordering?: string;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

import { authService } from './auth';

class ApiService {
  private baseURL = API_BASE_URL;

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Adicionar token de autenticação se disponível
    const token = authService.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token inválido, fazer logout
          authService.logout();
          window.location.href = '/admin';
          throw new Error('Sessão expirada');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Métodos para Cars
  async getCars(filters?: CarFilters): Promise<ApiResponse<Car>> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.make) {
        params.append('brand', filters.make); // Mapeia make para brand
      }
      if (filters.location) {
        params.append('location', filters.location);
      }
      if (filters.color) {
        params.append('color', filters.color);
      }
      if (filters.transmission) {
        params.append('transmission', filters.transmission);
      }
      if (filters.fuel) {
        params.append('fuel', filters.fuel);
      }
      if (filters.price_min !== undefined) {
        params.append('price_min', filters.price_min.toString());
      }
      if (filters.price_max !== undefined) {
        params.append('price_max', filters.price_max.toString());
      }
      if (filters.year_min !== undefined) {
        params.append('year_min', filters.year_min.toString());
      }
      if (filters.year_max !== undefined) {
        params.append('year_max', filters.year_max.toString());
      }
      if (filters.category !== undefined) {
        params.append('category', filters.category.toString());
      }
    }

    const response = await this.makeRequest<ApiResponse<Car>>(`/cars/?${params.toString()}`);
    return response;
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

  // Métodos para Contact Messages
  async getContactMessages(filters?: {
    status?: string;
    priority?: string;
    subject?: string;
    search?: string;
    is_read?: string;
  }): Promise<ApiResponse<ContactMessage>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    const url = `/contact-messages/${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.makeRequest<ApiResponse<ContactMessage>>(url);
  }

  async getContactMessage(id: number): Promise<ContactMessage> {
    return this.makeRequest<ContactMessage>(`/contact-messages/${id}/`);
  }

  async createContactMessage(messageData: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    preferred_contact?: string;
  }): Promise<ContactMessage> {
    return this.makeRequest<ContactMessage>('/contact-messages/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Remover autenticação para permitir que qualquer pessoa envie mensagem
      },
      body: JSON.stringify(messageData),
    });
  }

  async updateContactMessage(id: number, updateData: {
    status?: string;
    priority?: string;
    admin_response?: string;
    is_read?: boolean;
  }): Promise<ContactMessage> {
    return this.makeRequest<ContactMessage>(`/contact-messages/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  }

  async markMessageAsRead(id: number): Promise<{ status: string }> {
    return this.makeRequest<{ status: string }>(`/contact-messages/${id}/mark_read/`, {
      method: 'POST',
    });
  }

  async respondToMessage(id: number, response: string): Promise<ContactMessage> {
    return this.makeRequest<ContactMessage>(`/contact-messages/${id}/respond/`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    });
  }

  async getMessageStats(): Promise<MessageStats> {
    return this.makeRequest<MessageStats>('/contact-messages/stats/');
  }

  async getRecentMessages(): Promise<ContactMessage[]> {
    return this.makeRequest<ContactMessage[]>('/contact-messages/recent/');
  }

  async getUrgentMessages(): Promise<ContactMessage[]> {
    return this.makeRequest<ContactMessage[]>('/contact-messages/urgent/');
  }

  async bulkUpdateMessages(messageIds: number[], updateData: {
    status?: string;
    priority?: string;
    is_read?: boolean;
  }): Promise<{ updated_count: number; message: string }> {
    return this.makeRequest<{ updated_count: number; message: string }>('/contact-messages/bulk_update/', {
      method: 'POST',
      body: JSON.stringify({ ids: messageIds, data: updateData }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
