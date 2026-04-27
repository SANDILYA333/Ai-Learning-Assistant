---
phase: 1
name: Foundation & 3D Brain
wave: 1
requirements: [LAND-01, LAND-02, LAND-03, LAND-04, LAND-05, LAND-06, LAND-07]
autonomous: true
---

# Phase 1: Foundation & 3D Brain — Plan

**Goal:** Install dependencies, wire `/` route, build the crystalline 3D brain with gold neuron pulses, particle drift, idle rotation, and ambient particle field.

**Must-haves (goal-backward verification):**
1. `/` renders a page with a visible 3D brain canvas — no white screen, no console errors
2. Brain geometry is geometric/crystalline (icosahedron-based), NOT anatomical
3. Gold neuron connection lines visibly pulse (opacity animates)
4. Particles drift near the brain surface
5. Brain slowly rotates on idle (Y-axis)
6. Ambient floating particle field visible in background
7. Three.js canvas is lazy-loaded

---

## Plan A — Install Dependencies & Wire Route

```yaml
wave: 1
depends_on: []
files_modified:
  - frontend/ai-learning-assistant/package.json
  - frontend/ai-learning-assistant/src/App.jsx
autonomous: true
```

### Task A1 — Install Three.js ecosystem and GSAP

<read_first>
- `frontend/ai-learning-assistant/package.json` — check existing deps before install
- `frontend/ai-learning-assistant/vite.config.js` — check for any optimizeDeps config
</read_first>

<action>
Run these commands from within `frontend/ai-learning-assistant/`:

```bash
cd "frontend/ai-learning-assistant"
npm install three @react-three/fiber @react-three/drei gsap
```

Expected additions to package.json dependencies:
- `"three": "^0.176.0"` (or latest)
- `"@react-three/fiber": "^8.x"` (or latest compatible with React 19)
- `"@react-three/drei": "^9.x"`
- `"gsap": "^3.x"`

After install, verify no peer dependency conflicts in the npm output. If React 19 compat warnings appear for r3f, add to `vite.config.js` under `optimizeDeps.include`: `['three', '@react-three/fiber', '@react-three/drei']`.
</action>

<acceptance_criteria>
- `frontend/ai-learning-assistant/node_modules/three/` directory exists
- `frontend/ai-learning-assistant/node_modules/@react-three/fiber/` directory exists
- `frontend/ai-learning-assistant/node_modules/gsap/` directory exists
- `frontend/ai-learning-assistant/package.json` contains `"three"` in dependencies
- `frontend/ai-learning-assistant/package.json` contains `"@react-three/fiber"` in dependencies
- `frontend/ai-learning-assistant/package.json` contains `"gsap"` in dependencies
- `npm install` exits with code 0 (no fatal errors)
</acceptance_criteria>

---

### Task A2 — Create Landing page directory structure

<read_first>
- `frontend/ai-learning-assistant/src/pages/` — existing pages structure (PascalCase directories)
</read_first>

<action>
Create the following directory and empty placeholder files:

```
frontend/ai-learning-assistant/src/pages/Landing/
  LandingPage.jsx         ← main page component (scaffold only in this task)
  Brain3D.jsx             ← Three.js brain (scaffold only)
  ParticleField.jsx       ← ambient particles (scaffold only)
```

Scaffold content for `LandingPage.jsx`:
```jsx
import React, { Suspense, lazy } from 'react';

const Brain3D = lazy(() => import('./Brain3D'));

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Suspense fallback={<div className="canvas-loading" />}>
        <Brain3D />
      </Suspense>
    </div>
  );
}
```

Scaffold content for `Brain3D.jsx`:
```jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';

export default function Brain3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.3} />
    </Canvas>
  );
}
```

Scaffold content for `ParticleField.jsx`:
```jsx
import React from 'react';

export default function ParticleField() {
  return null; // implemented in Task B3
}
```
</action>

<acceptance_criteria>
- `frontend/ai-learning-assistant/src/pages/Landing/LandingPage.jsx` exists
- `frontend/ai-learning-assistant/src/pages/Landing/Brain3D.jsx` exists
- `frontend/ai-learning-assistant/src/pages/Landing/ParticleField.jsx` exists
- `LandingPage.jsx` contains `import { Suspense, lazy }`
- `Brain3D.jsx` contains `import { Canvas } from '@react-three/fiber'`
</acceptance_criteria>

---

### Task A3 — Wire `/` route in App.jsx

<read_first>
- `frontend/ai-learning-assistant/src/App.jsx` — read ENTIRE file before making any change; understand existing route structure
</read_first>

