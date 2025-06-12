import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { Product } from '../types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  products: Product[];
  loading?: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ 
  isOpen, 
  onClose, 
  category, 
  products, 
  loading = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="relative inline-block w-full max-w-4xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mb-6 capitalize">
            {category}
          </h3>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
              <span className="ml-2 text-gray-600">Cargando productos...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay productos disponibles en esta categoría.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="relative aspect-square overflow-hidden rounded-lg group">
                  <img
                    src={product.imageUrl}
                    alt={product.nombre}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3">
                    <p className="text-sm font-medium">{product.nombre}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm font-bold">${product.precio}</p>
                      {product.stock !== undefined && (
                        <p className={`text-xs ${
                          product.stock <= 0 
                            ? 'text-red-300' 
                            : product.stock <= 5 
                            ? 'text-orange-300' 
                            : 'text-green-300'
                        }`}>
                          {product.stock <= 0 ? 'Sin stock' : `Stock: ${product.stock}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;