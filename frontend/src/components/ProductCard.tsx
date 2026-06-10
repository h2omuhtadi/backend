import React from 'react'
import { Link } from 'react-router-dom'
import type { ProductResponse } from '../types/api'
import { formatCurrency } from '../utils/format'

const ProductCard: React.FC<{ product: ProductResponse }> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <img src={product.imageUrl || '/placeholder.png'} alt={product.name} className="h-40 w-full object-cover rounded" />
      <h3 className="mt-3 font-medium text-lg">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-lg font-semibold">{formatCurrency(product.price)}</div>
        <Link to={`/product/${product.id}`} className="text-sm text-blue-600">View</Link>
      </div>
    </div>
  )
}

export default ProductCard
