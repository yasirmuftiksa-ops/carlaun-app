'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { BagBar } from '@/components/bag-bar'
import { BottomNav } from '@/components/bottom-nav'
import { Header } from '@/components/header'
import { Toaster } from '@/components/toaster'
import { useStore } from '@/lib/store'
import { AdminScreen } from '@/components/screens/admin-screen'
import { BagScreen } from '@/components/screens/bag-screen'
import { CheckoutScreen } from '@/components/screens/checkout-screen'
import { HomeScreen } from '@/components/screens/home-screen'
import { OrdersScreen } from '@/components/screens/orders-screen'
import { ProfileScreen } from '@/components/screens/profile-screen'
import { ProviderScreen } from '@/components/screens/provider-screen'
import { ServiceDetailScreen } from '@/components/screens/service-detail-screen'
import { SuccessScreen } from '@/components/screens/success-screen'
import { TrackingScreen } from '@/components/screens/tracking-screen'

function Screen() {
  const { view } = useStore()

  switch (view.name) {
    case 'home':
      return <HomeScreen />
    case 'service':
      return <ServiceDetailScreen serviceId={view.serviceId} />
    case 'bag':
      return <BagScreen />
    case 'checkout':
      return <CheckoutScreen />
    case 'success':
      return <SuccessScreen orderId={view.orderId} />
    case 'tracking':
      return <TrackingScreen orderId={view.orderId} />
    case 'orders':
      return <OrdersScreen />
    case 'profile':
      return <ProfileScreen />
    case 'provider':
      return <ProviderScreen />
    case 'admin':
      return <AdminScreen />
    default:
      return <HomeScreen />
  }
}

export function AppShell() {
  const { view } = useStore()

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view.name === 'service' ? `service-${view.serviceId}` : view.name === 'tracking' ? `tracking-${view.orderId}` : view.name === 'success' ? `success-${view.orderId}` : view.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <Screen />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bag bar sits above bottom nav on mobile, near bottom on desktop. */}
      <BagBar />

      <BottomNav />
      <Toaster />
    </div>
  )
}
