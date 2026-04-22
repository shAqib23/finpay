document.addEventListener("DOMContentLoaded", () => {
    // 0. Scroll-Linked Layout Transitions
    const mainLogo = document.getElementById('MainLogo');
    const storyCard = document.getElementById('StoryCard');

    window.addEventListener('scroll', () => {
        const scrollThreshold = 100; // Trigger after 100px scroll
        if (window.scrollY > scrollThreshold) {
            mainLogo.classList.add('scrolled');
            storyCard.classList.add('revealed');
        } else {
            mainLogo.classList.remove('scrolled');
            storyCard.classList.remove('revealed');
        }
    });

    // 1. Theme Switcher and Background Morpher
    const productSuite = document.getElementById('products');
    const cards = document.querySelectorAll('.product-card');

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // Store auto-flip timeout per card so we can cancel it on manual tap
    const cardTimers = new Map();

    cards.forEach(card => {
        const flipCard = () => {
            // Cancel any pending auto-flip-back timer when user manually taps
            if (cardTimers.has(card)) {
                clearTimeout(cardTimers.get(card));
                cardTimers.delete(card);
            }
            card.classList.toggle('flipped');
        };

        if (isMobile) {
            // Precise touch: only flip if finger didn't move (not a scroll)
            let touchMoved = false;
            card.addEventListener('touchstart', () => { touchMoved = false; }, { passive: true });
            card.addEventListener('touchmove', () => { touchMoved = true; }, { passive: true });
            card.addEventListener('touchend', (e) => {
                if (!touchMoved) {
                    e.stopPropagation();
                    flipCard();
                }
            });
        } else {
            card.addEventListener('click', (e) => { e.stopPropagation(); flipCard(); });
            card.addEventListener('mouseleave', () => { card.classList.remove('flipped'); });
        }
    });

    // Mobile: auto-flip once on scroll-into-view, then flip back, user can override anytime
    if (isMobile) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.hasAttribute('data-auto-flipped')) {
                    entry.target.setAttribute('data-auto-flipped', 'true');
                    entry.target.classList.add('flipped');
                    // Schedule auto-flip-back, store timer so tap can cancel it
                    const tid = setTimeout(() => {
                        entry.target.classList.remove('flipped');
                        cardTimers.delete(entry.target);
                    }, 1400);
                    cardTimers.set(entry.target, tid);
                }
            });
        }, { threshold: 0.55 });

        cards.forEach(card => observer.observe(card));
    }


    // 1b. Frozen Cards 3D Tilt Hover Logic

    const frozenCards = document.querySelectorAll('.frozen-card-inner');
    frozenCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Calculate organic tilt 
            const tiltX = -(y / rect.height) * 15; // Max 15deg
            const tiltY = (x / rect.width) * 15;
            
            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.parentElement.classList.remove('flipped'); // Safety for mobile emulated states
        });

        // Mobile tap on frozen card — stop propagation to avoid triggering product card
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            card.parentElement.classList.toggle('flipped');
        });
        if (isMobile) {
            let ft = false;
            card.addEventListener('touchstart', () => { ft = false; }, { passive: true });
            card.addEventListener('touchmove', () => { ft = true; }, { passive: true });
            card.addEventListener('touchend', (e) => {
                if (!ft) {
                    e.stopPropagation();
                    card.parentElement.classList.toggle('flipped');
                }
            });
        }
    });

    // 3. Parallax Canvas Particles setup
    const canvas = document.getElementById('particles-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 60; // Slightly reduced for performance, yet enough for parallax

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                baseY: Math.random() * (height + 200) - 100, // Extend bounds for parallax
                parallaxFactor: Math.random() * 0.6 + 0.1
            });
        }

        let scrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        });

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            // Smoothen color transition by picking standard theme colors directly
            let currentTheme = productSuite.getAttribute('data-theme');
            let particleColor = 'rgba(150, 150, 150, 0.4)';
            
            if (currentTheme === 'cardamom') particleColor = 'rgba(107, 142, 35, 0.5)';
            else if (currentTheme === 'pepper') particleColor = 'rgba(212, 175, 55, 0.5)';
            else if (currentTheme === 'honey') particleColor = 'rgba(184, 115, 51, 0.5)';
            else particleColor = 'rgba(150, 150, 150, 0.4)';
            
            ctx.fillStyle = particleColor;

            particles.forEach(p => {
                p.x += p.vx;
                p.baseY += p.vy;

                // Wrap horizontally
                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;
                
                // Wrap vertically base
                if (p.baseY < -200) p.baseY = height + 200;
                if (p.baseY > height + 200) p.baseY = -200;

                // Parallax adjustment
                p.y = p.baseY - (scrollY * p.parallaxFactor);

                // Re-wrap effective Y nicely
                let effectiveY = p.y % (height + 400);
                if(effectiveY < -200) effectiveY += (height + 400);

                ctx.beginPath();
                ctx.arc(p.x, effectiveY, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }
});
