'use client'

import { motion } from 'framer-motion'
import { Info, ShieldCheck, Star, MapPin } from 'lucide-react'
import { getService, PARTNERS } from '@/lib/data'
import { EXPRESS_MULTIPLIER } from '@/lib/data'
import { rupees } from '@/lib/format'
import { Icon } from '@/lib/icons'
import { useStore } from '@/lib/store'
import { BagBar } from '@/components/bag-bar'
import { QuantityStepper } from '@/components/quantity-stepper'
import { ScreenHeader } from '@/components/screen-header'

export function ServiceDetailScreen({ serviceId }: { serviceId: string }) {
  const {
    getQty,
    addItem,
    removeItem,
    setQty,
    care,
    setCare,
    toast,
  } = useStore()

  const service = getService(serviceId)

  if (!service) return null

  const level = care[service.id] ?? 'standard'
  const isExpress = level === 'express'

  const recommendedProviders = PARTNERS
    .filter((partner) => {
      const serviceName = service.name.toLowerCase()

      return partner.services
        .toLowerCase()
        .split('•')
        .some((item) => serviceName.includes(item.trim().split(' ')[0]))
    })
    .sort((a, b) => {
      if (a.available !== b.available) {
        return a.available ? -1 : 1
      }

      return b.rating - a.rating
    })
    .slice(0, 3)

  return (
    <div className="min-h-dvh bg-background pb-28">
      <ScreenHeader title={service.name} />

      {/* Service intro */}
      <div className="border-b border-border bg-card px-4 py-6">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-card"
            style={{ backgroundColor: service.accent }}
          >
            <Icon name={service.icon} className="h-7 w-7" />
          </div>

          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {service.name}
            </h1>

            <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          </div>
        </div>

        {/* Care toggle */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Care Level
          </p>

          <div className="relative grid grid-cols-2 gap-1 rounded-2xl bg-secondary p-1">
            <button
              onClick={() => setCare(service.id, 'standard')}
              className="relative z-10 rounded-xl py-2.5 text-sm font-semibold transition-colors"
              style={{
                color: isExpress
                  ? 'var(--muted-foreground)'
                  : 'var(--card)',
              }}
            >
              {!isExpress && (
                <motion.span
                  layoutId={`care-${service.id}`}
                  className="absolute inset-0 -z-10 rounded-xl bg-foreground"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 32,
                  }}
                />
              )}

              Standard
            </button>

            <button
              onClick={() => setCare(service.id, 'express')}
              className="relative z-10 rounded-xl py-2.5 text-sm font-semibold transition-colors"
              style={{
                color: isExpress
                  ? 'var(--card)'
                  : 'var(--muted-foreground)',
              }}
            >
              {isExpress && (
                <motion.span
                  layoutId={`care-${service.id}`}
                  className="absolute inset-0 -z-10 rounded-xl bg-primary"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 32,
                  }}
                />
              )}

              Express (+{Math.round((EXPRESS_MULTIPLIER - 1) * 100)}%)
            </button>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />

            <span>
              {isExpress
                ? 'Express: same-day priority handling.'
                : 'Standard: 24–48 hour turnaround.'}
            </span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="px-4 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Select Items
        </p>

        <div className="space-y-2.5">
          {service.items.map((item, i) => {
            const qty = getQty(service.id, item.id)

            const price = Math.round(
              item.price *
                (isExpress ? EXPRESS_MULTIPLIER : 1),
            )

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center justify-between rounded-2xl border bg-card px-4 py-3.5 transition-colors ${
                  qty > 0
                    ? 'border-primary/40'
                    : 'border-border'
                }`}
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {item.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {rupees(price)}{' '}
                    <span className="text-xs">
                      / {item.unit}
                    </span>
                  </p>
                </div>

                <QuantityStepper
                  qty={qty}
                  onAdd={() => {
                    addItem(service.id, item.id)

                    if (qty === 0) {
                      toast(
                        `${item.name} added to CARLAUN Bag`,
                      )
                    }
                  }}
                  onRemove={() =>
                    removeItem(service.id, item.id)
                  }
                  onSet={(n) =>
                    setQty(service.id, item.id, n)
                  }
                />
              </motion.div>
            )
          })}
        </div>

        <p className="mt-5 text-pretty text-center text-xs leading-relaxed text-muted-foreground">
          Add items from other services too — they all travel in one
          CARLAUN Bag, picked up together in a single trip.
        </p>

        {/* Recommended Providers */}
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recommended Providers
            </p>

            <span className="text-[10px] font-medium text-primary">
              Smart Match
            </span>
          </div>

          {recommendedProviders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-5 text-center">
              <p className="text-sm font-medium text-foreground">
                No matching providers found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                We're working to connect more local providers.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recommendedProviders.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <div className="flex items-start gap-3">
                    {/* Provider avatar */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">
                      {partner.name
                        .split(' ')
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join('')}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate font-semibold text-foreground">
                          {partner.name}
                        </p>

                        {partner.verified && (
                          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-primary" />
                          {partner.rating}
                        </span>

                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {partner.distance}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {partner.turnaround}
                      </p>
                    </div>

                    {/* Availability */}
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                        partner.available
                          ? 'bg-success/12 text-success'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {partner.available
                        ? 'Available'
                        : 'Busy'}
                    </span>
                  </div>

                  {/* Provider details */}
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>
                      {partner.experience} yrs experience
                    </span>

                    <span>•</span>

                    <span>
                      {partner.completedJobs} jobs
                    </span>

                    <span>•</span>

                    <span>
                      {partner.serviceArea}
                    </span>
                  </div>

                  {/* Select Provider */}
                  <button
                    disabled={!partner.available}
                    onClick={() => {
                      toast(
                        `${partner.name} selected for ${service.name}`,
                        'info',
                      )
                    }}
                    className="mt-3 w-full rounded-full bg-foreground py-2.5 text-xs font-semibold text-card transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {partner.available
                      ? 'Select Provider'
                      : 'Currently Busy'}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BagBar />
    </div>
  )
}