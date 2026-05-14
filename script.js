/**
 * Cyber Aesthetics Script: 3D Tilt, Magnetic Hover, Custom Cursor
 */

document.addEventListener('DOMContentLoaded', () => {

    // Check if on touch device (disable custom cursor/tilt on mobile for perf)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    // ==========================================
    // 1. Mobile Navigation Toggle
    // ==========================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.figma-navbar');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(5, 5, 8, 0.95)';
                navLinks.style.padding = '20px';
                mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
            }
        });
    }

    // ==========================================
    // 2. Smooth Scroll to Sections
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // ==========================================
    // 3. Custom Cursor Logic (Desktop Only)
    // ==========================================
    if (!isTouchDevice) {
        const cursor = document.querySelector('.custom-cursor');
        const follower = document.querySelector('.custom-cursor-follower');

        // Update position
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Immediate update for dot
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        });

        // Smooth follow loop for the ring
        const renderFollower = () => {
            followerX += (mouseX - followerX) * 0.1; // lower means more delay/smoother
            followerY += (mouseY - followerY) * 0.1;
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(renderFollower);
        };
        renderFollower();

        // Hover States
        const hoverTargets = document.querySelectorAll('.hover-target, .hover-link, button, a');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursor.classList.add('hover-active');
                follower.classList.add('hover-active');
            });
            target.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover-active');
                follower.classList.remove('hover-active');
            });
        });
    }

    // ==========================================
    // 4. 3D Tilt Effect on Cards
    // ==========================================
    if (!isTouchDevice) {
        const tiltCards = document.querySelectorAll('.tilt-card');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x pos within the element
                const y = e.clientY - rect.top;  // y pos within the element

                // Calculate rotation (max 10 degrees)
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none'; // remove transition for immediate tracking
            });
        });
    }

    // ==========================================
    // 5. Magnetic Buttons
    // ==========================================
    if (!isTouchDevice) {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = (e.clientX - rect.left) - rect.width / 2;
                const y = (e.clientY - rect.top) - rect.height / 2;

                // Pull button slightly towards mouse
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    // ==========================================
    // 6. Hero Headline Parallax Tracking
    // ==========================================
    if (!isTouchDevice) {
        const heroSection = document.querySelector('.hero-bg-container');
        const heroHeadline = document.querySelector('.hero-headline');

        if (heroSection && heroHeadline) {
            document.addEventListener('mousemove', (e) => {
                // Only track if we are somewhat near the top of the page for performance
                if (window.scrollY > window.innerHeight) return;

                const xAxis = (window.innerWidth / 2 - e.pageX) / 40; // Max rotation ~ 25deg
                const yAxis = (window.innerHeight / 2 - e.pageY) / 40;

                // Add a subtle translation to make it feel floating
                const moveX = (window.innerWidth / 2 - e.pageX) / 80;
                const moveY = (window.innerHeight / 2 - e.pageY) / 80;

                heroHeadline.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg) translate3d(${moveX}px, ${moveY}px, 0)`;
            });

            // Reset when leaving window
            document.addEventListener('mouseleave', () => {
                heroHeadline.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translate3d(0,0,0)`;
                // The transition is handled by CSS
            });
        }
    }

    // ==========================================
    // 7. Scroll Animation (Intersection Observer)
    // ==========================================
    const animateElements = document.querySelectorAll('.animate-up, .slide-in-left, .slide-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                if (entry.target.classList.contains('stat-card')) {
                    startCounters(entry.target);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // ==========================================
    // 7. Stat Number Counter
    // ==========================================
    function startCounters(statElement) {
        const numberEl = statElement.querySelector('.stat-num');
        if (!numberEl) return;

        const target = parseInt(numberEl.getAttribute('data-target'), 10);
        const duration = 2000;
        const steps = 50;
        const stepTime = Math.abs(Math.floor(duration / steps));

        let current = 0;
        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;

            if (current >= target) {
                numberEl.innerText = target;
                if (target === 100) {
                    numberEl.innerText = target + '%';
                }
                clearInterval(timer);
            } else {
                numberEl.innerText = Math.ceil(current);
            }
        }, stepTime);
    }

    // ==========================================
    // 8. Active Navigation State
    // ==========================================
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - navbar.offsetHeight - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // ==========================================
    // 9. Theme Switcher (Light/Dark Mode)
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        });
    }

    // ==========================================
    // 10. GSAP Cinematic Timeline Scroll
    // ==========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const timelineSection = document.querySelector('.timeline-section');
        const timelineProgress = document.querySelector('.timeline-progress');
        const timelineItems = document.querySelectorAll('.timeline-item');

        if (timelineSection && timelineProgress && timelineItems.length > 0) {
            // Animate the central progress line
            gsap.to(timelineProgress, {
                height: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: '.timeline-wrapper',
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 0.5
                }
            });

            // Animate each timeline item
            timelineItems.forEach((item, i) => {
                const isLeft = item.classList.contains('left');
                // The prompt specified "odd projects fly in from the left, even from the right"
                // The HTML already assigns .left to project 1 and 3, .right to 2 and 4.
                // If it's left, animate from X = -150, else X = 150
                const xOffset = isLeft ? -150 : 150;
                // Slight rotation that corrects to flat
                const rotateOffset = isLeft ? -15 : 15;
                
                // Set initial states for GSAP
                gsap.set(item, {
                    x: xOffset,
                    opacity: 0,
                    rotationY: rotateOffset,
                    transformPerspective: 1000
                });

                gsap.to(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 80%', // when top of item hits 80% down viewport
                        toggleClass: 'is-active' // Toggles the glowing dot CSS
                    },
                    x: 0,
                    opacity: 1,
                    rotationY: 0,
                    duration: 1.2,
                    ease: 'elastic.out(1, 0.75)' // Subtle spring bounce
                });
            });
        }
    }
});

// ==========================================
// 11. About & Contact — Scroll Reveal + Form
// ==========================================
(function () {
    // Scroll reveal
    const revealEls = document.querySelectorAll('.scroll-reveal, .scroll-reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));

    // Contact form — Supabase REST API
    const SUPABASE_URL = 'https://wyhicxzawccvckstmapl.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5aGljeHphd2NjdmNrc3RtYXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTExMDYsImV4cCI6MjA4ODU2NzEwNn0.lS-0Lzv-BWw_i7yTAl_ueXCNpZbG7CVFFJLIgcxJsUI';

    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('cf-name').value.trim();
            const email = document.getElementById('cf-email').value.trim();
            const message = document.getElementById('cf-message').value.trim();
            const btnText = document.getElementById('cf-btn-text');
            const spinner = document.getElementById('cf-spinner');
            const submitBtn = document.getElementById('cf-submit');

            // Loading state
            btnText.style.display = 'none';
            spinner.style.display = 'inline';
            submitBtn.disabled = true;

            try {
                await fetch(`${SUPABASE_URL}/rest/v1/contact_requests`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                // Show success
                form.style.display = 'none';
                document.getElementById('contact-success').style.display = 'flex';

            } catch (err) {
                console.error(err);
                btnText.style.display = 'inline';
                spinner.style.display = 'none';
                submitBtn.disabled = false;
                alert('Something went wrong. Please try again.');
            }
        });
    }
})();
