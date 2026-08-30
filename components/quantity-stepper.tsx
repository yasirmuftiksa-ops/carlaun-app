'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'

export function QuantityStepper({
  qty,
  onAdd,
  onRemove,
  onSet,
  size = 'md',
  label,
}: {
  qty: number
  onAdd: () => void
  onRemove: () => void
  onSet?: (n: number) => void
  size?: 'sm' | 'md'
  label?: string
}) {
  const dim = size === 'sm' ? 'h-8' : 'h-9'
  const btn = size === 'sm' ? 'size-8' : 'size-9'

  if (qty === 0) {
    return (
      <button
        onClick={onAdd}
        aria-label={label ? `Add ${label}` : 'Add item'}
        className={`${dim} inline-flex min-w-[68px] items-center justify-center gap-1 rounded-xl border border-primary/30 bg-primary/5 px-3 text-sm font-semibold text-primary transition-all hover:bg-primary/10 active:scale-95`}
      >
        <Plus className="size-4" strokeWidth={2.5} />
        Add
      </button>
    )
  }

  return (
    <div
      className={`${dim} inline-flex items-center justify-between gap-1 rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-card)]`}
    >
      <button
        onClick={onRemove}
        aria-label={label ? `Remove one ${label}` : 'Remove one'}
        className={`${btn} inline-flex items-center justify-center rounded-xl transition-transform active:scale-90`}
      >
        <Minus className="size-4" strokeWidth={3} />
      </button>
      <div className="relative min-w-6 overflow-hidden text-center text-sm font-bold tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={qty}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="block"
          >
            {qty}
          </motion.span>
        </AnimatePresence>
      </div>
      <button
        onClick={onAdd}
        aria-label={label ? `Add one ${label}` : 'Add one'}
        className={`${btn} inline-flex items-center justify-center rounded-xl transition-transform active:scale-90`}
      >
        <Plus className="size-4" strokeWidth={3} />
      </button>
    </div>
  )
}
