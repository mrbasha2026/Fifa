import type {
  Team,
  Player,
  Match,
  StandingsRow,
  MatchEvent,
  MatchStatistics,
  MatchLineup,
  TopScorerRow,
  TopAssistRow,
} from './types';

// ============================================================
// World Cup 2026 — REALISTIC DATA
// Hosts: USA · Canada · Mexico  (June 11 – July 19, 2026)
// Format: 48 teams in 12 groups (A-L) of 4
// Knockout: starts from ROUND OF 32 (16 matches) → R16 → QF → SF → Final + 3rd
// ============================================================

// Use real flag images from flagcdn.com (svg, sharp, correct)
function flag(code: string): string {
  // code = lowercase ISO 3166-1 alpha-2 (e.g., 'ar' for Argentina, 'sa' for Saudi Arabia)
  return `https://flagcdn.com/${code.toLowerCase()}.svg`;
}

// ============================================================
// 48 TEAMS — 12 groups A..L (realistic FIFA ranking ~ Oct 2025)
// ============================================================
export const TEAMS: Team[] = [
  // ===== GROUP A ===== (Hosts + 1 from each pot)
  { id: 'mex', name: 'Mexico', name_ar: 'المكسيك', logo: flag('mx'), flag: flag('mx'), group: 'A', fifa_code: 'MEX', fifa_ranking: 17, coach: 'خافيير أغيري' },
  { id: 'can', name: 'Canada', name_ar: 'كندا', logo: flag('ca'), flag: flag('ca'), group: 'A', fifa_code: 'CAN', fifa_ranking: 31, coach: 'جيسي مارش' },
  { id: 'usa', name: 'United States', name_ar: 'الولايات المتحدة', logo: flag('us'), flag: flag('us'), group: 'A', fifa_code: 'USA', fifa_ranking: 16, coach: 'ماوريسيو بوكيتينو' },
  { id: 'crc', name: 'Costa Rica', name_ar: 'كوستاريكا', logo: flag('cr'), flag: flag('cr'), group: 'A', fifa_code: 'CRC', fifa_ranking: 54, coach: 'غوستافو ألفارو' },

  // ===== GROUP B =====
  { id: 'ger', name: 'Germany', name_ar: 'ألمانيا', logo: flag('de'), flag: flag('de'), group: 'B', fifa_code: 'GER', fifa_ranking: 9, coach: 'يوليان ناغلسمان' },
  { id: 'ned', name: 'Netherlands', name_ar: 'هولندا', logo: flag('nl'), flag: flag('nl'), group: 'B', fifa_code: 'NED', fifa_ranking: 6, coach: 'رونالد كومان' },
  { id: 'jpn', name: 'Japan', name_ar: 'اليابان', logo: flag('jp'), flag: flag('jp'), group: 'B', fifa_code: 'JPN', fifa_ranking: 18, coach: 'هاجيمي مورياسو' },
  { id: 'aus', name: 'Australia', name_ar: 'أستراليا', logo: flag('au'), flag: flag('au'), group: 'B', fifa_code: 'AUS', fifa_ranking: 26, coach: 'توني بوبوفيتش' },

  // ===== GROUP C =====
  { id: 'arg', name: 'Argentina', name_ar: 'الأرجنتين', logo: flag('ar'), flag: flag('ar'), group: 'C', fifa_code: 'ARG', fifa_ranking: 1, coach: 'ليونيل سكالوني' },
  { id: 'sui', name: 'Switzerland', name_ar: 'سويسرا', logo: flag('ch'), flag: flag('ch'), group: 'C', fifa_code: 'SUI', fifa_ranking: 19, coach: 'مورات ياكين' },
  { id: 'sen', name: 'Senegal', name_ar: 'السنغال', logo: flag('sn'), flag: flag('sn'), group: 'C', fifa_code: 'SEN', fifa_ranking: 19, coach: 'باب تياو' },
  { id: 'irq', name: 'Iraq', name_ar: 'العراق', logo: flag('iq'), flag: flag('iq'), group: 'C', fifa_code: 'IRQ', fifa_ranking: 58, coach: 'غراهام أرنولد' },

  // ===== GROUP D =====
  { id: 'fra', name: 'France', name_ar: 'فرنسا', logo: flag('fr'), flag: flag('fr'), group: 'D', fifa_code: 'FRA', fifa_ranking: 2, coach: 'ديدييه ديشان' },
  { id: 'bel', name: 'Belgium', name_ar: 'بلجيكا', logo: flag('be'), flag: flag('be'), group: 'D', fifa_code: 'BEL', fifa_ranking: 8, coach: 'دومينيكو تيديسكو' },
  { id: 'kor', name: 'South Korea', name_ar: 'كوريا الجنوبية', logo: flag('kr'), flag: flag('kr'), group: 'D', fifa_code: 'KOR', fifa_ranking: 23, coach: 'هونغ ميونغ-بو' },
  { id: 'mar', name: 'Morocco', name_ar: 'المغرب', logo: flag('ma'), flag: flag('ma'), group: 'D', fifa_code: 'MAR', fifa_ranking: 14, coach: 'وليد الركراكي' },

  // ===== GROUP E =====
  { id: 'bra', name: 'Brazil', name_ar: 'البرازيل', logo: flag('br'), flag: flag('br'), group: 'E', fifa_code: 'BRA', fifa_ranking: 5, coach: 'دوريال جونيور' },
  { id: 'col', name: 'Colombia', name_ar: 'كولومبيا', logo: flag('co'), flag: flag('co'), group: 'E', fifa_code: 'COL', fifa_ranking: 12, coach: 'نيستور لورنزو' },
  { id: 'ngr', name: 'Nigeria', name_ar: 'نيجيريا', logo: flag('ng'), flag: flag('ng'), group: 'E', fifa_code: 'NGA', fifa_ranking: 36, coach: 'إيريك تشيل' },
  { id: 'tun', name: 'Tunisia', name_ar: 'تونس', logo: flag('tn'), flag: flag('tn'), group: 'E', fifa_code: 'TUN', fifa_ranking: 41, coach: 'سامي الطرابلسي' },

  // ===== GROUP F =====
  { id: 'esp', name: 'Spain', name_ar: 'إسبانيا', logo: flag('es'), flag: flag('es'), group: 'F', fifa_code: 'ESP', fifa_ranking: 3, coach: 'لويس دي لا فوينتي' },
  { id: 'cro', name: 'Croatia', name_ar: 'كرواتيا', logo: flag('hr'), flag: flag('hr'), group: 'F', fifa_code: 'CRO', fifa_ranking: 10, coach: 'زلاتكو داليتش' },
  { id: 'ecu', name: 'Ecuador', name_ar: 'الإكوادور', logo: flag('ec'), flag: flag('ec'), group: 'F', fifa_code: 'ECU', fifa_ranking: 24, coach: 'سيباستيان بيكاتشي' },
  { id: 'civ', name: 'Ivory Coast', name_ar: 'ساحل العاج', logo: flag('ci'), flag: flag('ci'), group: 'F', fifa_code: 'CIV', fifa_ranking: 42, coach: 'إيميرس فاييه' },

  // ===== GROUP G =====
  { id: 'eng', name: 'England', name_ar: 'إنجلترا', logo: flag('gb-eng'), flag: flag('gb-eng'), group: 'G', fifa_code: 'ENG', fifa_ranking: 4, coach: 'توماس توخل' },
  { id: 'por', name: 'Portugal', name_ar: 'البرتغال', logo: flag('pt'), flag: flag('pt'), group: 'G', fifa_code: 'POR', fifa_ranking: 7, coach: 'روبرتو مارتينيز' },
  { id: 'par', name: 'Paraguay', name_ar: 'باراغواي', logo: flag('py'), flag: flag('py'), group: 'G', fifa_code: 'PAR', fifa_ranking: 39, coach: 'غوستافو ألفارو' },
  { id: 'irn', name: 'Iran', name_ar: 'إيران', logo: flag('ir'), flag: flag('ir'), group: 'G', fifa_code: 'IRN', fifa_ranking: 20, coach: 'أمير قلعة نویی' },

  // ===== GROUP H =====
  { id: 'ita', name: 'Italy', name_ar: 'إيطاليا', logo: flag('it'), flag: flag('it'), group: 'H', fifa_code: 'ITA', fifa_ranking: 11, coach: 'لوتشيانو سباليتي' },
  { id: 'uru', name: 'Uruguay', name_ar: 'الأوروغواي', logo: flag('uy'), flag: flag('uy'), group: 'H', fifa_code: 'URU', fifa_ranking: 15, coach: 'مارسيلو بيلسا' },
  { id: 'gha', name: 'Ghana', name_ar: 'غانا', logo: flag('gh'), flag: flag('gh'), group: 'H', fifa_code: 'GHA', fifa_ranking: 73, coach: 'أوتو أدو' },
  { id: 'rsa', name: 'South Africa', name_ar: 'جنوب أفريقيا', logo: flag('za'), flag: flag('za'), group: 'H', fifa_code: 'RSA', fifa_ranking: 56, coach: 'هوغو بروس' },

  // ===== GROUP I =====
  { id: 'sau', name: 'Saudi Arabia', name_ar: 'السعودية', logo: flag('sa'), flag: flag('sa'), group: 'I', fifa_code: 'KSA', fifa_ranking: 56, coach: 'هيرفي رينار' },
  { id: 'ukr', name: 'Ukraine', name_ar: 'أوكرانيا', logo: flag('ua'), flag: flag('ua'), group: 'I', fifa_code: 'UKR', fifa_ranking: 25, coach: 'سيرغي ريبروف' },
  { id: 'per', name: 'Peru', name_ar: 'بيرو', logo: flag('pe'), flag: flag('pe'), group: 'I', fifa_code: 'PER', fifa_ranking: 38, coach: 'أوسكار إيبانيز' },
  { id: 'uzb', name: 'Uzbekistan', name_ar: 'أوزبكستان', logo: flag('uz'), flag: flag('uz'), group: 'I', fifa_code: 'UZB', fifa_ranking: 57, coach: 'تيمور كابادزي' },

  // ===== GROUP J =====
  { id: 'nor', name: 'Norway', name_ar: 'النرويج', logo: flag('no'), flag: flag('no'), group: 'J', fifa_code: 'NOR', fifa_ranking: 32, coach: 'ستوله سولباكن' },
  { id: 'aut', name: 'Austria', name_ar: 'النمسا', logo: flag('at'), flag: flag('at'), group: 'J', fifa_code: 'AUT', fifa_ranking: 22, coach: 'رالف رانغنيك' },
  { id: 'swe', name: 'Sweden', name_ar: 'السويد', logo: flag('se'), flag: flag('se'), group: 'J', fifa_code: 'SWE', fifa_ranking: 27, coach: 'يون دال توماسون' },
  { id: 'blr', name: 'Bolivia', name_ar: 'بوليفيا', logo: flag('bo'), flag: flag('bo'), group: 'J', fifa_code: 'BOL', fifa_ranking: 81, coach: 'أنطونيو كارلوس زاغو' },

  // ===== GROUP K =====
  { id: 'den', name: 'Denmark', name_ar: 'الدنمارك', logo: flag('dk'), flag: flag('dk'), group: 'K', fifa_code: 'DEN', fifa_ranking: 21, coach: 'برايان رييمر' },
  { id: 'tur', name: 'Türkiye', name_ar: 'تركيا', logo: flag('tr'), flag: flag('tr'), group: 'K', fifa_code: 'TUR', fifa_ranking: 28, coach: 'فينتشينزو مونتيلا' },
  { id: 'mli', name: 'Mali', name_ar: 'مالي', logo: flag('ml'), flag: flag('ml'), group: 'K', fifa_code: 'MLI', fifa_ranking: 51, coach: 'توم ساينتفيت' },
  { id: 'hon', name: 'Honduras', name_ar: 'هندوراس', logo: flag('hn'), flag: flag('hn'), group: 'K', fifa_code: 'HON', fifa_ranking: 76, coach: 'رينالدو رويدا' },

  // ===== GROUP L =====
  { id: 'pol', name: 'Poland', name_ar: 'بولندا', logo: flag('pl'), flag: flag('pl'), group: 'L', fifa_code: 'POL', fifa_ranking: 30, coach: 'ميتشال بروبيرز' },
  { id: 'wal', name: 'Wales', name_ar: 'ويلز', logo: flag('gb-wls'), flag: flag('gb-wls'), group: 'L', fifa_code: 'WAL', fifa_ranking: 29, coach: 'كريغ بيلامي' },
  { id: 'cmr', name: 'Cameroon', name_ar: 'الكاميرون', logo: flag('cm'), flag: flag('cm'), group: 'L', fifa_code: 'CMR', fifa_ranking: 50, coach: 'مارك برايس' },
  { id: 'pan', name: 'Panama', name_ar: 'بنما', logo: flag('pa'), flag: flag('pa'), group: 'L', fifa_code: 'PAN', fifa_ranking: 35, coach: 'توماس كريستيانسن' },
];

