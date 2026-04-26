---
title: Code Conventions
last_mapped: 2026-04-26
---

# Code Conventions

## Module System

Both backend and frontend use **native ES Modules** (`"type": "module"` in package.json).
- All imports use `import`/`export` (no `require()`)
- File extensions are explicit in backend imports (`.js` required for ESM resolution):
  ```js
  import connectDB from './config/db.js'; // ✅
  import connectDB from './config/db';    // ❌ would fail in Node ESM
  ```

---

## Backend Conventions

### Controller Pattern
All controller functions follow the same shape:
```js
export const controllerName = async (req, res, next) => {
  try {
    // ... validate input
    // ... call model or service
    // ... respond with { success: true, data, message }
  } catch (error) {
    next(error); // always delegate errors to errorHandler
  }
};
```

### Response Shape
Every API response follows a consistent envelope:
```json
// Success
{ "success": true, "data": {}, "message": "..." }

// Error (via errorHandler)
{ "success": false, "error": "...", "statusCode": 400 }
```
Some older endpoints omit `message` or use slight variations but the `success/error` keys are consistent.

### Error Handling
- **Never** `throw` or `res.json()` directly for unhandled errors — always call `next(error)`.
- The global `errorHandler` in `backend/middleware/errorHandler.js` normalizes:
  - Mongoose `CastError` → 404 "Resource not found"
  - Mongoose `code: 11000` (duplicate key) → 400 "{field} already exists"
  - Mongoose `ValidationError` → 400 with joined message
  - Multer `LIMIT_FILE_SIZE` → 400
  - JWT errors → 401

### Model Conventions
- All schemas use `timestamps: true` → auto `createdAt`/`updatedAt`
- Passwords use `select: false` and are hashed in a `pre('save')` hook
- `matchPassword()` instance method on User for clean comparison
- Compound indexes on `{ userId, documentId }` for query performance
- Embedded arrays used for related data (chunks, cards, messages, questions)

### Middleware Ordering
In `server.js`, middleware is applied in this order:
1. `dotenv.config()`
2. CORS
3. `express.json()` + `express.urlencoded()`
4. Static file serving (`/uploads`)
5. Routes
6. Global error handler
7. 404 catch-all

> ⚠️ The 404 handler is placed **after** the error handler — this is incorrect; it should be before. Express's error handler should be last.

### Mongoose Usage
- `Document.findOne({ _id: id, userId: req.user._id })` — ownership check pattern used everywhere
- Aggregation used in `getDocuments` with `$lookup`, `$addFields`, `$project` for computed counts
- `document.toObject()` used before adding computed fields
- `findByIdAndUpdate` used for background PDF processing (async, not awaited by request)

### `__dirname` in ESM
Since `import.meta.url` is needed in ESM, all files needing `__dirname` do:
```js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

---

## Frontend Conventions

### Component Style
- Functional components with hooks only (no class components)
- Components use `import React from 'react'` (explicit, though not required in React 19)
- Named exports for context hooks, default exports for components/pages

### Tailwind Usage
- Utility classes applied directly in JSX — no separate CSS modules
- Global CSS in `index.css` (Tailwind imports + base overrides)
- Some ad-hoc styles in `App.css`

### Auth Pattern
```jsx
const { user, isAuthenticated, loading } = useAuth();
// check loading first, then isAuthenticated
```
Loading state handled at App level with a simple `<p>Loading...</p>` placeholder.

### API Call Pattern (Services)
Each service file wraps axiosInstance calls:
```js
// src/services/documentService.js example pattern
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

export const getDocuments = async () => {
  const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
  return response.data;
};
```

### Route Protection
```jsx
// App.jsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
  ...
</Route>
```
`ProtectedRoute` uses React Router's `<Outlet>` with `<Navigate to="/login">` fallback.

### Toast Notifications
`react-hot-toast` is the standard for user feedback. Import `toast` and call:
```js
toast.success('Flashcards generated!');
toast.error('Something went wrong');
```

### Markdown Rendering
AI responses rendered via `<MarkdownRenderer>` component:
- Uses `react-markdown` + `remark-gfm`
- Code blocks enhanced with `react-syntax-highlighter`

---

## Naming Conventions Summary

| Category | Convention | Example |
|----------|-----------|---------|
| Backend files | camelCase | `aiController.js` |
| Frontend components | PascalCase JSX | `FlashcardManager.jsx` |
| Frontend pages directories | PascalCase | `Documents/`, `Flashcards/` |
| Variables / functions | camelCase | `generateFlashcards`, `req.user` |
| Constants | camelCase objects | `API_PATHS.AUTH.LOGIN` |
| Env vars | SCREAMING_SNAKE | `GEMINI_API_KEY` |
| MongoDB models | PascalCase | `User`, `ChatHistory` |
| API routes | kebab-case segments | `/generate-flashcards`, `/chat-history` |

---

## Code Quality Observations

- Input validation is **manual** (if-checks in controllers) — `express-validator` is installed but not actively used
- No TypeScript — plain JavaScript throughout
- JSDoc comments present in `textChunker.js` but absent from most other files
- Inline comments used in controllers (e.g., `// @desc`, `// @route`, `// @access`)
- No `.editorconfig` or Prettier config detected — formatting is ESLint-only on frontend
