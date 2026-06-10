import React, { createContext, useContext, useState, useCallback } from 'react'

type Toast = { id: number; message: string; type?: 'success' | 'error' }

const ToastContext = createContext<{
  toasts: Toast[]
  push: (message: string, type?: Toast['type']) => void
  remove: (id: number) => void
} | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    const t: Toast = { id, message, type }
    setToasts((s) => [t, ...s])
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 4000)
  }, [])

  const remove = useCallback((id: number) => setToasts((s) => s.filter((t) => t.id !== id)), [])

  return (
    <ToastContext.Provider value={{ toasts, push, remove }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
