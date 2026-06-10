import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../services/product'
import type { ProductResponse } from '../types/api'
import AddToCartButton from '../components/AddToCartButton'
import { formatCurrency } from '../utils/format'

const ProductDetail: React.FC = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<ProductResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getProduct(id)
      .then(setProduct)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <img src={product.imageUrl || '/placeholder.png'} alt={product.name} className="w-full h-80 object-cover rounded" />
        <div className="md:col-span-2">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-gray-700">{product.description}</p>
          <div className="mt-4 text-2xl font-bold">{formatCurrency(product.price)}</div>
          <div className="mt-6">
            <AddToCartButton productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
