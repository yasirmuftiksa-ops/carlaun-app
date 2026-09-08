import type {
  BookingType,
  Order,
  Service,
} from './types'

export type DemandLevel =
  | 'low'
  | 'medium'
  | 'high'

export type DemandTrend =
  | 'increasing'
  | 'stable'
  | 'decreasing'

export interface ServiceDemandForecast {
  serviceId: string
  serviceName: string
  currentDemand: number
  predictedDemand: number
  demandLevel: DemandLevel
  trend: DemandTrend
  recommendedWorkers: number
  peakTime: string
  emergencyBookings: number
  onDemandBookings: number
}

export interface DemandForecastSummary {
  totalBookings: number
  predictedTotalDemand: number
  highDemandServices: number
  peakTime: string
  recommendedWorkers: number
  forecasts: ServiceDemandForecast[]
}

/*
 * =======================================================
 * NeXa Link AI DEMAND FORECASTING ENGINE
 * =======================================================
 *
 * Prototype forecasting engine.
 *
 * It analyzes available booking history and estimates
 * upcoming service demand.
 *
 * Later, this same interface can be connected to:
 *
 * Supabase → Historical Orders → ML Model → Forecast
 *
 * The current version intentionally uses transparent
 * rule-based AI-assisted forecasting so that the result
 * is explainable during the SIH prototype/demo.
 */

/* =======================================================
   HELPERS
   ======================================================= */

function getBookingType(
  order: Order,
): BookingType {
  return (
    order.bookingType ??
    'scheduled'
  )
}

function getServiceBookingCount(
  orders: Order[],
  serviceId: string,
): number {
  return orders.reduce(
    (count, order) => {
      const hasService =
        order.services?.some(
          (service) =>
            service.serviceId ===
            serviceId,
        )

      return hasService
        ? count + 1
        : count
    },
    0,
  )
}

function getServiceItemCount(
  orders: Order[],
  serviceId: string,
): number {
  return orders.reduce(
    (count, order) => {
      return (
        count +
        order.lines.reduce(
          (serviceCount, line) =>
            line.serviceId ===
            serviceId
              ? serviceCount +
                line.qty
              : serviceCount,
          0,
        )
      )
    },
    0,
  )
}

function getEmergencyCount(
  orders: Order[],
  serviceId: string,
): number {
  return orders.reduce(
    (count, order) => {
      const hasService =
        order.services?.some(
          (service) =>
            service.serviceId ===
            serviceId,
        )

      return hasService &&
        getBookingType(order) ===
          'emergency'
        ? count + 1
        : count
    },
    0,
  )
}

function getOnDemandCount(
  orders: Order[],
  serviceId: string,
): number {
  return orders.reduce(
    (count, order) => {
      const hasService =
        order.services?.some(
          (service) =>
            service.serviceId ===
            serviceId,
        )

      return hasService &&
        getBookingType(order) ===
          'on-demand'
        ? count + 1
        : count
    },
    0,
  )
}

/*
 * Estimate the number of workers required.
 *
 * A worker is assumed to handle approximately
 * 5 service bookings during the forecast period.
 *
 * This is a prototype assumption and can later be
 * replaced with real worker-capacity data.
 */
function calculateRecommendedWorkers(
  predictedDemand: number,
): number {
  return Math.max(
    1,
    Math.ceil(
      predictedDemand / 5,
    ),
  )
}

/*
 * Convert predicted demand into an easy-to-understand
 * demand level.
 */
function getDemandLevel(
  predictedDemand: number,
): DemandLevel {
  if (predictedDemand >= 8) {
    return 'high'
  }

  if (predictedDemand >= 4) {
    return 'medium'
  }

  return 'low'
}

/*
 * Estimate trend from current demand to predicted demand.
 */
function getTrend(
  currentDemand: number,
  predictedDemand: number,
): DemandTrend {
  if (currentDemand === 0) {
    return predictedDemand > 0
      ? 'increasing'
      : 'stable'
  }

  const difference =
    predictedDemand -
    currentDemand

  const percentageChange =
    Math.abs(difference) /
    currentDemand

  if (
    percentageChange >=
    0.15
  ) {
    return difference > 0
      ? 'increasing'
      : 'decreasing'
  }

  return 'stable'
}

/*
 * Prototype peak-period model.
 *
 * This can later be replaced with actual booking
 * timestamps and time-series ML.
 */
function getPeakTime(
  serviceId: string,
): string {
  const eveningServices = [
    'home-cleaning',
    'laundry',
    'ironing',
    'shoe',
    'bag',
    'gardening',
  ]

  const repairServices = [
    'plumbing',
    'electrical',
    'carpentry',
  ]

  const personalServices = [
    'caregiving',
    'driver',
  ]

  if (
    eveningServices.includes(
      serviceId,
    )
  ) {
    return '6 PM – 9 PM'
  }

  if (
    repairServices.includes(
      serviceId,
    )
  ) {
    return '10 AM – 2 PM'
  }

  if (
    personalServices.includes(
      serviceId,
    )
  ) {
    return '8 AM – 12 PM'
  }

  return '10 AM – 2 PM'
}

