import React, { useState } from 'react';
import { Product } from '../types';
import { Package, AlertTriangle } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product, size: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<{ [id: number]: string }>({});

  const handleAddToCart = (product: Product) => {
    const size = selectedSize[product.id];
    if (size) {
      onAddToCart(product, size);
      setSelectedSize(prev => ({ ...prev, [product.id]: '' }));
    }
  };

  const isOutOfStock = (product: Product) => {
    return product.stock !== undefined && product.stock <= 0;
  };

  const isLowStock = (product: Product) => {
    return product.stock !== undefined && product.stock > 0 && product.stock <= 5;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
        <p className="mt-1 text-sm text-gray-500">
          No se encontraron productos que coincidan con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map(product => (
        <div 
          key={product.id} 
          className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] ${
            isOutOfStock(product) ? 'opacity-75' : ''
          }`}
        >
          <div className="relative pt-[100%]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {isOutOfStock(product) && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">Sin Stock</span>
              </div>
            )}
            {isLowStock(product) && !isOutOfStock(product) && (
              <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Últimas unidades
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{product.description}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xl font-bold text-pink-600">${product.price}</p>
              {product.stock !== undefined && (
                <p className={`text-sm ${
                  isOutOfStock(product) 
                    ? 'text-red-600' 
                    : isLowStock(product) 
                    ? 'text-orange-600' 
                    : 'text-green-600'
                }`}>
                  {isOutOfStock(product) 
                    ? 'Sin stock' 
                    : `Stock: ${product.stock}`
                  }
                </p>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Talle</label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={selectedSize[product.id] || ''}
                onChange={e =>
                  setSelectedSize(prev => ({ ...prev, [product.id]: e.target.value }))
                }
                disabled={isOutOfStock(product)}
              >
                <option value="">Seleccionar talle</option>
                {product.sizes.map(size => (
                  <option key={size} value={size}>Talle {size}</option>
                ))}
              </select>
            </div>
            <button
              className="mt-4 w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              disabled={!selectedSize[product.id] || isOutOfStock(product)}
              onClick={() => handleAddToCart(product)}
            >
              {isOutOfStock(product) ? 'Sin Stock' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;