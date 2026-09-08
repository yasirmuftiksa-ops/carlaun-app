'use client'

import { Logo } from '@/components/logo'
import { useLanguage } from '@/components/language-provider'
import { useStore } from '@/lib/store'

const content = {
  en: {
    description:
      'A cooperative services marketplace connecting households and communities with verified skilled workers.',
    prototype:
      'COOPERATIVE SERVICES — a demo prototype.',
    services: 'Services',
    serviceLinks: [
      'Home Cleaning',
      'Plumbing',
      'Electrical',
      'Carpentry',
      'Painting',
      'Gardening',
      'Caregiving',
      'Driver Services',
    ],
    company: 'Company',
    companyLinks: [
      'How It Works',
      'Care Partners',
      'Offers',
      'Sustainability',
    ],
    partners: 'For Partners',
    providerDashboard: 'Provider Dashboard',
    adminDashboard: 'Admin Dashboard',
    copyright:
      'Prototype for demonstration only.',
    tagline: 'Connect. Cooperate. Care.',
  },

  ta: {
    description:
      'சரிபார்க்கப்பட்ட திறமையான பணியாளர்களுடன் வீடுகள் மற்றும் சமூகங்களை இணைக்கும் கூட்டுறவு சேவை சந்தை.',
    prototype:
      'கூட்டுறவு சேவைகள் — ஒரு டெமோ முன்மாதிரி.',
    services: 'சேவைகள்',
    serviceLinks: [
      'வீட்டு சுத்தம்',
      'பிளம்பிங்',
      'எலக்ட்ரிக்கல்',
      'தச்சு வேலை',
      'பெயிண்டிங்',
      'தோட்டப் பராமரிப்பு',
      'பராமரிப்பு',
      'டிரைவர் சேவைகள்',
    ],
    company: 'நிறுவனம்',
    companyLinks: [
      'இது எப்படி செயல்படுகிறது',
      'சேவை கூட்டாளர்கள்',
      'சலுகைகள்',
      'நிலைத்தன்மை',
    ],
    partners: 'கூட்டாளர்களுக்காக',
    providerDashboard: 'சேவை வழங்குநர் டாஷ்போர்டு',
    adminDashboard: 'நிர்வாக டாஷ்போர்டு',
    copyright:
      'டெமோ பயன்பாட்டிற்கான முன்மாதிரி மட்டுமே.',
    tagline: 'இணை. ஒத்துழை. அக்கறை கொள்.',
  },

  hi: {
    description:
      'एक सहकारी सेवा मार्केटप्लेस जो घरों और समुदायों को सत्यापित कुशल श्रमिकों से जोड़ता है।',
    prototype:
      'सहकारी सेवाएं — एक डेमो प्रोटोटाइप।',
    services: 'सेवाएं',
    serviceLinks: [
      'होम क्लीनिंग',
      'प्लंबिंग',
      'इलेक्ट्रिकल',
      'कारपेंट्री',
      'पेंटिंग',
      'गार्डनिंग',
      'केयरगिविंग',
      'ड्राइवर सेवाएं',
    ],
    company: 'कंपनी',
    companyLinks: [
      'यह कैसे काम करता है',
      'सेवा भागीदार',
      'ऑफर',
      'स्थिरता',
    ],
    partners: 'पार्टनर्स के लिए',
    providerDashboard: 'प्रदाता डैशबोर्ड',
    adminDashboard: 'एडमिन डैशबोर्ड',
    copyright:
      'केवल डेमो प्रदर्शन के लिए प्रोटोटाइप।',
    tagline: 'जुड़ें। सहयोग करें। देखभाल करें।',
  },
}

export function Footer() {
  const { navigate } = useStore()
  const { language } = useLanguage()

  const text = content[language]

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="max-w-xs">
            <Logo />

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {text.description}
            </p>

            <p className="mt-3 text-xs text-muted-foreground">
              {text.prototype}
            </p>
          </div>

          {/* Services */}
          <FooterCol
            title={text.services}
            links={text.serviceLinks}
          />

          {/* Company */}
          <FooterCol
            title={text.company}
            links={text.companyLinks}
          />

          {/* Partners */}
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">
              {text.partners}
            </h4>

            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={() =>
                  navigate({ name: 'provider' })
                }
                className="text-left text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {text.providerDashboard}
              </button>

              <button
                onClick={() =>
                  navigate({ name: 'admin' })
                }
                className="text-left text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {text.adminDashboard}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NeXa Link.{' '}
            {text.copyright}
          </p>

          <p className="text-xs text-muted-foreground">
            {text.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: string[]
}) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold text-foreground">
        {title}
      </h4>

      <div className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <span
            key={link}
            className="text-sm text-muted-foreground"
          >
            {link}
          </span>
        ))}
      </div>
    </div>
  )
}