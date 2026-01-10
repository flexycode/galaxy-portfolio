import * as React from "react";
import { useState, Suspense, useCallback } from "react";
import { motion } from "framer-motion";

// Import UI components directly with proper types
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, ExternalLink, Code } from "lucide-react";

// Add type for React.lazy components
const withSuspense = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

// Create wrapped components with Suspense
const LazyCard = withSuspense(Card);
const LazyCardContent = withSuspense(CardContent);
const LazyCardDescription = withSuspense(CardDescription);
const LazyCardFooter = withSuspense(CardFooter);
const LazyCardHeader = withSuspense(CardHeader);
const LazyCardTitle = withSuspense(CardTitle);
const LazyDialog = withSuspense(Dialog);
const LazyDialogContent = withSuspense(DialogContent);
const LazyDialogDescription = withSuspense(DialogDescription);
const LazyDialogHeader = withSuspense(DialogHeader);
const LazyDialogTitle = withSuspense(DialogTitle);
const LazyDialogTrigger = withSuspense(DialogTrigger);
const LazyBadge = withSuspense(Badge);
const LazyButton = withSuspense(Button);
const LazyTabs = withSuspense(Tabs);
const LazyTabsContent = withSuspense(TabsContent);
const LazyTabsList = withSuspense(TabsList);
const LazyTabsTrigger = withSuspense(TabsTrigger);

// Extend React's type definitions to include custom attributes
declare namespace JSX {
  interface IntrinsicElements {
    div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
    img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
    svg: React.SVGProps<SVGSVGElement>;
    path: React.SVGProps<SVGPathElement>;
    g: React.SVGProps<SVGGElement>;
    rect: React.SVGProps<SVGRectElement>;
    circle: React.SVGProps<SVGCircleElement>;
    defs: React.SVGProps<SVGDefsElement>;
    clipPath: React.SVGProps<SVGClipPathElement>;
    linearGradient: React.SVGProps<SVGLinearGradientElement>;
    stop: React.SVGProps<SVGStopElement>;
    filter: React.SVGProps<SVGFilterElement>;
    feGaussianBlur: React.SVGProps<SVGFEGaussianBlurElement>;
    feBlend: React.SVGProps<SVGFEBlendElement>;
  }
}

interface Project {
  id: string;
  name: string;
  description: string;
  category: "ai" | "cybersecurity" | "blockchain" | "fullstack";
  technologies: string[];
  outcomes: string[];
  image: string;
  github?: string;
  liveUrl?: string;
}

type ProjectCategory = 'ai' | 'cybersecurity' | 'blockchain' | 'fullstack';
type ProjectFilter = ProjectCategory | 'all';

