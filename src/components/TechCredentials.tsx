import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";

interface SkillType {
  name: string;
  level: number;
  category: string;
}

interface EducationType {
  institution: string;
  degree: string;
  field: string;
  year: string;
  logo?: string;
}

interface CertificationType {
  name: string;
  issuer: string;
  date: string;
  link?: string;
  logo?: string;
}

interface TechCredentialsProps {
  skills?: SkillType[];
  education?: EducationType[];
  certifications?: CertificationType[];
  cvLink?: string;
}

const TechCredentials: React.FC<TechCredentialsProps> = ({
  skills = [
    { name: "Machine Learning", level: 95, category: "AI" },
    { name: "Deep Learning", level: 90, category: "AI" },
    { name: "Natural Language Processing", level: 85, category: "AI" },
    { name: "Computer Vision", level: 80, category: "AI" },
    { name: "Python", level: 95, category: "Programming" },
    { name: "TensorFlow", level: 90, category: "Framework" },
    { name: "PyTorch", level: 85, category: "Framework" },
    { name: "Blockchain Development", level: 75, category: "Blockchain" },
    { name: "Smart Contracts", level: 70, category: "Blockchain" },
    { name: "Cybersecurity", level: 80, category: "Security" },
    { name: "Penetration Testing", level: 75, category: "Security" },
    { name: "React", level: 85, category: "Frontend" },
    { name: "Node.js", level: 80, category: "Backend" },
    { name: "Bio Informatics", level: 70, category: "Domain" },
  ],
  education = [
    {
      institution: "National University",
      degree: "Bachelor of Science",
      field: "Computer Science, AI/ML Specialization",
      year: "2023-2027",
      logo: "https://edurank.org/assets/img/uni-logos/national-university-philippines-logo.png",
    },
    {
      institution: "Far Eastern University",
      degree: "Bachelor of Science",
      field: "Architecture",
      year: "2012-2014",
      logo: "https://edurank.org/assets/img/uni-logos/far-eastern-university-logo.png",
    },
  ],
  certifications = [
    {
      name: "TensorFlow Developer Certificate",
      issuer: "Google",
      date: "2021",
      link: "#",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
    },
    {
      name: "AWS Certified Machine Learning – Specialty",
      issuer: "Amazon Web Services",
      date: "2020",
      link: "#",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=aws",
    },
    {
      name: "Certified Ethical Hacker (CEH)",
      issuer: "EC-Council",
      date: "2019",
      link: "#",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=ceh",
    },
    {
      name: "Blockchain Developer Certification",
      issuer: "Ethereum Foundation",
      date: "2018",
      link: "#",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=ethereum",
    },
  ],
  cvLink = "#",
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const categories = ["All", ...new Set(skills.map((skill) => skill.category))];

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);

  return (
    <section className="py-20 px-4 md:px-8 bg-black bg-opacity-90 text-white relative overflow-hidden">
      {/* Background holographic effect */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
        <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="border border-blue-300 opacity-20"
              style={{
                boxShadow: `0 0 10px rgba(59, 130, 246, ${Math.random() * 0.5})`,
                animation: `pulse ${Math.random() * 5 + 2}s infinite alternate`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Tech Stack & Credentials
          </h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise, educational
            background, and professional certifications.
          </p>
        </motion.div>

        <Tabs defaultValue="skills" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8 bg-gray-900/50 backdrop-blur-sm">
            <TabsTrigger
              value="skills"
              className="data-[state=active]:bg-blue-900/50 data-[state=active]:text-blue-200"
            >
              Skills
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="data-[state=active]:bg-blue-900/50 data-[state=active]:text-blue-200"
            >
              Education
            </TabsTrigger>
            <TabsTrigger
              value="certifications"
              className="data-[state=active]:bg-blue-900/50 data-[state=active]:text-blue-200"
            >
              Certifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-8">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className={`cursor-pointer ${activeCategory === category ? "bg-blue-700" : "hover:bg-blue-900/30"}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-blue-300">{skill.level}%</span>
                  </div>
                  <div className="relative h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${skill.level}%` }}
                    >
                      <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.institution}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <Card className="bg-gray-900/50 border-blue-900/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-900/30 flex items-center justify-center">
                          {edu.logo ? (
                            <img
                              src={edu.logo}
                              alt={edu.institution}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-2xl font-bold text-blue-400">
                              {edu.institution.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-blue-300">
                            {edu.institution}
                          </h3>
                          <p className="text-white">{edu.degree}</p>
                          <p className="text-blue-200">{edu.field}</p>
                          <p className="text-sm text-gray-400">{edu.year}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <Card className="bg-gray-900/50 border-blue-900/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-900/30 flex items-center justify-center">
                          {cert.logo ? (
                            <img
                              src={cert.logo}
                              alt={cert.issuer}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-xl font-bold text-blue-400">
                              {cert.issuer.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-blue-300">
                            {cert.name}
                          </h3>
                          <p className="text-white">{cert.issuer}</p>
                          <p className="text-sm text-gray-400">{cert.date}</p>
                        </div>
                        {cert.link && (
                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            <a href={cvLink} download>
              <Download className="mr-2 h-4 w-4" /> Download CV
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TechCredentials;
