import api from '../lib/api'
import type { PaymentRequest } from '../types/payment'

export const makePayment = async (payload: PaymentRequest) => {
  // If backend has a real payment endpoint, call it. For now, simulate via /payments (POST)
  try {
    const res = await api.post('/payments', payload)
    return res.data
  } catch (err) {
    // fallback simulation
    return { id: Date.now(), orderId: payload.orderId, status: 'SUCCESS', amount: payload.amount, method: payload.method }
  }
}
