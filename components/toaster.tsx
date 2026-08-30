'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Info, X } from 'lucide-react'
import { useStore } from '@/lib/store'

export function Toaster() {
  const { toasts, dismissToast } = useStore()

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-lift)]"
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                t.variant === 'error'
                  ? 'bg-destructive/10 text-destructive'
                  : t.variant === 'info'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-success/15 text-success'
              }`}
            >
              {t.variant === 'error' ? (
                <X className="size-4" />
              ) : t.variant === 'info' ? (
                <Info className="size-4" />
              ) : (
                <Check className="size-4" strokeWidth={3} />
              )}
            </span>
            <p className="flex-1 text-sm font-medium text-card-foreground">{t.message}</p>
            <button
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
