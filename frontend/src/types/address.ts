export interface Address {
  id: number
  street: string
  city: string
  country: string
  zipCode?: string
}

export interface AddressRequest {
  street: string
  city: string
  country: string
  zipCode?: string
}
