'use client'

import {
  BadgeCheck,
  Droplets,
  HandHeart,
  Leaf,
  MapPin,
  Recycle,
  ShieldCheck,
  Tag,
  Users,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { useLanguage } from '@/components/language-provider'

export function TrustEco() {
  const { language } = useLanguage()

  const content = {
    en: {
      trustTitle: 'Care You Can Trust',
      trust: [
        'Transparent pricing',
        'Verified local workers',
        'Doorstep service',
        'Easy booking',
        'Secure payments',
        'Quality-focused service',
      ],
      sustainability: 'Community & Sustainability',
      ecoTitle: 'Better Services. Stronger Communities.',
      eco: [
        {
          title: 'Cooperative-first model',
          desc: 'Workers and service providers can grow together through a cooperative ecosystem.',
        },
        {
          title: 'Fair work opportunities',
          desc: 'Connect skilled workers with nearby opportunities while supporting fair and transparent earnings.',
        },
        {
          title: 'Community-focused care',
          desc: 'Reliable household services that create value for customers, workers, and local communities.',
        },
      ],
    },

    ta: {
      trustTitle: 'நம்பிக்கையுடன் சேவை',
      trust: [
        'வெளிப்படையான விலை',
        'சரிபார்க்கப்பட்ட உள்ளூர் பணியாளர்கள்',
        'வீட்டு வாசல் சேவை',
        'எளிதான முன்பதிவு',
        'பாதுகாப்பான பணப்பரிவர்த்தனை',
        'தரத்தை மையமாகக் கொண்ட சேவை',
      ],
      sustainability: 'சமூகம் மற்றும் நிலைத்தன்மை',
      ecoTitle: 'சிறந்த சேவைகள். வலுவான சமூகங்கள்.',
      eco: [
        {
          title: 'கூட்டுறவுக்கு முன்னுரிமை',
          desc: 'கூட்டுறவு அமைப்பின் மூலம் பணியாளர்களும் சேவை வழங்குநர்களும் ஒன்றாக வளர முடியும்.',
        },
        {
          title: 'நியாயமான வேலை வாய்ப்புகள்',
          desc: 'திறமையான பணியாளர்களை அருகிலுள்ள வேலை வாய்ப்புகளுடன் இணைத்து, நியாயமான மற்றும் வெளிப்படையான வருமானத்தை ஆதரிக்கிறது.',
        },
        {
          title: 'சமூகத்தை மையமாகக் கொண்ட சேவை',
          desc: 'வாடிக்கையாளர்கள், பணியாளர்கள் மற்றும் உள்ளூர் சமூகங்களுக்கு பயனளிக்கும் நம்பகமான வீட்டு சேவைகள்.',
        },
      ],
    },

    hi: {
      trustTitle: 'विश्वसनीय सेवा',
      trust: [
        'पारदर्शी मूल्य',
        'सत्यापित स्थानीय कर्मचारी',
        'घर तक सेवा',
        'आसान बुकिंग',
        'सुरक्षित भुगतान',
        'गुणवत्ता पर केंद्रित सेवा',
      ],
      sustainability: 'समुदाय और स्थिरता',
      ecoTitle: 'बेहतर सेवाएं। मजबूत समुदाय।',
      eco: [
        {
          title: 'सहकारी मॉडल को प्राथमिकता',
          desc: 'सहकारी व्यवस्था के माध्यम से कर्मचारी और सेवा प्रदाता साथ मिलकर आगे बढ़ सकते हैं।',
        },
        {
          title: 'निष्पक्ष काम के अवसर',
          desc: 'कुशल कर्मचारियों को आसपास के अवसरों से जोड़ते हुए निष्पक्ष और पारदर्शी कमाई को बढ़ावा देता है।',
        },
        {
          title: 'समुदाय-केंद्रित सेवा',
          desc: 'ऐसी विश्वसनीय घरेलू सेवाएं जो ग्राहकों, कर्मचारियों और स्थानीय समुदायों के लिए मूल्य बनाती हैं।',
        },
      ],
    },
  }[language]

  const trustIcons = [
    Tag,
    BadgeCheck,
    MapPin,
    HandHeart,
    ShieldCheck,
    Users,
  ]

  const ecoIcons = [Users, HandHeart, Leaf]

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Reveal className="mb-8 text-center">
          <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {content.trustTitle}
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {content.trust.map((label, i) => {
            const Ico = trustIcons[i]

            return (
              <Reveal key={label} delay={i}>
                <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-[var(--shadow-card)]">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-success/12 text-success">
                    <Ico className="size-5" />
                  </span>

                  <span className="text-sm font-semibold leading-tight text-foreground">
                    {label}
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
              {content.sustainability}
            </p>

            <h2 className="mt-2 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {content.ecoTitle}
            </h2>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3">
            {content.eco.map((item, i) => {
              const Ico = ecoIcons[i]

              return (
                <Reveal key={item.title} delay={i}>
                  <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-success/15 text-success">
                      <Ico className="size-5" />
                    </span>

                    <h3 className="font-display text-lg font-bold text-foreground">
                      {item.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
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