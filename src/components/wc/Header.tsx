'use client';

import { useState } from 'react';
import { useNavStore, useThemeStore, useFavoritesStore } from '@/lib/stores/wc-stores';
import { t } from '@/lib/wc/i18n';
import type { PageKey } from '@/lib/wc/types';
import {
  Home, Trophy, Users, User, Star, Calendar, BarChart3, Target, GitBranch,
  Sun, Moon, Languages, Menu, X, Heart, ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  key: PageKey;
  icon: React.ComponentType<{ className?: string }>;
  label: { ar: string; en: string };
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', icon: Home, label: { ar: 'الرئيسية', en: 'Home' } },
  { key: 'matches', icon: Calendar, label: { ar: 'المباريات', en: 'Matches' } },
  { key: 'groups', icon: BarChart3, label: { ar: 'المجموعات', en: 'Groups' } },
  { key: 'knockout', icon: GitBranch, label: { ar: 'الإقصاء', en: 'Knockout' } },
  { key: 'teams', icon: Users, label: { ar: 'المنتخبات', en: 'Teams' } },
  { key: 'players', icon: User, label: { ar: 'اللاعبون', en: 'Players' } },
  { key: 'top-scorers', icon: Target, label: { ar: 'الهدافون', en: 'Scorers' } },
  { key: 'top-assists', icon: Star, label: { ar: 'الصُنّاع', en: 'Assists' } },
  { key: 'predictions', icon: ClipboardList, label: { ar: 'التوقعات', en: 'Predictions' } },
  { key: 'favorites', icon: Heart, label: { ar: 'المفضلة', en: 'Favorites' } },
];

export function Header() {
  const { page, go } = useNavStore();
  const { theme, lang, toggleTheme, toggleLang } = useThemeStore();
  const items = useFavoritesStore(s => s.items);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (k: PageKey) => {
    go(k);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl bg-background/80">
      {/* Top bar */}
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-[#C8102E] via-[#0B1F3B] to-[#F5C542] flex items-center justify-center shadow-lg shadow-[#C8102E]/30 group-hover:scale-105 transition-transform">
              <Trophy className="h-5 w-5 text-white" />
              <span className="absolute -top-1 -right-1 text-xs">🏆</span>
            </div>
            <div className="hidden sm:block text-right leading-tight">
              <div className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-[#F5C542] via-white to-[#F5C542] bg-clip-text text-transparent">
                {lang === 'ar' ? 'كأس العالم' : 'WORLD CUP'}
              </div>
              <div className="text-[10px] text-muted-foreground font-semibold tracking-widest">2026</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const active = page === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.key)}
                  className={cn(
                    'relative px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all',
                    active
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{lang === 'ar' ? item.label.ar : item.label.en}</span>
                  {item.key === 'favorites' && items.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-[#C8102E] text-[10px] text-white flex items-center justify-center font-bold">
                      {items.length}
                    </span>
                  )}
                  {active && (
                    <span className="absolute -bottom-[1px] left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-[#C8102E] to-[#F5C542]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLang}
              className="h-9 w-9 rounded-lg gap-1"
              title={t('language', lang)}
            >
              <Languages className="h-4 w-4" />
              <span className="text-[10px] font-bold">{lang === 'ar' ? 'EN' : 'ع'}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-lg"
              title={theme === 'dark' ? t('lightMode', lang) : t('darkMode', lang)}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-[#F5C542]" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden h-9 w-9 rounded-lg"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl animate-slide-up">
          <div className="mx-auto max-w-[1400px] px-4 py-3 grid grid-cols-3 gap-2">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const active = page === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.key)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 rounded-lg text-xs font-semibold transition-all',
                    active
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:bg-muted/60'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-center">{lang === 'ar' ? item.label.ar : item.label.en}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { lang } = useThemeStore();
  return (
    <footer className="mt-12 border-t border-border/60 bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <span className="font-semibold">
              {lang === 'ar' ? 'كأس العالم 2026' : 'World Cup 2026'}
            </span>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-xs">Canada · Mexico · USA</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#10B981] pulse-dot" />
              {lang === 'ar' ? 'متصل بـ Supabase' : 'Supabase Connected'}
            </span>
            <span className="text-muted-foreground/60">|</span>
            <span>{lang === 'ar' ? 'تحديث كل 5 دقائق' : 'Updates every 5 min'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
