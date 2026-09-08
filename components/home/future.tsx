'use client'

import {
  Activity,
  ArrowRight,
  BrainCircuit,
  ChevronRight,
  Clock3,
  MapPinned,
  Route,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { useLanguage } from '@/components/language-provider'

const FLOW = [
  'Demand Forecasting',
  'Workforce Allocation',
  'Smart Matching',
  'Emergency Dispatch',
  'Route Optimization',
]

const flowTranslations = {
  en: [
    'Demand Forecasting',
    'Workforce Allocation',
    'Smart Matching',
    'Emergency Dispatch',
    'Route Optimization',
  ],
  ta: [
    'தேவை கணிப்பு',
    'பணியாளர் ஒதுக்கீடு',
    'ஸ்மார்ட் பொருத்தம்',
    'அவசர அனுப்புதல்',
    'வழித்தட மேம்பாடு',
  ],
  hi: [
    'मांग पूर्वानुमान',
    'कर्मचारी आवंटन',
    'स्मार्ट मैचिंग',
    'आपातकालीन डिस्पैच',
    'रूट ऑप्टिमाइज़ेशन',
  ],
}

const content = {
  en: {
    badge: 'Intelligent service network',
    titleFirst: 'Built for today.',
    titleSecond: 'Ready for tomorrow.',
    description:
      'NeXa Link is designed to combine AI, location intelligence, workforce allocation, and emergency dispatch to make cooperative services smarter and more responsive.',
    planned: 'Planned intelligence',
    plannedText:
      'Some advanced capabilities are planned and shown as a product roadmap — they are not represented as fully operational unless explicitly enabled in the platform.',
    demand: 'Demand',
    workforce: 'Workers',
    matching: 'Smart Match',
    emergency: 'Emergency',
    routing: 'Routing',
    ready: 'Future-ready architecture',
  },

  ta: {
    badge: 'அறிவார்ந்த சேவை வலையமைப்பு',
    titleFirst: 'இன்றைக்காக உருவாக்கப்பட்டது.',
    titleSecond: 'நாளைக்குத் தயாராக உள்ளது.',
    description:
      'NeXa Link AI, இட அடிப்படையிலான நுண்ணறிவு, பணியாளர் ஒதுக்கீடு மற்றும் அவசர அனுப்புதல் ஆகியவற்றை இணைத்து கூட்டுறவு சேவைகளை மேலும் புத்திசாலித்தனமாகவும் விரைவாகவும் மாற்ற வடிவமைக்கப்பட்டுள்ளது.',
    planned: 'திட்டமிடப்பட்ட நுண்ணறிவு',
    plannedText:
      'சில மேம்பட்ட அம்சங்கள் தயாரிப்பு திட்டத்தின் ஒரு பகுதியாகக் காட்டப்படுகின்றன. அவை தளத்தில் வெளிப்படையாக செயல்படுத்தப்படாத வரை முழுமையாக செயல்பாட்டில் உள்ளதாகக் கருதப்படாது.',
    demand: 'தேவை',
    workforce: 'பணியாளர்கள்',
    matching: 'ஸ்மார்ட் பொருத்தம்',
    emergency: 'அவசரம்',
    routing: 'வழித்தடம்',
    ready: 'எதிர்காலத்திற்குத் தயாரான அமைப்பு',
  },

  hi: {
    badge: 'इंटेलिजेंट सेवा नेटवर्क',
    titleFirst: 'आज के लिए बनाया गया।',
    titleSecond: 'कल के लिए तैयार।',
    description:
      'NeXa Link को AI, लोकेशन इंटेलिजेंस, वर्कफोर्स आवंटन और आपातकालीन डिस्पैच को जोड़कर सहकारी सेवाओं को अधिक स्मार्ट और तेज़ बनाने के लिए डिज़ाइन किया गया है।',
    planned: 'नियोजित इंटेलिजेंस',
    plannedText:
      'कुछ उन्नत सुविधाएं प्रोडक्ट रोडमैप के रूप में दिखाई गई हैं। जब तक वे प्लेटफॉर्म में स्पष्ट रूप से सक्रिय न हों, उन्हें पूरी तरह संचालन में नहीं माना जाता है।',
    demand: 'मांग',
    workforce: 'कर्मचारी',
    matching: 'स्मार्ट मैच',
    emergency: 'आपातकाल',
    routing: 'रूटिंग',
    ready: 'भविष्य के लिए तैयार सिस्टम',
  },
}

export function FutureFeature() {
  const { language } = useLanguage()

  const text = content[language]
  const flow = flowTranslations[language]

  const intelligenceCards = [
    {
      icon: Activity,
      label: text.demand,
    },
    {
      icon: Users,
      label: text.workforce,
    },
    {
      icon: BrainCircuit,
      label: text.matching,
    },
    {
      icon: ShieldAlert,
      label: text.emergency,
    },
    {
      icon: Route,
      label: text.routing,
    },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:pb-20">
      <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-card to-accent/20 shadow-[var(--shadow-lift)]">
        {/* Ambient background */}
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
          {/* Left content */}
          <Reveal className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <Sparkles className="size-3.5" />
              {text.badge}
            </div>

            <h2 className="mt-5 text-balance font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {text.titleFirst}
              <br />
              <span className="text-primary">
                {text.titleSecond}
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              {text.description}
            </p>

            {/* Roadmap note */}
            <div className="mt-7 rounded-2xl border border-primary/15 bg-background/60 p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock3 className="size-4" />
                </span>

                <div>
                  <p className="text-sm font-bold text-foreground">
                    {text.planned}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {text.plannedText}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right intelligence visualization */}
          <Reveal delay={1}>
            <div className="relative rounded-[1.75rem] border border-border/80 bg-card/80 p-5 shadow-[var(--shadow-card)] backdrop-blur-md sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BrainCircuit className="size-5" />
                  </span>

                  <div>
                    <p className="font-display text-sm font-bold text-foreground">
                      NeXa Intelligence
                    </p>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {text.ready}
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">
                  <span className="size-1.5 rounded-full bg-success" />
                  Ready
                </span>
              </div>

              {/* Intelligence cards */}
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {intelligenceCards.map((item, i) => {
                  const Ico = item.icon

                  return (
                    <div
                      key={item.label}
                      className={`group rounded-2xl border border-border bg-background p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-primary/[0.03] ${
                        i === 2
                          ? 'border-primary/20 bg-primary/[0.04]'
                          : ''
                      }`}
                    >
                      <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                        <Ico className="size-4" />
                      </span>

                      <p className="mt-3 text-[11px] font-bold leading-tight text-foreground">
                        {item.label}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Flow */}
              <div className="mt-6 rounded-2xl border border-primary/10 bg-primary/[0.035] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <MapPinned className="size-4 text-primary" />

                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
                    {text.planned}
                  </p>
                </div>

                <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
                  {flow.map((step, i) => (
                    <div
                      key={step}
                      className="flex shrink-0 items-center gap-2"
                    >
                      <span
                        className={`rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                          i === 2
                            ? 'border-primary/25 bg-primary text-primary-foreground'
                            : 'border-border bg-card text-foreground'
                        }`}
                      >
                        {step}
                      </span>

                      {i < flow.length - 1 && (
                        <ChevronRight className="size-4 shrink-0 text-primary/40" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture indicator */}
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-success/15 bg-success/5 p-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                  <ArrowRight className="size-4" />
                </span>

                <p className="text-xs font-semibold leading-relaxed text-muted-foreground">
                  {text.ready}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}