const API_BASE_URL = 'http://localhost:8080';

export async function updateProduct(id: string, product: any) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    throw new Error('Error al actualizar el producto');
  }
  
  return response.json();
}