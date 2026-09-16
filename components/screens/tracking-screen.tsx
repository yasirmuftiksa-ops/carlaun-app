'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  CircleCheck,
  CircleDot,
  Clock3,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { ORDER_STATUS_STEPS } from '@/lib/data'
import { rupees } from '@/lib/format'
import { useStore } from '@/lib/store'
import { DELIVERY_JOURNEY_STAGES } from '@/lib/store'
import { ScreenHeader } from '@/components/screen-header'
import { useLanguage } from '@/components/language-provider'

type ProviderWorkflowStatus =
  | 'assigned'
  | 'accepted'
  | 'on-the-way'
  | 'arrived'
  | 'work-started'
  | 'completed'

type ProviderWorkflowState = Record<
  string,
  ProviderWorkflowStatus
>

type ExtendedOrder = {
  providerName?: string
  providerNames?: Record<string, string>
  providerIds?: Record<string, string>
}

function getWorkflowFromJourney(stage: string): ProviderWorkflowStatus {
  if (stage === 'DRIVER_EN_ROUTE' || stage === 'NEAR_CUSTOMER') return 'on-the-way'
  if (stage === 'ARRIVED_CUSTOMER' || stage === 'PICKUP_COMPLETED') return 'arrived'
  if (stage === 'SERVICE_STARTED' || stage === 'SERVICE_COMPLETED') return 'work-started'
  if (stage === 'DELIVERED') return 'completed'
  return 'assigned'
}

const WORKFLOW_STEPS: {
  id: ProviderWorkflowStatus
  label: string
  description: string
}[] = [
  {
    id: 'assigned',
    label: 'Provider Assigned',
    description: 'A verified service provider has been assigned.',
  },
  {
    id: 'accepted',
    label: 'Job Accepted',
    description: 'The provider accepted your service request.',
  },
  {
    id: 'on-the-way',
    label: 'On the Way',
    description: 'Your provider is travelling to the service location.',
  },
  {
    id: 'arrived',
    label: 'Provider Arrived',
    description: 'Your provider has reached the service location.',
  },
  {
    id: 'work-started',
    label: 'Work Started',
    description: 'Your requested service is currently in progress.',
  },
  {
    id: 'completed',
    label: 'Service Completed',
    description: 'The service has been completed successfully.',
  },
]

const LIVE_STEPS = [
  'Driver assigned', 'Driver coming to pickup', 'Driver arrived', 'Items picked up',
  'Reached shop', 'Service in progress', 'Service completed', 'Returning to you', 'Delivered',
]
const LIVE_MESSAGES = [
  'A driver has been assigned to your order.', 'Your driver is on the way to pick up your items.',
  'Your driver is arriving soon.', 'Your driver has arrived at your pickup location.',
  'Your items have been picked up successfully.', 'Your items have reached the service shop.',
  'Your service has started.', 'Your service has been completed.', 'Your order has been delivered successfully.',
]

function getWorkflowIndex(
  status: ProviderWorkflowStatus,
) {
  return WORKFLOW_STEPS.findIndex(
    (step) => step.id === status,
  )
}

function getWorkflowStatus(
  states: ProviderWorkflowState,
  orderId: string,
  orderStatus: string,
): ProviderWorkflowStatus {
  if (orderStatus === 'delivered') {
    return 'completed'
  }

  return states[orderId] ?? 'assigned'
}

function getEtaText(
  status: ProviderWorkflowStatus,
) {
  switch (status) {
    case 'assigned':
      return 'Waiting for provider acceptance'
    case 'accepted':
      return 'Provider is preparing for your job'
    case 'on-the-way':
      return 'Provider is on the way to you'
    case 'arrived':
      return 'Provider has arrived at your location'
    case 'work-started':
      return 'Service is currently in progress'
    case 'completed':
      return 'Service completed'
    default:
      return 'Tracking available'
  }
}

