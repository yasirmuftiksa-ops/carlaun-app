'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bike,
  Footprints,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  WashingMachine,
} from 'lucide-react'
import { useStore } from '@/lib/store'

function Float({
  children,
  delay = 0,
  amount = 10,
  className,
}: {
  children: React.ReactNode
  delay?: number
  amount?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amount, 0] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}

export function Hero() {
  const { navigate } = useStore()

  return (
    <section className="relative overflow-hidden">
      {/* soft backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 -top-24 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-32 size-80 rounded-full bg-accent/40 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-20">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary"
          >
            <Sparkles className="size-4" />
            One pickup. Multiple services.
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-5 text-pretty font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            One Platform.
            <br />
            <span className="text-primary">Every Garment</span> Care Need.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
          >
            From laundry and ironing to dry cleaning, shoe care and saree pleating — book
            everything from your doorstep.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <button
              onClick={() => navigate({ name: 'bag' })}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:brightness-110 active:scale-95 sm:w-auto"
            >
              Book a Pickup
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() =>
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-primary/40 sm:w-auto"
            >
              Explore Services
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-6 lg:justify-start"
          >
            <div className="flex items-center gap-1.5">
              <Star className="size-4 fill-primary text-primary" />
              <span className="text-sm font-semibold text-foreground">4.8</span>
              <span className="text-sm text-muted-foreground">demo rating</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">6</span> care services
            </span>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm text-muted-foreground">Doorstep pickup</span>
          </motion.div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto h-[380px] w-full max-w-md sm:h-[440px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            {/* central basket card */}
            <Float amount={12} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex size-44 flex-col items-center justify-center gap-2 rounded-[2rem] bg-primary text-primary-foreground shadow-[var(--shadow-lift)] sm:size-52">
                <WashingMachine className="size-16 sm:size-20" strokeWidth={1.5} />
                <span className="font-display text-sm font-bold">CARLAUN Care</span>
              </div>
            </Float>

            <Float delay={0.4} className="absolute left-2 top-6">
              <Tile icon={<Shirt className="size-7 text-primary" />} label="Laundry" sub="₹49" />
            </Float>
            <Float delay={0.9} amount={14} className="absolute right-1 top-2">
              <Tile icon={<Sparkles className="size-7 text-primary" />} label="Ironing" sub="₹10" />
            </Float>
            <Float delay={0.6} amount={9} className="absolute bottom-16 left-0">
              <Tile icon={<Footprints className="size-7 text-primary" />} label="Shoe Care" sub="₹149" />
            </Float>
            <Float delay={1.1} className="absolute bottom-6 right-4">
              <Tile icon={<ShoppingBag className="size-7 text-primary" />} label="One Bag" sub="16 items" />
            </Float>

            {/* scooter chip */}
            <Float delay={0.7} amount={8} className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2.5 shadow-[var(--shadow-card)]">
                <span className="flex size-8 items-center justify-center rounded-full bg-success/15 text-success">
                  <Bike className="size-5" />
                </span>
                <span className="text-sm font-semibold text-foreground">Out for delivery</span>
              </div>
            </Float>

            {/* bubbles */}
            {[
              { c: 'left-6 top-1/2 size-3', d: 0 },
              { c: 'right-10 top-1/3 size-2', d: 0.5 },
              { c: 'right-16 bottom-1/3 size-4', d: 1 },
            ].map((b, i) => (
              <motion.span
                key={i}
                className={`absolute rounded-full bg-primary/25 ${b.c}`}
                animate={{ y: [0, -18, 0], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: b.d }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Tile({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="flex w-28 flex-col gap-1.5 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">{icon}</span>
      <span className="text-sm font-bold text-foreground">{label}</span>
      <span className="text-xs font-medium text-muted-foreground">From {sub}</span>
    </div>
  )
}
