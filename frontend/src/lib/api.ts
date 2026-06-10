import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Map validation errors from backend to a predictable format
    if (err.response && err.response.status === 400) {
      const data = err.response.data
      // Common Spring validation error structures vary; try several shapes
      // If data has 'errors' array or 'fieldErrors', normalize them
      const validation: Record<string, string> = {}
      if (Array.isArray(data?.errors)) {
        data.errors.forEach((e: any) => {
          if (e.field) validation[e.field] = e.defaultMessage || e.message || String(e)
        })
      } else if (Array.isArray(data?.fieldErrors)) {
        data.fieldErrors.forEach((e: any) => {
          if (e.field) validation[e.field] = e.defaultMessage || e.message || String(e)
        })
      } else if (data?.errors && typeof data.errors === 'object') {
        Object.assign(validation, data.errors)
      }

      err.validation = validation
    }

    return Promise.reject(err)
  }
)

export default api
