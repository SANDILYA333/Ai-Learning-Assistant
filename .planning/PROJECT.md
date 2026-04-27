# PROJECT: Intellilearn Landing Page

## What This Is

A world-class, premium animated landing page for **Intellilearn** — the AI-powered learning platform. This is a **brownfield frontend milestone**: the existing full-stack app (Express + MongoDB + React) is already built and working. This milestone adds a public-facing landing page at `/` that showcases the platform and drives user signups.

The landing page is purely frontend work. Backend, API routes, models, controllers, and all existing authenticated pages are completely off-limits. The only allowed touch on existing files is adding the `/` route to `App.jsx`.

---

## Core Value

**One thing that must work:** A breathtaking, scroll-driven experience where a live 3D crystalline brain is the narrative centerpiece — moving across the screen as the user scrolls through 5 sections — that converts visitors into signups.

---

## Context

**Project path:** `frontend/ai-learning-assistant/`
**Existing routes:** `/login` → `LoginPage.jsx`, `/register` → `RegisterPage.jsx`
**CTA targets:** `Start Learning Free` → `/register`, `Get Started` → `/register`, `Login` → `/login`
**Scope boundary:** `App.jsx` may only have the `/` route added — no other changes to existing files.

### Existing Stack (do not change)
- React 19 + Vite 7
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- react-router-dom v7
- axios, lucide-react, react-hot-toast, react-markdown

### New Dependencies to Install
- `three` — 3D engine
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — Three.js helpers
- `gsap` + `@gsap/react` — Animation engine
- `@studio-freight/lenis` — Smooth scroll (optional but recommended)

---

## Requirements

### Validated (existing app capabilities — already in codebase)

- ✓ User authentication (register, login, JWT) — existing
- ✓ PDF document upload + AI processing — existing
- ✓ AI flashcard generation from documents — existing
- ✓ AI quiz generation from documents — existing
- ✓ AI chat with document context — existing
- ✓ Progress dashboard — existing
- ✓ Learning path engine (built, not yet routed) — existing

### Active (this milestone — landing page)

- [ ] **LAND-01**: Landing page renders at `/` with full hero section and 3D brain
- [ ] **LAND-02**: Abstract crystalline/geometric 3D brain with golden neuron pulse animations and idle rotation
- [ ] **LAND-03**: Floating particle field background (Three.js points system)
- [ ] **LAND-04**: GSAP ScrollTrigger drives brain position left→right across 5 pinned scroll sections
- [ ] **LAND-05**: Hero section — headline, subtext, two CTAs (gold filled + ghost)
- [ ] **LAND-06**: Upload section — brain shifts left, document-to-brain particle flow animation
- [ ] **LAND-07**: Quizzes & Flashcards section — floating glassmorphism flashcard preview animates in
- [ ] **LAND-08**: AI Chat section — brain shifts right, subtle chat UI mockup fades in
- [ ] **LAND-09**: Reminders + Final CTA section — brain fully right, peak glow, gold pulse button
- [ ] **LAND-10**: Frosted glass navbar (logo left, Login + Get Started right) that appears on scroll
- [ ] **LAND-11**: Custom animated cursor (glowing gold dot)
- [ ] **LAND-12**: Staggered word/line text reveal animations on scroll (GSAP)
- [ ] **LAND-13**: Glassmorphism feature cards with gold borders and soft inner glow
- [ ] **LAND-14**: Color system: `#050510` background, `#1a0533` gradient, `#FFB347`/`#FF8C00` gold, `#4FC3F7` blue
- [ ] **LAND-15**: Typography: Inter or Syne — large, bold, confident headlines
- [ ] **LAND-16**: Desktop-first responsive layout, mobile-graceful
- [ ] **LAND-17**: Performance: lazy-loaded Three.js canvas, no scroll jank

### Out of Scope

- Any backend file changes — strictly forbidden for this milestone
- Authentication logic changes — existing pages untouched
- `/signup` alias route — CTA links to existing `/register`
- Anatomical brain model — design is geometric/crystalline, not realistic
- Mobile-first optimization — desktop-first; mobile is graceful, not primary
- SEO / SSR — this is a client-side SPA, no SSR needed

---

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Three.js via @react-three/fiber | React-idiomatic 3D, easier integration with React scroll state | ✓ Locked |
| GSAP ScrollTrigger (not Framer Motion) | ScrollTrigger is the industry standard for pinned scroll narratives | ✓ Locked |
| Tailwind v4 for layout/styling | Already installed, no additional setup | ✓ Locked |
| Brain = geometric/crystalline, not anatomical | Premium aesthetic — think Framer/Linear, not medical textbook | ✓ Locked |
| CTA → `/register` (not `/signup`) | Reuse existing route, zero new routing overhead | ✓ Locked |
| Only `App.jsx` touched from existing files | Absolute minimum footprint on existing authenticated app | ✓ Locked |
| Gold `#FFB347` primary, space black `#050510` bg | Unique, premium, unlike typical blue SaaS — stands out | ✓ Locked |

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements validated? → Move to Validated with phase reference
2. New requirements emerged? → Add to Active
3. Decisions to log? → Add to Key Decisions

**After milestone complete:**
1. Full review of all sections
2. Core Value check — 3D brain still the hero?
3. Audit Out of Scope — reasons still valid?

---
*Last updated: 2026-04-27 after initialization*
