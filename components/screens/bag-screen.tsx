'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Trophy,
  X,
} from 'lucide-react'

import {
  getItem,
  getService,
  OFFERS,
} from '@/lib/data'

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
    selectedProviders,
  } = useStore()

  const [code, setCode] = useState('')

  /*
   * =====================================================
   * EMPTY BAG
   * =====================================================
   */

  if (totalItems === 0) {
    return (
      <div className="min-h-dvh bg-background">
        <ScreenHeader title="NeXa Link Bag" />

        <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 py-20 text-center">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
            className="relative"
          >
            <span className="absolute inset-0 rounded-[2rem] bg-primary/10 blur-2xl" />

            <div className="relative flex size-24 items-center justify-center rounded-[2rem] border border-primary/10 bg-card shadow-[var(--shadow-card)]">
              <ShoppingBag className="size-10 text-primary" />
            </div>
          </motion.div>

          <h2 className="mt-7 font-display text-2xl font-extrabold tracking-tight text-foreground">
            Your NeXa Link Bag is empty
          </h2>

          <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
            Add services from across the NeXa Link network.
            Multiple services can travel together in one
            coordinated booking.
          </p>

          <button
            onClick={() =>
              navigate({
                name: 'home',
              })
            }
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] active:scale-95"
          >
            Browse Services
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background pb-44">
      <ScreenHeader title="NeXa Link Bag" />

      {/* =====================================================
          SINGLE PICKUP BANNER
          ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mt-4 overflow-hidden rounded-[1.5rem] border border-primary/15 bg-primary/[0.06] shadow-[var(--shadow-card)]"
      >
        <div className="flex items-center gap-3 px-4 py-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ShoppingBag className="size-5" />
          </span>

          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">
              One coordinated pickup
            </p>

            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {groups.length}{' '}
              {groups.length === 1
                ? 'service'
                : 'services'}{' '}
              • Everything travels together.
            </p>
          </div>

          <Sparkles className="ml-auto size-5 shrink-0 text-primary/60" />
        </div>
      </motion.div>

      {/* =====================================================
          SERVICE GROUPS
          ===================================================== */}

      <div className="space-y-5 px-4 py-5">
        {groups.map((group, groupIndex) => {
          const service = getService(
            group.serviceId,
          )

          if (!service) return null

          const provider =
            selectedProviders[
              group.serviceId
            ] ?? null

          return (
            <motion.div
              key={group.serviceId}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: groupIndex * 0.05,
              }}
              className="group overflow-hidden rounded-[1.5rem] border border-border/80 bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:border-primary/20 hover:shadow-[var(--shadow-lift)]"
            >
              {/* =================================================
                  SERVICE HEADER
                  ================================================= */}

              <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl text-card shadow-sm transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor:
                        service.accent,
                    }}
                  >
                    <Icon
                      name={service.icon}
                      className="size-5"
                    />
                  </span>

                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-foreground">
                      {group.serviceName}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {group.itemCount}{' '}
                      {group.itemCount === 1
                        ? 'item'
                        : 'items'}
                    </p>
                  </div>
                </div>

                {/* Care level */}
                <div className="ml-2 flex shrink-0 rounded-full border border-border/70 bg-muted/70 p-0.5 text-[11px] font-bold">
                  <button
                    onClick={() =>
                      setCare(
                        group.serviceId,
                        'standard',
                      )
                    }
                    className={`rounded-full px-2.5 py-1.5 transition-all duration-200 ${
                      group.care ===
                      'standard'
                        ? 'bg-foreground text-card shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Std
                  </button>

                  <button
                    onClick={() =>
                      setCare(
                        group.serviceId,
                        'express',
                      )
                    }
                    className={`rounded-full px-2.5 py-1.5 transition-all duration-200 ${
                      group.care ===
                      'express'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Express
                  </button>
                </div>
              </div>

              {/* =================================================
                  PROVIDER FOR THIS SERVICE
                  ================================================= */}

              <div className="border-b border-border/70 bg-primary/[0.035] px-4 py-4">
                {provider ? (
                  <>
                    <div className="flex items-start gap-3">
                      {/* Provider avatar */}
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary font-display text-sm font-extrabold text-primary-foreground shadow-sm">
                        {provider.name
                          .split(' ')
                          .map(
                            (word) =>
                              word[0],
                          )
                          .slice(0, 2)
                          .join('')}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-bold text-foreground">
                            {provider.name}
                          </p>

                          {provider.verified && (
                            <span className="flex shrink-0 items-center justify-center rounded-full bg-success/10 p-1 text-success">
                              <ShieldCheck className="size-3.5" />
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1">
                            <Star className="size-3 fill-current text-primary" />
                            <span className="font-semibold text-foreground">
                              {provider.rating}
                            </span>
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3" />
                            {provider.distance}
                          </span>
                        </div>

                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {provider.turnaround}
                        </p>
                      </div>

                      {/* Best Match */}
                      <div className="flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1.5 text-[9px] font-extrabold text-primary-foreground shadow-sm">
                        <Trophy className="size-3" />
                        Best Match
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-medium text-muted-foreground">
                      <span>
                        {provider.experience} yrs
                        experience
                      </span>

                      <span className="text-border">
                        •
                      </span>

                      <span>
                        {provider.completedJobs}{' '}
                        jobs
                      </span>

                      <span className="text-border">
                        •
                      </span>

                      <span>
                        {provider.serviceArea}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 rounded-xl border border-primary/10 bg-primary/5 px-3 py-2 text-[10px] font-semibold text-primary">
                      <Check className="size-3.5" />
                      NeXa Link AI selected this
                      provider for {group.serviceName}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-secondary">
                      <MapPin className="size-4 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-foreground">
                        Provider will be assigned automatically
                      </p>

                      <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                        NeXa Link will select the best
                        available match.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================
                  ITEMS
                  ================================================= */}

              <div className="divide-y divide-border/70">
                {group.lines.map(
                  (line) => {
                    const item =
                      getItem(
                        group.serviceId,
                        line.itemId,
                      )

                    if (!item) return null

                    return (
                      <div
                        key={
                          line.itemId
                        }
                        className="flex items-center justify-between gap-3 px-4 py-4 transition-colors duration-200 hover:bg-muted/30"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {rupees(
                              line.unitPrice,
                            )}{' '}
                            × {line.qty}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          <span className="font-display text-sm font-bold text-foreground">
                            {rupees(
                              line.unitPrice *
                                line.qty,
                            )}
                          </span>

                          <QuantityStepper
                            qty={
                              line.qty
                            }
                            size="sm"
                            onAdd={() =>
                              setQty(
                                group.serviceId,
                                line.itemId,
                                line.qty +
                                  1,
                              )
                            }
                            onRemove={() =>
                              setQty(
                                group.serviceId,
                                line.itemId,
                                line.qty -
                                  1,
                              )
                            }
                            onSet={(n) =>
                              setQty(
                                group.serviceId,
                                line.itemId,
                                n,
                              )
                            }
                          />
                        </div>
                      </div>
                    )
                  },
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* =====================================================
          PROVIDER SUMMARY
          ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 overflow-hidden rounded-[1.5rem] border border-primary/15 bg-primary/[0.045] shadow-[var(--shadow-card)]"
      >
        <div className="flex items-start gap-3 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="size-5" />
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-display text-sm font-bold text-foreground">
                Smart Provider Matching
              </p>

              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-bold text-success">
                AI
              </span>
            </div>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Each service is matched independently
              with the most suitable available
              provider based on compatibility,
              rating, availability, distance and
              turnaround time.
            </p>
          </div>
        </div>
      </motion.div>

      {/* =====================================================
          COUPON
          ===================================================== */}

      <div className="px-4 pb-2 pt-6">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          <Tag className="size-3.5" />
          Apply Coupon
        </p>

        {coupon ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between rounded-[1.25rem] border border-primary/20 bg-primary/[0.05] px-4 py-3.5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Check className="size-4" />
              </div>

              <div>
                <p className="text-sm font-extrabold text-foreground">
                  {coupon.code}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {coupon.label}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                removeCoupon()
                setCode('')
              }}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Remove coupon"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value.toUpperCase(),
                  )
                }
                placeholder="Enter code"
                className="h-12 flex-1 rounded-xl border border-border bg-card px-4 text-sm font-semibold uppercase tracking-wide text-foreground outline-none transition-all placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
              />

              <button
                onClick={() => {
                  applyCoupon(code)
                }}
                disabled={!code.trim()}
                className="rounded-xl bg-foreground px-5 text-sm font-bold text-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
              >
                Apply
              </button>
            </div>

            {couponError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs font-semibold text-destructive"
              >
                {couponError}
              </motion.p>
            )}

            {/* Quick offers */}
            <div className="mt-3 flex flex-wrap gap-2">
              {OFFERS.map((offer) => (
                <button
                  key={offer.id}
                  onClick={() => {
                    setCode(
                      offer.code,
                    )
                    applyCoupon(
                      offer.code,
                    )
                  }}
                  className="rounded-full border border-dashed border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  {offer.code}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* =====================================================
          BILL DETAILS
          ===================================================== */}

      <div className="mx-4 mt-5 overflow-hidden rounded-[1.5rem] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Bill Details
          </p>

          <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
            {totalItems} items
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <Row
            label="Item Total"
            value={rupees(subtotal)}
          />

          <Row
            label="Pickup & Delivery"
            value={
              delivery === 0
                ? 'FREE'
                : rupees(delivery)
            }
          />

          <AnimatePresence>
            {discount > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
              >
                <Row
                  label={`Discount (${coupon?.code})`}
                  value={`- ${rupees(
                    discount,
                  )}`}
                  accent
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="my-3 border-t border-dashed border-border" />

          <div className="flex items-end justify-between">
            <div>
              <span className="block font-display text-base font-extrabold text-foreground">
                To Pay
              </span>

              <span className="mt-0.5 block text-[10px] text-muted-foreground">
                Final amount
              </span>
            </div>

            <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
              {rupees(total)}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          STICKY CHECKOUT
          ===================================================== */}

      <div className="fixed inset-x-0 bottom-24 z-30 border-t border-border/70 bg-card/90 px-3 py-3 shadow-[0_-12px_35px_-24px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-4">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0 shrink-0">
            <p className="font-display text-lg font-extrabold leading-none text-foreground">
              {rupees(total)}
            </p>

            <p className="mt-1 text-[10px] font-medium text-muted-foreground">
              {totalItems} items • {groups.length}{' '}
              {groups.length === 1
                ? 'service'
                : 'services'}
            </p>
          </div>

          <button
            onClick={() =>
              navigate({
                name: 'checkout',
              })
            }
            className="group ml-auto flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-center text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] active:scale-[0.985]"
          >
            Schedule Pickup
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   BILL ROW
   ========================================================= */

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
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span
        className={
          accent
            ? 'font-bold text-primary'
            : 'font-semibold text-foreground'
        }
      >
        {value}
      </span>
    </div>
  )
}