import React, { useState, useEffect, useRef } from 'react';
import { Camera, Sparkles, Heart, Star, Moon, X, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
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

function MemoryItem({ item, index, onSelect, customImage, onUploadCustom }) {
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);
  const IconComponent = THEME_ICONS[item.theme] || Sparkles;

  // Gentle alternating angles for organic floating layout
  const rotationAngles = [-1.5, 1.8, -1.2, 1.4, -1.8, 1.2];
  const tilt = rotationAngles[index % rotationAngles.length];

  const baseUrl = import.meta.env.BASE_URL || './';
  const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const defaultSrc = `${prefix}${item.image}`;
  const effectiveSrc = customImage || defaultSrc;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUploadCustom(item.id, event.target.result);
          setImageError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="memory-card"
      style={{ transform: `rotate(${tilt}deg)` }}
      onClick={() => onSelect(index)}
      role="button"
      tabIndex={0}
      aria-label={`View memory: ${item.title}`}
    >
      <div className="memory-image-container">
        {!imageError || customImage ? (
          <img
            src={effectiveSrc}
            alt={item.title}
            className="memory-image"
            onError={() => {
              if (!customImage) setImageError(true);
            }}
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
            <div
              className="gallery-upload-badge"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <Upload size={13} />
              <span>Preview Photo Now</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
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
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [customImages, setCustomImages] = useState({});
  const modalFileInputRef = useRef(null);

  const selectedMemory = selectedIndex !== null ? defaultMemories[selectedIndex] : null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev + 1) % defaultMemories.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev - 1 + defaultMemories.length) % defaultMemories.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  const handleUploadCustom = (id, dataUrl) => {
    setCustomImages((prev) => ({ ...prev, [id]: dataUrl }));
  };

  const currentCustom = selectedMemory ? customImages[selectedMemory.id] : null;
  const baseUrl = import.meta.env.BASE_URL || './';
  const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

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
              customImage={customImages[item.id]}
              onUploadCustom={handleUploadCustom}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedMemory && (
        <div
          className="gallery-modal-backdrop"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="gallery-modal-close"
              onClick={() => setSelectedIndex(null)}
              aria-label="Close photo view"
            >
              <X size={20} />
            </button>

            {/* Previous button */}
            <button
              className="gallery-nav-btn gallery-nav-prev"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev - 1 + defaultMemories.length) % defaultMemories.length);
              }}
              aria-label="Previous memory"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Next button */}
            <button
              className="gallery-nav-btn gallery-nav-next"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev + 1) % defaultMemories.length);
              }}
              aria-label="Next memory"
            >
              <ChevronRight size={22} />
            </button>

            <div style={{ width: '100%', maxHeight: '60vh', overflow: 'hidden', position: 'relative' }}>
              {currentCustom ? (
                <img
                  src={currentCustom}
                  alt={selectedMemory.title}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              ) : (
                <div
                  className="memory-placeholder"
                  style={{ minHeight: '340px', padding: '3rem' }}
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
                  <p style={{ color: 'rgba(255, 248, 238, 0.7)', maxWidth: '440px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    This frame is prepared for your personal picture. Once dropped into <code>public/images/memories/memory-{selectedMemory.id}.jpg</code>, it will permanently shine here.
                  </p>
                  <div
                    className="gallery-upload-badge"
                    onClick={() => modalFileInputRef.current?.click()}
                  >
                    <Upload size={14} />
                    <span>Select Photo to Preview in Browser</span>
                  </div>
                  <input
                    ref={modalFileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            handleUploadCustom(selectedMemory.id, ev.target.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span className="memory-date">{selectedMemory.date}</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(217, 183, 122, 0.7)', letterSpacing: '0.1em' }}>
                  {selectedIndex + 1} of {defaultMemories.length}
                </span>
              </div>
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
