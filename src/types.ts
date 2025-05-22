export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  sizes: string[];
  category: 'sueter' | 'camisetas' | 'buzos' | 'chalecos' | 'accesorios';
  imageUrl: string;
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}