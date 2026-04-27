---
phase: 3
name: Premium Polish & Responsive
wave: 1
requirements: [LAND-14, LAND-15, LAND-17, LAND-18, LAND-19, LAND-21, LAND-22, LAND-23]
autonomous: true
---

# Phase 3: Premium Polish & Responsive — Plan

**Goal:** Add the premium details: frosted glass navbar, custom cursor, glassmorphism UI tweaks, and mobile-responsive layout adjustments.

**Must-haves (goal-backward verification):**
1. Navbar component exists, is fixed, and uses `backdrop-filter: blur()`. It appears after scroll.
2. Custom cursor component exists, hides default cursor, and follows mouse using GSAP.
3. Mobile layout handles the 3D canvas gracefully (e.g., reduces opacity or centers the brain instead of shifting it off-screen on small viewports).

---

## Plan A — Premium Components & Integration

```yaml
wave: 1
depends_on: []
files_modified:
  - frontend/ai-learning-assistant/src/pages/Landing/LandingPage.jsx
  - frontend/ai-learning-assistant/src/pages/Landing/LandingNavbar.jsx
  - frontend/ai-learning-assistant/src/pages/Landing/CustomCursor.jsx
autonomous: true
```

### Task A1 — Build LandingNavbar and CustomCursor

<read_first>
- `frontend/ai-learning-assistant/src/pages/Landing/LandingPage.jsx`
</read_first>

<action>
1. Create `CustomCursor.jsx`:
   - A `div` fixed to the window with `pointer-events: none` and high `z-index`.
   - Uses `window.addEventListener('mousemove')` and `gsap.quickTo` for high-performance positioning.

2. Create `LandingNavbar.jsx`:
   - Contains Logo ("Intellilearn") and auth links (Login, Register).
   - Fixed at the top, `backdropFilter: 'blur(12px)'`, initially hidden/transformed out.
   - Use `useGSAP` with ScrollTrigger to animate it into view when `window.scrollY > 100`.

3. Update `LandingPage.jsx`:
   - Import and render `CustomCursor` and `LandingNavbar`.
   - Add responsive handling to the main GSAP timeline.
     - Use `gsap.matchMedia()` within the `useGSAP` hook so that the brain's `xPercent` shift only happens on desktop (e.g., `(min-width: 768px)`).
     - On mobile (`(max-width: 767px)`), fade the brain's opacity down and keep it centered so the text is legible.
</action>

<acceptance_criteria>
- `CustomCursor.jsx` implemented and tracks mouse
- `LandingNavbar.jsx` implemented and animates on scroll
- `LandingPage.jsx` uses `gsap.matchMedia` for responsive animations
</acceptance_criteria>

---

## Plan B — Final Verification

```yaml
wave: 2
depends_on: [Plan A]
files_modified: []
autonomous: true
```

### Task B1 — Verify complete functionality

<read_first>
- All files in `frontend/ai-learning-assistant/src/pages/Landing/`
</read_first>

<action>
Verify that all React components export correctly and the imports in `LandingPage.jsx` align with the created files.
</action>

<acceptance_criteria>
- No syntax errors across the 5 landing page components.
</acceptance_criteria>
