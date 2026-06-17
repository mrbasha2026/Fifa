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
// World Cup 2026 Mock Data
// Tournament: June 11 - July 19, 2026
// Hosts: USA, Canada, Mexico
// 48 teams in 12 groups (A-L) of 4 teams each
// Top 2 from each group + 8 best third-placed advance to R32
// For the knockout tree we model the traditional R16 path
// ============================================================

// ===== TEAMS (48 teams in 12 groups) =====
export const TEAMS: Team[] = [
  // Group A
  { id: 'mex', name: 'Mexico', name_ar: 'المكسيك', logo: '🇲🇽', flag: '🇲🇽', group: 'A', fifa_code: 'MEX', fifa_ranking: 17, coach: 'Javier Aguirre' },
  { id: 'can', name: 'Canada', name_ar: 'كندا', logo: '🇨🇦', flag: '🇨🇦', group: 'A', fifa_code: 'CAN', fifa_ranking: 31, coach: 'Jesse Marsch' },
  { id: 'usa', name: 'USA', name_ar: 'الولايات المتحدة', logo: '🇺🇸', flag: '🇺🇸', group: 'A', fifa_code: 'USA', fifa_ranking: 16, coach: 'Mauricio Pochettino' },
  { id: 'crc', name: 'Costa Rica', name_ar: 'كوستاريكا', logo: '🇨🇷', flag: '🇨🇷', group: 'A', fifa_code: 'CRC', fifa_ranking: 54, coach: 'Gustavo Alfaro' },

  // Group B
  { id: 'ger', name: 'Germany', name_ar: 'ألمانيا', logo: '🇩🇪', flag: '🇩🇪', group: 'B', fifa_code: 'GER', fifa_ranking: 9, coach: 'Julian Nagelsmann' },
  { id: 'ned', name: 'Netherlands', name_ar: 'هولندا', logo: '🇳🇱', flag: '🇳🇱', group: 'B', fifa_code: 'NED', fifa_ranking: 6, coach: 'Ronald Koeman' },
  { id: 'jpn', name: 'Japan', name_ar: 'اليابان', logo: '🇯🇵', flag: '🇯🇵', group: 'B', fifa_code: 'JPN', fifa_ranking: 18, coach: 'Hajime Moriyasu' },
  { id: 'aus', name: 'Australia', name_ar: 'أستراليا', logo: '🇦🇺', flag: '🇦🇺', group: 'B', fifa_code: 'AUS', fifa_ranking: 26, coach: 'Tony Popovic' },

  // Group C
  { id: 'arg', name: 'Argentina', name_ar: 'الأرجنتين', logo: '🇦🇷', flag: '🇦🇷', group: 'C', fifa_code: 'ARG', fifa_ranking: 1, coach: 'Lionel Scaloni' },
  { id: 'sui', name: 'Switzerland', name_ar: 'سويسرا', logo: '🇨🇭', flag: '🇨🇭', group: 'C', fifa_code: 'SUI', fifa_ranking: 19, coach: 'Murat Yakin' },
  { id: 'sen', name: 'Senegal', name_ar: 'السنغال', logo: '🇸🇳', flag: '🇸🇳', group: 'C', fifa_code: 'SEN', fifa_ranking: 19, coach: 'Pape Thiaw' },
  { id: 'irq', name: 'Iraq', name_ar: 'العراق', logo: '🇮🇶', flag: '🇮🇶', group: 'C', fifa_code: 'IRQ', fifa_ranking: 58, coach: 'Graham Arnold' },

  // Group D
  { id: 'fra', name: 'France', name_ar: 'فرنسا', logo: '🇫🇷', flag: '🇫🇷', group: 'D', fifa_code: 'FRA', fifa_ranking: 2, coach: 'Didier Deschamps' },
  { id: 'bel', name: 'Belgium', name_ar: 'بلجيكا', logo: '🇧🇪', flag: '🇧🇪', group: 'D', fifa_code: 'BEL', fifa_ranking: 8, coach: 'Domenico Tedesco' },
  { id: 'kor', name: 'South Korea', name_ar: 'كوريا الجنوبية', logo: '🇰🇷', flag: '🇰🇷', group: 'D', fifa_code: 'KOR', fifa_ranking: 23, coach: 'Hong Myung-bo' },
  { id: 'mar', name: 'Morocco', name_ar: 'المغرب', logo: '🇲🇦', flag: '🇲🇦', group: 'D', fifa_code: 'MAR', fifa_ranking: 14, coach: 'Walid Regragui' },

  // Group E
  { id: 'bra', name: 'Brazil', name_ar: 'البرازيل', logo: '🇧🇷', flag: '🇧🇷', group: 'E', fifa_code: 'BRA', fifa_ranking: 5, coach: 'Dorival Júnior' },
  { id: 'col', name: 'Colombia', name_ar: 'كولومبيا', logo: '🇨🇴', flag: '🇨🇴', group: 'E', fifa_code: 'COL', fifa_ranking: 12, coach: 'Néstor Lorenzo' },
  { id: 'ngr', name: 'Nigeria', name_ar: 'نيجيريا', logo: '🇳🇬', flag: '🇳🇬', group: 'E', fifa_code: 'NGA', fifa_ranking: 36, coach: 'Eric Chelle' },
  { id: 'tun', name: 'Tunisia', name_ar: 'تونس', logo: '🇹🇳', flag: '🇹🇳', group: 'E', fifa_code: 'TUN', fifa_ranking: 41, coach: 'Sami Trabelsi' },

  // Group F
  { id: 'esp', name: 'Spain', name_ar: 'إسبانيا', logo: '🇪🇸', flag: '🇪🇸', group: 'F', fifa_code: 'ESP', fifa_ranking: 3, coach: 'Luis de la Fuente' },
  { id: 'cro', name: 'Croatia', name_ar: 'كرواتيا', logo: '🇭🇷', flag: '🇭🇷', group: 'F', fifa_code: 'CRO', fifa_ranking: 10, coach: 'Zlatko Dalić' },
  { id: 'ecu', name: 'Ecuador', name_ar: 'الإكوادور', logo: '🇪🇨', flag: '🇪🇨', group: 'F', fifa_code: 'ECU', fifa_ranking: 24, coach: 'Sebastián Beccacece' },
  { id: 'civ', name: 'Ivory Coast', name_ar: 'ساحل العاج', logo: '🇨🇮', flag: '🇨🇮', group: 'F', fifa_code: 'CIV', fifa_ranking: 42, coach: 'Emerse Faé' },

  // Group G
  { id: 'eng', name: 'England', name_ar: 'إنجلترا', logo: '🏴', flag: '🏴', group: 'G', fifa_code: 'ENG', fifa_ranking: 4, coach: 'Thomas Tuchel' },
  { id: 'por', name: 'Portugal', name_ar: 'البرتغال', logo: '🇵🇹', flag: '🇵🇹', group: 'G', fifa_code: 'POR', fifa_ranking: 7, coach: 'Roberto Martínez' },
  { id: 'par', name: 'Paraguay', name_ar: 'باراغواي', logo: '🇵🇾', flag: '🇵🇾', group: 'G', fifa_code: 'PAR', fifa_ranking: 39, coach: 'Gustavo Alfaro' },
  { id: 'irn', name: 'Iran', name_ar: 'إيران', logo: '🇮🇷', flag: '🇮🇷', group: 'G', fifa_code: 'IRN', fifa_ranking: 20, coach: 'Amir Ghalenoei' },

  // Group H
  { id: 'ita', name: 'Italy', name_ar: 'إيطاليا', logo: '🇮🇹', flag: '🇮🇹', group: 'H', fifa_code: 'ITA', fifa_ranking: 11, coach: 'Luciano Spalletti' },
  { id: 'uru', name: 'Uruguay', name_ar: 'الأوروغواي', logo: '🇺🇾', flag: '🇺🇾', group: 'H', fifa_code: 'URU', fifa_ranking: 15, coach: 'Marcelo Bielsa' },
  { id: 'gha', name: 'Ghana', name_ar: 'غانا', logo: '🇬🇭', flag: '🇬🇭', group: 'H', fifa_code: 'GHA', fifa_ranking: 73, coach: 'Otto Addo' },
  { id: 'rsa', name: 'South Africa', name_ar: 'جنوب أفريقيا', logo: '🇿🇦', flag: '🇿🇦', group: 'H', fifa_code: 'RSA', fifa_ranking: 56, coach: 'Hugo Broos' },

  // Group I
  { id: 'sau', name: 'Saudi Arabia', name_ar: 'السعودية', logo: '🇸🇦', flag: '🇸🇦', group: 'I', fifa_code: 'KSA', fifa_ranking: 56, coach: 'Hervé Renard' },
  { id: 'ukr', name: 'Ukraine', name_ar: 'أوكرانيا', logo: '🇺🇦', flag: '🇺🇦', group: 'I', fifa_code: 'UKR', fifa_ranking: 25, coach: 'Serhiy Rebrov' },
  { id: 'per', name: 'Peru', name_ar: 'بيرو', logo: '🇵🇪', flag: '🇵🇪', group: 'I', fifa_code: 'PER', fifa_ranking: 38, coach: 'Óscar Ibáñez' },
  { id: 'uzb', name: 'Uzbekistan', name_ar: 'أوزبكستان', logo: '🇺🇿', flag: '🇺🇿', group: 'I', fifa_code: 'UZB', fifa_ranking: 57, coach: 'Timur Kapadze' },

  // Group J
  { id: 'ned2', name: 'Norway', name_ar: 'النرويج', logo: '🇳🇴', flag: '🇳🇴', group: 'J', fifa_code: 'NOR', fifa_ranking: 32, coach: 'Ståle Solbakken' },
  { id: 'aut', name: 'Austria', name_ar: 'النمسا', logo: '🇦🇹', flag: '🇦🇹', group: 'J', fifa_code: 'AUT', fifa_ranking: 22, coach: 'Ralf Rangnick' },
  { id: 'swe', name: 'Sweden', name_ar: 'السويد', logo: '🇸🇪', flag: '🇸🇪', group: 'J', fifa_code: 'SWE', fifa_ranking: 27, coach: 'Jon Dahl Tomasson' },
  { id: 'blr', name: 'Bolivia', name_ar: 'بوليفيا', logo: '🇧🇴', flag: '🇧🇴', group: 'J', fifa_code: 'BOL', fifa_ranking: 81, coach: 'Antonio Carlos Zago' },

  // Group K
  { id: 'den', name: 'Denmark', name_ar: 'الدنمارك', logo: '🇩🇰', flag: '🇩🇰', group: 'K', fifa_code: 'DEN', fifa_ranking: 21, coach: 'Brian Riemer' },
  { id: 'tur', name: 'Türkiye', name_ar: 'تركيا', logo: '🇹🇷', flag: '🇹🇷', group: 'K', fifa_code: 'TUR', fifa_ranking: 28, coach: 'Vincenzo Montella' },
  { id: 'mli', name: 'Mali', name_ar: 'مالي', logo: '🇲🇱', flag: '🇲🇱', group: 'K', fifa_code: 'MLI', fifa_ranking: 51, coach: 'Tom Saintfiet' },
  { id: 'hon', name: 'Honduras', name_ar: 'هندوراس', logo: '🇭🇳', flag: '🇭🇳', group: 'K', fifa_code: 'HON', fifa_ranking: 76, coach: 'Reinaldo Rueda' },

  // Group L
  { id: 'pol', name: 'Poland', name_ar: 'بولندا', logo: '🇵🇱', flag: '🇵🇱', group: 'L', fifa_code: 'POL', fifa_ranking: 30, coach: 'Michał Probierz' },
  { id: 'wal', name: 'Wales', name_ar: 'ويلز', logo: '🏴', flag: '🏴', group: 'L', fifa_code: 'WAL', fifa_ranking: 29, coach: 'Craig Bellamy' },
  { id: 'cmr', name: 'Cameroon', name_ar: 'الكاميرون', logo: '🇨🇲', flag: '🇨🇲', group: 'L', fifa_code: 'CMR', fifa_ranking: 50, coach: 'Marc Brys' },
  { id: 'pan', name: 'Panama', name_ar: 'بنما', logo: '🇵🇦', flag: '🇵🇦', group: 'L', fifa_code: 'PAN', fifa_ranking: 35, coach: 'Thomas Christiansen' },
];

