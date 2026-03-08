/* ============================================
   FitPulse — 3D Fitness Tracker
   Full Interactive App Logic
   ============================================ */

const DEFAULT_STATE = {
  isLoggedIn: false,
  profile: {
    name: 'Alex Johnson',
    email: 'alex@fitpulse.com',
    age: 28,
    weight: 72,
    height: 175,
    gender: 'Male',
    avatarSeed: 'FitUser'
  },
  goals: {
    steps: 10000,
    calories: 600,
    distance: 6.0,
    time: 60,
    water: 8
  },
  appearance: {
    theme: 'dark',
    accent: 'blue',
    fontSize: 16
  },
  settings: {
    language: 'English',
    units: 'Metric',
    darkMode: true,
    pushNotif: true,
    emailNotif: false,
    reminders: true
  },
  notifications: [
    { id: 1, icon: '🎯', bg: 'rgba(0,212,255,0.12)', title: 'Daily Goal Almost Done!', desc: 'You\'re at 8,432 steps. Just 1,568 more to hit your 10,000 step goal!', time: '5 min ago', unread: true },
    { id: 2, icon: '🔥', bg: 'rgba(249,115,22,0.12)', title: 'Calorie Target Update', desc: 'You\'ve burned 487 calories today. Keep going to reach 600!', time: '22 min ago', unread: true },
    { id: 3, icon: '❤️', bg: 'rgba(236,72,153,0.12)', title: 'Heart Rate Normal', desc: 'Your resting heart rate is 72 bpm — well within healthy range.', time: '1 hour ago', unread: true },
    { id: 4, icon: '🏃', bg: 'rgba(0,212,255,0.12)', title: 'Morning Run Completed', desc: 'Great workout! You ran 5.2 km in 28 minutes and burned 320 calories.', time: '3 hours ago', unread: false },
    { id: 5, icon: '🏆', bg: 'rgba(168,85,247,0.12)', title: 'Achievement Unlocked!', desc: 'You\'ve completed 7 consecutive active days! Keep the streak alive.', time: '1 day ago', unread: true },
    { id: 6, icon: '💧', bg: 'rgba(6,182,212,0.12)', title: 'Hydration Reminder', desc: 'Don\'t forget to drink water! You\'ve had 4 of 8 glasses today.', time: '1 day ago', unread: false },
    { id: 7, icon: '📊', bg: 'rgba(34,197,94,0.12)', title: 'Weekly Report Ready', desc: 'Your weekly fitness summary is ready. Tap to view your performance.', time: '2 days ago', unread: true },
  ]
};

let AppState = { ...DEFAULT_STATE };

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initLogin();
  applyStateToUI();
  initGreeting();
  initNavigation();
  initProgressBar();
  initRings();
  initActivityRings();
  initCounters();
  initBarChart();
  initCircularStats();
  initRevealAnimations();
  initPanelSystem();
  initNotifications();
  initSettings();
  initWorkoutTimer();
  initProfileMenus();
  initStatCardClicks();
  initActivityDetailsBtn();
  initViewAllActivity();
  initGoalsSliders();
  initAppearancePanel();
  initDeviceButtons();
  initClickableRows();
  initHeaderAvatarBtn();
});

function initLogin() {
  const loginBtn = document.getElementById('btn-login');
  if (!loginBtn) return;

  loginBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('login-name');
    const ageInput = document.getElementById('login-age');

    const name = nameInput.value.trim();
    const age = parseInt(ageInput.value);

    if (!name || isNaN(age)) {
      showToast('⚠️ Please enter a valid name and age');
      return;
    }

    AppState.profile.name = name;
    AppState.profile.age = age;
    AppState.isLoggedIn = true;

    showLoading(() => {
      saveState();
      applyStateToUI();
      showToast(`🚀 Welcome, ${name.split(' ')[0]}!`);
    });
  });
}

function showLoading(callback) {
  const loginScreen = document.getElementById('screen-login');
  const loadingScreen = document.getElementById('screen-loading');
  const fill = document.getElementById('loading-fill');
  const pct = document.getElementById('loading-pct');
  const msg = document.getElementById('loading-msg');

  if (loginScreen) loginScreen.classList.remove('active');
  if (loadingScreen) loadingScreen.classList.add('active');

  const messages = [
    "Personalizing your experience...",
    "Analyzing your fitness goals...",
    "Preparing your dashboard...",
    "Almost there..."
  ];

  let progress = 0;
  const duration = 2500; // 2.5 seconds
  const interval = 30; // updates every 30ms
  const increment = 100 / (duration / interval);

  const timer = setInterval(() => {
    progress += increment;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      setTimeout(() => {
        if (loadingScreen) loadingScreen.classList.remove('active');
        callback();
      }, 300);
    }

    if (fill) fill.style.width = progress + '%';
    if (pct) pct.textContent = Math.round(progress) + '%';

    if (msg) {
      if (progress > 90) msg.textContent = messages[3];
      else if (progress > 60) msg.textContent = messages[2];
      else if (progress > 30) msg.textContent = messages[1];
    }
  }, interval);
}

/* ============================================
   STATE MANAGEMENT
   ============================================ */
function saveState() {
  localStorage.setItem('fitPulseState', JSON.stringify(AppState));
}

function loadState() {
  const saved = localStorage.getItem('fitPulseState');
  if (saved) {
    try {
      AppState = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading state', e);
      AppState = { ...DEFAULT_STATE };
    }
  }
}

