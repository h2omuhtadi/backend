import { render, screen, fireEvent } from '@testing-library/react'
import Login from '../pages/Login'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../lib/auth'

describe('Login form validation', () => {
  it('shows validation errors when fields are empty', async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    )

    const submit = screen.getByRole('button', { name: /login/i })
    fireEvent.click(submit)

    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument()
  })
})
