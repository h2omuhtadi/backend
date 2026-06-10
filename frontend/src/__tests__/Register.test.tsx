import { render, screen, fireEvent } from '@testing-library/react'
import Register from '../pages/Register'
import { MemoryRouter } from 'react-router-dom'

describe('Register form validation', () => {
  it('shows validation errors when fields are empty', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    const submit = screen.getByRole('button', { name: /register/i })
    fireEvent.click(submit)

    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument()
  })
})