const TRANSLATIONS = {
  English: {
    greeting: 'Good Morning',
    home: 'Home',
    workouts: 'Workouts',
    stats: 'Stats',
    profile: 'Profile',
    steps_goal: 'Daily Goal Almost Done!',
    save: '💾 Save',
    back: '← Back',
    settings: 'Settings'
  },
  Spanish: {
    greeting: 'Buenos Días',
    home: 'Inicio',
    workouts: 'Entrenamientos',
    stats: 'Estadísticas',
    profile: 'Perfil',
    steps_goal: '¡Meta diaria casi lograda!',
    save: '💾 Guardar',
    back: '← Atrás',
    settings: 'Ajustes'
  },
  Hindi: {
    greeting: 'शुभ प्रभात',
    home: 'मुख्य',
    workouts: 'व्यायाम',
    stats: 'आंकड़े',
    profile: 'प्रोफ़ाइल',
    steps_goal: 'दैनिक लक्ष्य लगभग पूरा!',
    save: '💾 सहेजें',
    back: '← पीछे',
    settings: 'सेटिंग्स'
  },
  Urdu: {
    greeting: 'صبح بخیر',
    home: 'ہوم',
    workouts: 'ورزش',
    stats: 'اعداد و شمار',
    profile: 'پروفائل',
    steps_goal: 'روزانہ کا ہدف تقریباً مکمل!',
    save: '💾 محفوظ کریں',
    back: '← پیچھے',
    settings: 'سیٹنگز'
  }
};

function applyStateToUI() {
  const lang = AppState.settings.language || 'English';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.English;

  // Update Profile Text
  document.querySelectorAll('.profile-hero h2').forEach(el => el.textContent = AppState.profile.name);

  // Restore Avatar
  setAvatarImage();

  document.querySelectorAll('.profile-avatar img, .profile-pic-large img').forEach(img => {
    img.src = createAvatarSVG(AppState.profile.avatarSeed);
  });

  // Update Appearance (Theme)
  document.documentElement.setAttribute('data-theme', AppState.appearance.theme);
  const colors = {
    blue: '#00d4ff',
    purple: '#a855f7',
    pink: '#ec4899',
    green: '#22c55e',
    orange: '#f97316',
    yellow: '#eab308'
  };
  const accent = colors[AppState.appearance.accent] || colors.blue;
  document.documentElement.style.setProperty('--neon-blue', accent);
  document.documentElement.style.setProperty('--font-size-base', AppState.appearance.fontSize + 'px');
  document.body.style.fontSize = AppState.appearance.fontSize + 'px';

  // Translate Navigation & Headers
  document.querySelectorAll('.nav-item[data-screen="screen-home"] span').forEach(el => el.textContent = t.home);
  document.querySelectorAll('.nav-item[data-screen="screen-workouts"] span').forEach(el => el.textContent = t.workouts);
  document.querySelectorAll('.nav-item[data-screen="screen-stats"] span').forEach(el => el.textContent = t.stats);
  document.querySelectorAll('.nav-item[data-screen="screen-profile"] span').forEach(el => el.textContent = t.profile);

  const settingsHeader = document.querySelector('#panel-settings h3');
  if (settingsHeader) settingsHeader.textContent = t.settings;

  // Update Greeting
  initGreeting();

  // Update Goals in dashboard
  const goalBar = document.getElementById('goal-bar');
  if (goalBar) {
    goalBar.dataset.target = Math.round((487 / AppState.goals.calories) * 100);
  }

  // Handle Login Screen Visibility
  const loginScreen = document.getElementById('screen-login');
  const loadingScreen = document.getElementById('screen-loading');
  const navBar = document.querySelector('.nav-bar');

  if (AppState.isLoggedIn) {
    if (loginScreen) loginScreen.classList.remove('active');
    if (loadingScreen) loadingScreen.classList.remove('active');
    if (navBar) navBar.style.display = 'flex';

    // Auto-activate home screen if currently on login or loading
    const activeScreen = document.querySelector('.screen.active');
    if (!activeScreen || activeScreen.id === 'screen-login' || activeScreen.id === 'screen-loading') {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      const home = document.getElementById('screen-home');
      if (home) {
        home.classList.add('active');
        home.style.animation = 'screenFadeIn 0.5s ease-out';
      }
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      const navHome = document.getElementById('nav-home');
      if (navHome) navHome.classList.add('active');

      // Re-trigger dash animations
      setTimeout(() => { initRings(); initProgressBar(); }, 100);
    }
  } else {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    if (loginScreen) {
      loginScreen.classList.add('active');
      loginScreen.style.animation = 'screenFadeIn 0.5s ease-out';
    }
    if (navBar) navBar.style.display = 'none';
  }

  // Fill inputs in panels
  syncInputsWithState();
}

function syncInputsWithState() {
  // Profile
  const profilePanel = document.getElementById('panel-edit-profile');
  if (profilePanel) {
    const inputs = profilePanel.querySelectorAll('input, select');
    if (inputs[0]) inputs[0].value = AppState.profile.name;
    if (inputs[1]) inputs[1].value = AppState.profile.email;
    if (inputs[2]) inputs[2].value = AppState.profile.age;
    if (inputs[3]) inputs[3].value = AppState.profile.weight;
    if (inputs[4]) inputs[4].value = AppState.profile.height;
    if (inputs[5]) inputs[5].value = AppState.profile.gender;
  }

  // Settings
  document.getElementById('set-language').value = AppState.settings.language;
  document.getElementById('set-darkmode').checked = AppState.settings.darkMode;
  document.getElementById('set-steps').value = AppState.goals.steps;
  document.getElementById('set-calories').value = AppState.goals.calories;
  document.getElementById('set-distance').value = AppState.goals.distance;
  document.getElementById('set-push').checked = AppState.settings.pushNotif;
  document.getElementById('set-email').checked = AppState.settings.emailNotif;
  document.getElementById('set-reminders').checked = AppState.settings.reminders;

  // Goals Sliders
  document.getElementById('range-steps').value = AppState.goals.steps;
  document.getElementById('range-steps-val').textContent = AppState.goals.steps.toLocaleString() + ' steps';
  document.getElementById('range-cal').value = AppState.goals.calories;
  document.getElementById('range-cal-val').textContent = AppState.goals.calories + ' cal';
  document.getElementById('range-dist').value = AppState.goals.distance;
  document.getElementById('range-dist-val').textContent = AppState.goals.distance + ' km';
  document.getElementById('range-time').value = AppState.goals.time;
  document.getElementById('range-time-val').textContent = AppState.goals.time + ' min';
  document.getElementById('range-water').value = AppState.goals.water;
  document.getElementById('range-water-val').textContent = AppState.goals.water + ' glasses';

  // Appearance
  document.getElementById('range-font').value = AppState.appearance.fontSize;
  document.getElementById('range-font-val').textContent = AppState.appearance.fontSize + 'px';

  document.querySelectorAll('.theme-card').forEach(c => {
    c.classList.toggle('active', c.dataset.theme === AppState.appearance.theme);
  });
  document.querySelectorAll('.color-dot').forEach(d => {
    d.classList.toggle('active', d.dataset.color === AppState.appearance.accent);
  });
}

