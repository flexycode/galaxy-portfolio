import React from "react";
import { motion } from "framer-motion";
import HeroSection from "./HeroSection";
import ProjectGalaxy from "./ProjectGalaxy";
import TechCredentials from "./TechCredentials";
import BlogSection from "./BlogSection";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            Flexyledger
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <NavItem label="Home" onClick={() => scrollToSection("hero")} />
            <NavItem
              label="Projects"
              onClick={() => scrollToSection("projects")}
            />
            <NavItem label="Skills" onClick={() => scrollToSection("skills")} />
            <NavItem label="Blog" onClick={() => scrollToSection("blog")} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-gray-800"
          >
            <div className="flex flex-col space-y-4 py-4 px-4">
              <MobileNavItem
                label="Home"
                onClick={() => scrollToSection("hero")}
              />
              <MobileNavItem
                label="Projects"
                onClick={() => scrollToSection("projects")}
              />
              <MobileNavItem
                label="Skills"
                onClick={() => scrollToSection("skills")}
              />
              <MobileNavItem
                label="Blog"
                onClick={() => scrollToSection("blog")}
              />
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <section id="hero">
          <HeroSection />
        </section>

        <section id="projects" className="py-16">
          <ProjectGalaxy />
        </section>

        <section id="skills" className="py-16">
          <TechCredentials />
        </section>

        <section id="blog" className="py-16">
          <BlogSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Portfolio. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <SocialLink href="https://github.com/flexyledger" label="GitHub" />
              <SocialLink href="https://linkedin.com/in/flexycode" label="LinkedIn" />
              <SocialLink href="https://twitter.com/flexyledger" label="Twitter" />
            </div>
          </div>
        </div>
      </footer>

      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <Particles />
      </div>
    </div>
  );
};

const NavItem = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="text-gray-300 hover:text-white transition-colors"
    onClick={onClick}
  >
    {label}
  </motion.button>
);

const MobileNavItem = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    className="text-gray-300 hover:text-white transition-colors py-2 w-full text-left"
    onClick={onClick}
  >
    {label}
  </motion.button>
);

const SocialLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-colors"
  >
    {label}
  </a>
);

const Particles = () => {
  // Generate random particles
  const particles = React.useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-500/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default Home;