// ============================================================
// 16 STADIUMS — distributed across USA (11), Mexico (3), Canada (2)
// ============================================================
export interface Stadium {
  id: string;
  name: string;
  name_ar: string;
  city: string;
  city_ar: string;
  country: 'USA' | 'MEX' | 'CAN';
  capacity: number;
}

export const STADIUMS: Stadium[] = [
  // USA (11)
  { id: 'metlife', name: 'MetLife Stadium', name_ar: 'ملعب متلايف', city: 'New York/New Jersey', city_ar: 'نيويورك', country: 'USA', capacity: 82500 },
  { id: 'att', name: 'AT&T Stadium', name_ar: 'ملعب AT&T', city: 'Dallas', city_ar: 'دالاس', country: 'USA', capacity: 80000 },
  { id: 'sofi', name: 'SoFi Stadium', name_ar: 'ملعب سوفي', city: 'Los Angeles', city_ar: 'لوس أنجلوس', country: 'USA', capacity: 70240 },
  { id: 'hardrock', name: 'Hard Rock Stadium', name_ar: 'ملعب هارد روك', city: 'Miami', city_ar: 'ميامي', country: 'USA', capacity: 65000 },
  { id: 'mercedes', name: 'Mercedes-Benz Stadium', name_ar: 'ملعب مرسيدس بنز', city: 'Atlanta', city_ar: 'أتلانتا', country: 'USA', capacity: 71000 },
  { id: 'levis', name: 'Levi\'s Stadium', name_ar: 'ملعب ليفاي', city: 'San Francisco Bay Area', city_ar: 'سان فرانسيسكو', country: 'USA', capacity: 68500 },
  { id: 'arrowhead', name: 'Arrowhead Stadium', name_ar: 'ملعب أروهيد', city: 'Kansas City', city_ar: 'كانساس سيتي', country: 'USA', capacity: 76000 },
  { id: 'lincoln', name: 'Lincoln Financial Field', name_ar: 'ملعب لينكولن فاينانشيال', city: 'Philadelphia', city_ar: 'فيلادلفيا', country: 'USA', capacity: 67500 },
  { id: 'nrg', name: 'NRG Stadium', name_ar: 'ملعب إن آر جي', city: 'Houston', city_ar: 'هيوستن', country: 'USA', capacity: 72000 },
  { id: 'gillette', name: 'Gillette Stadium', name_ar: 'ملعب جيليت', city: 'Boston', city_ar: 'بوسطن', country: 'USA', capacity: 65000 },
  { id: 'lumen', name: 'Lumen Field', name_ar: 'ملعب لومين فيلد', city: 'Seattle', city_ar: 'سياتل', country: 'USA', capacity: 69000 },
  // Mexico (3)
  { id: 'azteca', name: 'Estadio Azteca', name_ar: 'استاد أزتيكا', city: 'Mexico City', city_ar: 'مكسيكو سيتي', country: 'MEX', capacity: 83000 },
  { id: 'akron', name: 'Estadio Akron', name_ar: 'استاد أكرون', city: 'Guadalajara', city_ar: 'غوادالاخارا', country: 'MEX', capacity: 48000 },
  { id: 'bbva', name: 'Estadio BBVA', name_ar: 'استاد بي بي في إيه', city: 'Monterrey', city_ar: 'مونتيري', country: 'MEX', capacity: 53500 },
  // Canada (2)
  { id: 'bmo', name: 'BMO Field', name_ar: 'ملعب بي إم أو', city: 'Toronto', city_ar: 'تورنتو', country: 'CAN', capacity: 45000 },
  { id: 'bc', name: 'BC Place', name_ar: 'ملعب بي سي بليس', city: 'Vancouver', city_ar: 'فانكوفر', country: 'CAN', capacity: 54500 },
];

export const STADIUM_BY_ID: Record<string, Stadium> = STADIUMS.reduce((acc, s) => { acc[s.id] = s; return acc; }, {} as Record<string, Stadium>);

