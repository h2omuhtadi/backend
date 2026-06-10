export interface CartItemResponse {
  cartItemId: number
  productId: number
  productName: string
  quantity: number
  unitPrice: string
  totalPrice: string
}

export interface CartResponse {
  items: CartItemResponse[]
  cartTotalAmount: string
}

export interface AddToCartRequest {
  productId: number
  quantity: number
}

export interface CheckoutRequest {
  shippingAddressId: number
}
