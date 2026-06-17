// ============================================================
// World Cup 2026 — REAL DATA from rezarahiminia/worldcup2026
// ============================================================
// Source: https://github.com/rezarahiminia/worldcup2026
// Data fetched: 2026-06-17T13:48:36.023Z
// 48 teams, 104 matches, 16 stadiums, 12 groups (A-L)
// Tournament dates: June 11 - July 19, 2026
// ============================================================

import type {
  Team, Player, Match, StandingsRow, MatchEvent, MatchStatistics,
  MatchLineup, TopScorerRow, TopAssistRow,
} from './types';

// ===== 48 TEAMS — REAL WC 2026 draw =====
export const TEAMS: Team[] = [
  { id: 't1', name: "Mexico", name_ar: "المكسيك", logo: "https://flagcdn.com/w80/mx.png", flag: "https://flagcdn.com/w80/mx.png", group: "A", fifa_code: "MEX", fifa_ranking: undefined, coach: undefined },
  { id: 't2', name: "South Africa", name_ar: "جنوب أفريقيا", logo: "https://flagcdn.com/w80/za.png", flag: "https://flagcdn.com/w80/za.png", group: "A", fifa_code: "RSA", fifa_ranking: undefined, coach: undefined },
  { id: 't3', name: "South Korea", name_ar: "كوريا الجنوبية", logo: "https://flagcdn.com/w80/kr.png", flag: "https://flagcdn.com/w80/kr.png", group: "A", fifa_code: "KOR", fifa_ranking: undefined, coach: undefined },
  { id: 't4', name: "Czech Republic", name_ar: "التشيك", logo: "https://flagcdn.com/w80/cz.png", flag: "https://flagcdn.com/w80/cz.png", group: "A", fifa_code: "CZE", fifa_ranking: undefined, coach: undefined },
  { id: 't5', name: "Canada", name_ar: "كندا", logo: "https://flagcdn.com/w80/ca.png", flag: "https://flagcdn.com/w80/ca.png", group: "B", fifa_code: "CAN", fifa_ranking: undefined, coach: undefined },
  { id: 't6', name: "Bosnia and Herzegovina", name_ar: "البوسنة والهرسك", logo: "https://flagcdn.com/w80/ba.png", flag: "https://flagcdn.com/w80/ba.png", group: "B", fifa_code: "BIH", fifa_ranking: undefined, coach: undefined },
  { id: 't7', name: "Qatar", name_ar: "قطر", logo: "https://flagcdn.com/w80/qa.png", flag: "https://flagcdn.com/w80/qa.png", group: "B", fifa_code: "QAT", fifa_ranking: undefined, coach: undefined },
  { id: 't8', name: "Switzerland", name_ar: "سويسرا", logo: "https://flagcdn.com/w80/ch.png", flag: "https://flagcdn.com/w80/ch.png", group: "B", fifa_code: "SUI", fifa_ranking: undefined, coach: undefined },
  { id: 't9', name: "Brazil", name_ar: "البرازيل", logo: "https://flagcdn.com/w80/br.png", flag: "https://flagcdn.com/w80/br.png", group: "C", fifa_code: "BRA", fifa_ranking: undefined, coach: undefined },
  { id: 't10', name: "Morocco", name_ar: "المغرب", logo: "https://flagcdn.com/w80/ma.png", flag: "https://flagcdn.com/w80/ma.png", group: "C", fifa_code: "MAR", fifa_ranking: undefined, coach: undefined },
  { id: 't11', name: "Haiti", name_ar: "هايتي", logo: "https://flagcdn.com/w80/ht.png", flag: "https://flagcdn.com/w80/ht.png", group: "C", fifa_code: "HAI", fifa_ranking: undefined, coach: undefined },
  { id: 't12', name: "Scotland", name_ar: "اسكتلندا", logo: "https://flagcdn.com/w80/gb-sct.png", flag: "https://flagcdn.com/w80/gb-sct.png", group: "C", fifa_code: "SCO", fifa_ranking: undefined, coach: undefined },
  { id: 't13', name: "United States", name_ar: "الولايات المتحدة", logo: "https://flagcdn.com/w80/us.png", flag: "https://flagcdn.com/w80/us.png", group: "D", fifa_code: "USA", fifa_ranking: undefined, coach: undefined },
  { id: 't14', name: "Paraguay", name_ar: "باراغواي", logo: "https://flagcdn.com/w80/py.png", flag: "https://flagcdn.com/w80/py.png", group: "D", fifa_code: "PAR", fifa_ranking: undefined, coach: undefined },
  { id: 't15', name: "Australia", name_ar: "أستراليا", logo: "https://flagcdn.com/w80/au.png", flag: "https://flagcdn.com/w80/au.png", group: "D", fifa_code: "AUS", fifa_ranking: undefined, coach: undefined },
  { id: 't16', name: "Turkey", name_ar: "تركيا", logo: "https://flagcdn.com/w80/tr.png", flag: "https://flagcdn.com/w80/tr.png", group: "D", fifa_code: "TUR", fifa_ranking: undefined, coach: undefined },
  { id: 't17', name: "Germany", name_ar: "ألمانيا", logo: "https://flagcdn.com/w80/de.png", flag: "https://flagcdn.com/w80/de.png", group: "E", fifa_code: "GER", fifa_ranking: undefined, coach: undefined },
  { id: 't18', name: "Curaçao", name_ar: "كوراساو", logo: "https://flagcdn.com/w80/cw.png", flag: "https://flagcdn.com/w80/cw.png", group: "E", fifa_code: "CUW", fifa_ranking: undefined, coach: undefined },
  { id: 't19', name: "Ivory Coast", name_ar: "ساحل العاج", logo: "https://flagcdn.com/w80/ci.png", flag: "https://flagcdn.com/w80/ci.png", group: "E", fifa_code: "CIV", fifa_ranking: undefined, coach: undefined },
  { id: 't20', name: "Ecuador", name_ar: "الإكوادور", logo: "https://flagcdn.com/w80/ec.png", flag: "https://flagcdn.com/w80/ec.png", group: "E", fifa_code: "ECU", fifa_ranking: undefined, coach: undefined },
  { id: 't21', name: "Netherlands", name_ar: "هولندا", logo: "https://flagcdn.com/w80/nl.png", flag: "https://flagcdn.com/w80/nl.png", group: "F", fifa_code: "NED", fifa_ranking: undefined, coach: undefined },
  { id: 't22', name: "Japan", name_ar: "اليابان", logo: "https://flagcdn.com/w80/jp.png", flag: "https://flagcdn.com/w80/jp.png", group: "F", fifa_code: "JPN", fifa_ranking: undefined, coach: undefined },
  { id: 't23', name: "Sweden", name_ar: "السويد", logo: "https://flagcdn.com/w80/se.png", flag: "https://flagcdn.com/w80/se.png", group: "F", fifa_code: "SWE", fifa_ranking: undefined, coach: undefined },
  { id: 't24', name: "Tunisia", name_ar: "تونس", logo: "https://flagcdn.com/w80/tn.png", flag: "https://flagcdn.com/w80/tn.png", group: "F", fifa_code: "TUN", fifa_ranking: undefined, coach: undefined },
  { id: 't25', name: "Belgium", name_ar: "بلجيكا", logo: "https://flagcdn.com/w80/be.png", flag: "https://flagcdn.com/w80/be.png", group: "G", fifa_code: "BEL", fifa_ranking: undefined, coach: undefined },
  { id: 't26', name: "Egypt", name_ar: "مصر", logo: "https://flagcdn.com/w80/eg.png", flag: "https://flagcdn.com/w80/eg.png", group: "G", fifa_code: "EGY", fifa_ranking: undefined, coach: undefined },
  { id: 't27', name: "Iran", name_ar: "إيران", logo: "https://flagcdn.com/w80/ir.png", flag: "https://flagcdn.com/w80/ir.png", group: "G", fifa_code: "IRN", fifa_ranking: undefined, coach: undefined },
  { id: 't28', name: "New Zealand", name_ar: "نيوزيلندا", logo: "https://flagcdn.com/w80/nz.png", flag: "https://flagcdn.com/w80/nz.png", group: "G", fifa_code: "NZL", fifa_ranking: undefined, coach: undefined },
  { id: 't29', name: "Spain", name_ar: "إسبانيا", logo: "https://flagcdn.com/w80/es.png", flag: "https://flagcdn.com/w80/es.png", group: "H", fifa_code: "ESP", fifa_ranking: undefined, coach: undefined },
  { id: 't30', name: "Cape Verde", name_ar: "الرأس الأخضر", logo: "https://flagcdn.com/w80/cv.png", flag: "https://flagcdn.com/w80/cv.png", group: "H", fifa_code: "CPV", fifa_ranking: undefined, coach: undefined },
  { id: 't31', name: "Saudi Arabia", name_ar: "السعودية", logo: "https://flagcdn.com/w80/sa.png", flag: "https://flagcdn.com/w80/sa.png", group: "H", fifa_code: "KSA", fifa_ranking: undefined, coach: undefined },
  { id: 't32', name: "Uruguay", name_ar: "الأوروغواي", logo: "https://flagcdn.com/w80/uy.png", flag: "https://flagcdn.com/w80/uy.png", group: "H", fifa_code: "URU", fifa_ranking: undefined, coach: undefined },
  { id: 't33', name: "France", name_ar: "فرنسا", logo: "https://flagcdn.com/w80/fr.png", flag: "https://flagcdn.com/w80/fr.png", group: "I", fifa_code: "FRA", fifa_ranking: undefined, coach: undefined },
  { id: 't34', name: "Senegal", name_ar: "السنغال", logo: "https://flagcdn.com/w80/sn.png", flag: "https://flagcdn.com/w80/sn.png", group: "I", fifa_code: "SEN", fifa_ranking: undefined, coach: undefined },
  { id: 't35', name: "Iraq", name_ar: "العراق", logo: "https://flagcdn.com/w80/iq.png", flag: "https://flagcdn.com/w80/iq.png", group: "I", fifa_code: "IRQ", fifa_ranking: undefined, coach: undefined },
  { id: 't36', name: "Norway", name_ar: "النرويج", logo: "https://flagcdn.com/w80/no.png", flag: "https://flagcdn.com/w80/no.png", group: "I", fifa_code: "NOR", fifa_ranking: undefined, coach: undefined },
  { id: 't37', name: "Argentina", name_ar: "الأرجنتين", logo: "https://flagcdn.com/w80/ar.png", flag: "https://flagcdn.com/w80/ar.png", group: "J", fifa_code: "ARG", fifa_ranking: undefined, coach: undefined },
  { id: 't38', name: "Algeria", name_ar: "الجزائر", logo: "https://flagcdn.com/w80/dz.png", flag: "https://flagcdn.com/w80/dz.png", group: "J", fifa_code: "ALG", fifa_ranking: undefined, coach: undefined },
  { id: 't39', name: "Austria", name_ar: "النمسا", logo: "https://flagcdn.com/w80/at.png", flag: "https://flagcdn.com/w80/at.png", group: "J", fifa_code: "AUT", fifa_ranking: undefined, coach: undefined },
  { id: 't40', name: "Jordan", name_ar: "الأردن", logo: "https://flagcdn.com/w80/jo.png", flag: "https://flagcdn.com/w80/jo.png", group: "J", fifa_code: "JOR", fifa_ranking: undefined, coach: undefined },
  { id: 't41', name: "Portugal", name_ar: "البرتغال", logo: "https://flagcdn.com/w80/pt.png", flag: "https://flagcdn.com/w80/pt.png", group: "K", fifa_code: "POR", fifa_ranking: undefined, coach: undefined },
  { id: 't42', name: "Democratic Republic of the Congo", name_ar: "الكونغو الديمقراطية", logo: "https://flagcdn.com/w80/cd.png", flag: "https://flagcdn.com/w80/cd.png", group: "K", fifa_code: "COD", fifa_ranking: undefined, coach: undefined },
  { id: 't43', name: "Uzbekistan", name_ar: "أوزبكستان", logo: "https://flagcdn.com/w80/uz.png", flag: "https://flagcdn.com/w80/uz.png", group: "K", fifa_code: "UZB", fifa_ranking: undefined, coach: undefined },
  { id: 't44', name: "Colombia", name_ar: "كولومبيا", logo: "https://flagcdn.com/w80/co.png", flag: "https://flagcdn.com/w80/co.png", group: "K", fifa_code: "COL", fifa_ranking: undefined, coach: undefined },
  { id: 't45', name: "England", name_ar: "إنجلترا", logo: "https://flagcdn.com/w80/gb-eng.png", flag: "https://flagcdn.com/w80/gb-eng.png", group: "L", fifa_code: "ENG", fifa_ranking: undefined, coach: undefined },
  { id: 't46', name: "Croatia", name_ar: "كرواتيا", logo: "https://flagcdn.com/w80/hr.png", flag: "https://flagcdn.com/w80/hr.png", group: "L", fifa_code: "CRO", fifa_ranking: undefined, coach: undefined },
  { id: 't47', name: "Ghana", name_ar: "غانا", logo: "https://flagcdn.com/w80/gh.png", flag: "https://flagcdn.com/w80/gh.png", group: "L", fifa_code: "GHA", fifa_ranking: undefined, coach: undefined },
  { id: 't48', name: "Panama", name_ar: "بنما", logo: "https://flagcdn.com/w80/pa.png", flag: "https://flagcdn.com/w80/pa.png", group: "L", fifa_code: "PAN", fifa_ranking: undefined, coach: undefined }
];

