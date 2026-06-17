'use client';

import { cn } from '@/lib/utils';
import { TEAM_BY_ID, STADIUM_BY_ID } from '@/lib/wc/data';
import type { Match, Team } from '@/lib/wc/types';
import { useNavStore, useFavoritesStore, useThemeStore } from '@/lib/stores/wc-stores';
import { t } from '@/lib/wc/i18n';
import { formatTime, formatDate, formatDateTime } from '@/lib/wc/time';
import { Heart, MapPin } from 'lucide-react';

export function TeamLogo({
  team,
  size = 'md',
  showName = false,
}: {
  team?: Team | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
}) {
  if (!team) {
    return (
      <div className={cn(
        'rounded-full bg-muted/60 border border-dashed border-border/50 flex items-center justify-center text-muted-foreground/70 font-bold',
        size === 'xs' && 'h-6 w-6 text-[8px]',
        size === 'sm' && 'h-8 w-8 text-[9px]',
        size === 'md' && 'h-10 w-10 text-[10px]',
        size === 'lg' && 'h-14 w-14 text-xs',
        size === 'xl' && 'h-20 w-20 text-sm',
      )}>
        TBD
      </div>
    );
  }
  const sizeCls = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  }[size];

  return (
    <div className="flex items-center gap-2">
      <div className={cn('rounded-full bg-card/60 border border-border/50 flex items-center justify-center shrink-0 overflow-hidden', sizeCls)}>
        <img
          src={team.flag}
          alt={team.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement!.textContent = team.fifa_code;
          }}
        />
      </div>
      {showName && (
        <div className="leading-tight">
          <div className="text-sm font-bold truncate max-w-[110px]">
            <LocalizedTeamName team={team} />
          </div>
          {team.fifa_code && (
            <div className="text-[10px] text-muted-foreground font-mono">{team.fifa_code}</div>
          )}
        </div>
      )}
    </div>
  );
}

export function LocalizedTeamName({ team }: { team?: Team | null }) {
  const { lang } = useThemeStore();
  if (!team) return <span className="text-muted-foreground/60 italic text-xs">{lang === 'ar' ? 'بانتظار التحديد' : 'TBD'}</span>;
  return <>{lang === 'ar' ? team.name_ar : team.name}</>;
}

export function StatusBadge({ match, small = false }: { match: Match; small?: boolean }) {
  const { lang } = useThemeStore();
  let label: string;
  let cls: string;

  switch (match.status) {
    case 'LIVE':
      label = `${t('live', lang)} ${match.minute ? match.minute + t('minute', lang) : ''}`;
      cls = 'bg-[#C8102E] text-white live-pulse';
      break;
    case 'HT':
      label = lang === 'ar' ? 'استراحة' : 'HT';
      cls = 'bg-[#F5C542] text-[#0B1F3B]';
      break;
    case 'FT':
      label = t('finished', lang);
      cls = 'bg-muted text-muted-foreground';
      break;
    case 'AET':
      label = lang === 'ar' ? 'بعد التمديد' : 'AET';
      cls = 'bg-muted text-muted-foreground';
      break;
    case 'PEN':
      label = lang === 'ar' ? 'ركلات جزاء' : 'PEN';
      cls = 'bg-[#F5C542] text-[#0B1F3B]';
      break;
    case 'NS':
    default:
      const time = formatTime(match.date, lang);
      const date = formatDate(match.date, lang);
      // Always show date + time for clarity (even in small mode)
      label = `${date} · ${time}`;
      cls = 'bg-secondary text-secondary-foreground border border-border';
      break;
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide',
      cls,
      small && 'px-1.5 py-0.5 text-[9px]'
    )}>
      {match.status === 'LIVE' && <span className="h-1.5 w-1.5 rounded-full bg-white pulse-dot" />}
      {label}
    </span>
  );
}

export function MatchScore({ match, large = false }: { match: Match; large?: boolean }) {
  const { home_score, away_score, status } = match;
  const showScore = status !== 'NS' && home_score !== null && away_score !== null;
  const sizeCls = large ? 'text-3xl font-black' : 'text-2xl font-extrabold';

  if (!showScore) {
    return <span className={cn(sizeCls, 'text-muted-foreground/60')}>–</span>;
  }
  return (
    <span className={cn(sizeCls, 'tabular-nums')}>
      {home_score}
      <span className="text-muted-foreground/50 mx-1">:</span>
      {away_score}
    </span>
  );
}

