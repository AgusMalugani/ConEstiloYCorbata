import { useState, useEffect } from 'react';
//import { apiService, ApiProduct } from '../services/api';
import { Product } from '../types';
import { findAllProducts } from '../services/product/findAllProducts.service';

// Convertir producto de la API al formato del frontend
//const convertApiProduct = (apiProduct: ApiProduct): Product => ({
//  id: apiProduct.id,
//  name: apiProduct.name,
//  price: apiProduct.price,
//  description: apiProduct.description,
 // sizes: apiProduct.sizes,
 // category: apiProduct.category,
 // imageUrl: apiProduct.imageUrl,
 // stock: apiProduct.stock,
//});

// Categorías fijas
export const CATEGORIES = [
  'Buzo',
  'Polar soft',
  'Camiseta',
];

export const useProducts = (category?: string, sortBy?: string, color?: string, talle?: number, onlyUniqueImages?: boolean) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiProducts: Product[] = await findAllProducts();
      // Filtrado en frontend
      let filtered: Product[] = apiProducts;
      if (category) filtered = filtered.filter((p: Product) => p.categoria === category);
      if (color) filtered = filtered.filter((p: Product) => p.color === color);
      if (talle) filtered = filtered.filter((p: Product) => p.talle === talle);
      // Filtrar productos con imagen única SOLO si onlyUniqueImages es true
      if (onlyUniqueImages) {
        const uniqueImages = new Set<string>();
        filtered = filtered.filter((p: Product) => {
          if (!p.imageUrl) return false;
          if (uniqueImages.has(p.imageUrl)) return false;
          uniqueImages.add(p.imageUrl);
          return true;
        });
      }
      // Ordenamiento
      if (sortBy === 'precio-asc') filtered = filtered.sort((a: Product, b: Product) => a.precio - b.precio);
      if (sortBy === 'precio-desc') filtered = filtered.sort((a: Product, b: Product) => b.precio - a.precio);
      setProducts(filtered);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los productos';
      setError(errorMessage);
      console.error('Error al obtener productos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sortBy, color, talle, onlyUniqueImages]);

  return { products, loading, error, refetch: fetchProducts };
};

export const useCategories = () => {
  // Devuelve las categorías fijas
  return { categories: CATEGORIES, loading: false, error: null, refetch: () => {} };
};

export const useOrder = (orderId?: number) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
  //TODO : MODIFICAR LA LLAMADA
      const orderData = await apiService.getOrder(id); //TRAIGO UNA ORDEN X ID
      setOrder(orderData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el pedido';
      setError(errorMessage); //GUARDO EL ERROR
      console.error('Error al obtener pedido:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId); //LLAMO LA FUNCION
    }
  }, [orderId]);

  return { order, loading, error, fetchOrder };
};