// Helper: teams by group
export const TEAMS_BY_GROUP: Record<string, Team[]> = TEAMS.reduce((acc, t) => {
  if (!acc[t.group]) acc[t.group] = [];
  acc[t.group].push(t);
  return acc;
}, {} as Record<string, Team[]>);

// ===== PLAYERS (subset — top players for key teams) =====
export const PLAYERS: Player[] = [
  // Argentina
  { id: 'p-messi', name: 'Lionel Messi', name_ar: 'ليونيل ميسي', team_id: 'arg', position: 'FW', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '⭐', number: 10, age: 38, club: 'Inter Miami' },
  { id: 'p-julian', name: 'Julián Álvarez', name_ar: 'خوليان ألفاريز', team_id: 'arg', position: 'FW', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '⚡', number: 9, age: 25, club: 'Atlético Madrid' },
  { id: 'p-emimart', name: 'Emiliano Martínez', name_ar: 'إيميليانو مارتينيز', team_id: 'arg', position: 'GK', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '🧤', number: 23, age: 32, club: 'Aston Villa' },
  { id: 'p-depaul', name: 'Rodrigo De Paul', name_ar: 'رودريغو دي بول', team_id: 'arg', position: 'MF', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '🎯', number: 7, age: 31, club: 'Atlético Madrid' },
  { id: 'p-otamendi', name: 'Nicolás Otamendi', name_ar: 'نيكولاس أوتاميندي', team_id: 'arg', position: 'DF', nationality: 'Argentina', nationality_ar: 'الأرجنتين', photo: '🛡️', number: 19, age: 37, club: 'Benfica' },

  // France
  { id: 'p-mbappe', name: 'Kylian Mbappé', name_ar: 'كيليان مبابي', team_id: 'fra', position: 'FW', nationality: 'France', nationality_ar: 'فرنسا', photo: '⚡', number: 10, age: 26, club: 'Real Madrid' },
  { id: 'p-griezmann', name: 'Antoine Griezmann', name_ar: 'أنطوان غريزمان', team_id: 'fra', position: 'FW', nationality: 'France', nationality_ar: 'فرنسا', photo: '🎯', number: 7, age: 34, club: 'Atlético Madrid' },
  { id: 'p-tchouameni', name: 'Aurélien Tchouaméni', name_ar: 'أوريليان تشواميني', team_id: 'fra', position: 'MF', nationality: 'France', nationality_ar: 'فرنسا', photo: '⚙️', number: 8, age: 24, club: 'Real Madrid' },
  { id: 'p-saliba', name: 'William Saliba', name_ar: 'ويليام ساليبا', team_id: 'fra', position: 'DF', nationality: 'France', nationality_ar: 'فرنسا', photo: '🛡️', number: 17, age: 23, club: 'Arsenal' },
  { id: 'p-maignan', name: 'Mike Maignan', name_ar: 'مايك ماينان', team_id: 'fra', position: 'GK', nationality: 'France', nationality_ar: 'فرنسا', photo: '🧤', number: 16, age: 29, club: 'AC Milan' },

  // Brazil
  { id: 'p-vini', name: 'Vinícius Júnior', name_ar: 'فينيسيوس جونيور', team_id: 'bra', position: 'FW', nationality: 'Brazil', nationality_ar: 'البرازيل', photo: '⚡', number: 7, age: 24, club: 'Real Madrid' },
  { id: 'p-rodrigo', name: 'Rodrygo', name_ar: 'رودريغو', team_id: 'bra', position: 'FW', nationality: 'Brazil', nationality_ar: 'البرازيل', photo: '🎯', number: 10, age: 24, club: 'Real Madrid' },
  { id: 'p-casemiro', name: 'Casemiro', name_ar: 'كاسيميرو', team_id: 'bra', position: 'MF', nationality: 'Brazil', nationality_ar: 'البرازيل', photo: '⚙️', number: 5, age: 33, club: 'Man United' },
  { id: 'p-marqui', name: 'Marquinhos', name_ar: 'ماركينيوس', team_id: 'bra', position: 'DF', nationality: 'Brazil', nationality_ar: 'البرازيل', photo: '🛡️', number: 4, age: 30, club: 'PSG' },
  { id: 'p-alisson', name: 'Alisson', name_ar: 'أليسون', team_id: 'bra', position: 'GK', nationality: 'Brazil', nationality_ar: 'البرازيل', photo: '🧤', number: 1, age: 32, club: 'Liverpool' },

  // England
  { id: 'p-bellingham', name: 'Jude Bellingham', name_ar: 'جود بيلينغهام', team_id: 'eng', position: 'MF', nationality: 'England', nationality_ar: 'إنجلترا', photo: '⭐', number: 22, age: 21, club: 'Real Madrid' },
  { id: 'p-kane', name: 'Harry Kane', name_ar: 'هاري كين', team_id: 'eng', position: 'FW', nationality: 'England', nationality_ar: 'إنجلترا', photo: '⚽', number: 9, age: 31, club: 'Bayern Munich' },
  { id: 'p-foden', name: 'Phil Foden', name_ar: 'فيل فودين', team_id: 'eng', position: 'MF', nationality: 'England', nationality_ar: 'إنجلترا', photo: '🎯', number: 11, age: 24, club: 'Man City' },
  { id: 'p-saka', name: 'Bukayo Saka', name_ar: 'بوكايو ساكا', team_id: 'eng', position: 'FW', nationality: 'England', nationality_ar: 'إنجلترا', photo: '⚡', number: 17, age: 23, club: 'Arsenal' },
  { id: 'p-stones', name: 'John Stones', name_ar: 'جون ستونز', team_id: 'eng', position: 'DF', nationality: 'England', nationality_ar: 'إنجلترا', photo: '🛡️', number: 5, age: 30, club: 'Man City' },

  // Spain
  { id: 'p-yamal', name: 'Lamine Yamal', name_ar: 'لامين يامال', team_id: 'esp', position: 'FW', nationality: 'Spain', nationality_ar: 'إسبانيا', photo: '⚡', number: 19, age: 18, club: 'Barcelona' },
  { id: 'p-rodrigo2', name: 'Rodri', name_ar: 'رودري', team_id: 'esp', position: 'MF', nationality: 'Spain', nationality_ar: 'إسبانيا', photo: '⚙️', number: 16, age: 28, club: 'Man City' },
  { id: 'p-pedri', name: 'Pedri', name_ar: 'بيدري', team_id: 'esp', position: 'MF', nationality: 'Spain', nationality_ar: 'إسبانيا', photo: '🎯', number: 20, age: 22, club: 'Barcelona' },
  { id: 'p-olmo', name: 'Dani Olmo', name_ar: 'داني أولمو', team_id: 'esp', position: 'FW', nationality: 'Spain', nationality_ar: 'إسبانيا', photo: '⚽', number: 7, age: 26, club: 'Barcelona' },
  { id: 'p-raya', name: 'David Raya', name_ar: 'ديفيد رايا', team_id: 'esp', position: 'GK', nationality: 'Spain', nationality_ar: 'إسبانيا', photo: '🧤', number: 1, age: 29, club: 'Arsenal' },

  // Portugal
  { id: 'p-ronaldo', name: 'Cristiano Ronaldo', name_ar: 'كريستيانو رونالدو', team_id: 'por', position: 'FW', nationality: 'Portugal', nationality_ar: 'البرتغال', photo: '⭐', number: 7, age: 40, club: 'Al Nassr' },
  { id: 'p-bruno', name: 'Bruno Fernandes', name_ar: 'برونو فيرنانديز', team_id: 'por', position: 'MF', nationality: 'Portugal', nationality_ar: 'البرتغال', photo: '🎯', number: 8, age: 30, club: 'Man United' },
  { id: 'p-leao', name: 'Rafael Leão', name_ar: 'رافائيل لياو', team_id: 'por', position: 'FW', nationality: 'Portugal', nationality_ar: 'البرتغال', photo: '⚡', number: 15, age: 25, club: 'AC Milan' },
  { id: 'p-ruben', name: 'Rúben Dias', name_ar: 'روben دياس', team_id: 'por', position: 'DF', nationality: 'Portugal', nationality_ar: 'البرتغال', photo: '🛡️', number: 4, age: 27, club: 'Man City' },

  // Germany
  { id: 'p-musiala', name: 'Jamal Musiala', name_ar: 'جمال موسيالا', team_id: 'ger', position: 'MF', nationality: 'Germany', nationality_ar: 'ألمانيا', photo: '⚡', number: 10, age: 21, club: 'Bayern Munich' },
  { id: 'p-wirtz', name: 'Florian Wirtz', name_ar: 'فلوريان فيرتز', team_id: 'ger', position: 'MF', nationality: 'Germany', nationality_ar: 'ألمانيا', photo: '🎯', number: 17, age: 21, club: 'Leverkusen' },
  { id: 'p-kroos', name: 'Toni Kroos', name_ar: 'توني كروس', team_id: 'ger', position: 'MF', nationality: 'Germany', nationality_ar: 'ألمانيا', photo: '⚙️', number: 8, age: 35, club: 'Real Madrid' },
  { id: 'p-kimmich', name: 'Joshua Kimmich', name_ar: 'جوشوا كيميتش', team_id: 'ger', position: 'DF', nationality: 'Germany', nationality_ar: 'ألمانيا', photo: '🛡️', number: 6, age: 29, club: 'Bayern Munich' },

  // Netherlands
  { id: 'p-deprijn', name: 'Memphis Depay', name_ar: 'ممفيس ديباي', team_id: 'ned', position: 'FW', nationality: 'Netherlands', nationality_ar: 'هولندا', photo: '⚡', number: 10, age: 31, club: 'Corinthians' },
  { id: 'p-vandijk', name: 'Virgil van Dijk', name_ar: 'فيرجيل فان دايك', team_id: 'ned', position: 'DF', nationality: 'Netherlands', nationality_ar: 'هولندا', photo: '🛡️', number: 4, age: 33, club: 'Liverpool' },
  { id: 'p-gakpo', name: 'Cody Gakpo', name_ar: 'كودي خاكبو', team_id: 'ned', position: 'FW', nationality: 'Netherlands', nationality_ar: 'هولندا', photo: '⚽', number: 11, age: 25, club: 'Liverpool' },

  // Saudi Arabia
  { id: 'p-salem', name: 'Salem Al-Dawsari', name_ar: 'سالم الدوسري', team_id: 'sau', position: 'FW', nationality: 'Saudi Arabia', nationality_ar: 'السعودية', photo: '⚡', number: 10, age: 33, club: 'Al Hilal' },
  { id: 'p-shehri', name: 'Salem Al-Shehri', name_ar: 'سالم الشهري', team_id: 'sau', position: 'FW', nationality: 'Saudi Arabia', nationality_ar: 'السعودية', photo: '⚽', number: 11, age: 31, club: 'Al Hilal' },
  { id: 'p-owais', name: 'Mohammed Al-Owais', name_ar: 'محمد العويس', team_id: 'sau', position: 'GK', nationality: 'Saudi Arabia', nationality_ar: 'السعودية', photo: '🧤', number: 21, age: 33, club: 'Al Hilal' },
  { id: 'p-brikan', name: 'Abdullah Al-Hamdan', name_ar: 'عبدالله الحمدان', team_id: 'sau', position: 'FW', nationality: 'Saudi Arabia', nationality_ar: 'السعودية', photo: '🎯', number: 9, age: 25, club: 'Al Hilal' },

  // Morocco
  { id: 'p-hakimi', name: 'Achraf Hakimi', name_ar: 'أشرف حكيمي', team_id: 'mar', position: 'DF', nationality: 'Morocco', nationality_ar: 'المغرب', photo: '⚡', number: 2, age: 26, club: 'PSG' },
  { id: 'p-ziyech', name: 'Hakim Ziyech', name_ar: 'حكيم زياش', team_id: 'mar', position: 'MF', nationality: 'Morocco', nationality_ar: 'المغرب', photo: '🎯', number: 7, age: 32, club: 'Galatasaray' },
  { id: 'p-ennesyri', name: 'Youssef En-Nesyri', name_ar: 'يوسف النصيري', team_id: 'mar', position: 'FW', nationality: 'Morocco', nationality_ar: 'المغرب', photo: '⚽', number: 19, age: 28, club: 'Fenerbahçe' },

  // Japan
  { id: 'p-kubo', name: 'Takefusa Kubo', name_ar: 'تاكيفوسا كوبو', team_id: 'jpn', position: 'FW', nationality: 'Japan', nationality_ar: 'اليابان', photo: '⚡', number: 11, age: 23, club: 'Real Sociedad' },
  { id: 'p-mitoma', name: 'Kaoru Mitoma', name_ar: 'كاورو ميتوما', team_id: 'jpn', position: 'FW', nationality: 'Japan', nationality_ar: 'اليابان', photo: '🎯', number: 14, age: 27, club: 'Brighton' },
  { id: 'p-kamada', name: 'Daichi Kamada', name_ar: 'دايتشي كامادا', team_id: 'jpn', position: 'MF', nationality: 'Japan', nationality_ar: 'اليابان', photo: '⚙️', number: 15, age: 28, club: 'Lazio' },

  // Italy
  { id: 'p-chiesa', name: 'Federico Chiesa', name_ar: 'فيديريكو كييزا', team_id: 'ita', position: 'FW', nationality: 'Italy', nationality_ar: 'إيطاليا', photo: '⚡', number: 14, age: 27, club: 'Liverpool' },
  { id: 'p-barella', name: 'Nicolò Barella', name_ar: 'نيكولو باريللا', team_id: 'ita', position: 'MF', nationality: 'Italy', nationality_ar: 'إيطاليا', photo: '⚙️', number: 18, age: 27, club: 'Inter' },
  { id: 'p-dimarco', name: 'Federico Dimarco', name_ar: 'فيديريكو ديماركو', team_id: 'ita', position: 'DF', nationality: 'Italy', nationality_ar: 'إيطاليا', photo: '🛡️', number: 6, age: 27, club: 'Inter' },

  // USA
  { id: 'p-pulisic', name: 'Christian Pulisic', name_ar: 'كريستيان بوليسيتش', team_id: 'usa', position: 'FW', nationality: 'USA', nationality_ar: 'الولايات المتحدة', photo: '⚡', number: 10, age: 26, club: 'AC Milan' },
  { id: 'p-mckennie', name: 'Weston McKennie', name_ar: 'ويستون ماكيني', team_id: 'usa', position: 'MF', nationality: 'USA', nationality_ar: 'الولايات المتحدة', photo: '⚙️', number: 8, age: 26, club: 'Juventus' },
  { id: 'p-balloon', name: 'Matt Turner', name_ar: 'مات تورنر', team_id: 'usa', position: 'GK', nationality: 'USA', nationality_ar: 'الولايات المتحدة', photo: '🧤', number: 1, age: 30, club: 'Crystal Palace' },
];

