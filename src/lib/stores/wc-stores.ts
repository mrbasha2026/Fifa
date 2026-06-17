'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PageKey, NavState } from '@/lib/wc/types';

// ============================================================
// Navigation store (state-based router since we only have `/`)
// ============================================================

interface NavStore extends NavState {
  go: (page: PageKey, params?: Record<string, string>) => void;
  back: () => void;
}

export const useNavStore = create<NavStore>((set, get) => ({
  page: 'home',
  params: {},
  history: [] as NavState[],
  go: (page, params = {}) => {
    const current = { page: get().page, params: get().params };
    set(state => ({
      page,
      params,
      history: [...(state.history ?? []), current],
    }));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  back: () => {
    const hist = (get() as any).history as NavState[];
    if (hist && hist.length > 0) {
      const prev = hist[hist.length - 1];
      set(state => ({
        page: prev.page,
        params: prev.params,
        history: ((state as any).history ?? []).slice(0, -1),
      }));
    } else {
      set({ page: 'home', params: {} });
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
}));

// ============================================================
// Theme + RTL store (persisted to localStorage)
// ============================================================

type ThemeMode = 'dark' | 'light';
type LangDir = 'rtl' | 'ltr';

interface ThemeStore {
  theme: ThemeMode;
  lang: 'ar' | 'en';
  dir: LangDir;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
  toggleLang: () => void;
  setLang: (l: 'ar' | 'en') => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      lang: 'ar',
      dir: 'rtl',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        applyTheme(next, get().dir);
      },
      setTheme: (t) => { set({ theme: t }); applyTheme(t, get().dir); },
      toggleLang: () => {
        const next = get().lang === 'ar' ? 'en' : 'ar';
        const dir: LangDir = next === 'ar' ? 'rtl' : 'ltr';
        set({ lang: next, dir });
        applyTheme(get().theme, dir);
      },
      setLang: (l) => {
        const dir: LangDir = l === 'ar' ? 'rtl' : 'ltr';
        set({ lang: l, dir });
        applyTheme(get().theme, dir);
      },
    }),
    {
      name: 'wc-theme',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme, state.dir);
      },
    }
  )
);

function applyTheme(theme: ThemeMode, dir: LangDir) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  root.setAttribute('dir', dir);
  root.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
}

// ============================================================
// Favorites store (LocalStorage only)
// ============================================================

export interface FavoriteEntry {
  kind: 'team' | 'match' | 'player';
  id: string;
  addedAt: number;
}

interface FavoritesStore {
  items: FavoriteEntry[];
  toggle: (kind: 'team' | 'match' | 'player', id: string) => void;
  isFavorite: (kind: 'team' | 'match' | 'player', id: string) => boolean;
  remove: (kind: 'team' | 'match' | 'player', id: string) => void;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (kind, id) => {
        const exists = get().items.some(i => i.kind === kind && i.id === id);
        if (exists) {
          set({ items: get().items.filter(i => !(i.kind === kind && i.id === id)) });
        } else {
          set({ items: [...get().items, { kind, id, addedAt: Date.now() }] });
        }
      },
      isFavorite: (kind, id) => get().items.some(i => i.kind === kind && i.id === id),
      remove: (kind, id) => set({ items: get().items.filter(i => !(i.kind === kind && i.id === id)) }),
      clear: () => set({ items: [] }),
    }),
    { name: 'wc-favorites' }
  )
);
