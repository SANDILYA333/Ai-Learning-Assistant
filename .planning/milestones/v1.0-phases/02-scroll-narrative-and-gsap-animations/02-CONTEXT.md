# Phase 2: Scroll Narrative & GSAP Animations — Context

**Gathered:** 2026-04-27
**Status:** Ready for planning
**Source:** User brief (PRD Express Path)

<domain>
## Phase Boundary

Implement the 5-section narrative scroll experience using GSAP ScrollTrigger. The 3D brain component built in Phase 1 becomes a pinned element that moves horizontally across the screen as the user scrolls through the sections.

**The 5 Sections:**
1. **Hero** (already scaffolded): Brain centered
2. **Upload**: Brain shifts left; document particle flow visual
3. **Quizzes/Flashcards**: Brain centers; flashcard preview visual
4. **AI Chat**: Brain shifts right; chat UI mockup visual
5. **Reminders/CTA**: Brain fully right, peak glow; final CTA button

</domain>

<decisions>
## Implementation Decisions

### Animation Engine (locked)
- Use `gsap` and `@gsap/react`
- Register `ScrollTrigger` plugin
- Create a master GSAP timeline that pins the main container and animates the brain's `x` position relative to scroll progress

### DOM Structure (locked)
- The main `LandingPage` container must be wrapped in a scrollable view or use a horizontal-scroll-style pinned container
- Easiest React approach: a main wrapper that is pinned using `ScrollTrigger`, with sections that scroll past, or a tall container where the sections translate up and the brain moves left/right.

### Brain Scroll Control (locked)
- Since the Brain is inside a Three.js `<Canvas>`, we can animate the `<group>` containing the brain mesh.
- Approach: pass scroll progress or target position as a prop from the parent `LandingPage` (which listens to GSAP) down to `Brain3D`, or use `ScrollTrigger` inside the Three.js context (less reliable), OR just use GSAP to animate the absolute-positioned `div` container wrapping the `<Canvas>` left and right.
- **Decision**: Animate the CSS `transform` of the wrapper `div` containing the `<Canvas>`. It's much more performant than triggering Three.js re-renders from React state on scroll, and easier to wire with standard HTML DOM ScrollTrigger.

### Visual Mockups (locked)
These should be purely HTML/CSS representations within the sections, not real functional components.
- Section 2 (Upload): Animated particle flow moving left-to-right (can be a simple CSS animation or GSAP dots)
- Section 3 (Flashcards): A frosted glass card (`backdrop-blur`) that floats
- Section 4 (Chat): Two chat bubbles fading in

### Text Reveals (locked)
- Each section's heading and paragraph should stagger-fade-up when that section enters the viewport.

</decisions>

<canonical_refs>
## Canonical References

### Existing files to read
- `frontend/ai-learning-assistant/src/pages/Landing/LandingPage.jsx`
- `frontend/ai-learning-assistant/src/pages/Landing/Brain3D.jsx`
- `.planning/PROJECT.md` — copy strings and layout goals
- `.planning/REQUIREMENTS.md` — Phase 2 requirement IDs

</canonical_refs>

---
*Phase: 02-scroll-narrative*
