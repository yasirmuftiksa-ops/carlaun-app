'use client'

import {
  ChevronRight,
  Gift,
  Heart,
  HelpCircle,
  Leaf,
  MapPin,
  Settings,
  Store,
  Wallet,
} from 'lucide-react'
import { ADDRESSES } from '@/lib/data'
import { useStore } from '@/lib/store'
import { ScreenHeader } from '@/components/screen-header'

export function ProfileScreen() {
  const { orders, navigate, toast } = useStore()
  const delivered = orders.filter((o) => o.status === 'delivered').length

  return (
    <div className="min-h-dvh bg-background pb-24">
      <ScreenHeader title="Profile" showBack={false} />

      {/* User card */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary font-display text-2xl font-bold text-primary-foreground">
            A
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Aarav Sharma</h1>
            <p className="text-sm text-muted-foreground">+91 98765 43210</p>
            <span className="mt-1 inline-block rounded-full bg-accent/12 px-2.5 py-0.5 text-xs font-bold text-accent">
              CARLAUN Prime
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-4">
        <Stat label="Orders" value={String(orders.length)} />
        <Stat label="Delivered" value={String(delivered)} />
        <Stat label="Eco Points" value="340" />
      </div>

      {/* Wallet */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-gradient-to-br from-primary to-accent p-5 text-primary-foreground">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium opacity-90">
              <Wallet className="h-3.5 w-3.5" /> CARLAUN Wallet
            </p>
            <p className="mt-1 font-display text-2xl font-bold">₹250.00</p>
          </div>
          <button
            onClick={() => toast('Add money coming soon', 'info')}
            className="rounded-full bg-card/20 px-4 py-2 text-xs font-semibold backdrop-blur"
          >
            Add Money
          </button>
        </div>
      </div>

      {/* Saved addresses */}
      <div className="px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Saved Addresses
        </p>
        <div className="space-y-2">
          {ADDRESSES.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3"
            >
              <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{a.label}</p>
                <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
                  {a.line}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 py-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <MenuItem icon={Gift} label="Refer & Earn" onClick={() => toast('Share your code: AARAV50')} />
          <MenuItem icon={Heart} label="Favourite Services" onClick={() => toast('No favourites yet', 'info')} />
          <MenuItem icon={Leaf} label="My Eco Impact" onClick={() => toast('You saved 1,240 L of water')} />
          <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => toast('Support: 1800-CARLAUN', 'info')} />
          <MenuItem icon={Settings} label="Settings" onClick={() => toast('Settings coming soon', 'info')} />
        </div>
      </div>

      {/* Role switcher for demo */}
      <div className="px-4 pb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Demo · Switch Dashboard
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate({ name: 'provider' })}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold text-foreground"
          >
            <Store className="h-4 w-4" /> Provider
          </button>
          <button
            onClick={() => navigate({ name: 'admin' })}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold text-foreground"
          >
            <Settings className="h-4 w-4" /> Admin
          </button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <p className="font-display text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

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
      className="flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left last:border-0"
    >
      <IconCmp className="h-4.5 w-4.5 text-muted-foreground" />
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  )
}
