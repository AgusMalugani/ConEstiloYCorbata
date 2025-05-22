import React, { useState } from 'react';
import { Product } from '../types';
import ProductFilters from './ProductFilters';
import ProductList from './ProductList';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, size: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  const [filteredCategory, setFilteredCategory] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('featured');

  const categories = ['sueter', 'camisetas', 'buzos', 'chalecos', 'accesorios'];

  const filteredProducts = products.filter(product => {
    const matchesCategory = !filteredCategory || product.category === filteredCategory;
    return matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

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
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0">
          <ProductFilters
            categories={categories}
            filteredCategory={filteredCategory}
            setFilteredCategory={setFilteredCategory}
          />
        </div>
        <div className="flex-1">
          <ProductList products={sortedProducts} onAddToCart={onAddToCart} />
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;