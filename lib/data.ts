import type {
  Address,
  Coupon,
  Offer,
  Order,
  Partner,
  Service,
} from './types'

/* =======================================================
   NeXa Link SERVICE CATALOG
   ======================================================= */

export const SERVICES: Service[] = [
  /* -------------------------------------------------------
     LAUNDRY
     ------------------------------------------------------- */

  {
    id: 'laundry',
    name: 'Laundry',
    icon: 'WashingMachine',
    tagline: 'Wash & fold',
    description: 'Professional garment washing and fabric care.',
    fromPrice: 49,
    accent: 'oklch(0.55 0.2 292)',
    serviceType: 'item',
    bookingType: 'scheduled',
    category: 'laundry',
    requiredSkills: ['Laundry Care', 'Fabric Handling'],
    supportsExpress: true,
    supportsOnDemand: false,
    supportsEmergency: false,
    items: [
      {
        id: 'tshirt',
        name: 'T-Shirt',
        price: 49,
        unit: 'piece',
      },
      {
        id: 'shirt',
        name: 'Shirt',
        price: 59,
        unit: 'piece',
      },
      {
        id: 'pants',
        name: 'Pants',
        price: 69,
        unit: 'piece',
      },
      {
        id: 'jeans',
        name: 'Jeans',
        price: 79,
        unit: 'piece',
      },
      {
        id: 'bedsheet',
        name: 'Bedsheet',
        price: 129,
        unit: 'piece',
      },
    ],
  },

  /* -------------------------------------------------------
     IRONING
     ------------------------------------------------------- */

  {
    id: 'ironing',
    name: 'Ironing',
    icon: 'Sparkles',
    tagline: 'Crisp & pressed',
    description: 'Steam-pressed, wrinkle-free finishing.',
    fromPrice: 10,
    accent: 'oklch(0.6 0.16 250)',
    serviceType: 'item',
    bookingType: 'scheduled',
    category: 'laundry',
    requiredSkills: ['Ironing', 'Garment Handling'],
    supportsExpress: true,
    supportsOnDemand: false,
    supportsEmergency: false,
    items: [
      {
        id: 'shirt',
        name: 'Shirt',
        price: 10,
        unit: 'piece',
      },
      {
        id: 'tshirt',
        name: 'T-Shirt',
        price: 10,
        unit: 'piece',
      },
      {
        id: 'trousers',
        name: 'Trousers',
        price: 12,
        unit: 'piece',
      },
      {
        id: 'kurta',
        name: 'Kurta',
        price: 15,
        unit: 'piece',
      },
      {
        id: 'saree',
        name: 'Saree',
        price: 25,
        unit: 'piece',
      },
    ],
  },

  /* -------------------------------------------------------
     DRY CLEANING
     ------------------------------------------------------- */

  {
    id: 'drycleaning',
    name: 'Dry Cleaning',
    icon: 'Wind',
    tagline: 'Delicate care',
    description: 'Gentle solvent cleaning for premium fabrics.',
    fromPrice: 99,
    accent: 'oklch(0.58 0.14 210)',
    serviceType: 'item',
    bookingType: 'scheduled',
    category: 'laundry',
    requiredSkills: ['Dry Cleaning', 'Fabric Care'],
    supportsExpress: true,
    supportsOnDemand: false,
    supportsEmergency: false,
    items: [
      {
        id: 'blazer',
        name: 'Blazer',
        price: 199,
        unit: 'piece',
      },
      {
        id: 'coat',
        name: 'Winter Coat',
        price: 249,
        unit: 'piece',
      },
      {
        id: 'suit',
        name: 'Suit (2pc)',
        price: 349,
        unit: 'set',
      },
      {
        id: 'silkshirt',
        name: 'Silk Shirt',
        price: 99,
        unit: 'piece',
      },
      {
        id: 'sweater',
        name: 'Sweater',
        price: 129,
        unit: 'piece',
      },
    ],
  },

  /* -------------------------------------------------------
     SAREE PLEATING
     ------------------------------------------------------- */

  {
    id: 'saree',
    name: 'Saree Pleating',
    icon: 'Layers',
    tagline: 'Perfect drape',
    description: 'Precision pleating and pre-draping for sarees.',
    fromPrice: 80,
    accent: 'oklch(0.62 0.18 30)',
    serviceType: 'item',
    bookingType: 'scheduled',
    category: 'personal',
    requiredSkills: ['Saree Pleating', 'Garment Handling'],
    supportsExpress: true,
    supportsOnDemand: false,
    supportsEmergency: false,
    items: [
      {
        id: 'pleat',
        name: 'Standard Pleating',
        price: 80,
        unit: 'saree',
      },
      {
        id: 'premium',
        name: 'Premium Pleating',
        price: 120,
        unit: 'saree',
      },
      {
        id: 'predrape',
        name: 'Ready Pre-Drape',
        price: 160,
        unit: 'saree',
      },
      {
        id: 'fall',
        name: 'Fall & Edging',
        price: 90,
        unit: 'saree',
      },
    ],
  },

  /* -------------------------------------------------------
     SHOE CLEANING
     ------------------------------------------------------- */

  {
    id: 'shoe',
    name: 'Shoe Cleaning',
    icon: 'Footprints',
    tagline: 'Fresh kicks',
    description: 'Deep cleaning and restoration for footwear.',
    fromPrice: 149,
    accent: 'oklch(0.55 0.14 150)',
    serviceType: 'item',
    bookingType: 'scheduled',
    category: 'cleaning',
    requiredSkills: ['Shoe Cleaning', 'Footwear Care'],
    supportsExpress: true,
    supportsOnDemand: false,
    supportsEmergency: false,
    items: [
      {
        id: 'sneakers',
        name: 'Sneakers',
        price: 149,
        unit: 'pair',
      },
      {
        id: 'leather',
        name: 'Leather Shoes',
        price: 199,
        unit: 'pair',
      },
      {
        id: 'boots',
        name: 'Boots',
        price: 229,
        unit: 'pair',
      },
      {
        id: 'sports',
        name: 'Sports Shoes',
        price: 179,
        unit: 'pair',
      },
    ],
  },

  /* -------------------------------------------------------
     BAG CLEANING
     ------------------------------------------------------- */

  {
    id: 'bag',
    name: 'Bag Cleaning',
    icon: 'Briefcase',
    tagline: 'Like-new bags',
    description: 'Careful cleaning for handbags and backpacks.',
    fromPrice: 199,
    accent: 'oklch(0.5 0.16 320)',
    serviceType: 'item',
    bookingType: 'scheduled',
    category: 'cleaning',
    requiredSkills: ['Bag Cleaning', 'Leather Care'],
    supportsExpress: true,
    supportsOnDemand: false,
    supportsEmergency: false,
    items: [
      {
        id: 'handbag',
        name: 'Handbag',
        price: 199,
        unit: 'bag',
      },
      {
        id: 'backpack',
        name: 'Backpack',
        price: 229,
        unit: 'bag',
      },
      {
        id: 'luxury',
        name: 'Luxury Bag',
        price: 399,
        unit: 'bag',
      },
      {
        id: 'tote',
        name: 'Tote Bag',
        price: 179,
        unit: 'bag',
      },
    ],
  },

  /* =======================================================
     HOUSEHOLD & COMMUNITY SERVICES
     ======================================================= */

  /* -------------------------------------------------------
     HOME CLEANING
     ------------------------------------------------------- */

  {
    id: 'home-cleaning',
    name: 'Home Cleaning',
    icon: 'Sparkles',
    tagline: 'A cleaner home',
    description:
      'Professional cleaning services for homes, apartments and living spaces.',
    fromPrice: 299,
    accent: 'oklch(0.58 0.15 165)',
    serviceType: 'task',
    bookingType: 'scheduled',
    category: 'cleaning',
    requiredSkills: ['Home Cleaning', 'Sanitation'],
    supportsExpress: true,
    supportsOnDemand: true,
    supportsEmergency: false,
    items: [
      {
        id: 'full-home',
        name: 'Full Home Cleaning',
        price: 999,
        unit: 'service',
        description: 'Complete cleaning of the home.',
        duration: 180,
      },
      {
        id: 'one-bedroom',
        name: '1 Bedroom Cleaning',
        price: 499,
        unit: 'service',
        description: 'Cleaning for one bedroom and common area.',
        duration: 90,
      },
      {
        id: 'kitchen',
        name: 'Kitchen Cleaning',
        price: 399,
        unit: 'service',
        description: 'Deep cleaning of kitchen surfaces.',
        duration: 75,
      },
      {
        id: 'bathroom',
        name: 'Bathroom Cleaning',
        price: 299,
        unit: 'service',
        description: 'Deep bathroom cleaning and sanitation.',
        duration: 60,
      },
    ],
  },

  /* -------------------------------------------------------
     PLUMBING
     ------------------------------------------------------- */

  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: 'Wrench',
    tagline: 'Fix leaks & pipes',
    description:
      'Trusted plumbers for repairs, installations and emergency plumbing.',
    fromPrice: 149,
    accent: 'oklch(0.58 0.16 220)',
    serviceType: 'task',
    bookingType: 'on-demand',
    category: 'repair',
    requiredSkills: ['Plumbing', 'Pipe Repair'],
    supportsExpress: true,
    supportsOnDemand: true,
    supportsEmergency: true,
    items: [
      {
        id: 'tap-repair',
        name: 'Tap Repair',
        price: 149,
        unit: 'service',
        description: 'Repair or replacement of leaking taps.',
        duration: 45,
      },
      {
        id: 'pipe-repair',
        name: 'Pipe Repair',
        price: 299,
        unit: 'service',
        description: 'Repair of leaking or damaged pipes.',
        duration: 60,
      },
      {
        id: 'wash-basin',
        name: 'Wash Basin Installation',
        price: 499,
        unit: 'service',
        description: 'Installation of a wash basin.',
        duration: 90,
      },
      {
        id: 'bathroom-fitting',
        name: 'Bathroom Fitting',
        price: 799,
        unit: 'service',
        description: 'Basic bathroom fixture installation.',
        duration: 120,
      },
    ],
  },

  /* -------------------------------------------------------
     ELECTRICAL
     ------------------------------------------------------- */

  {
    id: 'electrical',
    name: 'Electrical',
    icon: 'Zap',
    tagline: 'Safe electrical repairs',
    description:
      'Verified electricians for electrical repairs, installations and wiring.',
    fromPrice: 149,
    accent: 'oklch(0.65 0.18 85)',
    serviceType: 'task',
    bookingType: 'on-demand',
    category: 'repair',
    requiredSkills: ['Electrical Repair', 'Electrical Safety'],
    supportsExpress: true,
    supportsOnDemand: true,
    supportsEmergency: true,
    items: [
      {
        id: 'fan-repair',
        name: 'Fan Repair',
        price: 199,
        unit: 'service',
        description: 'Repair of ceiling and exhaust fans.',
        duration: 60,
      },
      {
        id: 'switch-repair',
        name: 'Switch / Socket Repair',
        price: 149,
        unit: 'service',
        description: 'Repair or replacement of switches and sockets.',
        duration: 45,
      },
      {
        id: 'light-installation',
        name: 'Light Installation',
        price: 199,
        unit: 'service',
        description: 'Installation of lights and fixtures.',
        duration: 45,
      },
      {
        id: 'wiring',
        name: 'Basic Wiring',
        price: 499,
        unit: 'service',
        description: 'Basic electrical wiring and repair.',
        duration: 120,
      },
    ],
  },

  /* -------------------------------------------------------
     CARPENTRY
     ------------------------------------------------------- */

  {
    id: 'carpentry',
    name: 'Carpentry',
    icon: 'Hammer',
    tagline: 'Build & repair',
    description:
      'Skilled carpenters for furniture repair, installation and woodwork.',
    fromPrice: 199,
    accent: 'oklch(0.58 0.14 55)',
    serviceType: 'task',
    bookingType: 'scheduled',
    category: 'repair',
    requiredSkills: ['Carpentry', 'Furniture Repair'],
    supportsExpress: true,
    supportsOnDemand: true,
    supportsEmergency: false,
    items: [
      {
        id: 'furniture-repair',
        name: 'Furniture Repair',
        price: 299,
        unit: 'service',
        description: 'Repair of basic household furniture.',
        duration: 90,
      },
      {
        id: 'door-repair',
        name: 'Door Repair',
        price: 249,
        unit: 'service',
        description: 'Door alignment, hinges and minor repairs.',
        duration: 60,
      },
      {
        id: 'shelf-installation',
        name: 'Shelf Installation',
        price: 299,
        unit: 'service',
        description: 'Installation of wall shelves.',
        duration: 60,
      },
      {
        id: 'furniture-assembly',
        name: 'Furniture Assembly',
        price: 399,
        unit: 'service',
        description: 'Assembly of ready-to-install furniture.',
        duration: 90,
      },
    ],
  },

  /* -------------------------------------------------------
     PAINTING
     ------------------------------------------------------- */

  {
    id: 'painting',
    name: 'Painting',
    icon: 'Paintbrush',
    tagline: 'Refresh your space',
    description:
      'Professional painting services for rooms, walls and small properties.',
    fromPrice: 499,
    accent: 'oklch(0.6 0.18 15)',
    serviceType: 'task',
    bookingType: 'scheduled',
    category: 'maintenance',
    requiredSkills: ['Painting', 'Surface Preparation'],
    supportsExpress: false,
    supportsOnDemand: true,
    supportsEmergency: false,
    items: [
      {
        id: 'single-wall',
        name: 'Single Wall Painting',
        price: 499,
        unit: 'service',
        description: 'Painting of one standard wall.',
        duration: 120,
      },
      {
        id: 'room-painting',
        name: 'Room Painting',
        price: 1499,
        unit: 'room',
        description: 'Painting of one standard room.',
        duration: 360,
      },
      {
        id: 'touch-up',
        name: 'Paint Touch-Up',
        price: 399,
        unit: 'service',
        description: 'Minor wall paint touch-ups.',
        duration: 90,
      },
    ],
  },

  /* -------------------------------------------------------
     GARDENING
     ------------------------------------------------------- */

  {
    id: 'gardening',
    name: 'Gardening',
    icon: 'Leaf',
    tagline: 'Keep it green',
    description:
      'Gardening and plant-care services for homes and communities.',
    fromPrice: 199,
    accent: 'oklch(0.55 0.17 135)',
    serviceType: 'task',
    bookingType: 'scheduled',
    category: 'maintenance',
    requiredSkills: ['Gardening', 'Plant Care'],
    supportsExpress: false,
    supportsOnDemand: true,
    supportsEmergency: false,
    items: [
      {
        id: 'garden-maintenance',
        name: 'Garden Maintenance',
        price: 399,
        unit: 'service',
        description: 'Basic garden cleaning and maintenance.',
        duration: 90,
      },
      {
        id: 'plant-care',
        name: 'Plant Care',
        price: 199,
        unit: 'service',
        description: 'Plant trimming, watering and basic care.',
        duration: 60,
      },
      {
        id: 'lawn-care',
        name: 'Lawn Care',
        price: 499,
        unit: 'service',
        description: 'Basic lawn maintenance.',
        duration: 120,
      },
    ],
  },

  /* -------------------------------------------------------
     CAREGIVING
     ------------------------------------------------------- */

  {
    id: 'caregiving',
    name: 'Caregiving',
    icon: 'HeartHandshake',
    tagline: 'Trusted personal care',
    description:
      'Verified caregivers for elderly and assisted household support.',
    fromPrice: 499,
    accent: 'oklch(0.58 0.16 350)',
    serviceType: 'task',
    bookingType: 'scheduled',
    category: 'caregiving',
    requiredSkills: ['Caregiving', 'Elder Care'],
    supportsExpress: false,
    supportsOnDemand: true,
    supportsEmergency: false,
    items: [
      {
        id: 'elder-support',
        name: 'Elder Support',
        price: 499,
        unit: 'hour',
        description: 'Companionship and daily assistance.',
        duration: 60,
      },
      {
        id: 'daily-assistance',
        name: 'Daily Assistance',
        price: 599,
        unit: 'hour',
        description: 'Support with routine household activities.',
        duration: 60,
      },
      {
        id: 'companion-care',
        name: 'Companion Care',
        price: 499,
        unit: 'hour',
        description: 'Companionship and basic assistance.',
        duration: 60,
      },
    ],
  },

  /* -------------------------------------------------------
     DRIVER SERVICES
     ------------------------------------------------------- */

  {
    id: 'driver',
    name: 'Driver Services',
    icon: 'Car',
    tagline: 'Reliable local drivers',
    description:
      'Verified drivers for local trips, errands and scheduled transportation.',
    fromPrice: 299,
    accent: 'oklch(0.56 0.15 270)',
    serviceType: 'task',
    bookingType: 'on-demand',
    category: 'transport',
    requiredSkills: ['Driving', 'Road Safety'],
    supportsExpress: true,
    supportsOnDemand: true,
    supportsEmergency: false,
    items: [
      {
        id: 'local-trip',
        name: 'Local Trip',
        price: 299,
        unit: 'trip',
        description: 'Driver for a local trip.',
        duration: 60,
      },
      {
        id: 'errand-driver',
        name: 'Errand Driver',
        price: 399,
        unit: 'hour',
        description: 'Driver for errands and short-distance tasks.',
        duration: 60,
      },
      {
        id: 'scheduled-driver',
        name: 'Scheduled Driver',
        price: 799,
        unit: 'half-day',
        description: 'Driver service for scheduled requirements.',
        duration: 240,
      },
    ],
  },
]

