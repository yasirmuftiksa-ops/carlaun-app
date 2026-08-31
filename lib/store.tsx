'use client'

import {
  createContext,
  useCallback,
  useContext,
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
  SEED_PAST_ORDER,
} from './data'
import type {
  Address,
  CareLevel,
  CareSelection,
  CartLine,
  Coupon,
  Order,
  OrderStatus,
  Partner,
  View,
} from './types'

const DELIVERY_FEE = 40

export interface Toast {
  id: number
  message: string
  variant: 'success' | 'error' | 'info'
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
  // navigation
  view: View
  navigate: (view: View) => void
  back: () => void

  // cart
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

  // pricing
  subtotal: number
  delivery: number
  discount: number
  total: number

  // coupon
  coupon: Coupon | null
  couponError: string | null
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void

  // provider selection
  selectedProvider: Partner | null
  setSelectedProvider: (provider: Partner | null) => void

  // checkout
  address: Address
  setAddress: (a: Address) => void
  pickupDate: string
  setPickupDate: (d: string) => void
  pickupSlot: string
  setPickupSlot: (s: string) => void
  payment: string
  setPayment: (p: string) => void

  // location
  location: string
  setLocation: (l: string) => void

  // orders
  orders: Order[]
  placeOrder: () => Order
  advanceStatus: (orderId: string, status: OrderStatus) => void
  reorder: (orderId: string) => void
  getOrder: (id: string) => Order | undefined

  // toasts
  toasts: Toast[]
  toast: (message: string, variant?: Toast['variant']) => void
  dismissToast: (id: number) => void
}

const StoreContext = createContext<StoreValue | null>(null)

