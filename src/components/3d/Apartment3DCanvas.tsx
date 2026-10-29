'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Camera, CheckCircle2, Eye, ShieldCheck, Sparkles } from 'lucide-react';

interface RoomData {
  id: string;
  name: string;
  condition: 'Pristine' | 'Verified' | 'Fair';
  position: [number, number, number];
  description: string;
  itemCount: number;
}

const ROOMS: RoomData[] = [
  {
    id: 'living',
    name: 'Living Room',
    condition: 'Verified',
    position: [-2.2, 0.4, 1.2],
    description: 'Walls, light fixtures & flooring baseline recorded',
    itemCount: 4,
  },
  {
    id: 'kitchen',
    name: 'Kitchen & Hob',
    condition: 'Pristine',
    position: [2.0, 0.4, 1.5],
    description: 'Chimney degreasing & appliance check logged',
    itemCount: 6,
  },
  {
    id: 'bedroom',
    name: 'Master Bedroom',
    condition: 'Pristine',
    position: [-1.8, 0.4, -2.2],
    description: 'Wardrobe tracks & AC remote tested',
    itemCount: 5,
  },
  {
    id: 'bath',
    name: 'Bathroom',
    condition: 'Verified',
    position: [2.2, 0.4, -1.8],
    description: 'Plumbing fittings & tile integrity checked',
    itemCount: 3,
  },
  {
    id: 'balcony',
    name: 'Balcony',
    condition: 'Pristine',
    position: [-2.2, 0.4, 3.8],
    description: 'Railing paint & floor drainage tested',
    itemCount: 2,
  },
];