// ============================================================
// PLAYERS — Real names with correct Arabic transliteration
// ============================================================
export const PLAYERS: Player[] = [
  // ===== Argentina =====
  { id: 'p-messi', name: 'Lionel Messi', name_ar: 'ليونيل ميسي', team_id: 'arg', position: 'FW', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '⭐', number: 10, age: 38, club: 'إنتر ميامي' },
  { id: 'p-julian', name: 'Julián Álvarez', name_ar: 'خوليان ألفاريز', team_id: 'arg', position: 'FW', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '⚡', number: 9, age: 25, club: 'أتلتيكو مدريد' },
  { id: 'p-lautaro', name: 'Lautaro Martínez', name_ar: 'لاوتارو مارتينيز', team_id: 'arg', position: 'FW', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '⚽', number: 22, age: 27, club: 'إنتر ميلان' },
  { id: 'p-emimart', name: 'Emiliano Martínez', name_ar: 'إيميليانو مارتينيز', team_id: 'arg', position: 'GK', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '🧤', number: 23, age: 32, club: 'أستون فيلا' },
  { id: 'p-depaul', name: 'Rodrigo De Paul', name_ar: 'رودريغو دي بول', team_id: 'arg', position: 'MF', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '🎯', number: 7, age: 31, club: 'أتلتيكو مدريد' },
  { id: 'p-enzo', name: 'Enzo Fernández', name_ar: 'إنزو فرنانديز', team_id: 'arg', position: 'MF', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '⚙️', number: 24, age: 24, club: 'تشيلسي' },
  { id: 'p-otamendi', name: 'Nicolás Otamendi', name_ar: 'نيكولاس أوتاميندي', team_id: 'arg', position: 'DF', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '🛡️', number: 19, age: 37, club: 'بنفيكا' },
  { id: 'p-molina', name: 'Nahuel Molina', name_ar: 'ناهويل مولينا', team_id: 'arg', position: 'DF', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '🛡️', number: 26, age: 26, club: 'أتلتيكو مدريد' },
  { id: 'p-romero', name: 'Cristian Romero', name_ar: 'كريستيان روميرو', team_id: 'arg', position: 'DF', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '🛡️', number: 13, age: 26, club: 'توتنهام' },
  { id: 'p-tagliafico', name: 'Nicolás Tagliafico', name_ar: 'نيكولاس تاغليافيكو', team_id: 'arg', position: 'DF', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '🛡️', number: 3, age: 32, club: 'ليون' },
  { id: 'p-macallister', name: 'Alexis Mac Allister', name_ar: 'أليكسيس ماك أليستر', team_id: 'arg', position: 'MF', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '⚙️', number: 20, age: 26, club: 'ليفربول' },

  // ===== France =====
  { id: 'p-mbappe', name: 'Kylian Mbappé', name_ar: 'كيليان مبابي', team_id: 'fra', position: 'FW', nationality: 'France', nationality_ar: 'فرنسا', photo: '⚡', number: 10, age: 26, club: 'ريال مدريد' },
  { id: 'p-griezmann', name: 'Antoine Griezmann', name_ar: 'أنطوان غريزمان', team_id: 'fra', position: 'FW', nationality: 'France', nationality_ar: 'فرنسا', photo: '🎯', number: 7, age: 34, club: 'أتلتيكو مدريد' },
  { id: 'p-dembele', name: 'Ousmane Dembélé', name_ar: 'عثمان ديمبيلي', team_id: 'fra', position: 'FW', nationality: 'France', nationality_ar: 'فرنسا', photo: '⚡', number: 11, age: 28, club: 'باريس سان جيرمان' },
  { id: 'p-tchouameni', name: 'Aurélien Tchouaméni', name_ar: 'أوريليان تشواميني', team_id: 'fra', position: 'MF', nationality: 'France', nationality_ar: 'فرنسا', photo: '⚙️', number: 8, age: 24, club: 'ريال مدريد' },
  { id: 'p-saliba', name: 'William Saliba', name_ar: 'ويليام ساليبا', team_id: 'fra', position: 'DF', nationality: 'France', nationality_ar: 'فرنسا', photo: '🛡️', number: 17, age: 23, club: 'آرسنال' },
  { id: 'p-maignan', name: 'Mike Maignan', name_ar: 'مايك ماينان', team_id: 'fra', position: 'GK', nationality: 'France', nationality_ar: 'فرنسا', photo: '🧤', number: 16, age: 29, club: 'ميلان' },
  { id: 'p-kounde', name: 'Jules Koundé', name_ar: 'جول كوندي', team_id: 'fra', position: 'DF', nationality: 'France', nationality_ar: 'فرنسا', photo: '🛡️', number: 5, age: 25, club: 'برشلونة' },
  { id: 'p-rabiot', name: 'Adrien Rabiot', name_ar: 'أدريان رابيو', team_id: 'fra', position: 'MF', nationality: 'France', nationality_ar: 'فرنسا', photo: '⚙️', number: 14, age: 30, club: 'مارسيليا' },
  { id: 'p-hernandez', name: 'Theo Hernández', name_ar: 'تيو هرنانديز', team_id: 'fra', position: 'DF', nationality: 'France', nationality_ar: 'فرنسا', photo: '🛡️', number: 22, age: 27, club: 'ميلان' },
  { id: 'p-thuram', name: 'Marcus Thuram', name_ar: 'ماركوس تورام', team_id: 'fra', position: 'FW', nationality: 'France', nationality_ar: 'فرنسا', photo: '⚽', number: 9, age: 27, club: 'إنتر ميلان' },

  // ===== Brazil =====
  { id: 'p-vini', name: 'Vinícius Júnior', name_ar: 'فينيسيوس جونيور', team_id: 'bra', position: 'FW', nationality: 'Brazil', nationality_ar: 'البرازيل', photo: '⚡', number: 7, age: 24, club: 'ريال مدريد' },
  { id: 'p-rodrigo', name: 'Rodrygo', name_ar: 'رودريغو', team_id: 'bra', position: 'FW', nationality: 'Brazil', nationality_ar: 'البرازيل', photo: '🎯', number: 10, age: 24, club: 'ريال مدريد' },
  { id: 'p-casemiro', name: 'Casemiro', name_ar: 'كاسيميرو', team_id: 'bra', position: 'MF', nationality: 'Brazil', nationality_ar: 'البرازيل', photo: '⚙️', number: 5, age: 33, club: 'مانشستر يونايتد' },
  { id: 'p-marqui', name: 'Marquinhos', name_ar: 'ماركينيوس', team_id: 'bra', position: 'DF', nationality: 'Brazil', nationality_ar: 'البرازيل', photo: '🛡️', number: 4, age: 30, club: 'باريس سان جيرمان' },
  { id: 'p-alisson', name: 'Alisson', name_ar: 'أليسون بيكر', team_id: 'bra', position: 'GK', nationality: 'Brazil', nationality_ar: 'البرازيل', photo: '🧤', number: 1, age: 32, club: 'ليفربول' },
  { id: 'p-neymar', name: 'Neymar Jr', name_ar: 'نيمار جونيور', team_id: 'bra', position: 'FW', nationality: 'Brazil', nationality_ar: 'البرازيل', photo: '⭐', number: 11, age: 33, club: 'سانتوس' },
  { id: 'p-paqueta', name: 'Lucas Paquetá', name_ar: 'لوكاس باكيتا', team_id: 'bra', position: 'MF', nationality: 'Brazil', nationality_ar: 'البرازيل', photo: '⚙️', number: 8, age: 27, club: 'وست هام' },
  { id: 'p-gabriel', name: 'Gabriel Magalhães', name_ar: 'غابرييل ماغالهايش', team_id: 'bra', position: 'DF', nationality: 'Brazil', nationality_ar: 'البرازيل', photo: '🛡️', number: 14, age: 27, club: 'آرسنال' },

  // ===== England =====
  { id: 'p-bellingham', name: 'Jude Bellingham', name_ar: 'جود بيلينغهام', team_id: 'eng', position: 'MF', nationality: 'England', nationality_ar: 'إنجلترا', photo: '⭐', number: 22, age: 21, club: 'ريال مدريد' },
  { id: 'p-kane', name: 'Harry Kane', name_ar: 'هاري كين', team_id: 'eng', position: 'FW', nationality: 'England', nationality_ar: 'إنجلترا', photo: '⚽', number: 9, age: 31, club: 'بايرن ميونخ' },
  { id: 'p-foden', name: 'Phil Foden', name_ar: 'فيل فودين', team_id: 'eng', position: 'MF', nationality: 'England', nationality_ar: 'إنجلترا', photo: '🎯', number: 11, age: 24, club: 'مانشستر سيتي' },
  { id: 'p-saka', name: 'Bukayo Saka', name_ar: 'بوكايو ساكا', team_id: 'eng', position: 'FW', nationality: 'England', nationality_ar: 'إنجلترا', photo: '⚡', number: 17, age: 23, club: 'آرسنال' },
  { id: 'p-stones', name: 'John Stones', name_ar: 'جون ستونز', team_id: 'eng', position: 'DF', nationality: 'England', nationality_ar: 'إنجلترا', photo: '🛡️', number: 5, age: 30, club: 'مانشستر سيتي' },
  { id: 'p-rice', name: 'Declan Rice', name_ar: 'ديكلان رايس', team_id: 'eng', position: 'MF', nationality: 'England', nationality_ar: 'إنجلترا', photo: '⚙️', number: 4, age: 26, club: 'آرسنال' },
  { id: 'p-pickford', name: 'Jordan Pickford', name_ar: 'جوردان بيكفورد', team_id: 'eng', position: 'GK', nationality: 'England', nationality_ar: 'إنجلترا', photo: '🧤', number: 1, age: 31, club: 'إيفرتون' },
  { id: 'p-walker', name: 'Kyle Walker', name_ar: 'كايل ووكر', team_id: 'eng', position: 'DF', nationality: 'England', nationality_ar: 'إنجلترا', photo: '🛡️', number: 2, age: 35, club: 'مانشستر سيتي' },

  // ===== Spain =====
  { id: 'p-yamal', name: 'Lamine Yamal', name_ar: 'لامين يامال', team_id: 'esp', position: 'FW', nationality: 'Spain', nationality_ar: 'إسبانيا', photo: '⚡', number: 19, age: 18, club: 'برشلونة' },
  { id: 'p-rodrigo2', name: 'Rodri', name_ar: 'رودري', team_id: 'esp', position: 'MF', nationality: 'Spain', nationality_ar: 'إسبانيا', photo: '⚙️', number: 16, age: 28, club: 'مانشستر سيتي' },
  { id: 'p-pedri', name: 'Pedri', name_ar: 'بيدري', team_id: 'esp', position: 'MF', nationality: 'Spain', nationality_ar: 'إسبانيا', photo: '🎯', number: 20, age: 22, club: 'برشلونة' },
  { id: 'p-olmo', name: 'Dani Olmo', name_ar: 'داني أولمو', team_id: 'esp', position: 'FW', nationality: 'Spain', nationality_ar: 'إسبانيا', photo: '⚽', number: 7, age: 26, club: 'برشلونة' },
  { id: 'p-raya', name: 'David Raya', name_ar: 'ديفيد رايا', team_id: 'esp', position: 'GK', nationality: 'Spain', nationality_ar: 'إسبانيا', photo: '🧤', number: 1, age: 29, club: 'آرسنال' },
  { id: 'p-williams', name: 'Nico Williams', name_ar: 'نيكو ويليامز', team_id: 'esp', position: 'FW', nationality: 'Spain', nationality_ar: 'إسبانيا', photo: '⚡', number: 17, age: 22, club: 'أتلتيك بيلباو' },
  { id: 'p-ruiz', name: 'Fabian Ruiz', name_ar: 'فابيان رويز', team_id: 'esp', position: 'MF', nationality: 'Spain', nationality_ar: 'إسبانيا', photo: '⚙️', number: 8, age: 29, club: 'باريس سان جيرمان' },
  { id: 'p-laporte', name: 'Aymeric Laporte', name_ar: 'إيمريك لابورت', team_id: 'esp', position: 'DF', nationality: 'Spain', nationality_ar: 'إسبانيا', photo: '🛡️', number: 14, age: 31, club: 'النصر' },

  // ===== Portugal =====
  { id: 'p-ronaldo', name: 'Cristiano Ronaldo', name_ar: 'كريستيانو رونالدو', team_id: 'por', position: 'FW', nationality: 'Portugal', nationality_ar: 'البرتغال', photo: '⭐', number: 7, age: 40, club: 'النصر' },
  { id: 'p-bruno', name: 'Bruno Fernandes', name_ar: 'برونو فيرنانديز', team_id: 'por', position: 'MF', nationality: 'Portugal', nationality_ar: 'البرتغال', photo: '🎯', number: 8, age: 30, club: 'مانشستر يونايتد' },
  { id: 'p-leao', name: 'Rafael Leão', name_ar: 'رافائيل لياو', team_id: 'por', position: 'FW', nationality: 'Portugal', nationality_ar: 'البرتغال', photo: '⚡', number: 15, age: 25, club: 'ميلان' },
  { id: 'p-ruben', name: 'Rúben Dias', name_ar: 'روبن دياز', team_id: 'por', position: 'DF', nationality: 'Portugal', nationality_ar: 'البرتغال', photo: '🛡️', number: 4, age: 27, club: 'مانشستر سيتي' },
  { id: 'p-bernardo', name: 'Bernardo Silva', name_ar: 'برناردو سيلفا', team_id: 'por', position: 'MF', nationality: 'Portugal', nationality_ar: 'البرتغال', photo: '⚙️', number: 10, age: 30, club: 'مانشستر سيتي' },
  { id: 'p-cancelo', name: 'João Cancelo', name_ar: 'جواو كانسيلو', team_id: 'por', position: 'DF', nationality: 'Portugal', nationality_ar: 'البرتغال', photo: '🛡️', number: 20, age: 30, club: 'الاهلي' },
  { id: 'p-costa', name: 'Diogo Costa', name_ar: 'ديوغو كوستا', team_id: 'por', position: 'GK', nationality: 'Portugal', nationality_ar: 'البرتغال', photo: '🧤', number: 22, age: 25, club: 'بورتو' },

  // ===== Germany =====
  { id: 'p-musiala', name: 'Jamal Musiala', name_ar: 'جمال موسيالا', team_id: 'ger', position: 'MF', nationality: 'Germany', nationality_ar: 'ألمانيا', photo: '⚡', number: 10, age: 21, club: 'بايرن ميونخ' },
  { id: 'p-wirtz', name: 'Florian Wirtz', name_ar: 'فلوريان فيرتز', team_id: 'ger', position: 'MF', nationality: 'Germany', nationality_ar: 'ألمانيا', photo: '🎯', number: 17, age: 21, club: 'باير ليفركوزن' },
  { id: 'p-kimmich', name: 'Joshua Kimmich', name_ar: 'جوشوا كيميتش', team_id: 'ger', position: 'DF', nationality: 'Germany', nationality_ar: 'ألمانيا', photo: '🛡️', number: 6, age: 29, club: 'بايرن ميونخ' },
  { id: 'p-rudiger', name: 'Antonio Rüdiger', name_ar: 'أنطونيو روديغر', team_id: 'ger', position: 'DF', nationality: 'Germany', nationality_ar: 'ألمانيا', photo: '🛡️', number: 2, age: 31, club: 'ريال مدريد' },
  { id: 'p-terstegen', name: 'Marc-André ter Stegen', name_ar: 'مارك أندريه تير شتيغن', team_id: 'ger', position: 'GK', nationality: 'Germany', nationality_ar: 'ألمانيا', photo: '🧤', number: 12, age: 32, club: 'برشلونة' },
  { id: 'p-gnabry', name: 'Serge Gnabry', name_ar: 'سيرغ نابري', team_id: 'ger', position: 'FW', nationality: 'Germany', nationality_ar: 'ألمانيا', photo: '⚽', number: 7, age: 29, club: 'بايرن ميونخ' },
  { id: 'p-gross', name: 'Pascal Groß', name_ar: 'باسكال غروس', team_id: 'ger', position: 'MF', nationality: 'Germany', nationality_ar: 'ألمانيا', photo: '⚙️', number: 21, age: 33, club: 'بوروسيا دورتموند' },

  // ===== Netherlands =====
  { id: 'p-deprijn', name: 'Memphis Depay', name_ar: 'ممفيس ديباي', team_id: 'ned', position: 'FW', nationality: 'Netherlands', nationality_ar: 'هولندا', photo: '⚡', number: 10, age: 31, club: 'كورينثيانز' },
  { id: 'p-vandijk', name: 'Virgil van Dijk', name_ar: 'فيرجيل فان دايك', team_id: 'ned', position: 'DF', nationality: 'Netherlands', nationality_ar: 'هولندا', photo: '🛡️', number: 4, age: 33, club: 'ليفربول' },
  { id: 'p-gakpo', name: 'Cody Gakpo', name_ar: 'كودي خاكبو', team_id: 'ned', position: 'FW', nationality: 'Netherlands', nationality_ar: 'هولندا', photo: '⚽', number: 11, age: 25, club: 'ليفربول' },
  { id: 'p-frimpong', name: 'Jeremie Frimpong', name_ar: 'جيريمي فريمبونغ', team_id: 'ned', position: 'DF', nationality: 'Netherlands', nationality_ar: 'هولندا', photo: '🛡️', number: 22, age: 24, club: 'ليفركوزن' },
  { id: 'p-verbruggen', name: 'Bart Verbruggen', name_ar: 'بارت فيربروغن', team_id: 'ned', position: 'GK', nationality: 'Netherlands', nationality_ar: 'هولندا', photo: '🧤', number: 1, age: 22, club: 'برايتون' },
  { id: 'p-simons', name: 'Xavi Simons', name_ar: 'تشافي سيمونز', team_id: 'ned', position: 'MF', nationality: 'Netherlands', nationality_ar: 'هولندا', photo: '🎯', number: 7, age: 21, club: 'لايبزيغ' },

  // ===== Saudi Arabia =====
  { id: 'p-salem', name: 'Salem Al-Dawsari', name_ar: 'سالم الدوسري', team_id: 'sau', position: 'FW', nationality: 'Saudi Arabia', nationality_ar: 'السعودية', photo: '⚡', number: 10, age: 33, club: 'الهلال' },
  { id: 'p-shehri', name: 'Salem Al-Shehri', name_ar: 'سالم الشهري', team_id: 'sau', position: 'FW', nationality: 'Saudi Arabia', nationality_ar: 'السعودية', photo: '⚽', number: 11, age: 31, club: 'الهلال' },
  { id: 'p-owais', name: 'Mohammed Al-Owais', name_ar: 'محمد العويس', team_id: 'sau', position: 'GK', nationality: 'Saudi Arabia', nationality_ar: 'السعودية', photo: '🧤', number: 21, age: 33, club: 'الهلال' },
  { id: 'p-hamdan', name: 'Abdullah Al-Hamdan', name_ar: 'عبدالله الحمدان', team_id: 'sau', position: 'FW', nationality: 'Saudi Arabia', nationality_ar: 'السعودية', photo: '🎯', number: 9, age: 25, club: 'الهلال' },
  { id: 'p-faraj', name: 'Salem Al-Faraj', name_ar: 'سلمان الفرج', team_id: 'sau', position: 'MF', nationality: 'Saudi Arabia', nationality_ar: 'السعودية', photo: '⚙️', number: 7, age: 35, club: 'الهلال' },
  { id: 'p-ambri', name: 'Ali Al-Bulaihi', name_ar: 'علي البليهي', team_id: 'sau', position: 'DF', nationality: 'Saudi Arabia', nationality_ar: 'السعودية', photo: '🛡️', number: 5, age: 34, club: 'الهلال' },
  { id: 'p-kanu', name: 'Sultan Al-Ghannam', name_ar: 'سلطان الغنام', team_id: 'sau', position: 'DF', nationality: 'Saudi Arabia', nationality_ar: 'السعودية', photo: '🛡️', number: 6, age: 30, club: 'النصر' },

  // ===== Morocco =====
  { id: 'p-hakimi', name: 'Achraf Hakimi', name_ar: 'أشرف حكيمي', team_id: 'mar', position: 'DF', nationality: 'Morocco', nationality_ar: 'المغرب', photo: '⚡', number: 2, age: 26, club: 'باريس سان جيرمان' },
  { id: 'p-ziyech', name: 'Hakim Ziyech', name_ar: 'حكيم زياش', team_id: 'mar', position: 'MF', nationality: 'Morocco', nationality_ar: 'المغرب', photo: '🎯', number: 7, age: 32, club: 'غلطة سراي' },
  { id: 'p-ennesyri', name: 'Youssef En-Nesyri', name_ar: 'يوسف النصيري', team_id: 'mar', position: 'FW', nationality: 'Morocco', nationality_ar: 'المغرب', photo: '⚽', number: 19, age: 28, club: 'فنربخشة' },
  { id: 'p-bono', name: 'Yassine Bounou', name_ar: 'ياسين بونو', team_id: 'mar', position: 'GK', nationality: 'Morocco', nationality_ar: 'المغرب', photo: '🧤', number: 1, age: 33, club: 'الهلال' },
  { id: 'p-ouazzani', name: 'Azzedine Ounahi', name_ar: 'عز الدين أوناحي', team_id: 'mar', position: 'MF', nationality: 'Morocco', nationality_ar: 'المغرب', photo: '⚙️', number: 8, age: 25, club: 'باناثينايكوس' },
  { id: 'p-aguerd', name: 'Nayef Aguerd', name_ar: 'نايف أكرد', team_id: 'mar', position: 'DF', nationality: 'Morocco', nationality_ar: 'المغرب', photo: '🛡️', number: 5, age: 28, club: 'ريال بيتيس' },

  // ===== Japan =====
  { id: 'p-kubo', name: 'Takefusa Kubo', name_ar: 'تاكيفوسا كوبو', team_id: 'jpn', position: 'FW', nationality: 'Japan', nationality_ar: 'اليابان', photo: '⚡', number: 11, age: 23, club: 'ريال سوسيداد' },
  { id: 'p-mitoma', name: 'Kaoru Mitoma', name_ar: 'كاورو ميتوما', team_id: 'jpn', position: 'FW', nationality: 'Japan', nationality_ar: 'اليابان', photo: '🎯', number: 14, age: 27, club: 'برايتون' },
  { id: 'p-kamada', name: 'Daichi Kamada', name_ar: 'دايتشي كامادا', team_id: 'jpn', position: 'MF', nationality: 'Japan', nationality_ar: 'اليابان', photo: '⚙️', number: 15, age: 28, club: 'لاتسيو' },
  { id: 'p-suzuki', name: 'Zion Suzuki', name_ar: 'زيون سوزوكي', team_id: 'jpn', position: 'GK', nationality: 'Japan', nationality_ar: 'اليابان', photo: '🧤', number: 1, age: 22, club: 'بارما' },
  { id: 'p-tomiyasu', name: 'Takehiro Tomiyasu', name_ar: 'تاكيهيرو تومياسو', team_id: 'jpn', position: 'DF', nationality: 'Japan', nationality_ar: 'اليابان', photo: '🛡️', number: 16, age: 26, club: 'آرسنال' },

  // ===== Italy =====
  { id: 'p-chiesa', name: 'Federico Chiesa', name_ar: 'فيديريكو كييزا', team_id: 'ita', position: 'FW', nationality: 'Italy', nationality_ar: 'إيطاليا', photo: '⚡', number: 14, age: 27, club: 'ليفربول' },
  { id: 'p-barella', name: 'Nicolò Barella', name_ar: 'نيكولو باريللا', team_id: 'ita', position: 'MF', nationality: 'Italy', nationality_ar: 'إيطاليا', photo: '⚙️', number: 18, age: 27, club: 'إنتر ميلان' },
  { id: 'p-dimarco', name: 'Federico Dimarco', name_ar: 'فيديريكو ديماركو', team_id: 'ita', position: 'DF', nationality: 'Italy', nationality_ar: 'إيطاليا', photo: '🛡️', number: 6, age: 27, club: 'إنتر ميلان' },
  { id: 'p-donnuma', name: 'Gianluigi Donnarumma', name_ar: 'جانلويجي دوناروما', team_id: 'ita', position: 'GK', nationality: 'Italy', nationality_ar: 'إيطاليا', photo: '🧤', number: 21, age: 25, club: 'باريس سان جيرمان' },
  { id: 'p-scamacca', name: 'Gianluca Scamacca', name_ar: 'جانلوكا سكاماكا', team_id: 'ita', position: 'FW', nationality: 'Italy', nationality_ar: 'إيطاليا', photo: '⚽', number: 9, age: 25, club: 'أتالانتا' },

  // ===== USA =====
  { id: 'p-pulisic', name: 'Christian Pulisic', name_ar: 'كريستيان بوليسيتش', team_id: 'usa', position: 'FW', nationality: 'USA', nationality_ar: 'الولايات المتحدة', photo: '⚡', number: 10, age: 26, club: 'ميلان' },
  { id: 'p-mckennie', name: 'Weston McKennie', name_ar: 'ويستون ماكيني', team_id: 'usa', position: 'MF', nationality: 'USA', nationality_ar: 'الولايات المتحدة', photo: '⚙️', number: 8, age: 26, club: 'يوفنتوس' },
  { id: 'p-turner', name: 'Matt Turner', name_ar: 'مات تورنر', team_id: 'usa', position: 'GK', nationality: 'USA', nationality_ar: 'الولايات المتحدة', photo: '🧤', number: 1, age: 30, club: 'كريستال بالاس' },
  { id: 'p-balloon', name: 'Folarin Balogun', name_ar: 'فولارين بالوغون', team_id: 'usa', position: 'FW', nationality: 'USA', nationality_ar: 'الولايات المتحدة', photo: '⚽', number: 9, age: 23, club: 'موناكو' },
  { id: 'p-adams', name: 'Tyler Adams', name_ar: 'تايلر آدامز', team_id: 'usa', position: 'MF', nationality: 'USA', nationality_ar: 'الولايات المتحدة', photo: '⚙️', number: 4, age: 26, club: 'بورنموث' },

  // ===== Croatia =====
  { id: 'p-modric', name: 'Luka Modrić', name_ar: 'لوكا مودريتش', team_id: 'cro', position: 'MF', nationality: 'Croatia', nationality_ar: 'كرواتيا', photo: '⭐', number: 10, age: 39, club: 'ميلان' },
  { id: 'p-kramaric', name: 'Andrej Kramarić', name_ar: 'أندريه كراماريتش', team_id: 'cro', position: 'FW', nationality: 'Croatia', nationality_ar: 'كرواتيا', photo: '⚽', number: 9, age: 33, club: 'هوفنهايم' },
  { id: 'p-gvardiol', name: 'Joško Gvardiol', name_ar: 'يوشكو غفارديول', team_id: 'cro', position: 'DF', nationality: 'Croatia', nationality_ar: 'كرواتيا', photo: '🛡️', number: 20, age: 23, club: 'مانشستر سيتي' },

  // ===== Belgium =====
  { id: 'p-debruyne', name: 'Kevin De Bruyne', name_ar: 'كيفين دي بروين', team_id: 'bel', position: 'MF', nationality: 'Belgium', nationality_ar: 'بلجيكا', photo: '⭐', number: 7, age: 33, club: 'نابولي' },
  { id: 'p-lukaku', name: 'Romelu Lukaku', name_ar: 'روميلو لوكاكو', team_id: 'bel', position: 'FW', nationality: 'Belgium', nationality_ar: 'بلجيكا', photo: '⚽', number: 9, age: 31, club: 'نابولي' },
  { id: 'p-courtois', name: 'Thibaut Courtois', name_ar: 'تيبو كورتوا', team_id: 'bel', position: 'GK', nationality: 'Belgium', nationality_ar: 'بلجيكا', photo: '🧤', number: 1, age: 32, club: 'ريال مدريد' },

  // ===== Norway =====
  { id: 'p-haaland', name: 'Erling Haaland', name_ar: 'إيرلينغ هالاند', team_id: 'nor', position: 'FW', nationality: 'Norway', nationality_ar: 'النرويج', photo: '⚡', number: 9, age: 24, club: 'مانشستر سيتي' },
  { id: 'p-odegaard', name: 'Martin Ødegaard', name_ar: 'مارتن أوديغارد', team_id: 'nor', position: 'MF', nationality: 'Norway', nationality_ar: 'النرويج', photo: '🎯', number: 10, age: 26, club: 'آرسنال' },

  // ===== Mexico =====
  { id: 'p-lozano', name: 'Hirving Lozano', name_ar: 'هيرفينغ لوزانو', team_id: 'mex', position: 'FW', nationality: 'Mexico', nationality_ar: 'المكسيك', photo: '⚡', number: 22, age: 29, club: 'بي إس في' },
  { id: 'p-jimenez', name: 'Santiago Giménez', name_ar: 'سانتياغو خيمينيز', team_id: 'mex', position: 'FW', nationality: 'Mexico', nationality_ar: 'المكسيك', photo: '⚽', number: 9, age: 23, club: 'ميلان' },

  // ===== Canada =====
  { id: 'p-davies', name: 'Alphonso Davies', name_ar: 'ألفونسو ديفيز', team_id: 'can', position: 'DF', nationality: 'Canada', nationality_ar: 'كندا', photo: '⚡', number: 19, age: 24, club: 'بايرن ميونخ' },
  { id: 'p-david', name: 'Jonathan David', name_ar: 'جوناثان ديفيد', team_id: 'can', position: 'FW', nationality: 'Canada', nationality_ar: 'كندا', photo: '⚽', number: 20, age: 25, club: 'يوفنتوس' },
];

