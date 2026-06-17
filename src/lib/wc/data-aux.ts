// ============================================================
// World Cup 2026 — Auxiliary data (players, events, scorers)
// Auto-generated from worldcup26.ir match data
// Generated: 2026-06-17T14:01:32.594Z
// ============================================================

import type { Player, MatchEvent, TopScorerRow, TopAssistRow, MatchStatistics } from './types';

// ===== Players extracted from scorers (49 players) =====
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

// ===== Match events (53 events) =====
export const MATCH_EVENTS: MatchEvent[] = [
  {
    "id": "m6-g-27-0",
    "matchId": "m6",
    "teamId": "t15",
    "type": "goal",
    "player": "Nestory Irankunda",
    "playerAr": "Nestory Irankunda",
    "minute": 27
  },
  {
    "id": "m6-g-75-1",
    "matchId": "m6",
    "teamId": "t15",
    "type": "goal",
    "player": "C. Metcalfe",
    "playerAr": "C. Metcalfe",
    "minute": 75
  },
  {
    "id": "m8-g-45-0",
    "matchId": "m8",
    "teamId": "t7",
    "type": "goal",
    "player": "B. Khoukhi 90'+5'",
    "playerAr": "B. Khoukhi 90'+5'",
    "minute": 45
  },
  {
    "id": "m8-g-17-0-away",
    "matchId": "m8",
    "teamId": "t8",
    "type": "goal",
    "player": "Breel Embolo",
    "playerAr": "Breel Embolo",
    "minute": 17,
    "detail": "p"
  },
  {
    "id": "m5-g-28-0-away",
    "matchId": "m5",
    "teamId": "t12",
    "type": "goal",
    "player": "J. McGinn",
    "playerAr": "J. McGinn",
    "minute": 28
  },
  {
    "id": "m2-g-67-0",
    "matchId": "m2",
    "teamId": "t3",
    "type": "goal",
    "player": "I.B. Hwang",
    "playerAr": "I.B. Hwang",
    "minute": 67
  },
  {
    "id": "m2-g-80-1",
    "matchId": "m2",
    "teamId": "t3",
    "type": "goal",
    "player": "H.G. Oh",
    "playerAr": "H.G. Oh",
    "minute": 80
  },
  {
    "id": "m2-g-59-0-away",
    "matchId": "m2",
    "teamId": "t4",
    "type": "goal",
    "player": "L. Krejčí",
    "playerAr": "L. Krejčí",
    "minute": 59
  },
  {
    "id": "m4-g-7-0",
    "matchId": "m4",
    "teamId": "t13",
    "type": "goal",
    "player": "D. Bobadilla",
    "playerAr": "D. Bobadilla",
    "minute": 7,
    "detail": "OG"
  },
  {
    "id": "m4-g-31-1",
    "matchId": "m4",
    "teamId": "t13",
    "type": "goal",
    "player": "F. Balogun",
    "playerAr": "F. Balogun",
    "minute": 31
  },
  {
    "id": "m4-g-73-0-away",
    "matchId": "m4",
    "teamId": "t14",
    "type": "goal",
    "player": "Maurício",
    "playerAr": "Maurício",
    "minute": 73
  },
  {
    "id": "m17-g-66-0",
    "matchId": "m17",
    "teamId": "t33",
    "type": "goal",
    "player": "K. Mbappé",
    "playerAr": "كيليان مبابي",
    "minute": 66
  },
  {
    "id": "m17-g-82-1",
    "matchId": "m17",
    "teamId": "t33",
    "type": "goal",
    "player": "B. Barcola",
    "playerAr": "B. Barcola",
    "minute": 82
  },
  {
    "id": "m17-g-45-0-away",
    "matchId": "m17",
    "teamId": "t34",
    "type": "goal",
    "player": "I. Mbaye 90+5'",
    "playerAr": "I. Mbaye 90+5'",
    "minute": 45
  },
  {
    "id": "m18-g-39-0",
    "matchId": "m18",
    "teamId": "t35",
    "type": "goal",
    "player": "Aymen Hussein",
    "playerAr": "Aymen Hussein",
    "minute": 39
  },
  {
    "id": "m18-g-29-0-away",
    "matchId": "m18",
    "teamId": "t36",
    "type": "goal",
    "player": "Erling Haaland",
    "playerAr": "إيرلينغ هالاند",
    "minute": 29
  },
  {
    "id": "m18-g-43-1-away",
    "matchId": "m18",
    "teamId": "t36",
    "type": "goal",
    "player": "Erling Haaland",
    "playerAr": "إيرلينغ هالاند",
    "minute": 43
  },
  {
    "id": "m18-g-76-2-away",
    "matchId": "m18",
    "teamId": "t36",
    "type": "goal",
    "player": "Leo Østigård",
    "playerAr": "Leo Østigård",
    "minute": 76
  },
  {
    "id": "m9-g-90-0",
    "matchId": "m9",
    "teamId": "t19",
    "type": "goal",
    "player": "A. Diallo",
    "playerAr": "A. Diallo",
    "minute": 90
  },
  {
    "id": "m10-g-7-0",
    "matchId": "m10",
    "teamId": "t17",
    "type": "goal",
    "player": "Felix Nmecha",
    "playerAr": "Felix Nmecha",
    "minute": 7
  },
  {
    "id": "m10-g-38-1",
    "matchId": "m10",
    "teamId": "t17",
    "type": "goal",
    "player": "N. Schlotterbeck",
    "playerAr": "N. Schlotterbeck",
    "minute": 38
  },
  {
    "id": "m10-g-47-2",
    "matchId": "m10",
    "teamId": "t17",
    "type": "goal",
    "player": "J. Musiala",
    "playerAr": "J. Musiala",
    "minute": 47
  },
  {
    "id": "m10-g-68-3",
    "matchId": "m10",
    "teamId": "t17",
    "type": "goal",
    "player": "N. Brown",
    "playerAr": "N. Brown",
    "minute": 68
  },
  {
    "id": "m10-g-78-4",
    "matchId": "m10",
    "teamId": "t17",
    "type": "goal",
    "player": "D. Undav",
    "playerAr": "D. Undav",
    "minute": 78
  },
  {
    "id": "m10-g-88-5",
    "matchId": "m10",
    "teamId": "t17",
    "type": "goal",
    "player": "K. Havertz",
    "playerAr": "K. Havertz",
    "minute": 88
  },
  {
    "id": "m10-g-21-0-away",
    "matchId": "m10",
    "teamId": "t18",
    "type": "goal",
    "player": "L. Comenencia",
    "playerAr": "L. Comenencia",
    "minute": 21
  },
  {
    "id": "m12-g-7-0",
    "matchId": "m12",
    "teamId": "t23",
    "type": "goal",
    "player": "Y.Ayari",
    "playerAr": "Y.Ayari",
    "minute": 7
  },
  {
    "id": "m12-g-30-1",
    "matchId": "m12",
    "teamId": "t23",
    "type": "goal",
    "player": "A. Isak",
    "playerAr": "A. Isak",
    "minute": 30
  },
  {
    "id": "m12-g-59-2",
    "matchId": "m12",
    "teamId": "t23",
    "type": "goal",
    "player": "V. Gyökeres",
    "playerAr": "V. Gyökeres",
    "minute": 59
  },
  {
    "id": "m12-g-84-3",
    "matchId": "m12",
    "teamId": "t23",
    "type": "goal",
    "player": "M. Svanberg",
    "playerAr": "M. Svanberg",
    "minute": 84
  },
  {
    "id": "m12-g-43-0-away",
    "matchId": "m12",
    "teamId": "t24",
    "type": "goal",
    "player": "O. Rekik",
    "playerAr": "O. Rekik",
    "minute": 43
  },
  {
    "id": "m7-g-32-0",
    "matchId": "m7",
    "teamId": "t9",
    "type": "goal",
    "player": "V. Júnior",
    "playerAr": "V. Júnior",
    "minute": 32
  },
  {
    "id": "m7-g-21-0-away",
    "matchId": "m7",
    "teamId": "t10",
    "type": "goal",
    "player": "I. Saibari",
    "playerAr": "I. Saibari",
    "minute": 21
  },
  {
    "id": "m11-g-51-0",
    "matchId": "m11",
    "teamId": "t21",
    "type": "goal",
    "player": "Virgil van Dijk",
    "playerAr": "Virgil van Dijk",
    "minute": 51
  },
  {
    "id": "m11-g-64-1",
    "matchId": "m11",
    "teamId": "t21",
    "type": "goal",
    "player": "C. Summerville",
    "playerAr": "C. Summerville",
    "minute": 64
  },
  {
    "id": "m11-g-57-0-away",
    "matchId": "m11",
    "teamId": "t22",
    "type": "goal",
    "player": "K. Nakamura",
    "playerAr": "K. Nakamura",
    "minute": 57
  },
  {
    "id": "m11-g-89-1-away",
    "matchId": "m11",
    "teamId": "t22",
    "type": "goal",
    "player": "K. Ogawa",
    "playerAr": "K. Ogawa",
    "minute": 89
  },
  {
    "id": "m16-g-41-0",
    "matchId": "m16",
    "teamId": "t31",
    "type": "goal",
    "player": "Abdulelah Al-Amri",
    "playerAr": "Abdulelah Al-Amri",
    "minute": 41
  },
  {
    "id": "m16-g-80-0-away",
    "matchId": "m16",
    "teamId": "t32",
    "type": "goal",
    "player": "Maximiliano Araújo",
    "playerAr": "Maximiliano Araújo",
    "minute": 80
  },
  {
    "id": "m20-g-21-0",
    "matchId": "m20",
    "teamId": "t39",
    "type": "goal",
    "player": "Rvmanv Ashmid",
    "playerAr": "Rvmanv Ashmid",
    "minute": 21
  },
  {
    "id": "m20-g-76-1",
    "matchId": "m20",
    "teamId": "t39",
    "type": "goal",
    "player": "Izn Alarb",
    "playerAr": "Izn Alarb",
    "minute": 76
  },
  {
    "id": "m20-g-50-0-away",
    "matchId": "m20",
    "teamId": "t40",
    "type": "goal",
    "player": "Ali Avlvan",
    "playerAr": "Ali Avlvan",
    "minute": 50
  },
  {
    "id": "m3-g-11-0",
    "matchId": "m3",
    "teamId": "t5",
    "type": "goal",
    "player": "C. Larin",
    "playerAr": "C. Larin",
    "minute": 11
  },
  {
    "id": "m3-g-21-0-away",
    "matchId": "m3",
    "teamId": "t6",
    "type": "goal",
    "player": "Jovo Lukić",
    "playerAr": "Jovo Lukić",
    "minute": 21
  },
  {
    "id": "m13-g-32-0",
    "matchId": "m13",
    "teamId": "t27",
    "type": "goal",
    "player": "Ramin Rezaiian",
    "playerAr": "Ramin Rezaiian",
    "minute": 32
  },
  {
    "id": "m13-g-64-1",
    "matchId": "m13",
    "teamId": "t27",
    "type": "goal",
    "player": "Mohammad Mohebi",
    "playerAr": "Mohammad Mohebi",
    "minute": 64
  },
  {
    "id": "m13-g-7-0-away",
    "matchId": "m13",
    "teamId": "t28",
    "type": "goal",
    "player": "Elijah Just",
    "playerAr": "Elijah Just",
    "minute": 7
  },
  {
    "id": "m13-g-54-1-away",
    "matchId": "m13",
    "teamId": "t28",
    "type": "goal",
    "player": "Elijah Just",
    "playerAr": "Elijah Just",
    "minute": 54
  },
  {
    "id": "m19-g-17-0",
    "matchId": "m19",
    "teamId": "t37",
    "type": "goal",
    "player": "Lionel Messi",
    "playerAr": "ليونيل ميسي",
    "minute": 17
  },
  {
    "id": "m19-g-60-1",
    "matchId": "m19",
    "teamId": "t37",
    "type": "goal",
    "player": "Lionel Messi",
    "playerAr": "ليونيل ميسي",
    "minute": 60
  },
  {
    "id": "m19-g-76-2",
    "matchId": "m19",
    "teamId": "t37",
    "type": "goal",
    "player": "Lionel Messi",
    "playerAr": "ليونيل ميسي",
    "minute": 76
  },
  {
    "id": "m15-g-66-0",
    "matchId": "m15",
    "teamId": "t25",
    "type": "goal",
    "player": "Mohamed Hany",
    "playerAr": "Mohamed Hany",
    "minute": 66
  },
  {
    "id": "m15-g-20-0-away",
    "matchId": "m15",
    "teamId": "t26",
    "type": "goal",
    "player": "Emam Ashour",
    "playerAr": "Emam Ashour",
    "minute": 20
  }
];

// ===== Top scorers (49 scorers) =====
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

// ===== Top assists (empty — source doesn't provide assist data) =====
export const TOP_ASSISTS: TopAssistRow[] = [];

// ===== Statistics generator for matches =====
export function generateMatchStats(homeScore: number, awayScore: number): MatchStatistics {
  const homeWin = homeScore > awayScore;
  return {
    possession: homeWin ? [54, 46] : [46, 54],
    shots: [10 + homeScore * 2, 8 + awayScore * 2],
    shots_on_target: [4 + homeScore, 3 + awayScore],
    corners: [5 + (homeScore > 0 ? 2 : 0), 4 + (awayScore > 0 ? 2 : 0)],
    fouls: [11, 13],
    yellow_cards: [2, 3],
    red_cards: [0, 0],
    passes: [487, 423],
    pass_accuracy: [86, 81],
  };
}
