'use client';

import { useEffect, useState } from 'react';
import { useNavStore, useThemeStore } from '@/lib/stores/wc-stores';
import { getAllStandings, getTeamsByGroup } from '@/lib/wc/supabase-client';
import { TEAM_BY_ID } from '@/lib/wc/data';
import { t } from '@/lib/wc/i18n';
import type { StandingsRow, Team } from '@/lib/wc/types';
import { TeamLogo, LocalizedTeamName } from '@/components/wc/MatchCard';
import { PageTitle } from '@/components/wc/SectionHeader';
import { BarChart3, Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GroupsPage({ initialGroup }: { initialGroup?: string }) {
  const { lang } = useThemeStore();
  const { go } = useNavStore();
  const [standings, setStandings] = useState<Record<string, StandingsRow[]> | null>(null);
  const [teams, setTeams] = useState<Record<string, Team[]>>({});
  const [activeGroup, setActiveGroup] = useState<string | undefined>(initialGroup);

  useEffect(() => {
    getAllStandings().then(s => {
      setStandings(s);
      const teamsByGroup: Record<string, Team[]> = {};
      Object.keys(s).forEach(g => {
        getTeamsByGroup(g).then(t => { teamsByGroup[g] = t; setTeams({ ...teamsByGroup }); });
      });
    });
  }, []);

  if (!standings) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="h-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-4 h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const groups = Object.keys(standings).sort();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle
        icon={<BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-[#C8102E]" />}
        title={t('groups', lang)}
        subtitle={lang === 'ar' ? '12 مجموعة · 48 منتخب' : '12 groups · 48 teams'}
      />

      {/* Group tabs */}
      <div className="flex flex-wrap gap-2">
        {groups.map(g => (
          <button
            key={g}
            onClick={() => setActiveGroup(activeGroup === g ? undefined : g)}
            className={cn(
              'h-9 w-9 rounded-lg text-sm font-extrabold transition-all',
              activeGroup === g
                ? 'bg-gradient-to-br from-[#C8102E] to-[#a30d24] text-white shadow-lg shadow-[#C8102E]/30 scale-110'
                : 'glass-card hover:border-[#C8102E]/40 hover:scale-105'
            )}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Standings grid */}
      <div className={cn(
        'grid gap-4',
        activeGroup
          ? 'grid-cols-1'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      )}>
        {(activeGroup ? [activeGroup] : groups).map(group => (
          <GroupStandingsCard
            key={group}
            group={group}
            rows={standings[group]}
            teams={teams[group] ?? []}
            onTeamClick={(id) => go('team-details', { id })}
          />
        ))}
      </div>
    </div>
  );
}

function GroupStandingsCard({
  group, rows, teams, onTeamClick,
}: {
  group: string;
  rows: StandingsRow[];
  teams: Team[];
  onTeamClick: (id: string) => void;
}) {
  const { lang } = useThemeStore();
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-[#C8102E]/10 to-[#F5C542]/10 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#C8102E] to-[#0B1F3B] flex items-center justify-center text-white font-black text-xs">
            {group}
          </div>
          <span className="text-sm font-extrabold">
            {t('group', lang)} {group}
          </span>
        </div>
        <Trophy className="h-4 w-4 text-[#F5C542]" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/30">
              <th className="px-2 py-2 text-start font-bold">#</th>
              <th className="px-2 py-2 text-start font-bold">{t('team', lang)}</th>
              <th className="px-2 py-2 text-center font-bold">{t('played', lang)}</th>
              <th className="px-2 py-2 text-center font-bold hidden sm:table-cell">{t('won', lang)}</th>
              <th className="px-2 py-2 text-center font-bold hidden sm:table-cell">{t('drawn', lang)}</th>
              <th className="px-2 py-2 text-center font-bold hidden sm:table-cell">{t('lost', lang)}</th>
              <th className="px-2 py-2 text-center font-bold hidden md:table-cell">{t('goalsFor', lang)}</th>
              <th className="px-2 py-2 text-center font-bold hidden md:table-cell">{t('goalsAgainst', lang)}</th>
              <th className="px-2 py-2 text-center font-bold">{t('goalDiff', lang)}</th>
              <th className="px-2 py-2 text-center font-bold text-[#F5C542]">{t('points', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const team = TEAM_BY_ID[row.team_id];
              const qualified = idx < 2;
              return (
                <tr
                  key={row.id}
                  onClick={() => onTeamClick(row.team_id)}
                  className={cn(
                    'border-b border-border/20 cursor-pointer hover:bg-muted/40 transition-colors',
                    qualified && 'bg-[#10B981]/5'
                  )}
                >
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-1">
                      <span className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        qualified ? 'bg-[#10B981]' : 'bg-muted-foreground/30'
                      )} />
                      <span className="text-xs font-bold text-muted-foreground">{idx + 1}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2">
                      <TeamLogo team={team} size="xs" />
                      <span className="font-bold text-xs truncate max-w-[100px]">
                        <LocalizedTeamName team={team} />
                      </span>
                      {qualified && (
                        <Star className="h-3 w-3 text-[#10B981] fill-current shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-center text-xs font-semibold tabular-nums">{row.played}</td>
                  <td className="px-2 py-2.5 text-center text-xs font-semibold tabular-nums hidden sm:table-cell">{row.win}</td>
                  <td className="px-2 py-2.5 text-center text-xs font-semibold tabular-nums hidden sm:table-cell">{row.draw}</td>
                  <td className="px-2 py-2.5 text-center text-xs font-semibold tabular-nums hidden sm:table-cell">{row.lose}</td>
                  <td className="px-2 py-2.5 text-center text-xs font-semibold tabular-nums hidden md:table-cell">{row.goals_for}</td>
                  <td className="px-2 py-2.5 text-center text-xs font-semibold tabular-nums hidden md:table-cell">{row.goals_against}</td>
                  <td className={cn(
                    'px-2 py-2.5 text-center text-xs font-bold tabular-nums',
                    row.goal_diff > 0 ? 'text-[#10B981]' : row.goal_diff < 0 ? 'text-[#C8102E]' : 'text-muted-foreground'
                  )}>
                    {row.goal_diff > 0 ? '+' : ''}{row.goal_diff}
                  </td>
                  <td className="px-2 py-2.5 text-center">
                    <span className="text-sm font-black text-[#F5C542] tabular-nums">{row.points}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-3 py-2 border-t border-border/30 flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          {t('qualified', lang)}
        </span>
      </div>
    </div>
  );
}