export function MatchCard({
  match,
  variant = 'default',
}: {
  match: Match;
  variant?: 'default' | 'compact' | 'large';
}) {
  const { go } = useNavStore();
  const { lang } = useThemeStore();
  const { isFavorite, toggle } = useFavoritesStore();
  const home = TEAM_BY_ID[match.home_team_id];
  const away = TEAM_BY_ID[match.away_team_id];
  const fav = isFavorite('match', match.id);
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FT' || match.status === 'AET' || match.status === 'PEN';
  const winnerHome = isFinished && match.winner_id && match.winner_id === match.home_team_id;
  const winnerAway = isFinished && match.winner_id && match.winner_id === match.away_team_id;
  const hasWaiting = !home || !away;

  const roundLabel = (() => {
    if (match.round === 'group') return match.group ? `${t('group', lang)} ${match.group}` : t('groupStage', lang);
    const map: Record<string, { ar: string; en: string }> = {
      R32: { ar: 'دور الـ32', en: 'R32' },
      R16: { ar: 'دور الـ16', en: 'R16' },
      QF: { ar: 'ربع النهائي', en: 'QF' },
      SF: { ar: 'نصف النهائي', en: 'SF' },
      FINAL: { ar: 'النهائي', en: 'Final' },
      THIRD: { ar: 'المركز الثالث', en: '3rd Place' },
    };
    return lang === 'ar' ? map[match.round].ar : map[match.round].en;
  })();

  return (
    <div
      className={cn(
        'glass-card rounded-xl p-4 transition-all duration-300 group cursor-pointer hover:scale-[1.02] hover:border-[#C8102E]/40 hover:shadow-lg hover:shadow-[#C8102E]/10',
        isLive && 'border-[#C8102E]/40 shadow-md shadow-[#C8102E]/15',
        variant === 'compact' && 'p-3'
      )}
      onClick={() => go('match-details', { id: match.id })}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {roundLabel}
        </span>
        <div className="flex items-center gap-2">
          <StatusBadge match={match} small />
          <button
            onClick={(e) => { e.stopPropagation(); toggle('match', match.id); }}
            className={cn(
              'h-6 w-6 rounded-full flex items-center justify-center transition-colors',
              fav ? 'text-[#C8102E]' : 'text-muted-foreground/40 hover:text-foreground'
            )}
          >
            <Heart className={cn('h-3.5 w-3.5', fav && 'fill-current')} />
          </button>
        </div>
      </div>

      {/* Teams + score */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* Home */}
        <div className="flex flex-col items-center gap-2">
          <TeamLogo team={home} size={variant === 'compact' ? 'sm' : 'md'} />
          <div className="text-center">
            <div className={cn('text-xs font-bold truncate max-w-[90px]', !winnerHome && isFinished && 'opacity-60')}>
              <LocalizedTeamName team={home} />
            </div>
            {winnerHome && <div className="text-[9px] text-[#F5C542] font-bold">★ {t('winner', lang)}</div>}
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center">
          <MatchScore match={match} large={variant === 'large'} />
          {isLive && (
            <div className="text-[10px] font-bold text-[#C8102E] mt-1 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8102E] pulse-dot" />
              {match.minute}'
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-2">
          <TeamLogo team={away} size={variant === 'compact' ? 'sm' : 'md'} />
          <div className="text-center">
            <div className={cn('text-xs font-bold truncate max-w-[90px]', !winnerAway && isFinished && 'opacity-60')}>
              <LocalizedTeamName team={away} />
            </div>
            {winnerAway && <div className="text-[9px] text-[#F5C542] font-bold">★ {t('winner', lang)}</div>}
          </div>
        </div>
      </div>

      {/* Footer info */}
      {variant !== 'compact' && match.stadium_id && (
        <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">
            {(() => {
              const s = STADIUM_BY_ID[match.stadium_id!];
              if (!s) return '';
              return `${lang === 'ar' ? s.name_ar : s.name}, ${lang === 'ar' ? s.city_ar : s.city}`;
            })()}
          </span>
        </div>
      )}
    </div>
  );
}

// ===== Skeleton loaders =====
export function MatchCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-4 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-3 w-16 bg-muted rounded" />
        <div className="h-3 w-12 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="h-3 w-14 bg-muted rounded" />
        </div>
        <div className="h-8 w-12 bg-muted rounded" />
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="h-3 w-14 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

export function TeamCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-muted" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-muted rounded mb-2" />
          <div className="h-3 w-16 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
