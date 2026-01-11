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
    type: "planet" | "ship";
    radius?: number;
    size?: [number, number];
    bgPos?: string;
    bgSize?: string;
}

const CELESTIAL_OBJECTS: CelestialObjectData[] = [
    { id: "earth", image: "/interstellar/planet_earth_moon.png", type: "planet", radius: 5 },
    { id: "mars", image: "/interstellar/planet_mars_venus.png", type: "planet", radius: 4 },
    { id: "jupiter", image: "/interstellar/planet_gas_giants.png", type: "planet", radius: 8 },
    { id: "saturn", image: "/interstellar/planet_gas_giants.png", type: "planet", radius: 7 },
    { id: "neptune", image: "/interstellar/planet_ice_giants.png", type: "planet", radius: 6 },
    { id: "falcon", image: "/interstellar/sw_ships_1.png", type: "ship", size: [10, 10], bgPos: "0% 50%", bgSize: "400% auto" },
    { id: "naboo_royal", image: "/interstellar/sw_ships_1.png", type: "ship", size: [10, 10], bgPos: "33.3% 50%", bgSize: "400% auto" },
    { id: "executor", image: "/interstellar/sw_ships_1.png", type: "ship", size: [15, 6], bgPos: "66.6% 50%", bgSize: "400% auto" },
    { id: "supremacy", image: "/interstellar/sw_ships_2.png", type: "ship", size: [15, 7], bgPos: "0% 50%", bgSize: "400% auto" },
    { id: "slave_1", image: "/interstellar/sw_slave_1.png", type: "ship", size: [8, 11] },
    { id: "frieza", image: "/interstellar/anime_ships.png", type: "ship", size: [11, 10], bgPos: "0% 50%", bgSize: "300% auto" },
    { id: "capsule", image: "/interstellar/anime_ships.png", type: "ship", size: [9, 9], bgPos: "50% 50%", bgSize: "300% auto" },
];

const InterstellarBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 2);
        pointLight.position.set(20, 20, 20);
        scene.add(pointLight);

        // Starfield
        const starCount = 3000;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starSpeeds = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
            starPositions[i * 3] = (Math.random() - 0.5) * 1000;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
            starPositions[i * 3 + 2] = Math.random() * -1000;
            starSpeeds[i] = Math.random() * 2 + 1;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, transparent: true, opacity: 0.8 });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Celestial Objects Pool
        const loader = new THREE.TextureLoader();
        const activeObjects: { mesh: THREE.Group | THREE.Mesh; speed: number; driftX: number; driftY: number }[] = [];

        const spawnObject = () => {
            const data = CELESTIAL_OBJECTS[Math.floor(Math.random() * CELESTIAL_OBJECTS.length)];
            const texture = loader.load(data.image);

            let mesh: THREE.Group | THREE.Mesh;

            if (data.type === "planet") {
                const geometry = new THREE.SphereGeometry(data.radius || 5, 32, 32);
                const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8, metalness: 0.1 });
                mesh = new THREE.Mesh(geometry, material);
            } else {
                if (data.bgSize && data.bgPos) {
                    const widthPerc = parseFloat(data.bgSize);
                    texture.repeat.set(100 / widthPerc, 1);
                    const xOffset = parseFloat(data.bgPos);
                    texture.offset.set(xOffset / 100, 0);
                }
                const geometry = new THREE.PlaneGeometry(data.size![0], data.size![1]);
                const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide });
                mesh = new THREE.Mesh(geometry, material);
            }

            const group = new THREE.Group();
            group.add(mesh);

            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * 20;
            group.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, -500);

            scene.add(group);
            activeObjects.push({
                mesh: group,
                speed: 1.5 + Math.random() * 2,
                driftX: (group.position.x / 100) * 0.5,
                driftY: (group.position.y / 100) * 0.5
            });
        };

        camera.position.z = 50;

        // Animation loop
        let animationFrameId: number;
        let lastSpawn = 0;

        const animate = (time: number) => {
            const delta = 0.016; // Approx 60fps delta

            // Move stars
            const positions = starGeometry.attributes.position.array as Float32Array;
            for (let i = 0; i < starCount; i++) {
                positions[i * 3 + 2] += starSpeeds[i] * 2;
                if (positions[i * 3 + 2] > 100) {
                    positions[i * 3 + 2] = -1000;
                    positions[i * 3] = (Math.random() - 0.5) * 1000;
                    positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
                }
            }
            starGeometry.attributes.position.needsUpdate = true;

            // Move large objects
            activeObjects.forEach((obj, idx) => {
                obj.mesh.position.z += obj.speed * 2;
                obj.mesh.position.x += obj.driftX * 2;
                obj.mesh.position.y += obj.driftY * 2;
                obj.mesh.rotation.y += 0.01;

                if (obj.mesh.position.z > 100) {
                    scene.remove(obj.mesh);
                    activeObjects.splice(idx, 1);
                }
            });

            // Spawning
            if (time - lastSpawn > 8000 && activeObjects.length < 3) {
                spawnObject();
                lastSpawn = time;
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
        animationFrameId = requestAnimationFrame(animate);

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

            {/* Floating text labels */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                {blockchainPlatforms.map((platform, index) => (
                    <FloatingText key={index} text={platform} index={index} />
                ))}
            </div>

            {/* Dark nebula gradient overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-900/10 via-transparent to-black/60 pointer-events-none" />
        </div>
    );
};

const FloatingText = ({ text, index }: { text: string; index: number }) => {
    const randomX = useMemo(() => Math.random() * 100, []);
    const randomY = useMemo(() => Math.random() * 100, []);
    const duration = useMemo(() => Math.random() * 20 + 20, []);
    const delay = useMemo(() => Math.random() * 10, []);

    return (
        <motion.div
            className="absolute text-cyan-400/20 text-xs md:text-sm font-mono whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%" }}
            animate={{
                opacity: [0, 0.3, 0],
                scale: [0.5, 2, 5],
                left: [`${randomX}%`, `${randomX + (randomX - 50) * 1.5}%`],
                top: [`${randomY}%`, `${randomY + (randomY - 50) * 1.5}%`],
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
