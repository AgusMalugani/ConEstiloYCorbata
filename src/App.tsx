import { useState } from 'react';
import { Product, CartItem } from './types';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import CategoryCarousel from './components/CategoryCarousel';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';

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

  const removeFromCart = (productId: number, size: string) => {
    setCart(currentCart =>
      currentCart.filter(
        item => !(item.id === productId && item.selectedSize === size)
      )
    );
  };

  const handleOrderComplete = () => {
    setCart([]);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
          onOrderComplete={handleOrderComplete}
        />
      </main>
    </div>
  );
}

export default App;