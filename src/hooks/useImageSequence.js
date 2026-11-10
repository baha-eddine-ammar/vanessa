import { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_FRAMES = 238;
const INITIAL_BATCH_SIZE = 30; // Frames required before initial interactive ready
const CONCURRENT_DOWNLOADS = 6;

export function useImageSequence() {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isInitialReady, setIsInitialReady] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const imagesRef = useRef(new Array(TOTAL_FRAMES).fill(null));
  const activeDownloadsRef = useRef(0);
  const isCancelledRef = useRef(false);

  // Helper to format frame path accurately with Vite base URL
  const getFrameUrl = useCallback((index) => {
    // index is 1-based (1 to 238)
    const baseUrl = import.meta.env.BASE_URL || './';
    const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const frameNumber = String(index).padStart(3, '0');
    return `${prefix}vane1toinf/ezgif-frame-${frameNumber}.jpg`;
  }, []);

  useEffect(() => {
    isCancelledRef.current = false;
    let localLoaded = 0;
    let localErrors = 0;

    // Load an individual frame
    const loadSingleImage = (frameIdx) => {
      return new Promise((resolve) => {
        if (isCancelledRef.current) return resolve(false);

        const img = new Image();
        const url = getFrameUrl(frameIdx);
        img.src = url;

        img.onload = () => {
          if (isCancelledRef.current) return resolve(false);
          // Attempt async decoding if supported for smoother GPU texture upload
          if (img.decode) {
            img.decode()
              .then(() => {
                if (isCancelledRef.current) return resolve(false);
                imagesRef.current[frameIdx - 1] = img;
                localLoaded++;
                setLoadedCount(localLoaded);
                if (localLoaded >= INITIAL_BATCH_SIZE) {
                  setIsInitialReady(true);
                }
                if (localLoaded + localErrors >= TOTAL_FRAMES) {
                  setIsFullyLoaded(true);
                }
                resolve(true);
              })
              .catch(() => {
                // Fallback if decode fails
                imagesRef.current[frameIdx - 1] = img;
                localLoaded++;
                setLoadedCount(localLoaded);
                if (localLoaded >= INITIAL_BATCH_SIZE) {
                  setIsInitialReady(true);
                }
                if (localLoaded + localErrors >= TOTAL_FRAMES) {
                  setIsFullyLoaded(true);
                }
                resolve(true);
              });
          } else {
            imagesRef.current[frameIdx - 1] = img;
            localLoaded++;
            setLoadedCount(localLoaded);
            if (localLoaded >= INITIAL_BATCH_SIZE) {
              setIsInitialReady(true);
            }
            if (localLoaded + localErrors >= TOTAL_FRAMES) {
              setIsFullyLoaded(true);
            }
            resolve(true);
          }
        };

        img.onerror = () => {
          if (isCancelledRef.current) return resolve(false);
          console.warn(`[AngelSequence] Frame ${frameIdx} failed to load from ${url}`);
          localErrors++;
          setErrorCount(localErrors);
          if (localLoaded >= INITIAL_BATCH_SIZE) {
            setIsInitialReady(true);
          }
          if (localLoaded + localErrors >= TOTAL_FRAMES) {
            setIsFullyLoaded(true);
          }
          resolve(false);
        };
      });
    };

    // Load in prioritised order:
    // First load priority frames: 1 to INITIAL_BATCH_SIZE
    // Then load the rest with concurrency pool
    const startPreloading = async () => {
      // 1. Load the first 10 frames aggressively
      const initialPromises = [];
      for (let i = 1; i <= Math.min(10, TOTAL_FRAMES); i++) {
        initialPromises.push(loadSingleImage(i));
      }
      await Promise.all(initialPromises);

      // 2. Queue remaining frames with concurrency control
      const remainingIndices = [];
      for (let i = 11; i <= TOTAL_FRAMES; i++) {
        remainingIndices.push(i);
      }

      const pool = [];
      for (const idx of remainingIndices) {
        if (isCancelledRef.current) break;
        const p = loadSingleImage(idx).then(() => {
          pool.splice(pool.indexOf(p), 1);
        });
        pool.push(p);

        if (pool.length >= CONCURRENT_DOWNLOADS) {
          await Promise.race(pool);
        }
      }

      await Promise.all(pool);
    };

    startPreloading();

    return () => {
      isCancelledRef.current = true;
    };
  }, [getFrameUrl]);

  // Method to draw the current frame to canvas with object-fit: cover
  const drawFrame = useCallback((canvas, frameIndex) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clamp index between 0 and TOTAL_FRAMES - 1
    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));

    // Retrieve image or find closest loaded frame
    let img = imagesRef.current[clampedIndex];
    if (!img) {
      // Search forward and backward for closest available frame
      for (let delta = 1; delta < TOTAL_FRAMES; delta++) {
        if (clampedIndex - delta >= 0 && imagesRef.current[clampedIndex - delta]) {
          img = imagesRef.current[clampedIndex - delta];
          break;
        }
        if (clampedIndex + delta < TOTAL_FRAMES && imagesRef.current[clampedIndex + delta]) {
          img = imagesRef.current[clampedIndex + delta];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const width = canvas.width;
    const height = canvas.height;

    // Calculate aspect ratio cover
    const imgRatio = img.naturalWidth / img.naturalHeight; // 1280 / 720 = 1.777
    const canvasRatio = width / height;

    let renderWidth, renderHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      // Canvas is wider than image
      renderWidth = width;
      renderHeight = width / imgRatio;
      offsetX = 0;
      offsetY = (height - renderHeight) / 2;
    } else {
      // Canvas is taller than image
      renderHeight = height;
      renderWidth = height * imgRatio;
      offsetY = 0;
      offsetX = (width - renderWidth) / 2;
    }

    // Clear and draw
    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  }, []);

  const progress = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return {
    loadedCount,
    totalFrames: TOTAL_FRAMES,
    progress,
    isInitialReady,
    isFullyLoaded,
    errorCount,
    drawFrame,
    imagesRef
  };
}
