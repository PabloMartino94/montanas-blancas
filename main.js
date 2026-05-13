/* ============================================================
   MONTAÑAS BLANCAS — Main JavaScript
   Interactividad: Navbar, Filtros, Carousel, FAQ, Animaciones
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSmoothScroll();
  initCatalogFilters();
  initTestimonialsCarousel();
  initScrollAnimations();
  initActiveNavLink();
  initBackToTop();
  initAnalytics();
});

/* ============================================================
   NAVBAR — Scroll effect + Mobile menu
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.navbar__link');

  // Scroll effect: transparent → opaque
  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check on load

  // Mobile hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================================
   SMOOTH SCROLL — For anchor links
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================================================
   CATALOG FILTERS — Filter products by category
   ============================================================ */
function initCatalogFilters() {
  const filterBtns = document.querySelectorAll('.catalog__filter');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter products with animation
      productCards.forEach((card, index) => {
        const category = card.dataset.category;
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          card.classList.remove('hidden');
          card.style.animation = `fadeUp 0.5s ease ${index * 0.1}s forwards`;
        } else {
          card.classList.add('hidden');
          card.style.animation = '';
        }
      });
    });
  });
}

/* ============================================================
   TESTIMONIALS CAROUSEL
   ============================================================ */
function initTestimonialsCarousel() {
  const track = document.querySelector('.testimonials__track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('testimonials-prev');
  const nextBtn = document.getElementById('testimonials-next');
  const dotsContainer = document.getElementById('testimonials-dots');

  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  const totalCards = cards.length;

  // Create dots
  cards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('testimonials__dot');
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Ir al testimonio ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.testimonials__dot');

  function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex === 0 ? totalCards - 1 : currentIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex === totalCards - 1 ? 0 : currentIndex + 1);
  });

  // Auto-play
  let autoplayInterval = setInterval(() => {
    goToSlide(currentIndex === totalCards - 1 ? 0 : currentIndex + 1);
  }, 6000);

  // Pause on hover
  const carousel = document.getElementById('testimonials-carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  carousel.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(() => {
      goToSlide(currentIndex === totalCards - 1 ? 0 : currentIndex + 1);
    }, 6000);
  });

  // Keyboard navigation
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextBtn.click();
      else prevBtn.click();
    }
  }, { passive: true });
}

/* ============================================================
   SCROLL ANIMATIONS — Intersection Observer
   ============================================================ */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

/* ============================================================
   BACK TO TOP — Show after scrolling 400px, smooth scroll up
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   GA4 ANALYTICS TRACKING
   ============================================================ */
function initAnalytics() {
  if (typeof gtag === 'undefined') return;
  trackWhatsAppClicks();
  trackProductViews();
  trackCatalogFilters();
  trackFAQOpens();
  trackBlogReads();
}

function trackWhatsAppClicks() {
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      let productName = '';
      let source = 'other';

      if (link.classList.contains('whatsapp-float')) {
        source = 'float_button';
      } else if (link.id === 'contact-whatsapp') {
        source = 'contact_section';
      } else if (link.closest('.product-card')) {
        productName = link.closest('.product-card').querySelector('.product-card__title')?.textContent.trim() || '';
        source = 'product_card';
      } else if (link.closest('.blog-post__cta-section')) {
        source = 'blog_cta';
      }

      gtag('event', 'whatsapp_click', {
        product_name: productName,
        source,
        page: window.location.pathname,
      });
    });
  });
}

function trackProductViews() {
  const cards = document.querySelectorAll('.product-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const name = entry.target.querySelector('.product-card__title')?.textContent.trim();
        if (name) gtag('event', 'view_item', { item_name: name });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  cards.forEach(card => observer.observe(card));
}

function trackCatalogFilters() {
  const labels = { waxmelts: 'Wax Melts', velas: 'Velas', all: 'Todos' };

  document.querySelectorAll('.catalog__filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      if (filter !== 'all') {
        gtag('event', 'catalog_filter', { filter_value: labels[filter] || filter });
      }
    });
  });
}

function trackFAQOpens() {
  document.querySelectorAll('.faq__item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        const question = item.querySelector('.faq__question span')?.textContent.trim();
        if (question) gtag('event', 'faq_open', { question });
      }
    });
  });
}

function trackBlogReads() {
  const title = document.querySelector('.blog-post__title')?.textContent.trim();
  if (!title) return;

  let fired = false;
  window.addEventListener('scroll', () => {
    if (fired) return;
    const progress = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    if (progress >= 0.5) {
      fired = true;
      gtag('event', 'blog_read', { blog_title: title });
    }
  }, { passive: true });
}

/* ============================================================
   ACTIVE NAV LINK — Highlight based on scroll position
   ============================================================ */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -70% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}
