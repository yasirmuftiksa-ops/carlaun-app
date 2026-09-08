'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from './language-provider'
import { LANGUAGE_OPTIONS } from '@/lib/i18n'

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-muted-foreground" />

      <select
        value={language}
        onChange={(e) =>
          setLanguage(
            e.target.value as 'en' | 'ta' | 'hi',
          )
        }
        className="rounded-lg border bg-background px-3 py-2 text-sm font-medium outline-none transition-colors focus:ring-2 focus:ring-primary"
        aria-label="Select language"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option
            key={option.id}
            value={option.id}
          >
            {option.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  )
}