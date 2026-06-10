export interface PaymentRequest {
  orderId: number
  method: 'CARD' | 'CASH' | 'OTHER'
  amount: string
}

export interface PaymentResponse {
  id: number
  orderId: number
  status: 'SUCCESS' | 'FAILED' | 'PENDING'
  amount: string
  method: string
}
