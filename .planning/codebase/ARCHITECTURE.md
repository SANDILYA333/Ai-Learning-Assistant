---
title: Architecture
last_mapped: 2026-04-26
---

# Architecture

## Pattern

**Layered MVC / Service-Oriented REST API** (backend) + **SPA with Context-based state** (frontend).

The system is a classic client-server application:
1. Frontend (React SPA) communicates with backend exclusively via REST API.
2. Backend follows a **Routes → Middleware → Controller → Service/Model** pipeline.
3. AI features are mediated through service utility modules that wrap Gemini API calls.
4. Data lives in MongoDB; files live on local disk.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│          Frontend (React + Vite)                │
│          localhost:5173                         │
│                                                 │
│  AuthContext ─── localStorage (JWT + user)      │
│  axiosInstance ─ Authorization: Bearer <token>  │
│  Pages / Components / Services                  │
└────────────────────┬────────────────────────────┘
                     │ HTTP (axios)
                     ▼
┌─────────────────────────────────────────────────┐
│          Backend (Express 5 + Node.js)          │
│          localhost:8000                         │
│                                                 │
│  ┌─ CORS ──────────────────────────────────┐   │
│  │  origin: http://localhost:5173           │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Routes → protect (JWT middleware)              │
│        → Controllers                            │
│              → Gemini Service (AI)              │
│              → YouTube Service (optional)       │
│              → Mongoose Models                  │
│              → Local FS (PDF uploads)           │
└────────────────────┬───────────────┬────────────┘
                     │               │
                     ▼               ▼
              ┌──────────┐   ┌──────────────┐
              │ MongoDB  │   │ Google APIs  │
              │ (Atlas   │   │ (Gemini +    │
              │  or      │   │  YouTube)    │
              │  local)  │   └──────────────┘
              └──────────┘
```

---

## Backend Layer Breakdown

### 1. Entry Point — `backend/server.js`
- Loads env, initializes Express app
- Mounts CORS, body parsers, static file serving
- Registers all route modules under `/api/*`
- Mounts global error handler last
- Handles unhandled promise rejections → `process.exit(1)`

### 2. Routes — `backend/routes/*.js`
All routes except auth use `router.use(protect)` — JWT auth applied globally per router.

| File | Prefix | Notes |
|------|--------|-------|
| `authRoutes.js` | `/api/auth` | Public: login, register; Protected: profile, change-password |
| `documentRoutes.js` | `/api/documents` | Multer middleware for upload |
| `flashcardRoutes.js` | `/api/flashcards` | CRUD on flashcard sets |
| `aiRoutes.js` | `/api/ai` | All AI generation endpoints |
| `quizRoutes.js` | `/api/quizzes` | Quiz lifecycle |
| `progressRoutes.js` | `/api/progress` | Dashboard stats |

### 3. Middleware — `backend/middleware/`
- `auth.js` (`protect`) — Verifies Bearer JWT, attaches `req.user` (fetched from DB, excludes password)
- `errorHandler.js` — Centralized error handler: normalizes Mongoose, JWT, Multer errors into consistent `{ success, error, statusCode }` shape

### 4. Controllers — `backend/controllers/`
Thin handlers: validate input → query DB/AI → respond.

| File | Responsibility |
|------|---------------|
| `authController.js` | Register, login, profile CRUD, password change |
| `documentController.js` | PDF upload, PDF processing pipeline, document CRUD |
| `aiController.js` | All AI feature coordination (flashcard/quiz/summary/chat/concept) |
| `flashcardController.js` | Flashcard set CRUD, review tracking, star toggling |
| `quizController.js` | Quiz retrieval, submission, results |
| `progressController.js` | Aggregated dashboard statistics |

### 5. Services / Utilities — `backend/utils/`
| File | Role |
|------|------|
| `geminiService.js` | Primary Gemini wrapper (5 AI functions) |
| `geminiService2.js` | Learning path JSON generation (legacy SDK) |
| `learningPathEngine.js` | Orchestrates AI + YouTube for course building |
| `textChunker.js` | Paragraph-aware text chunking + keyword-scored chunk retrieval |
| `pdfParser.js` | PDF text extraction wrapper |
| `youtubeService.js` | YouTube video ID lookup |

### 6. Models — `backend/models/`
Standard Mongoose schemas with `timestamps: true`. All user-owned data has `userId`/`user` ref to `User`. Key design choices:
- `Document` embeds full `chunks[]` array (no separate collection)
- `Flashcard` embeds `cards[]` array within one document per set
- `Quiz` embeds `questions[]` and `userAnswers[]` in one document
- `Course` embeds `chapters[]` — not yet wired to main API routes

---

## PDF Processing Pipeline

Async, fire-and-forget on upload:

```
POST /api/documents/upload
  → multer saves file → DB record created (status: "processing") → response 201
  → [background] processPDF()
      → pdfParser.extractTextFromPDF(filePath)
      → textChunker.chunkText(text, 500, 50)
      → Document.findByIdAndUpdate({ extractedText, chunks, status: "ready" })
```

> Production note: a comment in `documentController.js` flags this should use a queue (e.g., Bull) in production.

---

## AI Feature Flow (RAG-style for Chat)

```
POST /api/ai/chat
  → Find document (userId + status:"ready" ownership check)
  → textChunker.findRelevantChunks(document.chunks, question, 3)
  → geminiService.chatWithContext(question, relevantChunks)
  → Save to ChatHistory (user + assistant messages)
  → Return answer + chunk indices
```

The chunk retrieval uses keyword-frequency scoring (TF-like, not vector embeddings).

---

## Frontend Architecture

### State Management
- `AuthContext` — single global context for authentication state
  - Backed by `localStorage` (token + user JSON)
  - Exposes: `user`, `isAuthenticated`, `loading`, `login`, `logout`, `updateUser`

### Routing
- `BrowserRouter` + `Routes`
- Unauthenticated users redirected to `/login`
- Authenticated users redirect `/` → `/dashboard`
- Protected routes via `<ProtectedRoute>` layout component

### Data Fetching
- All API calls via `axiosInstance` (pre-configured with base URL + Bearer token injection)
- No global cache or SWR — fetching happens per component/page mount
- Organized into service files under `src/services/`

### Component Organization
```
src/
  pages/         ← full-page views (per route)
  components/    ← reusable UI components
    ai/          ← AI action triggers
    auth/        ← ProtectedRoute
    chat/        ← ChatInterface
    common/      ← Button, Modal, Spinner, Tabs, etc.
    documents/   ← DocumentCard
    flashcards/  ← Flashcard, FlashcardManager, FlashcardSetCard
    layout/      ← AppLayout, Header, Sidebar
    quizzes/     ← QuizCard, QuizManager
  context/       ← AuthContext
  services/      ← API call functions
  utils/         ← axiosInstance, apiPaths
```
