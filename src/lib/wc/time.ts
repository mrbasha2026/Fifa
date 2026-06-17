'use client';

// ============================================================
// Time helpers — convert ISO dates to user timezone (Asia/Riyadh default)
// All dates stored as UTC ISO strings; display layer converts.
// ============================================================

import { useThemeStore } from '@/lib/stores/wc-stores';

const DEFAULT_TZ = 'Asia/Riyadh';

function getUserTZ(): string {
  try {
    if (typeof navigator !== 'undefined' && navigator.language) {
      // Use Intl to detect user timezone if available
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) return tz;
    }
  } catch {}
  return DEFAULT_TZ;
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
  // Get date in user TZ as YYYY-MM-DD
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

// React hook for components that need to re-render on lang change
export function useLocalizedTime() {
  const { lang } = useThemeStore();
  return {
    formatDateTime: (iso: string) => formatDateTime(iso, lang),
    formatTime: (iso: string) => formatTime(iso, lang),
    formatDate: (iso: string) => formatDate(iso, lang),
  };
}
