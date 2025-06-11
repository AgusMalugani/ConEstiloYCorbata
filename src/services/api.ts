const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  sizes: string[];
  category: string;
  imageUrl: string;
  stock: number;
}

export interface ApiOrder {
  id: number;
  items: any[];
  customerInfo: {
    email: string;
    phone: string;
  };
  total: number;
  status: string;
  createdAt: string;
  paymentInfo: {
    cbu: string;
    alias: string;
    whatsapp: string;
  };
}

export interface CreateOrderRequest {
  items: Array<{
    id: number;
    name: string;
    price: number;
    selectedSize: string;
    quantity: number;
  }>;
  customerInfo: {
    email: string;
    phone: string;
  };
  total: number;
}

export interface CreateOrderResponse {
  message: string;
  order: {
    id: number;
    status: string;
    total: number;
    paymentInfo: {
      cbu: string;
      alias: string;
      whatsapp: string;
    };
  };
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('No se puede conectar con el servidor. Verifica que esté funcionando.');
      }
      console.error(`Error en la petición API para ${endpoint}:`, error);
      throw error;
    }
  }

  async getProducts(category?: string, sortBy?: string): Promise<ApiProduct[]> {
    const params = new URLSearchParams();
    if (category && category.trim() !== '') {
      params.append('category', category);
    }
    if (sortBy && sortBy.trim() !== '') {
      params.append('sortBy', sortBy);
    }
    
    const queryString = params.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ApiProduct[]>(endpoint);
  }

  async getProduct(id: number): Promise<ApiProduct> {
    return this.request<ApiProduct>(`/products/${id}`);
  }

  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/categories');
  }

  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    return this.request<CreateOrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id: number): Promise<ApiOrder> {
    return this.request<ApiOrder>(`/orders/${id}`);
  }

  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();