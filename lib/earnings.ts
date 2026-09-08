import { Order } from './types'

export type EarningsStatus =
  | 'pending'
  | 'available'
  | 'paid'

export interface WorkerEarning {
  id: string
  orderId: string
  providerId: string
  providerName: string
  service: string
  customerName: string
  amount: number
  platformFee: number
  netEarning: number
  status: EarningsStatus
  createdAt: number
}

export interface ProviderEarningsSummary {
  providerId: string
  providerName: string
  totalJobs: number
  completedJobs: number
  grossEarnings: number
  platformFees: number
  netEarnings: number
  pendingAmount: number
  availableAmount: number
  paidAmount: number
  averagePerJob: number
}

export interface WalletTransaction {
  id: string
  providerId: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  orderId?: string
  createdAt: number
}

export interface WorkerWallet {
  providerId: string
  providerName: string
  balance: number
  pendingBalance: number
  totalEarned: number
  totalWithdrawn: number
  transactions: WalletTransaction[]
}

const PLATFORM_FEE_PERCENT = 10

function getOrderTotal(order: Order): number {
  const total = Number(order.total)

  if (Number.isFinite(total) && total > 0) {
    return total
  }

  return 0
}

function getOrderProviderId(order: Order): string {
  const value = order as Order & {
    providerId?: string
    partnerId?: string
  }

  return value.providerId ?? value.partnerId ?? 'unassigned'
}

function getOrderProviderName(order: Order): string {
  const value = order as Order & {
    providerName?: string
    partnerName?: string
  }

  return (
    value.providerName ??
    value.partnerName ??
    'Unassigned Provider'
  )
}

function getOrderCustomerName(order: Order): string {
  const value = order as Order & {
    customerName?: string
    name?: string
  }

  return (
    value.customerName ??
    value.name ??
    'Customer'
  )
}

function getOrderService(order: Order): string {
  const value = order as Order & {
    service?: string
    serviceName?: string
  }

  if (value.serviceName) {
    return value.serviceName
  }

  if (value.service) {
    return value.service
  }

  const orderWithItems = order as Order & {
    items?: Array<{
      name?: string
    }>
  }

  const items: Array<{
    name?: string
  }> = orderWithItems.items ?? []

  if (items.length > 0) {
    return items
      .map(
        (item: { name?: string }) =>
          item.name,
      )
      .filter(
        (
          name,
        ): name is string =>
          Boolean(name),
      )
      .join(', ')
  }

  return 'Service'
}

function isCompletedOrder(
  order: Order,
): boolean {
  const status = String(
    order.status ?? '',
  ).toLowerCase()

  return (
    status === 'delivered' ||
    status === 'completed'
  )
}

function calculatePlatformFee(
  amount: number,
): number {
  return Math.round(
    amount *
      (PLATFORM_FEE_PERCENT / 100),
  )
}

function calculateNetEarning(
  amount: number,
): number {
  return (
    amount -
    calculatePlatformFee(amount)
  )
}

/**
 * Convert completed orders into
 * worker earnings.
 *
 * This is a demo/local calculation engine.
 * Later, this structure can be connected
 * to Supabase for real provider payouts.
 */
export function generateWorkerEarnings(
  orders: Order[],
): WorkerEarning[] {
  return orders
    .filter(isCompletedOrder)
    .map((order, index) => {
      const amount =
        getOrderTotal(order)

      const platformFee =
        calculatePlatformFee(amount)

      const netEarning =
        calculateNetEarning(amount)

      const providerId =
        getOrderProviderId(order)

      const providerName =
        getOrderProviderName(order)

      const paymentStatus =
        String(
          order.paymentStatus ??
            order.paymentDetails?.status ??
            '',
        ).toLowerCase()

      const status: EarningsStatus =
        paymentStatus === 'paid'
          ? 'available'
          : 'pending'

      return {
        id:
          `EARN-${order.id ?? index}`,
        orderId:
          order.id ??
          `ORDER-${index}`,
        providerId,
        providerName,
        service:
          getOrderService(order),
        customerName:
          getOrderCustomerName(order),
        amount,
        platformFee,
        netEarning,
        status,
        createdAt:
          Number(order.createdAt) ||
          Date.now(),
      }
    })
}

/**
 * Generate earnings summary
 * for one provider.
 */
