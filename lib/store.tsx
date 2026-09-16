'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import {
  ADDRESSES,
  COUPONS,
  EXPRESS_MULTIPLIER,
  getItem,
  getService,
  ORDER_STATUS_STEPS,
  PARTNERS,
  SERVICES,
} from './data'
import { getSavedLanguage, type Language } from './i18n'
import {
  generateEmergencyDispatch,
} from './emergency-dispatch'
import { generateDemandForecast } from './demand-forecast'

export { ORDER_STATUS_STEPS }

import type {
  Address,
  BookingType,
  CareLevel,
  CareSelection,
  CartLine,
  CooperativeEarning,
  Coupon,
  DeliveryJourney,
  DeliveryJourneyStage,
  EmergencyIncident,
  JourneyLocation,
  Order,
  OrderStatus,
  Partner,
  PaymentMethod,
  PaymentStatus,
  PaymentTransaction,
  View,
} from './types'

const DELIVERY_FEE = 40

const ORDERS_STORAGE_KEY = 'nexa_link_orders'
const NOTIFICATIONS_STORAGE_KEY =
  'nexa_link_notifications'
const COOPERATIVE_EARNINGS_STORAGE_KEY =
  'nexa_link_cooperative_earnings'
const TRANSACTIONS_STORAGE_KEY =
  'nexa_link_transactions'
const EMERGENCY_INCIDENTS_STORAGE_KEY =
  'nexa_link_emergency_incidents'
const DELIVERY_JOURNEYS_STORAGE_KEY =
  'nexa_link_delivery_journeys'

export const DELIVERY_JOURNEY_STAGES: DeliveryJourneyStage[] = [
  'DRIVER_ASSIGNED',
  'DRIVER_EN_ROUTE',
  'NEAR_CUSTOMER',
  'ARRIVED_CUSTOMER',
  'PICKUP_COMPLETED',
  'EN_ROUTE_TO_SHOP',
  'SHOP_REACHED',
  'SERVICE_STARTED',
  'SERVICE_COMPLETED',
  'RETURNING_TO_CUSTOMER',
  'NEAR_CUSTOMER_RETURN',
  'DELIVERED',
]

export interface Toast {
  id: number
  message: string
  variant: 'success' | 'error' | 'info'
}

export type NotificationAudience =
  | 'customer'
  | 'provider'
  | 'admin'

export type NotificationType =
  | 'booking'
  | 'status'
  | 'payment'
  | 'invoice'
  | 'emergency'
  | 'system'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  audience: NotificationAudience
  orderId?: string
  providerId?: string
  createdAt: number
  read: boolean
}

interface ServiceGroup {
  serviceId: string
  serviceName: string
  care: CareLevel
  lines: {
    itemId: string
    name: string
    unit: string
    qty: number
    unitPrice: number
  }[]
  itemCount: number
  amount: number
}

interface StoreValue {
  view: View
  navigate: (view: View) => void
  back: () => void
  cart: CartLine[]
  care: CareSelection
  addItem: (serviceId: string, itemId: string) => void
  removeItem: (serviceId: string, itemId: string) => void
  setQty: (serviceId: string, itemId: string, qty: number) => void
  getQty: (serviceId: string, itemId: string) => number
  setCare: (serviceId: string, level: CareLevel) => void
  clearCart: () => void
  groups: ServiceGroup[]
  totalItems: number
  subtotal: number
  delivery: number
  discount: number
  total: number
  coupon: Coupon | null
  couponError: string | null
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
  selectedProviders: Record<string, Partner>
  setSelectedProvider: (serviceId: string, provider: Partner) => void
  getSelectedProvider: (serviceId: string) => Partner | null
  address: Address
  setAddress: (address: Address) => void
  bookingType: BookingType
  setBookingType: (type: BookingType) => void
  pickupDate: string
  setPickupDate: (date: string) => void
  pickupSlot: string
  setPickupSlot: (slot: string) => void
  payment: string
  setPayment: (payment: string) => void
  location: string
  setLocation: (location: string) => void
  orders: Order[]
  cooperativeEarnings: CooperativeEarning[]
  placeOrder: () => Order
  transactions: PaymentTransaction[]
  createPaymentTransaction: (orderId: string) => PaymentTransaction | null
  processPayment: (orderId: string, options?: { forceFailure?: boolean }) => Promise<boolean>
  markPaymentFailed: (orderId: string) => boolean
  markCashPaymentCollected: (orderId: string) => boolean
  getTransaction: (orderId: string) => PaymentTransaction | undefined
  emergencyIncidents: EmergencyIncident[]
  createEmergencyIncident: (orderId: string, providerId: string, description?: string) => EmergencyIncident | null
  markEmergencyAssistanceSent: (incidentId: string) => boolean
  assignEmergencyReplacement: (incidentId: string) => boolean
  resolveEmergencyIncident: (incidentId: string) => boolean
  getEmergencyIncident: (incidentId: string) => EmergencyIncident | undefined
  deliveryJourneys: Record<string, DeliveryJourney>
  getDeliveryJourney: (orderId: string) => DeliveryJourney | undefined
  initializeDeliveryJourney: (orderId: string) => DeliveryJourney | null
  advanceDeliveryJourney: (orderId: string) => DeliveryJourney | null
  resetDeliveryJourney: (orderId: string) => DeliveryJourney | null
  advanceStatus: (orderId: string, status: OrderStatus) => void
  assignProviderToOrder: (orderId: string, providerId: string, serviceId?: string) => boolean
  creditCooperativeEarning: (orderId: string, providerId: string) => CooperativeEarning | null
  reorder: (orderId: string) => void
  getOrder: (id: string) => Order | undefined
  notifications: Notification[]
  unreadNotificationCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markNotificationRead: (notificationId: string) => void
  markAllNotificationsRead: () => void
  clearNotifications: () => void
  removeNotification: (notificationId: string) => void
  toasts: Toast[]
  toast: (message: string, variant?: Toast['variant']) => void
  dismissToast: (id: number) => void
}

/* emergency lifecycle is implemented below */
/*
  The remaining store implementation follows.
*/

const StoreContext =
  createContext<StoreValue | null>(null)

function linePrice(
  unitPrice: number,
  care: CareLevel,
): number {
  return Math.round(
    unitPrice *
      (care === 'express'
        ? EXPRESS_MULTIPLIER
        : 1),
  )
}

function normalizePaymentMethod(
  payment: string,
): PaymentMethod {
  const clean = payment
    .trim()
    .toLowerCase()

  if (
    clean.includes('card') ||
    clean.includes('credit') ||
    clean.includes('debit')
  ) {
    return 'Card'
  }

  if (
    clean.includes('net') ||
    clean.includes('bank')
  ) {
    return 'Net Banking'
  }

  if (
    clean.includes('cash') ||
    clean.includes('cod')
  ) {
    return 'Cash on Delivery'
  }

  return 'UPI'
}

function createPaymentDetails(
  payment: string,
) {
  const method =
    normalizePaymentMethod(payment)

  return {
    method,
    status: 'pending' as PaymentStatus,
    transactionId: undefined,
    paidAt: undefined,
  }
}

let transactionSequence = 1

function createTransactionId(): string {
  return `NXL-TXN-${Date.now()
    .toString(36)
    .toUpperCase()}-${transactionSequence++}`
}

function createInvoiceNumber(): string {
  const date = new Date()

  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')

  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  const random = Math.floor(
    1000 + Math.random() * 9000,
  )

  return `NXL-${year}${month}${day}-${random}`
}

function createNotificationId(): string {
  return `NXL-NOT-${Date.now()}-${Math.floor(
    Math.random() * 10000,
  )}`
}

