# Phase 3: Premium Polish & Responsive — Context

**Gathered:** 2026-04-27
**Status:** Ready for planning
**Source:** User brief (PRD Express Path)

<domain>
## Phase Boundary

Implement the final visual and functional polish for the Intellilearn landing page. This phase adds the "premium" feel requested by the user, including the frosted glass navigation bar, a custom glowing cursor, and responsive layout adjustments so it looks acceptable on mobile devices.

**Key Components to Add:**
1. **Glassmorphism Navbar:** Fixed at the top, appears only after the user scrolls past the hero section. Contains logo and "Log In" / "Start Free" CTA.
2. **Custom Cursor:** A glowing gold dot that follows the mouse using GSAP, replacing the default cursor.
3. **Responsive Tuning:** Adjusting font sizes using `clamp()` (mostly done) and ensuring the Brain layout works on smaller screens (e.g., hiding or shrinking it, adjusting padding).

</domain>

<decisions>
## Implementation Decisions

### Navbar (locked)
- Create a new component `LandingNavbar.jsx`.
- Use GSAP ScrollTrigger to fade/slide it in when the scroll passes the top 100px.
- Styling: `position: fixed`, `top: 0`, `z-index: 50`, `backdrop-filter: blur(12px)`, subtle bottom border.

### Custom Cursor (locked)
- Create a new component `CustomCursor.jsx`.
- Use a `fixed` div with `pointer-events: none` and `z-index: 9999`.
- Attach a global `mousemove` listener. Use `gsap.quickTo` for high-performance following, keeping the cursor smooth.
- Hide the default cursor in `.landing-root` via CSS: `cursor: none`.

### Responsive Adjustments (locked)
- Add simple CSS media queries or React conditional logic.
- On screens `< 768px`:
  - Change GSAP `xPercent` animations for the Brain wrapper so it doesn't move completely off-screen, or simply fade the brain opacity to 0.2 and keep it centered so the text remains readable over it.
  - Make sure section padding allows text to fit.

</decisions>

<canonical_refs>
## Canonical References

### Existing files to read
- `frontend/ai-learning-assistant/src/pages/Landing/LandingPage.jsx`
- `.planning/PROJECT.md` — copy strings and layout goals
- `.planning/REQUIREMENTS.md` — Phase 3 requirement IDs

</canonical_refs>

---
*Phase: 03-premium-polish*
