'use client'

import {
  ArrowRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { useLanguage } from '@/components/language-provider'
import { SERVICES } from '@/lib/data'
import { Icon } from '@/lib/icons'
import { useStore } from '@/lib/store'

export function ServicesSection() {
  const { navigate } = useStore()
  const { language, t } = useLanguage()

  const getServiceName = (
    service: (typeof SERVICES)[number],
  ) => {
    const serviceTranslations = {
      laundry: t.services.laundry,
      ironing: t.services.ironing,
      drycleaning: t.services.dryCleaning,
      saree: t.services.sareePleating,
      shoe: t.services.shoeCare,
      bag: t.services.bagCare,
      'home-cleaning': t.services.homeCleaning,
      plumbing: t.services.plumbing,
      electrical: t.services.electrical,
      carpentry: t.services.carpentry,
      painting: t.services.painting,
      gardening: t.services.gardening,
      caregiving: t.services.caregiving,
      driver: t.services.driver,
    }

    return (
      serviceTranslations[
        service.id as keyof typeof serviceTranslations
      ] ?? service.name
    )
  }

  const getBookingLabel = (
    service: (typeof SERVICES)[number],
  ) => {
    if (service.bookingType === 'emergency') {
      return t.booking.emergency
    }

    if (service.bookingType === 'on-demand') {
      return t.booking.onDemand
    }

    return t.booking.scheduled
  }

  const getBookingClass = (
    service: (typeof SERVICES)[number],
  ) => {
    if (service.bookingType === 'emergency') {
      return 'bg-destructive/10 text-destructive ring-1 ring-destructive/10'
    }

    if (service.bookingType === 'on-demand') {
      return 'bg-primary/10 text-primary ring-1 ring-primary/10'
    }

    return 'bg-muted text-muted-foreground ring-1 ring-border/60'
  }

  const localProvidersLabel =
    language === 'en'
      ? 'Local providers'
      : language === 'ta'
        ? 'உள்ளூர் சேவை வழங்குநர்கள்'
        : 'स्थानीय सेवा प्रदाता'

  const exploreLabel =
    language === 'en'
      ? 'Explore service'
      : language === 'ta'
        ? 'சேவையை ஆராய்க'
        : 'सेवा देखें'

  const popularLabel =
    language === 'en'
      ? 'Verified service'
      : language === 'ta'
        ? 'சரிபார்க்கப்பட்ட சேவை'
        : 'सत्यापित सेवा'

  return (
    <section
      id="services"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-20"
    >
      {/* Section heading */}
      <Reveal className="mb-10 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
          <Sparkles className="size-3.5" />
          {t.common.services}
        </div>

        <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {t.services.title}
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t.home.subtitle}
        </p>
      </Reveal>

      {/* Services */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.id} delay={i}>
            <button
              onClick={() =>
                navigate({
                  name: 'service',
                  serviceId: s.id,
                })
              }
              className="group relative flex h-full w-full flex-col items-start overflow-hidden rounded-[1.75rem] border border-border/80 bg-card p-6 text-left shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[var(--shadow-lift)] focus-visible:-translate-y-1 focus-visible:border-primary/40"
            >
              {/* Decorative glow */}
              <span
                className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
                style={{ background: s.accent }}
              />

              {/* Top row */}
              <div className="relative flex w-full items-start justify-between gap-4">
                <span
                  className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-primary-foreground shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
                  style={{ background: s.accent }}
                >
                  <Icon
                    name={s.icon}
                    className="size-7"
                    strokeWidth={1.8}
                  />
                </span>

                <span className="rounded-full border border-border/70 bg-muted/70 px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors duration-300 group-hover:border-primary/15 group-hover:bg-primary/8 group-hover:text-primary">
                  From ₹{s.fromPrice}
                </span>
              </div>

              {/* Service information */}
              <div className="relative mt-5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                    {getServiceName(s)}
                  </h3>

                  {s.requiredSkills?.length ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[10px] font-bold text-success ring-1 ring-success/10">
                      <ShieldCheck className="size-3" />
                      {t.provider.verifiedSkills}
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>

                {/* Metadata */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground">
                    <MapPin className="size-3 text-primary" />
                    {localProvidersLabel}
                  </span>

                  {s.items?.[0]?.duration ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground">
                      <Clock3 className="size-3 text-primary" />
                      {s.items[0].duration} min+
                    </span>
                  ) : null}

                  <span
                    className={`rounded-full px-2.5 py-1.5 text-[11px] font-bold ${getBookingClass(
                      s,
                    )}`}
                  >
                    {getBookingLabel(s)}
                  </span>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="relative mt-6 flex w-full items-center justify-between border-t border-border/70 pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-success" />
                  {popularLabel}
                </span>

                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  {exploreLabel}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  )
}