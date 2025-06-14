const API_BASE_URL = 'http://localhost:8080';

export async function updateOrder(id: number, order: any) {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });
  
  if (!response.ok) {
    throw new Error('Error al actualizar la orden');
  }
  
  return response.json();
}