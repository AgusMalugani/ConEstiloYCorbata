import { useState, useEffect } from 'react';
import { apiService, ApiProduct } from '../services/api';
import { Product } from '../types';

// Convert API product to frontend product format
const convertApiProduct = (apiProduct: ApiProduct): Product => ({
  id: apiProduct.id,
  name: apiProduct.name,
  price: apiProduct.price,
  description: apiProduct.description,
  sizes: apiProduct.sizes,
  category: apiProduct.category,
  imageUrl: apiProduct.imageUrl,
});

export const useProducts = (category?: string, sortBy?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiProducts = await apiService.getProducts(category, sortBy);
        const convertedProducts = apiProducts.map(convertApiProduct);
        setProducts(convertedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sortBy]);

  return { products, loading, error, refetch: () => fetchProducts() };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiCategories = await apiService.getCategories();
        setCategories(apiCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};