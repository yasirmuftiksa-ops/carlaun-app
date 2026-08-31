'use client'

import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useStore } from '@/lib/store'

export function ScreenHeader({
  title,
  subtitle,
  right,
  showBack = true,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
  showBack?: boolean
}) {
  const { back } = useStore()
  return (
    <div className="sticky top-16 z-30 border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
        {showBack && (
          <button
            onClick={back}
            aria-label="Go back"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-lg font-bold text-foreground">{title}</h1>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  )
}
