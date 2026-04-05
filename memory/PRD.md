# Pierre-Olivier Caouette - Site Web Conseiller Financier

## Project Overview
Site web pour un conseiller en sécurité financière au Québec (pierreoliviercaouette.ca).
- **Objectifs**: Génération de leads via GoHighLevel, outils financiers interactifs, système de parrainage gamifié.
- **Design**: Premium inspiré de iA.ca, glassmorphism, animations CSS.

## Tech Stack
- **Frontend**: React, TailwindCSS, Shadcn/UI, React Router
- **Backend**: FastAPI, Motor (MongoDB async)
- **Database**: MongoDB
- **Integrations**: GoHighLevel (widget iFrame calendrier)

## Core Features

### Authentication System ✅
- JWT-based login/register
- AuthContext for state management
- Admin role support

### Referral/Rewards Program ✅ (Updated 2026-04-04)
- 5 tiers: Bronze (10pts/25$), Argent (20pts/50$), Or (40pts/100$), Platine (75pts/250$), VIP (100pts/Coffret VIP)
- 3 ways to earn points:
  - Referral: +1 point per qualified referral
  - Google Review: +2 points (manual verification)
  - Existing Client: +2 points (manual verification)
- **Profile Page Redesign (2026-04-04)**: Major emphasis on rewards program in Profile overview with:
  - Hero section with animated points display
  - Progress bar to next tier with shimmer effect
  - Full tier ladder visualization
  - 3 quick-earn cards prominently displayed
  - CTAs: "Copier mon lien" + "Gagner des points"

### Financial Tools ✅
8 interactive calculators with Quebec-specific tax logic:
1. Calculateur REER
2. Budget mensuel
3. Hypothèque
4. REEE
5. Assurance vie
6. Fonds d'urgence
7. Comparateur REER vs CELI
8. Valeur nette

Tool logic in: `/app/frontend/src/utils/toolCalculators.js`

### Content Pages ✅
- Home (Hero, Services, Testimonials)
- About (Timeline, Certifications)
- Services
- Contact (GoHighLevel calendar widget)

## Database Schema

### Collections
- `users`: {email, password_hash, first_name, last_name, phone, role, referral_code, total_points, created_at}
- `referrals`: {referrer_id, referred_name, referred_email, referred_phone, status, notes, created_at}
- `google_reviews`: {user_id, status, created_at}
- `existing_clients`: {user_id, first_name, last_name, date_of_birth, status, created_at}
- `tools`: {tool_id, title, htmlContent, icon, color}
- `testimonials`: {name, message, rating, created_at}
- `notifications`: {user_id, title, message, is_read, created_at}

## API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Referrals
- GET `/api/referrals` - List user's referrals
- POST `/api/referrals` - Submit new referral
- GET `/api/referrals/stats` - Get points breakdown and tier info

### Google Reviews
- GET `/api/google-reviews/me` - Get user's review status
- POST `/api/google-reviews` - Submit review claim
- GET `/api/google-reviews/link` - Get Google review link

### Existing Clients
- GET `/api/existing-clients/me` - Get user's client status
- POST `/api/existing-clients` - Submit client verification

### Testimonials
- GET `/api/testimonials` - Public testimonials list

## Completed Work

### 2026-04-04
- ✅ Profile page redesign with rewards emphasis
- ✅ Added CSS animations (gradient, shimmer effects)

### Previous Sessions
- ✅ Full referral system (tiers, points, DB models)
- ✅ Real content from pierreoliviercaouette.ca
- ✅ UI/UX improvements (glassmorphism, animations, framed photos)
- ✅ GoHighLevel calendar widget integration
- ✅ Partner links and social media updates
- ✅ Generic "Certifié AMF" badge
- ✅ Hybrid testimonials system (manual DB entry)
- ✅ Fixed Referral page auth bug

## Pending Tasks

### P0 (Critical)
- [ ] Tool results saving: Connect "Terminer et sauvegarder" button to POST `/api/tool_results`
- [ ] Display saved tool history in Profile

### P1 (Important)
- [ ] Verify remaining 5 financial tools (REEE, Assurance vie, Fonds d'urgence, Comparateur REER/CELI, Valeur nette)
- [ ] Admin panel: validate user actions (Google reviews, existing clients)

### P2 (Backlog)
- [ ] Review iteration_2.json for latent bugs
- [ ] Consider converting ToolDetail.jsx from DOM manipulation to React components

## File Structure
```
/app
├── backend/
│   ├── server.py (FastAPI main file)
│   ├── .env (MONGO_URL, DB_NAME)
│   └── update_tools.py (tool seeding script)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Profile.jsx (UPDATED 2026-04-04 - rewards emphasis)
│   │   │   ├── ToolDetail.jsx (DOM manipulation approach)
│   │   │   └── ... (Home, About, Contact, etc.)
│   │   ├── utils/toolCalculators.js
│   │   ├── context/AuthContext.jsx
│   │   └── index.css (UPDATED - animations added)
│   └── .env (REACT_APP_BACKEND_URL)
└── test_reports/
    └── iteration_3.json
```

## Test Credentials
- Email: admin@test.com
- Password: admin123

## Notes
- Google Places API integration abandoned (invalid Place ID). Using manual testimonial system instead.
- ToolDetail.jsx uses non-conventional DOM manipulation with useRef/useEffect to prevent React re-renders breaking input fields.