/* ============================================
   AVATAR
   ============================================ */
function setAvatarImage() {
  const img = document.getElementById('avatar-img');
  img.src = createAvatarSVG(AppState.profile.avatarSeed);
}

function createAvatarSVG(seed = 'FitUser') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" fill="none">
    <defs>
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00d4ff" stop-opacity="0.9"/>
        <stop offset="50%" stop-color="#a855f7" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#ec4899" stop-opacity="0.7"/>
      </linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="100" cy="45" r="25" fill="url(#bodyGrad)" filter="url(#glow)" opacity="0.9"/>
    <rect x="93" y="70" width="14" height="15" rx="4" fill="url(#bodyGrad)" opacity="0.8"/>
    <path d="M65 85 Q100 80 135 85 L130 160 Q100 165 70 160 Z" fill="url(#bodyGrad)" filter="url(#glow)" opacity="0.85"/>
    <path d="M65 90 Q40 95 30 70 Q25 55 35 50" stroke="url(#bodyGrad)" stroke-width="14" stroke-linecap="round" fill="none" filter="url(#glow)" opacity="0.8"/>
    <path d="M135 90 Q155 110 160 140 Q162 155 155 160" stroke="url(#bodyGrad)" stroke-width="14" stroke-linecap="round" fill="none" filter="url(#glow)" opacity="0.8"/>
    <path d="M80 158 Q70 200 50 240 Q45 260 55 270" stroke="url(#bodyGrad)" stroke-width="16" stroke-linecap="round" fill="none" filter="url(#glow)" opacity="0.8"/>
    <path d="M115 158 Q130 200 145 240 Q150 255 140 265" stroke="url(#bodyGrad)" stroke-width="16" stroke-linecap="round" fill="none" filter="url(#glow)" opacity="0.8"/>
    <circle cx="100" cy="120" r="60" stroke="#00d4ff" stroke-width="0.5" fill="none" opacity="0.2"/>
    <circle cx="100" cy="120" r="80" stroke="#a855f7" stroke-width="0.3" fill="none" opacity="0.15"/>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(svg);
}

/* ============================================
   GREETING
   ============================================ */
function initGreeting() {
  const el = document.getElementById('greeting-text');
  const h = new Date().getHours();
  const lang = AppState.settings.language || 'English';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.English;

  const timeStr = h < 12 ? (t.greeting === 'Good Morning' ? 'Good Morning' : t.greeting) :
    h < 17 ? (lang === 'Spanish' ? 'Buenas Tardes' : 'Good Afternoon') :
      (lang === 'Spanish' ? 'Buenas Noches' : 'Good Evening');

  const icon = h < 12 ? '☀️' : h < 17 ? '🌤️' : '🌙';
  const firstName = AppState.profile.name.split(' ')[0];
  el.textContent = `${timeStr}, ${firstName} ${icon}`;
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const screens = document.querySelectorAll('.screen');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetScreen = item.dataset.screen;
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      screens.forEach(s => { s.classList.remove('active'); s.style.animation = 'none'; });
      const target = document.getElementById(targetScreen);
      target.classList.add('active');
      target.style.animation = 'screenFadeIn 0.5s ease-out';

      if (targetScreen === 'screen-stats') {
        setTimeout(() => { renderBarChart(); animateCircularStats(); initCountersInElement(target); }, 100);
      }
      if (targetScreen === 'screen-home') {
        setTimeout(() => { initRings(); initActivityRings(); initCountersInElement(target); initProgressBar(); }, 100);
      }
    });
  });
}

/* ============================================
   PROGRESS BAR
   ============================================ */
function initProgressBar() {
  const bar = document.getElementById('goal-bar');
  const pct = document.getElementById('goal-percent');
  const t = parseInt(bar.dataset.target);
  setTimeout(() => { bar.style.width = t + '%'; animateNumber(pct, 0, t, 1500, '%'); }, 500);
}

/* ============================================
   RINGS
   ============================================ */
function initRings() {
  document.querySelectorAll('.mini-ring .ring-progress').forEach(ring => {
    const p = parseInt(ring.dataset.percent) || 0;
    const c = 2 * Math.PI * 32;
    ring.style.strokeDasharray = c;
    ring.style.strokeDashoffset = c;
    setTimeout(() => { ring.style.strokeDashoffset = c - (p / 100) * c; }, 800);
  });
}

function initActivityRings() {
  document.querySelectorAll('.activity-ring-fill').forEach(ring => {
    const p = parseInt(ring.dataset.percent) || 0;
    const r = parseInt(ring.getAttribute('r'));
    const c = 2 * Math.PI * r;
    ring.style.setProperty('--circumference', c);
    ring.style.strokeDasharray = c;
    ring.style.strokeDashoffset = c;
    setTimeout(() => { ring.style.strokeDashoffset = c - (p / 100) * c; }, 1000);
  });
}

