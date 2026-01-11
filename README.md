# 🌌 Galaxy Portfolio

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A modern, responsive portfolio website built with React, TypeScript, and Vite. Showcase your projects, skills, and experience with this beautiful, animated portfolio template.

## 🚀 Features

- ⚡ Blazing fast performance with Vite
- 🎨 Stunning animations with Framer Motion
- 📱 Fully responsive design
- 🎨 Customizable theme
- 📦 Component-based architecture
- 🔍 SEO optimized
- 🌙 Dark mode support

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide Icons, Radix Icons
- **Form Handling**: React Hook Form
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites

- Node.js 16.14.0 or later
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/flexycode/galaxy-portfolio.git
   cd galaxy-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🏗️ Project Structure

```bash
galaxy-portfolio/
├── public/                 # Static assets
│   ├── interstellar/       # 🌌 Generated planets & spaceship assets
│   ├── mobile/             # 📱 Mobile responsiveness screenshots
│   └── projects/           # 💻 Featured project showcase images
├── src/
│   ├── components/         # 🧩 Core UI Components
│   │   ├── ui/             # 🧱 Shadcn/UI primitive components
│   │   ├── HeroSection.tsx # 🏠 Main landing hero component
│   │   ├── InterstellarBackground.tsx # 🚀 Three.js 3D Background Engine
│   │   ├── ProjectGalaxy.tsx # 🌌 Projects showcase component
│   │   └── ...
│   ├── lib/                # 🛠️ Utility functions & shared logic
│   ├── types/              # 🏷️ TypeScript type definitions
│   ├── App.tsx             # ⚙️ Root Application component
│   ├── index.css           # 🎨 Global CSS & Tailwind imports
│   └── main.tsx            # ⚡ Application Entry point
├── vite.config.ts          # ⚙️ Vite & Three.js configuration
└── ...
```

## 🌌 Interstellar 3D Background

The portfolio features a high-performance 3D stellar environment built from the ground up to provide an immersive navigation experience.

### 📺 Demo

**Dynamic Galaxy Cycle & Hero Objects (Phase 5)**
![Interstellar 3D Ecosystem](/public/demo/interstellar-phase5-demo.webp)