function linePrice(unitPrice: number, care: CareLevel) {
  return Math.round(
    unitPrice * (care === 'express' ? EXPRESS_MULTIPLIER : 1),
  )
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<View[]>([{ name: 'home' }])
  const view = history[history.length - 1]

  const [cart, setCart] = useState<CartLine[]>([])
  const [care, setCareState] = useState<CareSelection>({})
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  const [address, setAddress] = useState<Address>(ADDRESSES[1])
  const [pickupDate, setPickupDate] = useState('Today')
  const [pickupSlot, setPickupSlot] = useState('')
  const [payment, setPayment] = useState('')

  // Provider selection
  const [selectedProvider, setSelectedProvider] =
    useState<Partner | null>(PARTNERS[0] ?? null)

  const [location, setLocation] = useState('Chennai')
  const [orders, setOrders] = useState<Order[]>([SEED_PAST_ORDER])
  const [toasts, setToasts] = useState<Toast[]>([])

  const navigate = useCallback((next: View) => {
    setHistory((h) => [...h, next])

    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'auto',
      })
    }
  }, [])

  const back = useCallback(() => {
    setHistory((h) =>
      h.length > 1 ? h.slice(0, -1) : h,
    )

    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'auto',
      })
    }
  }, [])

  const toast = useCallback(
    (
      message: string,
      variant: Toast['variant'] = 'success',
    ) => {
      const id = Date.now() + Math.random()

      setToasts((t) => [
        ...t,
        {
          id,
          message,
          variant,
        },
      ])

      setTimeout(() => {
        setToasts((t) =>
          t.filter((x) => x.id !== id),
        )
      }, 2600)
    },
    [],
  )

  const dismissToast = useCallback((id: number) => {
    setToasts((t) =>
      t.filter((x) => x.id !== id),
    )
  }, [])

  const setCare = useCallback(
    (serviceId: string, level: CareLevel) => {
      setCareState((c) => ({
        ...c,
        [serviceId]: level,
      }))
    },
    [],
  )

  const getQty = useCallback(
    (serviceId: string, itemId: string) =>
      cart.find(
        (l) =>
          l.serviceId === serviceId &&
          l.itemId === itemId,
      )?.qty ?? 0,
    [cart],
  )

  const setQty = useCallback(
    (
      serviceId: string,
      itemId: string,
      qty: number,
    ) => {
      setCart((c) => {
        const existing = c.find(
          (l) =>
            l.serviceId === serviceId &&
            l.itemId === itemId,
        )

        if (qty <= 0) {
          return c.filter(
            (l) =>
              !(
                l.serviceId === serviceId &&
                l.itemId === itemId
              ),
          )
        }

        if (existing) {
          return c.map((l) =>
            l.serviceId === serviceId &&
            l.itemId === itemId
              ? { ...l, qty }
              : l,
          )
        }

        return [
          ...c,
          {
            serviceId,
            itemId,
            qty,
          },
        ]
      })

      setCareState((cs) =>
        cs[serviceId]
          ? cs
          : {
              ...cs,
              [serviceId]: 'standard',
            },
      )
    },
    [],
  )

  const addItem = useCallback(
    (serviceId: string, itemId: string) => {
      const current =
        cart.find(
          (l) =>
            l.serviceId === serviceId &&
            l.itemId === itemId,
        )?.qty ?? 0

      setQty(
        serviceId,
        itemId,
        current + 1,
      )
    },
    [cart, setQty],
  )

  const removeItem = useCallback(
    (serviceId: string, itemId: string) => {
      const current =
        cart.find(
          (l) =>
            l.serviceId === serviceId &&
            l.itemId === itemId,
        )?.qty ?? 0

      setQty(
        serviceId,
        itemId,
        current - 1,
      )
    },
    [cart, setQty],
  )

  const clearCart = useCallback(() => {
    setCart([])
    setCareState({})
    setCoupon(null)
    setCouponError(null)
    setSelectedProvider(null)
  }, [])

  const groups = useMemo<ServiceGroup[]>(() => {
    const map = new Map<
      string,
      ServiceGroup
    >()

    for (const line of cart) {
      const service = getService(
        line.serviceId,
      )

      const item = getItem(
        line.serviceId,
        line.itemId,
      )

      if (!service || !item) continue

      const level =
        care[line.serviceId] ??
        'standard'

      const unitPrice = linePrice(
        item.price,
        level,
      )

      if (!map.has(line.serviceId)) {
        map.set(line.serviceId, {
          serviceId: line.serviceId,
          serviceName: service.name,
          care: level,
          lines: [],
          itemCount: 0,
          amount: 0,
        })
      }

      const group =
        map.get(line.serviceId)!

      group.lines.push({
        itemId: line.itemId,
        name: item.name,
        unit: item.unit,
        qty: line.qty,
        unitPrice,
      })

      group.itemCount += line.qty
      group.amount +=
        unitPrice * line.qty
    }

    return Array.from(map.values())
  }, [cart, care])

  const totalItems = useMemo(
    () =>
      cart.reduce(
        (n, l) => n + l.qty,
        0,
      ),
    [cart],
  )

  const subtotal = useMemo(
    () =>
      groups.reduce(
        (s, g) => s + g.amount,
        0,
      ),
    [groups],
  )

  const discount = useMemo(() => {
    if (!coupon || subtotal === 0) {
      return 0
    }

    if (coupon.type === 'freeDelivery') {
      return 0
    }

    if (coupon.type === 'percent') {
      const raw = Math.round(
        (subtotal * coupon.value) / 100,
      )

      return coupon.cap
        ? Math.min(raw, coupon.cap)
        : raw
    }

    if (coupon.type === 'flat') {
      if (coupon.serviceId) {
        const group = groups.find(
          (x) =>
            x.serviceId ===
            coupon.serviceId,
        )

        if (!group) return 0

        return Math.min(
          coupon.value,
          group.amount,
        )
      }

      return Math.min(
        coupon.value,
        subtotal,
      )
    }

    return 0
  }, [coupon, subtotal, groups])

  const delivery = useMemo(() => {
    if (subtotal === 0) {
      return 0
    }

    if (
      coupon?.type ===
      'freeDelivery'
    ) {
      return 0
    }

    return DELIVERY_FEE
  }, [subtotal, coupon])

  const total = Math.max(
    0,
    subtotal +
      delivery -
      discount,
  )

  const applyCoupon = useCallback(
    (code: string) => {
      const clean =
        code.trim().toUpperCase()

      const found = COUPONS[clean]

      if (!found) {
        setCouponError(
          'This coupon code is not valid.',
        )
        setCoupon(null)
        return false
      }

      if (
        found.serviceId &&
        !cart.some(
          (l) =>
            l.serviceId ===
            found.serviceId,
        )
      ) {
        const service = getService(
          found.serviceId,
        )

        setCouponError(
          `Add a ${service?.name} item to use ${clean}.`,
        )

        setCoupon(null)
        return false
      }

      setCoupon(found)
      setCouponError(null)

      return true
    },
    [cart],
  )

  const removeCoupon = useCallback(() => {
    setCoupon(null)
    setCouponError(null)
  }, [])

  const getOrder = useCallback(
    (id: string) =>
      orders.find(
        (o) => o.id === id,
      ),
    [orders],
  )

  const placeOrder = useCallback(
    (): Order => {
      const id =
        'CLN' +
        Math.floor(
          10000 +
            Math.random() *
              89999,
        )

      const order: Order = {
        id,
        createdAt: Date.now(),
        status: 'scheduled',

        // Save selected provider
        providerId:
          selectedProvider?.id,

        services: groups.map(
          (g) => ({
            serviceId:
              g.serviceId,
            serviceName:
              g.serviceName,
            itemCount:
              g.itemCount,
            amount: g.amount,
          }),
        ),

        lines: [...cart],
        care: { ...care },
        address,
        pickupDate,
        pickupSlot:
          pickupSlot ||
          '6–8 PM',
        payment:
          payment || 'UPI',
        subtotal,
        delivery,
        discount,
        total,
        couponCode:
          coupon?.code,
      }

      setOrders((o) => [
        order,
        ...o,
      ])

      setCart([])
      setCareState({})
      setCoupon(null)
      setCouponError(null)
      setPickupSlot('')
      setPayment('')

      return order
    },
    [
      groups,
      cart,
      care,
      address,
      pickupDate,
      pickupSlot,
      payment,
      subtotal,
      delivery,
      discount,
      total,
      coupon,
      selectedProvider,
    ],
  )

  const advanceStatus = useCallback(
    (
      orderId: string,
      status: OrderStatus,
    ) => {
      setOrders((o) =>
        o.map((x) =>
          x.id === orderId
            ? {
                ...x,
                status,
              }
            : x,
        ),
      )
    },
    [],
  )

  const reorder = useCallback(
    (orderId: string) => {
      const order =
        orders.find(
          (o) => o.id === orderId,
        )

      if (!order) return

      setCart((c) => {
        const next = [...c]

        for (const line of order.lines) {
          const existing =
            next.find(
              (l) =>
                l.serviceId ===
                  line.serviceId &&
                l.itemId ===
                  line.itemId,
            )

          if (existing) {
            existing.qty += line.qty
          } else {
            next.push({
              ...line,
            })
          }
        }

        return next
      })

      setCareState((cs) => ({
        ...order.care,
        ...cs,
      }))

      // Restore provider on reorder
      const provider =
        PARTNERS.find(
          (p) =>
            p.id ===
            order.providerId,
        )

      if (provider) {
        setSelectedProvider(
          provider,
        )
      }
    },
    [orders],
  )

  const value: StoreValue = {
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

    selectedProvider,
    setSelectedProvider,

    address,
    setAddress,
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

    toasts,
    toast,
    dismissToast,
  }

  return (
    <StoreContext.Provider
      value={value}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx =
    useContext(StoreContext)

  if (!ctx) {
    throw new Error(
      'useStore must be used within StoreProvider',
    )
  }

  return ctx
}

export { ORDER_STATUS_STEPS }