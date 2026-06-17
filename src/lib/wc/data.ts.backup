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
  // After Matchday 1 only (1 match per player)
  { player_id: 'p-haaland', goals: 4, assists: 0, team_id: 'nor', penalties: 1, matches_played: 1 },
  { player_id: 'p-mbappe', goals: 3, assists: 0, team_id: 'fra', penalties: 1, matches_played: 1 },
  { player_id: 'p-messi', goals: 2, assists: 0, team_id: 'arg', penalties: 1, matches_played: 1 },
  { player_id: 'p-yamal', goals: 2, assists: 0, team_id: 'esp', penalties: 0, matches_played: 1 },
  { player_id: 'p-vini', goals: 1, assists: 0, team_id: 'bra', penalties: 0, matches_played: 1 },
  { player_id: 'p-rodrigo', goals: 1, assists: 0, team_id: 'bra', penalties: 0, matches_played: 1 },
  { player_id: 'p-bellingham', goals: 1, assists: 0, team_id: 'eng', penalties: 0, matches_played: 1 },
  { player_id: 'p-kane', goals: 1, assists: 0, team_id: 'eng', penalties: 1, matches_played: 1 },
  { player_id: 'p-saka', goals: 1, assists: 0, team_id: 'eng', penalties: 0, matches_played: 1 },
  { player_id: 'p-ronaldo', goals: 1, assists: 0, team_id: 'por', penalties: 1, matches_played: 1 },
  { player_id: 'p-leao', goals: 1, assists: 0, team_id: 'por', penalties: 0, matches_played: 1 },
  { player_id: 'p-olmo', goals: 1, assists: 0, team_id: 'esp', penalties: 0, matches_played: 1 },
  { player_id: 'p-julian', goals: 1, assists: 0, team_id: 'arg', penalties: 0, matches_played: 1 },
  { player_id: 'p-ennesyri', goals: 1, assists: 0, team_id: 'mar', penalties: 0, matches_played: 1 },
  { player_id: 'p-hakimi', goals: 1, assists: 0, team_id: 'mar', penalties: 0, matches_played: 1 },
  { player_id: 'p-odegaard', goals: 1, assists: 0, team_id: 'nor', penalties: 0, matches_played: 1 },
  { player_id: 'p-griezmann', goals: 1, assists: 0, team_id: 'fra', penalties: 0, matches_played: 1 },
  { player_id: 'p-salem', goals: 1, assists: 0, team_id: 'sau', penalties: 1, matches_played: 1 },
];

export const TOP_ASSISTS: TopAssistRow[] = [
  // After Matchday 1 — most players have 0 assists; show top performers
  { player_id: 'p-depaul', assists: 1, goals: 0, team_id: 'arg', matches_played: 1 },
  { player_id: 'p-pedri', assists: 1, goals: 0, team_id: 'esp', matches_played: 1 },
  { player_id: 'p-bruno', assists: 1, goals: 0, team_id: 'por', matches_played: 1 },
  { player_id: 'p-foden', assists: 1, goals: 0, team_id: 'eng', matches_played: 1 },
  { player_id: 'p-simons', assists: 1, goals: 0, team_id: 'ned', matches_played: 1 },
  { player_id: 'p-wirtz', assists: 1, goals: 0, team_id: 'ger', matches_played: 1 },
];

