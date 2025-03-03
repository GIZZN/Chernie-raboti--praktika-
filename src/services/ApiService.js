export class ApiService {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getProducts() {
    return this.request('/products');
  }

  async publishProduct(product) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  }

  async updateProduct(id, updates) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }
} 