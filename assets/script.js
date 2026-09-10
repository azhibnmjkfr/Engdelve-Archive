/* =========================================================
   Engdelve Archive — Global Script
   Author: Ahmad Zaman Huri
   ========================================================= */

(function () {
  'use strict';

  /* -------------------------------------------------------
     1. LANGUAGE TOGGLE (EN ↔ ID)
     ------------------------------------------------------- */
  const LANG_KEY = 'engdelve-lang';
  const langToggle = document.getElementById('langToggle');

  function applyLanguage(lang) {
    document.querySelectorAll('[data-en][data-id]').forEach((el) => {
      const value = el.getAttribute('data-' + lang);
      if (value !== null) {
        el.textContent = value;
      }
    });

    document.documentElement.setAttribute('lang', lang);

    if (langToggle) {
      const current = langToggle.querySelector('.lang-current');
      const alt = langToggle.querySelector('.lang-alt');
      if (current && alt) {
        current.textContent = lang.toUpperCase();
        alt.textContent = lang === 'en' ? 'ID' : 'EN';
      }
    }

    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) { /* abaikan */ }
  }

  function getInitialLanguage() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'en' || saved === 'id') return saved;
    } catch (e) { /* abaikan */ }

    const browserLang = (navigator.language || 'en').toLowerCase();
    if (browserLang.startsWith('id')) return 'id';

    return 'en';
  }

  if (langToggle) {
    applyLanguage(getInitialLanguage());

    langToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('lang') || 'en';
      const next = current === 'en' ? 'id' : 'en';
      applyLanguage(next);
    });
  }

  /* -------------------------------------------------------
     2. SMOOTH SCROLL untuk anchor internal
     ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* -------------------------------------------------------
     3. REVEAL ON SCROLL (subtle fade-in)
     ------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.grade-card, .about-inner, .quote'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      observer.observe(el);
    });
  }

})();