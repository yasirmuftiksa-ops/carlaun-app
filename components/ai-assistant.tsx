'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Send,
  Sparkles,
  Shirt,
  Clock,
  MapPin,
  Star,
  X,
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Leaf,
  Heart,
  Car,
  Home,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

type Recommendation = {
  title: string
  description: string
  service: string
  provider: string
  rating: string
  distance: string
  turnaround: string
  icon: 'home' | 'wrench' | 'zap' | 'hammer' | 'paint' | 'leaf' | 'heart' | 'car' | 'shirt'
}

type LanguageContent = {
  assistant: string
  subtitle: string
  close: string
  question: string
  intro: string
  tryAsking: string
  prompts: string[]
  placeholder: string
  askAI: string
  analysing: string
  recommendation: string
  provider: string
  why: string
  reasoning: string
  continue: string
  serviceLabel: string
  ratingLabel: string
  distanceLabel: string
  turnaroundLabel: string
}

const recommendations: Recommendation[] = [
  {
    title: 'Home Cleaning Service',
    description:
      'Professional cooperative workers for home cleaning, deep cleaning and regular household cleaning.',
    service: 'Home Cleaning',
    provider: 'SparkHome Cooperative',
    rating: '4.8',
    distance: '1.2 km',
    turnaround: 'Same-day',
    icon: 'home',
  },
  {
    title: 'Plumbing Service',
    description:
      'Skilled cooperative plumbers for pipe repairs, leakage, taps, drainage and other plumbing work.',
    service: 'Plumbing',
    provider: 'AquaFix Cooperative',
    rating: '4.9',
    distance: '1.5 km',
    turnaround: 'Same-day',
    icon: 'wrench',
  },
  {
    title: 'Electrical Service',
    description:
      'Verified electricians for wiring, switches, lights, electrical repairs and household installations.',
    service: 'Electrical',
    provider: 'PowerCare Cooperative',
    rating: '4.9',
    distance: '1.8 km',
    turnaround: 'Same-day',
    icon: 'zap',
  },
  {
    title: 'Carpentry Service',
    description:
      'Skilled carpenters for furniture repair, woodwork, doors, shelves and household carpentry.',
    service: 'Carpentry',
    provider: 'WoodCraft Cooperative',
    rating: '4.7',
    distance: '2.1 km',
    turnaround: '1–2 days',
    icon: 'hammer',
  },
  {
    title: 'Painting Service',
    description:
      'Professional cooperative painters for rooms, walls, touch-ups and home painting projects.',
    service: 'Painting',
    provider: 'ColorCraft Cooperative',
    rating: '4.8',
    distance: '2.4 km',
    turnaround: '1–2 days',
    icon: 'paint',
  },
  {
    title: 'Gardening Service',
    description:
      'Local cooperative gardeners for garden maintenance, plants, trimming and outdoor care.',
    service: 'Gardening',
    provider: 'GreenCare Cooperative',
    rating: '4.8',
    distance: '1.9 km',
    turnaround: 'Same-day',
    icon: 'leaf',
  },
  {
    title: 'Caregiving Service',
    description:
      'Verified caregivers for elderly support, daily assistance and household care requirements.',
    service: 'Caregiving',
    provider: 'CareCircle Cooperative',
    rating: '4.9',
    distance: '2.0 km',
    turnaround: 'Same-day',
    icon: 'heart',
  },
  {
    title: 'Driver Service',
    description:
      'Verified cooperative drivers for local travel, scheduled driving and on-demand requirements.',
    service: 'Driver',
    provider: 'CityRide Cooperative',
    rating: '4.8',
    distance: '1.6 km',
    turnaround: 'Within 30 min',
    icon: 'car',
  },
  {
    title: 'Laundry Service',
    description:
      'Reliable garment care for everyday clothes, including washing, drying and professional handling.',
    service: 'Laundry',
    provider: 'FreshCare Cooperative',
    rating: '4.8',
    distance: '1.2 km',
    turnaround: '24–48 hrs',
    icon: 'shirt',
  },
]

