// API Configuration - Update BASE_URL to your backend URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Order {
  _id: string;
  userId: string | User;
  products: {
    product: Book;
    quantity: number;
  }[];
  totalAmount: number;
  createdAt: string;
}

export interface AuthResponse {
  status: string;
  data: {
    token: string;
    user: User;
  };
  message: string;
}

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic fetch wrapper
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.data || 'Something went wrong');
  }

  return data;
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (username: string, email: string, password: string, role: string = 'user') =>
    apiFetch<{ status: string; message: string }>('/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role }),
    }),
};

// Products API
export const productsApi = {
  getAll: () =>
    apiFetch<{ status: string; data: Book[] }>('/products'),

  getById: (id: string) =>
    apiFetch<{ status: string; data: Book }>(`/products/${id}`),

  create: (book: Omit<Book, '_id'>) =>
    apiFetch<{ status: string; data: string }>('/products', {
      method: 'POST',
      body: JSON.stringify(book),
    }),

  update: (id: string, book: Omit<Book, '_id'>) =>
    apiFetch<{ status: string; data: Book; message: string }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(book),
    }),

  delete: (id: string) =>
    apiFetch<{ status: string; data: Book; message: string }>(`/products/${id}`, {
      method: 'DELETE',
    }),
};

// Orders API
export const ordersApi = {
  getAll: () =>
    apiFetch<{ status: string; orders: Order[] }>('/orders'),

  getById: (id: string) =>
    apiFetch<{ status: string; order: Order }>(`/orders/${id}`),

  create: (products: { product: string; quantity: number }[], totalAmount: number) =>
    apiFetch<{ status: string; message: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify({ products, totalAmount }),
    }),
};
