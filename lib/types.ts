export type CareLevel = 'standard' | 'express'

export interface ServiceItem {
  id: string
  name: string
  price: number
  unit: string
  description?: string
  duration?: number
}

export type ServiceType = 'item' | 'task'

export type BookingType =
  | 'scheduled'
  | 'on-demand'
  | 'emergency'

export type ServiceCategory =
  | 'home'
  | 'cleaning'
  | 'laundry'
  | 'repair'
  | 'maintenance'
  | 'personal'
  | 'caregiving'
  | 'transport'
  | 'community'

export interface Service {
  id: string
  name: string
  icon: string
  tagline: string
  description: string
  fromPrice: number
  accent: string
  serviceType?: ServiceType
  bookingType?: BookingType
  category?: ServiceCategory
  requiredSkills?: string[]
  supportsExpress?: boolean
  supportsOnDemand?: boolean
  supportsEmergency?: boolean
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

export type WorkerVerificationStatus =
  | 'pending'
  | 'verified'
  | 'rejected'

export type WorkerAvailability =
  | 'available'
  | 'busy'
  | 'offline'

export interface WorkerSkill {
  id: string
  name: string
  level:
    | 'basic'
    | 'intermediate'
    | 'advanced'
    | 'expert'
  certified: boolean
  yearsExperience: number
}

export interface Worker {
  id: string
  name: string
  phone?: string
  avatar?: string
  rating: number
  completedJobs: number
  verificationStatus: WorkerVerificationStatus
  availability: WorkerAvailability
  skills: WorkerSkill[]
  serviceIds: string[]
  experience: number
  serviceArea: string
  distance: number
  latitude?: number
  longitude?: number
  cooperativeId?: string
  earnings: number
}

export interface Partner {
  id: string
  name: string
  rating: number
  services: string
  distance: string
  turnaround: string
  verified: boolean
  available: boolean
  experience: number
  serviceArea: string
  completedJobs: number
  earnings: number
}

export interface Cooperative {
  id: string
  name: string
  registrationNumber?: string
  city: string
  serviceArea: string
  verified: boolean
  workerCount: number
  activeWorkerCount: number
  serviceIds: string[]
  rating: number
  completedJobs: number
  createdAt: number
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
  type:
    | 'percent'
    | 'flat'
    | 'freeDelivery'
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

export interface UserLocation {
  latitude: number
  longitude: number
  address?: string
  area?: string
}

export type BookingPriority =
  | 'normal'
  | 'priority'
  | 'emergency'

export interface BookingRequest {
  serviceId: string
  itemId: string
  latitude?: number
  longitude?: number
  preferredDate?: string
  preferredSlot?: string
  priority: BookingPriority
  notes?: string
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

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'

export type PaymentMethod =
  | 'UPI'
  | 'Card'
  | 'Net Banking'
  | 'Cash on Delivery'

export interface PaymentDetails {
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  paidAt?: number
}

export interface Invoice {
  id: string
  orderId: string
  invoiceNumber: string
  issuedAt: number
  customerName?: string
  customerEmail?: string
  subtotal: number
  delivery: number
  discount: number
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  transactionId?: string
}

export interface Order {
  id: string
  createdAt: number
  status: OrderStatus
  providerId?: string
  workerId?: string
  cooperativeId?: string
  bookingType?: BookingType
  services: OrderServiceSummary[]
  lines: CartLine[]
  care: CareSelection
  address: Address
  pickupDate: string
  pickupSlot: string
  payment: string
  paymentDetails?: PaymentDetails
  paymentStatus?: PaymentStatus
  invoiceId?: string
  invoiceNumber?: string
  transactionId?: string
  paidAt?: number
  subtotal: number
  delivery: number
  discount: number
  total: number
  couponCode?: string
  priority?: BookingPriority
  notes?: string
  latitude?: number
  longitude?: number
}

export type WorkerJobStatus =
  | 'assigned'
  | 'accepted'
  | 'in-progress'
  | 'completed'
  | 'cancelled'

export interface WorkerJob {
  id: string
  orderId: string
  workerId: string
  serviceId: string
  itemId?: string
  status: WorkerJobStatus
  assignedAt: number
  scheduledDate?: string
  scheduledSlot?: string
  customerAddress?: string
  earnings: number
}

export interface Review {
  id: string
  orderId: string
  workerId?: string
  serviceId?: string
  rating: number
  comment?: string
  createdAt: number
}

export type ComplaintStatus =
  | 'submitted'
  | 'under-review'
  | 'resolved'
  | 'rejected'

export interface Complaint {
  id: string
  orderId?: string
  subject: string
  description: string
  status: ComplaintStatus
  photoUrl?: string
  createdAt: number
}

/* =========================
   Chat
   ========================= */

export type ChatRole =
  | 'customer'
  | 'provider'

export interface ChatMessage {
  id: string
  text: string
  sender: ChatRole
  createdAt: number
  read: boolean
}

export interface ChatConversation {
  id: string
  orderId?: string
  providerId?: string
  providerName?: string
  serviceName?: string
  messages: ChatMessage[]
  updatedAt: number
}

/* =========================
   Navigation
   ========================= */

export type View =
  | { name: 'home' }
  | {
      name: 'service'
      serviceId: string
    }
  | { name: 'bag' }
  | { name: 'checkout' }
  | {
      name: 'success'
      orderId: string
    }
  | {
      name: 'tracking'
      orderId: string
    }
  | { name: 'orders' }
  | { name: 'profile' }
  | { name: 'provider' }
  | { name: 'admin' }
  | { name: 'complaints' }
  | { name: 'contact' }
  | {
      name: 'invoice'
      orderId: string
    }
  | {
      name: 'chat'
      orderId?: string
      providerId?: string
      providerName?: string
      serviceName?: string
    }