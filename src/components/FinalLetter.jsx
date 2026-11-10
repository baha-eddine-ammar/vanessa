import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Mail, RefreshCw, Feather } from 'lucide-react';
import { playCrystalChime, playStardustBurst } from '../utils/audioEffects';
import '../styles/final.css';

const LOVE_WHISPERS = [
  {
    title: 'A Promise to Your Heart',
    text: "Dear Vanessa, if you ever wonder how much you mean to me, remember this universe. Every star was placed here to reflect your warmth, and every bloom was created to never fade. You are my favorite thought in the morning, and my sweetest dream at night.",
    sign: "Always & Forever ♡"
  },
  {
    title: 'The Light You Bring',
    text: "You didn't just walk into my life; you brought a sunrise with you. Your laughter has a way of dissolving all my worries, and in your eyes, I found a home I never want to leave.",
    sign: "With all my heart ♡"
  },
  {
    title: 'Through Every Season',
    text: "Through the easiest days and the most challenging ones, my hand will always reach for yours. Not because you are flawless, but because you are real, extraordinary, and utterly irreplaceable to me.",
    sign: "Unconditionally yours ♡"
  },
  {
    title: 'My Eternal Favorite',
    text: "If I was given a thousand lifetimes, in every single one of them, under any sky, in any world... I would still search until I found you.",
    sign: "100 years from now ♡"
  }
];

