'use client'

import { Clock, MapPin, Star } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { PARTNERS } from '@/lib/data'

export function Partners() {
  return (
    <section id="partners" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6">
      <Reveal className="mb-8 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Nearby</p>
          <h2 className="mt-2 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Care Partners Near You
          </h2>
        </div>
        <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
          Demo Providers
        </span>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PARTNERS.map((p, i) => (
          <Reveal key={p.id} delay={i}>
            <div className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 font-display text-lg font-extrabold text-primary">
                    {p.name.slice(0, 2)}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.services}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 text-sm font-bold text-success">
                  <Star className="size-3.5 fill-current" />
                  {p.rating}
                </span>
              </div>

              <div className="mt-auto flex items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-primary" />
                  {p.distance}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4 text-primary" />
                  {p.turnaround}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
