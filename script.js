/* ================================================
   PORTFOLIO SCRIPT - Rohan N Karadigudd
   Features:
   - Glassmorphism navbar scroll effect
   - Dynamic name typing animation
   - Role/subtitle typing animation
   - Scroll-reveal (Intersection Observer)
   - Active nav link tracking
   - Smooth scroll on nav click
   - Contact form handler
================================================ */

/* ── 1. NAVBAR: glassmorphism + scrolled class ── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
    });
});

/* ── 2. DARK / LIGHT THEME TOGGLE ── */
const themeToggle = document.getElementById('themeToggle');

const getStoredTheme = () => localStorage.getItem('theme');
const getPreferredTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyTheme = (theme) => {
    document.body.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark'
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
    }
};

if (themeToggle) {
    const currentTheme = getStoredTheme() || getPreferredTheme();
    applyTheme(currentTheme);
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });
}

/* ── 3. SMOOTH SCROLL on nav click ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;
        e.preventDefault();
        const navH = navbar.offsetHeight + 20;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ── 3. ACTIVE NAV LINK on scroll ── */
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link[data-section]');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            allNavLinks.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ── 4. SCROLL REVEAL (Intersection Observer) ── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 5. HERO IMAGE SCROLL-UP ANIMATION ── */
// Profile image gracefully appears from bottom as page loads
const heroImage = document.getElementById('heroImage');
if (heroImage) {
    heroImage.style.opacity = '0';
    heroImage.style.transform = 'translateY(60px)';
    heroImage.style.transition = 'opacity 1s ease 0.5s, transform 1s ease 0.5s';
    window.addEventListener('load', () => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                heroImage.style.opacity = '1';
                heroImage.style.transform = 'translateY(0)';
            }, 100);
        });
    });
}

/* ── 6. NAME TYPING ANIMATION ── */
const nameEl = document.getElementById('typedName');
const fullName = 'Rohan N Karadigudd';
let nameIndex = 0;

function typeName() {
    if (nameIndex < fullName.length) {
        nameEl.textContent += fullName[nameIndex];
        nameIndex++;
        setTimeout(typeName, 80);
    }
}

/* ── 7. ROLE SUBTITLE TYPING ANIMATION ── */
const roleEl = document.getElementById('roleTyped');
const roles = [
    'Full Stack Developer',
    'ML Enthusiast',
    'Problem Solver',
    'Open Source Contributor',
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRole() {
    const current = roles[roleIndex];
    if (isDeleting) {
        roleEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        roleEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = isDeleting ? 50 : 90;

    if (!isDeleting && charIndex === current.length) {
        delay = 1800; // pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
    }

    setTimeout(typeRole, delay);
}

/* Start animations after a short delay so the page feels loaded */
window.addEventListener('load', () => {
    setTimeout(() => {
        typeName();
        setTimeout(typeRole, 1200); // start role after name types
    }, 300);
});

/* ── 8. CONTACT FORM HANDLER ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('cName').value.trim();
        const email = document.getElementById('cEmail').value.trim();
        const message = document.getElementById('cMessage').value.trim();

        if (!name || !email || !message) return;

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const response = await fetch('http://localhost:8001/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to send message');
            }

            contactForm.reset();
            formSuccess.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message sent successfully!';
            formSuccess.style.color = '#34A853';
            formSuccess.classList.add('show');
        } catch (error) {
            formSuccess.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${error.message}`;
            formSuccess.style.color = '#ff6b6b';
            formSuccess.classList.add('show');
            console.error('Contact submission failed:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
            setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }
    });
}
