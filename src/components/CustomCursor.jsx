import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on devices with fine pointer (mouse/trackpad), not touchscreens
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    setIsVisible(true);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check if hovering over clickable element
      const target = e.target;
      const isInteractive = Boolean(
        target.closest('button, a, input, [role="button"], .beauty-card-wrapper, .memory-card')
      );
      setIsPointer(isInteractive);
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth lerp animation for outer aura ring
    const render = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner glowing dot */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: -4,
          left: -4,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#FFF8EE',
          boxShadow: '0 0 10px #D9B77A, 0 0 20px #D9B77A',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'opacity 0.2s ease, width 0.2s ease, height 0.2s ease',
          willChange: 'transform',
        }}
      />

      {/* Outer celestial trailing ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: -20,
          left: -20,
          width: isPointer ? 56 : 40,
          height: isPointer ? 56 : 40,
          borderRadius: '50%',
          border: '1px solid rgba(217, 183, 122, 0.45)',
          background: isPointer
            ? 'radial-gradient(circle, rgba(217, 183, 122, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(217, 183, 122, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, border-color 0.3s ease, opacity 0.2s ease',
          willChange: 'transform',
          marginLeft: isPointer ? -8 : 0,
          marginTop: isPointer ? -8 : 0,
        }}
      />
    </>
  );
}

