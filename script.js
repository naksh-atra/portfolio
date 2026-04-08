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

    // 2. SVG PATH DATA
    const CLOSED = "M 10 30 Q 50 30 90 30";
    const OPEN_UPPER = "M 10 30 Q 50 -10 90 30";
    const OPEN_LOWER = "M 10 30 Q 50 70 90 30";
    const FOCUS_UPPER = "M 10 30 Q 50 -18 90 30";
    const FOCUS_LOWER = "M 10 30 Q 50 78 90 30";

    function updateClip(up, low) {
        // Construct closed loop for the clipPath: Upper + Lower (reversed)
        // Upper: M 10 30 Q 50 {up} 90
        // Lower: Q 50 {low} 10 Z
        const upParts = up.split(/\s+/);
        const lowParts = low.split(/\s+/);
        const upY = upParts[5];
        const lowY = lowParts[5];
        // Fixed: Added missing Y coordinates (30) for the end points of the Q curves
        eyeClipPath.setAttribute('d', `M 10 30 Q 50 ${upY} 90 30 Q 50 ${lowY} 10 30 Z`);
    }

    let state = {
        in_contact: false,
        active_section: 'hero-section',
        inactivityTimer: null
    };

    // 3. SENTINEL CORE
    function openEye(isFocus = false) {
        if (!eyeContainer.classList.contains('open') || isFocus) {
            eyeContainer.classList.add('open');
            const upper = isFocus ? FOCUS_UPPER : OPEN_UPPER;
            const lower = isFocus ? FOCUS_LOWER : OPEN_LOWER;
            eyeLidUpper.setAttribute('d', upper);
            eyeLidLower.setAttribute('d', lower);
            updateClip(upper, lower);
        }
    }

    function closeEye() {
        if (eyeContainer.classList.contains('open')) {
            eyeContainer.classList.remove('open');
            eyeLidUpper.setAttribute('d', CLOSED);
            eyeLidLower.setAttribute('d', CLOSED);
            updateClip(CLOSED, CLOSED);
        }
    }

    function resetInactivityTimer() {
        clearTimeout(state.inactivityTimer);
        openEye(state.in_contact);
        state.inactivityTimer = setTimeout(closeEye, 3000);
    }

    // 4. INTERACTION LISTENERS
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
                    openEye(true);
                } else {
                    state.in_contact = false;
                    if (eyeContainer.classList.contains('open')) openEye(false);
                }
            } else {
                entry.target.classList.remove('in-focus');
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.scroll-section').forEach(section => observer.observe(section));

    // Init
    eyeLidUpper.setAttribute('d', CLOSED);
    eyeLidLower.setAttribute('d', CLOSED);
    updateClip(CLOSED, CLOSED);
});
