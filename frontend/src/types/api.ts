export interface AuthResponse {
  token?: string | null
  name: string
  role: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface ProductResponse {
  id: number
  name: string
  description?: string
  price: string
  stock?: number
  imageUrl?: string
  categoryName?: string
  categoryId?: number
}

export interface ProductRequest {
  name: string
  description?: string
  price: string
  stock: number
  imageUrl?: string
  categoryId: number
}
