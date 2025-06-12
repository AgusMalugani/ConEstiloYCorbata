import React, { useState } from 'react';
import { Product } from '../types';
import ProductFilters from './ProductFilters';
import ProductList from './ProductList';
import { useProducts, useCategories } from '../hooks/useProducts';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  onAddToCart: (product: Product, size: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onAddToCart }) => {
  const [filteredCategory, setFilteredCategory] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('featured');
  const { categories } = useCategories();
  const { products, loading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts(filteredCategory, sortOrder);
  //const { categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories();
//console.log(products);

  const handleRetry = () => {
    refetchProducts();
  //  refetchCategories();
  };

  if (productsError ) { //|| categoriesError
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="productos">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar los datos</h3>
          <p className="text-red-600 mb-4">
            {productsError } 
          </p>
          <div className="space-y-2">
            <p className="text-gray-600 text-sm">
              Asegúrate de que el servidor esté funcionando en el puerto 3001.
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="productos">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Productos
          {!productsLoading && products.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({products.length} {products.length === 1 ? 'producto' : 'productos'})
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Ordenar por:
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 disabled:bg-gray-100"
            disabled={productsLoading}
          >
            <option value="featured">Destacados</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
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
            loading={false}
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