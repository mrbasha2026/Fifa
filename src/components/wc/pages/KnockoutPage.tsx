'use client';

import { useEffect, useState, useMemo } from 'react';
import { useNavStore, useThemeStore } from '@/lib/stores/wc-stores';
import { getKnockoutMatches } from '@/lib/wc/supabase-client';
import { TEAM_BY_ID, MATCH_BY_ID, STADIUM_BY_ID } from '@/lib/wc/data';
import { t } from '@/lib/wc/i18n';
import { formatDateTime } from '@/lib/wc/time';
import type { Match, Team } from '@/lib/wc/types';
import { PageTitle } from '@/components/wc/SectionHeader';
import { GitBranch, Trophy, Crown, Info, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function KnockoutPage() {
  const { lang } = useThemeStore();
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [highlightTeam, setHighlightTeam] = useState<string | null>(null);

  useEffect(() => {
    getKnockoutMatches().then(setMatches);
  }, []);

  const matchesById = useMemo(() => {
    const map: Record<string, Match> = {};
    (matches ?? []).forEach(m => { map[m.id] = m; });
    return map;
  }, [matches]);

  if (!matches) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="h-12" />
        <div className="glass-card rounded-xl p-8 h-96 animate-pulse" />
      </div>
    );
  }

  const r32 = matches.filter(m => m.round === 'R32').sort((a, b) => (a.bracket_position ?? 0) - (b.bracket_position ?? 0));
  const r16 = matches.filter(m => m.round === 'R16').sort((a, b) => (a.bracket_position ?? 0) - (b.bracket_position ?? 0));
  const qf = matches.filter(m => m.round === 'QF').sort((a, b) => (a.bracket_position ?? 0) - (b.bracket_position ?? 0));
  const sf = matches.filter(m => m.round === 'SF').sort((a, b) => (a.bracket_position ?? 0) - (b.bracket_position ?? 0));
  const final = matches.find(m => m.round === 'FINAL');
  const third = matches.find(m => m.round === 'THIRD');

  // Split into top half (left) and bottom half (right)
  // Top half: r32 positions 1-8, r16 positions 1-4, qf positions 1-2, sf 1
  // Bottom half: r32 positions 9-16, r16 positions 5-8, qf positions 3-4, sf 2
  const r32Top = r32.filter(m => (m.bracket_position ?? 0) <= 8);
  const r32Bottom = r32.filter(m => (m.bracket_position ?? 0) > 8);
  const r16Top = r16.filter(m => (m.bracket_position ?? 0) <= 4);
  const r16Bottom = r16.filter(m => (m.bracket_position ?? 0) > 4);
  const qfTop = qf.filter(m => (m.bracket_position ?? 0) <= 2);
  const qfBottom = qf.filter(m => (m.bracket_position ?? 0) > 2);
  const sfTop = sf.filter(m => m.bracket_position === 1);
  const sfBottom = sf.filter(m => m.bracket_position === 2);

  // Get team for a slot — either directly assigned or advanced from previous match
  function getTeamForSlot(match: Match, side: 'home' | 'away'): Team | undefined {
    const teamId = side === 'home' ? match.home_team_id : match.away_team_id;
    if (teamId && TEAM_BY_ID[teamId]) return TEAM_BY_ID[teamId];
    // Look for previous match feeding into this slot
    const prevMatches = matches.filter(m => m.next_match_id === match.id);
    for (const prev of prevMatches) {
      if (prev.winner_id && TEAM_BY_ID[prev.winner_id]) {
        const winner = TEAM_BY_ID[prev.winner_id];
        // First prev feeds home, second prev feeds away
        const idx = prevMatches.indexOf(prev);
        if (idx === 0 && side === 'home') return winner;
        if (idx === 1 && side === 'away') return winner;
      }
    }
    return undefined;
  }

  // Build path: all matches where team played or will play
  function getPathMatches(teamId: string): Set<string> {
    const path = new Set<string>();
    // Walk forward: find first match team played in
    const allOrdered = [...r32, ...r16, ...qf, ...sf, ...(final ? [final] : []), ...(third ? [third] : [])];
    let startMatch = allOrdered.find(m => m.home_team_id === teamId || m.away_team_id === teamId);
    if (!startMatch) return path;
    path.add(startMatch.id);
    let current: Match | undefined = startMatch;
    while (current?.next_match_id) {
      const next = matchesById[current.next_match_id];
      if (!next) break;
      // Add next match if team won the previous (so they advanced)
      if (current.winner_id === teamId || next.home_team_id === teamId || next.away_team_id === teamId) {
        path.add(next.id);
      } else {
        break;
      }
      current = next;
    }
    return path;
  }

  const pathMatches = highlightTeam ? getPathMatches(highlightTeam) : null;
  const champion = final?.winner_id ? TEAM_BY_ID[final.winner_id] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle
        icon={<GitBranch className="h-5 w-5 md:h-6 md:w-6 text-[#C8102E]" />}
        title={t('knockoutStage', lang)}
        subtitle={lang === 'ar' ? 'من دور الـ32 إلى النهائي' : 'From Round of 32 to the Final'}
        actions={
          highlightTeam && (
            <button
              onClick={() => setHighlightTeam(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/70 text-xs font-bold transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              {t('clearHighlight', lang)}
            </button>
          )
        }
      />

      {/* Info banner */}
      {!highlightTeam && (
        <div className="glass-card rounded-xl p-3 flex items-center gap-2 text-xs text-muted-foreground border-[#F5C542]/30">
          <Info className="h-4 w-4 text-[#F5C542] shrink-0" />
          <span>{t('pathHighlightHint', lang)}</span>
        </div>
      )}

      {/* Champion banner */}
      {champion && (
        <div className="relative overflow-hidden rounded-2xl border border-[#F5C542]/40 gold-glow">
          <div className="absolute inset-0 shimmer-gold opacity-20" />
          <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Crown className="h-12 w-12 text-[#F5C542]" />
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#F5C542]">
                  {t('champion', lang)}
                </div>
                <div className="text-3xl md:text-4xl font-black">
                  {lang === 'ar' ? champion.name_ar : champion.name}
                </div>
              </div>
            </div>
            <img
              src={champion.flag}
              alt={champion.name}
              className="h-20 w-20 rounded-lg object-cover border-2 border-[#F5C542]"
            />
          </div>
        </div>
      )}

      {/* Desktop bracket: classic tree (left side + center final + right side) */}
      <div className="hidden lg:block">
        <BracketTree
          r32Top={r32Top}
          r32Bottom={r32Bottom}
          r16Top={r16Top}
          r16Bottom={r16Bottom}
          qfTop={qfTop}
          qfBottom={qfBottom}
          sfTop={sfTop}
          sfBottom={sfBottom}
          final={final}
          third={third}
          getTeamForSlot={getTeamForSlot}
          pathMatches={pathMatches}
          highlightTeam={highlightTeam}
          setHighlightTeam={setHighlightTeam}
          matchesById={matchesById}
        />
      </div>

      {/* Mobile/Tablet accordion */}
      <div className="lg:hidden">
        <BracketMobile
          r32={r32}
          r16={r16}
          qf={qf}
          sf={sf}
          final={final}
          third={third}
          getTeamForSlot={getTeamForSlot}
          pathMatches={pathMatches}
          highlightTeam={highlightTeam}
          setHighlightTeam={setHighlightTeam}
        />
      </div>
    </div>
  );
}

