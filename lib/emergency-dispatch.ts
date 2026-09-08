import type {
  DemandLevel,
  DemandForecastSummary,
} from './demand-forecast'
import type { Partner, Service } from './types'

export type EmergencyDispatchReason =
  | 'skill'
  | 'availability'
  | 'emergency'
  | 'rating'
  | 'distance'

export type DispatchStatus =
  | 'ready'
  | 'partial'
  | 'no-provider'

export interface EmergencyCandidate {
  providerId: string
  providerName: string
  service: string
  skills: string[]
  rating: number
  distanceKm: number
  available: boolean
  emergencyCapable: boolean
  score: number
  reasons: EmergencyDispatchReason[]
}

export interface EmergencyDispatch {
  serviceId: string
  serviceName: string
  demandLevel: DemandLevel
  emergencyBookings: number
  candidates: EmergencyCandidate[]
  recommendedProvider?: EmergencyCandidate
  backupProvider?: EmergencyCandidate
  status: DispatchStatus
}

export interface EmergencyDispatchSummary {
  emergencyBookings: number
  servicesNeedingDispatch: number
  readyDispatches: number
  partialDispatches: number
  noProviderServices: number
  dispatches: EmergencyDispatch[]
}

/* -------------------------------------------------------
   HELPERS
------------------------------------------------------- */

/**
 * Convert the existing Partner.distance string
 * into a numeric distance in kilometres.
 *
 * Examples:
 * "1.5 km" -> 1.5
 * "3 km"   -> 3
 * "5"      -> 5
 */
function getProviderDistance(
  partner: Partner,
): number {
  const parsed = Number.parseFloat(
    partner.distance,
  )

  if (Number.isFinite(parsed)) {
    return parsed
  }

  return 5
}

function getPartnerRating(
  partner: Partner,
): number {
  return typeof partner.rating === 'number'
    ? partner.rating
    : 4
}

function getPartnerServices(
  partner: Partner,
): string[] {
  if (!partner.services.trim()) {
    return []
  }

  return partner.services
    .split(/[•,|/]/)
    .map((service) => service.trim())
    .filter(Boolean)
}

/* -------------------------------------------------------
   SERVICE MATCHING
------------------------------------------------------- */

function isServiceMatch(
  partner: Partner,
  service: Service,
): boolean {
  const serviceText =
    service.name.toLowerCase()

  const serviceId =
    service.id.toLowerCase()

  const partnerServices =
    getPartnerServices(partner).map(
      (item) => item.toLowerCase(),
    )

  const requiredSkills =
    service.requiredSkills?.map(
      (skill) => skill.toLowerCase(),
    ) ?? []

  const directMatch =
    partnerServices.some(
      (item) =>
        item.includes(serviceText) ||
        serviceText.includes(item) ||
        item.includes(serviceId),
    )

  if (directMatch) {
    return true
  }

  return requiredSkills.some(
    (skill) =>
      partnerServices.some(
        (item) =>
          item.includes(skill) ||
          skill.includes(item),
      ),
  )
}

/* -------------------------------------------------------
   AI SCORING
------------------------------------------------------- */

function getSkillScore(
  partner: Partner,
  service: Service,
): number {
  if (!isServiceMatch(partner, service)) {
    return 0
  }

  const serviceText =
    service.name.toLowerCase()

  const partnerServices =
    getPartnerServices(partner).map(
      (item) => item.toLowerCase(),
    )

  const directMatch =
    partnerServices.some(
      (item) =>
        item.includes(serviceText) ||
        serviceText.includes(item),
    )

  if (directMatch) {
    return 100
  }

  return 80
}

function getAvailabilityScore(
  partner: Partner,
): number {
  return partner.available ? 100 : 0
}

function getEmergencyScore(
  service: Service,
): number {
  return service.supportsEmergency
    ? 100
    : 40
}

function getRatingScore(
  partner: Partner,
): number {
  const rating =
    getPartnerRating(partner)

  return Math.min(
    100,
    Math.max(
      0,
      (rating / 5) * 100,
    ),
  )
}

function getDistanceScore(
  distanceKm: number,
): number {
  if (distanceKm <= 1) {
    return 100
  }

  if (distanceKm <= 2) {
    return 90
  }

  if (distanceKm <= 3) {
    return 80
  }

  if (distanceKm <= 5) {
    return 65
  }

  if (distanceKm <= 10) {
    return 45
  }

  return 25
}