// ===== 16 STADIUMS — real venues across USA/Mexico/Canada =====
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
  { id: 's1', name: "Estadio Azteca", name_ar: "استادیوم آزتکا", city: "Mexico City", city_ar: "مکزیکوسیتی", country: 'MEX', capacity: 83000 },
  { id: 's2', name: "Estadio Akron", name_ar: "استادیوم آکرون", city: "Guadalajara (Zapopan)", city_ar: "گوادالاخارا", country: 'MEX', capacity: 48000 },
  { id: 's3', name: "Estadio BBVA", name_ar: "استادیوم بی‌بی‌وی‌ای", city: "Monterrey (Guadalupe)", city_ar: "مونتری", country: 'MEX', capacity: 53500 },
  { id: 's4', name: "AT&T Stadium", name_ar: "استادیوم ای‌تی‌اند‌تی", city: "Dallas (Arlington, Texas)", city_ar: "دالاس", country: 'USA', capacity: 94000 },
  { id: 's5', name: "NRG Stadium", name_ar: "استادیوم ان‌آر‌جی", city: "Houston", city_ar: "هیوستون", country: 'USA', capacity: 72000 },
  { id: 's6', name: "GEHA Field at Arrowhead Stadium", name_ar: "استادیوم اروهد", city: "Kansas City", city_ar: "کانزاس سیتی", country: 'USA', capacity: 73000 },
  { id: 's7', name: "Mercedes-Benz Stadium", name_ar: "استادیوم مرسدس بنز", city: "Atlanta", city_ar: "آتلانتا", country: 'USA', capacity: 75000 },
  { id: 's8', name: "Hard Rock Stadium", name_ar: "استادیوم هارد راک", city: "Miami (Miami Gardens)", city_ar: "میامی", country: 'USA', capacity: 65000 },
  { id: 's9', name: "Gillette Stadium", name_ar: "استادیوم ژیلت", city: "Boston (Foxborough)", city_ar: "بوستون", country: 'USA', capacity: 65000 },
  { id: 's10', name: "Lincoln Financial Field", name_ar: "استادیوم لینکلن فایننشال", city: "Philadelphia", city_ar: "فیلادلفیا", country: 'USA', capacity: 69000 },
  { id: 's11', name: "MetLife Stadium", name_ar: "استادیوم متلایف", city: "New York/New Jersey (East Rutherford)", city_ar: "نیویورک/نیوجرسی", country: 'USA', capacity: 82500 },
  { id: 's12', name: "BMO Field", name_ar: "استادیوم بی‌ام‌او", city: "Toronto", city_ar: "تورنتو", country: 'CAN', capacity: 45000 },
  { id: 's13', name: "BC Place", name_ar: "استادیوم بی‌سی پلیس", city: "Vancouver", city_ar: "ونکوور", country: 'CAN', capacity: 54000 },
  { id: 's14', name: "Lumen Field", name_ar: "استادیوم لومن فیلد", city: "Seattle", city_ar: "سیاتل", country: 'USA', capacity: 69000 },
  { id: 's15', name: "Levi's Stadium", name_ar: "استادیوم لیوایز", city: "San Francisco Bay Area (Santa Clara)", city_ar: "سن‌فرانسیسکو", country: 'USA', capacity: 71000 },
  { id: 's16', name: "SoFi Stadium", name_ar: "استادیوم سوفای", city: "Los Angeles (Inglewood)", city_ar: "لس‌آنجلس", country: 'USA', capacity: 70000 }
];

