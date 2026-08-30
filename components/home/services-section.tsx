'use client'

import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SERVICES } from '@/lib/data'
import { Icon } from '@/lib/icons'
import { useStore } from '@/lib/store'

export function ServicesSection() {
  const { navigate } = useStore()

  return (
    <section id="services" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6">
      <Reveal className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Our services</p>
        <h2 className="mt-2 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          What do you need cared for?
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.id} delay={i}>
            <button
              onClick={() => navigate({ name: 'service', serviceId: s.id })}
              className="group flex h-full w-full flex-col items-start gap-4 rounded-3xl border border-border bg-card p-6 text-left shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex w-full items-start justify-between">
                <span
                  className="flex size-14 items-center justify-center rounded-2xl text-primary-foreground transition-transform duration-300 group-hover:scale-105"
                  style={{ background: s.accent }}
                >
                  <Icon name={s.icon} className="size-7" strokeWidth={1.8} />
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  From ₹{s.fromPrice}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-foreground">{s.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Explore
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
