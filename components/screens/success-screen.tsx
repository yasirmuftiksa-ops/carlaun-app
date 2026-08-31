'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, MapPin, Truck } from 'lucide-react'
import { rupees } from '@/lib/format'
import { useStore } from '@/lib/store'

export function SuccessScreen({ orderId }: { orderId: string }) {
  const { getOrder, navigate } = useStore()
  const order = getOrder(orderId)

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }, [])

  if (!order) return null

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16 }}
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary"
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-primary/25"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 300 }}
          >
            <Check className="h-11 w-11 text-primary-foreground" strokeWidth={3} />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground"
        >
          Pickup Scheduled!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="mt-1.5 text-pretty text-sm text-muted-foreground"
        >
          Your CARLAUN partner will collect everything in a single trip.
        </motion.p>

        {/* Order card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-7 w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Order ID
            </span>
            <span className="font-mono text-sm font-bold text-foreground">#{order.id}</span>
          </div>
          <div className="my-4 border-t border-dashed border-border" />

          <div className="flex items-start gap-3">
            <Truck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {order.pickupDate} · {order.pickupSlot}
              </p>
              <p className="text-xs text-muted-foreground">Estimated pickup window</p>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-3">
            <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">{order.address.label}</p>
              <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
                {order.address.line}
              </p>
            </div>
          </div>

          <div className="my-4 border-t border-dashed border-border" />
          <div className="flex flex-wrap gap-1.5">
            {order.services.map((s) => (
              <span
                key={s.serviceId}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground"
              >
                {s.serviceName} · {s.itemCount}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Paid</span>
            <span className="font-display text-lg font-bold text-foreground">
              {rupees(order.total)}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 space-y-2.5 border-t border-border bg-card/95 px-4 py-4 backdrop-blur">
        <button
          onClick={() => navigate({ name: 'tracking', orderId: order.id })}
          className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
        >
          Track Order
        </button>
        <button
          onClick={() => navigate({ name: 'home' })}
          className="w-full rounded-full border border-border py-3.5 text-sm font-semibold text-foreground"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
