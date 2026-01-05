import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Twitter } from "lucide-react";
import InterstellarBackground from "./InterstellarBackground";
import { Button } from "./ui/button";

interface HeroSectionProps {
  name?: string;
  title?: string;
  bio?: string;
  imageUrl?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  name = "Jay Arre Talosig",
  title = "Machine Learning Engineer | Blockchain Developer | Bioinformatics Student",
  bio = "With 9 years of experience in the tech industry, specializing in AI/ML and Blockchain solutions, and currently learning Bioinformatics. Passionate about leveraging cutting-edge technology to solve complex biological problems and build decentralized applications.",
  // Using the provided LinkedIn profile image
  imageUrl = "/projects/1.Jay Arre Talosig.png",
  ctaText = "View My Work",
  onCtaClick = () => console.log("CTA clicked"),
}) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Animated background with particles */}
      <div className="absolute inset-0 z-0">
        <InterstellarBackground />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-16 md:px-8">
        <div className="container mx-auto flex max-w-6xl flex-col items-center lg:flex-row lg:justify-between">
          {/* Text content */}
          <motion.div
            className="mb-10 flex flex-col items-center text-center lg:mb-0 lg:w-1/2 lg:items-start lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-cyan-400 md:text-5xl lg:text-6xl">
              {name}
            </h1>
            <h2 className="mb-6 text-xl font-medium text-cyan-200 md:text-2xl">
              {title}
            </h2>
            <p className="mb-8 max-w-lg text-gray-300">{bio}</p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                onClick={onCtaClick}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                size="lg"
              >
                {ctaText}
              </Button>
              <div className="flex items-center justify-center space-x-4">
                <motion.a
                  href="https://github.com/flexyledger"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="rounded-full bg-gray-800 p-2 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                >
                  <Github size={20} />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/flexycode"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="rounded-full bg-gray-800 p-2 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                >
                  <Linkedin size={20} />
                </motion.a>
                <motion.a
                  href="https://twitter.com/flexyledger"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="rounded-full bg-gray-800 p-2 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                >
                  <Twitter size={20} />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Profile image */}
          <motion.div
            className="relative h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur-lg opacity-70"></div>
            <div className="absolute inset-2 overflow-hidden rounded-full border-2 border-cyan-300 bg-gray-900">
              <img
                src={imageUrl}
                alt={name}
                className="h-full w-full object-cover object-[center_20%] scale-125"
                onError={(e) => {
                  console.error('Error loading image:', imageUrl);
                  // Fallback to a placeholder if the image fails to load
                  e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Profile+Image';
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
        >
          <ArrowDown className="h-8 w-8 text-cyan-400" />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