/* ============================================
   COUNTERS
   ============================================ */
function initCounters() {
  document.querySelectorAll('#screen-home .counter').forEach(c => animateCounter(c, parseInt(c.dataset.target)));
}

function initCountersInElement(el) {
  el.querySelectorAll('.counter').forEach(c => { c.textContent = '0'; animateCounter(c, parseInt(c.dataset.target), 600); });
}

function animateCounter(el, target, delay = 800) {
  setTimeout(() => {
    const dur = 2000, st = performance.now();
    function upd(t) {
      const p = Math.min((t - st) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(e * target).toLocaleString();
      if (p < 1) requestAnimationFrame(upd);
    }
    requestAnimationFrame(upd);
  }, delay);
}

function animateNumber(el, s, e, dur, sfx = '') {
  const st = performance.now();
  function upd(t) {
    const p = Math.min((t - st) / dur, 1), ea = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(s + (e - s) * ea) + sfx;
    if (p < 1) requestAnimationFrame(upd);
  }
  requestAnimationFrame(upd);
}

/* ============================================
   BAR CHART
   ============================================ */
const weeklyData = [
  { day: 'Mon', value: 45, color: 'var(--grad-blue-purple)' },
  { day: 'Tue', value: 72, color: 'var(--grad-pink-purple)' },
  { day: 'Wed', value: 38, color: 'var(--grad-green-cyan)' },
  { day: 'Thu', value: 85, color: 'var(--grad-orange-pink)' },
  { day: 'Fri', value: 60, color: 'var(--grad-blue-cyan)' },
  { day: 'Sat', value: 92, color: 'var(--grad-blue-purple)' },
  { day: 'Sun', value: 55, color: 'var(--grad-pink-purple)' }
];

function initBarChart() {
  const c = document.getElementById('barChart');
  if (!c) return;
  c.innerHTML = '';
  weeklyData.forEach(d => {
    const col = document.createElement('div'); col.className = 'bar-col';
    const v = document.createElement('div'); v.className = 'bar-value'; v.textContent = d.value + ' min';
    const b = document.createElement('div'); b.className = 'bar'; b.style.background = d.color; b.style.height = '0%'; b.dataset.height = d.value + '%';
    const l = document.createElement('div'); l.className = 'bar-label'; l.textContent = d.day;
    col.append(v, b, l); c.appendChild(col);
  });
}

function renderBarChart() {
  document.querySelectorAll('#barChart .bar').forEach((b, i) => {
    b.style.height = '0%';
    setTimeout(() => { b.style.height = b.dataset.height; }, 200 + i * 100);
  });
}

function initCircularStats() { }
function animateCircularStats() {
  const c = 2 * Math.PI * 39;
  document.querySelectorAll('.circular-ring-fill:not(.detail-fill)').forEach(r => {
    const p = parseInt(r.dataset.percent) || 0;
    r.style.strokeDasharray = c;
    r.style.strokeDashoffset = c;
    setTimeout(() => { r.style.strokeDashoffset = c - (p / 100) * c; }, 300);
  });
}

function initRevealAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ============================================
   PANEL SYSTEM
   ============================================ */
let openPanelStack = [];

function openPanel(id) {
  const panel = document.getElementById(id);
  const overlay = document.getElementById('overlay');
  if (!panel) return;
  openPanelStack.push(id);
  overlay.classList.add('active');
  panel.classList.add('open');
  // animate detail rings if present
  if (id === 'panel-activity-details') {
    setTimeout(() => animateDetailRings(), 300);
  }
}

function closePanel(id) {
  const panel = document.getElementById(id);
  const overlay = document.getElementById('overlay');
  if (!panel) return;
  panel.classList.remove('open');
  openPanelStack = openPanelStack.filter(p => p !== id);
  if (openPanelStack.length === 0) overlay.classList.remove('active');
}

function closeAllPanels() {
  document.querySelectorAll('.slide-panel.open').forEach(p => p.classList.remove('open'));
  document.getElementById('overlay').classList.remove('active');
  openPanelStack = [];
}

function initPanelSystem() {
  // Overlay click closes all
  document.getElementById('overlay').addEventListener('click', closeAllPanels);

  // Back buttons for main panels
  document.getElementById('notif-back').addEventListener('click', () => closePanel('panel-notifications'));
  document.getElementById('settings-back').addEventListener('click', () => closePanel('panel-settings'));
  document.getElementById('timer-back').addEventListener('click', () => { closePanel('panel-workout-timer'); stopWorkoutTimer(); });
  document.getElementById('activity-details-back').addEventListener('click', () => closePanel('panel-activity-details'));
  document.getElementById('stat-detail-back').addEventListener('click', () => closePanel('panel-stat-detail'));

  // Sub-panel back buttons
  document.querySelectorAll('.sub-back').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.slide-panel');
      if (panel) closePanel(panel.id);
    });
  });

  // Sub-panel save buttons
  document.querySelectorAll('.sub-save').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.slide-panel');
      if (!panel) return;

      if (panel.id === 'panel-edit-profile') saveProfileData(panel);
      else if (panel.id === 'panel-goals') saveGoalsData(panel);
      else if (panel.id === 'panel-appearance') saveAppearanceData(panel);

      showToast('✅ Changes Saved!');
      btn.innerHTML = '✅ Saved';
      setTimeout(() => {
        btn.innerHTML = '💾 Save Changes';
        closePanel(panel.id);
      }, 800);
    });
  });

  // Header buttons
  document.getElementById('btn-notifications').addEventListener('click', () => openPanel('panel-notifications'));
  document.getElementById('btn-settings').addEventListener('click', () => openPanel('panel-settings'));
}

