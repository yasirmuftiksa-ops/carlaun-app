'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { inr } from '@/lib/format'
import { useStore } from '@/lib/store'

export function BagBar() {
  const { totalItems, subtotal, navigate } = useStore()

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
          className="fixed inset-x-0 bottom-16 z-40 px-4 lg:bottom-6"
        >
          <button
            onClick={() => navigate({ name: 'bag' })}
            className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-2xl bg-primary px-5 py-3.5 text-primary-foreground shadow-[var(--shadow-lift)] transition-transform active:scale-[0.99]"
          >
            <span className="flex items-center gap-3">
              <span className="relative flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15">
                <ShoppingBag className="size-5" />
              </span>
              <span className="text-left">
                <span className="block text-xs text-primary-foreground/80">
                  {totalItems} item{totalItems > 1 ? 's' : ''} in bag
                </span>
                <span className="block font-display text-base font-bold">{inr(subtotal)}</span>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold">
              View Bag
              <ArrowRight className="size-5" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
