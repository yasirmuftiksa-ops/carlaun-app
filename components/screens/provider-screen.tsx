'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  IndianRupee,
  MapPin,
  Navigation,
  Power,
  ShieldCheck,
  Star,
  TrendingUp,
  UserRound,
  Wallet,
  Zap,
  CircleCheck,
  CircleDot,
  Play,
  HeartPulse,
  BadgeCheck,
  Umbrella,
  FileCheck2,
  PhoneCall,
  HandHeart,
  GraduationCap,
  Award,
  FileBadge,
  CircleAlert,
  BookOpen,
  ClipboardCheck,
  Trophy,
  LockKeyhole,
} from 'lucide-react'

import { PARTNERS, SERVICES } from '@/lib/data'
import { rupees } from '@/lib/format'
import {
  ORDER_STATUS_STEPS,
  useStore,
} from '@/lib/store'
import type { OrderStatus, Partner } from '@/lib/types'
import { ScreenHeader } from '@/components/screen-header'

type ExtendedOrder = {
  providerId?: string
  providerName?: string
  providerIds?: Record<string, string>
  providerNames?: Record<string, string>
  paymentStatus?: string
  transactionId?: string
  paidAt?: number
}

type ProviderWorkflowStatus =
  | 'assigned'
  | 'accepted'
  | 'on-the-way'
  | 'arrived'
  | 'work-started'
  | 'completed'

type CertificationStatus =
  | 'verified'
  | 'pending'
  | 'not-certified'

type SkillCertification = {
  skill: string
  level: 'Basic' | 'Intermediate' | 'Advanced'
  status: CertificationStatus
  certificateId?: string
  verifiedDate?: string
  issuer: string
  expiryDate?: string
}

type TrainingStatus =
  | 'recommended'
  | 'enrolled'
  | 'in-progress'
  | 'completed'

type TrainingCourse = {
  id: string
  title: string
  skill: string
  level: 'Basic' | 'Intermediate' | 'Advanced'
  duration: string
  lessons: number
  reward: number
  description: string
  status: TrainingStatus
  progress: number
  certificateUnlocked: boolean
  recommended: boolean
}

type TrustScoreBreakdown = {
  rating: number
  completedJobs: number
  reliability: number
  certification: number
  training: number
  complaints: number
  experience: number
  welfare: number
}

const TRUST_SCORE_STORAGE_KEY =
  'nexa_link_provider_trust_scores'
const PROVIDER_PERFORMANCE_STORAGE_KEY =
  'nexa_link_provider_performance'

function getTrustLevel(score: number) {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  if (score >= 60) return 'Developing'
  return 'Needs Improvement'
}

function getTrustLevelDescription(score: number) {
  if (score >= 90) {
    return 'Top-tier provider with strong customer trust and cooperative readiness.'
  }

  if (score >= 75) {
    return 'Reliable provider with a strong foundation for higher-value assignments.'
  }

  if (score >= 60) {
    return 'Good progress. Complete training and improve reliability to raise your score.'
  }

  return 'Focus on training, service quality and reliable job completion to improve trust.'
}

function getComplaintPenalty(complaintCount: number) {
  return Math.min(20, complaintCount * 5)
}

function getProviderComplaintCount(providerId: string) {
  try {
    const saved = localStorage.getItem('nexa_link_complaints')

    if (!saved) return 0

    const complaints = JSON.parse(saved)

    if (!Array.isArray(complaints)) return 0

    return complaints.filter((complaint) => {
      const candidateProviderId =
        complaint?.providerId ??
        complaint?.assignedProviderId

      return candidateProviderId === providerId
    }).length
  } catch {
    return 0
  }
}

function calculateTrustScore(
  provider: Partner,
  breakdown: TrustScoreBreakdown,
) {
  const weighted =
    breakdown.rating * 0.25 +
    breakdown.completedJobs * 0.15 +
    breakdown.reliability * 0.15 +
    breakdown.certification * 0.15 +
    breakdown.training * 0.10 +
    breakdown.complaints * 0.10 +
    breakdown.experience * 0.05 +
    breakdown.welfare * 0.05

  return Math.max(0, Math.min(100, Math.round(weighted)))
}

const WORKFLOW_STEPS: Array<{
  id: ProviderWorkflowStatus
  label: string
}> = [
  {
    id: 'assigned',
    label: 'Assigned',
  },
  {
    id: 'accepted',
    label: 'Accepted',
  },
  {
    id: 'on-the-way',
    label: 'On the Way',
  },
  {
    id: 'arrived',
    label: 'Arrived',
  },
  {
    id: 'work-started',
    label: 'Work Started',
  },
  {
    id: 'completed',
    label: 'Completed',
  },
]

/*
 * ============================================================
 * PROVIDER / ORDER HELPERS
 * ============================================================
 */

function getOrderProviderIds(order: {
  providerId?: string
  providerIds?:
    | Record<string, string>
    | string[]
}) {
  if (Array.isArray(order.providerIds)) {
    return order.providerIds.reduce(
      (result, providerId, index) => {
        result[`service-${index}`] =
          providerId
        return result
      },
      {} as Record<string, string>,
    )
  }

  if (order.providerIds) {
    return order.providerIds
  }

  if (order.providerId) {
    return {
      primary: order.providerId,
    }
  }

  return {}
}

function getServiceName(serviceId: string) {
  return (
    SERVICES.find(
      (service) => service.id === serviceId,
    )?.name ?? serviceId
  )
}

function getProviderDistance(provider: Partner) {
  return provider.distance || '5 km'
}

function getProviderInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/*
 * ============================================================
 * PROVIDER WORKFLOW HELPERS
 * ============================================================
 */

function getWorkflowIndex(
  status: ProviderWorkflowStatus,
) {
  return WORKFLOW_STEPS.findIndex(
    (step) => step.id === status,
  )
}

function getNextWorkflowStatus(
  status: ProviderWorkflowStatus,
): ProviderWorkflowStatus | null {
  const index = getWorkflowIndex(status)

  if (
    index === -1 ||
    index >= WORKFLOW_STEPS.length - 1
  ) {
    return null
  }

  return WORKFLOW_STEPS[index + 1].id
}

function getWorkflowLabel(
  status: ProviderWorkflowStatus,
) {
  return (
    WORKFLOW_STEPS.find(
      (step) => step.id === status,
    )?.label ?? status
  )
}

/*
 * Convert the customer/system order status
 * into the matching provider journey status.
 *
 * This prevents the provider journey from
 * resetting to "Assigned" when the customer
 * order has already progressed.
 */
function getInitialWorkflow(
  orderStatus: OrderStatus,
): ProviderWorkflowStatus {
  switch (orderStatus) {
    case 'scheduled':
      return 'assigned'

    case 'picked':
      return 'accepted'

    case 'processing':
      return 'on-the-way'

    case 'quality':
      return 'arrived'

    case 'out':
      return 'work-started'

    case 'delivered':
      return 'completed'

    default:
      return 'assigned'
  }
}

/*
 * Map every provider journey step to the
 * corresponding customer/system order status.
 */
function getOrderStatusForWorkflow(
  workflowStatus: ProviderWorkflowStatus,
): OrderStatus {
  switch (workflowStatus) {
    case 'assigned':
      return 'scheduled'

    case 'accepted':
      return 'picked'

    case 'on-the-way':
      return 'processing'

    case 'arrived':
      return 'quality'

    case 'work-started':
      return 'out'

    case 'completed':
      return 'delivered'

    default:
      return 'scheduled'
  }
}

function getStatusLabel(status: string) {
  return (
    ORDER_STATUS_STEPS.find(
      (step) => step.id === status,
    )?.label ?? status
  )
}

/*
 * ============================================================
 * DEMO SKILL CERTIFICATION DATA
 * ============================================================
 */

function createCertificationData(
  provider: Partner,
): SkillCertification[] {
  const services = provider.services
    .split('•')
    .map((service) => service.trim())
    .filter(Boolean)

  return services.map(
    (service, index) => {
      const normalized =
        service.toLowerCase()

      let level:
        | 'Basic'
        | 'Intermediate'
        | 'Advanced' =
        'Intermediate'

      if (
        normalized.includes('electrical') ||
        normalized.includes('plumb') ||
        normalized.includes('carp')
      ) {
        level = 'Advanced'
      }

      if (
        normalized.includes('clean') ||
        normalized.includes('iron') ||
        normalized.includes('garden')
      ) {
        level = 'Intermediate'
      }

      const verified =
        provider.verified !== false &&
        index <
          Math.max(
            1,
            services.length - 1,
          )

      return {
        skill: service,
        level,
        status: verified
          ? 'verified'
          : 'pending',
        certificateId: verified
          ? `NXL-CERT-${provider.id}-${String(
              index + 1,
            ).padStart(2, '0')}`
          : undefined,
        verifiedDate: verified
          ? 'Verified by cooperative'
          : undefined,
        issuer:
          'NeXa Link Cooperative',
        expiryDate: verified
          ? '31 Dec 2027'
          : undefined,
      }
    },
  )
}

/*
 * ============================================================
 * PROVIDER SCREEN
 * ============================================================
 */

