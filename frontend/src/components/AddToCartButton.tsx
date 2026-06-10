import React from 'react'
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../services/cart'

const AddToCartButton: React.FC<{ productId: number }> = ({ productId }) => {
  const navigate = useNavigate()

  const handle = async () => {
    try {
      await addToCart({ productId, quantity: 1 })
      navigate('/cart')
    } catch (e) {
      console.error(e)
      alert('Failed to add to cart')
    }
  }

  return <button onClick={handle} className="px-4 py-2 bg-blue-600 text-white rounded">Add to cart</button>
}

export default AddToCartButton
