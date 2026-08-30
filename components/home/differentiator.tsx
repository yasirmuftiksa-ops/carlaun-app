'use client'

import { motion } from 'framer-motion'
import {
  ArrowDown,
  BadgeCheck,
  Footprints,
  PackageCheck,
  Shirt,
  Sparkles,
  Truck,
  User,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'

const partners = [
  { label: 'Laundry Partner', icon: Shirt },
  { label: 'Ironing Partner', icon: Sparkles },
  { label: 'Shoe Care Partner', icon: Footprints },
]

function Node({
  icon,
  label,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  highlight?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-[var(--shadow-card)] ${
        highlight
          ? 'border-transparent bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground'
      }`}
    >
      <span
        className={`flex size-9 items-center justify-center rounded-xl ${
          highlight ? 'bg-primary-foreground/20' : 'bg-primary/10 text-primary'
        }`}
      >
        {icon}
      </span>
      <span className="font-display text-sm font-bold">{label}</span>
    </div>
  )
}

function Connector() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      whileInView={{ opacity: 1, scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex justify-center py-1.5"
    >
      <ArrowDown className="size-5 text-primary/50" />
    </motion.div>
  )
}

export function Differentiator() {
  return (
    <section className="relative overflow-hidden bg-primary/5 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              The CARLAUN difference
            </p>
            <h2 className="mt-2 text-balance font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
              One Pickup.
              <br />
              <span className="text-primary">Multiple Services.</span>
            </h2>
            <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
              Why visit different shops when one pickup can take care of everything? We route each
              item to the right local care partner and bring it all back together.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {['Laundry', 'Ironing', 'Dry Cleaning', 'Shoe Care', 'Saree Pleating'].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-primary/20 bg-card px-4 py-2 text-sm font-semibold text-primary"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Flow */}
          <Reveal delay={1}>
            <div className="rounded-3xl border border-border bg-card/70 p-6 backdrop-blur-sm sm:p-8">
              <div className="mx-auto flex max-w-sm flex-col">
                <Node icon={<User className="size-5" />} label="Customer" />
                <Connector />
                <Node icon={<Truck className="size-5" />} label="CARLAUN Pickup" highlight />
                <Connector />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {partners.map((p) => {
                    const Ico = p.icon
                    return (
                      <div
                        key={p.label}
                        className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background px-3 py-4 text-center"
                      >
                        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Ico className="size-5" />
                        </span>
                        <span className="text-xs font-semibold leading-tight text-foreground">
                          {p.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <Connector />
                <Node icon={<BadgeCheck className="size-5" />} label="Quality Check" />
                <Connector />
                <Node icon={<PackageCheck className="size-5" />} label="One Delivery" highlight />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