// Top scorers (based on group stage + knockout matches below)
export const TOP_SCORERS: TopScorerRow[] = [
  { player_id: 'p-mbappe', goals: 7, assists: 3, team_id: 'fra', penalties: 2, matches_played: 6 },
  { player_id: 'p-messi', goals: 6, assists: 4, team_id: 'arg', penalties: 1, matches_played: 6 },
  { player_id: 'p-vini', goals: 5, assists: 2, team_id: 'bra', penalties: 0, matches_played: 5 },
  { player_id: 'p-bellingham', goals: 5, assists: 3, team_id: 'eng', penalties: 1, matches_played: 6 },
  { player_id: 'p-yamal', goals: 4, assists: 5, team_id: 'esp', penalties: 0, matches_played: 5 },
  { player_id: 'p-kane', goals: 4, assists: 2, team_id: 'eng', penalties: 2, matches_played: 6 },
  { player_id: 'p-musiala', goals: 4, assists: 2, team_id: 'ger', penalties: 0, matches_played: 5 },
  { player_id: 'p-rodrigo2', goals: 3, assists: 4, team_id: 'esp', penalties: 0, matches_played: 5 },
  { player_id: 'p-julian', goals: 4, assists: 1, team_id: 'arg', penalties: 0, matches_played: 6 },
  { player_id: 'p-gakpo', goals: 4, assists: 1, team_id: 'ned', penalties: 0, matches_played: 5 },
  { player_id: 'p-ronaldo', goals: 3, assists: 1, team_id: 'por', penalties: 1, matches_played: 4 },
  { player_id: 'p-salem', goals: 3, assists: 2, team_id: 'sau', penalties: 1, matches_played: 4 },
  { player_id: 'p-deprijn', goals: 3, assists: 2, team_id: 'ned', penalties: 0, matches_played: 5 },
  { player_id: 'p-ennesyri', goals: 3, assists: 0, team_id: 'mar', penalties: 0, matches_played: 4 },
  { player_id: 'p-kubo', goals: 3, assists: 1, team_id: 'jpn', penalties: 0, matches_played: 4 },
  { player_id: 'p-haaland', goals: 4, assists: 1, team_id: 'nor', penalties: 1, matches_played: 3 },
  { player_id: 'p-debruyne', goals: 2, assists: 4, team_id: 'bel', penalties: 0, matches_played: 4 },
  { player_id: 'p-pulisic', goals: 3, assists: 2, team_id: 'usa', penalties: 0, matches_played: 4 },
];

