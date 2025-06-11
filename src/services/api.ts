const API_BASE_URL = 'http://localhost:3001/api';

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
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getProducts(category?: string, sortBy?: string): Promise<ApiProduct[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (sortBy) params.append('sortBy', sortBy);
    
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

  async createOrder(orderData: CreateOrderRequest): Promise<{ message: string; order: Partial<ApiOrder> }> {
    return this.request<{ message: string; order: Partial<ApiOrder> }>('/orders', {
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