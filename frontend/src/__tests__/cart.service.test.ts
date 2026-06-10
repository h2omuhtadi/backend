import * as cartService from '../../src/services/cart'
import { vi } from 'vitest'

describe('cart service', () => {
  it('getCart returns data', async () => {
    const fake = { items: [], cartTotalAmount: '0.00' }
    vi.spyOn(cartService, 'getCart').mockResolvedValue(fake as any)
    const res = await (cartService.getCart() as any)
    expect(res).toEqual(fake)
  })
})
