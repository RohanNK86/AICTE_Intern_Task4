/* ================================================
   TO-DO & NOTES APP - With LocalStorage Persistence
   Rohan N Karadigudd
================================================ */

const STORAGE_KEY = 'rnk_todo_items';

/* ── State ── */
let items = loadFromStorage();
let currentType = 'task';
let currentPriority = 'medium';

/* ── DOM Refs ── */
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const resultCount = document.getElementById('resultCount');
const appStats = document.getElementById('appStats');
const inputTitle = document.getElementById('inputTitle');
const inputDetail = document.getElementById('inputDetail');
const inputCategory = document.getElementById('inputCategory');
const filterStatus = document.getElementById('filterStatus');
const filterCat = document.getElementById('filterCategory');
const sortBy = document.getElementById('sortBy');
const searchInput = document.getElementById('searchInput');

/* ── Type Toggle ── */
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentType = btn.dataset.type;
        // Hide priority for notes
        const pr = document.getElementById('priorityRow');
        if (currentType === 'note') {
            pr.style.display = 'none';
        } else {
            pr.style.display = 'flex';
        }
    });
});

/* ── Priority Toggle ── */
document.querySelectorAll('.priority-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPriority = btn.dataset.priority;
    });
});

/* ── ADD ITEM ── */
document.getElementById('addBtn').addEventListener('click', addItem);
inputTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addItem(); }
});

function addItem() {
    const title = inputTitle.value.trim();
    if (!title) {
        inputTitle.focus();
        inputTitle.style.borderColor = '#ff4e4e';
        setTimeout(() => { inputTitle.style.borderColor = ''; }, 1200);
        return;
    }

    const item = {
        id: Date.now(),
        type: currentType,
        title,
        detail: inputDetail.value.trim(),
        category: inputCategory.value,
        priority: currentType === 'note' ? null : currentPriority,
        done: false,
        createdAt: new Date().toISOString(),
    };

    items.unshift(item);
    saveToStorage();
    renderItems();

    // Reset form
    inputTitle.value = '';
    inputDetail.value = '';
    inputTitle.focus();
}

/* ── TOGGLE DONE ── */
function toggleDone(id) {
    const item = items.find(i => i.id === id);
    if (item) {
        item.done = !item.done;
        saveToStorage();
        renderItems();
    }
}

/* ── DELETE ITEM ── */
function deleteItem(id) {
    items = items.filter(i => i.id !== id);
    saveToStorage();
    renderItems();
}

/* ── CLEAR COMPLETED ── */
document.getElementById('clearCompleted').addEventListener('click', () => {
    items = items.filter(i => !i.done);
    saveToStorage();
    renderItems();
});

/* ── FILTER / SORT / SEARCH listeners ── */
[filterStatus, filterCat, sortBy, searchInput].forEach(el => {
    el.addEventListener('input', renderItems);
    el.addEventListener('change', renderItems);
});

/* ── RENDER ── */
function renderItems() {
    const statusFilter = filterStatus.value;
    const catFilter = filterCat.value;
    const sort = sortBy.value;
    const search = searchInput.value.trim().toLowerCase();

    let filtered = [...items];

    // Filter
    if (statusFilter === 'task') filtered = filtered.filter(i => i.type === 'task');
    else if (statusFilter === 'note') filtered = filtered.filter(i => i.type === 'note');
    else if (statusFilter === 'active') filtered = filtered.filter(i => i.type === 'task' && !i.done);
    else if (statusFilter === 'done') filtered = filtered.filter(i => i.done);

    if (catFilter !== 'all') filtered = filtered.filter(i => i.category === catFilter);

    if (search) {
        filtered = filtered.filter(i =>
            i.title.toLowerCase().includes(search) ||
            (i.detail && i.detail.toLowerCase().includes(search))
        );
    }

    // Sort
    const priorityOrder = { high: 3, medium: 2, low: 1, null: 0 };
    if (sort === 'oldest') filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sort === 'newest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sort === 'priority') filtered.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
    else if (sort === 'alpha') filtered.sort((a, b) => a.title.localeCompare(b.title));

    // Render
    todoList.innerHTML = '';
    resultCount.textContent = `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`;
    updateStats();

    if (filtered.length === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
        filtered.forEach(item => {
            todoList.appendChild(createItemEl(item));
        });
    }
}

function createItemEl(item) {
    const el = document.createElement('div');
    el.className = `todo-item${item.done ? ' done' : ''}`;
    el.dataset.id = item.id;

    const catLabels = {
        personal: '🏠 Personal', work: '💼 Work', study: '📚 Study',
        health: '💪 Health', other: '📌 Other'
    };
    const timeAgo = formatTimeAgo(item.createdAt);

    el.innerHTML = `
    <button class="item-check" onclick="toggleDone(${item.id})" title="${item.done ? 'Mark incomplete' : 'Mark complete'}">
      ${item.done ? '<i class="fa-solid fa-check"></i>' : ''}
    </button>
    <div class="item-type-icon ${item.type}">
      <i class="fa-solid ${item.type === 'task' ? 'fa-check-square' : 'fa-note-sticky'}"></i>
    </div>
    <div class="item-body">
      <div class="item-title">${escapeHtml(item.title)}</div>
      ${item.detail ? `<div class="item-detail">${escapeHtml(item.detail)}</div>` : ''}
      <div class="item-meta">
        <span class="item-cat">${catLabels[item.category] || item.category}</span>
        ${item.priority ? `<span class="item-priority ${item.priority}">${item.priority}</span>` : ''}
        <span class="item-date">${timeAgo}</span>
      </div>
    </div>
    <button class="item-delete" onclick="deleteItem(${item.id})" title="Delete">
      <i class="fa-solid fa-trash"></i>
    </button>
  `;
    return el;
}

function updateStats() {
    const tasks = items.filter(i => i.type === 'task');
    const done = tasks.filter(i => i.done).length;
    appStats.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''} · ${done} done`;
}

/* ── LOCAL STORAGE ── */
function saveToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) { console.warn('Storage error:', e); }
}

function loadFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : getDefaultItems();
    } catch (e) { return getDefaultItems(); }
}

function getDefaultItems() {
    return [
        {
            id: 1,
            type: 'task',
            title: 'Complete portfolio website',
            detail: 'Add all sections and make it fully responsive.',
            category: 'work',
            priority: 'high',
            done: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: 2,
            type: 'note',
            title: 'Gemini API chatbot ideas',
            detail: 'Explore multi-turn context retention and streaming responses.',
            category: 'study',
            priority: null,
            done: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: 3,
            type: 'task',
            title: 'Push DWLR ML model to GitHub',
            detail: '',
            category: 'work',
            priority: 'medium',
            done: false,
            createdAt: new Date().toISOString(),
        }
    ];
}

/* ── UTILITIES ── */
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatTimeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
}

/* ── INIT ── */
renderItems();
