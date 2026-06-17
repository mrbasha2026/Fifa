'use client';

import { useEffect, useState } from 'react';
import { useNavStore, useThemeStore } from '@/lib/stores/wc-stores';
import { getTeamById, getPlayersByTeam, getMatchesByTeam, getStandingsByGroup } from '@/lib/wc/supabase-client';
import { TEAM_BY_ID } from '@/lib/wc/data';
import { t } from '@/lib/wc/i18n';
import type { Team, Player, Match, StandingsRow } from '@/lib/wc/types';
import { TeamLogo, LocalizedTeamName, MatchCard } from '@/components/wc/MatchCard';
import { PageTitle } from '@/components/wc/SectionHeader';
import { FavoriteButton } from '@/components/wc/FavoriteButton';
import { ArrowLeft, ArrowRight, Users, Calendar, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TeamDetailsPage({ teamId }: { teamId: string }) {
  const { go, back } = useNavStore();
  const { lang, dir } = useThemeStore();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standingsRow, setStandingsRow] = useState<StandingsRow | null>(null);
  const [groupStandings, setGroupStandings] = useState<StandingsRow[]>([]);
  const [tab, setTab] = useState<'squad' | 'matches' | 'stats'>('squad');

  useEffect(() => {
    Promise.all([
      getTeamById(teamId),
      getPlayersByTeam(teamId),
      getMatchesByTeam(teamId),
    ]).then(async ([t, p, m]) => {
      setTeam(t);
      setPlayers(p);
      setMatches(m);
      // Fetch standings from Supabase
      if (t?.group) {
        const standings = await getStandingsByGroup(t.group);
        setGroupStandings(standings);
        const row = standings.find(s => s.team_id === teamId);
        setStandingsRow(row ?? null);
      }
    });
  }, [teamId]);

  if (!team) {
    return <div className="glass-card rounded-xl p-8 h-64 animate-pulse" />;
  }

  const Back = dir === 'rtl' ? ArrowRight : ArrowLeft;
  const positionInGroup = standingsRow
    ? groupStandings.findIndex(s => s.team_id === teamId) + 1
    : 0;
  const qualified = positionInGroup > 0 && positionInGroup <= 2;

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={back}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Back className="h-4 w-4" />
        {t('back', lang)}
      </button>

      {/* Team hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 glass-card">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3B]/30 via-transparent to-[#C8102E]/15" />
        <div className="absolute -right-8 -top-8 opacity-10 select-none">
          {team.flag && <img src={team.flag} alt="" className="h-40 w-64 object-cover" />}
        </div>
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-card/60 border border-border/50 flex items-center justify-center overflow-hidden shrink-0">
            <img src={team.flag} alt={team.name} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="flex-1 text-center md:text-start">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {t('group', lang)} {team.group}
              </span>
              {qualified && (
                <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-[#10B981]" />
                  {t('qualified', lang)}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-black mb-1">
              <LocalizedTeamName team={team} />
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground">
              <span className="font-mono font-bold">{team.fifa_code}</span>
              {team.fifa_ranking && (
                <span className="flex items-center gap-1">
                  <span className="font-bold">{t('fifaRanking', lang)}:</span>
                  <span className="text-[#F5C542] font-bold">#{team.fifa_ranking}</span>
                </span>
              )}
              {team.coach && (
                <span className="flex items-center gap-1">
                  <span className="font-bold">{t('coach', lang)}:</span>
                  <span>{team.coach}</span>
                </span>
              )}
            </div>
          </div>
          <FavoriteButton kind="team" id={team.id} size="lg" />
        </div>
      </div>

      {/* Quick stats */}
      {standingsRow && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatBox label={t('played', lang)} value={standingsRow.played} />
          <StatBox label={t('won', lang)} value={standingsRow.win} color="text-[#10B981]" />
          <StatBox label={t('drawn', lang)} value={standingsRow.draw} />
          <StatBox label={t('lost', lang)} value={standingsRow.lose} color="text-[#C8102E]" />
          <StatBox label={t('points', lang)} value={standingsRow.points} color="text-[#F5C542]" big />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/60">
        {[
          { key: 'squad' as const, label: t('squad', lang), icon: Users },
          { key: 'matches' as const, label: t('recentMatches', lang), icon: Calendar },
          { key: 'stats' as const, label: t('statistics', lang), icon: BarChart3 },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'px-4 py-2.5 text-sm font-bold flex items-center gap-1.5 border-b-2 -mb-px transition-colors',
              tab === key ? 'border-[#C8102E] text-[#C8102E]' : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'squad' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {players.map(p => (
            <PlayerCard key={p.id} player={p} />
          ))}
          {players.length === 0 && (
            <div className="col-span-full glass-card rounded-xl p-8 text-center text-muted-foreground text-sm">
              {t('noData', lang)}
            </div>
          )}
        </div>
      )}

      {tab === 'matches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map(m => <MatchCard key={m.id} match={m} variant="compact" />)}
          {matches.length === 0 && (
            <div className="col-span-full glass-card rounded-xl p-8 text-center text-muted-foreground text-sm">
              {t('noData', lang)}
            </div>
          )}
        </div>
      )}

      {tab === 'stats' && standingsRow && (
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h3 className="font-extrabold text-base mb-2">{t('statistics', lang)}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatBox label={t('goalsFor', lang)} value={standingsRow.goals_for} color="text-[#10B981]" />
            <StatBox label={t('goalsAgainst', lang)} value={standingsRow.goals_against} color="text-[#C8102E]" />
            <StatBox label={t('goalDiff', lang)} value={standingsRow.goal_diff > 0 ? `+${standingsRow.goal_diff}` : standingsRow.goal_diff} color={standingsRow.goal_diff >= 0 ? 'text-[#10B981]' : 'text-[#C8102E]'} />
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color = '', big = false }: { label: string; value: any; color?: string; big?: boolean }) {
  return (
    <div className="glass-card rounded-xl p-4 text-center">
      <div className={cn('font-black tabular-nums', big ? 'text-3xl' : 'text-2xl', color || 'text-foreground')}>{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function PlayerCard({ player }: { player: Player }) {
  const { lang } = useThemeStore();
  const { go } = useNavStore();
  const team = TEAM_BY_ID[player.team_id];
  const posLabel = {
    GK: t('goalkeeper', lang),
    DF: t('defender', lang),
    MF: t('midfielder', lang),
    FW: t('forward', lang),
  }[player.position];
  const posColor = {
    GK: 'bg-[#F5C542]/20 text-[#F5C542]',
    DF: 'bg-[#3B82F6]/20 text-[#3B82F6]',
    MF: 'bg-[#10B981]/20 text-[#10B981]',
    FW: 'bg-[#C8102E]/20 text-[#C8102E]',
  }[player.position];

  return (
    <div
      onClick={() => go('players', {})}
      className="glass-card rounded-xl p-3 flex items-center gap-3 hover:scale-[1.02] hover:border-[#C8102E]/30 transition-all cursor-pointer"
    >
      <div className="relative">
        <div className="h-12 w-12 rounded-full bg-card/60 border border-border/50 flex items-center justify-center text-2xl">
          {player.photo}
        </div>
        <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center border-2 border-background">
          {player.number}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">{lang === 'ar' ? player.name_ar : player.name}</div>
        <div className="text-[10px] text-muted-foreground">{posLabel} · {player.club}</div>
      </div>
      <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold', posColor)}>{player.position}</span>
    </div>
  );
}
