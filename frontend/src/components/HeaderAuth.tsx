import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './lib/auth'

const HeaderAuth: React.FC = () => {
  const { token, name, role, logout } = useAuth()

  return (
    <div className="flex items-center gap-4">
      {token ? (
        <>
          <div className="text-sm">{name} ({role})</div>
          <Link to="/cart" className="text-sm">Cart</Link>
          <Link to="/orders" className="text-sm">Orders</Link>
          {role === 'ADMIN' && <Link to="/admin/orders" className="text-sm">Admin Orders</Link>}
          <button onClick={logout} className="text-sm text-red-600">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className="text-sm">Login</Link>
          <Link to="/register" className="text-sm">Register</Link>
        </>
      )}
    </div>
  )
}

export default HeaderAuth
