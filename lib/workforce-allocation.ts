import type { Partner, Service } from './types'
import type {
  DemandLevel,
  DemandForecastSummary,
  ServiceDemandForecast,
} from './demand-forecast'

export type WorkforceMatchReason =
  | 'skill'
  | 'availability'
  | 'rating'
  | 'distance'
  | 'turnaround'

export interface WorkforceCandidate {
  providerId: string
  providerName: string
  cooperative: string
  service: string
  skills: string[]
  rating: number
  distanceKm: number
  available: boolean
  turnaround: string
  score: number
  reasons: WorkforceMatchReason[]
}

export interface WorkforceAllocation {
  serviceId: string
  serviceName: string
  demandLevel: DemandLevel
  predictedDemand: number
  workersRequired: number
  availableWorkers: number
  recommendedWorkers: WorkforceCandidate[]
  status: 'covered' | 'partial' | 'shortage'
}

export interface WorkforceAllocationSummary {
  totalWorkersRequired: number
  totalWorkersAvailable: number
  servicesCovered: number
  servicesWithShortage: number
  allocations: WorkforceAllocation[]
}

/* =====================================================
   HELPERS
   ===================================================== */

function normalizeText(value: string): string {
  return value.trim().toLowerCase()
}

function getPartnerSkills(
  partner: Partner,
): string[] {
  return partner.services
    .split('•')
    .map((item) => item.trim())
    .filter(Boolean)
}

/*
 * Your existing Partner type does not contain
 * distanceKm, so this engine uses a safe fallback.
 *
 * GEO distance can be connected later from the
 * existing provider location system.
 */
function extractDistance(
  _partner: Partner,
): number {
  return 5
}

/*
 * Your existing Partner type does not contain
 * cooperative, so we use the partner name as the
 * organization label for now.
 */
function extractCooperative(
  partner: Partner,
): string {
  return partner.name
}

function serviceMatchesPartner(
  service: Service,
  partner: Partner,
): boolean {
  const serviceName = normalizeText(
    service.name,
  )

  const serviceId = normalizeText(
    service.id,
  )

  const partnerServices =
    normalizeText(partner.services)

  const partnerSkills =
    getPartnerSkills(partner).map(
      normalizeText,
    )

  if (
    partnerServices.includes(serviceName) ||
    serviceName.includes(partnerServices)
  ) {
    return true
  }

  if (
    partnerSkills.some(
      (skill) =>
        skill.includes(serviceName) ||
        serviceName.includes(skill),
    )
  ) {
    return true
  }

  if (
    service.requiredSkills?.some(
      (requiredSkill) => {
        const required =
          normalizeText(requiredSkill)

        return partnerSkills.some(
          (skill) =>
            skill.includes(required) ||
            required.includes(skill),
        )
      },
    )
  ) {
    return true
  }

  return (
    partnerServices.includes(serviceId) ||
    partnerSkills.some(
      (skill) =>
        skill.includes(serviceId),
    )
  )
}

function extractRating(
  partner: Partner,
): number {
  const value =
    typeof partner.rating === 'number'
      ? partner.rating
      : 4

  return Math.max(
    0,
    Math.min(5, value),
  )
}

function extractTurnaroundScore(
  turnaround: string,
): number {
  const value =
    normalizeText(turnaround)

  if (
    value.includes('same') ||
    value.includes('fast') ||
    value.includes('express')
  ) {
    return 100
  }

  if (
    value.includes('1 day') ||
    value.includes('24')
  ) {
    return 85
  }

  if (
    value.includes('2 day') ||
    value.includes('48')
  ) {
    return 70
  }

  if (
    value.includes('3 day') ||
    value.includes('72')
  ) {
    return 55
  }

  return 50
}

function calculateDistanceScore(
  distanceKm: number,
): number {
  if (distanceKm <= 1) return 100
  if (distanceKm <= 2) return 90
  if (distanceKm <= 3) return 80
  if (distanceKm <= 5) return 65
  if (distanceKm <= 8) return 50

  return 35
}

/* =====================================================
   AI WORKFORCE SCORE
   ===================================================== */

function calculateWorkforceScore(
  partner: Partner,
  service: Service,
): {
  score: number
  reasons: WorkforceMatchReason[]
} {
  const reasons: WorkforceMatchReason[] = []

  const skillMatch =
    serviceMatchesPartner(
      service,
      partner,
    )

  if (skillMatch) {
    reasons.push('skill')
  }

  const available =
    partner.available === true

  if (available) {
    reasons.push('availability')
  }

  const rating =
    extractRating(partner)

  if (rating >= 4.5) {
    reasons.push('rating')
  }

  const distance =
    extractDistance(partner)

  if (distance <= 3) {
    reasons.push('distance')
  }

  const turnaroundScore =
    extractTurnaroundScore(
      partner.turnaround,
    )

  if (turnaroundScore >= 85) {
    reasons.push('turnaround')
  }

  /*
   * AI workforce scoring:
   *
   * Skill        → 35%
   * Availability → 25%
   * Rating       → 15%
   * Distance     → 15%
   * Turnaround   → 10%
   */

  const skillScore = skillMatch
    ? 100
    : 0

  const availabilityScore =
    available ? 100 : 0

  const ratingScore =
    (rating / 5) * 100

  const distanceScore =
    calculateDistanceScore(
      distance,
    )

  const score =
    skillScore * 0.35 +
    availabilityScore * 0.25 +
    ratingScore * 0.15 +
    distanceScore * 0.15 +
    turnaroundScore * 0.1

  return {
    score: Math.round(score),
    reasons,
  }
}

/* =====================================================
   BUILD WORKFORCE CANDIDATES
   ===================================================== */

