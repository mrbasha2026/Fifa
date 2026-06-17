'use client';

import { useEffect, useState, useMemo } from 'react';
import { useThemeStore } from '@/lib/stores/wc-stores';
import { ALL_MATCHES, TEAMS_BY_GROUP, TEAM_BY_ID } from '@/lib/wc/data';
import { t } from '@/lib/wc/i18n';
import type { Match, MatchRound } from '@/lib/wc/types';
import { MatchCard, MatchCardSkeleton } from '@/components/wc/MatchCard';
import { PageTitle } from '@/components/wc/SectionHeader';
import { Calendar, Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type StageFilter = MatchRound | 'ALL';
type GroupFilter = string | 'ALL';
type DateFilter = string | 'ALL';

export function MatchesPage() {
  const { lang } = useThemeStore();
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<StageFilter>('ALL');
  const [group, setGroup] = useState<GroupFilter>('ALL');
  const [date, setDate] = useState<DateFilter>('ALL');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'ALL' | 'LIVE' | 'FT' | 'NS'>('ALL');

  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), 300);
    return () => window.clearTimeout(id);
  }, []);

  // Build date list
  const dates = useMemo(() => {
    const set = new Set<string>();
    ALL_MATCHES.forEach(m => {
      const d = new Date(m.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      set.add(key);
    });
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return ALL_MATCHES.filter(m => {
      if (stage !== 'ALL' && m.round !== stage) return false;
      if (group !== 'ALL' && m.group !== group) return false;
      if (status !== 'ALL' && m.status !== status) return false;
      if (date !== 'ALL') {
        const d = new Date(m.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (key !== date) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const homeTeam = TEAM_BY_ID[m.home_team_id];
        const awayTeam = TEAM_BY_ID[m.away_team_id];
        const haystack = [
          homeTeam?.name, homeTeam?.name_ar,
          awayTeam?.name, awayTeam?.name_ar,
          m.stadium, m.city,
        ].filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => +new Date(a.date) - +new Date(b.date));
  }, [stage, group, status, date, search]);

  const stages: Array<{ value: StageFilter; label: string }> = [
    { value: 'ALL', label: t('allStages', lang) },
    { value: 'group', label: t('groupStage', lang) },
    { value: 'R16', label: t('round16', lang) },
    { value: 'QF', label: t('quarterFinals', lang) },
    { value: 'SF', label: t('semiFinals', lang) },
    { value: 'FINAL', label: t('final', lang) },
    { value: 'THIRD', label: t('thirdPlace', lang) },
  ];

  const statuses: Array<{ value: typeof status; label: string; color: string }> = [
    { value: 'ALL', label: lang === 'ar' ? 'الكل' : 'All', color: '' },
    { value: 'LIVE', label: t('live', lang), color: 'text-[#C8102E]' },
    { value: 'NS', label: t('notStarted', lang), color: 'text-[#F5C542]' },
    { value: 'FT', label: t('finished', lang), color: 'text-muted-foreground' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle
        icon={<Calendar className="h-5 w-5 md:h-6 md:w-6 text-[#C8102E]" />}
        title={t('matches', lang)}
        subtitle={lang === 'ar' ? `${filtered.length} مباراة` : `${filtered.length} matches`}
      />

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('searchTeams', lang)}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full ps-10 pe-3 py-2.5 rounded-lg bg-background/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/40 focus:border-[#C8102E]/40"
          />
        </div>

        {/* Status pills */}
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                status === s.value
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              )}
            >
              {s.value === 'LIVE' && <span className="h-1.5 w-1.5 rounded-full bg-current pulse-dot me-1 inline-block" />}
              {s.label}
            </button>
          ))}
        </div>

        {/* Stage + Group + Date selects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FilterSelect
            label={t('filterByStage', lang)}
            value={stage}
            onChange={(v) => setStage(v as StageFilter)}
            options={stages.map(s => ({ value: s.value, label: s.label }))}
          />
          <FilterSelect
            label={t('filterByGroup', lang)}
            value={group}
            onChange={(v) => setGroup(v as GroupFilter)}
            options={[
              { value: 'ALL', label: t('allGroups', lang) },
              ...Object.keys(TEAMS_BY_GROUP).sort().map(g => ({ value: g, label: `${t('group', lang)} ${g}` })),
            ]}
          />
          <FilterSelect
            label={t('filterByDate', lang)}
            value={date}
            onChange={(v) => setDate(v as DateFilter)}
            options={[
              { value: 'ALL', label: t('allDates', lang) },
              ...dates.map(d => ({
                value: d,
                label: new Date(d + 'T12:00:00').toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
              })),
            ]}
          />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => <MatchCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-sm text-muted-foreground">{t('noData', lang)}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
        <Filter className="h-3 w-3 inline me-1" />
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C8102E]/40"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
