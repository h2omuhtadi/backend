import { render, screen } from '@testing-library/react'
import Home from '../pages/Home'
import * as productService from '../services/product'
import { vi } from 'vitest'

vi.spyOn(productService, 'getProducts').mockResolvedValue([])

describe('Home', () => {
  it('renders products heading', async () => {
    render(<Home />)
    expect(await screen.findByText(/Products/i)).toBeInTheDocument()
  })
})