<action>
Add exactly ONE import and ONE route to `App.jsx`. No other changes.

Add this import near the top with other page imports:
```jsx
import LandingPage from './pages/Landing/LandingPage';
```

Add this route BEFORE the authenticated routes (before the ProtectedRoute wrapper), so it renders without auth:
```jsx
<Route path="/" element={<LandingPage />} />
```

The `/` route must NOT be inside `<ProtectedRoute>` or any auth wrapper.

IMPORTANT: Do not modify, remove, or reorder any existing routes. Do not change any existing imports. Only add the two lines above.
</action>

<acceptance_criteria>
- `frontend/ai-learning-assistant/src/App.jsx` contains `import LandingPage from './pages/Landing/LandingPage'`
- `frontend/ai-learning-assistant/src/App.jsx` contains `<Route path="/" element={<LandingPage />}`
- All existing routes in App.jsx are unchanged (verify by reading file after edit)
- The number of `<Route` elements in App.jsx is exactly one more than before the edit
</acceptance_criteria>

---

## Plan B — Build the Crystalline Brain

```yaml
wave: 2
depends_on: [Plan A]
files_modified:
  - frontend/ai-learning-assistant/src/pages/Landing/Brain3D.jsx
autonomous: true
```

### Task B1 — Build crystalline brain geometry

<read_first>
- `frontend/ai-learning-assistant/src/pages/Landing/Brain3D.jsx` — read current scaffold
- `frontend/ai-learning-assistant/node_modules/three/src/geometries/IcosahedronGeometry.js` (or just know the API: `new THREE.IcosahedronGeometry(radius, detail)`)
</read_first>

<action>
Replace `Brain3D.jsx` with the full implementation:

```jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Brain Mesh ───────────────────────────────────────────────
function BrainMesh() {
  const meshRef = useRef();
  const edgesRef = useRef();

  // Crystalline geometry: IcosahedronGeometry detail=2 gives ~80 vertices
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.4, 2), []);

  // Wireframe edges for the crystalline look
  const edgesGeometry = useMemo(
    () => new THREE.EdgesGeometry(geometry),
    [geometry]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Idle rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    }
    if (edgesRef.current) {
      edgesRef.current.rotation.y = meshRef.current.rotation.y;
      edgesRef.current.rotation.x = meshRef.current.rotation.x;
    }
  });

  return (
    <group>
      {/* Solid inner core — very transparent */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#FFB347"
          transparent
          opacity={0.08}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      {/* Crystalline edges */}
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial color="#FFB347" transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}

// ─── Neuron Connections ────────────────────────────────────────
function NeuronConnections() {
  const linesRef = useRef();

  const { positions, lineCount } = useMemo(() => {
    const baseGeom = new THREE.IcosahedronGeometry(1.4, 2);
    const pos = baseGeom.attributes.position;
    const vertices = [];
    for (let i = 0; i < pos.count; i++) {
      vertices.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
    }

    const linePositions = [];
    const count = Math.min(50, vertices.length);
    for (let i = 0; i < count; i++) {
      const a = vertices[Math.floor(Math.random() * vertices.length)];
      const b = vertices[Math.floor(Math.random() * vertices.length)];
      linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    baseGeom.dispose();
    return { positions: new Float32Array(linePositions), lineCount: count };
  }, []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (linesRef.current) {
      // Pulse opacity with sine wave, period ~3s
      linesRef.current.material.opacity = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.7));
      // Rotate with the brain
      linesRef.current.rotation.y += 0.002;
      linesRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        color="#FFB347"
        transparent
        opacity={0.6}
        linewidth={1}
      />
    </lineSegments>
  );
}

// ─── Brain Particles (neural pathway drift) ────────────────────
function BrainParticles() {
  const pointsRef = useRef();

  const { positions, phases } = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribute on a sphere of radius ~1.8 (just outside brain)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.4 + Math.random() * 0.8;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      ph[i] = Math.random() * Math.PI * 2; // random phase offset
    }
    return { positions: pos, phases: ph };
  }, []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
    return g;
  }, [positions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < phases.length; i++) {
        const phi = phases[i];
        // Subtle oscillation along radial direction
        const base = positions.slice(i * 3, i * 3 + 3);
        const len = Math.sqrt(base[0] ** 2 + base[1] ** 2 + base[2] ** 2);
        const offset = 0.08 * Math.sin(t * 1.5 + phi);
        const scale = (len + offset) / len;
        pos.setXYZ(i, base[0] * scale, base[1] * scale, base[2] * scale);
      }
      pos.needsUpdate = true;
      pointsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#FFB347"
        size={0.03}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Scene Lights ──────────────────────────────────────────────
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 3]} color="#FFB347" intensity={2} distance={10} />
      <pointLight position={[-3, -2, -2]} color="#4FC3F7" intensity={1} distance={8} />
    </>
  );
}

// ─── Main Canvas Export ────────────────────────────────────────
export default function Brain3D({ style }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none', ...style }}
    >
      <SceneLights />
      <BrainMesh />
      <NeuronConnections />
      <BrainParticles />
    </Canvas>
  );
}
```
</action>

