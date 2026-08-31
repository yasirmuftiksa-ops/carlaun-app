'use client'

import {
  BadgeCheck,
  Droplets,
  Leaf,
  MapPin,
  Recycle,
  ShieldCheck,
  Tag,
  Truck,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'

const TRUST = [
  { label: 'Transparent pricing', icon: Tag },
  { label: 'Local care partners', icon: MapPin },
  { label: 'Doorstep pickup', icon: Truck },
  { label: 'Doorstep delivery', icon: BadgeCheck },
  { label: 'Easy tracking', icon: ShieldCheck },
  { label: 'Quality-focused service', icon: BadgeCheck },
]

const ECO = [
  { title: 'Eco-conscious care', desc: 'Gentle, low-impact cleaning processes.', icon: Leaf },
  { title: 'Responsible cleaning', desc: 'Water-wise washing and detergents.', icon: Droplets },
  { title: 'Sustainable packaging', desc: 'Reusable and recyclable bags.', icon: Recycle },
]

export function TrustEco() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Reveal className="mb-8 text-center">
          <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Care You Can Trust
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {TRUST.map((t, i) => {
            const Ico = t.icon
            return (
              <Reveal key={t.label} delay={i}>
                <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-[var(--shadow-card)]">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-success/12 text-success">
                    <Ico className="size-5" />
                  </span>
                  <span className="text-sm font-semibold leading-tight text-foreground">
                    {t.label}
                  </span>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-success/20 bg-success/5 p-8 sm:p-10">
          <Reveal className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-success">
              Sustainability
            </p>
            <h2 className="mt-2 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Better Care. Better Planet.
            </h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {ECO.map((e, i) => {
              const Ico = e.icon
              return (
                <Reveal key={e.title} delay={i}>
                  <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-success/15 text-success">
                      <Ico className="size-5" />
                    </span>
                    <h3 className="font-display text-lg font-bold text-foreground">{e.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{e.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
