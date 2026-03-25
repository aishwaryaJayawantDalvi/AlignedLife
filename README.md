# AlignedLife

AlignedLife is a privacy-first platform for users facing social/family marriage pressure to find life-aligned partners and co-create clear mutual agreements.

## Stack
- Frontend: React + Tailwind + Vite
- Backend: Node.js + Express + MongoDB + Socket.IO

## Features Implemented
- Email/password JWT auth with anonymous display mode
- Continue with Google auth (optional, env-configured)
- Mandatory Reality Check acceptance gate
- Multi-step onboarding profile
- Match scoring based on life-alignment fields
- Realtime anonymous chat for matched users
- Mutual identity reveal consent flow
- Block/report moderation endpoints
- Agreement builder + PDF export

## Run Locally
1. Copy `backend/.env.example` to `backend/.env` and set values.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Install dependencies:
   - `npm install --prefix backend`
   - `npm install --prefix frontend`
4. Start services:
   - `npm run dev:backend`
   - `npm run dev:frontend`

## Google Sign-In Setup (Optional)
1. Create an OAuth Client ID in Google Cloud (Web application).
2. Add allowed origin: `http://localhost:5173`.
3. Set `GOOGLE_CLIENT_ID` in `backend/.env`.
4. Set `VITE_GOOGLE_CLIENT_ID` in `frontend/.env`.

## API Base
- Backend runs on `http://localhost:4000`
- Frontend runs on `http://localhost:5173`
