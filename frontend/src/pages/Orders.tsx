import React, { useEffect, useState } from 'react'
import { getUserOrders } from '../services/order'
import type { OrderResponse } from '../types/order'

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserOrders().then(setOrders).catch((e) => console.error(e)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (orders.length === 0) return <div>No orders found</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Order #{o.id}</div>
                <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${o.totalAmount}</div>
                <div className="text-sm">Status: {o.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
