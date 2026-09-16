'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Clock3,
  Edit3,
  MapPin,
  Plus,
  ShieldAlert,
  Trash2,
  Zap,
  X,
} from 'lucide-react'

import { ScreenHeader } from '@/components/screen-header'
import { useLanguage } from '@/components/language-provider'
import {
  ADDRESSES,
  PAYMENT_METHODS,
  PICKUP_SLOTS,
} from '@/lib/data'
import { rupees } from '@/lib/format'
import { Icon } from '@/lib/icons'
import { useStore } from '@/lib/store'
import type { Address, BookingType } from '@/lib/types'

const DATES = [
  'Today',
  'Tomorrow',
  'Wed, 26',
  'Thu, 27',
]

type AddressForm = {
  label: string
  line: string
  city: string
  pincode: string
  icon: string
}

const DEFAULT_ADDRESS_FORM: AddressForm = {
  label: 'Home',
  line: '',
  city: '',
  pincode: '',
  icon: 'home',
}

const ADDRESS_STORAGE_KEY = 'carlaun_addresses'

const BOOKING_MODES: {
  id: BookingType
  title: string
  description: string
}[] = [
  {
    id: 'scheduled',
    title: 'Scheduled',
    description: 'Choose your preferred date and time',
  },
  {
    id: 'on-demand',
    title: 'On-Demand',
    description: 'Request a provider as soon as possible',
  },
  {
    id: 'emergency',
    title: 'Emergency',
    description: 'Get immediate priority assistance',
  },
]

