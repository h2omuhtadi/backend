import { render, screen } from '@testing-library/react'
import Orders from '../pages/Orders'
import * as orderService from '../services/order'
import { vi } from 'vitest'

vi.spyOn(orderService, 'getUserOrders').mockResolvedValue([
  { id: 1, totalAmount: '10.00', status: 'CREATED', createdAt: new Date().toISOString() }
])

describe('Orders page', () => {
  it('renders orders list', async () => {
    render(<Orders />)
    expect(await screen.findByText(/Your Orders/i)).toBeInTheDocument()
  })
})
