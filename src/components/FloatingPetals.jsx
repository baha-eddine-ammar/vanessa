import React, { useEffect, useRef } from 'react';

export default function FloatingPetals() {
  const canvasRef = useRef(null);

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

    // Muted ambient particles & gentle petals
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 25 : 45;
    const items = [];

    for (let i = 0; i < COUNT; i++) {
      items.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vy: Math.random() * 0.4 + 0.15,
        vx: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        isPetal: Math.random() > 0.6,
        petalAngle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        swaySpeed: Math.random() * 0.01 + 0.005,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      items.forEach((item) => {
        item.y += item.vy;
        item.x += item.vx + Math.sin(time * item.swaySpeed * 80) * 0.3;
        item.petalAngle += item.rotSpeed;

        if (item.y > height + 20) {
          item.y = -20;
          item.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.globalAlpha = item.alpha;

        if (item.isPetal) {
          ctx.rotate(item.petalAngle);
          ctx.fillStyle = 'rgba(245, 198, 208, 0.45)';
          ctx.beginPath();
          ctx.ellipse(0, 0, 3, 5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(217, 183, 122, 0.6)';
          ctx.beginPath();
          ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
          ctx.fill();
        }

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

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  );
}

