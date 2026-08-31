'use client'

import { motion } from 'framer-motion'
import { House as Home, Plus, Receipt, Truck, User } from 'lucide-react'
import { useStore } from '@/lib/store'
import type { View } from '@/lib/types'

const ITEMS: { name: View['name']; label: string; icon: typeof Home }[] = [
  { name: 'home', label: 'Home', icon: Home },
  { name: 'orders', label: 'Orders', icon: Receipt },
  { name: 'bag', label: 'Book', icon: Plus },
  { name: 'orders', label: 'Track', icon: Truck },
  { name: 'profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const { view, navigate } = useStore()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/90 backdrop-blur-lg lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 items-end px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {ITEMS.map((item, i) => {
          const active = view.name === item.name && item.label !== 'Track'
          const isBook = item.label === 'Book'

          if (isBook) {
            return (
              <button
                key={item.label}
                onClick={() => navigate({ name: 'bag' })}
                className="flex flex-col items-center gap-1"
                aria-label="Book a pickup"
              >
                <span className="-mt-6 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-lift)] ring-4 ring-background transition-transform active:scale-90">
                  <Plus className="size-6" strokeWidth={2.5} />
                </span>
                <span className="text-[11px] font-semibold text-primary">Book</span>
              </button>
            )
          }

          const Ico = item.icon
          return (
            <button
              key={item.label + i}
              onClick={() => navigate({ name: item.name })}
              className="relative flex flex-col items-center gap-1 py-1"
            >
              <Ico
                className={`size-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
                strokeWidth={active ? 2.4 : 2}
              />
              <span
                className={`text-[11px] font-medium transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {item.label}
              </span>
              {active && (
                <motion.span
                  layoutId="bottomNavDot"
                  className="absolute -top-0.5 size-1 rounded-full bg-primary"
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
