import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface NavbarProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartItemsCount, onCartClick }) => {
  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img 
              src="https://i.ibb.co/VxKJ8Xm/logo.png"
              alt="Con Estilo y Corbata"
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="ml-2 text-xl font-semibold text-gray-900">Con Estilo y Corbata</span>
          </div>
          <div className="flex items-center space-x-8">
            <a href="#productos" className="text-gray-700 hover:text-pink-600">Productos</a>
            <button
              onClick={onCartClick}
              className="relative text-gray-700 hover:text-pink-600"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;