// ============================================================
// STANDINGS — Group stage results (1 match per team, Matchday 1 only)
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
  // After Matchday 1 only (1 match per team)
  ...makeStandings('A', [
    ['mex', 1, 1, 0, 0, 2, 0],
    ['usa', 1, 0, 1, 0, 1, 1],
    ['can', 1, 0, 1, 0, 1, 1],
    ['crc', 1, 0, 0, 1, 0, 2],
  ]),
  ...makeStandings('B', [
    ['ger', 1, 1, 0, 0, 2, 1],
    ['ned', 1, 1, 0, 0, 3, 0],
    ['jpn', 1, 0, 0, 1, 1, 2],
    ['aus', 1, 0, 0, 1, 0, 3],
  ]),
  ...makeStandings('C', [
    ['arg', 1, 1, 0, 0, 3, 0],
    ['sen', 1, 0, 1, 0, 1, 1],
    ['sui', 1, 0, 1, 0, 1, 1],
    ['irq', 1, 0, 0, 1, 0, 3],
  ]),
  ...makeStandings('D', [
    ['fra', 1, 1, 0, 0, 4, 1],
    ['mar', 1, 1, 0, 0, 2, 1],
    ['bel', 1, 0, 0, 1, 1, 2],
    ['kor', 1, 0, 0, 1, 1, 4],
  ]),
  ...makeStandings('E', [
    ['bra', 1, 1, 0, 0, 2, 0],
    ['ngr', 1, 0, 1, 0, 1, 1],
    ['col', 1, 0, 1, 0, 1, 1],
    ['tun', 1, 0, 0, 1, 0, 2],
  ]),
  ...makeStandings('F', [
    ['esp', 1, 1, 0, 0, 3, 0],
    ['cro', 1, 1, 0, 0, 1, 0],
    ['ecu', 1, 0, 0, 1, 0, 1],
    ['civ', 1, 0, 0, 1, 0, 3],
  ]),
  ...makeStandings('G', [
    ['eng', 1, 1, 0, 0, 3, 1],
    ['por', 1, 1, 0, 0, 2, 1],
    ['par', 1, 0, 0, 1, 1, 2],
    ['irn', 1, 0, 0, 1, 1, 3],
  ]),
  ...makeStandings('H', [
    ['ita', 1, 1, 0, 0, 2, 0],
    ['uru', 1, 1, 0, 0, 1, 0],
    ['gha', 1, 0, 0, 1, 0, 2],
    ['rsa', 1, 0, 0, 1, 0, 1],
  ]),
  ...makeStandings('I', [
    ['ukr', 1, 1, 0, 0, 2, 0],
    ['sau', 1, 0, 1, 0, 1, 1],
    ['per', 1, 0, 1, 0, 1, 1],
    ['uzb', 1, 0, 0, 1, 0, 2],
  ]),
  ...makeStandings('J', [
    ['nor', 1, 1, 0, 0, 5, 0],
    ['aut', 1, 1, 0, 0, 2, 1],
    ['swe', 1, 0, 0, 1, 1, 2],
    ['blr', 1, 0, 0, 1, 0, 5],
  ]),
  ...makeStandings('K', [
    ['tur', 1, 1, 0, 0, 3, 0],
    ['den', 1, 0, 1, 0, 1, 1],
    ['mli', 1, 0, 1, 0, 1, 1],
    ['hon', 1, 0, 0, 1, 0, 3],
  ]),
  ...makeStandings('L', [
    ['pol', 1, 1, 0, 0, 2, 0],
    ['wal', 1, 0, 1, 0, 1, 1],
    ['cmr', 1, 0, 1, 0, 1, 1],
    ['pan', 1, 0, 0, 1, 0, 2],
  ]),
];

// ============================================================
// MATCHES — REALISTIC World Cup 2026 schedule
// ============================================================
// WC 2026 tournament dates: June 11 – July 19, 2026
// We are at: June 17, 2026 → first week of group stage
// Most matches are NS (not started), a few are FT (finished)
// NO LIVE matches in this snapshot — the real API will provide LIVE
// ============================================================

// Tournament started June 11, 2026. "Now" is June 17, 2026.
const now = new Date('2026-06-17T12:00:00Z');
function iso(date: string, hourUtc = 18, minuteUtc = 0): string {
  // date format: 'YYYY-MM-DD'
  const d = new Date(`${date}T${String(hourUtc).padStart(2, '0')}:${String(minuteUtc).padStart(2, '0')}:00Z`);
  if (isNaN(d.getTime())) {
    // Fallback: parse as year-month-day with day overflow handling
    const [y, m, day] = date.split('-').map(Number);
    const fixed = new Date(Date.UTC(y, m - 1, day, hourUtc, minuteUtc, 0));
    return fixed.toISOString();
  }
  return d.toISOString();
}

