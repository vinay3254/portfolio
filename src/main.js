// Vinay GK Replica Interactivity Script

document.addEventListener('DOMContentLoaded', () => {
  setupLoaderDismiss();
  setupNavigation();
  setupThemeScrolling();
  setupTouchSwipeControls();
  setupMarqueeScroll();
  setupRiveFallbacks();
});

/**
 * Handle transition loader overlay dismissal
 */
function setupLoaderDismiss() {
  const loader = document.querySelector('.transition-w');
  const loadBtn = document.querySelector('.transition-btn a');
  const pageWrap = document.querySelector('.page-w');

  if (!loader) return;

  const dismissLoader = () => {
    loader.style.transition = 'opacity 0.6s cubic-bezier(0.65, 0.05, 0, 1)';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 600);

    // Reveal main page wrapper content
    if (pageWrap) {
      pageWrap.removeAttribute('data-start');
      pageWrap.style.visibility = 'visible';
      pageWrap.style.opacity = '1';
    }
  };

  if (loadBtn) {
    loadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dismissLoader();
    });
  }

  // Fallback auto-dismiss after 2 seconds in case external Webflow/Rive scripts fail to load
  setTimeout(() => {
    if (loader.style.opacity !== '0') {
      dismissLoader();
    }
  }, 2000);
}

/**
 * Handle navigation menu toggle (hamburger menu drawer)
 */
function setupNavigation() {
  const hamBtn = document.querySelector('[data-nav-ham]');
  const navMenu = document.querySelector('[data-nav-m]');
  const body = document.body;

  if (!hamBtn || !navMenu) return;

  hamBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = navMenu.classList.contains('is-open');

    if (isOpen) {
      // Close menu
      navMenu.classList.remove('is-open');
      hamBtn.setAttribute('aria-expanded', 'false');
      hamBtn.classList.remove('menu-open');
      body.style.overflow = '';
      navMenu.style.display = 'none';
    } else {
      // Open menu
      navMenu.style.display = 'flex';
      setTimeout(() => {
        navMenu.classList.add('is-open');
      }, 10);
      hamBtn.setAttribute('aria-expanded', 'true');
      hamBtn.classList.add('menu-open');
      body.style.overflow = 'hidden';
    }
  });

  const menuLinks = document.querySelectorAll('.nav-menu-link-w');
  const menuImages = document.querySelectorAll('.nav-menu-img-w');

  menuLinks.forEach((link, idx) => {
    link.addEventListener('mouseenter', () => {
      menuImages.forEach((img, imgIdx) => {
        const topImg = img.querySelector('.menu-img-top');
        if (topImg) {
          topImg.style.opacity = (imgIdx === idx) ? '0.7' : '0';
        }
      });
    });
  });
}

/**
 * Switch navigation bar theme (light vs dark) as sections scroll into view
 */
function setupThemeScrolling() {
  const navWrap = document.querySelector('[data-nav-wrap]');
  const themeTriggers = document.querySelectorAll('[data-nav-theme-target]');

  if (!navWrap || themeTriggers.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-50px 0px -80% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const theme = entry.target.getAttribute('data-nav-theme-target');
        navWrap.setAttribute('data-nav-theme', theme);
      }
    });
  }, observerOptions);

  themeTriggers.forEach(trigger => observer.observe(trigger));
}

/**
 * Mobile Hero Touch & Swipe locking controls
 */
function setupTouchSwipeControls() {
  const toggleBtn = document.querySelector('[data-home-swipe-toggle]');
  const descUnlocked = document.querySelector('[data-home-swipe-desc="unlocked"]');
  const descLocked = document.querySelector('[data-home-swipe-desc="locked"]');

  if (!toggleBtn) return;

  let isLocked = false;

  toggleBtn.addEventListener('click', () => {
    isLocked = !isLocked;

    if (isLocked) {
      toggleBtn.classList.add('is-active');
      descUnlocked.style.display = 'none';
      descLocked.style.display = 'block';
      document.documentElement.style.overflow = 'hidden';
    } else {
      toggleBtn.classList.remove('is-active');
      descUnlocked.style.display = 'block';
      descLocked.style.display = 'none';
      document.documentElement.style.overflow = '';
    }
  });
}

/**
 * Make marquee logos auto-scroll infinitely
 */
function setupMarqueeScroll() {
  const marquees = document.querySelectorAll('.marquee-advanced');

  marquees.forEach(marquee => {
    const scrollContainer = marquee.querySelector('.marquee-advanced__scroll');
    if (scrollContainer) {
      const collection = scrollContainer.querySelector('.marquee-advanced__collection');
      if (collection) {
        const clone = collection.cloneNode(true);
        scrollContainer.appendChild(clone);
      }
      scrollContainer.classList.add('active-scroll');
    }
  });
}

/**
 * Handle fallback drawings / shapes for Rive canvas containers if CDNs are blocked
 */
function setupRiveFallbacks() {
  const canvases = document.querySelectorAll('canvas');

  canvases.forEach(canvas => {
    setTimeout(() => {
      const isBlank = isCanvasBlank(canvas);
      if (isBlank) {
        handleBlankCanvas(canvas);
      }
    }, 1000);
  });
}

function isCanvasBlank(canvas) {
  const blank = document.createElement('canvas');
  blank.width = canvas.width;
  blank.height = canvas.height;
  return canvas.toDataURL() === blank.toDataURL();
}

/**
 * Replace blank Rive canvas with embedded placeholders and custom SVG icons
 */
function handleBlankCanvas(canvas) {
  canvas.style.display = 'none';

  // 1. Check if canvas is the hamburger menu
  if (canvas.hasAttribute('data-rive-nav-hamburger')) {
    const hamBtn = canvas.closest('.nav-ham');
    if (hamBtn) {
      hamBtn.classList.add('has-fallback');
    }
  }

  // 2. Check if canvas is the LN4 center logo icon
  if (canvas.hasAttribute('data-rive-ln4')) {
    const ln4Wrapper = canvas.parentElement;
    if (ln4Wrapper) {
      // Draw static SVG logo
      ln4Wrapper.innerHTML = `
        <svg viewBox="0 0 32 32" width="32" height="32" fill="currentColor">
          <path d="M4 4h4v18h12v4H4V4zm20 6h4v18h-4v-8h-8v8h-4V10h4v6h8v-6z"/>
        </svg>
      `;
    }
  }

  // 3. Look for adjacent static placeholder images with [data-rive-placeholder]
  const parent = canvas.parentElement;
  if (parent) {
    const placeholder = parent.querySelector('[data-rive-placeholder]');
    if (placeholder) {
      placeholder.style.display = 'block';
    }
  }
}
