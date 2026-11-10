import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/angel.css';

gsap.registerPlugin(ScrollTrigger);

export default function AngelScrollExperience({
  drawFrame,
  totalFrames,
  isInitialReady,
}) {
  const sectionRef = useRef(null);
  const pinnedWrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const currentFrameRef = useRef(0);

  // Resize canvas according to device pixel ratio
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    if (drawFrame) {
      drawFrame(canvas, currentFrameRef.current);
    }
  }, [drawFrame]);

  // Canvas setup and initial draw
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Initial draw once ready
  useEffect(() => {
    if (isInitialReady && canvasRef.current && drawFrame) {
      drawFrame(canvasRef.current, 0);
    }
  }, [isInitialReady, drawFrame]);

  // GSAP ScrollTrigger Scrubbing
  useEffect(() => {
    const section = sectionRef.current;
    const pinnedWrapper = pinnedWrapperRef.current;
    const canvas = canvasRef.current;
    if (!section || !pinnedWrapper || !canvas) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=420%',
        pin: pinnedWrapper,
        pinSpacing: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);
          const frameIdx = Math.min(
            totalFrames - 1,
            Math.floor(progress * (totalFrames - 1))
          );
          currentFrameRef.current = frameIdx;
          setCurrentFrameIndex(frameIdx);

          if (drawFrame) {
            drawFrame(canvas, frameIdx);
          }
        },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [drawFrame, totalFrames]);

  // Helper to calculate smooth phrase opacity
  const getPhraseOpacity = (start, end) => {
    if (scrollProgress < start || scrollProgress > end) return 0;
    const mid = (start + end) / 2;
    const halfSpan = (end - start) / 2;
    const dist = Math.abs(scrollProgress - mid);
    const op = 1 - dist / halfSpan;
    return Math.max(0, Math.min(1, op * 1.6));
  };

  const getPhraseTransform = (start, end) => {
    const op = getPhraseOpacity(start, end);
    const translateY = (1 - op) * 18;
    return `translateY(${translateY}px)`;
  };

  const op1 = getPhraseOpacity(0.01, 0.19);
  const op2 = getPhraseOpacity(0.22, 0.39);
  const op3 = getPhraseOpacity(0.42, 0.59);
  const op4 = getPhraseOpacity(0.62, 0.79);
  const op5 = getPhraseOpacity(0.82, 0.99);

  return (
    <section id="the-angel" ref={sectionRef} className="angel-section">
      <div ref={pinnedWrapperRef} className="angel-pinned-wrapper">
        <canvas ref={canvasRef} className="angel-canvas" />

        {/* Cinematic Vignette Overlay */}
        <div className="angel-vignette" />
        <div className="angel-grain" />
        <div className="angel-light-leak" />

        {/* Storytelling Text Milestones */}
        <div className="angel-story-container">
          {/* Phase 1: Intro */}
          <div
            className="angel-story-phrase pos-bottom-left"
            style={{
              opacity: op1,
              transform: getPhraseTransform(0.01, 0.19),
              pointerEvents: op1 > 0.1 ? 'auto' : 'none',
            }}
          >
            <span className="angel-story-number">Act I • The Awakening</span>
            <p className="angel-story-text">
              Of all the beautiful things in this world...
            </p>
          </div>

          {/* Phase 2: As angel appears */}
          <div
            className="angel-story-phrase pos-bottom-right"
            style={{
              opacity: op2,
              transform: getPhraseTransform(0.22, 0.39),
              pointerEvents: op2 > 0.1 ? 'auto' : 'none',
            }}
          >
            <span className="angel-story-number">Act II • Pure Grace</span>
            <p className="angel-story-text">
              Somehow, you are{' '}
              <span className="angel-story-highlight">my favorite</span>.
            </p>
          </div>

          {/* Phase 3: Hand reaches toward viewer */}
          <div
            className="angel-story-phrase pos-bottom-left"
            style={{
              opacity: op3,
              transform: getPhraseTransform(0.42, 0.59),
              pointerEvents: op3 > 0.1 ? 'auto' : 'none',
            }}
          >
            <span className="angel-story-number">Act III • Through My Eyes</span>
            <p className="angel-story-text">
              If I could show you how beautiful you are{' '}
              <span className="angel-story-highlight">through my eyes</span>...
            </p>
          </div>

          {/* Phase 4: Wings open */}
          <div
            className="angel-story-phrase pos-bottom-right"
            style={{
              opacity: op4,
              transform: getPhraseTransform(0.62, 0.79),
              pointerEvents: op4 > 0.1 ? 'auto' : 'none',
            }}
          >
            <span className="angel-story-number">Act IV • Celestial Wings</span>
            <p className="angel-story-text">
              Even the heavens would have{' '}
              <span className="angel-story-highlight">something to admire</span>.
            </p>
          </div>

          {/* Phase 5: Approaching ending */}
          <div
            className="angel-story-phrase pos-bottom-center"
            style={{
              opacity: op5,
              transform: getPhraseTransform(0.82, 0.99),
              pointerEvents: op5 > 0.1 ? 'auto' : 'none',
            }}
          >
            <span className="angel-story-number">Act V • Eternal Truth</span>
            <p className="angel-story-text">
              You're beautiful in ways{' '}
              <span className="angel-story-highlight">
                you don't even notice
              </span>
              .
            </p>
          </div>
        </div>

        {/* Cinematic Scrub Indicator */}
        <div className="angel-scrub-indicator">
          <span>
            Frame {String(currentFrameIndex + 1).padStart(3, '0')} / {totalFrames}
          </span>
          <div className="angel-scrub-bar">
            <div
              className="angel-scrub-fill"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

