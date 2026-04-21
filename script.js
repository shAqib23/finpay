document.addEventListener("DOMContentLoaded", () => {
    // 1. Theme Switcher and Background Morpher
    const productSuite = document.getElementById('products');
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        // Explicity toggle flip class for consistent mobile tapping
        card.addEventListener('click', () => {
            card.setAttribute('data-interacted', 'true'); // Flag manual touch override
            card.classList.toggle('flipped');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('flipped'); // Safety reset
        });
    });

    // 2. Mobile Auto-Flip Intersection Observer
    if (window.matchMedia("(max-width: 768px)").matches) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Only auto-flip if the user hasn't explicitly tapped it yet
                if (!entry.target.hasAttribute('data-interacted')) {
                    if (entry.isIntersecting) {
                        // Dynamically flip to reveal the back when scrolled into focus
                        entry.target.classList.add('flipped');
                    } else {
                        // Reset it quietly when scrolling away
                        entry.target.classList.remove('flipped');
                    }
                }
            });
        }, { threshold: 0.6 }); // Trigger exactly when 60% of the card crosses into the screen

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

        // Safe Mobile tap interaction binding
        card.addEventListener('click', () => {
            card.parentElement.classList.toggle('flipped');
        });
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