const content: Record<'en' | 'ta' | 'hi', LanguageContent> = {
  en: {
    assistant: 'NeXa Link AI',
    subtitle: 'Your cooperative services assistant',
    close: 'Close AI assistant',
    question: 'How can I help you?',
    intro:
      'Tell me what service you need, your location, urgency or any special requirement. I will recommend a suitable NeXa Link cooperative service and provider.',
    tryAsking: 'Try asking',
    prompts: [
      'I need a plumber for a water leak',
      'I need someone to clean my house',
      'I need an electrician today',
      'I need a driver urgently',
    ],
    placeholder: 'e.g. I need a plumber for a leaking tap...',
    askAI: 'Ask NeXa Link AI',
    analysing: 'NeXa Link AI is analysing your service request...',
    recommendation: 'AI Recommendation',
    provider: 'Recommended Provider',
    why: 'Why this recommendation?',
    reasoning:
      'NeXa Link analysed your request and matched the required service, urgency and provider performance to find a suitable cooperative service.',
    continue: 'Continue with Recommendation',
    serviceLabel: 'Service',
    ratingLabel: 'Rating',
    distanceLabel: 'Distance',
    turnaroundLabel: 'Availability',
  },

  ta: {
    assistant: 'NeXa Link AI',
    subtitle: 'உங்கள் கூட்டுறவு சேவை உதவியாளர்',
    close: 'AI உதவியாளரை மூடு',
    question: 'நான் உங்களுக்கு எப்படி உதவலாம்?',
    intro:
      'உங்களுக்கு தேவையான சேவை, இருப்பிடம், அவசரம் அல்லது சிறப்பு தேவையைப் பற்றி சொல்லுங்கள். பொருத்தமான NeXa Link கூட்டுறவு சேவை மற்றும் சேவை வழங்குநரை நான் பரிந்துரைக்கிறேன்.',
    tryAsking: 'இதை கேட்டு முயற்சிக்கவும்',
    prompts: [
      'தண்ணீர் கசிவுக்கு பிளம்பர் வேண்டும்',
      'என் வீட்டை சுத்தம் செய்ய ஒருவர் வேண்டும்',
      'இன்று எலக்ட்ரீஷியன் வேண்டும்',
      'அவசரமாக டிரைவர் வேண்டும்',
    ],
    placeholder: 'உதாரணம்: கசியும் குழாய்க்கு பிளம்பர் வேண்டும்...',
    askAI: 'NeXa Link AI-யிடம் கேளுங்கள்',
    analysing: 'NeXa Link AI உங்கள் சேவை கோரிக்கையை ஆய்வு செய்கிறது...',
    recommendation: 'AI பரிந்துரை',
    provider: 'பரிந்துரைக்கப்பட்ட சேவை வழங்குநர்',
    why: 'இந்த பரிந்துரை ஏன்?',
    reasoning:
      'NeXa Link உங்கள் கோரிக்கையை ஆய்வு செய்து, தேவையான சேவை, அவசரம் மற்றும் சேவை வழங்குநரின் செயல்திறனை பொருத்தி பொருத்தமான கூட்டுறவு சேவையை கண்டறிந்தது.',
    continue: 'பரிந்துரையுடன் தொடரவும்',
    serviceLabel: 'சேவை',
    ratingLabel: 'மதிப்பீடு',
    distanceLabel: 'தூரம்',
    turnaroundLabel: 'கிடைக்கும் நேரம்',
  },

  hi: {
    assistant: 'NeXa Link AI',
    subtitle: 'आपका सहकारी सेवा सहायक',
    close: 'AI सहायक बंद करें',
    question: 'मैं आपकी कैसे मदद कर सकता हूँ?',
    intro:
      'आपको कौन सी सेवा चाहिए, आपका स्थान, आवश्यकता की जल्दी या कोई विशेष जरूरत बताएं। मैं आपके लिए उपयुक्त NeXa Link सहकारी सेवा और प्रदाता की सिफारिश करूंगा।',
    tryAsking: 'यह पूछकर देखें',
    prompts: [
      'मुझे पानी के रिसाव के लिए प्लंबर चाहिए',
      'मुझे घर साफ करने के लिए कोई चाहिए',
      'मुझे आज इलेक्ट्रीशियन चाहिए',
      'मुझे तुरंत ड्राइवर चाहिए',
    ],
    placeholder: 'उदाहरण: मुझे नल के रिसाव के लिए प्लंबर चाहिए...',
    askAI: 'NeXa Link AI से पूछें',
    analysing: 'NeXa Link AI आपकी सेवा अनुरोध का विश्लेषण कर रहा है...',
    recommendation: 'AI सिफारिश',
    provider: 'अनुशंसित सेवा प्रदाता',
    why: 'यह सिफारिश क्यों?',
    reasoning:
      'NeXa Link ने आपके अनुरोध का विश्लेषण किया और आवश्यक सेवा, आवश्यकता की जल्दी तथा प्रदाता के प्रदर्शन का मिलान करके उपयुक्त सहकारी सेवा खोजी।',
    continue: 'सिफारिश के साथ जारी रखें',
    serviceLabel: 'सेवा',
    ratingLabel: 'रेटिंग',
    distanceLabel: 'दूरी',
    turnaroundLabel: 'उपलब्धता',
  },
}

