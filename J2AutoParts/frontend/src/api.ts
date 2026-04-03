import axios from "axios";

const TOKEN_KEY = "j2_token";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const t = localStorage.getItem(TOKEN_KEY);
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export type AuthPayload = {
  token: string;
  type: string;
  email: string;
  fullName: string;
  roles: string[];
};

export type UserProfile = {
  id: number;
  email: string;
  fullName: string;
  roles: string[];
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  productCount: number;
};

export type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  discountPrice: number | null;
  stockQuantity: number;
  description: string | null;
  imageUrl: string | null;
  specifications: string | null;
  compatibility: string | null;
  categoryId: number;
  categoryName: string;
};

export type Paged<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type ApiError = { message: string; fieldErrors?: Record<string, string> };
