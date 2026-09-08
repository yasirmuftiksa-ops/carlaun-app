'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  ChevronRight,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import { inr } from '@/lib/format'
import { useStore } from '@/lib/store'

export function BagBar() {
  const { totalItems, subtotal, navigate } = useStore()

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{
            y: 100,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: 100,
            opacity: 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 34,
          }}
          className="fixed inset-x-0 bottom-16 z-40 px-3 sm:px-4 lg:bottom-6"
        >
          <button
            onClick={() =>
              navigate({
                name: 'bag',
              })
            }
            className="group relative mx-auto flex w-full max-w-3xl items-center justify-between gap-4 overflow-hidden rounded-[1.5rem] border border-primary/20 bg-primary px-4 py-3.5 text-primary-foreground shadow-[var(--shadow-lift)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)] active:scale-[0.985] sm:px-5 sm:py-4"
          >
            {/* Background glow */}
            <span className="pointer-events-none absolute -right-12 -top-16 size-40 rounded-full bg-white/15 blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:bg-white/20" />

            <span className="relative flex min-w-0 items-center gap-3">
              <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15 ring-1 ring-primary-foreground/10 transition-transform duration-300 group-hover:scale-105">
                <ShoppingBag
                  className="size-5"
                  strokeWidth={2}
                />

                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-background text-[9px] font-extrabold text-primary shadow-sm">
                  {totalItems}
                </span>
              </span>

              <span className="min-w-0 text-left">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-primary-foreground/75 sm:text-xs">
                  <Sparkles className="size-3" />
                  {totalItems} item
                  {totalItems > 1 ? 's' : ''} in bag
                </span>

                <span className="mt-0.5 block font-display text-base font-extrabold tracking-tight sm:text-lg">
                  {inr(subtotal)}
                </span>
              </span>
            </span>

            <span className="relative inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary-foreground px-3.5 py-2.5 text-sm font-extrabold text-primary shadow-sm transition-all duration-300 group-hover:gap-2.5 group-hover:shadow-md sm:px-4">
              <span className="hidden sm:inline">
                View Bag
              </span>

              <span className="sm:hidden">
                View
              </span>

              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>

            <ChevronRight className="pointer-events-none absolute -right-1/2 top-1/2 size-24 -translate-y-1/2 text-primary-foreground/5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}