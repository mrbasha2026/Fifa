'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/lib/stores/wc-stores';
import { AlertTriangle, X, RefreshCw, ExternalLink } from 'lucide-react';
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

  // If API is active and working, don't show banner
  if (isActive && !isSuspended) return null;

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sync/status');
      const data = await res.json();
      setStatus(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      'relative border-b px-4 py-2.5 text-xs',
      isSuspended
        ? 'bg-[#BF0A30]/15 border-[#BF0A30]/40 text-foreground'
        : 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-foreground'
    )}>
      <div className="mx-auto max-w-[1400px] flex items-center gap-3">
        <AlertTriangle className={cn('h-4 w-4 shrink-0', isSuspended ? 'text-[#BF0A30]' : 'text-[#D4AF37]')} />
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="font-bold">
            {lang === 'ar' ? 'البيانات المعروضة تجريبية' : 'Showing demo data'}
          </span>
          <span className="text-muted-foreground">
            {isSuspended
              ? (lang === 'ar'
                  ? 'حساب API-Football معلّق — يجب تفعيله لجلب البيانات الحقيقية المباشرة'
                  : 'API-Football account is suspended — activate it to fetch real live data')
              : (lang === 'ar'
                  ? 'لم يتم تكوين API-Football بشكل صحيح'
                  : 'API-Football is not configured')}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://dashboard.api-football.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#D4AF37] text-[#050505] font-bold hover:bg-[#E5BC44] transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'تفعيل الحساب' : 'Activate'}</span>
          </a>
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted hover:bg-muted/70 font-bold transition-colors disabled:opacity-50"
            title={lang === 'ar' ? 'إعادة فحص الحالة' : 'Re-check status'}
          >
            <RefreshCw className={cn('h-3 w-3', loading && 'animate-spin')} />
          </button>
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