function goalEvent(matchId: string, teamId: string, playerId: string, playerName: string, playerNameAr: string, minute: number, detail?: string): MatchEvent {
  return { id: `${matchId}-g-${minute}-${playerId}`, match_id: matchId, team_id: teamId, type: 'goal', player: playerName, player_ar: playerNameAr, minute, detail };
}
function cardEvent(matchId: string, teamId: string, playerId: string, playerName: string, playerNameAr: string, minute: number, color: 'Yellow' | 'Red'): MatchEvent {
  return { id: `${matchId}-c-${minute}-${playerId}`, match_id: matchId, team_id: teamId, type: 'card', player: playerName, player_ar: playerNameAr, minute, detail: color };
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
// GROUP STAGE MATCHES (104 total in WC 2026)
// We model a realistic subset: matches from June 11-17 (FT) + June 17-27 (NS)
// NO LIVE matches — sync from API-Football will provide LIVE status
// ============================================================
export const GROUP_MATCHES: Match[] = [
  // ===== Matchday 1 (June 11-13, 2026) — FINISHED =====
  // Group A
  { id: 'g1', fixture_id: 'wc26-1', home_team_id: 'mex', away_team_id: 'crc',
    home_score: 2, away_score: 0, status: 'FT', date: iso('2026-06-11', 23),
    round: 'group', stage_order: 1, group: 'A', stadium_id: 'azteca',
    referee: 'Szymon Marciniak', winner_id: 'mex', loser_id: 'crc' },
  { id: 'g2', fixture_id: 'wc26-2', home_team_id: 'can', away_team_id: 'usa',
    home_score: 1, away_score: 1, status: 'FT', date: iso('2026-06-12', 23),
    round: 'group', stage_order: 1, group: 'A', stadium_id: 'bmo',
    referee: 'Anthony Taylor' },
  // Group B
  { id: 'g3', fixture_id: 'wc26-3', home_team_id: 'ned', away_team_id: 'aus',
    home_score: 3, away_score: 0, status: 'FT', date: iso('2026-06-12', 18),
    round: 'group', stage_order: 1, group: 'B', stadium_id: 'lincoln',
    referee: 'Daniele Orsato', winner_id: 'ned', loser_id: 'aus' },
  { id: 'g4', fixture_id: 'wc26-4', home_team_id: 'ger', away_team_id: 'jpn',
    home_score: 2, away_score: 1, status: 'FT', date: iso('2026-06-13', 18),
    round: 'group', stage_order: 1, group: 'B', stadium_id: 'att',
    referee: 'Michael Oliver', winner_id: 'ger', loser_id: 'jpn' },
  // Group C
  { id: 'g5', fixture_id: 'wc26-5', home_team_id: 'arg', away_team_id: 'irq',
    home_score: 3, away_score: 0, status: 'FT', date: iso('2026-06-13', 21),
    round: 'group', stage_order: 1, group: 'C', stadium_id: 'metlife',
    referee: 'Szymon Marciniak', winner_id: 'arg', loser_id: 'irq',
    events: [
      goalEvent('g5', 'arg', 'p-messi', 'Lionel Messi', 'ليونيل ميسي', 12),
      goalEvent('g5', 'arg', 'p-julian', 'Julián Álvarez', 'خوليان ألفاريز', 34),
      goalEvent('g5', 'arg', 'p-messi', 'Lionel Messi', 'ليونيل ميسي', 67, 'Penalty'),
    ],
    statistics: defaultStats(3, 0), man_of_the_match: 'p-messi' },
  { id: 'g6', fixture_id: 'wc26-6', home_team_id: 'sen', away_team_id: 'sui',
    home_score: 1, away_score: 1, status: 'FT', date: iso('2026-06-13', 21),
    round: 'group', stage_order: 1, group: 'C', stadium_id: 'hardrock',
    referee: 'Clément Turpin' },
  // Group D
  { id: 'g7', fixture_id: 'wc26-7', home_team_id: 'fra', away_team_id: 'kor',
    home_score: 4, away_score: 1, status: 'FT', date: iso('2026-06-12', 21),
    round: 'group', stage_order: 1, group: 'D', stadium_id: 'att',
    referee: 'Anthony Taylor', winner_id: 'fra', loser_id: 'kor',
    events: [
      goalEvent('g7', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 8),
      goalEvent('g7', 'fra', 'p-griezmann', 'Antoine Griezmann', 'أنطوان غريزمان', 28),
      goalEvent('g7', 'kor', 'p-son', 'Son Heung-min', 'سون هيونغ مين', 55),
      goalEvent('g7', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 71, 'Penalty'),
      goalEvent('g7', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 88),
    ],
    statistics: defaultStats(4, 1), man_of_the_match: 'p-mbappe' },
  { id: 'g8', fixture_id: 'wc26-8', home_team_id: 'mar', away_team_id: 'bel',
    home_score: 2, away_score: 1, status: 'FT', date: iso('2026-06-13', 18),
    round: 'group', stage_order: 1, group: 'D', stadium_id: 'lincoln',
    referee: 'Felix Zwayer', winner_id: 'mar', loser_id: 'bel',
    events: [
      goalEvent('g8', 'mar', 'p-ennesyri', 'Youssef En-Nesyri', 'يوسف النصيري', 22),
      goalEvent('g8', 'bel', 'p-lukaku', 'Romelu Lukaku', 'روميلو لوكاكو', 56),
      goalEvent('g8', 'mar', 'p-hakimi', 'Achraf Hakimi', 'أشرف حكيمي', 81),
    ],
    statistics: defaultStats(2, 1), man_of_the_match: 'p-hakimi' },
  // Group E
  { id: 'g9', fixture_id: 'wc26-9', home_team_id: 'bra', away_team_id: 'tun',
    home_score: 2, away_score: 0, status: 'FT', date: iso('2026-06-12', 18),
    round: 'group', stage_order: 1, group: 'E', stadium_id: 'sofi',
    referee: 'Michael Oliver', winner_id: 'bra', loser_id: 'tun',
    events: [
      goalEvent('g9', 'bra', 'p-vini', 'Vinícius Júnior', 'فينيسيوس جونيور', 31),
      goalEvent('g9', 'bra', 'p-rodrigo', 'Rodrygo', 'رودريغو', 73),
    ],
    statistics: defaultStats(2, 0), man_of_the_match: 'p-vini' },
  { id: 'g10', fixture_id: 'wc26-10', home_team_id: 'ngr', away_team_id: 'col',
    home_score: 1, away_score: 1, status: 'FT', date: iso('2026-06-13', 21),
    round: 'group', stage_order: 1, group: 'E', stadium_id: 'arrowhead',
    referee: 'Jesús Gil Manzano' },
  // Group F
  { id: 'g11', fixture_id: 'wc26-11', home_team_id: 'esp', away_team_id: 'civ',
    home_score: 3, away_score: 0, status: 'FT', date: iso('2026-06-13', 18),
    round: 'group', stage_order: 1, group: 'F', stadium_id: 'hardrock',
    referee: 'Daniele Orsato', winner_id: 'esp', loser_id: 'civ',
    events: [
      goalEvent('g11', 'esp', 'p-yamal', 'Lamine Yamal', 'لامين يامال', 23),
      goalEvent('g11', 'esp', 'p-olmo', 'Dani Olmo', 'داني أولمو', 56),
      goalEvent('g11', 'esp', 'p-yamal', 'Lamine Yamal', 'لامين يامال', 78),
    ],
    statistics: defaultStats(3, 0), man_of_the_match: 'p-yamal' },
  { id: 'g12', fixture_id: 'wc26-12', home_team_id: 'cro', away_team_id: 'ecu',
    home_score: 1, away_score: 0, status: 'FT', date: iso('2026-06-14', 18),
    round: 'group', stage_order: 1, group: 'F', stadium_id: 'gillette',
    referee: 'Slavko Vinčić', winner_id: 'cro', loser_id: 'ecu' },
  // Group G
  { id: 'g13', fixture_id: 'wc26-13', home_team_id: 'eng', away_team_id: 'irn',
    home_score: 3, away_score: 1, status: 'FT', date: iso('2026-06-13', 21),
    round: 'group', stage_order: 1, group: 'G', stadium_id: 'mercedes',
    referee: 'Felix Zwayer', winner_id: 'eng', loser_id: 'irn',
    events: [
      goalEvent('g13', 'eng', 'p-bellingham', 'Jude Bellingham', 'جود بيلينغهام', 19),
      goalEvent('g13', 'eng', 'p-kane', 'Harry Kane', 'هاري كين', 42, 'Penalty'),
      goalEvent('g13', 'irn', 'p-taremi', 'Mehdi Taremi', 'مهدي طارمي', 61),
      goalEvent('g13', 'eng', 'p-saka', 'Bukayo Saka', 'بوكايو ساكا', 80),
    ],
    statistics: defaultStats(3, 1), man_of_the_match: 'p-bellingham' },
  { id: 'g14', fixture_id: 'wc26-14', home_team_id: 'por', away_team_id: 'par',
    home_score: 2, away_score: 1, status: 'FT', date: iso('2026-06-14', 21),
    round: 'group', stage_order: 1, group: 'G', stadium_id: 'levis',
    referee: 'Jesús Gil Manzano', winner_id: 'por', loser_id: 'par',
    events: [
      goalEvent('g14', 'por', 'p-ronaldo', 'Cristiano Ronaldo', 'كريستيانو رونالدو', 27, 'Penalty'),
      goalEvent('g14', 'par', 'p-sanabria', 'Antonio Sanabria', 'أنطونيو سانابريا', 53),
      goalEvent('g14', 'por', 'p-leao', 'Rafael Leão', 'رافائيل لياو', 88),
    ],
    statistics: defaultStats(2, 1), man_of_the_match: 'p-ronaldo' },
  // Group H
  { id: 'g15', fixture_id: 'wc26-15', home_team_id: 'ita', away_team_id: 'gha',
    home_score: 2, away_score: 0, status: 'FT', date: iso('2026-06-14', 18),
    round: 'group', stage_order: 1, group: 'H', stadium_id: 'lincoln',
    referee: 'Benoît Bastien', winner_id: 'ita', loser_id: 'gha' },
  { id: 'g16', fixture_id: 'wc26-16', home_team_id: 'uru', away_team_id: 'rsa',
    home_score: 1, away_score: 0, status: 'FT', date: iso('2026-06-14', 21),
    round: 'group', stage_order: 1, group: 'H', stadium_id: 'nrg',
    referee: 'Danny Makkelie', winner_id: 'uru', loser_id: 'rsa' },
  // Group I
  { id: 'g17', fixture_id: 'wc26-17', home_team_id: 'ukr', away_team_id: 'uzb',
    home_score: 2, away_score: 0, status: 'FT', date: iso('2026-06-14', 18),
    round: 'group', stage_order: 1, group: 'I', stadium_id: 'lumen',
    referee: 'Artur Soares Dias', winner_id: 'ukr', loser_id: 'uzb' },
  { id: 'g18', fixture_id: 'wc26-18', home_team_id: 'sau', away_team_id: 'per',
    home_score: 1, away_score: 1, status: 'FT', date: iso('2026-06-14', 21),
    round: 'group', stage_order: 1, group: 'I', stadium_id: 'arrowhead',
    referee: 'Sandro Wagner',
    events: [
      goalEvent('g18', 'sau', 'p-salem', 'Salem Al-Dawsari', 'سالم الدوسري', 38, 'Penalty'),
      goalEvent('g18', 'per', 'p-lapadula', 'Gianluca Lapadula', 'جيانلوكا لابادولا', 72),
    ],
    statistics: defaultStats(1, 1) },
  // Group J
  { id: 'g19', fixture_id: 'wc26-19', home_team_id: 'nor', away_team_id: 'blr',
    home_score: 5, away_score: 0, status: 'FT', date: iso('2026-06-12', 21),
    round: 'group', stage_order: 1, group: 'J', stadium_id: 'lumen',
    referee: 'Benoît Bastien', winner_id: 'nor', loser_id: 'blr',
    events: [
      goalEvent('g19', 'nor', 'p-haaland', 'Erling Haaland', 'إيرلينغ هالاند', 8),
      goalEvent('g19', 'nor', 'p-haaland', 'Erling Haaland', 'إيرلينغ هالاند', 23),
      goalEvent('g19', 'nor', 'p-haaland', 'Erling Haaland', 'إيرلينغ هالاند', 56, 'Penalty'),
      goalEvent('g19', 'nor', 'p-haaland', 'Erling Haaland', 'إيرلينغ هالاند', 71),
      goalEvent('g19', 'nor', 'p-odegaard', 'Martin Ødegaard', 'مارتن أوديغارد', 88),
    ],
    statistics: defaultStats(5, 0), man_of_the_match: 'p-haaland' },
  { id: 'g20', fixture_id: 'wc26-20', home_team_id: 'aut', away_team_id: 'swe',
    home_score: 2, away_score: 1, status: 'FT', date: iso('2026-06-13', 18),
    round: 'group', stage_order: 1, group: 'J', stadium_id: 'bbva',
    referee: 'Clément Turpin', winner_id: 'aut', loser_id: 'swe' },
  // Group K
  { id: 'g21', fixture_id: 'wc26-21', home_team_id: 'tur', away_team_id: 'hon',
    home_score: 3, away_score: 0, status: 'FT', date: iso('2026-06-13', 21),
    round: 'group', stage_order: 1, group: 'K', stadium_id: 'akron',
    referee: 'Szymon Marciniak', winner_id: 'tur', loser_id: 'hon' },
  { id: 'g22', fixture_id: 'wc26-22', home_team_id: 'den', away_team_id: 'mli',
    home_score: 1, away_score: 1, status: 'FT', date: iso('2026-06-14', 18),
    round: 'group', stage_order: 1, group: 'K', stadium_id: 'bc',
    referee: 'Anthony Taylor' },
  // Group L
  { id: 'g23', fixture_id: 'wc26-23', home_team_id: 'pol', away_team_id: 'pan',
    home_score: 2, away_score: 0, status: 'FT', date: iso('2026-06-14', 21),
    round: 'group', stage_order: 1, group: 'L', stadium_id: 'mercedes',
    referee: 'Michael Oliver', winner_id: 'pol', loser_id: 'pan' },
  { id: 'g24', fixture_id: 'wc26-24', home_team_id: 'wal', away_team_id: 'cmr',
    home_score: 1, away_score: 1, status: 'FT', date: iso('2026-06-14', 18),
    round: 'group', stage_order: 1, group: 'L', stadium_id: 'gillette' },

  // ===== Matchday 2 (June 17-23, 2026) — UPCOMING (NS) =====
  // Today is June 17 — matchday 2 just starting
  { id: 'g25', fixture_id: 'wc26-25', home_team_id: 'mex', away_team_id: 'usa',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-17', 23),
    round: 'group', stage_order: 1, group: 'A', stadium_id: 'azteca',
    referee: 'Slavko Vinčić' },
  { id: 'g26', fixture_id: 'wc26-26', home_team_id: 'can', away_team_id: 'crc',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-17', 23),
    round: 'group', stage_order: 1, group: 'A', stadium_id: 'bmo' },
  { id: 'g27', fixture_id: 'wc26-27', home_team_id: 'ned', away_team_id: 'ger',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-18', 18),
    round: 'group', stage_order: 1, group: 'B', stadium_id: 'metlife',
    referee: 'Anthony Taylor' },
  { id: 'g28', fixture_id: 'wc26-28', home_team_id: 'jpn', away_team_id: 'aus',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-18', 18),
    round: 'group', stage_order: 1, group: 'B', stadium_id: 'nrg' },
  { id: 'g29', fixture_id: 'wc26-29', home_team_id: 'arg', away_team_id: 'sen',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-18', 21),
    round: 'group', stage_order: 1, group: 'C', stadium_id: 'att',
    referee: 'Szymon Marciniak' },
  { id: 'g30', fixture_id: 'wc26-30', home_team_id: 'sui', away_team_id: 'irq',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-18', 21),
    round: 'group', stage_order: 1, group: 'C', stadium_id: 'hardrock' },
  { id: 'g31', fixture_id: 'wc26-31', home_team_id: 'fra', away_team_id: 'bel',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-18', 21),
    round: 'group', stage_order: 1, group: 'D', stadium_id: 'mercedes',
    referee: 'Felix Zwayer' },
  { id: 'g32', fixture_id: 'wc26-32', home_team_id: 'mar', away_team_id: 'kor',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-19', 18),
    round: 'group', stage_order: 1, group: 'D', stadium_id: 'lincoln',
    referee: 'Clément Turpin' },
  { id: 'g33', fixture_id: 'wc26-33', home_team_id: 'bra', away_team_id: 'ngr',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-19', 18),
    round: 'group', stage_order: 1, group: 'E', stadium_id: 'hardrock',
    referee: 'Michael Oliver' },
  { id: 'g34', fixture_id: 'wc26-34', home_team_id: 'col', away_team_id: 'tun',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-19', 21),
    round: 'group', stage_order: 1, group: 'E', stadium_id: 'sofi' },
  { id: 'g35', fixture_id: 'wc26-35', home_team_id: 'esp', away_team_id: 'cro',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-19', 21),
    round: 'group', stage_order: 1, group: 'F', stadium_id: 'sofi',
    referee: 'Daniele Orsato' },
  { id: 'g36', fixture_id: 'wc26-36', home_team_id: 'ecu', away_team_id: 'civ',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-19', 18),
    round: 'group', stage_order: 1, group: 'F', stadium_id: 'arrowhead' },
  { id: 'g37', fixture_id: 'wc26-37', home_team_id: 'eng', away_team_id: 'por',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-20', 21),
    round: 'group', stage_order: 1, group: 'G', stadium_id: 'levis',
    referee: 'Jesús Gil Manzano' },
  { id: 'g38', fixture_id: 'wc26-38', home_team_id: 'par', away_team_id: 'irn',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-20', 18),
    round: 'group', stage_order: 1, group: 'G', stadium_id: 'mercedes' },
  { id: 'g39', fixture_id: 'wc26-39', home_team_id: 'ita', away_team_id: 'uru',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-20', 21),
    round: 'group', stage_order: 1, group: 'H', stadium_id: 'lincoln',
    referee: 'Benoît Bastien' },
  { id: 'g40', fixture_id: 'wc26-40', home_team_id: 'gha', away_team_id: 'rsa',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-20', 18),
    round: 'group', stage_order: 1, group: 'H', stadium_id: 'nrg' },
  { id: 'g41', fixture_id: 'wc26-41', home_team_id: 'sau', away_team_id: 'ukr',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-20', 18),
    round: 'group', stage_order: 1, group: 'I', stadium_id: 'arrowhead',
    referee: 'Sandro Wagner' },
  { id: 'g42', fixture_id: 'wc26-42', home_team_id: 'per', away_team_id: 'uzb',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-20', 21),
    round: 'group', stage_order: 1, group: 'I', stadium_id: 'lumen' },
  { id: 'g43', fixture_id: 'wc26-43', home_team_id: 'nor', away_team_id: 'aut',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-20', 21),
    round: 'group', stage_order: 1, group: 'J', stadium_id: 'lumen' },
  { id: 'g44', fixture_id: 'wc26-44', home_team_id: 'swe', away_team_id: 'blr',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-21', 18),
    round: 'group', stage_order: 1, group: 'J', stadium_id: 'bbva' },
  { id: 'g45', fixture_id: 'wc26-45', home_team_id: 'tur', away_team_id: 'den',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-21', 18),
    round: 'group', stage_order: 1, group: 'K', stadium_id: 'akron' },
  { id: 'g46', fixture_id: 'wc26-46', home_team_id: 'mli', away_team_id: 'hon',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-21', 21),
    round: 'group', stage_order: 1, group: 'K', stadium_id: 'bc' },
  { id: 'g47', fixture_id: 'wc26-47', home_team_id: 'pol', away_team_id: 'wal',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-21', 21),
    round: 'group', stage_order: 1, group: 'L', stadium_id: 'mercedes' },
  { id: 'g48', fixture_id: 'wc26-48', home_team_id: 'cmr', away_team_id: 'pan',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-21', 18),
    round: 'group', stage_order: 1, group: 'L', stadium_id: 'gillette' },

  // ===== Matchday 3 (June 24-27, 2026) — UPCOMING (NS) =====
  { id: 'g49', fixture_id: 'wc26-49', home_team_id: 'crc', away_team_id: 'usa',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-24', 23),
    round: 'group', stage_order: 1, group: 'A', stadium_id: 'att' },
  { id: 'g50', fixture_id: 'wc26-50', home_team_id: 'mex', away_team_id: 'can',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-24', 23),
    round: 'group', stage_order: 1, group: 'A', stadium_id: 'azteca' },
  { id: 'g51', fixture_id: 'wc26-51', home_team_id: 'aus', away_team_id: 'ger',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-25', 18),
    round: 'group', stage_order: 1, group: 'B', stadium_id: 'nrg' },
  { id: 'g52', fixture_id: 'wc26-52', home_team_id: 'jpn', away_team_id: 'ned',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-25', 18),
    round: 'group', stage_order: 1, group: 'B', stadium_id: 'metlife' },
  { id: 'g53', fixture_id: 'wc26-53', home_team_id: 'irq', away_team_id: 'sen',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-25', 21),
    round: 'group', stage_order: 1, group: 'C', stadium_id: 'hardrock' },
  { id: 'g54', fixture_id: 'wc26-54', home_team_id: 'sui', away_team_id: 'arg',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-06-25', 21),
    round: 'group', stage_order: 1, group: 'C', stadium_id: 'att' },
];

// ============================================================
// KNOCKOUT STAGE — placeholders (round still 2 weeks away)
// All matches NS with no teams assigned yet (except where group winners
// can already be predicted, but we keep them blank for realism)
// ============================================================
export const R32_MATCHES: Match[] = [
  // 16 placeholders — round of 32 starts June 29
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `r32-${i + 1}`,
    fixture_id: `wc26-r32-${i + 1}`,
    home_team_id: '',
    away_team_id: '',
    home_score: null,
    away_score: null,
    status: 'NS' as const,
    date: iso(`2026-06-${29 + Math.floor(i / 4)}`, 18 + (i % 4) * 3),
    round: 'R32' as const,
    stage_order: 2,
    stadium_id: ['metlife', 'att', 'sofi', 'hardrock', 'mercedes', 'levis', 'arrowhead', 'lincoln'][i % 8],
    next_match_id: `r16-${Math.floor(i / 2) + 1}`,
    bracket_position: i + 1,
  })),
];

