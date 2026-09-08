'use client'

import {
  BadgeCheck,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { useLanguage } from '@/components/language-provider'
import { PARTNERS } from '@/lib/data'

export function Partners() {
  const { language } = useLanguage()

  const content = {
    en: {
      nearby: 'Local network',
      title: 'Trusted Service Cooperatives Near You',
      demo: 'Demo cooperative network',
      verified: 'Verified cooperative',
      local: 'Local provider',
      workers: 'Skilled workers',
      trusted: 'Trusted by the community',
    },

    ta: {
      nearby: 'உள்ளூர் வலையமைப்பு',
      title: 'உங்களுக்கு அருகிலுள்ள நம்பகமான சேவை கூட்டுறவுகள்',
      demo: 'டெமோ கூட்டுறவு வலையமைப்பு',
      verified: 'சரிபார்க்கப்பட்ட கூட்டுறவு',
      local: 'உள்ளூர் சேவை வழங்குநர்',
      workers: 'திறமையான பணியாளர்கள்',
      trusted: 'சமூகத்தால் நம்பப்படுகிறது',
    },

    hi: {
      nearby: 'स्थानीय नेटवर्क',
      title: 'आपके पास विश्वसनीय सेवा सहकारी संस्थाएं',
      demo: 'डेमो सहकारी नेटवर्क',
      verified: 'सत्यापित सहकारी',
      local: 'स्थानीय सेवा प्रदाता',
      workers: 'कुशल कर्मचारी',
      trusted: 'समुदाय द्वारा विश्वसनीय',
    },
  }[language]

  return (
    <section
      id="partners"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-20"
    >
      {/* Section heading */}
      <Reveal className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <Users className="size-3.5" />
            {content.nearby}
          </div>

          <h2 className="mt-4 max-w-3xl text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {content.title}
          </h2>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-bold text-muted-foreground shadow-[var(--shadow-card)]">
          <Sparkles className="size-3.5 text-primary" />
          {content.demo}
        </span>
      </Reveal>

      {/* Partner cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PARTNERS.map((p, i) => (
          <Reveal key={p.id} delay={i}>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/80 bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-[var(--shadow-lift)]">
              {/* Decorative glow */}
              <span className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

              {/* Header */}
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-display text-lg font-extrabold text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/15">
                    {p.name.slice(0, 2)}
                  </span>

                  <div className="min-w-0">
                    <h3 className="truncate font-display text-lg font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                      {p.name}
                    </h3>

                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {p.services}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <span className="flex shrink-0 items-center gap-1 rounded-full border border-success/15 bg-success/10 px-2.5 py-1.5 text-sm font-bold text-success">
                  <Star className="size-3.5 fill-current" />
                  {p.rating}
                </span>
              </div>

              {/* Verified badge */}
              <div className="relative mt-5 flex items-center justify-between rounded-2xl border border-primary/10 bg-primary/[0.04] px-3.5 py-3">
                <span className="inline-flex items-center gap-2 text-xs font-bold text-primary">
                  <BadgeCheck className="size-4" />
                  {content.verified}
                </span>

                <ShieldCheck className="size-4 text-success" />
              </div>

              {/* Information */}
              <div className="relative mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-border/70 bg-muted/45 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <MapPin className="size-3.5 text-primary" />
                    {content.local}
                  </div>

                  <p className="mt-1.5 text-sm font-bold text-foreground">
                    {p.distance}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/45 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Clock className="size-3.5 text-primary" />
                    {language === 'en'
                      ? 'Turnaround'
                      : language === 'ta'
                        ? 'நேரம்'
                        : 'समय'}
                  </div>

                  <p className="mt-1.5 text-sm font-bold text-foreground">
                    {p.turnaround}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="relative mt-auto pt-5">
                <div className="flex items-center justify-between border-t border-border/70 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Users className="size-3.5 text-primary" />
                    {content.workers}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-success">
                    <span className="size-1.5 rounded-full bg-success" />
                    {content.trusted}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}