'use client';

import { useEffect, useState } from 'react';
import { useNavStore, useThemeStore } from '@/lib/stores/wc-stores';
import { getMatchById, getMatchStatistics, getMatchLineups, getEventsByMatch } from '@/lib/wc/supabase-client';
import { TEAM_BY_ID, PLAYER_BY_ID, STADIUM_BY_ID } from '@/lib/wc/data';
import { t } from '@/lib/wc/i18n';
import { formatDateTime } from '@/lib/wc/time';
import type { Match, MatchStatistics, MatchLineup, MatchEvent } from '@/lib/wc/types';
import { TeamLogo, LocalizedTeamName, MatchScore, StatusBadge } from '@/components/wc/MatchCard';
import { PageTitle } from '@/components/wc/SectionHeader';
import { FavoriteButton } from '@/components/wc/FavoriteButton';
import {
  ArrowLeft, ArrowRight, MapPin, User, Goal as GoalIcon,
  Square, Repeat, Star, Activity, BarChart3, Users as UsersIcon, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MatchDetailsPage({ matchId }: { matchId: string }) {
  const { go, back } = useNavStore();
  const { lang, dir } = useThemeStore();
  const [match, setMatch] = useState<Match | null>(null);
  const [stats, setStats] = useState<MatchStatistics | null>(null);
  const [lineups, setLineups] = useState<MatchLineup[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [tab, setTab] = useState<'stats' | 'lineups' | 'events'>('stats');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getMatchById(matchId),
      getMatchStatistics(matchId),
      getMatchLineups(matchId),
      getEventsByMatch(matchId),
    ]).then(([m, s, l, e]) => {
      if (cancelled) return;
      setMatch(m);
      setStats(s);
      setLineups(l);
      setEvents(e);
    });
    return () => { cancelled = true; };
  }, [matchId]);

  const loading = match === null;

  if (loading || !match) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="glass-card rounded-xl p-6 h-32 animate-pulse" />
        <div className="glass-card rounded-xl p-6 h-64 animate-pulse" />
      </div>
    );
  }

  const home = TEAM_BY_ID[match.home_team_id];
  const away = TEAM_BY_ID[match.away_team_id];
  const Back = dir === 'rtl' ? ArrowRight : ArrowLeft;

  const mom = match.man_of_the_match ? PLAYER_BY_ID[match.man_of_the_match] : null;
  const sortedEvents = [...events].sort((a, b) => a.minute - b.minute);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={back}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Back className="h-4 w-4" />
        {t('back', lang)}
      </button>

      {/* Match hero card */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 glass-card">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3B]/40 via-transparent to-[#C8102E]/20" />
        <div className="relative p-6 md:p-8">
          {/* Round + status */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {match.round === 'group' && match.group ? `${t('group', lang)} ${match.group}` :
               match.round === 'R32' ? t('roundOf32', lang) :
               match.round === 'R16' ? t('round16', lang) :
               match.round === 'QF' ? t('quarterFinals', lang) :
               match.round === 'SF' ? t('semiFinals', lang) :
               match.round === 'FINAL' ? t('finalMatch', lang) :
               match.round === 'THIRD' ? t('thirdPlaceMatch', lang) : ''}
            </span>
            <div className="flex items-center gap-2">
              <StatusBadge match={match} />
              <FavoriteButton kind="match" id={match.id} />
            </div>
          </div>

          {/* Teams + score */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8">
            <button
              onClick={() => home && go('team-details', { id: home.id })}
              className="flex flex-col items-center gap-3 group"
            >
              <TeamLogo team={home} size="xl" />
              <div className="text-center">
                <div className="text-base md:text-lg font-extrabold group-hover:text-[#F5C542] transition-colors">
                  <LocalizedTeamName team={home} />
                </div>
                {home?.fifa_code && <div className="text-xs text-muted-foreground font-mono">{home.fifa_code}</div>}
              </div>
            </button>

            <div className="flex flex-col items-center gap-2">
              <MatchScore match={match} large />
              {match.status === 'LIVE' && match.minute && (
                <div className="flex items-center gap-1.5 text-[#C8102E] font-bold text-sm">
                  <span className="h-2 w-2 rounded-full bg-[#C8102E] pulse-dot" />
                  {match.minute}'
                </div>
              )}
              {match.status === 'PEN' && (
                <div className="text-xs text-[#F5C542] font-bold">PEN</div>
              )}
            </div>

            <button
              onClick={() => away && go('team-details', { id: away.id })}
              className="flex flex-col items-center gap-3 group"
            >
              <TeamLogo team={away} size="xl" />
              <div className="text-center">
                <div className="text-base md:text-lg font-extrabold group-hover:text-[#F5C542] transition-colors">
                  <LocalizedTeamName team={away} />
                </div>
                {away?.fifa_code && <div className="text-xs text-muted-foreground font-mono">{away.fifa_code}</div>}
              </div>
            </button>
          </div>

          {/* Match meta */}
          <div className="mt-6 pt-6 border-t border-border/40 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <MetaItem icon={<MapPin className="h-3.5 w-3.5" />} label={t('stadium', lang)} value={match.stadium_id ? (lang === 'ar' ? STADIUM_BY_ID[match.stadium_id]?.name_ar : STADIUM_BY_ID[match.stadium_id]?.name) ?? '—' : '—'} />
            <MetaItem icon={<MapPin className="h-3.5 w-3.5" />} label={t('city', lang)} value={match.stadium_id ? (lang === 'ar' ? STADIUM_BY_ID[match.stadium_id]?.city_ar : STADIUM_BY_ID[match.stadium_id]?.city) ?? '—' : '—'} />
            <MetaItem icon={<User className="h-3.5 w-3.5" />} label={t('referee', lang)} value={match.referee ?? '—'} />
            <MetaItem
              icon={<Clock className="h-3.5 w-3.5" />}
              label={t('kickoff', lang)}
              value={formatDateTime(match.date, lang)}
            />
          </div>
        </div>
      </div>

      {/* Man of the match */}
      {mom && (
        <div className="glass-card rounded-xl p-4 flex items-center gap-4 border-[#F5C542]/30">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#F5C542] to-[#E0A030] flex items-center justify-center text-2xl shrink-0">
            {mom.photo}
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#F5C542] flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              {t('manOfTheMatch', lang)}
            </div>
            <div className="text-base font-extrabold">{lang === 'ar' ? mom.name_ar : mom.name}</div>
            <div className="text-xs text-muted-foreground">
              <LocalizedTeamName team={TEAM_BY_ID[mom.team_id]} /> · #{mom.number}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/60">
        {[
          { key: 'stats' as const, label: t('statistics', lang), icon: BarChart3 },
          { key: 'lineups' as const, label: t('lineups', lang), icon: UsersIcon },
          { key: 'events' as const, label: t('events', lang), icon: Activity },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'px-4 py-2.5 text-sm font-bold flex items-center gap-1.5 border-b-2 -mb-px transition-colors',
              tab === key
                ? 'border-[#C8102E] text-[#C8102E]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'stats' && <StatisticsView stats={stats} home={home} away={away} />}
      {tab === 'lineups' && <LineupsView lineups={lineups} />}
      {tab === 'events' && <EventsView events={sortedEvents} home={home} away={away} />}
    </div>
  );
}

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-muted-foreground mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-sm font-semibold truncate">{value}</div>
    </div>
  );
}

function StatisticsView({ stats, home, away }: { stats: MatchStatistics | null; home: any; away: any }) {
  const { lang } = useThemeStore();
  if (!stats) {
    return <div className="glass-card rounded-xl p-8 text-center text-muted-foreground text-sm">{t('noData', lang)}</div>;
  }

  const rows: Array<{ label: string; home: number; away: number; suffix?: string }> = [
    { label: t('possession', lang), home: stats.possession[0], away: stats.possession[1], suffix: '%' },
    { label: t('shots', lang), home: stats.shots[0], away: stats.shots[1] },
    { label: t('shotsOnTarget', lang), home: stats.shots_on_target[0], away: stats.shots_on_target[1] },
    { label: t('corners', lang), home: stats.corners[0], away: stats.corners[1] },
    { label: t('fouls', lang), home: stats.fouls[0], away: stats.fouls[1] },
    { label: t('yellowCard', lang), home: stats.yellow_cards[0], away: stats.yellow_cards[1] },
    { label: t('redCard', lang), home: stats.red_cards[0], away: stats.red_cards[1] },
    { label: t('passes', lang), home: stats.passes[0], away: stats.passes[1] },
    { label: t('passAccuracy', lang), home: stats.pass_accuracy[0], away: stats.pass_accuracy[1], suffix: '%' },
  ];

  return (
    <div className="glass-card rounded-xl p-4 md:p-6 space-y-4">
      {/* Team headers */}
      <div className="grid grid-cols-3 items-center mb-2">
        <div className="flex flex-col items-center gap-1">
          <TeamLogo team={home} size="sm" />
          <span className="text-xs font-bold"><LocalizedTeamName team={home} /></span>
        </div>
        <div className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">VS</div>
        <div className="flex flex-col items-center gap-1">
          <TeamLogo team={away} size="sm" />
          <span className="text-xs font-bold"><LocalizedTeamName team={away} /></span>
        </div>
      </div>

      {/* Stat rows */}
      {rows.map((row, i) => {
        const total = row.home + row.away || 1;
        const homePct = (row.home / total) * 100;
        const awayPct = (row.away / total) * 100;
        return (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm font-bold">
              <span className="tabular-nums">{row.home}{row.suffix}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{row.label}</span>
              <span className="tabular-nums">{row.away}{row.suffix}</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden bg-muted/50">
              <div
                className="bg-gradient-to-r from-[#C8102E] to-[#a30d24] transition-all duration-500"
                style={{ width: `${homePct}%` }}
              />
              <div
                className="bg-gradient-to-l from-[#0B1F3B] to-[#1a3a6b] transition-all duration-500"
                style={{ width: `${awayPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LineupsView({ lineups }: { lineups: MatchLineup[] }) {
  const { lang } = useThemeStore();
  const { go } = useNavStore();
  if (!lineups || lineups.length === 0) {
    return <div className="glass-card rounded-xl p-8 text-center text-muted-foreground text-sm">{t('noData', lang)}</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {lineups.map(lineup => {
        const team = TEAM_BY_ID[lineup.team_id];
        return (
          <div key={lineup.id} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <TeamLogo team={team} size="sm" />
                <div>
                  <div className="text-sm font-extrabold"><LocalizedTeamName team={team} /></div>
                  <div className="text-[10px] text-muted-foreground">{lineup.formation}</div>
                </div>
              </div>
              {lineup.coach && (
                <div className="text-[10px] text-muted-foreground text-end">
                  <div className="font-semibold">{t('coach', lang)}</div>
                  <div>{lineup.coach}</div>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                {t('starters', lang)}
              </div>
              {lineup.starters.map(p => (
                <button
                  key={p.player_id}
                  onClick={() => go('players', {})}
                  className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-muted/40 transition-colors text-start"
                >
                  <span className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold">
                    {p.number}
                  </span>
                  <span className="text-xs font-semibold flex-1">{lang === 'ar' ? p.name_ar : p.name}</span>
                  <span className="text-[9px] text-muted-foreground font-mono">{p.position}</span>
                </button>
              ))}
            </div>
            {lineup.substitutes.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  {t('substitutes', lang)}
                </div>
                {lineup.substitutes.map(p => (
                  <div key={p.player_id} className="flex items-center gap-2 p-1.5 text-start opacity-70">
                    <span className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-bold">
                      {p.number}
                    </span>
                    <span className="text-xs font-semibold flex-1">{lang === 'ar' ? p.name_ar : p.name}</span>
                    <span className="text-[9px] text-muted-foreground font-mono">{p.position}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EventsView({ events, home, away }: { events: MatchEvent[]; home: any; away: any }) {
  const { lang } = useThemeStore();
  if (events.length === 0) {
    return <div className="glass-card rounded-xl p-8 text-center text-muted-foreground text-sm">{t('noData', lang)}</div>;
  }

  const sorted = [...events].sort((a, b) => a.minute - b.minute);

  return (
    <div className="glass-card rounded-xl p-4 md:p-6">
      {/* Team headers */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-4 pb-3 border-b border-border/40">
        <div className="flex items-center justify-center gap-2">
          {home && <img src={home.flag} alt="" className="h-5 w-8 rounded-sm object-cover" />}
          <span className="text-sm font-bold truncate max-w-[120px]">{lang === 'ar' ? home?.name_ar : home?.name}</span>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3">
          {t('events', lang)}
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-bold truncate max-w-[120px]">{lang === 'ar' ? away?.name_ar : away?.name}</span>
          {away && <img src={away.flag} alt="" className="h-5 w-8 rounded-sm object-cover" />}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Center line */}
        <div className="absolute top-0 bottom-0 start-1/2 -translate-x-1/2 w-px bg-border/60" />

        <div className="space-y-3">
          {sorted.map((ev) => {
            const team = TEAM_BY_ID[ev.team_id];
            const isHome = ev.team_id === home?.id;
            let icon: React.ReactNode = <GoalIcon className="h-3.5 w-3.5" />;
            let iconBg = 'bg-[#10B981]/20 text-[#10B981]';
            let label = t('goal', lang);
            if (ev.detail === 'Penalty') label = t('penalty', lang);
            if (ev.detail === 'Own Goal') label = t('ownGoal', lang);

            if (ev.type === 'card') {
              icon = <Square className="h-3.5 w-3.5" />;
              if (ev.detail === 'Red') {
                iconBg = 'bg-[#BF0A30]/20 text-[#BF0A30]';
                label = t('redCard', lang);
              } else {
                iconBg = 'bg-[#D4AF37]/20 text-[#D4AF37]';
                label = t('yellowCard', lang);
              }
            } else if (ev.type === 'substitution') {
              icon = <Repeat className="h-3.5 w-3.5" />;
              iconBg = 'bg-[#3C3B6E]/20 text-[#3C3B6E]';
              label = t('substitution', lang);
            }

            return (
              <div key={ev.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 relative">
                {/* Home side (left) */}
                <div className="flex justify-end">
                  {isHome && (
                    <div className="glass-card rounded-lg p-2.5 max-w-[280px] flex items-center gap-2.5">
                      <div className="flex-1 min-w-0 text-end">
                        <div className="text-xs font-bold truncate">{lang === 'ar' ? ev.player_ar : ev.player}</div>
                        <div className="text-[10px] text-muted-foreground">{label}</div>
                      </div>
                      <div className={cn('h-7 w-7 rounded-full flex items-center justify-center shrink-0', iconBg)}>
                        {icon}
                      </div>
                    </div>
                  )}
                </div>

                {/* Minute (center) */}
                <div className="flex flex-col items-center z-10 bg-card px-1.5 py-0.5 rounded-md">
                  <span className="text-xs font-black tabular-nums text-[#D4AF37]" dir="ltr">{ev.minute}'</span>
                </div>

                {/* Away side (right) */}
                <div className="flex justify-start">
                  {!isHome && (
                    <div className="glass-card rounded-lg p-2.5 max-w-[280px] flex items-center gap-2.5">
                      <div className={cn('h-7 w-7 rounded-full flex items-center justify-center shrink-0', iconBg)}>
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate">{lang === 'ar' ? ev.player_ar : ev.player}</div>
                        <div className="text-[10px] text-muted-foreground">{label}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EventCard({
  ev, team, icon, iconBg, align,
}: {
  ev: MatchEvent; team: any; icon: React.ReactNode; iconBg: string; align: 'start' | 'end';
}) {
  const { lang } = useThemeStore();
  return (
    <div className={cn(
      'glass-card rounded-lg p-2.5 max-w-[300px] flex items-center gap-2',
      align === 'end' && 'flex-row-reverse text-end'
    )}>
      <div className={cn('h-7 w-7 rounded-full flex items-center justify-center shrink-0', iconBg)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold truncate">{lang === 'ar' ? ev.player_ar : ev.player}</div>
        <div className="text-[10px] text-muted-foreground">
          {ev.type === 'goal' && (ev.detail ? `${t('goal', lang)} · ${ev.detail === 'Penalty' ? t('penalty', lang) : ev.detail === 'Own Goal' ? t('ownGoal', lang) : ev.detail}` : t('goal', lang))}
          {ev.type === 'card' && (ev.detail === 'Red' ? t('redCard', lang) : t('yellowCard', lang))}
          {ev.type === 'substitution' && t('substitution', lang)}
        </div>
      </div>
      {team && <img src={team.flag} alt={team.name} className="h-4 w-6 rounded-sm object-cover shrink-0" loading="lazy" />}
    </div>
  );
}

function Calendar(props: any) {
  // Local icon import fallback
  return <MapPin {...props} />;
}