<acceptance_criteria>
- `Brain3D.jsx` contains `IcosahedronGeometry`
- `Brain3D.jsx` contains `useFrame` with `rotation.y += 0.002`
- `Brain3D.jsx` contains `NeuronConnections` function component
- `Brain3D.jsx` contains `BrainParticles` function component
- `Brain3D.jsx` contains `Math.sin` for pulse animation
- `Brain3D.jsx` exports `default function Brain3D`
- `Brain3D.jsx` contains `pointerEvents: 'none'` on the Canvas
</acceptance_criteria>

---

### Task B2 — Build ambient background particle field

<read_first>
- `frontend/ai-learning-assistant/src/pages/Landing/ParticleField.jsx` — current scaffold
- `frontend/ai-learning-assistant/src/pages/Landing/Brain3D.jsx` — understand Canvas context (ParticleField renders INSIDE the same Canvas)
</read_first>

<action>
Replace `ParticleField.jsx` with a Three.js Points component that renders INSIDE the Canvas:

```jsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleField({ count = 1000, spread = 10 }) {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.5;
    }
    return pos;
  }, [count, spread]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#4FC3F7"
        size={0.015}
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}
```

Then update `Brain3D.jsx` to import and include `ParticleField` inside the Canvas:

```jsx
// Add at top of Brain3D.jsx:
import ParticleField from './ParticleField';

// Add inside <Canvas> in Brain3D.jsx (after SceneLights, before other components):
<ParticleField count={1000} spread={12} />
```
</action>

<acceptance_criteria>
- `ParticleField.jsx` contains `bufferAttribute` with positions
- `ParticleField.jsx` contains `useFrame` with slow rotation
- `ParticleField.jsx` exports `default function ParticleField`
- `Brain3D.jsx` contains `import ParticleField from './ParticleField'`
- `Brain3D.jsx` Canvas JSX contains `<ParticleField`
</acceptance_criteria>

---

## Plan C — Landing Page Layout & Styles

```yaml
wave: 2
depends_on: [Plan A]
files_modified:
  - frontend/ai-learning-assistant/src/pages/Landing/LandingPage.jsx
  - frontend/ai-learning-assistant/src/index.css
autonomous: true
```

### Task C1 — Build LandingPage component with hero section structure

<read_first>
- `frontend/ai-learning-assistant/src/pages/Landing/LandingPage.jsx` — current scaffold
- `frontend/ai-learning-assistant/src/index.css` — existing global styles (Tailwind v4 setup)
- `frontend/ai-learning-assistant/src/App.css` — existing app styles
</read_first>

<action>
Replace `LandingPage.jsx` with the full layout component:

```jsx
import React, { Suspense, lazy } from 'react';

// Lazy load Three.js canvas — does not block initial paint
const Brain3D = lazy(() => import('./Brain3D'));

export default function LandingPage() {
  return (
    <div
      className="landing-root"
      style={{
        background: 'radial-gradient(ellipse at 60% 20%, #1a0533 0%, #050510 60%)',
        minHeight: '100vh',
        fontFamily: "'Inter', 'Syne', system-ui, sans-serif",
        color: '#ffffff',
        overflowX: 'hidden',
      }}
    >
      {/* ── Hero Section ─────────────────────────────── */}
      <section
        id="hero"
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* 3D Canvas — behind text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          <Suspense fallback={<div style={{ background: '#050510', width: '100%', height: '100%' }} />}>
            <Brain3D style={{ width: '100%', height: '100%' }} />
          </Suspense>
        </div>

        {/* Hero text — above canvas */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            maxWidth: '760px',
            padding: '0 2rem',
          }}
        >
          <p
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#FFB347',
              marginBottom: '1.2rem',
              opacity: 0.85,
            }}
          >
            Powered by Gemini AI
          </p>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 60%, #FFB347 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The Smartest Way<br />to Learn Anything.
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '520px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Intellilearn turns your documents into an AI-powered learning engine.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Primary CTA */}
            <a
              href="/register"
              style={{
                display: 'inline-block',
                padding: '0.9rem 2rem',
                background: 'linear-gradient(135deg, #FFB347, #FF8C00)',
                color: '#050510',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 0 24px rgba(255,179,71,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 36px rgba(255,179,71,0.6)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 24px rgba(255,179,71,0.4)';
              }}
            >
              Start Learning Free
            </a>
            {/* Ghost CTA */}
            <a
              href="#how-it-works"
              style={{
                display: 'inline-block',
                padding: '0.9rem 2rem',
                border: '1.5px solid rgba(255,179,71,0.4)',
                color: '#FFB347',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                background: 'rgba(255,179,71,0.05)',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,179,71,0.8)';
                e.currentTarget.style.background = 'rgba(255,179,71,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,179,71,0.4)';
                e.currentTarget.style.background = 'rgba(255,179,71,0.05)';
              }}
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            opacity: 0.5,
          }}
        >
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(#FFB347, transparent)' }} />
        </div>
      </section>

      {/* ── Placeholder sections for Phase 2 ────────── */}
      <section id="how-it-works" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>Sections — Phase 2</p>
      </section>
    </div>
  );
}
```
</action>

