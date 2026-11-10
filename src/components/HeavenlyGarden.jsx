import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Flower2, Wind, Heart } from 'lucide-react';
import { playStardustBurst } from '../utils/audioEffects';
import '../styles/garden.css';

export default function HeavenlyGarden() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [bloomCount, setBloomCount] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e0b17, 0.026);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.3);
    scene.add(ambientLight);

    const goldLight = new THREE.DirectionalLight(0xd9b77a, 2.8);
    goldLight.position.set(10, 20, 15);
    scene.add(goldLight);

    const pinkLight = new THREE.PointLight(0xf5c6d0, 3.5, 32);
    pinkLight.position.set(-6, 3, 6);
    scene.add(pinkLight);

    const lavenderLight = new THREE.PointLight(0xb9a5d4, 2.5, 26);
    lavenderLight.position.set(6, -4, 4);
    scene.add(lavenderLight);

    // Interactive Mouse Cursor Light
    const cursorLight = new THREE.PointLight(0xffe2a4, 3, 16);
    scene.add(cursorLight);

    // --- PROCEDURAL GLOWING PARTICLE TEXTURE ---
    const createGlowTexture = () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(255, 240, 200, 0.9)');
      grad.addColorStop(0.5, 'rgba(217, 183, 122, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      const texture = new THREE.CanvasTexture(c);
      texture.needsUpdate = true;
      return texture;
    };
    const glowTexture = createGlowTexture();

    // --- GOLDEN STARDUST PARTICLES ---
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 400 : 850;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);
    const particleVels = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 36;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 25;
      particleScales[i] = Math.random() * 0.85 + 0.3;
      particleVels.push({
        y: Math.random() * 0.016 + 0.006,
        x: (Math.random() - 0.5) * 0.009,
        swaySpeed: Math.random() * 1.5 + 0.5,
        swayOffset: Math.random() * Math.PI * 2,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.65,
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffe2a4,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- PROCEDURAL PETAL CURVED GEOMETRY ---
    const createPetalGeometry = () => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.bezierCurveTo(0.4, 0.5, 0.5, 1.2, 0, 1.8);
      shape.bezierCurveTo(-0.5, 1.2, -0.4, 0.5, 0, 0);

      const geometry = new THREE.ShapeGeometry(shape, 12);
      const pos = geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const z = -Math.sin(y * 1.5) * 0.28;
        pos.setZ(i, z);
      }
      geometry.computeVertexNormals();
      return geometry;
    };

    const petalGeo = createPetalGeometry();

    const blushMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5c6d0,
      roughness: 0.35,
      metalness: 0.15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
    });

    const ivoryMaterial = new THREE.MeshStandardMaterial({
      color: 0xfff8ee,
      roughness: 0.25,
      metalness: 0.12,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    });

    // Floating Rose Petals Group
    const petalsGroup = new THREE.Group();
    const petalCount = isMobile ? 30 : 65;
    const petalData = [];

    for (let i = 0; i < petalCount; i++) {
      const mat = Math.random() > 0.45 ? blushMaterial : ivoryMaterial;
      const mesh = new THREE.Mesh(petalGeo, mat);
      const scale = Math.random() * 0.45 + 0.35;
      mesh.scale.set(scale, scale, scale);

      const x = (Math.random() - 0.5) * 32;
      const y = (Math.random() - 0.5) * 26;
      const z = (Math.random() - 0.5) * 16;
      mesh.position.set(x, y, z);

      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      petalsGroup.add(mesh);

      petalData.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.022,
        rotSpeedY: (Math.random() - 0.5) * 0.028,
        rotSpeedZ: (Math.random() - 0.5) * 0.018,
        fallSpeed: Math.random() * 0.022 + 0.012,
        swaySpeed: Math.random() * 1.5 + 0.5,
        swayAmplitude: Math.random() * 0.02 + 0.01,
        baseX: x,
      });
    }
    scene.add(petalsGroup);

    // --- PROCEDURAL 3D FLOATING ROSES ---
    const rosesGroup = new THREE.Group();
    const createRose = () => {
      const rGroup = new THREE.Group();
      for (let ring = 0; ring < 3; ring++) {
        const ringPetals = 4 + ring * 2;
        const rScale = 0.35 + ring * 0.2;
        for (let p = 0; p < ringPetals; p++) {
          const pMesh = new THREE.Mesh(petalGeo, ring % 2 === 0 ? blushMaterial : ivoryMaterial);
          const angle = (p / ringPetals) * Math.PI * 2;
          pMesh.scale.set(rScale, rScale, rScale);
          pMesh.position.set(Math.cos(angle) * 0.35 * (ring + 1), Math.sin(angle) * 0.35 * (ring + 1), ring * 0.12);
          pMesh.rotation.z = angle + Math.PI / 2;
          pMesh.rotation.x = 0.35 * (ring + 1);
          rGroup.add(pMesh);
        }
      }
      return rGroup;
    };

    const roseCount = isMobile ? 3 : 6;
    const roseData = [];
    for (let i = 0; i < roseCount; i++) {
      const r = createRose();
      const scale = Math.random() * 0.5 + 0.5;
      r.scale.set(scale, scale, scale);
      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 14;
      r.position.set(x, y, z);
      rosesGroup.add(r);
      roseData.push({
        rose: r,
        rotX: (Math.random() - 0.5) * 0.01,
        rotY: (Math.random() - 0.5) * 0.015,
        rotZ: (Math.random() - 0.5) * 0.008,
      });
    }
    scene.add(rosesGroup);

    // --- PROCEDURAL FLOATING FEATHER GEOMETRY ---
    const createFeather = () => {
      const fGroup = new THREE.Group();
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.2, 0),
        new THREE.Vector3(0.15, -0.2, 0.05),
        new THREE.Vector3(0, 1.2, 0),
      ]);
      const quillGeo = new THREE.TubeGeometry(curve, 16, 0.03, 6, false);
      const quillMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const quill = new THREE.Mesh(quillGeo, quillMat);
      fGroup.add(quill);

      const vaneShape = new THREE.Shape();
      vaneShape.moveTo(0, -1.1);
      vaneShape.quadraticCurveTo(0.45, 0, 0, 1.2);
      vaneShape.quadraticCurveTo(-0.45, 0, 0, -1.1);
      const vaneGeo = new THREE.ShapeGeometry(vaneShape, 12);
      const vaneMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
        roughness: 0.5,
      });
      const vane = new THREE.Mesh(vaneGeo, vaneMat);
      fGroup.add(vane);
      return fGroup;
    };

    const feathersGroup = new THREE.Group();
    const featherCount = isMobile ? 10 : 20;
    const featherData = [];

    for (let i = 0; i < featherCount; i++) {
      const feather = createFeather();
      const scale = Math.random() * 0.5 + 0.4;
      feather.scale.set(scale, scale, scale);

      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 22;
      const z = (Math.random() - 0.5) * 14;
      feather.position.set(x, y, z);
      feather.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      feathersGroup.add(feather);

      featherData.push({
        feather,
        fallSpeed: Math.random() * 0.014 + 0.007,
        rotSpeed: (Math.random() - 0.5) * 0.018,
        sway: Math.random() * 2 + 1,
        initialX: x,
      });
    }
    scene.add(feathersGroup);

    // --- CELESTIAL BUTTERFLIES ---
    const createButterfly = (wingColor) => {
      const bGroup = new THREE.Group();

      const bodyGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.6, 8);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3d3024, roughness: 0.5 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      bGroup.add(body);

      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0);
      wingShape.bezierCurveTo(0.6, 0.8, 1.2, 0.4, 0.9, -0.2);
      wingShape.bezierCurveTo(0.6, -0.8, 0.1, -0.5, 0, 0);

      const wingGeo = new THREE.ShapeGeometry(wingShape, 8);
      const wingMat = new THREE.MeshStandardMaterial({
        color: wingColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.92,
        roughness: 0.2,
        metalness: 0.3,
      });

      const wingLeft = new THREE.Mesh(wingGeo, wingMat);
      wingLeft.position.set(0.04, 0.1, 0);
      bGroup.add(wingLeft);

      const wingRight = new THREE.Mesh(wingGeo, wingMat);
      wingRight.scale.set(-1, 1, 1);
      wingRight.position.set(-0.04, 0.1, 0);
      bGroup.add(wingRight);

      return { group: bGroup, wingLeft, wingRight };
    };

    const butterflies = [
      createButterfly(0xd9b77a),
      createButterfly(0xf5c6d0),
      createButterfly(0xb9a5d4),
      createButterfly(0xfff8ee),
    ];

    butterflies.forEach((b, index) => {
      b.group.scale.set(0.7, 0.7, 0.7);
      b.group.position.set((index - 1.5) * 6, (Math.random() - 0.5) * 6, Math.random() * 4);
      scene.add(b.group);
    });

    // --- MOUSE PARALLAX & INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / height - 0.5) * 2;
    };

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // --- ANIMATION LOOP ---
    let clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera parallax
      targetCameraX = mouseX * 2.5;
      targetCameraY = mouseY * 1.8;
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Interactive cursor light follow
      cursorLight.position.set(camera.position.x * 1.8, camera.position.y * 1.8, 6);

      // 1. Stardust animation
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const vel = particleVels[i];
        positions[i * 3 + 1] += vel.y;
        positions[i * 3] += Math.sin(elapsed * vel.swaySpeed + vel.swayOffset) * 0.01;

        if (positions[i * 3 + 1] > 16) {
          positions[i * 3 + 1] = -16;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsed * 0.025;

      // 2. Petals floating & spinning
      petalData.forEach((pd, i) => {
        const mesh = pd.mesh;
        mesh.rotation.x += pd.rotSpeedX;
        mesh.rotation.y += pd.rotSpeedY;
        mesh.rotation.z += pd.rotSpeedZ;

        mesh.position.y -= pd.fallSpeed;
        mesh.position.x = pd.baseX + Math.sin(elapsed * pd.swaySpeed + i) * 1.3;

        if (mesh.position.y < -14) {
          mesh.position.y = 14;
          mesh.position.x = (Math.random() - 0.5) * 32;
          pd.baseX = mesh.position.x;
        }
      });

      // 3. Floating 3D Roses
      roseData.forEach((rd) => {
        rd.rose.rotation.x += rd.rotX;
        rd.rose.rotation.y += rd.rotY;
        rd.rose.rotation.z += rd.rotZ;
      });

      // 4. Feathers swaying downward
      featherData.forEach((fd, i) => {
        const f = fd.feather;
        f.position.y -= fd.fallSpeed;
        f.position.x = fd.initialX + Math.sin(elapsed * 0.8 + fd.sway) * 1.6;
        f.rotation.z = Math.sin(elapsed * 1.2 + i) * 0.35;
        f.rotation.y += fd.rotSpeed;

        if (f.position.y < -14) {
          f.position.y = 14;
          fd.initialX = (Math.random() - 0.5) * 28;
        }
      });

      // 5. Butterflies flying & flapping
      butterflies.forEach((b, i) => {
        const flap = Math.sin(elapsed * 18 + i * 2) * 0.85;
        b.wingLeft.rotation.y = flap;
        b.wingRight.rotation.y = -flap;

        const radius = 6.5 + i * 1.5;
        const speed = 0.45 + i * 0.15;
        const angle = elapsed * speed + (i * Math.PI) / 2;

        b.group.position.x = Math.cos(angle) * radius;
        b.group.position.y = Math.sin(angle * 1.5) * 2.8 + Math.sin(elapsed * 2 + i);
        b.group.position.z = Math.sin(angle) * (radius * 0.6);

        b.group.rotation.y = -angle + Math.PI / 2;
        b.group.rotation.z = Math.sin(elapsed * 3 + i) * 0.15;
      });

      // Subtle light oscillation
      pinkLight.position.x = Math.sin(elapsed * 0.6) * 9;
      goldLight.position.x = Math.cos(elapsed * 0.4) * 13;

      renderer.render(scene, camera);
    };

    animate();

    // Trigger bloom burst on click
    const handleCanvasClick = () => {
      playStardustBurst();
      setBloomCount((prev) => prev + 1);
      pinkLight.intensity = 7;
      goldLight.intensity = 5;
      cursorLight.intensity = 6;
      setTimeout(() => {
        pinkLight.intensity = 3.5;
        goldLight.intensity = 2.8;
        cursorLight.intensity = 3;
      }, 950);
    };

    container.addEventListener('click', handleCanvasClick);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (container) container.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationId);

      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      petalGeo.dispose();
      blushMaterial.dispose();
      ivoryMaterial.dispose();
      glowTexture.dispose();
    };
  }, []);

  return (
    <section id="her-universe" ref={containerRef} className="garden-section">
      <div className="garden-canvas-container">
        <canvas ref={canvasRef} className="garden-canvas" />
      </div>

      <div className="garden-content">
        <span className="section-tagline">Scene III • Her Sanctuary</span>
        <h2 className="section-title text-gradient-heaven font-serif">
          The Heavenly Garden
        </h2>
        <p className="section-subtitle">
          A place suspended beyond reality, where soft rose petals drift forever,
          butterflies dance in golden light, and every whisper echoes your grace.
        </p>

        <div className="garden-interactive-badge">
          <Sparkles size={16} />
          <span>Move your cursor to drift • Tap to summon celestial stardust</span>
        </div>
      </div>

      {/* Atmospheric highlights */}
      <div className="garden-features-grid">
        <div className="garden-feature-card">
          <div className="garden-feature-icon">
            <Flower2 size={22} />
          </div>
          <h3 className="garden-feature-title">Everlasting Bloom</h3>
          <p className="garden-feature-desc">
            White and blush roses sculpted from light that never fade, just like the
            warmth you bring into my world.
          </p>
        </div>

        <div className="garden-feature-card">
          <div className="garden-feature-icon">
            <Wind size={22} />
          </div>
          <h3 className="garden-feature-title">Gentle Celestial Breeze</h3>
          <p className="garden-feature-desc">
            Feathers and golden dust dancing in perpetual harmony, drifting softly as
            if time itself stopped to watch you.
          </p>
        </div>

        <div className="garden-feature-card">
          <div className="garden-feature-icon">
            <Heart size={22} />
          </div>
          <h3 className="garden-feature-title">A Living Universe</h3>
          <p className="garden-feature-desc">
            Every element here responds to your touch. Created to remind you how
            deeply cherished you are.
          </p>
        </div>
      </div>
    </section>
  );
}
