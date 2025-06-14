const API_BASE_URL = 'http://localhost:8080';

export async function findAllOrders() {
  const response = await fetch(`${API_BASE_URL}/orders`);
  
  if (!response.ok) {
    throw new Error('Error al obtener las órdenes');
  }
  
  return response.json();
}