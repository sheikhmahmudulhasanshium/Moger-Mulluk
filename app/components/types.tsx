// Define the structure of your JSON to avoid 'any'
export interface AppMessages {
  HomePage: { title: string; link: string };
  AboutPage: { title: string; link: string };
  FAQPage: { title: string; link: string };
  NoticePage: { title: string; link: string };
  Navigation: {
    stepInside: string;
    menu: string;
    locations: string;
    offers: string;
    gallery: string;
  };
}

export interface MItem { 
    id: string; 
    priceBDT: number; 
    stock: number; 
    unit_price: number; 
    tax: number; 
    vat: number; 
    export_price: number; 
    grand_total: number; 
    invoice: string; 
    uKey: 'c' | 'g'; 
    media:{
      thumbnail:string;
      gallery:string[];
    }
}

export interface LData { 
    c: string; 
    g: string; 
    vs: string; 
    fans: string; 
    ctaOrder: string; 
    ctaBook: string; 
    items: Record<string, { t: string; d: string; hb: string; o: string; f: string; }>; 
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export interface FAQData {
    title: string;
    items: FAQItem[];
}

export interface SeoData {
  keywords: string[];
  ogImage: string;
  isNoIndex: boolean;
}

export interface PageData {
  key: string;
  title: string;
  description: string;
  link: string;
  icon: string;
  video: string;
  seo: SeoData;
  /**
   * FIX: We replace 'any' with a union of the types 
   * returned by your NestJS transform service.
   * Your dynamic content labels are always strings.
   */
  [key: string]: string | SeoData | boolean | string[] | undefined;
}

/**
 * Specifically for your HomePage to get 
 * autocompletion without type errors.
 */
export interface HomePageData extends PageData {
  heroTagline: string;
  ctaExplore: string;
  icon: string;
}


export enum MediaPurpose {
  ANNOUNCEMENT = 'announcement',
  METADATA = 'metadata',
  LOGO = 'logo',
  BANNER = 'banner',
  EQUIPMENT = 'equipment',
  MENU_ITEM = 'menu-item',
  PROFILE = 'profile',
  MESSAGE = 'message',
  INVENTORY = 'inventory',
  EMPLOYEE = 'employee',
  ORDER = 'order',
  PRODUCT = 'product',
  CATEGORY = 'category',
  FEEDBACK = 'feedback',
  LEGAL = 'legal',
  GENERAL = 'general',
  GALLERY= 'gallery',
}

export interface Media {
  _id: string;
  name: string;
  url: string;
  publicId: string;
  format: string;
  resourceType: 'image' | 'video' | 'raw';
  width: number;
  height: number;
  aspectRatio: number;
  bytes: number;
  purpose: MediaPurpose;
  createdAt: string;
}

export interface MediaPaginatedResponse {
  data: Media[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
/**
 * 1. Supported Locales
 * Matches your 'localesConfig' in routing.ts
 */
export type Locale = 'en' | 'bn' | 'hi' | 'es';

/**
 * 2. Localized Data Helper
 * Ensures every text field has a value for all supported languages.
 */
export type Localized<T = string> = Record<Locale, T>;

/**
 * 3. Offer Types
 * Strict union for better filtering and logic on the frontend.
 */
export type OfferType = 
  | 'legendary' 
  | 'limited-time' 
  | 'one-time' 
  | 'royal' 
  | 'fitness' 
  | 'seasonal' 
  | 'bundle' 
  | 'lifestyle' 
  | 'referral' 
  | 'just-for-you';

/**
 * 4. Visual Styles
 * Used to apply gradients and maintain readability.
 */
export interface OfferStyle {
  background: string;    // CSS linear-gradient string
  textColor: string;     // High contrast hex code
  accentColor: string;   // Secondary color for buttons/icons
  tagBackground: string; // Contrast color for the discount tag
}

/**
 * 5. Master Offer Interface
 * Use this for the 'offers' array and MongoDB documents.
 */
export interface Offer {
  _id?: string;             // MongoDB unique identifier
  id: string;               // Your custom SKU (e.g., OFF_ADDA_001)
  type: OfferType;
  productIds: string[];     // References shortId from your products collection
  
  // Localized Content
  title: Localized;
  description: Localized;
  discount: Localized;
  conditions: Localized;
  
  // Promotion Logic
  promoCode?: string;       // Optional coupon code
  
  // Asset Management
  media: {
    image: string;          // Cloudinary/Asset URL
  };
  
  // Look & Feel
  style: OfferStyle;
  
  // Customization & Admin Control
  validFrom: string;        // ISO Date String
  validUntil: string;       // ISO Date String
  position: number;         // Sort order
  hide: boolean;            // Global visibility toggle
}

/**
 * 6. Component Prop Helper (Optional)
 * Useful when mapping through offers in a React Component.
 */
export interface OfferCardProps {
  offer: Offer;
  currentLocale: Locale;
}