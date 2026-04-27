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
