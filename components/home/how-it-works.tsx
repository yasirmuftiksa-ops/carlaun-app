'use client'

import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  MapPin,
  PackageCheck,
  Sparkles,
  Truck,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { useLanguage } from '@/components/language-provider'

export function HowItWorks() {
  const { language } = useLanguage()

  const content = {
    en: {
      eyebrow: 'Simple service journey',
      title: 'From request to trusted service',
      subtitle:
        'NeXa Link makes it simple to discover, book, track, and review verified cooperative services.',
      steps: [
        {
          n: '01',
          title: 'Request',
          desc: 'Choose the service you need and tell us where and when you need it.',
          icon: CalendarCheck,
        },
        {
          n: '02',
          title: 'Smart Match',
          desc: 'Our platform finds suitable verified workers and cooperatives near you.',
          icon: MapPin,
        },
        {
          n: '03',
          title: 'Book',
          desc: 'Select your preferred provider, schedule, and service requirements.',
          icon: Sparkles,
        },
        {
          n: '04',
          title: 'Track',
          desc: 'Follow the service progress and stay informed throughout the job.',
          icon: Truck,
        },
        {
          n: '05',
          title: 'Complete',
          desc: 'Receive the service, pay securely, and share your feedback.',
          icon: PackageCheck,
        },
      ],
      trust: 'Verified providers',
      fair: 'Fair & transparent',
      secure: 'Secure experience',
    },

    ta: {
      eyebrow: 'எளிய சேவை பயணம்',
      title: 'கோரிக்கையிலிருந்து நம்பகமான சேவை வரை',
      subtitle:
        'NeXa Link மூலம் சரிபார்க்கப்பட்ட கூட்டுறவு சேவைகளை எளிதாக கண்டறிந்து, முன்பதிவு செய்து, கண்காணித்து, மதிப்பிடலாம்.',
      steps: [
        {
          n: '01',
          title: 'கோரிக்கை',
          desc: 'தேவையான சேவையைத் தேர்வு செய்து, எங்கு மற்றும் எப்போது தேவை என்பதை தெரிவிக்கவும்.',
          icon: CalendarCheck,
        },
        {
          n: '02',
          title: 'ஸ்மார்ட் பொருத்தம்',
          desc: 'உங்களுக்கு அருகிலுள்ள பொருத்தமான சரிபார்க்கப்பட்ட பணியாளர்கள் மற்றும் கூட்டுறவுகளை தளம் கண்டறியும்.',
          icon: MapPin,
        },
        {
          n: '03',
          title: 'முன்பதிவு',
          desc: 'விருப்பமான சேவை வழங்குநர், நேரம் மற்றும் தேவைகளைத் தேர்வு செய்யவும்.',
          icon: Sparkles,
        },
        {
          n: '04',
          title: 'கண்காணிப்பு',
          desc: 'சேவை முன்னேற்றத்தை கண்காணித்து, பணியின் நிலையை தொடர்ந்து அறிந்து கொள்ளுங்கள்.',
          icon: Truck,
        },
        {
          n: '05',
          title: 'நிறைவு',
          desc: 'சேவையைப் பெற்று, பாதுகாப்பாக பணம் செலுத்தி, உங்கள் கருத்தை பகிருங்கள்.',
          icon: PackageCheck,
        },
      ],
      trust: 'சரிபார்க்கப்பட்ட வழங்குநர்கள்',
      fair: 'நியாயமான மற்றும் வெளிப்படையானது',
      secure: 'பாதுகாப்பான அனுபவம்',
    },

    hi: {
      eyebrow: 'सरल सेवा यात्रा',
      title: 'अनुरोध से विश्वसनीय सेवा तक',
      subtitle:
        'NeXa Link के साथ सत्यापित सहकारी सेवाओं को आसानी से खोजें, बुक करें, ट्रैक करें और रिव्यू करें।',
      steps: [
        {
          n: '01',
          title: 'अनुरोध',
          desc: 'अपनी आवश्यक सेवा चुनें और बताएं कि आपको यह कहां और कब चाहिए।',
          icon: CalendarCheck,
        },
        {
          n: '02',
          title: 'स्मार्ट मैच',
          desc: 'हमारा प्लेटफॉर्म आपके पास उपयुक्त सत्यापित कर्मचारियों और सहकारी संस्थाओं को खोजता है।',
          icon: MapPin,
        },
        {
          n: '03',
          title: 'बुक करें',
          desc: 'अपना पसंदीदा प्रदाता, समय और सेवा आवश्यकताएं चुनें।',
          icon: Sparkles,
        },
        {
          n: '04',
          title: 'ट्रैक करें',
          desc: 'सेवा की प्रगति देखें और पूरे काम के दौरान अपडेट प्राप्त करें।',
          icon: Truck,
        },
        {
          n: '05',
          title: 'पूरा करें',
          desc: 'सेवा प्राप्त करें, सुरक्षित भुगतान करें और अपना फीडबैक साझा करें।',
          icon: PackageCheck,
        },
      ],
      trust: 'सत्यापित प्रदाता',
      fair: 'निष्पक्ष और पारदर्शी',
      secure: 'सुरक्षित अनुभव',
    },
  }[language]

  return (
    <section
      id="how"
      className="relative scroll-mt-20 overflow-hidden bg-charcoal py-16 text-background sm:py-20"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute -left-32 top-20 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <Reveal className="mx-auto mb-12 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground/75 backdrop-blur-sm">
            <Sparkles className="size-3.5 text-primary" />
            {content.eyebrow}
          </div>

          <h2 className="mt-5 text-balance font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {content.title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-background/60 sm:text-base">
            {content.subtitle}
          </p>
        </Reveal>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="pointer-events-none absolute left-[10%] right-[10%] top-8 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {content.steps.map((step, i) => {
              const Ico = step.icon

              return (
                <Reveal key={step.n} delay={i}>
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:bg-white/[0.075]">
                    {/* Card glow */}
                    <span className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-primary/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Number + icon */}
                    <div className="relative flex items-center justify-between">
                      <span className="font-display text-2xl font-extrabold tracking-tight text-white/20 transition-colors duration-300 group-hover:text-primary/40">
                        {step.n}
                      </span>

                      <span className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Ico className="size-5" />
                      </span>
                    </div>

                    {/* Text */}
                    <div className="relative mt-6">
                      <h3 className="font-display text-lg font-bold text-background">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-background/55">
                        {step.desc}
                      </p>
                    </div>

                    {/* Bottom indicator */}
                    <div className="relative mt-auto pt-6">
                      <div className="flex items-center gap-2 border-t border-white/8 pt-4">
                        <span className="size-1.5 rounded-full bg-primary" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-background/40">
                          NeXa Link
                        </span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* Trust strip */}
        <Reveal className="mt-8">
          <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-background/60">
                <BadgeCheck className="size-4 text-primary" />
                {content.trust}
              </span>

              <span className="hidden size-1 rounded-full bg-white/20 sm:block" />

              <span className="inline-flex items-center gap-2 text-xs font-semibold text-background/60">
                <Sparkles className="size-4 text-primary" />
                {content.fair}
              </span>

              <span className="hidden size-1 rounded-full bg-white/20 sm:block" />

              <span className="inline-flex items-center gap-2 text-xs font-semibold text-background/60">
                <BadgeCheck className="size-4 text-primary" />
                {content.secure}
              </span>
            </div>

            <ArrowRight className="hidden size-4 text-primary sm:block" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}