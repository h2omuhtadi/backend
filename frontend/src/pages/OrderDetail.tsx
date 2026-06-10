import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getUserOrders } from '../services/order'
import { makePayment } from '../services/payment'
import type { OrderResponse } from '../types/order'
import { useToast } from '../lib/toast'

const OrderDetail: React.FC = () => {
  const { id } = useParams()
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState<string>('0.00')
  const [method, setMethod] = useState<'CARD' | 'CASH' | 'OTHER'>('CARD')
  const { push } = useToast()

  useEffect(() => {
    if (!id) return
    getUserOrders()
      .then((list) => list.find((o) => String(o.id) === id) ?? null)
      .then((found) => {
        if (found) {
          setOrder(found)
          setAmount(found.totalAmount)
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [id])

  const handlePay = async () => {
    if (!order) return
    try {
      const res = await makePayment({ orderId: order.id, method, amount })
      push('Payment successful', 'success')
    } catch (err) {
      console.error(err)
      push('Payment failed', 'error')
    }
  }

  if (loading) return <div>Loading...</div>
  if (!order) return <div>Order not found</div>

  return (
    <div className="bg-white rounded shadow p-4">
      <h1 className="text-xl font-semibold mb-2">Order #{order.id}</h1>
      <div className="text-sm text-gray-500 mb-2">{new Date(order.createdAt).toLocaleString()}</div>
      <div className="mb-2">Status: {order.status}</div>
      <div className="font-bold text-lg">Total: ${order.totalAmount}</div>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Payment</h2>
        <div className="mb-2">
          <label className="block mb-1 text-sm">Amount</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} className="border rounded px-3 py-2" />
        </div>
        <div className="mb-2">
          <label className="block mb-1 text-sm">Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value as any)} className="border rounded px-3 py-2">
            <option value="CARD">Card</option>
            <option value="CASH">Cash</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <button onClick={handlePay} className="px-4 py-2 bg-blue-600 text-white rounded">Pay</button>
      </div>

      <div className="mt-4 text-sm text-gray-500">Note: Payment is simulated in the frontend if the backend endpoint is not available.</div>
    </div>
  )
}

export default OrderDetail
