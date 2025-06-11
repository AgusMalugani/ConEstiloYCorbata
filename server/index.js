import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample products data (this would typically come from a database)
const products = [
  {
    id: 1,
    name: 'Polar Soft Clásico',
    price: 4500,
    description: 'Polar suave y cálido para días frescos',
    sizes: ['0', '1', '2', '3', '4', '5', '6'],
    category: 'Polar Soft',
    imageUrl: 'https://images.pexels.com/photos/5731866/pexels-photo-5731866.jpeg',
    stock: 10
  },
  {
    id: 2,
    name: 'Polar Soft Premium',
    price: 5200,
    description: 'Polar de alta calidad con diseño elegante',
    sizes: ['0', '1', '2', '3', '4', '5'],
    category: 'Polar Soft',
    imageUrl: 'https://images.pexels.com/photos/6568944/pexels-photo-6568944.jpeg',
    stock: 8
  },
  {
    id: 3,
    name: 'Polar Soft Sport',
    price: 4800,
    description: 'Polar deportivo con tejido transpirable',
    sizes: ['1', '2', '3', '4', '5'],
    category: 'Polar Soft',
    imageUrl: 'https://images.pexels.com/photos/5731867/pexels-photo-5731867.jpeg',
    stock: 12
  },
  {
    id: 4,
    name: 'Chaleco Puffer Negro',
    price: 6500,
    description: 'Chaleco acolchado para máximo abrigo',
    sizes: ['1', '2', '3', '4', '5'],
    category: 'Chalecos Puffer',
    imageUrl: 'https://images.pexels.com/photos/6568951/pexels-photo-6568951.jpeg',
    stock: 6
  },
  {
    id: 5,
    name: 'Chaleco Puffer Azul',
    price: 6500,
    description: 'Chaleco acolchado en elegante tono azul',
    sizes: ['0', '1', '2', '3', '4'],
    category: 'Chalecos Puffer',
    imageUrl: 'https://images.pexels.com/photos/6568952/pexels-photo-6568952.jpeg',
    stock: 5
  },
  {
    id: 6,
    name: 'Chaleco Puffer Reversible',
    price: 7200,
    description: 'Chaleco reversible con doble diseño',
    sizes: ['1', '2', '3', '4'],
    category: 'Chalecos Puffer',
    imageUrl: 'https://images.pexels.com/photos/6568953/pexels-photo-6568953.jpeg',
    stock: 4
  },
  {
    id: 7,
    name: 'Camiseta Básica',
    price: 2800,
    description: 'Camiseta de algodón suave',
    sizes: ['0', '1', '2', '3', '4', '5'],
    category: 'Camisetas',
    imageUrl: 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg',
    stock: 15
  },
  {
    id: 8,
    name: 'Camiseta Estampada',
    price: 3200,
    description: 'Camiseta con diseño exclusivo',
    sizes: ['1', '2', '3', '4'],
    category: 'Camisetas',
    imageUrl: 'https://images.pexels.com/photos/6568957/pexels-photo-6568957.jpeg',
    stock: 9
  },
  {
    id: 9,
    name: 'Camiseta Premium',
    price: 3500,
    description: 'Camiseta de alta calidad con acabados premium',
    sizes: ['0', '1', '2', '3', '4'],
    category: 'Camisetas',
    imageUrl: 'https://images.pexels.com/photos/6568958/pexels-photo-6568958.jpeg',
    stock: 7
  },
  {
    id: 10,
    name: 'Collar Elegante',
    price: 1800,
    description: 'Collar ajustable con diseño moderno',
    sizes: ['0', '1', '2', '3'],
    category: 'Accesorios',
    imageUrl: 'https://images.pexels.com/photos/6568961/pexels-photo-6568961.jpeg',
    stock: 20
  },
  {
    id: 11,
    name: 'Bandana Fashion',
    price: 1200,
    description: 'Bandana con estampado exclusivo',
    sizes: ['0', '1', '2'],
    category: 'Accesorios',
    imageUrl: 'https://images.pexels.com/photos/6568962/pexels-photo-6568962.jpeg',
    stock: 25
  },
  {
    id: 12,
    name: 'Correa Premium',
    price: 2500,
    description: 'Correa resistente con detalles metálicos',
    sizes: ['1', '2', '3'],
    category: 'Accesorios',
    imageUrl: 'https://images.pexels.com/photos/6568963/pexels-photo-6568963.jpeg',
    stock: 11
  }
];

// In-memory storage for orders (in production, use a database)
let orders = [];
let orderIdCounter = 1;

// Routes
app.get('/api/products', (req, res) => {
  try {
    const { category, sortBy } = req.query;
    
    let filteredProducts = [...products];
    
    // Filter by category
    if (category && category !== '') {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Sort products
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          // Keep original order for 'featured'
          break;
      }
    }
    
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
});

app.get('/api/categories', (req, res) => {
  try {
    const categories = [...new Set(products.map(product => product.category))];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { items, customerInfo, total } = req.body;
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }
    
    if (!customerInfo || !customerInfo.email || !customerInfo.phone) {
      return res.status(400).json({ error: 'Customer email and phone are required' });
    }
    
    // Validate items and check stock
    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      if (!product) {
        return res.status(400).json({ error: `Product with id ${item.id} not found` });
      }
      
      if (!product.sizes.includes(item.selectedSize)) {
        return res.status(400).json({ error: `Size ${item.selectedSize} not available for ${product.name}` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
    }
    
    // Create order
    const order = {
      id: orderIdCounter++,
      items,
      customerInfo,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      paymentInfo: {
        cbu: '0000000000000000000000',
        alias: 'agusmalugani.mp',
        whatsapp: '+54 3413857748'
      }
    };
    
    orders.push(order);
    
    // Update stock (in production, this should be done in a transaction)
    items.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        product.stock -= item.quantity;
      }
    });
    
    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
        paymentInfo: order.paymentInfo
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});