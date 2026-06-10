import api from '../lib/api'
import type { CartResponse, AddToCartRequest } from '../types/cart'

export const addToCart = async (payload: AddToCartRequest) => {
  const res = await api.post('/cart', payload)
  return res.data
}

export const getCart = async (): Promise<CartResponse> => {
  const res = await api.get('/cart')
  return res.data
}

export const updateCartQuantity = async (cartItemId: number, quantity: number) => {
  const res = await api.put(`/cart/${cartItemId}/quantity`, null, { params: { quantity } })
  return res.data
}

export const removeCartItem = async (cartItemId: number) => {
  await api.delete(`/cart/${cartItemId}`)
}
