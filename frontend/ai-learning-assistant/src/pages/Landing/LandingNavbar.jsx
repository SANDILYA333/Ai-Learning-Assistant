import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LandingNavbar() {
  const navRef = useRef(null);

  useGSAP(() => {
    // Hide initially
    gsap.set(navRef.current, { yPercent: -100, opacity: 0 });

    ScrollTrigger.create({
      start: 'top -100', // Trigger when 100px scrolled down
      end: 99999, // Keep it active forever
      onUpdate: (self) => {
        // Show/hide based on scroll direction or position
        if (self.direction === 1 && self.progress > 0) {
          // Scrolling down — show navbar
          gsap.to(navRef.current, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
        } else if (self.direction === -1 && self.progress === 0) {
           // Scrolled back to the very top — hide it again
           gsap.to(navRef.current, { yPercent: -100, opacity: 0, duration: 0.3, ease: 'power2.in' });
        }
      }
    });
  }, []);

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(5, 5, 16, 0.5)',
        borderBottom: '1px solid rgba(255, 179, 71, 0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Brain Logo Simple Mock */}
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFB347, #FF8C00)', boxShadow: '0 0 12px rgba(255,179,71,0.6)' }} />
        <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em', color: '#ffffff' }}>
          Intellilearn
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <a href="/login" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
          Log in
        </a>
        <a href="/register" style={{ padding: '0.5rem 1.25rem', background: 'rgba(255, 179, 71, 0.1)', border: '1px solid rgba(255, 179, 71, 0.5)', color: '#FFB347', fontWeight: 600, fontSize: '0.95rem', borderRadius: '6px', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 179, 71, 0.2)'; e.currentTarget.style.borderColor = '#FFB347'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 179, 71, 0.1)'; e.currentTarget.style.borderColor = 'rgba(255, 179, 71, 0.5)'; }}>
          Start Free
        </a>
      </div>
    </nav>
  );
}
