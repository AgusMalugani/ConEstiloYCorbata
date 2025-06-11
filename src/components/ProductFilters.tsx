import React from 'react';

interface ProductFiltersProps {
  categories: string[];
  filteredCategory: string;
  setFilteredCategory: (category: string) => void;
  loading?: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  filteredCategory,
  setFilteredCategory,
  loading = false,
}) => (
  <div className="bg-white p-6 rounded-lg shadow sticky top-20">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
    <div className="mb-6">
      <h4 className="font-medium text-gray-700 mb-2">Categoría</h4>
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap lg:flex-col gap-2">
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 text-sm rounded-md text-left capitalize transition-colors ${
                filteredCategory === category
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFilteredCategory(filteredCategory === category ? '' : category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
    {filteredCategory && (
      <button
        className="text-pink-600 hover:text-pink-700 text-sm font-medium transition-colors"
        onClick={() => setFilteredCategory('')}
      >
        Limpiar filtros
      </button>
    )}
  </div>
);

export default ProductFilters;