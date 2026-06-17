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
import { PredictionsPage } from '@/components/wc/pages/PredictionsPage';

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

  // Auto-sync every 60 seconds (background, non-blocking)
  // Triggers server-side sync from worldcup26.ir → Supabase
  useEffect(() => {
    const SYNC_INTERVAL = 60_000; // 60 seconds
    const triggerSync = async () => {
      try {
        await fetch('/api/sync', { method: 'POST' });
      } catch {
        // Silent fail — sync is best-effort
      }
    };
    // Initial sync after 5 seconds (let page load first)
    const initialTimer = setTimeout(triggerSync, 5000);
    // Periodic sync
    const interval = setInterval(triggerSync, SYNC_INTERVAL);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

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
        {page === 'predictions' && <PredictionsPage />}
      </main>
      <Footer />
    </div>
  );
}
