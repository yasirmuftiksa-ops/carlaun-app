'use client'

import { motion } from 'framer-motion'
import {
  Bell,
  ChevronDown,
  MapPin,
  Menu,
  Navigation,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { Modal } from '@/components/ui/modal'
import { SAVED_LOCATIONS, SERVICES } from '@/lib/data'
import { Icon } from '@/lib/icons'
import { useStore } from '@/lib/store'

const NAV = [
  { label: 'Home', target: 'home' as const },
  { label: 'Services', target: 'home' as const, hash: 'services' },
  { label: 'How It Works', target: 'home' as const, hash: 'how' },
  { label: 'Care Partners', target: 'home' as const, hash: 'partners' },
  { label: 'Offers', target: 'home' as const, hash: 'offers' },
]

export function Header() {
  const { navigate, location, setLocation, totalItems, toast } = useStore()
  const [locOpen, setLocOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')

  const goSection = (target: 'home', hash?: string) => {
    navigate({ name: target })
    setMenuOpen(false)
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
    }
  }

  const filtered = SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.tagline.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <button onClick={() => navigate({ name: 'home' })} aria-label="CARLAUN home">
            <Logo />
          </button>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <button
                key={n.label}
                onClick={() => goSection(n.target, n.hash)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {n.label}
              </button>
            ))}
            <button
              onClick={() => navigate({ name: 'orders' })}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Track Order
            </button>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setLocOpen(true)}
              className="hidden items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-left transition-colors hover:border-primary/40 sm:flex"
            >
              <MapPin className="size-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{location}</span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search services"
              className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Search className="size-5" />
            </button>

            <button
              onClick={() => toast('No new notifications', 'info')}
              aria-label="Notifications"
              className="relative flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell className="size-5" />
              <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-primary" />
            </button>

            <button
              onClick={() => navigate({ name: 'bag' })}
              aria-label="Open CARLAUN bag"
              className="relative hidden size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
            >
              <ShoppingBag className="size-5" />
              {totalItems > 0 && <CartBadge count={totalItems} />}
            </button>

            <button
              onClick={() => navigate({ name: 'profile' })}
              aria-label="Profile"
              className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors hover:bg-primary/15"
            >
              <User className="size-5" />
            </button>

            <button
              onClick={() => navigate({ name: 'bag' })}
              className="ml-1 hidden rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:brightness-110 active:scale-95 lg:inline-flex"
            >
              Book a Pickup
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              className="flex size-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted lg:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden border-t border-border bg-card lg:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              <button
                onClick={() => {
                  setLocOpen(true)
                  setMenuOpen(false)
                }}
                className="flex items-center gap-2 rounded-xl bg-muted px-3 py-3 text-left"
              >
                <MapPin className="size-4 text-primary" />
                <span className="text-sm font-semibold">Delivering to {location}</span>
              </button>
              {NAV.map((n) => (
                <button
                  key={n.label}
                  onClick={() => goSection(n.target, n.hash)}
                  className="rounded-xl px-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {n.label}
                </button>
              ))}
              {(['orders', 'provider', 'admin'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    navigate({ name: v })
                    setMenuOpen(false)
                  }}
                  className="rounded-xl px-3 py-3 text-left text-sm font-medium capitalize text-foreground transition-colors hover:bg-muted"
                >
                  {v === 'orders' ? 'Track Order' : `${v} Dashboard`}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      {/* Location modal */}
      <Modal open={locOpen} onClose={() => setLocOpen(false)} title="Delivering to">
        <button
          onClick={() => {
            setLocation('Chennai')
            toast('Location set to your current area')
            setLocOpen(false)
          }}
          className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Navigation className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-primary">Use current location</p>
            <p className="text-xs text-muted-foreground">Detect where you are now</p>
          </div>
        </button>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search area, street, locality…"
            className="w-full rounded-xl border border-border bg-muted/50 py-3 pl-10 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Saved locations
        </p>
        <div className="flex flex-col gap-2">
          {SAVED_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => {
                setLocation('Chennai')
                toast(`Delivering to ${loc.label}`)
                setLocOpen(false)
              }}
              className="flex items-center gap-3 rounded-2xl border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/50"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-muted text-primary">
                <MapPin className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{loc.label}</p>
                <p className="text-xs text-muted-foreground">{loc.area}</p>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Search modal */}
      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="Search services">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search laundry, ironing, dry cleaning…"
            className="w-full rounded-xl border border-border bg-muted/50 py-3 pl-10 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>

        {query === '' && (
          <>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Suggested
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setQuery(s.name)}
                  className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="flex flex-col gap-2">
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                navigate({ name: 'service', serviceId: s.id })
                setSearchOpen(false)
                setQuery('')
              }}
              className="flex items-center gap-3 rounded-2xl border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/50"
            >
              <span
                className="flex size-11 items-center justify-center rounded-xl text-primary-foreground"
                style={{ background: s.accent }}
              >
                <Icon name={s.icon} className="size-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.tagline}</p>
              </div>
              <span className="text-xs font-semibold text-primary">From ₹{s.fromPrice}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No services match &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      </Modal>
    </>
  )
}

function CartBadge({ count }: { count: number }) {
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.4 }}
      animate={{ scale: [1.4, 1] }}
      transition={{ duration: 0.35 }}
      className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
    >
      {count}
    </motion.span>
  )
}
