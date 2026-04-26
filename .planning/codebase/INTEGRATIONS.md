---
title: External Integrations
last_mapped: 2026-04-26
---

# External Integrations

## 1. Google Gemini AI

### Package
- `@google/genai ^1.41.0` (primary, newer SDK)
- `@google/generative-ai ^0.24.1` (secondary, legacy SDK)

### Configuration
- API key: `process.env.GEMINI_API_KEY`
- Hard exit on startup if key missing (`backend/utils/geminiService.js` line 8–11)

### Models Used
| Model | SDK | Usage |
|-------|-----|-------|
| `gemini-2.5-flash-lite` | `@google/genai` | Flashcards, quiz, summary, chat, concept explanation |
| `gemini-1.5-flash` | `@google/generative-ai` | Structured learning path generation (JSON mode) |

### Endpoints Consumed
All calls use `ai.models.generateContent()` or `model.generateContent()` — REST-style, not streaming.

### Service Files
- `backend/utils/geminiService.js` — 5 exported functions:
  - `generateFlashcards(text, count)` — parses `Q:/A:/D:` format
  - `generateQuiz(text, numQuestions)` — parses `Q:/01:/C:/E:/D:` format
  - `generateSummary(text)` — free text summary
  - `chatWithContext(question, chunks)` — RAG chat answer
  - `explainConcept(concept, context)` — concept explanation
- `backend/utils/geminiService2.js` — 1 exported function:
  - `generateLearningPath({topic, customContent, difficulty, duration, chapterCount})` — returns structured JSON course outline

### Text Truncation Limits
| Operation | Max chars sent to AI |
|-----------|---------------------|
| Flashcards | 15,000 |
| Quiz | 15,000 |
| Summary | 20,000 |
| Chat | N/A (chunks only) |
| Concept explain | 10,000 |

---

## 2. YouTube Data API v3

### Package
- `googleapis` (via `google.youtube`)

### Configuration
- API key: `process.env.YOUTUBE_API_KEY`

### Service File
- `backend/utils/youtubeService.js`
  - `fetchVideoForChapter(chapterTitle, topic)` — searches 1 video per chapter title

### Usage
Called by `backend/utils/learningPathEngine.js` when `config.includeVideos === true`. Returns `videoId` (string) or `null` on error/empty results.

---

## 3. MongoDB (via Mongoose)

### Configuration
- URI: `process.env.MONGODB_URI`
- Connection: `backend/config/db.js` — async connection with `process.exit(1)` on failure

### Collections & Schemas
| Collection | Model File | Key Fields |
|------------|-----------|------------|
| `users` | `backend/models/User.js` | `username`, `email`, `password` (bcrypt), `profileImage` |
| `documents` | `backend/models/Document.js` | `userId`, `title`, `fileName`, `filePath`, `extractedText`, `chunks[]`, `status` |
| `flashcards` | `backend/models/Flashcard.js` | `userId`, `documentId`, `cards[]` (Q/A/difficulty/reviewCount/isStarred) |
| `quizzes` | `backend/models/Quiz.js` | `userId`, `documentId`, `questions[]`, `userAnswers[]`, `score`, `completedAt` |
| `chathistories` | `backend/models/ChatHistory.js` | `userId`, `documentId`, `messages[]` (role/content/relevantChunks) |
| `courses` | `backend/models/Course.js` | `user`, `topic`, `difficulty`, `chapters[]`, `progress` |

### Indexes
| Collection | Index |
|------------|-------|
| `documents` | `{ userId: 1, uploadDate: -1 }` |
| `flashcards` | `{ userId: 1, documentId: 1 }` |
| `quizzes` | `{ userId: 1, documentId: 1 }` |
| `chathistories` | `{ userId: 1, documentId: 1 }` |
| `courses` | `{ user: 1 }`, `{ topic: 1 }` |

---

## 4. Local File System (PDF Uploads)

### Storage
- Upload directory: `backend/uploads/documents/`
- Auto-created on startup by multer config
- Files served statically: `GET /uploads/:filename` → `backend/uploads/documents/`

### File URL Format
```
http://localhost:8000/uploads/<timestamp>-<random>-<originalname>.pdf
```

### Cleanup
- On document delete: `fs.unlink(document.filePath)` (silently ignores errors)
- On upload error: uploaded file deleted via `fs.unlink(req.file.path)`

> ⚠️ **Note:** `filePath` in the DB stores the full HTTP URL (`http://localhost:8000/uploads/...`), but deletion uses this as a local path — this is a known bug (see CONCERNS.md).

---

## 5. CORS

Backend allows cross-origin requests only from:
```
http://localhost:5173
```
Credentials are enabled (`credentials: true`).

This is hardcoded in `backend/server.js` — not env-configurable.
