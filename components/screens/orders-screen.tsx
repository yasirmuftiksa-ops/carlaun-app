'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  CircleCheck,
  CircleDot,
  CreditCard,
  FileText,
  Landmark,
  MapPin,
  MessageCircle,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Star,
  Truck,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

import { ORDER_STATUS_STEPS } from '@/lib/data'
import { rupees } from '@/lib/format'
import { useStore } from '@/lib/store'
import { useLanguage } from '@/components/language-provider'
import { ScreenHeader } from '@/components/screen-header'
import { Modal } from '@/components/ui/modal'

type Review = {
  rating: number
  comment: string
  submittedAt: number
}

type Reviews = Record<string, Review>

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

type OrderAddress =
  | string
  | {
      id: string
      label: string
      line: string
      icon: string
    }

type ExtendedOrder = {
  providerName?: string
  providerIds?: Record<string, string>
  providerNames?: Record<string, string>
  address?: OrderAddress
}

const WORKFLOW_STEPS: {
  id: ProviderWorkflowStatus
  label: string
}[] = [
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

const localizedWorkflowSteps = {
  en: [
    'Assigned',
    'Accepted',
    'On the Way',
    'Arrived',
    'Work Started',
    'Completed',
  ],
  ta: [
    'ஒதுக்கப்பட்டது',
    'ஏற்றுக்கொள்ளப்பட்டது',
    'வழியில் உள்ளது',
    'வந்துவிட்டார்',
    'பணி தொடங்கியது',
    'முடிந்தது',
  ],
  hi: [
    'असाइन किया गया',
    'स्वीकार किया गया',
    'रास्ते में',
    'पहुंच गए',
    'काम शुरू',
    'पूरा हुआ',
  ],
} as const

function statusLabel(
  id: string,
  language: 'en' | 'ta' | 'hi',
) {
  const step =
    ORDER_STATUS_STEPS.find(
      (s) => s.id === id,
    )

  if (!step) return id

  if (language === 'ta') {
    const labels: Record<string, string> = {
      scheduled: 'திட்டமிடப்பட்டது',
      picked: 'எடுக்கப்பட்டது',
      processing: 'செயலாக்கத்தில்',
      quality: 'தரச் சோதனை',
      out: 'வெளியே அனுப்பப்பட்டது',
      delivered: 'முடிந்தது',
    }

    return labels[id] ?? step.label
  }

  if (language === 'hi') {
    const labels: Record<string, string> = {
      scheduled: 'शेड्यूल किया गया',
      picked: 'ले लिया गया',
      processing: 'प्रोसेसिंग में',
      quality: 'गुणवत्ता जांच',
      out: 'भेज दिया गया',
      delivered: 'पूरा हुआ',
    }

    return labels[id] ?? step.label
  }

  return step.label
}

function partnerName(
  providerId?: string,
  providerName?: string,
) {
  if (providerName) return providerName

  if (!providerId) {
    return 'Your Service Partner'
  }

  const names: Record<string, string> = {
    freshcare: 'FreshCare',
    cleannest: 'CleanNest',
    presspro: 'PressPro',
    'saree-care-studio': 'SareeCare Studio',
    'sparkhome-cooperative':
      'SparkHome Cooperative',
    cleanhub: 'CleanHub',
    'aquafix-cooperative':
      'AquaFix Cooperative',
    rapidplumb: 'RapidPlumb',
    'powercare-cooperative':
      'PowerCare Cooperative',
    voltfix: 'VoltFix',
    'woodcraft-cooperative':
      'WoodCraft Cooperative',
    'fixwood-services':
      'FixWood Services',
    'colorcraft-cooperative':
      'ColorCraft Cooperative',
    paintplus: 'PaintPlus',
    'greencare-cooperative':
      'GreenCare Cooperative',
    gardenpro: 'GardenPro',
    'carecircle-cooperative':
      'CareCircle Cooperative',
    comfortcare: 'ComfortCare',
    'cityride-cooperative':
      'CityRide Cooperative',
    'safehands-drivers':
      'SafeHands Drivers',
  }

  return (
    names[providerId.toLowerCase()] ??
    providerId
  )
}

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

function getWorkflowLabel(
  status: ProviderWorkflowStatus,
  language: 'en' | 'ta' | 'hi',
) {
  const index = getWorkflowIndex(status)

  if (index >= 0) {
    return localizedWorkflowSteps[language][
      index
    ]
  }

  return localizedWorkflowSteps[language][0]
}

function getEtaText(
  status: ProviderWorkflowStatus,
  language: 'en' | 'ta' | 'hi',
) {
  const text = {
    en: {
      assigned:
        'Waiting for provider acceptance',
      accepted:
        'Provider is preparing for your job',
      'on-the-way':
        'Provider is on the way',
      arrived:
        'Provider has arrived',
      'work-started':
        'Service is currently in progress',
      completed:
        'Service completed',
    },
    ta: {
      assigned:
        'சேவை வழங்குநரின் ஒப்புதலுக்காக காத்திருக்கிறது',
      accepted:
        'சேவை வழங்குநர் உங்கள் பணிக்குத் தயாராகிறார்',
      'on-the-way':
        'சேவை வழங்குநர் வழியில் உள்ளார்',
      arrived:
        'சேவை வழங்குநர் வந்துவிட்டார்',
      'work-started':
        'சேவை தற்போது நடைபெற்று வருகிறது',
      completed:
        'சேவை முடிந்தது',
    },
    hi: {
      assigned:
        'सेवा प्रदाता की स्वीकृति की प्रतीक्षा है',
      accepted:
        'सेवा प्रदाता आपके काम की तैयारी कर रहा है',
      'on-the-way':
        'सेवा प्रदाता रास्ते में है',
      arrived:
        'सेवा प्रदाता पहुंच गया है',
      'work-started':
        'सेवा अभी जारी है',
      completed:
        'सेवा पूरी हो गई है',
    },
  }

  return text[language][status]
}

function getWorkflowIcon(
  status: ProviderWorkflowStatus,
) {
  if (status === 'completed') {
    return CircleCheck
  }

  return CircleDot
}

function openNavigation(address?: string) {
  if (!address) return

  const url =
    `https://www.google.com/maps/search/?api=1&query=` +
    encodeURIComponent(address)

  window.open(
    url,
    '_blank',
    'noopener,noreferrer',
  )
}

function getAddressText(
  address?: OrderAddress,
) {
  if (!address) return ''

  if (typeof address === 'string') {
    return address
  }

  return address.line
}

export function OrdersScreen() {
  const {
    orders,
    navigate,
    reorder,
    toast,
    processPayment,
    getTransaction,
    markPaymentFailed,
  } = useStore()

  const { language } = useLanguage()

  const [paymentModalOpen, setPaymentModalOpen] =
    useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<'UPI' | 'Card' | 'Net Banking'>('UPI')
  const [paymentOrderId, setPaymentOrderId] =
    useState<string | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] =
    useState(false)
  const [paymentState, setPaymentState] =
    useState<'idle' | 'processing' | 'success' | 'failed'>('idle')

  const [reviews, setReviews] =
    useState<Reviews>({})

  const [openReviewId, setOpenReviewId] =
    useState<string | null>(null)

  const [selectedRating, setSelectedRating] =
    useState(0)

  const [comment, setComment] =
    useState('')

  const [workflowStates, setWorkflowStates] =
    useState<ProviderWorkflowState>({})

  const text = {
    en: {
      title: 'My Orders',
      emptyTitle: 'No orders yet',
      emptyDescription:
        'Your booked services will appear here.',
      schedule: 'Schedule a Service',
      emergency: 'Emergency Priority',
      emergencyDescription:
        'Your request is being handled with priority dispatch.',
      servicePartner: 'Service Partner',
      verified: 'Verified',
      chatProvider: 'Chat Provider',
      liveTracking: 'Live Service Tracking',
      current: 'Current provider status',
      serviceLocation: 'Service Location',
      customerAddress: 'Customer address',
      openLocation: 'Open Location',
      fullTracking: 'Open Full Tracking',
      completed: 'Service Completed',
      completedDescription:
        'Your service has been successfully completed.',
      reorder: 'Reorder',
      invoice: 'Invoice',
      track: 'Track',
      yourReview: 'Your Review',
      experience: 'How was your experience?',
      rateExperience:
        'Rate your experience with',
      editReview: 'Edit Review',
      rateShop: 'Rate Partner',
      rateTitle: 'Rate',
      feedback:
        'Your feedback helps improve NeXa Link.',
      cancel: 'Cancel',
      writeReview: 'Write a review',
      optional: 'Optional',
      reviewPlaceholder:
        'Tell us about your experience...',
      updateReview: 'Update Review',
      submitReview: 'Submit Review',
      poor: 'Poor',
      needsImprovement: 'Needs improvement',
      good: 'Good',
      veryGood: 'Very good',
      excellent: 'Excellent',
      bestMatch: 'Best Match',
      years: 'yrs experience',
      jobs: 'jobs',
      aiSelected:
        'NeXa Link AI selected this provider for',
      items: 'items',
      item: 'item',
      services: 'services',
      service: 'service',
      trackingAvailable: 'Tracking available',
      noProvider:
        'Your service partner will be assigned automatically.',
      noProviderDescription:
        'NeXa Link will select the best available match.',
      thankYou:
        'Thank you for rating your service partner!',
      selectRating:
        'Please select a rating',
      addedToBag:
        'Items added to NeXa Link Bag',
    },
    ta: {
      title: 'எனது ஆர்டர்கள்',
      emptyTitle: 'இன்னும் ஆர்டர்கள் இல்லை',
      emptyDescription:
        'நீங்கள் முன்பதிவு செய்த சேவைகள் இங்கே தோன்றும்.',
      schedule: 'சேவையை திட்டமிடுங்கள்',
      emergency: 'அவசர முன்னுரிமை',
      emergencyDescription:
        'உங்கள் கோரிக்கை முன்னுரிமை அனுப்புதலுடன் கையாளப்படுகிறது.',
      servicePartner: 'சேவை கூட்டாளர்',
      verified: 'சரிபார்க்கப்பட்டது',
      chatProvider: 'கூட்டாளருடன் அரட்டை',
      liveTracking: 'நேரடி சேவை கண்காணிப்பு',
      current: 'தற்போதைய சேவை நிலை',
      serviceLocation: 'சேவை இடம்',
      customerAddress: 'வாடிக்கையாளர் முகவரி',
      openLocation: 'இடத்தைத் திறக்கவும்',
      fullTracking: 'முழு கண்காணிப்பைத் திறக்கவும்',
      completed: 'சேவை முடிந்தது',
      completedDescription:
        'உங்கள் சேவை வெற்றிகரமாக முடிந்தது.',
      reorder: 'மீண்டும் ஆர்டர்',
      invoice: 'ரசீது',
      track: 'கண்காணிக்கவும்',
      yourReview: 'உங்கள் மதிப்புரை',
      experience: 'உங்கள் அனுபவம் எப்படி இருந்தது?',
      rateExperience:
        'உங்கள் அனுபவத்தை மதிப்பிடுங்கள்',
      editReview: 'மதிப்புரையைத் திருத்தவும்',
      rateShop: 'கூட்டாளரை மதிப்பிடுங்கள்',
      rateTitle: 'மதிப்பிடுங்கள்',
      feedback:
        'உங்கள் கருத்து NeXa Link-ஐ மேம்படுத்த உதவுகிறது.',
      cancel: 'ரத்து',
      writeReview: 'மதிப்புரை எழுதுங்கள்',
      optional: 'விருப்பம்',
      reviewPlaceholder:
        'உங்கள் அனுபவத்தைப் பற்றி கூறுங்கள்...',
      updateReview: 'மதிப்புரையைப் புதுப்பிக்கவும்',
      submitReview: 'மதிப்புரையைச் சமர்ப்பிக்கவும்',
      poor: 'மோசம்',
      needsImprovement: 'மேம்பாடு தேவை',
      good: 'நன்று',
      veryGood: 'மிகவும் நன்று',
      excellent: 'சிறப்பு',
      bestMatch: 'சிறந்த பொருத்தம்',
      years: 'ஆண்டுகள் அனுபவம்',
      jobs: 'பணிகள்',
      aiSelected:
        'இந்த சேவை வழங்குநரை NeXa Link AI தேர்ந்தெடுத்தது:',
      items: 'பொருட்கள்',
      item: 'பொருள்',
      services: 'சேவைகள்',
      service: 'சேவை',
      trackingAvailable: 'கண்காணிப்பு உள்ளது',
      noProvider:
        'உங்கள் சேவை கூட்டாளர் தானாக ஒதுக்கப்படுவார்.',
      noProviderDescription:
        'NeXa Link சிறந்த கிடைக்கக்கூடிய கூட்டாளரைத் தேர்ந்தெடுக்கும்.',
      thankYou:
        'உங்கள் சேவை கூட்டாளரை மதிப்பிட்டதற்கு நன்றி!',
      selectRating:
        'மதிப்பீட்டைத் தேர்ந்தெடுக்கவும்',
      addedToBag:
        'பொருட்கள் NeXa Link Bag-ல் சேர்க்கப்பட்டன',
    },
    hi: {
      title: 'मेरे ऑर्डर',
      emptyTitle: 'अभी कोई ऑर्डर नहीं',
      emptyDescription:
        'आपकी बुक की गई सेवाएं यहां दिखाई देंगी।',
      schedule: 'सेवा शेड्यूल करें',
      emergency: 'आपातकालीन प्राथमिकता',
      emergencyDescription:
        'आपके अनुरोध को प्राथमिकता डिस्पैच के साथ संभाला जा रहा है।',
      servicePartner: 'सेवा पार्टनर',
      verified: 'सत्यापित',
      chatProvider: 'पार्टनर से चैट करें',
      liveTracking: 'लाइव सर्विस ट्रैकिंग',
      current: 'वर्तमान सेवा स्थिति',
      serviceLocation: 'सेवा स्थान',
      customerAddress: 'ग्राहक का पता',
      openLocation: 'स्थान खोलें',
      fullTracking: 'पूरी ट्रैकिंग खोलें',
      completed: 'सेवा पूरी हुई',
      completedDescription:
        'आपकी सेवा सफलतापूर्वक पूरी हो गई है।',
      reorder: 'फिर से ऑर्डर',
      invoice: 'इनवॉइस',
      track: 'ट्रैक',
      yourReview: 'आपकी समीक्षा',
      experience: 'आपका अनुभव कैसा रहा?',
      rateExperience:
        'अपने अनुभव को रेट करें',
      editReview: 'समीक्षा संपादित करें',
      rateShop: 'पार्टनर को रेट करें',
      rateTitle: 'रेट करें',
      feedback:
        'आपकी प्रतिक्रिया NeXa Link को बेहतर बनाने में मदद करती है।',
      cancel: 'रद्द करें',
      writeReview: 'समीक्षा लिखें',
      optional: 'वैकल्पिक',
      reviewPlaceholder:
        'अपने अनुभव के बारे में बताएं...',
      updateReview: 'समीक्षा अपडेट करें',
      submitReview: 'समीक्षा सबमिट करें',
      poor: 'खराब',
      needsImprovement: 'सुधार की जरूरत',
      good: 'अच्छा',
      veryGood: 'बहुत अच्छा',
      excellent: 'उत्कृष्ट',
      bestMatch: 'सर्वश्रेष्ठ मैच',
      years: 'वर्ष अनुभव',
      jobs: 'काम',
      aiSelected:
        'NeXa Link AI ने इस सेवा के लिए प्रदाता चुना:',
      items: 'आइटम',
      item: 'आइटम',
      services: 'सेवाएं',
      service: 'सेवा',
      trackingAvailable: 'ट्रैकिंग उपलब्ध',
      noProvider:
        'आपका सेवा पार्टनर अपने आप असाइन किया जाएगा।',
      noProviderDescription:
        'NeXa Link सबसे अच्छा उपलब्ध मैच चुनेगा।',
      thankYou:
        'अपने सेवा पार्टनर को रेट करने के लिए धन्यवाद!',
      selectRating:
        'कृपया रेटिंग चुनें',
      addedToBag:
        'आइटम NeXa Link Bag में जोड़ दिए गए',
    },
  }

  const t = text[language]

  useEffect(() => {
    try {
      const savedReviews =
        localStorage.getItem(
          'carlaun_reviews',
        )

      if (savedReviews) {
        setReviews(
          JSON.parse(savedReviews),
        )
      }
    } catch {
      setReviews({})
    }
  }, [])

  useEffect(() => {
    const loadWorkflowStates = () => {
      try {
        const saved =
          localStorage.getItem(
            'nexa_link_provider_workflows',
          )

        if (saved) {
          setWorkflowStates(
            JSON.parse(saved),
          )
        }
      } catch {
        setWorkflowStates({})
      }
    }

    loadWorkflowStates()

    const handleStorage = (
      event: StorageEvent,
    ) => {
      if (
        event.key ===
        'nexa_link_provider_workflows'
      ) {
        loadWorkflowStates()
      }
    }

    window.addEventListener(
      'storage',
      handleStorage,
    )

    const interval =
      window.setInterval(
        loadWorkflowStates,
        1000,
      )

    return () => {
      window.removeEventListener(
        'storage',
        handleStorage,
      )

      window.clearInterval(interval)
    }
  }, [])

  const saveReviews = (
    updatedReviews: Reviews,
  ) => {
    setReviews(updatedReviews)

    localStorage.setItem(
      'carlaun_reviews',
      JSON.stringify(
        updatedReviews,
      ),
    )
  }

  const paymentOrder =
    orders.find(
      (order) => order.id === paymentOrderId,
    ) ?? null

  const paymentAmount =
    paymentOrder?.total ?? 0

  const paymentTransaction =
    paymentOrderId
      ? getTransaction(paymentOrderId)
      : undefined

  const closePaymentModal = () => {
    if (isProcessingPayment) return
    setPaymentModalOpen(false)
    setPaymentState('idle')
    setIsProcessingPayment(false)
    setPaymentOrderId(null)
  }

  const handleDemoPayment = async (
    shouldFail = false,
  ) => {
    if (!paymentOrder) return

    const isAlreadyPaid =
      paymentOrder.paymentStatus === 'paid' ||
      paymentOrder.paymentDetails?.status === 'paid'

    if (isAlreadyPaid) {
      closePaymentModal()
      return
    }

    setIsProcessingPayment(true)
    setPaymentState('processing')

    await new Promise((resolve) => {
      window.setTimeout(resolve, 1500)
    })

    const completed = shouldFail
      ? markPaymentFailed(paymentOrder.id)
      : await processPayment(paymentOrder.id)

    setIsProcessingPayment(false)

    if (completed) {
      setPaymentState('success')
      return
    }

    setPaymentState('failed')
  }

  const openReviewForm = (
    orderId: string,
  ) => {
    const existingReview =
      reviews[orderId]

    setOpenReviewId(orderId)

    setSelectedRating(
      existingReview?.rating ?? 0,
    )

    setComment(
      existingReview?.comment ?? '',
    )
  }

  const closeReviewForm = () => {
    setOpenReviewId(null)
    setSelectedRating(0)
    setComment('')
  }

  const submitReview = (
    orderId: string,
  ) => {
    if (selectedRating === 0) {
      toast(t.selectRating)
      return
    }

    const updatedReviews: Reviews = {
      ...reviews,
      [orderId]: {
        rating: selectedRating,
        comment: comment.trim(),
        submittedAt: Date.now(),
      },
    }

    saveReviews(updatedReviews)
    closeReviewForm()

    toast(t.thankYou)
  }

  return (
    <>
      <Modal
        open={paymentModalOpen}
        onClose={closePaymentModal}
        title="Pay for your order"
        size="lg"
      >
        {paymentOrder && (
          <div className="space-y-5 pb-2 pt-1">
            <div className="rounded-2xl border border-primary/15 bg-primary/[0.05] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                Order
              </p>
              <p className="mt-2 font-mono text-lg font-black text-foreground">
                #{paymentOrder.id}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2">
                <span className="text-xs text-muted-foreground">
                  Amount
                </span>
                <span className="font-display text-xl font-black text-primary">
                  {rupees(paymentOrder.total)}
                </span>
              </div>
            </div>

            {paymentState === 'idle' && (
              <div className="space-y-3">
                <p className="text-sm font-extrabold text-foreground">
                  Payment Method
                </p>

                <div className="space-y-2.5">
                  {[
                    { id: 'UPI', label: 'UPI', icon: Smartphone },
                    { id: 'Card', label: 'Card', icon: CreditCard },
                    { id: 'Net Banking', label: 'Net Banking', icon: Landmark },
                  ].map((method) => {
                    const Icon = method.icon
                    const active = selectedPaymentMethod === method.id

                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPaymentMethod(method.id as 'UPI' | 'Card' | 'Net Banking')}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all ${
                          active
                            ? 'border-primary bg-primary/[0.05] text-primary'
                            : 'border-border bg-card text-foreground hover:border-primary/25'
                        }`}
                      >
                        <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-foreground">
                          <Icon className="size-4" />
                        </span>
                        <span className="flex-1 text-sm font-bold">
                          {method.label}
                        </span>
                        <span
                          className={`flex size-5 items-center justify-center rounded-full border-2 ${
                            active ? 'border-primary bg-primary' : 'border-border'
                          }`}
                        >
                          {active && <Check className="size-3 text-primary-foreground" />}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'UPI' && paymentState !== 'success' && paymentState !== 'failed' && (
              <div className="rounded-3xl border border-primary/15 bg-secondary/40 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-primary">
                    Demo Payment
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Demo QR — No Real Payment
                  </span>
                </div>

                <div className="rounded-2xl border border-dashed border-border bg-background p-3 text-center">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                    Scan to Pay
                  </p>
                  <p className="mt-2 font-display text-3xl font-black text-foreground">
                    {rupees(paymentOrder.total)}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    UPI ID: nexaLink@demo
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Order: #{paymentOrder.id}
                  </p>
                  <div className="mt-4 flex min-h-[220px] items-center justify-center rounded-2xl border-2 border-primary/20 bg-white p-4 shadow-sm">
                    <QRCodeSVG
                      value={`upi://pay?pa=nexalink@demo&pn=NeXa%20Link&am=${paymentOrder.total}&cu=INR&tn=${paymentOrder.id}`}
                      size={200}
                      marginSize={4}
                      bgColor="#ffffff"
                      fgColor="#111827"
                      level="M"
                      className="block h-[200px] w-[200px]"
                      aria-label={`Demo UPI QR code for order ${paymentOrder.id}`}
                    />
                  </div>
                </div>

                <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                  Demo payment only. No real money will be charged.
                </p>
              </div>
            )}

            {selectedPaymentMethod !== 'UPI' && paymentState !== 'success' && paymentState !== 'failed' && (
              <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-center">
                <p className="text-sm font-extrabold text-foreground">
                  {selectedPaymentMethod} Payment
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Demo payment only. Please confirm to continue.
                </p>
              </div>
            )}

            {paymentState === 'processing' && (
              <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-4 text-center">
                <p className="text-sm font-extrabold text-foreground">
                  Processing payment...
                </p>
              </div>
            )}

            {paymentState === 'success' && (
              <div className="space-y-4 rounded-2xl border border-primary/20 bg-primary/[0.05] p-4 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-6" />
                </div>
                <div>
                  <p className="text-xl font-black text-foreground">
                    Payment Successful
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Payment received successfully.
                  </p>
                </div>
                <div className="space-y-2 rounded-2xl border border-border bg-card p-3 text-left text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-bold text-foreground">
                      {rupees(paymentOrder.total)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      {paymentTransaction?.id ?? 'NXL-TXN-PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-bold text-foreground">
                      {selectedPaymentMethod}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closePaymentModal()
                    navigate({ name: 'invoice', orderId: paymentOrder.id })
                  }}
                  className="w-full rounded-full bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"
                >
                  View Invoice
                </button>
              </div>
            )}

            {paymentState === 'failed' && (
              <div className="space-y-4 rounded-2xl border border-destructive/20 bg-destructive/[0.04] p-4 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <Check className="size-6" />
                </div>
                <div>
                  <p className="text-xl font-black text-foreground">
                    Payment Failed
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Payment could not be completed. Please try again.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentState('idle')}
                  className="w-full rounded-full bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"
                >
                  Try Again
                </button>
              </div>
            )}

            {paymentState !== 'success' && paymentState !== 'failed' && (
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => void handleDemoPayment(false)}
                  disabled={isProcessingPayment}
                  className="w-full rounded-full bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isProcessingPayment
                    ? 'Processing payment...'
                    : selectedPaymentMethod === 'UPI'
                      ? 'I Have Paid'
                      : 'Confirm Demo Payment'}
                </button>

                <button
                  type="button"
                  onClick={() => void handleDemoPayment(true)}
                  disabled={isProcessingPayment}
                  className="w-full rounded-full border border-border bg-card px-4 py-3 text-sm font-bold text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Demo Failure
                </button>

                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="w-full rounded-full border border-border bg-card px-4 py-3 text-sm font-bold text-foreground"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <div className="min-h-dvh bg-background pb-24">
        <ScreenHeader
          title={t.title}
          showBack={false}
        />

        {orders.length === 0 ? (
        <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 py-24 text-center">
          <motion.div
            initial={{
              scale: 0.85,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
            className="relative"
          >
            <span className="absolute inset-0 rounded-[2rem] bg-primary/10 blur-2xl" />

            <div className="relative flex size-24 items-center justify-center rounded-[2rem] border border-primary/10 bg-card shadow-[var(--shadow-card)]">
              <ShoppingBag className="size-10 text-primary" />
            </div>
          </motion.div>

          <h2 className="mt-7 font-display text-2xl font-extrabold tracking-tight text-foreground">
            {t.emptyTitle}
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t.emptyDescription}
          </p>

          <button
            onClick={() =>
              navigate({
                name: 'home',
              })
            }
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] active:scale-95"
          >
            {t.schedule}

            <Truck className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      ) : (
        <div className="space-y-5 px-4 py-5">
          {orders.map((order, i) => {
            const delivered =
              order.status === 'delivered'

            const review =
              reviews[order.id]

            const isReviewOpen =
              openReviewId === order.id

            const extendedOrder =
              order as typeof order & ExtendedOrder

            const shopName =
              partnerName(
                order.providerId,
                extendedOrder.providerName,
              )

            const providerId =
              order.providerId ||
              extendedOrder.providerIds?.[
                order.services[0]
                  ?.serviceId
              ]

            const orderAddress =
              getAddressText(
                extendedOrder.address,
              )

            const workflowStatus =
              getWorkflowStatus(
                workflowStates,
                order.id,
                order.status,
              )

            const workflowIndex =
              getWorkflowIndex(
                workflowStatus,
              )

            const isEmergency =
              order.bookingType ===
              'emergency'

            const isPaid =
              order.paymentStatus === 'paid' ||
              order.paymentDetails?.status === 'paid'
            const isPaymentFailed =
              order.paymentStatus === 'failed' ||
              order.paymentDetails?.status === 'failed'
            const isCashPending =
              order.paymentDetails?.method === 'Cash on Delivery' &&
              !isPaid
            const canPayNow =
              !isPaid &&
              !isCashPending

            const primaryServiceName =
              order.services[0]
                ?.serviceName ||
              'Service'

            return (
              <motion.div
                key={order.id}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: i * 0.05,
                }}
                className="group overflow-hidden rounded-[1.5rem] border border-border/80 bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:border-primary/20 hover:shadow-[var(--shadow-lift)]"
              >
                {/* Order header */}
                <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                        delivered
                          ? 'bg-primary/10 text-primary'
                          : isEmergency
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-accent/10 text-accent'
                      }`}
                    >
                      <PackageCheck className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-mono text-sm font-bold text-foreground">
                        #{order.id}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {order.pickupDate} ·{' '}
                        {order.pickupSlot}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                      delivered
                        ? 'bg-primary/10 text-primary'
                        : isEmergency
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {statusLabel(
                      order.status,
                      language,
                    )}
                  </span>
                </div>

                <div className="px-4 py-4">
                  {/* Emergency */}
                  {isEmergency &&
                    !delivered && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: -4,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="mb-4 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-3.5 py-3"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                          <ShieldCheck className="size-4 text-destructive" />
                        </span>

                        <div>
                          <p className="text-xs font-extrabold text-destructive">
                            {t.emergency}
                          </p>

                          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                            {t.emergencyDescription}
                          </p>
                        </div>
                      </motion.div>
                    )}

                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5">
                    {order.services.map(
                      (s) => (
                        <span
                          key={s.serviceId}
                          className="rounded-full border border-border/60 bg-secondary px-3 py-1.5 text-[11px] font-semibold text-foreground"
                        >
                          {s.serviceName} ·{' '}
                          {s.itemCount}{' '}
                          {s.itemCount === 1
                            ? t.item
                            : t.items}
                        </span>
                      ),
                    )}
                  </div>

                  {/* Provider */}
                  <div className="mt-4 rounded-2xl border border-border/60 bg-secondary/50 p-3.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                      {t.servicePartner}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-[10px] font-extrabold text-primary-foreground">
                          {shopName
                            .split(' ')
                            .map(
                              (word) =>
                                word[0],
                            )
                            .slice(0, 2)
                            .join('')}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-foreground">
                            {shopName}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[9px] font-extrabold text-primary">
                        <ShieldCheck className="size-3" />
                        {t.verified}
                      </span>
                    </div>

                    {/* Chat Provider */}
                    {providerId && (
                      <button
                        onClick={() =>
                          navigate({
                            name: 'chat',
                            orderId:
                              order.id,
                            providerId,
                            providerName:
                              shopName,
                            serviceName:
                              primaryServiceName,
                          })
                        }
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-extrabold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] active:scale-[0.99]"
                      >
                        <MessageCircle className="size-4" />

                        {t.chatProvider}
                      </button>
                    )}

                    {delivered &&
                      review && (
                        <div className="mt-3 flex items-center gap-1">
                          {Array.from({
                            length: 5,
                          }).map(
                            (_, index) => (
                              <Star
                                key={index}
                                className={`size-3.5 ${
                                  index <
                                  review.rating
                                    ? 'fill-current text-primary'
                                    : 'text-muted-foreground/30'
                                }`}
                              />
                            ),
                          )}

                          <span className="ml-1 text-[10px] font-bold text-foreground">
                            {review.rating}/5
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Live tracking */}
                  {!delivered && (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-primary/10 bg-background shadow-[var(--shadow-card)]">
                      <div className="border-b border-border/70 bg-primary/[0.035] px-4 py-3.5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                              <Truck className="size-4 text-primary" />
                            </span>

                            <div className="min-w-0">
                              <p className="text-sm font-extrabold text-foreground">
                                {t.liveTracking}
                              </p>

                              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                                {getEtaText(
                                  workflowStatus,
                                  language,
                                )}
                              </p>
                            </div>
                          </div>

                          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1.5 text-[9px] font-extrabold text-primary">
                            {getWorkflowLabel(
                              workflowStatus,
                              language,
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="px-4 py-4">
                        {/* Workflow */}
                        <div className="space-y-3">
                          {WORKFLOW_STEPS.map(
                            (
                              step,
                              stepIndex,
                            ) => {
                              const completed =
                                stepIndex <=
                                workflowIndex

                              const active =
                                stepIndex ===
                                workflowIndex

                              const Icon =
                                getWorkflowIcon(
                                  step.id,
                                )

                              const localizedLabel =
                                localizedWorkflowSteps[
                                  language
                                ][stepIndex]

                              return (
                                <div
                                  key={step.id}
                                  className="flex items-start gap-3"
                                >
                                  <div className="flex flex-col items-center">
                                    <div
                                      className={`flex size-7 items-center justify-center rounded-full ${
                                        completed
                                          ? 'bg-primary/10 text-primary'
                                          : 'bg-secondary text-muted-foreground'
                                      }`}
                                    >
                                      <Icon className="size-4" />
                                    </div>

                                    {stepIndex <
                                      WORKFLOW_STEPS.length -
                                        1 && (
                                      <div
                                        className={`mt-1 h-5 w-px ${
                                          stepIndex <
                                          workflowIndex
                                            ? 'bg-primary/40'
                                            : 'bg-border'
                                        }`}
                                      />
                                    )}
                                  </div>

                                  <div className="pt-1">
                                    <p
                                      className={`text-xs font-bold ${
                                        active
                                          ? 'text-foreground'
                                          : completed
                                            ? 'text-primary'
                                            : 'text-muted-foreground'
                                      }`}
                                    >
                                      {localizedLabel}
                                    </p>

                                    {active && (
                                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                                        {t.current}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )
                            },
                          )}
                        </div>

                        {/* Location */}
                        <div className="mt-4 rounded-2xl border border-border/60 bg-secondary/60 p-3">
                          <div className="flex items-start gap-2.5">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background">
                              <MapPin className="size-3.5 text-primary" />
                            </span>

                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                                {t.serviceLocation}
                              </p>

                              <p className="mt-1 text-xs font-semibold leading-5 text-foreground">
                                {orderAddress ||
                                  t.customerAddress}
                              </p>
                            </div>
                          </div>

                          {orderAddress && (
                            <button
                              onClick={() =>
                                openNavigation(
                                  orderAddress,
                                )
                              }
                              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-bold text-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                            >
                              <MapPin className="size-3.5" />
                              {t.openLocation}
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            navigate({
                              name: 'tracking',
                              orderId:
                                order.id,
                            })
                          }
                          className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-xs font-extrabold text-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
                        >
                          <Truck className="size-3.5" />

                          {t.fullTracking}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Completed */}
                  {delivered && (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-primary/10 bg-primary/[0.045] px-3.5 py-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <CircleCheck className="size-4 text-primary" />
                      </span>

                      <div>
                        <p className="text-xs font-extrabold text-primary">
                          {t.completed}
                        </p>

                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                          {t.completedDescription}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bottom actions */}
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
                    <div>
                      <p className="font-display text-lg font-extrabold text-foreground">
                        {rupees(
                          order.total,
                        )}
                      </p>

                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {order.services.length}{' '}
                        {order.services.length ===
                        1
                          ? t.service
                          : t.services}
                      </p>
                      <p className={`mt-1 text-[10px] font-extrabold ${isPaid ? 'text-primary' : isPaymentFailed ? 'text-destructive' : isCashPending ? 'text-accent' : 'text-accent'}`}>
                        Payment: {isPaid ? 'PAID' : isPaymentFailed ? 'FAILED' : isCashPending ? 'CASH PENDING' : 'PENDING'}
                      </p>
                      {isPaid && order.transactionId && (
                        <p className="mt-1 text-[10px] font-mono text-muted-foreground">
                          TXN: {order.transactionId}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      {!isPaid && !isCashPending && (
                        <button
                          onClick={() => {
                            setPaymentOrderId(order.id)
                            setSelectedPaymentMethod('UPI')
                            setPaymentState('idle')
                            setPaymentModalOpen(true)
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[11px] font-extrabold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                        >
                          Pay Now
                        </button>
                      )}

                      <button
                        onClick={() => {
                          reorder(order.id)

                          navigate({
                            name: 'bag',
                          })

                          toast(
                            t.addedToBag,
                          )
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-2 text-[11px] font-bold text-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      >
                        <RotateCcw className="size-3.5" />
                        {t.reorder}
                      </button>

                      <button
                        onClick={() =>
                          navigate({
                            name: 'invoice',
                            orderId:
                              order.id,
                          })
                        }
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-2 text-[11px] font-bold text-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      >
                        <FileText className="size-3.5" />
                        {t.invoice}
                      </button>

                      <button
                        onClick={() =>
                          navigate({
                            name: 'tracking',
                            orderId:
                              order.id,
                          })
                        }
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[11px] font-extrabold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                      >
                        <Truck className="size-3.5" />
                        {t.track}
                      </button>
                    </div>
                  </div>

                  {/* Review */}
                  {delivered && (
                    <div className="mt-4 border-t border-border/70 pt-4">
                      {!isReviewOpen ? (
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-extrabold text-foreground">
                              {review
                                ? t.yourReview
                                : t.experience}
                            </p>

                            {review ? (
                              <div className="mt-1.5 flex items-center gap-1">
                                {Array.from({
                                  length: 5,
                                }).map(
                                  (
                                    _,
                                    index,
                                  ) => (
                                    <Star
                                      key={
                                        index
                                      }
                                      className={`size-4 ${
                                        index <
                                        review.rating
                                          ? 'fill-current text-primary'
                                          : 'text-muted-foreground/30'
                                      }`}
                                    />
                                  ),
                                )}
                              </div>
                            ) : (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {t.rateExperience}{' '}
                                {shopName}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              openReviewForm(
                                order.id,
                              )
                            }
                            className="shrink-0 rounded-full border border-border px-4 py-2 text-[11px] font-bold text-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                          >
                            {review
                              ? t.editReview
                              : t.rateShop}
                          </button>
                        </div>
                      ) : (
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: 'auto',
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-extrabold text-foreground">
                                  {t.rateTitle}{' '}
                                  {shopName}
                                </p>

                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                  {t.feedback}
                                </p>
                              </div>

                              <button
                                onClick={
                                  closeReviewForm
                                }
                                className="shrink-0 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
                              >
                                {t.cancel}
                              </button>
                            </div>

                            <div className="mt-4 flex items-center gap-1.5">
                              {[
                                1,
                                2,
                                3,
                                4,
                                5,
                              ].map(
                                (rating) => (
                                  <button
                                    key={
                                      rating
                                    }
                                    type="button"
                                    onClick={() =>
                                      setSelectedRating(
                                        rating,
                                      )
                                    }
                                    aria-label={`Rate ${rating} out of 5`}
                                    className="rounded-full p-1 transition-transform hover:scale-110 active:scale-95"
                                  >
                                    <Star
                                      className={`size-8 ${
                                        rating <=
                                        selectedRating
                                          ? 'fill-current text-primary'
                                          : 'text-muted-foreground/30'
                                      }`}
                                    />
                                  </button>
                                ),
                              )}
                            </div>

                            {selectedRating >
                              0 && (
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {selectedRating ===
                                  1 &&
                                  t.poor}

                                {selectedRating ===
                                  2 &&
                                  t.needsImprovement}

                                {selectedRating ===
                                  3 &&
                                  t.good}

                                {selectedRating ===
                                  4 &&
                                  t.veryGood}

                                {selectedRating ===
                                  5 &&
                                  t.excellent}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor={`review-${order.id}`}
                              className="mb-2 block text-xs font-bold text-foreground"
                            >
                              {t.writeReview}

                              <span className="ml-1 font-normal text-muted-foreground">
                                ({t.optional})
                              </span>
                            </label>

                            <textarea
                              id={`review-${order.id}`}
                              value={comment}
                              onChange={(e) =>
                                setComment(
                                  e.target
                                    .value,
                                )
                              }
                              placeholder={
                                t.reviewPlaceholder
                              }
                              rows={3}
                              maxLength={300}
                              className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                            />

                            <p className="mt-1 text-right text-[10px] font-medium text-muted-foreground">
                              {comment.length}
                              /300
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              submitReview(
                                order.id,
                              )
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] active:scale-[0.99]"
                          >
                            <Check className="size-4" />

                            {review
                              ? t.updateReview
                              : t.submitReview}
                          </button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
    </>
  )
}