# 🏆 World Cup 2026 — Live Tracker

موقع كأس العالم 2026 مبني بـ Next.js 16 + TypeScript + Tailwind CSS + Supabase + API-Football.

## ✨ المميزات

- 48 منتخب في 12 مجموعة (A–L) بأعلام SVG صحيحة من flagcdn
- شجرة إقصائيات كاملة: دور الـ32 → R16 → QF → SF → النهائي + المركز الثالث
- بطاقة مباراة مباشرة مع نبض أحمر كندي للمباريات الجارية
- تمييز مسار الفريق (path highlight) عند الضغط على أي فريق في الشجرة
- توقيت المستخدم (Asia/Riyadh افتراضياً، أو ما يكتشفه المتصفح)
- دعم RTL/LTR — عربي/إنجليزي
- وضع ليلي/نهاري بألوان هوية الدول المضيفة (ذهبي/أخضر/أحمر/أزرق)
- مفضلة في LocalStorage فقط (بدون Auth)
- طبقة Supabase مع fallback تلقائي للـ mock عند عدم التوفر

## 🚀 الإعداد

### 1. متغيرات البيئة

انسخ `.env.example` إلى `.env.local` واملأ القيم:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # server-only
SUPABASE_DB_URL=postgresql://...        # server-only
API_FOOTBALL_KEY=YOUR_API_FOOTBALL_KEY  # server-only
API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
```

### 2. تطبيق الـ Schema على Supabase

افتح Supabase Dashboard → **SQL Editor** → **New Query**، ثم الصق محتوى
`supabase/schema.sql` واضغط **RUN**.

هذا سينشئ 10 جداول:
- `stadiums` · `teams` · `players` · `matches` · `match_events` · `match_lineups`
- `standings` · `top_scorers` · `top_assists` · `sync_state`

مع سياسات RLS: anon (قراءة فقط) + service_role (وصول كامل).

### 3. تشغيل التطبيق

```bash
bun install
bun run dev
```

افتح `http://localhost:3000`.

### 4. ملء Supabase بالبيانات الأولية (seed)

اختياري — يملأ Supabase بالبيانات الافتراضية (48 فريق، 16 ملعب، 50+ لاعب، 28 مباراة):

```bash
bun run supabase:seed
```

بعد ذلك، التطبيق سيقرأ من Supabase تلقائياً.

### 5. تشغيل المزامنة من API-Football

#### يدوياً (مرّة واحدة):

```bash
bun run sync
```

#### عبر API route (للاستخدام مع Vercel Cron):

```bash
# محلياً
curl -X POST http://localhost:3000/api/sync \
  -H "x-sync-key: $SYNC_API_KEY"
```

#### جدولة CRON (كل 5 دقائق):

**Vercel** (`vercel.json`):
```json
{
  "crons": [
    { "path": "/api/sync", "schedule": "*/5 * * * *" }
  ]
}
```

أو **crontab** على خادم:
```cron
*/5 * * * * cd /app && curl -X POST http://localhost:3000/api/sync -H "x-sync-key: YOUR_KEY" >> /var/log/wc-sync.log 2>&1
```

## 📁 هيكل المشروع

```
.
├── src/
│   ├── app/
│   │   ├── api/sync/route.ts        # API endpoint لـ CRON
│   │   ├── api/health/route.ts      # فحص حالة Supabase
│   │   ├── layout.tsx               # RTL + الخطوط
│   │   ├── page.tsx                 # state-based router
│   │   └── globals.css              # ألوان هوية الدول المضيفة
│   ├── components/wc/
│   │   ├── pages/                   # كل الصفحات (11)
│   │   ├── MatchCard.tsx            # بطاقة مباراة
│   │   ├── Header.tsx               # الهيدر + التنقل
│   │   └── FavoriteButton.tsx
│   └── lib/
│       ├── stores/wc-stores.ts      # Zustand: nav, theme, favorites
│       ├── wc/
│       │   ├── types.ts             # TypeScript types
│       │   ├── data.ts              # بيانات أولية (mock)
│       │   ├── supabase-real.ts     # عميل Supabase الحقيقي
│       │   ├── supabase-client.ts   # طبقة API (real + fallback)
│       │   ├── time.ts              # توقيت المستخدم
│       │   └── i18n.ts              # عربي/إنجليزي
├── supabase/schema.sql              # 10 جداول + RLS
├── scripts/sync/
│   ├── seed-supabase.ts             # ملء البيانات الأولية
│   └── api-football-sync.ts         # CRON job
├── .env.example                     # قالب المتغيرات
└── .env.local                       # (محلي، gitignored)
```

## 🎨 لوحة الألوان

| اللون | HEX | الاستخدام |
|---|---|---|
| ذهبي | `#D4AF37` | الكأس، البطل، الفائز |
| أخضر | `#006847` | المكسيك (دولة مضيفة) |
| أحمر | `#BF0A30` | كندا (دولة مضيفة) + LIVE |
| أزرق داكن | `#3C3B6E` | أمريكا (دولة مضيفة) |
| أسود عميق | `#050505` | الخلفية الأساسية |
| أبيض | `#FFFFFF` | الوضع النهاري |

## ⚙️ الأداء

- قراءة من Supabase فقط (لا استدعاء مباشر لـ API-Football من الواجهة)
- Skeleton loading + latency محاكى (200ms) للـ mock layer
- Lazy loading للأعلام
- Zustand لإدارة الحالة (دون re-renders غير ضرورية)
- RTK pattern: تحديث الواجهة بدون إعادة تحميل الصفحة

## 🔐 الأمان

- `service_role` key مستخدم فقط في:
  - `scripts/sync/*.ts` (Cron jobs)
  - `src/app/api/sync/route.ts` (server-side)
- `anon/publishable` key مستخدم في الواجهة (قراءة فقط)
- RLS مفعّل: anon لا يستطيع الكتابة
- `.env.local` في `.gitignore` — لا يُرفع إلى GitHub
- المفضلة في LocalStorage فقط — لا Users/Auth

## 📜 الترخيص

للاستخدام التعليمي/الشخصي. شعار FIFA World Cup 2026 علامة تجارية مملوكة لـ FIFA.
