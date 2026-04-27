# Phase 1: Foundation & 3D Brain — Context

**Gathered:** 2026-04-27
**Status:** Ready for planning
**Source:** User brief (PRD Express Path)

<domain>
## Phase Boundary

Install Three.js ecosystem dependencies, wire the landing page `/` route into `App.jsx`, and build the crystalline 3D brain component with:
- Geometric/crystalline brain geometry (not anatomical)
- Gold pulsing neuron connection lines
- Particles drifting along neural pathways
- Slow idle Y-axis rotation
- Floating ambient particle field (Three.js Points) across the full scene

The canvas must render without errors. The brain must be visible, animated, and performant. This is the foundation everything else in Phase 2 and 3 builds on.

</domain>

<decisions>
## Implementation Decisions

### Dependencies (locked)
- Install in `frontend/ai-learning-assistant/`: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`
- Tailwind CSS v4 already installed — no changes needed
- No backend file changes whatsoever

### Route Change (locked)
- `frontend/ai-learning-assistant/src/App.jsx` — add ONE route: `<Route path="/" element={<LandingPage />} />`
- No other changes to App.jsx. Existing routes (`/login`, `/register`, `/dashboard`, etc.) untouched
- The landing page must NOT be wrapped in `<ProtectedRoute>` — it's fully public

### Brain Design (locked)
- Geometric / crystalline — built from icosahedron, octahedron, or custom geometry primitives
- NOT anatomical — no sulci, no realistic brain mesh
- Golden neuron connections: `LineSegments` or `Line` with emissive gold material (`#FFB347`)
- Neuron pulse: animate material `opacity` and `emissiveIntensity` over time (sine wave)
- Particle drift: `Points` geometry where particles move along predefined paths near the brain surface
- Idle rotation: `useFrame` hook increments `mesh.rotation.y` by a small delta each frame (~0.002 rad/frame)

### Colors (locked)
- Brain emissive gold: `#FFB347` primary, `#FF8C00` secondary/deeper
- Scene background: `#050510` (set via `scene.background` or CSS on canvas container)
- Neuron line opacity range: 0.3 → 1.0 (pulsing)
- Particle color: `#FFB347` with varying opacity

### Canvas Setup (locked)
- Use `<Canvas>` from `@react-three/fiber`
- Canvas fills full viewport height in the hero section
- `camera={{ position: [0, 0, 5], fov: 60 }}`
- `gl={{ antialias: true, alpha: true }}` for transparency
- Canvas container: absolute positioned, `z-index: 0`, behind text content

### Performance (locked)
- Three.js canvas must be lazy-loaded — use React `lazy()` + `Suspense`
- `frameloop="demand"` NOT used here — brain needs continuous idle rotation. Use default `frameloop="always"` but keep render cost low (simple geometry, minimal draw calls)

### File Structure (locked)
- New files go in: `frontend/ai-learning-assistant/src/pages/Landing/`
  - `LandingPage.jsx` — main page component
  - `Brain3D.jsx` — Three.js brain component
  - `ParticleField.jsx` — ambient background particles
- Do NOT create files in any other existing directory

### the agent's Discretion
- Exact brain geometry implementation (icosahedron vs custom mesh vs parametric)
- Number of neuron connection lines (suggest 30–80 for visual density without GPU cost)
- Particle count for ambient field (suggest 500–1500 points)
- Exact animation timing curves (suggest sine wave with period ~2-4 seconds for pulse)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing files to read (do not modify except App.jsx)
- `frontend/ai-learning-assistant/src/App.jsx` — add `/` route here ONLY
- `frontend/ai-learning-assistant/package.json` — install deps here
- `frontend/ai-learning-assistant/vite.config.js` — Vite config (check for any Three.js optimizations needed)
- `.planning/codebase/ARCHITECTURE.md` — existing frontend architecture patterns
- `.planning/codebase/STACK.md` — full dependency list

### Design spec (locked values)
- `.planning/PROJECT.md` — color system, copy, CTA routes, scope boundary

</canonical_refs>

<specifics>
## Specific Implementation Details

- Brain should have roughly 200–400 vertices worth of geometry
- Neuron lines connect random pairs of vertices from the brain geometry
- Ambient particles: a `Points` object with ~800 particles in a sphere of radius 4 around the brain
- The canvas container div should have `pointer-events: none` so text/CTAs beneath or above are clickable
- Import `@react-three/drei` for helpers like `OrbitControls` (disabled by default, useful for dev)
- Use `useRef` for the brain mesh, `useFrame` for animations
- All new components are functional components with hooks — no class components

</specifics>

<deferred>
## Deferred to Later Phases

- GSAP ScrollTrigger integration — Phase 2
- Brain position changes on scroll — Phase 2
- Navbar, cursor, glassmorphism — Phase 3
- Section copy and CTAs beyond hero structure — Phase 2
- Mobile responsive adjustments — Phase 3

</deferred>

---
*Phase: 01-foundation-and-3d-brain*
*Context gathered: 2026-04-27 via user brief*
