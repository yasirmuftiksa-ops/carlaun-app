'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
} from './data'

export { ORDER_STATUS_STEPS }

import type {
  Address,
  BookingType,
  CareLevel,
  CareSelection,
  CartLine,
  Coupon,
  Order,
  OrderStatus,
  Partner,
  PaymentMethod,
  PaymentStatus,
  View,
} from './types'

const DELIVERY_FEE = 40

const ORDERS_STORAGE_KEY = 'nexa_link_orders'
const NOTIFICATIONS_STORAGE_KEY =
  'nexa_link_notifications'

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

  addItem: (
    serviceId: string,
    itemId: string,
  ) => void

  removeItem: (
    serviceId: string,
    itemId: string,
  ) => void

  setQty: (
    serviceId: string,
    itemId: string,
    qty: number,
  ) => void

  getQty: (
    serviceId: string,
    itemId: string,
  ) => number

  setCare: (
    serviceId: string,
    level: CareLevel,
  ) => void

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

  setSelectedProvider: (
    serviceId: string,
    provider: Partner,
  ) => void

  getSelectedProvider: (
    serviceId: string,
  ) => Partner | null

  address: Address
  setAddress: (address: Address) => void

  bookingType: BookingType
  setBookingType: (
    type: BookingType,
  ) => void

  pickupDate: string
  setPickupDate: (date: string) => void

  pickupSlot: string
  setPickupSlot: (slot: string) => void

  payment: string
  setPayment: (payment: string) => void

  location: string
  setLocation: (location: string) => void

  orders: Order[]

  placeOrder: () => Order

  advanceStatus: (
    orderId: string,
    status: OrderStatus,
  ) => void

  reorder: (orderId: string) => void

  getOrder: (
    id: string,
  ) => Order | undefined

  notifications: Notification[]

  unreadNotificationCount: number

  addNotification: (
    notification: Omit<
      Notification,
      'id' | 'createdAt' | 'read'
    >,
  ) => void

  markNotificationRead: (
    notificationId: string,
  ) => void

  markAllNotificationsRead: () => void

  clearNotifications: () => void

  removeNotification: (
    notificationId: string,
  ) => void

  toasts: Toast[]

  toast: (
    message: string,
    variant?: Toast['variant'],
  ) => void

  dismissToast: (id: number) => void
}

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

  const isCash =
    method === 'Cash on Delivery'

  const status: PaymentStatus =
    isCash ? 'pending' : 'paid'

  const transactionId = isCash
    ? undefined
    : `NLTXN-${Date.now()
        .toString(36)
        .toUpperCase()}-${Math.floor(
        100 + Math.random() * 900,
      )}`

  return {
    method,
    status,
    transactionId,
    paidAt: isCash
      ? undefined
      : Date.now(),
  }
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
) {
  switch (status) {
    case 'scheduled':
      return {
        title: 'Booking Scheduled',
        message:
          'Your service booking has been scheduled successfully.',
      }

    case 'picked':
      return {
        title: 'Service Picked Up',
        message:
          'Your service request has been picked up and processing will begin soon.',
      }

    case 'processing':
      return {
        title: 'Service In Progress',
        message:
          'Your service is currently being processed.',
      }

    case 'quality':
      return {
        title: 'Quality Check',
        message:
          'Your service has reached the quality-check stage.',
      }

    case 'out':
      return {
        title: 'Service On The Way',
        message:
          'Your completed service is on the way to you.',
      }

    case 'delivered':
      return {
        title: 'Service Completed',
        message:
          'Your service has been completed successfully.',
      }

    default:
      return {
        title: 'Booking Updated',
        message:
          'Your booking status has been updated.',
      }
  }
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

  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([])

  const [toasts, setToasts] =
    useState<Toast[]>([])

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

    setOrders(savedOrders)
    setNotifications(
      savedNotifications,
    )
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
      const id = Date.now()

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
       * Build a provider assignment for every service in the order.
       * If the customer did not manually select a provider, automatically
       * choose an available verified provider. This guarantees that every
       * new booking has a providerId/providerIds that ProviderScreen can use.
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
          continue
        }

        const serviceName =
          group.serviceName.toLowerCase()

        const matchingProvider =
          PARTNERS.find((provider) => {
            if (!provider.available || !provider.verified) {
              return false
            }

            return provider.services
              .toLowerCase()
              .includes(serviceName)
          })

        const fallbackProvider =
          PARTNERS.find(
            (provider) =>
              provider.available &&
              provider.verified,
          ) ?? PARTNERS[0]

        const assigned =
          matchingProvider ??
          fallbackProvider

        if (assigned) {
          assignedProviders[group.serviceId] =
            assigned
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

      if (
        paymentDetails.status ===
        'paid'
      ) {
        addNotification({
          title:
            'Payment Successful',
          message: `Payment for booking ${orderId} has been received successfully.`,
          type: 'payment',
          audience: 'customer',
          orderId,
        })
      } else {
        addNotification({
          title:
            'Payment Pending',
          message:
            'Cash on Delivery has been selected. Payment will remain pending until collection.',
          type: 'payment',
          audience: 'customer',
          orderId,
        })
      }

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
    ])

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

      placeOrder,
      advanceStatus,
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
      placeOrder,
      advanceStatus,
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