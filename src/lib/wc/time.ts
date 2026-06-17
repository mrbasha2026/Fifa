'use client';

// ============================================================
// Time helpers — convert ISO dates to user timezone
// Default: Asia/Riyadh (user's timezone)
// User can change timezone via settings
// ============================================================

import { useThemeStore } from '@/lib/stores/wc-stores';

const DEFAULT_TZ = 'Asia/Riyadh';
const STORAGE_KEY = 'wc-timezone';

export function getUserTZ(): string {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
    }
  } catch {}
  return DEFAULT_TZ;
}

export function setUserTZ(tz: string) {
  try {
    localStorage.setItem(STORAGE_KEY, tz);
  } catch {}
}

export function formatDateTime(iso: string, lang: 'ar' | 'en' = 'ar'): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const tz = getUserTZ();
    const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
    return d.toLocaleString(locale, {
      timeZone: tz,
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return iso;
  }
}

export function formatTime(iso: string, lang: 'ar' | 'en' = 'ar'): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const tz = getUserTZ();
    const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
    return d.toLocaleTimeString(locale, {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return iso;
  }
}

export function formatDate(iso: string, lang: 'ar' | 'en' = 'ar'): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const tz = getUserTZ();
    const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
    return d.toLocaleDateString(locale, {
      timeZone: tz,
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return iso;
  }
}

export function getDateKey(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const tz = getUserTZ();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(d);
  const y = parts.find(p => p.type === 'year')?.value ?? '';
  const m = parts.find(p => p.type === 'month')?.value ?? '';
  const day = parts.find(p => p.type === 'day')?.value ?? '';
  return `${y}-${m}-${day}`;
}

export function getUserTimezoneLabel(): string {
  return getUserTZ();
}

// Get timezone offset label for display (e.g., "UTC+3")
export function getTimezoneOffset(): string {
  const tz = getUserTZ();
  try {
    const now = new Date();
    const offset = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value || '';
    return offset;
  } catch {
    return 'UTC+3';
  }
}

// Countdown helper — returns time remaining until target date
export function getCountdown(targetIso: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
} {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: false };
}

// React hook for components that need to re-render on lang change
export function useLocalizedTime() {
  const { lang } = useThemeStore();
  return {
    formatDateTime: (iso: string) => formatDateTime(iso, lang),
    formatTime: (iso: string) => formatTime(iso, lang),
    formatDate: (iso: string) => formatDate(iso, lang),
  };
}
