// src/types/index.ts

export type District = 
  | 'Srinagar' | 'Ganderbal' | 'Budgam' | 'Pulwama' | 'Shopian'
  | 'Kulgam' | 'Anantnag' | 'Ramban' | 'Doda' | 'Kishtwar'
  | 'Baramulla' | 'Bandipora' | 'Kupwara' | 'Handwara' | 'Sopore'

export const DISTRICTS: District[] = [
  'Srinagar', 'Ganderbal', 'Budgam', 'Pulwama', 'Shopian',
  'Kulgam', 'Anantnag', 'Ramban', 'Doda', 'Kishtwar',
  'Baramulla', 'Bandipora', 'Kupwara', 'Handwara', 'Sopore',
]

export const SRINAGAR_AREAS = [
  'Lal Chowk', 'Rajbagh', 'Dalgate', 'Hyderpora', 'Bemina',
  'Jawahar Nagar', 'Hazratbal', 'Soura', 'Rangreth', 'Nowgam',
  'Panthachowk', 'Pampore', 'Ganderbal Road',
]

export const TRADES = [
  { id: 'plumber',     label: 'Plumber',          emoji: '🔧', urdu: 'پلمبر' },
  { id: 'electrician', label: 'Electrician',       emoji: '⚡', urdu: 'بجلی والا' },
  { id: 'tailor',      label: 'Tailor / Darzi',    emoji: '🧵', urdu: 'درزی' },
  { id: 'driver',      label: 'Cab Driver',         emoji: '🚗', urdu: 'ڈرائیور' },
  { id: 'carpenter',   label: 'Carpenter',          emoji: '🪵', urdu: 'بڑھئی' },
  { id: 'gardener',    label: 'Gardener',           emoji: '🌿', urdu: 'مالی' },
  { id: 'painter',     label: 'Painter',            emoji: '🎨', urdu: 'پینٹر' },
  { id: 'mason',       label: 'Mason / Mistri',     emoji: '🏗️', urdu: 'مستری' },
  { id: 'cleaner',     label: 'Cleaner',            emoji: '🧹', urdu: 'صفائی والا' },
  { id: 'barber',      label: 'Barber / Naai',      emoji: '💇', urdu: 'نائی' },
  { id: 'cook',        label: 'Cook / Chef',        emoji: '🍳', urdu: 'باورچی' },
  { id: 'delivery',    label: 'Delivery',           emoji: '📦', urdu: 'ڈیلیوری' },
  { id: 'tutor',       label: 'Tutor / Ustad',      emoji: '🎓', urdu: 'استاد' },
  { id: 'tech',        label: 'Computer Repair',    emoji: '💻', urdu: 'کمپیوٹر' },
  { id: 'nurse',       label: 'Nurse / Caretaker',  emoji: '🏥', urdu: 'نرس' },
  { id: 'weaver',      label: 'Weaver / Bunkar',    emoji: '🧶', urdu: 'بنکر' },
  { id: 'embroidery',  label: 'Kashmiri Embroidery',emoji: '🌸', urdu: 'کشیدہ کاری' },
  { id: 'shikara',     label: 'Shikara Operator',   emoji: '🚣', urdu: 'شکارہ' },
]

export const PRICE_UNITS = [
  { value: 'PER_VISIT', label: 'per visit' },
  { value: 'PER_HOUR',  label: 'per hour' },
  { value: 'PER_DAY',   label: 'per day' },
  { value: 'PER_ITEM',  label: 'per item' },
  { value: 'PER_KM',    label: 'per km' },
]

export type Worker = {
  id: string
  name: string
  phone: string
  trade: string
  tradeEmoji: string
  bio: string
  district: string
  area: string
  avgRating: number
  totalReviews: number
  isAvailable: boolean
  services: ServiceItem[]
  yearsExp?: number
  aadhaarVerified: boolean
}

export type ServiceItem = {
  id: string
  name: string
  description?: string
  price: number
  priceUnit: string
  durationMins?: number
}

export type ChatMessage = {
  id: string
  chatRoomId: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: string
  sender?: { name: string; phone: string }
}
