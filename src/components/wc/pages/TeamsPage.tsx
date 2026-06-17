'use client';

import { useState, useMemo } from 'react';
import { useNavStore, useThemeStore } from '@/lib/stores/wc-stores';
import { TEAMS, TEAMS_BY_GROUP } from '@/lib/wc/data';
import { t } from '@/lib/wc/i18n';
import type { Team } from '@/lib/wc/types';
import { TeamLogo, LocalizedTeamName, TeamCardSkeleton } from '@/components/wc/MatchCard';
import { PageTitle } from '@/components/wc/SectionHeader';
import { FavoriteButton } from '@/components/wc/FavoriteButton';
import { Users, Search, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TeamsPage() {
  const { lang } = useThemeStore();
  const { go } = useNavStore();
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState<string | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    return TEAMS.filter(team => {
      if (group !== 'ALL' && team.group !== group) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = [team.name, team.name_ar, team.fifa_code].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => (a.fifa_ranking ?? 999) - (b.fifa_ranking ?? 999));
  }, [search, group]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle
        icon={<Users className="h-5 w-5 md:h-6 md:w-6 text-[#C8102E]" />}
        title={t('allTeams', lang)}
        subtitle={lang === 'ar' ? `${TEAMS.length} منتخب في 12 مجموعة` : `${TEAMS.length} teams in 12 groups`}
      />

      {/* Search + Group filter */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('searchTeams', lang)}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full ps-10 pe-3 py-2.5 rounded-lg bg-background/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/40"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setGroup('ALL')}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-bold transition-all',
              group === 'ALL' ? 'bg-primary text-primary-foreground' : 'bg-muted/60 text-muted-foreground hover:bg-muted'
            )}
          >
            {t('allGroups', lang)}
          </button>
          {Object.keys(TEAMS_BY_GROUP).sort().map(g => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={cn(
                'h-7 w-7 rounded-md text-xs font-bold transition-all',
                group === g ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Teams grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map(team => (
          <TeamCard key={team.id} team={team} onClick={() => go('team-details', { id: team.id })} />
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

function TeamCard({ team, onClick }: { team: Team; onClick: () => void }) {
  const { lang } = useThemeStore();
  return (
    <div
      onClick={onClick}
      className="glass-card rounded-xl p-4 cursor-pointer hover:scale-[1.03] hover:border-[#C8102E]/40 transition-all group relative"
    >
      <div className="absolute top-2 end-2">
        <FavoriteButton kind="team" id={team.id} size="sm" />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <TeamLogo team={team} size="lg" />
        <div className="min-w-0">
          <div className="font-extrabold text-sm group-hover:text-[#F5C542] transition-colors truncate">
            <LocalizedTeamName team={team} />
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">{team.fifa_code}</div>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground">
          <span className="font-bold">{t('group', lang)}</span>
          <span className="font-mono">{team.group}</span>
        </span>
        {team.fifa_ranking && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <Star className="h-3 w-3 text-[#F5C542]" />
            <span className="font-bold">#{team.fifa_ranking}</span>
          </span>
        )}
      </div>
      {team.coach && (
        <div className="mt-2 pt-2 border-t border-border/30 text-[10px] text-muted-foreground">
          <span className="font-semibold">{t('coach', lang)}:</span> {team.coach}
        </div>
      )}
    </div>
  );
}
