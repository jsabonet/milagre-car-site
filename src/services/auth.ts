const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

class AuthService {
  private token: string | null = null;
  private adminStatus: boolean | null = null;

  constructor() {
    this.token = localStorage.getItem('admin_token');
    // Cache do status de admin
    const cachedAdminStatus = localStorage.getItem('admin_status');
    this.adminStatus = cachedAdminStatus ? JSON.parse(cachedAdminStatus) : null;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.non_field_errors?.[0] || 'Erro no login');
    }

    const data: AuthResponse = await response.json();
    this.token = data.token;
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify(data.user));
    
    return data;
  }

  async logout(): Promise<void> {
    if (this.token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${this.token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Erro no logout:', error);
      }
    }

    this.token = null;
    this.adminStatus = null;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_status');
  }

  async checkAdmin(): Promise<{ is_admin: boolean; username: string }> {
    if (!this.token) {
      throw new Error('Não autenticado');
    }

    // Se já temos o status em cache e o token ainda é válido, usar cache
    if (this.adminStatus !== null) {
      return { is_admin: this.adminStatus, username: this.getUser()?.username || '' };
    }

    const response = await fetch(`${API_BASE_URL}/auth/check-admin/`, {
      headers: {
        'Authorization': `Token ${this.token}`,
      },
    });

    if (!response.ok) {
      // Token inválido, limpar dados
      await this.logout();
      throw new Error('Erro ao verificar permissões');
    }

    const result = await response.json();
    
    // Cache do status de admin
    this.adminStatus = result.is_admin;
    localStorage.setItem('admin_status', JSON.stringify(result.is_admin));
    
    return result;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    const userData = localStorage.getItem('admin_user');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user ? (user.is_staff || user.is_superuser) : false;
  }

  // Método para verificação rápida sem chamada à API
  isAdminCached(): boolean {
    return this.adminStatus === true;
  }

  // Método específico para verificar status de admin (compatibilidade)
  async checkAdminStatus(): Promise<boolean> {
    try {
      const result = await this.checkAdmin();
      return result.is_admin;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();