const TEXT = {
  en: {
    bookService: 'Book a Service',
    bookingType: 'Booking Type',
    scheduled: 'Scheduled',
    scheduledDescription:
      'Choose your preferred date and time',
    onDemand: 'On-Demand',
    onDemandDescription:
      'Request a provider as soon as possible',
    emergency: 'Emergency',
    emergencyDescription:
      'Get immediate priority assistance',
    priority: 'PRIORITY',

    onDemandRequest: 'On-Demand Request',
    onDemandMessage:
      'Your request will be matched with an available verified provider as soon as possible.',
    serviceRequested: 'Service requested',
    asap: 'ASAP',

    emergencyService: 'Emergency Service',
    emergencyMessage:
      'Your booking will receive immediate priority. Nearby eligible providers can respond to the request first.',
    immediatePriority: 'Immediate priority request',

    serviceAddress: 'Service Address',
    edit: 'Edit',
    delete: 'Delete',
    addNewAddress: 'Add New Address',

    addressType: 'Address Type',
    home: 'Home',
    hostel: 'Hostel',
    college: 'College',
    other: 'Other',
    fullAddress: 'Full Address',
    addressPlaceholder:
      'House / Flat No., Street, Area',
    city: 'City',
    cityPlaceholder: 'Your city',
    pincode: 'Pincode',
    pincodePlaceholder: '6-digit PIN',
    cancel: 'Cancel',
    updateAddress: 'Update Address',
    saveAddress: 'Save Address',
    addressFormHelp:
      'Enter the address where the service will be provided.',
    editAddress: 'Edit Address',

    pickupDate: 'Pickup Date',
    timeSlot: 'Time Slot',
    serviceTiming: 'Service Timing',
    asSoonAsPossible: 'As soon as possible',
    matchAvailable:
      'We will match you with an available provider.',
    immediate: 'Immediate priority',
    nearbyEligible:
      'Nearby eligible providers are prioritized.',

    paymentMethod: 'Payment Method',
    orderSummary: 'Order Summary',
    serviceTotal: 'Service Total',
    pickupDelivery: 'Pickup & Delivery',
    free: 'FREE',
    discount: 'Discount',
    toPay: 'To Pay',
    confirmPay: 'Confirm & Pay',

    selectAddress:
      'Please select a service address',
    selectPayment:
      'Please select a payment method',
    selectTimeSlot:
      'Please select a time slot',

    addressLabel:
      'Please enter an address label',
    fullAddressError:
      'Please enter your full address',
    cityError: 'Please enter your city',
    pincodeError:
      'Please enter a valid 6-digit pincode',
    addressUpdated:
      'Address updated successfully',
    addressAdded:
      'New address added successfully',
    keepAddress:
      'You must keep at least one address',
    addressDeleted: 'Address deleted',
    deleteConfirm:
      'Delete this address?',
  },

  ta: {
    bookService: 'சேவையை முன்பதிவு செய்க',
    bookingType: 'முன்பதிவு வகை',
    scheduled: 'திட்டமிடப்பட்டது',
    scheduledDescription:
      'உங்களுக்கு விருப்பமான தேதி மற்றும் நேரத்தை தேர்வு செய்யவும்',
    onDemand: 'தேவைக்கேற்ப',
    onDemandDescription:
      'முடிந்த விரைவில் சேவை வழங்குநரை கோருங்கள்',
    emergency: 'அவசரம்',
    emergencyDescription:
      'உடனடி முன்னுரிமை உதவியைப் பெறுங்கள்',
    priority: 'முன்னுரிமை',

    onDemandRequest: 'தேவைக்கேற்ப கோரிக்கை',
    onDemandMessage:
      'உங்கள் கோரிக்கை விரைவில் கிடைக்கும் சரிபார்க்கப்பட்ட சேவை வழங்குநருடன் பொருத்தப்படும்.',
    serviceRequested: 'கோரப்பட்ட சேவை',
    asap: 'விரைவில்',

    emergencyService: 'அவசர சேவை',
    emergencyMessage:
      'உங்கள் முன்பதிவுக்கு உடனடி முன்னுரிமை வழங்கப்படும். அருகிலுள்ள தகுதியான சேவை வழங்குநர்களுக்கு முதலில் கோரிக்கை அனுப்பப்படும்.',
    immediatePriority: 'உடனடி முன்னுரிமை கோரிக்கை',

    serviceAddress: 'சேவை முகவரி',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    addNewAddress: 'புதிய முகவரியைச் சேர்க்கவும்',

    addressType: 'முகவரி வகை',
    home: 'வீடு',
    hostel: 'விடுதி',
    college: 'கல்லூரி',
    other: 'மற்றவை',
    fullAddress: 'முழு முகவரி',
    addressPlaceholder:
      'வீட்டு / பிளாட் எண், தெரு, பகுதி',
    city: 'நகரம்',
    cityPlaceholder: 'உங்கள் நகரம்',
    pincode: 'அஞ்சல் குறியீடு',
    pincodePlaceholder: '6 இலக்க PIN',
    cancel: 'ரத்து செய்',
    updateAddress: 'முகவரியைப் புதுப்பிக்கவும்',
    saveAddress: 'முகவரியைச் சேமிக்கவும்',
    addressFormHelp:
      'சேவை வழங்கப்படும் முகவரியை உள்ளிடவும்.',
    editAddress: 'முகவரியைத் திருத்தவும்',

    pickupDate: 'சேவை தேதி',
    timeSlot: 'நேர இடைவெளி',
    serviceTiming: 'சேவை நேரம்',
    asSoonAsPossible: 'முடிந்த விரைவில்',
    matchAvailable:
      'கிடைக்கும் சேவை வழங்குநருடன் உங்களை பொருத்துவோம்.',
    immediate: 'உடனடி முன்னுரிமை',
    nearbyEligible:
      'அருகிலுள்ள தகுதியான சேவை வழங்குநர்களுக்கு முன்னுரிமை வழங்கப்படும்.',

    paymentMethod: 'கட்டண முறை',
    orderSummary: 'ஆர்டர் சுருக்கம்',
    serviceTotal: 'சேவை மொத்தம்',
    pickupDelivery: 'எடுத்துச் செல்லுதல் மற்றும் விநியோகம்',
    free: 'இலவசம்',
    discount: 'தள்ளுபடி',
    toPay: 'செலுத்த வேண்டியது',
    confirmPay: 'உறுதிசெய்து செலுத்தவும்',

    selectAddress:
      'சேவை முகவரியைத் தேர்வு செய்யவும்',
    selectPayment:
      'கட்டண முறையைத் தேர்வு செய்யவும்',
    selectTimeSlot:
      'நேர இடைவெளியைத் தேர்வு செய்யவும்',

    addressLabel:
      'முகவரி பெயரை உள்ளிடவும்',
    fullAddressError:
      'முழு முகவரியை உள்ளிடவும்',
    cityError: 'உங்கள் நகரத்தை உள்ளிடவும்',
    pincodeError:
      'சரியான 6 இலக்க அஞ்சல் குறியீட்டை உள்ளிடவும்',
    addressUpdated:
      'முகவரி வெற்றிகரமாக புதுப்பிக்கப்பட்டது',
    addressAdded:
      'புதிய முகவரி வெற்றிகரமாக சேர்க்கப்பட்டது',
    keepAddress:
      'குறைந்தது ஒரு முகவரியையாவது வைத்திருக்க வேண்டும்',
    addressDeleted: 'முகவரி நீக்கப்பட்டது',
    deleteConfirm:
      'இந்த முகவரியை நீக்கவா?',
  },

  hi: {
    bookService: 'सेवा बुक करें',
    bookingType: 'बुकिंग प्रकार',
    scheduled: 'शेड्यूल किया गया',
    scheduledDescription:
      'अपनी पसंद की तारीख और समय चुनें',
    onDemand: 'ऑन-डिमांड',
    onDemandDescription:
      'जितनी जल्दी हो सके सेवा प्रदाता का अनुरोध करें',
    emergency: 'आपातकाल',
    emergencyDescription:
      'तुरंत प्राथमिकता सहायता प्राप्त करें',
    priority: 'प्राथमिकता',

    onDemandRequest: 'ऑन-डिमांड अनुरोध',
    onDemandMessage:
      'आपका अनुरोध जल्द से जल्द उपलब्ध सत्यापित सेवा प्रदाता से मैच किया जाएगा।',
    serviceRequested: 'अनुरोधित सेवा',
    asap: 'जल्द से जल्द',

    emergencyService: 'आपातकालीन सेवा',
    emergencyMessage:
      'आपकी बुकिंग को तुरंत प्राथमिकता मिलेगी। आसपास के योग्य सेवा प्रदाता पहले अनुरोध का जवाब दे सकते हैं।',
    immediatePriority: 'तुरंत प्राथमिकता अनुरोध',

    serviceAddress: 'सेवा का पता',
    edit: 'संपादित करें',
    delete: 'हटाएँ',
    addNewAddress: 'नया पता जोड़ें',

    addressType: 'पते का प्रकार',
    home: 'घर',
    hostel: 'हॉस्टल',
    college: 'कॉलेज',
    other: 'अन्य',
    fullAddress: 'पूरा पता',
    addressPlaceholder:
      'घर / फ्लैट नंबर, सड़क, क्षेत्र',
    city: 'शहर',
    cityPlaceholder: 'अपना शहर',
    pincode: 'पिनकोड',
    pincodePlaceholder: '6 अंकों का PIN',
    cancel: 'रद्द करें',
    updateAddress: 'पता अपडेट करें',
    saveAddress: 'पता सेव करें',
    addressFormHelp:
      'वह पता दर्ज करें जहाँ सेवा दी जाएगी।',
    editAddress: 'पता संपादित करें',

    pickupDate: 'सेवा की तारीख',
    timeSlot: 'समय स्लॉट',
    serviceTiming: 'सेवा का समय',
    asSoonAsPossible: 'जितनी जल्दी हो सके',
    matchAvailable:
      'हम आपको उपलब्ध सेवा प्रदाता से मैच करेंगे।',
    immediate: 'तुरंत प्राथमिकता',
    nearbyEligible:
      'आसपास के योग्य सेवा प्रदाताओं को प्राथमिकता दी जाएगी।',

    paymentMethod: 'भुगतान का तरीका',
    orderSummary: 'ऑर्डर सारांश',
    serviceTotal: 'सेवा कुल',
    pickupDelivery: 'पिकअप और डिलीवरी',
    free: 'मुफ़्त',
    discount: 'छूट',
    toPay: 'भुगतान करें',
    confirmPay: 'पुष्टि करें और भुगतान करें',

    selectAddress:
      'कृपया सेवा का पता चुनें',
    selectPayment:
      'कृपया भुगतान का तरीका चुनें',
    selectTimeSlot:
      'कृपया समय स्लॉट चुनें',

    addressLabel:
      'कृपया पते का नाम दर्ज करें',
    fullAddressError:
      'कृपया पूरा पता दर्ज करें',
    cityError:
      'कृपया अपना शहर दर्ज करें',
    pincodeError:
      'कृपया सही 6 अंकों का पिनकोड दर्ज करें',
    addressUpdated:
      'पता सफलतापूर्वक अपडेट किया गया',
    addressAdded:
      'नया पता सफलतापूर्वक जोड़ा गया',
    keepAddress:
      'आपको कम से कम एक पता रखना होगा',
    addressDeleted: 'पता हटा दिया गया',
    deleteConfirm:
      'क्या आप इस पते को हटाना चाहते हैं?',
  },
} as const

