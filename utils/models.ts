export const dynamic = "force-dynamic";
export const runtime = "edge";

// Type definitions based on Swagger documentation
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  county?: string;
  subcounty?: string;
  courier?: string;
  pickupDescription?: string;
  orders?: Order[];
  cart?: CartItem[];
}

export interface Order {
  _id: string;
  total: number;
  paymentCode?: string;
  date: string;
  county: string;
  subcounty: string;
  courier: string;
  arrivalDate?: string;
  pickupDescription: string;
  paymentMode?: string;
  orders: OrderItem[];
}

export interface OrderItem {
  _id: string;
  img: string;
  name: string;
  description: string;
  size?: string;
  color?: string;
  gender?: string;
  selectedOption?: string;
  price: number;
  amount: number;
  status?: string;
  pid: string;
  reviewed?: boolean;
}

export interface CartItem {
  _id: string;
  img: string;
  name: string;
  description: string;
  size?: string;
  color?: string;
  gender?: string;
  price: number;
  amount: number;
  status?: string;
  pid: string;
  selectedOption?: string;
  brand?: string;
  category?: string;
  subcategory?: string;
}

export interface Product {
  _id: string;
  img?: string;
  images?: Array<{ img: string; _id?: string }>;
  name?: string;
  description?: string;
  type?: string;
  category?: string;
  subcategory?: string;
  categories?: string[];
  sizes?: string[];
  colors?: string[];
  gender?: string;
  price?: number;
  features?: any[];
  extras?: Record<string, any>;
  brand?: string;
  condition?: string;
  inStock?: boolean;
  specs?: Array<{ name: string; detail: string; _id?: string }>;
  faqs?: Array<{ question: string; answer: string; _id?: string }>;
  handlingTime?: {
    unit: string;
    amount: number;
  };
  USPs?: string[];
  videoLink?: string;
  unitsSold?: number;
  unitsRefunded?: number;
  offers?: string[];
  shippingOptions?: string[];
  returnsAccepted?: boolean;
  others?: Array<{
    _id: string;
    name: string;
    img?: string;
    price?: number;
  }>;
  priceOptions?: Array<{
    option: string;
    price: number;
    default: boolean;
    _id?: string;
  }>;
  coupons?: Array<{
    name: string;
    discount: number;
    default: boolean;
    _id?: string;
  }>;
  reviews?: Review[];
  articles?: LandingPageArticle[];
  landingPages?: Array<{
    name: string;
    articles: LandingPageArticle[];
    default: boolean;
    miniHeader: boolean;
    _id?: string;
  }>;
  showRelated?: boolean;
  hide?: boolean;
  showGoogle?: boolean;
  originalDescription?: string;
  messages?: Array<{
    role: string;
    content: string;
  }>;
  affiliateVisibility?: string;
  commission?: number;
  owner?: string;
  affiliate?: string;
  building?: boolean;
  originalId?: string;
  copying?: boolean;
}

export interface Review {
  name: string;
  comment?: string;
  rating: number;
  media?: Array<{
    link: string;
    type: string;
  }>;
  _id?: string;
}

// Updated Business interface to match layout.tsx requirements
export interface Business {
  _id: string;
  url: string;
  customUrl?: string;
  name: string;
  icon?: string;
  phone: string;
  email: string;
  location: string;
  about: string;
  aboutDetailed?: string;
  gproducts?: string[];
  products?: Product[];
  paymentOptions?: string[];
  gusers?: string[];
  password?: string;
  verified?: boolean;
  emailToken?: string;
  deliveryLocations?: DeliveryLocation[];
  goDelivery?: {
    enabled?: boolean;
    type1?: boolean;
    baseCounty?: string;
    baseSubCounty?: string;
    baseWard?: string;
    baseLocation?: string;
  };
  growth?: Array<{
    month: string;
    year: string;
    users: number;
  }>;
  visits?: Array<{
    month: string;
    year: string;
    visits: number;
  }>;
  resetPass?: {
    token?: string;
    timestamp?: string;
  };
  showPrice?: boolean;
  promotions?: Array<{
    type?: string;
    content?: string;
  }>;
  welcomeEmailSent?: boolean;
  lastPayment?: {
    year: number;
    month: number;
    day: number;
    status?: string;
    stopped?: boolean;
  };
  invoices?: Array<{
    dateGenerated: string;
    dueDate: string;
    status: string;
    modeOfPayment: string;
    purpose: string;
    description: string;
    datePaid: string;
    amount: number;
    invNum: string;
  }>;
  active: boolean;
  package: string;
  subscription?: string;
  status?: {
    subscription?: string;
    dateChanged?: string;
  };
  template: string;
  theme: string;
  inquiries?: {
    number?: number;
    lastVisited?: string;
  };
  instagram?: string;
  facebook?: string;
  twitter?: string;
  google?: string;
  holidayTheme?: boolean;
  ga4Tag?: string;
  responseTime?: {
    unit?: string;
    amount?: number;
  };
  workingHours?: string;
  googleMerchantTag?: string;
  vacated?: {
    state?: boolean;
    deadline?: string;
  };
  leads?: Array<{
    type?: string;
    timestamp?: string;
    subject?: string;
    uid?: string;
  }>;
  dailyVisitors?: Array<{
    page?: string;
    timestamp?: string;
    visitorId?: string;
  }>;
  openAI?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  posInvoices?: POSInvoice[];
  emailDailyNotification?: boolean;
  smsDailyNotification?: boolean;
}

