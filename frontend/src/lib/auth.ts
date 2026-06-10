import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'
import type { AuthResponse } from '../types/api'

interface AuthContextValue {
  token: string | null
  name: string | null
  role: string | null
  login: (token: string, name: string, role: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [name, setName] = useState<string | null>(() => localStorage.getItem('name'))
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('role'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  useEffect(() => {
    if (name) localStorage.setItem('name', name)
    else localStorage.removeItem('name')
  }, [name])

  useEffect(() => {
    if (role) localStorage.setItem('role', role)
    else localStorage.removeItem('role')
  }, [role])

  const login = (t: string, n: string, r: string) => {
    setToken(t)
    setName(n)
    setRole(r)
    api.defaults.headers['Authorization'] = `Bearer ${t}`
  }

  const logout = () => {
    setToken(null)
    setName(null)
    setRole(null)
    delete api.defaults.headers['Authorization']
  }

  return <AuthContext.Provider value={{ token, name, role, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
