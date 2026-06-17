'use client';

import { useNavStore, useThemeStore, useFavoritesStore } from '@/lib/stores/wc-stores';
import { TEAM_BY_ID, PLAYER_BY_ID, MATCH_BY_ID } from '@/lib/wc/data';
import { t } from '@/lib/wc/i18n';
import type { Team, Player, Match } from '@/lib/wc/types';
import { TeamLogo, LocalizedTeamName, MatchCard } from '@/components/wc/MatchCard';
import { PageTitle } from '@/components/wc/SectionHeader';
import { FavoriteButton } from '@/components/wc/FavoriteButton';
import { Heart, Trash2, Users, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FavoritesPage() {
  const { lang } = useThemeStore();
  const { go } = useNavStore();
  const { items, clear } = useFavoritesStore();

  const teams = items.filter(i => i.kind === 'team').map(i => TEAM_BY_ID[i.id]).filter(Boolean) as Team[];
  const players = items.filter(i => i.kind === 'player').map(i => PLAYER_BY_ID[i.id]).filter(Boolean) as Player[];
  const matches = items.filter(i => i.kind === 'match').map(i => MATCH_BY_ID[i.id]).filter(Boolean) as Match[];

  if (items.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageTitle
          icon={<Heart className="h-5 w-5 md:h-6 md:w-6 text-[#C8102E]" />}
          title={t('favorites', lang)}
        />
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">💚</div>
          <div className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            {t('favoritesEmpty', lang)}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => go('teams')}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:scale-105 transition-transform"
            >
              {t('teams', lang)}
            </button>
            <button
              onClick={() => go('players')}
              className="px-4 py-2 rounded-lg bg-muted text-foreground font-bold text-sm hover:bg-muted/70 transition-colors"
            >
              {t('players', lang)}
            </button>
            <button
              onClick={() => go('matches')}
              className="px-4 py-2 rounded-lg bg-muted text-foreground font-bold text-sm hover:bg-muted/70 transition-colors"
            >
              {t('matches', lang)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle
        icon={<Heart className="h-5 w-5 md:h-6 md:w-6 text-[#C8102E]" />}
        title={t('favorites', lang)}
        subtitle={lang === 'ar' ? `${items.length} عنصر محفوظ` : `${items.length} saved items`}
        actions={
          <button
            onClick={() => { if (confirm(lang === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?')) clear(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8102E]/10 text-[#C8102E] hover:bg-[#C8102E]/20 text-xs font-bold transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('clearAll', lang)}
          </button>
        }
      />

      {/* Favorite teams */}
      {teams.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-base font-extrabold mb-3">
            <Users className="h-4 w-4 text-[#F5C542]" />
            {t('favoriteTeams', lang)}
            <span className="text-xs text-muted-foreground">({teams.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {teams.map(team => (
              <div
                key={team.id}
                onClick={() => go('team-details', { id: team.id })}
                className="glass-card rounded-xl p-4 cursor-pointer hover:scale-[1.03] hover:border-[#C8102E]/40 transition-all relative"
              >
                <div className="absolute top-2 end-2">
                  <FavoriteButton kind="team" id={team.id} size="sm" />
                </div>
                <div className="flex items-center gap-3">
                  <TeamLogo team={team} size="lg" />
                  <div>
                    <div className="font-extrabold text-sm"><LocalizedTeamName team={team} /></div>
                    <div className="text-[10px] text-muted-foreground">{t('group', lang)} {team.group} · {team.fifa_code}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Favorite players */}
      {players.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-base font-extrabold mb-3">
            <User className="h-4 w-4 text-[#F5C542]" />
            {t('favoritePlayers', lang)}
            <span className="text-xs text-muted-foreground">({players.length})</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {players.map(p => (
              <div
                key={p.id}
                onClick={() => go('players', {})}
                className="glass-card rounded-xl p-3 text-center cursor-pointer hover:scale-[1.03] hover:border-[#C8102E]/40 transition-all relative"
              >
                <div className="absolute top-1.5 end-1.5">
                  <FavoriteButton kind="player" id={p.id} size="sm" />
                </div>
                <div className="text-3xl mb-2">{p.photo}</div>
                <div className="font-bold text-xs truncate">{lang === 'ar' ? p.name_ar : p.name}</div>
                <div className="text-[10px] text-muted-foreground">{p.position} · #{p.number}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Favorite matches */}
      {matches.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-base font-extrabold mb-3">
            <Calendar className="h-4 w-4 text-[#F5C542]" />
            {t('favoriteMatches', lang)}
            <span className="text-xs text-muted-foreground">({matches.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}
    </div>
  );
}