const recommendationTranslations: Record<
  'en' | 'ta' | 'hi',
  Array<{
    title: string
    description: string
    service: string
    provider: string
    turnaround: string
  }>
> = {
  en: recommendations.map((item) => ({
    title: item.title,
    description: item.description,
    service: item.service,
    provider: item.provider,
    turnaround: item.turnaround,
  })),

  ta: [
    {
      title: 'வீட்டு சுத்தம் சேவை',
      description:
        'வீட்டு சுத்தம், ஆழமான சுத்தம் மற்றும் வழக்கமான வீட்டு பராமரிப்புக்கான கூட்டுறவு சேவை.',
      service: 'வீட்டு சுத்தம்',
      provider: 'SparkHome Cooperative',
      turnaround: 'அதே நாள்',
    },
    {
      title: 'பிளம்பிங் சேவை',
      description:
        'குழாய் பழுது, தண்ணீர் கசிவு, குழாய்கள் மற்றும் வடிகால் பணிகளுக்கான திறமையான கூட்டுறவு பிளம்பர்கள்.',
      service: 'பிளம்பிங்',
      provider: 'AquaFix Cooperative',
      turnaround: 'அதே நாள்',
    },
    {
      title: 'எலக்ட்ரிக்கல் சேவை',
      description:
        'வயரிங், சுவிட்ச், விளக்குகள் மற்றும் மின்சார பழுதுபார்ப்புக்கான சரிபார்க்கப்பட்ட எலக்ட்ரீஷியன்கள்.',
      service: 'எலக்ட்ரிக்கல்',
      provider: 'PowerCare Cooperative',
      turnaround: 'அதே நாள்',
    },
    {
      title: 'தச்சு வேலை சேவை',
      description:
        'மரச்சாமான்கள், கதவுகள், அலமாரிகள் மற்றும் வீட்டு மரப்பணிகளுக்கான திறமையான தச்சர்கள்.',
      service: 'தச்சு வேலை',
      provider: 'WoodCraft Cooperative',
      turnaround: '1–2 நாட்கள்',
    },
    {
      title: 'பெயிண்டிங் சேவை',
      description:
        'சுவர், அறைகள், டச்-அப் மற்றும் வீட்டு பெயிண்டிங் பணிகளுக்கான தொழில்முறை கூட்டுறவு சேவை.',
      service: 'பெயிண்டிங்',
      provider: 'ColorCraft Cooperative',
      turnaround: '1–2 நாட்கள்',
    },
    {
      title: 'தோட்டப் பராமரிப்பு சேவை',
      description:
        'தோட்ட பராமரிப்பு, செடிகள், கிளை வெட்டுதல் மற்றும் வெளிப்புற பராமரிப்புக்கான உள்ளூர் கூட்டுறவு தோட்டக்காரர்கள்.',
      service: 'தோட்டப் பராமரிப்பு',
      provider: 'GreenCare Cooperative',
      turnaround: 'அதே நாள்',
    },
    {
      title: 'பராமரிப்பு சேவை',
      description:
        'முதியோர் உதவி, தினசரி ஆதரவு மற்றும் வீட்டு பராமரிப்புக்கான சரிபார்க்கப்பட்ட பராமரிப்பாளர்கள்.',
      service: 'பராமரிப்பு',
      provider: 'CareCircle Cooperative',
      turnaround: 'அதே நாள்',
    },
    {
      title: 'டிரைவர் சேவை',
      description:
        'உள்ளூர் பயணம், திட்டமிட்ட ஓட்டுநர் சேவை மற்றும் அவசர தேவைகளுக்கான சரிபார்க்கப்பட்ட கூட்டுறவு டிரைவர்கள்.',
      service: 'டிரைவர்',
      provider: 'CityRide Cooperative',
      turnaround: '30 நிமிடங்களுக்குள்',
    },
    {
      title: 'சலவை சேவை',
      description:
        'தினசரி ஆடைகளுக்கான நம்பகமான சலவை மற்றும் ஆடை பராமரிப்பு சேவை.',
      service: 'சலவை',
      provider: 'FreshCare Cooperative',
      turnaround: '24–48 மணி',
    },
  ],

  hi: [
    {
      title: 'होम क्लीनिंग सेवा',
      description:
        'घर की सफाई, डीप क्लीनिंग और नियमित घरेलू सफाई के लिए सहकारी सेवा।',
      service: 'होम क्लीनिंग',
      provider: 'SparkHome Cooperative',
      turnaround: 'उसी दिन',
    },
    {
      title: 'प्लंबिंग सेवा',
      description:
        'पाइप की मरम्मत, पानी का रिसाव, नल और ड्रेनेज कार्य के लिए कुशल सहकारी प्लंबर।',
      service: 'प्लंबिंग',
      provider: 'AquaFix Cooperative',
      turnaround: 'उसी दिन',
    },
    {
      title: 'इलेक्ट्रिकल सेवा',
      description:
        'वायरिंग, स्विच, लाइट और बिजली की मरम्मत के लिए सत्यापित इलेक्ट्रीशियन।',
      service: 'इलेक्ट्रिकल',
      provider: 'PowerCare Cooperative',
      turnaround: 'उसी दिन',
    },
    {
      title: 'कारपेंट्री सेवा',
      description:
        'फर्नीचर, दरवाजे, शेल्फ और घरेलू लकड़ी के काम के लिए कुशल सहकारी बढ़ई।',
      service: 'कारपेंट्री',
      provider: 'WoodCraft Cooperative',
      turnaround: '1–2 दिन',
    },
    {
      title: 'पेंटिंग सेवा',
      description:
        'कमरे, दीवार, टच-अप और घर की पेंटिंग के लिए पेशेवर सहकारी सेवा।',
      service: 'पेंटिंग',
      provider: 'ColorCraft Cooperative',
      turnaround: '1–2 दिन',
    },
    {
      title: 'गार्डनिंग सेवा',
      description:
        'बगीचे की देखभाल, पौधों, कटाई और बाहरी रखरखाव के लिए स्थानीय सहकारी माली।',
      service: 'गार्डनिंग',
      provider: 'GreenCare Cooperative',
      turnaround: 'उसी दिन',
    },
    {
      title: 'केयरगिविंग सेवा',
      description:
        'बुजुर्गों की सहायता, दैनिक सहयोग और घरेलू देखभाल के लिए सत्यापित केयरगिवर।',
      service: 'केयरगिविंग',
      provider: 'CareCircle Cooperative',
      turnaround: 'उसी दिन',
    },
    {
      title: 'ड्राइवर सेवा',
      description:
        'स्थानीय यात्रा, निर्धारित ड्राइविंग और तत्काल आवश्यकताओं के लिए सत्यापित सहकारी ड्राइवर।',
      service: 'ड्राइवर',
      provider: 'CityRide Cooperative',
      turnaround: '30 मिनट के भीतर',
    },
    {
      title: 'लॉन्ड्री सेवा',
      description:
        'रोज़मर्रा के कपड़ों के लिए भरोसेमंद लॉन्ड्री और गारमेंट केयर सेवा।',
      service: 'लॉन्ड्री',
      provider: 'FreshCare Cooperative',
      turnaround: '24–48 घंटे',
    },
  ],
}

