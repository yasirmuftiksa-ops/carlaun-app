'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ShoppingBag, Tag, X } from 'lucide-react'
import { getItem, getService, OFFERS } from '@/lib/data'
import { rupees } from '@/lib/format'
import { Icon } from '@/lib/icons'
import { useStore } from '@/lib/store'
import { QuantityStepper } from '@/components/quantity-stepper'
import { ScreenHeader } from '@/components/screen-header'

export function BagScreen() {
  const {
    groups,
    setQty,
    subtotal,
    delivery,
    discount,
    total,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    navigate,
    totalItems,
    setCare,
  } = useStore()
  const [code, setCode] = useState('')

  if (totalItems === 0) {
    return (
      <div className="min-h-dvh bg-background">
        <ScreenHeader title="CARLAUN Bag" />
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary">
            <ShoppingBag className="h-9 w-9 text-muted-foreground" />
          </div>
          <h2 className="mt-5 font-display text-xl font-bold text-foreground">
            Your CARLAUN Bag is empty
          </h2>
          <p className="mt-1.5 text-pretty text-sm text-muted-foreground">
            Add items from any service — they all get picked up together.
          </p>
          <button
            onClick={() => navigate({ name: 'home' })}
            className="mt-6 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-card"
          >
            Browse Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background pb-40">
      <ScreenHeader title="CARLAUN Bag" />

      {/* Single-pickup banner */}
      <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/8 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ShoppingBag className="h-4.5 w-4.5" />
        </div>
        <p className="text-sm leading-snug text-foreground">
          <span className="font-semibold">One pickup for {groups.length}{' '}
          {groups.length === 1 ? 'service' : 'services'}.</span>{' '}
          <span className="text-muted-foreground">Everything travels together.</span>
        </p>
      </div>

      {/* Service groups */}
      <div className="space-y-4 px-4 py-4">
        {groups.map((g) => {
          const service = getService(g.serviceId)!
          return (
            <div
              key={g.serviceId}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-card"
                    style={{ backgroundColor: service.accent }}
                  >
                    <Icon name={service.icon} className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-foreground">
                      {g.serviceName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {g.itemCount} {g.itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                {/* care pill toggle */}
                <div className="flex rounded-full bg-secondary p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setCare(g.serviceId, 'standard')}
                    className={`rounded-full px-2.5 py-1 transition-colors ${
                      g.care === 'standard'
                        ? 'bg-foreground text-card'
                        : 'text-muted-foreground'
                    }`}
                  >
                    Std
                  </button>
                  <button
                    onClick={() => setCare(g.serviceId, 'express')}
                    className={`rounded-full px-2.5 py-1 transition-colors ${
                      g.care === 'express'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    Express
                  </button>
                </div>
              </div>

              <div className="divide-y divide-border">
                {g.lines.map((line) => {
                  const item = getItem(g.serviceId, line.itemId)!
                  return (
                    <div
                      key={line.itemId}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {rupees(line.unitPrice)} × {line.qty}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-foreground">
                          {rupees(line.unitPrice * line.qty)}
                        </span>
                        <QuantityStepper
                          qty={line.qty}
                          size="sm"
                          onAdd={() => setQty(g.serviceId, line.itemId, line.qty + 1)}
                          onRemove={() =>
                            setQty(g.serviceId, line.itemId, line.qty - 1)
                          }
                          onSet={(n) => setQty(g.serviceId, line.itemId, n)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Coupon */}
      <div className="px-4 pb-2">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Tag className="h-3.5 w-3.5" /> Apply Coupon
        </p>
        {coupon ? (
          <div className="flex items-center justify-between rounded-2xl border border-primary/40 bg-primary/8 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{coupon.code}</p>
                <p className="text-xs text-muted-foreground">{coupon.label}</p>
              </div>
            </div>
            <button
              onClick={() => {
                removeCoupon()
                setCode('')
              }}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
              aria-label="Remove coupon"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="h-11 flex-1 rounded-xl border border-border bg-card px-4 text-sm font-medium uppercase tracking-wide text-foreground outline-none placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground focus:border-primary"
              />
              <button
                onClick={() => applyCoupon(code)}
                disabled={!code.trim()}
                className="rounded-xl bg-foreground px-5 text-sm font-semibold text-card disabled:opacity-40"
              >
                Apply
              </button>
            </div>
            {couponError && (
              <p className="mt-2 text-xs font-medium text-destructive">{couponError}</p>
            )}
            {/* quick-pick offers */}
            <div className="mt-3 flex flex-wrap gap-2">
              {OFFERS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setCode(o.code)
                    applyCoupon(o.code)
                  }}
                  className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {o.code}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bill */}
      <div className="mx-4 mt-4 rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Bill Details
        </p>
        <div className="space-y-2 text-sm">
          <Row label="Item Total" value={rupees(subtotal)} />
          <Row label="Pickup & Delivery" value={delivery === 0 ? 'FREE' : rupees(delivery)} />
          <AnimatePresence>
            {discount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Row label={`Discount (${coupon?.code})`} value={`- ${rupees(discount)}`} accent />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="my-2 border-t border-dashed border-border" />
          <div className="flex items-center justify-between">
            <span className="font-display text-base font-bold text-foreground">
              To Pay
            </span>
            <span className="font-display text-lg font-bold text-foreground">
              {rupees(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky checkout */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0">
            <p className="font-display text-lg font-bold leading-none text-foreground">
              {rupees(total)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {totalItems} items • {groups.length} services
            </p>
          </div>
          <button
            onClick={() => navigate({ name: 'checkout' })}
            className="ml-auto flex-1 rounded-full bg-primary py-3.5 text-center text-sm font-semibold text-primary-foreground"
          >
            Schedule Pickup
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? 'font-semibold text-primary' : 'font-medium text-foreground'}>
        {value}
      </span>
    </div>
  )
}
