<<<<<<< HEAD
# SM Finance — Client Appreciation Programme v2
### React + Vite · CAP 2026

## What's new in v2
- Login system — unified /login with Admin / Partner / Client role switcher
- Auth guards — every route protected; unauthenticated users sent to /login
- Session management — 8-hour sessions; sign-out on all portals
- Working token download — PNG export for client and partner tokens (canvas, no server needed)
- Professional dashboard — timeline progress bar, stat cards with bars, quick actions, leaderboard

## Demo credentials
Admin: admin@smfinance.co.uk / SMF@admin2026
Partner: REF-2026-001 / sabbir@swmsolicitors.co.uk
Client: CAP-2026-00001 / SMF-10001

## Deploy
1. npm install && npm run dev  (test at localhost:3000/login)
2. Create free Supabase project, run SQL from src/lib/supabase.js
3. cp .env.example .env.local — fill in Supabase URL + key + site URL
4. Push to GitHub → import to Vercel → add env vars → Deploy
5. Add cap.smfinance.co.uk as custom domain in Vercel

## Structure
src/lib/auth.js         — session + login logic (swap for Supabase Auth in production)
src/lib/store.js        — localStorage data (swap for src/lib/supabase.js when ready)
src/lib/pdf.js          — canvas PNG token download
src/pages/Login.jsx     — unified login page
src/components/shared/AuthGuard.jsx — route protection

Built for Selina Manir Finance Ltd · SM Finance · v2.0
=======
# smfinance-cap
>>>>>>> ee27bbc32f7a4710e77c932eb24eba0280994a68
