import React from 'react'
import { Link } from 'react-router-dom'
import HeaderAuth from './components/HeaderAuth'

const App: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">My E-commerce</Link>
          <HeaderAuth />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-sm text-gray-500">© 2026 E-commerce</div>
      </footer>
    </div>
  )
}

export default App
