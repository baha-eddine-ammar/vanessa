# A HEAVEN MADE FOR VANESSA ✧

> A breathtaking, cinematic, interactive romantic digital universe crafted exclusively for Vanessa.

---

## 🌟 The Experience

- **Act I: The Awakening (Intro)**: Deep midnight starfield with floating golden particles, an ethereal portal, and progressive letter-by-letter poetry leading to the grand entrance.
- **Act II: The Celestial Angel**: A scroll-driven canvas sequence of **238 cinematic frames** powered by GSAP ScrollTrigger, featuring aspect-ratio-preserving cover scaling, smooth scrub interpolation, and 5 poetic storytelling milestones.
- **Act III: The Heavenly Garden**: A real-time 3D Three.js environment filled with floating blush and white rose petals, fluttering butterflies, delicate white feathers, golden stardust, atmospheric lighting, and interactive mouse parallax.
- **Act IV: Why Vanessa Is Special**: 4 interactive glassmorphic cards with dynamic 3D tilt, champagne gold borders, and specular glare reflections.
- **Act V: Our Little Memories**: A floating editorial photo gallery with interactive zoom lightbox and intelligent fallback placeholders.
- **Act VI: The Final Love Letter**: Emotional finale with a beating heart made of golden particles, floating feathers, cinematic typography, and celebration bursts.
- **Audio Experience**: Optional ambient piano soundtrack with smooth volume fade and a procedural Web Audio API celestial synthesizer fallback.

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open your browser at the displayed local URL (default: http://localhost:3000)
```

---

## 🏗️ Production Build

To build the static website for production:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

The output will be generated inside the `dist/` directory, ready to be hosted on any static web host or GitHub Pages.

---

## 📸 Adding Personal Photographs

1. Place your photographs inside:
   ```
   public/images/memories/
   ```
2. Name them:
   - `memory-1.jpg` (or `.png` / `.webp`)
   - `memory-2.jpg`
   - `memory-3.jpg`
   - `memory-4.jpg`
   - `memory-5.jpg`
   - `memory-6.jpg`
3. Customize captions, dates, and titles in `src/data/memories.js`.
4. If a picture has not been provided yet, the website automatically displays an elegant starry vector illustration card.

---

## 🎵 Adding Background Music

1. Add your romantic instrumental audio file to:
   ```
   public/audio/romantic-piano.mp3
   ```
2. If no MP3 is supplied, the built-in celestial Web Audio synthesizer creates a soothing ambient soundscape whenever the visitor clicks the music toggle button.
3. Music will never autoplay without user gesture.

---

## 🌐 Deploying to GitHub Pages

This project is configured with `base: './'` in `vite.config.js` and includes a GitHub Actions workflow:

### Automatic Deployment via GitHub Actions:
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "A Heaven Made For Vanessa"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository settings:
   - Go to **Settings** > **Pages**
   - Under **Build and deployment**, set **Source** to **GitHub Actions**
3. The workflow in `.github/workflows/deploy.yml` will automatically build and deploy the website.

---

## 📁 Project Structure

```
van1/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages CI/CD workflow
├── public/
│   ├── vane1toinf/             # 238 cinematic angel JPG frames (001-238)
│   ├── images/
│   │   └── memories/           # Personal memory photos & README
│   └── audio/                  # Background music & README
├── src/
│   ├── components/
│   │   ├── Intro.jsx           # Scene 1: Starfield, portal & entrance
│   │   ├── AngelScrollExperience.jsx # Scene 2: 238-frame canvas scroll experience
│   │   ├── HeavenlyGarden.jsx  # Scene 3: Interactive 3D Three.js sanctuary
│   │   ├── BeautyCards.jsx     # Scene 4: 3D tilt affirmation cards
│   │   ├── MemoriesGallery.jsx # Scene 5: Floating photo gallery & lightbox
│   │   ├── FinalLetter.jsx     # Scene 6: Golden heart finale & letter
│   │   ├── Navigation.jsx      # Navigation header & scroll progress
│   │   ├── MusicControl.jsx    # Music widget & Web Audio synthesizer
│   │   ├── LoadingScreen.jsx   # Preloading screen with progress bar
│   │   └── FloatingPetals.jsx  # Global ambient floating particle layer
│   ├── data/
│   │   └── memories.js         # Configurable memory captions & dates
│   ├── hooks/
│   │   └── useImageSequence.js # Reusable frame loader, cache & canvas renderer
│   ├── styles/
│   │   ├── global.css
│   │   ├── intro.css
│   │   ├── angel.css
│   │   ├── garden.css
│   │   ├── cards.css
│   │   ├── gallery.css
│   │   ├── final.css
│   │   └── nav.css
│   ├── App.jsx
│   └── main.jsx
├── scripts/
│   └── convert-to-webp.js      # Optional lossless/lossy WebP converter
├── index.html
├── package.json
└── vite.config.js
```

---

*Made with love, just for Vanessa. ♡*
