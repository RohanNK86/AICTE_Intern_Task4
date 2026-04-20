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
            const response = await fetch('https://portfolio-6yrb.onrender.com/api/contact', {
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

// =============================================
// PROGRAMMING BACKGROUND ANIMATION
// =============================================
function createProgrammingBackground() {
    const bg = document.getElementById('programming-bg');
    if (!bg) return;

    const snippets = [
        ['def predict(model, data):',
            '    tensor = torch.tensor(data)',
            '    with torch.no_grad():',
            '        return model(tensor)',
            '',
            'class ChatBot:',
            '    def __init__(self, api_key):',
            '        self.gemini = GeminiAPI(api_key)',
            '    def respond(self, prompt):',
            '        return self.gemini.generate(prompt)',

            'import requests',
        '',
        'API_KEY = "your_api_key_here"',
        '',
        'def call_llm(prompt):',
        '    url = "https://api.openai.com/v1/chat/completions"',
        '    headers = {',
        '        "Authorization": f"Bearer {API_KEY}",',
        '        "Content-Type": "application/json"',
        '    }',
        '    data = {',
        '        "model": "gpt-4o-mini",',
        '        "messages": [{"role": "user", "content": prompt}]',
        '    }',
        '    res = requests.post(url, headers=headers, json=data)',
        '    return res.json()["choices"][0]["message"]["content"]',
        '',
        'def agent():',
        '    while True:',
        '        user = input("You: ")',
        '        if user.lower() == "exit": break',
        '        print("Agent:", call_llm(user))',
        '',
        'agent()'
        ],
        ['const analyzeWater = async (levels) => {',
            '    const model = await tf.loadModel("dwlr.json");',
            '    const tensor = tf.tensor2d([levels]);',
            '    const pred = model.predict(tensor);',
            '    return pred.dataSync();',
            '};',
            '',
            'class ExpenseTracker {',
            '    save(expense) {',
            '        const data = JSON.parse(localStorage.getItem("expenses") || "[]");',
            '        data.push(expense);',
            '        localStorage.setItem("expenses", JSON.stringify(data));',
            '    }',
            '}',
        ],
        ['import numpy as np',
            'from sklearn.ensemble import RandomForestRegressor',
            '',
            'X_train, X_test, y_train, y_test = train_test_split(',
            '    features, labels, test_size=0.2)',
            'model = RandomForestRegressor(n_estimators=100)',
            'model.fit(X_train, y_train)',
            'score = model.score(X_test, y_test)',
            'print(f"Accuracy: {score:.2f}")',
        ],
    ];

    let patIdx = 0, lineIdx = 0, charIdx = 0;
    const lineHeight = 22, maxLines = 28, typingSpeed = 18;

    function typeCode() {
        const pattern = snippets[patIdx];
        if (lineIdx >= pattern.length) {
            lineIdx = 0; charIdx = 0;
            bg.innerHTML = '';
        }
        if (charIdx === 0) {
            const div = document.createElement('div');
            div.style.top = `${(lineIdx % maxLines) * lineHeight}px`;
            bg.appendChild(div);
        }
        const els = bg.getElementsByTagName('div');
        const cur = els[lineIdx % maxLines];
        const line = pattern[lineIdx] || '';
        if (cur) {
            if (charIdx < line.length) {
                cur.textContent += line[charIdx];
                charIdx++;
            } else {
                lineIdx++; charIdx = 0;
            }
        }
        if (els.length > maxLines) bg.removeChild(els[0]);
        setTimeout(typeCode, typingSpeed);
    }

    typeCode();
    setInterval(() => {
        patIdx = (patIdx + 1) % snippets.length;
        lineIdx = 0; charIdx = 0;
        bg.innerHTML = '';
    }, 18000);
}

document.addEventListener('DOMContentLoaded', () => {
    createProgrammingBackground();
    initMiniGame();
});

// =============================================
// MINI GAME — Click Counter
// =============================================
function initMiniGame() {
    const gameModal = document.getElementById('gameModal');
    const openBtn = document.getElementById('openGame');
    const closeBtn = document.getElementById('closeGame');
    const startBtn = document.getElementById('startGame');
    const gameArea = document.getElementById('gameArea');
    const clickBtn = document.getElementById('clickBtn');
    const scoreEl = document.getElementById('score');
    const timeEl = document.getElementById('timeLeft');
    const resultEl = document.getElementById('gameResult');
    if (!gameModal || !openBtn) return;

    let score = 0, timeLeft = 10, gameInterval = null;

    // Draggable Logic
    let isDragging = false;
    let MathExt = Math;
    let dragDist = 0;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;
    
    openBtn.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Touch support for dragging
    openBtn.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        dragStart({ clientX: touch.clientX, clientY: touch.clientY });
    }, {passive: false});
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        drag({ clientX: touch.clientX, clientY: touch.clientY });
    }, {passive: false});
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        isDragging = true;
        dragDist = 0;
        startX = e.clientX;
        startY = e.clientY;
        const rect = openBtn.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        openBtn.style.bottom = 'auto'; // override CSS bottom
        openBtn.style.right = 'auto';  // override CSS right
        openBtn.style.transition = 'none'; // disable CSS transition while dragged
    }

    function drag(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        dragDist += MathExt.abs(dx) + MathExt.abs(dy); // Accumulate physical drag distance
        openBtn.style.left = `${initialLeft + dx}px`;
        openBtn.style.top = `${initialTop + dy}px`;
    }

    function dragEnd() {
        isDragging = false;
        openBtn.style.transition = 'transform 0.2s'; // re-add hovering transform
    }

    // Checking if click or drag
    openBtn.addEventListener('click', (e) => {
        if (dragDist > 15) {
            e.preventDefault(); // It was a drag, don't open modal
            return;
        }
        gameModal.classList.add('open');
    });

    closeBtn && closeBtn.addEventListener('click', () => { gameModal.classList.remove('open'); resetGame(); });
    window.addEventListener('click', e => { if (e.target === gameModal) { gameModal.classList.remove('open'); resetGame(); } });

    startBtn && startBtn.addEventListener('click', () => {
        startBtn.style.display = 'none';
        gameArea.style.display = 'block';
        startGame();
    });
    
    clickBtn && clickBtn.addEventListener('click', () => {
        score++;
        if (scoreEl) scoreEl.textContent = score;
        // bump animation
        clickBtn.style.transform = 'scale(0.85)';
        setTimeout(() => clickBtn.style.transform = 'scale(1)', 120);
    });

    function startGame() {
        score = 0; timeLeft = 10;
        if (scoreEl) scoreEl.textContent = 0;
        if (timeEl) timeEl.textContent = 10;
        if (resultEl) resultEl.style.display = 'none';
        gameInterval = setInterval(() => {
            timeLeft--;
            if (timeEl) timeEl.textContent = timeLeft;
            if (timeLeft <= 0) endGame();
        }, 1000);
    }
    
    function endGame() {
        clearInterval(gameInterval);
        if (gameArea) gameArea.style.display = 'none';
        if (resultEl) {
            resultEl.style.display = 'block';
            const msg = score >= 60 ? '🏆 Amazing!' : score >= 30 ? '😄 Well done!' : '💪 Keep practicing!';
            resultEl.innerHTML = `<h3>${msg}</h3><p style="margin: 10px 0; color: var(--text-secondary);">Your score: <strong style="color: var(--text-primary); font-size: 1.5rem;">${score}</strong> pts</p><button class="btn btn-primary mt-1" id="playAgainBtn">Play Again</button>`;
            
            document.getElementById('playAgainBtn').addEventListener('click', () => {
                resetGame();
                startBtn.style.display = 'none';
                gameArea.style.display = 'block';
                startGame();
            });
        }
    }
    
    function resetGame() {
        clearInterval(gameInterval);
        score = 0; timeLeft = 10;
        if (gameArea) gameArea.style.display = 'none';
        if (resultEl) resultEl.style.display = 'none';
        if (startBtn) startBtn.style.display = '';
        if (scoreEl) scoreEl.textContent = 0;
        if (timeEl) timeEl.textContent = 10;
    }
}