'use client'

import { motion } from 'framer-motion'
import {
  Info,
  ShieldCheck,
  Star,
  MapPin,
  Trophy,
  LocateFixed,
  Loader2,
  Navigation,
  AlertCircle,
  BadgeCheck,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  getService,
  PARTNERS,
  PARTNER_LOCATIONS,
  EXPRESS_MULTIPLIER,
} from '@/lib/data'

import { rupees } from '@/lib/format'
import { Icon } from '@/lib/icons'
import { useStore } from '@/lib/store'
import { useLanguage } from '@/components/language-provider'
import { BagBar } from '@/components/bag-bar'
import { QuantityStepper } from '@/components/quantity-stepper'
import { ScreenHeader } from '@/components/screen-header'

type GeoLocationState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'demo'
  | 'denied'
  | 'error'

type GeoCoordinates = {
  latitude: number
  longitude: number
}

type ProviderRegistration = {
  id: string
  fullName: string
  phone: string
  cooperative: string
  service: string
  skills: string
  experience: number
  serviceArea: string
  certification: string
  available: boolean
  latitude: number
  longitude: number
  locationMode: 'live' | 'demo'
  status: 'pending' | 'verified'
  createdAt: string
}

type RegisteredProvider = {
  id: string
  name: string
  services: string
  rating: number
  distance: string
  turnaround: string
  verified: boolean
  available: boolean
  experience: number
  completedJobs: number
  serviceArea: string
  earnings: number
  isRegisteredProvider: true
  cooperative: string
  certification: string
  latitude: number
  longitude: number
  locationMode: 'live' | 'demo'
}

type Provider =
  | (typeof PARTNERS)[number]
  | RegisteredProvider

const isRegisteredProvider = (
  partner: Provider,
): partner is RegisteredProvider =>
  'isRegisteredProvider' in partner &&
  partner.isRegisteredProvider === true

const PROVIDER_REGISTRATION_STORAGE =
  'carlaun_provider_registrations'

const DEMO_LOCATION: GeoCoordinates = {
  latitude: 12.9716,
  longitude: 80.2209,
}

