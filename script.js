document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.querySelector('.landing-page');
    const eyeContainer = document.getElementById('eye-container');
    const eyeLidUpper = document.querySelector('.eye-lid-upper');
    const eyeLidLower = document.querySelector('.eye-lid-lower');
    const eyeClipPath = document.querySelector('.eye-mask-path');
    const eyeTrack = document.querySelector('.eye-track');
    const cursor = document.querySelector('.cursor');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // 1. DETAIL OVERLAY SETUP
    const overlay = document.createElement('div');
    overlay.className = 'detail-overlay';
    overlay.id = 'project-detail-overlay';
    document.body.appendChild(overlay);

    const projectData = {
        logic: `<h2>[ LOGIC_AGENCY LOGS ]</h2><p>Refining recursive loops... [DONE]</p><p>Integrating Groq_70B for near-instant inference.</p><p>Implementing non-deterministic state machine transitions to handle ambiguous recruiter queries.</p>`,
        comp: `<h2>[ PHYSIOLOGICAL_COMPUTE LOGS ]</h2><p>Optimizing PubMed scrapers... [OK]</p><p>Achieved 92% cache hit with localized RAG vector indexing.</p><p>Validated against 2024 meta-analysis studies.</p>`,
        relational: `<h2>[ RELATIONAL_INTELLIGENCE LOGS ]</h2><p>GNN Link Prediction starting...</p><p>Mapping 5,000+ nodes in Neo4j.</p><p>Cross-referencing MedGemma reasoning chains for zero-shot hypothesis generation.</p>`
    };

    // 2. SVG PATH DATA & STATE
    const CLOSED_Y = 30;
    const OPEN_UP_Y = -10;
    const OPEN_LOW_Y = 70;
    const FOCUS_UP_Y = -18;
    const FOCUS_LOW_Y = 78;

    let state = {
        in_contact: false,
        active_section: 'hero-section',
        inactivityTimer: null,
        currentUpY: 30,
        currentLowY: 30,
        animating: false
    };

    function updateClip(upY, lowY) {
        eyeClipPath.setAttribute('d', `M 10 30 Q 50 ${upY} 90 30 Q 50 ${lowY} 10 30 Z`);
    }

    function morphLids(targetUpY, targetLowY, duration = 400) {
        const startUpY = state.currentUpY;
        const startLowY = state.currentLowY;
        const startTime = performance.now();

        function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            // Cubic easeInOut
            const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            state.currentUpY = startUpY + (targetUpY - startUpY) * ease;
            state.currentLowY = startLowY + (targetLowY - startLowY) * ease;
            
            eyeLidUpper.setAttribute('d', `M 10 30 Q 50 ${state.currentUpY} 90 30`);
            eyeLidLower.setAttribute('d', `M 10 30 Q 50 ${state.currentLowY} 90 30`);
            updateClip(state.currentUpY, state.currentLowY);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    // 3. SENTINEL CORE
    function openEye(isFocus = false) {
        if (!eyeContainer.classList.contains('open') || isFocus) {
            eyeContainer.classList.add('open');
            const up = isFocus ? FOCUS_UP_Y : OPEN_UP_Y;
            const low = isFocus ? FOCUS_LOW_Y : OPEN_LOW_Y;
            morphLids(up, low, 600);
        }
    }

    function closeEye() {
        if (eyeContainer.classList.contains('open')) {
            eyeContainer.classList.remove('open');
            morphLids(CLOSED_Y, CLOSED_Y, 600);
        }
    }

    function resetInactivityTimer() {
        clearTimeout(state.inactivityTimer);
        openEye(state.in_contact);
        state.inactivityTimer = setTimeout(closeEye, 3000);
    }

    // 4. PERIODIC BLINK
    function blink() {
        if (eyeContainer.classList.contains('open') && !state.animating) {
            // Momentary close
            const prevUp = state.in_contact ? FOCUS_UP_Y : OPEN_UP_Y;
            const prevLow = state.in_contact ? FOCUS_LOW_Y : OPEN_LOW_Y;
            
            morphLids(CLOSED_Y, CLOSED_Y, 300);

            // Reopen after delay
            setTimeout(() => {
                if (eyeContainer.classList.contains('open')) {
                    const up = state.in_contact ? FOCUS_UP_Y : OPEN_UP_Y;
                    const low = state.in_contact ? FOCUS_LOW_Y : OPEN_LOW_Y;
                    morphLids(up, low, 300);
                }
            }, 450);
        }
    }

    setInterval(blink, 5000);

    // 5. INTERACTION LISTENERS
    window.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        resetInactivityTimer();

        // Gaze with section-based bias
        const mouseXPercent = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const mouseYPercent = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

        const dampingLimit = state.in_contact ? 35 : 20;

        // Pupil damping logic (Purely relative to center)
        const trackX = (mouseXPercent * dampingLimit);
        const trackY = (mouseYPercent * 15);

        eyeTrack.style.transform = `translate(${trackX}px, ${trackY}px)`;
    });

    landingPage.addEventListener('scroll', resetInactivityTimer);

    // Deep-Dive Overlay Triggers
    document.querySelectorAll('.deep-dive-trigger').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            const projectId = btn.getAttribute('data-project');
            overlay.innerHTML = projectData[projectId] || "Log data inaccessible.";
            overlay.classList.add('active');
        });

        // Close when moving off button OR when moving mouse far
        btn.addEventListener('mouseleave', (e) => {
            // Optional: keep it open if moving toward overlay
            if (e.relatedTarget !== overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    overlay.addEventListener('mouseleave', () => {
        overlay.classList.remove('active');
    });

    // 5. INTERSECTION OBSERVER
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                state.active_section = entry.target.id;
                entry.target.classList.add('in-focus');

                if (entry.target.id !== 'hero-section') {
                    document.body.classList.add('scrolled');
                    scrollIndicator.classList.add('hidden');
                } else {
                    document.body.classList.remove('scrolled');
                    scrollIndicator.classList.remove('hidden');
                }

                if (entry.target.id === 'contact-section') {
                    state.in_contact = true;
                    document.body.classList.add('contact-active');
                    openEye(false); // Fix: Keep shape consistent
                } else {
                    state.in_contact = false;
                    document.body.classList.remove('contact-active');
                    if (eyeContainer.classList.contains('open')) openEye(false);
                }
            } else {
                entry.target.classList.remove('in-focus');
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.scroll-section').forEach(section => observer.observe(section));

    // 6. NODE INSPECT OVERLAY LOGIC
    const inspectOverlay = document.getElementById('inspect-overlay');
    const inspectInner = document.getElementById('inspect-inner-content');
    const inspectBackdrop = document.getElementById('inspect-backdrop');

    const inspectData = {
        resfit: `
            <h3 class="mono" style="margin-bottom: 2rem; color: var(--terminal-teal);">[ NODE_INSPECT_v3.0 ]</h3>
            <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 3rem;">
                <div>
                    <h4 class="mono" style="margin-bottom: 1rem;">KNOWLEDGE_GRAPH</h4>
                    <svg viewBox="0 0 200 200" style="width: 100%; max-width: 300px;">
                        <line x1="100" y1="100" x2="50" y2="50" class="connector" stroke-opacity="0.5" />
                        <line x1="100" y1="100" x2="150" y2="50" class="connector" stroke-opacity="0.5" />
                        <circle cx="100" cy="100" r="4" class="node-circle" />
                        <text x="110" y="105" class="node-label" style="font-size: 8px;">PRESCRIPTION_GATES</text>
                        <circle cx="50" cy="50" r="3" class="node-circle" />
                        <text x="10" y="45" class="node-label" style="font-size: 6px;">Schoenfeld_2016</text>
                        <circle cx="150" cy="50" r="3" class="node-circle" />
                        <text x="155" y="45" class="node-label" style="font-size: 6px;">Seiler_2010</text>
                    </svg>
                    <h4 class="mono" style="margin: 2rem 0 1rem;">THE_SCIENCE</h4>
                    <p style="font-size: 0.9rem; line-height: 1.6; color: var(--narrative-grey);">
                        Zone 2 Aerobic Base protocols derived from Seiler’s Polarized model. 
                        Hypertrophy volume capped at 20 sets/week to prevent CNS fatigue 
                        grounded in Schoenfeld’s 2017 meta-analysis.
                    </p>
                </div>
                <div>
                    <h4 class="mono" style="margin-bottom: 1rem;">LOGIC_MANIFEST (endurance.yaml)</h4>
                    <pre class="mono" style="background: rgba(0,0,0,0.3); padding: 1.5rem; border: 1px solid var(--card-border); color: var(--terminal-teal); font-size: 0.8rem;">
parameters:
  intensity:
    metric: RPE
    value: 4
    rir: null # No fatigue target for Z2
  tempo: "3010"
  cadence: 80-90
  rest: 0
                     </pre>
                    <h4 class="mono" style="margin: 2rem 0 1rem;">SAFETY_GUARDRAILS</h4>
                    <pre class="mono" style="background: rgba(255, 0, 0, 0.05); padding: 1.5rem; border: 1px solid rgba(255, 0, 0, 0.2); color: #ff5f5f; font-size: 0.75rem;">
def validate_science(verdict):
    if verdict not in ["GREEN", "YELLOW"]:
        raise HTTPException(status_code=403)
    return True
                    </pre>
                </div>
            </div>
        `,
        capabilities: `
            <h3 class="mono" style="margin-bottom: 2rem; color: var(--terminal-teal);">[ TECHNICAL_AUDIT_v1.0 ]</h3>
            <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 3rem;">
                <div>
                    <h4 class="mono" style="margin-bottom: 1rem;">SKILLS_GRAPH</h4>
                    <svg viewBox="0 0 200 200" style="width: 100%; max-width: 300px;">
                        <circle cx="100" cy="40" r="4" class="node-circle" />
                        <text x="110" y="45" class="node-label" style="font-size: 8px;">Python (Production)</text>
                        <line x1="100" y1="40" x2="100" y2="80" class="connector" />
                        <circle cx="100" cy="80" r="4" class="node-circle" />
                        <text x="110" y="85" class="node-label" style="font-size: 8px;">Agentic RAG</text>
                        <line x1="100" y1="80" x2="60" y2="120" class="connector" />
                        <circle cx="60" cy="120" r="4" class="node-circle" />
                        <text x="10" y="130" class="node-label" style="font-size: 8px;">Qdrant</text>
                        <line x1="100" y1="80" x2="140" y2="120" class="connector" />
                        <circle cx="140" cy="120" r="4" class="node-circle" />
                        <text x="150" y="130" class="node-label" style="font-size: 8px;">LiveKit/Cerebras</text>
                    </svg>
                    <h4 class="mono" style="margin: 2rem 0 1rem;">DETERMINISTIC_RAG</h4>
                    <p style="font-size: 0.9rem; line-height: 1.6; color: var(--narrative-grey);">
                        Designing systems where LLMs audit peer-reviewed science (YAML manifests) 
                        rather than generating novel science, ensuring 100% citation grounding.
                    </p>
                </div>
                <div>
                    <h4 class="mono" style="margin-bottom: 1rem;">THE_INVISIBLE_TOOLKIT</h4>
                    <div class="mono" style="font-size: 0.8rem; border-left: 2px solid var(--terminal-teal); padding-left: 1rem;">
                        <p style="margin-bottom: 1rem;">[ ORCHESTRATION ]<br>9-node state machines in LangGraph for recursive self-correction.</p>
                        <p style="margin-bottom: 1rem;">[ INFRASTRUCTURE ]<br>Azure, SSL/Reverse Proxy, Linux service migrations.</p>
                        <p style="margin-bottom: 1rem;">[ WORKFLOW ]<br>OpenCode local dev for persistent memory across long coding sessions.</p>
                    </div>
                </div>
            </div>
        `,
        industrial: `
            <h3 class="mono" style="margin-bottom: 2rem; color: var(--terminal-teal);">[ PRODUCTION_AUDIT_v5.0 ]</h3>
            <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 3rem;">
                <div>
                    <h4 class="mono" style="margin-bottom: 1rem;">VOICE_BACKBONE</h4>
                    <svg viewBox="0 0 200 200" style="width: 100%; max-width: 300px;">
                        <circle cx="40" cy="100" r="4" class="node-circle" />
                        <text x="10" y="90" class="node-label" style="font-size: 8px;">Twilio (SIP)</text>
                        <line x1="40" y1="100" x2="100" y2="100" class="connector" />
                        <circle cx="100" cy="100" r="4" class="node-circle" />
                        <text x="80" y="115" class="node-label" style="font-size: 8px;">LiveKit (WebRTC)</text>
                        <line x1="100" y1="100" x2="160" y2="100" class="connector" />
                        <circle cx="160" cy="100" r="4" class="node-circle" />
                        <text x="140" y="90" class="node-label" style="font-size: 8px;">Cerebras Llama3.1</text>
                    </svg>
                    <h4 class="mono" style="margin: 2rem 0 1rem;">LATENCY_ENGINEERING</h4>
                    <p style="font-size: 0.9rem; line-height: 1.6; color: var(--narrative-grey);">
                        Technical breakdown: VAD-based interruption handling and provider 
                        pre-warming strategies that achieved human-like sub-400ms cadence.
                    </p>
                </div>
                <div>
                    <h4 class="mono" style="margin-bottom: 1rem;">INFRASTRUCTURE_MANIFEST</h4>
                    <div class="mono" style="font-size: 0.8rem; border-left: 2px solid var(--terminal-teal); padding-left: 1rem;">
                        <p style="margin-bottom: 1rem;">[ SOVEREIGNTY ]<br>Runtime-resolved layer for hot-swapping STT/LLM/TTS providers with 0ms downtime.</p>
                        <p style="margin-bottom: 1rem;">[ CLOUD_HARDENING ]<br>Azure Linux migration, containerization, and SSL/Reverse Proxy hardening.</p>
                        <p style="margin-bottom: 1rem;">[ GUARDED_RAG ]<br>Secondary backend-controlled LLM layer for document context verification.</p>
                    </div>
                </div>
            </div>
        `
    };

    document.querySelectorAll('.inspect-trigger').forEach(trigger => {
        trigger.addEventListener('mouseenter', () => {
            const project = trigger.getAttribute('data-project');
            inspectInner.innerHTML = inspectData[project] || "Data missing.";
            inspectOverlay.classList.add('active');
            inspectBackdrop.classList.add('active');
            landingPage.style.overflowY = 'hidden';
        });
    });

    window.addEventListener('mousemove', (e) => {
        if (inspectOverlay.classList.contains('active')) {
            const xPercent = e.clientX / window.innerWidth;
            const yPercent = e.clientY / window.innerHeight;

            if (xPercent < 0.1 || xPercent > 0.9 || yPercent < 0.1 || yPercent > 0.9) {
                inspectOverlay.classList.remove('active');
                inspectBackdrop.classList.remove('active');
                landingPage.style.overflowY = 'auto';
            }
        }
    });

    // Init
    morphLids(CLOSED_Y, CLOSED_Y, 0);
});
