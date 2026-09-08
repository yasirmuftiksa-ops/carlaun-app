'use client'

import {
  ChevronRight,
  Gift,
  Heart,
  HelpCircle,
  Leaf,
  MapPin,
  MessageSquareWarning,
  PhoneCall,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  Wallet,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { ScreenHeader } from '@/components/screen-header'
import { useLanguage } from '@/components/language-provider'
import { ADDRESSES } from '@/lib/data'
import { useStore } from '@/lib/store'

interface UserSession {
  name: string
  email: string
  role: 'user' | 'admin'
  phone?: string
}

const TEXT = {
  en: {
    profile: 'Profile',
    hey: 'Hey',
    prime: 'NeXa Link Prime',
    admin: 'Admin',
    orders: 'Orders',
    delivered: 'Delivered',
    ecoPoints: 'Eco Points',
    wallet: 'NeXa Link Wallet',
    addMoney: 'Add Money',
    addMoneySoon: 'Add money coming soon',
    savedAddresses: 'Saved Addresses',
    refer: 'Refer & Earn',
    favourite: 'Favourite Services',
    noFavourites: 'No favourites yet',
    ecoImpact: 'My Eco Impact',
    waterSaved: 'You saved 1,240 L of water',
    help: 'Help & Support',
    complaints: 'Complaints',
    contact: 'Contact NeXa Link',
    settings: 'Settings',
    settingsSoon: 'Settings coming soon',
    dashboard: 'Dashboard',
    provider: 'Provider',
    adminDashboard: 'Admin',
    shareCode: 'Share your code',
    serviceArea: 'Your saved service address',
  },

  ta: {
    profile: 'சுயவிவரம்',
    hey: 'வணக்கம்',
    prime: 'NeXa Link Prime',
    admin: 'நிர்வாகி',
    orders: 'ஆர்டர்கள்',
    delivered: 'வழங்கப்பட்டது',
    ecoPoints: 'சுற்றுச்சூழல் புள்ளிகள்',
    wallet: 'NeXa Link பணப்பை',
    addMoney: 'பணம் சேர்க்க',
    addMoneySoon: 'பணம் சேர்க்கும் வசதி விரைவில் வரும்',
    savedAddresses: 'சேமிக்கப்பட்ட முகவரிகள்',
    refer: 'பரிந்துரைத்து சம்பாதிக்க',
    favourite: 'விருப்பமான சேவைகள்',
    noFavourites: 'இன்னும் விருப்ப சேவைகள் இல்லை',
    ecoImpact: 'எனது சுற்றுச்சூழல் தாக்கம்',
    waterSaved: 'நீங்கள் 1,240 லிட்டர் தண்ணீரை சேமித்துள்ளீர்கள்',
    help: 'உதவி மற்றும் ஆதரவு',
    complaints: 'புகார்கள்',
    contact: 'NeXa Link தொடர்பு',
    settings: 'அமைப்புகள்',
    settingsSoon: 'அமைப்புகள் விரைவில் வரும்',
    dashboard: 'டாஷ்போர்டு',
    provider: 'சேவை வழங்குநர்',
    adminDashboard: 'நிர்வாகி',
    shareCode: 'உங்கள் குறியீட்டைப் பகிரவும்',
    serviceArea: 'உங்கள் சேமிக்கப்பட்ட சேவை முகவரி',
  },

  hi: {
    profile: 'प्रोफ़ाइल',
    hey: 'नमस्ते',
    prime: 'NeXa Link Prime',
    admin: 'एडमिन',
    orders: 'ऑर्डर',
    delivered: 'डिलीवर किए गए',
    ecoPoints: 'इको पॉइंट्स',
    wallet: 'NeXa Link वॉलेट',
    addMoney: 'पैसे जोड़ें',
    addMoneySoon: 'पैसे जोड़ने की सुविधा जल्द आएगी',
    savedAddresses: 'सेव किए गए पते',
    refer: 'रेफर करें और कमाएँ',
    favourite: 'पसंदीदा सेवाएँ',
    noFavourites: 'अभी कोई पसंदीदा सेवा नहीं',
    ecoImpact: 'मेरा पर्यावरण प्रभाव',
    waterSaved: 'आपने 1,240 लीटर पानी बचाया है',
    help: 'मदद और सहायता',
    complaints: 'शिकायतें',
    contact: 'NeXa Link से संपर्क करें',
    settings: 'सेटिंग्स',
    settingsSoon: 'सेटिंग्स जल्द आएँगी',
    dashboard: 'डैशबोर्ड',
    provider: 'सेवा प्रदाता',
    adminDashboard: 'एडमिन',
    shareCode: 'अपना कोड साझा करें',
    serviceArea: 'आपका सेव किया गया सेवा पता',
  },
} as const

export function ProfileScreen() {
  const { orders, navigate, toast } = useStore()
  const { language } = useLanguage()

  const content = TEXT[language]

  const [user, setUser] =
    useState<UserSession | null>(null)

  useEffect(() => {
    const loadUser = () => {
      try {
        const saved =
          localStorage.getItem('carlaun_session')

        if (saved) {
          const parsed = JSON.parse(saved)
          setUser(parsed)
        }
      } catch {
        setUser(null)
      }
    }

    loadUser()

    const handleAuthChange = (event: Event) => {
      const customEvent = event as CustomEvent

      if (customEvent.detail) {
        setUser(customEvent.detail)
      } else {
        loadUser()
      }
    }

    window.addEventListener(
      'carlaun-auth-changed',
      handleAuthChange,
    )

    return () => {
      window.removeEventListener(
        'carlaun-auth-changed',
        handleAuthChange,
      )
    }
  }, [])

  const delivered = orders.filter(
    (o) => o.status === 'delivered',
  ).length

  const name =
    user?.name || 'NeXa Link User'

  const email = user?.email || ''

  const role = user?.role || 'user'

  const initial =
    name.trim().charAt(0).toUpperCase() || 'U'

  const referralCode = `${name
    .replace(/\s+/g, '')
    .toUpperCase()}50`

  return (
    <div className="min-h-dvh bg-background pb-24">
      <ScreenHeader
        title={content.profile}
        showBack={false}
      />

      {/* ===================================================== */}
      {/* PROFILE HERO */}
      {/* ===================================================== */}

      <section className="px-4 pb-5 pt-4">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-10 size-36 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative flex items-center gap-4">
            {/* Avatar */}

            <div className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
              <span className="font-display text-2xl font-bold">
                {initial}
              </span>

              <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-card bg-accent">
                <ShieldCheck className="size-3 text-accent-foreground" />
              </span>
            </div>

            {/* User */}

            <div className="min-w-0 flex-1">
              <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
                {content.hey} {name} 👋
              </h1>

              {email && (
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {email}
                </p>
              )}

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                {role === 'admin' ? (
                  <>
                    <ShieldCheck className="size-3.5" />
                    {content.admin}
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" />
                    {content.prime}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* STATS */}
      {/* ===================================================== */}

      <section className="grid grid-cols-3 gap-2 px-4">
        <Stat
          label={content.orders}
          value={String(orders.length)}
        />

        <Stat
          label={content.delivered}
          value={String(delivered)}
        />

        <Stat
          label={content.ecoPoints}
          value="340"
        />
      </section>

      {/* ===================================================== */}
      {/* WALLET */}
      {/* ===================================================== */}

      <section className="px-4 py-5">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-primary via-primary to-accent p-5 text-primary-foreground shadow-[var(--shadow-lift)]">
          <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground/75">
                <Wallet className="size-4" />
                {content.wallet}
              </p>

              <p className="mt-1 font-display text-3xl font-bold tracking-tight">
                ₹250.00
              </p>

              <p className="mt-1 text-xs text-primary-foreground/70">
                {content.prime}
              </p>
            </div>

            <button
              onClick={() =>
                toast(
                  content.addMoneySoon,
                  'info',
                )
              }
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
            >
              {content.addMoney}
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SAVED ADDRESSES */}
      {/* ===================================================== */}

      <section className="px-4">
        <SectionLabel>
          {content.savedAddresses}
        </SectionLabel>

        <div className="space-y-2.5">
          {ADDRESSES.map((address) => (
            <div
              key={address.id}
              className="group flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="size-4.5 text-primary" />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">
                  {address.label}
                </p>

                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {address.line}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================== */}
      {/* MENU */}
      {/* ===================================================== */}

      <section className="px-4 py-5">
        <SectionLabel>
          {content.profile}
        </SectionLabel>

        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-[var(--shadow-card)]">
          <MenuItem
            icon={Gift}
            label={content.refer}
            onClick={() =>
              toast(
                `${content.shareCode}: ${referralCode}`,
              )
            }
          />

          <MenuItem
            icon={Heart}
            label={content.favourite}
            onClick={() =>
              toast(
                content.noFavourites,
                'info',
              )
            }
          />

          <MenuItem
            icon={Leaf}
            label={content.ecoImpact}
            onClick={() =>
              toast(content.waterSaved)
            }
          />

          <MenuItem
            icon={HelpCircle}
            label={content.help}
            onClick={() =>
              navigate({
                name: 'contact',
              })
            }
          />

          <MenuItem
            icon={MessageSquareWarning}
            label={content.complaints}
            onClick={() =>
              navigate({
                name: 'complaints',
              })
            }
          />

          <MenuItem
            icon={PhoneCall}
            label={content.contact}
            onClick={() =>
              navigate({
                name: 'contact',
              })
            }
          />

          <MenuItem
            icon={Settings}
            label={content.settings}
            onClick={() =>
              toast(
                content.settingsSoon,
                'info',
              )
            }
          />
        </div>
      </section>

      {/* ===================================================== */}
      {/* DASHBOARD */}
      {/* ===================================================== */}

      <section className="px-4 pb-5">
        <SectionLabel>
          {content.dashboard}
        </SectionLabel>

        <div className="grid grid-cols-2 gap-3">
          {/* Provider */}

          <button
            onClick={() =>
              navigate({
                name: 'provider',
              })
            }
            className="group flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4 text-sm font-bold text-foreground shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-[var(--shadow-soft)] active:scale-[0.98]"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
              <Store className="size-4.5 text-primary" />
            </span>

            {content.provider}
          </button>

          {/* Admin */}

          <button
            onClick={() =>
              navigate({
                name: 'admin',
              })
            }
            className="group flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4 text-sm font-bold text-foreground shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/[0.03] hover:shadow-[var(--shadow-soft)] active:scale-[0.98]"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/15">
              <ShieldCheck className="size-4.5 text-accent" />
            </span>

            {content.adminDashboard}
          </button>
        </div>
      </section>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| SECTION LABEL
|--------------------------------------------------------------------------
*/

function SectionLabel({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </p>
  )
}

/*
|--------------------------------------------------------------------------
| STAT
|--------------------------------------------------------------------------
*/

function Stat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 text-center shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
      <p className="font-display text-xl font-bold text-foreground">
        {value}
      </p>

      <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| MENU ITEM
|--------------------------------------------------------------------------
*/

function MenuItem({
  icon: IconCmp,
  label,
  onClick,
}: {
  icon: typeof Gift
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left last:border-0 transition-colors hover:bg-muted/50"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-primary/10">
        <IconCmp className="size-4.5 text-muted-foreground transition-colors group-hover:text-primary" />
      </span>

      <span className="flex-1 text-sm font-semibold text-foreground">
        {label}
      </span>

      <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
    </button>
  )
}