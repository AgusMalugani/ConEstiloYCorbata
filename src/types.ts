export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  sizes: string[];
  category: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}