/* =======================================================
   PRICING
   ======================================================= */

export const EXPRESS_MULTIPLIER = 1.4

/* =======================================================
   PARTNERS / SERVICE PROVIDERS
   ======================================================= */

export const PARTNERS: Partner[] = [
  /* -------------------------------------------------------
     LAUNDRY / GARMENT SERVICES
     ------------------------------------------------------- */

  {
    id: 'freshcare',
    name: 'FreshCare',
    rating: 4.8,
    services: 'Laundry • Ironing',
    distance: '1.2 km away',
    turnaround: '24-hour turnaround',
    verified: true,
    available: true,
    experience: 4,
    serviceArea: 'Within 5 km',
    completedJobs: 248,
    earnings: 18450,
  },

  {
    id: 'cleannest',
    name: 'CleanNest',
    rating: 4.7,
    services: 'Dry Cleaning • Shoe Care • Bag Cleaning',
    distance: '2.1 km away',
    turnaround: '48-hour turnaround',
    verified: true,
    available: true,
    experience: 3,
    serviceArea: 'Within 7 km',
    completedJobs: 186,
    earnings: 14200,
  },

  {
    id: 'presspro',
    name: 'PressPro',
    rating: 4.9,
    services: 'Ironing • Laundry',
    distance: '0.8 km away',
    turnaround: 'Same-day available',
    verified: true,
    available: false,
    experience: 6,
    serviceArea: 'Within 4 km',
    completedJobs: 327,
    earnings: 23150,
  },

  {
    id: 'sareecare',
    name: 'SareeCare Studio',
    rating: 4.9,
    services: 'Saree Pleating • Garment Care',
    distance: '1.7 km away',
    turnaround: 'Same-day available',
    verified: true,
    available: true,
    experience: 7,
    serviceArea: 'Within 6 km',
    completedJobs: 412,
    earnings: 28600,
  },

  /* -------------------------------------------------------
     HOME CLEANING
     ------------------------------------------------------- */

  {
    id: 'sparkhome',
    name: 'SparkHome Cooperative',
    rating: 4.9,
    services: 'Home Cleaning • Kitchen Cleaning • Bathroom Cleaning',
    distance: '1.4 km away',
    turnaround: 'Same-day available',
    verified: true,
    available: true,
    experience: 5,
    serviceArea: 'Within 6 km',
    completedJobs: 384,
    earnings: 32100,
  },

  {
    id: 'cleanhub',
    name: 'CleanHub',
    rating: 4.7,
    services: 'Home Cleaning • Deep Cleaning',
    distance: '2.8 km away',
    turnaround: '24-hour turnaround',
    verified: true,
    available: true,
    experience: 4,
    serviceArea: 'Within 8 km',
    completedJobs: 291,
    earnings: 24750,
  },

  /* -------------------------------------------------------
     PLUMBING
     ------------------------------------------------------- */

  {
    id: 'aquafix',
    name: 'AquaFix Cooperative',
    rating: 4.8,
    services: 'Plumbing • Pipe Repair • Bathroom Fitting',
    distance: '1.6 km away',
    turnaround: 'Available today',
    verified: true,
    available: true,
    experience: 8,
    serviceArea: 'Within 7 km',
    completedJobs: 526,
    earnings: 41800,
  },

  {
    id: 'rapidplumb',
    name: 'RapidPlumb',
    rating: 4.6,
    services: 'Plumbing • Tap Repair • Pipe Repair',
    distance: '3.2 km away',
    turnaround: 'Emergency available',
    verified: true,
    available: true,
    experience: 5,
    serviceArea: 'Within 10 km',
    completedJobs: 348,
    earnings: 29400,
  },

  /* -------------------------------------------------------
     ELECTRICAL
     ------------------------------------------------------- */

  {
    id: 'powercare',
    name: 'PowerCare Cooperative',
    rating: 4.9,
    services: 'Electrical • Wiring • Light Installation',
    distance: '1.9 km away',
    turnaround: 'Available today',
    verified: true,
    available: true,
    experience: 9,
    serviceArea: 'Within 8 km',
    completedJobs: 612,
    earnings: 49200,
  },

  {
    id: 'voltfix',
    name: 'VoltFix',
    rating: 4.7,
    services: 'Electrical • Fan Repair • Switch Repair',
    distance: '2.6 km away',
    turnaround: 'Emergency available',
    verified: true,
    available: true,
    experience: 6,
    serviceArea: 'Within 8 km',
    completedJobs: 421,
    earnings: 35700,
  },

  /* -------------------------------------------------------
     CARPENTRY
     ------------------------------------------------------- */

  {
    id: 'woodcraft',
    name: 'WoodCraft Cooperative',
    rating: 4.8,
    services: 'Carpentry • Furniture Repair • Door Repair',
    distance: '2.3 km away',
    turnaround: 'Available today',
    verified: true,
    available: true,
    experience: 10,
    serviceArea: 'Within 8 km',
    completedJobs: 573,
    earnings: 46100,
  },

  {
    id: 'fixwood',
    name: 'FixWood Services',
    rating: 4.6,
    services: 'Carpentry • Furniture Assembly • Shelf Installation',
    distance: '3.5 km away',
    turnaround: '24-hour turnaround',
    verified: true,
    available: true,
    experience: 6,
    serviceArea: 'Within 10 km',
    completedJobs: 318,
    earnings: 27200,
  },

  /* -------------------------------------------------------
     PAINTING
     ------------------------------------------------------- */

  {
    id: 'colorcraft',
    name: 'ColorCraft Cooperative',
    rating: 4.9,
    services: 'Painting • Wall Painting • Room Painting',
    distance: '2.0 km away',
    turnaround: 'Available today',
    verified: true,
    available: true,
    experience: 8,
    serviceArea: 'Within 10 km',
    completedJobs: 467,
    earnings: 53600,
  },

  {
    id: 'paintplus',
    name: 'PaintPlus',
    rating: 4.7,
    services: 'Painting • Paint Touch-Up',
    distance: '3.8 km away',
    turnaround: '24-hour turnaround',
    verified: true,
    available: true,
    experience: 5,
    serviceArea: 'Within 10 km',
    completedJobs: 296,
    earnings: 31900,
  },

  /* -------------------------------------------------------
     GARDENING
     ------------------------------------------------------- */

  {
    id: 'greencare',
    name: 'GreenCare Cooperative',
    rating: 4.9,
    services: 'Gardening • Plant Care • Lawn Care',
    distance: '1.8 km away',
    turnaround: 'Available today',
    verified: true,
    available: true,
    experience: 7,
    serviceArea: 'Within 8 km',
    completedJobs: 438,
    earnings: 33800,
  },

  {
    id: 'gardenpro',
    name: 'GardenPro',
    rating: 4.6,
    services: 'Gardening • Garden Maintenance',
    distance: '3.1 km away',
    turnaround: '24-hour turnaround',
    verified: true,
    available: true,
    experience: 5,
    serviceArea: 'Within 9 km',
    completedJobs: 274,
    earnings: 22100,
  },

  /* -------------------------------------------------------
     CAREGIVING
     ------------------------------------------------------- */

  {
    id: 'carecircle',
    name: 'CareCircle Cooperative',
    rating: 4.9,
    services: 'Caregiving • Elder Care • Daily Assistance',
    distance: '1.5 km away',
    turnaround: 'Available today',
    verified: true,
    available: true,
    experience: 8,
    serviceArea: 'Within 6 km',
    completedJobs: 365,
    earnings: 41200,
  },

  {
    id: 'comfortcare',
    name: 'ComfortCare',
    rating: 4.8,
    services: 'Caregiving • Companion Care',
    distance: '2.7 km away',
    turnaround: 'Scheduled service',
    verified: true,
    available: true,
    experience: 6,
    serviceArea: 'Within 8 km',
    completedJobs: 286,
    earnings: 35400,
  },

  /* -------------------------------------------------------
     DRIVER SERVICES
     ------------------------------------------------------- */

  {
    id: 'cityride',
    name: 'CityRide Cooperative',
    rating: 4.9,
    services: 'Driver Services • Local Trips • Errand Driver',
    distance: '1.3 km away',
    turnaround: 'Available now',
    verified: true,
    available: true,
    experience: 8,
    serviceArea: 'Within 12 km',
    completedJobs: 724,
    earnings: 58400,
  },

  {
    id: 'safehands',
    name: 'SafeHands Drivers',
    rating: 4.7,
    services: 'Driver Services • Scheduled Driver • Local Trips',
    distance: '2.9 km away',
    turnaround: 'Scheduled service',
    verified: true,
    available: true,
    experience: 6,
    serviceArea: 'Within 15 km',
    completedJobs: 492,
    earnings: 42700,
  },
]

