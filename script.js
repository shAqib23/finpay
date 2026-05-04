document.addEventListener("DOMContentLoaded", () => {
    // PillNav Logic
    if (typeof gsap !== 'undefined') {
        const ease = 'power3.easeOut';
        const pills = document.querySelectorAll('.pill');
        const tlRefs = [];
        const activeTweenRefs = [];
        
        const layoutPills = () => {
            pills.forEach((pill, index) => {
                const circle = pill.querySelector('.hover-circle');
                const label = pill.querySelector('.pill-label');
                const white = pill.querySelector('.pill-label-hover');
                
                if (!circle) return;

                const rect = pill.getBoundingClientRect();
                const w = rect.width;
                const h = rect.height;
                const R = ((w * w) / 4 + h * h) / (2 * h);
                const D = Math.ceil(2 * R) + 2;
                const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
                const originY = D - delta;

                circle.style.width = `${D}px`;
                circle.style.height = `${D}px`;
                circle.style.bottom = `-${delta}px`;

                gsap.set(circle, {
                    xPercent: -50,
                    scale: 0,
                    transformOrigin: `50% ${originY}px`
                });

                if (label) gsap.set(label, { y: 0 });
                if (white) gsap.set(white, { y: h + 12, opacity: 0 });

                if (tlRefs[index]) tlRefs[index].kill();
                const tl = gsap.timeline({ paused: true });

                tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

                if (label) {
                    tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
                }

                if (white) {
                    gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
                    tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
                }

                tlRefs[index] = tl;
                
                pill.onmouseenter = () => {
                    if (activeTweenRefs[index]) activeTweenRefs[index].kill();
                    activeTweenRefs[index] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' });
                };
                pill.onmouseleave = () => {
                    if (activeTweenRefs[index]) activeTweenRefs[index].kill();
                    activeTweenRefs[index] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' });
                };
            });
        };

        layoutPills();
        window.addEventListener('resize', layoutPills);
        if (document.fonts?.ready) {
            document.fonts.ready.then(layoutPills).catch(() => {});
        }

        // Logo Animation
        const pillLogo = document.getElementById('pill-logo');
        const pillLogoImg = document.getElementById('pill-logo-img');
        let logoTweenRef = null;
        if (pillLogo && pillLogoImg) {
            pillLogo.onmouseenter = () => {
                if (logoTweenRef) logoTweenRef.kill();
                gsap.set(pillLogoImg, { rotate: 0 });
                logoTweenRef = gsap.to(pillLogoImg, { rotate: 360, duration: 0.5, ease, overwrite: 'auto' });
            };
        }

        // Mobile Menu
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        let isMobileMenuOpen = false;

        if (hamburgerBtn && mobileMenu) {
            gsap.set(mobileMenu, { visibility: 'hidden', opacity: 0, scaleY: 1 });
            
            hamburgerBtn.onclick = () => {
                isMobileMenuOpen = !isMobileMenuOpen;
                const lines = hamburgerBtn.querySelectorAll('.hamburger-line');
                
                if (isMobileMenuOpen) {
                    gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
                    gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
                    
                    gsap.set(mobileMenu, { visibility: 'visible' });
                    gsap.fromTo(mobileMenu, 
                        { opacity: 0, y: 10, scaleY: 1 },
                        { opacity: 1, y: 0, scaleY: 1, duration: 0.3, ease, transformOrigin: 'top center' }
                    );
                } else {
                    gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
                    gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
                    
                    gsap.to(mobileMenu, {
                        opacity: 0, y: 10, scaleY: 1, duration: 0.2, ease, transformOrigin: 'top center',
                        onComplete: () => gsap.set(mobileMenu, { visibility: 'hidden' })
                    });
                }
            };

            const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
            mobileLinks.forEach(link => {
                link.onclick = () => {
                    if (isMobileMenuOpen) hamburgerBtn.click();
                };
            });
        }

        // Initial Load Animation
        const navItems = document.getElementById('pill-nav-items');
        if (pillLogo) {
            gsap.set(pillLogo, { scale: 0 });
            gsap.to(pillLogo, { scale: 1, duration: 0.6, ease });
        }
        if (navItems) {
            gsap.set(navItems, { width: 0, overflow: 'hidden' });
            gsap.to(navItems, { width: 'auto', duration: 0.6, ease });
        }
    }

    // 0. Scroll-Linked Layout Transitions
    const mainLogo = document.getElementById('MainLogo');
    const storyCard = document.getElementById('StoryCard');
    const heroBg = document.querySelector('.hero-bg-layer');

    window.addEventListener('scroll', () => {
        const scrollThreshold = 100; // Trigger after 100px scroll
        const scrollPos = window.scrollY;

        // Logo and Story Card Transitions
        if (scrollPos > scrollThreshold) {
            mainLogo.classList.add('scrolled');
            storyCard.classList.add('revealed');
        } else {
            mainLogo.classList.remove('scrolled');
            storyCard.classList.remove('revealed');
        }

        // High-Quality transition out of hero background (jars and spices) when moving towards About section
        if (scrollPos > window.innerHeight * 0.4) {
            heroBg.classList.add('faded');
        } else {
            heroBg.classList.remove('faded');
        }

        // High-Quality transition out of frozen background when moving towards Contact section
        const frozenBg = document.querySelector('.frozen-collection');
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const contactTop = contactSection.getBoundingClientRect().top;
            if (contactTop < window.innerHeight * 0.6) {
                frozenBg.classList.add('faded');
            } else {
                frozenBg.classList.remove('faded');
            }
        }
    });

    // 1. Theme Switcher and Background Morpher
    const productSuite = document.getElementById('products');
    const cards = document.querySelectorAll('.product-card');

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // Store auto-flip timeout per card so we can cancel it on manual tap
    const cardTimers = new Map();

    cards.forEach(card => {
        let isProcessing = false;

        const flipCard = (e) => {
            if (e) e.stopPropagation();
            if (isProcessing) return;
            isProcessing = true;

            // Cancel any pending auto-flip-back timer when user manually interacts
            if (cardTimers.has(card)) {
                clearTimeout(cardTimers.get(card));
                cardTimers.delete(card);
            }
            
            card.classList.toggle('flipped');
            
            // Re-enable after transition completes
            setTimeout(() => { isProcessing = false; }, 300);
        };

        // Unified click handler handles touch and mouse correctly on modern browsers
        card.addEventListener('click', flipCard);
        
        // Desktop-only hover reset
        if (!isMobile) {
            card.addEventListener('mouseleave', () => {
                if (cardTimers.has(card)) return; // Don't interfere with auto-timer
                card.classList.remove('flipped');
            });
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

        // Unified click for both mobile and desktop
        card.addEventListener('click', (e) => {
            e.stopPropagation();
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

        // --- Vanilla JS CardSwap Logic ---
        const swapCards = Array.from(document.querySelectorAll('.swap-card'));
        const container = document.getElementById('frozen-card-swap');
        
        if (swapCards.length > 0 && container) {
            const cardDistance = 60;
            const verticalDistance = 70;
            const delay = 5000;
            const skewAmount = 6;
            
            const makeSlot = (i, distX, distY, total) => ({
                x: i * distX,
                y: -i * distY,
                z: -i * distX * 1.5,
                zIndex: total - i
            });
            
            const placeNow = (el, slot, skew) => {
                gsap.set(el, {
                    x: slot.x,
                    y: slot.y,
                    z: slot.z,
                    xPercent: -50,
                    yPercent: -50,
                    skewY: skew,
                    transformOrigin: 'center center',
                    zIndex: slot.zIndex,
                    force3D: true
                });
            };

            const config = {
                ease: 'elastic.out(0.6,0.9)',
                durDrop: 2,
                durMove: 2,
                durReturn: 2,
                promoteOverlap: 0.9,
                returnDelay: 0.05
            };

            let order = swapCards.map((_, i) => i);
            const total = swapCards.length;
            
            // Initialize positions
            swapCards.forEach((card, i) => placeNow(card, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

            let isSwapping = false;
            let currentTl = null;

            const swap = () => {
                if (order.length < 2 || isSwapping) return;
                isSwapping = true;

                const front = order[0];
                const rest = order.slice(1);
                const elFront = swapCards[front];
                
                const tl = gsap.timeline({
                    onComplete: () => {
                        order = [...rest, front];
                        isSwapping = false;
                    }
                });
                
                currentTl = tl;

                tl.to(elFront, {
                    y: '+=500',
                    duration: config.durDrop,
                    ease: config.ease
                });

                tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
                
                rest.forEach((idx, i) => {
                    const el = swapCards[idx];
                    const slot = makeSlot(i, cardDistance, verticalDistance, total);
                    tl.set(el, { zIndex: slot.zIndex }, 'promote');
                    tl.to(el, {
                        x: slot.x,
                        y: slot.y,
                        z: slot.z,
                        duration: config.durMove,
                        ease: config.ease
                    }, `promote+=${i * 0.15}`);
                });

                const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
                tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
                tl.call(() => {
                    gsap.set(elFront, { zIndex: backSlot.zIndex });
                }, undefined, 'return');
                
                tl.to(elFront, {
                    x: backSlot.x,
                    y: backSlot.y,
                    z: backSlot.z,
                    duration: config.durReturn,
                    ease: config.ease
                }, 'return');
            };

            let swapInterval = setInterval(swap, delay);
            
            // Allow clicking to swap immediately
            container.addEventListener('click', () => {
                clearInterval(swapInterval);
                if (currentTl && isSwapping) {
                    currentTl.progress(1); // fast forward current swap if any
                }
                swap();
                swapInterval = setInterval(swap, delay);
            });
            
            // Pause on hover
            container.addEventListener('mouseenter', () => {
                if(currentTl) currentTl.pause();
                clearInterval(swapInterval);
            });
            container.addEventListener('mouseleave', () => {
                if(currentTl) currentTl.play();
                swapInterval = setInterval(swap, delay);
            });
        }

        animate();
    }
});
