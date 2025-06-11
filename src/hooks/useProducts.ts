import { useState, useEffect } from 'react';
import { apiService, ApiProduct } from '../services/api';
import { Product } from '../types';

// Convertir producto de la API al formato del frontend
const convertApiProduct = (apiProduct: ApiProduct): Product => ({
  id: apiProduct.id,
  name: apiProduct.name,
  price: apiProduct.price,
  description: apiProduct.description,
  sizes: apiProduct.sizes,
  category: apiProduct.category,
  imageUrl: apiProduct.imageUrl,
  stock: apiProduct.stock,
});

export const useProducts = (category?: string, sortBy?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiProducts = await apiService.getProducts(category, sortBy);
      const convertedProducts = apiProducts.map(convertApiProduct);
      setProducts(convertedProducts);
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
  }, [category, sortBy]);

  return { products, loading, error, refetch: fetchProducts };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiCategories = await apiService.getCategories();
      setCategories(apiCategories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las categorías';
      setError(errorMessage);
      console.error('Error al obtener categorías:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
};

export const useOrder = (orderId?: number) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const orderData = await apiService.getOrder(id);
      setOrder(orderData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el pedido';
      setError(errorMessage);
      console.error('Error al obtener pedido:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  return { order, loading, error, fetchOrder };
};