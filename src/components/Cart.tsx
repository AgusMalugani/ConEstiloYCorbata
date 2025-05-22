import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: number, size: string) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemoveItem }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPaymentInfo(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Carrito de compras</h2>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-8">
                {items.length === 0 ? (
                  <p className="text-gray-500">Tu carrito está vacío</p>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">


                      {items.map((item) => (
                        <li key={`${item.id}-${item.selectedSize}`} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.name}</h3>
                                <p className="ml-4">${item.price * item.quantity}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">Talle {item.selectedSize}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <p className="text-gray-500">Cantidad {item.quantity}</p>
                              <button
                                type="button"
                                className="font-medium text-pink-600 hover:text-pink-500"
                                onClick={() => onRemoveItem(item.id, item.selectedSize)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}


                    </ul>
                  </div>
                )}
              </div>
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>${total}</p>
                </div>

                {!showPaymentInfo ? (
                  <form onSubmit={handleCheckout} className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="mt-6 w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pink-600 hover:bg-pink-700"
                    >
                      Continuar con el pago
                    </button>
                  </form>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Información de pago</h3>
                      <p className="text-sm text-gray-600 mb-2">CBU: 0000000000000000000000</p>
                      <p className="text-sm text-gray-600 mb-4">Alias: agusmalugani.mp</p>
                      <p className="text-sm text-gray-600">
                        Una vez realizada la transferencia, envía el comprobante por WhatsApp al:
                      </p>
                      <a
                        href="https://wa.me/3413857748"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center text-pink-600 hover:text-pink-500"
                      >
                        <Send className="h-5 w-5 mr-2" />
                        +54 3413857748
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;