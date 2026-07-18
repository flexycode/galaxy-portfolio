import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BootLoaderProps {
    onComplete?: () => void;
}

const BOOT_MESSAGES = [
    "Initializing star field...",
    "Loading galaxy textures...",
    "Calibrating warp drive...",
    "Mapping celestial objects...",
    "Scanning for ships...",
    "Activating defense grid...",
    "Synchronizing blockchain nodes...",
    "Rendering interstellar background...",
    "Systems online.",
];

const BootLoader: React.FC<BootLoaderProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const messageIndexRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setInterval>>();

    // Listen for texture loading progress from InterstellarBackground
    useEffect(() => {
        const handleProgress = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail && typeof detail.progress === "number") {
                setProgress(Math.max(progress, detail.progress));
            }
        };

        window.addEventListener("texture-progress", handleProgress);
        return () => window.removeEventListener("texture-progress", handleProgress);
    }, [progress]);

    // Drip-feed boot messages
    useEffect(() => {
        timerRef.current = setInterval(() => {
            if (messageIndexRef.current < BOOT_MESSAGES.length) {
                setVisibleMessages((prev) => [
                    ...prev,
                    BOOT_MESSAGES[messageIndexRef.current],
                ]);
                messageIndexRef.current += 1;
            }
        }, 350);

        return () => clearInterval(timerRef.current);
    }, []);

    // Auto-complete after all messages shown + progress >= 1
    useEffect(() => {
        if (
            messageIndexRef.current >= BOOT_MESSAGES.length &&
            progress >= 0.9 &&
            !isComplete
        ) {
            const timer = setTimeout(() => {
                setIsComplete(true);
                setIsFadingOut(true);
                setTimeout(() => {
                    onComplete?.();
                }, 800); // Wait for fade-out
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [visibleMessages.length, progress, isComplete, onComplete]);

    // Also auto-complete after a max timeout (8s) regardless of progress
    useEffect(() => {
        const fallback = setTimeout(() => {
            if (!isComplete) {
                setIsComplete(true);
                setIsFadingOut(true);
                setTimeout(() => onComplete?.(), 800);
            }
        }, 8000);
        return () => clearTimeout(fallback);
    }, [isComplete, onComplete]);

    return (
        <AnimatePresence>
            {!isFadingOut && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Scanline effect */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.03]"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                        }}
                    />

                    <div className="w-full max-w-lg px-8">
                        {/* Logo / Title */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8 text-center"
                        >
                            <div className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-2">
                                System Boot Sequence
                            </div>
                            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                Galaxy Portfolio
                            </div>
                        </motion.div>

                        {/* Terminal Messages */}
                        <div className="bg-gray-950/80 border border-gray-800 rounded-lg p-4 mb-6 font-mono text-xs h-48 overflow-hidden relative">
                            <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                {visibleMessages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`flex items-center gap-2 ${
                                            i === visibleMessages.length - 1
                                                ? "text-cyan-400"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        <span className="text-green-500">▸</span>
                                        {msg}
                                    </motion.div>
                                ))}
                                {/* Blinking cursor */}
                                <motion.span
                                    className="inline-block w-2 h-3 bg-cyan-400 ml-4 mt-1"
                                    animate={{ opacity: [1, 1, 0, 0] }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                        times: [0, 0.49, 0.5, 1],
                                    }}
                                />
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative">
                            <div className="flex justify-between text-xs font-mono text-gray-500 mb-2">
                                <span>Loading assets</span>
                                <span>{Math.round(Math.min(progress, 1) * 100)}%</span>
                            </div>
                            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                    initial={{ width: "0%" }}
                                    animate={{
                                        width: `${Math.min(progress, 1) * 100}%`,
                                    }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BootLoader;