export const TOP_ASSISTS: TopAssistRow[] = [
  { player_id: 'p-yamal', assists: 5, goals: 4, team_id: 'esp', matches_played: 5 },
  { player_id: 'p-messi', assists: 4, goals: 6, team_id: 'arg', matches_played: 6 },
  { player_id: 'p-depaul', assists: 4, goals: 1, team_id: 'arg', matches_played: 6 },
  { player_id: 'p-debruyne', assists: 4, goals: 2, team_id: 'bel', matches_played: 4 },
  { player_id: 'p-bellingham', assists: 3, goals: 5, team_id: 'eng', matches_played: 6 },
  { player_id: 'p-mbappe', assists: 3, goals: 7, team_id: 'fra', matches_played: 6 },
  { player_id: 'p-bruno', assists: 3, goals: 2, team_id: 'por', matches_played: 4 },
  { player_id: 'p-pedri', assists: 3, goals: 1, team_id: 'esp', matches_played: 5 },
  { player_id: 'p-wirtz', assists: 3, goals: 2, team_id: 'ger', matches_played: 5 },
  { player_id: 'p-rodrigo2', assists: 4, goals: 3, team_id: 'esp', matches_played: 5 },
  { player_id: 'p-simons', assists: 3, goals: 2, team_id: 'ned', matches_played: 5 },
  { player_id: 'p-foden', assists: 3, goals: 2, team_id: 'eng', matches_played: 6 },
  { player_id: 'p-odegaard', assists: 3, goals: 2, team_id: 'nor', matches_played: 3 },
];

// ============================================================
// STANDINGS — Group stage results (3 matches per team)
// ============================================================
function makeStandings(group: string, rows: Array<[string, number, number, number, number, number, number]>): StandingsRow[] {
  return rows.map(([teamId, p, w, d, l, gf, ga]) => ({
    id: `${group.toLowerCase()}-${teamId}`,
    group,
    team_id: teamId,
    played: p,
    win: w,
    draw: d,
    lose: l,
    goals_for: gf,
    goals_against: ga,
    goal_diff: gf - ga,
    points: w * 3 + d,
  }));
}

export const STANDINGS: StandingsRow[] = [
  ...makeStandings('A', [
    ['usa', 3, 2, 1, 0, 5, 2],
    ['mex', 3, 2, 0, 1, 4, 2],
    ['can', 3, 1, 0, 2, 3, 5],
    ['crc', 3, 0, 1, 2, 1, 4],
  ]),
  ...makeStandings('B', [
    ['ger', 3, 2, 1, 0, 6, 2],
    ['ned', 3, 2, 0, 1, 5, 3],
    ['jpn', 3, 1, 1, 1, 4, 4],
    ['aus', 3, 0, 0, 3, 2, 8],
  ]),
  ...makeStandings('C', [
    ['arg', 3, 3, 0, 0, 7, 1],
    ['sen', 3, 1, 1, 1, 3, 3],
    ['sui', 3, 1, 1, 1, 3, 4],
    ['irq', 3, 0, 0, 3, 1, 6],
  ]),
  ...makeStandings('D', [
    ['fra', 3, 2, 1, 0, 6, 1],
    ['mar', 3, 2, 0, 1, 4, 2],
    ['bel', 3, 1, 1, 1, 3, 3],
    ['kor', 3, 0, 0, 3, 2, 9],
  ]),
  ...makeStandings('E', [
    ['bra', 3, 2, 1, 0, 5, 2],
    ['ngr', 3, 2, 0, 1, 4, 3],
    ['col', 3, 1, 0, 2, 3, 4],
    ['tun', 3, 0, 1, 2, 2, 5],
  ]),
  ...makeStandings('F', [
    ['esp', 3, 3, 0, 0, 8, 1],
    ['cro', 3, 1, 1, 1, 4, 4],
    ['ecu', 3, 1, 0, 2, 3, 5],
    ['civ', 3, 0, 1, 2, 2, 7],
  ]),
  ...makeStandings('G', [
    ['eng', 3, 2, 1, 0, 6, 2],
    ['por', 3, 2, 0, 1, 5, 3],
    ['par', 3, 1, 0, 2, 3, 5],
    ['irn', 3, 0, 1, 2, 2, 6],
  ]),
  ...makeStandings('H', [
    ['ita', 3, 2, 1, 0, 5, 2],
    ['uru', 3, 2, 0, 1, 4, 3],
    ['gha', 3, 0, 1, 2, 2, 5],
    ['rsa', 3, 0, 0, 3, 1, 6],
  ]),
  ...makeStandings('I', [
    ['ukr', 3, 2, 1, 0, 5, 2],
    ['sau', 3, 1, 2, 0, 4, 3],
    ['per', 3, 1, 0, 2, 3, 4],
    ['uzb', 3, 0, 1, 2, 2, 5],
  ]),
  ...makeStandings('J', [
    ['aut', 3, 2, 1, 0, 5, 2],
    ['nor', 3, 2, 0, 1, 7, 3],
    ['swe', 3, 1, 0, 2, 3, 4],
    ['blr', 3, 0, 1, 2, 1, 7],
  ]),
  ...makeStandings('K', [
    ['tur', 3, 2, 1, 0, 5, 2],
    ['den', 3, 1, 2, 0, 3, 2],
    ['mli', 3, 1, 0, 2, 3, 4],
    ['hon', 3, 0, 1, 2, 2, 5],
  ]),
  ...makeStandings('L', [
    ['pol', 3, 2, 1, 0, 5, 2],
    ['wal', 3, 2, 0, 1, 4, 3],
    ['cmr', 3, 1, 0, 2, 3, 5],
    ['pan', 3, 0, 1, 2, 2, 4],
  ]),
];

// ============================================================
// MATCHES
// ============================================================
// "Today" reference for live matches: June 17, 2026 18:00 UTC
const today = new Date('2026-06-17T18:00:00Z');
function iso(daysFromNow: number, hourUtc = 18, minuteUtc = 0): string {
  const d = new Date(today);
  d.setUTCDate(d.getUTCDate() + daysFromNow);
  d.setUTCHours(hourUtc, minuteUtc, 0, 0);
  return d.toISOString();
}

function goalEvent(matchId: string, teamId: string, playerId: string, playerName: string, playerNameAr: string, minute: number, detail?: string): MatchEvent {
  return { id: `${matchId}-g-${minute}-${playerId}`, match_id: matchId, team_id: teamId, type: 'goal', player: playerName, player_ar: playerNameAr, minute, detail };
}
function cardEvent(matchId: string, teamId: string, playerName: string, playerNameAr: string, minute: number, color: 'Yellow' | 'Red'): MatchEvent {
  return { id: `${matchId}-c-${minute}-${playerName}`, match_id: matchId, team_id: teamId, type: 'card', player: playerName, player_ar: playerNameAr, minute, detail: color };
}

function defaultStats(homeScore: number, awayScore: number): MatchStatistics {
  return {
    possession: [52, 48],
    shots: [12 + homeScore, 9 + awayScore],
    shots_on_target: [5 + homeScore, 4 + awayScore],
    corners: [6, 4],
    fouls: [11, 13],
    yellow_cards: [2, 3],
    red_cards: [0, 0],
    passes: [487, 423],
    pass_accuracy: [86, 81],
  };
}

