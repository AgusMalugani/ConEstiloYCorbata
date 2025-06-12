const API_BASE_URL ='http://localhost:8080';

export async function findAllProducts(){
    const response = await fetch(`${API_BASE_URL}/products`); 
    const data = response.json();
    return data
    
}