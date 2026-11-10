import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function MusicControl({ initialPlay = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [useSynth, setUseSynth] = useState(false);
  const [tooltip, setTooltip] = useState('');

  const audioRef = useRef(null);
  const synthCtxRef = useRef(null);
  const synthTimerRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Setup HTML Audio element for MP3
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || './';
    const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const audioPath = `${prefix}audio/romantic-piano.mp3`;

    const audio = new Audio(audioPath);
    audio.loop = true;
    audio.volume = 0; // Starts at 0 for smooth fade-in
    audioRef.current = audio;

    audio.onerror = () => {
      // Graceful fallback to built-in Web Audio API synthesizer
      setUseSynth(true);
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Web Audio Procedural Romantic Celestial Harp / Chords Synthesizer
  const initSynth = () => {
    if (!synthCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);

      synthCtxRef.current = ctx;
      gainNodeRef.current = masterGain;
    }
  };

  // Celestial chord progression frequencies (Fmaj7 - Dm9 - Bbmaj7 - Cadd9)
  const CHORD_PROGRESSION = [
    [174.61, 220.0, 261.63, 329.63, 440.0], // Fmaj7
    [146.83, 174.61, 220.0, 261.63, 329.63], // Dm9
    [116.54, 146.83, 174.61, 220.0, 349.23], // Bbmaj7
    [130.81, 164.81, 196.0, 293.66, 392.0], // Cadd9
  ];

  const playSynthesizedMelody = () => {
    initSynth();
    const ctx = synthCtxRef.current;
    const masterGain = gainNodeRef.current;
    if (!ctx || !masterGain) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Fade in master gain
    masterGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.5);

    let chordStep = 0;
    let noteStep = 0;

    const tick = () => {
      const currentChord = CHORD_PROGRESSION[chordStep % CHORD_PROGRESSION.length];
      const freq = currentChord[noteStep % currentChord.length];

      // Create gentle sine / triangle bell osc
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, ctx.currentTime);

      osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.5);

      noteStep++;
      if (noteStep % currentChord.length === 0) {
        chordStep++;
      }

      synthTimerRef.current = setTimeout(tick, 750 + Math.random() * 300);
    };

    tick();
  };

  const stopSynthesizedMelody = () => {
    if (synthTimerRef.current) {
      clearTimeout(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    const ctx = synthCtxRef.current;
    const masterGain = gainNodeRef.current;
    if (ctx && masterGain) {
      masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    }
  };

  // Start music
  const startAudio = () => {
    setIsPlaying(true);
    setTooltip('Celestial melody playing');

    if (!useSynth && audioRef.current) {
      const audio = audioRef.current;
      audio
        .play()
        .then(() => {
          // Smooth fade in
          let vol = 0;
          const fadeTimer = setInterval(() => {
            vol += 0.05;
            if (vol >= 0.7) {
              audio.volume = 0.7;
              clearInterval(fadeTimer);
            } else {
              audio.volume = vol;
            }
          }, 60);
        })
        .catch(() => {
          // If play fails or file missing, switch to procedural synth
          setUseSynth(true);
          playSynthesizedMelody();
        });
    } else {
      playSynthesizedMelody();
    }
  };

  // Stop music
  const stopAudio = () => {
    setIsPlaying(false);
    setTooltip('Melody paused');

    if (!useSynth && audioRef.current) {
      const audio = audioRef.current;
      let vol = audio.volume;
      const fadeTimer = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0.01) {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeTimer);
        } else {
          audio.volume = Math.max(0, vol);
        }
      }, 50);
    } else {
      stopSynthesizedMelody();
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  // Handle external trigger (e.g. from Enter button)
  useEffect(() => {
    if (initialPlay && !isPlaying) {
      startAudio();
    }
  }, [initialPlay]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        right: '1.75rem',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
      }}
    >
      <button
        onClick={toggleMusic}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.65rem 1.15rem',
          borderRadius: '9999px',
          background: 'rgba(12, 10, 18, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(217, 183, 122, 0.35)',
          color: isPlaying ? '#D9B77A' : 'rgba(255, 248, 238, 0.65)',
          cursor: 'pointer',
          boxShadow: isPlaying
            ? '0 0 20px rgba(217, 183, 122, 0.3), 0 8px 24px rgba(0,0,0,0.5)'
            : '0 8px 24px rgba(0,0,0,0.4)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        aria-label={isPlaying ? 'Pause romantic music' : 'Play romantic music'}
      >
        {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}

        {/* Dynamic sound wave visualizer bars */}
        {isPlaying ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '14px' }}>
            <span className="eq-bar eq-1" />
            <span className="eq-bar eq-2" />
            <span className="eq-bar eq-3" />
          </div>
        ) : (
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Music
          </span>
        )}
      </button>

      <style>{`
        .eq-bar {
          width: 2px;
          height: 100%;
          background: #D9B77A;
          border-radius: 1px;
          animation: eqPulse 1.2s infinite ease-in-out;
        }
        .eq-1 { animation-delay: 0.1s; }
        .eq-2 { animation-delay: 0.3s; }
        .eq-3 { animation-delay: 0.2s; }

        @keyframes eqPulse {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
      `}</style>
    </div>
  );
}
