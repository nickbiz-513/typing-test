// typing.js

// Wait until the entire HTML document is loaded and ready
document.addEventListener('DOMContentLoaded', () => {

    // --- START: Add this code to show the login modal ---

    const loginModal = document.getElementById('login-modal');

    // You can choose one of the two methods below.
    // Method 1 is more direct. Method 2 is slightly better for accessibility.

    // Method 1: Directly change the display style
    if (loginModal) {
        loginModal.style.display = 'flex';
    }

    // OR

    // Method 2: Use the aria-hidden attribute (Recommended, as your CSS is ready for it)
    if (loginModal) {
        loginModal.setAttribute('aria-hidden', 'false');
    }

    // --- END: Add this code ---


    // ... the rest of your typing.js code follows
    // (e.g., getting elements for the game, setting up event listeners, etc.)

});
// ===== GLOBAL VARIABLES =====
let gameState = {
    isTyping: false,
    startTime: 0,
    currentCharIndex: 0,
    totalChars: 0,
    correctChars: 0,
    totalErrors: 0,
    combo: 0,
    maxCombo: 0,
    testMode: '60s',
    difficulty: 'medium',
    language: 'en',
    wordList: [],
    targetText: '',
    wpmHistory: [],
    timerInterval: null,
    chartInterval: null
};

let userProfile = {
    stats: {
        totalTests: 0,
        bestWPM: 0,
        avgWPM: 0,
        avgAccuracy: 0,
        streak: 0
    },
    achievements: {
        speedDemon: { name: "Speed Demon", desc: "Reach 80 WPM", icon: "⚡", threshold: 80, unlocked: false },
        perfectionist: { name: "Perfectionist", desc: "100% accuracy", icon: "✨", threshold: 100, unlocked: false },
        marathon: { name: "Marathon", desc: "Complete 5-min test", icon: "🏃", unlocked: false },
        combo50: { name: "Combo Master", desc: "50 combo streak", icon: "🔥", threshold: 50, unlocked: false },
        persistent: { name: "Persistent", desc: "10 tests completed", icon: "💪", threshold: 10, unlocked: false }
    },
    preferences: {
        theme: 'ocean',
        fontSize: 24,
        smoothCaret: true,
        blindMode: false
    }
};

let auth = {
    username: null
};

// Word lists for English and Code only
const wordLists = {
    en: {
        easy: ["the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at"],
        medium: ["about", "would", "there", "their", "which", "people", "through", "being", "because", "before", "between", "during", "however", "another", "without", "against", "nothing", "someone", "something", "everything"],
        hard: ["accommodate", "achievement", "acknowledge", "acquaintance", "agriculture", "atmosphere", "beautiful", "beginning", "believe", "business", "calendar", "caribbean", "committee", "communicate", "community", "competition", "completely", "confidence", "congratulations", "consequence"],
        expert: ["antidisestablishmentarianism", "electroencephalography", "immunoelectrophoresis", "psychopharmacology", "spectrophotometrically", "thermodynamically", "uncharacteristically", "conceptualization", "internationalization", "multidimensionality"]
    },
    code: {
        easy: ["var", "let", "const", "if", "else", "for", "while", "do", "break", "continue", "function", "return", "true", "false", "null", "undefined", "new", "this", "try", "catch"],
        medium: ["import", "export", "default", "class", "extends", "static", "async", "await", "promise", "then", "catch", "finally", "throw", "typeof", "instanceof", "constructor", "prototype", "super", "yield", "delete"],
        hard: ["addEventListener", "getElementById", "querySelector", "createElement", "appendChild", "removeChild", "setAttribute", "getAttribute", "localStorage", "sessionStorage", "setTimeout", "setInterval", "clearTimeout", "clearInterval", "JSON.stringify", "JSON.parse", "Object.keys", "Object.values", "Array.prototype", "Map.prototype.forEach"],
        expert: ["Object.defineProperty", "Proxy.revocable", "Reflect.construct", "Symbol.hasInstance", "WeakMap.prototype.has", "ArrayBuffer.isView", "DataView.prototype.getFloat32", "Intl.NumberFormat", "WebAssembly.instantiate", "performance.measureUserAgentSpecificMemory", "IntersectionObserver", "MutationObserver", "ResizeObserver", "requestAnimationFrame", "cancelAnimationFrame", "getComputedStyle", "encodeURIComponent", "decodeURIComponent", "TextEncoder", "TextDecoder"]
    }
};