// Top scorers (based on mock matches below)
export const TOP_SCORERS: TopScorerRow[] = [
  { player_id: 'p-mbappe', goals: 7, assists: 3, team_id: 'fra', penalties: 2, matches_played: 6 },
  { player_id: 'p-messi', goals: 6, assists: 4, team_id: 'arg', penalties: 1, matches_played: 6 },
  { player_id: 'p-vini', goals: 5, assists: 2, team_id: 'bra', penalties: 0, matches_played: 5 },
  { player_id: 'p-bellingham', goals: 5, assists: 3, team_id: 'eng', penalties: 1, matches_played: 6 },
  { player_id: 'p-yamal', goals: 4, assists: 5, team_id: 'esp', penalties: 0, matches_played: 5 },
  { player_id: 'p-kane', goals: 4, assists: 2, team_id: 'eng', penalties: 2, matches_played: 6 },
  { player_id: 'p-musiala', goals: 4, assists: 2, team_id: 'ger', penalties: 0, matches_played: 5 },
  { player_id: 'p-rodrigo2', name: '' as any, goals: 3, assists: 4, team_id: 'esp', penalties: 0, matches_played: 5 } as TopScorerRow,
  { player_id: 'p-julian', goals: 4, assists: 1, team_id: 'arg', penalties: 0, matches_played: 6 },
  { player_id: 'p-gakpo', goals: 4, assists: 1, team_id: 'ned', penalties: 0, matches_played: 5 },
  { player_id: 'p-ronaldo', goals: 3, assists: 1, team_id: 'por', penalties: 1, matches_played: 4 },
  { player_id: 'p-salem', goals: 3, assists: 2, team_id: 'sau', penalties: 1, matches_played: 4 },
  { player_id: 'p-deprijn', goals: 3, assists: 2, team_id: 'ned', penalties: 0, matches_played: 5 },
  { player_id: 'p-ennesyri', goals: 3, assists: 0, team_id: 'mar', penalties: 0, matches_played: 4 },
  { player_id: 'p-kubo', goals: 3, assists: 1, team_id: 'jpn', penalties: 0, matches_played: 4 },
];