/* =======================================================
   PARTNER GEO LOCATIONS
   ======================================================= */

/*
 * DEMO GEO DATA FOR NeXa Link PROTOTYPE
 *
 * These coordinates are representative demo locations
 * around Chennai for demonstrating GPS-based provider
 * matching. They are NOT claimed to be the actual
 * business locations of these demo providers.
 *
 * When NeXa Link has real providers, replace these values
 * with coordinates captured from the provider's registered
 * service location.
 */

export const PARTNER_LOCATIONS: Record<
  string,
  {
    latitude: number
    longitude: number
    area: string
  }
> = {
  freshcare: {
    latitude: 12.9784,
    longitude: 80.2214,
    area: 'Velachery',
  },

  cleannest: {
    latitude: 12.9847,
    longitude: 80.2189,
    area: 'Guindy',
  },

  presspro: {
    latitude: 12.9716,
    longitude: 80.2183,
    area: 'Adambakkam',
  },

  sareecare: {
    latitude: 12.9869,
    longitude: 80.2562,
    area: 'Taramani',
  },

  sparkhome: {
    latitude: 12.9815,
    longitude: 80.2412,
    area: 'Velachery',
  },

  cleanhub: {
    latitude: 12.9658,
    longitude: 80.2456,
    area: 'Pallikaranai',
  },

  aquafix: {
    latitude: 12.9941,
    longitude: 80.2209,
    area: 'Guindy',
  },

  rapidplumb: {
    latitude: 12.9629,
    longitude: 80.2498,
    area: 'Pallikaranai',
  },

  powercare: {
    latitude: 12.9875,
    longitude: 80.2281,
    area: 'Velachery',
  },

  voltfix: {
    latitude: 12.9753,
    longitude: 80.2097,
    area: 'Adambakkam',
  },

  woodcraft: {
    latitude: 12.9914,
    longitude: 80.2364,
    area: 'Taramani',
  },

  fixwood: {
    latitude: 12.9588,
    longitude: 80.2421,
    area: 'Pallikaranai',
  },

  colorcraft: {
    latitude: 12.9811,
    longitude: 80.2632,
    area: 'Perungudi',
  },

  paintplus: {
    latitude: 12.9695,
    longitude: 80.2524,
    area: 'Pallikaranai',
  },

  greencare: {
    latitude: 12.9952,
    longitude: 80.2551,
    area: 'Taramani',
  },

  gardenpro: {
    latitude: 12.9537,
    longitude: 80.2463,
    area: 'Pallikaranai',
  },

  carecircle: {
    latitude: 12.9898,
    longitude: 80.2428,
    area: 'Taramani',
  },

  comfortcare: {
    latitude: 12.9684,
    longitude: 80.2377,
    area: 'Velachery',
  },

  cityride: {
    latitude: 12.9829,
    longitude: 80.2204,
    area: 'Velachery',
  },

  safehands: {
    latitude: 12.9607,
    longitude: 80.2288,
    area: 'Adambakkam',
  },
}