// ===== DOM ELEMENTS =====
const elements = {
    // Controls
    testMode: document.getElementById('testMode'),
    difficulty: document.getElementById('difficulty'),
    language: document.getElementById('language'),
    newGameBtn: document.getElementById('newGameBtn'),
    settingsBtn: document.getElementById('settingsBtn'),

    // Stats
    wpm: document.getElementById('wpm'),
    accuracy: document.getElementById('accuracy'),
    timer: document.getElementById('timer'),
    combo: document.getElementById('combo'),
    errors: document.getElementById('errors'),
    bestWPM: document.getElementById('bestWPM'),
    avgWPM: document.getElementById('avgWPM'),
    totalTests: document.getElementById('totalTests'),
    streak: document.getElementById('streak'),

    // Game area
    gameArea: document.getElementById('game-area'),
    targetWords: document.getElementById('target-words'),
    cursor: document.getElementById('cursor'),
    focusPrompt: document.getElementById('focus-prompt'),
    progressBar: document.getElementById('progressBar'),

    // Results
    resultsPanel: document.getElementById('results-panel'),
    finalWPM: document.getElementById('finalWPM'),
    finalAccuracy: document.getElementById('finalAccuracy'),
    finalTime: document.getElementById('finalTime'),
    finalCombo: document.getElementById('finalCombo'),
    totalChars: document.getElementById('totalChars'),
    correctCharsCount: document.getElementById('correctCharsCount'),
    totalErrorsCount: document.getElementById('totalErrorsCount'),
    rawWPM: document.getElementById('rawWPM'),
    retryBtn: document.getElementById('retryBtn'),
    nextBtn: document.getElementById('nextBtn'),
    shareBtn: document.getElementById('shareBtn'),

    // Settings
    settingsModal: document.getElementById('settings-modal'),
    closeSettings: document.getElementById('closeSettings'),
    themeSelect: document.getElementById('themeSelect'),
    fontSize: document.getElementById('fontSize'),
    fontSizeValue: document.getElementById('fontSizeValue'),
    smoothCaret: document.getElementById('smoothCaret'),
    blindMode: document.getElementById('blindMode'),
    exportStats: document.getElementById('exportStats'),
    resetStats: document.getElementById('resetStats'),
    welcomeUser: document.getElementById('welcomeUser'),

    // Other
    loadingScreen: document.getElementById('loading-screen'),
    keyboard: document.getElementById('keyboard'),
    wpmChart: document.getElementById('wpmChart'),
    achievementsPanel: document.getElementById('achievements-panel'),
    achievementsGrid: document.getElementById('achievementsGrid'),

    // Login
    loginModal: document.getElementById('login-modal'),
    loginUsername: document.getElementById('login-username'),
    loginPassword: document.getElementById('login-password'),
    loginBtn: document.getElementById('login-btn'),
    loginError: document.getElementById('login-error'),
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadAuth();

    // Apply preferences early so the login screen matches the theme
    applyPreferences();

    if (!auth.username) {
        showLogin();
    } else {
        initApp();
    }

    initializeLoginListeners();
});

function initApp() {
    initializeEventListeners();
    initializeChart();
    updateUI();
    hideLoadingScreen();
    generateText();
    updateAchievementsDisplay();
}

/* ===== LOGIN ===== */
function loadAuth() {
    const saved = localStorage.getItem('hippotypeAuth');
    if (saved) {
        try {
            auth.username = saved;
        } catch (e) {
            console.warn('Failed to load auth', e);
            auth.username = null;
        }
    }
}

function saveAuth(username) {
    try {
        localStorage.setItem('hippotypeAuth', username);
        auth.username = username;
    } catch (e) {
        console.warn('Failed to save auth', e);
    }
}

