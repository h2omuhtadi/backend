import React from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import type { LoginRequest } from '../types/api'

const Login: React.FC = () => {
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData(e.target as HTMLFormElement)
    const payload: LoginRequest = {
      email: String(form.get('email') || ''),
      password: String(form.get('password') || ''),
    }

    try {
      const res = await api.post('/auth/login', payload)
      const data = res.data
      if (data?.token) localStorage.setItem('token', data.token)
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input name="email" type="email" className="mt-1 block w-full border rounded px-3 py-2" required />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input name="password" type="password" className="mt-1 block w-full border rounded px-3 py-2" required />
        </label>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">Login</button>
      </form>
    </div>
  )
}

export default Login
