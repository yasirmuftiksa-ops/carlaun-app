import type {
  Address,
  Coupon,
  Offer,
  Order,
  Partner,
  Service,
} from './types'

export const SERVICES: Service[] = [
  {
    id: 'laundry',
    name: 'Laundry',
    icon: 'WashingMachine',
    tagline: 'Wash & fold',
    description: 'Professional garment washing and fabric care.',
    fromPrice: 49,
    accent: 'oklch(0.55 0.2 292)',
    items: [
      { id: 'tshirt', name: 'T-Shirt', price: 49, unit: 'piece' },
      { id: 'shirt', name: 'Shirt', price: 59, unit: 'piece' },
      { id: 'pants', name: 'Pants', price: 69, unit: 'piece' },
      { id: 'jeans', name: 'Jeans', price: 79, unit: 'piece' },
      { id: 'bedsheet', name: 'Bedsheet', price: 129, unit: 'piece' },
    ],
  },
  {
    id: 'ironing',
    name: 'Ironing',
    icon: 'Sparkles',
    tagline: 'Crisp & pressed',
    description: 'Steam-pressed, wrinkle-free finishing.',
    fromPrice: 10,
    accent: 'oklch(0.6 0.16 250)',
    items: [
      { id: 'shirt', name: 'Shirt', price: 10, unit: 'piece' },
      { id: 'tshirt', name: 'T-Shirt', price: 10, unit: 'piece' },
      { id: 'trousers', name: 'Trousers', price: 12, unit: 'piece' },
      { id: 'kurta', name: 'Kurta', price: 15, unit: 'piece' },
      { id: 'saree', name: 'Saree', price: 25, unit: 'piece' },
    ],
  },
  {
    id: 'drycleaning',
    name: 'Dry Cleaning',
    icon: 'Wind',
    tagline: 'Delicate care',
    description: 'Gentle solvent cleaning for premium fabrics.',
    fromPrice: 99,
    accent: 'oklch(0.58 0.14 210)',
    items: [
      { id: 'blazer', name: 'Blazer', price: 199, unit: 'piece' },
      { id: 'coat', name: 'Winter Coat', price: 249, unit: 'piece' },
      { id: 'suit', name: 'Suit (2pc)', price: 349, unit: 'set' },
      { id: 'silkshirt', name: 'Silk Shirt', price: 99, unit: 'piece' },
      { id: 'sweater', name: 'Sweater', price: 129, unit: 'piece' },
    ],
  },
  {
    id: 'saree',
    name: 'Saree Pleating',
    icon: 'Layers',
    tagline: 'Perfect drape',
    description: 'Precision pleating and pre-draping for sarees.',
    fromPrice: 80,
    accent: 'oklch(0.62 0.18 30)',
    items: [
      { id: 'pleat', name: 'Standard Pleating', price: 80, unit: 'saree' },
      { id: 'premium', name: 'Premium Pleating', price: 120, unit: 'saree' },
      { id: 'predrape', name: 'Ready Pre-Drape', price: 160, unit: 'saree' },
      { id: 'fall', name: 'Fall & Edging', price: 90, unit: 'saree' },
    ],
  },
  {
    id: 'shoe',
    name: 'Shoe Cleaning',
    icon: 'Footprints',
    tagline: 'Fresh kicks',
    description: 'Deep cleaning and restoration for footwear.',
    fromPrice: 149,
    accent: 'oklch(0.55 0.14 150)',
    items: [
      { id: 'sneakers', name: 'Sneakers', price: 149, unit: 'pair' },
      { id: 'leather', name: 'Leather Shoes', price: 199, unit: 'pair' },
      { id: 'boots', name: 'Boots', price: 229, unit: 'pair' },
      { id: 'sports', name: 'Sports Shoes', price: 179, unit: 'pair' },
    ],
  },
  {
    id: 'bag',
    name: 'Bag Cleaning',
    icon: 'Briefcase',
    tagline: 'Like-new bags',
    description: 'Careful cleaning for handbags and backpacks.',
    fromPrice: 199,
    accent: 'oklch(0.5 0.16 320)',
    items: [
      { id: 'handbag', name: 'Handbag', price: 199, unit: 'bag' },
      { id: 'backpack', name: 'Backpack', price: 229, unit: 'bag' },
      { id: 'luxury', name: 'Luxury Bag', price: 399, unit: 'bag' },
      { id: 'tote', name: 'Tote Bag', price: 179, unit: 'bag' },
    ],
  },
]

export const EXPRESS_MULTIPLIER = 1.4