// ============================================================
// GROUP STAGE MATCHES (mix: finished, live, upcoming)
// ============================================================
export const GROUP_MATCHES: Match[] = [
  // ===== Finished =====
  {
    id: 'g1', fixture_id: 'f1', home_team_id: 'arg', away_team_id: 'irq',
    home_score: 3, away_score: 0, status: 'FT', date: iso(-3, 21),
    round: 'group', stage_order: 1, group: 'C', stadium_id: 'metlife',
    referee: 'Szymon Marciniak', winner_id: 'arg', loser_id: 'irq',
    events: [
      goalEvent('g1', 'arg', 'p-messi', 'Lionel Messi', 'ليونيل ميسي', 12),
      goalEvent('g1', 'arg', 'p-julian', 'Julián Álvarez', 'خوليان ألفاريز', 34),
      goalEvent('g1', 'arg', 'p-messi', 'Lionel Messi', 'ليونيل ميسي', 67, 'Penalty'),
      cardEvent('g1', 'irq', 'Amir Al-Ammari', 'أمير العمري', 45, 'Yellow'),
    ],
    statistics: defaultStats(3, 0), man_of_the_match: 'p-messi',
  },
  {
    id: 'g2', fixture_id: 'f2', home_team_id: 'fra', away_team_id: 'kor',
    home_score: 4, away_score: 1, status: 'FT', date: iso(-3, 18),
    round: 'group', stage_order: 1, group: 'D', stadium_id: 'att',
    referee: 'Anthony Taylor', winner_id: 'fra', loser_id: 'kor',
    events: [
      goalEvent('g2', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 8),
      goalEvent('g2', 'fra', 'p-griezmann', 'Antoine Griezmann', 'أنطوان غريزمان', 28),
      goalEvent('g2', 'kor', 'Son Heung-min', 'سون هيونغ مين', 55),
      goalEvent('g2', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 71, 'Penalty'),
      goalEvent('g2', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 88),
    ],
    statistics: defaultStats(4, 1), man_of_the_match: 'p-mbappe',
  },
  {
    id: 'g3', fixture_id: 'f3', home_team_id: 'esp', away_team_id: 'civ',
    home_score: 3, away_score: 0, status: 'FT', date: iso(-2, 21),
    round: 'group', stage_order: 1, group: 'F', stadium_id: 'hardrock',
    referee: 'Daniele Orsato', winner_id: 'esp', loser_id: 'civ',
    events: [
      goalEvent('g3', 'esp', 'p-yamal', 'Lamine Yamal', 'لامين يامال', 23),
      goalEvent('g3', 'esp', 'p-olmo', 'Dani Olmo', 'داني أولمو', 56),
      goalEvent('g3', 'esp', 'p-yamal', 'Lamine Yamal', 'لامين يامال', 78),
    ],
    statistics: defaultStats(3, 0), man_of_the_match: 'p-yamal',
  },
  {
    id: 'g4', fixture_id: 'f4', home_team_id: 'bra', away_team_id: 'tun',
    home_score: 2, away_score: 0, status: 'FT', date: iso(-2, 18),
    round: 'group', stage_order: 1, group: 'E', stadium_id: 'sofi',
    referee: 'Michael Oliver', winner_id: 'bra', loser_id: 'tun',
    events: [
      goalEvent('g4', 'bra', 'p-vini', 'Vinícius Júnior', 'فينيسيوس جونيور', 31),
      goalEvent('g4', 'bra', 'p-rodrigo', 'Rodrygo', 'رودريغو', 73),
    ],
    statistics: defaultStats(2, 0), man_of_the_match: 'p-vini',
  },
  {
    id: 'g5', fixture_id: 'f5', home_team_id: 'eng', away_team_id: 'irn',
    home_score: 3, away_score: 1, status: 'FT', date: iso(-2, 15),
    round: 'group', stage_order: 1, group: 'G', stadium_id: 'mercedes',
    referee: 'Felix Zwayer', winner_id: 'eng', loser_id: 'irn',
    events: [
      goalEvent('g5', 'eng', 'p-bellingham', 'Jude Bellingham', 'جود بيلينغهام', 19),
      goalEvent('g5', 'eng', 'p-kane', 'Harry Kane', 'هاري كين', 42, 'Penalty'),
      goalEvent('g5', 'irn', 'Mehdi Taremi', 'مهدي طارمي', 61),
      goalEvent('g5', 'eng', 'p-saka', 'Bukayo Saka', 'بوكايو ساكا', 80),
    ],
    statistics: defaultStats(3, 1), man_of_the_match: 'p-bellingham',
  },
  {
    id: 'g6', fixture_id: 'f6', home_team_id: 'por', away_team_id: 'par',
    home_score: 2, away_score: 1, status: 'FT', date: iso(-1, 21),
    round: 'group', stage_order: 1, group: 'G', stadium_id: 'levis',
    referee: 'Jesús Gil Manzano', winner_id: 'por', loser_id: 'par',
    events: [
      goalEvent('g6', 'por', 'p-ronaldo', 'Cristiano Ronaldo', 'كريستيانو رونالدو', 27, 'Penalty'),
      goalEvent('g6', 'par', 'Antonio Sanabria', 'أنطونيو سانابريا', 53),
      goalEvent('g6', 'por', 'p-leao', 'Rafael Leão', 'رافائيل لياو', 88),
    ],
    statistics: defaultStats(2, 1), man_of_the_match: 'p-ronaldo',
  },
  {
    id: 'g7', fixture_id: 'f7', home_team_id: 'sau', away_team_id: 'per',
    home_score: 1, away_score: 1, status: 'FT', date: iso(-1, 18),
    round: 'group', stage_order: 1, group: 'I', stadium_id: 'arrowhead',
    referee: 'Sandro Wagner', winner_id: null, loser_id: null,
    events: [
      goalEvent('g7', 'sau', 'p-salem', 'Salem Al-Dawsari', 'سالم الدوسري', 38, 'Penalty'),
      goalEvent('g7', 'per', 'Gianluca Lapadula', 'جيانلوكا لابادولا', 72),
    ],
    statistics: defaultStats(1, 1),
  },
  {
    id: 'g8', fixture_id: 'f8', home_team_id: 'mar', away_team_id: 'bel',
    home_score: 2, away_score: 1, status: 'FT', date: iso(-1, 15),
    round: 'group', stage_order: 1, group: 'D', stadium_id: 'lincoln',
    referee: 'Clément Turpin', winner_id: 'mar', loser_id: 'bel',
    events: [
      goalEvent('g8', 'mar', 'p-ennesyri', 'Youssef En-Nesyri', 'يوسف النصيري', 22),
      goalEvent('g8', 'bel', 'p-lukaku', 'Romelu Lukaku', 'روميلو لوكاكو', 56),
      goalEvent('g8', 'mar', 'p-hakimi', 'Achraf Hakimi', 'أشرف حكيمي', 81),
    ],
    statistics: defaultStats(2, 1), man_of_the_match: 'p-hakimi',
  },
  {
    id: 'g9', fixture_id: 'f9', home_team_id: 'ger', away_team_id: 'aus',
    home_score: 4, away_score: 1, status: 'FT', date: iso(-1, 21),
    round: 'group', stage_order: 1, group: 'B', stadium_id: 'gillette',
    referee: 'Danny Makkelie', winner_id: 'ger', loser_id: 'aus',
    events: [
      goalEvent('g9', 'ger', 'p-musiala', 'Jamal Musiala', 'جمال موسيالا', 11),
      goalEvent('g9', 'ger', 'p-wirtz', 'Florian Wirtz', 'فلوريان فيرتز', 28),
      goalEvent('g9', 'aus', 'Jackson Irvine', 'جاكسون إيرفين', 49),
      goalEvent('g9', 'ger', 'p-musiala', 'Jamal Musiala', 'جمال موسيالا', 67),
      goalEvent('g9', 'ger', 'p-kimmich', 'Joshua Kimmich', 'جوشوا كيميتش', 83),
    ],
    statistics: defaultStats(4, 1), man_of_the_match: 'p-musiala',
  },
  {
    id: 'g10', fixture_id: 'f10', home_team_id: 'ned', away_team_id: 'jpn',
    home_score: 2, away_score: 1, status: 'FT', date: iso(-1, 18),
    round: 'group', stage_order: 1, group: 'B', stadium_id: 'nrg',
    referee: 'Artur Soares Dias', winner_id: 'ned', loser_id: 'jpn',
    events: [
      goalEvent('g10', 'ned', 'p-gakpo', 'Cody Gakpo', 'كودي خاكبو', 17),
      goalEvent('g10', 'jpn', 'p-kubo', 'Takefusa Kubo', 'تاكيفوسا كوبو', 39),
      goalEvent('g10', 'ned', 'p-deprijn', 'Memphis Depay', 'ممفيس ديباي', 76, 'Penalty'),
    ],
    statistics: defaultStats(2, 1), man_of_the_match: 'p-gakpo',
  },
  {
    id: 'g-haaland', fixture_id: 'fh', home_team_id: 'nor', away_team_id: 'blr',
    home_score: 5, away_score: 0, status: 'FT', date: iso(-2, 21),
    round: 'group', stage_order: 1, group: 'J', stadium_id: 'lumen',
    referee: 'Benoît Bastien', winner_id: 'nor', loser_id: 'blr',
    events: [
      goalEvent('g-haaland', 'nor', 'p-haaland', 'Erling Haaland', 'إيرلينغ هالاند', 8),
      goalEvent('g-haaland', 'nor', 'p-haaland', 'Erling Haaland', 'إيرلينغ هالاند', 23),
      goalEvent('g-haaland', 'nor', 'p-haaland', 'Erling Haaland', 'إيرلينغ هالاند', 56, 'Penalty'),
      goalEvent('g-haaland', 'nor', 'p-haaland', 'Erling Haaland', 'إيرلينغ هالاند', 71),
      goalEvent('g-haaland', 'nor', 'p-odegaard', 'Martin Ødegaard', 'مارتن أوديغارد', 88),
    ],
    statistics: defaultStats(5, 0), man_of_the_match: 'p-haaland',
  },
  {
    id: 'g-pulisic', fixture_id: 'fp', home_team_id: 'usa', away_team_id: 'crc',
    home_score: 2, away_score: 0, status: 'FT', date: iso(-2, 21),
    round: 'group', stage_order: 1, group: 'A', stadium_id: 'att',
    referee: 'Slavko Vinčić', winner_id: 'usa', loser_id: 'crc',
    events: [
      goalEvent('g-pulisic', 'usa', 'p-pulisic', 'Christian Pulisic', 'كريستيان بوليسيتش', 14),
      goalEvent('g-pulisic', 'usa', 'p-balloon', 'Folarin Balogun', 'فولارين بالوغون', 67),
    ],
    statistics: defaultStats(2, 0), man_of_the_match: 'p-pulisic',
  },

  // ===== LIVE =====
  {
    id: 'g11', fixture_id: 'f11', home_team_id: 'usa', away_team_id: 'mex',
    home_score: 1, away_score: 1, status: 'LIVE', date: iso(0, 18),
    round: 'group', stage_order: 1, group: 'A', stadium_id: 'azteca',
    referee: 'Slavko Vinčić', minute: 67,
    events: [
      goalEvent('g11', 'usa', 'p-pulisic', 'Christian Pulisic', 'كريستيان بوليسيتش', 23),
      goalEvent('g11', 'mex', 'p-jimenez', 'Santiago Giménez', 'سانتياغو خيمينيز', 56),
      cardEvent('g11', 'usa', 'p-mckennie', 'Weston McKennie', 'ويستون ماكيني', 41, 'Yellow'),
    ],
    statistics: defaultStats(1, 1),
  },
  {
    id: 'g12', fixture_id: 'f12', home_team_id: 'ita', away_team_id: 'uru',
    home_score: 0, away_score: 0, status: 'LIVE', date: iso(0, 18),
    round: 'group', stage_order: 1, group: 'H', stadium_id: 'lincoln',
    referee: 'Benoît Bastien', minute: 34,
    events: [
      cardEvent('g12', 'uru', 'Sergio Rochet', 'سيرجيو روتشيت', 28, 'Yellow'),
    ],
    statistics: defaultStats(0, 0),
  },

  // ===== UPCOMING =====
  {
    id: 'g13', fixture_id: 'f13', home_team_id: 'ned', away_team_id: 'ger',
    home_score: null, away_score: null, status: 'NS', date: iso(1, 21),
    round: 'group', stage_order: 1, group: 'B', stadium_id: 'metlife',
    referee: 'Anthony Taylor',
  },
  {
    id: 'g14', fixture_id: 'f14', home_team_id: 'arg', away_team_id: 'sen',
    home_score: null, away_score: null, status: 'NS', date: iso(1, 18),
    round: 'group', stage_order: 1, group: 'C', stadium_id: 'att',
    referee: 'Szymon Marciniak',
  },
  {
    id: 'g15', fixture_id: 'f15', home_team_id: 'bra', away_team_id: 'ngr',
    home_score: null, away_score: null, status: 'NS', date: iso(1, 15),
    round: 'group', stage_order: 1, group: 'E', stadium_id: 'hardrock',
    referee: 'Michael Oliver',
  },
  {
    id: 'g16', fixture_id: 'f16', home_team_id: 'esp', away_team_id: 'cro',
    home_score: null, away_score: null, status: 'NS', date: iso(2, 21),
    round: 'group', stage_order: 1, group: 'F', stadium_id: 'sofi',
    referee: 'Daniele Orsato',
  },
  {
    id: 'g17', fixture_id: 'f17', home_team_id: 'fra', away_team_id: 'bel',
    home_score: null, away_score: null, status: 'NS', date: iso(2, 18),
    round: 'group', stage_order: 1, group: 'D', stadium_id: 'mercedes',
    referee: 'Felix Zwayer',
  },
  {
    id: 'g18', fixture_id: 'f18', home_team_id: 'eng', away_team_id: 'por',
    home_score: null, away_score: null, status: 'NS', date: iso(2, 21),
    round: 'group', stage_order: 1, group: 'G', stadium_id: 'levis',
    referee: 'Jesús Gil Manzano',
  },
  {
    id: 'g19', fixture_id: 'f19', home_team_id: 'sau', away_team_id: 'ukr',
    home_score: null, away_score: null, status: 'NS', date: iso(3, 18),
    round: 'group', stage_order: 1, group: 'I', stadium_id: 'arrowhead',
    referee: 'Sandro Wagner',
  },
  {
    id: 'g20', fixture_id: 'f20', home_team_id: 'mar', away_team_id: 'kor',
    home_score: null, away_score: null, status: 'NS', date: iso(3, 21),
    round: 'group', stage_order: 1, group: 'D', stadium_id: 'lincoln',
    referee: 'Clément Turpin',
  },
];

// ============================================================
// KNOCKOUT STAGE — Round of 32 (16 matches) → R16 (8) → QF (4) → SF (2) → Final + 3rd
// Per WC 2026 format: top 2 of each group (24) + 8 best third-placed = 32 teams
// For this mock we'll show the bracket starting from R32 with realistic matchings
// ============================================================

