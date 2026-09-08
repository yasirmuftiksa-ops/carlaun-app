'use client'

import {
  ArrowRight,
  Gift,
  Sparkles,
  Tag,
  TicketPercent,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { useLanguage } from '@/components/language-provider'
import { OFFERS } from '@/lib/data'
import { useStore } from '@/lib/store'

export function Offers() {
  const { navigate, applyCoupon, cart, toast } = useStore()
  const { language } = useLanguage()

  const content = {
    en: {
      eyebrow: 'Member benefits',
      title: 'Save More on Every Service',
      subtitle:
        'Unlock exclusive offers while booking trusted local services through NeXa Link.',
      featuredLabel: 'Welcome offer',
      featuredTitle: '20% OFF Your First Booking',
      claimOffer: 'Claim offer',
      code: 'Code',
      claim: 'Claim',
      saved: 'Offer saved',
      addService: 'Add a service to redeem it',
      applied: 'applied to your booking',
      cannotApply: "can't be applied to this booking yet",
      benefits: 'Exclusive benefit',
      trusted: 'Available across participating services',
    },

    ta: {
      eyebrow: 'உறுப்பினர் சலுகைகள்',
      title: 'ஒவ்வொரு சேவையிலும் மேலும் சேமிக்கவும்',
      subtitle:
        'NeXa Link மூலம் நம்பகமான உள்ளூர் சேவைகளை முன்பதிவு செய்யும் போது சிறப்பு சலுகைகளைப் பெறுங்கள்.',
      featuredLabel: 'வரவேற்பு சலுகை',
      featuredTitle: 'உங்கள் முதல் முன்பதிவில் 20% தள்ளுபடி',
      claimOffer: 'சலுகையைப் பெறுங்கள்',
      code: 'குறியீடு',
      claim: 'பெறுக',
      saved: 'சலுகை சேமிக்கப்பட்டது',
      addService: 'பயன்படுத்த ஒரு சேவையைச் சேர்க்கவும்',
      applied: 'உங்கள் முன்பதிவில் பயன்படுத்தப்பட்டது',
      cannotApply: 'இந்த முன்பதிவில் இன்னும் பயன்படுத்த முடியாது',
      benefits: 'சிறப்பு பயன்',
      trusted: 'பங்கேற்கும் சேவைகளில் கிடைக்கும்',
    },

    hi: {
      eyebrow: 'सदस्य लाभ',
      title: 'हर सेवा पर अधिक बचत करें',
      subtitle:
        'NeXa Link के माध्यम से विश्वसनीय स्थानीय सेवाएं बुक करते समय विशेष ऑफर पाएं।',
      featuredLabel: 'वेलकम ऑफर',
      featuredTitle: 'आपकी पहली बुकिंग पर 20% की छूट',
      claimOffer: 'ऑफर प्राप्त करें',
      code: 'कोड',
      claim: 'पाएं',
      saved: 'ऑफर सेव किया गया',
      addService: 'इसे रिडीम करने के लिए एक सेवा जोड़ें',
      applied: 'आपकी बुकिंग पर लागू किया गया',
      cannotApply: 'यह अभी इस बुकिंग पर लागू नहीं किया जा सकता',
      benefits: 'विशेष लाभ',
      trusted: 'भाग लेने वाली सेवाओं पर उपलब्ध',
    },
  }[language]

  const claim = (code: string) => {
    if (cart.length === 0) {
      toast(
        `${code} ${content.saved} — ${content.addService}`,
        'info',
      )

      navigate({ name: 'home' })

      document
        .getElementById('services')
        ?.scrollIntoView({ behavior: 'smooth' })

      return
    }

    if (applyCoupon(code)) {
      toast(`${code} ${content.applied}`)
      navigate({ name: 'bag' })
    } else {
      toast(
        `${code} ${content.cannotApply}`,
        'info',
      )
    }
  }

  const featured = OFFERS.find((o) => o.featured)!

  const rest = OFFERS.filter(
    (o) => !o.featured,
  )

  return (
    <section
      id="offers"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-20"
    >
      {/* Section heading */}
      <Reveal className="mb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <TicketPercent className="size-3.5" />
              {content.eyebrow}
            </div>

            <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {content.title}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.subtitle}
            </p>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Featured offer */}
        <Reveal className="lg:col-span-2">
          <div className="group relative flex h-full min-h-[330px] flex-col justify-between overflow-hidden rounded-[2rem] border border-primary/20 bg-primary p-8 text-primary-foreground shadow-[var(--shadow-lift)] sm:p-10">
            {/* Background decoration */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary-foreground/10 blur-3xl transition-transform duration-700 group-hover:scale-125" />

            <div className="pointer-events-none absolute -bottom-24 right-20 size-72 rounded-full bg-primary-foreground/10 blur-3xl" />

            <div className="pointer-events-none absolute right-8 top-8 opacity-[0.08] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
              <Gift className="size-32 sm:size-40" />
            </div>

            {/* Content */}
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/12 px-3.5 py-1.5 text-xs font-bold backdrop-blur-sm">
                <Sparkles className="size-3.5" />
                {content.featuredLabel}
              </span>

              <h3 className="mt-6 max-w-xl text-balance font-display text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
                {content.featuredTitle}
              </h3>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-primary-foreground/80">
                {featured.description}
              </p>
            </div>

            {/* Bottom actions */}
            <div className="relative mt-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-foreground/60">
                    {content.code}
                  </p>

                  <span className="inline-flex items-center gap-2 rounded-xl border border-dashed border-primary-foreground/35 bg-primary-foreground/10 px-4 py-2.5 font-mono text-sm font-bold tracking-[0.18em] backdrop-blur-sm">
                    <Tag className="size-4" />
                    {featured.code}
                  </span>
                </div>

                <button
                  onClick={() =>
                    claim(featured.code)
                  }
                  className="group/button inline-flex items-center justify-center gap-2 rounded-xl bg-primary-foreground px-5 py-3 text-sm font-bold text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                >
                  {content.claimOffer}

                  <ArrowRight className="size-4 transition-transform duration-200 group-hover/button:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Additional offers */}
        <div className="grid gap-4">
          {rest.map((offer, i) => (
            <Reveal key={offer.id} delay={i}>
              <div className="group relative flex h-full items-center gap-4 overflow-hidden rounded-[1.5rem] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[var(--shadow-lift)]">
                {/* Decorative glow */}
                <span className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                {/* Icon */}
                <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/15">
                  <Gift className="size-5" />
                </span>

                {/* Offer details */}
                <div className="relative min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-display text-sm font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                      {offer.title}
                    </p>
                  </div>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {content.code} {offer.code}
                  </p>

                  <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-success">
                    <span className="size-1.5 rounded-full bg-success" />
                    {content.benefits}
                  </p>
                </div>

                {/* Claim */}
                <button
                  onClick={() => claim(offer.code)}
                  className="relative shrink-0 rounded-xl border border-primary/15 bg-primary/5 px-3 py-2 text-xs font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground active:scale-95"
                >
                  {content.claim}
                </button>
              </div>
            </Reveal>
          ))}

          {/* Trust note */}
          <Reveal delay={rest.length}>
            <div className="flex items-center gap-3 rounded-[1.5rem] border border-success/15 bg-success/5 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                <Sparkles className="size-4" />
              </span>

              <p className="text-xs font-semibold leading-relaxed text-muted-foreground">
                {content.trusted}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}