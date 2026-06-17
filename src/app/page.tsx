'use client';

import { useEffect } from 'react';
import { useNavStore, useThemeStore } from '@/lib/stores/wc-stores';
import { Header, Footer } from '@/components/wc/Header';
import { DataStatusBanner } from '@/components/wc/DataStatusBanner';
import { HomePage } from '@/components/wc/pages/HomePage';
import { MatchesPage } from '@/components/wc/pages/MatchesPage';
import { MatchDetailsPage } from '@/components/wc/pages/MatchDetailsPage';
import { GroupsPage } from '@/components/wc/pages/GroupsPage';
import { KnockoutPage } from '@/components/wc/pages/KnockoutPage';
import { TeamsPage } from '@/components/wc/pages/TeamsPage';
import { TeamDetailsPage } from '@/components/wc/pages/TeamDetailsPage';
import { PlayersPage } from '@/components/wc/pages/PlayersPage';
import { TopScorersPage, TopAssistsPage } from '@/components/wc/pages/TopScorersPage';
import { FavoritesPage } from '@/components/wc/pages/FavoritesPage';

export default function Home() {
  const { page, params } = useNavStore();
  const { theme, dir } = useThemeStore();

  // Apply theme + dir on mount + changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    root.setAttribute('dir', dir);
    root.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
  }, [theme, dir]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <DataStatusBanner />
      <Header />
      <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 lg:px-6 py-6">
        {page === 'home' && <HomePage />}
        {page === 'matches' && <MatchesPage />}
        {page === 'match-details' && params?.id && <MatchDetailsPage matchId={params.id} />}
        {page === 'groups' && <GroupsPage initialGroup={params?.group} />}
        {page === 'knockout' && <KnockoutPage />}
        {page === 'teams' && <TeamsPage />}
        {page === 'team-details' && params?.id && <TeamDetailsPage teamId={params.id} />}
        {page === 'players' && <PlayersPage />}
        {page === 'top-scorers' && <TopScorersPage />}
        {page === 'top-assists' && <TopAssistsPage />}
        {page === 'favorites' && <FavoritesPage />}
      </main>
      <Footer />
    </div>
  );
}
