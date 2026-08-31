export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path
            d="M6 4h9.5a2.5 2.5 0 0 1 2.5 2.5V8l-3 2v7.5A2.5 2.5 0 0 1 12.5 20h-5A2.5 2.5 0 0 1 5 17.5V6a2 2 0 0 1 1-2Z"
            fill="currentColor"
            opacity="0.35"
          />
          <circle cx="9.5" cy="14" r="3.2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M6 4h9.5A2.5 2.5 0 0 1 18 6.5V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
          CARLAUN
        </span>
      )}
    </span>
  )
}