function initializeLoginListeners() {
    if (!elements.loginBtn) return;

    elements.loginBtn.addEventListener('click', attemptLogin);
    [elements.loginUsername, elements.loginPassword].forEach(el => {
        if (!el) return;
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') attemptLogin();
        });
    });
}

function showLogin() {
    if (elements.loginModal) {
        elements.loginModal.style.display = 'flex';
        elements.loginModal.setAttribute('aria-hidden', 'false');
    }
    // blur background slightly
    const main = document.getElementById('main-content');
    if (main) main.style.filter = 'blur(2px)';
    const header = document.querySelector('.site-header');
    if (header) header.style.filter = 'blur(2px)';

    // Focus username input
    setTimeout(() => {
        if (elements.loginUsername) elements.loginUsername.focus();
    }, 120);
}

function hideLogin() {
    if (elements.loginModal) {
        elements.loginModal.style.display = 'none';
        elements.loginModal.setAttribute('aria-hidden', 'true');
    }
    const main = document.getElementById('main-content');
    if (main) main.style.filter = 'none';
    const header = document.querySelector('.site-header');
    if (header) header.style.filter = 'none';
}

function attemptLogin() {
    const username = elements.loginUsername?.value?.trim();
    const password = elements.loginPassword?.value?.trim();

    if (!username || !password) {
        if (elements.loginError) elements.loginError.textContent = 'Please enter both username and password.';
        return;
    }

    // Demo/local login: accept any non-empty credentials
    saveAuth(username);
    if (elements.loginError) elements.loginError.textContent = '';
    hideLogin();

    // Put username into welcome area
    if (elements.welcomeUser) elements.welcomeUser.textContent = `Welcome, ${auth.username}`;

    // Initialize rest of app
    initApp();
}

/* ===== LOADING/SAVE PROFILE ===== */
function hideLoadingScreen() {
    setTimeout(() => {
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.add('fade-out');
            setTimeout(() => { elements.loadingScreen.style.display = 'none'; }, 500);
        }
    }, 500);
}

function loadUserProfile() {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // shallow merge to keep defaults
            userProfile = Object.assign(userProfile, parsed);
            if (!userProfile.preferences) userProfile.preferences = { theme: 'ocean', fontSize: 24, smoothCaret: true, blindMode: false };
        } catch (e) {
            console.warn('Failed to parse userProfile', e);
        }
    }
    applyPreferences();
}

function saveUserProfile() {
    try {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    } catch (e) {
        console.warn('Failed to save userProfile', e);
    }
}

function applyPreferences() {
    const prefs = userProfile.preferences || {};

    // Apply theme: remove known theme classes, add chosen
    document.body.classList.remove('theme-ocean', 'theme-forest', 'theme-matrix');
    const themeToApply = prefs.theme || 'ocean';
    document.body.classList.add(`theme-${themeToApply}`);
    if (elements.themeSelect) elements.themeSelect.value = themeToApply;

    // Font size
    if (elements.targetWords) elements.targetWords.style.fontSize = `${prefs.fontSize}px`;
    if (elements.fontSize) {
        elements.fontSize.value = prefs.fontSize;
        elements.fontSizeValue.textContent = `${prefs.fontSize}px`;
    }

    if (elements.smoothCaret) elements.smoothCaret.checked = !!prefs.smoothCaret;
    if (elements.blindMode) elements.blindMode.checked = !!prefs.blindMode;

    // welcome username in settings
    if (elements.welcomeUser) {
        elements.welcomeUser.textContent = auth.username ? `Welcome, ${auth.username}` : 'Welcome';
    }
}

