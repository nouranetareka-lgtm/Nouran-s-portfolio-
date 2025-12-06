// ============================================
// FUTURISTIC PORTFOLIO - INTERACTIVE SCRIPTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initParticleNetwork();
    initNavigation();
    initScrollAnimations();
    initTypingEffect();
    initLanguageBars();
    initHoverEffects();
});

// ============================================
// FANCY PARTICLE NETWORK SYSTEM
// ============================================

function initParticleNetwork() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Track mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.baseSize = this.size;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.baseOpacity = this.opacity;
        }
        
        update() {
            // Move particle
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
            
            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.size = this.baseSize + force * 3;
                    this.opacity = Math.min(1, this.baseOpacity + force * 0.5);
                } else {
                    this.size = this.baseSize;
                    this.opacity = this.baseOpacity;
                }
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
            
            // Add glow effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        }
    }
    
    // Create particles
    function createParticles() {
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        particles = [];
        for (let i = 0; i < Math.min(particleCount, 120); i++) {
            particles.push(new Particle());
        }
    }
    
    createParticles();
    window.addEventListener('resize', createParticles);
    
    // Draw connections
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.3;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            
            // Connect to mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - particles[i].x;
                const dy = mouse.y - particles[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const opacity = (1 - distance / mouse.radius) * 0.6;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Reset shadow for connections
        ctx.shadowBlur = 0;
        drawConnections();
        
        // Draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in class to elements
    const animatedElements = document.querySelectorAll(
        '.section-header, .about-text, .languages-grid, .timeline-item, ' +
        '.edu-card, .activity-category, .achievement-card, .contact-info'
    );
    
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.classList.add(`stagger-${(index % 5) + 1}`);
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrolled = window.scrollY;
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = 1 - (scrolled * 0.002);
        }
    });
}

// ============================================
// TYPING EFFECT
// ============================================

function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    const texts = [
        'Contract Manager at Siemens Mobility Egypt',
        'International Business Law Specialist',
        'Legal Research & Analysis Expert',
        'Multilingual Legal Professional'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 50;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 50;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before new text
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing after a delay
    setTimeout(type, 1000);
}

// ============================================
// LANGUAGE BARS ANIMATION
// ============================================

function initLanguageBars() {
    const langFills = document.querySelectorAll('.lang-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.style.width;
                fill.style.width = '0%';
                
                setTimeout(() => {
                    fill.style.width = width;
                }, 100);
            }
        });
    }, { threshold: 0.5 });
    
    langFills.forEach(fill => {
        observer.observe(fill);
    });
}

// ============================================
// HOVER EFFECTS
// ============================================

function initHoverEffects() {
    // Magnetic effect on buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
    
    // Glitch effect on image hover
    const imageFrame = document.querySelector('.image-frame');
    
    if (imageFrame) {
        imageFrame.addEventListener('mouseenter', () => {
            imageFrame.classList.add('glitch-active');
        });
        
        imageFrame.addEventListener('mouseleave', () => {
            imageFrame.classList.remove('glitch-active');
        });
    }
    
    // Card tilt effect
    const cards = document.querySelectorAll('.edu-card, .timeline-content, .achievement-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
    
    // Tags hover effect
    const tags = document.querySelectorAll('.tag, .timeline-tag');
    
    tags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'scale(1)';
        });
    });
}

// ============================================
// CURSOR EFFECTS (Optional enhancement)
// ============================================

function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
    document.body.appendChild(cursor);
    
    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');
    
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });
    
    function animateRing() {
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        
        requestAnimationFrame(animateRing);
    }
    
    animateRing();
    
    // Grow on hover
    const hoverElements = document.querySelectorAll('a, button, .btn');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.style.transform = 'translate(-50%, -50%) scale(1.5)';
            ring.style.borderColor = '#fff';
        });
        
        el.addEventListener('mouseleave', () => {
            ring.style.transform = 'translate(-50%, -50%) scale(1)';
            ring.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        });
    });
}

// ============================================
// PRELOADER (Optional)
// ============================================

function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">N.A</div>
            <div class="preloader-bar">
                <div class="preloader-progress"></div>
            </div>
        </div>
    `;
    document.body.prepend(preloader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });
}

// ============================================
// SMOOTH REVEAL ON SCROLL
// ============================================

function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const revealTop = element.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (revealTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%c✨ Welcome to Nouran Aboulela\'s Portfolio', 
    'font-size: 20px; font-weight: bold; color: #fff; background: #000; padding: 10px 20px;');
console.log('%cBuilt with passion and precision', 
    'font-size: 12px; color: #888;');