export function ProviderScreen() {
  const {
    orders,
    advanceStatus,
    toast,
  } = useStore()

  const [providerId, setProviderId] =
    useState(
      PARTNERS[0]?.id ?? '',
    )

  const [isOnline, setIsOnline] =
    useState(true)

  const [activeSection, setActiveSection] =
    useState<
      | 'overview'
      | 'jobs'
      | 'earnings'
      | 'welfare'
      | 'skills'
      | 'training'
      | 'trust'
      | 'profile'
    >('overview')

  /*
   * ---------------------------------------------------------
   * PROVIDER WORKFLOW
   * ---------------------------------------------------------
   */

  const [workflowStates, setWorkflowStates] =
    useState<
      Record<
        string,
        ProviderWorkflowStatus
      >
    >({})

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          'nexa_link_provider_workflows',
        )

      if (saved) {
        const parsed =
          JSON.parse(saved)

        if (
          parsed &&
          typeof parsed === 'object'
        ) {
          setWorkflowStates(
            parsed,
          )
        }
      }
    } catch {
      // Ignore invalid local storage data.
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(
        'nexa_link_provider_workflows',
        JSON.stringify(
          workflowStates,
        ),
      )
    } catch {
      // Ignore local storage errors.
    }
  }, [workflowStates])

  const provider =
    PARTNERS.find(
      (partner) =>
        partner.id === providerId,
    ) ?? PARTNERS[0]

  /*
   * If the currently selected demo provider has no jobs but another
   * provider does, automatically switch to that provider. This makes
   * newly assigned demo jobs immediately visible in the provider portal.
   */
  useEffect(() => {
    if (!orders.length) {
      return
    }

    const hasJobForProvider =
      orders.some((order) => {
        const extended =
          order as typeof order &
            ExtendedOrder

        const assignedIds =
          getOrderProviderIds(
            extended,
          )

        return Object.values(
          assignedIds,
        ).includes(providerId)
      })

    if (hasJobForProvider) {
      return
    }

    const providerWithJob =
      PARTNERS.find((candidate) =>
        orders.some((order) => {
          const extended =
            order as typeof order &
              ExtendedOrder

          const assignedIds =
            getOrderProviderIds(
              extended,
            )

          return Object.values(
            assignedIds,
          ).includes(candidate.id)
        }),
      )

    if (providerWithJob) {
      setProviderId(
        providerWithJob.id,
      )
    }
  }, [orders, providerId])

  /*
   * ---------------------------------------------------------
   * PROVIDER ORDERS
   * ---------------------------------------------------------
   */

  const providerOrders = useMemo(() => {
    if (!provider) {
      return []
    }

    return orders.filter((order) => {
      const extended =
        order as typeof order &
          ExtendedOrder

      const assignedIds =
        getOrderProviderIds(
          extended,
        )

      /*
       * Multi-service order:
       * check every provider assignment.
       */
      if (
        Object.keys(
          assignedIds,
        ).length > 0
      ) {
        return Object.values(
          assignedIds,
        ).includes(
          provider.id,
        )
      }

      /*
       * Single-provider compatibility.
       */
      return (
        extended.providerId ===
          provider.id ||
        extended.providerName ===
          provider.name
      )
    })
  }, [orders, provider])

  /*
   * ---------------------------------------------------------
   * INITIALIZE PROVIDER WORKFLOW
   * ---------------------------------------------------------
   *
   * If the order already has a system status,
   * synchronize the provider journey with it.
   */

  useEffect(() => {
    if (!providerOrders.length) {
      return
    }

    setWorkflowStates((current) => {
      const next = {
        ...current,
      }

      let changed = false

      for (const order of providerOrders) {
        const expectedWorkflow =
          getInitialWorkflow(
            order.status,
          )

        /*
         * Create workflow state for
         * newly assigned jobs.
         */
        if (
          !next[order.id]
        ) {
          next[order.id] =
            expectedWorkflow

          changed = true
          continue
        }

        /*
         * If the order was already completed,
         * make sure provider journey is completed.
         */
        if (
          order.status ===
            'delivered' &&
          next[order.id] !==
            'completed'
        ) {
          next[order.id] =
            'completed'

          changed = true
        }
      }

      return changed
        ? next
        : current
    })
  }, [providerOrders])

  /*
   * ---------------------------------------------------------
   * JOB STATS
   * ---------------------------------------------------------
   */

  const activeJobs =
    providerOrders.filter(
      (order) =>
        order.status !==
        'delivered',
    )

  const completedJobs =
    providerOrders.filter(
      (order) =>
        order.status ===
        'delivered',
    )

  const totalJobs =
    providerOrders.length

  const completedRevenue =
    completedJobs.reduce(
      (sum, order) =>
        sum + order.total,
      0,
    )

  const platformFee =
    Math.round(
      completedRevenue * 0.1,
    )

  const providerEarnings =
    completedRevenue -
    platformFee

  /*
   * ---------------------------------------------------------
   * TODAY'S JOBS
   * ---------------------------------------------------------
   */

  const todayJobs =
    providerOrders.filter(
      (order) => {
        if (!order.pickupDate) {
          return true
        }

        return (
          order.pickupDate ===
            'Today' ||
          order.pickupDate ===
            new Date()
              .toISOString()
              .slice(0, 10)
        )
      },
    )

  /*
   * ---------------------------------------------------------
   * SERVICE SUMMARY
   * ---------------------------------------------------------
   */

  const serviceSummary =
    useMemo(() => {
      const counts =
        new Map<
          string,
          number
        >()

      for (const order of providerOrders) {
        for (const service of order.services) {
          counts.set(
            service.serviceId,
            (counts.get(
              service.serviceId,
            ) ?? 0) +
              service.itemCount,
          )
        }
      }

      return Array.from(
        counts.entries(),
      )
        .map(
          ([
            serviceId,
            count,
          ]) => ({
            serviceId,
            name: getServiceName(
              serviceId,
            ),
            count,
          }),
        )
        .sort(
          (a, b) =>
            b.count - a.count,
        )
    }, [providerOrders])

  /*
   * ---------------------------------------------------------
   * WORKER WELFARE
   * ---------------------------------------------------------
   */

  const [
    welfareEnrolled,
    setWelfareEnrolled,
  ] = useState(true)

  const [
    insuranceActive,
    setInsuranceActive,
  ] = useState(true)

  const [welfareFund] =
    useState(1200)

  const insuranceCoverage =
    500000

  const welfareBenefits = [
    {
      title:
        'Accident Insurance',
      description:
        'Coverage for workplace accidents and injuries.',
      icon: (
        <ShieldCheck className="h-5 w-5" />
      ),
      status:
        insuranceActive
          ? 'Active'
          : 'Not enrolled',
    },
    {
      title:
        'Medical Support',
      description:
        'Medical assistance support through the cooperative.',
      icon: (
        <HeartPulse className="h-5 w-5" />
      ),
      status:
        welfareEnrolled
          ? 'Eligible'
          : 'Pending',
    },
    {
      title:
        'Emergency Assistance',
      description:
        'Emergency support for verified service providers.',
      icon: (
        <Umbrella className="h-5 w-5" />
      ),
      status:
        welfareEnrolled
          ? 'Available'
          : 'Pending',
    },
    {
      title:
        'Worker Welfare Fund',
      description:
        'Cooperative-supported welfare contribution.',
      icon: (
        <HandHeart className="h-5 w-5" />
      ),
      status:
        welfareEnrolled
          ? 'Active'
          : 'Not enrolled',
    },
  ]

  function handleWelfareEnrollment() {
    setWelfareEnrolled(
      (current) => !current,
    )

    toast(
      welfareEnrolled
        ? 'Welfare program enrollment paused.'
        : 'Worker welfare program activated.',
      'success',
    )
  }

  function handleInsuranceToggle() {
    setInsuranceActive(
      (current) => !current,
    )

    toast(
      insuranceActive
        ? 'Insurance coverage marked inactive.'
        : 'Insurance coverage activated.',
      'success',
    )
  }

  /*
   * ---------------------------------------------------------
   * SKILL CERTIFICATION
   * ---------------------------------------------------------
   */

  const certifications =
    useMemo(
      () => {
        if (!provider) {
          return []
        }

        return createCertificationData(
          provider,
        )
      },
      [provider],
    )

  const verifiedCertifications =
    certifications.filter(
      (certificate) =>
        certificate.status ===
        'verified',
    )

  const pendingCertifications =
    certifications.filter(
      (certificate) =>
        certificate.status ===
        'pending',
    )

  const certificationScore =
    certifications.length > 0
      ? Math.round(
          (verifiedCertifications.length /
            certifications.length) *
            100,
        )
      : 0

  function handleCertificationRequest(
    skill: string,
  ) {
    toast(
      `Certification request submitted for ${skill}.`,
      'success',
    )
  }

  /*
   * ---------------------------------------------------------
   * WORKER TRAINING & SKILL DEVELOPMENT
   * ---------------------------------------------------------
   */

  const trainingStorageKey =
    'nexa_link_provider_training'

  const defaultTrainingCourses =
    useMemo<TrainingCourse[]>(
      () => {
        const serviceNames =
          provider?.services
            .split('•')
            .map((service) => service.trim())
            .filter(Boolean) ?? []

        const courseTemplates = [
          {
            suffix: 'Safety & Customer Care',
            level: 'Basic' as const,
            duration: '2 hours',
            lessons: 6,
            reward: 150,
            description:
              'Workplace safety, customer communication and professional service standards.',
          },
          {
            suffix: 'Professional Service Mastery',
            level: 'Intermediate' as const,
            duration: '4 hours',
            lessons: 10,
            reward: 300,
            description:
              'Improve service quality, job handling and customer satisfaction for your trade.',
          },
          {
            suffix: 'Advanced Skill Upgrade',
            level: 'Advanced' as const,
            duration: '6 hours',
            lessons: 14,
            reward: 500,
            description:
              'Advanced techniques designed to unlock higher-value cooperative assignments.',
          },
        ]

        return serviceNames
          .slice(0, 3)
          .map((service, index) => ({
            id: `training-${provider?.id ?? 'provider'}-${index}`,
            title: `${service} ${courseTemplates[index]?.suffix ?? 'Skill Upgrade'}`,
            skill: service,
            level:
              courseTemplates[index]?.level ??
              'Intermediate',
            duration:
              courseTemplates[index]?.duration ??
              '4 hours',
            lessons:
              courseTemplates[index]?.lessons ?? 10,
            reward:
              courseTemplates[index]?.reward ?? 300,
            description:
              courseTemplates[index]?.description ??
              `Build verified ${service.toLowerCase()} skills through cooperative training.`,
            status:
              index === 0
                ? 'recommended'
                : 'enrolled',
            progress:
              index === 0 ? 0 : index === 1 ? 40 : 70,
            certificateUnlocked: false,
            recommended: index === 0,
          }))
      },
      [provider],
    )

  const [trainingCourses, setTrainingCourses] =
    useState<TrainingCourse[]>(
      defaultTrainingCourses,
    )

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          trainingStorageKey,
        )

      if (saved) {
        const parsed =
          JSON.parse(saved)

        if (Array.isArray(parsed)) {
          setTrainingCourses(parsed)
          return
        }
      }
    } catch {
      // Ignore invalid local storage data.
    }

    setTrainingCourses(
      defaultTrainingCourses,
    )
  }, [defaultTrainingCourses])

  useEffect(() => {
    try {
      localStorage.setItem(
        trainingStorageKey,
        JSON.stringify(trainingCourses),
      )
    } catch {
      // Ignore local storage errors.
    }
  }, [trainingCourses])

  const completedTraining =
    trainingCourses.filter(
      (course) =>
        course.status === 'completed',
    )

  const inProgressTraining =
    trainingCourses.filter(
      (course) =>
        course.status === 'in-progress' ||
        course.status === 'enrolled',
    )

  const trainingProgress =
    trainingCourses.length > 0
      ? Math.round(
          trainingCourses.reduce(
            (sum, course) =>
              sum + course.progress,
            0,
          ) / trainingCourses.length,
        )
      : 0

  const recommendedTraining =
    trainingCourses.find(
      (course) =>
        course.recommended &&
        course.status !== 'completed',
    ) ??
    trainingCourses.find(
      (course) =>
        course.status !== 'completed',
    )

  function enrollTraining(
    courseId: string,
  ) {
    setTrainingCourses((current) =>
      current.map((course) =>
        course.id === courseId
          ? {
              ...course,
              status:
                course.progress > 0
                  ? 'in-progress'
                  : 'enrolled',
              recommended: false,
            }
          : course,
      ),
    )

    toast(
      'Training enrolled successfully. Start learning to unlock certification.',
      'success',
    )
  }

  function continueTraining(
    courseId: string,
  ) {
    setTrainingCourses((current) =>
      current.map((course) => {
        if (course.id !== courseId) {
          return course
        }

        const nextProgress =
          Math.min(
            course.progress + 20,
            100,
          )

        const completed =
          nextProgress >= 100

        return {
          ...course,
          progress: nextProgress,
          status: completed
            ? 'completed'
            : 'in-progress',
          certificateUnlocked:
            completed,
        }
      }),
    )

    const course =
      trainingCourses.find(
        (item) => item.id === courseId,
      )

    if (course) {
      const completed =
        Math.min(
          course.progress + 20,
          100,
        ) >= 100

      toast(
        completed
          ? `${course.skill} training completed. Certificate unlocked!`
          : `${course.skill} training progress updated.`,
        'success',
      )
    }
  }

  /*
   * ---------------------------------------------------------
   * WORKER PERFORMANCE & TRUST SCORE
   * ---------------------------------------------------------
   */

  const complaintCount = useMemo(
    () => getProviderComplaintCount(provider.id),
    [provider.id],
  )

  const completedJobRatio =
    provider.completedJobs > 0
      ? Math.min(100, Math.round((completedJobs.length / Math.max(provider.completedJobs, completedJobs.length)) * 100))
      : completedJobs.length > 0
        ? 100
        : 70

  const reliabilityScore = useMemo(() => {
    const providerJobCount = providerOrders.length

    if (providerJobCount === 0) {
      return 85
    }

    const completed = completedJobs.length
    const active = activeJobs.length
    const completedRatio = completed / Math.max(1, providerJobCount)
    const activeReadiness = active > 0 ? 10 : 0

    return Math.max(0, Math.min(100, Math.round(75 + completedRatio * 15 + activeReadiness)))
  }, [providerOrders.length, completedJobs.length, activeJobs.length])

  const experienceScore = Math.min(100, 55 + provider.experience * 5)

  const trustBreakdown = useMemo<TrustScoreBreakdown>(() => {
    const ratingScore = Math.round((provider.rating / 5) * 100)
    const certificationValue = certificationScore
    const trainingValue = trainingProgress
    const complaintValue = Math.max(0, 100 - getComplaintPenalty(complaintCount))
    const welfareValue = insuranceActive && welfareEnrolled ? 100 : insuranceActive || welfareEnrolled ? 80 : 55

    return {
      rating: ratingScore,
      completedJobs: Math.max(60, completedJobRatio),
      reliability: reliabilityScore,
      certification: certificationValue,
      training: trainingValue,
      complaints: complaintValue,
      experience: experienceScore,
      welfare: welfareValue,
    }
  }, [
    provider.rating,
    completedJobRatio,
    reliabilityScore,
    certificationScore,
    trainingProgress,
    complaintCount,
    insuranceActive,
    welfareEnrolled,
    experienceScore,
  ])

  const trustScore = useMemo(
    () => calculateTrustScore(provider, trustBreakdown),
    [provider, trustBreakdown],
  )

  const trustLevel = getTrustLevel(trustScore)
  const trustDescription = getTrustLevelDescription(trustScore)

  useEffect(() => {
    try {
      const existingScores = JSON.parse(
        localStorage.getItem(TRUST_SCORE_STORAGE_KEY) ?? '{}',
      )

      const safeScores =
        existingScores && typeof existingScores === 'object'
          ? existingScores
          : {}

      safeScores[provider.id] = {
        score: trustScore,
        level: trustLevel,
        breakdown: trustBreakdown,
        updatedAt: Date.now(),
      }

      localStorage.setItem(
        TRUST_SCORE_STORAGE_KEY,
        JSON.stringify(safeScores),
      )

      localStorage.setItem(
        PROVIDER_PERFORMANCE_STORAGE_KEY,
        JSON.stringify({
          providerId: provider.id,
          trustScore,
          trustLevel,
          breakdown: trustBreakdown,
          complaintCount,
          updatedAt: Date.now(),
        }),
      )
    } catch {
      // Ignore local storage errors.
    }
  }, [
    provider.id,
    trustScore,
    trustLevel,
    trustBreakdown,
    complaintCount,
  ])

  function openTrustScore() {
    setActiveSection('trust')
  }

  /*
   * ---------------------------------------------------------
   * PROVIDER WORKFLOW ACTION
   * ---------------------------------------------------------
   *
   * This is the main fix.
   *
   * Provider journey:
   *
   * Assigned
   *    ↓
   * Accepted
   *    ↓
   * On the Way
   *    ↓
   * Arrived
   *    ↓
   * Work Started
   *    ↓
   * Completed
   *
   * Every step also updates the customer order.
   */

  function handleWorkflowAdvance(
    orderId: string,
    orderStatus: OrderStatus,
  ) {
    const currentWorkflow =
      workflowStates[orderId] ??
      getInitialWorkflow(
        orderStatus,
      )

    /*
     * Prevent the provider from skipping
     * workflow stages.
     */
    const nextWorkflow =
      getNextWorkflowStatus(
        currentWorkflow,
      )

    if (!nextWorkflow) {
      toast(
        'This job is already completed.',
        'info',
      )
      return
    }

    /*
     * The system order status corresponding
     * to the next provider workflow step.
     */
    const nextOrderStatus =
      getOrderStatusForWorkflow(
        nextWorkflow,
      )

    /*
     * Update provider workflow.
     */
    setWorkflowStates(
      (current) => ({
        ...current,
        [orderId]:
          nextWorkflow,
      }),
    )

    /*
     * Update customer/system order.
     */
    if (
      nextOrderStatus !==
      orderStatus
    ) {
      advanceStatus(
        orderId,
        nextOrderStatus,
      )
    }

    /*
     * User-friendly action message.
     */
    const message =
      nextWorkflow ===
      'accepted'
        ? `Job #${orderId} accepted.`
        : nextWorkflow ===
            'on-the-way'
          ? `Job #${orderId}: journey started.`
          : nextWorkflow ===
              'arrived'
            ? `Job #${orderId}: customer location reached.`
            : nextWorkflow ===
                'work-started'
              ? `Job #${orderId}: service started.`
              : nextWorkflow ===
                  'completed'
                ? `Job #${orderId}: service completed.`
                : `Job #${orderId}: ${getWorkflowLabel(
                    nextWorkflow,
                  )}.`

    toast(
      message,
      'success',
    )
  }

  /*
   * ---------------------------------------------------------
   * NAVIGATION
   * ---------------------------------------------------------
   */

  function openNavigation(
    address?: string,
  ) {
    if (!address) {
      toast(
        'Customer location is not available.',
        'info',
      )
      return
    }

    const url =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address,
      )}`

    window.open(
      url,
      '_blank',
      'noopener,noreferrer',
    )
  }

  /*
   * ---------------------------------------------------------
   * EMPTY PROVIDER FALLBACK
   * ---------------------------------------------------------
   */

  if (!provider) {
    return (
      <div className="min-h-dvh bg-background">
        <ScreenHeader
          title="Provider Dashboard"
        />

        <div className="px-4 py-10 text-center">
          <UserRound className="mx-auto h-12 w-12 text-muted-foreground" />

          <h2 className="mt-4 text-lg font-bold text-foreground">
            No provider available
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Register a provider to
            access the provider
            dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background pb-28">
      <ScreenHeader
        title="Provider Dashboard"
        showBack={false}
      />

      {/* =====================================================
          PROVIDER SELECTOR
          ===================================================== */}

      <section className="border-b border-border bg-card px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
            {getProviderInitials(
              provider.name,
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Signed in as provider
            </p>

            <p className="truncate text-base font-bold text-foreground">
              {provider.name}
            </p>

            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />

              {provider.verified
                ? 'Verified cooperative provider'
                : 'Verification pending'}
            </div>
          </div>
        </div>

        <select
          value={provider.id}
          onChange={(event) =>
            setProviderId(
              event.target.value,
            )
          }
          className="mt-4 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm font-medium text-foreground outline-none focus:border-primary"
        >
          {PARTNERS.map(
            (partner) => (
              <option
                key={partner.id}
                value={partner.id}
              >
                {partner.name}
              </option>
            ),
          )}
        </select>
      </section>

      {/* =====================================================
          ONLINE / OFFLINE
          ===================================================== */}

      <section className="px-4 pt-4">
        <button
          type="button"
          onClick={() => {
            setIsOnline(
              (current) => !current,
            )

            toast(
              isOnline
                ? 'You are now offline'
                : 'You are now online and available for jobs',
              'info',
            )
          }}
          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 transition-all ${
            isOnline
              ? 'border-primary/30 bg-primary/5'
              : 'border-border bg-card'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isOnline
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Power className="h-5 w-5" />
            </div>

            <div className="text-left">
              <p className="text-sm font-bold text-foreground">
                {isOnline
                  ? 'You are Online'
                  : 'You are Offline'}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {isOnline
                  ? 'Ready to receive new service assignments'
                  : 'You will not receive new assignments'}
              </p>
            </div>
          </div>

          <div
            className={`h-3 w-3 rounded-full ${
              isOnline
                ? 'bg-primary'
                : 'bg-muted-foreground'
            }`}
          />
        </button>
      </section>

      {/* =====================================================
          QUICK NAVIGATION
          ===================================================== */}

      <section className="px-4 pt-5">
        <div className="grid grid-cols-8 gap-2">
          <DashboardTab
            active={
              activeSection ===
              'overview'
            }
            icon={
              <Activity className="h-4 w-4" />
            }
            label="Overview"
            onClick={() =>
              setActiveSection(
                'overview',
              )
            }
          />

          <DashboardTab
            active={
              activeSection ===
              'jobs'
            }
            icon={
              <Navigation className="h-4 w-4" />
            }
            label="Jobs"
            onClick={() =>
              setActiveSection(
                'jobs',
              )
            }
          />

          <DashboardTab
            active={
              activeSection ===
              'earnings'
            }
            icon={
              <Wallet className="h-4 w-4" />
            }
            label="Earnings"
            onClick={() =>
              setActiveSection(
                'earnings',
              )
            }
          />

          <DashboardTab
            active={
              activeSection ===
              'welfare'
            }
            icon={
              <HeartPulse className="h-4 w-4" />
            }
            label="Welfare"
            onClick={() =>
              setActiveSection(
                'welfare',
              )
            }
          />

          <DashboardTab
            active={
              activeSection ===
              'skills'
            }
            icon={
              <GraduationCap className="h-4 w-4" />
            }
            label="Skills"
            onClick={() =>
              setActiveSection(
                'skills',
              )
            }
          />

          <DashboardTab
            active={
              activeSection ===
              'training'
            }
            icon={
              <BookOpen className="h-4 w-4" />
            }
            label="Training"
            onClick={() =>
              setActiveSection(
                'training',
              )
            }
          />

          <DashboardTab
            active={
              activeSection ===
              'trust'
            }
            icon={
              <Trophy className="h-4 w-4" />
            }
            label="Trust"
            onClick={() =>
              setActiveSection(
                'trust',
              )
            }
          />

          <DashboardTab
            active={
              activeSection ===
              'profile'
            }
            icon={
              <UserRound className="h-4 w-4" />
            }
            label="Profile"
            onClick={() =>
              setActiveSection(
                'profile',
              )
            }
          />
        </div>
      </section>

      {/* =====================================================
          OVERVIEW
          ===================================================== */}

      {activeSection ===
        'overview' && (
        <>
          <section className="grid grid-cols-2 gap-3 px-4 pt-5">
            <StatCard
              icon={
                <CalendarDays className="h-5 w-5" />
              }
              label="Today's Jobs"
              value={String(
                todayJobs.length,
              )}
            />

            <StatCard
              icon={
                <Clock3 className="h-5 w-5" />
              }
              label="Active Jobs"
              value={String(
                activeJobs.length,
              )}
            />

            <StatCard
              icon={
                <CheckCircle2 className="h-5 w-5" />
              }
              label="Completed"
              value={String(
                completedJobs.length,
              )}
            />

            <StatCard
              icon={
                <IndianRupee className="h-5 w-5" />
              }
              label="Earned"
              value={rupees(
                providerEarnings,
              )}
            />
          </section>

          <section className="px-4 pt-5">
            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  'welfare',
                )
              }
              className="w-full rounded-3xl border border-primary/20 bg-primary/5 p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <HeartPulse className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">
                      Worker Welfare
                    </p>

                    {welfareEnrolled && (
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    )}
                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {insuranceActive
                      ? 'Insurance active · ₹5 lakh coverage'
                      : 'Insurance enrollment required'}
                  </p>
                </div>

                <ChevronRight className="h-5 w-5 text-primary" />
              </div>
            </button>
          </section>

          <section className="px-4 pt-5">
            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  'skills',
                )
              }
              className="w-full rounded-3xl border border-primary/20 bg-primary/5 p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <GraduationCap className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">
                      Skill Certification
                    </p>

                    {certificationScore ===
                      100 && (
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    )}
                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {
                      verifiedCertifications.length
                    }{' '}
                    of{' '}
                    {
                      certifications.length
                    }{' '}
                    skills verified
                  </p>
                </div>

                <ChevronRight className="h-5 w-5 text-primary" />
              </div>
            </button>
          </section>

          <section className="px-4 pt-5">
            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  'training',
                )
              }
              className="w-full rounded-3xl border border-primary/20 bg-primary/5 p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">
                      Skill Development
                    </p>

                    {trainingProgress >= 70 && (
                      <Trophy className="h-4 w-4 text-primary" />
                    )}
                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {completedTraining.length} completed ·{' '}
                    {inProgressTraining.length} active ·{' '}
                    {trainingProgress}% overall progress
                  </p>
                </div>

                <ChevronRight className="h-5 w-5 text-primary" />
              </div>
            </button>
          </section>

          <section className="px-4 pt-5">
            <button
              type="button"
              onClick={openTrustScore}
              className="w-full rounded-3xl border border-primary/20 bg-primary/5 p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Trophy className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">
                      Worker Trust Score
                    </p>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {trustLevel}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {trustScore}/100 · AI matching readiness
                  </p>
                </div>

                <ChevronRight className="h-5 w-5 text-primary" />
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary/10">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${trustScore}%` }}
                />
              </div>
            </button>
          </section>

          <section className="px-4 pt-5">
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="overflow-hidden rounded-3xl bg-foreground text-background"
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background/10 text-lg font-bold">
                    {getProviderInitials(
                      provider.name,
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-lg font-bold">
                        {provider.name}
                      </h2>

                      {provider.verified && (
                        <ShieldCheck className="h-4 w-4 shrink-0" />
                      )}
                    </div>

                    <p className="mt-1 text-xs opacity-70">
                      Provider ID:{' '}
                      {provider.id}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-background/10 px-2.5 py-1 text-[11px] font-semibold">
                        ⭐{' '}
                        {provider.rating.toFixed(
                          1,
                        )}
                      </span>

                      <span className="rounded-full bg-background/10 px-2.5 py-1 text-[11px] font-semibold">
                        {
                          provider.completedJobs
                        }{' '}
                        jobs
                      </span>

                      <span className="rounded-full bg-background/10 px-2.5 py-1 text-[11px] font-semibold">
                        {
                          provider.experience
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MiniDarkStat
                    label="Service Area"
                    value={
                      provider.serviceArea ||
                      'Chennai'
                    }
                  />

                  <MiniDarkStat
                    label="Distance"
                    value={getProviderDistance(
                      provider,
                    )}
                  />

                  <MiniDarkStat
                    label="Turnaround"
                    value={
                      provider.turnaround
                    }
                  />

                  <MiniDarkStat
                    label="Availability"
                    value={
                      isOnline
                        ? 'Available'
                        : 'Offline'
                    }
                  />
                </div>
              </div>
            </motion.div>
          </section>

          <section className="px-4 pt-5">
            <SectionTitle
              icon={
                <Star className="h-4 w-4" />
              }
              title="Performance"
              action="View details"
              onAction={() =>
                setActiveSection(
                  'profile',
                )
              }
            />

            <div className="mt-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                  {provider.rating.toFixed(
                    1,
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex gap-1">
                    {Array.from({
                      length: 5,
                    }).map(
                      (_, index) => (
                        <Star
                          key={index}
                          className={`h-4 w-4 ${
                            index <
                            Math.round(
                              provider.rating,
                            )
                              ? 'fill-current text-primary'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ),
                    )}
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Customer satisfaction
                    rating
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 pt-5">
            <SectionTitle
              icon={
                <Zap className="h-4 w-4" />
              }
              title="My Services"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {provider.services
                .split('•')
                .map(
                  (service) => (
                    <span
                      key={service}
                      className="rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground"
                    >
                      {service.trim()}
                    </span>
                  ),
                )}
            </div>
          </section>

          <section className="px-4 pt-6">
            <SectionTitle
              icon={
                <Navigation className="h-4 w-4" />
              }
              title="Recent Jobs"
              action="View all"
              onAction={() =>
                setActiveSection(
                  'jobs',
                )
              }
            />

            <div className="mt-3 space-y-3">
              {providerOrders
                .slice(0, 3)
                .map((order) => (
                  <JobCard
                    key={order.id}
                    order={order}
                    providerId={
                      provider.id
                    }
                    workflowStatus={
                      workflowStates[
                        order.id
                      ] ??
                      getInitialWorkflow(
                        order.status,
                      )
                    }
                    onAdvance={
                      handleWorkflowAdvance
                    }
                    onNavigate={
                      openNavigation
                    }
                  />
                ))}

              {providerOrders.length ===
                0 && (
                <EmptyState
                  icon={
                    <CalendarDays className="h-6 w-6" />
                  }
                  title="No assigned jobs"
                  description="New AI-matched service assignments will appear here."
                />
              )}
            </div>
          </section>
        </>
      )}

      {/* =====================================================
          JOBS
          ===================================================== */}

      {activeSection ===
        'jobs' && (
        <section className="px-4 pt-5">
          <SectionTitle
            icon={
              <Navigation className="h-4 w-4" />
            }
            title="My Jobs"
          />

          <div className="mt-3 space-y-3">
            {providerOrders.map(
              (order) => (
                <JobCard
                  key={order.id}
                  order={order}
                  providerId={
                    provider.id
                  }
                  workflowStatus={
                    workflowStates[
                      order.id
                    ] ??
                    getInitialWorkflow(
                      order.status,
                    )
                  }
                  onAdvance={
                    handleWorkflowAdvance
                  }
                  onNavigate={
                    openNavigation
                  }
                />
              ),
            )}

            {providerOrders.length ===
              0 && (
              <EmptyState
                icon={
                  <CalendarDays className="h-6 w-6" />
                }
                title="No jobs assigned"
                description="Stay online to receive new jobs from the cooperative."
              />
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          EARNINGS
          ===================================================== */}

      {activeSection ===
        'earnings' && (
        <>
          <section className="px-4 pt-5">
            <div className="rounded-3xl bg-foreground p-5 text-background">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background/10">
                  <Wallet className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs opacity-70">
                    Available earnings
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {rupees(
                      providerEarnings,
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <MiniDarkStat
                  label="Gross"
                  value={rupees(
                    completedRevenue,
                  )}
                />

                <MiniDarkStat
                  label="Platform fee"
                  value={rupees(
                    platformFee,
                  )}
                />

                <MiniDarkStat
                  label="Jobs"
                  value={String(
                    completedJobs.length,
                  )}
                />
              </div>
            </div>
          </section>

          <section className="px-4 pt-5">
            <SectionTitle
              icon={
                <TrendingUp className="h-4 w-4" />
              }
              title="Service Performance"
            />

            <div className="mt-3 space-y-2">
              {serviceSummary.map(
                (service) => (
                  <div
                    key={
                      service.serviceId
                    }
                    className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {service.name}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {service.count}{' '}
                        items handled
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ),
              )}

              {serviceSummary.length ===
                0 && (
                <EmptyState
                  icon={
                    <TrendingUp className="h-6 w-6" />
                  }
                  title="No earnings yet"
                  description="Complete assigned jobs to start building your wallet."
                />
              )}
            </div>
          </section>

          <section className="px-4 pt-5">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-bold text-foreground">
                    Transparent cooperative
                    earnings
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Your dashboard shows
                    gross job value,
                    platform fee and your
                    estimated provider
                    earnings separately.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* =====================================================
          WORKER WELFARE + INSURANCE
          ===================================================== */}

      {activeSection ===
        'welfare' && (
        <>
          <section className="px-4 pt-5">
            <div className="overflow-hidden rounded-3xl bg-foreground p-5 text-background">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background/10">
                  <HeartPulse className="h-7 w-7" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-60">
                    Cooperative Worker Welfare
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Your protection matters
                  </h2>

                  <p className="mt-2 text-xs leading-5 opacity-70">
                    NeXa Link connects service
                    providers with cooperative
                    welfare and protection
                    benefits.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <MiniDarkStat
                  label="Insurance coverage"
                  value={
                    insuranceActive
                      ? '₹5,00,000'
                      : 'Inactive'
                  }
                />

                <MiniDarkStat
                  label="Welfare fund"
                  value={rupees(
                    welfareFund,
                  )}
                />
              </div>
            </div>
          </section>

          <section className="px-4 pt-5">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    welfareEnrolled
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <BadgeCheck className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground">
                    Welfare Program
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {welfareEnrolled
                      ? 'You are enrolled in the cooperative welfare program.'
                      : 'You are currently not enrolled.'}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    welfareEnrolled
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {welfareEnrolled
                    ? 'ACTIVE'
                    : 'INACTIVE'}
                </span>
              </div>

              <button
                type="button"
                onClick={
                  handleWelfareEnrollment
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 py-3 text-xs font-bold text-primary"
              >
                <FileCheck2 className="h-4 w-4" />

                {welfareEnrolled
                  ? 'Manage Welfare Enrollment'
                  : 'Enroll in Welfare Program'}
              </button>
            </div>
          </section>

          <section className="px-4 pt-5">
            <SectionTitle
              icon={
                <ShieldCheck className="h-4 w-4" />
              }
              title="Insurance Protection"
            />

            <div className="mt-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    insuranceActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-foreground">
                      Accident Insurance
                    </p>

                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-bold ${
                        insuranceActive
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {insuranceActive
                        ? 'ACTIVE'
                        : 'INACTIVE'}
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Protection for eligible
                    workplace accidents and
                    service-related injuries.
                  </p>

                  <div className="mt-3 rounded-xl bg-muted/50 p-3">
                    <p className="text-[10px] text-muted-foreground">
                      Coverage amount
                    </p>

                    <p className="mt-1 text-lg font-bold text-foreground">
                      ₹
                      {insuranceCoverage.toLocaleString(
                        'en-IN',
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  handleInsuranceToggle
                }
                className="mt-4 w-full rounded-xl border border-border py-2.5 text-xs font-bold text-foreground"
              >
                {insuranceActive
                  ? 'View / Manage Coverage'
                  : 'Activate Insurance'}
              </button>
            </div>
          </section>

          <section className="px-4 pt-5">
            <SectionTitle
              icon={
                <HandHeart className="h-4 w-4" />
              }
              title="Available Benefits"
            />

            <div className="mt-3 space-y-3">
              {welfareBenefits.map(
                (benefit) => (
                  <div
                    key={
                      benefit.title
                    }
                    className="rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {benefit.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-foreground">
                            {
                              benefit.title
                            }
                          </p>

                          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold text-primary">
                            {
                              benefit.status
                            }
                          </span>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {
                            benefit.description
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>

          <section className="px-4 pt-5">
            <SectionTitle
              icon={
                <IndianRupee className="h-4 w-4" />
              }
              title="Welfare Fund"
            />

            <div className="mt-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Wallet className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">
                    Your welfare fund
                  </p>

                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {rupees(
                      welfareFund,
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.min(
                      (welfareFund /
                        5000) *
                        100,
                      100,
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-[10px] text-muted-foreground">
                Cooperative welfare contribution
                balance
              </p>
            </div>
          </section>

          <section className="px-4 pt-5">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <PhoneCall className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-bold text-foreground">
                    Emergency Support
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    In case of an accident or
                    emergency during a service,
                    contact the cooperative
                    support team.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      toast(
                        'Cooperative emergency support contacted.',
                        'success',
                      )
                    }
                    className="mt-3 rounded-xl bg-primary px-4 py-2.5 text-[11px] font-bold text-primary-foreground"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* =====================================================
          SKILL CERTIFICATION
          ===================================================== */}

      {activeSection ===
        'skills' && (
        <>
          <section className="px-4 pt-5">
            <div className="overflow-hidden rounded-3xl bg-foreground p-5 text-background">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background/10">
                  <GraduationCap className="h-7 w-7" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-60">
                    Cooperative Skill Registry
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Skills & Certification
                  </h2>

                  <p className="mt-2 text-xs leading-5 opacity-70">
                    Verified skills help customers
                    find qualified service providers
                    with greater confidence.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <MiniDarkStat
                  label="Skills"
                  value={String(
                    certifications.length,
                  )}
                />

                <MiniDarkStat
                  label="Verified"
                  value={String(
                    verifiedCertifications.length,
                  )}
                />

                <MiniDarkStat
                  label="Score"
                  value={`${certificationScore}%`}
                />
              </div>
            </div>
          </section>

          <section className="px-4 pt-5">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Certification readiness
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Complete cooperative verification
                    for all registered skills.
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {certificationScore}%
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${certificationScore}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>
                  {
                    verifiedCertifications.length
                  }{' '}
                  verified
                </span>

                <span>
                  {
                    pendingCertifications.length
                  }{' '}
                  pending
                </span>
              </div>
            </div>
          </section>

          <section className="px-4 pt-5">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-bold text-foreground">
                    Cooperative verification
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    NeXa Link can maintain a verified
                    skill registry where cooperatives
                    review worker skills, certificates
                    and experience before displaying
                    verified badges.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 pt-5">
            <SectionTitle
              icon={
                <Award className="h-4 w-4" />
              }
              title="My Certifications"
            />

            <div className="mt-3 space-y-3">
              {certifications.map(
                (certificate) => {
                  const verified =
                    certificate.status ===
                    'verified'

                  const pending =
                    certificate.status ===
                    'pending'

                  return (
                    <div
                      key={
                        certificate.skill
                      }
                      className="rounded-2xl border border-border bg-card p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            verified
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {verified ? (
                            <BadgeCheck className="h-5 w-5" />
                          ) : (
                            <Clock3 className="h-5 w-5" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-bold text-foreground">
                                {
                                  certificate.skill
                                }
                              </p>

                              <p className="mt-1 text-[11px] text-muted-foreground">
                                Skill level:{' '}
                                <span className="font-semibold text-foreground">
                                  {
                                    certificate.level
                                  }
                                </span>
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${
                                verified
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {verified
                                ? 'VERIFIED'
                                : 'PENDING'}
                            </span>
                          </div>

                          {verified && (
                            <>
                              <div className="mt-3 rounded-xl bg-muted/50 p-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-[9px] text-muted-foreground">
                                      Certificate ID
                                    </p>

                                    <p className="mt-1 break-all text-[10px] font-bold text-foreground">
                                      {
                                        certificate.certificateId
                                      }
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-[9px] text-muted-foreground">
                                      Verified by
                                    </p>

                                    <p className="mt-1 text-[10px] font-bold text-foreground">
                                      {
                                        certificate.issuer
                                      }
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-[9px] text-muted-foreground">
                                      Verification
                                    </p>

                                    <p className="mt-1 text-[10px] font-semibold text-primary">
                                      {
                                        certificate.verifiedDate
                                      }
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-[9px] text-muted-foreground">
                                      Valid until
                                    </p>

                                    <p className="mt-1 text-[10px] font-semibold text-foreground">
                                      {
                                        certificate.expiryDate
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-primary">
                                <FileBadge className="h-3.5 w-3.5" />
                                Cooperative certificate verified
                              </div>
                            </>
                          )}

                          {pending && (
                            <div className="mt-3 rounded-xl bg-muted/50 p-3">
                              <div className="flex items-start gap-2">
                                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                                <div>
                                  <p className="text-[10px] font-bold text-foreground">
                                    Verification pending
                                  </p>

                                  <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                                    Submit supporting
                                    experience or
                                    training documents
                                    to complete
                                    cooperative
                                    verification.
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleCertificationRequest(
                                    certificate.skill,
                                  )
                                }
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-[10px] font-bold text-primary-foreground"
                              >
                                <FileCheck2 className="h-3.5 w-3.5" />
                                Request Certification
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                },
              )}

              {certifications.length ===
                0 && (
                <EmptyState
                  icon={
                    <GraduationCap className="h-6 w-6" />
                  }
                  title="No skills registered"
                  description="Register your service skills to begin cooperative certification."
                />
              )}
            </div>
          </section>

          <section className="px-4 pt-5">
            <SectionTitle
              icon={
                <Award className="h-4 w-4" />
              }
              title="Why certification matters"
            />

            <div className="mt-3 grid grid-cols-1 gap-3">
              <CertificationBenefit
                icon={
                  <ShieldCheck className="h-5 w-5" />
                }
                title="Customer trust"
                description="Verified skills help customers choose qualified providers."
              />

              <CertificationBenefit
                icon={
                  <Zap className="h-5 w-5" />
                }
                title="Better job matching"
                description="Certified workers can receive more relevant AI-powered assignments."
              />

              <CertificationBenefit
                icon={
                  <TrendingUp className="h-5 w-5" />
                }
                title="Professional growth"
                description="Workers can build a transparent skill and experience profile."
              />
            </div>
          </section>
        </>
      )}

      {/* =====================================================
          WORKER TRAINING & SKILL DEVELOPMENT
          ===================================================== */}

      {activeSection ===
        'training' && (
        <>
          <section className="px-4 pt-5">
            <div className="overflow-hidden rounded-3xl bg-foreground p-5 text-background">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background/10">
                  <BookOpen className="h-7 w-7" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-60">
                    Cooperative Learning Hub
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Learn. Certify. Earn more.
                  </h2>

                  <p className="mt-2 text-xs leading-5 opacity-70">
                    Build verified skills through cooperative training and unlock better-matched assignments.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <MiniDarkStat
                  label="Progress"
                  value={`${trainingProgress}%`}
                />

                <MiniDarkStat
                  label="Active"
                  value={String(
                    inProgressTraining.length,
                  )}
                />

                <MiniDarkStat
                  label="Completed"
                  value={String(
                    completedTraining.length,
                  )}
                />
              </div>
            </div>
          </section>

          {recommendedTraining && (
            <section className="px-4 pt-5">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Trophy className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
                      AI Recommended Training
                    </p>

                    <p className="mt-1 text-sm font-bold text-foreground">
                      {recommendedTraining.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      This training can strengthen your {recommendedTraining.skill.toLowerCase()} profile and improve eligibility for relevant cooperative jobs.
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {recommendedTraining.duration}
                      <span>·</span>
                      <Award className="h-3.5 w-3.5" />
                      ₹{recommendedTraining.reward} learning reward
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    recommendedTraining.status ===
                    'recommended'
                      ? enrollTraining(
                          recommendedTraining.id,
                        )
                      : continueTraining(
                          recommendedTraining.id,
                        )
                  }
                  className="mt-4 w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground"
                >
                  {recommendedTraining.status ===
                  'recommended'
                    ? 'Start Recommended Training'
                    : 'Continue Training'}
                </button>
              </div>
            </section>
          )}

          <section className="px-4 pt-5">
            <SectionTitle
              icon={
                <ClipboardCheck className="h-4 w-4" />
              }
              title="Training Courses"
            />

            <div className="mt-3 space-y-3">
              {trainingCourses.map(
                (course) => {
                  const completed =
                    course.status ===
                    'completed'

                  const enrolled =
                    course.status ===
                      'enrolled' ||
                    course.status ===
                      'in-progress'

                  return (
                    <div
                      key={course.id}
                      className="rounded-2xl border border-border bg-card p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            completed
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {completed ? (
                            <Trophy className="h-5 w-5" />
                          ) : (
                            <BookOpen className="h-5 w-5" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-bold text-foreground">
                                {course.title}
                              </p>

                              <p className="mt-1 text-[10px] text-muted-foreground">
                                {course.level} · {course.duration} · {course.lessons} lessons
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${
                                completed
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {completed
                                ? 'COMPLETED'
                                : course.status ===
                                    'recommended'
                                  ? 'RECOMMENDED'
                                  : enrolled
                                    ? 'IN PROGRESS'
                                    : 'AVAILABLE'}
                            </span>
                          </div>

                          <p className="mt-2 text-xs leading-5 text-muted-foreground">
                            {course.description}
                          </p>

                          <div className="mt-3 flex items-center justify-between text-[10px] font-semibold">
                            <span className="text-muted-foreground">
                              {course.progress}% complete
                            </span>

                            <span className="text-primary">
                              Reward ₹{course.reward}
                            </span>
                          </div>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{
                                width: `${course.progress}%`,
                              }}
                            />
                          </div>

                          {completed ? (
                            <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2 text-[10px] font-bold text-primary">
                              <BadgeCheck className="h-4 w-4" />
                              Training certificate unlocked · Skill can be submitted for cooperative verification.
                            </div>
                          ) : enrolled ? (
                            <button
                              type="button"
                              onClick={() =>
                                continueTraining(
                                  course.id,
                                )
                              }
                              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-[10px] font-bold text-primary-foreground"
                            >
                              <Play className="h-3.5 w-3.5" />
                              Continue Learning
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                enrollTraining(
                                  course.id,
                                )
                              }
                              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 py-2.5 text-[10px] font-bold text-primary"
                            >
                              <BookOpen className="h-3.5 w-3.5" />
                              Enroll in Training
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                },
              )}

              {trainingCourses.length === 0 && (
                <EmptyState
                  icon={
                    <LockKeyhole className="h-6 w-6" />
                  }
                  title="No training available"
                  description="Register service skills to receive cooperative training recommendations."
                />
              )}
            </div>
          </section>

          <section className="px-4 pt-5">
            <SectionTitle
              icon={
                <Award className="h-4 w-4" />
              }
              title="Why upskilling matters"
            />

            <div className="mt-3 grid grid-cols-1 gap-3">
              <CertificationBenefit
                icon={
                  <TrendingUp className="h-5 w-5" />
                }
                title="Unlock better jobs"
                description="Higher skill levels can improve eligibility for higher-value and specialized assignments."
              />

              <CertificationBenefit
                icon={
                  <BadgeCheck className="h-5 w-5" />
                }
                title="Build verified credentials"
                description="Completed training can be submitted to the cooperative for formal skill certification."
              />

              <CertificationBenefit
                icon={
                  <IndianRupee className="h-5 w-5" />
                }
                title="Increase earning potential"
                description="Upskilling helps workers qualify for more services and build stronger professional profiles."
              />
            </div>
          </section>
        </>
      )}

      {/* =====================================================
          WORKER PERFORMANCE & TRUST SCORE
          ===================================================== */}

      {activeSection ===
        'trust' && (
        <>
          <section className="px-4 pt-5">
            <div className="overflow-hidden rounded-3xl bg-foreground p-5 text-background">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-60">
                    NeXa Link Trust System
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    Worker Performance
                  </h2>
                  <p className="mt-2 text-xs leading-5 opacity-70">
                    Your Trust Score combines service quality, reliability, verified skills, training and worker welfare signals.
                  </p>
                </div>

                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-background/10">
                  <Trophy className="h-5 w-5" />
                  <span className="mt-1 text-2xl font-bold">
                    {trustScore}
                  </span>
                  <span className="text-[9px] font-semibold opacity-60">/ 100</span>
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-background/10">
                <div
                  className="h-full rounded-full bg-background"
                  style={{ width: `${trustScore}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-full bg-background/10 px-3 py-1 text-[11px] font-bold">
                  {trustLevel}
                </span>
                <span className="text-[11px] opacity-60">
                  Updated automatically
                </span>
              </div>
            </div>
          </section>

          <section className="px-4 pt-5">
            <SectionTitle
              icon={<Activity className="h-4 w-4" />}
              title="Trust Score Breakdown"
            />

            <div className="mt-3 space-y-3">
              {([
                ['Customer Rating', trustBreakdown.rating, 'Your customer satisfaction rating'],
                ['Completed Jobs', trustBreakdown.completedJobs, 'Consistency in completing assigned work'],
                ['Reliability', trustBreakdown.reliability, 'Readiness and successful workflow completion'],
                ['Verified Skills', trustBreakdown.certification, 'Verified cooperative certifications'],
                ['Training', trustBreakdown.training, 'Progress in worker skill development'],
                ['Complaint Record', trustBreakdown.complaints, complaintCount === 0 ? 'No linked complaints found' : `${complaintCount} complaint(s) linked to this provider`],
                ['Experience', trustBreakdown.experience, `${provider.experience} years of experience`],
                ['Welfare & Protection', trustBreakdown.welfare, insuranceActive && welfareEnrolled ? 'Welfare and insurance active' : 'Activate welfare and insurance to strengthen protection'],
              ] as Array<[string, number, string]>).map(([label, score, description]) => (
                <div key={label} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground">{label}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-primary">{score}/100</span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="px-4 pt-5">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Why Trust Score matters
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {trustDescription} AI matching can use this score alongside distance, availability, skills and emergency priority when ranking suitable cooperative workers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 pt-5 pb-8">
            <SectionTitle
              icon={<TrendingUp className="h-4 w-4" />}
              title="Improve Your Score"
            />

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveSection('training')}
                className="rounded-2xl border border-border bg-card p-4 text-left"
              >
                <BookOpen className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-bold text-foreground">Complete Training</p>
                <p className="mt-1 text-[11px] leading-4 text-muted-foreground">Current progress: {trainingProgress}%</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('skills')}
                className="rounded-2xl border border-border bg-card p-4 text-left"
              >
                <GraduationCap className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-bold text-foreground">Verify Skills</p>
                <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{verifiedCertifications.length}/{certifications.length} verified</p>
              </button>
            </div>
          </section>
        </>
      )}

      {/* =====================================================
          PROFILE
          ===================================================== */}

      {activeSection ===
        'profile' && (
        <>
          <section className="px-4 pt-5">
            <div className="rounded-3xl border border-border bg-card p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                  {getProviderInitials(
                    provider.name,
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-bold text-foreground">
                    {provider.name}
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {provider.id}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <ShieldCheck className="h-4 w-4" />

                    {provider.verified
                      ? 'Verified Provider'
                      : 'Verification Pending'}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 pt-5">
            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  'skills',
                )
              }
              className="w-full rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <GraduationCap className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground">
                    Skill Certifications
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {
                      verifiedCertifications.length
                    }{' '}
                    verified ·{' '}
                    {
                      pendingCertifications.length
                    }{' '}
                    pending
                  </p>
                </div>

                <ChevronRight className="h-5 w-5 text-primary" />
              </div>
            </button>
          </section>

          <section className="px-4 pt-5">
            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  'training',
                )
              }
              className="w-full rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground">
                    Skill Development
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {trainingProgress}% progress · {completedTraining.length} completed
                  </p>
                </div>

                <ChevronRight className="h-5 w-5 text-primary" />
              </div>
            </button>
          </section>

          <section className="px-4 pt-5">
            <InfoRow
              icon={
                <Activity className="h-4 w-4" />
              }
              label="Status"
              value={
                isOnline
                  ? 'Online'
                  : 'Offline'
              }
            />

            <InfoRow
              icon={
                <MapPin className="h-4 w-4" />
              }
              label="Service Area"
              value={
                provider.serviceArea ||
                'Chennai'
              }
            />

            <InfoRow
              icon={
                <Navigation className="h-4 w-4" />
              }
              label="Current Distance"
              value={getProviderDistance(
                provider,
              )}
            />

            <InfoRow
              icon={
                <Clock3 className="h-4 w-4" />
              }
              label="Turnaround"
              value={
                provider.turnaround
              }
            />

            <InfoRow
              icon={
                <Star className="h-4 w-4" />
              }
              label="Rating"
              value={`${provider.rating.toFixed(
                1,
              )} / 5`}
            />

            <InfoRow
              icon={
                <CheckCircle2 className="h-4 w-4" />
              }
              label="Completed Jobs"
              value={String(
                provider.completedJobs,
              )}
            />

            <InfoRow
              icon={
                <GraduationCap className="h-4 w-4" />
              }
              label="Verified Skills"
              value={`${verifiedCertifications.length} / ${certifications.length}`}
            />

            <InfoRow
              icon={
                <HeartPulse className="h-4 w-4" />
              }
              label="Welfare Status"
              value={
                welfareEnrolled
                  ? 'Enrolled'
                  : 'Not enrolled'
              }
            />

            <InfoRow
              icon={
                <ShieldCheck className="h-4 w-4" />
              }
              label="Insurance"
              value={
                insuranceActive
                  ? 'Active · ₹5 lakh'
                  : 'Inactive'
              }
            />
          </section>

          <section className="px-4 pt-5">
            <SectionTitle
              icon={
                <UserRound className="h-4 w-4" />
              }
              title="Registered Services"
            />

            <div className="mt-3 space-y-2">
              {provider.services
                .split('•')
                .map(
                  (service) => (
                    <div
                      key={service}
                      className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
                    >
                      {service.trim()}
                    </div>
                  ),
                )}
            </div>
          </section>
        </>
      )}

      {/* =====================================================
          FOOTER SUMMARY
          ===================================================== */}

      <section className="px-4 pt-6">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                Total jobs
              </p>

              <p className="mt-1 text-lg font-bold text-foreground">
                {totalJobs}
              </p>
            </div>

            <div className="h-8 w-px bg-border" />

            <div>
              <p className="text-xs text-muted-foreground">
                Completed
              </p>

              <p className="mt-1 text-lg font-bold text-primary">
                {completedJobs.length}
              </p>
            </div>

            <div className="h-8 w-px bg-border" />

            <div>
              <p className="text-xs text-muted-foreground">
                Earnings
              </p>

              <p className="mt-1 text-lg font-bold text-foreground">
                {rupees(
                  providerEarnings,
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ============================================================
   DASHBOARD TAB
   ============================================================ */

function DashboardTab({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl border text-[9px] font-semibold transition-all ${
        active
          ? 'border-primary/30 bg-primary/10 text-primary'
          : 'border-border bg-card text-muted-foreground'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

/* ============================================================
   STAT CARD
   ============================================================ */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-2xl border border-border bg-card p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <Activity className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      <p className="mt-4 text-2xl font-bold text-foreground">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-muted-foreground">
        {label}
      </p>
    </motion.div>
  )
}

/* ============================================================
   MINI DARK STAT
   ============================================================ */

function MiniDarkStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-background/10 px-3 py-2.5">
      <p className="text-[10px] opacity-60">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold">
        {value}
      </p>
    </div>
  )
}

/* ============================================================
   SECTION TITLE
   ============================================================ */

function SectionTitle({
  icon,
  title,
  action,
  onAction,
}: {
  icon: React.ReactNode
  title: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>

        <h2 className="text-sm font-bold text-foreground">
          {title}
        </h2>
      </div>

      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-1 text-xs font-semibold text-primary"
        >
          {action}
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

/* ============================================================
   CERTIFICATION BENEFIT
   ============================================================ */

function CertificationBenefit({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div>
          <p className="text-sm font-bold text-foreground">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   JOB CARD
   ============================================================ */

function JobCard({
  order,
  providerId,
  workflowStatus,
  onAdvance,
  onNavigate,
}: {
  order: {
    id: string
    status: OrderStatus
    total: number
    services: Array<{
      serviceId: string
      itemCount: number
    }>
    address?: {
      label?: string
      address?: string
    }
    pickupDate?: string
    pickupSlot?: string
    bookingType?: string
    priority?: string
  }
  providerId: string
  workflowStatus: ProviderWorkflowStatus
  onAdvance: (
    orderId: string,
    status: OrderStatus,
  ) => void
  onNavigate: (
    address?: string,
  ) => void
}) {
  const extended =
    order as typeof order &
      ExtendedOrder

  const assignedIds =
    getOrderProviderIds(
      extended,
    )

  const assignedServiceIds =
    Object.entries(
      assignedIds,
    )
      .filter(
        ([, assignedProviderId]) =>
          assignedProviderId ===
          providerId,
      )
      .map(
        ([serviceId]) =>
          serviceId,
      )

  const relevantServices =
    order.services.filter(
      (service) =>
        assignedServiceIds.length ===
          0 ||
        assignedServiceIds.includes(
          service.serviceId,
        ),
    )

  const currentWorkflowIndex =
    getWorkflowIndex(
      workflowStatus,
    )

  const nextWorkflowStatus =
    getNextWorkflowStatus(
      workflowStatus,
    )

  const currentWorkflowLabel =
    getWorkflowLabel(
      workflowStatus,
    )

  const nextWorkflowLabel =
    nextWorkflowStatus
      ? getWorkflowLabel(
          nextWorkflowStatus,
        )
      : null

  const isEmergency =
    order.bookingType ===
      'emergency' ||
    order.priority ===
      'emergency' ||
    order.priority ===
      'urgent'

  const isCompleted =
    workflowStatus ===
      'completed' ||
    order.status ===
      'delivered'

  const providerJobEarnings =
    Math.round(
      order.total * 0.9,
    )

  return (
    <motion.div
      layout
      className={`overflow-hidden rounded-2xl border bg-card ${
        isEmergency
          ? 'border-accent/40'
          : 'border-border'
      }`}
    >
      {isEmergency && (
        <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 text-[11px] font-bold text-accent">
          <Zap className="h-3.5 w-3.5" />
          PRIORITY / EMERGENCY JOB
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs font-bold text-muted-foreground">
              #{order.id}
            </p>

            <p className="mt-1 text-base font-bold text-foreground">
              {relevantServices
                .map((service) =>
                  getServiceName(
                    service.serviceId,
                  ),
                )
                .join(' • ')}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
            {currentWorkflowLabel}
          </span>
        </div>

        {/* ===================================================
            PROVIDER JOURNEY
            =================================================== */}

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Provider Journey
            </p>

            <span className="text-[10px] font-bold text-primary">
              Step{' '}
              {currentWorkflowIndex +
                1}{' '}
              / {WORKFLOW_STEPS.length}
            </span>
          </div>

          <div className="space-y-2">
            {WORKFLOW_STEPS.map(
              (step, index) => {
                const completed =
                  index <
                  currentWorkflowIndex

                const current =
                  index ===
                  currentWorkflowIndex

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 rounded-xl px-2 py-1.5 transition-all ${
                      current
                        ? 'bg-primary/5'
                        : ''
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        completed ||
                        current
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {completed ? (
                        <CircleCheck className="h-4 w-4" />
                      ) : current ? (
                        <CircleDot className="h-4 w-4" />
                      ) : (
                        <span className="text-[10px] font-bold">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <p
                        className={`text-xs ${
                          current ||
                          completed
                            ? 'font-bold text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>

                    {current && (
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase text-primary">
                        Current
                      </span>
                    )}
                  </div>
                )
              },
            )}
          </div>
        </div>

        {/* ===================================================
            JOB INFORMATION
            =================================================== */}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-muted/50 p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />

              <span className="text-[10px]">
                Schedule
              </span>
            </div>

            <p className="mt-1 text-xs font-semibold text-foreground">
              {order.pickupDate ||
                'Today'}
            </p>

            {order.pickupSlot && (
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {order.pickupSlot}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-muted/50 p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <IndianRupee className="h-3.5 w-3.5" />

              <span className="text-[10px]">
                Your Earnings
              </span>
            </div>

            <p className="mt-1 text-xs font-semibold text-foreground">
              {rupees(
                providerJobEarnings,
              )}
            </p>

            <p className="mt-0.5 text-[10px] text-muted-foreground">
              After 10% platform fee
            </p>
          </div>
        </div>

        {/* ===================================================
            CUSTOMER LOCATION
            =================================================== */}

        {order.address && (
          <div className="mt-3 rounded-xl border border-border p-3">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground">
                  {order.address.label ||
                    'Customer location'}
                </p>

                <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                  {order.address.address ||
                    'Customer address available in order details'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onNavigate(
                  order.address?.address,
                )
              }
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 py-2.5 text-[11px] font-bold text-primary"
            >
              <Navigation className="h-3.5 w-3.5" />
              Navigate to Customer
            </button>
          </div>
        )}

        {/* ===================================================
            SERVICES
            =================================================== */}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {relevantServices.map(
            (service) => (
              <span
                key={`${order.id}-${service.serviceId}`}
                className="rounded-full bg-primary/8 px-2.5 py-1 text-[10px] font-semibold text-primary"
              >
                {service.itemCount} items ·{' '}
                {getServiceName(
                  service.serviceId,
                )}
              </span>
            ),
          )}
        </div>

        {/* ===================================================
            NEXT ACTION
            =================================================== */}

        {!isCompleted &&
          nextWorkflowStatus &&
          nextWorkflowLabel && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() =>
                  onAdvance(
                    order.id,
                    order.status,
                  )
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
              >
                {nextWorkflowStatus ===
                'accepted' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : nextWorkflowStatus ===
                  'on-the-way' ? (
                  <Navigation className="h-4 w-4" />
                ) : nextWorkflowStatus ===
                  'arrived' ? (
                  <MapPin className="h-4 w-4" />
                ) : nextWorkflowStatus ===
                  'work-started' ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}

                {nextWorkflowStatus ===
                'accepted'
                  ? 'Accept Job'
                  : nextWorkflowStatus ===
                      'on-the-way'
                    ? 'Start Journey'
                    : nextWorkflowStatus ===
                        'arrived'
                      ? "I've Arrived"
                      : nextWorkflowStatus ===
                          'work-started'
                        ? 'Start Service'
                        : nextWorkflowStatus ===
                            'completed'
                          ? 'Complete Service'
                          : `Mark as ${nextWorkflowLabel}`}
              </button>

              <p className="mt-2 text-center text-[9px] text-muted-foreground">
                Next step:{' '}
                <span className="font-semibold text-foreground">
                  {nextWorkflowLabel}
                </span>
              </p>
            </div>
          )}

        {/* ===================================================
            COMPLETED
            =================================================== */}

        {isCompleted && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary/8 py-3 text-xs font-bold text-primary">
            <CheckCircle2 className="h-4 w-4" />
            Job completed
          </div>
        )}

        {/* ===================================================
            SYSTEM STATUS
            =================================================== */}

        <div className="mt-3 text-center">
          <span className="text-[10px] text-muted-foreground">
            System status:{' '}
            <span className="font-semibold">
              {getStatusLabel(
                order.status,
              )}
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ============================================================
   INFO ROW
   ============================================================ */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border py-4 last:border-b-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}

/* ============================================================
   EMPTY STATE
   ============================================================ */

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        {icon}
      </div>

      <p className="mt-3 text-sm font-bold text-foreground">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}