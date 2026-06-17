'use client';

import { useEffect, useState } from 'react';
import { useNavStore, useThemeStore } from '@/lib/stores/wc-stores';
import { getTopScorers, getTopAssists } from '@/lib/wc/supabase-client';
import { TEAM_BY_ID } from '@/lib/wc/data';
import { t } from '@/lib/wc/i18n';
import { TeamLogo, LocalizedTeamName } from '@/components/wc/MatchCard';
import { PageTitle } from '@/components/wc/SectionHeader';
import { FavoriteButton } from '@/components/wc/FavoriteButton';
import { Target, Star, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

type Row = Awaited<ReturnType<typeof getTopScorers>>[number];

export function TopScorersPage() {
  const { lang } = useThemeStore();
  const { go } = useNavStore();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => { getTopScorers(20).then(setRows); }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle
        icon={<Target className="h-5 w-5 md:h-6 md:w-6 text-[#F5C542]" />}
        title={t('topScorers', lang)}
        subtitle={lang === 'ar' ? 'ترتيب هدافي البطولة' : 'Tournament top scorers'}
      />

      {rows === null ? (
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center text-muted-foreground">
          {t('noData', lang)}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Podium for top 3 */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[1, 0, 2].map(idx => {
              const row = rows[idx];
              if (!row) return <div key={idx} />;
              const team = row.team ?? TEAM_BY_ID[row.team_id];
              const positions = ['#F5C542', '#C0C0C0', '#CD7F32'];
              const heights = ['h-32', 'h-24', 'h-20'];
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div
                  key={idx}
                  onClick={() => go('team-details', { id: team?.id ?? '' })}
                  className={cn(
                    'glass-card rounded-xl p-3 flex flex-col items-center justify-end cursor-pointer hover:scale-[1.04] transition-transform relative',
                    idx === 0 ? 'order-2 gold-glow' : idx === 1 ? 'order-1' : 'order-3'
                  )}
                >
                  <div className="text-3xl mb-1">{medals[idx]}</div>
                  <div className={cn('w-full rounded-t-lg bg-gradient-to-t', idx === 0 ? 'from-[#F5C542]/30 to-[#F5C542]/10' : 'from-muted/40 to-muted/10', heights[idx])} />
                  <div className="absolute top-12 flex flex-col items-center">
                    <div className="text-2xl mb-1">{row.player?.photo}</div>
                    <div className="text-xs font-bold text-center truncate max-w-[80px]">
                      {lang === 'ar' ? row.player?.name_ar : row.player?.name}
                    </div>
                    <div className="text-2xl font-black" style={{ color: positions[idx] }}>{row.goals}</div>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{t('goals', lang)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table for the rest */}
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/30 bg-muted/20">
                  <th className="px-3 py-2 text-center font-bold w-12">{t('rank', lang)}</th>
                  <th className="px-3 py-2 text-start font-bold">{t('player', lang)}</th>
                  <th className="px-3 py-2 text-center font-bold hidden sm:table-cell">{t('matchesPlayed', lang)}</th>
                  <th className="px-3 py-2 text-center font-bold hidden sm:table-cell">{t('penalties', lang)}</th>
                  <th className="px-3 py-2 text-center font-bold">{t('assists', lang)}</th>
                  <th className="px-3 py-2 text-center font-bold text-[#F5C542]">{t('goals', lang)}</th>
                  <th className="px-2 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const team = row.team ?? TEAM_BY_ID[row.team_id];
                  return (
                    <tr
                      key={row.player_id}
                      className="border-b border-border/20 hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-3 py-2.5 text-center">
                        <span className={cn(
                          'inline-flex h-6 w-6 rounded-full items-center justify-center text-xs font-extrabold',
                          idx === 0 ? 'bg-[#F5C542] text-[#0B1F3B]' :
                          idx === 1 ? 'bg-[#C0C0C0] text-[#0B1F3B]' :
                          idx === 2 ? 'bg-[#CD7F32] text-white' :
                          'bg-muted text-muted-foreground'
                        )}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <button
                          onClick={() => team && go('team-details', { id: team.id })}
                          className="flex items-center gap-2 text-start"
                        >
                          <span className="text-xl">{row.player?.photo}</span>
                          <div>
                            <div className="font-bold text-xs group-hover:text-[#F5C542] transition-colors">
                              {lang === 'ar' ? row.player?.name_ar : row.player?.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <img src={team?.flag} alt={team?.name} className="h-3.5 w-5 rounded-sm object-cover" loading="lazy" />
                              <LocalizedTeamName team={team} />
                            </div>
                          </div>
                        </button>
                      </td>
                      <td className="px-3 py-2.5 text-center text-xs font-semibold tabular-nums hidden sm:table-cell">{row.matches_played ?? '-'}</td>
                      <td className="px-3 py-2.5 text-center text-xs font-semibold tabular-nums hidden sm:table-cell">{row.penalties ?? 0}</td>
                      <td className="px-3 py-2.5 text-center text-xs font-semibold tabular-nums">{row.assists}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="text-base font-black text-[#F5C542] tabular-nums">{row.goals}</span>
                      </td>
                      <td className="px-2 py-2.5 text-center">
                        <FavoriteButton kind="player" id={row.player_id} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function TopAssistsPage() {
  const { lang } = useThemeStore();
  const { go } = useNavStore();
  const [rows, setRows] = useState<Awaited<ReturnType<typeof getTopAssists>> | null>(null);

  useEffect(() => { getTopAssists(20).then(setRows); }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle
        icon={<Star className="h-5 w-5 md:h-6 md:w-6 text-[#F5C542]" />}
        title={t('topAssists', lang)}
        subtitle={lang === 'ar' ? 'ترتيب صناع أهداف البطولة' : 'Tournament top assist providers'}
      />

      {rows === null ? (
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/30 bg-muted/20">
                <th className="px-3 py-2 text-center font-bold w-12">{t('rank', lang)}</th>
                <th className="px-3 py-2 text-start font-bold">{t('player', lang)}</th>
                <th className="px-3 py-2 text-center font-bold hidden sm:table-cell">{t('matchesPlayed', lang)}</th>
                <th className="px-3 py-2 text-center font-bold">{t('goals', lang)}</th>
                <th className="px-3 py-2 text-center font-bold text-[#F5C542]">{t('assists', lang)}</th>
                <th className="px-2 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const team = row.team ?? TEAM_BY_ID[row.team_id];
                return (
                  <tr
                    key={row.player_id}
                    className="border-b border-border/20 hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-3 py-2.5 text-center">
                      <span className={cn(
                        'inline-flex h-6 w-6 rounded-full items-center justify-center text-xs font-extrabold',
                        idx === 0 ? 'bg-[#F5C542] text-[#0B1F3B]' :
                        idx === 1 ? 'bg-[#C0C0C0] text-[#0B1F3B]' :
                        idx === 2 ? 'bg-[#CD7F32] text-white' :
                        'bg-muted text-muted-foreground'
                      )}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => team && go('team-details', { id: team.id })}
                        className="flex items-center gap-2 text-start"
                      >
                        <span className="text-xl">{row.player?.photo || '⚽'}</span>
                        <div>
                          <div className="font-bold text-xs group-hover:text-[#F5C542] transition-colors">
                            {lang === 'ar' ? (row.player?.name_ar || row.player?.name || '—') : (row.player?.name || row.player?.name_ar || '—')}
                          </div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            {team && <img src={team.flag} alt={team.name} className="h-3.5 w-5 rounded-sm object-cover" loading="lazy" />}
                            <LocalizedTeamName team={team} />
                          </div>
                        </div>
                      </button>
                    </td>
                    <td className="px-3 py-2.5 text-center text-xs font-semibold tabular-nums hidden sm:table-cell">{row.matches_played ?? '-'}</td>
                    <td className="px-3 py-2.5 text-center text-xs font-semibold tabular-nums">{row.goals}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-base font-black text-[#F5C542] tabular-nums">{row.assists}</span>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <FavoriteButton kind="player" id={row.player_id} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
