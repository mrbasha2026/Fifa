'use client';

import { useEffect, useState } from 'react';
import { useNavStore, useThemeStore } from '@/lib/stores/wc-stores';
import {
  getLiveMatches, getUpcomingMatches, getRecentResults,
  getTopScorers, getAllStandings,
} from '@/lib/wc/supabase-client';
import { TEAM_BY_ID } from '@/lib/wc/data';
import { t } from '@/lib/wc/i18n';
import type { Match, StandingsRow } from '@/lib/wc/types';
import { MatchCard, MatchCardSkeleton, TeamLogo, LocalizedTeamName } from '@/components/wc/MatchCard';
import { SectionHeader } from '@/components/wc/SectionHeader';
import { CountdownTimer } from '@/components/wc/CountdownTimer';
import { ChevronLeft, ChevronRight, Trophy, Target, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

type TopScorerRow = Awaited<ReturnType<typeof getTopScorers>>[number];

export function HomePage() {
  const { go } = useNavStore();
  const { lang, dir } = useThemeStore();
  const [live, setLive] = useState<Match[] | null>(null);
  const [upcoming, setUpcoming] = useState<Match[] | null>(null);
  const [results, setResults] = useState<Match[] | null>(null);
  const [scorers, setScorers] = useState<TopScorerRow[] | null>(null);
  const [standings, setStandings] = useState<Record<string, StandingsRow[]> | null>(null);

  useEffect(() => {
    getLiveMatches().then(setLive);
    getUpcomingMatches(6).then(setUpcoming);
    getRecentResults(6).then(setResults);
    getTopScorers(8).then(setScorers);
    getAllStandings().then(setStandings);
  }, []);

  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <HeroBanner />

      {/* Countdown to next match */}
      {upcoming && upcoming.length > 0 && (
        <CountdownTimer nextMatch={upcoming[0]} />
      )}

      {/* Live matches */}
      <section>
        <SectionHeader
          icon={<Activity className="h-4 w-4 text-[#C8102E]" />}
          title={t('liveMatches', lang)}
          onAction={live && live.length > 0 ? () => go('matches') : undefined}
        />
        {live === null ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(2)].map((_, i) => <MatchCardSkeleton key={i} />)}
          </div>
        ) : live.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-sm">{t('noLiveMatches', lang)}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {live.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        )}
      </section>

      {/* Upcoming + Recent (two columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <SectionHeader
            icon={<Target className="h-4 w-4 text-[#F5C542]" />}
            title={t('upcomingMatches', lang)}
            onAction={upcoming && upcoming.length > 0 ? () => go('matches') : undefined}
          />
          {upcoming === null ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => <MatchCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {upcoming.slice(0, 4).map(m => <MatchCard key={m.id} match={m} variant="compact" />)}
            </div>
          )}
        </section>

        <section>
          <SectionHeader
            icon={<Trophy className="h-4 w-4 text-[#F5C542]" />}
            title={t('latestResults', lang)}
            onAction={results && results.length > 0 ? () => go('matches') : undefined}
          />
          {results === null ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => <MatchCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.slice(0, 4).map(m => <MatchCard key={m.id} match={m} variant="compact" />)}
            </div>
          )}
        </section>
      </div>

      {/* Top scorers + Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1">
          <SectionHeader
            icon={<Target className="h-4 w-4 text-[#F5C542]" />}
            title={t('topScorersTitle', lang)}
            onAction={() => go('top-scorers')}
          />
          {scorers === null ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="glass-card rounded-lg p-3 animate-pulse flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="flex-1"><div className="h-3 w-24 bg-muted rounded" /></div>
                  <div className="h-3 w-8 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {scorers.slice(0, 6).map((row, idx) => {
                const team = row.team ?? TEAM_BY_ID[row.team_id];
                return (
                  <div
                    key={row.player_id}
                    className="glass-card rounded-lg p-3 flex items-center gap-3 hover:border-[#F5C542]/40 transition-colors cursor-pointer"
                    onClick={() => go('top-scorers')}
                  >
                    <div className={cn(
                      'h-7 w-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0',
                      idx === 0 ? 'bg-[#F5C542] text-[#0B1F3B]' :
                      idx === 1 ? 'bg-[#C0C0C0] text-[#0B1F3B]' :
                      idx === 2 ? 'bg-[#CD7F32] text-white' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {idx + 1}
                    </div>
                    <TeamLogo team={team} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">
                        {lang === 'ar' ? row.player?.name_ar : row.player?.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        <LocalizedTeamName team={team} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-[#F5C542] tabular-nums">{row.goals}</div>
                      <div className="text-[9px] text-muted-foreground uppercase">{t('goals', lang)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="lg:col-span-2">
          <SectionHeader
            icon={<Trophy className="h-4 w-4 text-[#F5C542]" />}
            title={t('groupOverview', lang)}
            onAction={() => go('groups')}
          />
          {standings === null ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card rounded-xl p-4 animate-pulse h-44" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(standings).slice(0, 6).map(([group, rows]) => (
                <GroupMiniCard key={group} group={group} rows={rows} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function GroupMiniCard({ group, rows }: { group: string; rows: StandingsRow[] }) {
  const { lang } = useThemeStore();
  const { go } = useNavStore();
  return (
    <div
      className="glass-card rounded-xl p-3 cursor-pointer hover:scale-[1.02] transition-transform"
      onClick={() => go('groups', { group })}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {t('group', lang)} {group}
        </span>
        <Trophy className="h-3 w-3 text-[#F5C542]" />
      </div>
      <div className="space-y-1">
        {rows.slice(0, 4).map((row, idx) => {
          const team = TEAM_BY_ID[row.team_id];
          const qualified = idx < 2;
          return (
            <div key={row.id} className="flex items-center gap-2 py-1">
              <span className={cn(
                'w-1 h-6 rounded-full',
                qualified ? 'bg-[#10B981]' : 'bg-muted'
              )} />
              <TeamLogo team={team} size="xs" />
              <div className="flex-1 text-xs font-semibold truncate">
                <LocalizedTeamName team={team} />
              </div>
              <div className="text-xs font-bold tabular-nums">{row.points}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HeroBanner() {
  const { lang } = useThemeStore();
  const { go } = useNavStore();
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60">
      {/* Background gradient + pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3B] via-[#0B0F19] to-[#1a0a0d]" />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(245,197,66,0.3) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(200,16,46,0.3) 0%, transparent 40%)',
      }} />

      {/* Decorative trophy */}
      <div className="absolute -right-8 -top-8 text-[180px] opacity-10 select-none rotate-12">🏆</div>
      <div className="absolute -left-4 -bottom-8 text-[120px] opacity-10 select-none -rotate-12">⚽</div>

      <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center md:text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542]/15 border border-[#F5C542]/30 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] pulse-dot" />
            <span className="text-[11px] font-bold text-[#F5C542] tracking-wider">
              {lang === 'ar' ? '11 يونيو - 19 يوليو 2026' : 'June 11 - July 19, 2026'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-2">
            <span className="bg-gradient-to-r from-white via-[#F5C542] to-white bg-clip-text text-transparent">
              {lang === 'ar' ? 'كأس العالم 2026' : 'World Cup 2026'}
            </span>
          </h1>
          <p className="text-sm md:text-base text-white/70 mb-4 max-w-xl">
            {lang === 'ar'
              ? '48 منتخبًا · 12 مجموعة · 104 مباراة. عش الإثارة من كندا والمكسيك والولايات المتحدة.'
              : '48 teams · 12 groups · 104 matches. Experience the thrill across Canada, Mexico, and the USA.'}
          </p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <button
              onClick={() => go('knockout')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C8102E] to-[#a30d24] text-white font-bold text-sm shadow-lg shadow-[#C8102E]/30 hover:scale-105 transition-transform"
            >
              {lang === 'ar' ? 'شجرة الإقصاء' : 'Knockout Bracket'}
            </button>
            <button
              onClick={() => go('matches')}
              className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-colors"
            >
              {lang === 'ar' ? 'كل المباريات' : 'All Matches'}
            </button>
            <button
              onClick={() => go('groups')}
              className="px-4 py-2 rounded-lg bg-[#F5C542]/20 backdrop-blur border border-[#F5C542]/40 text-[#F5C542] font-bold text-sm hover:bg-[#F5C542]/30 transition-colors"
            >
              {lang === 'ar' ? 'ترتيب المجموعات' : 'Group Standings'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {[
            { value: '48', label: lang === 'ar' ? 'منتخب' : 'Teams', color: 'text-[#F5C542]' },
            { value: '104', label: lang === 'ar' ? 'مباراة' : 'Matches', color: 'text-white' },
            { value: '16', label: lang === 'ar' ? 'مدينة' : 'Cities', color: 'text-[#C8102E]' },
          ].map((stat, i) => (
            <div key={i} className="text-center px-3 md:px-5 py-3 md:py-4 rounded-xl bg-white/5 backdrop-blur border border-white/10">
              <div className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] md:text-xs text-white/60 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