export const TOP_ASSISTS: TopAssistRow[] = [
  { player_id: 'p-yamal', assists: 5, goals: 4, team_id: 'esp', matches_played: 5 },
  { player_id: 'p-messi', assists: 4, goals: 6, team_id: 'arg', matches_played: 6 },
  { player_id: 'p-depaul', assists: 4, goals: 1, team_id: 'arg', matches_played: 6 },
  { player_id: 'p-bellingham', assists: 3, goals: 5, team_id: 'eng', matches_played: 6 },
  { player_id: 'p-mbappe', assists: 3, goals: 7, team_id: 'fra', matches_played: 6 },
  { player_id: 'p-bruno', assists: 3, goals: 2, team_id: 'por', matches_played: 4 },
  { player_id: 'p-pedri', assists: 3, goals: 1, team_id: 'esp', matches_played: 5 },
  { player_id: 'p-wirtz', assists: 3, goals: 2, team_id: 'ger', matches_played: 5 },
  { player_id: 'p-foden', assists: 3, goals: 2, team_id: 'eng', matches_played: 6 },
  { player_id: 'p-rodrigo2', assists: 4, goals: 3, team_id: 'esp', matches_played: 5 } as TopAssistRow,
];

// ===== STANDINGS (mocked — top 2 + best thirds visible) =====
function makeStandings(group: string, rows: Array<[string, number, number, number, number, number, number]>): StandingsRow[] {
  return rows.map(([teamId, p, w, d, l, gf, ga], idx) => ({
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
    ['ned2', 3, 2, 0, 1, 4, 3],
    ['swe', 3, 1, 0, 2, 3, 4],
    ['blr', 3, 0, 1, 2, 1, 6],
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

// ===== MATCHES =====
// Mix of group stage (finished), some LIVE, some upcoming, plus knockout
const today = new Date('2026-06-17T18:00:00Z');
function iso(daysFromNow: number, hour = 18): string {
  const d = new Date(today);
  d.setDate(d.getDate() + daysFromNow);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}

// Helper to build events
function goalEvent(matchId: string, teamId: string, playerId: string, playerName: string, playerNameAr: string, minute: number, detail?: string): MatchEvent {
  return { id: `${matchId}-g-${minute}-${playerId}`, match_id: matchId, team_id: teamId, type: 'goal', player: playerName, player_ar: playerNameAr, minute, detail };
}
function cardEvent(matchId: string, teamId: string, playerName: string, playerNameAr: string, minute: number, color: 'Yellow' | 'Red'): MatchEvent {
  return { id: `${matchId}-c-${minute}-${playerName}`, match_id: matchId, team_id: teamId, type: 'card', player: playerName, player_ar: playerNameAr, minute, detail: color };
}
function subEvent(matchId: string, teamId: string, playerName: string, playerNameAr: string, minute: number, subFor: string): MatchEvent {
  return { id: `${matchId}-s-${minute}-${playerName}`, match_id: matchId, team_id: teamId, type: 'substitution', player: playerName, player_ar: playerNameAr, minute, detail: `In for ${subFor}` };
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

// Sample group matches (mix of finished, live, upcoming)
export const GROUP_MATCHES: Match[] = [
  // Finished matches
  {
    id: 'g1', fixture_id: 'f1', home_team_id: 'arg', away_team_id: 'irq',
    home_score: 3, away_score: 0, status: 'FT', date: iso(-3, 21),
    round: 'group', stage_order: 1, group: 'C', stadium: 'MetLife Stadium', city: 'New York',
    referee: 'Szymon Marciniak', winner_id: 'arg', loser_id: 'irq',
    events: [
      goalEvent('g1', 'arg', 'p-messi', 'Lionel Messi', 'ليونيل ميسي', 12),
      goalEvent('g1', 'arg', 'p-julian', 'Julián Álvarez', 'خوليان ألفاريز', 34),
      goalEvent('g1', 'arg', 'p-messi', 'Lionel Messi', 'ليونيل ميسي', 67, 'Penalty'),
      cardEvent('g1', 'irq', 'Amir Al-Ammari', 'أمير العمري', 45, 'Yellow'),
    ],
    statistics: defaultStats(3, 0),
    man_of_the_match: 'p-messi',
  },
  {
    id: 'g2', fixture_id: 'f2', home_team_id: 'fra', away_team_id: 'kor',
    home_score: 4, away_score: 1, status: 'FT', date: iso(-3, 18),
    round: 'group', stage_order: 1, group: 'D', stadium: 'AT&T Stadium', city: 'Dallas',
    referee: 'Anthony Taylor', winner_id: 'fra', loser_id: 'kor',
    events: [
      goalEvent('g2', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 8),
      goalEvent('g2', 'fra', 'p-griezmann', 'Antoine Griezmann', 'أنطوان غريزمان', 28),
      goalEvent('g2', 'kor', 'Son Heung-min', 'سون هيونغ مين', 55),
      goalEvent('g2', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 71, 'Penalty'),
      goalEvent('g2', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 88),
    ],
    statistics: defaultStats(4, 1),
    man_of_the_match: 'p-mbappe',
  },
  {
    id: 'g3', fixture_id: 'f3', home_team_id: 'esp', away_team_id: 'civ',
    home_score: 3, away_score: 0, status: 'FT', date: iso(-2, 21),
    round: 'group', stage_order: 1, group: 'F', stadium: 'Hard Rock Stadium', city: 'Miami',
    referee: 'Daniele Orsato', winner_id: 'esp', loser_id: 'civ',
    events: [
      goalEvent('g3', 'esp', 'p-yamal', 'Lamine Yamal', 'لامين يامال', 23),
      goalEvent('g3', 'esp', 'p-olmo', 'Dani Olmo', 'داني أولمو', 56),
      goalEvent('g3', 'esp', 'p-yamal', 'Lamine Yamal', 'لامين يامال', 78),
    ],
    statistics: defaultStats(3, 0),
    man_of_the_match: 'p-yamal',
  },
  {
    id: 'g4', fixture_id: 'f4', home_team_id: 'bra', away_team_id: 'tun',
    home_score: 2, away_score: 0, status: 'FT', date: iso(-2, 18),
    round: 'group', stage_order: 1, group: 'E', stadium: 'SoFi Stadium', city: 'Los Angeles',
    referee: 'Michael Oliver', winner_id: 'bra', loser_id: 'tun',
    events: [
      goalEvent('g4', 'bra', 'p-vini', 'Vinícius Júnior', 'فينيسيوس جونيور', 31),
      goalEvent('g4', 'bra', 'p-rodrigo', 'Rodrygo', 'رودريغو', 73),
    ],
    statistics: defaultStats(2, 0),
    man_of_the_match: 'p-vini',
  },
  {
    id: 'g5', fixture_id: 'f5', home_team_id: 'eng', away_team_id: 'irn',
    home_score: 3, away_score: 1, status: 'FT', date: iso(-2, 15),
    round: 'group', stage_order: 1, group: 'G', stadium: 'Mercedes-Benz Stadium', city: 'Atlanta',
    referee: 'Felix Zwayer', winner_id: 'eng', loser_id: 'irn',
    events: [
      goalEvent('g5', 'eng', 'p-bellingham', 'Jude Bellingham', 'جود بيلينغهام', 19),
      goalEvent('g5', 'eng', 'p-kane', 'Harry Kane', 'هاري كين', 42, 'Penalty'),
      goalEvent('g5', 'irn', 'Mehdi Taremi', 'مهدي طارمي', 61),
      goalEvent('g5', 'eng', 'p-saka', 'Bukayo Saka', 'بوكايو ساكا', 80),
    ],
    statistics: defaultStats(3, 1),
    man_of_the_match: 'p-bellingham',
  },
  {
    id: 'g6', fixture_id: 'f6', home_team_id: 'por', away_team_id: 'par',
    home_score: 2, away_score: 1, status: 'FT', date: iso(-1, 21),
    round: 'group', stage_order: 1, group: 'G', stadium: 'Levi\'s Stadium', city: 'San Francisco',
    referee: 'Jesus Gil Manzano', winner_id: 'por', loser_id: 'par',
    events: [
      goalEvent('g6', 'por', 'p-ronaldo', 'Cristiano Ronaldo', 'كريستيانو رونالدو', 27, 'Penalty'),
      goalEvent('g6', 'par', 'Antonio Sanabria', 'أنطونيو سانابريا', 53),
      goalEvent('g6', 'por', 'p-leao', 'Rafael Leão', 'رافائيل لياو', 88),
    ],
    statistics: defaultStats(2, 1),
    man_of_the_match: 'p-ronaldo',
  },
  {
    id: 'g7', fixture_id: 'f7', home_team_id: 'sau', away_team_id: 'per',
    home_score: 1, away_score: 1, status: 'FT', date: iso(-1, 18),
    round: 'group', stage_order: 1, group: 'I', stadium: 'Arrowhead Stadium', city: 'Kansas City',
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
    round: 'group', stage_order: 1, group: 'D', stadium: 'Lincoln Financial Field', city: 'Philadelphia',
    referee: 'Clément Turpin', winner_id: 'mar', loser_id: 'bel',
    events: [
      goalEvent('g8', 'mar', 'p-ennesyri', 'Youssef En-Nesyri', 'يوسف النصيري', 22),
      goalEvent('g8', 'bel', 'Romelu Lukaku', 'روميلو لوكاكو', 56),
      goalEvent('g8', 'mar', 'p-hakimi', 'Achraf Hakimi', 'أشرف حكيمي', 81),
    ],
    statistics: defaultStats(2, 1),
    man_of_the_match: 'p-hakimi',
  },
  {
    id: 'g9', fixture_id: 'f9', home_team_id: 'ger', away_team_id: 'aus',
    home_score: 4, away_score: 1, status: 'FT', date: iso(-1, 21),
    round: 'group', stage_order: 1, group: 'B', stadium: 'Gillette Stadium', city: 'Boston',
    referee: 'Danny Makkelie', winner_id: 'ger', loser_id: 'aus',
    events: [
      goalEvent('g9', 'ger', 'p-musiala', 'Jamal Musiala', 'جمال موسيالا', 11),
      goalEvent('g9', 'ger', 'p-wirtz', 'Florian Wirtz', 'فلوريان فيرتز', 28),
      goalEvent('g9', 'aus', 'Jackson Irvine', 'جاكسون إيرفين', 49),
      goalEvent('g9', 'ger', 'p-musiala', 'Jamal Musiala', 'جمال موسيالا', 67),
      goalEvent('g9', 'ger', 'p-kimmich', 'Joshua Kimmich', 'جوشوا كيميتش', 83),
    ],
    statistics: defaultStats(4, 1),
    man_of_the_match: 'p-musiala',
  },
  {
    id: 'g10', fixture_id: 'f10', home_team_id: 'ned', away_team_id: 'jpn',
    home_score: 2, away_score: 1, status: 'FT', date: iso(-1, 18),
    round: 'group', stage_order: 1, group: 'B', stadium: 'NRG Stadium', city: 'Houston',
    referee: 'Artur Soares Dias', winner_id: 'ned', loser_id: 'jpn',
    events: [
      goalEvent('g10', 'ned', 'p-gakpo', 'Cody Gakpo', 'كودي خاكبو', 17),
      goalEvent('g10', 'jpn', 'p-kubo', 'Takefusa Kubo', 'تاكيفوسا كوبو', 39),
      goalEvent('g10', 'ned', 'p-deprijn', 'Memphis Depay', 'ممفيس ديباي', 76, 'Penalty'),
    ],
    statistics: defaultStats(2, 1),
    man_of_the_match: 'p-gakpo',
  },

  // ===== LIVE MATCHES (current time) =====
  {
    id: 'g11', fixture_id: 'f11', home_team_id: 'usa', away_team_id: 'mex',
    home_score: 1, away_score: 1, status: 'LIVE', date: iso(0, 18),
    round: 'group', stage_order: 1, group: 'A', stadium: 'Rose Bowl', city: 'Los Angeles',
    referee: 'Slavko Vinčić', minute: 67,
    events: [
      goalEvent('g11', 'usa', 'p-pulisic', 'Christian Pulisic', 'كريستيان بوليسيتش', 23),
      goalEvent('g11', 'mex', 'Santiago Giménez', 'سانتياغو خيمينيز', 56),
      cardEvent('g11', 'usa', 'p-mckennie', 'Weston McKennie', 'ويستون ماكيني', 41, 'Yellow'),
    ],
    statistics: defaultStats(1, 1),
  },
  {
    id: 'g12', fixture_id: 'f12', home_team_id: 'ita', away_team_id: 'uru',
    home_score: 0, away_score: 0, status: 'LIVE', date: iso(0, 18),
    round: 'group', stage_order: 1, group: 'H', stadium: 'Lucas Oil Stadium', city: 'Indianapolis',
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
    round: 'group', stage_order: 1, group: 'B', stadium: 'MetLife Stadium', city: 'New York',
    referee: 'Anthony Taylor',
  },
  {
    id: 'g14', fixture_id: 'f14', home_team_id: 'arg', away_team_id: 'sen',
    home_score: null, away_score: null, status: 'NS', date: iso(1, 18),
    round: 'group', stage_order: 1, group: 'C', stadium: 'AT&T Stadium', city: 'Dallas',
    referee: 'Szymon Marciniak',
  },
  {
    id: 'g15', fixture_id: 'f15', home_team_id: 'bra', away_team_id: 'ngr',
    home_score: null, away_score: null, status: 'NS', date: iso(1, 15),
    round: 'group', stage_order: 1, group: 'E', stadium: 'Hard Rock Stadium', city: 'Miami',
    referee: 'Michael Oliver',
  },
  {
    id: 'g16', fixture_id: 'f16', home_team_id: 'esp', away_team_id: 'cro',
    home_score: null, away_score: null, status: 'NS', date: iso(2, 21),
    round: 'group', stage_order: 1, group: 'F', stadium: 'SoFi Stadium', city: 'Los Angeles',
    referee: 'Daniele Orsato',
  },
  {
    id: 'g17', fixture_id: 'f17', home_team_id: 'fra', away_team_id: 'bel',
    home_score: null, away_score: null, status: 'NS', date: iso(2, 18),
    round: 'group', stage_order: 1, group: 'D', stadium: 'Mercedes-Benz Stadium', city: 'Atlanta',
    referee: 'Felix Zwayer',
  },
  {
    id: 'g18', fixture_id: 'f18', home_team_id: 'eng', away_team_id: 'por',
    home_score: null, away_score: null, status: 'NS', date: iso(2, 21),
    round: 'group', stage_order: 1, group: 'G', stadium: 'Levi\'s Stadium', city: 'San Francisco',
    referee: 'Jesus Gil Manzano',
  },
  {
    id: 'g19', fixture_id: 'f19', home_team_id: 'sau', away_team_id: 'ukr',
    home_score: null, away_score: null, status: 'NS', date: iso(3, 18),
    round: 'group', stage_order: 1, group: 'I', stadium: 'Arrowhead Stadium', city: 'Kansas City',
    referee: 'Sandro Wagner',
  },
  {
    id: 'g20', fixture_id: 'f20', home_team_id: 'mar', away_team_id: 'kor',
    home_score: null, away_score: null, status: 'NS', date: iso(3, 21),
    round: 'group', stage_order: 1, group: 'D', stadium: 'Lincoln Financial Field', city: 'Philadelphia',
    referee: 'Clément Turpin',
  },
];

// ===== KNOCKOUT MATCHES (R16 → QF → SF → FINAL + 3rd) =====
// We model a completed bracket so the user can see path-highlight + winners
export const KNOCKOUT_MATCHES: Match[] = [
  // ===== Round of 16 =====
  {
    id: 'r16-1', fixture_id: 'k1', home_team_id: 'arg', away_team_id: 'ned',
    home_score: 2, away_score: 1, status: 'FT', date: iso(-2, 21),
    round: 'R16', stage_order: 2, stadium: 'MetLife Stadium', city: 'New York',
    referee: 'Szymon Marciniak', winner_id: 'arg', loser_id: 'ned', next_match_id: 'qf-1', bracket_position: 1,
    events: [
      goalEvent('r16-1', 'arg', 'p-messi', 'Lionel Messi', 'ليونيل ميسي', 23),
      goalEvent('r16-1', 'ned', 'p-gakpo', 'Cody Gakpo', 'كودي خاكبو', 56),
      goalEvent('r16-1', 'arg', 'p-julian', 'Julián Álvarez', 'خوليان ألفاريز', 88),
    ],
    statistics: defaultStats(2, 1), man_of_the_match: 'p-messi',
  },
  {
    id: 'r16-2', fixture_id: 'k2', home_team_id: 'fra', away_team_id: 'bel',
    home_score: 3, away_score: 1, status: 'FT', date: iso(-2, 18),
    round: 'R16', stage_order: 2, stadium: 'AT&T Stadium', city: 'Dallas',
    referee: 'Anthony Taylor', winner_id: 'fra', loser_id: 'bel', next_match_id: 'qf-1', bracket_position: 2,
    events: [
      goalEvent('r16-2', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 11),
      goalEvent('r16-2', 'fra', 'p-griezmann', 'Antoine Griezmann', 'أنطوان غريزمان', 34),
      goalEvent('r16-2', 'bel', 'Romelu Lukaku', 'روميلو لوكاكو', 62),
      goalEvent('r16-2', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 79),
    ],
    statistics: defaultStats(3, 1), man_of_the_match: 'p-mbappe',
  },
  {
    id: 'r16-3', fixture_id: 'k3', home_team_id: 'esp', away_team_id: 'mar',
    home_score: 1, away_score: 0, status: 'FT', date: iso(-1, 21),
    round: 'R16', stage_order: 2, stadium: 'Hard Rock Stadium', city: 'Miami',
    referee: 'Daniele Orsato', winner_id: 'esp', loser_id: 'mar', next_match_id: 'qf-2', bracket_position: 3,
    events: [
      goalEvent('r16-3', 'esp', 'p-yamal', 'Lamine Yamal', 'لامين يامال', 67),
    ],
    statistics: defaultStats(1, 0), man_of_the_match: 'p-yamal',
  },
  {
    id: 'r16-4', fixture_id: 'k4', home_team_id: 'bra', away_team_id: 'ita',
    home_score: 2, away_score: 0, status: 'FT', date: iso(-1, 18),
    round: 'R16', stage_order: 2, stadium: 'SoFi Stadium', city: 'Los Angeles',
    referee: 'Michael Oliver', winner_id: 'bra', loser_id: 'ita', next_match_id: 'qf-2', bracket_position: 4,
    events: [
      goalEvent('r16-4', 'bra', 'p-vini', 'Vinícius Júnior', 'فينيسيوس جونيور', 31),
      goalEvent('r16-4', 'bra', 'p-rodrigo', 'Rodrygo', 'رودريغو', 73),
    ],
    statistics: defaultStats(2, 0), man_of_the_match: 'p-vini',
  },
  {
    id: 'r16-5', fixture_id: 'k5', home_team_id: 'eng', away_team_id: 'ger',
    home_score: 2, away_score: 1, status: 'FT', date: iso(-1, 21),
    round: 'R16', stage_order: 2, stadium: 'Mercedes-Benz Stadium', city: 'Atlanta',
    referee: 'Felix Zwayer', winner_id: 'eng', loser_id: 'ger', next_match_id: 'qf-3', bracket_position: 5,
    events: [
      goalEvent('r16-5', 'ger', 'p-musiala', 'Jamal Musiala', 'جمال موسيالا', 18),
      goalEvent('r16-5', 'eng', 'p-kane', 'Harry Kane', 'هاري كين', 44, 'Penalty'),
      goalEvent('r16-5', 'eng', 'p-bellingham', 'Jude Bellingham', 'جود بيلينغهام', 91),
    ],
    statistics: defaultStats(2, 1), man_of_the_match: 'p-bellingham',
  },
  {
    id: 'r16-6', fixture_id: 'k6', home_team_id: 'por', away_team_id: 'uru',
    home_score: 1, away_score: 0, status: 'FT', date: iso(-1, 18),
    round: 'R16', stage_order: 2, stadium: 'Levi\'s Stadium', city: 'San Francisco',
    referee: 'Jesus Gil Manzano', winner_id: 'por', loser_id: 'uru', next_match_id: 'qf-3', bracket_position: 6,
    events: [
      goalEvent('r16-6', 'por', 'p-ronaldo', 'Cristiano Ronaldo', 'كريستيانو رونالدو', 78, 'Penalty'),
    ],
    statistics: defaultStats(1, 0), man_of_the_match: 'p-ronaldo',
  },
  // LIVE R16 match (for live effects showcase)
  {
    id: 'r16-7', fixture_id: 'k7', home_team_id: 'usa', away_team_id: 'jpn',
    home_score: 1, away_score: 1, status: 'LIVE', date: iso(0, 18),
    round: 'R16', stage_order: 2, stadium: 'Rose Bowl', city: 'Los Angeles',
    referee: 'Slavko Vinčić', minute: 73, next_match_id: 'qf-4', bracket_position: 7,
    events: [
      goalEvent('r16-7', 'usa', 'p-pulisic', 'Christian Pulisic', 'كريستيان بوليسيتش', 28),
      goalEvent('r16-7', 'jpn', 'p-kubo', 'Takefusa Kubo', 'تاكيفوسا كوبو', 61),
      cardEvent('r16-7', 'jpn', 'Wataru Endo', 'واتارو إندو', 44, 'Yellow'),
    ],
    statistics: defaultStats(1, 1),
  },
  {
    id: 'r16-8', fixture_id: 'k8', home_team_id: 'sau', away_team_id: 'mex',
    home_score: null, away_score: null, status: 'NS', date: iso(0, 21),
    round: 'R16', stage_order: 2, stadium: 'Arrowhead Stadium', city: 'Kansas City',
    referee: 'Sandro Wagner', next_match_id: 'qf-4', bracket_position: 8,
  },

  // ===== Quarter Finals =====
  {
    id: 'qf-1', fixture_id: 'q1', home_team_id: 'arg', away_team_id: 'fra',
    home_score: 2, away_score: 1, status: 'FT', date: iso(2, 21),
    round: 'QF', stage_order: 3, stadium: 'MetLife Stadium', city: 'New York',
    referee: 'Szymon Marciniak', winner_id: 'arg', loser_id: 'fra', next_match_id: 'sf-1', bracket_position: 1,
    events: [
      goalEvent('qf-1', 'fra', 'p-mbappe', 'Kylian Mbappé', 'كيليان مبابي', 14),
      goalEvent('qf-1', 'arg', 'p-messi', 'Lionel Messi', 'ليونيل ميسي', 38, 'Penalty'),
      goalEvent('qf-1', 'arg', 'p-julian', 'Julián Álvarez', 'خوليان ألفاريز', 71),
    ],
    statistics: defaultStats(2, 1), man_of_the_match: 'p-messi',
  },
  {
    id: 'qf-2', fixture_id: 'q2', home_team_id: 'esp', away_team_id: 'bra',
    home_score: 2, away_score: 2, status: 'PEN', date: iso(2, 18),
    round: 'QF', stage_order: 3, stadium: 'Hard Rock Stadium', city: 'Miami',
    referee: 'Daniele Orsato', winner_id: 'esp', loser_id: 'bra', next_match_id: 'sf-1', bracket_position: 2,
    events: [
      goalEvent('qf-2', 'esp', 'p-yamal', 'Lamine Yamal', 'لامين يامال', 19),
      goalEvent('qf-2', 'bra', 'p-vini', 'Vinícius Júnior', 'فينيسيوس جونيور', 33),
      goalEvent('qf-2', 'esp', 'p-olmo', 'Dani Olmo', 'داني أولمو', 67),
      goalEvent('qf-2', 'bra', 'p-rodrigo', 'Rodrygo', 'رودريغو', 82),
    ],
    statistics: defaultStats(2, 2), man_of_the_match: 'p-yamal',
  },
  {
    id: 'qf-3', fixture_id: 'q3', home_team_id: 'eng', away_team_id: 'por',
    home_score: 1, away_score: 0, status: 'FT', date: iso(3, 21),
    round: 'QF', stage_order: 3, stadium: 'Mercedes-Benz Stadium', city: 'Atlanta',
    referee: 'Felix Zwayer', winner_id: 'eng', loser_id: 'por', next_match_id: 'sf-2', bracket_position: 3,
    events: [
      goalEvent('qf-3', 'eng', 'p-bellingham', 'Jude Bellingham', 'جود بيلينغهام', 56),
    ],
    statistics: defaultStats(1, 0), man_of_the_match: 'p-bellingham',
  },
  // QF-4 is upcoming (depends on r16-7 and r16-8 results)
  {
    id: 'qf-4', fixture_id: 'q4', home_team_id: '', away_team_id: '',
    home_score: null, away_score: null, status: 'NS', date: iso(3, 18),
    round: 'QF', stage_order: 3, stadium: 'Levi\'s Stadium', city: 'San Francisco',
    referee: 'Jesus Gil Manzano', next_match_id: 'sf-2', bracket_position: 4,
  },

  // ===== Semi Finals =====
  {
    id: 'sf-1', fixture_id: 's1', home_team_id: 'arg', away_team_id: 'esp',
    home_score: 2, away_score: 1, status: 'FT', date: iso(5, 21),
    round: 'SF', stage_order: 4, stadium: 'MetLife Stadium', city: 'New York',
    referee: 'Szymon Marciniak', winner_id: 'arg', loser_id: 'esp', next_match_id: 'final', bracket_position: 1,
    events: [
      goalEvent('sf-1', 'esp', 'p-yamal', 'Lamine Yamal', 'لامين يامال', 22),
      goalEvent('sf-1', 'arg', 'p-messi', 'Lionel Messi', 'ليونيل ميسي', 45, 'Penalty'),
      goalEvent('sf-1', 'arg', 'p-julian', 'Julián Álvarez', 'خوليان ألفاريز', 79),
    ],
    statistics: defaultStats(2, 1), man_of_the_match: 'p-messi',
  },
  // SF-2 is upcoming (depends on qf-3 and qf-4)
  {
    id: 'sf-2', fixture_id: 's2', home_team_id: 'eng', away_team_id: '',
    home_score: null, away_score: null, status: 'NS', date: iso(5, 18),
    round: 'SF', stage_order: 4, stadium: 'Mercedes-Benz Stadium', city: 'Atlanta',
    referee: 'Felix Zwayer', next_match_id: 'final', bracket_position: 2,
  },

  // ===== FINAL =====
  {
    id: 'final', fixture_id: 'fl', home_team_id: 'arg', away_team_id: '',
    home_score: null, away_score: null, status: 'NS', date: iso(8, 21),
    round: 'FINAL', stage_order: 5, stadium: 'MetLife Stadium', city: 'New York',
    referee: 'Szymon Marciniak', bracket_position: 1,
  },

  // ===== THIRD PLACE =====
  {
    id: 'third', fixture_id: 'tp', home_team_id: 'esp', away_team_id: '',
    home_score: null, away_score: null, status: 'NS', date: iso(7, 18),
    round: 'THIRD', stage_order: 5, stadium: 'Hard Rock Stadium', city: 'Miami',
    referee: 'Daniele Orsato', bracket_position: 2,
  },
];

// All matches combined
export const ALL_MATCHES: Match[] = [...GROUP_MATCHES, ...KNOCKOUT_MATCHES];

// Generate lineups for matches that have events
function buildLineup(matchId: string, teamId: string, formation: string): MatchLineup {
  const players = PLAYERS.filter(p => p.team_id === teamId);
  const starters = players.slice(0, 11).map(p => ({
    player_id: p.id, name: p.name, name_ar: p.name_ar, number: p.number, position: p.position,
  }));
  const substitutes = players.slice(11).map(p => ({
    player_id: p.id, name: p.name, name_ar: p.name_ar, number: p.number, position: p.position,
  }));
  const team = TEAMS.find(t => t.id === teamId);
  return {
    id: `${matchId}-lineup-${teamId}`,
    match_id: matchId,
    team_id: teamId,
    formation,
    starters,
    substitutes,
    coach: team?.coach,
  };
}

// Index lookups
export const TEAM_BY_ID: Record<string, Team> = TEAMS.reduce((acc, t) => { acc[t.id] = t; return acc; }, {} as Record<string, Team>);
export const PLAYER_BY_ID: Record<string, Player> = PLAYERS.reduce((acc, p) => { acc[p.id] = p; return acc; }, {} as Record<string, Player>);
export const MATCH_BY_ID: Record<string, Match> = ALL_MATCHES.reduce((acc, m) => { acc[m.id] = m; return acc; }, {} as Record<string, Match>);