export const PARTNERS: Partner[] = [
  {
    id: 'freshcare',
    name: 'FreshCare',
    rating: 4.8,
    services: 'Laundry • Ironing',
    distance: '1.2 km away',
    turnaround: '24-hour turnaround',
  },
  {
    id: 'cleannest',
    name: 'CleanNest',
    rating: 4.7,
    services: 'Dry Cleaning • Shoe Care',
    distance: '2.1 km away',
    turnaround: '48-hour turnaround',
  },
  {
    id: 'presspro',
    name: 'PressPro',
    rating: 4.9,
    services: 'Ironing • Laundry',
    distance: '0.8 km away',
    turnaround: 'Same-day available',
  },
]

export const OFFERS: Offer[] = [
  {
    id: 'welcome',
    code: 'WELCOME20',
    title: '20% OFF Your First Order',
    description: 'New to CARLAUN? Enjoy 20% off, up to ₹100.',
    featured: true,
  },
  {
    id: 'laundry50',
    code: 'LAUNDRY50',
    title: '₹50 OFF Laundry',
    description: 'On laundry orders above ₹300.',
  },
  {
    id: 'freepickup',
    code: 'FREEPICKUP',
    title: 'Free Pickup Weekend',
    description: 'Zero delivery charges this weekend.',
  },
  {
    id: 'shoe30',
    code: 'SHOE30',
    title: '₹30 OFF Shoe Cleaning',
    description: 'On any shoe care service.',
  },
]

export const COUPONS: Record<string, Coupon> = {
  WELCOME20: {
    code: 'WELCOME20',
    label: '20% off your first order',
    type: 'percent',
    value: 20,
    cap: 100,
  },
  LAUNDRY50: {
    code: 'LAUNDRY50',
    label: '₹50 off laundry',
    type: 'flat',
    value: 50,
    serviceId: 'laundry',
  },
  SHOE30: {
    code: 'SHOE30',
    label: '₹30 off shoe cleaning',
    type: 'flat',
    value: 30,
    serviceId: 'shoe',
  },
  FREEPICKUP: {
    code: 'FREEPICKUP',
    label: 'Free pickup & delivery',
    type: 'freeDelivery',
    value: 0,
  },
}

export const ADDRESSES: Address[] = [
  {
    id: 'home',
    label: 'Home',
    line: '12B, Casa Grande, Velachery, Chennai 600042',
    icon: 'Home',
  },
  {
    id: 'hostel',
    label: 'Hostel',
    line: 'Block C, Sunrise Residency, Taramani, Chennai 600113',
    icon: 'Building2',
  },
  {
    id: 'work',
    label: 'Work',
    line: 'Tidel Park, 4th Floor, Taramani, Chennai 600113',
    icon: 'Briefcase',
  },
]

export const SAVED_LOCATIONS = [
  { id: 'home', label: 'Home', area: 'Velachery, Chennai' },
  { id: 'hostel', label: 'Hostel', area: 'Taramani, Chennai' },
  { id: 'work', label: 'Work', area: 'Tidel Park, Chennai' },
]

export const PICKUP_SLOTS = [
  '8–10 AM',
  '10 AM–12 PM',
  '12–2 PM',
  '4–6 PM',
  '6–8 PM',
]

export const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', hint: 'Pay via any UPI app', icon: 'Smartphone' },
  { id: 'card', label: 'Card', hint: 'Credit / Debit card', icon: 'CreditCard' },
  { id: 'cash', label: 'Cash', hint: 'Pay on delivery', icon: 'Banknote' },
  {
    id: 'wallet',
    label: 'CARLAUN Wallet',
    hint: 'Balance ₹250',
    icon: 'Wallet',
  },
]

export const ORDER_STATUS_STEPS: { id: string; label: string }[] = [
  { id: 'scheduled', label: 'Pickup Scheduled' },
  { id: 'picked', label: 'Picked Up' },
  { id: 'processing', label: 'Processing' },
  { id: 'quality', label: 'Quality Check' },
  { id: 'out', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' },
]

// Seed a past order for the Orders / Reorder demo
export const SEED_PAST_ORDER: Order = {
  id: 'CLN12491',
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
  status: 'delivered',
  services: [
    { serviceId: 'drycleaning', serviceName: 'Dry Cleaning', itemCount: 2, amount: 348 },
    { serviceId: 'laundry', serviceName: 'Laundry', itemCount: 3, amount: 132 },
  ],
  lines: [
    { serviceId: 'drycleaning', itemId: 'silkshirt', qty: 2 },
    { serviceId: 'laundry', itemId: 'shirt', qty: 2 },
    { serviceId: 'laundry', itemId: 'tshirt', qty: 1 },
  ],
  care: { drycleaning: 'standard', laundry: 'standard' },
  address: ADDRESSES[0],
  pickupDate: 'Mon, 24 Feb',
  pickupSlot: '10 AM–12 PM',
  payment: 'UPI',
  subtotal: 480,
  delivery: 40,
  discount: 40,
  total: 480,
}

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id)
}

export function getItem(serviceId: string, itemId: string) {
  return getService(serviceId)?.items.find((i) => i.id === itemId)
}
