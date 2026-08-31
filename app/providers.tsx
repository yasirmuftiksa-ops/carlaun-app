'use client'

import type { ReactNode } from 'react'
import { AppShell } from '@/components/app-shell'
import { StoreProvider } from '@/lib/store'

export function Providers({ children }: { children: ReactNode }) {
  return <StoreProvider>{children ?? <AppShell />}</StoreProvider>
}
