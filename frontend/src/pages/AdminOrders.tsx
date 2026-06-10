import React, { useEffect, useState } from 'react'
import { getAllOrders, completeOrder, cancelOrder } from '../services/order'
import type { OrderResponse } from '../types/order'
import { useToast } from '../lib/toast'

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const { push } = useToast()

  useEffect(() => {
    getAllOrders().then(setOrders).catch((e) => console.error(e)).finally(() => setLoading(false))
  }, [])

  const handleComplete = async (id: number) => {
    try {
      await completeOrder(id)
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'COMPLETED' } : o)))
      push('Order marked as complete', 'success')
    } catch (err) {
      console.error(err)
      push('Failed to complete order', 'error')
    }
  }

  const handleCancel = async (id: number) => {
    try {
      await cancelOrder(id)
      setOrders((prev) => prev.filter((o) => o.id !== id))
      push('Order cancelled', 'success')
    } catch (err) {
      console.error(err)
      push('Failed to cancel order', 'error')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admin - Orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">Order #{o.id}</div>
              <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
              <div className="text-sm">Total: ${o.totalAmount}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleComplete(o.id)} className="px-3 py-1 bg-green-600 text-white rounded">Complete</button>
              <button onClick={() => handleCancel(o.id)} className="px-3 py-1 bg-red-600 text-white rounded">Cancel</button>
            </div>
          </div>
        ))}
        {orders.length === 0 && <div>No orders found</div>}
      </div>
    </div>
  )
}

export default AdminOrders
