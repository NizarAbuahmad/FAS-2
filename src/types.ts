/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Admin' | 'Editor' | 'Viewer';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  password?: string;
}

export interface Post {
  id: string;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  date: string;
  categoryEn: string;
  categoryAr: string;
  authorEn: string;
  authorAr: string;
  published: boolean;
  views: number;
}

export interface CarouselSlide {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  image: string;
  link: string;
  order: number;
}

export interface ContactDetails {
  phone: string;
  altPhone: string;
  email: string;
  notificationEmail: string;
  addressEn: string;
  addressAr: string;
  workingHoursEn: string;
  workingHoursAr: string;
  socialFacebook: string;
  socialInstagram: string;
  socialLinkedin: string;
  socialYoutube: string;
  socialX: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string; // can be base64 or relative url
  size: number; // in bytes
  type: string;
  uploadedAt: string;
  optimized: boolean;
  width?: number;
  height?: number;
}

export interface AnalyticsSummary {
  totalPageviews: number;
  totalSessions: number;
  bounceRate: number; // percentage
  avgSessionDuration: string; // e.g. "2m 14s"
  activeUsersNow: number;
  pagesList: Array<{ path: string; nameEn: string; nameAr: string; views: number }>;
  referrers: Array<{ source: string; count: number }>;
  devices: Array<{ name: string; value: number }>;
  dailyTraffic: Array<{ date: string; pageviews: number; visitors: number }>;
}

export interface CustomPage {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  published: boolean;
  nav: boolean;
  createdAt: string;
}

export interface SiteText {
  key: string;
  valueEn: string;
  valueAr: string;
}

export interface GalleryItem {
  id: string;
  titleEn: string;
  titleAr: string;
  image: string; // can be unspash image, base64 or media url
  categoryEn: string;
  categoryAr: string;
  order: number;
}
