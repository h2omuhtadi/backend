import React, { useEffect, useState } from 'react'
import { getAddresses, addAddress } from '../services/address'
import type { Address, AddressRequest } from '../types/address'

const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<AddressRequest>({ street: '', city: '', country: '', zipCode: '' })

  useEffect(() => {
    getAddresses().then(setAddresses).catch((e) => console.error(e)).finally(() => setLoading(false))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const added = await addAddress(form)
      setAddresses((prev) => [added, ...prev])
      setForm({ street: '', city: '', country: '', zipCode: '' })
    } catch (err) {
      console.error(err)
      alert('Failed to add address')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your Addresses</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          {addresses.map((a) => (
            <div key={a.id} className="bg-white p-3 rounded shadow mb-2">
              <div className="font-medium">{a.street}</div>
              <div className="text-sm text-gray-500">{a.city}, {a.country} {a.zipCode || ''}</div>
            </div>
          ))}
          {addresses.length === 0 && <div>No addresses yet</div>}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Add Address</h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2">
              <span className="text-sm">Street</span>
              <input name="street" value={form.street} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
            </label>
            <label className="block mb-2">
              <span className="text-sm">City</span>
              <input name="city" value={form.city} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
            </label>
            <label className="block mb-2">
              <span className="text-sm">Country</span>
              <input name="country" value={form.country} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
            </label>
            <label className="block mb-4">
              <span className="text-sm">Zip Code</span>
              <input name="zipCode" value={form.zipCode} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
            </label>
            <button type="submit" className="w-full py-2 bg-green-600 text-white rounded">Add Address</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Addresses
