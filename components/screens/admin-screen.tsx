'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BrainCircuit,
  Check,
  Clock3,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  HeartPulse,
  IndianRupee,
  MapPin,
  PackageCheck,
  Scale,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Target,
  Zap,
  Truck,
  UserCheck,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

import { PARTNERS, SERVICES } from '@/lib/data'
import { rupees } from '@/lib/format'
import { useStore, ORDER_STATUS_STEPS } from '@/lib/store'
import type { OrderStatus } from '@/lib/types'

import {
  generateDemandForecast,
  generateDemandInsights,
} from '@/lib/demand-forecast'

import {
  generateWorkforceAllocation,
  generateWorkforceInsights,
} from '@/lib/workforce-allocation'

import {
  generateEmergencyDispatch,
  generateEmergencyInsights,
} from '@/lib/emergency-dispatch'

import {
  generateWorkerEarnings,
  generateAllProviderSummaries,
  generateEarningsInsights,
} from '@/lib/earnings'

import { ScreenHeader } from '@/components/screen-header'

type MemberStatus =
  | 'approved'
  | 'pending'
  | 'suspended'


type AIDecisionCandidate = {
  providerId: string
  providerName: string
  score: number
  trustScore: number
  rating: number
  distanceKm: number
  available: boolean
  verified: boolean
  serviceMatch: boolean
  reasons: string[]
}

type AIDecision = {
  orderId: string
  serviceName: string
  priority: string
  customerLabel: string
  recommendedProvider: AIDecisionCandidate | null
  candidates: AIDecisionCandidate[]
  confidence: number
  reasons: string[]
}

const TRUST_SCORE_STORAGE_KEY =
  'nexa_link_provider_trust_scores'

function getStoredTrustScore(
  providerId: string,
  provider: (typeof PARTNERS)[number],
) {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(
        TRUST_SCORE_STORAGE_KEY,
      )

      if (raw) {
        const parsed = JSON.parse(raw) as Record<
          string,
          { score?: number }
        >

        const stored = parsed[providerId]?.score

        if (
          typeof stored === 'number' &&
          Number.isFinite(stored)
        ) {
          return Math.max(
            0,
            Math.min(100, Math.round(stored)),
          )
        }
      }
    } catch {
      // Fall back to a deterministic demo score.
    }
  }

  const ratingScore =
    (provider.rating / 5) * 100

  const experienceScore = Math.min(
    100,
    55 + provider.experience * 5,
  )

  const availabilityScore =
    provider.available ? 100 : 35

  return Math.round(
    ratingScore * 0.45 +
      experienceScore * 0.3 +
      availabilityScore * 0.25,
  )
}

function parseDistanceKm(
  distance: string,
) {
  const match = distance.match(
    /(\d+(?:\.\d+)?)/,
  )

  return match
    ? Number(match[1])
    : 10
}

