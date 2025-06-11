export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  sizes: string[];
  category: string;
  imageUrl: string;
  stock?: number;
}

export interface CartItem extends Product {
  selectedSize: string;
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