/* ===== EVENT LISTENERS ===== */
function initializeEventListeners() {
    // Game controls
    elements.newGameBtn?.addEventListener('click', startNewGame);
    elements.retryBtn?.addEventListener('click', startNewGame);
    elements.nextBtn?.addEventListener('click', startNewGame);
    elements.shareBtn?.addEventListener('click', shareResults);

    // Settings
    elements.settingsBtn?.addEventListener('click', openSettings);
    elements.closeSettings?.addEventListener('click', closeSettings);

    // Game area
    elements.gameArea?.addEventListener('click', () => elements.gameArea.focus());
    elements.gameArea?.addEventListener('keydown', handleKeyDown);
    elements.gameArea?.addEventListener('focus', handleFocus);
    elements.gameArea?.addEventListener('blur', handleBlur);

    // Mode/difficulty/language changes
    elements.testMode?.addEventListener('change', generateText);
    elements.difficulty?.addEventListener('change', generateText);
    elements.language?.addEventListener('change', generateText);

    // Settings listeners
    elements.themeSelect?.addEventListener('change', (e) => {
        userProfile.preferences.theme = e.target.value;
        applyPreferences();
        saveUserProfile();
    });

    elements.fontSize?.addEventListener('input', (e) => {
        const size = e.target.value;
        userProfile.preferences.fontSize = parseInt(size, 10);
        if (elements.targetWords) elements.targetWords.style.fontSize = `${size}px`;
        if (elements.fontSizeValue) elements.fontSizeValue.textContent = `${size}px`;
        saveUserProfile();
    });

    elements.smoothCaret?.addEventListener('change', (e) => {
        userProfile.preferences.smoothCaret = e.target.checked;
        saveUserProfile();
    });

    elements.blindMode?.addEventListener('change', (e) => {
        userProfile.preferences.blindMode = e.target.checked;
        saveUserProfile();
    });

    if (elements.exportStats) {
        elements.exportStats.addEventListener('click', exportStatistics);
    }

    if (elements.resetStats) {
        elements.resetStats.addEventListener('click', resetStatistics);
    }
}

/* ===== GAME FUNCTIONS ===== */
function startNewGame() {
    resetGame();
    generateText();
    setTimeout(() => {
        elements.gameArea?.focus();
    }, 50);
}

function resetGame() {
    // clear old intervals (if any)
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    if (gameState.chartInterval) clearInterval(gameState.chartInterval);

    gameState = {
        isTyping: false,
        startTime: 0,
        currentCharIndex: 0,
        totalChars: 0,
        correctChars: 0,
        totalErrors: 0,
        combo: 0,
        maxCombo: 0,
        testMode: elements.testMode?.value || '60s',
        difficulty: elements.difficulty?.value || 'medium',
        language: elements.language?.value || 'en',
        wordList: [],
        targetText: '',
        wpmHistory: [],
        timerInterval: null,
        chartInterval: null
    };

    if (elements.resultsPanel) elements.resultsPanel.classList.add('hidden');
    if (elements.progressBar) elements.progressBar.style.width = '0%';
    updateStats();
    updateProgress();
    updateCursor();
}

function generateText() {
    const mode = elements.testMode?.value || '60s';
    const difficulty = elements.difficulty?.value || 'medium';
    const language = elements.language?.value || 'en';

    const availableWords = wordLists[language]?.[difficulty] || wordLists.en.medium;

    let wordCount = 50;
    if (mode.endsWith('w')) {
        wordCount = parseInt(mode, 10) || 50;
    } else if (mode.endsWith('s')) {
        const seconds = parseInt(mode, 10) || 60;
        wordCount = Math.ceil(seconds / 1.5);
    } else if (mode === 'zen') {
        wordCount = 200;
    }

    const words = [];
    for (let i = 0; i < wordCount; i++) {
        const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        words.push(randomWord);
    }

    gameState.wordList = words;
    gameState.targetText = words.join(' ');
    displayText();
}

function displayText() {
    if (!elements.targetWords) return;
    elements.targetWords.innerHTML = '';

    const text = gameState.targetText || '';
    if (!text) {
        elements.targetWords.innerHTML = '<p class="placeholder-text">Press "New Game" to start typing</p>';
        return;
    }

    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.className = 'char pending';

        const ch = text[i];
        if (ch === ' ') {
            span.classList.add('space-char');
            span.textContent = '\u00A0'; // non‑breaking space so it has width
        } else if (ch === '\n') {
            // optional, if you ever include newlines
            span.classList.add('newline-char');
            span.textContent = '\n';
        } else {
            span.textContent = ch;
        }

        elements.targetWords.appendChild(span);
    }

    updateCursor();
    updateProgress();
    updateStats();
}