// Round of 32 — 16 matches
export const R32_MATCHES: Match[] = [
  // Top half (left side of bracket — feeds into SF1)
  { id: 'r32-1', fixture_id: 'kr1', home_team_id: 'arg', away_team_id: 'ukr',
    home_score: 2, away_score: 0, status: 'FT', date: iso(-5, 18),
    round: 'R32', stage_order: 2, stadium_id: 'metlife',
    referee: 'Szymon Marciniak', winner_id: 'arg', loser_id: 'ukr', next_match_id: 'r16-1', bracket_position: 1,
    events: [
      goalEvent('r32-1', 'arg', 'p-messi', 'Lionel Messi', 'ليونيل ميسي', 23),
      goalEvent('r32-1', 'arg', 'p-julian', 'Julián Álvarez', 'خوليان ألفاريز', 67),
    ],
    statistics: defaultStats(2, 0), man_of_the_match: 'p-messi',
  },
  { id: 'r32-2', fixture_id: 'kr2', home_team_id: 'per', away_team_id: 'ned',
    home_score: 1, away_score: 3, status: 'FT', date: iso(-5, 21),
    round: 'R32', stage_order: 2, stadium_id: 'att',
    referee: 'Anthony Taylor', winner_id: 'ned', loser_id: 'per', next_match_id: 'r16-1', bracket_position: 2,
    events: [
      goalEvent('r32-2', 'ned', 'p-gakpo', 'Cody Gakpo', 'كودي خاكبو', 17),
      goalEvent('r32-2', 'per', 'Gianluca Lapadula', 'جيانلوكا لابادولا', 33),
      goalEvent('r32-2', 'ned', 'p-deprijn', 'Memphis Depay', 'ممفيس ديباي', 56),
      goalEvent('r32-2', 'ned', 'p-simons', 'Xavi Simons', 'تشافي سيمونز', 78),
    ],
    statistics: defaultStats(1, 3), man_of_the_match: 'p-gakpo',
  },
  { id: 'r32-3', fixture_id: 'kr3', home_team_id: 'fra', away_team_id: 'gha',
    home_score: 3, away_score: 1, status: 'FT', date: iso(-5, 18),
    round: 'R32', stage_order: 2, stadium_id: 'hardrock',
    referee: 'Daniele Orsato', winner_id: 'fra', loser_id: 'gha', next_match_id: 'r16-2', bracket_position: 3,
    events: [
      goalEvent('r32-3', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 11),
      goalEvent('r32-3', 'fra', 'p-griezmann', 'Antoine Griezmann', 'أنطوان غريزمان', 34),
      goalEvent('r32-3', 'gha', 'Mohammed Kudus', 'محمد كودوس', 62),
      goalEvent('r32-3', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 79),
    ],
    statistics: defaultStats(3, 1), man_of_the_match: 'p-mbappe',
  },
  { id: 'r32-4', fixture_id: 'kr4', home_team_id: 'rsa', away_team_id: 'bel',
    home_score: 0, away_score: 2, status: 'FT', date: iso(-5, 21),
    round: 'R32', stage_order: 2, stadium_id: 'sofi',
    referee: 'Michael Oliver', winner_id: 'bel', loser_id: 'rsa', next_match_id: 'r16-2', bracket_position: 4,
    events: [
      goalEvent('r32-4', 'bel', 'p-lukaku', 'Romelu Lukaku', 'روميلو لوكاكو', 44),
      goalEvent('r32-4', 'bel', 'p-debruyne', 'Kevin De Bruyne', 'كيفين دي بروين', 81),
    ],
    statistics: defaultStats(0, 2), man_of_the_match: 'p-debruyne',
  },
  { id: 'r32-5', fixture_id: 'kr5', home_team_id: 'esp', away_team_id: 'ecu',
    home_score: 2, away_score: 0, status: 'FT', date: iso(-4, 18),
    round: 'R32', stage_order: 2, stadium_id: 'mercedes',
    referee: 'Felix Zwayer', winner_id: 'esp', loser_id: 'ecu', next_match_id: 'r16-3', bracket_position: 5,
    events: [
      goalEvent('r32-5', 'esp', 'p-yamal', 'Lamine Yamal', 'لامين يامال', 23),
      goalEvent('r32-5', 'esp', 'p-olmo', 'Dani Olmo', 'داني أولمو', 67),
    ],
    statistics: defaultStats(2, 0), man_of_the_match: 'p-yamal',
  },
  { id: 'r32-6', fixture_id: 'kr6', home_team_id: 'civ', away_team_id: 'ita',
    home_score: 1, away_score: 2, status: 'FT', date: iso(-4, 21),
    round: 'R32', stage_order: 2, stadium_id: 'levis',
    referee: 'Jesús Gil Manzano', winner_id: 'ita', loser_id: 'civ', next_match_id: 'r16-3', bracket_position: 6,
    events: [
      goalEvent('r32-6', 'civ', 'Sébastien Haller', 'سيباستيان هالر', 28),
      goalEvent('r32-6', 'ita', 'p-chiesa', 'Federico Chiesa', 'فيديريكو كييزا', 53),
      goalEvent('r32-6', 'ita', 'p-barella', 'Nicolò Barella', 'نيكولو باريللا', 88),
    ],
    statistics: defaultStats(1, 2), man_of_the_match: 'p-barella',
  },
  { id: 'r32-7', fixture_id: 'kr7', home_team_id: 'bra', away_team_id: 'par',
    home_score: 3, away_score: 0, status: 'FT', date: iso(-4, 18),
    round: 'R32', stage_order: 2, stadium_id: 'arrowhead',
    referee: 'Clément Turpin', winner_id: 'bra', loser_id: 'par', next_match_id: 'r16-4', bracket_position: 7,
    events: [
      goalEvent('r32-7', 'bra', 'p-vini', 'Vinícius Júnior', 'فينيسيوس جونيور', 19),
      goalEvent('r32-7', 'bra', 'p-neymar', 'Neymar Jr', 'نيمار جونيور', 56),
      goalEvent('r32-7', 'bra', 'p-rodrigo', 'Rodrygo', 'رودريغو', 78),
    ],
    statistics: defaultStats(3, 0), man_of_the_match: 'p-vini',
  },
  { id: 'r32-8', fixture_id: 'kr8', home_team_id: 'hon', away_team_id: 'uru',
    home_score: 0, away_score: 2, status: 'FT', date: iso(-4, 21),
    round: 'R32', stage_order: 2, stadium_id: 'lincoln',
    referee: 'Slavko Vinčić', winner_id: 'uru', loser_id: 'hon', next_match_id: 'r16-4', bracket_position: 8,
    events: [
      goalEvent('r32-8', 'uru', 'Facundo Pellistri', 'فاكوندو بيليستري', 34),
      goalEvent('r32-8', 'uru', 'Darwin Núñez', 'داروين نونيز', 71),
    ],
    statistics: defaultStats(0, 2), man_of_the_match: 'p-kramaric',
  },
  // Bottom half (right side of bracket — feeds into SF2)
  { id: 'r32-9', fixture_id: 'kr9', home_team_id: 'eng', away_team_id: 'irq',
    home_score: 4, away_score: 0, status: 'FT', date: iso(-5, 18),
    round: 'R32', stage_order: 2, stadium_id: 'gillette',
    referee: 'Szymon Marciniak', winner_id: 'eng', loser_id: 'irq', next_match_id: 'r16-5', bracket_position: 9,
    events: [
      goalEvent('r32-9', 'eng', 'p-kane', 'Harry Kane', 'هاري كين', 12),
      goalEvent('r32-9', 'eng', 'p-bellingham', 'Jude Bellingham', 'جود بيلينغهام', 28),
      goalEvent('r32-9', 'eng', 'p-saka', 'Bukayo Saka', 'بوكايو ساكا', 56),
      goalEvent('r32-9', 'eng', 'p-foden', 'Phil Foden', 'فيل فودين', 78),
    ],
    statistics: defaultStats(4, 0), man_of_the_match: 'p-bellingham',
  },
  { id: 'r32-10', fixture_id: 'kr10', home_team_id: 'sen', away_team_id: 'ger',
    home_score: 1, away_score: 2, status: 'FT', date: iso(-5, 21),
    round: 'R32', stage_order: 2, stadium_id: 'nrg',
    referee: 'Anthony Taylor', winner_id: 'ger', loser_id: 'sen', next_match_id: 'r16-5', bracket_position: 10,
    events: [
      goalEvent('r32-10', 'ger', 'p-musiala', 'Jamal Musiala', 'جمال موسيالا', 19),
      goalEvent('r32-10', 'sen', 'Sadio Mané', 'ساديو ماني', 53, 'Penalty'),
      goalEvent('r32-10', 'ger', 'p-wirtz', 'Florian Wirtz', 'فلوريان فيرتز', 84),
    ],
    statistics: defaultStats(1, 2), man_of_the_match: 'p-musiala',
  },
  { id: 'r32-11', fixture_id: 'kr11', home_team_id: 'por', away_team_id: 'mli',
    home_score: 2, away_score: 0, status: 'FT', date: iso(-5, 18),
    round: 'R32', stage_order: 2, stadium_id: 'lumen',
    referee: 'Daniele Orsato', winner_id: 'por', loser_id: 'mli', next_match_id: 'r16-6', bracket_position: 11,
    events: [
      goalEvent('r32-11', 'por', 'p-ronaldo', 'Cristiano Ronaldo', 'كريستيانو رونالدو', 33, 'Penalty'),
      goalEvent('r32-11', 'por', 'p-leao', 'Rafael Leão', 'رافائيل لياو', 78),
    ],
    statistics: defaultStats(2, 0), man_of_the_match: 'p-ronaldo',
  },
  { id: 'r32-12', fixture_id: 'kr12', home_team_id: 'nor', away_team_id: 'sui',
    home_score: 3, away_score: 1, status: 'FT', date: iso(-5, 21),
    round: 'R32', stage_order: 2, stadium_id: 'azteca',
    referee: 'Michael Oliver', winner_id: 'nor', loser_id: 'sui', next_match_id: 'r16-6', bracket_position: 12,
    events: [
      goalEvent('r32-12', 'nor', 'p-haaland', 'Erling Haaland', 'إيرلينغ هالاند', 14),
      goalEvent('r32-12', 'nor', 'p-haaland', 'Erling Haaland', 'إيرلينغ هالاند', 49),
      goalEvent('r32-12', 'sui', 'Breel Embolo', 'بريل إمبولو', 67),
      goalEvent('r32-12', 'nor', 'p-odegaard', 'Martin Ødegaard', 'مارتن أوديغارد', 82),
    ],
    statistics: defaultStats(3, 1), man_of_the_match: 'p-haaland',
  },
  { id: 'r32-13', fixture_id: 'kr13', home_team_id: 'mex', away_team_id: 'cro',
    home_score: 1, away_score: 1, status: 'PEN', date: iso(-4, 18),
    round: 'R32', stage_order: 2, stadium_id: 'akron',
    referee: 'Felix Zwayer', winner_id: 'mex', loser_id: 'cro', next_match_id: 'r16-7', bracket_position: 13,
    events: [
      goalEvent('r32-13', 'mex', 'p-lozano', 'Hirving Lozano', 'هيرفينغ لوزانو', 38),
      goalEvent('r32-13', 'cro', 'p-kramaric', 'Andrej Kramarić', 'أندريه كراماريتش', 71),
    ],
    statistics: defaultStats(1, 1), man_of_the_match: 'p-lozano',
  },
  { id: 'r32-14', fixture_id: 'kr14', home_team_id: 'can', away_team_id: 'jpn',
    home_score: 0, away_score: 2, status: 'FT', date: iso(-4, 21),
    round: 'R32', stage_order: 2, stadium_id: 'bmo',
    referee: 'Jesús Gil Manzano', winner_id: 'jpn', loser_id: 'can', next_match_id: 'r16-7', bracket_position: 14,
    events: [
      goalEvent('r32-14', 'jpn', 'p-kubo', 'Takefusa Kubo', 'تاكيفوسا كوبو', 28),
      goalEvent('r32-14', 'jpn', 'p-mitoma', 'Kaoru Mitoma', 'كاورو ميتوما', 67),
    ],
    statistics: defaultStats(0, 2), man_of_the_match: 'p-kubo',
  },
  { id: 'r32-15', fixture_id: 'kr15', home_team_id: 'mar', away_team_id: 'pan',
    home_score: 2, away_score: 0, status: 'FT', date: iso(-4, 18),
    round: 'R32', stage_order: 2, stadium_id: 'bbva',
    referee: 'Clément Turpin', winner_id: 'mar', loser_id: 'pan', next_match_id: 'r16-8', bracket_position: 15,
    events: [
      goalEvent('r32-15', 'mar', 'p-ennesyri', 'Youssef En-Nesyri', 'يوسف النصيري', 22),
      goalEvent('r32-15', 'mar', 'p-ziyech', 'Hakim Ziyech', 'حكيم زياش', 71),
    ],
    statistics: defaultStats(2, 0), man_of_the_match: 'p-ziyech',
  },
  // LIVE R32 match
  { id: 'r32-16', fixture_id: 'kr16', home_team_id: 'usa', away_team_id: 'sau',
    home_score: 1, away_score: 1, status: 'LIVE', date: iso(0, 21),
    round: 'R32', stage_order: 2, stadium_id: 'metlife',
    referee: 'Slavko Vinčić', minute: 73, next_match_id: 'r16-8', bracket_position: 16,
    events: [
      goalEvent('r32-16', 'usa', 'p-pulisic', 'Christian Pulisic', 'كريستيان بوليسيتش', 28),
      goalEvent('r32-16', 'sau', 'p-salem', 'Salem Al-Dawsari', 'سالم الدوسري', 61),
      cardEvent('r32-16', 'sau', 'p-ambri', 'Ali Al-Bulaihi', 'علي البليهي', 44, 'Yellow'),
    ],
    statistics: defaultStats(1, 1),
  },
];

