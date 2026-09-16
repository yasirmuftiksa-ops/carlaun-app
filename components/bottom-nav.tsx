'use client'

import { motion } from 'framer-motion'
import {
  House as Home,
  Plus,
  Receipt,
  Truck,
  User,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { useLanguage } from '@/components/language-provider'

const ITEMS: {
  name: 'home' | 'orders' | 'profile'
  label: string
  icon: typeof Home
}[] = [
  { name: 'home', label: 'Home', icon: Home },
  { name: 'orders', label: 'Orders', icon: Receipt },
  { name: 'orders', label: 'Track', icon: Truck },
  { name: 'profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const { view, navigate } = useStore()
  const { t } = useLanguage()

  const labels = [
    t.common.home,
    t.common.orders,
    t.common.track,
    t.common.profile,
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/85 shadow-[0_-8px_30px_-18px_rgba(0,0,0,0.25)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 items-end px-2 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-2.5">
        {ITEMS.slice(0, 2).map((item, i) => {
          const active = view.name === item.name
          const Ico = item.icon

          return (
            <button
              key={item.label + i}
              onClick={() =>
                navigate({
                  name: item.name,
                })
              }
              className="group relative flex min-h-12 flex-col items-center justify-end gap-1 py-1"
              aria-label={item.label}
            >
              <span
                className={`flex size-8 items-center justify-center rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-primary/10'
                    : 'group-hover:bg-muted'
                }`}
              >
                <Ico
                  className={`size-5 transition-all duration-200 ${
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                  strokeWidth={active ? 2.4 : 2}
                />
              </span>

              <span
                className={`text-[10px] font-bold transition-colors duration-200 ${
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-foreground'
                }`}
              >
                {labels[i] ?? item.label}
              </span>

              {active && (
                <motion.span
                  layoutId={`bottomNavDot-${item.label}`}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="absolute -top-0.5 size-1.5 rounded-full bg-primary"
                />
              )}
            </button>
          )
        })}

        {/* Book button */}
        <button
          onClick={() =>
            navigate({
              name: 'bag',
            })
          }
          className="group relative flex flex-col items-center gap-1"
            aria-label={t.home.bookService}
        >
          <span className="-mt-7 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-lift)] ring-4 ring-background transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-glow)] active:scale-90">
            <Plus
              className="size-6"
              strokeWidth={2.5}
            />
          </span>

          <span className="text-[11px] font-bold text-primary">
            {t.common.book}
          </span>
        </button>

        {/* Track */}
        <button
          onClick={() =>
            navigate({
              name: 'orders',
            })
          }
          className="group relative flex min-h-12 flex-col items-center justify-end gap-1 py-1"
          aria-label="Track"
        >
          <span
            className={`flex size-8 items-center justify-center rounded-xl transition-all duration-200 ${
              view.name === 'orders'
                ? 'bg-primary/10'
                : 'group-hover:bg-muted'
            }`}
          >
            <Truck
              className={`size-5 transition-all duration-200 ${
                view.name === 'orders'
                  ? 'text-primary'
                  : 'text-muted-foreground group-hover:text-foreground'
              }`}
              strokeWidth={view.name === 'orders' ? 2.4 : 2}
            />
          </span>

          <span
            className={`text-[10px] font-bold transition-colors duration-200 ${
              view.name === 'orders'
                ? 'text-primary'
                : 'text-muted-foreground group-hover:text-foreground'
            }`}
          >
            {t.common.track}
          </span>
        </button>

        {/* Profile */}
        <button
          onClick={() =>
            navigate({
              name: 'profile',
            })
          }
          className="group relative flex min-h-12 flex-col items-center justify-end gap-1 py-1"
          aria-label="Profile"
        >
          <span
            className={`flex size-8 items-center justify-center rounded-xl transition-all duration-200 ${
              view.name === 'profile'
                ? 'bg-primary/10'
                : 'group-hover:bg-muted'
            }`}
          >
            <User
              className={`size-5 transition-all duration-200 ${
                view.name === 'profile'
                  ? 'text-primary'
                  : 'text-muted-foreground group-hover:text-foreground'
              }`}
              strokeWidth={view.name === 'profile' ? 2.4 : 2}
            />
          </span>

          <span
            className={`text-[10px] font-bold transition-colors duration-200 ${
              view.name === 'profile'
                ? 'text-primary'
                : 'text-muted-foreground group-hover:text-foreground'
            }`}
          >
            {t.common.profile}
          </span>
        </button>
      </div>
    </nav>
  )
}