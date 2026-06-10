import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkout } from '../services/order'
import { getCart } from '../services/cart'
import type { CartResponse } from '../types/cart'

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [addressId, setAddressId] = useState<number | null>(null)

  React.useEffect(() => {
    getCart().then(setCart).catch((e) => console.error(e)).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addressId) return alert('Please select a shipping address (for now enter an id)')

    try {
      await checkout({ shippingAddressId: addressId })
      navigate('/orders')
    } catch (e) {
      console.error(e)
      alert('Checkout failed')
    }
  }

  if (loading) return <div>Loading...</div>
  if (!cart) return <div>Your cart is empty</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <div className="bg-white rounded shadow p-4 mb-4">
        <div className="mb-3">Items:</div>
        {cart.items.map((i) => (
          <div key={i.cartItemId} className="flex justify-between py-1">
            <div>{i.productName} x{i.quantity}</div>
            <div>${i.totalPrice}</div>
          </div>
        ))}
        <div className="mt-3 text-right font-bold">Total: ${cart.cartTotalAmount}</div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4">
        <label className="block mb-3">
          <span className="text-sm">Shipping Address ID</span>
          <input type="number" value={addressId ?? ''} onChange={(e) => setAddressId(Number(e.target.value))} className="mt-1 block w-full border rounded px-3 py-2" required />
        </label>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Place Order</button>
      </form>
    </div>
  )
}

export default Checkout