export const R16_MATCHES: Match[] = [
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `r16-${i + 1}`,
    fixture_id: `wc26-r16-${i + 1}`,
    home_team_id: '',
    away_team_id: '',
    home_score: null,
    away_score: null,
    status: 'NS' as const,
    date: iso(`2026-07-0${i + 1}`, 18),
    round: 'R16' as const,
    stage_order: 3,
    stadium_id: ['metlife', 'att', 'sofi', 'hardrock', 'mercedes', 'levis', 'arrowhead', 'lincoln'][i],
    next_match_id: `qf-${Math.floor(i / 2) + 1}`,
    bracket_position: i + 1,
  })),
];

export const QF_MATCHES: Match[] = [
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `qf-${i + 1}`,
    fixture_id: `wc26-qf-${i + 1}`,
    home_team_id: '',
    away_team_id: '',
    home_score: null,
    away_score: null,
    status: 'NS' as const,
    date: iso(`2026-07-${9 + i}`, 21),
    round: 'QF' as const,
    stage_order: 4,
    stadium_id: ['metlife', 'att', 'sofi', 'hardrock'][i],
    next_match_id: i < 2 ? 'sf-1' : 'sf-2',
    bracket_position: i + 1,
  })),
];

export const SF_MATCHES: Match[] = [
  { id: 'sf-1', fixture_id: 'wc26-sf-1', home_team_id: '', away_team_id: '',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-07-14', 21),
    round: 'SF', stage_order: 5, stadium_id: 'metlife', next_match_id: 'final', bracket_position: 1 },
  { id: 'sf-2', fixture_id: 'wc26-sf-2', home_team_id: '', away_team_id: '',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-07-15', 21),
    round: 'SF', stage_order: 5, stadium_id: 'mercedes', next_match_id: 'final', bracket_position: 2 },
];

export const FINAL_MATCHES: Match[] = [
  { id: 'third', fixture_id: 'wc26-3rd', home_team_id: '', away_team_id: '',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-07-18', 21),
    round: 'THIRD', stage_order: 6, stadium_id: 'hardrock', bracket_position: 1 },
  { id: 'final', fixture_id: 'wc26-final', home_team_id: '', away_team_id: '',
    home_score: null, away_score: null, status: 'NS', date: iso('2026-07-19', 21),
    round: 'FINAL', stage_order: 6, stadium_id: 'metlife', bracket_position: 2 },
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