/* =======================================================
   OFFERS
   ======================================================= */

export const OFFERS: Offer[] = [
  {
    id: 'welcome',
    code: 'WELCOME20',
    title: '20% OFF Your First Order',
    description: 'New to NeXa Link? Enjoy 20% off, up to ₹100.',
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

  {
    id: 'homecleaning100',
    code: 'HOME100',
    title: '₹100 OFF Home Cleaning',
    description: 'Save ₹100 on selected home cleaning services.',
  },

  {
    id: 'repair50',
    code: 'REPAIR50',
    title: '₹50 OFF Repairs',
    description: 'Save ₹50 on selected plumbing and electrical services.',
  },
]

/* =======================================================
   COUPONS
   ======================================================= */

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

  HOME100: {
    code: 'HOME100',
    label: '₹100 off home cleaning',
    type: 'flat',
    value: 100,
    serviceId: 'home-cleaning',
  },

  REPAIR50: {
    code: 'REPAIR50',
    label: '₹50 off repair services',
    type: 'flat',
    value: 50,
  },
}

/* =======================================================
   ADDRESSES
   ======================================================= */

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

/* =======================================================
   SAVED LOCATIONS
   ======================================================= */

export const SAVED_LOCATIONS = [
  {
    id: 'home',
    label: 'Home',
    area: 'Velachery, Chennai',
  },

  {
    id: 'hostel',
    label: 'Hostel',
    area: 'Taramani, Chennai',
  },

  {
    id: 'work',
    label: 'Work',
    area: 'Tidel Park, Chennai',
  },
]

