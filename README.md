# VedaAI

Smart Answer Sheet Analysis & AI Evaluation

A teacher uploads a question paper and a student's handwritten answer sheet. The app extracts every
question (including labelled sub-parts like `11(a)`/`11(b)`), locates the student's answer to each one,
and shows them side by side — clicking a question highlights the exact region of the answer sheet where
it was answered. It also grades each matched answer and gives overall feedback.

## Stack

- **Frontend**: React (Vite) + Tailwind CSS, `react-pdf` for rendering PDF pages with highlight overlays
- **Backend**: Node.js + Express, single `/api/analyze` endpoint
- **AI**: Google Gemini (`gemini-3.6-flash`) — one structured call extracts questions, extracts answers
  with bounding boxes, maps them, and grades them. Free tier via [Google AI Studio](https://aistudio.google.com/app/apikey).
- **Storage**: none — everything is processed in memory per request; uploaded files never touch disk.

## Project layout

```
frontend/   React app (upload UI, question list, answer sheet viewer with highlight overlay)
backend/    Express API — one route, one Gemini call, no database
```

## Running locally

1. Install dependencies for each project:
   ```
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. Get a free Gemini API key from https://aistudio.google.com/app/apikey, then create `backend/.env`:
   ```
   GEMINI_API_KEY=your-key-here
   ```
3. Start the backend and frontend in separate terminals:
   ```
   cd backend && npm run dev
   cd frontend && npm run dev
   ```
   Frontend runs on http://localhost:5173 (proxies `/api` to the backend on port 5174).

## Deploying

Build the frontend and let the Express server serve it as static files, so it's a single deployable service:

```
cd frontend && npm run build
cd ../backend && npm start
```

Deploy to any Node host (Render, Railway, Fly.io, etc.):
- Build command: `cd frontend && npm install && npm run build && cd ../backend && npm install`
- Start command: `cd backend && npm start`
- Environment variable: `GEMINI_API_KEY`

## Notes on the design trade-offs

- PDFs are sent to Gemini as-is (it natively reads multi-page PDFs and images) — the server never
  rasterizes PDFs itself, avoiding native `canvas` build dependencies.
- Because analysis is a single request/response, the progress indicator shown while waiting is a
  staged animation rather than a real progress stream — there's no backend job queue to report from.
