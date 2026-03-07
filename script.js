// Initialize Data
const APPS = [
    { url: "http://frogfind.com", icon: "🐸", name: "FrogFind" },
    { url: "https://lite.duckduckgo.com/lite", icon: "🦆", name: "DDG Lite" },
    { url: "https://wiby.me", icon: "🕸️", name: "Wiby" },
    { url: "https://old.reddit.com", icon: "👽", name: "Reddit" },
    { url: "https://news.ycombinator.com", icon: "👾", name: "HackerN" },
    { url: "https://mbasic.facebook.com", icon: "👥", name: "FB Basic" },
    { url: "https://mobile.twitter.com", icon: "🐦", name: "Twitter" },
    { url: "https://text.npr.org", icon: "📰", name: "NPR Txt" },
    { url: "https://lite.cnn.com", icon: "🗞️", name: "CNN Lite" },
    { url: "https://wttr.in", icon: "☁️", name: "Weather" },
    { url: "https://en.m.wikipedia.org", icon: "📚", name: "Wiki" },
    { url: "https://maps.google.com", icon: "🗺️", name: "Maps" },
    { url: "https://translate.google.com/m", icon: "🈯", name: "Translat" },
    { url: "https://gmail.com", icon: "✉️", name: "Gmail" },
    { url: "https://github.com", icon: "🐙", name: "GitHub" }
];

const THEMES = ['default', 'red', 'green', 'amber', 'blue'];
let currentTheme = localStorage.getItem('dumbos-theme') || 'default';
document.body.className = currentTheme;

// DOM Elements
const grid = document.getElementById('app-grid');
const omni = document.getElementById('omni-box');
const optionsMenu = document.getElementById('options-menu');

// Build Grid
APPS.forEach((app, i) => {
    const el = document.createElement('a');
    el.href = app.url;
    el.className = 'app';
    el.innerHTML = `
        <span class="app-num">${i+1}</span>
        <span class="icon">${app.icon}</span>
        <span class="name">${app.name}</span>
    `;
    grid.appendChild(el);
});

// Clock
setInterval(() => {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}, 1000);

// Navigation State
let focusIdx = -1; // -1 = Search Box, 0+ = App Grid
const apps = document.querySelectorAll('.app');
const cols = 3;

function setFocus(idx) {
    // Clear old focus
    apps.forEach(a => a.classList.remove('active'));
    omni.blur();

    if (idx < 0) {
        focusIdx = -1;
        omni.focus();
        updateSoftKeys("Options", "SEARCH", "Back");
    } else {
        focusIdx = idx;
        apps[focusIdx].classList.add('active');
        apps[focusIdx].focus();
        updateSoftKeys("Options", "OPEN", "Back");
    }
}

function updateSoftKeys(left, center, right) {
    document.getElementById('sk-left').textContent = left;
    document.getElementById('sk-center').textContent = center;
    document.getElementById('sk-right').textContent = right;
}

// Initial Focus
setFocus(0);

// Key Handler
document.addEventListener('keydown', (e) => {
    const k = e.key;

    // Number Shortcuts (1-9)
    if (k >= '1' && k <= '9') {
        const idx = parseInt(k) - 1;
        if (apps[idx]) window.location = apps[idx].href;
        return;
    }

    // Navigation
    if (k === 'ArrowDown') {
        if (focusIdx === -1) setFocus(0); // From Search to Grid
        else if (focusIdx + cols < apps.length) setFocus(focusIdx + cols);
    } 
    else if (k === 'ArrowUp') {
        if (focusIdx < cols) setFocus(-1); // To Search
        else setFocus(focusIdx - cols);
    }
    else if (k === 'ArrowRight') {
        if (focusIdx === -1) return;
        if ((focusIdx + 1) % cols !== 0 && focusIdx + 1 < apps.length) setFocus(focusIdx + 1);
    }
    else if (k === 'ArrowLeft') {
        if (focusIdx === -1) return;
        if (focusIdx % cols !== 0) setFocus(focusIdx - 1);
    }
    else if (k === 'Enter' || k === 'SoftCenter') {
        if (focusIdx === -1) {
            // Search Google
            window.location = `https://www.google.com/search?q=${encodeURIComponent(omni.value)}`;
        } else {
            window.location = apps[focusIdx].href;
        }
    }
    else if (k === 'SoftLeft' || k === 'F1') {
        // Toggle Options
        toggleOptions();
    }
});

function toggleOptions() {
    optionsMenu.classList.toggle('hidden');
    // Simple theme cycle for now
    if (!optionsMenu.classList.contains('hidden')) {
        cycleTheme();
    }
}

function cycleTheme() {
    let idx = THEMES.indexOf(currentTheme);
    idx = (idx + 1) % THEMES.length;
    currentTheme = THEMES[idx];
    document.body.className = currentTheme;
    localStorage.setItem('dumbos-theme', currentTheme);
    
    // Auto-hide menu after change for simplicity
    setTimeout(() => optionsMenu.classList.add('hidden'), 1000);
}