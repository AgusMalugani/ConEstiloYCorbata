import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Product, CartItem } from './types';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import CategoryCarousel from './components/CategoryCarousel';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import AdminRoute from './components/AdminRoute';

function MainPage({ 
  isCartOpen, 
  setIsCartOpen, 
  cart, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  handleOrderComplete, 
  cartItemsCount 
}: {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cart: CartItem[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  handleOrderComplete: () => void;
  cartItemsCount: number;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartItemsCount={cartItemsCount} onCartClick={() => setIsCartOpen(true)} />
      <main className="pt-16">
        <HeroCarousel />
        <CategoryCarousel />
        <ProductGrid onAddToCart={addToCart} />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cart}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onOrderComplete={handleOrderComplete}
        />
      </main>
    </div>
  );
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, size: string) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(
        item => item.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, selectedSize: size, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(currentCart =>
      currentCart.filter(
        item => !(item.id === productId && item.selectedSize === size)
      )
    );
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleOrderComplete = () => {
    setCart([]);
    setIsCartOpen(false);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <MainPage
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              handleOrderComplete={handleOrderComplete}
              cartItemsCount={cartItemsCount}
            />
          } 
        />
        <Route path="/admin" element={<AdminRoute />} />
      </Routes>
    </Router>
  );
}

export default App;