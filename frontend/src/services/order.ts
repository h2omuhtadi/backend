import api from '../lib/api'
import type { OrderResponse } from '../types/order'
import type { CheckoutRequest } from '../types/cart'

export const checkout = async (payload: CheckoutRequest): Promise<OrderResponse> => {
  const res = await api.post('/orders/checkout', payload)
  return res.data
}

export const getUserOrders = async (): Promise<OrderResponse[]> => {
  const res = await api.get('/orders')
  return res.data
}

export const getAllOrders = async (): Promise<OrderResponse[]> => {
  const res = await api.get('/orders/all')
  return res.data
}

export const completeOrder = async (id: number) => {
  const res = await api.put(`/orders/${id}/complete`)
  return res.data
}

export const cancelOrder = async (id: number) => {
  await api.delete(`/orders/${id}`)
}