function handleKeyDown(e) {
    // Prevent page scroll on space
    if (e.key === ' ') e.preventDefault();

    // Ignore modifier keys and store some useful keys
    const ignoreKeys = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'];
    if (e.ctrlKey || e.altKey || e.metaKey || ignoreKeys.includes(e.key)) {
        return;
    }

    // Start on first typing character input (don't start on Backspace or Enter)
    if (!gameState.isTyping && e.key.length === 1) {
        startTyping();
    }

    if (!gameState.isTyping) return;

    if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        return;
    }

    if (e.key.length === 1) {
        handleCharacterInput(e.key);
        return;
    }

    // Enter as a character (for code mode)
    if (e.key === 'Enter') {
        handleCharacterInput('\n');
    }
}

function handleCharacterInput(key) {
    const idx = gameState.currentCharIndex;
    const targetChar = gameState.targetText[idx];

    if (typeof targetChar === 'undefined') {
        // Already at end, finish
        endGame();
        return;
    }

    const charSpan = elements.targetWords.children[idx];
    if (!charSpan) return;

    // For English mode, do case-insensitive compare; code mode is case-sensitive
    let input = key;
    let expected = targetChar;
    if (gameState.language !== 'code') {
        input = input.toLowerCase();
        expected = expected.toLowerCase();
    }

    // This is an attempt
    gameState.totalChars++;

    if (input === expected) {
        charSpan.classList.remove('pending');
        charSpan.classList.remove('incorrect');
        charSpan.classList.add('correct');
        gameState.correctChars++;
        gameState.combo++;
        if (gameState.combo > gameState.maxCombo) gameState.maxCombo = gameState.combo;

        if (gameState.combo > 0 && gameState.combo % 20 === 0) {
            showComboNotification(gameState.combo);
        }
    } else {
        charSpan.classList.remove('pending');
        charSpan.classList.remove('correct');
        charSpan.classList.add('incorrect');
        gameState.totalErrors++;
        gameState.combo = 0;
    }

    gameState.currentCharIndex++;
    updateCursor();
    updateStats();
    updateProgress();

    // If completed text
    if (gameState.currentCharIndex >= gameState.targetText.length) {
        endGame();
    }
}

function handleBackspace() {
    if (gameState.currentCharIndex <= 0) return;

    gameState.currentCharIndex--;
    const charSpan = elements.targetWords.children[gameState.currentCharIndex];
    if (!charSpan) return;

    // Adjust counts based on previous state
    if (charSpan.classList.contains('correct')) {
        gameState.correctChars = Math.max(0, gameState.correctChars - 1);
    } else if (charSpan.classList.contains('incorrect')) {
        gameState.totalErrors = Math.max(0, gameState.totalErrors - 1);
    }

    // Revert to pending
    charSpan.classList.remove('correct', 'incorrect', 'current-char');
    charSpan.classList.add('pending');

    // Adjust totalChars too (we consider that removing a typed attempt reduces total attempts)
    gameState.totalChars = Math.max(0, gameState.totalChars - 1);

    updateCursor();
    updateStats();
    updateProgress();
}

function startTyping() {
    gameState.isTyping = true;
    gameState.startTime = Date.now();

    // Clear any previous intervals
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    if (gameState.chartInterval) clearInterval(gameState.chartInterval);

    gameState.timerInterval = setInterval(updateTimer, 250);
    gameState.chartInterval = setInterval(updateChart, 1000);
}

