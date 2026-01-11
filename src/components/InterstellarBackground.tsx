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

        // --- Distant Spiral Galaxy ---
        const galaxyTexture = loader.load("/interstellar/spiral_galaxy.png");
        const galaxyGeometry = new THREE.PlaneGeometry(800, 800);
        const galaxyMaterial = new THREE.MeshBasicMaterial({
            map: galaxyTexture,
            transparent: true,
            opacity: 0.6,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
        galaxy.position.set(200, 100, -1500);
        galaxy.rotation.x = -Math.PI / 4;
        scene.add(galaxy);

        // --- Starfield ---
        const starCount = 4000;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starSpeeds = new Float32Array(starCount);
        for (let i = 0; i < starCount; i++) {
            starPositions[i * 3] = (Math.random() - 0.5) * 1500;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1500;
            starPositions[i * 3 + 2] = Math.random() * -1500;
            starSpeeds[i] = Math.random() * 3 + 1.5;
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.9, transparent: true, opacity: 0.9, depthWrite: false });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // --- Environmental Pool (Asteroids & Nebulae) ---
        const activeEnvironment: { mesh: THREE.Mesh; type: string; speed: number; rotX: number; rotY: number }[] = [];
        const asteroidTexture = loader.load("/interstellar/asteroids.png");
        const dustTexture = loader.load("/interstellar/cosmic_dust.png");

        const spawnEnvironment = (type: "asteroid" | "nebula") => {
            let mesh: THREE.Mesh;
            let speed: number;
            if (type === "asteroid") {
                const size = 1 + Math.random() * 3;
                mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(size, size),
                    new THREE.MeshBasicMaterial({ map: asteroidTexture, transparent: true, depthWrite: false, alphaTest: 0.05 })
                );
                speed = 5 + Math.random() * 5;
            } else {
                const size = 100 + Math.random() * 200;
                mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(size, size),
                    new THREE.MeshBasicMaterial({
                        map: dustTexture,
                        transparent: true,
                        opacity: 0.1,
                        depthWrite: false,
                        blending: THREE.AdditiveBlending
                    })
                );
                speed = 2 + Math.random() * 2;
            }

            const dist = 50 + Math.random() * 150;
            const angle = Math.random() * Math.PI * 2;
            mesh.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, -1000);
            mesh.rotation.z = Math.random() * Math.PI;

            scene.add(mesh);
            activeEnvironment.push({ mesh, type, speed, rotX: Math.random() * 0.02, rotY: Math.random() * 0.02 });
        };

        // --- Celestial Objects Pool (Planets & ships) ---
        const activeObjects: { mesh: THREE.Group; speed: number; driftX: number; driftY: number }[] = [];

        const spawnCelestial = () => {
            const data = CELESTIAL_OBJECTS[Math.floor(Math.random() * CELESTIAL_OBJECTS.length)];
            const texture = loader.load(data.image);

            const group = new THREE.Group();
            let mesh: THREE.Mesh;

            if (data.type === "planet") {
                const geometry = new THREE.SphereGeometry(data.radius || 5, 64, 64);
                const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8, metalness: 0.1 });
                mesh = new THREE.Mesh(geometry, material);

                // Texture offset for specific planets in sprite sheets
                if (data.bgPos) {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.offset.set(0.5, 0); // Simplified sprite logic for 2-item sheets
                    texture.repeat.set(0.5, 1);
                }
            } else {
                if (data.bgSize && data.bgPos) {
                    const widthPerc = parseFloat(data.bgSize);
                    const heightPerc = parseFloat(data.bgSize.split(" ")[1]) || 100;
                    texture.repeat.set(100 / widthPerc, 100 / heightPerc);

                    const xOffset = parseFloat(data.bgPos);
                    const yOffset = parseFloat(data.bgPos.split(" ")[1]) || 0;
                    texture.offset.set(xOffset / 100, (100 - yOffset - (100 / (100 / heightPerc))) / 100);
                }
                const geometry = new THREE.PlaneGeometry(data.size![0], data.size![1]);
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    alphaTest: 0.1,
                    side: THREE.DoubleSide,
                    depthWrite: false
                });
                mesh = new THREE.Mesh(geometry, material);
            }

            group.add(mesh);
            const angle = Math.random() * Math.PI * 2;
            const dist = 40 + Math.random() * 60;
            group.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, -800);

            scene.add(group);
            activeObjects.push({
                mesh: group,
                speed: 2 + Math.random() * 2,
                driftX: (group.position.x / 100) * 0.6,
                driftY: (group.position.y / 100) * 0.6
            });
        };

        camera.position.z = 100;

        // --- Animation Loop ---
        let animationFrameId: number;
        let lastSpawn = 0;
        let lastEnvSpawn = 0;

        const animate = (time: number) => {
            const delta = 0.016;

            // 1. Galaxy Rotation
            galaxy.rotation.z += 0.0005;

            // 2. Camera Roving (Cinematic feel)
            camera.position.x = Math.sin(time * 0.0005) * 5;
            camera.position.y = Math.cos(time * 0.0003) * 5;
            camera.lookAt(0, 0, -500);

            // 3. Move Stars
            const pos = starGeometry.attributes.position.array as Float32Array;
            for (let i = 0; i < starCount; i++) {
                pos[i * 3 + 2] += starSpeeds[i] * 3;
                if (pos[i * 3 + 2] > 150) {
                    pos[i * 3 + 2] = -1500;
                    pos[i * 3] = (Math.random() - 0.5) * 1500;
                    pos[i * 3 + 1] = (Math.random() - 0.5) * 1500;
                }
            }
            starGeometry.attributes.position.needsUpdate = true;

            // 4. Move Environmental (Asteroids/Nebulae)
            activeEnvironment.forEach((obj, idx) => {
                obj.mesh.position.z += obj.speed * 2;
                if (obj.type === "asteroid") {
                    obj.mesh.rotation.x += obj.rotX;
                    obj.mesh.rotation.y += obj.rotY;
                }
                if (obj.mesh.position.z > 150) {
                    scene.remove(obj.mesh);
                    activeEnvironment.splice(idx, 1);
                }
            });

            // 5. Move Celestial Objects (Planets/Ships)
            activeObjects.forEach((obj, idx) => {
                obj.mesh.position.z += obj.speed * 2;
                obj.mesh.position.x += obj.driftX * 2;
                obj.mesh.position.y += obj.driftY * 2;
                obj.mesh.rotation.y += 0.01;

                if (obj.mesh.position.z > 200) {
                    scene.remove(obj.mesh);
                    activeObjects.splice(idx, 1);
                }
            });

            // 6. Spawning Logic
            if (time - lastSpawn > 10000 && activeObjects.length < 4) {
                spawnCelestial();
                lastSpawn = time;
            }
            if (time - lastEnvSpawn > 2000) {
                spawnEnvironment(Math.random() > 0.8 ? "nebula" : "asteroid");
                lastEnvSpawn = time;
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