export function generateProviderEarningsSummary(
  earnings: WorkerEarning[],
  providerId: string,
): ProviderEarningsSummary {
  const providerEarnings =
    earnings.filter(
      (earning) =>
        earning.providerId ===
        providerId,
    )

  const providerName =
    providerEarnings[0]
      ?.providerName ??
    'Provider'

  const totalJobs =
    providerEarnings.length

  const completedJobs =
    providerEarnings.filter(
      (earning) =>
        earning.status === 'available' ||
        earning.status === 'paid',
    ).length

  const grossEarnings =
    providerEarnings.reduce(
      (sum, earning) =>
        sum + earning.amount,
      0,
    )

  const platformFees =
    providerEarnings.reduce(
      (sum, earning) =>
        sum + earning.platformFee,
      0,
    )

  const netEarnings =
    providerEarnings.reduce(
      (sum, earning) =>
        sum + earning.netEarning,
      0,
    )

  const pendingAmount =
    providerEarnings
      .filter(
        (earning) =>
          earning.status === 'pending',
      )
      .reduce(
        (sum, earning) =>
          sum + earning.netEarning,
        0,
      )

  const availableAmount =
    providerEarnings
      .filter(
        (earning) =>
          earning.status === 'available',
      )
      .reduce(
        (sum, earning) =>
          sum + earning.netEarning,
        0,
      )

  const paidAmount =
    providerEarnings
      .filter(
        (earning) =>
          earning.status === 'paid',
      )
      .reduce(
        (sum, earning) =>
          sum + earning.netEarning,
        0,
      )

  const averagePerJob =
    totalJobs > 0
      ? Math.round(
          netEarnings / totalJobs,
        )
      : 0

  return {
    providerId,
    providerName,
    totalJobs,
    completedJobs,
    grossEarnings,
    platformFees,
    netEarnings,
    pendingAmount,
    availableAmount,
    paidAmount,
    averagePerJob,
  }
}

/**
 * Generate a digital wallet
 * for a provider.
 */
export function generateWorkerWallet(
  earnings: WorkerEarning[],
  providerId: string,
): WorkerWallet {
  const providerEarnings =
    earnings.filter(
      (earning) =>
        earning.providerId ===
        providerId,
    )

  const providerName =
    providerEarnings[0]
      ?.providerName ??
    'Provider'

  const availableBalance =
    providerEarnings
      .filter(
        (earning) =>
          earning.status ===
          'available',
      )
      .reduce(
        (sum, earning) =>
          sum + earning.netEarning,
        0,
      )

  const pendingBalance =
    providerEarnings
      .filter(
        (earning) =>
          earning.status ===
          'pending',
      )
      .reduce(
        (sum, earning) =>
          sum + earning.netEarning,
        0,
      )

  const totalEarned =
    providerEarnings.reduce(
      (sum, earning) =>
        sum + earning.netEarning,
      0,
    )

  const transactions: WalletTransaction[] =
    providerEarnings.map(
      (earning) => ({
        id:
          `TXN-${earning.id}`,
        providerId,
        type: 'credit',
        amount:
          earning.netEarning,
        description:
          `${earning.service} earnings`,
        orderId:
          earning.orderId,
        createdAt:
          earning.createdAt,
      }),
    )

  return {
    providerId,
    providerName,
    balance:
      availableBalance,
    pendingBalance,
    totalEarned,
    totalWithdrawn: 0,
    transactions:
      transactions.sort(
        (a, b) =>
          b.createdAt -
          a.createdAt,
      ),
  }
}

/**
 * Generate earnings summaries
 * for all providers.
 */
export function generateAllProviderSummaries(
  earnings: WorkerEarning[],
): ProviderEarningsSummary[] {
  const providerIds =
    Array.from(
      new Set(
        earnings.map(
          (earning) =>
            earning.providerId,
        ),
      ),
    )

  return providerIds
    .map((providerId) =>
      generateProviderEarningsSummary(
        earnings,
        providerId,
      ),
    )
    .sort(
      (a, b) =>
        b.netEarnings -
        a.netEarnings,
    )
}

/**
 * Generate simple AI-style
 * earnings insights.
 */
export function generateEarningsInsights(
  summaries: ProviderEarningsSummary[],
): string[] {
  if (summaries.length === 0) {
    return [
      'No completed provider earnings are available yet.',
      'Earnings will appear automatically after completed jobs.',
    ]
  }

  const totalNet =
    summaries.reduce(
      (sum, provider) =>
        sum + provider.netEarnings,
      0,
    )

  const totalPending =
    summaries.reduce(
      (sum, provider) =>
        sum + provider.pendingAmount,
      0,
    )

  const totalAvailable =
    summaries.reduce(
      (sum, provider) =>
        sum + provider.availableAmount,
      0,
    )

  const topProvider =
    [...summaries].sort(
      (a, b) =>
        b.netEarnings -
        a.netEarnings,
    )[0]

  const insights: string[] = []

  insights.push(
    `Cooperative providers have generated ₹${totalNet.toLocaleString(
      'en-IN',
    )} in net earnings.`,
  )

  if (totalAvailable > 0) {
    insights.push(
      `₹${totalAvailable.toLocaleString(
        'en-IN',
      )} is currently available in provider wallets.`,
    )
  }

  if (totalPending > 0) {
    insights.push(
      `₹${totalPending.toLocaleString(
        'en-IN',
      )} is pending settlement.`,
    )
  }

  if (topProvider) {
    insights.push(
      `${topProvider.providerName} currently has the highest recorded earnings.`,
    )
  }

  insights.push(
    `The platform fee is calculated at ${PLATFORM_FEE_PERCENT}% per completed job.`,
  )

  return insights
}