function getStatusNotification(
  status: OrderStatus,
  language: Language = getSavedLanguage(),
) {
  const copy: Record<Language, Record<OrderStatus, { title: string; message: string }>> = {
    en: {
      scheduled: { title: 'Booking Scheduled', message: 'Your service booking has been scheduled successfully.' },
      picked: { title: 'Service Picked Up', message: 'Your service request has been picked up and processing will begin soon.' },
      processing: { title: 'Service In Progress', message: 'Your service is currently being processed.' },
      quality: { title: 'Quality Check', message: 'Your service has reached the quality-check stage.' },
      out: { title: 'Service On The Way', message: 'Your completed service is on the way to you.' },
      delivered: { title: 'Service Completed', message: 'Your service has been completed successfully.' },
    },
    ta: {
      scheduled: { title: 'முன்பதிவு திட்டமிடப்பட்டது', message: 'உங்கள் சேவை முன்பதிவு வெற்றிகரமாக திட்டமிடப்பட்டது.' },
      picked: { title: 'சேவை எடுத்துச் செல்லப்பட்டது', message: 'உங்கள் சேவை கோரிக்கை பெறப்பட்டது; விரைவில் செயலாக்கம் தொடங்கும்.' },
      processing: { title: 'சேவை நடைபெறுகிறது', message: 'உங்கள் சேவை தற்போது செயலாக்கப்படுகிறது.' },
      quality: { title: 'தரச் சோதனை', message: 'உங்கள் சேவை தரச் சோதனை நிலையை அடைந்துள்ளது.' },
      out: { title: 'சேவை வழியில் உள்ளது', message: 'உங்கள் முடிக்கப்பட்ட சேவை உங்களை நோக்கி வருகிறது.' },
      delivered: { title: 'சேவை முடிந்தது', message: 'உங்கள் சேவை வெற்றிகரமாக முடிக்கப்பட்டது.' },
    },
    hi: {
      scheduled: { title: 'बुकिंग शेड्यूल की गई', message: 'आपकी सेवा बुकिंग सफलतापूर्वक शेड्यूल की गई है।' },
      picked: { title: 'सेवा पिकअप की गई', message: 'आपकी सेवा रिक्वेस्ट ले ली गई है और जल्द प्रोसेसिंग शुरू होगी।' },
      processing: { title: 'सेवा जारी है', message: 'आपकी सेवा पर अभी काम किया जा रहा है।' },
      quality: { title: 'गुणवत्ता जांच', message: 'आपकी सेवा गुणवत्ता जांच के चरण में पहुंच गई है।' },
      out: { title: 'सेवा रास्ते में है', message: 'आपकी पूरी हुई सेवा आपके पास लाई जा रही है।' },
      delivered: { title: 'सेवा पूरी हुई', message: 'आपकी सेवा सफलतापूर्वक पूरी हो गई है।' },
    },
  }

  return copy[language][status]
}

function getPaymentNotification(
  key: 'pending' | 'success' | 'invoice' | 'received',
  orderId: string,
  language: Language = getSavedLanguage(),
) {
  const copy: Record<Language, Record<typeof key, string>> = {
    en: {
      pending: 'Payment is pending. Complete payment from the booking confirmation.',
      success: `Payment for booking ${orderId} has been received successfully.`,
      invoice: 'Your paid invoice is now available.',
      received: `Payment for booking ${orderId} has been received.`,
    },
    ta: {
      pending: 'கட்டணம் நிலுவையில் உள்ளது. முன்பதிவு உறுதிப்படுத்தலில் இருந்து கட்டணத்தை முடிக்கவும்.',
      success: `${orderId} முன்பதிவுக்கான கட்டணம் வெற்றிகரமாக பெறப்பட்டது.`,
      invoice: 'உங்கள் செலுத்தப்பட்ட ரசீது இப்போது கிடைக்கிறது.',
      received: `${orderId} முன்பதிவுக்கான கட்டணம் பெறப்பட்டது.`,
    },
    hi: {
      pending: 'भुगतान लंबित है। बुकिंग पुष्टि से भुगतान पूरा करें।',
      success: `${orderId} बुकिंग का भुगतान सफलतापूर्वक प्राप्त हुआ।`,
      invoice: 'आपका भुगतान किया गया इनवॉइस अब उपलब्ध है।',
      received: `${orderId} बुकिंग का भुगतान प्राप्त हुआ।`,
    },
  }

  return copy[language][key]
}

