export type CurrencyCode = 'USD' | 'INR';

export type LanguageCode = 'en' | 'hi' | 'es' | 'fr' | 'ja' | 'de';

export type CategorySlug =
  | 'apparel'
  | 'accessories'
  | 'bags'
  | 'drinkware'
  | 'gifts'
  | 'chrome-dino'
  | 'android'
  | 'streetwear'
  | 'world'
  | 'sustainable'
  | 'hidden-gems';

export type ProductBadge = 'New Drop' | 'Trending' | 'Best Seller' | 'Limited Drop' | 'Sustainable' | 'Hidden Gem';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  priceUSD: number;
  rating: number;
  reviewCount: number;
  category: CategorySlug;
  categoryName: string;
  badges: ProductBadge[];
  image: string;
  gallery: string[];
  description: string;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  inStock: boolean;
  stockCount?: number;
  isLimited?: boolean;
  isSustainable?: boolean;
  isHiddenGem?: boolean;
  isChromeDino?: boolean;
  isAndroid?: boolean;
  isStreetwear?: boolean;
  isWorldLocation?: string; // e.g., 'Kyoto', 'Nara'
  vibe?: ('colorful' | 'tech' | 'essentials' | 'gift' | 'trending')[];
  materials?: string;
  sustainabilityNote?: string;
}

export interface CartItem {
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface Order {
  id: string;
  items: CartItem[];
  subtotalUSD: number;
  discountUSD: number;
  shippingUSD: number;
  totalUSD: number;
  currency: CurrencyCode;
  totalInCurrency: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  upiId?: string;
  status: 'Order Placed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
}

export interface FilterState {
  category: string;
  minPriceUSD: number;
  maxPriceUSD: number;
  badges: ProductBadge[];
  colors: string[];
  sizes: string[];
  rating: number;
  onlyInStock: boolean;
  onlySustainable: boolean;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'popular';
  searchQuery: string;
}

export interface GA4Event {
  id: string;
  event_name: string;
  params: Record<string, any>;
  timestamp: string;
}

export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  discountAmountUSD: number;
  code: string;
  type: 'voucher' | 'physical' | 'perk';
  icon: string;
  badge?: string;
}

export interface PointActivity {
  id: string;
  title: string;
  points: number;
  type: 'earned' | 'spent';
  date: string;
  description: string;
}

export interface AppliedVoucher {
  code: string;
  discountAmountUSD: number;
  title: string;
}
