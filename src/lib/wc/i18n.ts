'use client';

// ============================================================
// i18n strings — Arabic (primary) + English
// ============================================================

export type Lang = 'ar' | 'en';

export const STRINGS = {
  // App / Brand
  appTitle: { ar: 'كأس العالم 2026', en: 'World Cup 2026' },
  appSubtitle: { ar: 'كندا · المكسيك · الولايات المتحدة', en: 'Canada · Mexico · USA' },
  live: { ar: 'مباشر', en: 'LIVE' },
  finished: { ar: 'انتهت', en: 'FT' },
  notStarted: { ar: 'لم تبدأ', en: 'NS' },
  kickoff: { ar: 'انطلاق', en: 'Kick-off' },
  vs: { ar: 'ضد', en: 'vs' },
  minute: { ar: 'د', en: "'" },

  // Nav
  home: { ar: 'الرئيسية', en: 'Home' },
  matches: { ar: 'المباريات', en: 'Matches' },
  groups: { ar: 'المجموعات', en: 'Groups' },
  knockout: { ar: 'دور الإقصاء', en: 'Knockout' },
  teams: { ar: 'المنتخبات', en: 'Teams' },
  players: { ar: 'اللاعبون', en: 'Players' },
  topScorers: { ar: 'الهدافون', en: 'Top Scorers' },
  topAssists: { ar: 'صناع الأهداف', en: 'Top Assists' },
  favorites: { ar: 'المفضلة', en: 'Favorites' },

  // Home sections
  liveMatches: { ar: 'المباريات المباشرة', en: 'Live Matches' },
  latestResults: { ar: 'أحدث النتائج', en: 'Latest Results' },
  upcomingMatches: { ar: 'المباريات القادمة', en: 'Upcoming Matches' },
  groupOverview: { ar: 'نظرة على المجموعات', en: 'Group Overview' },
  topScorersTitle: { ar: 'الهدافون', en: 'Top Scorers' },
  viewAll: { ar: 'عرض الكل', en: 'View All' },
  noLiveMatches: { ar: 'لا توجد مباريات مباشرة حاليًا', en: 'No live matches at the moment' },

  // Matches page
  filterByGroup: { ar: 'فلترة حسب المجموعة', en: 'Filter by Group' },
  filterByStage: { ar: 'فلترة حسب المرحلة', en: 'Filter by Stage' },
  filterByDate: { ar: 'فلترة حسب التاريخ', en: 'Filter by Date' },
  allGroups: { ar: 'كل المجموعات', en: 'All Groups' },
  allStages: { ar: 'كل المراحل', en: 'All Stages' },
  allDates: { ar: 'كل التواريخ', en: 'All Dates' },
  groupStage: { ar: 'دور المجموعات', en: 'Group Stage' },
  round16: { ar: 'دور الـ16', en: 'Round of 16' },
  quarterFinals: { ar: 'ربع النهائي', en: 'Quarter Finals' },
  semiFinals: { ar: 'نصف النهائي', en: 'Semi Finals' },
  final: { ar: 'النهائي', en: 'Final' },
  thirdPlace: { ar: 'المركز الثالث', en: 'Third Place' },

  // Match details
  matchDetails: { ar: 'تفاصيل المباراة', en: 'Match Details' },
  statistics: { ar: 'الإحصائيات', en: 'Statistics' },
  lineups: { ar: 'التشكيلات', en: 'Lineups' },
  events: { ar: 'الأحداث', en: 'Events' },
  manOfTheMatch: { ar: 'أفضل لاعب', en: 'Man of the Match' },
  stadium: { ar: 'الملعب', en: 'Stadium' },
  referee: { ar: 'الحكم', en: 'Referee' },
  city: { ar: 'المدينة', en: 'City' },
  formation: { ar: 'التشكيل', en: 'Formation' },
  starters: { ar: 'الأساسيون', en: 'Starters' },
  substitutes: { ar: 'الاحتياط', en: 'Substitutes' },
  coach: { ar: 'المدرب', en: 'Coach' },
  goal: { ar: 'هدف', en: 'Goal' },
  penalty: { ar: 'ركلة جزاء', en: 'Penalty' },
  ownGoal: { ar: 'هدف عكسي', en: 'Own Goal' },
  yellowCard: { ar: 'بطاقة صفراء', en: 'Yellow Card' },
  redCard: { ar: 'بطاقة حمراء', en: 'Red Card' },
  substitution: { ar: 'تبديل', en: 'Substitution' },
  possession: { ar: 'الاستحواذ', en: 'Possession' },
  shots: { ar: 'التسديدات', en: 'Shots' },
  shotsOnTarget: { ar: 'تسديدات على المرمى', en: 'Shots on Target' },
  corners: { ar: 'الركنيات', en: 'Corners' },
  fouls: { ar: 'الأخطاء', en: 'Fouls' },
  passes: { ar: 'التمريرات', en: 'Passes' },
  passAccuracy: { ar: 'دقة التمرير', en: 'Pass Accuracy' },
  viewMatchDetails: { ar: 'عرض تفاصيل المباراة', en: 'View Match Details' },

  // Groups page
  group: { ar: 'المجموعة', en: 'Group' },
  team: { ar: 'الفريق', en: 'Team' },
  played: { ar: 'لعب', en: 'P' },
  won: { ar: 'فاز', en: 'W' },
  drawn: { ar: 'تعادل', en: 'D' },
  lost: { ar: 'خسر', en: 'L' },
  goalsFor: { ar: 'له', en: 'GF' },
  goalsAgainst: { ar: 'عليه', en: 'GA' },
  goalDiff: { ar: '+/-', en: 'GD' },
  points: { ar: 'نقاط', en: 'Pts' },
  qualified: { ar: 'متأهل', en: 'Qualified' },

  // Knockout page
  knockoutStage: { ar: 'مرحلة الإقصاء', en: 'Knockout Stage' },
  roundOf16: { ar: 'دور الـ16', en: 'Round of 16' },
  champion: { ar: 'البطل', en: 'Champion' },
  finalMatch: { ar: 'النهائي', en: 'Final' },
  thirdPlaceMatch: { ar: 'مباراة المركز الثالث', en: 'Third Place Match' },
  pathHighlightHint: { ar: 'اضغط على فريق لتسليط مساره', en: 'Click a team to highlight its path' },
  clearHighlight: { ar: 'إلغاء التحديد', en: 'Clear' },
  waitingForTeams: { ar: 'بانتظار تأهل الفرق', en: 'Awaiting teams' },
  winner: { ar: 'الفائز', en: 'Winner' },

  // Teams / Players pages
  allTeams: { ar: 'كل المنتخبات', en: 'All Teams' },
  allPlayers: { ar: 'كل اللاعبون', en: 'All Players' },
  searchTeams: { ar: 'ابحث عن منتخب...', en: 'Search teams...' },
  searchPlayers: { ar: 'ابحث عن لاعب...', en: 'Search players...' },
  position: { ar: 'المركز', en: 'Position' },
  goalkeeper: { ar: 'حارس مرمى', en: 'Goalkeeper' },
  defender: { ar: 'مدافع', en: 'Defender' },
  midfielder: { ar: 'وسط', en: 'Midfielder' },
  forward: { ar: 'مهاجم', en: 'Forward' },
  allPositions: { ar: 'كل المراكز', en: 'All Positions' },
  fifaRanking: { ar: 'تصنيف فيفا', en: 'FIFA Ranking' },
  squad: { ar: 'قائمة اللاعبين', en: 'Squad' },
  recentMatches: { ar: 'آخر المباريات', en: 'Recent Matches' },

  // Top scorers / assists
  rank: { ar: '#', en: '#' },
  player: { ar: 'اللاعب', en: 'Player' },
  goals: { ar: 'أهداف', en: 'Goals' },
  assists: { ar: 'صناعة', en: 'Assists' },
  penalties: { ar: 'ركلات جزاء', en: 'Penalties' },
  matchesPlayed: { ar: 'مباريات', en: 'MP' },

  // Favorites
  favoritesEmpty: { ar: 'لا توجد مفضلات بعد. تصفح وأضف فرقك ولاعبيك المفضلين!', en: 'No favorites yet. Browse and add your favorite teams, players and matches!' },
  favoriteTeams: { ar: 'الفرق المفضلة', en: 'Favorite Teams' },
  favoritePlayers: { ar: 'اللاعبون المفضلون', en: 'Favorite Players' },
  favoriteMatches: { ar: 'المباريات المفضلة', en: 'Favorite Matches' },
  addToFavorites: { ar: 'أضف إلى المفضلة', en: 'Add to Favorites' },
  removeFromFavorites: { ar: 'إزالة من المفضلة', en: 'Remove from Favorites' },
  clearAll: { ar: 'مسح الكل', en: 'Clear All' },

  // Common
  back: { ar: 'رجوع', en: 'Back' },
  loading: { ar: 'جاري التحميل...', en: 'Loading...' },
  noData: { ar: 'لا توجد بيانات', en: 'No data available' },
  darkMode: { ar: 'الوضع الليلي', en: 'Dark Mode' },
  lightMode: { ar: 'الوضع النهاري', en: 'Light Mode' },
  language: { ar: 'اللغة', en: 'Language' },
  poweredBy: { ar: 'مدعوم بـ Supabase + API-Football', en: 'Powered by Supabase + API-Football' },
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(key: StringKey, lang: Lang): string {
  return STRINGS[key][lang];
}
