'use client';

import { useEffect, useState, useMemo } from 'react';
import { useNavStore, useThemeStore } from '@/lib/stores/wc-stores';
import { getKnockoutMatches } from '@/lib/wc/supabase-client';
import { TEAM_BY_ID, MATCH_BY_ID } from '@/lib/wc/data';
import { t } from '@/lib/wc/i18n';
import type { Match, Team } from '@/lib/wc/types';
import { PageTitle } from '@/components/wc/SectionHeader';
import { GitBranch, Trophy, Crown, Info, X } from 'lucide-react';
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

  const r16 = matches.filter(m => m.round === 'R16').sort((a, b) => (a.bracket_position ?? 0) - (b.bracket_position ?? 0));
  const qf = matches.filter(m => m.round === 'QF').sort((a, b) => (a.bracket_position ?? 0) - (b.bracket_position ?? 0));
  const sf = matches.filter(m => m.round === 'SF').sort((a, b) => (a.bracket_position ?? 0) - (b.bracket_position ?? 0));
  const final = matches.find(m => m.round === 'FINAL');
  const third = matches.find(m => m.round === 'THIRD');

  // Helper to determine team in a slot (advance from previous match winner)
  function getTeamForSlot(match: Match, side: 'home' | 'away'): Team | undefined {
    const teamId = side === 'home' ? match.home_team_id : match.away_team_id;
    if (teamId && TEAM_BY_ID[teamId]) return TEAM_BY_ID[teamId];
    // Look for previous match feeding into this slot
    const prevMatches = matches.filter(m => m.next_match_id === match.id);
    // Heuristic: even bracket_position feeds home, odd feeds away
    // For our mock data, we'll just check winner
    for (const prev of prevMatches) {
      if (prev.winner_id && TEAM_BY_ID[prev.winner_id]) {
        const winner = TEAM_BY_ID[prev.winner_id];
        // Assign by position: home if prev.bracket_position is odd, away if even
        if ((prev.bracket_position ?? 0) % 2 === 1 && side === 'home') return winner;
        if ((prev.bracket_position ?? 0) % 2 === 0 && side === 'away') return winner;
      }
    }
    return undefined;
  }

  // Determine if a match is part of a team's path
  function isInPath(match: Match, teamId: string): boolean {
    if (match.home_team_id === teamId || match.away_team_id === teamId) return true;
    if (match.winner_id === teamId) return true;
    return false;
  }

  // For path highlighting, find all matches where the team is or would advance
  function getPathMatches(teamId: string): Set<string> {
    const path = new Set<string>();
    // Find R16 match for this team
    let current = r16.find(m => m.home_team_id === teamId || m.away_team_id === teamId);
    if (current) {
      path.add(current.id);
      // Follow next_match_id chain
      while (current?.next_match_id) {
        const next = matchesById[current.next_match_id];
        if (!next) break;
        // Add if team won (or will play in) the previous
        if (next.home_team_id === teamId || next.away_team_id === teamId || current.winner_id === teamId) {
          path.add(next.id);
        }
        current = next;
      }
    }
    return path;
  }

  const pathMatches = highlightTeam ? getPathMatches(highlightTeam) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle
        icon={<GitBranch className="h-5 w-5 md:h-6 md:w-6 text-[#C8102E]" />}
        title={t('knockoutStage', lang)}
        subtitle={lang === 'ar' ? 'من دور الـ16 إلى النهائي' : 'From Round of 16 to the Final'}
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

      {/* Hint */}
      {!highlightTeam && (
        <div className="glass-card rounded-xl p-3 flex items-center gap-2 text-xs text-muted-foreground border-[#F5C542]/30">
          <Info className="h-4 w-4 text-[#F5C542] shrink-0" />
          <span>{t('pathHighlightHint', lang)}</span>
        </div>
      )}

      {/* Champion banner if final is decided */}
      {final?.winner_id && (
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
                  <LocalizedTeamNameLocalized id={final.winner_id} />
                </div>
              </div>
            </div>
            <div className="text-6xl">{TEAM_BY_ID[final.winner_id]?.flag}</div>
          </div>
        </div>
      )}

      {/* Desktop bracket (hidden on mobile) */}
      <div className="hidden md:block">
        <BracketDesktop
          r16={r16}
          qf={qf}
          sf={sf}
          final={final}
          third={third}
          getTeamForSlot={getTeamForSlot}
          isInPath={isInPath}
          pathMatches={pathMatches}
          highlightTeam={highlightTeam}
          setHighlightTeam={setHighlightTeam}
          matchesById={matchesById}
        />
      </div>

      {/* Mobile accordion (hidden on desktop) */}
      <div className="md:hidden">
        <BracketMobile
          r16={r16}
          qf={qf}
          sf={sf}
          final={final}
          third={third}
          getTeamForSlot={getTeamForSlot}
        />
      </div>
    </div>
  );
}

