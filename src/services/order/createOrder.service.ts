const API_BASE_URL = 'http://localhost:8080';

export async function createOrder(order) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error('Error al crear la orden');
  return res.json();
}
