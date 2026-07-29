import React, { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { motion } from "framer-motion";

const blockchainPlatforms = [
    "Bitcoin", "Ethereum", "Hyperledger Fabric", "Corda",
    "Binance Smart Chain", "Polkadot", "Cosmos SDK", "Stellar",
    "Tron", "Ripple", "Quorum", "EOS", "Tezos", "XDC Network",
    "Hedera Hashgraph"
];

interface CelestialObjectData {
    id: string;
    image: string;
    type: "planet" | "ship" | "asteroid" | "nebula";
    radius?: number;
    size?: [number, number];
    bgPos?: string;
    bgSize?: string;
}

const CELESTIAL_OBJECTS: CelestialObjectData[] = [
    // Planets with realistic scaling ratios
    { id: "earth", image: "/interstellar/planet_earth_moon.png", type: "planet", radius: 4.5 },
    { id: "mars", image: "/interstellar/planet_mars_venus.png", type: "planet", radius: 2.5 },
    { id: "venus", image: "/interstellar/planet_mars_venus.png", type: "planet", radius: 4.3, bgPos: "100% 0%" },
    { id: "jupiter", image: "/interstellar/planet_gas_giants.png", type: "planet", radius: 15 },
    { id: "saturn", image: "/interstellar/planet_gas_giants.png", type: "planet", radius: 13, bgPos: "100% 0%" },
    { id: "neptune", image: "/interstellar/planet_ice_giants.png", type: "planet", radius: 9 },
    { id: "uranus", image: "/interstellar/planet_ice_giants.png", type: "planet", radius: 8.8, bgPos: "100% 0%" },

    // Iconic Ships
    { id: "falcon", image: "/interstellar/sw_ships_1.png", type: "ship", size: [10, 10], bgPos: "0% 50%", bgSize: "400% auto" },
    { id: "naboo_royal", image: "/interstellar/sw_ships_1.png", type: "ship", size: [10, 10], bgPos: "33.3% 50%", bgSize: "400% auto" },
    { id: "executor", image: "/interstellar/sw_ships_1.png", type: "ship", size: [18, 7], bgPos: "66.6% 50%", bgSize: "400% auto" },
    { id: "supremacy", image: "/interstellar/sw_ships_2.png", type: "ship", size: [20, 9], bgPos: "0% 50%", bgSize: "400% auto" },
    { id: "slave_1", image: "/interstellar/sw_slave_1.png", type: "ship", size: [8, 11] },
    { id: "frieza", image: "/interstellar/anime_ships.png", type: "ship", size: [11, 10], bgPos: "0% 50%", bgSize: "300% auto" },
    { id: "capsule", image: "/interstellar/anime_ships.png", type: "ship", size: [9, 9], bgPos: "50% 50%", bgSize: "300% auto" },

    // Additional Ships (Phase 2)
    { id: "scifi_1", image: "/interstellar/additional_ships.png", type: "ship", size: [10, 8], bgPos: "0% 0%", bgSize: "200% 200%" },
    { id: "scifi_2", image: "/interstellar/additional_ships.png", type: "ship", size: [10, 8], bgPos: "100% 0%", bgSize: "200% 200%" },
    { id: "scifi_3", image: "/interstellar/additional_ships.png", type: "ship", size: [12, 10], bgPos: "0% 100%", bgSize: "200% 200%" },
    { id: "scifi_4", image: "/interstellar/additional_ships.png", type: "ship", size: [10, 8], bgPos: "100% 100%", bgSize: "200% 200%" },
];

const InterstellarBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- Performance Detection ---
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isLowEnd = (navigator.hardwareConcurrency ?? 8) <= 4;
        const motionMult = prefersReducedMotion ? 5 : 1;
        const perfMult = isLowEnd ? 2 : 1;

        const width = window.innerWidth;
        const height = window.innerHeight;

        // --- Core Three.js Setup ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 3000);
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        containerRef.current.appendChild(renderer.domElement);

        // --- Post-Processing Pipeline ---
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(width, height),
            0.4,   // strength — tasteful, not overblown
            0.3,   // radius
            0.85   // threshold — only bright elements bloom
        );
        composer.addPass(bloomPass);
        composer.addPass(new OutputPass());

        // --- Fog for Depth Cueing ---
        // Far-spawned objects fade in naturally instead of popping into view
        scene.fog = new THREE.FogExp2(0x050510, 0.0008);

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 2.5);
        pointLight.position.set(50, 50, 50);
        scene.add(pointLight);

        // --- PMREM Environment Map for Metallic Reflections ---
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        // Create a simple procedural environment cubemap
        const envScene = new THREE.Scene();
        envScene.background = new THREE.Color(0x050510);
        // Add dim colored lights to create interesting reflections
        const envLight1 = new THREE.PointLight(0x00aaff, 1, 100);
        envLight1.position.set(10, 10, 10);
        envScene.add(envLight1);
        const envLight2 = new THREE.PointLight(0xffaa00, 0.5, 100);
        envLight2.position.set(-10, -5, -10);
        envScene.add(envLight2);
        const envMap = pmremGenerator.fromScene(envScene, 0.04).texture;
        scene.environment = envMap;
        pmremGenerator.dispose();

        // --- Mouse Parallax State ---
        const mouseTarget = { x: 0, y: 0 };
        const mouseCurrent = { x: 0, y: 0 };
        const parallaxStrength = prefersReducedMotion ? 0 : 3;
        const handleMouseMove = (e: MouseEvent) => {
            mouseTarget.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseTarget.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        if (!prefersReducedMotion) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        // --- Scroll State ---
        let scrollProgress = 0;
        const handleScroll = () => {
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        // --- Texture Cache ---
        // Every texture is loaded once and reused. Per-instance UV offsets use texture.clone()
        // which shares the underlying Source (image data) but allows unique offset/repeat.
        // --- Loading Manager for boot sequence ---
        const loadingManager = new THREE.LoadingManager();
        let texturesLoaded = 0;
        let totalTextures = 0;
        loadingManager.onStart = (_url, loaded, total) => {
            totalTextures = total;
            texturesLoaded = loaded;
        };
        loadingManager.onProgress = (_url, loaded, total) => {
            texturesLoaded = loaded;
            totalTextures = total;
            // Dispatch custom event for BootLoader to listen to
            window.dispatchEvent(new CustomEvent('texture-progress', {
                detail: { loaded, total, progress: total > 0 ? loaded / total : 0 }
            }));
        };
        loadingManager.onLoad = () => {
            window.dispatchEvent(new CustomEvent('texture-progress', {
                detail: { loaded: totalTextures, total: totalTextures, progress: 1 }
            }));
        };

        const loader = new THREE.TextureLoader(loadingManager);
        const textureCache = new Map<string, THREE.Texture>();
        const cachedLoad = (path: string): THREE.Texture => {
            if (textureCache.has(path)) return textureCache.get(path)!;
            const tex = loader.load(path);
            textureCache.set(path, tex);
            return tex;
        };

        // --- Galaxy Cycle System ---
        const galaxyTextures = [
            cachedLoad("/interstellar/galaxy_blue.png"),
            cachedLoad("/interstellar/galaxy_gold.png"),
            cachedLoad("/interstellar/galaxy_purple.png"),
            cachedLoad("/interstellar/galaxy_red.png")
        ];

        // Galaxy Material & Mesh
        const galaxyGeometry = new THREE.PlaneGeometry(1600, 1600);
        const galaxyMaterial = new THREE.MeshBasicMaterial({
            map: galaxyTextures[0],
            transparent: true,
            opacity: 0, // Start invisible for fade-in
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
        galaxy.position.set(0, 50, -1800);
        galaxy.rotation.x = -Math.PI / 4;
        galaxy.renderOrder = -2;
        scene.add(galaxy);

        // --- Distant Background Giants (Phase 5) ---
        // Huge, barely-moving objects far behind the action to sell scale/depth.
        // Positioned within the camera's FOV (camera looks at 0,0,-600) and
        // billboarded to face the camera. Drift via sinusoidal x/y, no rotation.
        const distantGiants: { mesh: THREE.Mesh, driftFreqX: number, driftFreqY: number, driftAmpX: number, driftAmpY: number, baseX: number, baseY: number }[] = [];
        const giantGeo1 = new THREE.PlaneGeometry(800, 800);
        const giantMat1 = new THREE.MeshBasicMaterial({
            map: cachedLoad("/interstellar/planet_gas_giants.png"),
            transparent: true,
            opacity: 0.15,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const giant1 = new THREE.Mesh(giantGeo1, giantMat1);
        giant1.position.set(-200, 100, -2500);
        giant1.lookAt(camera.position);
        scene.add(giant1);
        distantGiants.push({ mesh: giant1, driftFreqX: 0.00008, driftFreqY: 0.00006, driftAmpX: 80, driftAmpY: 40, baseX: -200, baseY: 100 });

        const giantGeo2 = new THREE.PlaneGeometry(1200, 1200);
        const giantMat2 = new THREE.MeshBasicMaterial({
            map: cachedLoad("/interstellar/galaxy_purple.png"),
            transparent: true,
            opacity: 0.1,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const giant2 = new THREE.Mesh(giantGeo2, giantMat2);
        giant2.position.set(300, -150, -2800);
        giant2.lookAt(camera.position);
        scene.add(giant2);
        distantGiants.push({ mesh: giant2, driftFreqX: 0.00005, driftFreqY: 0.00007, driftAmpX: 100, driftAmpY: 50, baseX: 300, baseY: -150 });

        // Cycle State — durations adjusted for reduced motion
        let galaxyIndex = 0;
        let galaxyState: 'FADE_IN' | 'VISIBLE' | 'FADE_OUT' | 'SWAP' = 'FADE_IN';
        let galaxyTimer = 0;
        const FADE_DURATION = prefersReducedMotion ? 6000 : 3000;
        const VISIBLE_DURATION = prefersReducedMotion ? 60000 : 15000;

        // --- Shared Geometry Constants ---
        // Reduced from 64/128 — visually identical at on-screen sizes
        const SEG = 48;

        // --- HERO OBJECT SYSTEM ---
        const heroTextures = {
            saturn: cachedLoad("/interstellar/saturn_surface.png"),
            saturnRing: cachedLoad("/interstellar/saturn_rings.png"),
            sun: cachedLoad("/interstellar/sun_surface.png"),
            proxima: cachedLoad("/interstellar/proxima_surface.png"),
            alien: cachedLoad("/interstellar/alien_surface.png"),
            station: cachedLoad("/interstellar/station_hull.png"),
            dust: cachedLoad("/interstellar/cosmic_dust.png"),
        };

        // Shared hero geometries — allocated once, reused across all pooled instances
        const heroGeometries = {
            saturn: new THREE.SphereGeometry(18, SEG, SEG),
            saturnRing: new THREE.RingGeometry(22, 38, SEG),
            sun: new THREE.SphereGeometry(45, SEG, SEG),
            sunHalo: new THREE.PlaneGeometry(140, 140),
            stationHull: new THREE.CylinderGeometry(4, 4, 35, 32),
            stationRing: new THREE.TorusGeometry(12, 2, 16, 100),
            planet: new THREE.SphereGeometry(12, SEG, SEG),
        };

        // Factory: builds a hero group for a given type (materials per-instance, geometry shared)
        const createHeroGroup = (type: string): THREE.Group => {
            const group = new THREE.Group();

            if (type === 'saturn') {
                // Body
                const material = new THREE.MeshStandardMaterial({ map: heroTextures.saturn, roughness: 0.8 });
                const body = new THREE.Mesh(heroGeometries.saturn, material);
                group.add(body);

                // Rings — RingGeometry defaults to planar UVs which map the full-circle texture correctly
                const ringMat = new THREE.MeshBasicMaterial({
                    map: heroTextures.saturnRing,
                    transparent: true,
                    side: THREE.DoubleSide,
                    opacity: 0.9
                });
                const ring = new THREE.Mesh(heroGeometries.saturnRing, ringMat);
                ring.rotation.x = Math.PI / 2; // Flat
                ring.rotation.y = -Math.PI / 8; // Tilt
                group.add(ring);
                // Tilt the whole planet slightly
                group.rotation.z = Math.PI / 6;

            } else if (type === 'sun') {
                const material = new THREE.MeshBasicMaterial({ map: heroTextures.sun });
                const body = new THREE.Mesh(heroGeometries.sun, material);

                // Glow Halo
                const haloMat = new THREE.MeshBasicMaterial({
                    map: heroTextures.dust,
                    transparent: true,
                    opacity: 0.6,
                    color: 0xffaa00,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });
                const halo = new THREE.Mesh(heroGeometries.sunHalo, haloMat);
                halo.renderOrder = -1; // Behind sun
                group.add(halo);
                group.add(body);

            } else if (type === 'station') {
                // Central Hull
                const hullMat = new THREE.MeshStandardMaterial({
                    map: heroTextures.station,
                    metalness: 0.8,
                    roughness: 0.3
                });
                const body = new THREE.Mesh(heroGeometries.stationHull, hullMat);
                body.rotation.z = Math.PI / 2; // Horizontal
                group.add(body);

                // Gravity Ring
                const ringMat = new THREE.MeshStandardMaterial({
                    map: heroTextures.station,
                    metalness: 0.7,
                    roughness: 0.4
                });
                const ring = new THREE.Mesh(heroGeometries.stationRing, ringMat);
                // Ring rotates around the cylinder axis
                ring.userData = { isRotator: true };
                group.add(ring);

            } else {
                // Planets (Proxima / Alien)
                const material = new THREE.MeshStandardMaterial({
                    map: type === 'proxima' ? heroTextures.proxima : heroTextures.alien,
                    roughness: 0.6,
                    metalness: 0.1,
                    emissive: type === 'alien' ? new THREE.Color(0x0044ff) : new THREE.Color(0x000000),
                    emissiveIntensity: 0.2
                });
                const body = new THREE.Mesh(heroGeometries.planet, material);
                group.add(body);
            }

            return group;
        };

        // Pre-populate hero pools (2 per type)
        const heroPool = new Map<string, THREE.Group[]>();
        for (const type of ['saturn', 'sun', 'station', 'proxima', 'alien']) {
            heroPool.set(type, [createHeroGroup(type), createHeroGroup(type)]);
        }

        const activeHeroes: { 
            group: THREE.Group; 
            type: string; 
            speed: number; 
            rotSpeed: { x: number, y: number, z: number };
            isOrbital: boolean;
            orbitAngle: number;
            orbitSpeed: number;
            orbitRadiusX: number;
            orbitRadiusY: number;
            orbitCenterX: number;
            orbitCenterY: number;
        }[] = [];

        const spawnHero = () => {
            // 10% Sun, 20% Saturn, 20% Station, 25% Proxima, 25% Alien
            const rand = Math.random();
            const type = rand < 0.1 ? 'sun' : rand < 0.3 ? 'saturn' : rand < 0.5 ? 'station' : rand < 0.75 ? 'proxima' : 'alien';

            const pool = heroPool.get(type)!;
            let group: THREE.Group;

            if (pool.length > 0) {
                group = pool.pop()!;
                // Reset group rotation to base state
                group.rotation.set(0, 0, 0);
                if (type === 'saturn') group.rotation.z = Math.PI / 6;
                // Reset station gravity ring rotation
                if (type === 'station') {
                    group.children.forEach(child => {
                        if (child.userData.isRotator) {
                            child.rotation.set(0, 0, 0);
                        }
                    });
                }
            } else {
                // Fallback if pool is empty (rare)
                group = createHeroGroup(type);
            }

            group.renderOrder = 20; // Hero priority

            // Positioning - LOWER FIELD
            const xPos = (Math.random() - 0.5) * 150; // Spread wide
            const yPos = -40 - Math.random() * 40; // ALWAYS BELOW CENTER
            group.position.set(xPos, yPos, -1600); // Start far background

            scene.add(group);

            activeHeroes.push({
                group,
                type,
                speed: 1.5 + Math.random() * 1.0, // Slow majestic movement
                rotSpeed: {
                    x: Math.random() * 0.005,
                    y: 0.01 + Math.random() * 0.01, // Continual spin
                    z: 0
                },
                isOrbital: type !== 'sun',
                orbitAngle: Math.random() * Math.PI * 2,
                orbitSpeed: 0.001 + Math.random() * 0.002,
                orbitRadiusX: 60 + Math.random() * 60,
                orbitRadiusY: 30 + Math.random() * 30,
                orbitCenterX: xPos,
                orbitCenterY: yPos
            });
        };


        // --- Multi-Layer Starfield (Phase 6) ---
        const starSpeedMult = prefersReducedMotion ? 0.2 : 1;

        // Layer 1: Distant — spherically distributed, small, dim, very slow
        const distantStarCount = isLowEnd ? 1500 : 3000;
        const distantStarGeo = new THREE.BufferGeometry();
        const distantStarPositions = new Float32Array(distantStarCount * 3);
        const distantStarSpeeds = new Float32Array(distantStarCount);
        const distantTwinklePhase = new Float32Array(distantStarCount);
        const distantStarBaseSizes = new Float32Array(distantStarCount);
        for (let i = 0; i < distantStarCount; i++) {
            // Spherical distribution (full 4π steradians)
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 800 + Math.random() * 1200;
            distantStarPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            distantStarPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            distantStarPositions[i * 3 + 2] = r * Math.cos(phi) - 600; // Center around look-at
            distantStarSpeeds[i] = (Math.random() * 0.5 + 0.2) * starSpeedMult;
            distantTwinklePhase[i] = Math.random() * Math.PI * 2;
            distantStarBaseSizes[i] = 0.3 + Math.random() * 0.4;
        }
        distantStarGeo.setAttribute('position', new THREE.BufferAttribute(distantStarPositions, 3));
        distantStarGeo.setAttribute('size', new THREE.BufferAttribute(distantStarBaseSizes.slice(), 1));
        const distantStarMat = new THREE.PointsMaterial({
            color: 0xddeeff,
            size: 0.5,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
            sizeAttenuation: true
        });
        const distantStars = new THREE.Points(distantStarGeo, distantStarMat);
        distantStars.renderOrder = -3;
        scene.add(distantStars);

        // Layer 2: Mid — forward-biased box, current-ish size/speed
        const midStarCount = isLowEnd ? 1000 : 2000;
        const midStarGeo = new THREE.BufferGeometry();
        const midStarPositions = new Float32Array(midStarCount * 3);
        const midStarSpeeds = new Float32Array(midStarCount);
        const midTwinklePhase = new Float32Array(midStarCount);
        const midStarBaseSizes = new Float32Array(midStarCount);
        for (let i = 0; i < midStarCount; i++) {
            midStarPositions[i * 3] = (Math.random() - 0.5) * 2000;
            midStarPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            midStarPositions[i * 3 + 2] = Math.random() * -2000;
            midStarSpeeds[i] = (Math.random() * 3 + 2) * starSpeedMult;
            midTwinklePhase[i] = Math.random() * Math.PI * 2;
            midStarBaseSizes[i] = 0.8 + Math.random() * 0.8;
        }
        midStarGeo.setAttribute('position', new THREE.BufferAttribute(midStarPositions, 3));
        const midStarMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.2,
            transparent: true,
            opacity: 0.8,
            depthWrite: false
        });
        const midStars = new THREE.Points(midStarGeo, midStarMat);
        midStars.renderOrder = -2;
        scene.add(midStars);

        // Constellations (Phase 9)
        const MAX_LINES = 1000;
        const CONSTELLATION_NODES = Math.min(midStarCount, prefersReducedMotion ? 0 : 250);
        const constellationGeo = new THREE.BufferGeometry();
        const constellationPositions = new Float32Array(MAX_LINES * 2 * 3); 
        const constellationColors = new Float32Array(MAX_LINES * 2 * 3);
        constellationGeo.setAttribute('position', new THREE.BufferAttribute(constellationPositions, 3));
        constellationGeo.setAttribute('color', new THREE.BufferAttribute(constellationColors, 3));
        const constellationMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const constellationLines = new THREE.LineSegments(constellationGeo, constellationMat);
        constellationLines.renderOrder = -1;
        if (!prefersReducedMotion) {
            scene.add(constellationLines);
        }

        // Layer 3: Near — narrow forward cone, larger, faster, sparser
        const nearStarCount = isLowEnd ? 150 : 300;
        const nearStarGeo = new THREE.BufferGeometry();
        const nearStarPositions = new Float32Array(nearStarCount * 3);
        const nearStarSpeeds = new Float32Array(nearStarCount);
        for (let i = 0; i < nearStarCount; i++) {
            nearStarPositions[i * 3] = (Math.random() - 0.5) * 600;
            nearStarPositions[i * 3 + 1] = (Math.random() - 0.5) * 600;
            nearStarPositions[i * 3 + 2] = Math.random() * -1500;
            nearStarSpeeds[i] = (Math.random() * 5 + 5) * starSpeedMult;
        }
        nearStarGeo.setAttribute('position', new THREE.BufferAttribute(nearStarPositions, 3));
        const nearStarMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2.5,
            transparent: true,
            opacity: 1.0,
            depthWrite: false
        });
        const nearStars = new THREE.Points(nearStarGeo, nearStarMat);
        nearStars.renderOrder = -1;
        scene.add(nearStars);

        // --- Environment Object Pools (Asteroids & Nebulae) ---
        // Shared geometries and materials — allocated once, reused by all pool members
        const sharedAsteroidGeo = new THREE.PlaneGeometry(1, 1);
        const sharedAsteroidMat = new THREE.MeshBasicMaterial({
            map: cachedLoad("/interstellar/asteroids.png"),
            transparent: true,
            depthWrite: true, // Write depth for solid feel
            alphaTest: 0.5, // High cut for crisp edges
            side: THREE.DoubleSide
        });
        const sharedNebulaGeo = new THREE.PlaneGeometry(1, 1);
        const sharedNebulaMat = new THREE.MeshBasicMaterial({
            map: cachedLoad("/interstellar/cosmic_dust.png"),
            transparent: true,
            opacity: 0.12,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const ASTEROID_POOL_SIZE = 20;
        const NEBULA_POOL_SIZE = 20; // Increased for volumetric nebula (2-3 planes per spawn)
        const asteroidPool: THREE.Mesh[] = [];
        const nebulaPool: THREE.Mesh[] = [];

        for (let i = 0; i < ASTEROID_POOL_SIZE; i++) {
            asteroidPool.push(new THREE.Mesh(sharedAsteroidGeo, sharedAsteroidMat));
        }
        for (let i = 0; i < NEBULA_POOL_SIZE; i++) {
            nebulaPool.push(new THREE.Mesh(sharedNebulaGeo, sharedNebulaMat));
        }

        const activeEnvironment: { meshes: THREE.Mesh[]; type: string; speed: number; rotX: number; rotY: number }[] = [];

        const spawnEnvironment = (type: "asteroid" | "nebula") => {
            const pool = type === "asteroid" ? asteroidPool : nebulaPool;
            if (pool.length === 0) return; // No available meshes — skip this spawn

            if (type === "asteroid") {
                const mesh = pool.pop()!;
                const size = 2 + Math.random() * 5;
                mesh.scale.set(size, size, 1);
                mesh.renderOrder = 2;
                const dist = 70 + Math.random() * 150;
                const angle = Math.random() * Math.PI * 2;
                mesh.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, -1400);
                mesh.rotation.set(0, 0, Math.random() * Math.PI);
                scene.add(mesh);
                activeEnvironment.push({
                    meshes: [mesh],
                    type,
                    speed: 8 + Math.random() * 8,
                    rotX: Math.random() * 0.03,
                    rotY: Math.random() * 0.03
                });
            } else {
                // Volumetric nebula: spawn 2–3 planes at staggered depths
                const layerCount = 2 + (Math.random() > 0.5 ? 1 : 0);
                if (pool.length < layerCount) return; // Not enough in pool
                const meshes: THREE.Mesh[] = [];
                const baseSize = 200 + Math.random() * 300;
                const dist = 70 + Math.random() * 150;
                const angle = Math.random() * Math.PI * 2;
                const baseX = Math.cos(angle) * dist;
                const baseY = Math.sin(angle) * dist;
                const baseZ = -1400;

                for (let layer = 0; layer < layerCount; layer++) {
                    const mesh = pool.pop()!;
                    const sizeVariation = baseSize * (0.8 + Math.random() * 0.4);
                    mesh.scale.set(sizeVariation, sizeVariation, 1);
                    mesh.renderOrder = 1;
                    const zOffset = (layer - 1) * (60 + Math.random() * 90);
                    mesh.position.set(
                        baseX + (Math.random() - 0.5) * 40,
                        baseY + (Math.random() - 0.5) * 40,
                        baseZ + zOffset
                    );
                    mesh.rotation.set(0, 0, Math.random() * Math.PI * 2);
                    scene.add(mesh);
                    meshes.push(mesh);
                }
                activeEnvironment.push({
                    meshes,
                    type,
                    speed: 3 + Math.random() * 3,
                    rotX: Math.random() * 0.03,
                    rotY: Math.random() * 0.03
                });
            }
        };

        // --- Celestial Objects (Planets & Ships) ---
        const activeObjects: { 
            mesh: THREE.Group; 
            speed: number; 
            driftX: number; 
            driftY: number; 
            phaseX: number;
            phaseY: number;
            ampX: number;
            ampY: number;
            trail: THREE.Points | null 
        }[] = [];
        const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

        // Geometry cache for celestial objects — keyed by descriptor, shared across instances
        const celestialGeoCache = new Map<string, THREE.BufferGeometry>();
        const getCachedGeo = (key: string, factory: () => THREE.BufferGeometry): THREE.BufferGeometry => {
            if (celestialGeoCache.has(key)) return celestialGeoCache.get(key)!;
            const geo = factory();
            celestialGeoCache.set(key, geo);
            return geo;
        };

        const spawnCelestial = () => {
            const data = CELESTIAL_OBJECTS[Math.floor(Math.random() * CELESTIAL_OBJECTS.length)];

            // Get texture from cache, clone for per-instance UV offsets
            const baseTexture = cachedLoad(data.image);
            const texture = baseTexture.clone();
            texture.needsUpdate = true;
            // Texture Filtering for crisp pixel art or smooth high-res
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = maxAnisotropy;

            const group = new THREE.Group();
            let mesh: THREE.Mesh;

            if (data.type === "planet") {
                const geoKey = `sphere-${data.radius || 5}`;
                const geometry = getCachedGeo(geoKey, () => new THREE.SphereGeometry(data.radius || 5, SEG, SEG));
                const material = new THREE.MeshStandardMaterial({
                    map: texture,
                    roughness: 0.6,
                    metalness: 0.3,
                    emissive: new THREE.Color(0x222222), // Stronger internal light
                    emissiveMap: texture,
                    emissiveIntensity: 0.2
                });
                mesh = new THREE.Mesh(geometry, material);

                if (data.bgPos) {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.offset.set(0.5, 0);
                    texture.repeat.set(0.5, 1);
                }
            } else {
                // Ships
                if (data.bgSize && data.bgPos) {
                    const widthPerc = parseFloat(data.bgSize);
                    const heightPerc = parseFloat(data.bgSize.split(" ")[1]) || 100;
                    texture.repeat.set(100 / widthPerc, 100 / heightPerc);
                    const xOffset = parseFloat(data.bgPos);
                    const yOffset = parseFloat(data.bgPos.split(" ")[1]) || 0;
                    texture.offset.set(xOffset / 100, (100 - yOffset - (100 / (100 / heightPerc))) / 100);
                }
                const geoKey = `plane-${data.size![0]}-${data.size![1]}`;
                const geometry = getCachedGeo(geoKey, () => new THREE.PlaneGeometry(data.size![0], data.size![1]));

                // HIGH FIDELITY MATERIAL SETTINGS
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    alphaTest: 0.6, // AGGRESSIVE CUT to remove square borders
                    side: THREE.DoubleSide,
                    depthWrite: true, // Shadows & Occlusion correct
                });
                mesh = new THREE.Mesh(geometry, material);
            }

            group.add(mesh);
            group.renderOrder = 10; // Absoluate Foreground

            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * 40; // Closer trajectory
            group.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, -900);

            // Random initial rotation for ships to look dynamic
            if (data.type !== "planet") {
                group.rotation.z = (Math.random() - 0.5) * 0.5;
                group.rotation.x = (Math.random() - 0.5) * 0.5;
            }

            scene.add(group);

            // Create particle trail for ships
            let trail: THREE.Points | null = null;
            if (data.type === 'ship') {
                const TRAIL_COUNT = 10;
                const trailGeo = new THREE.BufferGeometry();
                const trailPositions = new Float32Array(TRAIL_COUNT * 3);
                const trailOpacities = new Float32Array(TRAIL_COUNT);
                // Initialize all particles at the ship's position
                for (let t = 0; t < TRAIL_COUNT; t++) {
                    trailPositions[t * 3] = group.position.x;
                    trailPositions[t * 3 + 1] = group.position.y;
                    trailPositions[t * 3 + 2] = group.position.z;
                    trailOpacities[t] = 0;
                }
                trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
                const trailMat = new THREE.PointsMaterial({
                    color: 0x88ccff,
                    size: 1.5,
                    transparent: true,
                    opacity: 0.4,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                });
                trail = new THREE.Points(trailGeo, trailMat);
                trail.renderOrder = 9;
                scene.add(trail);
            }

            activeObjects.push({
                mesh: group,
                speed: 3.5 + Math.random() * 2.5, // Faster
                driftX: (group.position.x / 100) * 0.2, // Tighter drift
                driftY: (group.position.y / 100) * 0.2,
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
                ampX: 0.5 + Math.random() * 1.5,
                ampY: 0.5 + Math.random() * 1.5,
                trail,
            });
        };

        // --- Dispose Helper (for non-pooled celestial objects) ---
        const disposeCelestialGroup = (obj: THREE.Object3D) => {
            obj.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    // Geometry is shared via celestialGeoCache — do NOT dispose it here
                    // Dispose per-instance material and cloned textures
                    const materials = Array.isArray(child.material) ? child.material : [child.material];
                    for (const mat of materials) {
                        for (const prop of ['map', 'emissiveMap'] as const) {
                            const tex = (mat as any)[prop] as THREE.Texture | undefined;
                            if (tex) {
                                // Only dispose clones, not originals from cache
                                let isCached = false;
                                for (const ct of textureCache.values()) {
                                    if (tex === ct) { isCached = true; break; }
                                }
                                if (!isCached) tex.dispose();
                            }
                        }
                        mat.dispose();
                    }
                }
            });
        };

        camera.position.z = 100;

        // --- Visibility Change Handler ---
        // Pause spawn timers when tab is hidden to save battery
        let isPaused = false;
        const handleVisibility = () => { isPaused = document.hidden; };
        document.addEventListener('visibilitychange', handleVisibility);

        // --- Spawn Intervals (adjusted for performance + reduced motion) ---
        const CELESTIAL_INTERVAL = 800 * perfMult * motionMult;
        const ENV_INTERVAL = 2000 * perfMult * motionMult;
        const HERO_INTERVAL = 12000 * motionMult;

        // --- Camera Roving (reduced amplitude for reduced motion) ---
        const cameraAmplitude = prefersReducedMotion ? 1.6 : 8;
        const galaxyRotSpeed = prefersReducedMotion ? 0.00004 : 0.0002;

        // --- Animation Loop ---
        let animationFrameId: number;
        let lastTime = 0;
        let lastSpawn = 0;
        let lastEnvSpawn = 0;
        let lastHeroSpawn = 0;

        const animate = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;

            // Skip expensive updates when tab is hidden
            if (isPaused) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            // --- Galaxy Cycle Logic ---
            galaxyTimer += delta;

            galaxy.rotation.z += galaxyRotSpeed;

            // Roving
            galaxy.position.x = Math.sin(time * 0.0002) * 50;
            galaxy.position.y = Math.cos(time * 0.00015) * 30;

            // Animate Distant Giants — slow sinusoidal drift, no rotation
            for (const giant of distantGiants) {
                giant.mesh.position.x = giant.baseX + Math.sin(time * giant.driftFreqX) * giant.driftAmpX;
                giant.mesh.position.y = giant.baseY + Math.cos(time * giant.driftFreqY) * giant.driftAmpY;
            }

            // Subtle bloom breathing based on scroll
            bloomPass.strength = 0.4 + (scrollProgress * 0.15);

            // Target max opacity dims as you scroll down
            const targetMaxOpacity = Math.max(0.15, 0.6 - (scrollProgress * 0.45));

            switch (galaxyState) {
                case 'FADE_IN':
                    if (galaxyMaterial.opacity < targetMaxOpacity) {
                        galaxyMaterial.opacity += delta / FADE_DURATION * 0.6; 
                    } else {
                        galaxyMaterial.opacity = targetMaxOpacity;
                        galaxyState = 'VISIBLE';
                        galaxyTimer = 0;
                    }
                    break;
                case 'VISIBLE':
                    galaxyMaterial.opacity = targetMaxOpacity;
                    if (galaxyTimer > VISIBLE_DURATION) {
                        galaxyState = 'FADE_OUT';
                    }
                    break;
                case 'FADE_OUT':
                    if (galaxyMaterial.opacity > 0) {
                        galaxyMaterial.opacity -= delta / FADE_DURATION * 0.6; 
                    } else {
                        galaxyMaterial.opacity = 0;
                        galaxyState = 'SWAP';
                    }
                    break;
                case 'SWAP':
                    galaxyIndex = (galaxyIndex + 1) % galaxyTextures.length;
                    galaxyMaterial.map = galaxyTextures[galaxyIndex];
                    // Reset or change rotation slightly for variety
                    galaxy.rotation.z = Math.random() * Math.PI;
                    galaxyState = 'FADE_IN';
                    break;
            }

            // 2. Camera Roving + Mouse Parallax
            // Lerp mouse position for smooth feel
            mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.05;
            mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.05;

            // Scroll bias: push camera down slightly as we scroll down the page
            const scrollBiasY = scrollProgress * 20;

            camera.position.x = Math.sin(time * 0.0005) * cameraAmplitude + mouseCurrent.x * parallaxStrength;
            camera.position.y = Math.cos(time * 0.0003) * cameraAmplitude - mouseCurrent.y * parallaxStrength - scrollBiasY;
            camera.lookAt(0, -scrollBiasY * 0.5, -600);

            // 3. Move Stars — three layers with twinkle
            // Distant layer: spherically distributed, very slow, with twinkle
            const distPos = distantStarGeo.attributes.position.array as Float32Array;
            if (!prefersReducedMotion) {
                for (let i = 0; i < distantStarCount; i++) {
                    distPos[i * 3 + 2] += distantStarSpeeds[i] * (delta / 16);
                    // Re-randomize when drifted too far forward
                    if (distPos[i * 3 + 2] > 200) {
                        const theta = Math.random() * Math.PI * 2;
                        const phi = Math.acos(2 * Math.random() - 1);
                        const r = 800 + Math.random() * 1200;
                        distPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                        distPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                        distPos[i * 3 + 2] = r * Math.cos(phi) - 600;
                    }
                }
                // Twinkle: oscillate the material opacity subtly
                distantStarMat.opacity = 0.35 + 0.1 * Math.sin(time * 0.001);
            }
            distantStarGeo.attributes.position.needsUpdate = true;

            // Mid layer: forward-biased box, standard speed, with subtle twinkle
            const midPos = midStarGeo.attributes.position.array as Float32Array;
            for (let i = 0; i < midStarCount; i++) {
                midPos[i * 3 + 2] += midStarSpeeds[i] * (delta / 16);
                if (midPos[i * 3 + 2] > 150) {
                    midPos[i * 3 + 2] = -1500;
                    midPos[i * 3] = (Math.random() - 0.5) * 2000;
                    midPos[i * 3 + 1] = (Math.random() - 0.5) * 2000;
                }
            }
            midStarGeo.attributes.position.needsUpdate = true;
            if (!prefersReducedMotion) {
                midStarMat.opacity = 0.75 + 0.1 * Math.sin(time * 0.0015 + 1.0);
            }

            // Near layer: narrow cone, fast streakers
            const nearPos = nearStarGeo.attributes.position.array as Float32Array;
            for (let i = 0; i < nearStarCount; i++) {
                nearPos[i * 3 + 2] += nearStarSpeeds[i] * (delta / 16);
                if (nearPos[i * 3 + 2] > 200) {
                    nearPos[i * 3 + 2] = -1200;
                    nearPos[i * 3] = (Math.random() - 0.5) * 600;
                    nearPos[i * 3 + 1] = (Math.random() - 0.5) * 600;
                }
            }
            nearStarGeo.attributes.position.needsUpdate = true;

            // Constellation network updates
            if (!prefersReducedMotion && CONSTELLATION_NODES > 0) {
                let lineIndex = 0;
                const maxDistSq = 200 * 200;
                // Only check a subset of mid stars for constellations
                for (let i = 0; i < CONSTELLATION_NODES; i++) {
                    const idx1 = i * 3;
                    const x1 = midPos[idx1], y1 = midPos[idx1 + 1], z1 = midPos[idx1 + 2];
                    
                    for (let j = i + 1; j < CONSTELLATION_NODES; j++) {
                        const idx2 = j * 3;
                        const x2 = midPos[idx2], y2 = midPos[idx2 + 1], z2 = midPos[idx2 + 2];
                        
                        const dx = x2 - x1;
                        const dy = y2 - y1;
                        const dz = z2 - z1;
                        const distSq = dx*dx + dy*dy + dz*dz;
                        
                        if (distSq < maxDistSq && lineIndex < MAX_LINES) {
                            const alpha = 1.0 - (distSq / maxDistSq);
                            
                            const pIdx = lineIndex * 6;
                            constellationPositions[pIdx] = x1;
                            constellationPositions[pIdx+1] = y1;
                            constellationPositions[pIdx+2] = z1;
                            constellationPositions[pIdx+3] = x2;
                            constellationPositions[pIdx+4] = y2;
                            constellationPositions[pIdx+5] = z2;
                            
                            const colorVal = 0.5 * alpha;
                            constellationColors[pIdx] = colorVal * 0.5;
                            constellationColors[pIdx+1] = colorVal * 0.8;
                            constellationColors[pIdx+2] = colorVal;
                            constellationColors[pIdx+3] = colorVal * 0.5;
                            constellationColors[pIdx+4] = colorVal * 0.8;
                            constellationColors[pIdx+5] = colorVal;
                            
                            lineIndex++;
                        }
                    }
                }
                constellationGeo.setDrawRange(0, lineIndex * 2);
                constellationGeo.attributes.position.needsUpdate = true;
                constellationGeo.attributes.color.needsUpdate = true;
            }

            // 4. Hero Objects Logic
            if (time - lastHeroSpawn > HERO_INTERVAL) {
                spawnHero();
                lastHeroSpawn = time;
            }

            for (let i = activeHeroes.length - 1; i >= 0; i--) {
                const obj = activeHeroes[i];
                obj.group.position.z += obj.speed * (delta / 16); // Standardized speed

                if (obj.isOrbital) {
                    obj.orbitAngle += obj.orbitSpeed * (delta / 16);
                    obj.group.position.x = obj.orbitCenterX + Math.cos(obj.orbitAngle) * obj.orbitRadiusX;
                    obj.group.position.y = obj.orbitCenterY + Math.sin(obj.orbitAngle) * obj.orbitRadiusY;
                }

                // Detailed Rotation
                obj.group.rotation.y += obj.rotSpeed.y;
                obj.group.rotation.x += obj.rotSpeed.x;

                // Special rotation for Station Ring
                if (obj.type === 'station') {
                    obj.group.children.forEach(child => {
                        if (child.userData.isRotator) {
                            child.rotation.z += 0.005; // Spin gravity ring
                        }
                    });
                }

                if (obj.group.position.z > 300) {
                    scene.remove(obj.group);
                    // Return to pool instead of discarding
                    heroPool.get(obj.type)!.push(obj.group);
                    activeHeroes.splice(i, 1);
                }
            }

            // 5. Normal Environment & Celestial Logic
            if (time - lastSpawn > CELESTIAL_INTERVAL) {
                spawnCelestial();
                lastSpawn = time;
            }
            if (time - lastEnvSpawn > ENV_INTERVAL) {
                spawnEnvironment(Math.random() < 0.7 ? "asteroid" : "nebula");
                lastEnvSpawn = time;
            }

            // Update Environment (pooled — return to pool on removal)
            for (let i = activeEnvironment.length - 1; i >= 0; i--) {
                const obj = activeEnvironment[i];
                // Move all meshes in the group
                for (const mesh of obj.meshes) {
                    mesh.position.z += obj.speed * (delta / 16);
                    mesh.rotation.z += obj.rotX;
                    mesh.rotation.x += obj.rotY;
                }

                // Check removal based on first mesh
                if (obj.meshes[0].position.z > 200) {
                    for (const mesh of obj.meshes) {
                        scene.remove(mesh);
                        if (obj.type === "asteroid") asteroidPool.push(mesh);
                        else nebulaPool.push(mesh);
                    }
                    activeEnvironment.splice(i, 1);
                }
            }

            // Update Foreground Celestial (dispose materials + cloned textures on removal)
            for (let i = activeObjects.length - 1; i >= 0; i--) {
                const obj = activeObjects[i];
                obj.phaseX += 0.01 * (delta / 16);
                obj.phaseY += 0.012 * (delta / 16);
                obj.mesh.position.z += obj.speed * (delta / 16);
                obj.mesh.position.x += obj.driftX + Math.cos(obj.phaseX) * obj.ampX * (delta / 16);
                obj.mesh.position.y += obj.driftY + Math.sin(obj.phaseY) * obj.ampY * (delta / 16);

                // Update particle trail
                if (obj.trail) {
                    const tPos = obj.trail.geometry.attributes.position.array as Float32Array;
                    const TRAIL_COUNT = tPos.length / 3;
                    // Shift trail particles back (oldest first)
                    for (let t = TRAIL_COUNT - 1; t > 0; t--) {
                        tPos[t * 3] = tPos[(t - 1) * 3];
                        tPos[t * 3 + 1] = tPos[(t - 1) * 3 + 1];
                        tPos[t * 3 + 2] = tPos[(t - 1) * 3 + 2];
                    }
                    // Newest particle at ship's current position
                    tPos[0] = obj.mesh.position.x;
                    tPos[1] = obj.mesh.position.y;
                    tPos[2] = obj.mesh.position.z;
                    obj.trail.geometry.attributes.position.needsUpdate = true;
                }

                if (obj.mesh.position.z > 200) {
                    scene.remove(obj.mesh);
                    disposeCelestialGroup(obj.mesh);
                    // Remove trail
                    if (obj.trail) {
                        scene.remove(obj.trail);
                        obj.trail.geometry.dispose();
                        (obj.trail.material as THREE.Material).dispose();
                    }
                    activeObjects.splice(i, 1);
                }
            }

            composer.render();
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            composer.setSize(w, h);
        };

        window.addEventListener("resize", handleResize);
        animate(0);

        return () => {
            // --- Comprehensive Cleanup ---
            window.removeEventListener("resize", handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('visibilitychange', handleVisibility);
            cancelAnimationFrame(animationFrameId);

            // Dispose active celestial objects (materials + cloned textures + trails)
            for (const obj of activeObjects) {
                scene.remove(obj.mesh);
                disposeCelestialGroup(obj.mesh);
                if (obj.trail) {
                    scene.remove(obj.trail);
                    obj.trail.geometry.dispose();
                    (obj.trail.material as THREE.Material).dispose();
                }
            }

            // Remove active environment from scene (pooled — no dispose needed)
            for (const obj of activeEnvironment) {
                for (const mesh of obj.meshes) {
                    scene.remove(mesh);
                }
            }

            // Remove active heroes from scene (pooled — materials disposed below)
            for (const obj of activeHeroes) {
                scene.remove(obj.group);
            }

            // Dispose hero pool materials (geometries are shared — disposed separately)
            const disposeHeroMats = (group: THREE.Group) => {
                group.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        const mats = Array.isArray(child.material) ? child.material : [child.material];
                        mats.forEach(m => m.dispose());
                    }
                });
            };
            for (const [, pool] of heroPool) {
                for (const group of pool) disposeHeroMats(group);
            }
            for (const hero of activeHeroes) {
                disposeHeroMats(hero.group);
            }

            // Dispose shared hero geometries
            for (const geo of Object.values(heroGeometries)) {
                geo.dispose();
            }

            // Dispose environment pool geometries & materials
            sharedAsteroidGeo.dispose();
            sharedAsteroidMat.dispose();
            sharedNebulaGeo.dispose();
            sharedNebulaMat.dispose();

            // Dispose celestial geometry cache
            for (const geo of celestialGeoCache.values()) {
                geo.dispose();
            }

            // Dispose galaxy
            galaxyGeometry.dispose();
            galaxyMaterial.dispose();

            // Dispose distant giants
            for (const giant of distantGiants) {
                scene.remove(giant.mesh);
                giant.mesh.geometry.dispose();
                (giant.mesh.material as THREE.Material).dispose();
            }

            // Dispose stars — three layers
            distantStarGeo.dispose();
            distantStarMat.dispose();
            midStarGeo.dispose();
            midStarMat.dispose();
            nearStarGeo.dispose();
            nearStarMat.dispose();
            constellationGeo.dispose();
            constellationMat.dispose();

            // Dispose post-processing
            composer.dispose();

            // Dispose env map
            envMap.dispose();

            // Dispose all cached textures
            for (const tex of textureCache.values()) {
                tex.dispose();
            }

            // Remove renderer DOM element
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            
            // Clean up event listeners
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden bg-black">
            <div ref={containerRef} className="absolute inset-0 z-0" />

            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                {blockchainPlatforms.map((platform, index) => (
                    <FloatingText key={index} text={platform} index={index} />
                ))}
            </div>

            <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-900/15 via-transparent to-black/70 pointer-events-none" />
        </div>
    );
};

const FloatingText = ({ text, index }: { text: string; index: number }) => {
    const randomX = useMemo(() => Math.random() * 100, []);
    const randomY = useMemo(() => Math.random() * 100, []);
    const duration = useMemo(() => Math.random() * 25 + 20, []);
    const delay = useMemo(() => Math.random() * 15, []);

    return (
        <motion.div
            className="absolute text-cyan-400/25 text-xs md:text-sm font-mono whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%" }}
            animate={{
                opacity: [0, 0.4, 0],
                scale: [0.5, 2.5, 6],
                left: [`${randomX}%`, `${randomX + (randomX - 50) * 1.8}%`],
                top: [`${randomY}%`, `${randomY + (randomY - 50) * 1.8}%`],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "linear",
            }}
            style={{
                position: 'absolute',
                left: `${randomX}%`,
                top: `${randomY}%`,
                pointerEvents: 'none',
            }}
        >
            {text}
        </motion.div>
    );
};

export default InterstellarBackground;
