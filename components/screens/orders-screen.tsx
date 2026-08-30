'use client'

import { motion } from 'framer-motion'
import { PackageCheck, RotateCcw, ShoppingBag } from 'lucide-react'
import { ORDER_STATUS_STEPS } from '@/lib/data'
import { rupees } from '@/lib/format'
import { useStore } from '@/lib/store'
import { ScreenHeader } from '@/components/screen-header'

function statusLabel(id: string) {
  return ORDER_STATUS_STEPS.find((s) => s.id === id)?.label ?? id
}

export function OrdersScreen() {
  const { orders, navigate, reorder, toast } = useStore()

  return (
    <div className="min-h-dvh bg-background pb-24">
      <ScreenHeader title="My Orders" showBack={false} />

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary">
            <ShoppingBag className="h-9 w-9 text-muted-foreground" />
          </div>
          <h2 className="mt-5 font-display text-xl font-bold text-foreground">
            No orders yet
          </h2>
          <button
            onClick={() => navigate({ name: 'home' })}
            className="mt-6 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-card"
          >
            Schedule a Pickup
          </button>
        </div>
      ) : (
        <div className="space-y-3 px-4 py-4">
          {orders.map((order, i) => {
            const delivered = order.status === 'delivered'
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        delivered ? 'bg-primary/12 text-primary' : 'bg-accent/12 text-accent'
                      }`}
                    >
                      <PackageCheck className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-bold text-foreground">
                        #{order.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.pickupDate} · {order.pickupSlot}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      delivered ? 'bg-primary/12 text-primary' : 'bg-accent/12 text-accent'
                    }`}
                  >
                    {statusLabel(order.status)}
                  </span>
                </div>

                <div className="px-4 py-3">
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

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display font-bold text-foreground">
                      {rupees(order.total)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          reorder(order.id)
                          navigate({ name: 'bag' })
                          toast('Items added to CARLAUN Bag')
                        }}
                        className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-xs font-semibold text-foreground"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Reorder
                      </button>
                      <button
                        onClick={() => navigate({ name: 'tracking', orderId: order.id })}
                        className="rounded-full bg-foreground px-3.5 py-2 text-xs font-semibold text-card"
                      >
                        Track
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
