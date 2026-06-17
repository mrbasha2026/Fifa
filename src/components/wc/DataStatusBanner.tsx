'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/lib/stores/wc-stores';
import { CheckCircle, X, RefreshCw, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SyncStatus {
  apiFootball: {
    configured: boolean;
    accountActive: boolean;
    error: string | null;
  };
  instructions: string;
}

export function DataStatusBanner() {
  const { lang } = useThemeStore();
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/sync/status')
      .then(r => r.json())
      .then(data => setStatus(data))
      .catch(() => setStatus(null));
  }, []);

  if (!status || dismissed) return null;

  const isActive = status.apiFootball.accountActive;
  const isSuspended = status.apiFootball.error?.includes('suspended');

  // If API is active, show a positive banner (briefly)
  if (isActive && !isSuspended) {
    return (
      <div className="border-b px-4 py-2 text-xs bg-[#006847]/15 border-[#006847]/40 text-foreground">
        <div className="mx-auto max-w-[1400px] flex items-center gap-3">
          <CheckCircle className="h-4 w-4 shrink-0 text-[#006847]" />
          <span className="font-bold flex-1">
            {lang === 'ar' ? '✅ البيانات حقيقية ومحدّثة من المصدر الرسمي' : '✅ Real data synced from official source'}
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-md hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // If API-Football is suspended, we use the open-source fallback data
  // — still real WC 2026 data, just not auto-updating live scores
  return (
    <div className={cn(
      'relative border-b px-4 py-2.5 text-xs',
      'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-foreground'
    )}>
      <div className="mx-auto max-w-[1400px] flex items-center gap-3">
        <CheckCircle className="h-4 w-4 shrink-0 text-[#D4AF37]" />
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="font-bold">
            {lang === 'ar' ? 'البيانات الحقيقية لكأس العالم 2026' : 'Real World Cup 2026 data'}
          </span>
          <span className="text-muted-foreground">
            {lang === 'ar'
              ? '48 منتخب · 104 مباراة · 16 ملعب — النتائج ستظهر مباشرة عند انطلاق البطولة (11 يونيو 2026)'
              : '48 teams · 104 matches · 16 stadiums — live scores will appear when tournament starts (June 11, 2026)'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://github.com/rezarahiminia/worldcup2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted hover:bg-muted/70 font-bold transition-colors"
            title={lang === 'ar' ? 'مصدر البيانات' : 'Data source'}
          >
            <ExternalLink className="h-3 w-3" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'المصدر' : 'Source'}</span>
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-md hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

