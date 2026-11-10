import React, { useEffect, useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function LoadingScreen({ progress, isReady, onComplete }) {
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // When ready, give a tiny moment to appreciate the completed state, then trigger fade
    if (isReady && progress >= 15) {
      const timer = setTimeout(() => {
        setShouldFadeOut(true);
        const removeTimer = setTimeout(() => {
          setIsVisible(false);
          if (onComplete) onComplete();
        }, 800);
        return () => clearTimeout(removeTimer);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isReady, progress, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#08070D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        opacity: shouldFadeOut ? 0 : 1,
        transform: shouldFadeOut ? 'scale(1.04)' : 'scale(1)',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: shouldFadeOut ? 'none' : 'all',
      }}
    >
      {/* Soft background glow */}
      <div
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217, 183, 122, 0.15) 0%, rgba(245, 198, 208, 0.05) 50%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Insignia / Monogram */}
      <div
        style={{
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          border: '1px solid rgba(217, 183, 122, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          position: 'relative',
          background: 'radial-gradient(circle, rgba(217, 183, 122, 0.1) 0%, transparent 80%)',
          boxShadow: '0 0 30px rgba(217, 183, 122, 0.25)',
        }}
      >
        <Sparkles size={32} color="#D9B77A" style={{ animation: 'pulse 2.5s infinite ease-in-out' }} />
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
          fontWeight: 300,
          letterSpacing: '0.15em',
          color: '#FFF8EE',
          textAlign: 'center',
          marginBottom: '0.5rem',
          textTransform: 'uppercase',
        }}
      >
        Vanessa
      </h1>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.85rem',
          letterSpacing: '0.25em',
          color: 'rgba(217, 183, 122, 0.85)',
          textTransform: 'uppercase',
          marginBottom: '2.5rem',
          textAlign: 'center',
        }}
      >
        A Heaven Made Just For You
      </p>

      {/* Progress Bar Container */}
      <div
        style={{
          width: 'min(280px, 80vw)',
          height: '2px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, Math.max(progress, 5))}%`,
            background: 'linear-gradient(90deg, #D9B77A, #F5C6D0, #FFFDFB)',
            transition: 'width 0.3s ease-out',
            boxShadow: '0 0 10px #D9B77A',
          }}
        />
      </div>

      {/* Progress Count & Romantic Whisper */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.8rem',
          color: 'rgba(255, 248, 238, 0.6)',
          letterSpacing: '0.1em',
        }}
      >
        <span>Creating your universe</span>
        <span>•</span>
        <span style={{ color: '#D9B77A', fontWeight: 500 }}>{progress}%</span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; filter: drop-shadow(0 0 10px #D9B77A); }
        }
      `}</style>
    </div>
  );
}
