'use client';

import { useState, useMemo } from 'react';
import { useNavStore, useThemeStore } from '@/lib/stores/wc-stores';
import { PLAYERS, TEAM_BY_ID } from '@/lib/wc/data';
import { t } from '@/lib/wc/i18n';
import type { Player, Position } from '@/lib/wc/types';
import { PageTitle } from '@/components/wc/SectionHeader';
import { FavoriteButton } from '@/components/wc/FavoriteButton';
import { User, Search, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PlayersPage() {
  const { lang } = useThemeStore();
  const { go } = useNavStore();
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState<Position | 'ALL'>('ALL');
  const [teamId, setTeamId] = useState<string | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    return PLAYERS.filter(p => {
      if (position !== 'ALL' && p.position !== position) return false;
      if (teamId !== 'ALL' && p.team_id !== teamId) return false;
      if (search) {
        const q = search.toLowerCase();
        const team = TEAM_BY_ID[p.team_id];
        const haystack = [p.name, p.name_ar, p.nationality, p.nationality_ar, team?.name, team?.name_ar, p.club].filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [search, position, teamId]);

  const positions: Array<{ value: Position | 'ALL'; label: string; color: string }> = [
    { value: 'ALL', label: t('allPositions', lang), color: '' },
    { value: 'GK', label: t('goalkeeper', lang), color: 'bg-[#F5C542]/20 text-[#F5C542] border-[#F5C542]/40' },
    { value: 'DF', label: t('defender', lang), color: 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40' },
    { value: 'MF', label: t('midfielder', lang), color: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40' },
    { value: 'FW', label: t('forward', lang), color: 'bg-[#C8102E]/20 text-[#C8102E] border-[#C8102E]/40' },
  ];

  // Unique teams that have players
  const teamsWithPlayers = Array.from(new Set(PLAYERS.map(p => p.team_id)))
    .map(id => TEAM_BY_ID[id])
    .filter(Boolean)
    .sort((a, b) => (lang === 'ar' ? a.name_ar.localeCompare(b.name_ar) : a.name.localeCompare(b.name)));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle
        icon={<User className="h-5 w-5 md:h-6 md:w-6 text-[#C8102E]" />}
        title={t('allPlayers', lang)}
        subtitle={lang === 'ar' ? `${PLAYERS.length} لاعب` : `${PLAYERS.length} players`}
      />

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('searchPlayers', lang)}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full ps-10 pe-3 py-2.5 rounded-lg bg-background/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/40"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {positions.map(p => (
            <button
              key={p.value}
              onClick={() => setPosition(p.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-bold border transition-all',
                position === p.value
                  ? p.color || 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/40 text-muted-foreground border-transparent hover:bg-muted'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <select
          value={teamId}
          onChange={e => setTeamId(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C8102E]/40"
        >
          <option value="ALL">{t('allTeams', lang)}</option>
          {teamsWithPlayers.map(t => (
            <option key={t.id} value={t.id}>
              {lang === 'ar' ? t.name_ar : t.name} ({t.group})
            </option>
          ))}
        </select>
      </div>

      {/* Players grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map(p => (
          <PlayerCardExtended key={p.id} player={p} onTeamClick={() => go('team-details', { id: p.team_id })} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center text-muted-foreground">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
          {t('noData', lang)}
        </div>
      )}
    </div>
  );
}

function PlayerCardExtended({ player, onTeamClick }: { player: Player; onTeamClick: () => void }) {
  const { lang } = useThemeStore();
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
    <div className="glass-card rounded-xl p-4 hover:scale-[1.03] hover:border-[#C8102E]/40 transition-all group relative">
      <div className="absolute top-2 end-2">
        <FavoriteButton kind="player" id={player.id} size="sm" />
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <div className="h-16 w-16 rounded-full bg-card/60 border border-border/50 flex items-center justify-center text-3xl">
            {player.photo}
          </div>
          <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center border-2 border-background">
            {player.number}
          </span>
        </div>
        <div className="font-extrabold text-sm mb-1 group-hover:text-[#F5C542] transition-colors">
          {lang === 'ar' ? player.name_ar : player.name}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onTeamClick(); }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <span className="text-base">{team?.flag}</span>
          <LocalizedTeamNameLocalized team={team} />
        </button>
        <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold', posColor)}>
          {player.position} · {posLabel}
        </span>
        {player.club && (
          <div className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1">
            <Star className="h-2.5 w-2.5 text-[#F5C542]" />
            {player.club}
          </div>
        )}
      </div>
    </div>
  );
}

function LocalizedTeamNameLocalized({ team }: { team?: any }) {
  const { lang } = useThemeStore();
  if (!team) return null;
  return <>{lang === 'ar' ? team.name_ar : team.name}</>;
}
