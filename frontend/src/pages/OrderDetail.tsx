import React from 'react'
import { useParams } from 'react-router-dom'
import { getUserOrders, getAllOrders } from '../services/order'
import type { OrderResponse } from '../types/order'

const OrderDetail: React.FC = () => {
  const { id } = useParams()
  const [order, setOrder] = React.useState<OrderResponse | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!id) return
    // Try to find the order in user orders first
    getUserOrders()
      .then((list) => list.find((o) => String(o.id) === id) ?? null)
      .then((found) => {
        if (found) return found
        // fallback to admin endpoint
        return getAllOrders().then((all) => all.find((o) => String(o.id) === id) ?? null)
      })
      .then((res) => setOrder(res))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!order) return <div>Order not found</div>

  return (
    <div className="bg-white rounded shadow p-4">
      <h1 className="text-xl font-semibold mb-2">Order #{order.id}</h1>
      <div className="text-sm text-gray-500 mb-2">{new Date(order.createdAt).toLocaleString()}</div>
      <div className="mb-2">Status: {order.status}</div>
      <div className="font-bold text-lg">Total: ${order.totalAmount}</div>
      <div className="mt-4 text-sm text-gray-500">Items and payment details are not available via the public API response in this implementation.</div>
    </div>
  )
}

export default OrderDetail
