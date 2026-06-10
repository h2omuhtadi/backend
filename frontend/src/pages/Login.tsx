import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../lib/auth'

type FormValues = {
  email: string
  password: string
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>()
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await api.post('/auth/login', data)
      const d = res.data
      if (d?.token) login(d.token, d.name, d.role)
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            {...register('email', { required: 'Email is required' })}
            name="email"
            type="email"
            className="mt-1 block w-full border rounded px-3 py-2"
          />
          {errors.email && <div className="text-red-600 text-sm mt-1">{String(errors.email.message)}</div>}
        </label>

        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min length is 6' } })}
            name="password"
            type="password"
            className="mt-1 block w-full border rounded px-3 py-2"
          />
          {errors.password && <div className="text-red-600 text-sm mt-1">{String(errors.password.message)}</div>}
        </label>

        <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-blue-600 text-white rounded">{isSubmitting ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  )
}

export default Login
