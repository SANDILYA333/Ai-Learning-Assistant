# REQUIREMENTS — Intellilearn Landing Page
> Milestone: Landing Page v1 | Initialized: 2026-04-27

---

## v1 Requirements

### Foundation & Setup

- [ ] **LAND-01**: Landing page renders at `/` — `App.jsx` gets one new route pointing to `LandingPage` component; zero other changes to existing files
- [ ] **LAND-02**: Install and configure `three`, `@react-three/fiber`, `@react-three/drei`, `gsap` in `frontend/ai-learning-assistant/`

### 3D Brain & Scene

- [ ] **LAND-03**: Abstract crystalline/geometric 3D brain renders in a Three.js canvas — not anatomical; built from geometric primitives or custom geometry
- [ ] **LAND-04**: Golden neuron connection lines pulse and glow like living electricity (animated material opacity/emissive)
- [ ] **LAND-05**: Particle drift — particles flow along neural pathways of the brain
- [ ] **LAND-06**: Brain idle rotation — slow continuous self-rotation on Y-axis when not scroll-driven
- [ ] **LAND-07**: Floating ambient particle field across full scene background (Three.js `Points` system)

### Scroll Narrative (5 Sections)

- [ ] **LAND-08**: GSAP ScrollTrigger pins the page and drives the brain's X position from center → right across 5 sections
- [ ] **LAND-09**: **Hero section** — Brain centered, full glow intro animation; headline *"The Smartest Way to Learn Anything."*; subtext; `Start Learning Free` (gold filled → `/register`) and `See How It Works` (ghost) CTAs
- [ ] **LAND-10**: **Upload section** — Brain shifts left; headline *"Drop Your Notes. Watch Them Come Alive."*; animated document-to-brain particle flow visual
- [ ] **LAND-11**: **Quizzes & Flashcards section** — Brain center; headline *"Your Personal AI Quizmaster."*; floating glassmorphism flashcard preview animates in
- [ ] **LAND-12**: **AI Chat section** — Brain shifts right; headline *"Ask Anything. Understand Everything."*; subtle chat UI mockup fades in
- [ ] **LAND-13**: **Reminders + CTA section** — Brain fully right, peak glow intensity; headline *"Never Forget What You Learned."*; `Join Intellilearn Free` gold button with glow pulse animation; social proof subline

### UI & Animations

- [ ] **LAND-14**: Frosted glass navbar — Intellilearn logo left, `Login` + `Get Started` right; appears on scroll (not visible at page load top)
- [ ] **LAND-15**: Custom animated cursor — glowing gold dot that follows mouse
- [ ] **LAND-16**: GSAP staggered text reveals — words or lines stagger in as each section enters viewport
- [ ] **LAND-17**: Glassmorphism feature cards — `backdrop-blur`, subtle gold `#FFB347` borders, soft inner glow

### Visual Design System

- [ ] **LAND-18**: Color system applied globally: background `#050510`, radial gradient `#1a0533`, gold glow `#FFB347` → `#FF8C00`, accent blue `#4FC3F7`
- [ ] **LAND-19**: Typography: `Inter` or `Syne` loaded via Google Fonts — large, bold, confident headlines; applies to all landing page text
- [ ] **LAND-20**: Section transitions use fade + slide-up GSAP reveals

### Performance & Responsive

- [ ] **LAND-21**: Three.js canvas is lazy-loaded — does not block initial page paint
- [ ] **LAND-22**: No scroll jank — GSAP ScrollTrigger + Three.js rendering stay in sync at 60fps
- [ ] **LAND-23**: Desktop-first layout; mobile-graceful (3D brain degrades gracefully on small screens — simplified or hidden)

---

## v2 Requirements (Deferred)

- Mobile-first optimization with full 3D experience on mobile
- Light mode variant
- Real social proof / testimonials section
- Video demo embed
- Blog / resources section
- SEO / SSR (requires Next.js migration)
- `/signup` alias route

---

## Out of Scope

- Any backend file changes — `backend/` directory is completely off-limits
- Changes to existing authenticated pages (`LoginPage`, `RegisterPage`, `DashboardPage`, etc.)
- Anatomical brain model — geometric/crystalline only
- New route aliases beyond what's in App.jsx
- SSR / SEO optimization
- Mobile-first (desktop-first; mobile graceful but not primary)

---

## Traceability

| REQ-ID | Phase |
|--------|-------|
| LAND-01, LAND-02 | Phase 1 |
| LAND-03, LAND-04, LAND-05, LAND-06, LAND-07 | Phase 1 |
| LAND-08, LAND-09, LAND-10, LAND-11, LAND-12, LAND-13 | Phase 2 |
| LAND-14, LAND-15, LAND-16, LAND-17 | Phase 3 |
| LAND-18, LAND-19, LAND-20 | Phase 3 |
| LAND-21, LAND-22, LAND-23 | Phase 3 |
