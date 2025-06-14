const API_BASE_URL = 'http://localhost:8080';

export async function createProduct(product: any) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    throw new Error('Error al crear el producto');
  }
  
  return response.json();
}