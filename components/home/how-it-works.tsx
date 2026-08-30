'use client'

import { BadgeCheck, CalendarCheck, PackageCheck, Sparkles, Truck } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const STEPS = [
  { n: '01', title: 'Book', desc: 'Choose all the services you need in one order.', icon: CalendarCheck },
  { n: '02', title: 'Pickup', desc: 'We collect everything from your doorstep.', icon: Truck },
  { n: '03', title: 'Care', desc: 'Local service partners handle each item.', icon: Sparkles },
  { n: '04', title: 'Quality Check', desc: 'Every item is checked before delivery.', icon: BadgeCheck },
  { n: '05', title: 'Deliver', desc: 'Everything returns to your doorstep.', icon: PackageCheck },
]

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 bg-charcoal py-16 text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/70">
            How it works
          </p>
          <h2 className="mt-2 text-balance font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Five simple steps to fresh
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => {
            const Ico = s.icon
            return (
              <Reveal key={s.n} delay={i}>
                <div className="group flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-extrabold text-primary-foreground/40">
                      {s.n}
                    </span>
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Ico className="size-5" />
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-background/60">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
