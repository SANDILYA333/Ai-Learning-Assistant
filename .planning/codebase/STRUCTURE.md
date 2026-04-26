---
title: Project Structure
last_mapped: 2026-04-26
---

# Project Structure

## Top-Level Layout

```
Ai-Learning-Assistant/
├── backend/                   # Express REST API
├── frontend/
│   └── ai-learning-assistant/ # React + Vite SPA
├── Items/                     # Design artifacts / diagrams (not code)
│   ├── BLOCK DIAGRAM.png
│   └── Synv and Async in Node .excalidraw
└── .git/
```

> The `frontend/` directory has its own `package.json` and `node_modules/` wrapper but the actual app lives in `frontend/ai-learning-assistant/`.

---

## Backend Structure — `backend/`

```
backend/
├── server.js                  # ← Entry point: Express setup, routes, middleware
├── package.json               # ESM module, scripts: start / dev
├── .env                       # Secrets (not committed)
├── config/
│   ├── db.js                  # Mongoose connection
│   └── multer.js              # File upload config (PDF only, 10MB limit)
├── middleware/
│   ├── auth.js                # JWT protect middleware → req.user
│   └── errorHandler.js        # Centralized error normalization
├── models/
│   ├── User.js                # User schema + bcrypt hooks
│   ├── Document.js            # PDF document + embedded chunks[]
│   ├── Flashcard.js           # Flashcard set + embedded cards[]
│   ├── Quiz.js                # Quiz + embedded questions[] + userAnswers[]
│   ├── ChatHistory.js         # Chat session + embedded messages[]
│   └── Course.js              # AI-generated course + chapters[] (not yet routed)
├── routes/
│   ├── authRoutes.js          # /api/auth/*
│   ├── documentRoutes.js      # /api/documents/*
│   ├── flashcardRoutes.js     # /api/flashcards/*
│   ├── aiRoutes.js            # /api/ai/*
│   ├── quizRoutes.js          # /api/quizzes/*
│   └── progressRoutes.js      # /api/progress/*
├── controllers/
│   ├── authController.js      # register, login, getProfile, updateProfile, changePassword
│   ├── documentController.js  # upload, getDocuments, getDocument, deleteDocument, updateDocument (stub)
│   ├── flashcardController.js # getFlashcards, getAllFlashcardSets, reviewFlashcard, toggleStar, deleteSet
│   ├── aiController.js        # generateFlashcards, generateQuiz, generateSummary, chat, explainConcept, getChatHistory
│   ├── quizController.js      # quiz CRUD + submission + results
│   └── progressController.js  # getDashboard (aggregated stats)
└── utils/
    ├── geminiService.js        # Primary AI wrapper (gemini-2.5-flash-lite)
    ├── geminiService2.js       # Learning path AI (gemini-1.5-flash, JSON mode)
    ├── learningPathEngine.js   # Orchestrates geminiService2 + youtubeService
    ├── textChunker.js          # chunkText(), findRelevantChunks()
    ├── pdfParser.js            # extractTextFromPDF() using pdf-parse
    └── youtubeService.js       # fetchVideoForChapter() via googleapis
```

---

## Frontend Structure — `frontend/ai-learning-assistant/`

```
src/
├── main.jsx                   # React root, wraps App in <AuthProvider>
├── App.jsx                    # Router + route definitions + auth redirect logic
├── index.css                  # Global Tailwind + base styles
├── App.css                    # App-level styles
├── assets/
│   └── react.svg
├── context/
│   └── AuthContext.jsx        # isAuthenticated, user, login(), logout(), updateUser()
├── pages/
│   ├── Auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── Dashboard/
│   │   └── DashboardPage.jsx  # Overview stats + recent activity
│   ├── Documents/
│   │   ├── DocumentListPage.jsx
│   │   └── DocumentDetailPage.jsx  # AI action triggers + chat
│   ├── Flashcards/
│   │   ├── FlashcardsListPage.jsx
│   │   └── FlashcardPage.jsx       # Active study session
│   ├── Quizzes/
│   │   ├── QuizTakePage.jsx
│   │   └── QuizResultPage.jsx
│   ├── Profile/
│   │   └── ProfilePage.jsx
│   └── NotFoundPage.jsx
├── components/
│   ├── ai/
│   │   └── AiActions.jsx      # Generate flashcard/quiz/summary/explain buttons
│   ├── auth/
│   │   └── ProtectedRoute.jsx # Outlet wrapper with auth guard
│   ├── chat/
│   │   └── ChatInterface.jsx  # Chat UI wired to /api/ai/chat
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── EmptyState.jsx
│   │   ├── MarkdownRenderer.jsx  # react-markdown + syntax highlighting
│   │   ├── Modal.jsx
│   │   ├── PageHeader.jsx
│   │   ├── Spinner.jsx
│   │   └── Tabs.jsx
│   ├── documents/
│   │   └── DocumentCard.jsx
│   ├── flashcards/
│   │   ├── Flashcard.jsx         # Single card flip UI
│   │   ├── FlashcardManager.jsx  # Study session manager
│   │   └── FlashcardSetCard.jsx  # Set list item
│   ├── layout/
│   │   ├── AppLayout.jsx         # Root layout with sidebar
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   └── quizzes/
│       ├── QuizCard.jsx
│       └── QuizManager.jsx
├── services/                  # API call abstractions
│   ├── aiService.js
│   ├── authService.js
│   ├── documentService.js
│   ├── flashcardService.js
│   ├── progressService.js
│   └── quizService.js
└── utils/
    ├── axiosInstance.js       # Pre-configured axios (base URL + interceptors)
    └── apiPaths.js            # Centralized URL constants
```

---

## Key File Roles Summary

| File | Role |
|------|------|
| `backend/server.js` | Application bootstrap + middleware wiring |
| `backend/config/multer.js` | PDF upload gating (type + size) |
| `backend/middleware/auth.js` | JWT verification → `req.user` |
| `backend/utils/textChunker.js` | Paragraph-aware chunking + keyword search |
| `backend/utils/geminiService.js` | All primary AI generation |
| `frontend/src/context/AuthContext.jsx` | Global auth state + localStorage sync |
| `frontend/src/utils/axiosInstance.js` | Auto-injects Bearer token on every request |
| `frontend/src/utils/apiPaths.js` | Single source of truth for API URL strings |

---

## Naming Conventions

| Convention | Examples |
|------------|---------|
| Files: camelCase | `aiController.js`, `geminiService.js`, `axiosInstance.js` |
| Components: PascalCase | `DocumentCard.jsx`, `FlashcardManager.jsx` |
| Directories: camelCase (backend), PascalCase (frontend pages) | `controllers/`, `Documents/` |
| API routes: kebab-case | `/generate-flashcards`, `/chat-history`, `/change-password` |
| DB models: PascalCase | `User`, `Document`, `Flashcard` |
| Env vars: SCREAMING_SNAKE_CASE | `MONGODB_URI`, `GEMINI_API_KEY` |
