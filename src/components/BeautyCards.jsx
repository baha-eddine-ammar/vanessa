import React, { useRef, useState } from 'react';
import { Sparkles, Compass, Moon, Infinity } from 'lucide-react';
import '../styles/cards.css';

const CARDS_DATA = [
  {
    numeral: 'I',
    icon: Sparkles,
    title: 'Your Smile',
    description:
      'Something capable of making an ordinary day feel extraordinary. It carries an effortless warmth that lights up every room.',
  },
  {
    numeral: 'II',
    icon: Compass,
    title: 'Your Personality',
    description:
      'The little things that make you uniquely you—your kindness, your passion, and the genuine way you navigate the world.',
  },
  {
    numeral: 'III',
    icon: Moon,
    title: 'Your Imperfections',
    description:
      'Even the things you don’t love about yourself are part of what makes you special to me. Every shade of you is sacred.',
  },
  {
    numeral: 'IV',
    icon: Infinity,
    title: 'Simply You',
    description:
      'You don’t need to become anyone else. You are already enough, exactly as you are—today, tomorrow, and always.',
  },
];

function TiltCard({ item }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const IconComponent = item.icon;

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg tilt
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlareStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(217, 183, 122, 0.25) 0%, transparent 60%)`,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      className="beauty-card-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      <div className="beauty-card">
        <div className="card-glare" style={glareStyle} />

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-numeral font-serif">{item.numeral}</span>
            <div className="card-icon-container">
              <IconComponent size={24} />
            </div>
          </div>

          <h3 className="card-title font-serif">{item.title}</h3>
          <p className="card-desc">{item.description}</p>
        </div>

        <div className="card-bottom-accent" />
      </div>
    </div>
  );
}

export default function BeautyCards() {
  return (
    <section id="why-special" className="cards-section">
      <div className="section-container">
        <span className="section-tagline">Scene IV • Truths Whispered To The Stars</span>
        <h2 className="section-title text-gradient-gold font-serif">
          Why Vanessa Is Special
        </h2>
        <p className="section-subtitle">
          In a world constantly asking you to change, these are the truths I want you to remember forever.
        </p>

        <div className="cards-grid">
          {CARDS_DATA.map((item, index) => (
            <TiltCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
