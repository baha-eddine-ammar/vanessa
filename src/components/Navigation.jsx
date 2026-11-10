import React, { useState, useEffect } from 'react';
import '../styles/nav.css';

const NAV_ITEMS = [
  { id: 'beginning', label: 'Beginning' },
  { id: 'the-angel', label: 'The Angel' },
  { id: 'her-universe', label: 'Her Universe' },
  { id: 'memories', label: 'Memories' },
  { id: 'a-letter', label: 'A Letter' },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('beginning');
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollPercent(scrolled);

      // Determine active section
      const scrollPos = winScroll + window.innerHeight * 0.4;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top 2px Progress Bar */}
      <div
        className="scroll-progress-line"
        style={{ width: `${scrollPercent}%` }}
      />

      {/* Floating Navigation Pill */}
      <nav className="nav-header" aria-label="Main Navigation">
        <div className="nav-pill">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              aria-label={`Scroll to ${item.label}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