// New interfaces to match layout.tsx
export interface BusinessProfile extends Business {
  // This interface extends Business and can be used in layout.tsx
  // It ensures compatibility with the existing Business interface
}

export interface DeliveryLocation {
  _id: string;
  county: string;
  courier: string;
  price: number;
  payOnDelivery?: boolean;
  subcounty?: string;
  time?: number;
  description?: string;
  endpoint?: string;
  sameday?: boolean;
  nextday?: boolean;
  weightLimit?: number;
}

export interface PaymentOption {
  type: string;
  tillNumber?: string;
  storeNumber?: string;
  paybillNumber?: string;
  accountNumber?: string;
  name: string;
}

export interface CheckoutInfo {
  paymentOptions?: PaymentOption[];
  deliveryLocations?: DeliveryLocation[];
  counties?: string[];
  shipping?: {
    cutoffTime?: string;
    earliestShipTime?: string;
    handlingType?: string;
    handlingTime?: {
      unit?: string;
      amount?: number;
    };
  };
}

export interface POSInvoice {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  total: number;
  paymentCode?: string;
  date: string;
  county?: string;
  subcounty?: string;
  courier?: string;
  arrivalDate?: string;
  delivered?: boolean;
  requestReview?: boolean;
  pickupDescription?: string;
  paymentMode?: string;
  status?: string;
  review?: {
    submitted?: boolean;
    comment?: string;
    rating?: number;
    media?: Array<{
      link: string;
      type: string;
    }>;
  };
  items: OrderItem[];
}

export interface ReturnsPolicy {
  _id: string;
  businessId?: string;
  accept?: boolean;
  refundPurchaseShipping?: boolean;
  refundReturnShipping?: boolean;
  eligibility?: string[];
  raiseTimeline?: {
    unit?: string;
    amount?: number;
  };
  refundTimeline?: {
    unit?: string;
    amount?: number;
  };
  cashRefund?: boolean;
  replace?: boolean;
  fix?: boolean;
}

export interface ShippingPolicy {
  _id: string;
  accept?: boolean;
  businessId?: string;
  handlingTime?: {
    unit?: string;
    amount?: number;
  };
  guaranteeCourier?: boolean;
  handlingType?: string;
  cutoffTime?: string;
  earliestShipTime?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

// Request payload types
export interface UpdateProfileRequest {
  name: string;
  phone: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  data?: User;
  anonymous?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface ReturnRequest {
  orderId: string;
  reason: string;
  phone: string;
}

export interface MessageRequest {
  name: string;
  message: string;
  contact: string;
}

export interface AddToCartRequest {
  _id: string;
  price: number;
  size?: string;
  color?: string;
  selectedOption?: string;
  img: string;
  name: string;
  description: string;
}

export interface CheckoutRequest {
  single: boolean;
  cart: CartItem[];
  code: string;
  mode: string;
  total: number;
  courier: string;
  specifications?: string;
  fullDeliveryTime?: string;
}

export interface AnonymousCheckoutRequest extends CheckoutRequest {
  name: string;
  phone: string;
  email: string;
}

export interface RequestResetPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ProductReviewRequest {
  iid: string;
  oid: string;
  comment: string;
  stars: number;
  fileURLs: string[];
}

export interface LeadRequest {
  type: string;
  subject: string;
}

export interface VisitRequest {
  page?: string;
  visitorId?: string;
}

export interface POSInvoicePaymentRequest {
  iid: string;
  paymentCode: string;
  paymentMode: string;
}

export interface POSInvoiceReviewRequest {
  iid: string;
  comment: string;
  stars: number;
  fileURLs: string[];
}

// Font types for layout.tsx
export interface FontConfig {
  className: string;
  subsets: string[];
  weight?: string | number;
}

// Layout specific types
export interface RootLayoutProps {
  children: React.ReactNode;
}

// Landing Page Article Types
export interface LandingPageArticle {
  type:
    | "article"
    | "list"
    | "counter"
    | "title"
    | "link"
    | "carousel"
    | "video"
    | "banner-video";
  order: number;
  content: ArticleContent;
  visibility: boolean;
  _id?: string;
}

export type ArticleContent =
  | ArticleContentType
  | ListContentType
  | CounterContentType
  | TitleContentType
  | LinkContentType
  | CarouselContentType
  | VideoContentType
  | BannerVideoContentType;

// Article type - Standard article with title, content, and optional image
export interface ArticleContentType {
  title?: string;
  content?: string;
  image?: string;
}

// List type - List with title, intro, and items
export interface ListContentType {
  title?: string;
  intro?: string;
  items: string[];
}

// Counter type - Statistics/counter display
export interface CounterContentType {
  values: Array<{
    title: string;
    value: number;
    prefix?: string;
    suffix?: string;
  }>;
}

// Title type - Title with optional image background, title, and subtitle
export interface TitleContentType {
  title?: string;
  subtitle?: string;
  image?: string;
}

// Link type - Clickable link with text and URL
export interface LinkContentType {
  text: string;
  url?: string;
}

// Carousel type - Image carousel with multiple items
export interface CarouselContentType {
  title?: string;
  values: Array<{
    title?: string;
    description?: string;
    image?: string;
  }>;
}

// Video type - YouTube video embed with title and caption
export interface VideoContentType {
  title?: string;
  videoId: string;
  caption?: string;
  image?: string;
}

// Banner-Video type - Video with headline, tagline, and call-to-action buttons
export interface BannerVideoContentType {
  headline?: string;
  tagline?: string;
  videoId: string;
  manualLink?: string;
}
