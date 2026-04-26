---
title: Technology Stack
last_mapped: 2026-04-26
---

# Technology Stack

## Overview

Full-stack AI-powered learning assistant. Split into two independently runnable sub-projects:

- **Backend** — Node.js REST API (`backend/`)
- **Frontend** — React SPA (`frontend/ai-learning-assistant/`)

---

## Runtime & Language

| Layer | Language | Runtime |
|-------|----------|---------|
| Backend | JavaScript (ESM) | Node.js (>=18 implied by package deps) |
| Frontend | JavaScript / JSX | Browser via Vite |

Both sub-projects use `"type": "module"` (native ES modules, no CommonJS).

---

## Backend Stack

### Core Framework
- **Express.js `^5.2.1`** — HTTP server, routing, middleware pipeline
  - Entry point: `backend/server.js`
  - Runs on port `8000` by default (`process.env.PORT`)

### Database
- **Mongoose `^9.2.0`** — ODM on top of MongoDB
  - Connection: `backend/config/db.js` using `process.env.MONGODB_URI`

### Authentication
- **jsonwebtoken `^9.0.3`** — Stateless JWT auth (7-day default expiry)
- **bcryptjs `^3.0.3`** — Password hashing (salt rounds: 10)

### File Handling
- **multer `^2.0.2`** — PDF upload middleware (`backend/config/multer.js`)
  - Storage: local disk at `backend/uploads/documents/`
  - File type: PDF only (`application/pdf`)
  - Max size: `10MB` (env: `MAX_FILE_SIZE`)

### PDF Processing
- **pdf-parse `^2.4.5`** — Extracts raw text from uploaded PDFs
  - Used in `backend/utils/pdfParser.js`

### AI
- **`@google/genai` `^1.41.0`** — Primary Gemini SDK (newer package)
  - Used in `backend/utils/geminiService.js`
  - Model: `gemini-2.5-flash-lite`
- **`@google/generative-ai` `^0.24.1`** — Legacy Gemini SDK
  - Used in `backend/utils/geminiService2.js` for learning path generation
  - Model: `gemini-1.5-flash`

### Input Validation
- **express-validator `^7.3.1`** — Request validation (imported, usage not yet widespread)

### Environment
- **dotenv `^17.2.4`** — `.env` loading

### Dev Tools
- **nodemon `^3.1.11`** — Auto-restart on file change (`npm run dev`)

---

## Frontend Stack

### Framework
- **React `^19.2.0`** — UI library (latest major)
- **React DOM `^19.2.3`**

### Build Tool
- **Vite `^7.2.4`** — Fast dev server + bundler
  - Config: `frontend/ai-learning-assistant/vite.config.js`
  - Dev server: `npm run dev` → `http://localhost:5173`
- **`@vitejs/plugin-react` `^5.1.1`** — React fast refresh

### Routing
- **react-router-dom `^7.13.0`** — Client-side routing with `BrowserRouter`

### Styling
- **Tailwind CSS `^4.1.18`** — Utility-first CSS (v4 via `@tailwindcss/vite` plugin)
  - Global styles: `frontend/ai-learning-assistant/src/index.css`
  - App-level: `frontend/ai-learning-assistant/src/App.css`

### HTTP Client
- **axios `^1.13.5`** — REST API calls
  - Instance: `frontend/ai-learning-assistant/src/utils/axiosInstance.js`
  - Base URL: `http://localhost:8000` (hardcoded in `apiPaths.js`)
  - Timeout: 80 seconds

### UI Components & Icons
- **lucide-react `^0.563.0`** — Icon set
- **react-hot-toast `^2.6.0`** — Toast notification system

### Markdown Rendering
- **react-markdown `^10.1.0`** — Renders AI responses as Markdown
- **remark-gfm `^4.0.1`** — GitHub Flavored Markdown plugin
- **react-syntax-highlighter `^16.1.0`** — Code block syntax highlighting

### Date Handling
- **moment `^2.30.1`** — Date formatting

### Linting
- **ESLint `^9.39.1`** with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRE` | Token expiry (default `7d`) |
| `GEMINI_API_KEY` | Google Gemini API key (required — exits if missing) |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key (for learning path videos) |
| `PORT` | Server port (default `8000`) |
| `NODE_ENV` | Environment mode |
| `MAX_FILE_SIZE` | Upload limit in bytes (default `10485760` = 10MB) |

---

## Scripts

### Backend
```bash
cd backend
npm start        # node server.js
npm run dev      # nodemon server.js
```

### Frontend
```bash
cd frontend/ai-learning-assistant
npm run dev      # vite (localhost:5173)
npm run build    # production bundle
npm run lint     # eslint
npm run preview  # preview prod build
```