// Round of 16 — 8 matches
export const R16_MATCHES: Match[] = [
  // Top half → SF1
  { id: 'r16-1', fixture_id: 'kr1', home_team_id: 'arg', away_team_id: 'ned',
    home_score: 2, away_score: 1, status: 'FT', date: iso(-2, 21),
    round: 'R16', stage_order: 3, stadium_id: 'metlife',
    referee: 'Szymon Marciniak', winner_id: 'arg', loser_id: 'ned', next_match_id: 'qf-1', bracket_position: 1,
    events: [
      goalEvent('r16-1', 'arg', 'p-messi', 'Lionel Messi', 'ليونيل ميسي', 23),
      goalEvent('r16-1', 'ned', 'p-gakpo', 'Cody Gakpo', 'كودي خاكبو', 56),
      goalEvent('r16-1', 'arg', 'p-julian', 'Julián Álvarez', 'خوليان ألفاريز', 88),
    ],
    statistics: defaultStats(2, 1), man_of_the_match: 'p-messi',
  },
  { id: 'r16-2', fixture_id: 'kr2', home_team_id: 'fra', away_team_id: 'bel',
    home_score: 3, away_score: 1, status: 'FT', date: iso(-2, 18),
    round: 'R16', stage_order: 3, stadium_id: 'att',
    referee: 'Anthony Taylor', winner_id: 'fra', loser_id: 'bel', next_match_id: 'qf-1', bracket_position: 2,
    events: [
      goalEvent('r16-2', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 11),
      goalEvent('r16-2', 'fra', 'p-griezmann', 'Antoine Griezmann', 'أنطوان غريزمان', 34),
      goalEvent('r16-2', 'bel', 'p-lukaku', 'Romelu Lukaku', 'روميلو لوكاكو', 62),
      goalEvent('r16-2', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 79),
    ],
    statistics: defaultStats(3, 1), man_of_the_match: 'p-mbappe',
  },
  { id: 'r16-3', fixture_id: 'kr3', home_team_id: 'esp', away_team_id: 'ita',
    home_score: 2, away_score: 1, status: 'FT', date: iso(-1, 21),
    round: 'R16', stage_order: 3, stadium_id: 'hardrock',
    referee: 'Daniele Orsato', winner_id: 'esp', loser_id: 'ita', next_match_id: 'qf-2', bracket_position: 3,
    events: [
      goalEvent('r16-3', 'esp', 'p-yamal', 'Lamine Yamal', 'لامين يامال', 31),
      goalEvent('r16-3', 'ita', 'p-chiesa', 'Federico Chiesa', 'فيديريكو كييزا', 56),
      goalEvent('r16-3', 'esp', 'p-olmo', 'Dani Olmo', 'داني أولمو', 88),
    ],
    statistics: defaultStats(2, 1), man_of_the_match: 'p-yamal',
  },
  { id: 'r16-4', fixture_id: 'kr4', home_team_id: 'bra', away_team_id: 'uru',
    home_score: 2, away_score: 0, status: 'FT', date: iso(-1, 18),
    round: 'R16', stage_order: 3, stadium_id: 'sofi',
    referee: 'Michael Oliver', winner_id: 'bra', loser_id: 'uru', next_match_id: 'qf-2', bracket_position: 4,
    events: [
      goalEvent('r16-4', 'bra', 'p-vini', 'Vinícius Júnior', 'فينيسيوس جونيور', 31),
      goalEvent('r16-4', 'bra', 'p-rodrigo', 'Rodrygo', 'رودريغو', 73),
    ],
    statistics: defaultStats(2, 0), man_of_the_match: 'p-vini',
  },
  // Bottom half → SF2
  { id: 'r16-5', fixture_id: 'kr5', home_team_id: 'eng', away_team_id: 'ger',
    home_score: 2, away_score: 1, status: 'FT', date: iso(-1, 21),
    round: 'R16', stage_order: 3, stadium_id: 'mercedes',
    referee: 'Felix Zwayer', winner_id: 'eng', loser_id: 'ger', next_match_id: 'qf-3', bracket_position: 5,
    events: [
      goalEvent('r16-5', 'ger', 'p-musiala', 'Jamal Musiala', 'جمال موسيالا', 18),
      goalEvent('r16-5', 'eng', 'p-kane', 'Harry Kane', 'هاري كين', 44, 'Penalty'),
      goalEvent('r16-5', 'eng', 'p-bellingham', 'Jude Bellingham', 'جود بيلينغهام', 91),
    ],
    statistics: defaultStats(2, 1), man_of_the_match: 'p-bellingham',
  },
  { id: 'r16-6', fixture_id: 'kr6', home_team_id: 'por', away_team_id: 'nor',
    home_score: 1, away_score: 2, status: 'FT', date: iso(-1, 18),
    round: 'R16', stage_order: 3, stadium_id: 'levis',
    referee: 'Jesús Gil Manzano', winner_id: 'nor', loser_id: 'por', next_match_id: 'qf-3', bracket_position: 6,
    events: [
      goalEvent('r16-6', 'por', 'p-ronaldo', 'Cristiano Ronaldo', 'كريستيانو رونالدو', 27, 'Penalty'),
      goalEvent('r16-6', 'nor', 'p-haaland', 'Erling Haaland', 'إيرلينغ هالاند', 53),
      goalEvent('r16-6', 'nor', 'p-odegaard', 'Martin Ødegaard', 'مارتن أوديغارد', 78),
    ],
    statistics: defaultStats(1, 2), man_of_the_match: 'p-haaland',
  },
  { id: 'r16-7', fixture_id: 'kr7', home_team_id: 'mex', away_team_id: 'jpn',
    home_score: 1, away_score: 2, status: 'FT', date: iso(0, 21),
    round: 'R16', stage_order: 3, stadium_id: 'azteca',
    referee: 'Clément Turpin', winner_id: 'jpn', loser_id: 'mex', next_match_id: 'qf-4', bracket_position: 7,
    events: [
      goalEvent('r16-7', 'mex', 'p-jimenez', 'Santiago Giménez', 'سانتياغو خيمينيز', 36),
      goalEvent('r16-7', 'jpn', 'p-kubo', 'Takefusa Kubo', 'تاكيفوسا كوبو', 61),
      goalEvent('r16-7', 'jpn', 'p-mitoma', 'Kaoru Mitoma', 'كاورو ميتوما', 89),
    ],
    statistics: defaultStats(1, 2), man_of_the_match: 'p-kubo',
  },
  // QF-4 is awaiting — depends on r16-7 (Japan, done) and r16-8 (USA vs Saudi — LIVE)
  { id: 'r16-8', fixture_id: 'kr8', home_team_id: 'mar', away_team_id: '',
    home_score: null, away_score: null, status: 'NS', date: iso(1, 18),
    round: 'R16', stage_order: 3, stadium_id: 'bbva',
    referee: 'Slavko Vinčić', next_match_id: 'qf-4', bracket_position: 8,
  },
];

// Quarter Finals — 4 matches
export const QF_MATCHES: Match[] = [
  { id: 'qf-1', fixture_id: 'q1', home_team_id: 'arg', away_team_id: 'fra',
    home_score: 2, away_score: 1, status: 'FT', date: iso(2, 21),
    round: 'QF', stage_order: 4, stadium_id: 'metlife',
    referee: 'Szymon Marciniak', winner_id: 'arg', loser_id: 'fra', next_match_id: 'sf-1', bracket_position: 1,
    events: [
      goalEvent('qf-1', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 14),
      goalEvent('qf-1', 'arg', 'p-messi', 'Lionel Messi', 'ليونيل ميسي', 38, 'Penalty'),
      goalEvent('qf-1', 'arg', 'p-julian', 'Julián Álvarez', 'خوليان ألفاريز', 71),
    ],
    statistics: defaultStats(2, 1), man_of_the_match: 'p-messi',
  },
  { id: 'qf-2', fixture_id: 'q2', home_team_id: 'esp', away_team_id: 'bra',
    home_score: 2, away_score: 2, status: 'PEN', date: iso(2, 18),
    round: 'QF', stage_order: 4, stadium_id: 'hardrock',
    referee: 'Daniele Orsato', winner_id: 'esp', loser_id: 'bra', next_match_id: 'sf-1', bracket_position: 2,
    events: [
      goalEvent('qf-2', 'esp', 'p-yamal', 'Lamine Yamal', 'لامين يامال', 19),
      goalEvent('qf-2', 'bra', 'p-vini', 'Vinícius Júnior', 'فينيسيوس جونيور', 33),
      goalEvent('qf-2', 'esp', 'p-olmo', 'Dani Olmo', 'داني أولمو', 67),
      goalEvent('qf-2', 'bra', 'p-rodrigo', 'Rodrygo', 'رودريغو', 82),
    ],
    statistics: defaultStats(2, 2), man_of_the_match: 'p-yamal',
  },
  { id: 'qf-3', fixture_id: 'q3', home_team_id: 'eng', away_team_id: 'nor',
    home_score: 1, away_score: 0, status: 'FT', date: iso(3, 21),
    round: 'QF', stage_order: 4, stadium_id: 'mercedes',
    referee: 'Felix Zwayer', winner_id: 'eng', loser_id: 'nor', next_match_id: 'sf-2', bracket_position: 3,
    events: [
      goalEvent('qf-3', 'eng', 'p-bellingham', 'Jude Bellingham', 'جود بيلينغهام', 56),
    ],
    statistics: defaultStats(1, 0), man_of_the_match: 'p-bellingham',
  },
  // QF-4 awaiting — Japan vs winner of r16-8
  { id: 'qf-4', fixture_id: 'q4', home_team_id: 'jpn', away_team_id: '',
    home_score: null, away_score: null, status: 'NS', date: iso(3, 18),
    round: 'QF', stage_order: 4, stadium_id: 'levis',
    referee: 'Jesús Gil Manzano', next_match_id: 'sf-2', bracket_position: 4,
  },
];

// Semi Finals — 2 matches
export const SF_MATCHES: Match[] = [
  { id: 'sf-1', fixture_id: 's1', home_team_id: 'arg', away_team_id: 'esp',
    home_score: 2, away_score: 1, status: 'FT', date: iso(5, 21),
    round: 'SF', stage_order: 5, stadium_id: 'metlife',
    referee: 'Szymon Marciniak', winner_id: 'arg', loser_id: 'esp', next_match_id: 'final', bracket_position: 1,
    events: [
      goalEvent('sf-1', 'esp', 'p-yamal', 'Lamine Yamal', 'لامين يامال', 22),
      goalEvent('sf-1', 'arg', 'p-messi', 'Lionel Messi', 'ليونيل ميسي', 45, 'Penalty'),
      goalEvent('sf-1', 'arg', 'p-julian', 'Julián Álvarez', 'خوليان ألفاريز', 79),
    ],
    statistics: defaultStats(2, 1), man_of_the_match: 'p-messi',
  },
  // SF-2 awaiting — England vs winner of qf-4
  { id: 'sf-2', fixture_id: 's2', home_team_id: 'eng', away_team_id: '',
    home_score: null, away_score: null, status: 'NS', date: iso(5, 18),
    round: 'SF', stage_order: 5, stadium_id: 'mercedes',
    referee: 'Felix Zwayer', next_match_id: 'final', bracket_position: 2,
  },
];

// Final + Third place
export const FINAL_MATCHES: Match[] = [
  // 3rd place (losers of SF1 and SF2)
  { id: 'third', fixture_id: 'tp', home_team_id: 'esp', away_team_id: '',
    home_score: null, away_score: null, status: 'NS', date: iso(7, 18),
    round: 'THIRD', stage_order: 6, stadium_id: 'hardrock',
    referee: 'Daniele Orsato', bracket_position: 1,
  },
  // Final (winners of SF1 and SF2)
  { id: 'final', fixture_id: 'fl', home_team_id: 'arg', away_team_id: '',
    home_score: null, away_score: null, status: 'NS', date: iso(8, 21),
    round: 'FINAL', stage_order: 6, stadium_id: 'metlife',
    referee: 'Szymon Marciniak', bracket_position: 2,
  },
];

// All matches combined
export const ALL_MATCHES: Match[] = [
  ...GROUP_MATCHES,
  ...R32_MATCHES,
  ...R16_MATCHES,
  ...QF_MATCHES,
  ...SF_MATCHES,
  ...FINAL_MATCHES,
];

// Index lookups
export const TEAM_BY_ID: Record<string, Team> = TEAMS.reduce((acc, t) => { acc[t.id] = t; return acc; }, {} as Record<string, Team>);
export const PLAYER_BY_ID: Record<string, Player> = PLAYERS.reduce((acc, p) => { acc[p.id] = p; return acc; }, {} as Record<string, Player>);
export const MATCH_BY_ID: Record<string, Match> = ALL_MATCHES.reduce((acc, m) => { acc[m.id] = m; return acc; }, {} as Record<string, Match>);
export const TEAMS_BY_GROUP: Record<string, Team[]> = TEAMS.reduce((acc, t) => {
  if (!acc[t.group]) acc[t.group] = [];
  acc[t.group].push(t);
  return acc;
}, {} as Record<string, Team[]>);