function getProviderName(
  order: {
    providerId?: string
  } & ExtendedOrder,
) {
  if (order.providerName) {
    return order.providerName
  }

  if (order.providerId) {
    const names: Record<string, string> = {
      freshcare: 'FreshCare',
      cleannest: 'CleanNest',
      presspro: 'PressPro',
      'saree-care-studio': 'SareeCare Studio',
      'sparkhome-cooperative': 'SparkHome Cooperative',
      cleanhub: 'CleanHub',
      'aquafix-cooperative': 'AquaFix Cooperative',
      rapidplumb: 'RapidPlumb',
      'powercare-cooperative': 'PowerCare Cooperative',
      voltfix: 'VoltFix',
      'woodcraft-cooperative': 'WoodCraft Cooperative',
      'fixwood-services': 'FixWood Services',
      'colorcraft-cooperative': 'ColorCraft Cooperative',
      paintplus: 'PaintPlus',
      'greencare-cooperative': 'GreenCare Cooperative',
      gardenpro: 'GardenPro',
      'carecircle-cooperative': 'CareCircle Cooperative',
      comfortcare: 'ComfortCare',
      'cityride-cooperative': 'CityRide Cooperative',
      'safehands-drivers': 'SafeHands Drivers',
    }

    return (
      names[order.providerId.toLowerCase()] ??
      order.providerId
    )
  }

  return 'Your Service Partner'
}

function openNavigation(address: string) {
  const url =
    `https://www.google.com/maps/search/?api=1&query=` +
    encodeURIComponent(address)

  window.open(url, '_blank', 'noopener,noreferrer')
}