export function AdminScreen() {
  const {
    orders,
    navigate,
    toast,
    advanceStatus,
  } = useStore()

  const [openOrderId, setOpenOrderId] =
    useState<string | null>(null)

  /*
   * Cooperative member verification status.
   *
   * This is frontend/demo state for the SIH prototype.
   * It does not replace a backend verification system.
   */
  const [memberStatuses, setMemberStatuses] =
    useState<Record<string, MemberStatus>>(() =>
      PARTNERS.reduce(
        (result, partner) => {
          result[partner.id] = 'approved'
          return result
        },
        {} as Record<string, MemberStatus>,
      ),
    )

  const revenue = orders.reduce(
    (sum, order) => sum + order.total,
    0,
  )

  const activeCount = orders.filter(
    (order) => order.status !== 'delivered',
  ).length

  const deliveredCount = orders.filter(
    (order) => order.status === 'delivered',
  ).length


  /* =====================================================
     SMART AI DECISION CENTER
     ===================================================== */

  const [aiDecisionRefresh, setAIDecisionRefresh] =
    useState(0)

  const activeOrdersForAI = orders.filter(
    (order) => order.status !== 'delivered',
  )

  const aiTargetOrder =
    activeOrdersForAI[0] ?? orders[0] ?? null

  const aiTargetServiceId =
    aiTargetOrder?.services[0]?.serviceId ?? null

  const aiTargetService =
    SERVICES.find(
      (service) =>
        service.id === aiTargetServiceId,
    ) ?? null

  const aiCandidates: AIDecisionCandidate[] =
    PARTNERS.map((partner) => {
      const serviceMatch =
        aiTargetService !== null &&
        partner.services
          .toLowerCase()
          .includes(
            aiTargetService.name.toLowerCase(),
          )

      const trustScore =
        getStoredTrustScore(
          partner.id,
          partner,
        )

      const distanceKm =
        parseDistanceKm(partner.distance)

      const distanceScore = Math.max(
        0,
        100 - distanceKm * 8,
      )

      const availabilityScore =
        partner.available ? 100 : 20

      const verificationScore =
        partner.verified ? 100 : 25

      const serviceScore =
        serviceMatch ? 100 : 15

      const ratingScore =
        (partner.rating / 5) * 100

      const workloadScore =
        Math.max(
          35,
          100 -
            Math.min(
              65,
              partner.completedJobs / 10,
            ),
        )

      const score = Math.round(
        serviceScore * 0.25 +
          trustScore * 0.25 +
          distanceScore * 0.15 +
          availabilityScore * 0.15 +
          verificationScore * 0.1 +
          ratingScore * 0.05 +
          workloadScore * 0.05,
      )

      const reasons: string[] = []

      if (serviceMatch) {
        reasons.push('skill match')
      }

      if (trustScore >= 90) {
        reasons.push(
          `trust ${trustScore}`,
        )
      } else if (trustScore >= 75) {
        reasons.push(
          `trust ${trustScore}`,
        )
      }

      if (partner.verified) {
        reasons.push('verified')
      }

      if (partner.available) {
        reasons.push('available now')
      }

      if (distanceKm <= 3) {
        reasons.push(
          `${distanceKm.toFixed(1)} km away`,
        )
      } else if (distanceKm <= 6) {
        reasons.push('nearby')
      }

      if (partner.rating >= 4.7) {
        reasons.push('high rating')
      }

      if (
        partner.completedJobs <= 100 &&
        partner.available
      ) {
        reasons.push('healthy workload')
      }

      return {
        providerId: partner.id,
        providerName: partner.name,
        score,
        trustScore,
        rating: partner.rating,
        distanceKm,
        available: partner.available,
        verified: partner.verified,
        serviceMatch,
        reasons: reasons.slice(0, 5),
      }
    }).sort(
      (a, b) => b.score - a.score,
    )

  const eligibleAICandidates =
    aiCandidates.filter(
      (candidate) =>
        candidate.available &&
        candidate.verified &&
        candidate.serviceMatch,
    )

  const aiRecommendedProvider =
    eligibleAICandidates[0] ??
    aiCandidates.find(
      (candidate) =>
        candidate.available &&
        candidate.verified,
    ) ??
    null

  const aiDecisionConfidence =
    aiRecommendedProvider
      ? Math.min(
          99,
          Math.max(
            58,
            aiRecommendedProvider.score -
              (aiRecommendedProvider.serviceMatch
                ? 0
                : 18),
          ),
        )
      : 0

  const aiDecisionReasons =
    aiRecommendedProvider
      ? [
          aiRecommendedProvider.serviceMatch
            ? 'Required service skill matches the request.'
            : 'No exact skill match is currently available.',
          `Trust Score is ${aiRecommendedProvider.trustScore}/100.`,
          aiRecommendedProvider.available
            ? 'Provider is currently available.'
            : 'Provider is not currently available.',
          aiRecommendedProvider.verified
            ? 'Provider verification is complete.'
            : 'Verification needs attention.',
          `Estimated distance is ${aiRecommendedProvider.distanceKm.toFixed(1)} km.`,
        ]
      : [
          'No verified and available provider currently matches this request.',
          'The cooperative should review capacity or move a worker into the service area.',
        ]

  const aiDecision: AIDecision = {
    orderId:
      aiTargetOrder?.id ?? 'DEMO-REQUEST',
    serviceName:
      aiTargetService?.name ??
      'Service request',
    priority:
      aiTargetOrder?.priority === 'emergency'
        ? 'Emergency'
        : aiTargetOrder?.priority === 'priority'
          ? 'High'
          : 'Normal',
    customerLabel:
      aiTargetOrder
        ? 'Active customer booking'
        : 'Incoming customer request',
    recommendedProvider:
      aiRecommendedProvider,
    candidates: aiCandidates.slice(0, 5),
    confidence: aiDecisionConfidence,
    reasons: aiDecisionReasons,
  }

  function refreshAIDecision() {
    setAIDecisionRefresh(
      (current) => current + 1,
    )
    toast(
      'AI Decision Center refreshed using the latest platform signals.',
      'success',
    )
  }

  function approveAIRecommendation() {
    if (!aiDecision.recommendedProvider) {
      toast(
        'AI could not find a suitable provider to approve.',
        'info',
      )
      return
    }

    toast(
      `AI recommendation approved: ${aiDecision.recommendedProvider.providerName} for ${aiDecision.serviceName}.`,
      'success',
    )
  }

  /* =====================================================
     AI DEMAND FORECAST
     ===================================================== */

  const demandForecast =
    generateDemandForecast(
      SERVICES,
      orders,
    )

  const demandInsights =
    generateDemandInsights(
      demandForecast,
    )

  const topDemandService =
    demandForecast.forecasts[0]

  /* =====================================================
     AI WORKFORCE ALLOCATION
     ===================================================== */

  const workforceAllocation =
    generateWorkforceAllocation(
      SERVICES,
      PARTNERS,
      demandForecast,
    )

  const workforceInsights =
    generateWorkforceInsights(
      workforceAllocation,
    )

  /* =====================================================
     AI EMERGENCY SMART DISPATCH
     ===================================================== */

  const emergencyDispatch =
    generateEmergencyDispatch(
      SERVICES,
      PARTNERS,
      demandForecast,
    )

  const emergencyInsights =
    generateEmergencyInsights(
      emergencyDispatch,
    )

  const highDemandServices =
    demandForecast.forecasts.filter(
      (forecast) =>
        forecast.demandLevel === 'high' ||
        forecast.demandLevel === 'critical',
    ).length

  const capacityRisk =
    workforceAllocation.servicesWithShortage

  const emergencyRisk =
    emergencyDispatch.noProviderServices

  /* =====================================================
     WORKER EARNINGS & DIGITAL WALLET
     ===================================================== */

  const workerEarnings =
    generateWorkerEarnings(orders)

  const providerEarnings =
    generateAllProviderSummaries(
      workerEarnings,
    )

  const earningsInsights =
    generateEarningsInsights(
      providerEarnings,
    )

  const totalProviderEarnings =
    providerEarnings.reduce(
      (sum, provider) =>
        sum + provider.netEarnings,
      0,
    )

  const totalPlatformFees =
    providerEarnings.reduce(
      (sum, provider) =>
        sum + provider.platformFees,
      0,
    )

  const totalAvailableWallet =
    providerEarnings.reduce(
      (sum, provider) =>
        sum + provider.availableAmount,
      0,
    )

  const totalPendingWallet =
    providerEarnings.reduce(
      (sum, provider) =>
        sum + provider.pendingAmount,
      0,
    )

  /* =====================================================
     COOPERATIVE MANAGEMENT
     ===================================================== */

  const approvedMembers =
    PARTNERS.filter(
      (partner) =>
        memberStatuses[partner.id] ===
        'approved',
    ).length

  const pendingMembers =
    PARTNERS.filter(
      (partner) =>
        memberStatuses[partner.id] ===
        'pending',
    ).length

  const suspendedMembers =
    PARTNERS.filter(
      (partner) =>
        memberStatuses[partner.id] ===
        'suspended',
    ).length

  const availableMembers =
    PARTNERS.filter(
      (partner) => partner.available,
    ).length

  const verificationRate =
    PARTNERS.length > 0
      ? Math.round(
          (approvedMembers /
            PARTNERS.length) *
            100,
        )
      : 0

  /*
   * Cooperative financial model for the prototype:
   *
   * 10% platform fee is already represented by the
   * worker earnings module.
   *
   * From that platform fee, the cooperative model
   * proposes:
   *   40% → cooperative reserve
   *   35% → worker welfare
   *   25% → training / skill development
   */
  const cooperativeCommission =
    totalPlatformFees

  const cooperativeReserve =
    cooperativeCommission * 0.4

  const welfareFund =
    cooperativeCommission * 0.35

  const trainingFund =
    cooperativeCommission * 0.25

  const providerPayoutShare =
    revenue > 0
      ? Math.round(
          (totalProviderEarnings /
            revenue) *
            100,
        )
      : 0

  const welfareCoverage =
    Math.min(
      100,
      Math.round(
        (approvedMembers /
          Math.max(1, PARTNERS.length)) *
          100,
      ),
    )

  const emergencyReadyWorkers =
    PARTNERS.filter(
      (partner) => {
        const services =
          partner.services.toLowerCase()

        const emergencySkill =
          services.includes('plumb') ||
          services.includes('electric') ||
          services.includes('driver') ||
          services.includes('care') ||
          services.includes('clean') ||
          services.includes('carpent')

        return (
          partner.available &&
          emergencySkill
        )
      },
    ).length

  const emergencyReadiness =
    PARTNERS.length > 0
      ? Math.round(
          (emergencyReadyWorkers /
            PARTNERS.length) *
            100,
        )
      : 0

  /*
   * Cooperative service-zone distribution.
   *
   * These are demo zones for the SIH prototype.
   * They can later be replaced by real provider
   * GPS / service-area data from the backend.
   */
  const cooperativeZones = [
    {
      name: 'North Chennai',
      workers: 5,
      demand: 18,
    },
    {
      name: 'Central Chennai',
      workers: 7,
      demand: 24,
    },
    {
      name: 'South Chennai',
      workers: 5,
      demand: 20,
    },
    {
      name: 'Chengalpattu',
      workers: 3,
      demand: 11,
    },
  ]

  const highestDemandZone =
    cooperativeZones.reduce(
      (highest, zone) =>
        zone.demand > highest.demand
          ? zone
          : highest,
      cooperativeZones[0],
    )

  /*
   * Fair-wage monitoring.
   *
   * The platform fee is currently 10%, so the
   * worker share target is 90% of service value.
   */
  const fairWageTarget = 90

  const fairWageStatus =
    providerPayoutShare >=
    fairWageTarget
      ? 'Healthy'
      : 'Needs Review'

  function updateMemberStatus(
    partnerId: string,
    partnerName: string,
    status: MemberStatus,
  ) {
    setMemberStatuses(
      (current) => ({
        ...current,
        [partnerId]: status,
      }),
    )

    const statusLabel =
      status === 'approved'
        ? 'approved'
        : status === 'pending'
          ? 'moved to pending review'
          : 'suspended'

    toast(
      `${partnerName} ${statusLabel}.`,
      status === 'approved'
        ? 'success'
        : 'info',
    )
  }

  /* =====================================================
     EXISTING SERVICE DEMAND
     ===================================================== */

  const serviceCounts =
    SERVICES.map((service) => {
      const count = orders.reduce(
        (total, order) =>
          total +
          order.services
            .filter(
              (item) =>
                item.serviceId ===
                service.id,
            )
            .reduce(
              (serviceTotal, item) =>
                serviceTotal +
                item.itemCount,
              0,
            ),
        0,
      )

      return {
        ...service,
        count,
      }
    }).sort(
      (a, b) => b.count - a.count,
    )

  const maxCount = Math.max(
    1,
    ...serviceCounts.map(
      (service) => service.count,
    ),
  )

  /* =====================================================
     ORDER STATUS
     ===================================================== */

  function getNextStatus(
    currentStatus: OrderStatus,
  ): OrderStatus | null {
    const currentIndex =
      ORDER_STATUS_STEPS.findIndex(
        (step) =>
          step.id === currentStatus,
      )

    if (
      currentIndex === -1 ||
      currentIndex >=
        ORDER_STATUS_STEPS.length - 1
    ) {
      return null
    }

    return ORDER_STATUS_STEPS[
      currentIndex + 1
    ].id as OrderStatus
  }

  function handleStatusUpdate(
    orderId: string,
    currentStatus: OrderStatus,
  ) {
    const nextStatus =
      getNextStatus(currentStatus)

    if (!nextStatus) {
      toast(
        'This order is already delivered',
        'info',
      )
      return
    }

    advanceStatus(
      orderId,
      nextStatus,
    )

    const nextLabel =
      ORDER_STATUS_STEPS.find(
        (step) =>
          step.id === nextStatus,
      )?.label ?? nextStatus

    toast(
      `Order #${orderId} moved to ${nextLabel}`,
    )

    setOpenOrderId(null)
  }

  return (
    <div className="min-h-dvh bg-background pb-24">
      <ScreenHeader
        title="Admin Dashboard"
        subtitle="NeXa Link platform overview · Demo"
      />

      {/* =================================================
          KPIs
          ================================================= */}

      <div className="grid grid-cols-2 gap-3 px-4 py-4 sm:grid-cols-4">
        <Kpi
          label="Total Orders"
          value={String(orders.length)}
          icon={PackageCheck}
        />

        <Kpi
          label="Active"
          value={String(activeCount)}
          icon={Activity}
        />

        <Kpi
          label="Revenue"
          value={rupees(revenue)}
          icon={IndianRupee}
        />

        <Kpi
          label="Partners"
          value={String(PARTNERS.length)}
          icon={Users}
        />
      </div>

      {/* =================================================
          DELIVERY SUMMARY
          ================================================= */}

      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Activity className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  In Progress
                </p>

                <p className="font-display text-lg font-bold text-foreground">
                  {activeCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Delivered
                </p>

                <p className="font-display text-lg font-bold text-foreground">
                  {deliveredCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* =================================================
          SMART AI DECISION CENTER
          ================================================= */}

      <div className="px-4 pb-5">
        <div className="overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card">
          <div className="border-b border-primary/15 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                  <BrainCircuit className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-foreground">
                      Smart AI Decision Center
                    </p>

                    <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground">
                      AI ACTIVE
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    AI combines demand, Trust Score, skills,
                    verification, availability and GEO signals
                    to recommend the best operational decision.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={refreshAIDecision}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-2 text-[10px] font-bold text-foreground"
                aria-label="Refresh AI decision"
              >
                <Activity
                  className="h-3.5 w-3.5"
                />
                Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4">
            <AIDecisionMetric
              label="AI Confidence"
              value={
                aiDecision.confidence > 0
                  ? `${aiDecision.confidence}%`
                  : '—'
              }
              icon={Target}
            />

            <AIDecisionMetric
              label="High Demand"
              value={String(
                highDemandServices,
              )}
              icon={TrendingUp}
            />

            <AIDecisionMetric
              label="Capacity Risk"
              value={String(
                capacityRisk,
              )}
              icon={AlertTriangle}
            />

            <AIDecisionMetric
              label="Emergency Risk"
              value={String(
                emergencyRisk,
              )}
              icon={Zap}
            />
          </div>

          <div
            key={aiDecisionRefresh}
            className="border-t border-primary/15 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Live Decision
                </p>

                <p className="mt-1 text-base font-display font-bold text-foreground">
                  {aiDecision.serviceName}
                </p>

                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {aiDecision.orderId} ·{' '}
                  {aiDecision.customerLabel}
                </p>
              </div>

              <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[9px] font-bold text-accent">
                <Clock3 className="h-3 w-3" />
                {aiDecision.priority} PRIORITY
              </span>
            </div>

            {aiDecision.recommendedProvider ? (
              <div className="mt-3 rounded-2xl border border-primary/25 bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-display font-extrabold text-primary">
                    1
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-foreground">
                        {aiDecision.recommendedProvider.providerName}
                      </p>

                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                        {aiDecision.recommendedProvider.score}% AI MATCH
                      </span>

                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold text-accent">
                        TRUST {aiDecision.recommendedProvider.trustScore}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-secondary px-2 py-1 text-[9px] font-medium text-foreground">
                        ⭐ {aiDecision.recommendedProvider.rating.toFixed(1)}
                      </span>

                      <span className="rounded-full bg-secondary px-2 py-1 text-[9px] font-medium text-foreground">
                        📍 {aiDecision.recommendedProvider.distanceKm.toFixed(1)} km
                      </span>

                      <span className="rounded-full bg-secondary px-2 py-1 text-[9px] font-medium text-foreground">
                        {aiDecision.recommendedProvider.available
                          ? '✓ Available'
                          : 'Offline'}
                      </span>

                      <span className="rounded-full bg-secondary px-2 py-1 text-[9px] font-medium text-foreground">
                        {aiDecision.recommendedProvider.verified
                          ? '✓ Verified'
                          : 'Verification needed'}
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Why AI selected this worker
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {aiDecision.recommendedProvider.reasons.map(
                          (reason) => (
                            <span
                              key={reason}
                              className="rounded-full bg-primary/5 px-2.5 py-1 text-[9px] font-medium text-muted-foreground"
                            >
                              ✓ {reason}
                            </span>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl bg-secondary/50 p-3">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="h-3.5 w-3.5 text-primary" />

                        <p className="text-[10px] font-bold text-foreground">
                          Explainable AI reasoning
                        </p>
                      </div>

                      <div className="mt-2 space-y-1.5">
                        {aiDecision.reasons.map(
                          (reason, index) => (
                            <div
                              key={`${reason}-${index}`}
                              className="flex gap-2"
                            >
                              <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />

                              <p className="text-[10px] leading-relaxed text-muted-foreground">
                                {reason}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={
                          approveAIRecommendation
                        }
                        className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[10px] font-bold text-primary-foreground"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve AI Recommendation
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate('provider')
                        }
                        className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-[10px] font-bold text-foreground"
                      >
                        <Users className="h-3.5 w-3.5" />
                        View Providers
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />

                  <div>
                    <p className="text-sm font-bold text-foreground">
                      No safe AI assignment available
                    </p>

                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      No verified, available provider has an
                      exact service match. Review workforce
                      capacity or cooperative coverage.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Top AI Candidates
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Ranked using multiple operational signals.
                  </p>
                </div>

                <span className="rounded-full bg-secondary px-2 py-1 text-[9px] font-bold text-muted-foreground">
                  {aiDecision.candidates.length} candidates
                </span>
              </div>

              <div className="mt-2 space-y-2">
                {aiDecision.candidates.map(
                  (candidate, index) => (
                    <div
                      key={candidate.providerId}
                      className="rounded-xl border border-border bg-card p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-[10px] font-bold text-foreground">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="text-xs font-semibold text-foreground">
                              {candidate.providerName}
                            </p>

                            <span className="text-[9px] font-bold text-primary">
                              {candidate.score}%
                            </span>
                          </div>

                          <p className="mt-0.5 text-[9px] text-muted-foreground">
                            Trust {candidate.trustScore} ·{' '}
                            {candidate.distanceKm.toFixed(1)} km ·{' '}
                            {candidate.serviceMatch
                              ? 'skill matched'
                              : 'skill gap'}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2 py-1 text-[8px] font-bold ${
                            candidate.available &&
                            candidate.verified
                              ? 'bg-primary/10 text-primary'
                              : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          {candidate.available &&
                          candidate.verified
                            ? 'READY'
                            : 'REVIEW'}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-primary/15 bg-primary/5 p-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />

                <p className="text-[10px] font-bold text-foreground">
                  AI Workforce Actions
                </p>
              </div>

              <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
                <AIAction
                  label={
                    highDemandServices > 0
                      ? 'Prepare high-demand workers'
                      : 'Monitor service demand'
                  }
                  detail={
                    highDemandServices > 0
                      ? `${highDemandServices} services need attention.`
                      : 'Demand is currently manageable.'
                  }
                />

                <AIAction
                  label={
                    capacityRisk > 0
                      ? 'Move capacity to shortages'
                      : 'Capacity balanced'
                  }
                  detail={
                    capacityRisk > 0
                      ? `${capacityRisk} services show shortage.`
                      : 'No major workforce shortage detected.'
                  }
                />

                <AIAction
                  label={
                    emergencyRisk > 0
                      ? 'Strengthen emergency coverage'
                      : 'Emergency coverage ready'
                  }
                  detail={
                    emergencyRisk > 0
                      ? `${emergencyRisk} services lack emergency coverage.`
                      : 'Emergency dispatch has suitable coverage.'
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          COOPERATIVE MANAGEMENT
          ================================================= */}

      <div className="px-4 pb-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />

              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Cooperative Management
              </p>
            </div>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Manage cooperative members, fair wages,
              worker welfare and service capacity.
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
            <ShieldCheck className="h-3 w-3" />
            COOPERATIVE
          </div>
        </div>

        {/* Cooperative KPIs */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ForecastStat
            label="Members"
            value={String(PARTNERS.length)}
            description="registered providers"
            icon={Users}
          />

          <ForecastStat
            label="Verified"
            value={`${verificationRate}%`}
            description={`${approvedMembers} approved members`}
            icon={BadgeCheck}
          />

          <ForecastStat
            label="Available"
            value={String(availableMembers)}
            description="workers online / ready"
            icon={UserCheck}
          />

          <ForecastStat
            label="Welfare"
            value={`${welfareCoverage}%`}
            description="cooperative coverage"
            icon={HeartPulse}
          />
        </div>

        {/* Cooperative financial model */}

        <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Building2 className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground">
                Cooperative Financial Model
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Platform commission is proposed to
                support the cooperative reserve, worker
                welfare and skill development.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <CooperativeMoneyStat
              label="Commission"
              value={rupees(
                cooperativeCommission,
              )}
              icon={CircleDollarSign}
            />

            <CooperativeMoneyStat
              label="Reserve"
              value={rupees(
                cooperativeReserve,
              )}
              icon={Wallet}
            />

            <CooperativeMoneyStat
              label="Welfare Fund"
              value={rupees(welfareFund)}
              icon={HeartPulse}
            />

            <CooperativeMoneyStat
              label="Training Fund"
              value={rupees(trainingFund)}
              icon={Sparkles}
            />
          </div>
        </div>

        {/* Cooperative performance */}

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />

              <p className="text-sm font-bold text-foreground">
                Fair-Wage Monitoring
              </p>
            </div>

            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Worker payout share is compared with the
              cooperative target of 90%.
            </p>

            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {providerPayoutShare}%
                </p>

                <p className="text-[10px] text-muted-foreground">
                  current provider payout share
                </p>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  fairWageStatus ===
                  'Healthy'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-accent/10 text-accent'
                }`}
              >
                {fairWageStatus}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${Math.min(
                    100,
                    providerPayoutShare,
                  )}%`,
                }}
                transition={{
                  duration: 0.6,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-[9px] text-muted-foreground">
              <span>0%</span>
              <span>
                Target {fairWageTarget}%
              </span>
              <span>100%</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />

              <p className="text-sm font-bold text-foreground">
                Worker Welfare
              </p>
            </div>

            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Cooperative welfare and insurance
              participation overview.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <CooperativeMetric
                label="Welfare Enrolled"
                value={`${welfareCoverage}%`}
              />

              <CooperativeMetric
                label="Emergency Ready"
                value={`${emergencyReadiness}%`}
              />

              <CooperativeMetric
                label="Pending Review"
                value={String(
                  pendingMembers,
                )}
              />

              <CooperativeMetric
                label="Suspended"
                value={String(
                  suspendedMembers,
                )}
              />
            </div>
          </div>
        </div>

        {/* Worker distribution */}

        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />

              <p className="text-sm font-bold text-foreground">
                Worker Distribution by Area
              </p>
            </div>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Demo cooperative service-zone capacity.
            </p>
          </div>

          <div className="divide-y divide-border">
            {cooperativeZones.map(
              (zone) => {
                const maxWorkers =
                  Math.max(
                    1,
                    ...cooperativeZones.map(
                      (item) =>
                        item.workers,
                    ),
                  )

                return (
                  <div
                    key={zone.name}
                    className="px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {zone.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {zone.workers} workers ·{' '}
                          {zone.demand} service
                          requests
                        </p>
                      </div>

                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                        {Math.round(
                          (zone.workers /
                            maxWorkers) *
                            100,
                        )}
                        % capacity
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${Math.min(
                            100,
                            (zone.workers /
                              maxWorkers) *
                              100,
                          )}%`,
                        }}
                        transition={{
                          duration: 0.5,
                        }}
                      />
                    </div>
                  </div>
                )
              },
            )}
          </div>

          <div className="border-t border-border bg-secondary/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />

              <p className="text-xs font-semibold text-foreground">
                Highest Demand Zone
              </p>
            </div>

            <p className="mt-1 text-[11px] text-muted-foreground">
              {highestDemandZone.name} currently has the
              highest demo demand with{' '}
              <strong className="text-foreground">
                {highestDemandZone.demand}
              </strong>{' '}
              requests.
            </p>
          </div>
        </div>

        {/* Service demand by cooperative zone */}

        <div className="mt-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />

            <p className="text-sm font-bold text-foreground">
              Service Demand by Area
            </p>
          </div>

          <p className="mt-1 text-[11px] text-muted-foreground">
            Helps the cooperative move workers toward
            high-demand locations.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {cooperativeZones.map(
              (zone) => (
                <div
                  key={zone.name}
                  className="rounded-xl border border-border bg-secondary/30 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground">
                      {zone.name}
                    </p>

                    <span className="text-xs font-bold text-primary">
                      {zone.demand}
                    </span>
                  </div>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    requests
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Cooperative member management */}

        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />

                  <p className="text-sm font-bold text-foreground">
                    Cooperative Members
                  </p>
                </div>

                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Verification and cooperative membership
                  controls.
                </p>
              </div>

              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-bold text-primary">
                {approvedMembers} APPROVED
              </span>
            </div>
          </div>

          <div className="divide-y divide-border">
            {PARTNERS.map(
              (partner) => {
                const status =
                  memberStatuses[
                    partner.id
                  ] ?? 'approved'

                return (
                  <div
                    key={partner.id}
                    className="px-4 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-display text-xs font-extrabold text-primary">
                        {partner.name.slice(
                          0,
                          2,
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {partner.name}
                          </p>

                          <MemberStatusBadge
                            status={
                              status
                            }
                          />
                        </div>

                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {partner.services}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-foreground">
                            ⭐{' '}
                            {partner.rating.toFixed(
                              1,
                            )}
                          </span>

                          <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-foreground">
                            📍{' '}
                            {
                              partner.distance
                            }
                          </span>

                          <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-foreground">
                            ⏱️{' '}
                            {
                              partner.turnaround
                            }
                          </span>

                          <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-foreground">
                            {partner.available
                              ? '✓ Available'
                              : 'Offline'}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {status !==
                            'approved' && (
                            <button
                              type="button"
                              onClick={() =>
                                updateMemberStatus(
                                  partner.id,
                                  partner.name,
                                  'approved',
                                )
                              }
                              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[10px] font-bold text-primary-foreground"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Approve
                            </button>
                          )}

                          {status !==
                            'pending' && (
                            <button
                              type="button"
                              onClick={() =>
                                updateMemberStatus(
                                  partner.id,
                                  partner.name,
                                  'pending',
                                )
                              }
                              className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-[10px] font-bold text-foreground"
                            >
                              <Activity className="h-3.5 w-3.5" />
                              Review
                            </button>
                          )}

                          {status !==
                            'suspended' && (
                            <button
                              type="button"
                              onClick={() =>
                                updateMemberStatus(
                                  partner.id,
                                  partner.name,
                                  'suspended',
                                )
                              }
                              className="flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-2 text-[10px] font-bold text-destructive"
                            >
                              <AlertTriangle className="h-3.5 w-3.5" />
                              Suspend
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              },
            )}
          </div>
        </div>

        {/* Cooperative governance */}

        <div className="mt-3 rounded-2xl border border-primary/20 bg-card p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />

            <p className="text-sm font-bold text-foreground">
              Cooperative Governance
            </p>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <GovernanceCard
              title="Member Ownership"
              value="Cooperative"
              description="Workers participate as cooperative members."
              icon={Users}
            />

            <GovernanceCard
              title="Fair Wage Policy"
              value="90% Target"
              description="Worker payout target before platform allocation."
              icon={Scale}
            />

            <GovernanceCard
              title="Worker Protection"
              value="Welfare + Insurance"
              description="Cooperative funds can support welfare and protection."
              icon={ShieldCheck}
            />
          </div>
        </div>
      </div>

      {/* =================================================
          AI DEMAND FORECAST
          ================================================= */}

      <div className="px-4 pb-5">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              AI Demand Forecast
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Predictive workforce planning
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
            <Sparkles className="h-3 w-3" />
            AI ASSISTED
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ForecastStat
            label="Predicted Demand"
            value={String(
              demandForecast.predictedTotalDemand,
            )}
            description="service requests"
            icon={Activity}
          />

          <ForecastStat
            label="High Demand"
            value={String(
              demandForecast.highDemandServices,
            )}
            description="services"
            icon={TrendingUp}
          />

          <ForecastStat
            label="Workers Needed"
            value={String(
              demandForecast.recommendedWorkers,
            )}
            description="recommended capacity"
            icon={Users}
          />

          <ForecastStat
            label="Peak Period"
            value={demandForecast.peakTime}
            description="expected activity"
            icon={AlertTriangle}
            compact
          />
        </div>

        {topDemandService && (
          <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-foreground">
                    AI Priority:{' '}
                    {topDemandService.serviceName}
                  </p>

                  <DemandBadge
                    level={
                      topDemandService.demandLevel
                    }
                  />
                </div>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Predicted demand of{' '}
                  <strong className="text-foreground">
                    {
                      topDemandService.predictedDemand
                    }
                  </strong>{' '}
                  requests with approximately{' '}
                  <strong className="text-foreground">
                    {
                      topDemandService.recommendedWorkers
                    }
                  </strong>{' '}
                  worker
                  {topDemandService.recommendedWorkers !==
                  1
                    ? 's'
                    : ''}{' '}
                  recommended.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />

            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              AI Insights
            </p>
          </div>

          <div className="mt-3 space-y-2">
            {demandInsights.map(
              (insight, index) => (
                <div
                  key={index}
                  className="flex gap-2.5"
                >
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {insight}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-bold text-foreground">
              Service Forecast
            </p>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Demand prediction and workforce allocation
            </p>
          </div>

          <div className="divide-y divide-border">
            {demandForecast.forecasts.map(
              (forecast) => (
                <div
                  key={forecast.serviceId}
                  className="px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {forecast.serviceName}
                        </p>

                        <DemandBadge
                          level={
                            forecast.demandLevel
                          }
                        />
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                        <span>
                          Current:{' '}
                          <strong className="text-foreground">
                            {
                              forecast.currentDemand
                            }
                          </strong>
                        </span>

                        <span>
                          Predicted:{' '}
                          <strong className="text-foreground">
                            {
                              forecast.predictedDemand
                            }
                          </strong>
                        </span>

                        <span>
                          Workers:{' '}
                          <strong className="text-foreground">
                            {
                              forecast.recommendedWorkers
                            }
                          </strong>
                        </span>

                        <span>
                          Peak:{' '}
                          <strong className="text-foreground">
                            {forecast.peakTime}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <TrendIndicator
                      trend={forecast.trend}
                    />
                  </div>

                  {(forecast.emergencyBookings >
                    0 ||
                    forecast.onDemandBookings >
                      0) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {forecast.emergencyBookings >
                        0 && (
                        <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-[10px] font-bold text-destructive">
                          🚨{' '}
                          {
                            forecast.emergencyBookings
                          }{' '}
                          emergency
                        </span>
                      )}

                      {forecast.onDemandBookings >
                        0 && (
                        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold text-accent">
                          ⚡{' '}
                          {
                            forecast.onDemandBookings
                          }{' '}
                          on-demand
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          AI WORKFORCE ALLOCATION
          ================================================= */}

      <div className="px-4 pb-5">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              AI Workforce Allocation
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              AI recommends verified partners based on demand, skills, availability, rating and GEO priority.
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
            <Sparkles className="h-3 w-3" />
            AI MATCH
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ForecastStat
            label="Workers Required"
            value={String(
              workforceAllocation.totalWorkersRequired,
            )}
            description="AI planned capacity"
            icon={Users}
          />

          <ForecastStat
            label="Available"
            value={String(
              workforceAllocation.totalWorkersAvailable,
            )}
            description="matched partners"
            icon={CheckCircle2}
          />

          <ForecastStat
            label="Covered"
            value={String(
              workforceAllocation.servicesCovered,
            )}
            description="services fully covered"
            icon={PackageCheck}
          />

          <ForecastStat
            label="Shortage"
            value={String(
              workforceAllocation.servicesWithShortage,
            )}
            description="services needing attention"
            icon={AlertTriangle}
          />
        </div>

        <div className="mt-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />

            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Workforce Insights
            </p>
          </div>

          <div className="mt-3 space-y-2">
            {workforceInsights.map(
              (insight, index) => (
                <div
                  key={index}
                  className="flex gap-2.5"
                >
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {insight}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-bold text-foreground">
              AI Recommended Workers
            </p>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Best available providers for predicted service demand
            </p>
          </div>

          <div className="divide-y divide-border">
            {workforceAllocation.allocations.map(
              (allocation) => (
                <div
                  key={allocation.serviceId}
                  className="px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {allocation.serviceName}
                        </p>

                        <DemandBadge
                          level={
                            allocation.demandLevel
                          }
                        />

                        <WorkforceStatusBadge
                          status={
                            allocation.status
                          }
                        />
                      </div>

                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                        <span>
                          Predicted:{' '}
                          <strong className="text-foreground">
                            {
                              allocation.predictedDemand
                            }
                          </strong>
                        </span>

                        <span>
                          Required:{' '}
                          <strong className="text-foreground">
                            {
                              allocation.workersRequired
                            }
                          </strong>
                        </span>

                        <span>
                          Available:{' '}
                          <strong className="text-foreground">
                            {
                              allocation.availableWorkers
                            }
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {allocation.recommendedWorkers.length >
                  0 ? (
                    <div className="mt-3 space-y-2">
                      {allocation.recommendedWorkers.map(
                        (
                          worker,
                          workerIndex,
                        ) => (
                          <div
                            key={
                              worker.providerId
                            }
                            className="rounded-xl border border-border bg-secondary/30 p-3"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                                {workerIndex +
                                  1}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold text-foreground">
                                    {
                                      worker.providerName
                                    }
                                  </p>

                                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                                    {worker.score}
                                    % AI MATCH
                                  </span>
                                </div>

                                <p className="mt-0.5 text-[11px] text-muted-foreground">
                                  {
                                    worker.cooperative
                                  }
                                </p>

                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  <span className="rounded-full bg-card px-2 py-1 text-[10px] font-medium text-foreground">
                                    ⭐{' '}
                                    {worker.rating.toFixed(
                                      1,
                                    )}
                                  </span>

                                  <span className="rounded-full bg-card px-2 py-1 text-[10px] font-medium text-foreground">
                                    📍{' '}
                                    {worker.distanceKm.toFixed(
                                      1,
                                    )}{' '}
                                    km
                                  </span>

                                  <span className="rounded-full bg-card px-2 py-1 text-[10px] font-medium text-foreground">
                                    {worker.available
                                      ? '✓ Available'
                                      : 'Unavailable'}
                                  </span>

                                  <span className="rounded-full bg-card px-2 py-1 text-[10px] font-medium text-foreground">
                                    {
                                      worker.turnaround
                                    }
                                  </span>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {worker.reasons.map(
                                    (
                                      reason,
                                    ) => (
                                      <span
                                        key={
                                          reason
                                        }
                                        className="rounded-full bg-primary/5 px-2 py-0.5 text-[9px] font-medium capitalize text-muted-foreground"
                                      >
                                        {
                                          reason
                                        }
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-xs font-semibold text-destructive">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      No available verified worker currently matches this service.
                    </div>
                  )}
                </div>
              ),
            )}

            {workforceAllocation.allocations.length ===
              0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                AI workforce allocation is waiting for demand data.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          AI EMERGENCY SMART DISPATCH
          ================================================= */}

      <div className="px-4 pb-5">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              AI Emergency Smart Dispatch
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              AI prioritizes the best available provider for urgent service requests.
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-[10px] font-bold text-destructive">
            <AlertTriangle className="h-3 w-3" />
            EMERGENCY AI
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ForecastStat
            label="Emergency Bookings"
            value={String(
              emergencyDispatch.emergencyBookings,
            )}
            description="urgent requests"
            icon={AlertTriangle}
          />

          <ForecastStat
            label="Services"
            value={String(
              emergencyDispatch.servicesNeedingDispatch,
            )}
            description="needing dispatch"
            icon={Activity}
          />

          <ForecastStat
            label="Ready"
            value={String(
              emergencyDispatch.readyDispatches,
            )}
            description="primary + backup"
            icon={CheckCircle2}
          />

          <ForecastStat
            label="No Provider"
            value={String(
              emergencyDispatch.noProviderServices,
            )}
            description="needs attention"
            icon={Users}
          />
        </div>

        <div className="mt-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />

            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Dispatch Insights
            </p>
          </div>

          <div className="mt-3 space-y-2">
            {emergencyInsights.map(
              (insight, index) => (
                <div
                  key={index}
                  className="flex gap-2.5"
                >
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {insight}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-bold text-foreground">
              Emergency Dispatch Queue
            </p>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              AI-selected primary and backup providers
            </p>
          </div>

          <div className="divide-y divide-border">
            {emergencyDispatch.dispatches.map(
              (dispatch) => (
                <div
                  key={dispatch.serviceId}
                  className="px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {dispatch.serviceName}
                        </p>

                        <DemandBadge
                          level={
                            dispatch.demandLevel
                          }
                        />

                        <EmergencyStatusBadge
                          status={
                            dispatch.status
                          }
                        />
                      </div>

                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {dispatch.emergencyBookings}{' '}
                        emergency booking
                        {dispatch.emergencyBookings !==
                        1
                          ? 's'
                          : ''}{' '}
                        awaiting smart dispatch
                      </p>
                    </div>
                  </div>

                  {dispatch.recommendedProvider ? (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <DispatchProviderCard
                        provider={
                          dispatch.recommendedProvider
                        }
                        label="Primary Provider"
                      />

                      {dispatch.backupProvider ? (
                        <DispatchProviderCard
                          provider={
                            dispatch.backupProvider
                          }
                          label="Backup Provider"
                        />
                      ) : (
                        <div className="rounded-xl border border-accent/30 bg-accent/5 p-3">
                          <p className="text-xs font-semibold text-accent">
                            Backup unavailable
                          </p>

                          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                            Only one suitable emergency provider is currently available.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-xs font-semibold text-destructive">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      No available emergency provider currently matches this service.
                    </div>
                  )}

                  {dispatch.candidates.length >
                    0 && (
                    <div className="mt-3">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Other matched providers
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {dispatch.candidates
                          .slice(0, 5)
                          .map(
                            (
                              candidate,
                            ) => (
                              <span
                                key={
                                  candidate.providerId
                                }
                                className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-foreground"
                              >
                                {
                                  candidate.providerName
                                }{' '}
                                ·{' '}
                                {
                                  candidate.score
                                }
                                %
                              </span>
                            ),
                          )}
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}

            {emergencyDispatch.dispatches.length ===
              0 && (
              <div className="px-4 py-8 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-primary" />

                <p className="mt-2 text-sm font-semibold text-foreground">
                  No emergency dispatches required
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  AI dispatch will activate automatically when emergency demand is detected.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          WORKER EARNINGS & DIGITAL WALLET
          ================================================= */}

      <div className="px-4 pb-5">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Worker Earnings & Digital Wallet
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Provider earnings, platform fees and wallet settlement overview.
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
            <Wallet className="h-3 w-3" />
            WALLET
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ForecastStat
            label="Provider Earnings"
            value={rupees(
              totalProviderEarnings,
            )}
            description="net earnings"
            icon={IndianRupee}
          />

          <ForecastStat
            label="Platform Fees"
            value={rupees(
              totalPlatformFees,
            )}
            description="10% platform fee"
            icon={IndianRupee}
          />

          <ForecastStat
            label="Available Wallet"
            value={rupees(
              totalAvailableWallet,
            )}
            description="ready for payout"
            icon={Wallet}
          />

          <ForecastStat
            label="Pending"
            value={rupees(
              totalPendingWallet,
            )}
            description="awaiting settlement"
            icon={Activity}
          />
        </div>

        <div className="mt-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />

            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Earnings Insights
            </p>
          </div>

          <div className="mt-3 space-y-2">
            {earningsInsights.map(
              (insight, index) => (
                <div
                  key={index}
                  className="flex gap-2.5"
                >
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {insight}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />

              <p className="text-sm font-bold text-foreground">
                Provider Wallets
              </p>
            </div>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Earnings and wallet balances by provider
            </p>
          </div>

          <div className="divide-y divide-border">
            {providerEarnings.map(
              (provider) => (
                <div
                  key={provider.providerId}
                  className="px-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Wallet className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {
                              provider.providerName
                            }
                          </p>

                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {
                              provider.completedJobs
                            }{' '}
                            completed job
                            {provider.completedJobs !==
                            1
                              ? 's'
                              : ''}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">
                            {rupees(
                              provider.netEarnings,
                            )}
                          </p>

                          <p className="text-[10px] text-muted-foreground">
                            net earnings
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <EarningsStat
                          label="Jobs"
                          value={String(
                            provider.totalJobs,
                          )}
                        />

                        <EarningsStat
                          label="Available"
                          value={rupees(
                            provider.availableAmount,
                          )}
                        />

                        <EarningsStat
                          label="Pending"
                          value={rupees(
                            provider.pendingAmount,
                          )}
                        />

                        <EarningsStat
                          label="Avg / Job"
                          value={rupees(
                            provider.averagePerJob,
                          )}
                        />
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                          Wallet{' '}
                          {rupees(
                            provider.availableAmount,
                          )}
                        </span>

                        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-foreground">
                          Fees{' '}
                          {rupees(
                            provider.platformFees,
                          )}
                        </span>

                        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-foreground">
                          Gross{' '}
                          {rupees(
                            provider.grossEarnings,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}

            {providerEarnings.length === 0 && (
              <div className="px-4 py-8 text-center">
                <Wallet className="mx-auto h-8 w-8 text-muted-foreground" />

                <p className="mt-2 text-sm font-semibold text-foreground">
                  No provider earnings yet
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Earnings will appear automatically after completed orders.
                </p>
              </div>
            )}
          </div>
        </div>

        {workerEarnings.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-bold text-foreground">
                Recent Earnings
              </p>

              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Provider earnings generated from completed orders
              </p>
            </div>

            <div className="divide-y divide-border">
              {workerEarnings
                .slice(0, 8)
                .map((earning) => (
                  <div
                    key={earning.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <IndianRupee className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {earning.providerName}
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {earning.service} · Order #
                        {earning.orderId}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">
                        +{rupees(
                          earning.netEarning,
                        )}
                      </p>

                      <span
                        className={`text-[9px] font-bold uppercase ${
                          earning.status ===
                          'available'
                            ? 'text-primary'
                            : earning.status ===
                                'paid'
                              ? 'text-primary'
                              : 'text-accent'
                        }`}
                      >
                        {earning.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* =================================================
          ORDER MANAGEMENT
          ================================================= */}

      <div className="px-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Order Management
          </p>

          <span className="text-[11px] text-muted-foreground">
            {orders.length} total
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="hidden grid-cols-4 gap-2 border-b border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
            <span>Order</span>
            <span>Date</span>
            <span>Status</span>
            <span className="text-right">
              Total
            </span>
          </div>

          <div className="divide-y divide-border">
            {orders.map(
              (order, index) => {
                const stepIdx =
                  ORDER_STATUS_STEPS.findIndex(
                    (step) =>
                      step.id ===
                      order.status,
                  )

                const nextStatus =
                  getNextStatus(
                    order.status,
                  )

                const isOpen =
                  openOrderId ===
                  order.id

                const isDelivered =
                  order.status ===
                  'delivered'

                const assignedOrder =
                  order as typeof order & {
                    providerId?: string
                    providerName?: string
                    providerIds?: Record<
                      string,
                      string
                    >
                    providerNames?: Record<
                      string,
                      string
                    >
                    paymentStatus?: string
                    transactionId?: string
                    paidAt?: number
                  }

                const firstAssignedProviderId =
                  assignedOrder.providerId

                const firstAssignedProvider =
                  firstAssignedProviderId
                    ? PARTNERS.find(
                        (partner) =>
                          partner.id ===
                          firstAssignedProviderId,
                      )
                    : undefined

                const orderProviderIds =
                  assignedOrder.providerIds ??
                  {}

                const orderProviderNames =
                  assignedOrder.providerNames ??
                  {}

                const assignedProviderEntries =
                  order.services.map(
                    (service) => {
                      const providerId =
                        orderProviderIds[
                          service.serviceId
                        ] ??
                        firstAssignedProviderId

                      const provider =
                        providerId
                          ? PARTNERS.find(
                              (partner) =>
                                partner.id ===
                                providerId,
                            )
                          : undefined

                      return {
                        service,
                        providerId,
                        provider,
                        providerName:
                          orderProviderNames[
                            service.serviceId
                          ] ??
                          provider?.name ??
                          assignedOrder.providerName ??
                          'Not assigned',
                      }
                    },
                  )

                const orderEarnings =
                  workerEarnings.filter(
                    (earning) =>
                      earning.orderId ===
                      order.id,
                  )

                const orderProviderNet =
                  orderEarnings.reduce(
                    (sum, earning) =>
                      sum +
                      earning.netEarning,
                    0,
                  )

                const paymentStatus =
                  assignedOrder.paymentStatus ??
                  order.paymentDetails
                    ?.status ??
                  'pending'

                const bookingType =
                  order.bookingType ??
                  'scheduled'

                return (
                  <motion.div
                    key={order.id}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.04,
                    }}
                    className="bg-card"
                  >
                    <div className="grid grid-cols-2 gap-2 px-4 py-3 sm:grid-cols-4 sm:items-center">
                      <button
                        onClick={() =>
                          navigate({
                            name: 'tracking',
                            orderId:
                              order.id,
                          })
                        }
                        className="text-left"
                      >
                        <span className="font-mono text-sm font-bold text-foreground">
                          #{order.id}
                        </span>

                        <p className="mt-0.5 text-[11px] text-muted-foreground sm:hidden">
                          Tap to view tracking
                        </p>
                      </button>

                      <span className="text-xs text-muted-foreground">
                        {order.pickupDate}
                      </span>

                      <span
                        className={`col-span-1 inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          isDelivered
                            ? 'bg-primary/12 text-primary'
                            : 'bg-accent/12 text-accent'
                        }`}
                      >
                        {
                          ORDER_STATUS_STEPS[
                            stepIdx
                          ]?.label
                        }
                      </span>

                      <div className="flex items-center justify-end gap-2">
                        <span className="font-display text-sm font-bold text-foreground">
                          {rupees(
                            order.total,
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setOpenOrderId(
                              isOpen
                                ? null
                                : order.id,
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground"
                          aria-label={
                            isOpen
                              ? 'Close order management'
                              : 'Manage order'
                          }
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              isOpen
                                ? 'rotate-180'
                                : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: 'auto',
                        }}
                        className="border-t border-border bg-secondary/30 px-4 py-4"
                      >
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-border bg-card p-3">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                              Pickup Details
                            </p>

                            <p className="mt-1.5 text-sm font-semibold text-foreground">
                              {
                                order.pickupDate
                              }
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {
                                order.pickupSlot
                              }
                            </p>
                          </div>

                          <div className="rounded-xl border border-border bg-card p-3">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                              Address
                            </p>

                            <p className="mt-1.5 text-sm font-semibold text-foreground">
                              {
                                order.address
                                  .label
                              }
                            </p>

                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {
                                order.address
                                  .line
                              }
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          <OrderInfoCard
                            label="Booking Type"
                            value={
                              bookingType ===
                              'emergency'
                                ? '🚨 Emergency'
                                : bookingType ===
                                    'on-demand'
                                  ? '⚡ On-demand'
                                  : '📅 Scheduled'
                            }
                          />

                          <OrderInfoCard
                            label="Payment"
                            value={
                              order.payment ??
                              'UPI'
                            }
                          />

                          <OrderInfoCard
                            label="Payment Status"
                            value={paymentStatus
                              .toString()
                              .toUpperCase()}
                          />

                          <OrderInfoCard
                            label="Provider Earnings"
                            value={rupees(
                              orderProviderNet,
                            )}
                          />
                        </div>

                        <div className="mt-4 overflow-hidden rounded-xl border border-primary/20 bg-card">
                          <div className="border-b border-primary/10 bg-primary/5 px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-primary" />

                                  <p className="text-sm font-bold text-foreground">
                                    Provider Assignment
                                  </p>
                                </div>

                                <p className="mt-0.5 text-[11px] text-muted-foreground">
                                  AI/GEO matched service providers for this order
                                </p>
                              </div>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase ${
                                  assignedProviderEntries.some(
                                    (entry) =>
                                      entry.provider,
                                  )
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-destructive/10 text-destructive'
                                }`}
                              >
                                {assignedProviderEntries.some(
                                  (entry) =>
                                    entry.provider,
                                )
                                  ? 'Assigned'
                                  : 'Unassigned'}
                              </span>
                            </div>
                          </div>

                          <div className="divide-y divide-border">
                            {assignedProviderEntries.map(
                              (entry) => {
                                const provider =
                                  entry.provider

                                const serviceEarnings =
                                  orderEarnings
                                    .filter(
                                      (
                                        earning,
                                      ) =>
                                        earning.service
                                          .toLowerCase()
                                          .includes(
                                            entry.service.serviceName
                                              .toLowerCase(),
                                          ) ||
                                        entry.service.serviceName
                                          .toLowerCase()
                                          .includes(
                                            earning.service
                                              .toLowerCase(),
                                          ),
                                    )
                                    .reduce(
                                      (
                                        sum,
                                        earning,
                                      ) =>
                                        sum +
                                        earning.netEarning,
                                      0,
                                    )

                                return (
                                  <div
                                    key={
                                      entry.service.serviceId
                                    }
                                    className="p-4"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Users className="h-4 w-4" />
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <p className="text-sm font-bold text-foreground">
                                            {
                                              entry.service.serviceName
                                            }
                                          </p>

                                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-bold text-foreground">
                                            {
                                              entry.service.itemCount
                                            }{' '}
                                            item
                                            {entry.service.itemCount !==
                                            1
                                              ? 's'
                                              : ''}
                                          </span>
                                        </div>

                                        {provider ? (
                                          <>
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                              <p className="text-sm font-semibold text-primary">
                                                {
                                                  provider.name
                                                }
                                              </p>

                                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                                                ✓ ASSIGNED
                                              </span>
                                            </div>

                                            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                              <ProviderDetail
                                                label="Provider ID"
                                                value={
                                                  entry.providerId ??
                                                  provider.id
                                                }
                                              />

                                              <ProviderDetail
                                                label="Rating"
                                                value={`⭐ ${provider.rating.toFixed(
                                                  1,
                                                )}`}
                                              />

                                              <ProviderDetail
                                                label="Distance"
                                                value={
                                                  provider.distance
                                                }
                                              />

                                              <ProviderDetail
                                                label="Earnings"
                                                value={rupees(
                                                  serviceEarnings,
                                                )}
                                              />
                                            </div>

                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                              <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-foreground">
                                                🛠️{' '}
                                                {
                                                  provider.services
                                                }
                                              </span>

                                              <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-foreground">
                                                {provider.available
                                                  ? '✓ Available'
                                                  : 'Unavailable'}
                                              </span>

                                              <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-foreground">
                                                ⏱️{' '}
                                                {
                                                  provider.turnaround
                                                }
                                              </span>
                                            </div>
                                          </>
                                        ) : (
                                          <div className="mt-2 flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-xs font-semibold text-destructive">
                                            <AlertTriangle className="h-4 w-4 shrink-0" />

                                            No provider assigned to this service.
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              },
                            )}
                          </div>

                          <div className="border-t border-border bg-secondary/30 px-4 py-3">
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                              <AssignmentStat
                                label="Services"
                                value={String(
                                  order.services
                                    .length,
                                )}
                              />

                              <AssignmentStat
                                label="Assigned"
                                value={String(
                                  assignedProviderEntries.filter(
                                    (
                                      entry,
                                    ) =>
                                      Boolean(
                                        entry.provider,
                                      ),
                                  ).length,
                                )}
                              />

                              <AssignmentStat
                                label="Providers"
                                value={String(
                                  new Set(
                                    assignedProviderEntries
                                      .map(
                                        (
                                          entry,
                                        ) =>
                                          entry.providerId,
                                      )
                                      .filter(
                                        Boolean,
                                      ),
                                  ).size,
                                )}
                              />

                              <AssignmentStat
                                label="Priority"
                                value={
                                  bookingType ===
                                  'emergency'
                                    ? 'EMERGENCY'
                                    : bookingType ===
                                        'on-demand'
                                      ? 'ON-DEMAND'
                                      : 'NORMAL'
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 rounded-xl border border-border bg-card p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Services
                          </p>

                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {order.services.map(
                              (
                                service,
                              ) => (
                                <span
                                  key={
                                    service.serviceId
                                  }
                                  className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground"
                                >
                                  {
                                    service.serviceName
                                  }{' '}
                                  ·{' '}
                                  {
                                    service.itemCount
                                  }
                                </span>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Laundry Workflow
                          </p>

                          <div className="space-y-2">
                            {ORDER_STATUS_STEPS.map(
                              (
                                step,
                                stepIndex,
                              ) => {
                                const completed =
                                  stepIndex <=
                                  stepIdx

                                const current =
                                  stepIndex ===
                                  stepIdx

                                return (
                                  <div
                                    key={
                                      step.id
                                    }
                                    className="flex items-center gap-3"
                                  >
                                    <div
                                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                        completed
                                          ? 'bg-primary text-primary-foreground'
                                          : 'bg-secondary text-muted-foreground'
                                      }`}
                                    >
                                      {completed ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                      ) : (
                                        <span className="text-xs font-bold">
                                          {
                                            stepIndex +
                                            1
                                          }
                                        </span>
                                      )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <p
                                        className={`text-xs font-semibold ${
                                          current
                                            ? 'text-foreground'
                                            : completed
                                              ? 'text-primary'
                                              : 'text-muted-foreground'
                                        }`}
                                      >
                                        {
                                          step.label
                                        }
                                      </p>
                                    </div>

                                    {current && (
                                      <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                                        Current
                                      </span>
                                    )}
                                  </div>
                                )
                              },
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={() =>
                              navigate({
                                name: 'tracking',
                                orderId:
                                  order.id,
                              })
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
                          >
                            <Truck className="h-4 w-4" />
                            View Tracking
                          </button>

                          {!isDelivered &&
                            nextStatus && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusUpdate(
                                    order.id,
                                    order.status,
                                  )
                                }
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Mark as{' '}
                                {
                                  ORDER_STATUS_STEPS.find(
                                    (
                                      step,
                                    ) =>
                                      step.id ===
                                      nextStatus,
                                  )?.label
                                }
                              </button>
                            )}

                          {isDelivered && (
                            <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
                              <CheckCircle2 className="h-4 w-4" />
                              Order Delivered
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              },
            )}

            {orders.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No orders yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          SERVICE DEMAND
          ================================================= */}

      <div className="px-4 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Service Demand
        </p>

        <div className="space-y-2.5 rounded-2xl border border-border bg-card p-4">
          {serviceCounts.map(
            (service) => (
              <div key={service.id}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">
                    {service.name}
                  </span>

                  <span className="text-muted-foreground">
                    {service.count} items
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        service.accent,
                    }}
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${
                        (service.count /
                          maxCount) *
                        100
                      }%`,
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                  />
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* =================================================
          CARE PARTNERS
          ================================================= */}

      <div className="px-4 pb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Care Partners
        </p>

        <div className="space-y-2">
          {PARTNERS.map(
            (partner) => (
              <div
                key={partner.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-display text-sm font-extrabold text-primary">
                  {partner.name.slice(
                    0,
                    2,
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {partner.name}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {partner.services}
                  </p>
                </div>

                <button
                  onClick={() =>
                    toast(
                      `${partner.name}: ${partner.turnaround}`,
                      'info',
                    )
                  }
                  className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Manage
                </button>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )
}

/* =======================================================
   COOPERATIVE MONEY STAT
   ======================================================= */


function AIDecisionMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: LucideIcon
}) {
  return (
    <div className="rounded-xl border border-border bg-card/80 p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-primary" />
        <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>

      <p className="mt-1 text-lg font-display font-bold text-foreground">
        {value}
      </p>
    </div>
  )
}

function AIAction({
  label,
  detail,
}: {
  label: string
  detail: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-2.5">
      <p className="text-[10px] font-semibold text-foreground">
        {label}
      </p>

      <p className="mt-0.5 text-[9px] leading-relaxed text-muted-foreground">
        {detail}
      </p>
    </div>
  )
}

function CooperativeMoneyStat({
  label,
  value,
  icon: IconCmp,
}: {
  label: string
  value: string
  icon: LucideIcon
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <IconCmp className="h-4 w-4" />
      </div>

      <p className="mt-2 text-sm font-bold text-foreground">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

/* =======================================================
   COOPERATIVE METRIC
   ======================================================= */

function CooperativeMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
      <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-bold text-foreground">
        {value}
      </p>
    </div>
  )
}

/* =======================================================
   MEMBER STATUS BADGE
   ======================================================= */

function MemberStatusBadge({
  status,
}: {
  status: MemberStatus
}) {
  if (status === 'approved') {
    return (
      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase text-primary">
        ✓ Approved
      </span>
    )
  }

  if (status === 'pending') {
    return (
      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase text-accent">
        Pending Review
      </span>
    )
  }

  return (
    <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[9px] font-bold uppercase text-destructive">
      Suspended
    </span>
  )
}

/* =======================================================
   GOVERNANCE CARD
   ======================================================= */

function GovernanceCard({
  title,
  value,
  description,
  icon: IconCmp,
}: {
  title: string
  value: string
  description: string
  icon: LucideIcon
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <IconCmp className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </p>

          <p className="text-sm font-bold text-foreground">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

/* =======================================================
   KPI COMPONENT
   ======================================================= */

function Kpi({
  label,
  value,
  icon: IconCmp,
}: {
  label: string
  value: string
  icon: LucideIcon
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <IconCmp className="h-4.5 w-4.5" />
      </span>

      <p className="mt-2.5 font-display text-xl font-bold text-foreground">
        {value}
      </p>

      <p className="text-xs text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

/* =======================================================
   FORECAST STAT
   ======================================================= */

function ForecastStat({
  label,
  value,
  description,
  icon: IconCmp,
  compact = false,
}: {
  label: string
  value: string
  description: string
  icon: LucideIcon
  compact?: boolean
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <IconCmp className="h-4 w-4" />
      </div>

      <p
        className={`mt-2 font-display font-bold text-foreground ${
          compact
            ? 'text-sm leading-tight'
            : 'text-xl'
        }`}
      >
        {value}
      </p>

      <p className="mt-0.5 text-[11px] font-semibold text-foreground">
        {label}
      </p>

      <p className="text-[10px] text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

/* =======================================================
   EARNINGS STAT
   ======================================================= */

function EarningsStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-secondary/60 px-2.5 py-2">
      <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-0.5 truncate text-xs font-bold text-foreground">
        {value}
      </p>
    </div>
  )
}

/* =======================================================
   ORDER INFO CARD
   ======================================================= */

function OrderInfoCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2.5">
      <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-foreground">
        {value}
      </p>
    </div>
  )
}

/* =======================================================
   PROVIDER DETAIL
   ======================================================= */

function ProviderDetail({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-secondary/60 px-2.5 py-2">
      <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[11px] font-bold text-foreground">
        {value}
      </p>
    </div>
  )
}

/* =======================================================
   ASSIGNMENT STAT
   ======================================================= */

function AssignmentStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2.5">
      <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-0.5 truncate text-xs font-bold text-foreground">
        {value}
      </p>
    </div>
  )
}

/* =======================================================
   DEMAND BADGE
   ======================================================= */

function DemandBadge({
  level,
}: {
  level:
    | 'low'
    | 'medium'
    | 'high'
}) {
  const styles = {
    low: 'bg-primary/10 text-primary',
    medium: 'bg-accent/10 text-accent',
    high: 'bg-destructive/10 text-destructive',
  }

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${styles[level]}`}
    >
      {level}
    </span>
  )
}

/* =======================================================
   EMERGENCY STATUS BADGE
   ======================================================= */

function EmergencyStatusBadge({
  status,
}: {
  status:
    | 'ready'
    | 'partial'
    | 'no-provider'
}) {
  if (status === 'ready') {
    return (
      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase text-primary">
        Ready
      </span>
    )
  }

  if (status === 'partial') {
    return (
      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase text-accent">
        Partial
      </span>
    )
  }

  return (
    <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[9px] font-bold uppercase text-destructive">
      No Provider
    </span>
  )
}

/* =======================================================
   DISPATCH PROVIDER CARD
   ======================================================= */

function DispatchProviderCard({
  provider,
  label,
}: {
  provider: {
    providerId: string
    providerName: string
    service: string
    skills: string[]
    rating: number
    distanceKm: number
    available: boolean
    emergencyCapable: boolean
    score: number
    reasons: string[]
  }
  label: string
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-3">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
          {label === 'Primary Provider'
            ? '1'
            : '2'}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              {provider.providerName}
            </p>

            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
              {provider.score}% AI MATCH
            </span>
          </div>

          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {label}
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-card px-2 py-1 text-[10px] font-medium text-foreground">
              ⭐ {provider.rating.toFixed(1)}
            </span>

            <span className="rounded-full bg-card px-2 py-1 text-[10px] font-medium text-foreground">
              📍{' '}
              {provider.distanceKm.toFixed(
                1,
              )}{' '}
              km
            </span>

            <span className="rounded-full bg-card px-2 py-1 text-[10px] font-medium text-foreground">
              {provider.available
                ? '✓ Available'
                : 'Unavailable'}
            </span>

            <span className="rounded-full bg-card px-2 py-1 text-[10px] font-medium text-foreground">
              🚨 Emergency
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {provider.reasons.map(
              (reason) => (
                <span
                  key={reason}
                  className="rounded-full bg-primary/5 px-2 py-0.5 text-[9px] font-medium capitalize text-muted-foreground"
                >
                  {reason}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* =======================================================
   WORKFORCE STATUS BADGE
   ======================================================= */

function WorkforceStatusBadge({
  status,
}: {
  status:
    | 'covered'
    | 'partial'
    | 'shortage'
}) {
  if (status === 'covered') {
    return (
      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase text-primary">
        Covered
      </span>
    )
  }

  if (status === 'partial') {
    return (
      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase text-accent">
        Partial
      </span>
    )
  }

  return (
    <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[9px] font-bold uppercase text-destructive">
      Shortage
    </span>
  )
}

/* =======================================================
   TREND INDICATOR
   ======================================================= */

function TrendIndicator({
  trend,
}: {
  trend:
    | 'increasing'
    | 'stable'
    | 'decreasing'
}) {
  if (trend === 'increasing') {
    return (
      <div className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
        <TrendingUp className="h-3 w-3" />
        Rising
      </div>
    )
  }

  if (trend === 'decreasing') {
    return (
      <div className="flex shrink-0 items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-[10px] font-bold text-destructive">
        <TrendingDown className="h-3 w-3" />
        Falling
      </div>
    )
  }

  return (
    <div className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground">
      <Activity className="h-3 w-3" />
      Stable
    </div>
  )
}