<acceptance_criteria>
- `LandingPage.jsx` contains `const Brain3D = lazy(() => import('./Brain3D'))`
- `LandingPage.jsx` contains `<Suspense`
- `LandingPage.jsx` contains `href="/register"` for the primary CTA
- `LandingPage.jsx` contains `href="#how-it-works"` for the ghost CTA
- `LandingPage.jsx` contains `id="hero"` on the hero section
- `LandingPage.jsx` contains `radial-gradient` for background
- `LandingPage.jsx` contains `The Smartest Way` headline text
- `LandingPage.jsx` contains `Intellilearn turns your documents` subtext
</acceptance_criteria>

---

### Task C2 — Add Google Fonts (Inter) to index.html

<read_first>
- `frontend/ai-learning-assistant/index.html` — root HTML file (Vite uses this)
</read_first>

<action>
Add Inter and Syne font imports to `frontend/ai-learning-assistant/index.html` in the `<head>` section:

```html
<!-- Add after existing <title> or <meta> tags in <head>: -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Syne:wght@700;800&display=swap" rel="stylesheet">
```

Also update the `<title>` tag:
```html
<title>Intellilearn — The Smartest Way to Learn Anything</title>
```
</action>

<acceptance_criteria>
- `frontend/ai-learning-assistant/index.html` contains `fonts.googleapis.com`
- `frontend/ai-learning-assistant/index.html` contains `family=Inter`
- `frontend/ai-learning-assistant/index.html` contains `Intellilearn` in `<title>`
</acceptance_criteria>

---

## Plan D — Smoke Test

```yaml
wave: 3
depends_on: [Plan B, Plan C]
files_modified: []
autonomous: true
```

### Task D1 — Start dev server and verify render

<read_first>
- `frontend/ai-learning-assistant/package.json` — verify `"dev": "vite"` script
</read_first>

<action>
Run the development server and verify Phase 1 success criteria:

```bash
cd frontend/ai-learning-assistant
npm run dev &
sleep 5
# Server should start on localhost:5173
```

Manual checks (executor should attempt curl or report results):
1. `curl -s http://localhost:5173/ | grep -i "intellilearn"` — should return HTML with Intellilearn title
2. Browser (if available): navigate to `http://localhost:5173/` — should show dark page with 3D brain canvas

If dev server fails to start, check:
- `node_modules/` exists (npm install succeeded)
- No syntax errors in new files (check for obvious JSX issues)
- Port 5173 is not already in use
</action>

<acceptance_criteria>
- Dev server starts without fatal errors (no `Error:` in first 10 lines of output)
- `curl http://localhost:5173/ -s | grep "Intellilearn"` returns non-empty output
- No import errors for `@react-three/fiber`, `three`, `gsap` in console output
- `frontend/ai-learning-assistant/src/pages/Landing/` directory contains exactly 3 files: `LandingPage.jsx`, `Brain3D.jsx`, `ParticleField.jsx`
</acceptance_criteria>

---

## Verification

**Phase 1 is complete when:**
1. `npm run dev` starts without errors from `frontend/ai-learning-assistant/`
2. Navigating to `/` shows the dark space background with 3D brain canvas
3. Brain geometry is visible (crystalline/geometric, not blank canvas)
4. Neuron lines pulse visibly over ~3 seconds
5. Particles drift near brain surface
6. Brain slowly rotates on idle
7. Background particle field is visible
8. `/login` and `/register` routes still work (existing routes unaffected)
9. No backend files were modified
10. `frontend/ai-learning-assistant/package.json` has `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`