/* -------------------------------------------------------
   AI MATCH REASONS
------------------------------------------------------- */

function buildReasons(
  skillScore: number,
  availabilityScore: number,
  emergencyScore: number,
  ratingScore: number,
  distanceScore: number,
): EmergencyDispatchReason[] {
  const scoredReasons: Array<{
    reason: EmergencyDispatchReason
    score: number
  }> = [
    {
      reason: 'skill',
      score: skillScore,
    },
    {
      reason: 'availability',
      score: availabilityScore,
    },
    {
      reason: 'emergency',
      score: emergencyScore,
    },
    {
      reason: 'rating',
      score: ratingScore,
    },
    {
      reason: 'distance',
      score: distanceScore,
    },
  ]

  return scoredReasons
    .sort(
      (a, b) =>
        b.score - a.score,
    )
    .slice(0, 3)
    .map(
      (item) => item.reason,
    )
}

/* -------------------------------------------------------
   AI DISPATCH SCORE
------------------------------------------------------- */

function calculateDispatchScore(
  skillScore: number,
  availabilityScore: number,
  emergencyScore: number,
  ratingScore: number,
  distanceScore: number,
): number {
  /*
   * AI Emergency Dispatch weighting:
   *
   * Skill          30%
   * Availability   25%
   * Emergency      20%
   * Rating         10%
   * GEO distance   15%
   */

  const score =
    skillScore * 0.3 +
    availabilityScore * 0.25 +
    emergencyScore * 0.2 +
    ratingScore * 0.1 +
    distanceScore * 0.15

  return Math.round(score)
}

/* -------------------------------------------------------
   CANDIDATE CREATION
------------------------------------------------------- */

function createCandidate(
  partner: Partner,
  service: Service,
): EmergencyCandidate | null {
  if (
    !isServiceMatch(
      partner,
      service,
    )
  ) {
    return null
  }

  const distanceKm =
    getProviderDistance(partner)

  const skillScore =
    getSkillScore(
      partner,
      service,
    )

  const availabilityScore =
    getAvailabilityScore(partner)

  const emergencyScore =
    getEmergencyScore(service)

  const ratingScore =
    getRatingScore(partner)

  const distanceScore =
    getDistanceScore(distanceKm)

  const emergencyCapable =
    service.supportsEmergency === true

  const score =
    calculateDispatchScore(
      skillScore,
      availabilityScore,
      emergencyScore,
      ratingScore,
      distanceScore,
    )

  const reasons =
    buildReasons(
      skillScore,
      availabilityScore,
      emergencyScore,
      ratingScore,
      distanceScore,
    )

  return {
    providerId: partner.id,
    providerName: partner.name,
    service: service.name,

    /*
     * Partner.services is a string
     * in the current types.ts.
     */
    skills: getPartnerServices(
      partner,
    ),

    rating:
      getPartnerRating(partner),

    distanceKm,

    available:
      partner.available,

    emergencyCapable,

    score,

    reasons,
  }
}

/* -------------------------------------------------------
   DEMAND HELPERS
------------------------------------------------------- */

function getEmergencyBookingCount(
  serviceId: string,
  demandForecast: DemandForecastSummary,
): number {
  const forecast =
    demandForecast.forecasts.find(
      (item) =>
        item.serviceId === serviceId,
    )

  return (
    forecast?.emergencyBookings ?? 0
  )
}

function getDemandLevel(
  serviceId: string,
  demandForecast: DemandForecastSummary,
): DemandLevel {
  const forecast =
    demandForecast.forecasts.find(
      (item) =>
        item.serviceId === serviceId,
    )

  return (
    forecast?.demandLevel ?? 'low'
  )
}

/* -------------------------------------------------------
   MAIN AI DISPATCH ENGINE
------------------------------------------------------- */

