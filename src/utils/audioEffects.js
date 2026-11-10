// Pure Web Audio API Sound Effects (Zero External Files Required)

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle celestial crystal chime for interactive clicks
export function playCrystalChime(frequency = 880) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.3);
  } catch (e) {
    // Graceful silent fallback
  }
}

// Harmonic stardust chord burst
export function playStardustBurst() {
  try {
    const freqs = [587.33, 739.99, 880.0, 1174.66]; // D maj harmonic
    freqs.forEach((f, i) => {
      setTimeout(() => {
        playCrystalChime(f);
      }, i * 65);
    });
  } catch (e) {
    // Graceful fallback
  }
}
