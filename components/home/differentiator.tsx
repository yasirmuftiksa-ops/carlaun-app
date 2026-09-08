'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  HandHeart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  Zap,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { useLanguage } from '@/components/language-provider'

const features = [
  {
    key: 'cooperative',
    icon: Users,
  },
  {
    key: 'matching',
    icon: BrainCircuit,
  },
  {
    key: 'fair',
    icon: WalletCards,
  },
  {
    key: 'welfare',
    icon: HandHeart,
  },
] as const

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[var(--shadow-lift)]">
      <span className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <span className="relative flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </span>

      <h3 className="relative mt-4 font-display text-base font-bold text-foreground">
        {title}
      </h3>

      <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function Connector() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      whileInView={{
        opacity: 1,
        scaleY: 1,
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex justify-center py-2"
    >
      <ArrowRight className="hidden size-4 text-primary/40 lg:block" />

      <span className="flex size-7 items-center justify-center rounded-full border border-primary/15 bg-primary/5 lg:hidden">
        <span className="size-1.5 rounded-full bg-primary/50" />
      </span>
    </motion.div>
  )
}

export function Differentiator() {
  const { language } = useLanguage()

  const content = {
    en: {
      eyebrow: 'The NeXa Link difference',
      titleFirst: 'More than a marketplace.',
      titleSecond: 'A cooperative service network.',
      description:
        'NeXa Link connects households with verified local workers while helping cooperatives create fair opportunities, trusted services, and stronger communities.',
      network: 'How the network works',
      customer: 'Household',
      request: 'Service request',
      ai: 'AI Smart Match',
      local: 'Nearby verified workers',
      welfare: 'Worker welfare',
      complete: 'Trusted service',
      featureTitles: [
        'Cooperative-first',
        'AI-powered matching',
        'Fair & transparent earnings',
        'Worker welfare',
      ],
      featureDescriptions: [
        'A cooperative ecosystem where workers and communities can grow together.',
        'Match customers with suitable workers using service, location, availability, and skill signals.',
        'Transparent pricing and digital earnings help support fair work opportunities.',
        'Built to support worker welfare, insurance integration, and safer working conditions.',
      ],
      localNetwork: 'Local network',
      verified: 'Verified workers',
      smart: 'Smart allocation',
      emergency: 'Emergency ready',
    },

    ta: {
      eyebrow: 'NeXa Link வித்தியாசம்',
      titleFirst: 'ஒரு சாதாரண சந்தையை விட அதிகம்.',
      titleSecond: 'ஒரு கூட்டுறவு சேவை வலையமைப்பு.',
      description:
        'NeXa Link வீடுகளை சரிபார்க்கப்பட்ட உள்ளூர் பணியாளர்களுடன் இணைப்பதுடன், கூட்டுறவுகள் நியாயமான வேலை வாய்ப்புகள், நம்பகமான சேவைகள் மற்றும் வலுவான சமூகங்களை உருவாக்க உதவுகிறது.',
      network: 'வலையமைப்பு எப்படி செயல்படுகிறது',
      customer: 'வீடு',
      request: 'சேவை கோரிக்கை',
      ai: 'AI ஸ்மார்ட் பொருத்தம்',
      local: 'அருகிலுள்ள சரிபார்க்கப்பட்ட பணியாளர்கள்',
      welfare: 'பணியாளர் நலன்',
      complete: 'நம்பகமான சேவை',
      featureTitles: [
        'கூட்டுறவுக்கு முன்னுரிமை',
        'AI மூலம் பொருத்தம்',
        'நியாயமான மற்றும் வெளிப்படையான வருமானம்',
        'பணியாளர் நலன்',
      ],
      featureDescriptions: [
        'பணியாளர்களும் சமூகங்களும் ஒன்றாக வளர உதவும் கூட்டுறவு அமைப்பு.',
        'சேவை, இடம், கிடைக்கும் நேரம் மற்றும் திறன் அடிப்படையில் பொருத்தமான பணியாளர்களை கண்டறிகிறது.',
        'வெளிப்படையான விலை மற்றும் டிஜிட்டல் வருமானம் நியாயமான வேலை வாய்ப்புகளை ஆதரிக்கிறது.',
        'பணியாளர் நலன், காப்பீடு மற்றும் பாதுகாப்பான பணிச்சூழலுக்கு ஆதரவு அளிக்கும் வகையில் உருவாக்கப்பட்டது.',
      ],
      localNetwork: 'உள்ளூர் வலையமைப்பு',
      verified: 'சரிபார்க்கப்பட்ட பணியாளர்கள்',
      smart: 'ஸ்மார்ட் ஒதுக்கீடு',
      emergency: 'அவசர சேவை',
    },

    hi: {
      eyebrow: 'NeXa Link की खासियत',
      titleFirst: 'सिर्फ एक मार्केटप्लेस नहीं।',
      titleSecond: 'एक सहकारी सेवा नेटवर्क।',
      description:
        'NeXa Link घरों को सत्यापित स्थानीय कर्मचारियों से जोड़ता है और सहकारी संस्थाओं को निष्पक्ष अवसर, भरोसेमंद सेवाएं और मजबूत समुदाय बनाने में मदद करता है।',
      network: 'नेटवर्क कैसे काम करता है',
      customer: 'घर',
      request: 'सेवा अनुरोध',
      ai: 'AI स्मार्ट मैच',
      local: 'पास के सत्यापित कर्मचारी',
      welfare: 'कर्मचारी कल्याण',
      complete: 'विश्वसनीय सेवा',
      featureTitles: [
        'सहकारी मॉडल को प्राथमिकता',
        'AI आधारित मैचिंग',
        'निष्पक्ष और पारदर्शी कमाई',
        'कर्मचारी कल्याण',
      ],
      featureDescriptions: [
        'एक ऐसा सहकारी नेटवर्क जहां कर्मचारी और समुदाय साथ मिलकर आगे बढ़ सकते हैं।',
        'सेवा, स्थान, उपलब्धता और कौशल के आधार पर उपयुक्त कर्मचारियों से मिलान करता है।',
        'पारदर्शी मूल्य और डिजिटल कमाई निष्पक्ष काम के अवसरों को बढ़ावा देते हैं।',
        'कर्मचारी कल्याण, बीमा और सुरक्षित कार्य परिस्थितियों को समर्थन देने के लिए बनाया गया है।',
      ],
      localNetwork: 'स्थानीय नेटवर्क',
      verified: 'सत्यापित कर्मचारी',
      smart: 'स्मार्ट आवंटन',
      emergency: 'आपातकालीन सेवा',
    },
  }[language]

  const statusItems = [
    {
      icon: MapPin,
      label: content.localNetwork,
    },
    {
      icon: BadgeCheck,
      label: content.verified,
    },
    {
      icon: BrainCircuit,
      label: content.smart,
    },
    {
      icon: Zap,
      label: content.emergency,
    },
  ]

  return (
    <section className="relative overflow-hidden bg-primary/[0.035] py-16 sm:py-20 lg:py-24">
      {/* Background accents */}
      <div className="pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-primary/8 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
          {/* Left */}
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <Sparkles className="size-3.5" />
              {content.eyebrow}
            </div>

            <h2 className="mt-5 max-w-2xl text-balance font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {content.titleFirst}
              <br />
              <span className="text-primary">
                {content.titleSecond}
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.description}
            </p>

            {/* Feature cards */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {features.map((feature, i) => {
                const Ico = feature.icon

                return (
                  <Reveal
                    key={feature.key}
                    delay={i}
                  >
                    <FeatureCard
                      icon={<Ico className="size-5" />}
                      title={content.featureTitles[i]}
                      description={
                        content.featureDescriptions[i]
                      }
                    />
                  </Reveal>
                )
              })}
            </div>
          </Reveal>

          {/* Right — network visualization */}
          <Reveal delay={1}>
            <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card p-5 shadow-[var(--shadow-lift)] sm:p-7">
              {/* Header */}
              <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                    {content.network}
                  </p>

                  <h3 className="mt-1 font-display text-xl font-bold text-foreground">
                    NeXa Link
                  </h3>
                </div>

                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </span>
              </div>

              {/* Flow */}
              <div className="mx-auto mt-6 max-w-md">
                <div className="flex items-center justify-center">
                  <div className="w-full rounded-2xl border border-border bg-background p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Users className="size-5" />
                      </span>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground">
                          {content.customer}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {content.request}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Connector />

                <div className="relative rounded-2xl border border-primary/20 bg-primary p-4 text-primary-foreground shadow-[var(--shadow-glow)]">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15">
                      <BrainCircuit className="size-5" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-bold">
                        {content.ai}
                      </p>

                      <p className="text-xs text-primary-foreground/70">
                        Service + location + skills + availability
                      </p>
                    </div>

                    <span className="ml-auto hidden rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[10px] font-bold sm:block">
                      AI
                    </span>
                  </div>
                </div>

                <Connector />

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
                        <MapPin className="size-4" />
                      </span>

                      <span className="text-xs font-bold text-foreground">
                        {content.local}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
                        <HandHeart className="size-4" />
                      </span>

                      <span className="text-xs font-bold text-foreground">
                        {content.welfare}
                      </span>
                    </div>
                  </div>
                </div>

                <Connector />

                <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                      <BadgeCheck className="size-5" />
                    </span>

                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {content.complete}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Verified • tracked • trusted
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status strip */}
              <div className="mt-6 grid grid-cols-2 gap-2 border-t border-border/70 pt-5 sm:grid-cols-4">
                {statusItems.map((item) => {
                  const Ico = item.icon

                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 rounded-xl bg-muted/45 px-3 py-2.5"
                    >
                      <Ico className="size-3.5 shrink-0 text-primary" />

                      <span className="truncate text-[10px] font-bold text-muted-foreground">
                        {item.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}