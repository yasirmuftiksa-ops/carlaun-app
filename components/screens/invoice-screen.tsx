'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Printer,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { PARTNERS } from '@/lib/data'
import { rupees } from '@/lib/format'
import { useStore } from '@/lib/store'
import { useLanguage } from '@/components/language-provider'

export function InvoiceScreen({
  orderId,
}: {
  orderId: string
}) {
  const { getOrder, back } = useStore()
  const { language, t: translation } = useLanguage()

  const [customerName, setCustomerName] =
    useState('NeXa Link Customer')

  const order = getOrder(orderId)
  const isPaid =
    order?.paymentStatus === 'paid' ||
    order?.paymentDetails?.status === 'paid'

  const t = {
    en: {
      back: 'Back',
      print: 'Print Invoice',
      digitalInvoice: 'Digital Invoice',
      paymentSuccessful: 'Payment Successful',
      paymentMethod: 'Payment method',
      orderId: 'Order ID',
      orderDate: 'Order Date',
      customer: 'Customer',
      servicePartner: 'Service Partner',
      verified: 'Verified',
      services: 'Services',
      service: 'Service',
      items: 'Items',
      item: 'item',
      amount: 'Amount',
      billSummary: 'Bill Summary',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      discount: 'Discount',
      total: 'Total',
      pickupDetails: 'Booking Details',
      pickupDate: 'Service Date',
      pickupSlot: 'Service Slot',
      thankYou: 'Thank you for choosing NeXa Link!',
      footer:
        'Connecting households and communities with trusted cooperative service partners.',
      invoiceNotFound: 'Invoice not found',
      invoiceNotFoundDescription:
        "We couldn't find the requested order.",
      customerFallback: 'NeXa Link Customer',
      partnerFallback: 'NeXa Link Partner',
      serviceNetwork: 'Cooperative Service Network',
      securePayment: 'Secure digital invoice',
      verifiedPartner: 'Verified service partner',
    },

    ta: {
      back: 'பின்',
      print: 'ரசீதை அச்சிடவும்',
      digitalInvoice: 'டிஜிட்டல் ரசீது',
      paymentSuccessful: 'பணம் செலுத்தப்பட்டது',
      paymentMethod: 'பணம் செலுத்தும் முறை',
      orderId: 'ஆர்டர் எண்',
      orderDate: 'ஆர்டர் தேதி',
      customer: 'வாடிக்கையாளர்',
      servicePartner: 'சேவை கூட்டாளர்',
      verified: 'சரிபார்க்கப்பட்டது',
      services: 'சேவைகள்',
      service: 'சேவை',
      items: 'பொருட்கள்',
      item: 'பொருள்',
      amount: 'தொகை',
      billSummary: 'பில் சுருக்கம்',
      subtotal: 'கூட்டுத்தொகை',
      deliveryFee: 'டெலிவரி கட்டணம்',
      discount: 'தள்ளுபடி',
      total: 'மொத்தம்',
      pickupDetails: 'முன்பதிவு விவரங்கள்',
      pickupDate: 'சேவை தேதி',
      pickupSlot: 'சேவை நேரம்',
      thankYou: 'NeXa Link-ஐ தேர்ந்தெடுத்ததற்கு நன்றி!',
      footer:
        'நம்பகமான கூட்டுறவு சேவை கூட்டாளர்களுடன் குடும்பங்களையும் சமூகங்களையும் இணைக்கிறோம்.',
      invoiceNotFound: 'ரசீது கிடைக்கவில்லை',
      invoiceNotFoundDescription:
        'கோரப்பட்ட ஆர்டரை கண்டுபிடிக்க முடியவில்லை.',
      customerFallback: 'NeXa Link வாடிக்கையாளர்',
      partnerFallback: 'NeXa Link கூட்டாளர்',
      serviceNetwork: 'கூட்டுறவு சேவை வலையமைப்பு',
      securePayment: 'பாதுகாப்பான டிஜிட்டல் ரசீது',
      verifiedPartner: 'சரிபார்க்கப்பட்ட சேவை கூட்டாளர்',
    },

    hi: {
      back: 'वापस',
      print: 'इनवॉइस प्रिंट करें',
      digitalInvoice: 'डिजिटल इनवॉइस',
      paymentSuccessful: 'भुगतान सफल',
      paymentMethod: 'भुगतान का तरीका',
      orderId: 'ऑर्डर आईडी',
      orderDate: 'ऑर्डर तारीख',
      customer: 'ग्राहक',
      servicePartner: 'सेवा पार्टनर',
      verified: 'सत्यापित',
      services: 'सेवाएं',
      service: 'सेवा',
      items: 'आइटम',
      item: 'आइटम',
      amount: 'राशि',
      billSummary: 'बिल सारांश',
      subtotal: 'सबटोटल',
      deliveryFee: 'डिलीवरी शुल्क',
      discount: 'छूट',
      total: 'कुल',
      pickupDetails: 'बुकिंग विवरण',
      pickupDate: 'सेवा तारीख',
      pickupSlot: 'सेवा समय',
      thankYou: 'NeXa Link चुनने के लिए धन्यवाद!',
      footer:
        'विश्वसनीय सहकारी सेवा पार्टनर्स के साथ परिवारों और समुदायों को जोड़ना।',
      invoiceNotFound: 'इनवॉइस नहीं मिला',
      invoiceNotFoundDescription:
        'अनुरोधित ऑर्डर नहीं मिल सका।',
      customerFallback: 'NeXa Link ग्राहक',
      partnerFallback: 'NeXa Link पार्टनर',
      serviceNetwork: 'सहकारी सेवा नेटवर्क',
      securePayment: 'सुरक्षित डिजिटल इनवॉइस',
      verifiedPartner: 'सत्यापित सेवा पार्टनर',
    },
  }

  const content = t[language]

  useEffect(() => {
    try {
      const session =
        localStorage.getItem('carlaun_session')

      if (session) {
        const parsed = JSON.parse(session)

        if (parsed?.name) {
          setCustomerName(parsed.name)
        } else if (parsed?.fullName) {
          setCustomerName(parsed.fullName)
        }
      }
    } catch {
      setCustomerName(
        content.customerFallback,
      )
    }
  }, [content.customerFallback])

  const provider = useMemo(() => {
    if (!order?.providerId) return null

    return (
      PARTNERS.find(
        (partner) =>
          partner.id === order.providerId,
      ) ?? null
    )
  }, [order?.providerId])

  const invoiceDate = order
    ? new Date(
        order.createdAt,
      ).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : ''

  const invoiceNumber = order
    ? `INV-${order.id}`
    : 'INV-NeXa Link'

  const handlePrint = () => {
    window.print()
  }

  if (!order) {
    return (
      <div className="min-h-dvh bg-background px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={back}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            {content.back}
          </button>

          <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-card p-8 text-center shadow-[var(--shadow-card)]">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <FileText className="size-7 text-primary" />
            </div>

            <p className="mt-5 font-display text-xl font-extrabold text-foreground">
              {content.invoiceNotFound}
            </p>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {content.invoiceNotFoundDescription}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-secondary/40 px-4 py-6 pb-28 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-3xl">
        {/* Top actions */}
        <div className="mb-5 flex items-center justify-between gap-3 print:hidden">
          <button
            onClick={back}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            {content.back}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] active:scale-95"
          >
            <Printer className="size-4" />
            {content.print}
          </button>
        </div>

        {/* Invoice */}
        <article className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-[var(--shadow-lift)] print:rounded-none print:border-0 print:shadow-none">
          {/* Invoice header */}
          <div className="relative overflow-hidden border-b border-border/70 px-6 py-7 sm:px-8">
            <div className="absolute right-0 top-0 size-40 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
                    <Sparkles className="size-5" />
                  </div>

                  <div>
                    <p className="font-display text-2xl font-black tracking-tight text-foreground">
                      NeXa Link
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-primary">
                      {content.serviceNetwork}
                    </p>
                  </div>
                </div>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5">
                  <ShieldCheck className="size-3.5 text-primary" />

                  <span className="text-[10px] font-bold text-primary">
                    {content.securePayment}
                  </span>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
                  {content.digitalInvoice}
                </p>

                <p className="mt-1 font-mono text-sm font-black text-foreground">
                  {invoiceNumber}
                </p>

                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {invoiceDate}
                </p>
              </div>
            </div>
          </div>

          {/* Payment status */}
          <div className="border-b border-primary/10 bg-primary/[0.045] px-6 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <CheckCircle2 className="size-5 text-primary" />
              </span>

              <div>
                <p className="text-sm font-extrabold text-foreground">
                  {isPaid
                    ? translation.common.paymentSuccessful
                    : translation.common.paymentPending}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {content.paymentMethod}:{' '}
                  <span className="font-semibold text-foreground">
                    {order.payment}
                  </span>
                </p>

                {isPaid && order.transactionId && (
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {translation.common.transactionId}: {order.transactionId}
                  </p>
                )}
              </div>

              <span className={`ml-auto hidden rounded-full px-3 py-1.5 text-[9px] font-extrabold sm:inline-flex ${isPaid ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                {isPaid ? translation.common.paid : translation.common.pending}
              </span>
            </div>
          </div>

          <div className="space-y-7 px-6 py-7 sm:px-8">
            {/* Order information */}
            <section>
              <div className="grid gap-5 sm:grid-cols-2">
                <InfoBlock
                  label={content.orderId}
                  value={`#${order.id}`}
                  mono
                />

                <InfoBlock
                  label={content.orderDate}
                  value={invoiceDate}
                  align="right"
                />
              </div>
            </section>

            {/* Customer + Partner */}
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-secondary/50 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                  {content.customer}
                </p>

                <p className="mt-2 text-sm font-extrabold text-foreground">
                  {customerName}
                </p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {order.address.line}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/50 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                  {content.servicePartner}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-[10px] font-extrabold text-primary-foreground">
                    {(provider?.name ??
                      content.partnerFallback)
                      .split(' ')
                      .map(
                        (word) => word[0],
                      )
                      .slice(0, 2)
                      .join('')}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-foreground">
                      {provider?.name ??
                        content.partnerFallback}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {provider?.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[9px] font-extrabold text-primary">
                      <ShieldCheck className="size-3" />
                      {content.verified}
                    </span>
                  )}

                  {provider && (
                    <span className="text-xs text-muted-foreground">
                      ⭐ {provider.rating} ·{' '}
                      {provider.distance}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Services */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-sm font-extrabold text-foreground">
                  {content.services}
                </h2>

                <span className="rounded-full bg-secondary px-2.5 py-1 text-[9px] font-bold text-muted-foreground">
                  {order.services.length}{' '}
                  {order.services.length === 1
                    ? content.service
                    : content.services}
                </span>
              </div>

              <div className="mt-3 overflow-hidden rounded-2xl border border-border/70">
                <div className="hidden grid-cols-[1fr_80px_100px] gap-4 border-b border-border bg-secondary/60 px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground sm:grid">
                  <span>{content.service}</span>
                  <span className="text-center">
                    {content.items}
                  </span>
                  <span className="text-right">
                    {content.amount}
                  </span>
                </div>

                {order.services.map(
                  (service) => (
                    <div
                      key={service.serviceId}
                      className="grid grid-cols-1 gap-1 border-b border-border/70 px-4 py-4 last:border-b-0 sm:grid-cols-[1fr_80px_100px] sm:items-center sm:gap-4"
                    >
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {service.serviceName}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                          {service.itemCount}{' '}
                          {service.itemCount === 1
                            ? content.item
                            : content.items}
                        </p>
                      </div>

                      <p className="hidden text-center text-sm font-semibold text-muted-foreground sm:block">
                        {service.itemCount}
                      </p>

                      <p className="text-sm font-extrabold text-foreground sm:text-right">
                        {rupees(
                          service.amount,
                        )}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </section>

            {/* Bill summary */}
            <section className="ml-auto max-w-sm">
              <h2 className="font-display text-sm font-extrabold text-foreground">
                {content.billSummary}
              </h2>

              <div className="mt-3 overflow-hidden rounded-2xl border border-border/70 bg-secondary/50">
                <div className="space-y-3 p-4">
                  <BillRow
                    label={content.subtotal}
                    value={rupees(
                      order.subtotal,
                    )}
                  />

                  <BillRow
                    label={content.deliveryFee}
                    value={rupees(
                      order.delivery,
                    )}
                  />

                  {order.discount > 0 && (
                    <BillRow
                      label={`${content.discount}${
                        order.couponCode
                          ? ` (${order.couponCode})`
                          : ''
                      }`}
                      value={`-${rupees(
                        order.discount,
                      )}`}
                      accent
                    />
                  )}
                </div>

                <div className="border-t border-border/70 bg-primary/[0.045] px-4 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-foreground">
                      {content.total}
                    </span>

                    <span className="font-display text-xl font-black tracking-tight text-primary">
                      {rupees(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Booking details */}
            <section className="rounded-2xl border border-border/70 bg-secondary/40 p-4">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="size-4 text-primary" />
                </span>

                <h2 className="text-sm font-extrabold text-foreground">
                  {content.pickupDetails}
                </h2>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <InfoBlock
                  label={content.pickupDate}
                  value={order.pickupDate}
                />

                <InfoBlock
                  label={content.pickupSlot}
                  value={order.pickupSlot}
                />
              </div>
            </section>

            {/* Footer */}
            <div className="border-t border-border/70 pt-6 text-center">
              <p className="font-display text-sm font-extrabold text-foreground">
                {content.thankYou}
              </p>

              <p className="mx-auto mt-1.5 max-w-xl text-xs leading-5 text-muted-foreground">
                {content.footer}
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1.5">
                <ShieldCheck className="size-3.5 text-primary" />

                <span className="text-[9px] font-bold text-primary">
                  {content.verifiedPartner}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

function InfoBlock({
  label,
  value,
  mono = false,
  align = 'left',
}: {
  label: string
  value: string
  mono?: boolean
  align?: 'left' | 'right'
}) {
  return (
    <div
      className={
        align === 'right'
          ? 'sm:text-right'
          : ''
      }
    >
      <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>

      <p
        className={`mt-1.5 text-sm font-bold text-foreground ${
          mono ? 'font-mono' : ''
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function BillRow({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span
        className={
          accent
            ? 'font-bold text-primary'
            : 'font-semibold text-foreground'
        }
      >
        {value}
      </span>
    </div>
  )
}