/* =======================================================
   PICKUP / SERVICE SLOTS
   ======================================================= */

export const PICKUP_SLOTS = [
  '8–10 AM',
  '10 AM–12 PM',
  '12–2 PM',
  '4–6 PM',
  '6–8 PM',
]

/* =======================================================
   PAYMENT METHODS
   ======================================================= */

export const PAYMENT_METHODS = [
  {
    id: 'upi',
    label: 'UPI',
    hint: 'Pay via any UPI app',
    icon: 'Smartphone',
  },

  {
    id: 'card',
    label: 'Card',
    hint: 'Credit / Debit card',
    icon: 'CreditCard',
  },

  {
    id: 'cash',
    label: 'Cash',
    hint: 'Pay on delivery',
    icon: 'Banknote',
  },

  {
    id: 'wallet',
    label: 'NeXa Link Wallet',
    hint: 'Balance ₹250',
    icon: 'Wallet',
  },
]

/* =======================================================
   ORDER STATUS
   ======================================================= */

export const ORDER_STATUS_STEPS: {
  id: string
  label: string
}[] = [
  {
    id: 'scheduled',
    label: 'Pickup Scheduled',
  },

  {
    id: 'picked',
    label: 'Picked Up',
  },

  {
    id: 'processing',
    label: 'Processing',
  },

  {
    id: 'quality',
    label: 'Quality Check',
  },

  {
    id: 'out',
    label: 'Out for Delivery',
  },

  {
    id: 'delivered',
    label: 'Delivered',
  },
]

