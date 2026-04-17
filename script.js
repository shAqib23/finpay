document.addEventListener("DOMContentLoaded", () => {
    // 1. Theme Switcher and Background Morpher
    const productSuite = document.getElementById('products');
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const theme = card.getAttribute('data-target-theme');
            productSuite.setAttribute('data-theme', theme);
        });

        card.addEventListener('mouseleave', () => {
            productSuite.setAttribute('data-theme', 'default');
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
