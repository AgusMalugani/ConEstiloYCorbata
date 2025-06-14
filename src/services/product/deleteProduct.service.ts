const API_BASE_URL = 'http://localhost:8080';

export async function deleteProduct(id: string) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Error al eliminar el producto');
  }
  
  return response.ok;
}