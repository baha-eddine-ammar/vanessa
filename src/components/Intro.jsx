import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { playStardustBurst } from '../utils/audioEffects';
import '../styles/intro.css';

export default function Intro({ onEnterUniverse, soundEnabled, toggleSound }) {
  const canvasRef = useRef(null);
  const [stage, setStage] = useState(0); // 0: initial, 1: quote, 2: name, 3: full reveal
  const [audioWithEnter, setAudioWithEnter] = useState(true);

  // Progressive text stages with cinematic cadence
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 700);
    const t2 = setTimeout(() => setStage(2), 2200);
    const t3 = setTimeout(() => setStage(3), 3900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Multi-layered Starfield & Dynamic Golden Stardust Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle definitions with velocity and twinkling
    const PARTICLE_COUNT = 110;
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35 - 0.18,
        alpha: Math.random() * 0.8 + 0.2,
        baseAlpha: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.025 + 0.008,
        isGold: Math.random() > 0.3,
        glowBlur: Math.random() * 12 + 4,
      });
    }

    // Shooting stars / celestial comets
    const shootingStars = [];
    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        alpha: 1,
      });
    };

    let shootingTimer = setInterval(spawnShootingStar, 4000);

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Render gentle particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges smoothly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.baseAlpha + Math.sin(time * p.pulseSpeed * 20 + p.x) * 0.3;
        const clampedAlpha = Math.max(0.1, Math.min(1, currentAlpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (p.isGold) {
          ctx.fillStyle = `rgba(217, 183, 122, ${clampedAlpha})`;
          ctx.shadowColor = 'rgba(217, 183, 122, 0.7)';
          ctx.shadowBlur = p.glowBlur;
        } else {
          ctx.fillStyle = `rgba(255, 248, 238, ${clampedAlpha * 0.85})`;
          ctx.shadowColor = 'rgba(255, 248, 238, 0.5)';
          ctx.shadowBlur = p.radius * 2;
        }
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Render Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.02;

        if (s.alpha <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, 'rgba(217, 183, 122, 0)');
        grad.addColorStop(0.7, `rgba(244, 226, 184, ${s.alpha * 0.6})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${s.alpha})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(shootingTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleEnterClick = () => {
    playStardustBurst();
    if (onEnterUniverse) {
      onEnterUniverse(audioWithEnter);
    }
  };

  const nameChars = "Vanessa.".split("");

  return (
    <section id="beginning" className="intro-section">
      <canvas ref={canvasRef} className="intro-canvas" />

      {/* Center Golden Multi-layered Portal */}
      <div className="intro-portal">
        <div className="intro-portal-ring ring-1" />
        <div className="intro-portal-ring ring-2" />
        <div className="intro-portal-ring ring-3" />
        <div className="intro-portal-core" />
      </div>

      <div className="intro-content">
        {/* Step 1: Subtitle */}
        <div className="intro-tagline">
          {stage >= 1 && (
            <span className="char-fade">
              Somewhere between dreams and reality...
            </span>
          )}
        </div>

        {/* Step 2: Quote */}
        <div className="intro-quote">
          {stage >= 2 && (
            <span className="char-fade">
              "There is a little universe I made just for you."
            </span>
          )}
        </div>

        {/* Step 3: Vanessa Name */}
        <h1 className="intro-vanessa font-serif">
          {stage >= 3 ? (
            nameChars.map((char, index) => (
              <span
                key={index}
                className="char-fade glowing-char"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {char}
              </span>
            ))
          ) : (
            <span style={{ opacity: 0 }}>Vanessa.</span>
          )}
        </h1>

        {/* Action Button & Audio Option */}
        <div
          className="intro-actions"
          style={{
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 1.2s ease 0.6s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
          }}
        >
          <button
            onClick={handleEnterClick}
            className="celestial-button enter-btn-pulse"
            aria-label="Enter Your Universe"
          >
            <Sparkles size={16} />
            <span>ENTER YOUR UNIVERSE</span>
          </button>

          <div
            className="audio-optin"
            onClick={() => setAudioWithEnter(!audioWithEnter)}
            role="button"
            tabIndex={0}
          >
            {audioWithEnter ? (
              <>
                <Volume2 size={15} color="#D9B77A" />
                <span>Sound enabled on entry</span>
              </>
            ) : (
              <>
                <VolumeX size={15} color="rgba(255, 248, 238, 0.4)" />
                <span style={{ color: 'rgba(255, 248, 238, 0.4)' }}>Enter quietly</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="scroll-indicator-intro">
        <span>Scroll to explore</span>
        <ChevronDown size={14} />
      </div>
    </section>
  );
}
