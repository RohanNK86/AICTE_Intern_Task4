// =============================================
// PORTFOLIO SCRIPT — Rohan N Karadigudd
// Features: Typing, Nav scroll, To-Do (localStorage), Mini Game, BG Animation
// =============================================

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
    initTypingEffect();
    initNavScroll();
    initNavSpy();
    initHamburger();
    initDarkMode();
    initToDoList();
    initMiniGame();
    createProgrammingBackground();
    fetchGitHubStats();
});

// =============================================
// TYPING EFFECT
// =============================================
function initTypingEffect() {
    const el = document.getElementById('typed-name');
    if (!el) return;
    const text = 'Rohan N Karadigudd';
    let i = 0;
    el.textContent = '';
    function type() {
        if (i <= text.length) {
            el.textContent = text.slice(0, i);
            i++;
            setTimeout(type, 90);
        }
    }
    setTimeout(type, 600); // slight delay on load
}

// =============================================
// NAV — SCROLL GLASS EFFECT
// =============================================
function initNavScroll() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }, { passive: true });
}

// =============================================
// NAV SPY — ACTIVE LINK ON SCROLL
// =============================================
function initNavSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => obs.observe(s));
}

// =============================================
// HAMBURGER MENU
// =============================================
function initHamburger() {
    const btn = document.getElementById('hamburger');
    const links = document.getElementById('navLinks');
    if (!btn || !links) return;
    btn.addEventListener('click', () => {
        links.classList.toggle('open');
        btn.classList.toggle('open');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            btn.classList.remove('open');
        });
    });
}

// =============================================
// DARK / LIGHT MODE TOGGLE
// =============================================
function initDarkMode() {
    const btn = document.getElementById('darkModeToggle');
    const body = document.body;
    // Load preference
    if (localStorage.getItem('portfolio_theme') === 'light') {
        body.classList.add('light-mode');
        updateThemeIcon(btn, true);
    }
    if (!btn) return;
    btn.addEventListener('click', () => {
        const isLight = body.classList.toggle('light-mode');
        localStorage.setItem('portfolio_theme', isLight ? 'light' : 'dark');
        updateThemeIcon(btn, isLight);
    });
}
function updateThemeIcon(btn, isLight) {
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (!icon) return;
    if (isLight) {
        icon.className = 'fas fa-moon';
        btn.title = 'Switch to dark mode';
    } else {
        icon.className = 'fas fa-sun';
        btn.title = 'Switch to light mode';
    }
}

// =============================================
// TO-DO LIST — localStorage Powered
// =============================================
const TODO_STORAGE_KEY = 'portfolio_todos_v2';

function initToDoList() {
    const input = document.getElementById('todoInput');
    const prioritySelect = document.getElementById('todoPriority');
    const addBtn = document.getElementById('addTodoBtn');
    const clearBtn = document.getElementById('clearCompleted');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (!input || !addBtn) return;

    let activeFilter = 'all';

    // Add task
    addBtn.addEventListener('click', addTask);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    // Clear completed
    clearBtn.addEventListener('click', () => {
        const todos = getTodos().filter(t => !t.completed);
        saveTodos(todos);
        renderTodos();
    });

    // Initial render
    renderTodos();

    function addTask() {
        const text = input.value.trim();
        if (!text) {
            input.focus();
            input.style.borderColor = 'var(--danger)';
            setTimeout(() => input.style.borderColor = '', 1000);
            return;
        }
        const todo = {
            id: Date.now().toString(),
            text,
            priority: prioritySelect.value,
            completed: false,
            createdAt: new Date().toISOString()
        };
        const todos = getTodos();
        todos.unshift(todo);
        saveTodos(todos);
        input.value = '';
        prioritySelect.value = 'medium';
        renderTodos();
        input.focus();
    }

    function renderTodos() {
        const list = document.getElementById('todoList');
        const emptyEl = document.getElementById('todoEmpty');
        const statsEl = document.getElementById('todoStats');
        if (!list) return;

        let todos = getTodos();
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;

        // Update stats
        if (statsEl) statsEl.textContent = `${total} task${total !== 1 ? 's' : ''} · ${completed} done`;

        // Filter
        let filtered = todos;
        if (activeFilter === 'pending') filtered = todos.filter(t => !t.completed);
        if (activeFilter === 'completed') filtered = todos.filter(t => t.completed);
        if (['high', 'medium', 'low'].includes(activeFilter))
            filtered = todos.filter(t => t.priority === activeFilter);

        list.innerHTML = '';
        if (filtered.length === 0) {
            emptyEl && (emptyEl.style.display = 'flex');
            return;
        }
        emptyEl && (emptyEl.style.display = 'none');

        filtered.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.dataset.id = todo.id;
            li.innerHTML = `
                <input type="checkbox" class="todo-check" ${todo.completed ? 'checked' : ''} title="Mark complete">
                <div class="todo-priority-dot priority-${todo.priority}" title="${todo.priority} priority"></div>
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="todo-delete" title="Delete task"><i class="fas fa-times"></i></button>
            `;
            // Toggle complete
            li.querySelector('.todo-check').addEventListener('change', e => {
                toggleTodo(todo.id, e.target.checked);
            });
            // Delete
            li.querySelector('.todo-delete').addEventListener('click', () => {
                li.style.animation = 'none';
                li.style.opacity = '0';
                li.style.transform = 'translateX(20px)';
                li.style.transition = 'all 0.25s ease';
                setTimeout(() => {
                    deleteTodo(todo.id);
                    renderTodos();
                }, 220);
            });
            list.appendChild(li);
        });
    }

    function toggleTodo(id, completed) {
        const todos = getTodos().map(t => t.id === id ? { ...t, completed } : t);
        saveTodos(todos);
        renderTodos();
    }

    function deleteTodo(id) {
        saveTodos(getTodos().filter(t => t.id !== id));
    }
}

function getTodos() {
    try {
        return JSON.parse(localStorage.getItem(TODO_STORAGE_KEY)) || [];
    } catch { return []; }
}
function saveTodos(todos) {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}
function escapeHtml(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
}

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

    openBtn.addEventListener('click', () => gameModal.classList.add('open'));
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
        // fun animation
        clickBtn.style.transform = 'scale(0.93)';
        setTimeout(() => clickBtn.style.transform = '', 100);
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
            const msg = score >= 30 ? '🏆 Amazing!' : score >= 15 ? '😄 Well done!' : '💪 Keep practicing!';
            resultEl.innerHTML = `<h3>${msg}</h3><p>Your score: <strong>${score}</strong></p><button class="btn btn-primary" onclick="location.reload()">Play Again</button>`;
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

// =============================================
// GITHUB STATS (About Section)
// =============================================
async function fetchGitHubStats() {
    try {
        const res = await fetch('https://api.github.com/users/rohannk86');
        if (!res.ok) return;
        const d = await res.json();
        const repoEl = document.getElementById('repoCount');
        const followerEl = document.getElementById('followerCount');
        if (repoEl) repoEl.textContent = d.public_repos ?? '—';
        if (followerEl) followerEl.textContent = d.followers ?? '—';
    } catch { /* silent fail */ }
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