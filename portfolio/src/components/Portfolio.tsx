"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Eye from "./Eye";
import FixedSocials from "./FixedSocials";
import CustomCursor from "./CustomCursor";
import KnowledgeGraph from "./KnowledgeGraph";


export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero-section");
  const [scrolled, setScrolled] = useState(false);
  const [inContact, setInContact] = useState(false);
  const [eyeOpen, setEyeOpen] = useState(false);
  const [inspectProject, setInspectProject] = useState<string | null>(null);

  const landingPageRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout>();

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimerRef.current);
    setEyeOpen(true);
    inactivityTimerRef.current = setTimeout(() => {
      if (!inContact) setEyeOpen(false);
    }, 3000);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionIds = ["hero-section", "pitch-section", "resfit-section", "capabilities-section", "industrial-section", "contact-section"];
  const isLocked = useRef(false);
  const inspectProjectRef = useRef<string | null>(null);

  useEffect(() => {
    inspectProjectRef.current = inspectProject;
  }, [inspectProject]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isLocked.current || inspectProjectRef.current) return;



      if (Math.abs(e.deltaY) > 5) {
        const direction = e.deltaY > 0 ? 1 : -1;
        const nextIndex = Math.max(0, Math.min(sectionIds.length - 1, currentIndex + direction));

        if (nextIndex !== currentIndex) {
          isLocked.current = true;
          setCurrentIndex(nextIndex);
          setTimeout(() => {
            isLocked.current = false;
          }, 800);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentIndex]);

  useEffect(() => {
    const activeId = sectionIds[currentIndex];
    setActiveSection(activeId);
    setScrolled(activeId !== "hero-section");
    setInContact(activeId === "contact-section");
    if (activeId === "contact-section") setEyeOpen(true);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked.current || inspectProjectRef.current) return;


      if (e.key === "ArrowDown") {
        const next = Math.min(sectionIds.length - 1, currentIndex + 1);
        if (next !== currentIndex) {
          isLocked.current = true;
          setCurrentIndex(next);
          setTimeout(() => (isLocked.current = false), 300);
        }
      } else if (e.key === "ArrowUp") {
        const next = Math.max(0, currentIndex - 1);
        if (next !== currentIndex) {
          isLocked.current = true;
          setCurrentIndex(next);
          setTimeout(() => (isLocked.current = false), 300);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  useEffect(() => {
    const handleScroll = () => resetInactivityTimer();
    const handleMouseMove = () => resetInactivityTimer();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [inContact]);

  const projects = {
    resfit: {
      title: "Deterministic Exercise Prescription Engine",
      pitch: "A production-deployed system that bridges the gap between longitudinal exercise science and personalized programming. It utilizes an architectural hard-block to ensure every prescription remains grounded in 2023–2025 meta-analyses rather than LLM hallucinations.",
      tools: ["Exercise_Science", "Meta_Analysis", "Grounding_Engine", "YAML_Logic"],
      id: "resfit"
    },
    capabilities: {
      title: "Systems Engineering & Agentic Architectures",
      pitch: "Beyond building applications, I design autonomous pipelines and high-scale inference engines. My focus is on persistent memory for LLMs, deterministic safety guardrails, and sub-400ms real-time voice orchestration.",
      tools: ["Autonomous_Pipelines", "High_Scale_Inference", "Real_Time_Voice", "Stateful_Agents"],
      id: "capabilities"
    },
    industrial: {
      title: "Real-time Voice AI & Production Infrastructure",
      pitch: "End-to-end technical ownership of a production-grade, configurable voice AI workforce at Propeller Global Ventures. This system orchestrates real-time conversational agents with sub-400ms cadence across modular AI providers.",
      tools: ["Twilio_SIP", "LiveKit_WebRTC", "Azure_Infra", "Redis_Persistence"],
      id: "industrial"
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <FixedSocials contactActive={inContact} />

      {/* Hero Container (Eye & Name Overlay) */}
      <div className="pointer-events-none fixed inset-0 z-[100] h-screen w-full">
        <div id="eye-hitbox" className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <Eye isOpen={eyeOpen} isFocus={inContact} />
        </div>

        <div className={`absolute left-1/2 transition-all duration-1000 ease-eye-ease text-center -translate-x-1/2 ${scrolled ? "top-12 scale-[0.6] opacity-70" : "top-[70vh] opacity-100"
          }`}>


          <h1 id="dynamic-name" className="whitespace-nowrap font-sans text-[2rem] font-medium tracking-[1.2rem]">
            NAKSHATRA RAJPUT
          </h1>
          <p id="dynamic-tagline" className={`font-sans text-[0.6rem] font-normal tracking-[0.4rem] text-narrative uppercase transition-opacity duration-500 ${scrolled ? "opacity-0" : "opacity-100"
            }`}>
            AI SYSTEMS
          </p>
        </div>

        {!scrolled && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce-slow">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-eye">
              <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div ref={landingPageRef} className="landing-page">
        <motion.div
          animate={{ y: `-${currentIndex * 100}%` }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          className="w-full h-full"
        >
          {/* Hero Section */}
          <section className="scroll-section" id="hero-section"></section>


          {/* Section 2: About */}
          <section className={`scroll-section ${activeSection === "pitch-section" ? "in-focus" : ""}`} id="pitch-section">
            <div className="split-pane pt-18">


              <div className="narrative-side">
                <h2 className="text-[1.8rem] font-black my-2 tracking-tighter">The Model is a component, not the system</h2>
                <p className="font-serif text-[1.1rem] leading-relaxed max-w-[700px]">

                  I operate at the intersection of deterministic logic and generative uncertainty. My philosophy is rooted in the
                  "Invisible Backend" - the orchestration layers and state-management protocols that transform raw
                  models into reliable systems. <br /><br />
                  No wrappers, I architect agentic ecosystems that reason, verify and adapt. Transparent, research-grounded infrastructure that treats every token as a calculated decision.
                </p>
              </div>
              <div className="terminal-side ml-14 translate-x-8">

                <div className="terminal-body w-full h-[75vh] relative overflow-hidden bg-background/5 border border-eye/10 rounded-lg">

                  <KnowledgeGraph />
                </div>
              </div>


            </div>
          </section>

          {/* Dynamic Project Sections */}
          {Object.entries(projects).map(([key, project], index) => (
            <section key={key} className={`scroll-section ${activeSection === `${key}-section` ? "in-focus" : ""}`} id={`${key}-section`}>
              <div className={`split-pane ${index % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>



                <div className="narrative-side">
                  <h2 className="text-[1.8rem] font-black my-2 tracking-tighter">{project.title}</h2>
                  <p className="font-sans text-narrative max-w-[700px] leading-relaxed">

                    {project.pitch}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <span key={tool} className="inline-block border border-eye/20 text-narrative text-[0.6rem] px-[10px] py-[4px] rounded-full hover:border-teal-terminal hover:text-teal-terminal transition-colors">
                        {tool}
                      </span>
                    ))}
                  </div>
                  <div
                    className="group mt-12 w-5 h-5 bg-eye rounded-full flex items-center justify-center text-background text-[1.1rem] font-bold cursor-pointer transition-all duration-400 ease-eye-ease hover:scale-110 hover:rotate-90 pointer-events-auto"
                    onMouseEnter={() => setInspectProject(key)}
                  >
                    <span className="mb-[0.5px]">+</span>
                  </div>




                </div>
                <div className="terminal-side">
                  {key === 'resfit' && (
                    <svg viewBox="0 0 500 400" className="w-full opacity-80">
                      <rect x="50" y="150" width="120" height="80" rx="8" className="node-circle" />
                      <text x="65" y="195" className="node-label" style={{ fontSize: '12px' }}>INPUT_VECTOR</text>
                      <line x1="170" y1="190" x2="250" y2="190" className="connector" />
                      <rect x="250" y="50" width="200" height="280" rx="20" className="node-circle" strokeDasharray="8,4" />
                      <text x="280" y="40" className="node-label" style={{ fontSize: '14px', opacity: 0.5 }}>HARD_BLOCK_CORE</text>
                      <circle cx="350" cy="150" r="40" className="node-circle" />
                      <text x="325" y="155" className="node-label" style={{ fontSize: '10px' }}>LOGIC_GATES</text>
                      <path d="M 350 190 L 350 260" className="connector" />
                      <rect x="290" y="260" width="120" height="60" rx="8" className="node-circle" />
                      <text x="305" y="295" className="node-label" style={{ fontSize: '12px' }}>PRESCRIPTION</text>
                    </svg>
                  )}
                  {key === 'capabilities' && (
                    <svg viewBox="0 0 500 400" className="w-full opacity-80">
                      <path d="M 50 100 L 450 100" className="connector" strokeDasharray="10,5" />
                      <path d="M 50 300 L 450 300" className="connector" strokeDasharray="10,5" />
                      <rect x="180" y="50" width="140" height="300" rx="15" className="node-circle" />
                      <text x="200" y="30" className="node-label" style={{ fontSize: '14px' }}>CENTRAL_ORCHESTRATOR</text>
                      <circle cx="250" cy="120" r="5" className="node-circle" />
                      <circle cx="250" cy="200" r="5" className="node-circle" />
                      <circle cx="250" cy="280" r="5" className="node-circle" />
                      <line x1="120" y1="120" x2="180" y2="120" className="connector" />
                      <line x1="320" y1="120" x2="380" y2="120" className="connector" />
                      <line x1="120" y1="200" x2="180" y2="200" className="connector" />
                    </svg>
                  )}
                  {key === 'industrial' && (
                    <svg viewBox="0 0 500 400" className="w-full opacity-80">
                      <rect x="50" y="50" width="100" height="60" rx="8" className="node-circle" />
                      <text x="75" y="85" className="node-label" style={{ fontSize: '14px' }}>TWILIO</text>
                      <line x1="150" y1="80" x2="250" y2="80" className="connector" />
                      <rect x="250" y="50" width="100" height="60" rx="8" className="node-circle" />
                      <text x="270" y="85" className="node-label" style={{ fontSize: '14px' }}>LIVEKIT</text>
                      <path d="M 300 110 L 300 200" className="connector" />
                      <rect x="200" y="200" width="200" height="150" rx="20" className="node-circle" strokeDasharray="10,5" />
                      <text x="230" y="190" className="node-label" style={{ fontSize: '12px', opacity: 0.5 }}>AZURE_CLOUD_CORE</text>
                      <text x="230" y="240" className="node-label" style={{ fontSize: '10px' }}>• REDIS_CACHE</text>
                      <text x="230" y="270" className="node-label" style={{ fontSize: '10px' }}>• AI_GATEWAY</text>
                      <text x="230" y="300" className="node-label" style={{ fontSize: '10px' }}>• LINUX_MICROSERVICES</text>
                    </svg>
                  )}
                </div>
              </div>
            </section>
          ))}

          {/* Section 6: Contact */}
          <section className="scroll-section" id="contact-section">
            <div className={`flex flex-col justify-center items-start max-w-[500px] transition-all duration-[1500ms] ease-eye-ease ${activeSection === "contact-section" ? "opacity-100 -translate-y-[20vh]" : "opacity-0 translate-y-[10px]"
              }`}>
              <h2 className="text-[0.8rem] font-mono mb-12 tracking-[0.2rem] uppercase opacity-70">Build infrastructure that lasts.</h2>

            </div>
          </section>
        </motion.div>
      </div>

      <AnimatePresence>
        {inspectProject && (
          <div className="fixed inset-0 z-[1999] flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xl pointer-events-auto"
              onMouseEnter={() => setInspectProject(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
              className="relative w-[80vw] h-[80vh] bg-[#121212]/95 border border-eye/10 rounded-[24px] z-[2000] overflow-hidden flex flex-col shadow-2xl pointer-events-auto"
            >
              <div className="flex-1 overflow-y-auto p-16 relative">
                <button
                  className="absolute top-8 right-8 text-eye/40 hover:text-eye transition-colors z-50 font-mono text-[0.8rem]"
                  onClick={() => setInspectProject(null)}
                >
                  [ CLOSE ]
                </button>

                {inspectProject === 'resfit' && (
                  <div>
                    <h3 className="mono text-teal-terminal mb-8">[ NODE_INSPECT_v3.0 ]</h3>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12">
                      <div>
                        <h4 className="mono mb-4 text-eye">KNOWLEDGE_GRAPH</h4>
                        <svg viewBox="0 0 200 200" className="w-full max-w-[300px]">
                          <line x1="100" y1="100" x2="50" y2="50" className="connector" strokeOpacity={0.5} />
                          <line x1="100" y1="100" x2="150" y2="50" className="connector" strokeOpacity={0.5} />
                          <circle cx="100" cy="100" r="4" className="node-circle" />
                          <text x="110" y="105" className="node-label" style={{ fontSize: '8px' }}>PRESCRIPTION_GATES</text>
                          <circle cx="50" cy="50" r="3" className="node-circle" />
                          <text x="10" y="45" className="node-label" style={{ fontSize: '6px' }}>Schoenfeld_2016</text>
                          <circle cx="150" cy="50" r="3" className="node-circle" />
                          <text x="155" y="45" className="node-label" style={{ fontSize: '6px' }}>Seiler_2010</text>
                        </svg>
                        <h4 className="mono mt-8 mb-4">THE_SCIENCE</h4>
                        <p className="text-[0.9rem] leading-relaxed text-narrative">
                          Zone 2 Aerobic Base protocols derived from Seiler’s Polarized model.
                          Hypertrophy volume capped at 20 sets/week to prevent CNS fatigue
                          grounded in Schoenfeld’s 2017 meta-analysis.
                        </p>
                      </div>
                      <div>
                        <h4 className="mono mb-4">LOGIC_MANIFEST (endurance.yaml)</h4>
                        <pre className="mono bg-black/30 p-6 border border-eye/10 text-teal-terminal text-[0.8rem] overflow-x-auto">
                          {`parameters:
  intensity:
    metric: RPE
    value: 4
    rir: null # No fatigue target for Z2
  tempo: "3010"
  cadence: 80-90
  rest: 0`}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {inspectProject === 'capabilities' && (
                  <div>
                    <h3 className="mono text-teal-terminal mb-8">[ TECHNICAL_AUDIT_v1.0 ]</h3>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12">
                      <div>
                        <h4 className="mono mb-4">SKILLS_GRAPH</h4>
                        <svg viewBox="0 0 200 200" className="w-full max-w-[300px]">
                          <circle cx="100" cy="40" r="4" className="node-circle" />
                          <text x="110" y="45" className="node-label" style={{ fontSize: '8px' }}>Python (Production)</text>
                          <line x1="100" y1="40" x2="100" y2="80" className="connector" />
                          <circle cx="100" cy="80" r="4" className="node-circle" />
                          <text x="110" y="85" className="node-label" style={{ fontSize: '8px' }}>Agentic RAG</text>
                          <line x1="100" y1="80" x2="60" y2="120" className="connector" />
                          <circle cx="60" cy="120" r="4" className="node-circle" />
                          <text x="10" y="130" className="node-label" style={{ fontSize: '8px' }}>Qdrant</text>
                          <line x1="100" y1="80" x2="140" y2="120" className="connector" />
                          <circle cx="140" cy="120" r="4" className="node-circle" />
                          <text x="150" y="130" className="node-label" style={{ fontSize: '8px' }}>LiveKit/Cerebras</text>
                        </svg>
                      </div>
                      <div>
                        <h4 className="mono mb-4">THE_INVISIBLE_TOOLKIT</h4>
                        <div className="mono text-[0.8rem] border-l-2 border-teal-terminal pl-4 space-y-4">
                          <p>[ ORCHESTRATION ]<br />9-node state machines in LangGraph for recursive self-correction.</p>
                          <p>[ INFRASTRUCTURE ]<br />Azure, SSL/Reverse Proxy, Linux service migrations.</p>
                          <p>[ WORKFLOW ]<br />OpenCode local dev for persistent memory across long coding sessions.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {inspectProject === 'industrial' && (
                  <div>
                    <h3 className="mono text-teal-terminal mb-8">[ PRODUCTION_AUDIT_v5.0 ]</h3>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12">
                      <div>
                        <h4 className="mono mb-4">VOICE_BACKBONE</h4>
                        <svg viewBox="0 0 200 200" className="w-full max-w-[300px]">
                          <circle cx="40" cy="100" r="4" className="node-circle" />
                          <text x="10" y="90" className="node-label" style={{ fontSize: '8px' }}>Twilio (SIP)</text>
                          <line x1="40" y1="100" x2="100" y2="100" className="connector" />
                          <circle cx="100" cy="100" r="4" className="node-circle" />
                          <text x="80" y="115" className="node-label" style={{ fontSize: '8px' }}>LiveKit (WebRTC)</text>
                          <line x1="100" y1="100" x2="160" y2="100" className="connector" />
                          <circle cx="160" cy="100" r="4" className="node-circle" />
                          <text x="140" y="90" className="node-label" style={{ fontSize: '8px' }}>Cerebras Llama3.1</text>
                        </svg>
                      </div>
                      <div>
                        <h4 className="mono mb-4">INFRASTRUCTURE_MANIFEST</h4>
                        <div className="mono text-[0.8rem] border-l-2 border-teal-terminal pl-4 space-y-4">
                          <p>[ SOVEREIGNTY ]<br />Runtime-resolved layer for hot-swapping STT/LLM/TTS providers with 0ms downtime.</p>
                          <p>[ CLOUD_HARDENING ]<br />Azure Linux migration, containerization, and SSL/Reverse Proxy hardening.</p>
                          <p>[ GUARDED_RAG ]<br />Secondary backend-controlled LLM layer for document context verification.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Styles for animation and masking */}
    </div>
  );
}


