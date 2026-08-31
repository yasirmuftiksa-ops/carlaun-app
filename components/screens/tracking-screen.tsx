'use client'

import { motion } from 'framer-motion'
import { Check, Headphones, MapPin, Phone } from 'lucide-react'
import { getItem, ORDER_STATUS_STEPS } from '@/lib/data'
import { rupees } from '@/lib/format'
import { useStore } from '@/lib/store'
import { ScreenHeader } from '@/components/screen-header'

export function TrackingScreen({ orderId }: { orderId: string }) {
  const { getOrder, advanceStatus, toast } = useStore()
  const order = getOrder(orderId)

  if (!order) return null

  const currentIndex = ORDER_STATUS_STEPS.findIndex((s) => s.id === order.status)
  const isDelivered = order.status === 'delivered'

  function simulateNext() {
    const next = ORDER_STATUS_STEPS[currentIndex + 1]
    if (next) {
      advanceStatus(order!.id, next.id as never)
      toast(`Status: ${next.label}`, 'info')
    }
  }

  return (
    <div className="min-h-dvh bg-background pb-28">
      <ScreenHeader title="Track Order" />

      {/* Header card */}
      <div className="border-b border-border bg-card px-4 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Order
            </p>
            <p className="font-mono text-lg font-bold text-foreground">#{order.id}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              isDelivered
                ? 'bg-primary/12 text-primary'
                : 'bg-accent/12 text-accent'
            }`}
          >
            {ORDER_STATUS_STEPS[currentIndex]?.label}
          </span>
        </div>
        <div className="mt-3 flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
            {order.address.line}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 py-6">
        <div className="relative pl-2">
          {ORDER_STATUS_STEPS.map((step, i) => {
            const done = i <= currentIndex
            const active = i === currentIndex
            const last = i === ORDER_STATUS_STEPS.length - 1
            return (
              <div key={step.id} className="relative flex gap-4 pb-7 last:pb-0">
                {/* connector */}
                {!last && (
                  <div className="absolute left-[13px] top-7 h-full w-0.5 bg-border">
                    <motion.div
                      className="w-full bg-primary"
                      initial={{ height: 0 }}
                      animate={{ height: i < currentIndex ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
                {/* dot */}
                <div className="relative z-10">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: done ? 'var(--primary)' : 'var(--card)',
                      borderColor: done ? 'var(--primary)' : 'var(--border)',
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2"
                  >
                    {done ? (
                      <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-border" />
                    )}
                    {active && !isDelivered && (
                      <motion.span
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6 }}
                      />
                    )}
                  </motion.div>
                </div>
                <div className="pt-0.5">
                  <p
                    className={`text-sm font-semibold ${
                      done ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </p>
                  {active && (
                    <p className="text-xs text-primary">In progress</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Partner card */}
      <div className="mx-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary font-display font-bold text-foreground">
          R
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Ravi K.</p>
          <p className="text-xs text-muted-foreground">Your CARLAUN partner · FreshCare</p>
        </div>
        <button
          onClick={() => toast('Calling partner…', 'info')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
          aria-label="Call partner"
        >
          <Phone className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Items */}
      <div className="mx-4 mt-4 rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Items in this pickup
        </p>
        <div className="space-y-2">
          {order.lines.map((line) => {
            const item = getItem(line.serviceId, line.itemId)
            return (
              <div key={`${line.serviceId}-${line.itemId}`} className="flex justify-between text-sm">
                <span className="text-foreground">{item?.name}</span>
                <span className="text-muted-foreground">× {line.qty}</span>
              </div>
            )
          })}
          <div className="mt-2 flex justify-between border-t border-dashed border-border pt-2 text-sm">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-foreground">{rupees(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Demo controls */}
      <div className="mx-4 mt-4 rounded-2xl border border-dashed border-border bg-secondary/40 p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Headphones className="h-3.5 w-3.5" /> Demo control
        </p>
        <button
          onClick={simulateNext}
          disabled={isDelivered}
          className="mt-2 w-full rounded-full bg-foreground py-3 text-sm font-semibold text-card disabled:opacity-40"
        >
          {isDelivered ? 'Order Delivered' : 'Advance to Next Status'}
        </button>
      </div>
    </div>
  )
}
