---
title: Technical Concerns & Debt
last_mapped: 2026-04-26
---

# Technical Concerns & Debt

## 🔴 High Severity

### 1. File Deletion Bug — `filePath` stores URL, not local path
**File:** `backend/controllers/documentController.js:219`

```js
// Bug: filePath is "http://localhost:8000/uploads/filename.pdf"
await fs.unlink(document.filePath).catch(() => {}); // silently fails every time
```
`filePath` is set to a full HTTP URL at upload time but `fs.unlink()` needs a local filesystem path. The `.catch(() => {})` silently suppresses the error, so deleted documents' files are never actually removed from disk — **disk leaks on every deletion**.

**Fix:** Store relative path (`uploads/documents/filename.pdf`) or resolve the path from `__dirname` at delete time.

---

### 2. No Test Coverage
Zero automated tests. Every feature is manually tested only. Any refactor or dependency update can silently break behavior with no detection mechanism.

---

### 3. Hardcoded URLs — No Environment Abstraction on Frontend
**File:** `frontend/ai-learning-assistant/src/utils/apiPaths.js:1`

```js
export const BASE_URL = "http://localhost:8000"; // hardcoded
```

CORS origin also hardcoded in `backend/server.js:34`:
```js
origin: "http://localhost:5173"
```

Deploying to any environment (staging, production) requires manual code edits.

---

### 4. `updateDocument` Controller is an Empty Stub
**File:** `backend/controllers/documentController.js:237-243`

```js
export const updateDocument = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
```
The route is registered but returns nothing — any `PUT /api/documents/:id` request will hang or behave unexpectedly.

---

### 5. Dual Gemini SDK — Inconsistency & Maintenance Risk
Two different Google AI SDKs are used simultaneously:
- `@google/genai` (newer, in `geminiService.js`)
- `@google/generative-ai` (older, in `geminiService2.js`)

This doubles AI-related dependency surface, makes upgrades harder, and is confusing for contributors.

---

## 🟡 Medium Severity

### 6. Synchronous PDF Processing — No Queue
**File:** `backend/controllers/documentController.js:49`

```js
// Comment in code:
// In production, use a queue like Bull
processPDF(document._id, req.file.path).catch(err => {
  console.error('PDF processing error:', err);
});
```
Large PDFs block the Node.js thread during parsing. Without a job queue, failed jobs aren't retried, and there's no backpressure mechanism.

---

### 7. Chunk Retrieval Uses Keyword Matching (Not Vector Embeddings)
**File:** `backend/utils/textChunker.js`

`findRelevantChunks()` uses a TF-like keyword frequency score. This means semantically related content with different vocabulary won't be found. A proper RAG system would use embedding vectors (e.g., Gemini embeddings + vector DB).

---

### 8. No Token Refresh Mechanism
**File:** `frontend/ai-learning-assistant/src/utils/axiosInstance.js`

The 401 response interceptor does **not** attempt token refresh — users are silently dropped or see a broken state when tokens expire (7 days). No refresh token flow exists.

---

### 9. `studyStreak` is Mock Data
**File:** `backend/controllers/progressController.js:50`

```js
const studyStreak = Math.floor(Math.random() * 7) + 1; // Mock data
```
The dashboard shows a random streak number on every load — not real activity tracking.

---

### 10. No Input Validation via express-validator
`express-validator` is installed but not used. Validation is done via manual `if (!field)` checks, inconsistently applied. Missing validation on several fields (e.g., username uniqueness check has a bug: only checks email in `register`).

---

### 11. `Course` Model Exists But Has No API Routes
**File:** `backend/models/Course.js`

A full `Course` schema and `buildCourse` engine (`learningPathEngine.js`) exist but are not wired to any route — the learning path feature is built but unreachable via the API.

---

## 🟢 Low Severity / Observations

### 12. `middleware/errorHandler.js` — Ordering in server.js
In `backend/server.js`, `errorHandler` is registered **before** the 404 catch-all handler (line 60 vs line 63). Express requires the 4-arg error handler to come last — the 404 handler placed after it will never properly catch errors forwarded by `next(error)`.

### 13. Large Embedded Arrays May Hit BSON Limits
Documents with many chunks (large PDFs) embed all text and chunk arrays in a single MongoDB document. MongoDB's 16MB BSON limit may be hit for very large documents. Consider GridFS or a separate `chunks` collection for production.

### 14. No Rate Limiting
No rate limiting on AI endpoints — a single user could exhaust Gemini API quota rapidly with repeated generation requests.

### 15. No `.gitignore` at Root
Each sub-project (`backend/`, `frontend/ai-learning-assistant/`) has its own `.gitignore`, but there's no root-level `.gitignore`. The `backend/.env` file may be at risk if not included in a sub-project `.gitignore`.

### 16. `googleapis` Dependency Not in `package.json`
`youtubeService.js` imports `googleapis` but this package is not listed in `backend/package.json`. This will cause a runtime crash if the learning path endpoint is reached.
