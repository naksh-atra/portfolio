export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  points: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export const personalInfo = {
  name: "Nakshatra Rajput",
  title: "AI/ML Engineer",
  tagline: "Building production-grade AI systems and intelligent workflows",
  email: "nakshatra.rajput@outlook.com",
  phone: "+91 98913 98961",
  linkedin: "linkedin.com/in/nakshatrarajput",
  github: "github.com/nakshatrarajput",
  summary: `Software engineer with 1+ years of experience building production-grade Python services 
and data-driven systems. Skilled in system design, prompt engineering, and scalable API development, 
with a proven record of shipping robust RAG pipelines and agentic workflows.`,
};

export const experiences: Experience[] = [
  {
    title: "AI Systems Engineer",
    company: "Freelance",
    location: "Remote",
    period: "Jan 2026 - Present",
    points: [
      "Designed and implemented sophisticated agentic workflows with clean, maintainable backend programming to automate discovery processes",
      "Built robust LLM integration systems for the summarization of complex patent documents using advanced Prompt Engineering",
      "Optimized knowledge indexing strategies using Vector Databases like Qdrant and FAISS for high concurrency research generation",
      "Architected the system design for an automated research generation engine ensuring production-grade reliability",
    ],
  },
  {
    title: "Software Engineer (AI)",
    company: "Propeller Global Ventures",
    location: "Noida, India",
    period: "Jan 2025 - Sep 2025",
    points: [
      "Shipped production-grade conversational AI interfaces with comprehensive unit tests",
      "Implemented advanced LangChain RAG pipelines for personalized content services, improving response relevance",
      "Iterated on model performance through fine-tuning and MLOps best practices",
      "Collaborated with cross-functional teams evaluating AI model variants for adaptive learning",
    ],
  },
  {
    title: "Research Intern (ML & Deep Learning)",
    company: "Manipal University Jaipur",
    location: "Jaipur, India",
    period: "Jan 2024 - Aug 2024",
    points: [
      "Researched deep learning architectures for adaptive learning models and personalized content delivery",
      "Developed proof-of-concept AI tutoring algorithms targeting Bloom's 2 Sigma Problem",
      "Implemented data processing pipelines for large-scale ML model training and evaluation",
    ],
  },
];

export const projects: Project[] = [
  {
    name: "DRIPE: Drug Repurposing Intelligence Engine",
    description: "Implemented the reasoning engine using LangChain and Pinecone for vector search to generate explainable, equity-aware drug-disease hypotheses for underserved diseases.",
    technologies: ["LangChain", "Pinecone", "Python", "LLM Integration"],
  },
  {
    name: "ResFit: Science-Validated Workout Engine",
    description: "Built a Perplexity-based RAG pipeline with Qdrant for vector storage and FastAPI to serve personalized workout recommendations.",
    technologies: ["RAG", "Qdrant", "FastAPI", "Python"],
  },
  {
    name: "TranSys: Multimodal WebRTC Translator",
    description: "Real-time multimodal translation system using WebRTC for low-latency audio/video streaming with AI-powered translation.",
    technologies: ["WebRTC", "Multimodal AI", "Real-time Systems"],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "AI & Machine Learning",
    skills: [
      "LLM Integration",
      "Prompt Engineering",
      "Agentic Workflows",
      "LangChain",
      "Fine-tuning",
      "PyTorch",
      "RAG",
      "Deep Learning",
    ],
  },
  {
    title: "Data & Vector Search",
    skills: ["Vector Databases", "Qdrant", "FAISS", "Pinecone", "Knowledge Indexing", "Data Pipelines"],
  },
  {
    title: "Software & MLOps",
    skills: ["Python", "FastAPI", "System Design", "MLOps", "WebRTC", "REST APIs", "Backend Programming"],
  },
  {
    title: "Domain Expertise",
    skills: ["AI Software Development", "System Architecture", "Product Experimentation"],
  },
];

export const education = {
  institution: "Manipal University Jaipur",
  degree: "BTech, Computer Science Engineering",
  gpa: "8.55/10",
  period: "2020 - 2024",
};
