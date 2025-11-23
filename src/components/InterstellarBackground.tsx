import React, { useEffect, useRef, useMemo } from "react";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";

const blockchainPlatforms = [
    "Bitcoin", "Ethereum", "Hyperledger Fabric", "Corda",
    "Binance Smart Chain", "Polkadot", "Cosmos SDK", "Stellar",
    "Tron", "Ripple", "Quorum", "EOS", "Tezos", "XDC Network",
    "Hedera Hashgraph"
];

const InterstellarBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let stars: Star[] = [];
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initStars();
        };

        class Star {
            x: number;
            y: number;
            z: number;
            size: number;
            color: string;

            constructor() {
                this.x = (Math.random() - 0.5) * width * 2;
                this.y = (Math.random() - 0.5) * height * 2;
                this.z = Math.random() * width;
                this.size = 0.5;
                this.color = Math.random() > 0.8 ? "#00ffff" : "#ffffff";
            }

            update() {
                this.z -= 2; // Speed of stars coming towards viewer
                if (this.z <= 0) {
                    this.z = width;
                    this.x = (Math.random() - 0.5) * width * 2;
                    this.y = (Math.random() - 0.5) * height * 2;
                }
            }

            draw() {
                if (!ctx) return;
                const x = (this.x / this.z) * width + width / 2;
                const y = (this.y / this.z) * height + height / 2;
                const radius = (1 - this.z / width) * 2;

                if (x < 0 || x > width || y < 0 || y > height) return;

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const initStars = () => {
            stars = [];
            for (let i = 0; i < 800; i++) {
                stars.push(new Star());
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Trail effect
            ctx.fillRect(0, 0, width, height);

            stars.forEach((star) => {
                star.update();
                star.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        resize();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden bg-black">
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            {/* Floating Blockchain Platforms */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                {blockchainPlatforms.map((platform, index) => (
                    <FloatingText key={index} text={platform} index={index} />
                ))}
            </div>

            {/* Nebula Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent opacity-50" />
        </div>
    );
};

const FloatingText = ({ text, index }: { text: string; index: number }) => {
    // Randomize initial position and animation parameters
    const randomX = useMemo(() => Math.random() * 100, []);
    const randomY = useMemo(() => Math.random() * 100, []);
    const duration = useMemo(() => Math.random() * 20 + 10, []);
    const delay = useMemo(() => Math.random() * 5, []);

    return (
        <motion.div
            className="absolute text-cyan-500/30 text-sm md:text-base font-mono whitespace-nowrap"
            style={{
                left: `${randomX}%`,
                top: `${randomY}%`,
            }}
            animate={{
                y: [0, -100, 0],
                x: [0, 50, 0],
                opacity: [0, 0.4, 0],
                scale: [0.8, 1.2, 0.8],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "linear",
            }}
        >
            {text}
        </motion.div>
    );
};

export default InterstellarBackground;
