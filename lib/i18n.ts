export type Language = 'en' | 'ta' | 'hi'

export const LANGUAGE_OPTIONS: Array<{
  id: Language
  label: string
  nativeLabel: string
}> = [
  {
    id: 'en',
    label: 'English',
    nativeLabel: 'English',
  },
  {
    id: 'ta',
    label: 'Tamil',
    nativeLabel: 'தமிழ்',
  },
  {
    id: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
  },
]

export const translations = {
  en: {
    common: {
      home: 'Home',
      services: 'Services',
      orders: 'Orders',
      profile: 'Profile',
      search: 'Search',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      continue: 'Continue',
      back: 'Back',
      close: 'Close',
      submit: 'Submit',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
    },

    home: {
      title: 'Trusted services, powered by cooperation',
      subtitle:
        'Connect with verified local service providers.',
      bookService: 'Book a Service',
      findProvider: 'Find a Provider',
      popularServices: 'Popular Services',
      nearbyProviders: 'Nearby Providers',
    },

    services: {
      title: 'Services',
      laundry: 'Laundry',
      ironing: 'Ironing',
      dryCleaning: 'Dry Cleaning',
      sareePleating: 'Saree Pleating',
      shoeCare: 'Shoe Care',
      bagCare: 'Bag Care',
      homeCleaning: 'Home Cleaning',
      plumbing: 'Plumbing',
      electrical: 'Electrical',
      carpentry: 'Carpentry',
      painting: 'Painting',
      gardening: 'Gardening',
      caregiving: 'Caregiving',
      driver: 'Driver',
    },

    booking: {
      title: 'Book a Service',
      chooseProvider: 'Choose Provider',
      selectDate: 'Select Date',
      selectTime: 'Select Time',
      address: 'Service Address',
      emergency: 'Emergency Service',
      onDemand: 'On-Demand',
      scheduled: 'Scheduled',
      bookNow: 'Book Now',
    },

    provider: {
      dashboard: 'Provider Dashboard',
      overview: 'Overview',
      jobs: 'Jobs',
      earnings: 'Earnings',
      welfare: 'Welfare',
      skills: 'Skills',
      profile: 'Profile',
      online: 'You are Online',
      offline: 'You are Offline',
      todayJobs: "Today's Jobs",
      activeJobs: 'Active Jobs',
      completed: 'Completed',
      earned: 'Earned',
      workerWelfare: 'Worker Welfare',
      skillCertification: 'Skill Certification',
      verifiedSkills: 'Verified Skills',
      pendingSkills: 'Pending Skills',
      requestCertification:
        'Request Certification',
      cooperativeVerification:
        'Cooperative Verification',
    },

    welfare: {
      title: 'Worker Welfare',
      insurance: 'Accident Insurance',
      medicalSupport: 'Medical Support',
      emergencyAssistance:
        'Emergency Assistance',
      welfareFund: 'Worker Welfare Fund',
      coverage: 'Insurance Coverage',
      enrolled: 'Enrolled',
      active: 'Active',
      inactive: 'Inactive',
      contactSupport: 'Contact Support',
    },

    certification: {
      title: 'Skills & Certification',
      readiness: 'Certification Readiness',
      myCertifications:
        'My Certifications',
      skillLevel: 'Skill Level',
      certificateId: 'Certificate ID',
      verifiedBy: 'Verified By',
      verified: 'Verified',
      pending: 'Pending',
      cooperative:
        'NeXa Link Cooperative',
      customerTrust: 'Customer Trust',
      betterMatching: 'Better Job Matching',
      professionalGrowth:
        'Professional Growth',
    },

    orders: {
      title: 'My Orders',
      orderDetails: 'Order Details',
      scheduled: 'Scheduled',
      picked: 'Picked',
      processing: 'Processing',
      quality: 'Quality Check',
      outForDelivery: 'Out for Delivery',
      delivered: 'Delivered',
      trackOrder: 'Track Order',
      rateService: 'Rate Service',
    },

    admin: {
      title: 'Cooperative Admin',
      dashboard: 'Admin Dashboard',
      members: 'Members',
      verification: 'Verification',
      welfare: 'Worker Welfare',
      finance: 'Cooperative Finance',
      demand: 'Service Demand',
      workforce: 'Workforce Allocation',
      emergency: 'Emergency Dispatch',
    },
  },

  ta: {
    common: {
      home: 'முகப்பு',
      services: 'சேவைகள்',
      orders: 'ஆர்டர்கள்',
      profile: 'சுயவிவரம்',
      search: 'தேடல்',
      cancel: 'ரத்து செய்',
      confirm: 'உறுதிப்படுத்து',
      save: 'சேமி',
      continue: 'தொடரவும்',
      back: 'பின்செல்',
      close: 'மூடு',
      submit: 'சமர்ப்பி',
      loading: 'ஏற்றுகிறது...',
      success: 'வெற்றி',
      error: 'பிழை',
    },

    home: {
      title:
        'கூட்டுறவின் மூலம் நம்பகமான சேவைகள்',
      subtitle:
        'சரிபார்க்கப்பட்ட உள்ளூர் சேவை வழங்குநர்களுடன் இணைக்கவும்.',
      bookService: 'சேவையை முன்பதிவு செய்',
      findProvider:
        'சேவை வழங்குநரைக் கண்டறி',
      popularServices:
        'பிரபலமான சேவைகள்',
      nearbyProviders:
        'அருகிலுள்ள சேவை வழங்குநர்கள்',
    },

    services: {
      title: 'சேவைகள்',
      laundry: 'துணி துவைத்தல்',
      ironing: 'இஸ்திரி',
      dryCleaning: 'ட்ரை கிளீனிங்',
      sareePleating: 'சேலை மடிப்பு',
      shoeCare: 'காலணி பராமரிப்பு',
      bagCare: 'பை பராமரிப்பு',
      homeCleaning: 'வீடு சுத்தம் செய்தல்',
      plumbing: 'குழாய் வேலை',
      electrical: 'மின்சார வேலை',
      carpentry: 'தச்சு வேலை',
      painting: 'பெயிண்டிங்',
      gardening: 'தோட்ட வேலை',
      caregiving: 'பராமரிப்பு சேவை',
      driver: 'ஓட்டுநர்',
    },

    booking: {
      title: 'சேவை முன்பதிவு',
      chooseProvider:
        'சேவை வழங்குநரைத் தேர்ந்தெடுக்கவும்',
      selectDate: 'தேதியைத் தேர்ந்தெடுக்கவும்',
      selectTime: 'நேரத்தைத் தேர்ந்தெடுக்கவும்',
      address: 'சேவை முகவரி',
      emergency: 'அவசர சேவை',
      onDemand: 'தேவைக்கேற்ப',
      scheduled: 'முன்பதிவு',
      bookNow: 'இப்போது முன்பதிவு செய்',
    },

    provider: {
      dashboard: 'சேவை வழங்குநர் டாஷ்போர்டு',
      overview: 'மேலோட்டம்',
      jobs: 'வேலைகள்',
      earnings: 'வருமானம்',
      welfare: 'நலத்திட்டம்',
      skills: 'திறன்கள்',
      profile: 'சுயவிவரம்',
      online: 'நீங்கள் ஆன்லைனில் உள்ளீர்கள்',
      offline: 'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள்',
      todayJobs: 'இன்றைய வேலைகள்',
      activeJobs: 'செயலில் உள்ள வேலைகள்',
      completed: 'முடிக்கப்பட்டவை',
      earned: 'வருமானம்',
      workerWelfare: 'தொழிலாளர் நலன்',
      skillCertification:
        'திறன் சான்றிதழ்',
      verifiedSkills:
        'சரிபார்க்கப்பட்ட திறன்கள்',
      pendingSkills:
        'சரிபார்ப்பில் உள்ள திறன்கள்',
      requestCertification:
        'சான்றிதழ் கோரிக்கை',
      cooperativeVerification:
        'கூட்டுறவு சரிபார்ப்பு',
    },

    welfare: {
      title: 'தொழிலாளர் நலன்',
      insurance: 'விபத்து காப்பீடு',
      medicalSupport: 'மருத்துவ உதவி',
      emergencyAssistance:
        'அவசர உதவி',
      welfareFund: 'தொழிலாளர் நல நிதி',
      coverage: 'காப்பீட்டு பாதுகாப்பு',
      enrolled: 'சேர்ந்துள்ளார்',
      active: 'செயலில் உள்ளது',
      inactive: 'செயலில் இல்லை',
      contactSupport: 'ஆதரவைத் தொடர்புகொள்',
    },

    certification: {
      title: 'திறன்கள் மற்றும் சான்றிதழ்',
      readiness: 'சான்றிதழ் தயார்நிலை',
      myCertifications:
        'எனது சான்றிதழ்கள்',
      skillLevel: 'திறன் நிலை',
      certificateId: 'சான்றிதழ் எண்',
      verifiedBy: 'சரிபார்த்தவர்',
      verified: 'சரிபார்க்கப்பட்டது',
      pending: 'நிலுவையில்',
      cooperative:
        'NeXa Link கூட்டுறவு',
      customerTrust:
        'வாடிக்கையாளர் நம்பிக்கை',
      betterMatching:
        'சிறந்த வேலை பொருத்தம்',
      professionalGrowth:
        'தொழில்முறை வளர்ச்சி',
    },

    orders: {
      title: 'எனது ஆர்டர்கள்',
      orderDetails: 'ஆர்டர் விவரங்கள்',
      scheduled: 'திட்டமிடப்பட்டது',
      picked: 'எடுத்துச் செல்லப்பட்டது',
      processing: 'செயலாக்கத்தில்',
      quality: 'தரச் சரிபார்ப்பு',
      outForDelivery:
        'வழங்குவதற்காக அனுப்பப்பட்டது',
      delivered: 'வழங்கப்பட்டது',
      trackOrder: 'ஆர்டரைக் கண்காணி',
      rateService: 'சேவையை மதிப்பிடு',
    },

    admin: {
      title: 'கூட்டுறவு நிர்வாகம்',
      dashboard: 'நிர்வாக டாஷ்போர்டு',
      members: 'உறுப்பினர்கள்',
      verification: 'சரிபார்ப்பு',
      welfare: 'தொழிலாளர் நலன்',
      finance: 'கூட்டுறவு நிதி',
      demand: 'சேவை தேவை',
      workforce: 'பணியாளர் ஒதுக்கீடு',
      emergency: 'அவசர பணியாளர் அனுப்புதல்',
    },
  },

  hi: {
    common: {
      home: 'होम',
      services: 'सेवाएँ',
      orders: 'ऑर्डर',
      profile: 'प्रोफ़ाइल',
      search: 'खोजें',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      save: 'सहेजें',
      continue: 'जारी रखें',
      back: 'वापस',
      close: 'बंद करें',
      submit: 'जमा करें',
      loading: 'लोड हो रहा है...',
      success: 'सफलता',
      error: 'त्रुटि',
    },

    home: {
      title:
        'सहकारिता से संचालित भरोसेमंद सेवाएँ',
      subtitle:
        'सत्यापित स्थानीय सेवा प्रदाताओं से जुड़ें।',
      bookService: 'सेवा बुक करें',
      findProvider:
        'सेवा प्रदाता खोजें',
      popularServices:
        'लोकप्रिय सेवाएँ',
      nearbyProviders:
        'पास के सेवा प्रदाता',
    },

    services: {
      title: 'सेवाएँ',
      laundry: 'कपड़े धोना',
      ironing: 'इस्त्री',
      dryCleaning: 'ड्राई क्लीनिंग',
      sareePleating: 'साड़ी प्लीटिंग',
      shoeCare: 'जूते की देखभाल',
      bagCare: 'बैग की देखभाल',
      homeCleaning: 'घर की सफाई',
      plumbing: 'प्लंबिंग',
      electrical: 'इलेक्ट्रिकल',
      carpentry: 'बढ़ई का काम',
      painting: 'पेंटिंग',
      gardening: 'बागवानी',
      caregiving: 'देखभाल सेवा',
      driver: 'ड्राइवर',
    },

    booking: {
      title: 'सेवा बुक करें',
      chooseProvider:
        'सेवा प्रदाता चुनें',
      selectDate: 'तारीख चुनें',
      selectTime: 'समय चुनें',
      address: 'सेवा का पता',
      emergency: 'आपातकालीन सेवा',
      onDemand: 'ऑन-डिमांड',
      scheduled: 'शेड्यूल किया गया',
      bookNow: 'अभी बुक करें',
    },

    provider: {
      dashboard: 'सेवा प्रदाता डैशबोर्ड',
      overview: 'अवलोकन',
      jobs: 'काम',
      earnings: 'कमाई',
      welfare: 'कल्याण',
      skills: 'कौशल',
      profile: 'प्रोफ़ाइल',
      online: 'आप ऑनलाइन हैं',
      offline: 'आप ऑफलाइन हैं',
      todayJobs: 'आज के काम',
      activeJobs: 'सक्रिय काम',
      completed: 'पूरा किया गया',
      earned: 'कमाई',
      workerWelfare: 'श्रमिक कल्याण',
      skillCertification:
        'कौशल प्रमाणन',
      verifiedSkills:
        'सत्यापित कौशल',
      pendingSkills:
        'लंबित कौशल',
      requestCertification:
        'प्रमाणन का अनुरोध करें',
      cooperativeVerification:
        'सहकारी सत्यापन',
    },

    welfare: {
      title: 'श्रमिक कल्याण',
      insurance: 'दुर्घटना बीमा',
      medicalSupport: 'चिकित्सा सहायता',
      emergencyAssistance:
        'आपातकालीन सहायता',
      welfareFund: 'श्रमिक कल्याण निधि',
      coverage: 'बीमा कवरेज',
      enrolled: 'नामांकित',
      active: 'सक्रिय',
      inactive: 'निष्क्रिय',
      contactSupport: 'सहायता से संपर्क करें',
    },

    certification: {
      title: 'कौशल और प्रमाणन',
      readiness: 'प्रमाणन तैयारी',
      myCertifications:
        'मेरे प्रमाणपत्र',
      skillLevel: 'कौशल स्तर',
      certificateId: 'प्रमाणपत्र आईडी',
      verifiedBy: 'सत्यापित द्वारा',
      verified: 'सत्यापित',
      pending: 'लंबित',
      cooperative:
        'NeXa Link सहकारी संस्था',
      customerTrust:
        'ग्राहक का विश्वास',
      betterMatching:
        'बेहतर काम मिलान',
      professionalGrowth:
        'व्यावसायिक विकास',
    },

    orders: {
      title: 'मेरे ऑर्डर',
      orderDetails: 'ऑर्डर विवरण',
      scheduled: 'शेड्यूल किया गया',
      picked: 'पिकअप किया गया',
      processing: 'प्रोसेसिंग',
      quality: 'गुणवत्ता जांच',
      outForDelivery:
        'डिलीवरी के लिए भेजा गया',
      delivered: 'डिलीवर किया गया',
      trackOrder: 'ऑर्डर ट्रैक करें',
      rateService: 'सेवा को रेट करें',
    },

    admin: {
      title: 'सहकारी प्रशासन',
      dashboard: 'एडमिन डैशबोर्ड',
      members: 'सदस्य',
      verification: 'सत्यापन',
      welfare: 'श्रमिक कल्याण',
      finance: 'सहकारी वित्त',
      demand: 'सेवा मांग',
      workforce: 'कार्यबल आवंटन',
      emergency: 'आपातकालीन डिस्पैच',
    },
  },
} as const

export type TranslationDictionary =
  typeof translations.en

export function getTranslation(
  language: Language,
) {
  return translations[language]
}

export function getSavedLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const saved =
    localStorage.getItem(
      'nexa_link_language',
    )

  if (
    saved === 'en' ||
    saved === 'ta' ||
    saved === 'hi'
  ) {
    return saved
  }

  return 'en'
}

export function saveLanguage(
  language: Language,
) {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(
    'nexa_link_language',
    language,
  )
}