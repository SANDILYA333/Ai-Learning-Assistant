---
title: Testing
last_mapped: 2026-04-26
---

# Testing

## Current State: No Automated Tests

> **No test files were found** in this codebase. There are no unit tests, integration tests, or end-to-end tests.

---

## Testing Infrastructure

| Category | Status |
|----------|--------|
| Test framework | ❌ None installed |
| Test runner | ❌ None configured |
| CI/CD pipeline | ❌ No `.github/workflows/` or similar |
| Coverage tooling | ❌ None |
| E2E testing | ❌ None |
| Mocking library | ❌ None |
| API testing (Postman, etc.) | Unknown (no collection files found) |

Neither `backend/package.json` nor `frontend/ai-learning-assistant/package.json` include test dependencies (Jest, Vitest, Supertest, Playwright, Cypress, etc.) or a `test` script.

---

## What Should Be Tested (Gaps)

Given the architecture, the following areas are the highest priority for future test coverage:

### Backend — Unit Tests
| Module | What to Test |
|--------|-------------|
| `utils/textChunker.js` | `chunkText()` edge cases (empty, single para, large text), `findRelevantChunks()` scoring |
| `utils/pdfParser.js` | PDF extraction (mock pdf-parse) |
| `utils/geminiService.js` | Response parsing (mock Gemini API) — Q/A/D format, fallback on bad format |
| `utils/geminiService2.js` | JSON parse error handling, malformed AI response |
| `middleware/auth.js` | Valid token, expired token, missing token, invalid token |
| `middleware/errorHandler.js` | All 6 error type normalizations |

### Backend — Integration Tests (Supertest)
| Route Group | Key Scenarios |
|-------------|--------------|
| `POST /api/auth/register` | Success, duplicate email, missing fields |
| `POST /api/auth/login` | Success, wrong password, unknown email |
| `POST /api/documents/upload` | Valid PDF, non-PDF rejection, missing title, size limit |
| `GET /api/documents` | Auth required, returns only user's docs |
| `POST /api/ai/generate-flashcards` | Document not found, document not ready, success (mock Gemini) |
| `POST /api/ai/chat` | Missing question, document ownership, chat history creation |
| `POST /api/quizzes/:id/submit` | Score calculation, completion timestamp |

### Frontend — Component Tests (Vitest + React Testing Library)
| Component | What to Test |
|-----------|-------------|
| `AuthContext` | login/logout state changes, localStorage sync |
| `ProtectedRoute` | Redirects unauthenticated users |
| `axiosInstance` | Token injection, 401/500 handling |
| `FlashcardManager` | Card navigation, review tracking |
| `ChatInterface` | Message submission, response rendering |

---

## Recommended Test Setup

### Backend (Node.js)
```bash
# Install
cd backend
npm install --save-dev jest supertest @jest/globals

# jest.config.js
export default {
  testEnvironment: 'node',
  transform: {},      // ESM – no transform needed with Node 18+
  extensionsToTreatAsEsm: ['.js'],
};
```

### Frontend (Vite)
```bash
cd frontend/ai-learning-assistant
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom

# vite.config.js — add test block
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/test/setup.js',
}
```

---

## Manual Testing Evidence

The `backend/uploads/documents/` directory contains **14 real uploaded PDFs** from development sessions (HTML CheatSheets, UNIT-I notes, Fintech Notes), suggesting the app has been manually tested end-to-end. No automated verification of this flow exists.
