import React, { useState } from 'react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product, size: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<{ [id: number]: string }>({});

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map(product => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
          <div className="relative pt-[100%]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{product.description}</p>
            <p className="mt-2 text-xl font-bold text-pink-600">${product.price}</p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Talle</label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 transition-colors"
                value={selectedSize[product.id] || ''}
                onChange={e =>
                  setSelectedSize(prev => ({ ...prev, [product.id]: e.target.value }))
                }
              >
                <option value="">Seleccionar talle</option>
                {product.sizes.map(size => (
                  <option key={size} value={size}>Talle {size}</option>
                ))}
              </select>
            </div>
            <button
              className="mt-4 w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              disabled={!selectedSize[product.id]}
              onClick={() => {
                onAddToCart(product, selectedSize[product.id]);
                setSelectedSize(prev => ({ ...prev, [product.id]: '' }));
              }}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;