import api from '../lib/api'
import type { ProductResponse, ProductRequest } from '../types/api'

export const getProducts = async (): Promise<ProductResponse[]> => {
  const res = await api.get<ProductResponse[]>('/products')
  return res.data
}

export const getProduct = async (id: string): Promise<ProductResponse> => {
  const res = await api.get<ProductResponse>(`/products/${id}`)
  return res.data
}

export const createProduct = async (payload: ProductRequest) => {
  const res = await api.post<ProductResponse>('/products', payload)
  return res.data
}

export const deleteProduct = async (id: number) => {
  await api.delete(`/products/${id}`)
}
