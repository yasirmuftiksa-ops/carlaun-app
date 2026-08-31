'use client'

import { Differentiator } from '@/components/home/differentiator'
import { FutureFeature } from '@/components/home/future'
import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { Offers } from '@/components/home/offers'
import { Partners } from '@/components/home/partners'
import { ServicesSection } from '@/components/home/services-section'
import { TrustEco } from '@/components/home/trust-eco'
import { Footer } from '@/components/footer'

export function HomeScreen() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <Differentiator />
      <Partners />
      <Offers />
      <HowItWorks />
      <TrustEco />
      <FutureFeature />
      <Footer />
    </>
  )
}