/* ============================================
   NOTIFICATIONS
   ============================================ */
const notificationsData = [
  { icon: '🎯', bg: 'rgba(0,212,255,0.12)', title: 'Daily Goal Almost Done!', desc: 'You\'re at 8,432 steps. Just 1,568 more to hit your 10,000 step goal!', time: '5 min ago', unread: true },
  { icon: '🔥', bg: 'rgba(249,115,22,0.12)', title: 'Calorie Target Update', desc: 'You\'ve burned 487 calories today. Keep going to reach 600!', time: '22 min ago', unread: true },
  { icon: '❤️', bg: 'rgba(236,72,153,0.12)', title: 'Heart Rate Normal', desc: 'Your resting heart rate is 72 bpm — well within healthy range.', time: '1 hour ago', unread: true },
  { icon: '🏃', bg: 'rgba(0,212,255,0.12)', title: 'Morning Run Completed', desc: 'Great workout! You ran 5.2 km in 28 minutes and burned 320 calories.', time: '3 hours ago', unread: false },
  { icon: '🏆', bg: 'rgba(168,85,247,0.12)', title: 'Achievement Unlocked!', desc: 'You\'ve completed 7 consecutive active days! Keep the streak alive.', time: '1 day ago', unread: true },
  { icon: '💧', bg: 'rgba(6,182,212,0.12)', title: 'Hydration Reminder', desc: 'Don\'t forget to drink water! You\'ve had 4 of 8 glasses today.', time: '1 day ago', unread: false },
  { icon: '📊', bg: 'rgba(34,197,94,0.12)', title: 'Weekly Report Ready', desc: 'Your weekly fitness summary is ready. Tap to view your performance.', time: '2 days ago', unread: true },
];

function initNotifications() {
  renderNotifications();
}