export function TrackingScreen({
  orderId,
}: {
  orderId: string
}) {
  const {
    getOrder,
    navigate,
    getDeliveryJourney,
    initializeDeliveryJourney,
    advanceDeliveryJourney,
    resetDeliveryJourney,
  } = useStore()
  const { t } = useLanguage()

  const order = getOrder(orderId)

  const workflowSteps = [
    { id: 'assigned', label: t.tracking.providerAssigned, description: t.tracking.providerAssigned },
    { id: 'accepted', label: t.tracking.jobAccepted, description: t.tracking.jobAccepted },
    { id: 'on-the-way', label: t.tracking.onTheWay, description: t.tracking.onTheWay },
    { id: 'arrived', label: t.tracking.providerArrived, description: t.tracking.providerArrived },
    { id: 'work-started', label: t.tracking.workStarted, description: t.tracking.workStarted },
    { id: 'completed', label: t.tracking.serviceCompleted, description: t.tracking.serviceCompleted },
  ]

  const journey = getDeliveryJourney(orderId)

  useEffect(() => {
    if (order && !journey) initializeDeliveryJourney(orderId)
  }, [initializeDeliveryJourney, journey, order, orderId])

  const extendedOrder =
    order as
      | (typeof order & ExtendedOrder)
      | undefined

  const workflowStatus = useMemo(
    () =>
      order
        ? getWorkflowStatus(
            journey ? { [order.id]: getWorkflowFromJourney(journey.stage) } : {},
            order.id,
            order.status,
          )
        : 'assigned',
    [
      order,
      journey,
    ],
  )

  if (!order || !extendedOrder) {
    return (
      <div className="min-h-dvh bg-background">
        <ScreenHeader title="Track Order" />
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <Truck className="h-7 w-7 text-muted-foreground" />
          </div>

          <h2 className="mt-5 font-display text-xl font-bold text-foreground">
            Order not found
          </h2>

          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            We could not find the selected order.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate({ name: 'orders' })
            }
            className="mt-6 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-card"
          >
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  const workflowIndex =
    getWorkflowIndex(workflowStatus)

  const orderStatusIndex =
    ORDER_STATUS_STEPS.findIndex(
      (step) => step.id === order.status,
    )

  const providerName =
    getProviderName(extendedOrder)

  const addressText =
    `${order.address.label}, ${order.address.line}`

  const isEmergency =
    order.bookingType === 'emergency'

  const isCompleted =
    workflowStatus === 'completed' ||
    order.status === 'delivered'

  const statusLabel =
    workflowSteps[workflowIndex]?.label ??
    ORDER_STATUS_STEPS[orderStatusIndex]?.label ??
    order.status

  const locationQuery =
    order.latitude !== undefined &&
    order.longitude !== undefined
      ? `${order.latitude},${order.longitude}`
      : addressText

  const journeyStep = journey
    ? DELIVERY_JOURNEY_STAGES.indexOf(journey.stage)
    : 0
  const journeySteps = [
    t.tracking.driverAssigned,
    t.tracking.driverComing,
    t.tracking.nearCustomer,
    t.tracking.driverArrived,
    t.tracking.itemsPicked,
    t.tracking.goingToServiceCenter,
    t.tracking.reachedShop,
    t.tracking.serviceInProgress,
    t.tracking.serviceCompleted,
    t.tracking.returning,
    t.tracking.almostAtLocation,
    t.tracking.delivered,
  ]

  return (
    <div className="min-h-dvh bg-background pb-28">
      <ScreenHeader title={t.orders.trackOrder} />

      {/* Order header */}
      <div className="border-b border-border bg-card px-4 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t.orders.orderDetails}
            </p>

            <p className="mt-0.5 font-mono text-lg font-bold text-foreground">
              #{order.id}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {order.pickupDate} · {order.pickupSlot}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              isCompleted
                ? 'bg-primary/12 text-primary'
                : 'bg-accent/12 text-accent'
            }`}
          >
            {statusLabel}
          </span>
        </div>

        {isEmergency && !isCompleted && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-destructive" />

            <div>
              <p className="text-xs font-bold text-destructive">
                {t.safety.emergency}
              </p>

              <p className="text-[11px] text-muted-foreground">
                {t.safety.dispatch}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 px-4 py-4">
        <div className="overflow-hidden rounded-2xl border border-primary/20 bg-card">
          <div className="flex items-center justify-between px-4 pt-4"><div><p className="text-xs font-bold uppercase tracking-wide text-primary">{t.tracking.startLive}</p><p className="mt-1 text-sm font-bold text-foreground">{journeySteps[journeyStep]}</p></div><span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">ETA ~{journey?.etaMinutes ?? 12} min</span></div>
          <div className="relative mx-4 mt-4 h-44 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-secondary to-primary/5">
            <div className="absolute left-8 right-8 top-1/2 h-1 -translate-y-1/2 rounded bg-primary/35" />
            <div className="absolute left-7 top-[calc(50%-18px)] text-lg">🏠</div><div className="absolute right-7 top-[calc(50%-18px)] text-lg">🏪</div>
            <motion.div className="absolute top-[calc(50%-17px)] text-xl" animate={{ left: `${12 + (journeyStep / (DELIVERY_JOURNEY_STAGES.length - 1)) * 70}%` }} transition={{ ease: 'linear', duration: .35 }}>🚗</motion.div>
            <p className="absolute bottom-3 left-3 rounded bg-card/90 px-2 py-1 text-[10px] font-semibold text-foreground">{t.tracking.demoMode} · Live location — Demo simulation</p>
          </div>
            <div className="grid grid-cols-2 gap-2 p-4"><button type="button" disabled={isCompleted} onClick={() => advanceDeliveryJourney(orderId)} className="rounded-lg bg-primary px-2 py-2 text-[11px] font-bold text-primary-foreground">{t.tracking.simulateNextStep}</button><button type="button" onClick={() => resetDeliveryJourney(orderId)} className="rounded-lg bg-secondary px-2 py-2 text-[11px] font-bold text-foreground">{t.tracking.reset}</button></div>
        </div>

        {/* Provider card */}
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              {providerName
                .split(' ')
                .map((word) => word[0])
                .slice(0, 2)
                .join('')}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold text-foreground">
                  {providerName}
                </p>

                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                  <ShieldCheck className="h-3 w-3" />
                  {t.certification.verified}
                </span>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {t.provider.dashboard}
              </p>

              <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-foreground">
                <Truck className="h-3.5 w-3.5 text-primary" />
                {getEtaText(workflowStatus)}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                openNavigation(locationQuery)
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-foreground"
            >
              <Navigation className="h-3.5 w-3.5" />
              {t.tracking.currentLocation}
            </button>

            <button
              type="button"
              onClick={() =>
                window.open(
                  'tel:',
                  '_self',
                )
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-foreground"
            >
              <Phone className="h-3.5 w-3.5" />
              {t.welfare.contactSupport}
            </button>
          </div>
        </motion.div>

        {/* Live status */}
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.05,
          }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Truck className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">
                    {t.tracking.serviceInProgress}
                  </p>

                  <p className="mt-1 text-sm font-bold text-foreground">
                    {statusLabel}
                  </p>
                </div>

                {!isCompleted && (
                  <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                    LIVE
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {getEtaText(workflowStatus)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Provider workflow */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.provider.dashboard}
            </p>

            <h2 className="mt-1 font-display text-lg font-bold text-foreground">
              {t.tracking.serviceCompleted}
            </h2>
          </div>

          <div className="space-y-0">
            {workflowSteps.map(
              (step, index) => {
                const completed =
                  index < workflowIndex ||
                  (isCompleted &&
                    index === workflowIndex)

                const active =
                  index === workflowIndex

                return (
                  <div
                    key={step.id}
                    className="flex gap-3"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          completed || active
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {completed ? (
                          <Check className="h-4 w-4" />
                        ) : active ? (
                          <Truck className="h-4 w-4" />
                        ) : (
                          <CircleDot className="h-4 w-4" />
                        )}
                      </div>

                      {index <
                        WORKFLOW_STEPS.length -
                          1 && (
                        <div
                          className={`h-10 w-px ${
                            index <
                            workflowIndex
                              ? 'bg-primary/40'
                              : 'bg-border'
                          }`}
                        />
                      )}
                    </div>

                    <div className="pb-5 pt-1">
                      <p
                        className={`text-sm font-semibold ${
                          active
                            ? 'text-foreground'
                            : completed
                              ? 'text-primary'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </p>

                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>

                      {active && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                          <Clock3 className="h-3 w-3" />
                          Current status
                        </div>
                      )}
                    </div>
                  </div>
                )
              },
            )}
          </div>
        </div>

        {/* Location */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
              <MapPin className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Service Location
              </p>

              <p className="mt-1 text-sm font-bold text-foreground">
                {order.address.label}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {order.address.line}
              </p>

              <button
                type="button"
                onClick={() =>
                  openNavigation(locationQuery)
                }
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-xs font-semibold text-card"
              >
                <MapPin className="h-3.5 w-3.5" />
                Open Service Location
              </button>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Services
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {order.services.map((service) => (
              <span
                key={service.serviceId}
                className="rounded-full bg-secondary px-2.5 py-1.5 text-xs font-medium text-foreground"
              >
                {service.serviceName} ·{' '}
                {service.itemCount}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">
              Total
            </span>

            <span className="font-display text-lg font-bold text-foreground">
              {rupees(order.total)}
            </span>
          </div>
        </div>

        {/* Legacy order progress */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <CircleCheck className="h-4 w-4 text-primary" />

            <p className="text-sm font-bold text-foreground">
              Order System Status
            </p>
          </div>

          <div className="mt-3 flex items-center gap-1">
            {ORDER_STATUS_STEPS.map(
              (step, index) => {
                const done =
                  index <= orderStatusIndex

                return (
                  <div
                    key={step.id}
                    className="flex min-w-0 flex-1 items-center gap-1"
                  >
                    <div
                      className={`h-1.5 flex-1 rounded-full ${
                        done
                          ? 'bg-primary'
                          : 'bg-secondary'
                      }`}
                    />
                  </div>
                )
              },
            )}
          </div>

          <p className="mt-2 text-[11px] text-muted-foreground">
            {ORDER_STATUS_STEPS[
              orderStatusIndex
            ]?.label ?? order.status}
          </p>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="sticky bottom-0 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() =>
              navigate({ name: 'orders' })
            }
            className="flex-1 rounded-full border border-border px-4 py-3 text-xs font-semibold text-foreground"
          >
            Back to Orders
          </button>

          <button
            type="button"
            onClick={() =>
              navigate({ name: 'home' })
            }
            className="flex-1 rounded-full bg-foreground px-4 py-3 text-xs font-semibold text-card"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