export function generateEmergencyDispatch(
  services: Service[],
  partners: Partner[],
  demandForecast: DemandForecastSummary,
): EmergencyDispatchSummary {
  const dispatches: EmergencyDispatch[] =
    []

  for (const service of services) {
    if (!service.supportsEmergency) {
      continue
    }

    const emergencyBookings =
      getEmergencyBookingCount(
        service.id,
        demandForecast,
      )

    /*
     * Only create a dispatch recommendation
     * when there is actual emergency demand.
     */
    if (emergencyBookings <= 0) {
      continue
    }

    const candidates =
      partners
        .map((partner) =>
          createCandidate(
            partner,
            service,
          ),
        )
        .filter(
          (
            candidate,
          ): candidate is EmergencyCandidate =>
            candidate !== null,
        )
        .sort(
          (a, b) => {
            /*
             * Available providers
             * always rank first.
             */
            if (
              a.available !==
              b.available
            ) {
              return a.available
                ? -1
                : 1
            }

            /*
             * Emergency-capable providers
             * rank above non-emergency providers.
             */
            if (
              a.emergencyCapable !==
              b.emergencyCapable
            ) {
              return a.emergencyCapable
                ? -1
                : 1
            }

            /*
             * Finally use the AI score.
             */
            return (
              b.score - a.score
            )
          },
        )

    const availableCandidates =
      candidates.filter(
        (candidate) =>
          candidate.available &&
          candidate.emergencyCapable,
      )

    const recommendedProvider =
      availableCandidates[0]

    const backupProvider =
      availableCandidates[1]

    let status: DispatchStatus

    if (
      recommendedProvider &&
      backupProvider
    ) {
      status = 'ready'
    } else if (
      recommendedProvider
    ) {
      status = 'partial'
    } else {
      status = 'no-provider'
    }

    dispatches.push({
      serviceId: service.id,
      serviceName: service.name,
      demandLevel:
        getDemandLevel(
          service.id,
          demandForecast,
        ),
      emergencyBookings,
      candidates,
      recommendedProvider,
      backupProvider,
      status,
    })
  }

  return {
    emergencyBookings:
      dispatches.reduce(
        (total, dispatch) =>
          total +
          dispatch.emergencyBookings,
        0,
      ),

    servicesNeedingDispatch:
      dispatches.length,

    readyDispatches:
      dispatches.filter(
        (dispatch) =>
          dispatch.status ===
          'ready',
      ).length,

    partialDispatches:
      dispatches.filter(
        (dispatch) =>
          dispatch.status ===
          'partial',
      ).length,

    noProviderServices:
      dispatches.filter(
        (dispatch) =>
          dispatch.status ===
          'no-provider',
      ).length,

    dispatches,
  }
}

/* -------------------------------------------------------
   AI INSIGHTS
------------------------------------------------------- */

export function generateEmergencyInsights(
  summary: EmergencyDispatchSummary,
): string[] {
  const insights: string[] = []

  if (
    summary.emergencyBookings === 0
  ) {
    insights.push(
      'No emergency bookings require AI dispatch right now.',
    )

    return insights
  }

  insights.push(
    `${summary.emergencyBookings} emergency booking${
      summary.emergencyBookings ===
      1
        ? ''
        : 's'
    } require smart dispatch.`,
  )

  if (
    summary.readyDispatches > 0
  ) {
    insights.push(
      `${summary.readyDispatches} service${
        summary.readyDispatches ===
        1
          ? ''
          : 's'
      } have a primary provider and backup provider ready.`,
    )
  }

  if (
    summary.partialDispatches > 0
  ) {
    insights.push(
      `${summary.partialDispatches} service${
        summary.partialDispatches ===
        1
          ? ''
          : 's'
      } have only one suitable emergency provider available.`,
    )
  }

  if (
    summary.noProviderServices > 0
  ) {
    insights.push(
      `${summary.noProviderServices} service${
        summary.noProviderServices ===
        1
          ? ''
          : 's'
      } currently have no available emergency provider.`,
    )
  }

  const topDispatch =
    summary.dispatches
      .filter(
        (dispatch) =>
          dispatch.recommendedProvider,
      )
      .sort(
        (a, b) =>
          (b.recommendedProvider
            ?.score ?? 0) -
          (a.recommendedProvider
            ?.score ?? 0),
      )[0]

  if (
    topDispatch?.recommendedProvider
  ) {
    insights.push(
      `Top AI dispatch: ${topDispatch.recommendedProvider.providerName} for ${topDispatch.serviceName} with a ${topDispatch.recommendedProvider.score}% dispatch score.`,
    )
  }

  insights.push(
    'AI prioritizes skill match, provider availability, emergency capability, rating, and GEO distance.',
  )

  return insights
}