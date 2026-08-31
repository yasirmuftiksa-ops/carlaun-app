'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CircleCheck as CheckCircle2,
  Clock,
  PackageCheck,
  ShieldCheck,
  Star,
  Truck,
  MapPin,
  BriefcaseBusiness,
} from 'lucide-react'
import { PARTNERS } from '@/lib/data'
import { rupees } from '@/lib/format'
import { useStore } from '@/lib/store'
import { ScreenHeader } from '@/components/screen-header'
import { ORDER_STATUS_STEPS } from '@/lib/store'

export function ProviderScreen() {
  const { orders, advanceStatus, toast, navigate } = useStore()

  const provider = PARTNERS[0]

  const [available, setAvailable] = useState(provider.available)

  const active = orders.filter((o) => o.status !== 'delivered')
  const completed = orders.filter((o) => o.status === 'delivered')

  const totalEarnings =
    orders.reduce((s, o) => s + o.total, 0) + provider.earnings

  return (
    <div className="min-h-dvh bg-background pb-24">
      <ScreenHeader
        title="Provider Dashboard"
        subtitle="CARLAUN · Cooperative partner view"
      />

      {/* Provider Summary */}
      <div className="px-4 py-4">
        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary font-display text-lg font-extrabold text-primary-foreground">
              Fr
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-lg font-bold text-foreground">
                  {provider.name}
                </h1>

                {provider.verified && (
                  <ShieldCheck className="h-4 w-4 text-primary" />
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                {provider.services}
              </p>
            </div>

            <span className="flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 text-sm font-bold text-success">
              <Star className="size-3.5 fill-current" />
              {provider.rating}
            </span>
          </div>

          {/* Verification + Availability */}
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-secondary/60 p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />

              <div>
                <p className="text-xs font-semibold text-foreground">
                  Verified Provider
                </p>

                <p className="text-[11px] text-muted-foreground">
                  Trusted CARLAUN partner
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setAvailable(!available)
                toast(
                  !available
                    ? 'You are now available for new jobs'
                    : 'You are now marked busy',
                  'info',
                )
              }}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                available
                  ? 'bg-success/12 text-success'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  available ? 'bg-success' : 'bg-muted-foreground'
                }`}
              />

              {available ? 'Available' : 'Busy'}
            </button>
          </div>
        </div>
      </div>

      {/* Provider Details */}
      <div className="grid grid-cols-2 gap-2 px-4">
        <InfoCard
          icon={BriefcaseBusiness}
          label="Experience"
          value={`${provider.experience} years`}
        />

        <InfoCard
          icon={MapPin}
          label="Service Area"
          value={provider.serviceArea}
        />

        <InfoCard
          icon={CheckCircle2}
          label="Jobs Completed"
          value={String(provider.completedJobs)}
        />

        <InfoCard
          icon={Star}
          label="Customer Rating"
          value={`${provider.rating} / 5`}
        />
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2 px-4">
        <Stat label="Active" value={String(active.length)} icon={Clock} />

        <Stat
          label="Completed"
          value={String(completed.length)}
          icon={CheckCircle2}
        />

        <Stat
          label="Earnings"
          value={rupees(totalEarnings)}
          icon={PackageCheck}
        />
      </div>

      {/* Cooperative Earnings */}
      <div className="px-4 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Cooperative Earnings
        </p>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                Total earnings
              </p>

              <p className="mt-1 font-display text-2xl font-bold text-foreground">
                {rupees(provider.earnings)}
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 px-3 py-2 text-right">
              <p className="text-[11px] text-muted-foreground">
                Completed jobs
              </p>

              <p className="font-display text-lg font-bold text-foreground">
                {provider.completedJobs}
              </p>
            </div>
          </div>

          <div className="mt-3 border-t border-dashed border-border pt-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              CARLAUN supports transparent earnings for cooperative service
              providers.
            </p>
          </div>
        </div>
      </div>

      {/* Active Jobs */}
      <div className="px-4">
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
                            navigate({
                              name: 'tracking',
                              orderId: order.id,
                            })
                          }
                          className="rounded-full border border-border px-3.5 py-2 text-xs font-semibold text-foreground"
                        >
                          Track
                        </button>

                        {next ? (
                          <button
                            onClick={() => {
                              advanceStatus(
                                order.id,
                                next.id as never,
                              )

                              toast(
                                `Marked: ${next.label}`,
                                'info',
                              )
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
        <div className="px-4 pt-4">
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

function InfoCard({
  icon: IconCmp,
  label,
  value,
}: {
  icon: typeof MapPin
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <IconCmp className="h-4 w-4 text-primary" />

      <p className="mt-2 text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-bold text-foreground">
        {value}
      </p>
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

      <p className="mt-1.5 font-display text-lg font-bold text-foreground">
        {value}
      </p>

      <p className="text-xs text-muted-foreground">
        {label}
      </p>
    </div>
  )
}