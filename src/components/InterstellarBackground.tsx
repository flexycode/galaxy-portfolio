import React, { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
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

        const width = window.innerWidth;
        const height = window.innerHeight;

        // --- Core Three.js Setup ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 3000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 2.5);
        pointLight.position.set(50, 50, 50);
        scene.add(pointLight);

        const loader = new THREE.TextureLoader();

        // --- Galaxy Cycle System ---
        const galaxyTextures = [
            loader.load("/interstellar/galaxy_blue.png"),
            loader.load("/interstellar/galaxy_gold.png"),
            loader.load("/interstellar/galaxy_purple.png"),
            loader.load("/interstellar/galaxy_red.png")
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

        // Cycle State
        let galaxyIndex = 0;
        let galaxyState: 'FADE_IN' | 'VISIBLE' | 'FADE_OUT' | 'SWAP' = 'FADE_IN';
        let galaxyTimer = 0;
        const FADE_DURATION = 3000; // 3s fade
        const VISIBLE_DURATION = 15000; // 15s hold

        // --- HERO OBJECTS (Saturn, Sun, Station) ---
        const heroTextures = {
            saturn: loader.load("/interstellar/saturn_surface.png"),
            saturnRing: loader.load("/interstellar/saturn_rings.png"),
            sun: loader.load("/interstellar/sun_surface.png"),
            proxima: loader.load("/interstellar/proxima_surface.png"),
            alien: loader.load("/interstellar/alien_surface.png"),
            station: loader.load("/interstellar/station_hull.png"),
        };

        const activeHeroes: { group: THREE.Group; type: string; speed: number; rotSpeed: { x: number, y: number, z: number } }[] = [];

        const spawnHero = () => {
            // 10% Sun, 20% Saturn, 20% Station, 50% Planet
            const rand = Math.random();
            const type = rand < 0.1 ? 'sun' : rand < 0.3 ? 'saturn' : rand < 0.5 ? 'station' : rand < 0.75 ? 'proxima' : 'alien';

            const group = new THREE.Group();
            let body: THREE.Mesh;

            if (type === 'saturn') {
                // Body
                const geometry = new THREE.SphereGeometry(18, 64, 64);
                const material = new THREE.MeshStandardMaterial({ map: heroTextures.saturn, roughness: 0.8 });
                body = new THREE.Mesh(geometry, material);
                group.add(body);

                // Rings
                const ringGeo = new THREE.RingGeometry(22, 38, 64);
                const ringMat = new THREE.MeshBasicMaterial({
                    map: heroTextures.saturnRing,
                    transparent: true,
                    side: THREE.DoubleSide,
                    opacity: 0.9
                });
                // Fix UV mapping for RingGeometry to properly map the texture radially
                const pos = ringGeo.attributes.position;
                const uv = ringGeo.attributes.uv;
                for (let i = 0; i < pos.count; i++) {
                    const x = pos.getX(i);
                    const y = pos.getY(i);
                    const d = Math.sqrt(x * x + y * y); // distance from center
                    // Map distance to V, Angle to U
                    // Simple planar mapping is often default, but for rings we want the texture to wrap
                    // Actually, RingGeometry defaults to planar UVs. 
                    // Since our texture is a full circle top-down, default UVs should map perfectly if we just rotate mesh.
                }
                const ring = new THREE.Mesh(ringGeo, ringMat);
                ring.rotation.x = Math.PI / 2; // Flat
                ring.rotation.y = -Math.PI / 8; // Tilt
                group.add(ring);
                // Tilt the whole planet slightly
                group.rotation.z = Math.PI / 6;

            } else if (type === 'sun') {
                const geometry = new THREE.SphereGeometry(45, 64, 64); // Massive
                const material = new THREE.MeshBasicMaterial({
                    map: heroTextures.sun,
                    // emissive: new THREE.Color(0xffaa00), 
                    // emissiveIntensity: 2.0 
                });
                body = new THREE.Mesh(geometry, material);

                // Glow Halo
                const haloGeo = new THREE.PlaneGeometry(140, 140);
                const haloMat = new THREE.MeshBasicMaterial({
                    map: loader.load("/interstellar/cosmic_dust.png"), // Revert to dust for glow
                    transparent: true,
                    opacity: 0.6,
                    color: 0xffaa00,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });
                const halo = new THREE.Mesh(haloGeo, haloMat);
                halo.renderOrder = -1; // Behind sun
                group.add(halo);

                group.add(body);

            } else if (type === 'station') {
                // Central Hull
                const hullGeo = new THREE.CylinderGeometry(4, 4, 35, 32);
                const hullMat = new THREE.MeshStandardMaterial({
                    map: heroTextures.station,
                    metalness: 0.8,
                    roughness: 0.3
                });
                body = new THREE.Mesh(hullGeo, hullMat);
                body.rotation.z = Math.PI / 2; // Horizontal
                group.add(body);

                // Gravity Ring
                const ringGeo = new THREE.TorusGeometry(12, 2, 16, 100);
                const ringMat = new THREE.MeshStandardMaterial({
                    map: heroTextures.station,
                    metalness: 0.7,
                    roughness: 0.4
                });
                const ring = new THREE.Mesh(ringGeo, ringMat);
                // Ring rotates around the cylinder axis
                ring.userData = { isRotator: true };
                group.add(ring);

            } else {
                // Planets (Proxima / Alien)
                const geometry = new THREE.SphereGeometry(12, 64, 64);
                const material = new THREE.MeshStandardMaterial({
                    map: type === 'proxima' ? heroTextures.proxima : heroTextures.alien,
                    roughness: 0.6,
                    metalness: 0.1,
                    emissive: type === 'alien' ? new THREE.Color(0x0044ff) : new THREE.Color(0x000000),
                    emissiveIntensity: 0.2
                });
                body = new THREE.Mesh(geometry, material);
                group.add(body);
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
                }
            });
        };


        // --- Starfield ---
        const starCount = 5000; // Increased count
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starSpeeds = new Float32Array(starCount);
        for (let i = 0; i < starCount; i++) {
            starPositions[i * 3] = (Math.random() - 0.5) * 2000;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            starPositions[i * 3 + 2] = Math.random() * -2000;
            starSpeeds[i] = Math.random() * 3 + 2; // Faster stars
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.2, // Slightly larger
            transparent: true,
            opacity: 0.9,
            depthWrite: false
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        stars.renderOrder = -1;
        scene.add(stars);

        // --- Environmental Pool (Asteroids & Nebulae) ---
        const activeEnvironment: { mesh: THREE.Mesh; type: string; speed: number; rotX: number; rotY: number }[] = [];
        const asteroidTexture = loader.load("/interstellar/asteroids.png");
        const dustTexture = loader.load("/interstellar/cosmic_dust.png");

        const spawnEnvironment = (type: "asteroid" | "nebula") => {
            let mesh: THREE.Mesh;
            let speed: number;

            if (type === "asteroid") {
                const size = 2 + Math.random() * 5;
                mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(size, size),
                    new THREE.MeshBasicMaterial({
                        map: asteroidTexture,
                        transparent: true,
                        depthWrite: true, // Write depth for solid feel
                        alphaTest: 0.5, // High cut for crisp edges
                        side: THREE.DoubleSide
                    })
                );
                speed = 8 + Math.random() * 8;
                mesh.renderOrder = 2;
            } else {
                const size = 200 + Math.random() * 300;
                mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(size, size),
                    new THREE.MeshBasicMaterial({
                        map: dustTexture,
                        transparent: true,
                        opacity: 0.12,
                        depthWrite: false,
                        blending: THREE.AdditiveBlending
                    })
                );
                speed = 3 + Math.random() * 3;
                mesh.renderOrder = 1;
            }

            const dist = 70 + Math.random() * 150;
            const angle = Math.random() * Math.PI * 2;
            mesh.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, -1400);
            mesh.rotation.z = Math.random() * Math.PI;

            scene.add(mesh);
            activeEnvironment.push({ mesh, type, speed, rotX: Math.random() * 0.03, rotY: Math.random() * 0.03 });
        };

        // --- Celestial Objects Pool (Planets & ships) ---
        const activeObjects: { mesh: THREE.Group; speed: number; driftX: number; driftY: number }[] = [];

        const spawnCelestial = () => {
            const data = CELESTIAL_OBJECTS[Math.floor(Math.random() * CELESTIAL_OBJECTS.length)];
            const texture = loader.load(data.image);
            // Texture Filtering for crisp pixel art or smooth high-res
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

            const group = new THREE.Group();
            let mesh: THREE.Mesh;

            if (data.type === "planet") {
                const geometry = new THREE.SphereGeometry(data.radius || 5, 128, 128); // Higher poly for smoothness
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
                const geometry = new THREE.PlaneGeometry(data.size![0], data.size![1]);

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
            activeObjects.push({
                mesh: group,
                speed: 3.5 + Math.random() * 2.5, // Faster
                driftX: (group.position.x / 100) * 0.2, // Tighter drift
                driftY: (group.position.y / 100) * 0.2
            });
        };

        camera.position.z = 100;

        // --- Animation Loop ---
        let animationFrameId: number;
        let lastTime = 0;
        let lastSpawn = 0;
        let lastEnvSpawn = 0;
        let lastHeroSpawn = 0;

        const animate = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;

            // --- Galaxy Cycle Logic ---
            galaxyTimer += delta;

            galaxy.rotation.z += 0.0002;

            // Roving
            galaxy.position.x = Math.sin(time * 0.0002) * 50;
            galaxy.position.y = Math.cos(time * 0.00015) * 30;

            switch (galaxyState) {
                case 'FADE_IN':
                    if (galaxyMaterial.opacity < 0.6) {
                        galaxyMaterial.opacity += delta / FADE_DURATION * 0.6; // Fade to 0.6
                    } else {
                        galaxyMaterial.opacity = 0.6;
                        galaxyState = 'VISIBLE';
                        galaxyTimer = 0;
                    }
                    break;
                case 'VISIBLE':
                    if (galaxyTimer > VISIBLE_DURATION) {
                        galaxyState = 'FADE_OUT';
                    }
                    break;
                case 'FADE_OUT':
                    if (galaxyMaterial.opacity > 0) {
                        galaxyMaterial.opacity -= delta / FADE_DURATION * 0.6; // Fade from 0.6 to 0
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

            // 2. Camera Roving
            camera.position.x = Math.sin(time * 0.0005) * 8;
            camera.position.y = Math.cos(time * 0.0003) * 8;
            camera.lookAt(0, 0, -600);

            // 3. Move Stars
            const pos = starGeometry.attributes.position.array as Float32Array;
            for (let i = 0; i < starCount; i++) {
                pos[i * 3 + 2] += starSpeeds[i] * (delta / 16); // Scale speed by delta
                if (pos[i * 3 + 2] > 150) {
                    pos[i * 3 + 2] = -1500;
                    pos[i * 3] = (Math.random() - 0.5) * 1500;
                    pos[i * 3 + 1] = (Math.random() - 0.5) * 1500;
                }
            }
            starGeometry.attributes.position.needsUpdate = true;

            // 4. Hero Objects Logic
            if (time - lastHeroSpawn > 12000) { // Spawn every 12 seconds
                spawnHero();
                lastHeroSpawn = time;
            }

            for (let i = activeHeroes.length - 1; i >= 0; i--) {
                const obj = activeHeroes[i];
                obj.group.position.z += obj.speed * (delta / 16); // Standardized speed

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
                    activeHeroes.splice(i, 1);
                }
            }

            // 5. Normal Environment & Celestial Logic
            if (time - lastSpawn > 800) {
                spawnCelestial();
                lastSpawn = time;
            }
            if (time - lastEnvSpawn > 2000) {
                spawnEnvironment(Math.random() < 0.7 ? "asteroid" : "nebula");
                lastEnvSpawn = time;
            }

            // Update Environment
            for (let i = activeEnvironment.length - 1; i >= 0; i--) {
                const obj = activeEnvironment[i];
                obj.mesh.position.z += obj.speed * (delta / 16);
                obj.mesh.rotation.z += obj.rotX;
                obj.mesh.rotation.x += obj.rotY;

                if (obj.mesh.position.z > 200) {
                    scene.remove(obj.mesh);
                    activeEnvironment.splice(i, 1);
                }
            }

            // Update Foreground Celestial
            for (let i = activeObjects.length - 1; i >= 0; i--) {
                const obj = activeObjects[i];
                obj.mesh.position.z += obj.speed * (delta / 16);
                obj.mesh.position.x += obj.driftX;
                obj.mesh.position.y += obj.driftY;

                if (obj.mesh.position.z > 200) {
                    scene.remove(obj.mesh);
                    activeObjects.splice(i, 1);
                }
            }

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        window.addEventListener("resize", handleResize);
        animate(0);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            starGeometry.dispose();
            starMaterial.dispose();
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
