'use client'

import { ChevronRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const FLOW = [
  'Multiple Orders',
  'Smart Batching',
  'Route Optimization',
  'Pickup',
  'Provider Coordination',
  'Delivery',
]

export function FutureFeature() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/8 via-card to-accent/30 p-8 sm:p-12">
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Future Feature
          </span>
          <h2 className="mt-4 text-balance font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            Smarter Pickups.
            <br />
            <span className="text-primary">Smarter Deliveries.</span>
          </h2>
          <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            We&apos;re designing intelligent batching and routing to make pickups and deliveries
            even faster. This is a planned capability — not yet operational.
          </p>
        </Reveal>

        <Reveal delay={1}>
          <div className="no-scrollbar mt-8 flex items-center gap-2 overflow-x-auto pb-2">
            {FLOW.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="whitespace-nowrap rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-[var(--shadow-card)]">
                  {step}
                </span>
                {i < FLOW.length - 1 && (
                  <ChevronRight className="size-5 shrink-0 text-primary/50" />
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