export function ServiceDetailScreen({
  serviceId,
}: {
  serviceId: string
}) {
  const { language } = useLanguage()

  const {
    getQty,
    addItem,
    removeItem,
    setQty,
    care,
    setCare,
    toast,
    selectedProviders,
    setSelectedProvider,
    navigate,
    bookingType,
  } = useStore()

  const service = getService(serviceId)

  const [geoState, setGeoState] =
    useState<GeoLocationState>('idle')

  const [userCoordinates, setUserCoordinates] =
    useState<GeoCoordinates | null>(null)

  const [geoMessage, setGeoMessage] =
    useState('')

  const [registeredProviders, setRegisteredProviders] =
    useState<ProviderRegistration[]>([])

  const locationRequestActive =
    useRef(false)

  const content = {
    en: {
      careLevel: 'Care Level',
      standard: 'Standard',
      express: 'Express',
      expressInfo:
        'Express: same-day priority handling.',
      standardInfo:
        'Standard: 24–48 hour turnaround.',
      selectItems: 'Select Items',
      bagMessage:
        'Add items from other services too — they all travel in one NeXa Link Bag, picked up together in a single trip.',
      smartGeo: 'Smart GEO Matching',
      liveDetected: 'Live location detected',
      demoActive: 'Demo GEO location active',
      checkingLocation: 'Checking your location...',
      useLocation: 'Use your location',
      liveGps: 'LIVE GPS',
      demoGeo: 'DEMO GEO',
      geoDefault:
        'NeXa Link uses your location to prioritize nearby service providers.',
      refreshLocation: 'Refresh Location',
      detectLocation: 'Detect My Location',
      checkingGps: 'Checking live GPS...',
      liveGpsMatching:
        'Live GPS matching is active. Provider distances are calculated from your current location.',
      demoGeoMatching:
        'Demo GEO matching is active using a representative Chennai location. This is useful for desktop/SIH demo testing when live GPS is unavailable.',
      optionalLocation:
        'Location access is optional. Provider matching will continue using availability, rating and provider distance.',
      gpsError:
        'GPS could not be detected. You can retry or continue without location access.',
      smartProvider: 'Smart Provider Match',
      aiDescription:
        'NeXa Link AI ranks verified providers using service compatibility, availability, rating, GEO proximity & turnaround.',
      aiGeo: 'AI + GEO',
      verifiedProvider:
        'verified registered provider',
      verifiedProviders:
        'verified registered providers',
      includedMatching:
        'are included in AI matching.',
      emergencyBooking:
        'Emergency booking: nearest available provider is prioritized.',
      noProviders:
        'No matching providers found',
      moreProviders:
        "We're working to connect more local providers.",
      nearestMatch: 'Nearest Match',
      bestMatch: 'Best Match',
      registeredProvider: 'REGISTERED PROVIDER',
      liveProviderGeo: 'LIVE PROVIDER GEO',
      liveGeo: 'LIVE GEO',
      demoGeoLabel: 'DEMO GEO',
      serviceArea: 'Service area',
      cooperative: 'Cooperative',
      aiMatch: 'AI Match',
      geoMatchedLive:
        'Live GEO matched — provider is',
      geoMatchedDemo:
        'Demo GEO matched — provider is',
      fromCustomer:
        'from the customer location.',
      whyRecommended:
        'Why NeXa Link recommends this',
      service: 'Service',
      compatible: 'Compatible',
      availability: 'Availability',
      availableNow: 'Available now',
      currentlyBusy: 'Currently busy',
      rating: 'Rating',
      geoDistance: 'GEO Distance',
      turnaround: 'Turnaround',
      recommendedBy:
        'Recommended by NeXa Link AI + GEO',
      yearsExperience: 'yrs experience',
      jobs: 'jobs',
      currentlyBusyButton: 'Currently Busy',
      providerSelected: '✓ Provider Selected',
      nearestSelect:
        'Nearest Match — Select',
      bestSelect: 'Best Match — Select',
      selectProvider: 'Select Provider',
      providerSelectedLabel: 'Provider selected',
      handledBy:
        'Your service will be handled by this provider.',
      viewBag: 'View Bag & Continue',
      locationDetectedToast:
        'Current location detected successfully.',
      demoLocationToast:
        'Demo GEO location activated.',
      permissionDeniedToast:
        'Location permission denied. Demo GEO activated.',
      liveUnavailableToast:
        'Live GPS unavailable. Demo GEO activated.',
      locationStarting:
        'GEO matching is starting. Checking your live location...',
      liveDetectedMessage:
        'Your current location was detected. Provider distances are calculated using live GPS.',
      noGpsSupport:
        'Live GPS is not supported on this device. Demo GEO matching is active.',
      permissionDenied:
        'Location permission was denied. Demo GEO matching is active instead.',
      gpsFailed:
        'Live GPS could not be determined. Demo GEO matching is active for this session.',
      itemAdded: 'added to NeXa Link Bag',
      selectedFor: 'selected for',
    },

    ta: {
      careLevel: 'பராமரிப்பு நிலை',
      standard: 'ஸ்டாண்டர்ட்',
      express: 'எக்ஸ்பிரஸ்',
      expressInfo:
        'எக்ஸ்பிரஸ்: அதே நாளில் முன்னுரிமை சேவை.',
      standardInfo:
        'ஸ்டாண்டர்ட்: 24–48 மணி நேரத்தில் சேவை.',
      selectItems: 'பொருட்களைத் தேர்வு செய்யவும்',
      bagMessage:
        'மற்ற சேவைகளிலிருந்தும் பொருட்களைச் சேர்க்கலாம் — அனைத்தும் ஒரே NeXa Link பையில் ஒரே பயணத்தில் சேகரிக்கப்படும்.',
      smartGeo: 'ஸ்மார்ட் GEO பொருத்தம்',
      liveDetected: 'நேரடி இருப்பிடம் கண்டறியப்பட்டது',
      demoActive: 'டெமோ GEO இருப்பிடம் செயலில் உள்ளது',
      checkingLocation: 'உங்கள் இருப்பிடத்தைச் சரிபார்க்கிறது...',
      useLocation: 'உங்கள் இருப்பிடத்தைப் பயன்படுத்தவும்',
      liveGps: 'நேரடி GPS',
      demoGeo: 'டெமோ GEO',
      geoDefault:
        'அருகிலுள்ள சேவை வழங்குநர்களுக்கு முன்னுரிமை அளிக்க NeXa Link உங்கள் இருப்பிடத்தைப் பயன்படுத்துகிறது.',
      refreshLocation: 'இருப்பிடத்தைப் புதுப்பிக்கவும்',
      detectLocation: 'எனது இருப்பிடத்தைக் கண்டறியவும்',
      checkingGps: 'நேரடி GPS-ஐச் சரிபார்க்கிறது...',
      liveGpsMatching:
        'நேரடி GPS பொருத்தம் செயலில் உள்ளது. உங்கள் தற்போதைய இருப்பிடத்தின் அடிப்படையில் வழங்குநர் தூரம் கணக்கிடப்படுகிறது.',
      demoGeoMatching:
        'சென்னையின் பிரதிநிதி இருப்பிடத்தைப் பயன்படுத்தி டெமோ GEO பொருத்தம் செயலில் உள்ளது. நேரடி GPS இல்லாதபோது SIH டெமோ சோதனைக்கு இது பயன்படும்.',
      optionalLocation:
        'இருப்பிட அனுமதி விருப்பமானது. கிடைக்கும் நிலை, மதிப்பீடு மற்றும் வழங்குநர் தூரத்தின் அடிப்படையில் பொருத்தம் தொடரும்.',
      gpsError:
        'GPS இருப்பிடத்தைக் கண்டறிய முடியவில்லை. மீண்டும் முயற்சிக்கலாம் அல்லது இருப்பிட அனுமதி இல்லாமலும் தொடரலாம்.',
      smartProvider: 'ஸ்மார்ட் சேவை வழங்குநர் பொருத்தம்',
      aiDescription:
        'NeXa Link AI சேவை பொருத்தம், கிடைக்கும் நிலை, மதிப்பீடு, GEO அருகாமை மற்றும் சேவை நேரத்தின் அடிப்படையில் சரிபார்க்கப்பட்ட வழங்குநர்களை தரவரிசைப்படுத்துகிறது.',
      aiGeo: 'AI + GEO',
      verifiedProvider:
        'சரிபார்க்கப்பட்ட பதிவு செய்யப்பட்ட சேவை வழங்குநர்',
      verifiedProviders:
        'சரிபார்க்கப்பட்ட பதிவு செய்யப்பட்ட சேவை வழங்குநர்கள்',
      includedMatching:
        'AI பொருத்தத்தில் சேர்க்கப்பட்டுள்ளனர்.',
      emergencyBooking:
        'அவசர முன்பதிவு: அருகிலுள்ள கிடைக்கக்கூடிய வழங்குநருக்கு முன்னுரிமை அளிக்கப்படுகிறது.',
      noProviders:
        'பொருத்தமான சேவை வழங்குநர்கள் இல்லை',
      moreProviders:
        'மேலும் உள்ளூர் சேவை வழங்குநர்களை இணைக்க நாங்கள் செயல்பட்டு வருகிறோம்.',
      nearestMatch: 'அருகிலுள்ள பொருத்தம்',
      bestMatch: 'சிறந்த பொருத்தம்',
      registeredProvider: 'பதிவு செய்யப்பட்ட வழங்குநர்',
      liveProviderGeo: 'நேரடி வழங்குநர் GEO',
      liveGeo: 'நேரடி GEO',
      demoGeoLabel: 'டெமோ GEO',
      serviceArea: 'சேவை பகுதி',
      cooperative: 'கூட்டுறவு',
      aiMatch: 'AI பொருத்தம்',
      geoMatchedLive:
        'நேரடி GEO பொருத்தம் — வழங்குநர்',
      geoMatchedDemo:
        'டெமோ GEO பொருத்தம் — வழங்குநர்',
      fromCustomer:
        'வாடிக்கையாளர் இருப்பிடத்திலிருந்து.',
      whyRecommended:
        'NeXa Link இதை ஏன் பரிந்துரைக்கிறது',
      service: 'சேவை',
      compatible: 'பொருத்தமானது',
      availability: 'கிடைக்கும் நிலை',
      availableNow: 'இப்போது கிடைக்கிறது',
      currentlyBusy: 'தற்போது பிஸியாக உள்ளது',
      rating: 'மதிப்பீடு',
      geoDistance: 'GEO தூரம்',
      turnaround: 'சேவை நேரம்',
      recommendedBy:
        'NeXa Link AI + GEO மூலம் பரிந்துரைக்கப்பட்டது',
      yearsExperience: 'ஆண்டுகள் அனுபவம்',
      jobs: 'வேலைகள்',
      currentlyBusyButton: 'தற்போது பிஸி',
      providerSelected: '✓ வழங்குநர் தேர்ந்தெடுக்கப்பட்டார்',
      nearestSelect:
        'அருகிலுள்ள பொருத்தம் — தேர்வு செய்யவும்',
      bestSelect: 'சிறந்த பொருத்தம் — தேர்வு செய்யவும்',
      selectProvider: 'வழங்குநரைத் தேர்வு செய்யவும்',
      providerSelectedLabel: 'வழங்குநர் தேர்ந்தெடுக்கப்பட்டார்',
      handledBy:
        'உங்கள் சேவை இந்த வழங்குநரால் மேற்கொள்ளப்படும்.',
      viewBag: 'பையைப் பார்க்கவும் & தொடரவும்',
      locationDetectedToast:
        'தற்போதைய இருப்பிடம் வெற்றிகரமாக கண்டறியப்பட்டது.',
      demoLocationToast:
        'டெமோ GEO இருப்பிடம் செயல்படுத்தப்பட்டது.',
      permissionDeniedToast:
        'இருப்பிட அனுமதி மறுக்கப்பட்டது. டெமோ GEO செயல்படுத்தப்பட்டது.',
      liveUnavailableToast:
        'நேரடி GPS கிடைக்கவில்லை. டெமோ GEO செயல்படுத்தப்பட்டது.',
      locationStarting:
        'GEO பொருத்தம் தொடங்குகிறது. உங்கள் நேரடி இருப்பிடத்தைச் சரிபார்க்கிறது...',
      liveDetectedMessage:
        'உங்கள் தற்போதைய இருப்பிடம் கண்டறியப்பட்டது. நேரடி GPS மூலம் வழங்குநர் தூரம் கணக்கிடப்படுகிறது.',
      noGpsSupport:
        'இந்த சாதனத்தில் நேரடி GPS ஆதரவு இல்லை. டெமோ GEO பொருத்தம் செயல்பாட்டில் உள்ளது.',
      permissionDenied:
        'இருப்பிட அனுமதி மறுக்கப்பட்டது. அதற்கு பதிலாக டெமோ GEO பொருத்தம் செயல்பாட்டில் உள்ளது.',
      gpsFailed:
        'நேரடி GPS-ஐக் கண்டறிய முடியவில்லை. இந்த அமர்விற்கு டெமோ GEO பொருத்தம் செயல்பாட்டில் உள்ளது.',
      itemAdded: 'NeXa Link பையில் சேர்க்கப்பட்டது',
      selectedFor: 'இதற்காக தேர்வு செய்யப்பட்டது',
    },

    hi: {
      careLevel: 'देखभाल स्तर',
      standard: 'स्टैंडर्ड',
      express: 'एक्सप्रेस',
      expressInfo:
        'एक्सप्रेस: उसी दिन प्राथमिकता सेवा।',
      standardInfo:
        'स्टैंडर्ड: 24–48 घंटे में सेवा।',
      selectItems: 'आइटम चुनें',
      bagMessage:
        'अन्य सेवाओं के आइटम भी जोड़ें — सभी आइटम एक ही NeXa Link Bag में एक ही यात्रा में पिकअप किए जाएंगे।',
      smartGeo: 'स्मार्ट GEO मैचिंग',
      liveDetected: 'लाइव लोकेशन मिली',
      demoActive: 'डेमो GEO लोकेशन सक्रिय',
      checkingLocation: 'आपकी लोकेशन जांची जा रही है...',
      useLocation: 'अपनी लोकेशन का उपयोग करें',
      liveGps: 'लाइव GPS',
      demoGeo: 'डेमो GEO',
      geoDefault:
        'NeXa Link पास के सेवा प्रदाताओं को प्राथमिकता देने के लिए आपकी लोकेशन का उपयोग करता है।',
      refreshLocation: 'लोकेशन रीफ्रेश करें',
      detectLocation: 'मेरी लोकेशन खोजें',
      checkingGps: 'लाइव GPS जांचा जा रहा है...',
      liveGpsMatching:
        'लाइव GPS मैचिंग सक्रिय है। आपकी वर्तमान लोकेशन के आधार पर प्रदाता की दूरी निर्धारित की जाती है।',
      demoGeoMatching:
        'एक प्रतिनिधि चेन्नई लोकेशन का उपयोग करके डेमो GEO मैचिंग सक्रिय है। लाइव GPS उपलब्ध न होने पर SIH डेमो परीक्षण के लिए यह उपयोगी है।',
      optionalLocation:
        'लोकेशन की अनुमति वैकल्पिक है। उपलब्धता, रेटिंग और प्रदाता की दूरी के आधार पर मैचिंग जारी रहेगी।',
      gpsError:
        'GPS लोकेशन नहीं मिल सकी। आप फिर से प्रयास कर सकते हैं या लोकेशन के बिना जारी रख सकते हैं।',
      smartProvider: 'स्मार्ट सेवा प्रदाता मैच',
      aiDescription:
        'NeXa Link AI सेवा अनुकूलता, उपलब्धता, रेटिंग, GEO दूरी और सेवा समय के आधार पर सत्यापित प्रदाताओं की रैंकिंग करता है।',
      aiGeo: 'AI + GEO',
      verifiedProvider:
        'सत्यापित पंजीकृत सेवा प्रदाता',
      verifiedProviders:
        'सत्यापित पंजीकृत सेवा प्रदाता',
      includedMatching:
        'AI मैचिंग में शामिल हैं।',
      emergencyBooking:
        'आपातकालीन बुकिंग: निकटतम उपलब्ध प्रदाता को प्राथमिकता दी जाती है।',
      noProviders:
        'कोई मिलान करने वाला प्रदाता नहीं मिला',
      moreProviders:
        'हम और अधिक स्थानीय सेवा प्रदाताओं को जोड़ने के लिए काम कर रहे हैं।',
      nearestMatch: 'निकटतम मैच',
      bestMatch: 'सर्वश्रेष्ठ मैच',
      registeredProvider: 'पंजीकृत प्रदाता',
      liveProviderGeo: 'लाइव प्रदाता GEO',
      liveGeo: 'लाइव GEO',
      demoGeoLabel: 'डेमो GEO',
      serviceArea: 'सेवा क्षेत्र',
      cooperative: 'सहकारी संस्था',
      aiMatch: 'AI मैच',
      geoMatchedLive:
        'लाइव GEO मैच — प्रदाता',
      geoMatchedDemo:
        'डेमो GEO मैच — प्रदाता',
      fromCustomer:
        'ग्राहक की लोकेशन से।',
      whyRecommended:
        'NeXa Link इसकी सिफारिश क्यों करता है',
      service: 'सेवा',
      compatible: 'अनुकूल',
      availability: 'उपलब्धता',
      availableNow: 'अभी उपलब्ध',
      currentlyBusy: 'अभी व्यस्त',
      rating: 'रेटिंग',
      geoDistance: 'GEO दूरी',
      turnaround: 'सेवा समय',
      recommendedBy:
        'NeXa Link AI + GEO द्वारा अनुशंसित',
      yearsExperience: 'वर्षों का अनुभव',
      jobs: 'काम',
      currentlyBusyButton: 'अभी व्यस्त',
      providerSelected: '✓ प्रदाता चुना गया',
      nearestSelect:
        'निकटतम मैच — चुनें',
      bestSelect: 'सर्वश्रेष्ठ मैच — चुनें',
      selectProvider: 'प्रदाता चुनें',
      providerSelectedLabel: 'प्रदाता चुना गया',
      handledBy:
        'आपकी सेवा इस प्रदाता द्वारा पूरी की जाएगी।',
      viewBag: 'बैग देखें और जारी रखें',
      locationDetectedToast:
        'वर्तमान लोकेशन सफलतापूर्वक मिल गई।',
      demoLocationToast:
        'डेमो GEO लोकेशन सक्रिय की गई।',
      permissionDeniedToast:
        'लोकेशन अनुमति अस्वीकार की गई। डेमो GEO सक्रिय किया गया।',
      liveUnavailableToast:
        'लाइव GPS उपलब्ध नहीं है। डेमो GEO सक्रिय किया गया।',
      locationStarting:
        'GEO मैचिंग शुरू हो रही है। आपकी लाइव लोकेशन जांची जा रही है...',
      liveDetectedMessage:
        'आपकी वर्तमान लोकेशन मिल गई है। लाइव GPS से प्रदाता की दूरी निर्धारित की जा रही है।',
      noGpsSupport:
        'इस डिवाइस पर लाइव GPS समर्थित नहीं है। डेमो GEO मैचिंग सक्रिय है।',
      permissionDenied:
        'लोकेशन अनुमति अस्वीकार की गई। इसके बजाय डेमो GEO मैचिंग सक्रिय है।',
      gpsFailed:
        'लाइव GPS निर्धारित नहीं किया जा सका। इस सत्र के लिए डेमो GEO मैचिंग सक्रिय है।',
      itemAdded: 'NeXa Link Bag में जोड़ा गया',
      selectedFor: 'के लिए चुना गया',
    },
  }[language]

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        PROVIDER_REGISTRATION_STORAGE,
      )

      if (!saved) {
        setRegisteredProviders([])
        return
      }

      const parsed =
        JSON.parse(saved) as ProviderRegistration[]

      setRegisteredProviders(
        Array.isArray(parsed) ? parsed : [],
      )
    } catch {
      setRegisteredProviders([])
    }
  }, [])

  const detectLocation = () => {
    if (locationRequestActive.current) {
      return
    }

    locationRequestActive.current = true

    setUserCoordinates(DEMO_LOCATION)

    setGeoState('loading')

    setGeoMessage(content.locationStarting)

    if (
      typeof window === 'undefined' ||
      !navigator.geolocation
    ) {
      setGeoState('demo')

      setGeoMessage(content.noGpsSupport)

      locationRequestActive.current = false

      toast(content.demoLocationToast, 'info')

      return
    }

    window.setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            latitude:
              position.coords.latitude,
            longitude:
              position.coords.longitude,
          }

          setUserCoordinates(coordinates)

          setGeoState('success')

          setGeoMessage(
            content.liveDetectedMessage,
          )

          locationRequestActive.current = false

          toast(
            content.locationDetectedToast,
            'info',
          )
        },
        (error) => {
          if (error.code === 1) {
            setUserCoordinates(
              DEMO_LOCATION,
            )

            setGeoState('demo')

            setGeoMessage(
              content.permissionDenied,
            )

            locationRequestActive.current = false

            toast(
              content.permissionDeniedToast,
              'info',
            )

            return
          }

          setUserCoordinates(
            DEMO_LOCATION,
          )

          setGeoState('demo')

          setGeoMessage(
            content.gpsFailed,
          )

          locationRequestActive.current = false

          toast(
            content.liveUnavailableToast,
            'info',
          )
        },
        {
          enableHighAccuracy: false,
          timeout: 3000,
          maximumAge: 300000,
        },
      )
    }, 100)
  }

  if (!service) {
    return null
  }

  const level =
    care[service.id] ?? 'standard'

  const isExpress =
    level === 'express'

  const serviceName =
    service.name.toLowerCase()

  const serviceKeywords = [
    serviceName,
    serviceName.replace(
      ' services',
      '',
    ),
    serviceName.replace(
      ' service',
      '',
    ),
  ].filter(Boolean)

  const requiredSkills =
    service.requiredSkills?.map(
      (skill) =>
        skill.toLowerCase(),
    ) ?? []

  const calculateDistanceKm = (
    customer: GeoCoordinates,
    provider: GeoCoordinates,
  ) => {
    const toRadians = (
      value: number,
    ) => (value * Math.PI) / 180

    const earthRadius = 6371

    const customerLatitude =
      toRadians(
        customer.latitude,
      )

    const providerLatitude =
      toRadians(
        provider.latitude,
      )

    const deltaLatitude =
      toRadians(
        provider.latitude -
          customer.latitude,
      )

    const deltaLongitude =
      toRadians(
        provider.longitude -
          customer.longitude,
      )

    const a =
      Math.sin(
        deltaLatitude / 2,
      ) **
        2 +
      Math.cos(
        customerLatitude,
      ) *
        Math.cos(
          providerLatitude,
        ) *
        Math.sin(
          deltaLongitude / 2,
        ) **
          2

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a),
      )

    return earthRadius * c
  }

  const registeredMatchingProviders =
    useMemo(() => {
      return registeredProviders
        .filter(
          (registration) =>
            registration.status ===
            'verified',
        )
        .map(
          (
            registration,
          ): RegisteredProvider => ({
            id: registration.id,
            name: registration.fullName,
            services:
              registration.service,
            rating: 5,
            distance: 'GEO calculated',
            turnaround:
              registration.available
                ? 'Available now'
                : 'Currently busy',
            verified: true,
            available:
              registration.available,
            experience:
              registration.experience,
            completedJobs: 0,
            serviceArea:
              registration.serviceArea,
            earnings: 0,
            isRegisteredProvider: true,
            cooperative:
              registration.cooperative,
            certification:
              registration.certification,
            latitude:
              registration.latitude,
            longitude:
              registration.longitude,
            locationMode:
              registration.locationMode,
          }),
        )
    }, [registeredProviders])

  const allProviders = useMemo(() => {
    return [
      ...PARTNERS,
      ...registeredMatchingProviders,
    ]
  }, [registeredMatchingProviders])

  const getProviderDistance = (
    partner: Provider,
  ) => {
    if (isRegisteredProvider(partner)) {
      if (userCoordinates) {
        return calculateDistanceKm(
          userCoordinates,
          {
            latitude:
              partner.latitude,
            longitude:
              partner.longitude,
          },
        )
      }

      return 5
    }

    const providerLocation =
      PARTNER_LOCATIONS[
        partner.id
      ]

    if (
      userCoordinates &&
      providerLocation
    ) {
      return calculateDistanceKm(
        userCoordinates,
        {
          latitude:
            providerLocation.latitude,
          longitude:
            providerLocation.longitude,
        },
      )
    }

    const fallbackDistance =
      parseFloat(
        partner.distance,
      )

    return Number.isFinite(
      fallbackDistance,
    )
      ? fallbackDistance
      : 5
  }

  const recommendedProviders =
    useMemo(() => {
      const matchedProviders =
        allProviders.filter(
          (partner) => {
            if (isRegisteredProvider(partner)) {
              const registeredService =
                partner.services.toLowerCase()

              const registeredSkills =
                partner.serviceArea.toLowerCase()

              const directMatch =
                serviceKeywords.some(
                  (keyword) =>
                    keyword.length > 2 &&
                    registeredService.includes(
                      keyword,
                    ),
                )

              const skillMatch =
                requiredSkills.some(
                  (skill) =>
                    skill.length > 2 &&
                    registeredService.includes(
                      skill,
                    ),
                )

              const skillTextMatch =
                partner.services
                  .toLowerCase()
                  .includes(
                    serviceName,
                  ) ||
                registeredSkills.includes(
                  serviceName,
                )

              return (
                directMatch ||
                skillMatch ||
                skillTextMatch
              )
            }

            const providerServices =
              partner.services.toLowerCase()

            const directMatch =
              serviceKeywords.some(
                (keyword) =>
                  keyword.length > 2 &&
                  providerServices.includes(
                    keyword,
                  ),
              )

            const skillMatch =
              requiredSkills.some(
                (skill) =>
                  skill.length > 2 &&
                  providerServices.includes(
                    skill,
                  ),
              )

            return (
              directMatch ||
              skillMatch
            )
          },
        )

      return matchedProviders
        .map((partner) => {
          const providerServices =
            partner.services.toLowerCase()

          let serviceScore = 35

          const exactServiceMatch =
            serviceKeywords.some(
              (keyword) =>
                keyword.length > 2 &&
                providerServices.includes(
                  keyword,
                ),
            )

          if (exactServiceMatch) {
            serviceScore += 10
          }

          const matchingSkillCount =
            requiredSkills.filter(
              (skill) =>
                skill.length > 2 &&
                providerServices.includes(
                  skill,
                ),
            ).length

          serviceScore += Math.min(
            5,
            matchingSkillCount * 2,
          )

          serviceScore = Math.min(
            50,
            serviceScore,
          )

          const availabilityScore =
            partner.available
              ? 20
              : 0

          const ratingScore =
            Math.round(
              (partner.rating / 5) *
                15,
            )

          const distanceNumber =
            getProviderDistance(
              partner,
            )

          const distanceScore =
            Math.max(
              0,
              Math.min(
                15,
                Math.round(
                  15 -
                    distanceNumber *
                      1.2,
                ),
              ),
            )

          const turnaroundText =
            partner.turnaround.toLowerCase()

          let turnaroundScore = 3

          if (
            turnaroundText.includes(
              'available now',
            )
          ) {
            turnaroundScore = 10
          } else if (
            turnaroundText.includes(
              'emergency',
            )
          ) {
            turnaroundScore = 10
          } else if (
            turnaroundText.includes(
              'same-day',
            )
          ) {
            turnaroundScore = 9
          } else if (
            turnaroundText.includes(
              'today',
            )
          ) {
            turnaroundScore = 9
          } else if (
            turnaroundText.includes(
              '24',
            )
          ) {
            turnaroundScore = 8
          } else if (
            turnaroundText.includes(
              '48',
            )
          ) {
            turnaroundScore = 6
          } else if (
            turnaroundText.includes(
              'scheduled',
            )
          ) {
            turnaroundScore = 5
          }

          const geoBonus =
            userCoordinates
              ? Math.max(
                  0,
                  Math.min(
                    5,
                    Math.round(
                      5 -
                        distanceNumber *
                          0.5,
                    ),
                  ),
                )
              : 0

          const registeredBonus =
            isRegisteredProvider(partner)
              ? 3
              : 0

          const rawScore =
            serviceScore +
            availabilityScore +
            ratingScore +
            distanceScore +
            turnaroundScore +
            geoBonus +
            registeredBonus

          const matchScore =
            Math.min(
              100,
              Math.round(
                (rawScore / 118) *
                  100,
              ),
            )

          return {
            partner,
            matchScore,
            distanceNumber,
          }
        })
        .sort((a, b) => {
          if (
            bookingType ===
            'emergency'
          ) {
            if (
              a.partner.available !==
              b.partner.available
            ) {
              return a.partner.available
                ? -1
                : 1
            }

            if (
              Math.abs(
                a.distanceNumber -
                  b.distanceNumber,
              ) > 0.1
            ) {
              return (
                a.distanceNumber -
                b.distanceNumber
              )
            }
          }

          if (
            a.matchScore !==
            b.matchScore
          ) {
            return (
              b.matchScore -
              a.matchScore
            )
          }

          if (
            a.partner.available !==
            b.partner.available
          ) {
            return a.partner.available
              ? -1
              : 1
          }

          if (
            a.distanceNumber !==
            b.distanceNumber
          ) {
            return (
              a.distanceNumber -
              b.distanceNumber
            )
          }

          if (
            a.partner.rating !==
            b.partner.rating
          ) {
            return (
              b.partner.rating -
              a.partner.rating
            )
          }

          return (
            b.partner.experience -
            a.partner.experience
          )
        })
        .slice(0, 3)
    }, [
      allProviders,
      service,
      serviceName,
      serviceKeywords,
      requiredSkills,
      userCoordinates,
      bookingType,
    ])

  const selectedProvider =
    selectedProviders?.[
      service.id
    ] ?? null

  const formatDistance = (
    distance: number,
  ) => {
    if (distance < 1) {
      return `${Math.round(
        distance * 1000,
      )} m away`
    }

    return `${distance.toFixed(
      1,
    )} km away`
  }

  const getLocalizedServiceName = () => {
    const serviceTranslations = {
      en: {
        laundry: 'Laundry',
        ironing: 'Ironing',
        drycleaning: 'Dry Cleaning',
        saree: 'Saree Pleating',
        shoe: 'Shoe Care',
        bag: 'Bag Care',
        'home-cleaning': 'Home Cleaning',
        plumbing: 'Plumbing',
        electrical: 'Electrical',
        carpentry: 'Carpentry',
        painting: 'Painting',
        gardening: 'Gardening',
        caregiving: 'Caregiving',
        driver: 'Driver',
      },
      ta: {
        laundry: 'சலவை',
        ironing: 'அயர்னிங்',
        drycleaning: 'டிரை கிளீனிங்',
        saree: 'சேலை மடிப்பு',
        shoe: 'காலணி பராமரிப்பு',
        bag: 'பை பராமரிப்பு',
        'home-cleaning': 'வீட்டு சுத்தம்',
        plumbing: 'குழாய் வேலை',
        electrical: 'மின்சார சேவை',
        carpentry: 'தச்சு வேலை',
        painting: 'பெயிண்டிங்',
        gardening: 'தோட்டப் பராமரிப்பு',
        caregiving: 'பராமரிப்பு சேவை',
        driver: 'ஓட்டுநர் சேவை',
      },
      hi: {
        laundry: 'लॉन्ड्री',
        ironing: 'आयरनिंग',
        drycleaning: 'ड्राई क्लीनिंग',
        saree: 'साड़ी प्लीटिंग',
        shoe: 'जूते की देखभाल',
        bag: 'बैग की देखभाल',
        'home-cleaning': 'घर की सफाई',
        plumbing: 'प्लंबिंग',
        electrical: 'इलेक्ट्रिकल सेवा',
        carpentry: 'बढ़ईगीरी',
        painting: 'पेंटिंग',
        gardening: 'बागवानी',
        caregiving: 'देखभाल सेवा',
        driver: 'ड्राइवर सेवा',
      },
    }

    return (
      serviceTranslations[
        language
      ] as Record<string, string>
    )[service.id] ?? service.name
  }

  return (
    <div className="min-h-dvh bg-background pb-32">
      <ScreenHeader
        title={getLocalizedServiceName()}
      />

      {/* SERVICE INTRO */}
      <div className="border-b border-border bg-card px-4 py-6">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-card"
            style={{
              backgroundColor:
                service.accent,
            }}
          >
            <Icon
              name={service.icon}
              className="h-7 w-7"
            />
          </div>

          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {getLocalizedServiceName()}
            </h1>

            <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          </div>
        </div>

        {/* CARE LEVEL */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {content.careLevel}
          </p>

          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-secondary p-1">
            <button
              type="button"
              onClick={() =>
                setCare(
                  service.id,
                  'standard',
                )
              }
              className={`rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                !isExpress
                  ? 'bg-foreground text-card'
                  : 'text-muted-foreground'
              }`}
            >
              {content.standard}
            </button>

            <button
              type="button"
              onClick={() =>
                setCare(
                  service.id,
                  'express',
                )
              }
              className={`rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                isExpress
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {content.express} (
              {Math.round(
                (EXPRESS_MULTIPLIER - 1) *
                  100,
              )}
              %)
            </button>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />

            <span>
              {isExpress
                ? content.expressInfo
                : content.standardInfo}
            </span>
          </div>
        </div>
      </div>

      {/* ITEMS */}
      <div className="px-4 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {content.selectItems}
        </p>

        <div className="space-y-2.5">
          {service.items.map(
            (item, index) => {
              const qty = getQty(
                service.id,
                item.id,
              )

              const price = Math.round(
                item.price *
                  (isExpress
                    ? EXPRESS_MULTIPLIER
                    : 1),
              )

              return (
                <motion.div
                  key={item.id}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.04,
                  }}
                  className={`flex items-center justify-between rounded-2xl border bg-card px-4 py-3.5 ${
                    qty > 0
                      ? 'border-primary/40'
                      : 'border-border'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {item.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {rupees(price)}{' '}
                      <span className="text-xs">
                        / {item.unit}
                      </span>
                    </p>
                  </div>

                  <QuantityStepper
                    qty={qty}
                    onAdd={() => {
                      addItem(
                        service.id,
                        item.id,
                      )

                      if (qty === 0) {
                        toast(
                          `${item.name} ${content.itemAdded}`,
                        )
                      }
                    }}
                    onRemove={() =>
                      removeItem(
                        service.id,
                        item.id,
                      )
                    }
                    onSet={(newQty) =>
                      setQty(
                        service.id,
                        item.id,
                        newQty,
                      )
                    }
                  />
                </motion.div>
              )
            },
          )}
        </div>

        <p className="mt-5 text-pretty text-center text-xs leading-relaxed text-muted-foreground">
          {content.bagMessage}
        </p>

        {/* GEO LOCATION */}
        <div className="mt-7 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              {geoState ===
              'loading' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : geoState ===
                    'success' ||
                  geoState ===
                    'demo' ? (
                <Navigation className="h-5 w-5" />
              ) : (
                <LocateFixed className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">
                    {content.smartGeo}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {geoState ===
                    'success'
                      ? content.liveDetected
                      : geoState ===
                          'demo'
                        ? content.demoActive
                        : geoState ===
                            'loading'
                          ? content.checkingLocation
                          : content.useLocation}
                  </p>
                </div>

                {geoState ===
                  'success' && (
                  <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                    {content.liveGps}
                  </span>
                )}

                {geoState ===
                  'demo' && (
                  <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                    {content.demoGeo}
                  </span>
                )}
              </div>

              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {geoMessage ||
                  content.geoDefault}
              </p>

              {geoState !==
                'loading' && (
                <button
                  type="button"
                  onClick={
                    detectLocation
                  }
                  className="mt-3 flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-[11px] font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
                >
                  <LocateFixed className="h-3.5 w-3.5" />

                  {geoState ===
                  'success'
                    ? content.refreshLocation
                    : content.detectLocation}
                </button>
              )}

              {geoState ===
                'loading' && (
                <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-primary">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />

                  <span>
                    {content.checkingGps}
                  </span>
                </div>
              )}
            </div>
          </div>

          {geoState ===
            'success' && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-card p-3 text-[10px] text-muted-foreground">
              <Navigation className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />

              <p>
                {content.liveGpsMatching}
              </p>
            </div>
          )}

          {geoState ===
            'demo' && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-card p-3 text-[10px] text-muted-foreground">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />

              <p>
                {content.demoGeoMatching}
              </p>
            </div>
          )}

          {geoState ===
            'denied' && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-card p-3 text-[10px] text-muted-foreground">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />

              <p>
                {content.optionalLocation}
              </p>
            </div>
          )}

          {geoState ===
            'error' && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-card p-3 text-[10px] text-muted-foreground">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />

              <p>
                {content.gpsError}
              </p>
            </div>
          )}
        </div>

        {/* SMART PROVIDER MATCH */}
        <div className="mt-7">
          <div className="mb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {content.smartProvider}
                </p>

                <p className="mt-1 text-[11px] text-muted-foreground">
                  {content.aiDescription}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                {content.aiGeo}
              </span>
            </div>
          </div>

          {registeredMatchingProviders.length >
            0 && (
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-success/20 bg-success/5 px-3 py-2.5 text-[10px] font-semibold text-success">
              <BadgeCheck className="h-3.5 w-3.5 shrink-0" />

              {registeredMatchingProviders.length}{' '}
              {registeredMatchingProviders.length >
              1
                ? content.verifiedProviders
                : content.verifiedProvider}{' '}
              {content.includedMatching}
            </div>
          )}

          {bookingType ===
            'emergency' && (
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-[10px] font-semibold text-primary">
              <Navigation className="h-3.5 w-3.5 shrink-0" />

              {content.emergencyBooking}
            </div>
          )}

          {recommendedProviders.length ===
          0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-5 text-center">
              <p className="text-sm font-medium text-foreground">
                {content.noProviders}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {content.moreProviders}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recommendedProviders.map(
                (
                  {
                    partner,
                    matchScore,
                    distanceNumber,
                  },
                  index,
                ) => {
                  const isBestMatch =
                    index === 0

                  const isSelected =
                    selectedProvider?.id ===
                    partner.id

                  const isRegistered =
                    isRegisteredProvider(partner)

                  const providerLocation =
                    isRegisteredProvider(partner)
                      ? {
                          latitude:
                            partner.latitude,
                          longitude:
                            partner.longitude,
                          area:
                            partner.serviceArea,
                        }
                      : PARTNER_LOCATIONS[
                          partner.id
                        ]

                  return (
                    <motion.div
                      key={partner.id}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.05,
                      }}
                      className={`relative overflow-hidden rounded-2xl border bg-card p-4 ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/20'
                          : isBestMatch
                            ? 'border-primary/50'
                            : 'border-border'
                      }`}
                    >
                      {isBestMatch && (
                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
                          <Trophy className="h-3 w-3" />

                          {bookingType ===
                          'emergency'
                            ? content.nearestMatch
                            : content.bestMatch}
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">
                          {partner.name
                            .split(' ')
                            .map(
                              (word) =>
                                word[0],
                            )
                            .slice(0, 2)
                            .join('')}
                        </div>

                        <div className="min-w-0 flex-1 pr-20">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate font-semibold text-foreground">
                              {partner.name}
                            </p>

                            {partner.verified && (
                              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                            )}
                          </div>

                          {isRegistered && (
                            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-bold text-success">
                              <BadgeCheck className="h-3 w-3" />
                              {content.registeredProvider}
                            </span>
                          )}

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current text-primary" />

                              {partner.rating}
                            </span>

                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />

                              {userCoordinates
                                ? formatDistance(
                                    distanceNumber,
                                  )
                                : partner.distance}
                            </span>

                            {userCoordinates &&
                              providerLocation && (
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                    isRegisteredProvider(partner) &&
                                    partner.locationMode ===
                                      'live'
                                      ? 'bg-success/10 text-success'
                                      : geoState ===
                                          'success'
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-secondary text-muted-foreground'
                                  }`}
                                >
                                  {isRegisteredProvider(partner) &&
                                  partner.locationMode ===
                                    'live'
                                    ? content.liveProviderGeo
                                    : geoState ===
                                        'success'
                                      ? content.liveGeo
                                      : content.demoGeoLabel}
                                </span>
                              )}
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {partner.turnaround}
                          </p>

                          {providerLocation && (
                            <p className="mt-1 text-[10px] text-muted-foreground">
                              {content.serviceArea}:{' '}
                              {
                                providerLocation.area
                              }
                            </p>
                          )}

                          {isRegistered && (
                            <p className="mt-1 text-[10px] text-muted-foreground">
                              {content.cooperative}:{' '}
                              {isRegisteredProvider(partner)
                                ? partner.cooperative
                                : ''}
                            </p>
                          )}
                        </div>

                        <div className="absolute right-3 top-12 text-right">
                          <p className="font-display text-xl font-extrabold text-primary">
                            {matchScore}%
                          </p>

                          <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {content.aiMatch}
                          </p>
                        </div>
                      </div>

                      {userCoordinates &&
                        providerLocation && (
                        <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-primary/5 px-3 py-2 text-[10px] font-semibold text-primary">
                          <Navigation className="h-3 w-3" />

                          {geoState ===
                          'success'
                            ? content.geoMatchedLive
                            : content.geoMatchedDemo}{' '}

                          {formatDistance(
                            distanceNumber,
                          )}{' '}
                          {content.fromCustomer}
                        </div>
                      )}

                      <div className="mt-3">
                        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${matchScore}%`,
                            }}
                            transition={{
                              duration: 0.7,
                              delay:
                                index *
                                0.1,
                            }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                      </div>

                      {isBestMatch && (
                        <div className="mt-4 rounded-xl bg-secondary/60 p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Trophy className="h-3.5 w-3.5" />
                            </div>

                            <p className="text-xs font-bold text-foreground">
                              {content.whyRecommended}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="rounded-lg bg-card px-2.5 py-2">
                              <p className="font-semibold text-foreground">
                                ✓ {content.service}
                              </p>

                              <p className="mt-0.5 text-muted-foreground">
                                {content.compatible}
                              </p>
                            </div>

                            <div className="rounded-lg bg-card px-2.5 py-2">
                              <p className="font-semibold text-foreground">
                                ✓ {content.availability}
                              </p>

                              <p className="mt-0.5 text-muted-foreground">
                                {partner.available
                                  ? content.availableNow
                                  : content.currentlyBusy}
                              </p>
                            </div>

                            <div className="rounded-lg bg-card px-2.5 py-2">
                              <p className="font-semibold text-foreground">
                                ⭐ {content.rating}
                              </p>

                              <p className="mt-0.5 text-muted-foreground">
                                {partner.rating}/5
                              </p>
                            </div>

                            <div className="rounded-lg bg-card px-2.5 py-2">
                              <p className="font-semibold text-foreground">
                                📍 {content.geoDistance}
                              </p>

                              <p className="mt-0.5 text-muted-foreground">
                                {userCoordinates
                                  ? formatDistance(
                                      distanceNumber,
                                    )
                                  : partner.distance}
                              </p>
                            </div>

                            <div className="col-span-2 rounded-lg bg-card px-2.5 py-2">
                              <p className="font-semibold text-foreground">
                                ⚡ {content.turnaround}
                              </p>

                              <p className="mt-0.5 text-muted-foreground">
                                {partner.turnaround}
                              </p>
                            </div>
                          </div>

                          <p className="mt-2 text-[10px] font-medium text-primary">
                            🤖 {content.recommendedBy}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <span>
                          {partner.experience}{' '}
                          {content.yearsExperience}
                        </span>

                        <span>•</span>

                        <span>
                          {partner.completedJobs}{' '}
                          {content.jobs}
                        </span>

                        <span>•</span>

                        <span>
                          {partner.serviceArea}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={
                          !partner.available
                        }
                        onClick={() => {
                          setSelectedProvider(
                            service.id,
                            partner,
                          )

                          toast(
                            `${partner.name} ${content.selectedFor} ${getLocalizedServiceName()}`,
                            'info',
                          )
                        }}
                        className={`mt-3 w-full rounded-full py-2.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-foreground text-card hover:opacity-90'
                        }`}
                      >
                        {!partner.available
                          ? content.currentlyBusyButton
                          : isSelected
                            ? content.providerSelected
                            : isBestMatch
                              ? bookingType ===
                                'emergency'
                                ? content.nearestSelect
                                : content.bestSelect
                              : content.selectProvider}
                      </button>
                    </motion.div>
                  )
                },
              )}
            </div>
          )}

          {/* SELECTED PROVIDER ACTION */}
          {selectedProvider && (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-5 rounded-2xl border-2 border-primary/30 bg-primary/5 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                  ✓
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {content.providerSelectedLabel}
                  </p>

                  <p className="truncate text-sm font-bold text-foreground">
                    {selectedProvider.name}
                  </p>

                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {content.handledBy}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigate({
                    name: 'bag',
                  })
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
              >
                {content.viewBag}

                <span className="text-base">
                  →
                </span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <BagBar />
    </div>
  )
}