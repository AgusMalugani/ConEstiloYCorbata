export interface Product {
  id: string;
  nombre: string;
  precio: number;
  talle: number;
  categoria: string;
  color:string;
  imageUrl?: string;
  stock?: number;
}

export interface CartItem extends Product {
  selectedSize: number;
  quantity: number;
}

export interface CustomerInfo {
  email: string;
  phone: string;
}

export interface Order {
  id: number;
  items: CartItem[];
  customerInfo: CustomerInfo;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  paymentInfo: {
    cbu: string;
    alias: string;
    whatsapp: string;
  };
}

export interface PaymentInfo {
  cbu: string;
  alias: string;
  whatsapp: string;
}

// Nuevo tipo para producto agrupado
export interface GroupedProduct {
  nombre: string;
  precio: number;
  categoria: string;
  imageUrl?: string;
  opciones: Array<{
    id: string;
    color: string;
    talle: number;
    stock?: number;
  }>;
}