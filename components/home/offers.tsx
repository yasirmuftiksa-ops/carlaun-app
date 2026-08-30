'use client'

import { Gift, Sparkles, Tag } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { OFFERS } from '@/lib/data'
import { useStore } from '@/lib/store'

export function Offers() {
  const { navigate, applyCoupon, cart, toast } = useStore()

  const claim = (code: string) => {
    if (cart.length === 0) {
      toast(`${code} saved — add a service to redeem it`, 'info')
      navigate({ name: 'home' })
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (applyCoupon(code)) {
      toast(`${code} applied to your bag`)
      navigate({ name: 'bag' })
    } else {
      toast(`${code} can't be applied to this bag yet`, 'info')
    }
  }

  const featured = OFFERS.find((o) => o.featured)!
  const rest = OFFERS.filter((o) => !o.featured)

  return (
    <section id="offers" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6">
      <Reveal className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Save more</p>
        <h2 className="mt-2 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Offers &amp; Coupons
        </h2>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Featured */}
        <Reveal className="lg:col-span-2">
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground shadow-[var(--shadow-lift)]">
            <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-primary-foreground/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 right-16 size-56 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">
                <Sparkles className="size-3.5" />
                First order
              </span>
              <h3 className="mt-4 text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                20% OFF Your First Order
              </h3>
              <p className="mt-2 max-w-sm text-sm text-primary-foreground/80">
                {featured.description}
              </p>
            </div>
            <div className="relative mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-dashed border-primary-foreground/40 bg-primary-foreground/10 px-4 py-2.5 font-mono text-sm font-bold tracking-wider">
                <Tag className="size-4" />
                {featured.code}
              </span>
              <button
                onClick={() => claim(featured.code)}
                className="rounded-xl bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary transition-transform hover:brightness-95 active:scale-95"
              >
                Claim Offer
              </button>
            </div>
          </div>
        </Reveal>

        {/* Others */}
        <div className="grid gap-4">
          {rest.map((o, i) => (
            <Reveal key={o.id} delay={i}>
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Gift className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold text-foreground">
                    {o.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">Code {o.code}</p>
                </div>
                <button
                  onClick={() => claim(o.code)}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  Claim
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
