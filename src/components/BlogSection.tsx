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
import { Search, Calendar, ArrowRight } from "lucide-react";

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
                <Card
                  key={post.id}
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
                    <p className="text-gray-300">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="text-indigo-400 hover:text-indigo-300 p-0 group"
                    >
                      Read More{" "}
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
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
              <Card
                key={post.id}
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
                  <Button
                    variant="ghost"
                    className="text-indigo-400 hover:text-indigo-300 p-0 text-sm group"
                  >
                    Read More{" "}
                    <ArrowRight className="ml-1 h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
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
      "Exploring how deep learning architectures are revolutionizing disease detection and diagnosis through medical imaging.",
    date: "May 15, 2023",
    category: "ai",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    featured: true,
  },
  {
    id: "2",
    title: "Blockchain Solutions for Secure Medical Data Sharing",
    excerpt:
      "How distributed ledger technology can enable secure, transparent sharing of patient data while maintaining privacy.",
    date: "April 22, 2023",
    category: "blockchain",
    image:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80",
    featured: true,
  },
  {
    id: "3",
    title: "Cybersecurity Best Practices for Healthcare Systems",
    excerpt:
      "Essential security protocols to protect sensitive patient information from increasingly sophisticated threats.",
    date: "March 10, 2023",
    category: "cybersecurity",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    featured: false,
  },
  {
    id: "4",
    title: "Building Responsive Bioinformatics Web Applications",
    excerpt:
      "A comprehensive guide to creating full-stack applications for visualizing and analyzing genomic data.",
    date: "February 28, 2023",
    category: "fullstack",
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
    featured: false,
  },
  {
    id: "5",
    title: "Machine Learning Approaches to Protein Folding Prediction",
    excerpt:
      "Recent advances in computational methods for predicting protein structures and their implications for drug discovery.",
    date: "January 15, 2023",
    category: "ai",
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
    featured: false,
  },
  {
    id: "6",
    title: "Smart Contracts for Clinical Trial Management",
    excerpt:
      "How blockchain-based smart contracts can improve transparency and efficiency in clinical research.",
    date: "December 5, 2022",
    category: "blockchain",
    image:
      "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=800&q=80",
    featured: false,
  },
];

export default BlogSection;
