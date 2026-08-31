export type CareLevel = 'standard' | 'express'

export interface ServiceItem {
  id: string
  name: string
  price: number
  unit: string
}

export interface Service {
  id: string
  name: string
  icon: string
  tagline: string
  description: string
  fromPrice: number
  accent: string
  items: ServiceItem[]
}

export interface CartLine {
  serviceId: string
  itemId: string
  qty: number
}

export interface CareSelection {
  [serviceId: string]: CareLevel
}

export interface Partner {
  id: string
  name: string
  rating: number
  services: string
  distance: string
  turnaround: string

  // CARLAUN cooperative provider details
  verified: boolean
  available: boolean
  experience: number
  serviceArea: string
  completedJobs: number
  earnings: number
}

export interface Offer {
  id: string
  code: string
  title: string
  description: string
  featured?: boolean
}

export interface Coupon {
  code: string
  label: string
  type: 'percent' | 'flat' | 'freeDelivery'
  value: number
  cap?: number
  serviceId?: string
}

export interface Address {
  id: string
  label: string
  line: string
  icon: string
}

export type OrderStatus =
  | 'scheduled'
  | 'picked'
  | 'processing'
  | 'quality'
  | 'out'
  | 'delivered'

export interface OrderServiceSummary {
  serviceId: string
  serviceName: string
  itemCount: number
  amount: number
}

export interface Order {
  id: string
  createdAt: number
  status: OrderStatus
  providerId?: string
  services: OrderServiceSummary[]
  lines: CartLine[]
  care: CareSelection
  address: Address
  pickupDate: string
  pickupSlot: string
  payment: string
  subtotal: number
  delivery: number
  discount: number
  total: number
  couponCode?: string
}

export type View =
  | { name: 'home' }
  | { name: 'service'; serviceId: string }
  | { name: 'bag' }
  | { name: 'checkout' }
  | { name: 'success'; orderId: string }
  | { name: 'tracking'; orderId: string }
  | { name: 'orders' }
  | { name: 'profile' }
  | { name: 'provider' }
  | { name: 'admin' }
