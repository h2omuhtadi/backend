import React, { useEffect, useState } from 'react'
import { getCart, removeCartItem, updateCartQuantity } from '../services/cart'
import type { CartResponse } from '../types/cart'
import { formatCurrency } from '../utils/format'

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCart().then(setCart).catch((e) => console.error(e)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (!cart || cart.items.length === 0) return <div>Your cart is empty</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      <div className="bg-white rounded shadow p-4">
        {cart.items.map((item) => (
          <div key={item.cartItemId} className="flex items-center justify-between border-b py-3">
            <div>
              <div className="font-medium">{item.productName}</div>
              <div className="text-sm text-gray-500">Unit: {formatCurrency(item.unitPrice)}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateCartQuantity(item.cartItemId, Math.max(1, item.quantity - 1)).then(setCart)}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <div>{item.quantity}</div>
              <button
                onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1).then(setCart)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
              <button onClick={() => removeCartItem(item.cartItemId).then(() => setCart((prev) => prev ? { ...prev, items: prev.items.filter(i => i.cartItemId !== item.cartItemId) } : prev))} className="ml-4 text-red-600">Remove</button>
            </div>
          </div>
        ))}
        <div className="mt-4 text-right font-bold">Total: {formatCurrency(cart.cartTotalAmount)}</div>
      </div>
    </div>
  )
}

export default Cart