function endGame() {
    if (!gameState.isTyping) {
        // If not typing but there's text typed (e.g., immediate end), still finalize
    }
    gameState.isTyping = false;

    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    if (gameState.chartInterval) clearInterval(gameState.chartInterval);

    // Compute final stats
    const timeInSeconds = Math.max(1, (Date.now() - gameState.startTime) / 1000);
    const timeInMinutes = Math.max(timeInSeconds / 60, 1 / 60);
    const wpm = Math.round((gameState.correctChars / 5) / timeInMinutes) || 0;
    const accuracy = gameState.totalChars > 0 ? Math.round((gameState.correctChars / gameState.totalChars) * 100) : 0;
    const rawWPM = Math.round((gameState.totalChars / 5) / timeInMinutes) || 0;

    // Update profile stats
    userProfile.stats.totalTests = (userProfile.stats.totalTests || 0) + 1;
    if (wpm > (userProfile.stats.bestWPM || 0)) {
        userProfile.stats.bestWPM = wpm;
        showNewRecord(wpm);
    }

    // Running average updates
    const prevCount = userProfile.stats.totalTests - 1;
    userProfile.stats.avgWPM = Math.round(((userProfile.stats.avgWPM || 0) * prevCount + wpm) / (prevCount + 1));
    userProfile.stats.avgAccuracy = Math.round(((userProfile.stats.avgAccuracy || 0) * prevCount + accuracy) / (prevCount + 1));

    // Check achievements
    checkAchievements(wpm, accuracy, timeInSeconds);

    // Display results
    if (elements.finalWPM) elements.finalWPM.textContent = wpm;
    if (elements.finalAccuracy) elements.finalAccuracy.textContent = accuracy + '%';
    if (elements.finalTime) elements.finalTime.textContent = formatTime(timeInSeconds);
    if (elements.finalCombo) elements.finalCombo.textContent = gameState.maxCombo;
    if (elements.totalChars) elements.totalChars.textContent = gameState.totalChars;
    if (elements.correctCharsCount) elements.correctCharsCount.textContent = gameState.correctChars;
    if (elements.totalErrorsCount) elements.totalErrorsCount.textContent = gameState.totalErrors;
    if (elements.rawWPM) elements.rawWPM.textContent = rawWPM;

    if (elements.resultsPanel) elements.resultsPanel.classList.remove('hidden');

    saveUserProfile();
    updateUI();
}

/* ===== UI UPDATE FUNCTIONS ===== */
function updateStats() {
    if (!elements.wpm || !elements.accuracy) return;

    if (!gameState.isTyping && gameState.totalChars === 0) {
        elements.wpm.textContent = '0';
        elements.accuracy.textContent = '100%';
        if (elements.errors) elements.errors.textContent = '0';
        if (elements.combo) elements.combo.textContent = '0';
        return;
    }

    const elapsedMs = Math.max(1, Date.now() - gameState.startTime);
    const timeInMinutes = Math.max(elapsedMs / 60000, 1 / 60);
    const wpm = Math.round((gameState.correctChars / 5) / timeInMinutes) || 0;
    const accuracy = gameState.totalChars > 0 ? Math.round((gameState.correctChars / gameState.totalChars) * 100) : 100;

    elements.wpm.textContent = wpm;
    elements.accuracy.textContent = accuracy + '%';
    if (elements.errors) elements.errors.textContent = gameState.totalErrors;
    if (elements.combo) elements.combo.textContent = gameState.combo;
}

function updateTimer() {
    if (!elements.timer) return;
    const mode = elements.testMode?.value || gameState.testMode || '60s';

    if (mode === 'zen') {
        const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
        elements.timer.textContent = formatTime(elapsed);
    } else if (mode.endsWith('s')) {
        const totalSeconds = parseInt(mode, 10) || 60;
        const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
        const remaining = Math.max(0, totalSeconds - elapsed);
        elements.timer.textContent = formatTime(remaining);
        if (remaining === 0) endGame();
    } else {
        const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
        elements.timer.textContent = formatTime(elapsed);
    }
}

function updateProgress() {
    if (!elements.progressBar) return;
    const total = gameState.targetText.length || 1;
    const progress = Math.min(100, (gameState.currentCharIndex / total) * 100);
    elements.progressBar.style.width = progress + '%';
}

