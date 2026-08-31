'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'
import { ADDRESSES, PAYMENT_METHODS, PICKUP_SLOTS } from '@/lib/data'
import { rupees } from '@/lib/format'
import { Icon } from '@/lib/icons'
import { useStore } from '@/lib/store'
import { ScreenHeader } from '@/components/screen-header'

const DATES = ['Today', 'Tomorrow', 'Wed, 26', 'Thu, 27']

export function CheckoutScreen() {
  const {
    address,
    setAddress,
    pickupDate,
    setPickupDate,
    pickupSlot,
    setPickupSlot,
    payment,
    setPayment,
    subtotal,
    delivery,
    discount,
    total,
    groups,
    placeOrder,
    navigate,
    toast,
  } = useStore()
  const [placing, setPlacing] = useState(false)

  const canPlace = Boolean(pickupSlot && payment)

  function handlePlace() {
    if (!canPlace) {
      toast('Pick a slot and payment method', 'error')
      return
    }
    setPlacing(true)
    setTimeout(() => {
      const order = placeOrder()
      setPlacing(false)
      navigate({ name: 'success', orderId: order.id })
    }, 900)
  }

  return (
    <div className="min-h-dvh bg-background pb-40">
      <ScreenHeader title="Schedule Pickup" />

      <div className="space-y-5 px-4 py-4">
        {/* Address */}
        <Section title="Pickup & Delivery Address">
          <div className="space-y-2">
            {ADDRESSES.map((a) => {
              const active = a.id === address.id
              return (
                <button
                  key={a.id}
                  onClick={() => setAddress(a)}
                  className={`flex w-full items-start gap-3 rounded-2xl border bg-card px-4 py-3 text-left transition-colors ${
                    active ? 'border-primary' : 'border-border'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                    }`}
                  >
                    <Icon name={a.icon} className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{a.label}</p>
                    <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
                      {a.line}
                    </p>
                  </div>
                  {active && <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />}
                </button>
              )
            })}
          </div>
        </Section>

        {/* Date */}
        <Section title="Pickup Date">
          <div className="grid grid-cols-4 gap-2">
            {DATES.map((d) => (
              <button
                key={d}
                onClick={() => setPickupDate(d)}
                className={`rounded-xl border py-2.5 text-xs font-semibold transition-colors ${
                  pickupDate === d
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </Section>

        {/* Slots */}
        <Section title="Time Slot">
          <div className="grid grid-cols-3 gap-2">
            {PICKUP_SLOTS.map((s) => (
              <button
                key={s}
                onClick={() => setPickupSlot(s)}
                className={`rounded-xl border py-2.5 text-xs font-semibold transition-colors ${
                  pickupSlot === s
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Section>

        {/* Payment */}
        <Section title="Payment Method">
          <div className="space-y-2">
            {PAYMENT_METHODS.map((p) => {
              const active = p.id === payment
              return (
                <button
                  key={p.id}
                  onClick={() => setPayment(p.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-left transition-colors ${
                    active ? 'border-primary' : 'border-border'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                    }`}
                  >
                    <Icon name={p.icon} className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.hint}</p>
                  </div>
                  <div
                    className={`h-4.5 w-4.5 rounded-full border-2 ${
                      active ? 'border-primary bg-primary' : 'border-border'
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </Section>

        {/* Summary */}
        <Section title="Order Summary">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {groups.map((g) => (
                <span
                  key={g.serviceId}
                  className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {g.serviceName} · {g.itemCount}
                </span>
              ))}
            </div>
            <div className="space-y-1.5 text-sm">
              <SummaryRow label="Item Total" value={rupees(subtotal)} />
              <SummaryRow label="Pickup & Delivery" value={delivery === 0 ? 'FREE' : rupees(delivery)} />
              {discount > 0 && <SummaryRow label="Discount" value={`- ${rupees(discount)}`} accent />}
              <div className="my-1.5 border-t border-dashed border-border" />
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-foreground">To Pay</span>
                <span className="font-display text-lg font-bold text-foreground">
                  {rupees(total)}
                </span>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Sticky place order */}
      <div className="fixed inset-x-0 bottom-24 z-30 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <button
          onClick={handlePlace}
          disabled={placing}
          className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-70"
        >
          {placing ? (
            <motion.span
              className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
            />
          ) : (
            <>
              Confirm & Pay {rupees(total)}
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  )
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? 'font-semibold text-primary' : 'font-medium text-foreground'}>
        {value}
      </span>
    </div>
  )
}