/* =======================================================
   SEED PAST ORDER
   ======================================================= */

export const SEED_PAST_ORDER: Order = {
  id: 'CLN12491',

  createdAt:
    Date.now() -
    1000 *
      60 *
      60 *
      24 *
      6,

  status: 'delivered',

  services: [
    {
      serviceId: 'drycleaning',
      serviceName: 'Dry Cleaning',
      itemCount: 2,
      amount: 348,
    },

    {
      serviceId: 'laundry',
      serviceName: 'Laundry',
      itemCount: 3,
      amount: 132,
    },
  ],

  lines: [
    {
      serviceId: 'drycleaning',
      itemId: 'silkshirt',
      qty: 2,
    },

    {
      serviceId: 'laundry',
      itemId: 'shirt',
      qty: 2,
    },

    {
      serviceId: 'laundry',
      itemId: 'tshirt',
      qty: 1,
    },
  ],

  care: {
    drycleaning: 'standard',
    laundry: 'standard',
  },

  address: ADDRESSES[0],

  pickupDate: 'Mon, 24 Feb',

  pickupSlot: '10 AM–12 PM',

  payment: 'UPI',

  subtotal: 480,

  delivery: 40,

  discount: 40,

  total: 480,
}

/* =======================================================
   HELPER FUNCTIONS
   ======================================================= */

export function getService(
  id: string,
): Service | undefined {
  return SERVICES.find(
    (s) => s.id === id,
  )
}

export function getItem(
  serviceId: string,
  itemId: string,
) {
  return getService(
    serviceId,
  )?.items.find(
    (i) => i.id === itemId,
  )
}