const ProjectGalaxy: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProjectFilter>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Handle category change with proper type safety
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category as ProjectFilter);
  };

  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  }, []);

  const handleImageError = useCallback((id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  }, []);

  // Projects data
  const projects: Project[] = [
    // AI/ML Projects
    {
      id: "ai-1",
      name: "AltFlex: AI-Powered Forensic Framework",
      description:
        "AltFlex is an integrated AI and digital forensics framework designed to proactively detect and analyze security exploits in cross-chain bridges and DeFi protocols. By combining machine learning anomaly detection with blockchain forensic analysis, the system provides a comprehensive security solution for the rapidly evolving Web3 ecosystem.",
      category: "ai",
      technologies: ["Python", "TensorFlow", "PyTorch", "Solidity", "Web3.py", "Docker"],
      outcomes: [
        "Proactive exploit detection for DeFi protocols",
        "Cross-chain bridge security analysis",
        "Real-time anomaly detection with ML"
      ],
      image: "/projects/altflex-forensics.png",
      github: "https://github.com/flexycode/CCSFEN2L_ALTFLEX"
    },
    {
      id: "ai-2",
      name: "WWE Superstar Popularity Tier Prediction",
      description:
        "A comprehensive machine learning system that predicts WWE superstar popularity tiers (Main Eventer, Midcard, Enhancement) based on career statistics and performance metrics. This multi-class classification project demonstrates end-to-end ML pipeline development with robust validation and deployment-ready features.",
      category: "ai",
      technologies: ["Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
      outcomes: [
        "Multi-class tier classification system",
        "End-to-end ML pipeline development",
        "Robust validation and deployment-ready features"
      ],
      image: "/projects/wwe-prediction.png",
      github: "https://github.com/flexycode/CCMACLRL_PROJECT"
    },
    {
      id: "ai-3",
      name: "Genomic Data Analysis Platform",
      description:
        "Advanced platform for analyzing and visualizing genomic data with AI-powered insights for precision medicine.",
      category: "ai",
      technologies: ["Python", "TensorFlow", "React", "Django", "PostgreSQL"],
      outcomes: [
        "Reduced analysis time from days to hours",
        "95% accuracy in variant calling",
        "Used in 10+ research institutions"
      ],
      image: "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?w=800&q=80",
      github: "https://github.com/flexycode/BIOF-101_ALT-genomic-ai",
      liveUrl: "https://genomics.flexyledger.xyz"
    },
    {
      id: "ai-4",
      name: "Predictive Healthcare Analytics",
      description:
        "Advanced ML system for predicting patient outcomes and treatment effectiveness using electronic health records and medical imaging.",
      category: "ai",
      technologies: ["Python", "TensorFlow", "PyTorch", "DICOM", "FastAPI"],
      outcomes: [
        "92% accuracy in predicting treatment outcomes",
        "Reduced readmission rates by 35%",
        "Integrated with hospital EMR systems"
      ],
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
      github: "https://github.com/flexycode/BIOF-102_ALT-healthcare-predictive-analytics"
    },
    {
      id: "ai-5",
      name: "Computer Vision for Manufacturing",
      description:
        "AI system for quality control and defect detection in manufacturing using computer vision.",
      category: "ai",
      technologies: ["Python", "OpenCV", "PyTorch", "Flask", "Docker"],
      outcomes: [
        "99.5% defect detection accuracy",
        "Reduced inspection time by 90%",
        "Deployed on edge devices"
      ],
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&q=80",
      github: "https://github.com/flexycode/cv-manufacturing"
    },
    // Full Stack Projects
    {
      id: "fs-1",
      name: "PharmaXLedger",
      description:
        "PharmaXLedger is a state-of-the-art pharmaceutical supply chain management platform designed to ensure the integrity, transparency, and traceability of life-saving medications. Built with a focus on high-stakes tracking, it bridges the gap between traditional centralized management and future decentralized immutable ledgers.",
      category: "fullstack",
      technologies: ["React", "Node.js", "Solidity", "Ethereum", "PostgreSQL", "Docker"],
      outcomes: [
        "End-to-end pharmaceutical tracking",
        "Blockchain-verified supply chain integrity",
        "HIPAA-compliant data management"
      ],
      image: "/projects/pharmaxledger.png",
      github: "https://github.com/flexycode/CTFDMBSL_ALT-PharmaXLedger"
    },
    {
      id: "fs-2",
      name: "Mindchain: Real-time Collaboration Platform",
      description:
        "Mindchain is a high-performance, open-source alternative to Jira and Confluence, designed as a unified workspace for documentation (Pages) and project management (Issues). Built with the 'Linear' / 'Raycast' aesthetic in mind, Mindchain provides a clean, minimalist, and distraction-free environment for engineering teams to sync their thoughts and tasks.",
      category: "fullstack",
      technologies: ["React", "Node.js", "WebSockets", "MongoDB", "Redis", "TypeScript"],
      outcomes: [
        "Sub-100ms real-time updates",
        "Unified docs and project management",
        "Linear/Raycast-inspired aesthetic"
      ],
      image: "/projects/mindchain.png",
      github: "https://github.com/flexycode/CCMETHOD_ALT-Mindchain"
    },
    {
      id: "fs-3",
      name: "Flight Booking Application",
      description:
        "A flight booking web application designed to simplify the process of booking flights with the use of modern JavaScript techstacks. Features seat selection, flight search, and booking management.",
      category: "fullstack",
      technologies: ["React", "Redux", "Node.js", "Express.js", "MySQL", "Docker"],
      outcomes: [
        "Streamlined flight booking process",
        "Real-time seat selection",
        "Modern responsive UI"
      ],
      image: "/projects/flight-booking.png",
      github: "https://github.com/flexycode/CTINFMGL_FINAL_PROJECT"
    },
    {
      id: "fs-4",
      name: "Healthcare Management System",
      description:
        "Comprehensive platform for managing patient records, appointments, and medical billing with HIPAA compliance.",
      category: "fullstack",
      technologies: ["React", "Node.js", "MongoDB", "AWS", "Docker"],
      outcomes: [
        "Reduced administrative workload by 60%",
        "99.9% system uptime",
        "Implemented in 50+ clinics"
      ],
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
      github: "https://github.com/flexycode/healthcare-management-system"
    },
    {
      id: "fs-5",
      name: "E-commerce Analytics Dashboard",
      description:
        "Real-time analytics platform for e-commerce businesses with AI-powered sales predictions and inventory management.",
      category: "fullstack",
      technologies: ["Next.js", "NestJS", "PostgreSQL", "Redis", "Kubernetes"],
      outcomes: [
        "30% increase in sales conversion",
        "Real-time inventory tracking",
        "Customizable dashboards"
      ],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      github: "https://github.com/flexycode/ecommerce-analytics",
      liveUrl: "https://analytics.flexyledger.xyz"
    },
    {
      id: "fs-6",
      name: "AI-Powered SaaS Analytics Platform",
      description:
        "Enterprise-grade analytics platform with predictive insights and automated reporting.",
      category: "fullstack",
      technologies: ["Next.js", "NestJS", "PostgreSQL", "Redis", "Docker"],
      outcomes: [
        "Reduced reporting time by 85%",
        "50+ enterprise clients",
        "99.99% uptime SLA"
      ],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      github: "https://github.com/flexycode/analytics-saas",
      liveUrl: "https://analytics.flexyledger.xyz"
    },
    // Cybersecurity Projects
    {
      id: "sec-1",
      name: "AltFlex: Smart Contract Security",
      description:
        "AltFlex is an integrated AI and digital forensics framework designed to proactively detect and analyze security exploits in cross-chain bridges and DeFi protocols. By combining machine learning anomaly detection with blockchain forensic analysis, the system provides a comprehensive security solution for the rapidly evolving Web3 ecosystem.",
      category: "cybersecurity",
      technologies: ["Python", "Solidity", "TensorFlow", "Web3.py", "Docker"],
      outcomes: [
        "Identified vulnerabilities in 150+ contracts",
        "Saved $2M in potential exploits",
        "Open-sourced to community"
      ],
      image: "/projects/altflex-forensics.png",
      github: "https://github.com/flexycode/CCSFEN2L_ALTFLEX"
    },
    {
      id: "sec-2",
      name: "AI-Powered Threat Detection System",
      description:
        "Advanced threat detection platform using machine learning to identify and mitigate zero-day vulnerabilities in real-time.",
      category: "cybersecurity",
      technologies: ["Python", "TensorFlow", "ELK Stack", "Kubernetes"],
      outcomes: [
        "Reduced detection time from hours to milliseconds",
        "99.9% accuracy in threat classification",
        "Deployed in enterprise environments"
      ],
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      github: "https://github.com/flexyledger/ai-threat-detection"
    },
    {
      id: "sec-3",
      name: "Blockchain Security Audit Framework",
      description:
        "Comprehensive security auditing framework for smart contracts with automated vulnerability detection and reporting.",
      category: "cybersecurity",
      technologies: ["Solidity", "Foundry", "Python", "Docker"],
      outcomes: [
        "Identified 100+ critical vulnerabilities",
        "Reduced audit time by 70%",
        "Adopted by leading blockchain projects"
      ],
      image: "/projects/blockchain-audit.png",
      github: "https://github.com/flexycode/CCSFEN2L_ALTFLEX"
    },
    {
      id: "sec-4",
      name: "Zero-Trust Network Access (ZTNA) Solution",
      description:
        "Enterprise-grade zero-trust network access solution with continuous authentication and least-privilege access controls.",
      category: "cybersecurity",
      technologies: ["Golang", "OAuth 2.0", "OpenID Connect", "Kubernetes", "SPA"],
      outcomes: [
        "Reduced attack surface by 85%",
        "Seamless user experience with MFA",
        "Compliant with NIST 800-207"
      ],
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      github: "https://github.com/flexyledger/ztna-solution"
    },
    {
      id: "sec-5",
      name: "Cloud-Native SIEM Platform",
      description:
        "Scalable Security Information and Event Management platform built for cloud-native environments with real-time threat intelligence.",
      category: "cybersecurity",
      technologies: ["Elasticsearch", "Kafka", "Kubernetes", "React"],
      outcomes: [
        "Processes 1M+ events per second",
        "Reduced mean time to detect (MTTD) by 90%",
        "Integrated with 50+ security tools"
      ],
      image: "/projects/cloud-siem.png",
      github: "https://github.com/flexyledger/cloud-siem"
    },
    // Blockchain Projects
    {
      id: "bc-1",
      name: "PharmaXLedger",
      description:
        "PharmaXLedger is a state-of-the-art pharmaceutical supply chain management platform designed to ensure the integrity, transparency, and traceability of life-saving medications. Built with a focus on high-stakes tracking, it bridges the gap between traditional centralized management and future decentralized immutable ledgers.",
      category: "blockchain",
      technologies: ["Solidity", "Ethereum", "React", "Node.js", "IPFS", "Hardhat"],
      outcomes: [
        "Immutable pharmaceutical tracking",
        "Smart contract-based verification",
        "Cross-stakeholder transparency"
      ],
      image: "/projects/pharmaxledger.png",
      github: "https://github.com/flexycode/CTFDMBSL_ALT-PharmaXLedger"
    },
    {
      id: "bc-2",
      name: "AltFlex: Cross-Chain Security",
      description:
        "AltFlex is an integrated AI and digital forensics framework designed to proactively detect and analyze security exploits in cross-chain bridges and DeFi protocols. By combining machine learning anomaly detection with blockchain forensic analysis, the system provides a comprehensive security solution for the rapidly evolving Web3 ecosystem.",
      category: "blockchain",
      technologies: ["Solidity", "Rust", "Python", "Web3.py", "Cosmos SDK"],
      outcomes: [
        "Cross-chain bridge security analysis",
        "DeFi protocol vulnerability detection",
        "Blockchain forensic investigation tools"
      ],
      image: "/projects/altflex-forensics.png",
      github: "https://github.com/flexycode/CCSFEN2L_ALTFLEX"
    },
    {
      id: "bc-3",
      name: "DeFi Yield Aggregator",
      description:
        "A decentralized finance platform that automatically optimizes yield farming strategies across multiple protocols to maximize returns.",
      category: "blockchain",
      technologies: ["Solidity", "Ethereum", "Web3.js", "React", "Hardhat"],
      outcomes: [
        "30% higher APY compared to single-protocol staking",
        "$5M+ TVL within first month",
        "Featured in top DeFi platforms"
      ],
      image: "/projects/defi-yield.png",
      github: "https://github.com/flexyledger/defi-yield-aggregator",
      liveUrl: "https://yield.flexyledger.xyz"
    },
    {
      id: "bc-4",
      name: "NFT Marketplace with AI Curation",
      description:
        "A next-generation NFT marketplace with AI-powered discovery and personalized recommendations.",
      category: "blockchain",
      technologies: ["IPFS", "Ethereum", "TensorFlow.js", "Next.js", "GraphQL"],
      outcomes: [
        "Reduced discovery time by 60%",
        "10,000+ monthly active users",
        "Featured in NFT industry reports"
      ],
      image: "/projects/nft-marketplace.png",
      github: "https://github.com/flexyledger/nft-ai-marketplace",
      liveUrl: "https://nft.flexyledger.xyz"
    },
    {
      id: "bc-5",
      name: "Cross-Chain Token Bridge",
      description:
        "A secure and gas-efficient bridge for transferring assets between multiple blockchains.",
      category: "blockchain",
      technologies: ["Cosmos SDK", "IBC Protocol", "Rust", "Tendermint", "WASM"],
      outcomes: [
        "Supports 5+ blockchains",
        "$50M+ in cross-chain volume",
        "<1 minute transaction finality"
      ],
      image: "/projects/cross-chain-bridge.png",
      github: "https://github.com/flexyledger/cross-chain-bridge",
      liveUrl: "https://bridge.flexyledger.xyz"
    }
  ];

  const handleProjectClick = React.useCallback((project: Project) => {
    setSelectedProject(project);
    setIsOpen(true);
  }, []);

  const filteredProjects = React.useMemo(() => {
    return activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category === activeCategory);
  }, [activeCategory, projects]);

  return (
    <div
      className="w-full min-h-screen bg-black bg-opacity-95 py-16 px-4 md:px-8 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)",
      }}
    >
      {/* Background stars */}
      {/* Background stars and nebula */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Nebula clouds */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-60"></div>

        {/* Stars */}
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Project Galaxy
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Explore the universe of my projects across different domains of
            technology
          </p>
        </motion.div>

        <LazyTabs
          value={activeCategory}
          onValueChange={handleCategoryChange}
          className="w-full mb-8"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-slate-900/60 p-1 rounded-lg mx-auto max-w-3xl">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              All Projects
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              AI/ML
            </TabsTrigger>
            <TabsTrigger
              value="cybersecurity"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              Cybersecurity
            </TabsTrigger>
            <TabsTrigger
              value="blockchain"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Blockchain
            </TabsTrigger>
            <TabsTrigger
              value="fullstack"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Full Stack
            </TabsTrigger>
          </TabsList>
        </LazyTabs>

        <div className="galaxy-container relative">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="project-star"
              >
                <div
                  onClick={() => handleProjectClick(project)}
                  className={`cursor-pointer rounded-xl overflow-hidden relative group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70 z-10"></div>
                  <div className="h-64 relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        e.currentTarget.src = 'https://via.placeholder.com/400x256?text=Image+Not+Available';
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 z-20"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                    <Badge
                      className={`mb-2 ${project.category === "ai"
                        ? "bg-purple-600"
                        : project.category === "cybersecurity"
                          ? "bg-red-600"
                          : project.category === "blockchain"
                            ? "bg-blue-600"
                            : "bg-green-600"
                        }`}
                    >
                      {project.category === "ai"
                        ? "AI/ML"
                        : project.category === "cybersecurity"
                          ? "Cybersecurity"
                          : project.category === "blockchain"
                            ? "Blockchain"
                            : "Full Stack"}
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  <div className="absolute top-0 left-0 right-0 p-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-end space-x-2">
                      {project.github && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-black/50 border-white/20 h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.github, '_blank');
                          }}
                        >
                          <Github className="h-4 w-4" />
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-black/50 border-white/20 h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.liveUrl, '_blank');
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl bg-slate-900 text-white border-slate-700">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold">
                    {selectedProject.name}
                  </DialogTitle>
                  <Badge
                    className={`${selectedProject.category === "ai"
                      ? "bg-purple-600"
                      : selectedProject.category === "cybersecurity"
                        ? "bg-red-600"
                        : selectedProject.category === "blockchain"
                          ? "bg-blue-600"
                          : "bg-green-600"
                      }`}
                  >
                    {selectedProject.category === "ai"
                      ? "AI/ML"
                      : selectedProject.category === "cybersecurity"
                        ? "Cybersecurity"
                        : selectedProject.category === "blockchain"
                          ? "Blockchain"
                          : "Full Stack"}
                  </Badge>
                </div>
                <DialogDescription className="text-gray-300 mt-2">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <div className="aspect-video overflow-hidden rounded-lg mb-6">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-blue-300 flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Technologies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-slate-700 text-blue-200"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-green-300 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-check-circle"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Outcomes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1 text-gray-300">
                        {selectedProject.outcomes.map((outcome, index) => (
                          <li key={index}>{outcome}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <CardFooter className="flex justify-end gap-4 pt-6">
                {selectedProject.github && (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => window.open(selectedProject.github, '_blank')}
                  >
                    <Github className="h-4 w-4" />
                    View Code
                  </Button>
                )}
                {selectedProject.liveUrl && (
                  <Button
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open(selectedProject.liveUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </Button>
                )}
              </CardFooter>
            </>
          )}
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default ProjectGalaxy;
