import React, { useState } from 'react';
import { Product } from '../types';
import ProductFilters from './ProductFilters';
import ProductList from './ProductList';
import { useProducts, useCategories } from '../hooks/useProducts';

interface ProductGridProps {
  onAddToCart: (product: Product, size: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onAddToCart }) => {
  const [filteredCategory, setFilteredCategory] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('featured');

  const { products, loading: productsLoading, error: productsError } = useProducts(filteredCategory, sortOrder);
  const { categories, loading: categoriesLoading } = useCategories();

  if (productsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar los productos: {productsError}</p>
          <p className="text-gray-600">Por favor, asegúrate de que el servidor esté funcionando.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="productos">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Ordenar por:
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            disabled={productsLoading}
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="name">Nombre</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0">
          <ProductFilters
            categories={categories}
            filteredCategory={filteredCategory}
            setFilteredCategory={setFilteredCategory}
            loading={categoriesLoading}
          />
        </div>
        <div className="flex-1">
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductList products={products} onAddToCart={onAddToCart} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;