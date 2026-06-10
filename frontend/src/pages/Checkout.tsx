import React from 'react'
import { useForm } from 'react-hook-form'
import { checkout } from '../services/order'
import { getCart } from '../services/cart'
import { getAddresses } from '../services/address'
import type { CartResponse } from '../types/cart'
import type { Address } from '../types/address'
import { useNavigate } from 'react-router-dom'

type FormValues = { shippingAddressId: number }

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const [cart, setCart] = React.useState<CartResponse | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [addresses, setAddresses] = React.useState<Address[]>([])
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<FormValues>()

  React.useEffect(() => {
    Promise.all([getCart(), getAddresses()])
      .then(([cartRes, addrRes]) => {
        setCart(cartRes)
        setAddresses(addrRes)
        if (addrRes.length > 0) {
          setValue('shippingAddressId', addrRes[0].id)
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [setValue])

  const onSubmit = async (data: FormValues) => {
    try {
      await checkout({ shippingAddressId: data.shippingAddressId })
      navigate('/orders')
    } catch (e) {
      console.error(e)
      alert('Checkout failed')
    }
  }

  if (loading) return <div>Loading...</div>
  if (!cart || cart.items.length === 0) return <div>Your cart is empty</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <div className="bg-white rounded shadow p-4 mb-4">
        <div className="mb-3">Items:</div>
        {cart.items.map((i) => (
          <div key={i.cartItemId} className="flex justify-between py-1">
            <div>{i.productName} x{i.quantity}</div>
            <div>{i.totalPrice}</div>
          </div>
        ))}
        <div className="mt-3 text-right font-bold">Total: ${cart.cartTotalAmount}</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded shadow p-4">
        <label className="block mb-3">
          <span className="text-sm">Select Shipping Address</span>
          <select {...register('shippingAddressId', { valueAsNumber: true })} className="mt-1 block w-full border rounded px-3 py-2">
            {addresses.map((a) => (
              <option key={a.id} value={a.id}>{a.street}, {a.city}, {a.country} {a.zipCode || ''}</option>
            ))}
          </select>
        </label>
        <div className="mb-4 text-sm text-gray-500">Don't have an address? <a href="/addresses" className="text-blue-600">Add one</a></div>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded">{isSubmitting ? 'Placing order...' : 'Place Order'}</button>
      </form>
    </div>
  )
}

export default Checkout
