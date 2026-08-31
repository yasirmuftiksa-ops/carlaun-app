'use client'

import { motion } from 'framer-motion'
import { CircleCheck as CheckCircle2, Clock, PackageCheck, Star, Truck } from 'lucide-react'
import { PARTNERS } from '@/lib/data'
import { rupees } from '@/lib/format'
import { useStore } from '@/lib/store'
import { ScreenHeader } from '@/components/screen-header'
import { ORDER_STATUS_STEPS } from '@/lib/store'

export function ProviderScreen() {
  const { orders, advanceStatus, toast, navigate } = useStore()

  const active = orders.filter((o) => o.status !== 'delivered')
  const completed = orders.filter((o) => o.status === 'delivered')

  return (
    <div className="min-h-dvh bg-background pb-24">
      <ScreenHeader title="Provider Dashboard" subtitle="FreshCare · Demo partner view" />

      {/* Partner summary */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary font-display text-lg font-extrabold text-primary-foreground">
            Fr
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-lg font-bold text-foreground">FreshCare</h1>
            <p className="text-sm text-muted-foreground">
              {PARTNERS[0].services} · {PARTNERS[0].distance}
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 text-sm font-bold text-success">
            <Star className="size-3.5 fill-current" />
            {PARTNERS[0].rating}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-4">
        <Stat label="Active" value={String(active.length)} icon={Clock} />
        <Stat label="Completed" value={String(completed.length)} icon={CheckCircle2} />
        <Stat
          label="Earnings"
          value={rupees(orders.reduce((s, o) => s + o.total, 0))}
          icon={PackageCheck}
        />
      </div>

      {/* Active jobs */}
      <div className="px-4 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Active Jobs
        </p>
        {active.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-6 text-center">
            <Truck className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No active jobs right now.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {active.map((order, i) => {
              const currentIndex = ORDER_STATUS_STEPS.findIndex(
                (s) => s.id === order.status,
              )
              const next = ORDER_STATUS_STEPS[currentIndex + 1]
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div>
                      <p className="font-mono text-sm font-bold text-foreground">
                        #{order.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.pickupDate} · {order.pickupSlot}
                      </p>
                    </div>
                    <span className="rounded-full bg-accent/12 px-2.5 py-1 text-xs font-bold text-accent">
                      {ORDER_STATUS_STEPS[currentIndex]?.label}
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
                          onClick={() =>
                            navigate({ name: 'tracking', orderId: order.id })
                          }
                          className="rounded-full border border-border px-3.5 py-2 text-xs font-semibold text-foreground"
                        >
                          Track
                        </button>
                        {next ? (
                          <button
                            onClick={() => {
                              advanceStatus(order.id, next.id as never)
                              toast(`Marked: ${next.label}`, 'info')
                            }}
                            className="rounded-full bg-foreground px-3.5 py-2 text-xs font-semibold text-card"
                          >
                            Advance
                          </button>
                        ) : (
                          <span className="rounded-full bg-success/12 px-3.5 py-2 text-xs font-bold text-success">
                            Done
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div className="px-4 pb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Completed
          </p>
          <div className="space-y-2">
            {completed.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="font-mono text-sm font-bold text-foreground">
                    #{order.id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.pickupDate} · {order.pickupSlot}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-bold text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  {rupees(order.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({
  label,
  value,
  icon: IconCmp,
}: {
  label: string
  value: string
  icon: typeof Clock
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <IconCmp className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1.5 font-display text-lg font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
