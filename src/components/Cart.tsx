import React, { useState } from 'react';
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';
import { apiService } from '../services/api';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: number, size: string) => void;
  onOrderComplete: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemoveItem, onOrderComplete }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          selectedSize: item.selectedSize,
          quantity: item.quantity,
        })),
        customerInfo: {
          email,
          phone,
        },
        total,
      };

      const response = await apiService.createOrder(orderData);
      setPaymentInfo(response.order.paymentInfo);
      setShowPaymentInfo(true);
      setOrderSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (orderSuccess) {
      onOrderComplete();
      setEmail('');
      setPhone('');
      setShowPaymentInfo(false);
      setOrderSuccess(false);
      setPaymentInfo(null);
    }
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />
      
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Carrito de compras</h2>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={handleClose}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {orderSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div className="ml-3">
                      <p className="text-sm text-green-800">¡Pedido creado exitosamente!</p>
                    </div>
                  </div>
                </div>
              )}

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
                                disabled={orderSuccess}
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
                <div className="flex justify-between text-base font-medium text-gray-900 mb-6">
                  <p>Total</p>
                  <p>${total}</p>
                </div>

                {!showPaymentInfo ? (
                  <form onSubmit={handleCheckout} className="space-y-6">
                    <div className="relative">
                      <label 
                        htmlFor="email" 
                        className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-pink-600"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        placeholder="tu@email.com"
                        className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-colors placeholder-gray-400 text-gray-900"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="relative">
                      <label 
                        htmlFor="phone" 
                        className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-pink-600"
                      >
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        placeholder="+54 (341) XXX-XXXX"
                        className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-colors placeholder-gray-400 text-gray-900"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      {isSubmitting ? 'Procesando...' : 'Continuar con el pago'}
                    </button>
                  </form>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Información de pago</h3>
                      <p className="text-sm text-gray-600 mb-2">CBU: {paymentInfo?.cbu || '0000000000000000000000'}</p>
                      <p className="text-sm text-gray-600 mb-4">Alias: {paymentInfo?.alias || 'agusmalugani.mp'}</p>
                      <p className="text-sm text-gray-600">
                        Una vez realizada la transferencia, envía el comprobante por WhatsApp al:
                      </p>
                      <a
                        href={`https://wa.me/${paymentInfo?.whatsapp?.replace('+', '') || '3413857748'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center text-pink-600 hover:text-pink-500"
                      >
                        <Send className="h-5 w-5 mr-2" />
                        {paymentInfo?.whatsapp || '+54 3413857748'}
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