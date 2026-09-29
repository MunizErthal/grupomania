/**
 * Everything the owner can change from the admin panel lives in this model.
 * The public site only ever reads it; the admin only ever writes it.
 */

/** 'HH:MM' in 24h format, Brazil time (America/Sao_Paulo). */
export type ClockTime = string;

export interface TimeRange {
  open: ClockTime;
  close: ClockTime;
}

/** Delivery window per day type. `null` means closed that day. */
export interface WeeklyHours {
  weekdays: TimeRange | null;
  saturday: TimeRange | null;
  sunday: TimeRange | null;
}

export type ProductLine = 'gas' | 'agua';

export interface DeliveryHours {
  gas: WeeklyHours;
  agua: WeeklyHours;
  note: string;
}

export interface Brand {
  groupName: string;
  foundedOn: string; // ISO date
  city: string;
  landline: string;
  whatsapp: string;
  instagram: string;
  linktree: string;
  footerLine: string;
}

export interface Hero {
  title: string;
  lead: string;
  videoUrl: string;
  posterUrl: string;
  primaryLabel: string;
}

export interface Depot {
  id: string;
  name: string;
  tagline: string;
  city: string;
  street: string;
  district: string;
  zip: string;
  whatsapp: string;
  landline: string;
  instagram: string;
  mapsUrl: string;
  logoUrl: string;
  neighborhoods: string;
  selfService24h: boolean;
  isHeadquarters: boolean;
}

export interface CylinderSize {
  code: string; // P13
  kg: string; // 13 kg
  use: string;
}

export interface GasChapter {
  title: string;
  lead: string;
  sizes: CylinderSize[];
  services: string[];
  imageUrl: string;
  secondaryImageUrl: string;
}

export interface WaterChapter {
  title: string;
  lead: string;
  brands: string[];
  items: string[];
  services: string[];
  imageUrl: string;
  cutoutUrl: string;
}

export interface SelfServiceStation {
  title: string;
  lead: string;
  bullets: string[];
  promo: string;
  address: string;
  imageUrl: string;
}

export interface SafetyTip {
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface About {
  title: string;
  body: string;
  testimonial: string;
  testimonialAuthor: string;
  imageUrl: string;
  secondaryImageUrl: string;
}

export interface Photo {
  url: string;
  alt: string;
}

export interface SiteContent {
  version: number;
  updatedAt: string;
  brand: Brand;
  hero: Hero;
  hours: DeliveryHours;
  depots: Depot[];
  gas: GasChapter;
  water: WaterChapter;
  station: SelfServiceStation;
  safety: SafetyTip[];
  about: About;
  faq: FaqItem[];
  gallery: Photo[];
  payments: string[];
}

export type ContentSectionKey = Exclude<keyof SiteContent, 'version' | 'updatedAt'>;