export function CheckoutScreen() {
  const {
    address,
    setAddress,
    pickupDate,
    setPickupDate,
    pickupSlot,
    setPickupSlot,
    payment,
    setPayment,
    bookingType,
    setBookingType,
    subtotal,
    delivery,
    discount,
    total,
    groups,
    placeOrder,
    navigate,
    toast,
  } = useStore()

  const { language } = useLanguage()
  const content = TEXT[language]

  const [placing, setPlacing] =
    useState(false)

  const [savedAddresses, setSavedAddresses] =
    useState<Address[]>(ADDRESSES)

  const [showAddressForm, setShowAddressForm] =
    useState(false)

  const [editingAddressId, setEditingAddressId] =
    useState<string | null>(null)

  const [addressForm, setAddressForm] =
    useState<AddressForm>(
      DEFAULT_ADDRESS_FORM,
    )

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        ADDRESS_STORAGE_KEY,
      )

      if (saved) {
        const parsed = JSON.parse(saved) as Address[]

        if (
          Array.isArray(parsed) &&
          parsed.length > 0
        ) {
          setSavedAddresses(parsed)
        }
      }
    } catch {
      setSavedAddresses(ADDRESSES)
    }
  }, [])

  useEffect(() => {
    if (savedAddresses.length > 0) {
      localStorage.setItem(
        ADDRESS_STORAGE_KEY,
        JSON.stringify(savedAddresses),
      )
    }
  }, [savedAddresses])

  const canPlace =
    Boolean(payment) &&
    Boolean(address?.id) &&
    (bookingType !== 'scheduled' ||
      Boolean(pickupSlot))

  function handleBookingTypeChange(
    type: BookingType,
  ) {
    setBookingType(type)

    if (type === 'on-demand') {
      setPickupDate('Today')
      setPickupSlot('As soon as possible')
    }

    if (type === 'emergency') {
      setPickupDate('Today')
      setPickupSlot('Immediate priority')
    }

    if (type === 'scheduled') {
      setPickupDate('Today')
      setPickupSlot('')
    }
  }

  function handlePlace() {
    if (!address?.id) {
      toast(
        content.selectAddress,
        'error',
      )
      return
    }

    if (!payment) {
      toast(
        content.selectPayment,
        'error',
      )
      return
    }

    if (
      bookingType === 'scheduled' &&
      !pickupSlot
    ) {
      toast(
        content.selectTimeSlot,
        'error',
      )
      return
    }

    setPlacing(true)

    setTimeout(() => {
      const order = placeOrder()

      setPlacing(false)

      navigate({
        name: 'success',
        orderId: order.id,
      })
    }, 900)
  }

  function openAddAddress() {
    setEditingAddressId(null)

    setAddressForm({
      ...DEFAULT_ADDRESS_FORM,
      label: content.home,
    })

    setShowAddressForm(true)
  }

  function openEditAddress(
    selectedAddress: Address,
  ) {
    const parts = selectedAddress.line
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)

    const possiblePincode =
      parts.find((part) =>
        /^\d{6}$/.test(part),
      ) ?? ''

    const possibleCity =
      parts.length >= 2
        ? parts[
            parts.length -
              (possiblePincode ? 2 : 1)
          ] ?? ''
        : ''

    setEditingAddressId(
      selectedAddress.id,
    )

    setAddressForm({
      label: selectedAddress.label,
      line: selectedAddress.line,
      city: possibleCity,
      pincode: possiblePincode,
      icon:
        selectedAddress.icon || 'home',
    })

    setShowAddressForm(true)
  }

  function closeAddressForm() {
    setShowAddressForm(false)
    setEditingAddressId(null)
    setAddressForm(
      DEFAULT_ADDRESS_FORM,
    )
  }

  function saveAddress() {
    const label =
      addressForm.label.trim()

    const line =
      addressForm.line.trim()

    const city =
      addressForm.city.trim()

    const pincode =
      addressForm.pincode.trim()

    if (!label) {
      toast(
        content.addressLabel,
        'error',
      )
      return
    }

    if (!line) {
      toast(
        content.fullAddressError,
        'error',
      )
      return
    }

    if (!city) {
      toast(
        content.cityError,
        'error',
      )
      return
    }

    if (!/^\d{6}$/.test(pincode)) {
      toast(
        content.pincodeError,
        'error',
      )
      return
    }

    const fullLine =
      `${line}, ${city}, ${pincode}`

    if (editingAddressId) {
      const updatedAddress: Address = {
        id: editingAddressId,
        label,
        line: fullLine,
        icon: getAddressIcon(label),
      }

      setSavedAddresses((current) =>
        current.map((item) =>
          item.id === editingAddressId
            ? updatedAddress
            : item,
        ),
      )

      if (
        address?.id === editingAddressId
      ) {
        setAddress(updatedAddress)
      }

      toast(
        content.addressUpdated,
      )
    } else {
      const newAddress: Address = {
        id: `address-${Date.now()}`,
        label,
        line: fullLine,
        icon: getAddressIcon(label),
      }

      setSavedAddresses((current) => [
        ...current,
        newAddress,
      ])

      setAddress(newAddress)

      toast(
        content.addressAdded,
      )
    }

    closeAddressForm()
  }

  function deleteAddress(
    addressId: string,
  ) {
    if (savedAddresses.length <= 1) {
      toast(
        content.keepAddress,
        'error',
      )
      return
    }

    const addressToDelete =
      savedAddresses.find(
        (item) => item.id === addressId,
      )

    if (!addressToDelete) {
      return
    }

    const confirmed = window.confirm(
      `${content.deleteConfirm} "${addressToDelete.label}"?`,
    )

    if (!confirmed) {
      return
    }

    const remaining =
      savedAddresses.filter(
        (item) => item.id !== addressId,
      )

    setSavedAddresses(remaining)

    if (address?.id === addressId) {
      setAddress(remaining[0])
    }

    toast(content.addressDeleted)
  }

  function getAddressIcon(
    label: string,
  ) {
    const normalized =
      label.toLowerCase()

    if (
      normalized.includes('home') ||
      normalized.includes('வீடு') ||
      normalized.includes('घर')
    ) {
      return 'home'
    }

    if (
      normalized.includes('hostel') ||
      normalized.includes('விடுதி') ||
      normalized.includes('हॉस्टल')
    ) {
      return 'building'
    }

    if (
      normalized.includes('college') ||
      normalized.includes('கல்லூரி') ||
      normalized.includes('कॉलेज')
    ) {
      return 'graduation'
    }

    return 'map-pin'
  }

  const localizedBookingModes = [
    {
      ...BOOKING_MODES[0],
      title: content.scheduled,
      description:
        content.scheduledDescription,
    },
    {
      ...BOOKING_MODES[1],
      title: content.onDemand,
      description:
        content.onDemandDescription,
    },
    {
      ...BOOKING_MODES[2],
      title: content.emergency,
      description:
        content.emergencyDescription,
    },
  ]

  const addressTypeOptions = [
    {
      value: 'home',
      label: content.home,
    },
    {
      value: 'hostel',
      label: content.hostel,
    },
    {
      value: 'college',
      label: content.college,
    },
    {
      value: 'other',
      label: content.other,
    },
  ]

  return (
    <div className="min-h-dvh bg-background pb-40">
      <ScreenHeader
        title={content.bookService}
      />

      <div className="mx-auto max-w-2xl space-y-5 px-4 py-4">
        {/* ===================================================== */}
        {/* BOOKING TYPE */}
        {/* ===================================================== */}

        <Section title={content.bookingType}>
          <div className="space-y-2.5">
            {localizedBookingModes.map(
              (mode) => {
                const active =
                  bookingType === mode.id

                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() =>
                      handleBookingTypeChange(
                        mode.id,
                      )
                    }
                    className={`group flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 ${
                      active
                        ? 'border-primary bg-primary/[0.045] shadow-[var(--shadow-soft)]'
                        : 'border-border bg-card hover:border-primary/25'
                    }`}
                  >
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-all ${
                        active
                          ? 'bg-primary text-primary-foreground shadow-[var(--shadow-soft)]'
                          : 'bg-secondary text-foreground'
                      }`}
                    >
                      {mode.id ===
                        'scheduled' && (
                        <Clock3 className="size-5" />
                      )}

                      {mode.id ===
                        'on-demand' && (
                        <Zap className="size-5" />
                      )}

                      {mode.id ===
                        'emergency' && (
                        <ShieldAlert className="size-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">
                          {mode.title}
                        </p>

                        {mode.id ===
                          'emergency' && (
                          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-destructive">
                            {content.priority}
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {mode.description}
                      </p>
                    </div>

                    <div
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        active
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}
                    >
                      {active && (
                        <Check className="size-3 text-primary-foreground" />
                      )}
                    </div>
                  </button>
                )
              },
            )}
          </div>

          <p className="mt-3 rounded-xl border border-primary/10 bg-primary/[0.04] px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
            Demo payment only. Card and UPI credentials are never collected.
          </p>
        </Section>

        {/* ===================================================== */}
        {/* ON-DEMAND NOTICE */}
        {/* ===================================================== */}

        {bookingType ===
          'on-demand' && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.045] p-4 shadow-[var(--shadow-card)]"
          >
            <div className="absolute -right-10 -top-10 size-28 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Zap className="size-5" />
              </span>

              <div>
                <p className="text-sm font-bold text-foreground">
                  {content.onDemandRequest}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {content.onDemandMessage}
                </p>

                <div className="mt-3 rounded-xl border border-primary/10 bg-card px-3 py-2 text-xs font-bold text-foreground">
                  ⚡ {content.serviceRequested}:{' '}
                  {content.asap}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===================================================== */}
        {/* EMERGENCY NOTICE */}
        {/* ===================================================== */}

        {bookingType ===
          'emergency' && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="relative overflow-hidden rounded-2xl border border-destructive/20 bg-destructive/[0.045] p-4 shadow-[var(--shadow-card)]"
          >
            <div className="absolute -right-10 -top-10 size-28 rounded-full bg-destructive/10 blur-2xl" />

            <div className="relative flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" />
              </span>

              <div>
                <p className="text-sm font-bold text-foreground">
                  {content.emergencyService}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {content.emergencyMessage}
                </p>

                <div className="mt-3 rounded-xl border border-destructive/10 bg-card px-3 py-2 text-xs font-bold text-destructive">
                  🚨 {content.immediatePriority}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===================================================== */}
        {/* ADDRESS */}
        {/* ===================================================== */}

        <Section title={content.serviceAddress}>
          <div className="space-y-2.5">
            {savedAddresses.map(
              (savedAddress) => {
                const active =
                  savedAddress.id ===
                  address?.id

                return (
                  <div
                    key={savedAddress.id}
                    className={`overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-card)] transition-all duration-200 ${
                      active
                        ? 'border-primary shadow-[var(--shadow-soft)]'
                        : 'border-border hover:border-primary/25'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setAddress(
                          savedAddress,
                        )
                      }
                      className="flex w-full items-start gap-3 px-4 py-3.5 text-left"
                    >
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                          active
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-foreground'
                        }`}
                      >
                        <Icon
                          name={
                            savedAddress.icon
                          }
                          className="size-4.5"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground">
                          {savedAddress.label}
                        </p>

                        <p className="mt-0.5 text-pretty text-xs leading-relaxed text-muted-foreground">
                          {savedAddress.line}
                        </p>
                      </div>

                      {active && (
                        <Check className="mt-0.5 size-4.5 shrink-0 text-primary" />
                      )}
                    </button>

                    <div className="flex items-center justify-end gap-1 border-t border-border px-3 py-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditAddress(
                            savedAddress,
                          )
                        }
                        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-secondary"
                      >
                        <Edit3 className="size-3.5" />
                        {content.edit}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteAddress(
                            savedAddress.id,
                          )
                        }
                        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="size-3.5" />
                        {content.delete}
                      </button>
                    </div>
                  </div>
                )
              },
            )}

            <button
              type="button"
              onClick={openAddAddress}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/[0.035] px-4 py-3.5 text-sm font-bold text-primary transition-all hover:border-primary/60 hover:bg-primary/[0.07] active:scale-[0.99]"
            >
              <Plus className="size-4" />
              {content.addNewAddress}
            </button>
          </div>
        </Section>

        {/* ===================================================== */}
        {/* ADDRESS FORM */}
        {/* ===================================================== */}

        {showAddressForm && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-[1.5rem] border border-border bg-card p-4 shadow-[var(--shadow-lift)]"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="size-4.5" />
                </span>

                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {editingAddressId
                      ? content.editAddress
                      : content.addNewAddress}
                  </h3>

                  <p className="mt-0.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
                    {content.addressFormHelp}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeAddressForm}
                className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Close address form"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Address Type */}

            <div>
              <label className="mb-2 block text-xs font-bold text-foreground">
                {content.addressType}
              </label>

              <div className="grid grid-cols-4 gap-2">
                {addressTypeOptions.map(
                  (option) => {
                    const selected =
                      addressForm.label ===
                      option.label

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setAddressForm(
                            (current) => ({
                              ...current,
                              label:
                                option.label,
                            }),
                          )
                        }
                        className={`rounded-xl border py-2.5 text-xs font-bold transition-all ${
                          selected
                            ? 'border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]'
                            : 'border-border bg-background text-foreground hover:border-primary/30'
                        }`}
                      >
                        {option.label}
                      </button>
                    )
                  },
                )}
              </div>
            </div>

            {/* Full Address */}

            <div className="mt-4">
              <label
                htmlFor="full-address"
                className="mb-2 block text-xs font-bold text-foreground"
              >
                {content.fullAddress}
              </label>

              <textarea
                id="full-address"
                value={addressForm.line}
                onChange={(event) =>
                  setAddressForm(
                    (current) => ({
                      ...current,
                      line: event.target.value,
                    }),
                  )
                }
                placeholder={
                  content.addressPlaceholder
                }
                rows={3}
                maxLength={250}
                className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* City + Pincode */}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="address-city"
                  className="mb-2 block text-xs font-bold text-foreground"
                >
                  {content.city}
                </label>

                <input
                  id="address-city"
                  type="text"
                  value={addressForm.city}
                  onChange={(event) =>
                    setAddressForm(
                      (current) => ({
                        ...current,
                        city: event.target.value,
                      }),
                    )
                  }
                  placeholder={
                    content.cityPlaceholder
                  }
                  maxLength={60}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label
                  htmlFor="address-pincode"
                  className="mb-2 block text-xs font-bold text-foreground"
                >
                  {content.pincode}
                </label>

                <input
                  id="address-pincode"
                  type="text"
                  inputMode="numeric"
                  value={addressForm.pincode}
                  onChange={(event) =>
                    setAddressForm(
                      (current) => ({
                        ...current,
                        pincode:
                          event.target.value
                            .replace(
                              /\D/g,
                              '',
                            )
                            .slice(
                              0,
                              6,
                            ),
                      }),
                    )
                  }
                  placeholder={
                    content.pincodePlaceholder
                  }
                  maxLength={6}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            {/* Buttons */}

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={closeAddressForm}
                className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
              >
                {content.cancel}
              </button>

              <button
                type="button"
                onClick={saveAddress}
                className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              >
                {editingAddressId
                  ? content.updateAddress
                  : content.saveAddress}
              </button>
            </div>
          </motion.div>
        )}

        {/* ===================================================== */}
        {/* SCHEDULED */}
        {/* ===================================================== */}

        {bookingType ===
          'scheduled' && (
          <>
            <Section
              title={content.pickupDate}
            >
              <div className="grid grid-cols-4 gap-2">
                {DATES.map((date) => (
                  <button
                    key={date}
                    type="button"
                    onClick={() =>
                      setPickupDate(
                        date,
                      )
                    }
                    className={`rounded-xl border py-2.5 text-xs font-bold transition-all ${
                      pickupDate === date
                        ? 'border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]'
                        : 'border-border bg-card text-foreground hover:border-primary/30'
                    }`}
                  >
                    {date === 'Today'
                      ? language ===
                        'ta'
                        ? 'இன்று'
                        : language ===
                            'hi'
                          ? 'आज'
                          : date
                      : date ===
                          'Tomorrow'
                        ? language ===
                          'ta'
                          ? 'நாளை'
                          : language ===
                              'hi'
                            ? 'कल'
                            : date
                        : date}
                  </button>
                ))}
              </div>
            </Section>

            <Section
              title={content.timeSlot}
            >
              <div className="grid grid-cols-3 gap-2">
                {PICKUP_SLOTS.map(
                  (slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() =>
                        setPickupSlot(
                          slot,
                        )
                      }
                      className={`rounded-xl border py-2.5 text-xs font-bold transition-all ${
                        pickupSlot ===
                        slot
                          ? 'border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]'
                          : 'border-border bg-card text-foreground hover:border-primary/30'
                      }`}
                    >
                      {slot}
                    </button>
                  ),
                )}
              </div>
            </Section>
          </>
        )}

        {/* ===================================================== */}
        {/* ON-DEMAND TIMING */}
        {/* ===================================================== */}

        {bookingType ===
          'on-demand' && (
          <Section
            title={content.serviceTiming}
          >
            <div className="rounded-2xl border border-primary/20 bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Zap className="size-5" />
                </span>

                <div>
                  <p className="text-sm font-bold text-foreground">
                    {content.asSoonAsPossible}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {content.matchAvailable}
                  </p>
                </div>

                <Check className="ml-auto size-5 text-primary" />
              </div>
            </div>
          </Section>
        )}

        {/* ===================================================== */}
        {/* EMERGENCY TIMING */}
        {/* ===================================================== */}

        {bookingType ===
          'emergency' && (
          <Section
            title={content.serviceTiming}
          >
            <div className="rounded-2xl border border-destructive/20 bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <ShieldAlert className="size-5" />
                </span>

                <div>
                  <p className="text-sm font-bold text-foreground">
                    {content.immediate}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {content.nearbyEligible}
                  </p>
                </div>

                <Check className="ml-auto size-5 text-destructive" />
              </div>
            </div>
          </Section>
        )}

        {/* ===================================================== */}
        {/* PAYMENT */}
        {/* ===================================================== */}

        <Section
          title={content.paymentMethod}
        >
          <div className="space-y-2.5">
            {PAYMENT_METHODS.map(
              (method) => {
                const active =
                  method.id === payment

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() =>
                      setPayment(
                        method.id,
                      )
                    }
                    className={`group flex w-full items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 text-left shadow-[var(--shadow-card)] transition-all duration-200 ${
                      active
                        ? 'border-primary shadow-[var(--shadow-soft)]'
                        : 'border-border hover:border-primary/25'
                    }`}
                  >
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground'
                      }`}
                    >
                      <Icon
                        name={method.icon}
                        className="size-4.5"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground">
                        {method.label}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {method.hint}
                      </p>
                    </div>

                    <div
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        active
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}
                    >
                      {active && (
                        <span className="size-2 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                  </button>
                )
              },
            )}
          </div>
        </Section>

        {/* ===================================================== */}
        {/* ORDER SUMMARY */}
        {/* ===================================================== */}

        <Section
          title={content.orderSummary}
        >
          <div className="rounded-[1.5rem] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="mb-4 flex flex-wrap gap-1.5">
              {groups.map((group) => (
                <span
                  key={group.serviceId}
                  className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground"
                >
                  {group.serviceName} ·{' '}
                  {group.itemCount}
                </span>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <SummaryRow
                label={content.serviceTotal}
                value={rupees(subtotal)}
              />

              <SummaryRow
                label={content.pickupDelivery}
                value={
                  delivery === 0
                    ? content.free
                    : rupees(delivery)
                }
              />

              {discount > 0 && (
                <SummaryRow
                  label={content.discount}
                  value={`- ${rupees(
                    discount,
                  )}`}
                  accent
                />
              )}

              <div className="my-2 border-t border-dashed border-border" />

              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-foreground">
                  {content.toPay}
                </span>

                <span className="font-display text-xl font-bold text-foreground">
                  {rupees(total)}
                </span>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* ===================================================== */}
      {/* STICKY PLACE ORDER */}
      {/* ===================================================== */}

      <div className="fixed inset-x-0 bottom-24 z-30 border-t border-border bg-card/95 px-4 py-3 shadow-[0_-12px_35px_-25px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <button
          type="button"
          onClick={handlePlace}
          disabled={
            placing || !canPlace
          }
          className="mx-auto flex w-full max-w-2xl items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {placing ? (
            <motion.span
              className="size-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
              animate={{
                rotate: 360,
              }}
              transition={{
                repeat: Infinity,
                duration: 0.7,
                ease: 'linear',
              }}
            />
          ) : (
            <>
              {content.confirmPay}{' '}
              {rupees(total)}
              <ChevronRight className="size-4.5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| SECTION
|--------------------------------------------------------------------------
*/

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>

      {children}
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| SUMMARY ROW
|--------------------------------------------------------------------------
*/

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
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