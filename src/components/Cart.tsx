import React, { useState } from 'react';
import { X, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CartItem } from '../types';
import { createOrder } from '../services/order/createOrder.service';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string, size: number) => void;
  onUpdateQuantity: (id: string, size: number, quantity: number) => void;
  onOrderComplete: () => void;
}

const Cart: React.FC<CartProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemoveItem, 
  onUpdateQuantity,
  onOrderComplete 
}) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  const total = items.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) {
      onRemoveItem(item.id, item.selectedSize);
    } else {
      onUpdateQuantity(item.id, item.selectedSize, newQuantity);
    }
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!phone.trim()) {
      setError('El teléfono es requerido');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('El email no tiene un formato válido');
      return false;
    }
    return true;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Adaptar los datos a la estructura esperada por el backend
      const orderData = {
        seña: 0, // o el valor que corresponda
        resto: total,
        celular: phone.trim(),
        entregado: false,
        isActive: true,
        productos: items.map(item => (item.id
          
          //nombre: item.nombre,
          //precio: item.precio,
         // talle: item.selectedSize,
         // categoria: item.categoria,
         // color: item.color,
          //imageUrl: item.imageUrl,
          //stock: item.stock,
      //  }
      )),
      };

      const response = await createOrder(orderData);
      setOrderId(response.id);
      setShowPaymentInfo(true);
      setOrderSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar el pedido';
      setError(errorMessage);
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
      setOrderId(null);
    }
    setError(null);
    onClose();
  };

  const formatWhatsAppNumber = (number: string) => {
    return number.replace(/\D/g, '');
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
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                  onClick={handleClose}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {orderSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm text-green-800">
                        ¡Pedido #{orderId} creado exitosamente!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {items.map((item) => (
                        <li key={`${item.id}-${item.selectedSize}`} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
                            <img
                              src={item.imageUrl}
                              alt={item.nombre}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3 className="text-sm">{item.nombre}</h3>
                                <p className="ml-4">${item.precio * item.quantity}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">Talle {item.selectedSize}</p>
                              <p className="text-sm text-gray-500">Precio unitario: ${item.precio}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                  onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                  disabled={orderSuccess}
                                >
                                  -
                                </button>
                                <span className="text-gray-900 font-medium">{item.quantity}</span>
                                <button
                                  type="button"
                                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                  onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                  disabled={orderSuccess}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                type="button"
                                className="font-medium text-pink-600 hover:text-pink-500 disabled:opacity-50 transition-colors"
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
                        Email *
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
                        Teléfono *
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
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Procesando...
                        </>
                      ) : (
                        'Continuar con el pago'
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Información de pago</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">CBU:</span>
                          <p className="text-gray-900 font-mono">{paymentInfo?.cbu}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Alias:</span>
                          <p className="text-gray-900">{paymentInfo?.alias}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Monto a transferir:</span>
                          <p className="text-lg font-bold text-pink-600">${total}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-3">
                          Una vez realizada la transferencia, envía el comprobante por WhatsApp:
                        </p>
                        <a
                          href={`https://wa.me/${formatWhatsAppNumber(paymentInfo?.whatsapp || '3413857748')}?text=Hola! Acabo de realizar el pago del pedido #${orderId} por $${total}. Te envío el comprobante.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Send className="h-5 w-5 mr-2" />
                          Enviar comprobante
                        </a>
                      </div>
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