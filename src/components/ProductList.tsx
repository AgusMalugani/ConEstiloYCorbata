import React, { useState } from 'react';
import { Product, GroupedProduct } from '../types';
import { Package, AlertTriangle } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product, size: string) => void;
}

// Agrupa productos por nombre
function groupProductsByNombre(products: Product[]): GroupedProduct[] {
  const grouped: { [nombre: string]: GroupedProduct } = {};
  products.forEach((p) => {
    if (!grouped[p.nombre]) {
      grouped[p.nombre] = {
        nombre: p.nombre,
        precio: p.precio,
        categoria: p.categoria,
        imageUrl: p.imageUrl,
        opciones: [],
      };
    }
    grouped[p.nombre].opciones.push({
      id: p.id,
      color: p.color,
      talle: p.talle,
      stock: p.stock,
    });
  });
  return Object.values(grouped);
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  const groupedProducts = groupProductsByNombre(products);
  // Estado para selección de color y talle por producto agrupado
  const [selectedOptions, setSelectedOptions] = useState<{ [nombre: string]: { color: string; talle: number | '' } }>({});

  if (groupedProducts.length === 0) {
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
      {groupedProducts.map(group => {
        const colores = Array.from(new Set(group.opciones.map(o => o.color)));
        const talles = Array.from(new Set(group.opciones.map(o => o.talle)));
        const selected = selectedOptions[group.nombre] || { color: '', talle: '' };
        const selectedOption = group.opciones.find(
          o => o.color === selected.color && o.talle === selected.talle
        );
        const outOfStock = selectedOption ? (selectedOption.stock ?? 0) <= 0 : false;
        const lowStock = selectedOption ? (selectedOption.stock ?? 0) > 0 && (selectedOption.stock ?? 0) <= 5 : false;
        return (
          <div key={group.nombre} className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] ${outOfStock ? 'opacity-75' : ''}`}>
            <div className="relative pt-[100%]">
              <img
                src={group.imageUrl}
                alt={group.nombre}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{group.nombre}</h3>
              <p className="text-pink-600 font-bold text-xl">${group.precio}</p>
              <div className="flex gap-2 items-center">
                <label className="text-sm">Color:</label>
                <select
                  className="rounded border-gray-300"
                  value={selected.color}
                  onChange={e => setSelectedOptions(prev => ({ ...prev, [group.nombre]: { ...prev[group.nombre], color: e.target.value, talle: '' } }))}
                >
                  <option value="">Elegir</option>
                  {colores.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 items-center">
                <label className="text-sm">Talle:</label>
                <select
                  className="rounded border-gray-300"
                  value={selected.talle}
                  onChange={e => setSelectedOptions(prev => ({ ...prev, [group.nombre]: { ...prev[group.nombre], talle: Number(e.target.value) } }))}
                  disabled={!selected.color}
                >
                  <option value="">Elegir</option>
                  {talles
                    .filter(talle => group.opciones.some(o => o.color === selected.color && o.talle === talle))
                    .map(talle => (
                      <option key={talle} value={talle}>{talle}</option>
                    ))}
                </select>
              </div>
              {selectedOption && (
                <div className="text-xs mt-1">
                  {outOfStock ? (
                    <span className="text-red-500 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Sin stock</span>
                  ) : lowStock ? (
                    <span className="text-yellow-600 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Stock bajo ({selectedOption.stock})</span>
                  ) : (
                    <span className="text-green-600">Stock disponible ({selectedOption.stock ?? '∞'})</span>
                  )}
                </div>
              )}
              <button
                className="mt-2 px-4 py-2 bg-pink-600 text-white rounded disabled:opacity-50"
                disabled={!selectedOption || outOfStock}
                onClick={() => selectedOption && onAddToCart({
                  id: selectedOption.id,
                  nombre: group.nombre,
                  precio: group.precio,
                  talle: selectedOption.talle,
                  categoria: group.categoria,
                  color: selectedOption.color,
                  imageUrl: group.imageUrl,
                  stock: selectedOption.stock,
                }, String(selectedOption.talle))}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;