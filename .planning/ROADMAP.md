# ROADMAP — Intellilearn Landing Page
> Milestone: Landing Page v1 | Mode: YOLO | Granularity: Coarse | Initialized: 2026-04-27

---

## Milestone Goal

Ship a world-class, premium animated landing page that converts visitors to signups. A scroll-driven 3D crystalline brain is the narrative centerpiece. Three coarse phases: Foundation → Scroll Narrative → Premium Polish.

---

## Phases

### Phase 1 — Foundation & 3D Brain
**Goal:** Install dependencies, wire the `/` route, build the crystalline 3D brain with pulse animations, idle rotation, and particle field. The canvas renders and the brain lives.

**Requirements:** LAND-01, LAND-02, LAND-03, LAND-04, LAND-05, LAND-06, LAND-07

**Success Criteria:**
1. Navigating to `/` renders the landing page without errors or white screen
2. A 3D geometric brain is visible in the canvas with gold-glowing neuron connections
3. Particles drift along neural pathways and the brain slowly rotates on idle
4. Background particle field (Three.js Points) is visible across the full scene
5. Three.js canvas does not crash or flicker; no console errors from WebGL

**Canonical refs:**
- `frontend/ai-learning-assistant/src/App.jsx` — only file to modify in existing codebase
- `frontend/ai-learning-assistant/package.json` — add new deps here
- `.planning/codebase/ARCHITECTURE.md` — existing frontend architecture

**UI hint:** yes

---

### Phase 2 — Scroll Narrative & GSAP Animations
**Goal:** Wire GSAP ScrollTrigger to create the 5-section pinned scroll experience. Brain moves left→right. Each section has its headline, content, and section-specific visual (particle flow, flashcard preview, chat mockup). Text stagger reveals on scroll.

**Requirements:** LAND-08, LAND-09, LAND-10, LAND-11, LAND-12, LAND-13, LAND-16, LAND-20

**Depends on:** Phase 1 (brain component must exist)

**Success Criteria:**
1. Scrolling drives the brain smoothly from center → left → center → right → far right across 5 sections
2. Each of the 5 sections is visible in sequence with correct headline and description copy
3. Hero CTAs (`Start Learning Free` → `/register`, `See How It Works` ghost) are present and working
4. Final CTA `Join Intellilearn Free` navigates to `/register` and has a gold glow pulse animation
5. Text in each section staggers in on scroll (not all visible at once on page load)
6. Section-specific visuals (particle flow, flashcard preview, chat mockup) are present and animated

**Canonical refs:**
- `frontend/ai-learning-assistant/src/pages/` — reference existing page structure for component placement
- `.planning/PROJECT.md` — all copy strings and CTA targets locked here

**UI hint:** yes

---

### Phase 3 — Premium Polish & Responsive
**Goal:** Add the premium details that make it feel world-class: frosted glass navbar (appears on scroll), custom gold cursor, glassmorphism cards, full color system, typography (Inter/Syne), performance (lazy Three.js), mobile-graceful layout.

**Requirements:** LAND-14, LAND-15, LAND-17, LAND-18, LAND-19, LAND-21, LAND-22, LAND-23

**Depends on:** Phase 2 (scroll narrative must be complete)

**Success Criteria:**
1. Frosted glass navbar is invisible at the very top; appears (slides/fades in) after first scroll
2. Custom glowing gold cursor dot follows the mouse throughout the page
3. Glassmorphism cards have `backdrop-blur`, visible gold borders, and soft inner glow
4. Color system is consistent: `#050510` bg, `#1a0533` gradient visible, gold/amber/blue palette applied
5. Google Font (Inter or Syne) is loaded and applied to all landing page headings
6. Three.js canvas is lazy-loaded — Lighthouse shows no render-blocking from 3D canvas
7. On mobile viewport (≤768px): page is readable and usable; 3D brain is either simplified or gracefully hidden

---

## Backlog (999.x)

*Ideas deferred from this milestone — revisit in v2:*

- 999.1 — Mobile-first full 3D experience on small screens
- 999.2 — Light mode variant
- 999.3 — Video demo embed in hero
- 999.4 — Real testimonials / social proof section
- 999.5 — SEO + SSR (requires Next.js migration)

---

## Requirement Coverage

All 23 LAND-xx requirements are mapped:

| Requirement | Phase |
|-------------|-------|
| LAND-01 to LAND-07 | Phase 1 |
| LAND-08 to LAND-13, LAND-16, LAND-20 | Phase 2 |
| LAND-14, LAND-15, LAND-17 to LAND-19, LAND-21 to LAND-23 | Phase 3 |

Coverage: 100% ✓
