'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'md' | 'lg'
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: '100%', opacity: 0.6, scale: 1 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 0.6 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className={`relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl bg-card shadow-[var(--shadow-lift)] sm:rounded-3xl ${
              size === 'lg' ? 'sm:max-w-xl' : 'sm:max-w-md'
            }`}
          >
            <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-border sm:hidden" />
            {title && (
              <div className="flex items-center justify-between px-5 pb-3 pt-4">
                <h3 className="font-display text-lg font-bold text-card-foreground">{title}</h3>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>
            )}
            <div className="overflow-y-auto px-5 pb-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
