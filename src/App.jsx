import React, { useState } from 'react';
import { useImageSequence } from './hooks/useImageSequence';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import MusicControl from './components/MusicControl';
import FloatingPetals from './components/FloatingPetals';
import Intro from './components/Intro';
import AngelScrollExperience from './components/AngelScrollExperience';
import HeavenlyGarden from './components/HeavenlyGarden';
import BeautyCards from './components/BeautyCards';
import MemoriesGallery from './components/MemoriesGallery';
import FinalLetter from './components/FinalLetter';

export default function App() {
  const {
    loadedCount,
    totalFrames,
    progress,
    isInitialReady,
    drawFrame,
  } = useImageSequence();

  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleEnterUniverse = (withSound) => {
    if (withSound) {
      setSoundEnabled(true);
    }
    const angelSection = document.getElementById('the-angel');
    if (angelSection) {
      angelSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="heaven-experience">
      {/* Preloading Screen */}
      <LoadingScreen
        progress={progress}
        isReady={isInitialReady}
      />

      {/* Global Ambient Canvas Elements */}
      <FloatingPetals />

      {/* Fixed UI Controls */}
      <Navigation />
      <MusicControl initialPlay={soundEnabled} />

      {/* Main Experience Scenes */}
      <main>
        {/* Scene 1: The Cinematic Introduction */}
        <Intro onEnterUniverse={handleEnterUniverse} />

        {/* Scene 2: The Main Angel Experience (238-frame scroll sequence) */}
        <AngelScrollExperience
          drawFrame={drawFrame}
          totalFrames={totalFrames}
          isInitialReady={isInitialReady}
        />

        {/* Scene 3: The Heavenly 3D Garden */}
        <HeavenlyGarden />

        {/* Scene 4: Why Vanessa Is Special */}
        <BeautyCards />

        {/* Scene 5: Our Little Memories */}
        <MemoriesGallery />

        {/* Scene 6: The Final Love Letter */}
        <FinalLetter />
      </main>
    </div>
  );
}
