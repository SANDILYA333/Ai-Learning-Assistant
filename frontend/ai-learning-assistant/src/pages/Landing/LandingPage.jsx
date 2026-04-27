import React, { Suspense, lazy, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Lazy load Three.js canvas — does not block initial paint
const Brain3D = lazy(() => import('./Brain3D'));

export default function LandingPage() {
  const containerRef = useRef();
  const brainWrapperRef = useRef();
  const sectionsRef = useRef([]);

  useGSAP(() => {
    // Animate brain position based on scroll progress through the sections
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrubbing
      }
    });

    // We have 5 sections total.
    // The timeline progresses from 0 to 1 over the total scroll height.
    
    // Section 1 (Hero): Center (default)
    // Section 2 (Upload): Move left
    tl.to(brainWrapperRef.current, { xPercent: -35, duration: 1 }, 0); // 0 to 1st transition
    
    // Section 3 (Quizzes): Move center
    tl.to(brainWrapperRef.current, { xPercent: 0, duration: 1 }, 1);
    
    // Section 4 (Chat): Move right
    tl.to(brainWrapperRef.current, { xPercent: 35, duration: 1 }, 2);
    
    // Section 5 (Reminders/CTA): Move far right and scale slightly
    tl.to(brainWrapperRef.current, { xPercent: 45, scale: 1.1, duration: 1 }, 3);

    // Stagger text reveals for each section
    sectionsRef.current.forEach((section, index) => {
      if (index === 0) return; // Hero animates differently if needed, or already visible

      const texts = section.querySelectorAll('.reveal-text');
      const visuals = section.querySelectorAll('.reveal-visual');

      gsap.fromTo(texts, 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%", // Trigger when section is 60% down viewport
            toggleActions: "play none none reverse"
          }
        }
      );
      
      if (visuals.length > 0) {
        gsap.fromTo(visuals,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            delay: 0.2,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

  }, { scope: containerRef });

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div
      ref={containerRef}
      className="landing-root"
      style={{
        background: 'radial-gradient(ellipse at 60% 20%, #1a0533 0%, #050510 60%)',
        minHeight: '500vh', // 5 sections
        fontFamily: "'Inter', 'Syne', system-ui, sans-serif",
        color: '#ffffff',
        overflowX: 'hidden',
        position: 'relative'
      }}
    >
      {/* ── Fixed Brain Canvas ──────────────────────── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div ref={brainWrapperRef} style={{ width: '100%', height: '100%' }}>
          <Suspense fallback={<div style={{ width: '100%', height: '100%' }} />}>
            <Brain3D style={{ width: '100%', height: '100%' }} />
          </Suspense>
        </div>
      </div>

      {/* ── Scroll Sections ─────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Section 1: Hero */}
        <section
          ref={addToRefs}
          style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem' }}
        >
          <div style={{ maxWidth: '760px' }}>
            <p className="reveal-text" style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FFB347', marginBottom: '1.2rem', opacity: 0.85 }}>
              Powered by Gemini AI
            </p>
            <h1 className="reveal-text" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', background: 'linear-gradient(135deg, #ffffff 60%, #FFB347 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              The Smartest Way<br />to Learn Anything.
            </h1>
            <p className="reveal-text" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.7)', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
              Intellilearn turns your documents into an AI-powered learning engine.
            </p>
            <div className="reveal-text" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Primary CTA */}
              <a href="/register" style={{ display: 'inline-block', padding: '0.9rem 2rem', background: 'linear-gradient(135deg, #FFB347, #FF8C00)', color: '#050510', fontWeight: 700, fontSize: '1rem', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 0 24px rgba(255,179,71,0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(255,179,71,0.6)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(255,179,71,0.4)'; }}>Start Learning Free</a>
              {/* Ghost CTA */}
              <a href="#how-it-works" style={{ display: 'inline-block', padding: '0.9rem 2rem', border: '1.5px solid rgba(255,179,71,0.4)', color: '#FFB347', fontWeight: 600, fontSize: '1rem', borderRadius: '8px', textDecoration: 'none', backdropFilter: 'blur(8px)', background: 'rgba(255,179,71,0.05)', transition: 'border-color 0.2s, background 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,179,71,0.8)'; e.currentTarget.style.background = 'rgba(255,179,71,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,179,71,0.4)'; e.currentTarget.style.background = 'rgba(255,179,71,0.05)'; }}>See How It Works</a>
            </div>
          </div>
        </section>

        {/* Section 2: Upload */}
        <section ref={addToRefs} id="how-it-works" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10%' }}>
          <div style={{ maxWidth: '500px', textAlign: 'right' }}>
            <h2 className="reveal-text" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>Drop Your Notes. <br/><span style={{color: '#FFB347'}}>Watch Them Come Alive.</span></h2>
            <p className="reveal-text" style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>Upload any PDF. Our intelligence engine instantly maps the concepts and prepares your curriculum.</p>
            
            <div className="reveal-visual" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,179,71,0.2)', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', backdropFilter: 'blur(12px)' }}>
               {/* Document Icon Mock */}
               <div style={{ width: '40px', height: '50px', background: '#FFB347', borderRadius: '4px', opacity: 0.8 }} />
               {/* Flow dots */}
               <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, transparent, #FFB347)' }} />
            </div>
          </div>
        </section>

        {/* Section 3: Quizzes & Flashcards */}
        <section ref={addToRefs} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0 10%' }}>
          <div style={{ maxWidth: '500px' }}>
            <h2 className="reveal-text" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>Your Personal <span style={{color: '#FFB347'}}>AI Quizmaster.</span></h2>
            <p className="reveal-text" style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>Automatic flashcards and adaptive quizzes generated from your exact syllabus materials.</p>
            
            <div className="reveal-visual" style={{ width: '300px', height: '180px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,179,71,0.1))', border: '1px solid rgba(255,179,71,0.3)', borderRadius: '16px', padding: '2rem', backdropFilter: 'blur(12px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
               <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#FFB347' }}>Flashcard</h3>
               <p style={{ marginTop: '1rem', color: '#fff', fontSize: '1.3rem', fontWeight: 600 }}>What is Neural Plasticity?</p>
            </div>
          </div>
        </section>

        {/* Section 4: AI Chat */}
        <section ref={addToRefs} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0 10%' }}>
          <div style={{ maxWidth: '500px' }}>
            <h2 className="reveal-text" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>Ask Anything. <br/><span style={{color: '#4FC3F7'}}>Understand Everything.</span></h2>
            <p className="reveal-text" style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>Stuck on a concept? Chat directly with your documents. It’s like having a 24/7 tutor.</p>
            
            <div className="reveal-visual" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ alignSelf: 'flex-end', background: 'rgba(79, 195, 247, 0.1)', border: '1px solid rgba(79, 195, 247, 0.3)', padding: '1rem', borderRadius: '16px 16px 0 16px', backdropFilter: 'blur(8px)' }}>Explain this simply.</div>
               <div style={{ alignSelf: 'flex-start', background: 'rgba(255, 179, 71, 0.1)', border: '1px solid rgba(255, 179, 71, 0.3)', padding: '1rem', borderRadius: '16px 16px 16px 0', backdropFilter: 'blur(8px)' }}>Sure! Imagine your brain is a city...</div>
            </div>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section ref={addToRefs} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px' }}>
            <h2 className="reveal-text" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>Never Forget <br/>What You Learned.</h2>
            <p className="reveal-text" style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.7)', marginBottom: '3rem' }}>Join thousands of students learning faster with AI.</p>
            
            <a href="/register" className="reveal-visual" style={{ display: 'inline-block', padding: '1.2rem 3rem', background: 'linear-gradient(135deg, #FFB347, #FF8C00)', color: '#050510', fontWeight: 800, fontSize: '1.2rem', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 0 40px rgba(255,179,71,0.5)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 50px rgba(255,179,71,0.8)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(255,179,71,0.5)'; }}>
              Join Intellilearn Free
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
