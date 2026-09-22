import type { Order, Partner, Service } from './types'

export type AllocationStatus =
  | 'under-allocated'
  | 'balanced'
  | 'high-workload'
  | 'unavailable'

export interface FairAllocationResult {
  providerId: string
  providerName: string
  eligible: boolean
  score: number
  fairnessScore: number
  serviceQualityScore: number
  workload: number
  recentJobs: number
  allocationBalance: number
  status: AllocationStatus
  reasons: string[]
  serviceMatch: boolean
  verified: boolean
  available: boolean
  certification: boolean
  distanceKm: number
  trustScore: number
}

export interface WageBreakdown {
  customerPayment: number
  workerPayout: number
  cooperativeContribution: number
  welfareContribution: number
  operationsAmount: number
  wageFloor: number
  compliant: boolean
}

export interface WageBreakdownDisplay extends WageBreakdown {
  proposedPayout: number
  violation: boolean
  warning: string | null
}

const WAGE_FLOORS: Record<string, number> = {
  plumbing: 500,
  electrician: 500,
  cleaning: 400,
  caregiving: 550,
  laundry: 350,
  carpentry: 500,
  transport: 450,
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function parseDistance(distance: string): number {
  const match = distance.match(/\d+(?:\.\d+)?/)
  return match ? Number(match[0]) : 10
}

function hasServiceMatch(service: Service, partner: Partner): boolean {
  const serviceText = normalize(`${service.id} ${service.name}`)
  const partnerText = normalize(partner.services)
  const requiredSkills = service.requiredSkills ?? []

  return (
    partnerText.includes(normalize(service.name)) ||
    partnerText.includes(normalize(service.id)) ||
    requiredSkills.some((skill) => partnerText.includes(normalize(skill))) ||
    serviceText.split(' ').some((word) => word.length > 3 && partnerText.includes(word))
  )
}

function assignedJobsThisWeek(partner: Partner, orders: Order[]): number {
  const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recentOrders = orders.filter((order) => {
    if (order.createdAt < weekStart) return false
    const ids = [order.providerId, ...Object.values(order.providerIds ?? {})]
    return ids.includes(partner.id)
  }).length

  return recentOrders
}

function trustScore(partner: Partner): number {
  return Math.round(
    (partner.rating / 5) * 45 +
      Math.min(30, partner.experience * 4) +
      (partner.verified ? 20 : 0) +
      (partner.available ? 5 : 0),
  )
}

export function getWageFloor(serviceName: string): number {
  const key = Object.keys(WAGE_FLOORS).find((item) => normalize(serviceName).includes(item))
  return key ? WAGE_FLOORS[key] : 400
}

export function calculateWageBreakdown(input: {
  customerPayment: number
  serviceName: string
  distanceKm: number
  emergency?: boolean
}): WageBreakdown {
  const customerPayment = Math.max(0, Math.round(input.customerPayment))
  const cooperativeContribution = Math.round(customerPayment * 0.05)
  const welfareContribution = Math.round(customerPayment * 0.03)
  const emergencyAllowance = input.emergency ? Math.round(customerPayment * 0.1) : 0
  const distanceAllowance = Math.min(50, Math.round(input.distanceKm * 8))
  const wageFloor = getWageFloor(input.serviceName)
  const calculatedPayout = Math.round(customerPayment * 0.7) + distanceAllowance + emergencyAllowance
  const workerPayout = Math.max(wageFloor, calculatedPayout)
  const operationsAmount = Math.max(
    0,
    customerPayment - workerPayout - cooperativeContribution - welfareContribution,
  )

  return {
    customerPayment,
    workerPayout,
    cooperativeContribution,
    welfareContribution,
    operationsAmount,
    wageFloor,
    compliant: workerPayout >= wageFloor,
  }
}

export function getVisibleWageBreakdown(input: {
  customerPayment: number
  serviceName: string
  distanceKm: number
  emergency?: boolean
}): WageBreakdownDisplay {
  const base = calculateWageBreakdown(input)

  const demoScenario =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('nexa_link_demo_scenario')
      : null

  if (demoScenario === 'fair-wage-alert') {
    const proposedPayout = Math.max(0, Math.round(input.customerPayment * 0.58))
    const violationPayout = Math.min(proposedPayout, Math.max(0, base.wageFloor - 1))
    const cooperativeContribution = Math.round(input.customerPayment * 0.05)
    const welfareContribution = Math.round(input.customerPayment * 0.03)
    const operationsAmount = Math.max(
      0,
      Math.round(input.customerPayment) - violationPayout - cooperativeContribution - welfareContribution,
    )

    return {
      customerPayment: base.customerPayment,
      workerPayout: violationPayout,
      cooperativeContribution,
      welfareContribution,
      operationsAmount,
      wageFloor: base.wageFloor,
      compliant: false,
      proposedPayout,
      violation: true,
      warning: `FAIR WAGE ALERT\nMinimum worker payout: ₹${base.wageFloor}\nProposed payout: ₹${proposedPayout}\nThis assignment cannot be approved until the worker receives the minimum configured payout.`,
    }
  }

  return {
    ...base,
    proposedPayout: base.workerPayout,
    violation: false,
    warning: null,
  }
}

export function calculateFairAllocation(
  partner: Partner,
  service: Service,
  orders: Order[],
): FairAllocationResult {
  const serviceMatch = hasServiceMatch(service, partner)
  const recentJobs = assignedJobsThisWeek(partner, orders)
  const workload = Math.min(100, recentJobs * 20 + (partner.available ? 0 : 50))
  const distanceKm = parseDistance(partner.distance)
  const distanceScore = Math.max(0, 100 - distanceKm * 8)
  const availabilityScore = partner.available ? 100 : 0
  const certification = partner.verified
  const trust = trustScore(partner)
  const ratingScore = (partner.rating / 5) * 100
  const workloadScore = Math.max(0, 100 - workload)
  const fairnessScore = Math.max(0, Math.min(100, 100 - recentJobs * 18))
  const serviceQualityScore = Math.round(
    (trust * 0.45 + ratingScore * 0.3 + (certification ? 100 : 0) * 0.25),
  )
  const score = Math.round(
    (serviceMatch ? 100 : 0) * 0.25 +
      availabilityScore * 0.15 +
      distanceScore * 0.15 +
      trust * 0.1 +
      ratingScore * 0.1 +
      workloadScore * 0.1 +
      fairnessScore * 0.1 +
      (certification ? 100 : 0) * 0.05,
  )
  const eligible = serviceMatch && partner.verified && partner.available
  const averageJobs = orders.length ? orders.length / Math.max(1, 7) : 0
  const status: AllocationStatus = !partner.available
    ? 'unavailable'
    : recentJobs > Math.max(4, averageJobs * 2)
      ? 'high-workload'
      : recentJobs <= 1
        ? 'under-allocated'
        : 'balanced'
  const reasons: string[] = []

  if (serviceMatch) reasons.push(`Required ${service.name} skill`)
  if (partner.verified) reasons.push('Verified cooperative member')
  if (partner.available) reasons.push('Available now')
  if (distanceKm <= 3) reasons.push(`${distanceKm.toFixed(1)} km away`)
  if (trust >= 75) reasons.push(`Good reliability score (${trust}/100)`)
  if (workload <= 40) reasons.push('Low current workload')
  if (fairnessScore >= 70) reasons.push('Fair allocation opportunity')

  return {
    providerId: partner.id,
    providerName: partner.name,
    eligible,
    score,
    fairnessScore: Math.round(fairnessScore),
    serviceQualityScore,
    workload,
    recentJobs,
    allocationBalance: Math.round(fairnessScore),
    status,
    reasons,
    serviceMatch,
    verified: partner.verified,
    available: partner.available,
    certification,
    distanceKm,
    trustScore: trust,
  }
}