function RecommendationIcon({
  icon,
}: {
  icon: Recommendation['icon']
}) {
  if (icon === 'home') {
    return <Home className="h-5 w-5" />
  }

  if (icon === 'wrench') {
    return <Wrench className="h-5 w-5" />
  }

  if (icon === 'zap') {
    return <Zap className="h-5 w-5" />
  }

  if (icon === 'hammer') {
    return <Hammer className="h-5 w-5" />
  }

  if (icon === 'paint') {
    return <Paintbrush className="h-5 w-5" />
  }

  if (icon === 'leaf') {
    return <Leaf className="h-5 w-5" />
  }

  if (icon === 'heart') {
    return <Heart className="h-5 w-5" />
  }

  if (icon === 'car') {
    return <Car className="h-5 w-5" />
  }

  return <Shirt className="h-5 w-5" />
}

export function AIAssistant() {
  const { language } = useLanguage()

  const text = content[language]
  const translatedRecommendations =
    recommendationTranslations[language]

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] =
    useState<Recommendation | null>(null)

  const askAI = () => {
    if (!message.trim()) return

    setLoading(true)
    setRecommendation(null)

    setTimeout(() => {
      const requestText = message.toLowerCase()

      let resultIndex = 0

      /*
       * Home cleaning
       */
      if (
        requestText.includes('clean') ||
        requestText.includes('cleaning') ||
        requestText.includes('house') ||
        requestText.includes('home') ||
        requestText.includes('சுத்தம்') ||
        requestText.includes('வீடு') ||
        requestText.includes('सफाई') ||
        requestText.includes('घर')
      ) {
        resultIndex = 0
      }

      /*
       * Plumbing
       */
      else if (
        requestText.includes('plumb') ||
        requestText.includes('pipe') ||
        requestText.includes('leak') ||
        requestText.includes('tap') ||
        requestText.includes('water') ||
        requestText.includes('குழாய்') ||
        requestText.includes('கசிவு') ||
        requestText.includes('தண்ணீர்') ||
        requestText.includes('பிளம்பர்') ||
        requestText.includes('प्लंबर') ||
        requestText.includes('पाइप') ||
        requestText.includes('रिसाव') ||
        requestText.includes('पानी') ||
        requestText.includes('नल')
      ) {
        resultIndex = 1
      }

      /*
       * Electrical
       */
      else if (
        requestText.includes('electric') ||
        requestText.includes('electrician') ||
        requestText.includes('wiring') ||
        requestText.includes('switch') ||
        requestText.includes('light') ||
        requestText.includes('current') ||
        requestText.includes('மின்சாரம்') ||
        requestText.includes('எலக்ட்ரீஷியன்') ||
        requestText.includes('வயரிங்') ||
        requestText.includes('சுவிட்ச்') ||
        requestText.includes('मिस्त्री') ||
        requestText.includes('इलेक्ट्रीशियन') ||
        requestText.includes('बिजली') ||
        requestText.includes('वायरिंग') ||
        requestText.includes('स्विच')
      ) {
        resultIndex = 2
      }

      /*
       * Carpentry
       */
      else if (
        requestText.includes('carpenter') ||
        requestText.includes('carpentry') ||
        requestText.includes('furniture') ||
        requestText.includes('wood') ||
        requestText.includes('door') ||
        requestText.includes('தச்சு') ||
        requestText.includes('மரப்பணி') ||
        requestText.includes('மரச்சாமான்கள்') ||
        requestText.includes('கதவு') ||
        requestText.includes('बढ़ई') ||
        requestText.includes('लकड़ी') ||
        requestText.includes('फर्नीचर') ||
        requestText.includes('दरवाजा')
      ) {
        resultIndex = 3
      }

      /*
       * Painting
       */
      else if (
        requestText.includes('paint') ||
        requestText.includes('painting') ||
        requestText.includes('wall') ||
        requestText.includes('colour') ||
        requestText.includes('color') ||
        requestText.includes('பெயிண்ட்') ||
        requestText.includes('சுவர்') ||
        requestText.includes('வண்ணம்') ||
        requestText.includes('पेंट') ||
        requestText.includes('दीवार') ||
        requestText.includes('रंग')
      ) {
        resultIndex = 4
      }

      /*
       * Gardening
       */
      else if (
        requestText.includes('garden') ||
        requestText.includes('gardening') ||
        requestText.includes('plant') ||
        requestText.includes('plants') ||
        requestText.includes('தோட்டம்') ||
        requestText.includes('செடி') ||
        requestText.includes('தோட்டப்') ||
        requestText.includes('बगीचा') ||
        requestText.includes('पौधा') ||
        requestText.includes('गार्डन')
      ) {
        resultIndex = 5
      }

      /*
       * Caregiving
       */
      else if (
        requestText.includes('caregiver') ||
        requestText.includes('caregiving') ||
        requestText.includes('elderly') ||
        requestText.includes('old') ||
        requestText.includes('senior') ||
        requestText.includes('patient') ||
        requestText.includes('முதியோர்') ||
        requestText.includes('பராமரிப்பு') ||
        requestText.includes('நோயாளி') ||
        requestText.includes('देखभाल') ||
        requestText.includes('बुजुर्ग') ||
        requestText.includes('मरीज')
      ) {
        resultIndex = 6
      }

      /*
       * Driver
       */
      else if (
        requestText.includes('driver') ||
        requestText.includes('driving') ||
        requestText.includes('car') ||
        requestText.includes('ride') ||
        requestText.includes('டிரைவர்') ||
        requestText.includes('ஓட்டுநர்') ||
        requestText.includes('பயணம்') ||
        requestText.includes('ड्राइवर') ||
        requestText.includes('गाड़ी') ||
        requestText.includes('यात्रा')
      ) {
        resultIndex = 7
      }

      /*
       * Laundry / garment care
       */
      else if (
        requestText.includes('laundry') ||
        requestText.includes('clothes') ||
        requestText.includes('shirt') ||
        requestText.includes('trouser') ||
        requestText.includes('dress') ||
        requestText.includes('wash') ||
        requestText.includes('dry clean') ||
        requestText.includes('iron') ||
        requestText.includes('சலவை') ||
        requestText.includes('ஆடைகள்') ||
        requestText.includes('துணி') ||
        requestText.includes('சுத்தம் செய்ய') ||
        requestText.includes('லாண்ட்ரி') ||
        requestText.includes('कपड़े') ||
        requestText.includes('लॉन्ड्री') ||
        requestText.includes('धुलाई') ||
        requestText.includes('इस्त्री')
      ) {
        resultIndex = 8
      }

      /*
       * Urgent requests can still use the most
       * relevant service category detected above.
       */
      const urgent =
        requestText.includes('urgent') ||
        requestText.includes('emergency') ||
        requestText.includes('today') ||
        requestText.includes('immediately') ||
        requestText.includes('now') ||
        requestText.includes('அவசரம்') ||
        requestText.includes('அவசர') ||
        requestText.includes('இன்று') ||
        requestText.includes('உடனே') ||
        requestText.includes('அவசரமாக') ||
        requestText.includes('तुरंत') ||
        requestText.includes('आपातकाल') ||
        requestText.includes('आज') ||
        requestText.includes('अभी')

      const baseRecommendation = recommendations[resultIndex]
      const translatedRecommendation =
        translatedRecommendations[resultIndex]

      setRecommendation({
        ...baseRecommendation,
        title: translatedRecommendation.title,
        description: translatedRecommendation.description,
        service: translatedRecommendation.service,
        provider: translatedRecommendation.provider,
        turnaround: urgent
          ? language === 'ta'
            ? 'அவசர சேவை கிடைக்கும்'
            : language === 'hi'
              ? 'आपातकालीन सेवा उपलब्ध'
              : 'Priority service available'
          : translatedRecommendation.turnaround,
      })

      setLoading(false)
    }, 900)
  }

  return (
    <>
      {/* Floating AI button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.04 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-28 right-4 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg"
      >
        <Sparkles className="h-4 w-4" />
        {text.assistant}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
            />

            {/* Assistant panel */}
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 40,
                scale: 0.97,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 28,
              }}
              className="fixed inset-x-3 bottom-24 z-50 mx-auto max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-display text-sm font-bold text-foreground">
                      {text.assistant}
                    </p>

                    <p className="text-[11px] text-muted-foreground">
                      {text.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-secondary"
                  aria-label={text.close}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[65vh] overflow-y-auto px-4 py-4">
                {/* Welcome message */}
                <div className="rounded-2xl bg-secondary/60 p-4">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {text.question}
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {text.intro}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick prompts */}
                <div className="mt-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    {text.tryAsking}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {text.prompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setMessage(prompt)}
                        className="rounded-full border border-border px-3 py-2 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="mt-4 flex gap-2">
                  <input
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        askAI()
                      }
                    }}
                    placeholder={text.placeholder}
                    className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3.5 py-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  />

                  <button
                    onClick={askAI}
                    disabled={!message.trim() || loading}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40"
                    aria-label={text.askAI}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>

                {/* Loading */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-2 rounded-2xl bg-secondary/60 p-4"
                  >
                    <Sparkles className="h-4 w-4 animate-pulse text-primary" />

                    <p className="text-xs font-medium text-muted-foreground">
                      {text.analysing}
                    </p>
                  </motion.div>
                )}

                {/* Recommendation */}
                {recommendation && !loading && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mt-4 overflow-hidden rounded-2xl border border-primary/40 bg-primary/5"
                  >
                    <div className="border-b border-primary/20 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />

                        <p className="text-xs font-bold uppercase tracking-wide text-primary">
                          {text.recommendation}
                        </p>
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Service recommendation */}
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                          <RecommendationIcon
                            icon={recommendation.icon}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="font-display text-base font-bold text-foreground">
                            {recommendation.title}
                          </p>

                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {recommendation.description}
                          </p>
                        </div>
                      </div>

                      {/* Service details */}
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-card p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                            {text.serviceLabel}
                          </p>

                          <p className="mt-1 text-xs font-bold text-foreground">
                            {recommendation.service}
                          </p>
                        </div>

                        <div className="rounded-xl bg-card p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                            {text.ratingLabel}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs font-bold text-foreground">
                            <Star className="h-3 w-3 fill-current text-primary" />
                            {recommendation.rating}
                          </p>
                        </div>
                      </div>

                      {/* Provider */}
                      <div className="mt-3 rounded-xl bg-card p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          {text.provider}
                        </p>

                        <p className="mt-1 text-sm font-bold text-foreground">
                          {recommendation.provider}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {recommendation.distance}
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {recommendation.turnaround}
                          </span>
                        </div>
                      </div>

                      {/* AI reasoning */}
                      <div className="mt-3 rounded-xl bg-secondary/60 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          {text.why}
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-foreground">
                          {text.reasoning}
                        </p>
                      </div>

                      <button
                        onClick={() => setOpen(false)}
                        className="mt-3 w-full rounded-full bg-primary py-3 text-xs font-bold text-primary-foreground"
                      >
                        {text.continue}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}