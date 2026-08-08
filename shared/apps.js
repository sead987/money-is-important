// Shared Application Logic
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initFooter();
  registerServiceWorker();
});

// Theme Management
function initTheme() {
  const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
    updateThemeIcon(theme);
  }
}

function updateThemeIcon(theme) {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  toggle.innerHTML = theme === 'dark' 
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
}

// Navigation & Header
function initNavigation() {
  const header = document.querySelector('header');
  if (header && !header.innerHTML.trim()) {
    const title = document.title.split('·')[0].trim();
    header.innerHTML = `
      <a href="index.html" class="logo-container">
        <img src="logo.jpg" alt="Nexa Logo" style="border-radius: 8px;">
        <h1>Nexa Tools</h1>
      </a>
      <nav>
        <a href="color.html" class="nav-link ${window.location.pathname.includes('color') ? 'active' : ''}">Colors</a>
        <a href="pass.html" class="nav-link ${window.location.pathname.includes('pass') ? 'active' : ''}">Passwords</a>
        <a href="qr.html" class="nav-link ${window.location.pathname.includes('qr') ? 'active' : ''}">QR Codes</a>
        <a href="unit.html" class="nav-link ${window.location.pathname.includes('unit') ? 'active' : ''}">Units</a>
      </nav>
      <div style="display: flex; gap: 8px;">
        <button id="share-btn" class="btn-icon" title="Share">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
        </button>
        <button id="theme-toggle" class="btn-icon" title="Toggle Theme"></button>
      </div>
    `;
    
    document.getElementById('share-btn').addEventListener('click', shareApp);
    initTheme(); // Re-init to attach toggle listener
  }
}

// Footer
function initFooter() {
  const footer = document.querySelector('footer');
  if (footer && !footer.innerHTML.trim()) {
    footer.innerHTML = `
      <p>&copy; 2026 Nexa Tools. All tools work 100% offline.</p>
      <div style="margin-top: 10px; display: flex; justify-content: center; gap: 15px;">
        <a href="index.html" class="nav-link">Home</a>
        <a href="#" class="nav-link">Privacy</a>
        <a href="#" class="nav-link">About</a>
      </div>
    `;
  }
}

// Utility: Copy to Clipboard
async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const originalContent = btn.innerHTML;
    btn.innerHTML = 'Copied!';
    btn.style.color = 'var(--primary)';
    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.style.color = '';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

// Utility: Share
async function shareApp() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: 'Check out this cool tool!',
        url: window.location.href,
      });
    } catch (err) {
      console.log('Share cancelled or failed', err);
    }
  } else {
    // Fallback: copy link
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    alert('Link copied to clipboard!');
  }
}

// PWA: Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('SW registration failed: ', err);
      });
    });
  }
}
