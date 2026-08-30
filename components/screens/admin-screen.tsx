'use client'

import { motion } from 'framer-motion'
import {
  Activity,
  IndianRupee,
  PackageCheck,
  Settings,
  Users,
} from 'lucide-react'
import { PARTNERS, SERVICES } from '@/lib/data'
import { rupees } from '@/lib/format'
import { useStore } from '@/lib/store'
import { ORDER_STATUS_STEPS } from '@/lib/store'
import { ScreenHeader } from '@/components/screen-header'

export function AdminScreen() {
  const { orders, navigate, toast } = useStore()

  const revenue = orders.reduce((s, o) => s + o.total, 0)
  const activeCount = orders.filter((o) => o.status !== 'delivered').length

  // count of items per service across all orders
  const serviceCounts = SERVICES.map((s) => {
    const count = orders.reduce(
      (n, o) =>
        n + o.services.filter((x) => x.serviceId === s.id).reduce((m, x) => m + x.itemCount, 0),
      0,
    )
    return { ...s, count }
  }).sort((a, b) => b.count - a.count)
  const maxCount = Math.max(1, ...serviceCounts.map((s) => s.count))

  return (
    <div className="min-h-dvh bg-background pb-24">
      <ScreenHeader title="Admin Dashboard" subtitle="CARLAUN platform overview · Demo" />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 px-4 py-4 sm:grid-cols-4">
        <Kpi label="Total Orders" value={String(orders.length)} icon={PackageCheck} />
        <Kpi label="Active" value={String(activeCount)} icon={Activity} />
        <Kpi label="Revenue" value={rupees(revenue)} icon={IndianRupee} />
        <Kpi label="Partners" value={String(PARTNERS.length)} icon={Users} />
      </div>

      {/* Orders table */}
      <div className="px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          All Orders
        </p>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="hidden grid-cols-4 gap-2 border-b border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
            <span>Order</span>
            <span>Date</span>
            <span>Status</span>
            <span className="text-right">Total</span>
          </div>
          <div className="divide-y divide-border">
            {orders.map((order, i) => {
              const stepIdx = ORDER_STATUS_STEPS.findIndex((s) => s.id === order.status)
              return (
                <motion.button
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate({ name: 'tracking', orderId: order.id })}
                  className="grid w-full grid-cols-2 gap-1 px-4 py-3 text-left sm:grid-cols-4 sm:items-center"
                >
                  <span className="font-mono text-sm font-bold text-foreground">
                    #{order.id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {order.pickupDate}
                  </span>
                  <span
                    className={`col-span-1 inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      order.status === 'delivered'
                        ? 'bg-primary/12 text-primary'
                        : 'bg-accent/12 text-accent'
                    }`}
                  >
                    {ORDER_STATUS_STEPS[stepIdx]?.label}
                  </span>
                  <span className="text-right font-display text-sm font-bold text-foreground">
                    {rupees(order.total)}
                  </span>
                </motion.button>
              )
            })}
            {orders.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No orders yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service demand */}
      <div className="px-4 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Service Demand
        </p>
        <div className="space-y-2.5 rounded-2xl border border-border bg-card p-4">
          {serviceCounts.map((s) => (
            <div key={s.id}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{s.name}</span>
                <span className="text-muted-foreground">{s.count} items</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: s.accent }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(s.count / maxCount) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partners list */}
      <div className="px-4 pb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Care Partners
        </p>
        <div className="space-y-2">
          {PARTNERS.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-display text-sm font-extrabold text-primary">
                {p.name.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">{p.services}</p>
              </div>
              <button
                onClick={() => toast(`${p.name}: ${p.turnaround}`, 'info')}
                className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                <Settings className="h-3.5 w-3.5" />
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Kpi({
  label,
  value,
  icon: IconCmp,
}: {
  label: string
  value: string
  icon: typeof Activity
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <IconCmp className="h-4.5 w-4.5" />
      </span>
      <p className="mt-2.5 font-display text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
