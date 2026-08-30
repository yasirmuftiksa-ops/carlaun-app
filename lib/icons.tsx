import {
  Banknote,
  Briefcase,
  Building2,
  CreditCard,
  Footprints,
  House,
  Layers,
  Smartphone,
  Sparkles,
  Wallet,
  WashingMachine,
  Wind,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  WashingMachine,
  Sparkles,
  Wind,
  Layers,
  Footprints,
  Briefcase,
  Home: House,
  House,
  Building2,
  Smartphone,
  CreditCard,
  Banknote,
  Wallet,
}

export function Icon({
  name,
  className,
  size,
  strokeWidth,
}: {
  name: string
  className?: string
  size?: number
  strokeWidth?: number
}) {
  const Cmp = ICONS[name] ?? Sparkles
  return <Cmp className={className} size={size} strokeWidth={strokeWidth} />
}
