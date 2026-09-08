'use client'

import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Clock3,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

export function ContactScreen() {
  const { language } = useLanguage()

  const content = {
    en: {
      cooperative: 'NeXa Link Cooperative',
      title: 'Contact & Support',
      subtitle:
        'Need help with a booking, provider, payment or complaint? Our cooperative support team is here to help.',
      supportOptions: [
        {
          icon: MessageCircle,
          title: 'Chat with Support',
          description:
            'Get help from the NeXa Link cooperative support team.',
          action: 'Start Chat',
        },
        {
          icon: Phone,
          title: 'Call Support',
          description:
            'Speak directly with our customer support team.',
          action: 'Call Now',
        },
        {
          icon: Mail,
          title: 'Email Support',
          description:
            'Send us your issue and receive a response.',
          action: 'Send Email',
        },
      ],
      urgentTitle: 'Urgent Service Issue?',
      urgentDescription:
        'For urgent booking or service-related problems, contact cooperative support immediately so the issue can be assigned to the appropriate team.',
      urgentAction: 'Contact Urgent Support',
      networkTitle: 'Cooperative Support Network',
      networkDescription:
        'NeXa Link brings customers, verified service providers and cooperative administrators together on one platform. Support requests can be routed to the appropriate service or administrative team.',
      supportHours: 'Support Hours',
      days: 'Monday – Sunday',
      hours: '8:00 AM – 10:00 PM',
      serviceNetwork: 'Service Network',
      serviceDescription:
        'Connecting customers with verified local service providers.',
      footer: 'NeXa Link • Cooperative Services Platform',
      chatAlert:
        'NeXa Link support chat will be available soon.',
      callSupport: 'Call Support',
      emailSupport: 'Email Support',
    },

    ta: {
      cooperative: 'NeXa Link கூட்டுறவு',
      title: 'தொடர்பு & ஆதரவு',
      subtitle:
        'முன்பதிவு, சேவை வழங்குநர், பணம் செலுத்துதல் அல்லது புகார் தொடர்பாக உதவி தேவையா? எங்கள் கூட்டுறவு ஆதரவு குழு உதவ தயாராக உள்ளது.',
      supportOptions: [
        {
          icon: MessageCircle,
          title: 'ஆதரவுடன் உரையாடுங்கள்',
          description:
            'NeXa Link கூட்டுறவு ஆதரவு குழுவிடமிருந்து உதவி பெறுங்கள்.',
          action: 'அரட்டையை தொடங்கு',
        },
        {
          icon: Phone,
          title: 'ஆதரவை அழைக்கவும்',
          description:
            'எங்கள் வாடிக்கையாளர் ஆதரவு குழுவுடன் நேரடியாக பேசுங்கள்.',
          action: 'இப்போது அழைக்கவும்',
        },
        {
          icon: Mail,
          title: 'மின்னஞ்சல் ஆதரவு',
          description:
            'உங்கள் பிரச்சினையை அனுப்பி பதிலைப் பெறுங்கள்.',
          action: 'மின்னஞ்சல் அனுப்பு',
        },
      ],
      urgentTitle: 'அவசர சேவை பிரச்சினையா?',
      urgentDescription:
        'அவசரமான முன்பதிவு அல்லது சேவை தொடர்பான பிரச்சினைகளுக்கு உடனடியாக கூட்டுறவு ஆதரவை தொடர்பு கொள்ளுங்கள். உங்கள் பிரச்சினை சரியான குழுவிற்கு அனுப்பப்படும்.',
      urgentAction: 'அவசர ஆதரவை தொடர்பு கொள்ளுங்கள்',
      networkTitle: 'கூட்டுறவு ஆதரவு வலையமைப்பு',
      networkDescription:
        'NeXa Link வாடிக்கையாளர்கள், சரிபார்க்கப்பட்ட சேவை வழங்குநர்கள் மற்றும் கூட்டுறவு நிர்வாகிகளை ஒரே தளத்தில் இணைக்கிறது. ஆதரவு கோரிக்கைகள் பொருத்தமான சேவை அல்லது நிர்வாக குழுவிற்கு அனுப்பப்படலாம்.',
      supportHours: 'ஆதரவு நேரம்',
      days: 'திங்கள் – ஞாயிறு',
      hours: 'காலை 8:00 – இரவு 10:00',
      serviceNetwork: 'சேவை வலையமைப்பு',
      serviceDescription:
        'சரிபார்க்கப்பட்ட உள்ளூர் சேவை வழங்குநர்களுடன் வாடிக்கையாளர்களை இணைக்கிறது.',
      footer: 'NeXa Link • கூட்டுறவு சேவை தளம்',
      chatAlert:
        'NeXa Link ஆதரவு அரட்டை விரைவில் கிடைக்கும்.',
      callSupport: 'ஆதரவை அழைக்கவும்',
      emailSupport: 'மின்னஞ்சல் ஆதரவு',
    },

    hi: {
      cooperative: 'NeXa Link सहकारी संस्था',
      title: 'संपर्क और सहायता',
      subtitle:
        'बुकिंग, सेवा प्रदाता, भुगतान या शिकायत में सहायता चाहिए? हमारी सहकारी सहायता टीम आपकी मदद के लिए तैयार है।',
      supportOptions: [
        {
          icon: MessageCircle,
          title: 'सहायता से चैट करें',
          description:
            'NeXa Link सहकारी सहायता टीम से मदद प्राप्त करें।',
          action: 'चैट शुरू करें',
        },
        {
          icon: Phone,
          title: 'सहायता को कॉल करें',
          description:
            'हमारी ग्राहक सहायता टीम से सीधे बात करें।',
          action: 'अभी कॉल करें',
        },
        {
          icon: Mail,
          title: 'ईमेल सहायता',
          description:
            'अपनी समस्या भेजें और उत्तर प्राप्त करें।',
          action: 'ईमेल भेजें',
        },
      ],
      urgentTitle: 'तत्काल सेवा समस्या?',
      urgentDescription:
        'तत्काल बुकिंग या सेवा संबंधी समस्या के लिए तुरंत सहकारी सहायता से संपर्क करें, ताकि समस्या सही टीम को भेजी जा सके।',
      urgentAction: 'तत्काल सहायता से संपर्क करें',
      networkTitle: 'सहकारी सहायता नेटवर्क',
      networkDescription:
        'NeXa Link ग्राहकों, सत्यापित सेवा प्रदाताओं और सहकारी प्रशासकों को एक ही प्लेटफॉर्म पर जोड़ता है। सहायता अनुरोधों को संबंधित सेवा या प्रशासनिक टीम तक भेजा जा सकता है।',
      supportHours: 'सहायता समय',
      days: 'सोमवार – रविवार',
      hours: 'सुबह 8:00 – रात 10:00',
      serviceNetwork: 'सेवा नेटवर्क',
      serviceDescription:
        'ग्राहकों को सत्यापित स्थानीय सेवा प्रदाताओं से जोड़ना।',
      footer: 'NeXa Link • सहकारी सेवा प्लेटफॉर्म',
      chatAlert:
        'NeXa Link सहायता चैट जल्द उपलब्ध होगी।',
      callSupport: 'सहायता को कॉल करें',
      emailSupport: 'ईमेल सहायता',
    },
  }[language]

  const handleAction = (title: string) => {
    if (
      title === 'Call Support' ||
      title === 'ஆதரவை அழைக்கவும்' ||
      title === 'सहायता को कॉल करें'
    ) {
      window.location.href = 'tel:+919999999999'
      return
    }

    if (
      title === 'Email Support' ||
      title === 'மின்னஞ்சல் ஆதரவு' ||
      title === 'ईमेल सहायता'
    ) {
      window.location.href = 'mailto:support@carlaun.com'
      return
    }

    alert(content.chatAlert)
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-28 pt-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <section>
          <div className="mb-2 flex items-center gap-2">
            <Headphones className="h-6 w-6 text-primary" />

            <span className="text-sm font-medium text-primary">
              {content.cooperative}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            {content.title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {content.subtitle}
          </p>
        </section>

        {/* Support options */}
        <section className="space-y-3">
          {content.supportOptions.map((option, index) => {
            const Icon = option.icon

            return (
              <motion.button
                key={option.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAction(option.title)}
                className="flex w-full items-center gap-4 rounded-2xl border bg-card p-5 text-left shadow-sm transition hover:bg-muted/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">
                    {option.title}
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {option.description}
                  </p>

                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {option.action}
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.button>
            )
          })}
        </section>

        {/* Emergency */}
        <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />

            <div>
              <h2 className="font-semibold">
                {content.urgentTitle}
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {content.urgentDescription}
              </p>

              <button
                onClick={() => handleAction(content.callSupport)}
                className="mt-4 rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground"
              >
                {content.urgentAction}
              </button>
            </div>
          </div>
        </section>

        {/* Cooperative support */}
        <section className="rounded-2xl border bg-card p-5">
          <div className="flex items-start gap-3">
            <Users className="mt-1 h-5 w-5 shrink-0 text-primary" />

            <div>
              <h2 className="font-semibold">
                {content.networkTitle}
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {content.networkDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Information */}
        <section className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5">
            <Clock3 className="mb-3 h-5 w-5 text-primary" />

            <h3 className="font-semibold">
              {content.supportHours}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {content.days}
            </p>

            <p className="text-sm text-muted-foreground">
              {content.hours}
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <MapPin className="mb-3 h-5 w-5 text-primary" />

            <h3 className="font-semibold">
              {content.serviceNetwork}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {content.serviceDescription}
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="pb-4 text-center text-xs text-muted-foreground">
          {content.footer}
        </div>
      </div>
    </main>
  )
}