// ===== 104 MATCHES — complete WC 2026 schedule =====
export const ALL_MATCHES: Match[] = [
  { id: 'm1', fixture_id: "1", home_team_id: "t1", away_team_id: "t2", home_score: null, away_score: null, status: "NS", date: "2026-06-11T13:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "A", stadium_id: "s1", winner_id: null },
  { id: 'm2', fixture_id: "2", home_team_id: "t3", away_team_id: "t4", home_score: null, away_score: null, status: "NS", date: "2026-06-11T20:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "A", stadium_id: "s2", winner_id: null },
  { id: 'm3', fixture_id: "3", home_team_id: "t5", away_team_id: "t6", home_score: null, away_score: null, status: "NS", date: "2026-06-12T15:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "B", stadium_id: "s12", winner_id: null },
  { id: 'm4', fixture_id: "4", home_team_id: "t13", away_team_id: "t14", home_score: null, away_score: null, status: "NS", date: "2026-06-12T18:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "D", stadium_id: "s16", winner_id: null },
  { id: 'm5', fixture_id: "5", home_team_id: "t11", away_team_id: "t12", home_score: null, away_score: null, status: "NS", date: "2026-06-13T21:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "C", stadium_id: "s9", winner_id: null },
  { id: 'm6', fixture_id: "6", home_team_id: "t15", away_team_id: "t16", home_score: null, away_score: null, status: "NS", date: "2026-06-13T21:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "D", stadium_id: "s13", winner_id: null },
  { id: 'm7', fixture_id: "7", home_team_id: "t9", away_team_id: "t10", home_score: null, away_score: null, status: "NS", date: "2026-06-13T18:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "C", stadium_id: "s11", winner_id: null },
  { id: 'm8', fixture_id: "8", home_team_id: "t7", away_team_id: "t8", home_score: null, away_score: null, status: "NS", date: "2026-06-13T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "B", stadium_id: "s15", winner_id: null },
  { id: 'm9', fixture_id: "9", home_team_id: "t19", away_team_id: "t20", home_score: null, away_score: null, status: "NS", date: "2026-06-14T19:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "E", stadium_id: "s10", winner_id: null },
  { id: 'm10', fixture_id: "10", home_team_id: "t17", away_team_id: "t18", home_score: null, away_score: null, status: "NS", date: "2026-06-14T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "E", stadium_id: "s5", winner_id: null },
  { id: 'm11', fixture_id: "11", home_team_id: "t21", away_team_id: "t22", home_score: null, away_score: null, status: "NS", date: "2026-06-14T15:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "F", stadium_id: "s4", winner_id: null },
  { id: 'm12', fixture_id: "12", home_team_id: "t23", away_team_id: "t24", home_score: null, away_score: null, status: "NS", date: "2026-06-14T20:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "F", stadium_id: "s3", winner_id: null },
  { id: 'm13', fixture_id: "13", home_team_id: "t27", away_team_id: "t28", home_score: null, away_score: null, status: "NS", date: "2026-06-15T18:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "G", stadium_id: "s16", winner_id: null },
  { id: 'm14', fixture_id: "14", home_team_id: "t29", away_team_id: "t30", home_score: null, away_score: null, status: "NS", date: "2026-06-15T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "H", stadium_id: "s7", winner_id: null },
  { id: 'm15', fixture_id: "15", home_team_id: "t25", away_team_id: "t26", home_score: null, away_score: null, status: "NS", date: "2026-06-15T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "G", stadium_id: "s14", winner_id: null },
  { id: 'm16', fixture_id: "16", home_team_id: "t31", away_team_id: "t32", home_score: null, away_score: null, status: "NS", date: "2026-06-15T18:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "H", stadium_id: "s8", winner_id: null },
  { id: 'm17', fixture_id: "17", home_team_id: "t33", away_team_id: "t34", home_score: null, away_score: null, status: "NS", date: "2026-06-16T15:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "I", stadium_id: "s11", winner_id: null },
  { id: 'm18', fixture_id: "18", home_team_id: "t35", away_team_id: "t36", home_score: null, away_score: null, status: "NS", date: "2026-06-16T18:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "I", stadium_id: "s9", winner_id: null },
  { id: 'm19', fixture_id: "19", home_team_id: "t37", away_team_id: "t38", home_score: null, away_score: null, status: "NS", date: "2026-06-16T20:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "J", stadium_id: "s6", winner_id: null },
  { id: 'm20', fixture_id: "20", home_team_id: "t39", away_team_id: "t40", home_score: null, away_score: null, status: "NS", date: "2026-06-16T21:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "J", stadium_id: "s15", winner_id: null },
  { id: 'm21', fixture_id: "21", home_team_id: "t41", away_team_id: "t42", home_score: null, away_score: null, status: "NS", date: "2026-06-17T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "K", stadium_id: "s5", winner_id: null },
  { id: 'm22', fixture_id: "22", home_team_id: "t45", away_team_id: "t46", home_score: null, away_score: null, status: "NS", date: "2026-06-17T15:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "L", stadium_id: "s4", winner_id: null },
  { id: 'm23', fixture_id: "23", home_team_id: "t43", away_team_id: "t44", home_score: null, away_score: null, status: "NS", date: "2026-06-17T20:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "K", stadium_id: "s1", winner_id: null },
  { id: 'm24', fixture_id: "24", home_team_id: "t47", away_team_id: "t48", home_score: null, away_score: null, status: "NS", date: "2026-06-17T19:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "L", stadium_id: "s12", winner_id: null },
  { id: 'm25', fixture_id: "25", home_team_id: "t1", away_team_id: "t3", home_score: null, away_score: null, status: "NS", date: "2026-06-18T19:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "A", stadium_id: "s2", winner_id: null },
  { id: 'm26', fixture_id: "26", home_team_id: "t8", away_team_id: "t6", home_score: null, away_score: null, status: "NS", date: "2026-06-18T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "B", stadium_id: "s16", winner_id: null },
  { id: 'm27', fixture_id: "27", home_team_id: "t5", away_team_id: "t7", home_score: null, away_score: null, status: "NS", date: "2026-06-18T15:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "B", stadium_id: "s13", winner_id: null },
  { id: 'm28', fixture_id: "28", home_team_id: "t4", away_team_id: "t2", home_score: null, away_score: null, status: "NS", date: "2026-06-18T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "A", stadium_id: "s7", winner_id: null },
  { id: 'm29', fixture_id: "29", home_team_id: "t9", away_team_id: "t11", home_score: null, away_score: null, status: "NS", date: "2026-06-19T21:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "C", stadium_id: "s10", winner_id: null },
  { id: 'm30', fixture_id: "30", home_team_id: "t12", away_team_id: "t10", home_score: null, away_score: null, status: "NS", date: "2026-06-19T18:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "C", stadium_id: "s9", winner_id: null },
  { id: 'm31', fixture_id: "31", home_team_id: "t13", away_team_id: "t15", home_score: null, away_score: null, status: "NS", date: "2026-06-19T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "D", stadium_id: "s14", winner_id: null },
  { id: 'm32', fixture_id: "32", home_team_id: "t16", away_team_id: "t14", home_score: null, away_score: null, status: "NS", date: "2026-06-19T20:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "D", stadium_id: "s15", winner_id: null },
  { id: 'm33', fixture_id: "33", home_team_id: "t17", away_team_id: "t19", home_score: null, away_score: null, status: "NS", date: "2026-06-20T16:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "E", stadium_id: "s12", winner_id: null },
  { id: 'm34', fixture_id: "34", home_team_id: "t20", away_team_id: "t18", home_score: null, away_score: null, status: "NS", date: "2026-06-20T19:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "E", stadium_id: "s6", winner_id: null },
  { id: 'm35', fixture_id: "35", home_team_id: "t21", away_team_id: "t23", home_score: null, away_score: null, status: "NS", date: "2026-06-20T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "F", stadium_id: "s5", winner_id: null },
  { id: 'm36', fixture_id: "36", home_team_id: "t24", away_team_id: "t22", home_score: null, away_score: null, status: "NS", date: "2026-06-20T22:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "F", stadium_id: "s3", winner_id: null },
  { id: 'm37', fixture_id: "37", home_team_id: "t25", away_team_id: "t27", home_score: null, away_score: null, status: "NS", date: "2026-06-21T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "G", stadium_id: "s16", winner_id: null },
  { id: 'm38', fixture_id: "38", home_team_id: "t28", away_team_id: "t26", home_score: null, away_score: null, status: "NS", date: "2026-06-21T18:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "G", stadium_id: "s13", winner_id: null },
  { id: 'm39', fixture_id: "39", home_team_id: "t29", away_team_id: "t31", home_score: null, away_score: null, status: "NS", date: "2026-06-21T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "H", stadium_id: "s7", winner_id: null },
  { id: 'm40', fixture_id: "40", home_team_id: "t32", away_team_id: "t30", home_score: null, away_score: null, status: "NS", date: "2026-06-21T18:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "H", stadium_id: "s8", winner_id: null },
  { id: 'm41', fixture_id: "41", home_team_id: "t33", away_team_id: "t35", home_score: null, away_score: null, status: "NS", date: "2026-06-22T17:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "I", stadium_id: "s10", winner_id: null },
  { id: 'm42', fixture_id: "42", home_team_id: "t36", away_team_id: "t34", home_score: null, away_score: null, status: "NS", date: "2026-06-22T20:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "I", stadium_id: "s11", winner_id: null },
  { id: 'm43', fixture_id: "43", home_team_id: "t37", away_team_id: "t39", home_score: null, away_score: null, status: "NS", date: "2026-06-22T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "J", stadium_id: "s4", winner_id: null },
  { id: 'm44', fixture_id: "44", home_team_id: "t40", away_team_id: "t38", home_score: null, away_score: null, status: "NS", date: "2026-06-22T20:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "J", stadium_id: "s15", winner_id: null },
  { id: 'm45', fixture_id: "45", home_team_id: "t41", away_team_id: "t43", home_score: null, away_score: null, status: "NS", date: "2026-06-23T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "K", stadium_id: "s5", winner_id: null },
  { id: 'm46', fixture_id: "46", home_team_id: "t48", away_team_id: "t46", home_score: null, away_score: null, status: "NS", date: "2026-06-23T19:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "L", stadium_id: "s12", winner_id: null },
  { id: 'm47', fixture_id: "47", home_team_id: "t44", away_team_id: "t42", home_score: null, away_score: null, status: "NS", date: "2026-06-23T20:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "K", stadium_id: "s2", winner_id: null },
  { id: 'm48', fixture_id: "48", home_team_id: "t45", away_team_id: "t47", home_score: null, away_score: null, status: "NS", date: "2026-06-23T16:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "L", stadium_id: "s9", winner_id: null },
  { id: 'm49', fixture_id: "49", home_team_id: "t12", away_team_id: "t9", home_score: null, away_score: null, status: "NS", date: "2026-06-24T18:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "C", stadium_id: "s8", winner_id: null },
  { id: 'm50', fixture_id: "50", home_team_id: "t10", away_team_id: "t11", home_score: null, away_score: null, status: "NS", date: "2026-06-24T18:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "C", stadium_id: "s7", winner_id: null },
  { id: 'm51', fixture_id: "51", home_team_id: "t2", away_team_id: "t3", home_score: null, away_score: null, status: "NS", date: "2026-06-24T19:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "A", stadium_id: "s3", winner_id: null },
  { id: 'm52', fixture_id: "52", home_team_id: "t4", away_team_id: "t1", home_score: null, away_score: null, status: "NS", date: "2026-06-24T19:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "A", stadium_id: "s1", winner_id: null },
  { id: 'm53', fixture_id: "53", home_team_id: "t6", away_team_id: "t7", home_score: null, away_score: null, status: "NS", date: "2026-06-24T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "B", stadium_id: "s14", winner_id: null },
  { id: 'm54', fixture_id: "54", home_team_id: "t8", away_team_id: "t5", home_score: null, away_score: null, status: "NS", date: "2026-06-24T12:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "B", stadium_id: "s13", winner_id: null },
  { id: 'm55', fixture_id: "55", home_team_id: "t18", away_team_id: "t19", home_score: null, away_score: null, status: "NS", date: "2026-06-25T16:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "E", stadium_id: "s10", winner_id: null },
  { id: 'm56', fixture_id: "56", home_team_id: "t20", away_team_id: "t17", home_score: null, away_score: null, status: "NS", date: "2026-06-25T16:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "E", stadium_id: "s11", winner_id: null },
  { id: 'm57', fixture_id: "57", home_team_id: "t14", away_team_id: "t15", home_score: null, away_score: null, status: "NS", date: "2026-06-25T19:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "D", stadium_id: "s15", winner_id: null },
  { id: 'm58', fixture_id: "58", home_team_id: "t16", away_team_id: "t13", home_score: null, away_score: null, status: "NS", date: "2026-06-25T19:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "D", stadium_id: "s16", winner_id: null },
  { id: 'm59', fixture_id: "59", home_team_id: "t22", away_team_id: "t23", home_score: null, away_score: null, status: "NS", date: "2026-06-25T18:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "F", stadium_id: "s4", winner_id: null },
  { id: 'm60', fixture_id: "60", home_team_id: "t24", away_team_id: "t21", home_score: null, away_score: null, status: "NS", date: "2026-06-25T18:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "F", stadium_id: "s6", winner_id: null },
  { id: 'm61', fixture_id: "61", home_team_id: "t34", away_team_id: "t35", home_score: null, away_score: null, status: "NS", date: "2026-06-26T15:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "I", stadium_id: "s12", winner_id: null },
  { id: 'm62', fixture_id: "62", home_team_id: "t36", away_team_id: "t33", home_score: null, away_score: null, status: "NS", date: "2026-06-26T15:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "I", stadium_id: "s9", winner_id: null },
  { id: 'm63', fixture_id: "63", home_team_id: "t26", away_team_id: "t27", home_score: null, away_score: null, status: "NS", date: "2026-06-26T20:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "G", stadium_id: "s14", winner_id: null },
  { id: 'm64', fixture_id: "64", home_team_id: "t28", away_team_id: "t25", home_score: null, away_score: null, status: "NS", date: "2026-06-26T20:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "G", stadium_id: "s13", winner_id: null },
  { id: 'm65', fixture_id: "65", home_team_id: "t30", away_team_id: "t31", home_score: null, away_score: null, status: "NS", date: "2026-06-26T19:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "H", stadium_id: "s5", winner_id: null },
  { id: 'm66', fixture_id: "66", home_team_id: "t32", away_team_id: "t29", home_score: null, away_score: null, status: "NS", date: "2026-06-26T18:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "H", stadium_id: "s2", winner_id: null },
  { id: 'm67', fixture_id: "67", home_team_id: "t48", away_team_id: "t45", home_score: null, away_score: null, status: "NS", date: "2026-06-27T17:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "L", stadium_id: "s11", winner_id: null },
  { id: 'm68', fixture_id: "68", home_team_id: "t46", away_team_id: "t47", home_score: null, away_score: null, status: "NS", date: "2026-06-27T17:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "L", stadium_id: "s10", winner_id: null },
  { id: 'm69', fixture_id: "69", home_team_id: "t38", away_team_id: "t39", home_score: null, away_score: null, status: "NS", date: "2026-06-27T21:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "J", stadium_id: "s6", winner_id: null },
  { id: 'm70', fixture_id: "70", home_team_id: "t40", away_team_id: "t37", home_score: null, away_score: null, status: "NS", date: "2026-06-27T21:00:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "J", stadium_id: "s4", winner_id: null },
  { id: 'm71', fixture_id: "71", home_team_id: "t44", away_team_id: "t41", home_score: null, away_score: null, status: "NS", date: "2026-06-27T19:30:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "K", stadium_id: "s8", winner_id: null },
  { id: 'm72', fixture_id: "72", home_team_id: "t42", away_team_id: "t43", home_score: null, away_score: null, status: "NS", date: "2026-06-27T19:30:00.000Z", round: "group" as MatchRound, stage_order: 1, group: "K", stadium_id: "s7", winner_id: null },
  { id: 'm73', fixture_id: "73", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-06-28T12:00:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s16", bracket_position: 1, winner_id: null },
  { id: 'm74', fixture_id: "74", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-06-29T16:30:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s9", bracket_position: 2, winner_id: null },
  { id: 'm75', fixture_id: "75", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-06-29T19:00:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s3", bracket_position: 3, winner_id: null },
  { id: 'm76', fixture_id: "76", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-06-29T12:00:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s5", bracket_position: 4, winner_id: null },
  { id: 'm77', fixture_id: "77", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-06-30T17:00:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s11", bracket_position: 5, winner_id: null },
  { id: 'm78', fixture_id: "78", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-06-30T12:00:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s4", bracket_position: 6, winner_id: null },
  { id: 'm79', fixture_id: "79", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-06-30T19:00:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s1", bracket_position: 7, winner_id: null },
  { id: 'm80', fixture_id: "80", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-01T12:00:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s7", bracket_position: 8, winner_id: null },
  { id: 'm81', fixture_id: "81", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-01T17:00:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s15", bracket_position: 9, winner_id: null },
  { id: 'm82', fixture_id: "82", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-01T13:00:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s14", bracket_position: 10, winner_id: null },
  { id: 'm83', fixture_id: "83", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-02T19:00:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s12", bracket_position: 11, winner_id: null },
  { id: 'm84', fixture_id: "84", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-02T12:00:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s16", bracket_position: 12, winner_id: null },
  { id: 'm85', fixture_id: "85", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-02T20:00:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s13", bracket_position: 13, winner_id: null },
  { id: 'm86', fixture_id: "86", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-03T18:00:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s8", bracket_position: 14, winner_id: null },
  { id: 'm87', fixture_id: "87", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-03T20:30:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s6", bracket_position: 15, winner_id: null },
  { id: 'm88', fixture_id: "88", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-03T13:00:00.000Z", round: "R32" as MatchRound, stage_order: 2, stadium_id: "s4", bracket_position: 16, winner_id: null },
  { id: 'm89', fixture_id: "89", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-04T17:00:00.000Z", round: "R16" as MatchRound, stage_order: 3, stadium_id: "s10", bracket_position: 1, winner_id: null },
  { id: 'm90', fixture_id: "90", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-04T12:00:00.000Z", round: "R16" as MatchRound, stage_order: 3, stadium_id: "s5", bracket_position: 2, winner_id: null },
  { id: 'm91', fixture_id: "91", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-05T16:00:00.000Z", round: "R16" as MatchRound, stage_order: 3, stadium_id: "s11", bracket_position: 3, winner_id: null },
  { id: 'm92', fixture_id: "92", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-05T18:00:00.000Z", round: "R16" as MatchRound, stage_order: 3, stadium_id: "s1", bracket_position: 4, winner_id: null },
  { id: 'm93', fixture_id: "93", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-06T14:00:00.000Z", round: "R16" as MatchRound, stage_order: 3, stadium_id: "s4", bracket_position: 5, winner_id: null },
  { id: 'm94', fixture_id: "94", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-06T17:00:00.000Z", round: "R16" as MatchRound, stage_order: 3, stadium_id: "s14", bracket_position: 6, winner_id: null },
  { id: 'm95', fixture_id: "95", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-07T12:00:00.000Z", round: "R16" as MatchRound, stage_order: 3, stadium_id: "s7", bracket_position: 7, winner_id: null },
  { id: 'm96', fixture_id: "96", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-07T13:00:00.000Z", round: "R16" as MatchRound, stage_order: 3, stadium_id: "s13", bracket_position: 8, winner_id: null },
  { id: 'm97', fixture_id: "97", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-09T16:00:00.000Z", round: "QF" as MatchRound, stage_order: 4, stadium_id: "s9", bracket_position: 1, winner_id: null },
  { id: 'm98', fixture_id: "98", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-10T12:00:00.000Z", round: "QF" as MatchRound, stage_order: 4, stadium_id: "s16", bracket_position: 2, winner_id: null },
  { id: 'm99', fixture_id: "99", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-11T17:00:00.000Z", round: "QF" as MatchRound, stage_order: 4, stadium_id: "s8", bracket_position: 3, winner_id: null },
  { id: 'm100', fixture_id: "100", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-11T20:00:00.000Z", round: "QF" as MatchRound, stage_order: 4, stadium_id: "s6", bracket_position: 4, winner_id: null },
  { id: 'm101', fixture_id: "101", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-14T14:00:00.000Z", round: "SF" as MatchRound, stage_order: 5, stadium_id: "s4", bracket_position: 1, winner_id: null },
  { id: 'm102', fixture_id: "102", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-15T15:00:00.000Z", round: "SF" as MatchRound, stage_order: 5, stadium_id: "s7", bracket_position: 2, winner_id: null },
  { id: 'm103', fixture_id: "103", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-18T17:00:00.000Z", round: "THIRD" as MatchRound, stage_order: 6, stadium_id: "s8", bracket_position: 1, winner_id: null },
  { id: 'm104', fixture_id: "104", home_team_id: "", away_team_id: "", home_score: null, away_score: null, status: "NS", date: "2026-07-19T15:00:00.000Z", round: "FINAL" as MatchRound, stage_order: 6, stadium_id: "s11", bracket_position: 1, winner_id: null }
];

// ===== Standings (all 0 — tournament hasn't started) =====
export const STANDINGS: StandingsRow[] = [
  { id: "a-t1", group: "A", team_id: "t1", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "a-t2", group: "A", team_id: "t2", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "a-t3", group: "A", team_id: "t3", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "a-t4", group: "A", team_id: "t4", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "b-t5", group: "B", team_id: "t5", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "b-t6", group: "B", team_id: "t6", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "b-t7", group: "B", team_id: "t7", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "b-t8", group: "B", team_id: "t8", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "c-t9", group: "C", team_id: "t9", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "c-t10", group: "C", team_id: "t10", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "c-t11", group: "C", team_id: "t11", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "c-t12", group: "C", team_id: "t12", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "d-t13", group: "D", team_id: "t13", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "d-t14", group: "D", team_id: "t14", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "d-t15", group: "D", team_id: "t15", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "d-t16", group: "D", team_id: "t16", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "e-t17", group: "E", team_id: "t17", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "e-t18", group: "E", team_id: "t18", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "e-t19", group: "E", team_id: "t19", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "e-t20", group: "E", team_id: "t20", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "f-t21", group: "F", team_id: "t21", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "f-t22", group: "F", team_id: "t22", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "f-t23", group: "F", team_id: "t23", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "f-t24", group: "F", team_id: "t24", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "g-t25", group: "G", team_id: "t25", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "g-t26", group: "G", team_id: "t26", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "g-t27", group: "G", team_id: "t27", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "g-t28", group: "G", team_id: "t28", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "h-t29", group: "H", team_id: "t29", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "h-t30", group: "H", team_id: "t30", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "h-t31", group: "H", team_id: "t31", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "h-t32", group: "H", team_id: "t32", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "i-t33", group: "I", team_id: "t33", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "i-t34", group: "I", team_id: "t34", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "i-t35", group: "I", team_id: "t35", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "i-t36", group: "I", team_id: "t36", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "j-t37", group: "J", team_id: "t37", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "j-t38", group: "J", team_id: "t38", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "j-t39", group: "J", team_id: "t39", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "j-t40", group: "J", team_id: "t40", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "k-t41", group: "K", team_id: "t41", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "k-t42", group: "K", team_id: "t42", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "k-t43", group: "K", team_id: "t43", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "k-t44", group: "K", team_id: "t44", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "l-t45", group: "L", team_id: "t45", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "l-t46", group: "L", team_id: "t46", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "l-t47", group: "L", team_id: "t47", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 },
  { id: "l-t48", group: "L", team_id: "t48", played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 }
];

// ===== Players (extracted from scorers — 49 players) =====
export const PLAYERS: Player[] = [
  {
    "id": "p-15-nestoryirankunda",
    "name": "Nestory Irankunda",
    "name_ar": "Nestory Irankunda",
    "team_id": "t15",
    "position": "FW",
    "nationality": "Australia",
    "nationality_ar": "Australia",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-15-cmetcalfe",
    "name": "C. Metcalfe",
    "name_ar": "C. Metcalfe",
    "team_id": "t15",
    "position": "FW",
    "nationality": "Australia",
    "nationality_ar": "Australia",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-7-bkhoukhi905",
    "name": "B. Khoukhi 90'+5'",
    "name_ar": "B. Khoukhi 90'+5'",
    "team_id": "t7",
    "position": "FW",
    "nationality": "Qatar",
    "nationality_ar": "Qatar",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-8-breelembolo",
    "name": "Breel Embolo",
    "name_ar": "Breel Embolo",
    "team_id": "t8",
    "position": "FW",
    "nationality": "Switzerland",
    "nationality_ar": "Switzerland",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-12-jmcginn",
    "name": "J. McGinn",
    "name_ar": "J. McGinn",
    "team_id": "t12",
    "position": "FW",
    "nationality": "Scotland",
    "nationality_ar": "Scotland",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-3-ibhwang",
    "name": "I.B. Hwang",
    "name_ar": "I.B. Hwang",
    "team_id": "t3",
    "position": "FW",
    "nationality": "South Korea",
    "nationality_ar": "South Korea",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-3-hgoh",
    "name": "H.G. Oh",
    "name_ar": "H.G. Oh",
    "team_id": "t3",
    "position": "FW",
    "nationality": "South Korea",
    "nationality_ar": "South Korea",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-4-lkrej",
    "name": "L. Krejčí",
    "name_ar": "L. Krejčí",
    "team_id": "t4",
    "position": "FW",
    "nationality": "Czech Republic",
    "nationality_ar": "Czech Republic",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-13-dbobadilla",
    "name": "D. Bobadilla",
    "name_ar": "D. Bobadilla",
    "team_id": "t13",
    "position": "FW",
    "nationality": "United States",
    "nationality_ar": "United States",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-13-fbalogun",
    "name": "F. Balogun",
    "name_ar": "F. Balogun",
    "team_id": "t13",
    "position": "FW",
    "nationality": "United States",
    "nationality_ar": "United States",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-14-maurcio",
    "name": "Maurício",
    "name_ar": "Maurício",
    "team_id": "t14",
    "position": "FW",
    "nationality": "Paraguay",
    "nationality_ar": "Paraguay",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-33-kmbapp",
    "name": "K. Mbappé",
    "name_ar": "كيليان مبابي",
    "team_id": "t33",
    "position": "FW",
    "nationality": "France",
    "nationality_ar": "France",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-33-bbarcola",
    "name": "B. Barcola",
    "name_ar": "B. Barcola",
    "team_id": "t33",
    "position": "FW",
    "nationality": "France",
    "nationality_ar": "France",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-34-imbaye905",
    "name": "I. Mbaye 90+5'",
    "name_ar": "I. Mbaye 90+5'",
    "team_id": "t34",
    "position": "FW",
    "nationality": "Senegal",
    "nationality_ar": "Senegal",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-35-aymenhussein",
    "name": "Aymen Hussein",
    "name_ar": "Aymen Hussein",
    "team_id": "t35",
    "position": "FW",
    "nationality": "Iraq",
    "nationality_ar": "Iraq",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-36-erlinghaaland",
    "name": "Erling Haaland",
    "name_ar": "إيرلينغ هالاند",
    "team_id": "t36",
    "position": "FW",
    "nationality": "Norway",
    "nationality_ar": "Norway",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-36-leostigrd",
    "name": "Leo Østigård",
    "name_ar": "Leo Østigård",
    "team_id": "t36",
    "position": "FW",
    "nationality": "Norway",
    "nationality_ar": "Norway",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-19-adiallo",
    "name": "A. Diallo",
    "name_ar": "A. Diallo",
    "team_id": "t19",
    "position": "FW",
    "nationality": "Ivory Coast",
    "nationality_ar": "Ivory Coast",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-17-felixnmecha",
    "name": "Felix Nmecha",
    "name_ar": "Felix Nmecha",
    "team_id": "t17",
    "position": "FW",
    "nationality": "Germany",
    "nationality_ar": "Germany",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-17-nschlotterbeck",
    "name": "N. Schlotterbeck",
    "name_ar": "N. Schlotterbeck",
    "team_id": "t17",
    "position": "FW",
    "nationality": "Germany",
    "nationality_ar": "Germany",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-17-jmusiala",
    "name": "J. Musiala",
    "name_ar": "J. Musiala",
    "team_id": "t17",
    "position": "FW",
    "nationality": "Germany",
    "nationality_ar": "Germany",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-17-nbrown",
    "name": "N. Brown",
    "name_ar": "N. Brown",
    "team_id": "t17",
    "position": "FW",
    "nationality": "Germany",
    "nationality_ar": "Germany",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-17-dundav",
    "name": "D. Undav",
    "name_ar": "D. Undav",
    "team_id": "t17",
    "position": "FW",
    "nationality": "Germany",
    "nationality_ar": "Germany",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-17-khavertz",
    "name": "K. Havertz",
    "name_ar": "K. Havertz",
    "team_id": "t17",
    "position": "FW",
    "nationality": "Germany",
    "nationality_ar": "Germany",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-18-lcomenencia",
    "name": "L. Comenencia",
    "name_ar": "L. Comenencia",
    "team_id": "t18",
    "position": "FW",
    "nationality": "Curaçao",
    "nationality_ar": "Curaçao",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-23-yayari",
    "name": "Y.Ayari",
    "name_ar": "Y.Ayari",
    "team_id": "t23",
    "position": "FW",
    "nationality": "Sweden",
    "nationality_ar": "Sweden",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-23-aisak",
    "name": "A. Isak",
    "name_ar": "A. Isak",
    "team_id": "t23",
    "position": "FW",
    "nationality": "Sweden",
    "nationality_ar": "Sweden",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-23-vgykeres",
    "name": "V. Gyökeres",
    "name_ar": "V. Gyökeres",
    "team_id": "t23",
    "position": "FW",
    "nationality": "Sweden",
    "nationality_ar": "Sweden",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-23-msvanberg",
    "name": "M. Svanberg",
    "name_ar": "M. Svanberg",
    "team_id": "t23",
    "position": "FW",
    "nationality": "Sweden",
    "nationality_ar": "Sweden",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-24-orekik",
    "name": "O. Rekik",
    "name_ar": "O. Rekik",
    "team_id": "t24",
    "position": "FW",
    "nationality": "Tunisia",
    "nationality_ar": "Tunisia",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-9-vjnior",
    "name": "V. Júnior",
    "name_ar": "V. Júnior",
    "team_id": "t9",
    "position": "FW",
    "nationality": "Brazil",
    "nationality_ar": "Brazil",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-10-isaibari",
    "name": "I. Saibari",
    "name_ar": "I. Saibari",
    "team_id": "t10",
    "position": "FW",
    "nationality": "Morocco",
    "nationality_ar": "Morocco",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-21-virgilvandijk",
    "name": "Virgil van Dijk",
    "name_ar": "Virgil van Dijk",
    "team_id": "t21",
    "position": "FW",
    "nationality": "Netherlands",
    "nationality_ar": "Netherlands",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-21-csummerville",
    "name": "C. Summerville",
    "name_ar": "C. Summerville",
    "team_id": "t21",
    "position": "FW",
    "nationality": "Netherlands",
    "nationality_ar": "Netherlands",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-22-knakamura",
    "name": "K. Nakamura",
    "name_ar": "K. Nakamura",
    "team_id": "t22",
    "position": "FW",
    "nationality": "Japan",
    "nationality_ar": "Japan",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-22-kogawa",
    "name": "K. Ogawa",
    "name_ar": "K. Ogawa",
    "team_id": "t22",
    "position": "FW",
    "nationality": "Japan",
    "nationality_ar": "Japan",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-31-abdulelahalamri",
    "name": "Abdulelah Al-Amri",
    "name_ar": "Abdulelah Al-Amri",
    "team_id": "t31",
    "position": "FW",
    "nationality": "Saudi Arabia",
    "nationality_ar": "Saudi Arabia",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-32-maximilianoarajo",
    "name": "Maximiliano Araújo",
    "name_ar": "Maximiliano Araújo",
    "team_id": "t32",
    "position": "FW",
    "nationality": "Uruguay",
    "nationality_ar": "Uruguay",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-39-rvmanvashmid",
    "name": "Rvmanv Ashmid",
    "name_ar": "Rvmanv Ashmid",
    "team_id": "t39",
    "position": "FW",
    "nationality": "Austria",
    "nationality_ar": "Austria",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-39-iznalarb",
    "name": "Izn Alarb",
    "name_ar": "Izn Alarb",
    "team_id": "t39",
    "position": "FW",
    "nationality": "Austria",
    "nationality_ar": "Austria",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-40-aliavlvan",
    "name": "Ali Avlvan",
    "name_ar": "Ali Avlvan",
    "team_id": "t40",
    "position": "FW",
    "nationality": "Jordan",
    "nationality_ar": "Jordan",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-5-clarin",
    "name": "C. Larin",
    "name_ar": "C. Larin",
    "team_id": "t5",
    "position": "FW",
    "nationality": "Canada",
    "nationality_ar": "Canada",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-6-jovoluki",
    "name": "Jovo Lukić",
    "name_ar": "Jovo Lukić",
    "team_id": "t6",
    "position": "FW",
    "nationality": "Bosnia and Herzegovina",
    "nationality_ar": "Bosnia and Herzegovina",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-27-raminrezaiian",
    "name": "Ramin Rezaiian",
    "name_ar": "Ramin Rezaiian",
    "team_id": "t27",
    "position": "FW",
    "nationality": "Iran",
    "nationality_ar": "Iran",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-27-mohammadmohebi",
    "name": "Mohammad Mohebi",
    "name_ar": "Mohammad Mohebi",
    "team_id": "t27",
    "position": "FW",
    "nationality": "Iran",
    "nationality_ar": "Iran",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-28-elijahjust",
    "name": "Elijah Just",
    "name_ar": "Elijah Just",
    "team_id": "t28",
    "position": "FW",
    "nationality": "New Zealand",
    "nationality_ar": "New Zealand",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-37-lionelmessi",
    "name": "Lionel Messi",
    "name_ar": "ليونيل ميسي",
    "team_id": "t37",
    "position": "FW",
    "nationality": "Argentina",
    "nationality_ar": "Argentina",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-25-mohamedhany",
    "name": "Mohamed Hany",
    "name_ar": "Mohamed Hany",
    "team_id": "t25",
    "position": "FW",
    "nationality": "Belgium",
    "nationality_ar": "Belgium",
    "photo": "⚽",
    "number": 9
  },
  {
    "id": "p-26-emamashour",
    "name": "Emam Ashour",
    "name_ar": "Emam Ashour",
    "team_id": "t26",
    "position": "FW",
    "nationality": "Egypt",
    "nationality_ar": "Egypt",
    "photo": "⚽",
    "number": 9
  }
];

// ===== Top scorers/assists (from live data) =====
export const TOP_SCORERS: TopScorerRow[] = [
  {
    "player_id": "p-37-lionelmessi",
    "team_id": "t37",
    "goals": 3,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-36-erlinghaaland",
    "team_id": "t36",
    "goals": 2,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-28-elijahjust",
    "team_id": "t28",
    "goals": 2,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-15-nestoryirankunda",
    "team_id": "t15",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-15-cmetcalfe",
    "team_id": "t15",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-7-bkhoukhi905",
    "team_id": "t7",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-8-breelembolo",
    "team_id": "t8",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-12-jmcginn",
    "team_id": "t12",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-3-ibhwang",
    "team_id": "t3",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-3-hgoh",
    "team_id": "t3",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-4-lkrej",
    "team_id": "t4",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-13-dbobadilla",
    "team_id": "t13",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-13-fbalogun",
    "team_id": "t13",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-14-maurcio",
    "team_id": "t14",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-33-kmbapp",
    "team_id": "t33",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-33-bbarcola",
    "team_id": "t33",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-34-imbaye905",
    "team_id": "t34",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-35-aymenhussein",
    "team_id": "t35",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-36-leostigrd",
    "team_id": "t36",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-19-adiallo",
    "team_id": "t19",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-17-felixnmecha",
    "team_id": "t17",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-17-nschlotterbeck",
    "team_id": "t17",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-17-jmusiala",
    "team_id": "t17",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-17-nbrown",
    "team_id": "t17",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-17-dundav",
    "team_id": "t17",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-17-khavertz",
    "team_id": "t17",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-18-lcomenencia",
    "team_id": "t18",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-23-yayari",
    "team_id": "t23",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-23-aisak",
    "team_id": "t23",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-23-vgykeres",
    "team_id": "t23",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-23-msvanberg",
    "team_id": "t23",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-24-orekik",
    "team_id": "t24",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-9-vjnior",
    "team_id": "t9",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-10-isaibari",
    "team_id": "t10",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-21-virgilvandijk",
    "team_id": "t21",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-21-csummerville",
    "team_id": "t21",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-22-knakamura",
    "team_id": "t22",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-22-kogawa",
    "team_id": "t22",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-31-abdulelahalamri",
    "team_id": "t31",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-32-maximilianoarajo",
    "team_id": "t32",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-39-rvmanvashmid",
    "team_id": "t39",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-39-iznalarb",
    "team_id": "t39",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-40-aliavlvan",
    "team_id": "t40",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-5-clarin",
    "team_id": "t5",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-6-jovoluki",
    "team_id": "t6",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-27-raminrezaiian",
    "team_id": "t27",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-27-mohammadmohebi",
    "team_id": "t27",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-25-mohamedhany",
    "team_id": "t25",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  },
  {
    "player_id": "p-26-emamashour",
    "team_id": "t26",
    "goals": 1,
    "assists": 0,
    "penalties": 0,
    "matches_played": 1
  }
];
export const TOP_ASSISTS: TopAssistRow[] = [];

// ===== Index lookups =====
export const TEAM_BY_ID: Record<string, Team> = TEAMS.reduce((acc, t) => { acc[t.id] = t; return acc; }, {} as Record<string, Team>);
export const PLAYER_BY_ID: Record<string, Player> = PLAYERS.reduce((acc, p) => { acc[p.id] = p; return acc; }, {} as Record<string, Player>);
export const MATCH_BY_ID: Record<string, Match> = ALL_MATCHES.reduce((acc, m) => { acc[m.id] = m; return acc; }, {} as Record<string, Match>);
export const STADIUM_BY_ID: Record<string, Stadium> = STADIUMS.reduce((acc, s) => { acc[s.id] = s; return acc; }, {} as Record<string, Stadium>);
export const TEAMS_BY_GROUP: Record<string, Team[]> = TEAMS.reduce((acc, t) => {
  if (!acc[t.group]) acc[t.group] = [];
  acc[t.group].push(t);
  return acc;
}, {} as Record<string, Team[]>);
