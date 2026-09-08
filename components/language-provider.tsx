'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  getSavedLanguage,
  saveLanguage,
  getTranslation,
  type Language,
} from '@/lib/i18n'

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: ReturnType<typeof getTranslation>
}

const LanguageContext =
  createContext<LanguageContextType | undefined>(
    undefined,
  )

export function LanguageProvider({
  children,
}: {
  children: ReactNode
}) {
  const [language, setLanguageState] =
    useState<Language>('en')

  useEffect(() => {
    setLanguageState(getSavedLanguage())
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    saveLanguage(newLanguage)
  }

  const t = useMemo(
    () => getTranslation(language),
    [language],
  )

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error(
      'useLanguage must be used inside LanguageProvider',
    )
  }

  return context
}