export default function Apartment3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRoom, setActiveRoom] = useState<RoomData>(ROOMS[0]);
  const [isRotating, setIsRotating] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRotating(false);
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null; // transparent to blend with dark navy backdrop

    // Camera - Isometric-style Perspective
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(9, 8, 9);
    camera.lookAt(0, 0.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0c1b2b, 1.8);
    scene.add(ambientLight);

    const emeraldLight = new THREE.PointLight(0x16c784, 2.5, 15);
    emeraldLight.position.set(-3, 4, 3);
    scene.add(emeraldLight);

    const warmLight = new THREE.DirectionalLight(0xfff5ea, 2.0);
    warmLight.position.set(6, 12, 6);
    warmLight.castShadow = true;
    warmLight.shadow.mapSize.width = 1024;
    warmLight.shadow.mapSize.height = 1024;
    warmLight.shadow.camera.near = 0.5;
    warmLight.shadow.camera.far = 25;
    warmLight.shadow.bias = -0.001;
    scene.add(warmLight);

    // Soft Fill light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    fillLight.position.set(-6, 6, -6);
    scene.add(fillLight);

    // Apartment Group
    const apartmentGroup = new THREE.Group();
    scene.add(apartmentGroup);

    // Materials
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0c1e30,
      roughness: 0.35,
      metalness: 0.1,
    });

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x142b45,
      roughness: 0.5,
      metalness: 0.05,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x9bf5cc,
      transmission: 0.85,
      opacity: 0.45,
      transparent: true,
      roughness: 0.1,
      ior: 1.4,
    });

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x22374e,
      roughness: 0.4,
    });

    const emeraldAccentMat = new THREE.MeshStandardMaterial({
      color: 0x16c784,
      emissive: 0x0a4830,
      roughness: 0.2,
      metalness: 0.3,
    });

    const basePlateGeo = new THREE.BoxGeometry(8, 0.2, 9);
    const basePlate = new THREE.Mesh(basePlateGeo, floorMat);
    basePlate.position.y = -0.1;
    basePlate.receiveShadow = true;
    apartmentGroup.add(basePlate);

    // Grid Floor Overlay
    const grid = new THREE.GridHelper(8.5, 17, 0x16c784, 0x162e48);
    grid.position.y = 0.01;
    apartmentGroup.add(grid);

    // --- Architectural Walls (Isometric low cut walls) ---
    // Outer Back Wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(7.8, 1.4, 0.15), wallMat);
    backWall.position.set(0, 0.7, -4.4);
    backWall.castShadow = true;
    apartmentGroup.add(backWall);

    // Outer Right Wall
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.4, 8.8), wallMat);
    rightWall.position.set(3.9, 0.7, 0);
    rightWall.castShadow = true;
    apartmentGroup.add(rightWall);

    // Interior Partition Walls
    // Dividing Bedroom & Living Room
    const partWall1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.1, 0.12), wallMat);
    partWall1.position.set(-1.8, 0.55, -0.6);
    partWall1.castShadow = true;
    apartmentGroup.add(partWall1);

    // Dividing Kitchen & Living Room
    const partWall2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 4.8), wallMat);
    partWall2.position.set(0.3, 0.55, 1.8);
    partWall2.castShadow = true;
    apartmentGroup.add(partWall2);

    // Dividing Bathroom
    const partWall3 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 0.12), wallMat);
    partWall3.position.set(2.1, 0.55, -0.6);
    partWall3.castShadow = true;
    apartmentGroup.add(partWall3);

    // --- Furniture & Apartment Elements ---
    // 1. Living Room: Sofa & Coffee Table
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 0.9), woodMat);
    sofaBase.position.set(-2.0, 0.18, 0.8);
    sofaBase.castShadow = true;
    apartmentGroup.add(sofaBase);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.45, 0.25), woodMat);
    sofaBack.position.set(-2.0, 0.45, 0.45);
    apartmentGroup.add(sofaBack);

    const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 0.6), glassMat);
    coffeeTable.position.set(-2.0, 0.11, 1.8);
    apartmentGroup.add(coffeeTable);

    // 2. Kitchen: Counter, Island & Hob
    const kitchenCounter = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.85, 0.8), woodMat);
    kitchenCounter.position.set(2.1, 0.42, 3.8);
    kitchenCounter.castShadow = true;
    apartmentGroup.add(kitchenCounter);

    const kitchenHob = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.5), emeraldAccentMat);
    kitchenHob.position.set(2.1, 0.87, 3.8);
    apartmentGroup.add(kitchenHob);

    const kitchenIsland = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.85, 0.7), woodMat);
    kitchenIsland.position.set(2.0, 0.42, 1.8);
    kitchenIsland.castShadow = true;
    apartmentGroup.add(kitchenIsland);

    // 3. Bedroom: Bed & Nightstands
    const bedBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 2.2), woodMat);
    bedBase.position.set(-1.8, 0.2, -2.5);
    bedBase.castShadow = true;
    apartmentGroup.add(bedBase);

    const bedPillow = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 0.5), glassMat);
    bedPillow.position.set(-1.8, 0.45, -3.2);
    apartmentGroup.add(bedPillow);

    // 4. Bathroom: Vanity & Shower partition
    const bathVanity = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.7), woodMat);
    bathVanity.position.set(2.2, 0.4, -3.6);
    apartmentGroup.add(bathVanity);

    const showerGlass = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 1.6), glassMat);
    showerGlass.position.set(1.4, 0.7, -2.2);
    apartmentGroup.add(showerGlass);

    // 5. Balcony: Glass Railing
    const balconyRailing = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.75, 0.06), glassMat);
    balconyRailing.position.set(-2.0, 0.4, 4.35);
    apartmentGroup.add(balconyRailing);

    // Floating Interactive Inspection Pins (Spheres with pulsing rings)
    const pinGroup = new THREE.Group();
    apartmentGroup.add(pinGroup);

    ROOMS.forEach((room) => {
      const pinSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0x16c784,
          emissive: 0x16c784,
          emissiveIntensity: 0.6,
          metalness: 0.5,
          roughness: 0.2,
        })
      );
      pinSphere.position.set(room.position[0], room.position[1] + 0.8, room.position[2]);

      const ringGeo = new THREE.RingGeometry(0.24, 0.32, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x9bf5cc,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const pinRing = new THREE.Mesh(ringGeo, ringMat);
      pinRing.rotation.x = Math.PI / 2;
      pinRing.position.copy(pinSphere.position);
      pinRing.position.y -= 0.15;

      pinGroup.add(pinSphere);
      pinGroup.add(pinRing);
    });

    setIsLoaded(true);

    // Animation Loop
    let animationFrameId: number;
    let rotationAngle = 0.5;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotating && !prefersReducedMotion) {
        rotationAngle += 0.0035;
        apartmentGroup.rotation.y = rotationAngle;
      }

      // Gentle floating pins
      const elapsed = Date.now() * 0.002;
      pinGroup.children.forEach((child, idx) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry) {
          child.position.y = 1.0 + Math.sin(elapsed + idx) * 0.08;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isRotating]);

  return (
    <div className="relative w-full h-[480px] lg:h-[580px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#0C1B2B]/90 to-[#07111F] border border-white/10 shadow-2xl">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#07111F]/80 backdrop-blur-md border border-[#16C784]/30 shadow-lg pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-[#16C784] animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-[#9BF5CC]">
            Interactive 3D Architectural Baseline
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsRotating((prev) => !prev)}
          className="px-3 py-1.5 rounded-full bg-[#0C1B2B]/80 hover:bg-[#102438] backdrop-blur-md border border-white/10 text-xs font-medium text-[#94A3B8] hover:text-white transition-colors pointer-events-auto flex items-center gap-1.5"
          aria-label={isRotating ? 'Pause rotation' : 'Resume rotation'}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#16C784]" />
          <span>{isRotating ? 'Pause Orbit' : 'Resume Orbit'}</span>
        </button>
      </div>

      {/* Floating Bottom Card: Room Inspection Detail */}
      <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md p-4 rounded-2xl glass-panel-elevated pointer-events-auto transition-all duration-300">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white tracking-tight">{activeRoom.name}</h4>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#16C784]/20 text-[#9BF5CC] border border-[#16C784]/30">
                <CheckCircle2 className="w-3 h-3 text-[#16C784]" />
                {activeRoom.condition}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">{activeRoom.description}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-white/90">{activeRoom.itemCount} items</span>
            <div className="text-[10px] text-[#16C784]">Photo Verified</div>
          </div>
        </div>

        {/* Room Switcher Pills */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-white/10 overflow-x-auto pb-1">
          {ROOMS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setActiveRoom(r)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeRoom.id === r.id
                  ? 'bg-[#16C784] text-[#07111F] font-bold shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Verified Shield Stamp */}
      <div className="absolute top-16 right-4 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl glass-panel border border-[#16C784]/20 pointer-events-none">
        <div className="p-1.5 rounded-lg bg-[#16C784]/20 text-[#16C784]">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-white tracking-tight">Move-In Timestamped</div>
          <div className="text-[10px] text-[#94A3B8]">Cryptographically Sealed</div>
        </div>
      </div>
    </div>
  );
}