function renderNotifications() {
  const list = document.getElementById('notif-list');
  const badge = document.getElementById('notif-badge');
  const unreadCount = AppState.notifications.filter(n => n.unread).length;
  badge.textContent = unreadCount;
  badge.style.display = unreadCount > 0 ? 'flex' : 'none';

  if (AppState.notifications.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">🔔</div><p>No notifications yet</p></div>';
    return;
  }

  list.innerHTML = AppState.notifications.map((n, i) => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" data-index="${i}" data-id="${n.id}">
      <div class="notif-icon" style="background:${n.bg};">${n.icon}</div>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        <div class="notif-desc">${n.desc}</div>
        <div class="notif-time">${n.time}</div>
      </div>
      <button class="notif-dismiss" data-index="${i}" title="Dismiss">✕</button>
    </div>
  `).join('');

  // Dismiss buttons
  list.querySelectorAll('.notif-dismiss').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index);
      AppState.notifications.splice(idx, 1);
      saveState();
      renderNotifications();
      showToast('🔔 Notification dismissed');
    });
  });

  // Click to mark as read
  list.querySelectorAll('.notif-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.index);
      if (AppState.notifications[idx]) {
        AppState.notifications[idx].unread = false;
        saveState();
        renderNotifications();
      }
    });
  });

  // Clear all
  document.getElementById('notif-clear-all').onclick = () => {
    AppState.notifications = [];
    saveState();
    renderNotifications();
    showToast('🗑️ All notifications cleared');
  };
}

/* ============================================
   SETTINGS
   ============================================ */
function initSettings() {
  // Toggle groups
  document.querySelectorAll('.toggle-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      const group = opt.dataset.group;
      document.querySelectorAll(`.toggle-opt[data-group="${group}"]`).forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Save on change (Language)
  document.getElementById('set-language').addEventListener('change', (e) => {
    AppState.settings.language = e.target.value;
    saveState();
    applyStateToUI();
    showToast(`🌐 Language: ${AppState.settings.language}`);
  });

  // Save on change (Dark Mode)
  document.getElementById('set-darkmode').addEventListener('change', (e) => {
    AppState.settings.darkMode = e.target.checked;
    saveState();
    showToast(AppState.settings.darkMode ? '🌙 Dark Mode On' : '☀️ Dark Mode Off');
  });

  // Save button
  document.getElementById('settings-save').addEventListener('click', () => {
    AppState.settings.language = document.getElementById('set-language').value;
    AppState.settings.darkMode = document.getElementById('set-darkmode').checked;
    AppState.goals.steps = parseInt(document.getElementById('set-steps').value);
    AppState.goals.calories = parseInt(document.getElementById('set-calories').value);
    AppState.goals.distance = parseFloat(document.getElementById('set-distance').value);
    AppState.settings.pushNotif = document.getElementById('set-push').checked;
    AppState.settings.emailNotif = document.getElementById('set-email').checked;
    AppState.settings.reminders = document.getElementById('set-reminders').checked;

    saveState();
    applyStateToUI();
    showToast('✅ Settings saved successfully!');
    setTimeout(() => closePanel('panel-settings'), 600);
  });

  // Clickable rows
  document.getElementById('set-export').addEventListener('click', () => {
    showToast('📤 Data exported to Downloads folder');
  });
  document.getElementById('set-reset').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      AppState = { ...DEFAULT_STATE };
      saveState();
      applyStateToUI();
      renderNotifications();
      showToast('🗑️ All data has been reset');
    }
  });
  document.getElementById('set-logout').addEventListener('click', () => {
    if (confirm('Are you sure you want to log out?')) {
      AppState.isLoggedIn = false;
      saveState();
      applyStateToUI();
      showToast('👋 Logged out successfully');
      setTimeout(() => closeAllPanels(), 300);
    }
  });
}

/* ============================================
   WORKOUT TIMER
   ============================================ */
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let currentWorkout = null;

const workoutInfo = {
  running: { icon: '🏃', name: 'Running', calPerMin: 10.7, distPerMin: 0.17 },
  cycling: { icon: '🚴', name: 'Cycling', calPerMin: 6.2, distPerMin: 0.27 },
  yoga: { icon: '🧘', name: 'Yoga', calPerMin: 3.8, distPerMin: 0 },
  weights: { icon: '🏋️', name: 'Weight Training', calPerMin: 8.0, distPerMin: 0 },
};

function initWorkoutTimer() {
  // Start buttons on workout cards
  document.querySelectorAll('.workout-cta').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      startWorkout(btn.dataset.workout);
    });
  });
  // Clicking workout card also starts
  document.querySelectorAll('.workout-card').forEach(card => {
    card.addEventListener('click', () => startWorkout(card.dataset.workout));
  });

  document.getElementById('timer-start').addEventListener('click', resumeWorkoutTimer);
  document.getElementById('timer-pause').addEventListener('click', pauseWorkoutTimer);
  document.getElementById('timer-stop').addEventListener('click', () => {
    stopWorkoutTimer();
    const mins = Math.floor(timerSeconds / 60);
    const cals = Math.round(currentWorkout ? workoutInfo[currentWorkout].calPerMin * (timerSeconds / 60) : 0);
    showToast(`🏅 Workout complete! ${mins} min · ${cals} cal burned`);
    setTimeout(() => closePanel('panel-workout-timer'), 800);
  });
}

function startWorkout(type) {
  currentWorkout = type;
  const info = workoutInfo[type];
  document.getElementById('timer-title').textContent = info.name;
  document.getElementById('timer-icon').textContent = info.icon;
  timerSeconds = 0;
  updateTimerDisplay();
  document.getElementById('timer-cal').textContent = '0';
  document.getElementById('timer-dist').textContent = '0.0';
  document.getElementById('timer-bpm').textContent = '72';
  openPanel('panel-workout-timer');
  setTimeout(resumeWorkoutTimer, 500);
}

function resumeWorkoutTimer() {
  if (timerRunning) return;
  timerRunning = true;
  document.getElementById('timer-start').style.display = 'none';
  document.getElementById('timer-pause').style.display = 'inline-flex';
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
    const info = workoutInfo[currentWorkout];
    const mins = timerSeconds / 60;
    document.getElementById('timer-cal').textContent = Math.round(info.calPerMin * mins);
    document.getElementById('timer-dist').textContent = (info.distPerMin * mins).toFixed(1);
    document.getElementById('timer-bpm').textContent = Math.round(72 + Math.random() * 40 + mins * 2);
  }, 1000);
}

function pauseWorkoutTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  document.getElementById('timer-start').style.display = 'inline-flex';
  document.getElementById('timer-pause').style.display = 'none';
}

function stopWorkoutTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerInterval = null;
  document.getElementById('timer-start').style.display = 'inline-flex';
  document.getElementById('timer-pause').style.display = 'none';
}

function updateTimerDisplay() {
  const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
  const s = (timerSeconds % 60).toString().padStart(2, '0');
  document.getElementById('timer-display').textContent = `${m}:${s}`;
}

/* ============================================
   PROFILE MENU ITEMS
   ============================================ */
function initProfileMenus() {
  document.querySelectorAll('.menu-item[data-panel]').forEach(item => {
    item.addEventListener('click', () => {
      openPanel(item.dataset.panel);
    });
  });
}

/* ============================================
   STAT CARD CLICKS
   ============================================ */
const statDetails = {
  steps: {
    title: 'Steps Detail',
    html: `
      <div class="stat-detail-hero" style="text-align:center;margin-bottom:24px;">
        <div style="font-size:3rem;margin-bottom:8px;">👟</div>
        <div style="font-size:2.5rem;font-weight:900;color:var(--neon-blue);">8,432</div>
        <div style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;">steps today of 10,000 goal</div>
      </div>
      <div class="data-panel"><div class="panel-icon" style="background:rgba(0,212,255,0.12);">📈</div><div class="panel-info"><div class="panel-title">Daily Average</div><div class="panel-desc">Last 7 days</div></div><div class="panel-value" style="color:var(--neon-blue);">7,548</div></div>
      <div class="data-panel"><div class="panel-icon" style="background:rgba(34,197,94,0.12);">🏆</div><div class="panel-info"><div class="panel-title">Best Day</div><div class="panel-desc">This week</div></div><div class="panel-value" style="color:var(--neon-green);">12,340</div></div>
      <div class="data-panel"><div class="panel-icon" style="background:rgba(168,85,247,0.12);">📊</div><div class="panel-info"><div class="panel-title">Weekly Total</div><div class="panel-desc">52,843 steps</div></div><div class="panel-value" style="color:var(--neon-purple);">52.8k</div></div>
    `
  },
  heart: {
    title: 'Heart Rate',
    html: `
      <div class="stat-detail-hero" style="text-align:center;margin-bottom:24px;">
        <div style="font-size:3rem;margin-bottom:8px;">❤️</div>
        <div style="font-size:2.5rem;font-weight:900;color:var(--neon-pink);">85 <small style="font-size:1rem;">bpm</small></div>
        <div style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;">current resting rate</div>
      </div>
      <div class="data-panel"><div class="panel-icon" style="background:rgba(236,72,153,0.12);">📉</div><div class="panel-info"><div class="panel-title">Resting Rate</div><div class="panel-desc">Average this week</div></div><div class="panel-value" style="color:var(--neon-pink);">72 bpm</div></div>
      <div class="data-panel"><div class="panel-icon" style="background:rgba(249,115,22,0.12);">📈</div><div class="panel-info"><div class="panel-title">Peak Rate</div><div class="panel-desc">During workout today</div></div><div class="panel-value" style="color:var(--neon-orange);">156 bpm</div></div>
      <div class="data-panel"><div class="panel-icon" style="background:rgba(34,197,94,0.12);">💚</div><div class="panel-info"><div class="panel-title">Health Status</div><div class="panel-desc">Heart rate zone</div></div><div class="panel-value" style="color:var(--neon-green);">Normal</div></div>
    `
  },
  calories: {
    title: 'Calories',
    html: `
      <div class="stat-detail-hero" style="text-align:center;margin-bottom:24px;">
        <div style="font-size:3rem;margin-bottom:8px;">🔥</div>
        <div style="font-size:2.5rem;font-weight:900;color:var(--neon-orange);">487</div>
        <div style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;">calories burned of 600 goal</div>
      </div>
      <div class="data-panel"><div class="panel-icon" style="background:rgba(249,115,22,0.12);">🏃</div><div class="panel-info"><div class="panel-title">From Exercise</div><div class="panel-desc">Active calories</div></div><div class="panel-value" style="color:var(--neon-orange);">320 cal</div></div>
      <div class="data-panel"><div class="panel-icon" style="background:rgba(0,212,255,0.12);">🚶</div><div class="panel-info"><div class="panel-title">From Walking</div><div class="panel-desc">Step-based burn</div></div><div class="panel-value" style="color:var(--neon-blue);">167 cal</div></div>
      <div class="data-panel"><div class="panel-icon" style="background:rgba(168,85,247,0.12);">📊</div><div class="panel-info"><div class="panel-title">Weekly Total</div><div class="panel-desc">3,240 calories</div></div><div class="panel-value" style="color:var(--neon-purple);">3.2k</div></div>
    `
  },
  distance: {
    title: 'Distance',
    html: `
      <div class="stat-detail-hero" style="text-align:center;margin-bottom:24px;">
        <div style="font-size:3rem;margin-bottom:8px;">📍</div>
        <div style="font-size:2.5rem;font-weight:900;color:var(--neon-green);">4.2 <small style="font-size:1rem;">km</small></div>
        <div style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;">today of 6.0 km goal</div>
      </div>
      <div class="data-panel"><div class="panel-icon" style="background:rgba(34,197,94,0.12);">🏃</div><div class="panel-info"><div class="panel-title">From Running</div><div class="panel-desc">Morning workout</div></div><div class="panel-value" style="color:var(--neon-green);">3.4 km</div></div>
      <div class="data-panel"><div class="panel-icon" style="background:rgba(0,212,255,0.12);">🚶</div><div class="panel-info"><div class="panel-title">From Walking</div><div class="panel-desc">Throughout the day</div></div><div class="panel-value" style="color:var(--neon-blue);">0.8 km</div></div>
      <div class="data-panel"><div class="panel-icon" style="background:rgba(168,85,247,0.12);">📊</div><div class="panel-info"><div class="panel-title">Weekly Total</div><div class="panel-desc">28.5 km covered</div></div><div class="panel-value" style="color:var(--neon-purple);">28.5 km</div></div>
    `
  }
};

function initStatCardClicks() {
  ['steps', 'heart', 'calories', 'distance'].forEach(type => {
    const card = document.getElementById('card-' + type);
    if (card) {
      card.addEventListener('click', () => {
        const d = statDetails[type];
        document.getElementById('stat-detail-title').textContent = d.title;
        document.getElementById('stat-detail-body').innerHTML = d.html;
        openPanel('panel-stat-detail');
      });
    }
  });
}

/* ============================================
   ACTIVITY DETAILS
   ============================================ */
function initActivityDetailsBtn() {
  document.getElementById('btn-activity-details').addEventListener('click', () => {
    openPanel('panel-activity-details');
  });
}

function animateDetailRings() {
  const c = 2 * Math.PI * 39;
  document.querySelectorAll('.detail-fill').forEach(r => {
    const p = parseInt(r.dataset.percent) || 0;
    r.style.strokeDasharray = c;
    r.style.strokeDashoffset = c;
    setTimeout(() => { r.style.strokeDashoffset = c - (p / 100) * c; }, 200);
  });
}

/* ============================================
   VIEW ALL ACTIVITY
   ============================================ */
function initViewAllActivity() {
  document.getElementById('btn-view-all-activity').addEventListener('click', () => {
    showToast('📋 Showing all activity history');
  });
}

/* ============================================
   GOALS SLIDERS
   ============================================ */
function initGoalsSliders() {
  const sliders = [
    { id: 'range-steps', valId: 'range-steps-val', suffix: ' steps', format: v => parseInt(v).toLocaleString() + ' steps' },
    { id: 'range-cal', valId: 'range-cal-val', suffix: ' cal', format: v => v + ' cal' },
    { id: 'range-dist', valId: 'range-dist-val', suffix: ' km', format: v => parseFloat(v).toFixed(1) + ' km' },
    { id: 'range-time', valId: 'range-time-val', suffix: ' min', format: v => v + ' min' },
    { id: 'range-water', valId: 'range-water-val', suffix: ' glasses', format: v => v + ' glasses' },
    { id: 'range-font', valId: 'range-font-val', suffix: 'px', format: v => v + 'px' },
  ];
  sliders.forEach(s => {
    const slider = document.getElementById(s.id);
    const val = document.getElementById(s.valId);
    if (slider && val) {
      slider.addEventListener('input', () => { val.textContent = s.format(slider.value); });
    }
  });
}

/* ============================================
   APPEARANCE PANEL
   ============================================ */
function initAppearancePanel() {
  // Theme cards
  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      AppState.appearance.theme = card.dataset.theme;
      document.documentElement.setAttribute('data-theme', AppState.appearance.theme);
      saveState(); // Auto-save
    });
  });
  // Color dots
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      AppState.appearance.accent = dot.dataset.color;

      const colors = { blue: '#00d4ff', purple: '#a855f7', pink: '#ec4899', green: '#22c55e', orange: '#f97316', yellow: '#eab308' };
      document.documentElement.style.setProperty('--neon-blue', colors[AppState.appearance.accent]);
      saveState(); // Auto-save
    });
  });
}

function saveProfileData(panel) {
  const inputs = panel.querySelectorAll('input, select');
  AppState.profile.name = inputs[0].value;
  AppState.profile.email = inputs[1].value;
  AppState.profile.age = parseInt(inputs[2].value);
  AppState.profile.weight = parseFloat(inputs[3].value);
  AppState.profile.height = parseInt(inputs[4].value);
  AppState.profile.gender = inputs[5].value;
  AppState.profile.avatarSeed = AppState.profile.name.replace(/\s/g, '');

  saveState();
  applyStateToUI();
}

function saveGoalsData(panel) {
  AppState.goals.steps = parseInt(document.getElementById('range-steps').value);
  AppState.goals.calories = parseInt(document.getElementById('range-cal').value);
  AppState.goals.distance = parseFloat(document.getElementById('range-dist').value);
  AppState.goals.time = parseInt(document.getElementById('range-time').value);
  AppState.goals.water = parseInt(document.getElementById('range-water').value);

  saveState();
  applyStateToUI();
}

function saveAppearanceData(panel) {
  AppState.appearance.fontSize = parseInt(document.getElementById('range-font').value);
  saveState();
  applyStateToUI();
}

/* ============================================
   DEVICE BUTTONS
   ============================================ */
function initDeviceButtons() {
  document.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.device-card');
      if (btn.classList.contains('disconnect')) {
        card.classList.remove('connected');
        btn.textContent = 'Connect';
        btn.classList.remove('disconnect');
        btn.classList.add('connect');
        card.querySelector('.device-status').textContent = 'Disconnected';
        showToast('📱 Device disconnected');
      } else {
        card.classList.add('connected');
        btn.textContent = 'Disconnect';
        btn.classList.remove('connect');
        btn.classList.add('disconnect');
        card.querySelector('.device-status').textContent = 'Connected · Just now';
        showToast('✅ Device connected!');
      }
    });
  });
}

/* ============================================
   ABOUT SECTION DETAILS
   ============================================ */
const aboutDetails = {
  '📄 Terms of Service': {
    title: 'Terms of Service',
    icon: '📄',
    color: 'var(--neon-blue)',
    content: 'By using FitPulse, you agree to track your fitness data responsibly and follow our community guidelines for health and wellness. Always consult a medical professional before beginning any new or intense exercise program. FitPulse is not responsible for any injuries sustained while using the app.'
  },
  '🔐 Privacy Policy': {
    title: 'Privacy Policy',
    icon: '🔐',
    color: 'var(--neon-green)',
    content: 'Your privacy is our priority. All your sensitive health and fitness data is stored locally on your device. We do not sell, share, or transmit your personal metrics to any third-party servers. Your journey is yours alone to keep.'
  },
  '⭐ Rate this App': {
    title: 'Rate FitPulse',
    icon: '⭐',
    color: 'var(--neon-yellow)',
    content: 'Loving your FitPulse experience? Your 5-star rating helps us grow and continue building premium fitness tracking tools for everyone! Tap below to visit the app store.'
  },
  '💬 Send Feedback': {
    title: 'Send Feedback',
    icon: '💬',
    color: 'var(--neon-purple)',
    content: 'Have ideas on how we can improve? We love hearing from our community! Please send your suggestions, feature requests, or praise to feedback@fitpulse.com.'
  },
  '🐛 Report a Bug': {
    title: 'Report a Bug',
    icon: '🐛',
    color: 'var(--neon-pink)',
    content: 'Facing an issue? Our engineering team is dedicated to providing a smooth experience. Please email bugs@fitpulse.com with a description of the problem and any screenshots if possible.'
  }
};

/* ============================================
   CLICKABLE ROWS (generic)
   ============================================ */
function initClickableRows() {
  document.querySelectorAll('.setting-row.clickable').forEach(row => {
    if (!row.id) {
      row.addEventListener('click', () => {
        const labelEl = row.querySelector('.setting-label');
        if (!labelEl) return;

        const label = labelEl.textContent.trim();

        if (aboutDetails[label]) {
          const d = aboutDetails[label];
          document.getElementById('stat-detail-title').textContent = d.title;
          document.getElementById('stat-detail-body').innerHTML = `
            <div class="stat-detail-hero" style="text-align:center;margin-bottom:24px;">
              <div style="font-size:4rem;margin-bottom:16px;filter: drop-shadow(0 0 20px ${d.color}44);">${d.icon}</div>
              <p style="font-size:1rem;line-height:1.6;color:var(--text-secondary);padding:0 10px;">${d.content}</p>
            </div>
            <button class="primary-btn" style="width:100%;" onclick="closePanel('panel-stat-detail')">Dismiss</button>
          `;
          openPanel('panel-stat-detail');
        } else {
          showToast(`Opening ${label}...`);
        }
      });
    }
  });
}

/* ============================================
   HEADER AVATAR
   ============================================ */
function initHeaderAvatarBtn() {
  document.getElementById('header-avatar-btn').addEventListener('click', () => {
    // Navigate to profile
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('nav-profile').classList.add('active');
    document.querySelectorAll('.screen').forEach(s => { s.classList.remove('active'); s.style.animation = 'none'; });
    const profile = document.getElementById('screen-profile');
    profile.classList.add('active');
    profile.style.animation = 'screenFadeIn 0.5s ease-out';
  });
}

/* ============================================
   TOAST
   ============================================ */
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}
