import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getProducts, createProduct, deleteProduct } from '../services/product'
import type { ProductResponse, ProductRequest } from '../types/api'
import { formatCurrency } from '../utils/format'

type FormValues = ProductRequest

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { name: '', description: '', price: '0.00', stock: 0, imageUrl: '', categoryId: 1 }
  })

  useEffect(() => {
    getProducts().then(setProducts).catch((e) => console.error(e)).finally(() => setLoading(false))
  }, [])

  const onSubmit = async (data: FormValues) => {
    try {
      const created = await createProduct(data)
      setProducts((p) => [created, ...p])
      reset()
    } catch (err: any) {
      console.error(err)
      const validation = err?.validation
      if (validation) {
        // Map backend validation to form fields
        Object.entries(validation).forEach(([field, message]) => {
          try { setError(field as any, { type: 'server', message: String(message) }) } catch(e) { /* ignore */ }
        })
      } else {
        alert('Failed to create product')
      }
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    try {
      await deleteProduct(id)
      setProducts((p) => p.filter((x) => x.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete product')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admin - Products</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          {products.map((prod) => (
            <div key={prod.id} className="bg-white p-3 rounded shadow mb-2 flex justify-between items-center">
              <div>
                <div className="font-medium">{prod.name}</div>
                <div className="text-sm text-gray-500">{formatCurrency(prod.price)} • Stock: {prod.stock}</div>
              </div>
              <div>
                <button onClick={() => handleDelete(prod.id)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Create Product</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block mb-2">
              <span className="text-sm">Name</span>
              <input {...register('name', { required: 'Name is required' })} name="name" className="mt-1 block w-full border rounded px-3 py-2" />
              {errors.name && <div className="text-red-600 text-sm mt-1">{String(errors.name.message)}</div>}
            </label>
            <label className="block mb-2">
              <span className="text-sm">Description</span>
              <textarea {...register('description')} name="description" value={undefined} onChange={() => {}} className="mt-1 block w-full border rounded px-3 py-2" />
            </label>
            <label className="block mb-2">
              <span className="text-sm">Price</span>
              <input {...register('price', { required: 'Price is required' })} name="price" className="mt-1 block w-full border rounded px-3 py-2" />
              {errors.price && <div className="text-red-600 text-sm mt-1">{String(errors.price.message)}</div>}
            </label>
            <label className="block mb-2">
              <span className="text-sm">Stock</span>
              <input {...register('stock', { valueAsNumber: true, min: { value: 0, message: 'Stock must be >= 0' } })} name="stock" type="number" className="mt-1 block w-full border rounded px-3 py-2" />
              {errors.stock && <div className="text-red-600 text-sm mt-1">{String(errors.stock.message)}</div>}
            </label>
            <label className="block mb-2">
              <span className="text-sm">Category ID</span>
              <input {...register('categoryId', { valueAsNumber: true })} name="categoryId" type="number" className="mt-1 block w-full border rounded px-3 py-2" />
            </label>
            <label className="block mb-4">
              <span className="text-sm">Image URL</span>
              <input {...register('imageUrl')} name="imageUrl" className="mt-1 block w-full border rounded px-3 py-2" />
            </label>
            <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-blue-600 text-white rounded">{isSubmitting ? 'Creating...' : 'Create Product'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminProducts
