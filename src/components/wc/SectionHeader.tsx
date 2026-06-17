'use client';

import { useThemeStore } from '@/lib/stores/wc-stores';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SectionHeader({
  icon,
  title,
  onAction,
  actionLabel,
}: {
  icon?: React.ReactNode;
  title: string;
  onAction?: () => void;
  actionLabel?: string;
}) {
  const { lang, dir } = useThemeStore();
  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="flex items-center gap-2 text-base md:text-lg font-extrabold tracking-tight">
        {icon}
        <span>{title}</span>
      </h2>
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-0.5 text-xs font-bold text-muted-foreground hover:text-[#F5C542] transition-colors"
        >
          <span>{actionLabel ?? (lang === 'ar' ? 'عرض الكل' : 'View all')}</span>
          <Chevron className="h-3.5 w-3.5 rtl-flip" />
        </button>
      )}
    </div>
  );
}

export function PageTitle({
  icon,
  title,
  subtitle,
  actions,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        {icon && (
          <div className={cn(
            'h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center',
            'bg-gradient-to-br from-[#C8102E]/20 to-[#F5C542]/20 border border-[#C8102E]/30'
          )}>
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