function createInitialDate(): string {
  const date = new Date()

  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')

  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getDefaultAddress(): Address {
  return (
    ADDRESSES[0] ?? {
      id: 'default',
      label: 'Home',
      line: 'Your saved address',
      icon: 'home',
    }
  )
}

function readLocalStorage<T>(
  key: string,
  fallback: T,
): T {
  if (
    typeof window ===
    'undefined'
  ) {
    return fallback
  }

  try {
    const value =
      window.localStorage.getItem(key)

    if (!value) {
      return fallback
    }

    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function createDeliveryJourney(order: Order): DeliveryJourney {
  const customerLocation: JourneyLocation = {
    latitude: order.latitude ?? 12.9716,
    longitude: order.longitude ?? 77.5946,
  }

  return {
    orderId: order.id,
    stage: 'DRIVER_ASSIGNED',
    driverLocation: {
      latitude: customerLocation.latitude + 0.018,
      longitude: customerLocation.longitude - 0.014,
    },
    customerLocation,
    shopLocation: {
      latitude: customerLocation.latitude + 0.009,
      longitude: customerLocation.longitude + 0.016,
    },
    updatedAt: Date.now(),
    etaMinutes: 12,
    simulation: true,
    notifiedStages: [],
  }
}

function getJourneyOrderStatus(stage: DeliveryJourneyStage): OrderStatus {
  if (stage === 'DRIVER_ASSIGNED') return 'scheduled'
  if (stage === 'DRIVER_EN_ROUTE' || stage === 'NEAR_CUSTOMER') return 'processing'
  if (stage === 'ARRIVED_CUSTOMER' || stage === 'PICKUP_COMPLETED') return 'picked'
  if (stage === 'EN_ROUTE_TO_SHOP' || stage === 'SHOP_REACHED') return 'processing'
  if (stage === 'SERVICE_STARTED' || stage === 'SERVICE_COMPLETED') return 'quality'
  if (stage === 'RETURNING_TO_CUSTOMER' || stage === 'NEAR_CUSTOMER_RETURN') return 'out'
  return 'delivered'
}

function getJourneyNotification(stage: DeliveryJourneyStage) {
  const messages: Record<DeliveryJourneyStage, { title: string; message: string }> = {
    DRIVER_ASSIGNED: { title: 'Provider Assigned', message: 'Your service provider has been assigned.' },
    DRIVER_EN_ROUTE: { title: 'Provider En Route', message: 'Your provider is on the way.' },
    NEAR_CUSTOMER: { title: 'Provider Nearby', message: 'Your provider is nearby.' },
    ARRIVED_CUSTOMER: { title: 'Provider Arrived', message: 'Your provider has arrived.' },
    PICKUP_COMPLETED: { title: 'Pickup Completed', message: 'Pickup has been completed.' },
    EN_ROUTE_TO_SHOP: { title: 'Going to Service Center', message: 'Your items are on the way to the service center.' },
    SHOP_REACHED: { title: 'Service Center Reached', message: 'Your items have reached the service center.' },
    SERVICE_STARTED: { title: 'Service Started', message: 'Your service has started.' },
    SERVICE_COMPLETED: { title: 'Service Completed', message: 'Your service has been completed.' },
    RETURNING_TO_CUSTOMER: { title: 'Returning to You', message: 'Your provider is returning with your order.' },
    NEAR_CUSTOMER_RETURN: { title: 'Provider Almost There', message: 'Your provider is almost at your location.' },
    DELIVERED: { title: 'Order Delivered', message: 'Your order has been delivered.' },
  }

  return messages[stage]
}

function findCoupon(
  code: string,
): Coupon | null {
  const clean = code
    .trim()
    .toUpperCase()

  if (!clean) {
    return null
  }

  const coupons =
    COUPONS as unknown

  if (Array.isArray(coupons)) {
    const match =
      coupons.find(
        (item) =>
          typeof item ===
            'object' &&
          item !== null &&
          'code' in item &&
          String(
            (
              item as {
                code: string
              }
            ).code,
          ).toUpperCase() ===
            clean,
      )

    return (
      (match as
        | Coupon
        | undefined) ?? null
    )
  }

  if (
    typeof coupons ===
      'object' &&
    coupons !== null
  ) {
    const record =
      coupons as Record<
        string,
        Coupon
      >

    const match =
      record[clean] ??
      record[
        clean.toLowerCase()
      ]

    if (match) {
      return match
    }

    for (const key of Object.keys(
      record,
    )) {
      if (
        key.toUpperCase() ===
        clean
      ) {
        return record[key]
      }
    }
  }

  return null
}

export function StoreProvider({
  children,
}: {
  children: ReactNode
}) {
  const [view, setView] =
    useState<View>({
      name: 'home',
    })

  const [history, setHistory] =
    useState<View[]>([])

  const [cart, setCart] =
    useState<CartLine[]>([])

  const [care, setCareState] =
    useState<CareSelection>({})

  const [coupon, setCoupon] =
    useState<Coupon | null>(null)

  const [couponError, setCouponError] =
    useState<string | null>(null)

  const [
    selectedProviders,
    setSelectedProviders,
  ] = useState<
    Record<string, Partner>
  >({})

  const [address, setAddressState] =
    useState<Address>(
      getDefaultAddress(),
    )

  const [bookingType, setBookingType] =
    useState<BookingType>(
      'scheduled',
    )

  const [pickupDate, setPickupDate] =
    useState<string>(
      createInitialDate(),
    )

  const [pickupSlot, setPickupSlot] =
    useState<string>(
      '9:00 AM - 11:00 AM',
    )

  const [payment, setPayment] =
    useState<string>('UPI')

  const [location, setLocation] =
    useState<string>('')

  const [orders, setOrders] =
    useState<Order[]>([])

  const [cooperativeEarnings, setCooperativeEarnings] =
    useState<CooperativeEarning[]>([])

  const [transactions, setTransactions] =
    useState<PaymentTransaction[]>([])

  const [emergencyIncidents, setEmergencyIncidents] =
    useState<EmergencyIncident[]>([])

  const [deliveryJourneys, setDeliveryJourneys] =
    useState<Record<string, DeliveryJourney>>({})

  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([])

  const [toasts, setToasts] =
    useState<Toast[]>([])

  // Date.now() alone can collide when one action creates several notices.
  const toastSequence = useRef(0)
  const processingPayments = useRef<Set<string>>(new Set())

  useEffect(() => {
    const savedOrders =
      readLocalStorage<Order[]>(
        ORDERS_STORAGE_KEY,
        [],
      )

    const savedNotifications =
      readLocalStorage<
        Notification[]
      >(
        NOTIFICATIONS_STORAGE_KEY,
        [],
      )

    const savedEarnings = readLocalStorage<
      CooperativeEarning[]
    >(
      COOPERATIVE_EARNINGS_STORAGE_KEY,
      [],
    )

    const savedTransactions = readLocalStorage<
      PaymentTransaction[]
    >(
      TRANSACTIONS_STORAGE_KEY,
      [],
    )

    const savedEmergencyIncidents = readLocalStorage<
      EmergencyIncident[]
    >(
      EMERGENCY_INCIDENTS_STORAGE_KEY,
      [],
    )

    const savedDeliveryJourneys = readLocalStorage<
      Record<string, DeliveryJourney>
    >(
      DELIVERY_JOURNEYS_STORAGE_KEY,
      {},
    )

    setOrders(savedOrders)
    setNotifications(
      savedNotifications,
    )
    setCooperativeEarnings(savedEarnings)
    setTransactions(savedTransactions)
    setEmergencyIncidents(savedEmergencyIncidents)
    setDeliveryJourneys(savedDeliveryJourneys)
  }, [])

  useEffect(() => {
    if (
      typeof window ===
      'undefined'
    ) {
      return
    }

    try {
      window.localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify(orders),
      )
    } catch {
      // Ignore storage errors.
    }
  }, [orders])

  useEffect(() => {
    if (
      typeof window ===
      'undefined'
    ) {
      return
    }

    try {
      window.localStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(
          notifications,
        ),
      )
    } catch {
      // Ignore storage errors.
    }
  }, [notifications])

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem(
        COOPERATIVE_EARNINGS_STORAGE_KEY,
        JSON.stringify(cooperativeEarnings),
      )
    } catch {
      // Ignore storage errors.
    }
  }, [cooperativeEarnings])

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem(
        TRANSACTIONS_STORAGE_KEY,
        JSON.stringify(transactions),
      )
    } catch {
      // Ignore storage errors.
    }
  }, [transactions])

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem(
        EMERGENCY_INCIDENTS_STORAGE_KEY,
        JSON.stringify(emergencyIncidents),
      )
    } catch {
      // Ignore storage errors.
    }
  }, [emergencyIncidents])

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem(
        DELIVERY_JOURNEYS_STORAGE_KEY,
        JSON.stringify(deliveryJourneys),
      )
    } catch {
      // Ignore storage errors.
    }
  }, [deliveryJourneys])

  const navigate = useCallback(
    (nextView: View) => {
      setHistory((current) => [
        ...current,
        view,
      ])

      setView(nextView)
    },
    [view],
  )

  const back = useCallback(() => {
    setHistory((current) => {
      if (current.length === 0) {
        setView({
          name: 'home',
        })

        return current
      }

      const next = [...current]

      const previous =
        next.pop()

      if (previous) {
        setView(previous)
      }

      return next
    })
  }, [])

  const addItem = useCallback(
    (
      serviceId: string,
      itemId: string,
    ) => {
      setCart((current) => {
        const existing =
          current.find(
            (line) =>
              line.serviceId ===
                serviceId &&
              line.itemId === itemId,
          )

        if (existing) {
          return current.map(
            (line) =>
              line === existing
                ? {
                    ...line,
                    qty:
                      line.qty + 1,
                  }
                : line,
          )
        }

        return [
          ...current,
          {
            serviceId,
            itemId,
            qty: 1,
          },
        ]
      })
    },
    [],
  )

  const removeItem = useCallback(
    (
      serviceId: string,
      itemId: string,
    ) => {
      setCart((current) =>
        current.filter(
          (line) =>
            !(
              line.serviceId ===
                serviceId &&
              line.itemId === itemId
            ),
        ),
      )
    },
    [],
  )

  const setQty = useCallback(
    (
      serviceId: string,
      itemId: string,
      qty: number,
    ) => {
      if (qty <= 0) {
        removeItem(
          serviceId,
          itemId,
        )

        return
      }

      setCart((current) =>
        current.map((line) =>
          line.serviceId ===
              serviceId &&
            line.itemId === itemId
            ? {
                ...line,
                qty: Math.max(
                  1,
                  Math.floor(qty),
                ),
              }
            : line,
        ),
      )
    },
    [removeItem],
  )

  const getQty = useCallback(
    (
      serviceId: string,
      itemId: string,
    ) => {
      const line = cart.find(
        (item) =>
          item.serviceId ===
            serviceId &&
          item.itemId === itemId,
      )

      return line?.qty ?? 0
    },
    [cart],
  )

  const setCare = useCallback(
    (
      serviceId: string,
      level: CareLevel,
    ) => {
      setCareState((current) => ({
        ...current,
        [serviceId]: level,
      }))
    },
    [],
  )

  const clearCart = useCallback(() => {
    setCart([])
    setCareState({})
    setSelectedProviders({})
    setCoupon(null)
    setCouponError(null)
  }, [])

  const groups = useMemo<
    ServiceGroup[]
  >(() => {
    const grouped =
      new Map<
        string,
        ServiceGroup
      >()

    for (const line of cart) {
      const service =
        getService(line.serviceId)

      const item = getItem(
        line.serviceId,
        line.itemId,
      )

      if (!service || !item) {
        continue
      }

      const careLevel =
        care[line.serviceId] ??
        'standard'

      const unitPrice =
        linePrice(
          item.price,
          careLevel,
        )

      const existing =
        grouped.get(
          line.serviceId,
        )

      if (existing) {
        existing.lines.push({
          itemId: item.id,
          name: item.name,
          unit: item.unit,
          qty: line.qty,
          unitPrice,
        })

        existing.itemCount +=
          line.qty

        existing.amount +=
          unitPrice * line.qty
      } else {
        grouped.set(
          line.serviceId,
          {
            serviceId:
              service.id,
            serviceName:
              service.name,
            care: careLevel,
            lines: [
              {
                itemId: item.id,
                name: item.name,
                unit: item.unit,
                qty: line.qty,
                unitPrice,
              },
            ],
            itemCount:
              line.qty,
            amount:
              unitPrice * line.qty,
          },
        )
      }
    }

    return Array.from(
      grouped.values(),
    )
  }, [cart, care])

  const totalItems = useMemo(
    () =>
      cart.reduce(
        (sum, line) =>
          sum + line.qty,
        0,
      ),
    [cart],
  )

  const subtotal = useMemo(
    () =>
      groups.reduce(
        (sum, group) =>
          sum + group.amount,
        0,
      ),
    [groups],
  )

  const delivery = useMemo(
    () =>
      subtotal > 0
        ? DELIVERY_FEE
        : 0,
    [subtotal],
  )

  const discount = useMemo(() => {
    if (!coupon || subtotal <= 0) {
      return 0
    }

    if (
      coupon.type ===
      'percent'
    ) {
      const calculated =
        Math.round(
          subtotal *
            (coupon.value / 100),
        )

      if (
        typeof coupon.cap ===
        'number'
      ) {
        return Math.min(
          calculated,
          coupon.cap,
        )
      }

      return calculated
    }

    if (
      coupon.type === 'flat'
    ) {
      return Math.min(
        coupon.value,
        subtotal,
      )
    }

    if (
      coupon.type ===
      'freeDelivery'
    ) {
      return delivery
    }

    return 0
  }, [
    coupon,
    subtotal,
    delivery,
  ])

  const total = useMemo(
    () =>
      Math.max(
        0,
        subtotal +
          delivery -
          discount,
      ),
    [
      subtotal,
      delivery,
      discount,
    ],
  )

  const applyCoupon = useCallback(
    (code: string) => {
      const clean = code
        .trim()
        .toUpperCase()

      if (!clean) {
        setCouponError(
          'Please enter a coupon code.',
        )

        return false
      }

      const found =
        findCoupon(clean)

      if (!found) {
        setCoupon(null)
        setCouponError(
          'Invalid or expired coupon code.',
        )

        return false
      }

      setCoupon(found)
      setCouponError(null)

      return true
    },
    [],
  )

  const removeCoupon =
    useCallback(() => {
      setCoupon(null)
      setCouponError(null)
    }, [])

  const setSelectedProvider =
    useCallback(
      (
        serviceId: string,
        provider: Partner,
      ) => {
        setSelectedProviders(
          (current) => ({
            ...current,
            [serviceId]:
              provider,
          }),
        )
      },
      [],
    )

  const getSelectedProvider =
    useCallback(
      (serviceId: string) =>
        selectedProviders[
          serviceId
        ] ?? null,
      [selectedProviders],
    )

  const setAddress =
    useCallback(
      (nextAddress: Address) => {
        setAddressState(
          nextAddress,
        )
      },
      [],
    )

  const addNotification =
    useCallback(
      (
        notification: Omit<
          Notification,
          'id' | 'createdAt' | 'read'
        >,
      ) => {
        const newNotification: Notification =
          {
            ...notification,
            id: createNotificationId(),
            createdAt: Date.now(),
            read: false,
          }

        setNotifications(
          (current) => [
            newNotification,
            ...current,
          ],
        )
      },
      [],
    )

  const markNotificationRead =
    useCallback(
      (notificationId: string) => {
        setNotifications(
          (current) =>
            current.map(
              (notification) =>
                notification.id ===
                notificationId
                  ? {
                      ...notification,
                      read: true,
                    }
                  : notification,
            ),
        )
      },
      [],
    )

  const markAllNotificationsRead =
    useCallback(() => {
      setNotifications(
        (current) =>
          current.map(
            (notification) => ({
              ...notification,
              read: true,
            }),
          ),
      )
    }, [])

  const clearNotifications =
    useCallback(() => {
      setNotifications([])
    }, [])

  const removeNotification =
    useCallback(
      (notificationId: string) => {
        setNotifications(
          (current) =>
            current.filter(
              (notification) =>
                notification.id !==
                notificationId,
            ),
        )
      },
      [],
    )

  const unreadNotificationCount =
    useMemo(
      () =>
        notifications.filter(
          (notification) =>
            !notification.read,
        ).length,
      [notifications],
    )

  const toast = useCallback(
    (
      message: string,
      variant: Toast['variant'] =
        'info',
    ) => {
      const id =
        Date.now() * 1000 +
        (toastSequence.current++ % 1000)

      setToasts((current) => [
        ...current,
        {
          id,
          message,
          variant,
        },
      ])

      window.setTimeout(() => {
        setToasts((current) =>
          current.filter(
            (item) =>
              item.id !== id,
          ),
        )
      }, 3500)
    },
    [],
  )

  const dismissToast =
    useCallback(
      (id: number) => {
        setToasts((current) =>
          current.filter(
            (item) =>
              item.id !== id,
          ),
        )
      },
      [],
    )

  const placeOrder =
    useCallback((): Order => {
      const now = Date.now()

      const orderId = `NXL-${now
        .toString(36)
        .toUpperCase()}`

      /*
       * Preserve customer-selected providers at booking time. Unselected
       * services remain available for the Admin AI Decision Center, which
       * ranks and assigns a verified provider to the real booking.
       */
      const assignedProviders: Record<
        string,
        Partner
      > = {}

      for (const group of groups) {
        const manuallySelected =
          selectedProviders[group.serviceId]

        if (manuallySelected) {
          assignedProviders[group.serviceId] =
            manuallySelected
        }
      }

      const providerList =
        Object.values(assignedProviders)

      const firstProvider =
        providerList[0]

      /* Provider assignment is stored per service. */
      const providerIds: Record<
        string,
        string
      > = {}

      const providerNames: Record<
        string,
        string
      > = {}

      for (const [
        serviceId,
        provider,
      ] of Object.entries(
        assignedProviders,
      )) {
        providerIds[serviceId] =
          provider.id
        providerNames[serviceId] =
          provider.name
      }

      const paymentDetails =
        createPaymentDetails(
          payment,
        )

      const invoiceNumber =
        createInvoiceNumber()

      const serviceSummaries =
        groups.map((group) => ({
          serviceId:
            group.serviceId,
          serviceName:
            group.serviceName,
          itemCount:
            group.itemCount,
          amount:
            group.amount,
        }))

      const priority =
        bookingType === 'emergency'
          ? 'emergency'
          : bookingType ===
              'on-demand'
            ? 'priority'
            : 'normal'

      const order: Order = {
        id: orderId,
        createdAt: now,
        status: 'scheduled',

        providerId:
          firstProvider?.id,

        services:
          serviceSummaries,

        lines: [...cart],

        care: {
          ...care,
        },

        address: {
          ...address,
        },

        pickupDate:
          pickupDate ||
          createInitialDate(),

        pickupSlot:
          pickupSlot ||
          '9:00 AM - 11:00 AM',

        payment,

        paymentDetails,

        paymentStatus:
          paymentDetails.status,

        invoiceId:
          `INV-${now}`,

        invoiceNumber,

        transactionId:
          paymentDetails.transactionId,

        paidAt:
          paymentDetails.paidAt,

        subtotal,

        delivery,

        discount,

        total,

        couponCode:
          coupon?.code,

        bookingType,

        priority,

        notes:
          location ||
          undefined,

        latitude:
          undefined,

        longitude:
          undefined,
      }

      const extendedOrder =
        order as Order & {
          providerIds?: Record<string, string>
          providerNames?: Record<string, string>
          providerName?: string
        }

      extendedOrder.providerIds =
        providerIds

      extendedOrder.providerNames =
        providerNames

      extendedOrder.providerName =
        firstProvider?.name

      setOrders((current) => [
        extendedOrder,
        ...current,
      ])

      const initialJourney = createDeliveryJourney(extendedOrder)
      setDeliveryJourneys((current) => ({
        ...current,
        [orderId]: {
          ...initialJourney,
          notifiedStages: ['DRIVER_ASSIGNED'],
        },
      }))

      const pendingTransaction: PaymentTransaction = {
        id: `NXL-PENDING-${orderId}`,
        orderId,
        providerId: firstProvider?.id,
        providerName: firstProvider?.name,
        amount: order.total,
        paymentMethod: paymentDetails.method,
        status:
          paymentDetails.method ===
          'Cash on Delivery'
            ? 'cash-pending'
            : 'pending',
        createdAt: now,
        workerEarnings: 0,
        cooperativeContribution: 0,
        welfareContribution: 0,
      }

      setTransactions((current) => [
        pendingTransaction,
        ...current,
      ])

      addNotification({
        title:
          bookingType ===
          'emergency'
            ? 'Emergency Booking Created'
            : 'Booking Confirmed',
        message:
          bookingType ===
          'emergency'
            ? 'Your emergency service request has been created and priority dispatch has started.'
            : 'Your service booking has been confirmed successfully.',
        type:
          bookingType ===
          'emergency'
            ? 'emergency'
            : 'booking',
        audience: 'customer',
        orderId,
        providerId:
          firstProvider?.id,
      })

      if (firstProvider) {
        addNotification({
          title:
            'New Service Request',
          message: `You have received a new ${bookingType} service request.`,
          type: 'booking',
          audience: 'provider',
          orderId,
          providerId:
            firstProvider.id,
        })
      }

      addNotification({
        title:
          'New Booking Received',
        message: `New booking ${orderId} has been created and is ready for processing.`,
        type: 'booking',
        audience: 'admin',
        orderId,
        providerId:
          firstProvider?.id,
      })

      addNotification({
        title: 'Payment Pending',
        message:
          paymentDetails.method === 'Cash on Delivery'
            ? 'Cash payment will remain pending until collection.'
            : getPaymentNotification('pending', orderId),
        type: 'payment',
        audience: 'customer',
        orderId,
      })

      addNotification({
        title:
          'Invoice Generated',
        message: `Invoice ${invoiceNumber} has been generated for your booking.`,
        type: 'invoice',
        audience: 'customer',
        orderId,
      })

      setCart([])
      setCareState({})
      setCoupon(null)
      setCouponError(null)
      setSelectedProviders({})

      toast(
        'Booking placed successfully!',
        'success',
      )

      return extendedOrder
    }, [
      selectedProviders,
      payment,
      groups,
      cart,
      care,
      address,
      pickupDate,
      pickupSlot,
      subtotal,
      delivery,
      discount,
      total,
      coupon,
      bookingType,
      location,
      addNotification,
      toast,
      setTransactions,
    ])

  const getTransaction = useCallback(
    (orderId: string) =>
      transactions.find(
        (transaction) =>
          transaction.orderId === orderId,
      ),
    [transactions],
  )

  const createPaymentTransaction = useCallback(
    (orderId: string) => {
      const existing = transactions.find(
        (transaction) =>
          transaction.orderId === orderId,
      )

      if (existing) return existing

      const order = orders.find(
        (item) => item.id === orderId,
      )

      if (!order) return null

      const providerId =
        order.providerId ??
        Object.values(order.providerIds ?? {})[0]

      const provider = providerId
        ? PARTNERS.find(
            (item) => item.id === providerId,
          )
        : undefined

      const transaction: PaymentTransaction = {
        id: `NXL-PENDING-${order.id}`,
        orderId: order.id,
        providerId,
        providerName:
          order.providerName ?? provider?.name,
        amount: order.total,
        paymentMethod:
          order.paymentDetails?.method ??
          normalizePaymentMethod(order.payment),
        status:
          order.paymentDetails?.method ===
          'Cash on Delivery'
            ? 'cash-pending'
            : 'pending',
        createdAt: order.createdAt,
        workerEarnings: 0,
        cooperativeContribution: 0,
        welfareContribution: 0,
      }

      setTransactions((current) => {
        if (
          current.some(
            (item) => item.orderId === orderId,
          )
        ) {
          return current
        }

        return [transaction, ...current]
      })

      return transaction
    },
    [orders, transactions],
  )

  const getDeliveryJourney = useCallback(
    (orderId: string) => deliveryJourneys[orderId],
    [deliveryJourneys],
  )

  const initializeDeliveryJourney = useCallback(
    (orderId: string) => {
      const existing = deliveryJourneys[orderId]
      if (existing) return existing

      const order = orders.find((item) => item.id === orderId)
      if (!order) return null

      const journey = createDeliveryJourney(order)
      const notification = getJourneyNotification(journey.stage)
      const providerId = order.providerId ?? Object.values(order.providerIds ?? {})[0]

      setDeliveryJourneys((current) =>
        current[orderId] ? current : {
          ...current,
          [orderId]: {
            ...journey,
            notifiedStages: [journey.stage],
          },
        },
      )
      addNotification({
        title: notification.title,
        message: notification.message,
        type: 'status',
        audience: 'customer',
        orderId,
        providerId,
      })

      return journey
    },
    [addNotification, deliveryJourneys, orders],
  )

  const advanceDeliveryJourney = useCallback(
    (orderId: string) => {
      const current = deliveryJourneys[orderId] ?? initializeDeliveryJourney(orderId)
      if (!current) return null

      const currentIndex = DELIVERY_JOURNEY_STAGES.indexOf(current.stage)
      const nextStage = DELIVERY_JOURNEY_STAGES[Math.min(currentIndex + 1, DELIVERY_JOURNEY_STAGES.length - 1)]
      if (nextStage === current.stage) return current

      const progress = (DELIVERY_JOURNEY_STAGES.indexOf(nextStage) + 1) / DELIVERY_JOURNEY_STAGES.length
      const driverLocation = nextStage === 'DELIVERED'
        ? current.customerLocation
        : nextStage === 'EN_ROUTE_TO_SHOP' || nextStage === 'SHOP_REACHED' || nextStage === 'SERVICE_STARTED' || nextStage === 'SERVICE_COMPLETED'
          ? {
              latitude: current.customerLocation.latitude + (current.shopLocation.latitude - current.customerLocation.latitude) * progress,
              longitude: current.customerLocation.longitude + (current.shopLocation.longitude - current.customerLocation.longitude) * progress,
            }
          : {
              latitude: current.driverLocation.latitude + (current.customerLocation.latitude - current.driverLocation.latitude) * 0.45,
              longitude: current.driverLocation.longitude + (current.customerLocation.longitude - current.driverLocation.longitude) * 0.45,
            }
      const journey: DeliveryJourney = {
        ...current,
        stage: nextStage,
        driverLocation,
        updatedAt: Date.now(),
        etaMinutes: Math.max(1, Math.ceil((DELIVERY_JOURNEY_STAGES.length - 1 - DELIVERY_JOURNEY_STAGES.indexOf(nextStage)) * 1.2)),
        notifiedStages: current.notifiedStages.includes(nextStage)
          ? current.notifiedStages
          : [...current.notifiedStages, nextStage],
      }

      setDeliveryJourneys((all) => ({ ...all, [orderId]: journey }))
      const order = orders.find((item) => item.id === orderId)
      if (order) {
        const status = getJourneyOrderStatus(nextStage)
        if (order.status !== status) {
          setOrders((all) => all.map((item) => item.id === orderId ? { ...item, status } : item))
        }
        const notification = getJourneyNotification(nextStage)
        addNotification({
          title: notification.title,
          message: notification.message,
          type: 'status',
          audience: 'customer',
          orderId,
          providerId: order.providerId,
        })
      }

      return journey
    },
    [addNotification, deliveryJourneys, initializeDeliveryJourney, orders],
  )

  const resetDeliveryJourney = useCallback(
    (orderId: string) => {
      const order = orders.find((item) => item.id === orderId)
      if (!order) return null
      const journey = createDeliveryJourney(order)
      setDeliveryJourneys((all) => ({ ...all, [orderId]: journey }))
      if (order.status !== 'scheduled') {
        setOrders((all) => all.map((item) => item.id === orderId ? { ...item, status: 'scheduled' } : item))
      }
      return journey
    },
    [orders],
  )

  const advanceStatus =
    useCallback(
      (
        orderId: string,
        status: OrderStatus,
      ) => {
        setOrders((current) =>
          current.map((order) => {
            if (
              order.id !== orderId
            ) {
              return order
            }

            return {
              ...order,
              status,
            }
          }),
        )

        const order =
          orders.find(
            (item) =>
              item.id === orderId,
          )

        if (!order) {
          return
        }

        const statusInfo =
          getStatusNotification(
            status,
          )

        addNotification({
          title:
            statusInfo.title,
          message:
            statusInfo.message,
          type: 'status',
          audience: 'customer',
          orderId,
          providerId:
            order.providerId,
        })

        if (order.providerId) {
          addNotification({
            title:
              'Booking Status Updated',
            message: `Booking ${orderId} is now marked as ${status}.`,
            type: 'status',
            audience: 'provider',
            orderId,
            providerId:
              order.providerId,
          })
        }

        addNotification({
          title:
            'Order Status Updated',
          message: `Order ${orderId} has been updated to ${status}.`,
          type: 'status',
          audience: 'admin',
          orderId,
          providerId:
            order.providerId,
        })

        toast(
          statusInfo.title,
          'success',
        )
      },
      [
        orders,
        addNotification,
        toast,
      ],
    )

  const assignProviderToOrder =
    useCallback(
      (
        orderId: string,
        providerId: string,
        serviceId?: string,
      ) => {
        const order = orders.find(
          (item) => item.id === orderId,
        )

        if (!order) {
          toast('Booking not found.', 'error')
          return false
        }

        if (order.status === 'delivered') {
          toast('Completed bookings cannot be reassigned.', 'info')
          return false
        }

        const provider = PARTNERS.find(
          (item) => item.id === providerId,
        )

        if (!provider) {
          toast('Selected provider was not found.', 'error')
          return false
        }

        if (!provider.available || !provider.verified) {
          toast(
            'Only available, verified providers can receive an AI assignment.',
            'error',
          )
          return false
        }

        const targetServiceId =
          serviceId ?? order.services[0]?.serviceId

        if (!targetServiceId) {
          toast('This booking has no service to assign.', 'error')
          return false
        }

        if (!order.services.some((service) => service.serviceId === targetServiceId)) {
          toast('The selected service does not belong to this booking.', 'error')
          return false
        }

        const currentProviderId =
          order.providerIds?.[targetServiceId] ?? order.providerId

        if (currentProviderId === providerId) {
          toast(`${provider.name} is already assigned to this booking.`, 'info')
          return false
        }

        setOrders((current) =>
          current.map((item) => {
            if (item.id !== orderId) return item

            const providerIds = {
              ...(item.providerIds ?? {}),
              [targetServiceId]: provider.id,
            }
            const providerNames = {
              ...(item.providerNames ?? {}),
              [targetServiceId]: provider.name,
            }
            const primaryServiceId = item.services[0]?.serviceId
            const primaryProviderId = primaryServiceId
              ? providerIds[primaryServiceId]
              : provider.id
            const primaryProvider = PARTNERS.find(
              (candidate) => candidate.id === primaryProviderId,
            )

            return {
              ...item,
              providerIds,
              providerNames,
              providerId: primaryProviderId,
              providerName: primaryProvider?.name ?? provider.name,
            }
          }),
        )

        addNotification({
          title: 'Provider Assigned',
          message: `Your booking has been assigned to ${provider.name}.`,
          type: 'booking',
          audience: 'customer',
          orderId,
          providerId: provider.id,
        })
        addNotification({
          title: 'New Service Request',
          message: `You have received a new service request for booking ${orderId}.`,
          type: 'booking',
          audience: 'provider',
          orderId,
          providerId: provider.id,
        })
        addNotification({
          title: 'AI Recommendation Approved',
          message: `${provider.name} was assigned to booking ${orderId}.`,
          type: 'system',
          audience: 'admin',
          orderId,
          providerId: provider.id,
        })

        return true
      },
      [orders, addNotification, toast],
    )

  const getEmergencyIncident = useCallback(
    (incidentId: string) =>
      emergencyIncidents.find(
        (incident) => incident.id === incidentId,
      ),
    [emergencyIncidents],
  )

  const createEmergencyIncident = useCallback(
    (
      orderId: string,
      providerId: string,
      description = 'Worker requested emergency assistance during an active job.',
    ) => {
      const existing = emergencyIncidents.find(
        (incident) =>
          incident.orderId === orderId &&
          incident.providerId === providerId &&
          (incident.status === 'active' ||
            incident.status === 'dispatching' ||
            incident.status === 'assistance-sent' ||
            incident.status === 'replacement-required'),
      )

      if (existing) {
        toast(
          'An emergency alert is already active for this job.',
          'info',
        )
        return existing
      }

      const order = orders.find(
        (item) => item.id === orderId,
      )
      const provider = PARTNERS.find(
        (item) => item.id === providerId,
      )

      if (!order || !provider) {
        toast('Active job or provider not found.', 'error')
        return null
      }

      const service = order.services[0]
      const forecast = generateDemandForecast(
        SERVICES,
        orders,
      )
      const dispatch = generateEmergencyDispatch(
        SERVICES,
        PARTNERS,
        forecast,
      )
      const dispatchForService = dispatch.dispatches.find(
        (item) => item.serviceId === service?.serviceId,
      )
      const replacementRequired = true
      const incident: EmergencyIncident = {
        id: `NXL-INC-${Date.now().toString(36).toUpperCase()}`,
        orderId,
        providerId,
        providerName: provider.name,
        serviceName: service?.serviceName ?? 'Service',
        location: order.address.line,
        timestamp: Date.now(),
        status: dispatchForService?.recommendedProvider
          ? 'replacement-required'
          : 'dispatching',
        priority: order.priority === 'emergency' ? 'critical' : 'high',
        description,
        replacementRequired,
      }

      setEmergencyIncidents((current) => [incident, ...current])

      addNotification({
        title: 'Emergency SOS sent',
        message: 'Your emergency alert has been sent to the cooperative support team.',
        type: 'emergency',
        audience: 'provider',
        orderId,
        providerId,
      })
      addNotification({
        title: 'Emergency alert received',
        message: 'Emergency assistance has been requested for the current service.',
        type: 'emergency',
        audience: 'admin',
        orderId,
        providerId,
      })
      addNotification({
        title: 'Emergency assistance requested',
        message: 'The cooperative support team has been notified and is arranging assistance.',
        type: 'emergency',
        audience: 'customer',
        orderId,
        providerId,
      })

      toast('Emergency alert sent.', 'success')
      return incident
    },
    [emergencyIncidents, orders, addNotification, toast],
  )

  const markEmergencyAssistanceSent = useCallback(
    (incidentId: string) => {
      const incident = emergencyIncidents.find(
        (item) => item.id === incidentId,
      )

      if (!incident || incident.status === 'resolved' || incident.status === 'cancelled') {
        return false
      }

      setEmergencyIncidents((current) =>
        current.map((item) =>
          item.id === incidentId
            ? { ...item, status: 'assistance-sent' }
            : item,
        ),
      )
      addNotification({
        title: 'Emergency dispatch initiated',
        message: 'Emergency assistance has been dispatched by the cooperative.',
        type: 'emergency',
        audience: 'admin',
        orderId: incident.orderId,
        providerId: incident.providerId,
      })
      addNotification({
        title: 'Emergency assistance dispatched',
        message: 'The cooperative support team is responding to your service.',
        type: 'emergency',
        audience: 'customer',
        orderId: incident.orderId,
        providerId: incident.providerId,
      })
      return true
    },
    [emergencyIncidents, addNotification],
  )

  const assignEmergencyReplacement = useCallback(
    (incidentId: string) => {
      const incident = emergencyIncidents.find(
        (item) => item.id === incidentId,
      )
      const order = incident
        ? orders.find((item) => item.id === incident.orderId)
        : undefined

      if (!incident || !order || !incident.replacementRequired) {
        return false
      }

      const forecast = generateDemandForecast(SERVICES, orders)
      const dispatch = generateEmergencyDispatch(SERVICES, PARTNERS, forecast)
      const recommendation = dispatch.dispatches
        .find((item) => item.serviceId === order.services[0]?.serviceId)
        ?.candidates.find(
          (candidate) =>
            candidate.available &&
            candidate.providerId !== incident.providerId,
        )

      if (!recommendation) {
        toast('No verified available replacement provider was found.', 'info')
        return false
      }

      const assigned = assignProviderToOrder(
        order.id,
        recommendation.providerId,
        order.services[0]?.serviceId,
      )

      if (!assigned) return false

      setEmergencyIncidents((current) =>
        current.map((item) =>
          item.id === incidentId
            ? {
                ...item,
                status: 'assistance-sent',
                replacementProviderId: recommendation.providerId,
                replacementProviderName: recommendation.providerName,
              }
            : item,
        ),
      )
      addNotification({
        title: 'Replacement provider assigned',
        message: `${recommendation.providerName} has been assigned to continue booking ${order.id}.`,
        type: 'emergency',
        audience: 'customer',
        orderId: order.id,
        providerId: recommendation.providerId,
      })
      addNotification({
        title: 'Emergency replacement job assigned',
        message: `You have been assigned as replacement provider for booking ${order.id}.`,
        type: 'emergency',
        audience: 'provider',
        orderId: order.id,
        providerId: recommendation.providerId,
      })
      addNotification({
        title: 'Replacement provider assigned',
        message: `${recommendation.providerName} was assigned after the emergency alert.`,
        type: 'emergency',
        audience: 'admin',
        orderId: order.id,
        providerId: recommendation.providerId,
      })
      return true
    },
    [emergencyIncidents, orders, assignProviderToOrder, addNotification, toast],
  )

  const resolveEmergencyIncident = useCallback(
    (incidentId: string) => {
      const incident = emergencyIncidents.find(
        (item) => item.id === incidentId,
      )

      if (!incident || incident.status === 'resolved' || incident.status === 'cancelled') {
        return false
      }

      const resolvedAt = Date.now()
      setEmergencyIncidents((current) =>
        current.map((item) =>
          item.id === incidentId
            ? { ...item, status: 'resolved', resolvedAt }
            : item,
        ),
      )
      addNotification({
        title: 'Emergency incident resolved',
        message: 'The emergency situation has been resolved by the cooperative.',
        type: 'emergency',
        audience: 'customer',
        orderId: incident.orderId,
        providerId: incident.providerId,
      })
      addNotification({
        title: 'Emergency incident resolved',
        message: 'Your emergency incident has been marked resolved.',
        type: 'emergency',
        audience: 'provider',
        orderId: incident.orderId,
        providerId: incident.providerId,
      })
      addNotification({
        title: 'Emergency incident resolved',
        message: `Incident ${incident.id} has been resolved.`,
        type: 'emergency',
        audience: 'admin',
        orderId: incident.orderId,
        providerId: incident.providerId,
      })
      return true
    },
    [emergencyIncidents, addNotification],
  )

  const creditCooperativeEarning =
    useCallback(
      (orderId: string, providerId: string) => {
        const order = orders.find((item) => item.id === orderId)
        const provider = PARTNERS.find((item) => item.id === providerId)

        if (!order || !provider) return null

        const existing = cooperativeEarnings.find(
          (earning) =>
            earning.orderId === orderId &&
            earning.providerId === providerId,
        )
        if (existing) return existing

        const customerPaid = Math.max(0, Math.round(order.total))
        const distanceKm = Number(provider.distance.match(/\d+(?:\.\d+)?/)?.[0] ?? 0)
        const basePay = Math.round(customerPaid * 0.7)
        const travelCompensation = Math.min(50, Math.round(distanceKm * 8))
        const skillBonus = provider.verified
          ? Math.round(customerPaid * (provider.experience >= 5 ? 0.08 : 0.05))
          : 0
        const reliabilityBonus = provider.rating >= 4.7
          ? Math.round(customerPaid * 0.04)
          : 0
        const emergencyBonus = order.priority === 'emergency'
          ? Math.round(customerPaid * 0.1)
          : 0
        const cooperativeContribution = Math.round(customerPaid * 0.05)
        const welfareContribution = Math.round(customerPaid * 0.03)
        const grossEarnings =
          basePay + travelCompensation + skillBonus + reliabilityBonus + emergencyBonus
        const netEarnings = Math.max(
          0,
          grossEarnings - cooperativeContribution - welfareContribution,
        )
        const fairPayScore = Math.min(
          100,
          62 +
            (provider.verified ? 10 : 0) +
            Math.round((provider.rating / 5) * 10) +
            Math.min(8, provider.experience * 2) +
            (distanceKm <= 5 ? 4 : 1) +
            (order.priority === 'emergency' ? 3 : 0),
        )
        const earning: CooperativeEarning = {
          id: `COOP-EARN-${orderId}-${providerId}`,
          orderId,
          providerId,
          providerName: provider.name,
          serviceName: order.services.map((service) => service.serviceName).join(', ') || 'Service',
          customerPaid,
          basePay,
          travelCompensation,
          skillBonus,
          reliabilityBonus,
          emergencyBonus,
          cooperativeContribution,
          welfareContribution,
          grossEarnings,
          netEarnings,
          fairPayScore,
          createdAt: Date.now(),
        }

        setCooperativeEarnings((current) => [...current, earning])
        addNotification({
          title: 'Earnings Credited',
          message: `Earnings credited: ₹${netEarnings} for completed ${earning.serviceName}.`,
          type: 'payment',
          audience: 'provider',
          orderId,
          providerId,
        })
        return earning
      },
      [orders, cooperativeEarnings, addNotification],
    )

  const completePayment = useCallback(
    (orderId: string): boolean => {
      const order = orders.find(
        (item) => item.id === orderId,
      )
      const transaction = transactions.find(
        (item) => item.orderId === orderId,
      )

      if (!order || !transaction) return false

      if (
        order.paymentStatus === 'paid' ||
        order.paymentDetails?.status === 'paid' ||
        transaction.status === 'paid'
      ) {
        toast('Payment already completed.', 'info')
        return false
      }

      const paidAt = Date.now()
      let transactionId = createTransactionId()

      while (
        transactions.some(
          (item) => item.id === transactionId,
        )
      ) {
        transactionId = createTransactionId()
      }
      const providerIds = new Set<string>()

      if (order.providerId) {
        providerIds.add(order.providerId)
      }

      for (const providerId of Object.values(
        order.providerIds ?? {},
      )) {
        providerIds.add(providerId)
      }

      const earnings = Array.from(providerIds)
        .map((providerId) =>
          creditCooperativeEarning(
            orderId,
            providerId,
          ),
        )
        .filter(
          (earning): earning is CooperativeEarning =>
            earning !== null,
        )

      const workerEarnings = earnings.reduce(
        (sum, earning) => sum + earning.netEarnings,
        0,
      )
      const cooperativeContribution = earnings.reduce(
        (sum, earning) =>
          sum + earning.cooperativeContribution,
        0,
      )
      const welfareContribution = earnings.reduce(
        (sum, earning) =>
          sum + earning.welfareContribution,
        0,
      )

      const paymentDetails = {
        ...(order.paymentDetails ?? {
          method: transaction.paymentMethod,
        }),
        status: 'paid' as PaymentStatus,
        transactionId,
        paidAt,
      }

      setOrders((current) =>
        current.map((item) =>
          item.id === orderId
            ? {
                ...item,
                paymentDetails,
                paymentStatus: 'paid',
                transactionId,
                paidAt,
              }
            : item,
        ),
      )

      setTransactions((current) =>
        current.map((item) =>
          item.orderId === orderId
            ? {
                ...item,
                id: transactionId,
                status: 'paid',
                paidAt,
                workerEarnings,
                cooperativeContribution,
                welfareContribution,
              }
            : item,
        ),
      )

      const notifyOnce = (
        notification: Omit<
          Notification,
          'id' | 'createdAt' | 'read'
        >,
      ) => {
        const alreadySent = notifications.some(
          (item) =>
            item.orderId === orderId &&
            item.audience === notification.audience &&
            item.title === notification.title,
        )

        if (!alreadySent) addNotification(notification)
      }

      notifyOnce({
        title: 'Payment Successful',
        message: getPaymentNotification('success', orderId),
        type: 'payment',
        audience: 'customer',
        orderId,
      })

      for (const providerId of providerIds) {
        notifyOnce({
          title: 'Payment Received',
          message: getPaymentNotification('received', orderId),
          type: 'payment',
          audience: 'provider',
          orderId,
          providerId,
        })
      }

      notifyOnce({
        title: 'Invoice Ready',
        message: getPaymentNotification('invoice', orderId),
        type: 'invoice',
        audience: 'customer',
        orderId,
      })

      notifyOnce({
        title: 'Payment Received',
        message: getPaymentNotification('received', orderId),
        type: 'payment',
        audience: 'admin',
        orderId,
      })

      toast('Payment successful.', 'success')
      return true
    },
    [
      orders,
      transactions,
      creditCooperativeEarning,
      notifications,
      addNotification,
      toast,
    ],
  )

  const markPaymentFailed = useCallback(
    (orderId: string) => {
      const transaction = transactions.find(
        (item) => item.orderId === orderId,
      )

      if (!transaction || transaction.status === 'paid') {
        return false
      }

      setTransactions((current) =>
        current.map((item) =>
          item.orderId === orderId
            ? { ...item, status: 'failed' }
            : item,
        ),
      )
      setOrders((current) =>
        current.map((item) =>
          item.id === orderId
            ? {
                ...item,
                paymentStatus: 'failed',
                paymentDetails: item.paymentDetails
                  ? {
                      ...item.paymentDetails,
                      status: 'failed',
                    }
                  : item.paymentDetails,
              }
            : item,
        ),
      )
      return true
    },
    [transactions],
  )

  const processPayment = useCallback(
    async (
      orderId: string,
      options?: { forceFailure?: boolean },
    ) => {
      const order = orders.find(
        (item) => item.id === orderId,
      )
      const transaction = transactions.find(
        (item) => item.orderId === orderId,
      )

      if (!order || !transaction) return false

      if (
        order.paymentStatus === 'paid' ||
        order.paymentDetails?.status === 'paid' ||
        transaction.status === 'paid'
      ) {
        toast('Payment already completed.', 'info')
        return false
      }

      if (processingPayments.current.has(orderId)) {
        return false
      }

      processingPayments.current.add(orderId)
      setTransactions((current) =>
        current.map((item) =>
          item.orderId === orderId
            ? { ...item, status: 'processing' }
            : item,
        ),
      )
      setOrders((current) =>
        current.map((item) =>
          item.id === orderId
            ? {
                ...item,
                paymentStatus: 'processing',
                paymentDetails: item.paymentDetails
                  ? {
                      ...item.paymentDetails,
                      status: 'processing',
                    }
                  : item.paymentDetails,
              }
            : item,
        ),
      )

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 1700)
      })

      if (options?.forceFailure) {
        const failed = markPaymentFailed(orderId)
        processingPayments.current.delete(orderId)
        return failed
      }

      const completed = completePayment(orderId)
      processingPayments.current.delete(orderId)
      return completed
    },
    [orders, transactions, completePayment, markPaymentFailed, toast],
  )

  const markCashPaymentCollected = useCallback(
    (orderId: string) => {
      const order = orders.find(
        (item) => item.id === orderId,
      )

      if (
        !order ||
        order.paymentDetails?.method !==
          'Cash on Delivery'
      ) {
        return false
      }

      return completePayment(orderId)
    },
    [orders, completePayment],
  )

  const reorder =
    useCallback(
      (orderId: string) => {
        const order =
          orders.find(
            (item) =>
              item.id === orderId,
          )

        if (!order) {
          toast(
            'Order not found.',
            'error',
          )

          return
        }

        setCart([
          ...order.lines,
        ])

        setCareState({
          ...order.care,
        })

        const extendedOrder =
          order as Order & {
            providerIds?: string[]
          }

        const restoredProviders:
          Record<string, Partner> =
          {}

        if (
          extendedOrder.providerIds
        ) {
          for (
            const serviceId of Object.keys(
              order.care,
            )
          ) {
            const providerId =
              extendedOrder
                .providerIds[0]

            if (!providerId) {
              continue
            }

            const provider =
              PARTNERS.find(
                (item) =>
                  item.id ===
                  providerId,
              )

            if (provider) {
              restoredProviders[
                serviceId
              ] = provider
            }
          }
        } else if (
          order.providerId
        ) {
          const provider =
            PARTNERS.find(
              (item) =>
                item.id ===
                order.providerId,
            )

          if (provider) {
            for (
              const serviceId of Object.keys(
                order.care,
              )
            ) {
              restoredProviders[
                serviceId
              ] = provider
            }
          }
        }

        setSelectedProviders(
          restoredProviders,
        )

        setAddressState({
          ...order.address,
        })

        setBookingType(
          order.bookingType ??
            'scheduled',
        )

        setPickupDate(
          order.pickupDate ||
            createInitialDate(),
        )

        setPickupSlot(
          order.pickupSlot ||
            '9:00 AM - 11:00 AM',
        )

        setPayment(
          order.payment ||
            'UPI',
        )

        setCoupon(null)
        setCouponError(null)

        navigate({
          name: 'bag',
        })

        toast(
          'Previous order added to your bag.',
          'success',
        )
      },
      [
        orders,
        navigate,
        toast,
      ],
    )

  const getOrder = useCallback(
    (id: string) =>
      orders.find(
        (order) =>
          order.id === id,
      ),
    [orders],
  )

  const value = useMemo<StoreValue>(
    () => ({
      view,
      navigate,
      back,

      cart,
      care,

      addItem,
      removeItem,
      setQty,
      getQty,
      setCare,
      clearCart,

      groups,
      totalItems,

      subtotal,
      delivery,
      discount,
      total,

      coupon,
      couponError,

      applyCoupon,
      removeCoupon,

      selectedProviders,

      setSelectedProvider,
      getSelectedProvider,

      address,
      setAddress,

      bookingType,
      setBookingType,

      pickupDate,
      setPickupDate,

      pickupSlot,
      setPickupSlot,

      payment,
      setPayment,

      location,
      setLocation,

      orders,

      transactions,

      createPaymentTransaction,
      processPayment,
      markPaymentFailed,
      markCashPaymentCollected,
      getTransaction,

      emergencyIncidents,
      createEmergencyIncident,
      markEmergencyAssistanceSent,
      assignEmergencyReplacement,
      resolveEmergencyIncident,
      getEmergencyIncident,

      deliveryJourneys,
      getDeliveryJourney,
      initializeDeliveryJourney,
      advanceDeliveryJourney,
      resetDeliveryJourney,

      cooperativeEarnings,

      placeOrder,
      advanceStatus,
      assignProviderToOrder,
      creditCooperativeEarning,
      reorder,
      getOrder,

      notifications,
      unreadNotificationCount,

      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      removeNotification,

      toasts,
      toast,
      dismissToast,
    }),
    [
      view,
      navigate,
      back,
      cart,
      care,
      addItem,
      removeItem,
      setQty,
      getQty,
      setCare,
      clearCart,
      groups,
      totalItems,
      subtotal,
      delivery,
      discount,
      total,
      coupon,
      couponError,
      applyCoupon,
      removeCoupon,
      selectedProviders,
      setSelectedProvider,
      getSelectedProvider,
      address,
      setAddress,
      bookingType,
      pickupDate,
      pickupSlot,
      payment,
      location,
      orders,
      transactions,
      createPaymentTransaction,
      processPayment,
      markPaymentFailed,
      markCashPaymentCollected,
      getTransaction,
      emergencyIncidents,
      createEmergencyIncident,
      markEmergencyAssistanceSent,
      assignEmergencyReplacement,
      resolveEmergencyIncident,
      getEmergencyIncident,
      deliveryJourneys,
      getDeliveryJourney,
      initializeDeliveryJourney,
      advanceDeliveryJourney,
      resetDeliveryJourney,
      cooperativeEarnings,
      placeOrder,
      advanceStatus,
      assignProviderToOrder,
      creditCooperativeEarning,
      reorder,
      getOrder,
      notifications,
      unreadNotificationCount,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      removeNotification,
      toasts,
      toast,
      dismissToast,
    ],
  )

  return (
    <StoreContext.Provider
      value={value}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context =
    useContext(StoreContext)

  if (!context) {
    throw new Error(
      'useStore must be used within StoreProvider',
    )
  }

  return context
}