function updateCursor() {
    if (!elements.cursor || !elements.gameArea || !elements.targetWords) return;

    const idx = gameState.currentCharIndex;
    if (idx < elements.targetWords.children.length) {
        const charSpan = elements.targetWords.children[idx];
        const rect = charSpan.getBoundingClientRect();
        const containerRect = elements.gameArea.getBoundingClientRect();

        elements.cursor.style.left = (rect.left - containerRect.left + elements.gameArea.scrollLeft) + 'px';
        elements.cursor.style.top = (rect.top - containerRect.top + elements.gameArea.scrollTop) + 'px';
        elements.cursor.style.height = rect.height + 'px';

        Array.from(elements.targetWords.children).forEach(span => span.classList.remove('current-char'));
        charSpan.classList.add('current-char');
    } else {
        elements.cursor.style.opacity = 0;
    }
}

function updateUI() {
    if (elements.bestWPM) elements.bestWPM.textContent = userProfile.stats.bestWPM || 0;
    if (elements.avgWPM) elements.avgWPM.textContent = userProfile.stats.avgWPM || 0;
    if (elements.totalTests) elements.totalTests.textContent = userProfile.stats.totalTests || 0;
    if (elements.streak) elements.streak.textContent = userProfile.stats.streak || 0;
}

/* ===== CHART FUNCTIONS ===== */
function initializeChart() {
    const canvas = elements.wpmChart;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
}