/* =======================================================
   FORECAST ONE SERVICE
   ======================================================= */

export function forecastServiceDemand(
  service: Service,
  orders: Order[],
): ServiceDemandForecast {
  const currentDemand =
    getServiceBookingCount(
      orders,
      service.id,
    )

  const itemDemand =
    getServiceItemCount(
      orders,
      service.id,
    )

  const emergencyBookings =
    getEmergencyCount(
      orders,
      service.id,
    )

  const onDemandBookings =
    getOnDemandCount(
      orders,
      service.id,
    )

  /*
   * AI-assisted demand scoring.
   *
   * Base:
   * Number of historical bookings.
   *
   * Item activity:
   * Additional signal from quantities.
   *
   * Urgency:
   * Emergency and on-demand requests
   * receive additional weight.
   *
   * Minimum forecast:
   * Every active service receives at least
   * a small baseline prediction.
   */
  const urgencyScore =
    emergencyBookings * 2 +
    onDemandBookings

  const activityScore =
    Math.round(
      itemDemand * 0.35,
    )

  const predictedDemand =
    Math.max(
      currentDemand === 0
        ? 1
        : currentDemand,

      Math.round(
        currentDemand +
          activityScore +
          urgencyScore,
      ),
    )

  const demandLevel =
    getDemandLevel(
      predictedDemand,
    )

  const trend =
    getTrend(
      currentDemand,
      predictedDemand,
    )

  const recommendedWorkers =
    calculateRecommendedWorkers(
      predictedDemand,
    )

  const peakTime =
    getPeakTime(
      service.id,
    )

  return {
    serviceId: service.id,

    serviceName: service.name,

    currentDemand,

    predictedDemand,

    demandLevel,

    trend,

    recommendedWorkers,

    peakTime,

    emergencyBookings,

    onDemandBookings,
  }
}

/* =======================================================
   FORECAST ALL SERVICES
   ======================================================= */

export function generateDemandForecast(
  services: Service[],
  orders: Order[],
): DemandForecastSummary {
  const forecasts =
    services.map(
      (service) =>
        forecastServiceDemand(
          service,
          orders,
        ),
    )

  const totalBookings =
    orders.length

  const predictedTotalDemand =
    forecasts.reduce(
      (total, forecast) =>
        total +
        forecast.predictedDemand,
      0,
    )

  const highDemandServices =
    forecasts.filter(
      (forecast) =>
        forecast.demandLevel ===
        'high',
    ).length

  /*
   * Find the most common predicted peak time.
   */
  const peakTimeCounts =
    new Map<string, number>()

  for (const forecast of forecasts) {
    const current =
      peakTimeCounts.get(
        forecast.peakTime,
      ) ?? 0

    peakTimeCounts.set(
      forecast.peakTime,
      current + 1,
    )
  }

  let peakTime =
    '10 AM – 2 PM'

  let highestPeakCount =
    0

  for (const [
    time,
    count,
  ] of peakTimeCounts.entries()) {
    if (
      count >
      highestPeakCount
    ) {
      highestPeakCount =
        count

      peakTime = time
    }
  }

  const recommendedWorkers =
    forecasts.reduce(
      (total, forecast) =>
        total +
        forecast.recommendedWorkers,
      0,
    )

  /*
   * Sort strongest demand first.
   */
  forecasts.sort(
    (a, b) =>
      b.predictedDemand -
      a.predictedDemand,
  )

  return {
    totalBookings,

    predictedTotalDemand,

    highDemandServices,

    peakTime,

    recommendedWorkers,

    forecasts,
  }
}

/* =======================================================
   SIMPLE AI INSIGHT GENERATOR
   ======================================================= */

export function generateDemandInsights(
  summary: DemandForecastSummary,
): string[] {
  const insights: string[] = []

  const topService =
    summary.forecasts[0]

  if (topService) {
    insights.push(
      `${topService.serviceName} has the highest predicted demand with ${topService.predictedDemand} bookings.`,
    )
  }

  const highDemand =
    summary.forecasts.filter(
      (forecast) =>
        forecast.demandLevel ===
        'high',
    )

  if (highDemand.length > 0) {
    insights.push(
      `${highDemand.length} service${highDemand.length > 1 ? 's' : ''} require additional workforce planning.`,
    )
  }

  const increasing =
    summary.forecasts.filter(
      (forecast) =>
        forecast.trend ===
        'increasing',
    )

  if (increasing.length > 0) {
    insights.push(
      `${increasing.length} service${increasing.length > 1 ? 's are' : ' is'} showing an increasing demand trend.`,
    )
  }

  if (
    summary.recommendedWorkers >
    0
  ) {
    insights.push(
      `AI recommends approximately ${summary.recommendedWorkers} worker capacity across the forecasted services.`,
    )
  }

  insights.push(
    `Expected overall peak service period: ${summary.peakTime}.`,
  )

  return insights
}