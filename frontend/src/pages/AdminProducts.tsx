import React, { useEffect, useState } from 'react'
import { getProducts, createProduct, deleteProduct } from '../services/product'
import type { ProductResponse, ProductRequest } from '../types/api'

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<ProductRequest>({ name: '', description: '', price: '0.00', stock: 0, imageUrl: '', categoryId: 1 })

  useEffect(() => {
    getProducts().then(setProducts).catch((e) => console.error(e)).finally(() => setLoading(false))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'stock' || name === 'categoryId' ? Number(value) : value }))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const created = await createProduct(form)
      setProducts((p) => [created, ...p])
    } catch (err) {
      console.error(err)
      alert('Failed to create product')
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
                <div className="text-sm text-gray-500">${prod.price} • Stock: {prod.stock}</div>
              </div>
              <div>
                <button onClick={() => handleDelete(prod.id)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Create Product</h2>
          <form onSubmit={handleCreate}>
            <label className="block mb-2">
              <span className="text-sm">Name</span>
              <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
            </label>
            <label className="block mb-2">
              <span className="text-sm">Description</span>
              <textarea name="description" value={form.description} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
            </label>
            <label className="block mb-2">
              <span className="text-sm">Price</span>
              <input name="price" value={form.price} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
            </label>
            <label className="block mb-2">
              <span className="text-sm">Stock</span>
              <input name="stock" type="number" value={String(form.stock)} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
            </label>
            <label className="block mb-2">
              <span className="text-sm">Category ID</span>
              <input name="categoryId" type="number" value={String(form.categoryId)} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
            </label>
            <label className="block mb-4">
              <span className="text-sm">Image URL</span>
              <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
            </label>
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">Create Product</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminProducts
