'use client';

import { useEffect, useState } from 'react';
import { useNavStore, useThemeStore } from '@/lib/stores/wc-stores';
import { getSupabase } from '@/lib/wc/supabase-real';
import { TEAM_BY_ID, MATCH_BY_ID } from '@/lib/wc/data';
import { getUpcomingMatches } from '@/lib/wc/supabase-client';
import { t } from '@/lib/wc/i18n';
import { formatDateTime } from '@/lib/wc/time';
import type { Match } from '@/lib/wc/types';
import { PageTitle } from '@/components/wc/SectionHeader';
import { Target, Check, X, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Prediction {
  id: string;
  match_id: string;
  predictor_name: string;
  predicted_home_score: number;
  predicted_away_score: number;
  actual_home_score: number | null;
  actual_away_score: number | null;
  is_correct: boolean | null;
  is_exact: boolean | null;
  points: number;
}

export function PredictionsPage() {
  const { lang } = useThemeStore();
  const [upcoming, setUpcoming] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [allPredictions, setAllPredictions] = useState<Prediction[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [view, setView] = useState<'predict' | 'results'>('predict');

  const loadPredictions = async () => {
    const sb = getSupabase();
    if (!sb) return;
    try {
      const { data } = await sb.from('predictions').select('*').order('created_at', { ascending: false });
      if (data) {
        setAllPredictions(data as Prediction[]);
        const myName = localStorage.getItem('wc-predictor-name');
        if (myName) {
          setPredictions((data as Prediction[]).filter(p => p.predictor_name === myName));
        }
      }
    } catch {}
  };

  useEffect(() => {
    // Load name from localStorage
    const savedName = localStorage.getItem('wc-predictor-name');
    if (savedName) setName(savedName);

    getUpcomingMatches(20).then(m => {
      setUpcoming(m);
      setLoading(false);
    });
    loadPredictions();
  }, []);

  const submitPrediction = async (match: Match, homeScore: number, awayScore: number) => {
    if (!name.trim()) {
      alert(lang === 'ar' ? 'الرجاء إدخال اسمك أولاً' : 'Please enter your name first');
      return;
    }
    localStorage.setItem('wc-predictor-name', name.trim());
    setSubmitting(match.id);

    const sb = getSupabase();
    if (!sb) {
      // Fallback: save to localStorage
      const localKey = 'wc-predictions';
      const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
      existing.push({
        id: `${match.id}-${name}-${Date.now()}`,
        match_id: match.id,
        predictor_name: name.trim(),
        predicted_home_score: homeScore,
        predicted_away_score: awayScore,
        actual_home_score: null,
        actual_away_score: null,
        is_correct: null,
        is_exact: null,
        points: 0,
      });
      localStorage.setItem(localKey, JSON.stringify(existing));
      setSubmitting(null);
      loadPredictions();
      return;
    }

    try {
      await sb.from('predictions').upsert({
        match_id: match.id,
        predictor_name: name.trim(),
        predicted_home_score: homeScore,
        predicted_away_score: awayScore,
      }, { onConflict: 'match_id,predictor_name' });
      setSubmitting(null);
      loadPredictions();
    } catch (e) {
      setSubmitting(null);
      alert(lang === 'ar' ? 'خطأ في حفظ التوقع' : 'Error saving prediction');
    }
  };

  if (loading) {
    return <div className="glass-card rounded-xl p-8 h-64 animate-pulse" />;
  }

  // Group all predictions by predictor name
  const predictorsMap = new Map<string, Prediction[]>();
  allPredictions.forEach(p => {
    if (!predictorsMap.has(p.predictor_name)) {
      predictorsMap.set(p.predictor_name, []);
    }
    predictorsMap.get(p.predictor_name)!.push(p);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle
        icon={<Target className="h-5 w-5 md:h-6 md:w-6 text-[#D4AF37]" />}
        title={lang === 'ar' ? 'توقعات المباريات' : 'Match Predictions'}
        subtitle={lang === 'ar' ? 'توقع نتائج المباريات القادمة' : 'Predict upcoming match results'}
      />

      {/* Name input */}
      <div className="glass-card rounded-xl p-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
          {lang === 'ar' ? 'اسمك' : 'Your Name'}
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={lang === 'ar' ? 'أدخل اسمك...' : 'Enter your name...'}
          className="w-full px-4 py-2.5 rounded-lg bg-background/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
        />
      </div>

      {/* View tabs */}
      <div className="flex gap-2 border-b border-border/60">
        <button
          onClick={() => setView('predict')}
          className={cn(
            'px-4 py-2.5 text-sm font-bold flex items-center gap-1.5 border-b-2 -mb-px transition-colors',
            view === 'predict' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-muted-foreground'
          )}
        >
          <Target className="h-4 w-4" />
          {lang === 'ar' ? 'توقع المباريات' : 'Predict Matches'}
        </button>
        <button
          onClick={() => setView('results')}
          className={cn(
            'px-4 py-2.5 text-sm font-bold flex items-center gap-1.5 border-b-2 -mb-px transition-colors',
            view === 'results' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-muted-foreground'
          )}
        >
          <TrendingUp className="h-4 w-4" />
          {lang === 'ar' ? 'كل التوقعات' : 'All Predictions'}
        </button>
      </div>

      {view === 'predict' ? (
        <div className="space-y-4">
          {upcoming.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
              {lang === 'ar' ? 'لا توجد مباريات قادمة للتوقع' : 'No upcoming matches to predict'}
            </div>
          ) : (
            upcoming.map(m => (
              <PredictionCard
                key={m.id}
                match={m}
                lang={lang}
                myPrediction={predictions.find(p => p.match_id === m.id)}
                onSubmit={(h, a) => submitPrediction(m, h, a)}
                submitting={submitting === m.id}
              />
            ))
          )}
        </div>
      ) : (
        <AllPredictionsView predictorsMap={predictorsMap} lang={lang} />
      )}
    </div>
  );
}

function PredictionCard({
  match, lang, myPrediction, onSubmit, submitting,
}: {
  match: Match;
  lang: 'ar' | 'en';
  myPrediction?: Prediction;
  onSubmit: (home: number, away: number) => void;
  submitting: boolean;
}) {
  const [home, setHome] = useState(myPrediction?.predicted_home_score ?? 0);
  const [away, setAway] = useState(myPrediction?.predicted_away_score ?? 0);
  const homeTeam = TEAM_BY_ID[match.home_team_id];
  const awayTeam = TEAM_BY_ID[match.away_team_id];

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
        {formatDateTime(match.date, lang)}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-4">
        {/* Home */}
        <div className="flex flex-col items-center gap-2">
          {homeTeam && <img src={homeTeam.flag} alt="" className="h-10 w-16 rounded object-cover" />}
          <span className="text-xs font-bold text-center truncate max-w-[100px]">
            {lang === 'ar' ? homeTeam?.name_ar : homeTeam?.name}
          </span>
        </div>
        {/* Score inputs */}
        <div className="flex items-center gap-2" dir="ltr">
          <input
            type="number"
            min="0"
            max="20"
            value={home}
            onChange={e => setHome(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-14 h-14 text-center text-2xl font-black rounded-lg bg-background/60 border-2 border-border focus:border-[#D4AF37] focus:outline-none tabular-nums"
          />
          <span className="text-muted-foreground/50 text-2xl">-</span>
          <input
            type="number"
            min="0"
            max="20"
            value={away}
            onChange={e => setAway(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-14 h-14 text-center text-2xl font-black rounded-lg bg-background/60 border-2 border-border focus:border-[#D4AF37] focus:outline-none tabular-nums"
          />
        </div>
        {/* Away */}
        <div className="flex flex-col items-center gap-2">
          {awayTeam && <img src={awayTeam.flag} alt="" className="h-10 w-16 rounded object-cover" />}
          <span className="text-xs font-bold text-center truncate max-w-[100px]">
            {lang === 'ar' ? awayTeam?.name_ar : awayTeam?.name}
          </span>
        </div>
      </div>
      <button
        onClick={() => onSubmit(home, away)}
        disabled={submitting}
        className={cn(
          'w-full py-2.5 rounded-lg font-bold text-sm transition-all',
          myPrediction
            ? 'bg-[#006847]/20 text-[#006847] border border-[#006847]/40'
            : 'bg-[#D4AF37] text-[#050505] hover:scale-[1.02]'
        )}
      >
        {submitting ? '...' :
          myPrediction
            ? (lang === 'ar' ? `✓ توقعت: ${myPrediction.predicted_home_score}-${myPrediction.predicted_away_score} (تحديث)` : `✓ Predicted: ${myPrediction.predicted_home_score}-${myPrediction.predicted_away_score} (Update)`)
            : (lang === 'ar' ? 'إرسال التوقع' : 'Submit Prediction')
        }
      </button>
    </div>
  );
}

function AllPredictionsView({
  predictorsMap, lang,
}: {
  predictorsMap: Map<string, Prediction[]>;
  lang: 'ar' | 'en';
}) {
  if (predictorsMap.size === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
        {lang === 'ar' ? 'لا توجد توقعات بعد. كن أول من يتوقع!' : 'No predictions yet. Be the first to predict!'}
      </div>
    );
  }

  const predictors = Array.from(predictorsMap.entries()).map(([name, preds]) => {
    const totalPoints = preds.reduce((sum, p) => sum + (p.points || 0), 0);
    const correctCount = preds.filter(p => p.is_correct).length;
    const exactCount = preds.filter(p => p.is_exact).length;
    const evaluatedCount = preds.filter(p => p.is_correct !== null).length;
    return { name, preds, totalPoints, correctCount, exactCount, evaluatedCount };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="space-y-4">
      {predictors.map((p, idx) => (
        <div key={p.name} className="glass-card rounded-xl p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-xs font-black',
                idx === 0 ? 'bg-[#D4AF37] text-[#050505]' :
                idx === 1 ? 'bg-[#C0C0C0] text-[#050505]' :
                idx === 2 ? 'bg-[#CD7F32] text-white' :
                'bg-muted text-muted-foreground'
              )}>
                {idx + 1}
              </div>
              <div>
                <div className="font-bold text-sm">{p.name}</div>
                <div className="text-[10px] text-muted-foreground">
                  {p.preds.length} {lang === 'ar' ? 'توقع' : 'predictions'}
                </div>
              </div>
            </div>
            <div className="flex gap-3 text-center">
              <div>
                <div className="text-xl font-black text-[#D4AF37]">{p.totalPoints}</div>
                <div className="text-[9px] text-muted-foreground">{lang === 'ar' ? 'نقطة' : 'pts'}</div>
              </div>
              <div>
                <div className="text-xl font-black text-[#006847]">{p.correctCount}</div>
                <div className="text-[9px] text-muted-foreground">{lang === 'ar' ? 'صحيح' : 'correct'}</div>
              </div>
              <div>
                <div className="text-xl font-black text-[#BF0A30]">{p.exactCount}</div>
                <div className="text-[9px] text-muted-foreground">{lang === 'ar' ? 'مطابق' : 'exact'}</div>
              </div>
            </div>
          </div>
          {/* Predictions list */}
          <div className="space-y-1.5">
            {p.preds.slice(0, 10).map(pred => {
              const match = MATCH_BY_ID[pred.match_id];
              const homeTeam = match ? TEAM_BY_ID[match.home_team_id] : null;
              const awayTeam = match ? TEAM_BY_ID[match.away_team_id] : null;
              const isPending = pred.is_correct === null;
              return (
                <div key={pred.id} className="flex items-center gap-2 text-xs py-1.5 px-2 rounded hover:bg-muted/30">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    {homeTeam && <img src={homeTeam.flag} alt="" className="h-3 w-5 rounded-sm object-cover shrink-0" />}
                    <span className="truncate max-w-[60px]">{lang === 'ar' ? homeTeam?.name_ar : homeTeam?.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0" dir="ltr">
                    <span className={cn(
                      'font-bold tabular-nums',
                      isPending ? 'text-muted-foreground' :
                      pred.is_correct ? 'text-[#006847]' : 'text-[#BF0A30]'
                    )}>
                      {pred.predicted_home_score}-{pred.predicted_away_score}
                    </span>
                    {!isPending && pred.actual_home_score !== null && (
                      <span className="text-muted-foreground text-[10px]" dir="ltr">
                        ({pred.actual_home_score}-{pred.actual_away_score})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-1 justify-end min-w-0">
                    <span className="truncate max-w-[60px] text-end">{lang === 'ar' ? awayTeam?.name_ar : awayTeam?.name}</span>
                    {awayTeam && <img src={awayTeam.flag} alt="" className="h-3 w-5 rounded-sm object-cover shrink-0" />}
                  </div>
                  <div className="shrink-0">
                    {isPending ? (
                      <Clock className="h-3 w-3 text-muted-foreground/50" />
                    ) : pred.is_exact ? (
                      <span className="text-[10px] font-bold text-[#D4AF37]">3pts</span>
                    ) : pred.is_correct ? (
                      <Check className="h-3 w-3 text-[#006847]" />
                    ) : (
                      <X className="h-3 w-3 text-[#BF0A30]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