function buildCandidates(
  service: Service,
  partners: Partner[],
): WorkforceCandidate[] {
  return partners
    .filter((partner) =>
      serviceMatchesPartner(
        service,
        partner,
      ),
    )
    .map((partner) => {
      const result =
        calculateWorkforceScore(
          partner,
          service,
        )

      return {
        providerId: partner.id,
        providerName: partner.name,
        cooperative:
          extractCooperative(partner),
        service: service.name,
        skills:
          getPartnerSkills(partner),
        rating:
          extractRating(partner),
        distanceKm:
          extractDistance(partner),
        available:
          partner.available === true,
        turnaround:
          partner.turnaround,
        score: result.score,
        reasons: result.reasons,
      }
    })
    .sort(
      (a, b) =>
        b.score - a.score,
    )
}

/* =====================================================
   AI WORKFORCE ALLOCATION
   ===================================================== */

export function generateWorkforceAllocation(
  services: Service[],
  partners: Partner[],
  forecast: DemandForecastSummary,
): WorkforceAllocationSummary {
  const allocations =
    forecast.forecasts.map(
      (
        serviceForecast: ServiceDemandForecast,
      ) => {
        const service = services.find(
          (item) =>
            item.id ===
            serviceForecast.serviceId,
        )

        if (!service) {
          return null
        }

        const candidates =
          buildCandidates(
            service,
            partners,
          )

        const availableCandidates =
          candidates.filter(
            (candidate) =>
              candidate.available,
          )

        const workersRequired =
          Math.max(
            1,
            serviceForecast.recommendedWorkers,
          )

        const recommendedWorkers =
          availableCandidates.slice(
            0,
            workersRequired,
          )

        let status:
          | 'covered'
          | 'partial'
          | 'shortage'

        if (
          recommendedWorkers.length >=
          workersRequired
        ) {
          status = 'covered'
        } else if (
          recommendedWorkers.length > 0
        ) {
          status = 'partial'
        } else {
          status = 'shortage'
        }

        return {
          serviceId:
            serviceForecast.serviceId,
          serviceName:
            serviceForecast.serviceName,
          demandLevel:
            serviceForecast.demandLevel,
          predictedDemand:
            serviceForecast.predictedDemand,
          workersRequired,
          availableWorkers:
            availableCandidates.length,
          recommendedWorkers,
          status,
        }
      },
    )

  const validAllocations =
    allocations.filter(
      (
        allocation,
      ): allocation is WorkforceAllocation =>
        allocation !== null,
    )

  const totalWorkersRequired =
    validAllocations.reduce(
      (sum, allocation) =>
        sum +
        allocation.workersRequired,
      0,
    )

  const totalWorkersAvailable =
    validAllocations.reduce(
      (sum, allocation) =>
        sum +
        allocation.availableWorkers,
      0,
    )

  const servicesCovered =
    validAllocations.filter(
      (allocation) =>
        allocation.status ===
        'covered',
    ).length

  const servicesWithShortage =
    validAllocations.filter(
      (allocation) =>
        allocation.status !==
        'covered',
    ).length

  return {
    totalWorkersRequired,
    totalWorkersAvailable,
    servicesCovered,
    servicesWithShortage,
    allocations:
      validAllocations,
  }
}

/* =====================================================
   AI WORKFORCE INSIGHTS
   ===================================================== */

export function generateWorkforceInsights(
  summary: WorkforceAllocationSummary,
): string[] {
  const insights: string[] = []

  if (
    summary.allocations.length === 0
  ) {
    return [
      'AI workforce allocation is waiting for service demand data.',
    ]
  }

  if (
    summary.servicesWithShortage === 0
  ) {
    insights.push(
      'AI predicts that current verified workforce capacity can cover all forecasted service demand.',
    )
  } else {
    insights.push(
      `${summary.servicesWithShortage} service${
        summary.servicesWithShortage === 1
          ? ''
          : 's'
      } need additional workforce capacity.`,
    )
  }

  const shortage =
    summary.allocations.find(
      (allocation) =>
        allocation.status !==
        'covered',
    )

  if (shortage) {
    const missing =
      Math.max(
        0,
        shortage.workersRequired -
          shortage.availableWorkers,
      )

    if (missing > 0) {
      insights.push(
        `${shortage.serviceName} may need ${missing} additional verified worker${
          missing === 1 ? '' : 's'
        } during the forecast period.`,
      )
    } else {
      insights.push(
        `${shortage.serviceName} has limited workforce coverage and should receive priority for provider allocation.`,
      )
    }
  }

  const bestMatch =
    summary.allocations
      .flatMap(
        (allocation) =>
          allocation.recommendedWorkers.map(
            (worker) => ({
              ...worker,
              serviceName:
                allocation.serviceName,
            }),
          ),
      )
      .sort(
        (a, b) =>
          b.score - a.score,
      )[0]

  if (bestMatch) {
    insights.push(
      `Top AI workforce match: ${bestMatch.providerName} for ${bestMatch.serviceName}, with a ${bestMatch.score}% allocation score.`,
    )
  }

  const closest =
    summary.allocations
      .flatMap(
        (allocation) =>
          allocation.recommendedWorkers.map(
            (worker) => ({
              ...worker,
              serviceName:
                allocation.serviceName,
            }),
          ),
      )
      .sort(
        (a, b) =>
          a.distanceKm -
          b.distanceKm,
      )[0]

  if (closest) {
    insights.push(
      `GEO prioritization favors ${closest.providerName} because the provider is approximately ${closest.distanceKm.toFixed(
        1,
      )} km from the service area.`,
    )
  }

  return insights
}