### 🛠️ Technical Details
- **Engine**: [InterstellarBackground.tsx](file:///c:/Users/flexycode/Desktop/galaxy-portfolio/src/components/InterstellarBackground.tsx) (Three.js WebGLRenderer)
- **Galaxy Cycle**: Dynamic state machine (`FADE_IN` → `VISIBLE` → `FADE_OUT` → `SWAP`) cycling through 4 distinct high-fidelity galaxy textures (Blue Spiral, Gold Elliptical, Purple Nebula, Red Ring).
- **Hero Objects**:
  - **Saturn**: True 3D sphere with separate, tilted transparent ring geometry.
  - **Sun**: High-emissive sphere with billboarded corona halo.
  - **Space Station**: Complex mesh with independently rotating gravity ring.
  - **Exoplanets**: Detailed surface mapping for Proxima Centauri b and Alien worlds.
- **Rendering Fidelity**:
  - **High-Precision Alpha**: Ship sprites use aggressive `alphaTest` (0.6) to eliminate artifacts.
  - **Depth Sorting**: Explicit `depthWrite` enabled for all foreground objects to ensure correct occlusion.
- **Cinematic Camera**: Subtle "cockpit-view" roving effect for immersion.

## 🌟 Featured Projects

### AI/ML Projects

#### 1. AltFlex: AI-Powered Forensic Framework
**Tech Stack**: Python, TensorFlow, PyTorch, Solidity, Web3.py, Docker  
**Description**: An integrated AI and digital forensics framework designed to proactively detect and analyze security exploits in cross-chain bridges and DeFi protocols. Combines machine learning anomaly detection with blockchain forensic analysis.  
[GitHub Repo](https://github.com/flexycode/CCSFEN2L_ALTFLEX)

![AltFlex Dashboard](/public/projects/altflex-forensics.png)

#### 2. WWE Superstar Popularity Tier Prediction
**Tech Stack**: Python, Scikit-learn, Pandas, NumPy, Matplotlib, Seaborn  
**Description**: A comprehensive machine learning system that predicts WWE superstar popularity tiers (Main Eventer, Midcard, Enhancement) based on career statistics and performance metrics.  
[GitHub Repo](https://github.com/flexycode/CCMACLRL_PROJECT)

![WWE Prediction](/public/projects/wwe-prediction.png)

#### 3. Genomic Data Analysis Platform
**Tech Stack**: Python, TensorFlow, React, Django, PostgreSQL  
**Description**: Advanced platform for analyzing and visualizing genomic data with AI-powered insights for precision medicine.  
[GitHub Repo](https://github.com/flexycode/BIOF-101_ALT-genomic-ai)

#### 4. Predictive Healthcare Analytics
**Tech Stack**: Python, TensorFlow, PyTorch, DICOM, FastAPI  
**Description**: Advanced ML system for predicting patient outcomes and treatment effectiveness using electronic health records and medical imaging.  
[GitHub Repo](https://github.com/flexycode/BIOF-102_ALT-healthcare-predictive-analytics)

#### 5. Computer Vision for Manufacturing
**Tech Stack**: Python, OpenCV, PyTorch, Flask, Docker  
**Description**: AI system for quality control and defect detection in manufacturing using computer vision.  
[GitHub Repo](https://github.com/flexycode/cv-manufacturing)

---

### Full Stack Projects

#### 6. Mindchain: Real-time Collaboration Platform
**Tech Stack**: React, Node.js, WebSockets, MongoDB, Redis, TypeScript  
**Description**: A high-performance, open-source alternative to Jira and Confluence, designed as a unified workspace for documentation and project management. Built with the 'Linear' / 'Raycast' aesthetic.  
[GitHub Repo](https://github.com/flexycode/CCMETHOD_ALT-Mindchain)

![Mindchain](/public/projects/mindchain.png)

#### 7. Flight Booking Application
**Tech Stack**: React, Redux, Node.js, Express.js, MySQL, Docker  
**Description**: A flight booking web application designed to simplify the process of booking flights with modern JavaScript techstacks.  
[GitHub Repo](https://github.com/flexycode/CTINFMGL_FINAL_PROJECT)

![Flight Booking](/public/projects/flight-booking.png)

#### 8. E-commerce Analytics Dashboard
**Tech Stack**: Next.js, NestJS, PostgreSQL, Redis, Kubernetes  
**Description**: Real-time analytics platform for e-commerce businesses with AI-powered sales predictions and inventory management.  
[GitHub Repo](https://github.com/flexycode/ecommerce-analytics)

#### 9. AI-Powered SaaS Analytics Platform
**Tech Stack**: Next.js, NestJS, PostgreSQL, Redis, Docker  
**Description**: Enterprise-grade analytics platform with predictive insights and automated reporting.  
[GitHub Repo](https://github.com/flexycode/analytics-saas)

---

### Blockchain Projects

#### 10. PharmaXLedger
**Tech Stack**: React, Node.js, Solidity, Ethereum, PostgreSQL, Docker  
**Description**: A state-of-the-art pharmaceutical supply chain management platform designed to ensure the integrity, transparency, and traceability of life-saving medications.  
[GitHub Repo](https://github.com/flexycode/CTFDMBSL_ALT-PharmaXLedger)

![PharmaXLedger](/public/projects/pharmaxledger.png)

#### 11. DeFi Yield Aggregator
**Tech Stack**: Solidity, Ethereum, Web3.js, React, Hardhat  
**Description**: A decentralized finance platform that automatically optimizes yield farming strategies across multiple protocols to maximize returns.  
[GitHub Repo](https://github.com/flexyledger/defi-yield-aggregator)

#### 12. NFT Marketplace with AI Curation
**Tech Stack**: IPFS, Ethereum, TensorFlow.js, Next.js, GraphQL  
**Description**: A next-generation NFT marketplace with AI-powered discovery and personalized recommendations.  
[GitHub Repo](https://github.com/flexyledger/nft-ai-marketplace)

#### 13. Cross-Chain Token Bridge
**Tech Stack**: Cosmos SDK, IBC Protocol, Rust, Tendermint, WASM  
**Description**: A secure and gas-efficient bridge for transferring assets between multiple blockchains.  
[GitHub Repo](https://github.com/flexyledger/cross-chain-bridge)

---

### Cybersecurity Projects

#### 14. AltFlex: Smart Contract Security
**Tech Stack**: Python, Solidity, TensorFlow, Web3.py, Docker  
**Description**: Integrated AI and digital forensics framework for smart contract security analysis and DeFi protocol vulnerability detection.  
[GitHub Repo](https://github.com/flexycode/CCSFEN2L_ALTFLEX)

![AltFlex](/public/projects/altflex-forensics.png)

#### 15. AI-Powered Threat Detection System
**Tech Stack**: Python, TensorFlow, ELK Stack, Kubernetes  
**Description**: Advanced threat detection platform using machine learning to identify and mitigate zero-day vulnerabilities in real-time.  
[GitHub Repo](https://github.com/flexyledger/ai-threat-detection)

#### 16. Zero-Trust Network Access (ZTNA) Solution
**Tech Stack**: Golang, OAuth 2.0, OpenID Connect, Kubernetes, SPA  
**Description**: Enterprise-grade zero-trust network access solution with continuous authentication and least-privilege access controls.  
[GitHub Repo](https://github.com/flexyledger/ztna-solution)

![ZTNA](https://images.unsplash.com/photo-1550751827-4bd374c3f58b)

#### 17. Cloud-Native SIEM Platform
**Tech Stack**: Elasticsearch, Kafka, Kubernetes, React  
**Description**: Scalable Security Information and Event Management platform built for cloud-native environments with real-time threat intelligence.  
[GitHub Repo](https://github.com/flexyledger/cloud-siem)

---

### Other Projects

#### 18. Project Galaxy (This Portfolio)
**Tech Stack**: React, TypeScript, Tailwind CSS, Framer Motion  
**Description**: A space-themed portfolio website with smooth animations and modern UI components.  
[Live Demo](#) | [GitHub Repo](https://github.com/flexycode/galaxy-portfolio)

## 📱 Mobile Responsiveness

This portfolio is fully optimized for mobile devices with enhanced modal dialogs featuring:

- **Large tap targets** (40x40px) for close buttons
- **Visible close button** with dark background for better visibility
- **Scrollable modal content** that fits within the viewport
- **Smooth animations** optimized for mobile performance

### Project Galaxy Modal

![Project Galaxy Modal](/public/mobile/project-galaxy-modal.png)

### Blog Section Modal

![Blog Section Modal](/public/mobile/blog-section-modal.png)

### Mobile Test Recording

![Mobile Test Recording](/public/mobile/mobile-test-recording.webp)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

- GitHub: [@flexycode](https://github.com/flexycode)
- Email: [flexycode.dev@gmail.com](mailto:flexycode.dev@gmail.com)

---

Made with ❤️ by [Jay Arre Talosig](https://github.com/flexycode)

