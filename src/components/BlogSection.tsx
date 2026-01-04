import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Calendar, ArrowRight, X } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  featured: boolean;
}

interface BlogSectionProps {
  posts?: BlogPost[];
}

const BlogSection = ({ posts = defaultPosts }: BlogSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter posts based on search query and active category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(new Set(posts.map((post) => post.category))),
  ];

  // Get featured posts
  const featuredPosts = posts.filter((post) => post.featured);

  return (
    <section
      className="w-full py-16 px-4 md:px-8 bg-black bg-opacity-80 text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(25, 33, 52, 0.8), rgba(10, 15, 30, 0.95))",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600">
            Insights & Articles
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Exploring the frontiers of technology through research, tutorials,
            and thought leadership
          </p>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles..."
              className="pl-10 bg-gray-900 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="bg-gray-900 border border-gray-700">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setActiveCategory(category)}
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Featured posts */}
        {activeCategory === "all" && searchQuery === "" && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-300">
              Featured Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post) => (
                <Dialog key={post.id}>
                  <Card
                    className="bg-gray-900 border-gray-700 overflow-hidden group hover:border-indigo-500 transition-all duration-300"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-900 opacity-70"></div>
                      <Badge className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700">
                        {post.category}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl text-white group-hover:text-indigo-400 transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="flex items-center text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        {post.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 line-clamp-3">{post.excerpt}</p>
                    </CardContent>
                    <CardFooter>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-indigo-400 hover:text-indigo-300 p-0 group"
                        >
                          Read More{" "}
                          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </DialogTrigger>
                    </CardFooter>
                  </Card>
                  <DialogContent className="max-w-3xl bg-gray-900 text-white border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-white">
                        {post.title}
                      </DialogTitle>
                      <DialogDescription className="flex items-center gap-3 mt-2">
                        <Badge className="bg-indigo-600 hover:bg-indigo-700">
                          {post.category}
                        </Badge>
                        <span className="flex items-center text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          {post.date}
                        </span>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                      />
                      <ScrollArea className="h-[250px] w-full rounded-md pr-4">
                        <p className="text-gray-300 leading-relaxed text-base">
                          {post.excerpt}
                        </p>
                      </ScrollArea>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        )}

        {/* All posts */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-300">
            {activeCategory === "all"
              ? "All Articles"
              : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Articles`}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Dialog key={post.id}>
                <Card
                  className="bg-gray-900 border-gray-700 hover:border-indigo-500 transition-all duration-300 group"
                >
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 right-3 bg-indigo-600 hover:bg-indigo-700">
                      {post.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg text-white group-hover:text-indigo-400 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center text-gray-400">
                      <Calendar className="h-3 w-3 mr-2" />
                      {post.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-indigo-400 hover:text-indigo-300 p-0 text-sm group"
                      >
                        Read More{" "}
                        <ArrowRight className="ml-1 h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </DialogTrigger>
                  </CardFooter>
                </Card>
                <DialogContent className="max-w-2xl bg-gray-900 text-white border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                      {post.title}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-3 mt-2">
                      <Badge className="bg-indigo-600 hover:bg-indigo-700">
                        {post.category}
                      </Badge>
                      <span className="flex items-center text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        {post.date}
                      </span>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <ScrollArea className="h-[200px] w-full rounded-md pr-4">
                      <p className="text-gray-300 leading-relaxed text-sm">
                        {post.excerpt}
                      </p>
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className="bg-gray-900 border-gray-700 hover:bg-gray-800"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive
                className="bg-indigo-600 hover:bg-indigo-700 border-indigo-700"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="bg-gray-900 border-gray-700 hover:bg-gray-800"
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="bg-gray-900 border-gray-700 hover:bg-gray-800"
              >
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                className="bg-gray-900 border-gray-700 hover:bg-gray-800"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
};

// Default blog posts data
const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "Advancing Neural Networks for Biomedical Image Analysis",
    excerpt:
      "Exploring how cutting-edge deep learning architectures like Vision Transformers (ViT), U-Net variants, and Diffusion Models are revolutionizing disease detection and diagnosis through medical imaging. This comprehensive analysis examines state-of-the-art techniques in histopathology analysis for cancer detection, radiology automation using 3D CNNs, and real-time surgical guidance systems. We delve into practical insights on model optimization strategies including mixed-precision training, knowledge distillation, and data augmentation pipelines for handling class imbalance in rare disease datasets. Special focus is given to clinical deployment considerations, explainability methods like Grad-CAM for radiologist trust, and pathways toward achieving FDA 510(k) and De Novo clearance for AI-powered diagnostic tools.",
    date: "January 10, 2026",
    category: "ai",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    featured: true,
  },
  {
    id: "2",
    title: "Blockchain Solutions for Secure Medical Data Sharing",
    excerpt:
      "How distributed ledger technology, zero-knowledge proofs (ZKPs), and homomorphic encryption enable secure, transparent sharing of patient data while maintaining strict HIPAA compliance and patient privacy. This comprehensive guide explores permissioned blockchain architectures using Hyperledger Fabric and Quorum, smart contract frameworks for granular consent management, and interoperability standards including HL7 FHIR integration for seamless EHR data exchange. We examine real-world case studies of blockchain implementation in healthcare ecosystems including prescription tracking systems, medical credential verification, cross-border health record portability, and pharmaceutical supply chain integrity. The article also addresses scalability challenges, gas optimization strategies, and hybrid on-chain/off-chain storage patterns for handling large medical imaging files.",
    date: "November 22, 2025",
    category: "blockchain",
    image:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80",
    featured: true,
  },
  {
    id: "3",
    title: "Cybersecurity Best Practices for Healthcare Systems",
    excerpt:
      "Essential security protocols and defense-in-depth strategies to protect sensitive patient information from increasingly sophisticated ransomware attacks, nation-state actors, and insider threats. This comprehensive article covers zero-trust architecture implementation using microsegmentation and continuous verification, endpoint detection and response (EDR/XDR) systems, vulnerability management pipelines with CVSS-based prioritization, and incident response playbooks tailored for healthcare environments. We explore compliance frameworks including HIPAA Security Rule, HITRUST CSF, SOC 2 Type II, and NIST Cybersecurity Framework, with actionable insights for protecting IoT medical devices, PACS imaging systems, and legacy healthcare infrastructure. Special attention is given to secure DevOps practices, secrets management, network traffic analysis for anomaly detection, and building a security-first culture through phishing simulations and role-based training programs.",
    date: "September 18, 2025",
    category: "cybersecurity",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    featured: false,
  },
  {
    id: "4",
    title: "Building Responsive Bioinformatics Web Applications",
    excerpt:
      "A comprehensive full-stack development guide to creating high-performance, responsive web applications for visualizing and analyzing genomic data at petabyte scale. This in-depth tutorial explores modern tech stacks including React 18 with Server Components, Next.js 14 App Router, and TypeScript for type-safe frontends, paired with FastAPI and Django REST Framework backends optimized for bioinformatics workloads. We cover PostgreSQL with TimescaleDB extensions for time-series genomic data, Redis caching strategies for sequence alignment results, and WebGL/Three.js for interactive 3D protein visualization and molecular dynamics playback. The guide addresses scalable cloud architectures on AWS (ECS, Lambda, S3) and GCP (Cloud Run, BigQuery) for handling terabyte-scale sequencing datasets, implementing real-time collaborative analysis features using WebSockets, and optimizing Lighthouse scores for accessibility compliance in research environments.",
    date: "July 15, 2025",
    category: "fullstack",
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
    featured: false,
  },
  {
    id: "5",
    title: "Machine Learning Approaches to Protein Folding Prediction",
    excerpt:
      "Recent breakthrough advances in computational methods for predicting protein structures, building on revolutionary innovations from AlphaFold 3, ESMFold, and RoseTTAFold All-Atom, and their transformative implications for drug discovery and precision medicine. This technical deep-dive analyzes multi-head attention mechanisms in protein language models, evolutionary-scale multiple sequence alignment (MSA) techniques, geometric deep learning on 3D molecular graphs using equivariant neural networks, and confidence scoring systems (pLDDT, PAE) for structure quality assessment. We explore practical applications in therapeutic antibody design, enzyme engineering for industrial biotechnology, structure-based virtual screening for novel small-molecule therapeutics, and predicting protein-protein interaction interfaces. The article also covers emerging techniques for modeling intrinsically disordered regions, membrane protein prediction challenges, and the integration of molecular dynamics simulations with ML predictions for drug binding affinity estimation.",
    date: "May 8, 2025",
    category: "ai",
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
    featured: false,
  },
  {
    id: "6",
    title: "Smart Contracts for Clinical Trial Management",
    excerpt:
      "How blockchain-based smart contracts and decentralized autonomous organizations (DAOs) can dramatically improve transparency, patient enrollment efficiency, and operational oversight in clinical research trials. This comprehensive article examines Ethereum Layer 2 solutions (Optimism, Arbitrum) and Hyperledger Besu for enterprise-grade deployments, enabling automated patient consent verification with tamper-proof audit trails, real-time adverse event reporting systems, and immutable regulatory compliance documentation. We explore tokenized incentive mechanisms using ERC-20 and ERC-721 standards for trial participation rewards, decentralized data marketplaces for research collaboration, and significant cost reduction strategies through disintermediation of clinical research organizations (CROs). The guide also addresses oracle integration patterns for connecting on-chain contracts with off-chain clinical data sources, multi-signature governance for protocol amendments, and regulatory considerations for FDA 21 CFR Part 11 compliance in decentralized trial management systems.",
    date: "March 25, 2025",
    category: "blockchain",
    image:
      "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=800&q=80",
    featured: false,
  },
];

export default BlogSection;
