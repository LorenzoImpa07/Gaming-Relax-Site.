// ==========================================================================
// Gaming Relax — interazioni base
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Menu di navigazione (hamburger) ---
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
      }
    });
  }

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-item__q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((el) => el.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // --- Filtri Store (categorie) ---
  const storeFilters = document.querySelectorAll('[data-store-filter]');
  const products = document.querySelectorAll('[data-product-category]');
  storeFilters.forEach((pill) => {
    pill.addEventListener('click', () => {
      storeFilters.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.storeFilter;
      products.forEach((card) => {
        card.style.display = (filter === 'tutti' || card.dataset.productCategory === filter) ? '' : 'none';
      });
    });
  });

  // --- Filtri Team (settore) ---
  const teamFilters = document.querySelectorAll('[data-team-filter]');
  const teamMembers = document.querySelectorAll('[data-team-category]');
  teamFilters.forEach((pill) => {
    pill.addEventListener('click', () => {
      teamFilters.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.teamFilter;
      teamMembers.forEach((card) => {
        card.style.display = (card.dataset.teamCategory === filter) ? '' : 'none';
      });
    });
  });

  // --- Wishlist toggle (solo UI) ---
  document.querySelectorAll('.wish-btn').forEach((btn) => {
    btn.addEventListener('click', () => btn.classList.toggle('active'));
  });

  // --- Form contatti (demo: nessun invio reale, da collegare a un backend) ---
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      status.textContent = 'Grazie! Il tuo messaggio è stato preparato. Collega questo form a un servizio email (es. Formspree, EmailJS) per l\'invio reale.';
      status.classList.add('visible');
      form.reset();
    });
  }

});
