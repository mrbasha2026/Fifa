'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/lib/stores/wc-stores';
import { getCountdown, formatDateTime } from '@/lib/wc/time';
import { AlarmClock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Match } from '@/lib/wc/types';
import { TEAM_BY_ID } from '@/lib/wc/data';
import { LocalizedTeamName } from '@/components/wc/MatchCard';

export function CountdownTimer({ nextMatch }: { nextMatch: Match | null }) {
  const { lang } = useThemeStore();
  const [countdown, setCountdown] = useState(() => nextMatch ? getCountdown(nextMatch.date) : null);

  useEffect(() => {
    if (!nextMatch) return;
    const update = () => setCountdown(getCountdown(nextMatch.date));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [nextMatch]);

  if (!nextMatch || !countdown || countdown.isPast) return null;

  const home = TEAM_BY_ID[nextMatch.home_team_id];
  const away = TEAM_BY_ID[nextMatch.away_team_id];

  const boxes = [
    { value: countdown.days, label: lang === 'ar' ? 'يوم' : 'Days' },
    { value: countdown.hours, label: lang === 'ar' ? 'ساعة' : 'Hours' },
    { value: countdown.minutes, label: lang === 'ar' ? 'دقيقة' : 'Min' },
    { value: countdown.seconds, label: lang === 'ar' ? 'ثانية' : 'Sec' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/30 glass-card">
      <div className="absolute inset-0 bg-gradient-to-br from-[#3C3B6E]/20 via-transparent to-[#D4AF37]/10" />
      <div className="relative p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
            <AlarmClock className="h-4 w-4 text-[#D4AF37]" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
              {lang === 'ar' ? 'المباراة القادمة' : 'Next Match'}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {formatDateTime(nextMatch.date, lang)}
            </div>
          </div>
        </div>

        {/* Teams */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-4">
          <div className="flex flex-col items-center gap-1.5">
            {home && <img src={home.flag} alt="" className="h-8 w-12 rounded object-cover" />}
            <span className="text-xs font-bold truncate max-w-[80px] text-center">
              <LocalizedTeamName team={home} />
            </span>
          </div>
          <div className="text-xs font-black text-muted-foreground">VS</div>
          <div className="flex flex-col items-center gap-1.5">
            {away && <img src={away.flag} alt="" className="h-8 w-12 rounded object-cover" />}
            <span className="text-xs font-bold truncate max-w-[80px] text-center">
              <LocalizedTeamName team={away} />
            </span>
          </div>
        </div>

        {/* Countdown boxes */}
        <div className="grid grid-cols-4 gap-2">
          {boxes.map((box, i) => (
            <div
              key={i}
              className={cn(
                'rounded-lg p-2 text-center',
                i === 3 ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/30' : 'bg-card/60'
              )}
            >
              <div className={cn(
                'text-2xl md:text-3xl font-black tabular-nums',
                i === 3 ? 'text-[#D4AF37]' : 'text-foreground'
              )} dir="ltr">
                {String(box.value).padStart(2, '0')}
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground mt-0.5">
                {box.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