function updateChart() {
    if (!gameState.isTyping) return;

    // compute current WPM
    const elapsedMin = Math.max((Date.now() - gameState.startTime) / 60000, 1 / 60);
    const wpm = Math.round((gameState.correctChars / 5) / elapsedMin) || 0;

    gameState.wpmHistory.push(wpm);
    if (gameState.wpmHistory.length > 120) gameState.wpmHistory.shift();

    const canvas = elements.wpmChart;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // resize for devicePixelRatio for crispness
    const DPR = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    ctx.scale(DPR, DPR);

    // clear
    ctx.clearRect(0, 0, width, height);

    const padding = 12;
    // grid
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (height - padding * 2) * (i / 4);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // draw line
    ctx.beginPath();
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#0891b2';
    ctx.lineWidth = 2;
    const data = gameState.wpmHistory;
    const maxWPM = 150;
    data.forEach((val, i) => {
        const x = padding + (width - padding * 2) * (i / Math.max(1, data.length - 1));
        const y = height - padding - (Math.min(val, maxWPM) / maxWPM) * (height - padding * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // points
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#0891b2';
    data.forEach((val, i) => {
        const x = padding + (width - padding * 2) * (i / Math.max(1, data.length - 1));
        const y = height - padding - (Math.min(val, maxWPM) / maxWPM) * (height - padding * 2);
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

/* ===== ACHIEVEMENT FUNCTIONS ===== */
function checkAchievements(wpm, accuracy, timeInSeconds) {
    const achievements = userProfile.achievements;

    if (wpm >= achievements.speedDemon.threshold && !achievements.speedDemon.unlocked) {
        unlockAchievement('speedDemon');
    }
    if (accuracy === 100 && !achievements.perfectionist.unlocked) {
        unlockAchievement('perfectionist');
    }
    if ((elements.testMode?.value === '300s' || gameState.testMode === '300s') && !achievements.marathon.unlocked) {
        unlockAchievement('marathon');
    }
    if (gameState.maxCombo >= achievements.combo50.threshold && !achievements.combo50.unlocked) {
        unlockAchievement('combo50');
    }
    if ((userProfile.stats.totalTests || 0) >= achievements.persistent.threshold && !achievements.persistent.unlocked) {
        unlockAchievement('persistent');
    }
}

function unlockAchievement(key) {
    if (!userProfile.achievements[key]) return;
    userProfile.achievements[key].unlocked = true;
    showAchievementNotification(userProfile.achievements[key]);
    saveUserProfile();
    updateAchievementsDisplay();
}

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '-420px';
    notification.style.background = 'linear-gradient(135deg,#0891b2,#047b9a)';
    notification.style.color = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 10px 30px rgba(2,6,23,0.2)';
    notification.style.zIndex = 20000;
    notification.innerHTML = `
        <div style="font-size:1.6rem; margin-right:.6rem">${achievement.icon}</div>
        <div>
            <div style="font-weight:700">${achievement.name}</div>
            <div style="font-size:.9rem; opacity:.95">${achievement.desc}</div>
        </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.style.right = '20px', 100);
    setTimeout(() => {
        notification.style.right = '-420px';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function updateAchievementsDisplay() {
    if (!elements.achievementsGrid) return;
    elements.achievementsGrid.innerHTML = '';

    Object.entries(userProfile.achievements).forEach(([key, ach]) => {
        const div = document.createElement('div');
        div.className = `achievement-item ${ach.unlocked ? 'unlocked' : ''}`;
        div.innerHTML = `
            <div class="achievement-icon" style="font-size:1.5rem">${ach.icon}</div>
            <div class="achievement-name" style="font-weight:700; font-size:.9rem">${ach.name}</div>
        `;
        div.title = ach.desc;
        elements.achievementsGrid.appendChild(div);
    });

    if (elements.achievementsPanel) elements.achievementsPanel.classList.remove('hidden');
}

function showComboNotification(combo) {
    const notification = document.createElement('div');
    notification.className = 'combo-notification';
    notification.textContent = `${combo}x COMBO!`;
    notification.style.position = 'absolute';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%,-50%)';
    notification.style.fontSize = `${Math.min(26 + combo / 2, 56)}px`;
    notification.style.color = '#FFD700';
    notification.style.fontWeight = '800';
    notification.style.zIndex = '100';
    elements.gameArea.appendChild(notification);
    setTimeout(() => notification.remove(), 1000);
}

function showNewRecord(wpm) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '-420px';
    notification.style.background = 'linear-gradient(135deg,#0891b2,#047b9a)';
    notification.style.color = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 10px 30px rgba(2,6,23,0.2)';
    notification.style.zIndex = 20000;
    notification.innerHTML = `
        <div style="font-size:1.6rem; margin-right:.6rem">🏆</div>
        <div>
            <div style="font-weight:700">New Personal Record!</div>
            <div style="font-size:.9rem; opacity:.95">${wpm} WPM</div>
        </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.style.right = '20px', 100);
    setTimeout(() => {
        notification.style.right = '-420px';
        setTimeout(() => notification.remove(), 500);
    }, 3500);
}

/* ===== UTILITIES ===== */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function handleFocus() {
    if (elements.focusPrompt) elements.focusPrompt.style.opacity = '0';
}

function handleBlur() {
    if (!gameState.isTyping) {
        if (elements.focusPrompt) elements.focusPrompt.style.opacity = '1';
    }
}

/* ===== SETTINGS / EXPORT / RESET / SHARE ===== */
function openSettings() {
    if (!elements.settingsModal) return;
    elements.settingsModal.classList.remove('hidden');
    elements.settingsModal.setAttribute('aria-hidden', 'false');
    if (elements.welcomeUser) elements.welcomeUser.textContent = auth.username ? `Welcome, ${auth.username}` : 'Welcome';
}

function closeSettings() {
    if (!elements.settingsModal) return;
    elements.settingsModal.classList.add('hidden');
    elements.settingsModal.setAttribute('aria-hidden', 'true');
    saveUserProfile();
}

function exportStatistics() {
    const data = {
        profile: userProfile,
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hippotype-stats-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function resetStatistics() {
    if (!confirm('Are you sure you want to reset all statistics? This cannot be undone.')) return;

    userProfile.stats = { totalTests: 0, bestWPM: 0, avgWPM: 0, avgAccuracy: 0, streak: 0 };
    Object.keys(userProfile.achievements).forEach(k => userProfile.achievements[k].unlocked = false);
    saveUserProfile();
    updateUI();
    updateAchievementsDisplay();
    alert('All statistics have been reset.');
}

function shareResults() {
    const text = `I just typed ${elements.finalWPM?.textContent || '0'} WPM with ${elements.finalAccuracy?.textContent || '0%'} accuracy on HippoType! Can you beat me?`;
    if (navigator.share) {
        navigator.share({ title: 'HippoType Results', text: text, url: window.location.href })
            .catch(err => console.log('Share failed:', err));
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => alert('Results copied to clipboard!')).catch(() => {});
    } else {
        alert(text);
    }
}