function LocalizedTeamNameLocalized({ id }: { id: string }) {
  const { lang } = useThemeStore();
  const team = TEAM_BY_ID[id];
  if (!team) return null;
  return <>{lang === 'ar' ? team.name_ar : team.name}</>;
}

// ============================================================
// Desktop Bracket — horizontal tree with SVG connectors
// ============================================================

function BracketDesktop({
  r16, qf, sf, final, third,
  getTeamForSlot, isInPath, pathMatches,
  highlightTeam, setHighlightTeam, matchesById,
}: any) {
  const { lang } = useThemeStore();
  const { go } = useNavStore();

  // Layout: 5 columns — R16, QF, SF, FINAL, 3RD (final in middle, 3rd below)
  // Actually we'll do: R16 | QF | SF | [FINAL on top, 3RD on bottom]

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6 overflow-x-auto">
      <div className="min-w-[1100px] grid grid-cols-[1fr_1fr_1fr_auto] gap-6 relative">

        {/* Column 1: R16 (8 matches, split top/bottom halves) */}
        <div className="space-y-2">
          <ColumnHeader label={t('roundOf16', lang)} />
          <div className="grid gap-2" style={{ gridTemplateRows: 'repeat(8, minmax(0, 1fr))' }}>
            {r16.map((m: Match) => (
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

        {/* Column 2: QF (4 matches) */}
        <div className="space-y-2">
          <ColumnHeader label={t('quarterFinals', lang)} />
          <div className="grid grid-rows-4 gap-2 h-full pt-12">
            {qf.map((m: Match) => (
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

        {/* Column 3: SF (2 matches) */}
        <div className="space-y-2">
          <ColumnHeader label={t('semiFinals', lang)} />
          <div className="grid grid-rows-2 gap-2 h-full pt-20">
            {sf.map((m: Match) => (
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

        {/* Column 4: Final + 3rd place */}
        <div className="flex flex-col gap-8 w-[260px]">
          <ColumnHeader label={t('finalMatch', lang)} />
          {/* Final at top */}
          <div className="mt-12">
            {final && (
              <FinalMatch
                match={final}
                getTeam={(side: 'home' | 'away') => getTeamForSlot(final, side)}
                onTeamClick={setHighlightTeam}
                highlightTeam={highlightTeam}
                inPath={pathMatches?.has(final.id) ?? false}
                dimmed={!!highlightTeam && !(pathMatches?.has(final.id))}
                onClick={() => go('match-details', { id: final.id })}
              />
            )}
          </div>

          {/* 3rd place at bottom */}
          <div>
            <ColumnHeader label={t('thirdPlaceMatch', lang)} />
            <div className="mt-2">
              {third && (
                <BracketMatch
                  match={third}
                  getTeam={(side: 'home' | 'away') => getTeamForSlot(third, side)}
                  onTeamClick={setHighlightTeam}
                  highlightTeam={highlightTeam}
                  inPath={pathMatches?.has(third.id) ?? false}
                  dimmed={!!highlightTeam && !(pathMatches?.has(third.id))}
                  compact
                  onClick={() => go('match-details', { id: third.id })}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColumnHeader({ label }: { label: string }) {
  return (
    <div className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 pb-2 border-b border-border/30">
      {label}
    </div>
  );
}

function BracketMatch({
  match, getTeam, onTeamClick, highlightTeam, inPath, dimmed, compact, onClick,
}: {
  match: Match;
  getTeam: (side: 'home' | 'away') => Team | undefined;
  onTeamClick: (id: string) => void;
  highlightTeam: string | null;
  inPath: boolean;
  dimmed: boolean;
  compact?: boolean;
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
        'rounded-lg p-2 border transition-all cursor-pointer min-w-[200px]',
        'bg-card/60 backdrop-blur',
        isLive ? 'border-[#C8102E]/50 live-pulse' :
        inPath ? 'border-[#F5C542]/60 gold-glow' :
        'border-border/40 hover:border-[#C8102E]/40',
        dimmed && 'opacity-30',
        compact && 'min-w-[160px]'
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

      {/* Home */}
      <TeamRow
        team={home}
        score={showScore ? match.home_score : null}
        won={homeWon}
        highlight={highlightTeam === home?.id}
        onTeamClick={onTeamClick}
      />
      {/* Away */}
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
      <div className="flex items-center gap-2 py-1.5 px-1 rounded text-xs opacity-40">
        <span className="h-5 w-5 rounded-full bg-muted" />
        <span className="text-muted-foreground italic">—</span>
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
      <span className="text-base shrink-0">{team.flag}</span>
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

function FinalMatch({
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
        'relative rounded-xl p-4 border-2 transition-all cursor-pointer overflow-hidden',
        'bg-gradient-to-br from-[#0B1F3B]/60 via-card to-[#C8102E]/20',
        champion ? 'border-[#F5C542] gold-glow' :
        isLive ? 'border-[#C8102E] live-pulse' :
        inPath ? 'border-[#F5C542]/60' :
        'border-[#F5C542]/40 hover:border-[#F5C542]',
        dimmed && 'opacity-30'
      )}
    >
      {/* Trophy watermark */}
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
          <div className="mt-3 text-center text-[10px] text-muted-foreground">
            {new Date(match.date).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}
          </div>
        )}
      </div>
    </div>
  );
}

function FinalTeamRow({
  team, score, won, champion, highlight, onClick,
}: {
  team: Team | undefined;
  score: number | null;
  won: boolean;
  champion: boolean;
  highlight: boolean;
  onClick: (id: string) => void;
}) {
  const { lang } = useThemeStore();
  if (!team) {
    return (
      <div className="flex items-center gap-2 py-2 px-2 rounded bg-muted/30 text-xs opacity-50">
        <span className="h-6 w-6 rounded-full bg-muted" />
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
        !won && score !== null && !champion && 'opacity-70'
      )}
    >
      <span className="text-2xl shrink-0">{team.flag}</span>
      <span className={cn('flex-1 text-start text-sm font-black truncate', (won || champion) && 'text-[#F5C542]')}>
        {lang === 'ar' ? team.name_ar : team.name}
      </span>
      {score !== null && (
        <span className={cn('text-lg font-black tabular-nums', (won || champion) && 'text-[#F5C542]')}>{score}</span>
      )}
      {champion && <Crown className="h-5 w-5 text-[#F5C542] fill-current shrink-0" />}
    </button>
  );
}

// ============================================================
// Mobile Bracket — vertical accordion
// ============================================================

function BracketMobile({
  r16, qf, sf, final, third, getTeamForSlot,
}: any) {
  const { lang } = useThemeStore();
  const { go } = useNavStore();
  const [open, setOpen] = useState<string>('R16');

  const sections: Array<{ key: string; label: string; matches: Match[] }> = [
    { key: 'R16', label: t('roundOf16', lang), matches: r16 },
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
                  onTeamClick={() => {}}
                  highlightTeam={null}
                  inPath={false}
                  dimmed={false}
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
