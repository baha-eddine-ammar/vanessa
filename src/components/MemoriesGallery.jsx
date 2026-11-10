import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, Heart, Star, Moon, X, Maximize2 } from 'lucide-react';
import { defaultMemories } from '../data/memories';
import '../styles/gallery.css';

const THEME_ICONS = {
  constellation: Star,
  rose: Heart,
  wings: Sparkles,
  starlight: Moon,
  sunset: Camera,
  infinity: Sparkles,
};

function MemoryItem({ item, index, onSelect }) {
  const [imageError, setImageError] = useState(false);
  const IconComponent = THEME_ICONS[item.theme] || Sparkles;

  // Gentle alternating angles for organic floating layout
  const rotationAngles = [-1.5, 1.8, -1.2, 1.4, -1.8, 1.2];
  const tilt = rotationAngles[index % rotationAngles.length];

  const baseUrl = import.meta.env.BASE_URL || './';
  const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const imageSrc = `${prefix}${item.image}`;

  return (
    <div
      className="memory-card"
      style={{ transform: `rotate(${tilt}deg)` }}
      onClick={() => onSelect(item, imageError, imageSrc)}
      role="button"
      tabIndex={0}
      aria-label={`View memory: ${item.title}`}
    >
      <div className="memory-image-container">
        {!imageError ? (
          <img
            src={imageSrc}
            alt={item.title}
            className="memory-image"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="memory-placeholder">
            <div className="placeholder-icon">
              <IconComponent size={24} />
            </div>
            <span className="placeholder-tag font-serif">Memory #{String(item.id).padStart(2, '0')}</span>
            <p className="placeholder-hint">
              Drop photo into <code>public/images/memories/memory-{item.id}.jpg</code>
            </p>
          </div>
        )}
      </div>

      <div className="memory-info">
        <span className="memory-date">{item.date}</span>
        <h3 className="memory-title font-serif">{item.title}</h3>
        <p className="memory-caption">{item.caption}</p>
      </div>
    </div>
  );
}

export default function MemoriesGallery() {
  const [selectedMemory, setSelectedMemory] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedMemory(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (item, isError, resolvedSrc) => {
    setSelectedMemory({ ...item, isError, resolvedSrc });
  };

  return (
    <section id="memories" className="gallery-section">
      <div className="section-container">
        <span className="section-tagline">Scene V • Cherished Moments</span>
        <h2 className="section-title text-gradient-gold font-serif">
          Our Little Memories
        </h2>
        <p className="section-subtitle">
          Every moment spent in your presence is a photograph etched permanently in
          my soul. A private museum dedicated to the laughter we share.
        </p>

        <div className="gallery-grid">
          {defaultMemories.map((item, index) => (
            <MemoryItem
              key={item.id}
              item={item}
              index={index}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedMemory && (
        <div
          className="gallery-modal-backdrop"
          onClick={() => setSelectedMemory(null)}
        >
          <div
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="gallery-modal-close"
              onClick={() => setSelectedMemory(null)}
              aria-label="Close photo view"
            >
              <X size={20} />
            </button>

            <div style={{ width: '100%', maxHeight: '60vh', overflow: 'hidden' }}>
              {!selectedMemory.isError ? (
                <img
                  src={selectedMemory.resolvedSrc}
                  alt={selectedMemory.title}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              ) : (
                <div
                  className="memory-placeholder"
                  style={{ minHeight: '320px', padding: '3rem' }}
                >
                  <div className="placeholder-icon" style={{ width: '64px', height: '64px' }}>
                    <Sparkles size={32} />
                  </div>
                  <h3 className="section-title font-serif" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                    {selectedMemory.title}
                  </h3>
                  <p style={{ color: 'var(--color-gold)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {selectedMemory.date}
                  </p>
                  <p style={{ color: 'rgba(255, 248, 238, 0.7)', maxWidth: '440px', lineHeight: 1.6 }}>
                    This frame is prepared and ready for your real photograph. Once placed in <code>public/images/memories/memory-{selectedMemory.id}.jpg</code>, it will automatically bloom right here.
                  </p>
                </div>
              )}
            </div>

            <div style={{ padding: '2rem' }}>
              <span className="memory-date">{selectedMemory.date}</span>
              <h3 className="memory-title font-serif" style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>
                {selectedMemory.title}
              </h3>
              <p className="memory-caption" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
                {selectedMemory.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
