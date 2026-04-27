import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Inject global styles to hide default cursor and remove outline
    const style = document.createElement('style');
    style.innerHTML = `
      .landing-root * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const xTo = gsap.quickTo(cursorRef.current, 'x', { duration: 0.2, ease: 'power3' });
    const yTo = gsap.quickTo(cursorRef.current, 'y', { duration: 0.2, ease: 'power3' });

    const moveCursor = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleHover = () => {
      gsap.to(cursorRef.current, { scale: 2, backgroundColor: 'rgba(255, 179, 71, 0.2)', borderColor: 'rgba(255, 179, 71, 0.8)', duration: 0.3 });
    };

    const handleHoverOut = () => {
      gsap.to(cursorRef.current, { scale: 1, backgroundColor: '#FFB347', borderColor: 'transparent', duration: 0.3 });
    };

    window.addEventListener('mousemove', moveCursor);
    
    // Add hover effects for buttons and links
    const interactables = document.querySelectorAll('a, button');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleHoverOut);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('mouseleave', handleHoverOut);
      });
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '12px',
        height: '12px',
        backgroundColor: '#FFB347',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'screen',
        boxShadow: '0 0 10px rgba(255, 179, 71, 0.8)',
        border: '1px solid transparent',
      }}
    />
  );
}
