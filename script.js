document.addEventListener('DOMContentLoaded', () => {
    const eyeHitbox = document.getElementById('eye-hitbox');
    const eyeContainer = document.getElementById('eye-container');
    const eyeLidUpper = document.querySelector('.eye-lid-upper');
    const eyeLidLower = document.querySelector('.eye-lid-lower');
    const eyeTrack = document.querySelector('.eye-track');
    const mainName = document.querySelector('.main-name');
    const pitchContainer = document.querySelector('.pitch-container');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const cards = document.querySelectorAll('.project-card');
    const cursor = document.querySelector('.cursor');

    // SVG path data
    const CLOSED = "M 10 30 Q 50 30 90 30";
    const OPEN_UPPER = "M 10 30 Q 50 -10 90 30";
    const OPEN_LOWER = "M 10 30 Q 50 70 90 30";

    // Set initial state
    eyeLidUpper.setAttribute('d', CLOSED);
    eyeLidLower.setAttribute('d', CLOSED);

    // 1. Mouse Interactions (Cursor & Pupil)
    window.addEventListener('mousemove', (e) => {
        // Move Custom Cursor
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        // Eye Opening (Hitbox proximity)
        const rect = eyeHitbox.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const distance = Math.sqrt(dx*dx + dy*dy);

        const isNear = distance < 450;

        if (isNear) {
            eyeContainer.classList.add('open');
            eyeLidUpper.setAttribute('d', OPEN_UPPER);
            eyeLidLower.setAttribute('d', OPEN_LOWER);
        } else {
            eyeContainer.classList.remove('open');
            eyeLidUpper.setAttribute('d', CLOSED);
            eyeLidLower.setAttribute('d', CLOSED);
        }

        // Pupil Gaze Tracking (Always follows)
        const mouseXPercent = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const mouseYPercent = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        
        const maxDisplayX = 18;
        const maxDisplayY = 12;
        eyeTrack.style.transform = `translate(${mouseXPercent * maxDisplayX}px, ${mouseYPercent * maxDisplayY}px)`;
    });

    // 2. Scroll Interactions
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // --- A. Dynamic Name Movement ---
        // Scroll from 0 to 400px transitions name from 65vh to 3rem
        const nameTransitionLimit = 400;
        const nameProgress = Math.min(scrollY / nameTransitionLimit, 1);
        
        // Update positions via style for sub-pixel smoothness
        const initialTop = 65; // vh
        const targetTop = 3;  // rem
        const currentTop = 65 - (nameProgress * (65 - 3)); 
        
        // Instead of calculating vh/rem conversion manually, we transition to a class for the landing state
        // but use JS for the interpolation if you want it to be perfectly smooth.
        if (nameProgress > 0.05) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }

        // --- B. Pitch Section Reveal ---
        // Reveal between 400px and 1000px
        const pitchStart = 200;
        const pitchEnd = 800;
        if (scrollY > pitchStart) {
            pitchContainer.classList.add('visible');
            scrollIndicator.classList.add('hidden');
        } else {
            pitchContainer.classList.remove('visible');
            scrollIndicator.classList.remove('hidden');
        }

        // --- C. Orbital Cards ---
        const orbitStart = 1000;
        const orbitProgress = Math.min(Math.max((scrollY - orbitStart) / windowHeight, 0), 1);
        const orbitRadius = 400 * orbitProgress;

        if (orbitProgress > 0.01) {
            pitchContainer.classList.add('faded'); // Fade pitch as cards appear
        } else {
            pitchContainer.classList.remove('faded');
        }

        cards.forEach((card, i) => {
            const angle = parseInt(card.style.getPropertyValue('--angle'));
            const radians = (angle * Math.PI) / 180;
            
            const x = Math.cos(radians) * orbitRadius;
            const y = Math.sin(radians) * orbitRadius;
            
            card.style.left = `calc(50% + ${x}px)`;
            card.style.top = `calc(50% + ${y}px)`;
            
            if (orbitProgress > (i * 0.1)) {
                card.style.opacity = orbitProgress * 1.5;
                card.style.transform = `translate(-50%, -50%) scale(${0.7 + orbitProgress * 0.3})`;
            } else {
                card.style.opacity = '0';
            }
        });
    });

    // Initial Trigger
    window.dispatchEvent(new Event('scroll'));
});
