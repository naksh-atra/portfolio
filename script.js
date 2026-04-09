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

    // 6. NODE INSPECT OVERLAY LOGIC
    const inspectTrigger = document.getElementById('inspect-resfit');
    const inspectOverlay = document.getElementById('inspect-overlay');
    const inspectBackdrop = document.getElementById('inspect-backdrop');

    if (inspectTrigger && inspectOverlay && inspectBackdrop) {
        inspectTrigger.addEventListener('mouseenter', () => {
            inspectOverlay.classList.add('active');
            inspectBackdrop.classList.add('active');
            landingPage.style.overflowY = 'hidden';
        });

        window.addEventListener('mousemove', (e) => {
            if (inspectOverlay.classList.contains('active')) {
                const xPercent = e.clientX / window.innerWidth;
                const yPercent = e.clientY / window.innerHeight;

                // Close if in 10% "Dead Zone" (outside 80% center rectangle)
                if (xPercent < 0.1 || xPercent > 0.9 || yPercent < 0.1 || yPercent > 0.9) {
                    inspectOverlay.classList.remove('active');
                    inspectBackdrop.classList.remove('active');
                    landingPage.style.overflowY = 'auto';
                }
            }
        });
    }

    // Init
    morphLids(CLOSED_Y, CLOSED_Y, 0);
});
