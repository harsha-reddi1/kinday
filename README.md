# kinDay 🌟

**Calm Family Planning & Daily Routines for Children Aged 1 to 10**

kinDay is a single unified family platform featuring two interconnected modules:
1. **Module A: Parent Hub (Command Center)** — School circular ingestion via Gemini multimodal AI, family calendar, task approvals, milestone journal, and toddler activity cards.
2. **Module B: Kids Zone (Playful Companion)** — Tactile, picture-first "My Day" routine board with large touch targets, star rewards, celebrations, and a 4-digit Parent PIN lock.

---

## 🏗 Architecture

* **Frontend (Web):** Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons, Framer Motion, Canvas Confetti.
* **Frontend (Android):** Kotlin, Jetpack Compose, Material 3 Adaptive `WindowSizeClass` (Phone + Tablet), Room Offline DB, WorkManager sync queue.
* **Backend:** FastAPI microservice, Python 3.11+, Pydantic v2, Google GenAI SDK.
* **Database & Auth:** Supabase (PostgreSQL with Row-Level Security, Storage).
* **AI:** Google Gemini Multimodal API (zero child identifiers forwarded).

---

## 🚀 Web Deployments

### 1. GitHub Pages (Static Hosting)
Every push to `main` automatically builds and deploys the static export to GitHub Pages via `.github/workflows/deploy-gh-pages.yml`.
* **Live URL:** `https://harsha-reddi1.github.io/kinday/`

### 2. Vercel (Edge & Serverless Hosting)
* Connect repository `harsha-reddi1/kinday` on [Vercel](https://vercel.com).
* Set **Root Directory** to `web`.
* Add environment variables:
  * `NEXT_PUBLIC_SUPABASE_URL`
  * `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 💻 Local Development

### Web App:
```bash
cd web
npm install
npm run dev
```

### Backend Service:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