export default function FinalLetter() {
  const canvasRef = useRef(null);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [whisperIndex, setWhisperIndex] = useState(0);

  // Particle Heart Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Heart particle definitions
    const HEART_PARTICLE_COUNT = 420;
    const particles = [];

    // Parametric heart generator
    const getHeartPoint = (t) => {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      return { x, y };
    };

    const heartScale = Math.min(width, height) * 0.016;

    for (let i = 0; i < HEART_PARTICLE_COUNT; i++) {
      const t = (i / HEART_PARTICLE_COUNT) * Math.PI * 2;
      const targetPoint = getHeartPoint(t);
      particles.push({
        t,
        targetX: targetPoint.x,
        targetY: targetPoint.y,
        x: targetPoint.x * heartScale + (Math.random() - 0.5) * 40,
        y: targetPoint.y * heartScale + (Math.random() - 0.5) * 40,
        baseSize: Math.random() * 2.2 + 1,
        color: Math.random() > 0.35 ? '#D9B77A' : '#F5C6D0',
        alpha: Math.random() * 0.7 + 0.3,
        sparkleSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    // Floating feathers in the letter scene
    const feathers = [];
    const FEATHER_COUNT = 28;
    for (let i = 0; i < FEATHER_COUNT; i++) {
      feathers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 26 + 16,
        width: Math.random() * 6 + 4,
        angle: Math.random() * Math.PI,
        fallSpeed: Math.random() * 0.45 + 0.22,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayRange: Math.random() * 45 + 20,
        initialX: Math.random() * width,
        alpha: Math.random() * 0.55 + 0.25,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.32;

      // Realistic double-pulse heartbeat rhythm
      const pulse = 1 + Math.sin(time * 3) * 0.05 + Math.sin(time * 6) * 0.02;
      const currentScale = heartScale * pulse;

      // 1. Draw glowing background heart haze
      const hazeRadius = currentScale * 24;
      const haze = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(10, hazeRadius)
      );
      haze.addColorStop(0, 'rgba(217, 183, 122, 0.16)');
      haze.addColorStop(0.45, 'rgba(245, 198, 208, 0.08)');
      haze.addColorStop(1, 'transparent');
      ctx.fillStyle = haze;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hazeRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Heart Particles
      particles.forEach((p) => {
        const destX = centerX + p.targetX * currentScale;
        const destY = centerY + p.targetY * currentScale;

        p.x += (destX - p.x) * 0.12;
        p.y += (destY - p.y) * 0.12;

        const dynamicAlpha = p.alpha + Math.sin(time * p.sparkleSpeed * 50) * 0.28;
        const clampedAlpha = Math.max(0.1, Math.min(1, dynamicAlpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseSize * pulse, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = clampedAlpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.baseSize * 4.5;
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // 3. Draw Feathers floating downwards
      feathers.forEach((f) => {
        f.y += f.fallSpeed;
        f.x = f.initialX + Math.sin(time * f.swaySpeed * 60) * f.swayRange;
        f.angle += 0.006;

        if (f.y > height + 50) {
          f.y = -50;
          f.initialX = Math.random() * width;
        }

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);
        ctx.globalAlpha = f.alpha;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -f.length / 2);
        ctx.lineTo(0, f.length / 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 248, 238, 0.65)';
        ctx.beginPath();
        ctx.ellipse(0, 0, f.width, f.length / 2.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const triggerCelebration = () => {
    playStardustBurst();
    setHasCelebrated(true);

    // Multi-stage golden & blush celebration bursts
    confetti({
      particleCount: 120,
      spread: 95,
      origin: { y: 0.65 },
      colors: ['#D9B77A', '#F5C6D0', '#FFFDFB', '#E5C07B', '#FFFFFF'],
      ticks: 260,
      gravity: 0.75,
    });

    setTimeout(() => {
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 65,
        origin: { x: 0.15, y: 0.6 },
        colors: ['#D9B77A', '#F5C6D0'],
      });
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 65,
        origin: { x: 0.85, y: 0.6 },
        colors: ['#D9B77A', '#F5C6D0'],
      });
    }, 380);
  };

  const toggleWaxSeal = () => {
    playCrystalChime(950);
    setIsLetterOpen(!isLetterOpen);
  };

  const nextWhisper = (e) => {
    e.stopPropagation();
    playCrystalChime(1100);
    setWhisperIndex((prev) => (prev + 1) % LOVE_WHISPERS.length);
  };

  const currentWhisper = LOVE_WHISPERS[whisperIndex];

  return (
    <section id="a-letter" className="final-section">
      <canvas ref={canvasRef} className="final-canvas" />
      <div className="final-rays" />

      <div className="final-content">
        <span className="section-tagline">Scene V • The Final Promise</span>
        <h2 className="final-recipient font-serif">Vanessa...</h2>

        <div className="final-letter-card">
          <p className="letter-line font-serif">
            I don't want you to become someone else.
          </p>

          <p className="letter-line font-serif">
            I don't need you to be perfect.
          </p>

          <p className="letter-line font-serif">
            I want you, with your beautiful sides, your imperfections, your happy
            days, and your difficult ones.
          </p>

          <p className="letter-line font-serif">
            Because you are <span className="letter-highlight">already perfect to me</span>.
          </p>
        </div>

        <div className="final-statement-wrapper">
          <span className="final-statement-tag">An Eternal Oath</span>
          <h3 className="final-statement-text font-serif">
            TODAY. TOMORROW. AND 100 YEARS FROM NOW.
          </h3>
        </div>

        <div className="final-signature font-serif">
          <span>Made with love, just for you.</span>
          <Heart size={18} fill="#F5C6D0" color="#F5C6D0" />
        </div>

        {/* Celebration Button */}
        <div className="final-heart-interactive">
          <button
            onClick={triggerCelebration}
            className="celestial-button"
            aria-label="Celebrate Our Love"
          >
            <Sparkles size={16} />
            <span>{hasCelebrated ? 'CELEBRATED IN HEAVEN ♡' : 'TOUCH MY HEART'}</span>
          </button>
        </div>

        {/* Secret Wax-Sealed Parchment Envelope */}
        <div className="secret-whisper-container">
          {!isLetterOpen ? (
            <div
              className="secret-envelope"
              onClick={toggleWaxSeal}
              role="button"
              tabIndex={0}
            >
              <div className="secret-wax-seal font-serif" title="Click to break seal">
                V
              </div>
              <h4 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--color-ivory)', marginBottom: '0.4rem' }}>
                A Secret Whisper For Vanessa
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'rgba(217, 183, 122, 0.8)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Tap the golden seal to unfold
              </p>
            </div>
          ) : (
            <div className="secret-unfolded-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                  Secret Note #{whisperIndex + 1} • {currentWhisper.title}
                </span>
                <button
                  onClick={nextWhisper}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(217, 183, 122, 0.15)',
                    border: '1px solid rgba(217, 183, 122, 0.3)',
                    borderRadius: '9999px',
                    padding: '0.35rem 0.8rem',
                    color: '#FFF8EE',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  title="Next whisper"
                >
                  <RefreshCw size={12} />
                  <span>Next Whisper</span>
                </button>
              </div>

              <p className="whisper-text">
                "{currentWhisper.text}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid rgba(217, 183, 122, 0.2)', paddingTop: '1.25rem' }}>
                <span className="font-serif" style={{ color: 'var(--color-blush)', fontSize: '1.1rem', fontStyle: 'italic' }}>
                  {currentWhisper.sign}
                </span>
                <span
                  onClick={toggleWaxSeal}
                  style={{ fontSize: '0.75rem', color: 'rgba(255, 248, 238, 0.5)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Fold letter back
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