// ============================================================
// Classic Tree Bracket (Desktop)
// Layout: [R32 left col][R16][QF] [SF→Final in center] [QF][R16][R32 right col]
// ============================================================

function BracketTree({
  r32Top, r32Bottom, r16Top, r16Bottom, qfTop, qfBottom,
  sfTop, sfBottom, final, third,
  getTeamForSlot, pathMatches, highlightTeam, setHighlightTeam, matchesById,
}: any) {
  const { lang } = useThemeStore();
  const { go } = useNavStore();

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6 overflow-x-auto">
      <div className="min-w-[1400px] grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-stretch">

        {/* ===== LEFT SIDE: R32 (4 matches) | R32 (4 matches) | R16 (2) | QF (1) ===== */}
        {/* Split R32 top into 2 sub-columns of 4 each */}
        <div className="flex flex-col gap-2 justify-around">
          <ColumnHeader label={t('roundOf32', lang)} />
          {r32Top.slice(0, 4).map((m: Match) => (
            <BracketMatch
              key={m.id}
              match={m}
              getTeam={(side: 'home' | 'away') => getTeamForSlot(m, side)}
              onTeamClick={setHighlightTeam}
              highlightTeam={highlightTeam}
              inPath={pathMatches?.has(m.id) ?? false}
              dimmed={!!highlightTeam && !(pathMatches?.has(m.id))}
              onClick={() => go('match-details', { id: m.id })}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 justify-around">
          <ColumnHeader label={t('roundOf32', lang)} />
          {r32Top.slice(4, 8).map((m: Match) => (
            <BracketMatch
              key={m.id}
              match={m}
              getTeam={(side: 'home' | 'away') => getTeamForSlot(m, side)}
              onTeamClick={setHighlightTeam}
              highlightTeam={highlightTeam}
              inPath={pathMatches?.has(m.id) ?? false}
              dimmed={!!highlightTeam && !(pathMatches?.has(m.id))}
              onClick={() => go('match-details', { id: m.id })}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 justify-around pt-8">
          <ColumnHeader label={t('round16', lang)} />
          {r16Top.map((m: Match) => (
            <BracketMatch
              key={m.id}
              match={m}
              getTeam={(side: 'home' | 'away') => getTeamForSlot(m, side)}
              onTeamClick={setHighlightTeam}
              highlightTeam={highlightTeam}
              inPath={pathMatches?.has(m.id) ?? false}
              dimmed={!!highlightTeam && !(pathMatches?.has(m.id))}
              onClick={() => go('match-details', { id: m.id })}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 justify-around pt-20">
          <ColumnHeader label={t('quarterFinals', lang)} />
          {qfTop.map((m: Match) => (
            <BracketMatch
              key={m.id}
              match={m}
              getTeam={(side: 'home' | 'away') => getTeamForSlot(m, side)}
              onTeamClick={setHighlightTeam}
              highlightTeam={highlightTeam}
              inPath={pathMatches?.has(m.id) ?? false}
              dimmed={!!highlightTeam && !(pathMatches?.has(m.id))}
              onClick={() => go('match-details', { id: m.id })}
            />
          ))}
        </div>

        {/* ===== CENTER: SF1 (top) + Final (middle) + 3rd Place + SF2 (bottom) ===== */}
        <div className="flex flex-col gap-6 justify-center items-center">
          <ColumnHeader label={t('semiFinals', lang)} />
          {sfTop.map((m: Match) => (
            <BracketMatch
              key={m.id}
              match={m}
              getTeam={(side: 'home' | 'away') => getTeamForSlot(m, side)}
              onTeamClick={setHighlightTeam}
              highlightTeam={highlightTeam}
              inPath={pathMatches?.has(m.id) ?? false}
              dimmed={!!highlightTeam && !(pathMatches?.has(m.id))}
              onClick={() => go('match-details', { id: m.id })}
            />
          ))}

          {/* FINAL — center, prominent */}
          {final && (
            <FinalCard
              match={final}
              getTeam={(side: 'home' | 'away') => getTeamForSlot(final, side)}
              onTeamClick={setHighlightTeam}
              highlightTeam={highlightTeam}
              inPath={pathMatches?.has(final.id) ?? false}
              dimmed={!!highlightTeam && !(pathMatches?.has(final.id))}
              onClick={() => go('match-details', { id: final.id })}
            />
          )}

          {/* 3rd Place */}
          {third && (
            <ThirdPlaceCard
              match={third}
              getTeam={(side: 'home' | 'away') => getTeamForSlot(third, side)}
              onTeamClick={setHighlightTeam}
              highlightTeam={highlightTeam}
              inPath={pathMatches?.has(third.id) ?? false}
              dimmed={!!highlightTeam && !(pathMatches?.has(third.id))}
              onClick={() => go('match-details', { id: third.id })}
            />
          )}

          {sfBottom.map((m: Match) => (
            <BracketMatch
              key={m.id}
              match={m}
              getTeam={(side: 'home' | 'away') => getTeamForSlot(m, side)}
              onTeamClick={setHighlightTeam}
              highlightTeam={highlightTeam}
              inPath={pathMatches?.has(m.id) ?? false}
              dimmed={!!highlightTeam && !(pathMatches?.has(m.id))}
              onClick={() => go('match-details', { id: m.id })}
            />
          ))}
        </div>

        {/* ===== RIGHT SIDE: QF (1) | R16 (2) | R32 (4) | R32 (4) ===== */}
        <div className="flex flex-col gap-2 justify-around pt-20">
          <ColumnHeader label={t('quarterFinals', lang)} />
          {qfBottom.map((m: Match) => (
            <BracketMatch
              key={m.id}
              match={m}
              getTeam={(side: 'home' | 'away') => getTeamForSlot(m, side)}
              onTeamClick={setHighlightTeam}
              highlightTeam={highlightTeam}
              inPath={pathMatches?.has(m.id) ?? false}
              dimmed={!!highlightTeam && !(pathMatches?.has(m.id))}
              onClick={() => go('match-details', { id: m.id })}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 justify-around pt-8">
          <ColumnHeader label={t('round16', lang)} />
          {r16Bottom.map((m: Match) => (
            <BracketMatch
              key={m.id}
              match={m}
              getTeam={(side: 'home' | 'away') => getTeamForSlot(m, side)}
              onTeamClick={setHighlightTeam}
              highlightTeam={highlightTeam}
              inPath={pathMatches?.has(m.id) ?? false}
              dimmed={!!highlightTeam && !(pathMatches?.has(m.id))}
              onClick={() => go('match-details', { id: m.id })}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 justify-around">
          <ColumnHeader label={t('roundOf32', lang)} />
          {r32Bottom.slice(0, 4).map((m: Match) => (
            <BracketMatch
              key={m.id}
              match={m}
              getTeam={(side: 'home' | 'away') => getTeamForSlot(m, side)}
              onTeamClick={setHighlightTeam}
              highlightTeam={highlightTeam}
              inPath={pathMatches?.has(m.id) ?? false}
              dimmed={!!highlightTeam && !(pathMatches?.has(m.id))}
              onClick={() => go('match-details', { id: m.id })}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 justify-around">
          <ColumnHeader label={t('roundOf32', lang)} />
          {r32Bottom.slice(4, 8).map((m: Match) => (
            <BracketMatch
              key={m.id}
              match={m}
              getTeam={(side: 'home' | 'away') => getTeamForSlot(m, side)}
              onTeamClick={setHighlightTeam}
              highlightTeam={highlightTeam}
              inPath={pathMatches?.has(m.id) ?? false}
              dimmed={!!highlightTeam && !(pathMatches?.has(m.id))}
              onClick={() => go('match-details', { id: m.id })}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

function ColumnHeader({ label }: { label: string }) {
  return (
    <div className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 pb-2 border-b border-border/30 whitespace-nowrap">
      {label}
    </div>
  );
}

function BracketMatch({
  match, getTeam, onTeamClick, highlightTeam, inPath, dimmed, onClick,
}: {
  match: Match;
  getTeam: (side: 'home' | 'away') => Team | undefined;
  onTeamClick: (id: string) => void;
  highlightTeam: string | null;
  inPath: boolean;
  dimmed: boolean;
  onClick: () => void;
}) {
  const { lang } = useThemeStore();
  const home = getTeam('home');
  const away = getTeam('away');
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FT' || match.status === 'AET' || match.status === 'PEN';
  const homeWon = isFinished && match.winner_id === home?.id;
  const awayWon = isFinished && match.winner_id === away?.id;
  const showScore = match.status !== 'NS' && match.home_score !== null && match.away_score !== null;

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-lg p-2 border transition-all cursor-pointer min-w-[180px]',
        'bg-card/60 backdrop-blur',
        isLive ? 'border-[#C8102E]/50 live-pulse' :
        inPath ? 'border-[#F5C542]/60 gold-glow' :
        'border-border/40 hover:border-[#C8102E]/40',
        dimmed && 'opacity-30'
      )}
    >
      <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1 flex items-center justify-between">
        <span>{match.id}</span>
        {isLive && (
          <span className="text-[#C8102E] flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-[#C8102E] pulse-dot" />
            {match.minute}'
          </span>
        )}
      </div>

      <TeamRow
        team={home}
        score={showScore ? match.home_score : null}
        won={homeWon}
        highlight={highlightTeam === home?.id}
        onTeamClick={onTeamClick}
      />
      <TeamRow
        team={away}
        score={showScore ? match.away_score : null}
        won={awayWon}
        highlight={highlightTeam === away?.id}
        onTeamClick={onTeamClick}
      />
    </div>
  );
}

function TeamRow({
  team, score, won, highlight, onTeamClick,
}: {
  team: Team | undefined;
  score: number | null;
  won: boolean;
  highlight: boolean;
  onTeamClick: (id: string) => void;
}) {
  const { lang } = useThemeStore();
  if (!team) {
    return (
      <div className="flex items-center gap-2 py-1.5 px-1 rounded text-xs opacity-50">
        <span className="h-3.5 w-5 rounded bg-muted/60 border border-dashed border-border" />
        <span className="text-muted-foreground italic text-[11px]">{lang === 'ar' ? 'بانتظار التحديد' : 'TBD'}</span>
      </div>
    );
  }
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onTeamClick(team.id); }}
      className={cn(
        'w-full flex items-center gap-2 py-1.5 px-1 rounded text-xs transition-all',
        highlight ? 'bg-[#F5C542]/15 ring-1 ring-[#F5C542]/40' : 'hover:bg-muted/50',
        !won && score !== null && 'opacity-60'
      )}
    >
      <img
        src={team.flag}
        alt={team.name}
        className="h-3.5 w-5 rounded-sm object-cover shrink-0"
        loading="lazy"
      />
      <span className={cn('flex-1 text-start font-bold truncate', won && 'text-[#F5C542]')}>
        {lang === 'ar' ? team.name_ar : team.name}
      </span>
      {score !== null && (
        <span className={cn('tabular-nums font-extrabold', won && 'text-[#F5C542]')}>{score}</span>
      )}
      {won && <Crown className="h-3 w-3 text-[#F5C542] shrink-0" />}
    </button>
  );
}

function FinalCard({
  match, getTeam, onTeamClick, highlightTeam, inPath, dimmed, onClick,
}: {
  match: Match;
  getTeam: (side: 'home' | 'away') => Team | undefined;
  onTeamClick: (id: string) => void;
  highlightTeam: string | null;
  inPath: boolean;
  dimmed: boolean;
  onClick: () => void;
}) {
  const { lang } = useThemeStore();
  const home = getTeam('home');
  const away = getTeam('away');
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FT' || match.status === 'AET' || match.status === 'PEN';
  const champion = isFinished ? TEAM_BY_ID[match.winner_id ?? ''] : null;

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-xl p-4 border-2 transition-all cursor-pointer overflow-hidden w-[240px]',
        'bg-gradient-to-br from-[#0B1F3B]/60 via-card to-[#C8102E]/20',
        champion ? 'border-[#F5C542] gold-glow' :
        isLive ? 'border-[#C8102E] live-pulse' :
        inPath ? 'border-[#F5C542]/60' :
        'border-[#F5C542]/40 hover:border-[#F5C542]',
        dimmed && 'opacity-30'
      )}
    >
      <div className="absolute -top-2 -right-2 text-5xl opacity-10 select-none">🏆</div>

      <div className="relative">
        <div className="text-center text-[10px] font-black uppercase tracking-widest text-[#F5C542] mb-3 flex items-center justify-center gap-1">
          <Trophy className="h-3.5 w-3.5" />
          {t('finalMatch', lang)}
        </div>

        <div className="space-y-2">
          <FinalTeamRow team={home} score={match.home_score} won={match.winner_id === home?.id} champion={!!champion && champion.id === home?.id} highlight={highlightTeam === home?.id} onClick={onTeamClick} />
          <div className="flex items-center justify-center text-xs text-muted-foreground font-bold py-0.5">VS</div>
          <FinalTeamRow team={away} score={match.away_score} won={match.winner_id === away?.id} champion={!!champion && champion.id === away?.id} highlight={highlightTeam === away?.id} onClick={onTeamClick} />
        </div>

        {isLive && (
          <div className="mt-3 text-center text-[#C8102E] font-bold text-xs flex items-center justify-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#C8102E] pulse-dot" />
            {match.minute}' {t('live', lang)}
          </div>
        )}

        {match.status === 'NS' && (
          <div className="mt-3 text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDateTime(match.date, lang)}
          </div>
        )}
      </div>
    </div>
  );
}

function ThirdPlaceCard({
  match, getTeam, onTeamClick, highlightTeam, inPath, dimmed, onClick,
}: {
  match: Match;
  getTeam: (side: 'home' | 'away') => Team | undefined;
  onTeamClick: (id: string) => void;
  highlightTeam: string | null;
  inPath: boolean;
  dimmed: boolean;
  onClick: () => void;
}) {
  const { lang } = useThemeStore();
  const home = getTeam('home');
  const away = getTeam('away');
  const showScore = match.status !== 'NS' && match.home_score !== null && match.away_score !== null;

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-xl p-3 border transition-all cursor-pointer w-[220px]',
        'bg-card/60 backdrop-blur',
        inPath ? 'border-[#CD7F32]/60' : 'border-[#CD7F32]/30 hover:border-[#CD7F32]/60',
        dimmed && 'opacity-30'
      )}
    >
      <div className="text-center text-[10px] font-black uppercase tracking-widest text-[#CD7F32] mb-2 flex items-center justify-center gap-1">
        <span className="text-base">🥉</span>
        {t('thirdPlaceMatch', lang)}
      </div>
      <div className="space-y-1.5">
        <FinalTeamRow team={home} score={match.home_score} won={match.winner_id === home?.id} champion={false} highlight={highlightTeam === home?.id} onClick={onTeamClick} small />
        <div className="flex items-center justify-center text-[10px] text-muted-foreground font-bold">VS</div>
        <FinalTeamRow team={away} score={match.away_score} won={match.winner_id === away?.id} champion={false} highlight={highlightTeam === away?.id} onClick={onTeamClick} small />
      </div>
      {match.status === 'NS' && (
        <div className="mt-2 text-center text-[9px] text-muted-foreground flex items-center justify-center gap-1">
          <Clock className="h-2.5 w-2.5" />
          {formatDateTime(match.date, lang)}
        </div>
      )}
    </div>
  );
}

function FinalTeamRow({
  team, score, won, champion, highlight, onClick, small = false,
}: {
  team: Team | undefined;
  score: number | null;
  won: boolean;
  champion: boolean;
  highlight: boolean;
  onClick: (id: string) => void;
  small?: boolean;
}) {
  const { lang } = useThemeStore();
  if (!team) {
    return (
      <div className="flex items-center gap-2 py-2 px-2 rounded bg-muted/30 text-xs opacity-50">
        <span className="h-5 w-7 rounded bg-muted" />
        <span className="italic text-muted-foreground">{t('waitingForTeams', lang)}</span>
      </div>
    );
  }
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(team.id); }}
      className={cn(
        'w-full flex items-center gap-3 py-2 px-2 rounded-lg transition-all',
        champion ? 'bg-[#F5C542]/20 ring-2 ring-[#F5C542]' :
        highlight ? 'bg-[#F5C542]/15 ring-1 ring-[#F5C542]/40' :
        'hover:bg-muted/50',
        !won && score !== null && !champion && 'opacity-70',
        small && 'py-1.5'
      )}
    >
      <img
        src={team.flag}
        alt={team.name}
        className={cn('rounded-sm object-cover shrink-0', small ? 'h-4 w-6' : 'h-6 w-9')}
        loading="lazy"
      />
      <span className={cn('flex-1 text-start font-black truncate', (won || champion) && 'text-[#F5C542]', small ? 'text-xs' : 'text-sm')}>
        {lang === 'ar' ? team.name_ar : team.name}
      </span>
      {score !== null && (
        <span className={cn('font-black tabular-nums', (won || champion) && 'text-[#F5C542]', small ? 'text-base' : 'text-lg')}>{score}</span>
      )}
      {champion && <Crown className="h-4 w-4 text-[#F5C542] fill-current shrink-0" />}
    </button>
  );
}

// ============================================================
// Mobile Bracket — vertical accordion
// ============================================================

function BracketMobile({
  r32, r16, qf, sf, final, third,
  getTeamForSlot, pathMatches, highlightTeam, setHighlightTeam,
}: any) {
  const { lang } = useThemeStore();
  const { go } = useNavStore();
  const [open, setOpen] = useState<string>('R32');

  const sections: Array<{ key: string; label: string; matches: Match[] }> = [
    { key: 'R32', label: t('roundOf32', lang), matches: r32 },
    { key: 'R16', label: t('round16', lang), matches: r16 },
    { key: 'QF', label: t('quarterFinals', lang), matches: qf },
    { key: 'SF', label: t('semiFinals', lang), matches: sf },
    { key: 'FINAL', label: t('finalMatch', lang), matches: final ? [final] : [] },
    { key: 'THIRD', label: t('thirdPlaceMatch', lang), matches: third ? [third] : [] },
  ];

  return (
    <div className="space-y-3">
      {sections.map(section => (
        <div key={section.key} className="glass-card rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === section.key ? '' : section.key)}
            className="w-full px-4 py-3 flex items-center justify-between text-start"
          >
            <span className="font-extrabold text-sm">{section.label}</span>
            <span className="text-xs text-muted-foreground">{section.matches.length} {lang === 'ar' ? 'مباراة' : 'matches'}</span>
          </button>
          {open === section.key && (
            <div className="p-3 space-y-2 border-t border-border/30 animate-slide-up">
              {section.matches.map((m: Match) => (
                <BracketMatch
                  key={m.id}
                  match={m}
                  getTeam={(side: 'home' | 'away') => getTeamForSlot(m, side)}
                  onTeamClick={setHighlightTeam}
                  highlightTeam={highlightTeam}
                  inPath={pathMatches?.has(m.id) ?? false}
                  dimmed={!!highlightTeam && !(pathMatches?.has(m.id))}
                  onClick={() => go('match-details', { id: m.id })}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
