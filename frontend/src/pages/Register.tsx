import React from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import type { RegisterRequest } from '../types/api'

const Register: React.FC = () => {
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData(e.target as HTMLFormElement)
    const payload: RegisterRequest = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      password: String(form.get('password') || ''),
    }

    try {
      await api.post('/auth/register', payload)
      // backend currently returns no token on register; redirect to login
      navigate('/login')
    } catch (err) {
      console.error(err)
      alert('Register failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          <span className="text-sm">Name</span>
          <input name="name" className="mt-1 block w-full border rounded px-3 py-2" required />
        </label>
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input name="email" type="email" className="mt-1 block w-full border rounded px-3 py-2" required />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input name="password" type="password" className="mt-1 block w-full border rounded px-3 py-2" required />
        </label>
        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded">Register</button>
      </form>
    </div>
  )
}

export default Register
