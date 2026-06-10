import React from 'react'
import { useToast } from '../lib/toast'

const Toasts: React.FC = () => {
  const { toasts, remove } = useToast()
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((t) => (
        <div key={t.id} className={`px-4 py-2 rounded shadow text-white ${t.type === 'error' ? 'bg-red-500' : 'bg-green-600'}`}>
          <div className="flex items-center justify-between gap-4">
            <div>{t.message}</div>
            <button onClick={() => remove(t.id)} className="ml-2 text-sm opacity-80">x</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Toasts
