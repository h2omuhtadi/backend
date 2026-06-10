import api from '../lib/api'
import type { Address, AddressRequest } from '../types/address'

export const getAddresses = async (): Promise<Address[]> => {
  const res = await api.get('/addresses')
  return res.data
}

export const addAddress = async (payload: AddressRequest): Promise<Address> => {
  const res = await api.post('/addresses', payload)
  return res.data
}
