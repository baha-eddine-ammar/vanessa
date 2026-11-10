import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles } from 'lucide-react';
import '../styles/final.css';

export default function FinalLetter() {
  const canvasRef = useRef(null);
  const [hasCelebrated, setHasCelebrated] = useState(false);

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
    const HEART_PARTICLE_COUNT = 380;
    const particles = [];

    // Parametric heart generator
    const getHeartPoint = (t) => {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      return { x, y };
    };

    const heartScale = Math.min(width, height) * 0.015;

    for (let i = 0; i < HEART_PARTICLE_COUNT; i++) {
      const t = (i / HEART_PARTICLE_COUNT) * Math.PI * 2;
      const targetPoint = getHeartPoint(t);
      particles.push({
        t,
        targetX: targetPoint.x,
        targetY: targetPoint.y,
        x: targetPoint.x * heartScale + (Math.random() - 0.5) * 30,
        y: targetPoint.y * heartScale + (Math.random() - 0.5) * 30,
        baseSize: Math.random() * 2 + 1,
        color: Math.random() > 0.3 ? '#D9B77A' : '#F5C6D0',
        alpha: Math.random() * 0.7 + 0.3,
        sparkleSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    // Floating feathers in the letter scene
    const feathers = [];
    const FEATHER_COUNT = 24;
    for (let i = 0; i < FEATHER_COUNT; i++) {
      feathers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 25 + 15,
        width: Math.random() * 6 + 4,
        angle: Math.random() * Math.PI,
        fallSpeed: Math.random() * 0.4 + 0.2,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayRange: Math.random() * 40 + 20,
        initialX: Math.random() * width,
        alpha: Math.random() * 0.5 + 0.25,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.38;

      // Heartbeat pulse
      const pulse = 1 + Math.sin(time * 2.8) * 0.04 + Math.sin(time * 5.6) * 0.015;
      const currentScale = heartScale * pulse;

      // 1. Draw glowing background heart haze
      const hazeRadius = currentScale * 22;
      const haze = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(10, hazeRadius)
      );
      haze.addColorStop(0, 'rgba(217, 183, 122, 0.12)');
      haze.addColorStop(0.5, 'rgba(245, 198, 208, 0.05)');
      haze.addColorStop(1, 'transparent');
      ctx.fillStyle = haze;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hazeRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Heart Particles
      particles.forEach((p) => {
        const destX = centerX + p.targetX * currentScale;
        const destY = centerY + p.targetY * currentScale;

        // Smooth drift toward pulse position
        p.x += (destX - p.x) * 0.1;
        p.y += (destY - p.y) * 0.1;

        const dynamicAlpha = p.alpha + Math.sin(time * p.sparkleSpeed * 50) * 0.25;
        const clampedAlpha = Math.max(0.1, Math.min(1, dynamicAlpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseSize * pulse, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = clampedAlpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.baseSize * 4;
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // 3. Draw Feathers floating downwards
      feathers.forEach((f) => {
        f.y += f.fallSpeed;
        f.x = f.initialX + Math.sin(time * f.swaySpeed * 60) * f.swayRange;
        f.angle += 0.005;

        if (f.y > height + 50) {
          f.y = -50;
          f.initialX = Math.random() * width;
        }

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);
        ctx.globalAlpha = f.alpha;

        // Draw soft feather quill and vane
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -f.length / 2);
        ctx.lineTo(0, f.length / 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 248, 238, 0.6)';
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
    setHasCelebrated(true);

    // Golden & rose celebration burst
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.65 },
      colors: ['#D9B77A', '#F5C6D0', '#FFFDFB', '#E5C07B', '#FFFFFF'],
      ticks: 240,
      gravity: 0.8,
    });

    // Secondary delayed burst
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 60,
        origin: { x: 0.2, y: 0.6 },
        colors: ['#D9B77A', '#F5C6D0'],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 60,
        origin: { x: 0.8, y: 0.6 },
        colors: ['#D9B77A', '#F5C6D0'],
      });
    }, 350);
  };

  return (
    <section id="a-letter" className="final-section">
      <canvas ref={canvasRef} className="final-canvas" />
      <div className="final-rays" />

      <div className="final-content">
        <span className="section-tagline">Scene VI • The Final Promise</span>
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
      </div>
    </section>
  );
}
