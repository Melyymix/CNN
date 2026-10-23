/* ==========================================================================
   CORPORATIVO EN COMERCIO EXTERIOR CNN, S.A. DE C.V.
   JavaScript Multi-Page App Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initHeaderScroll();
  setActiveNavLink();
  initChecklistTool();
  initCopyButtons();
  initContactForm();
  initCounters();
  initScrollAnimations();
  initFAQ();
  initYearAndDates();
  initScrollEffects();
  initPrincipiosTabs();
  initInfiniteServicesSlider();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggle');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('cnn_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(themeBtn, savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('cnn_theme', newTheme);
    updateThemeIcon(themeBtn, newTheme);
  });
}

function updateThemeIcon(btn, theme) {
  btn.innerHTML = theme === 'dark' 
    ? `<span class="material-symbols-outlined">light_mode</span>` 
    : `<span class="material-symbols-outlined">dark_mode</span>`;
  btn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Toggle & Auto Active Page Highlight
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
    }
  });
}

function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   3. Header Sticky Blur Scroll Effect
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   4. Scroll Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. Interactive Document Checklist Tool (requisitos.html)
   -------------------------------------------------------------------------- */
function initChecklistTool() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabBtns.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetElement = document.getElementById(targetTab);
      if (targetElement) {
        targetElement.classList.add('active');
      }
      updateChecklistProgress();
      updatePrintSubhead(btn.textContent.trim());
    });
  });

  const checkboxes = document.querySelectorAll('.doc-item input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      updateChecklistProgress();
    });
  });

  const selectAllBtn = document.getElementById('selectAllDocs');
  const deselectAllBtn = document.getElementById('deselectAllDocs');

  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', () => {
      const activeTab = document.querySelector('.tab-content.active');
      if (activeTab) {
        activeTab.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          cb.checked = true;
        });
        updateChecklistProgress();
        showToast('Todos los documentos marcados');
      }
    });
  }

  if (deselectAllBtn) {
    deselectAllBtn.addEventListener('click', () => {
      const activeTab = document.querySelector('.tab-content.active');
      if (activeTab) {
        activeTab.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          cb.checked = false;
        });
        updateChecklistProgress();
        showToast('Checklist reiniciado');
      }
    });
  }

  const printBtn = document.getElementById('printChecklist');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  updateChecklistProgress();
  const initialActiveBtn = document.querySelector('.tab-btn.active');
  if (initialActiveBtn) {
    updatePrintSubhead(initialActiveBtn.textContent.trim());
  }
}

function updateChecklistProgress() {
  const activeTab = document.querySelector('.tab-content.active');
  if (!activeTab) return;

  const allCheckboxes = activeTab.querySelectorAll('.doc-item input[type="checkbox"]');
  const total = allCheckboxes.length;
  let checked = 0;

  allCheckboxes.forEach(cb => {
    const item = cb.closest('.doc-item');
    if (cb.checked) {
      checked++;
      if (item) item.classList.add('checked');
    } else {
      if (item) item.classList.remove('checked');
    }
  });

  const percent = total > 0 ? Math.round((checked / total) * 100) : 0;

  const countText = document.getElementById('docProgressCount');
  const progressFill = document.getElementById('docProgressFill');

  if (countText) countText.textContent = `${checked} de ${total} (${percent}%)`;
  if (progressFill) progressFill.style.width = `${percent}%`;
}

function updatePrintSubhead(tabName) {
  const printSubhead = document.getElementById('printTabSubhead');
  if (printSubhead && tabName) {
    printSubhead.textContent = `Categoría: ${tabName}`;
  }
}

/* --------------------------------------------------------------------------
   6. Copy to Clipboard Utility
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetText = btn.getAttribute('data-copy');
      if (targetText) {
        navigator.clipboard.writeText(targetText).then(() => {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `<span class="material-symbols-outlined" style="font-size:16px; color:#22c55e;">check_circle</span> Copiado`;
          btn.style.borderColor = '#22c55e';
          
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.borderColor = '';
          }, 2000);

          showToast(`Copiado al portapapeles: ${targetText}`);
        }).catch(err => {
          console.error('Copy error:', err);
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Contact / Quote Form Logic (contacto.html)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  // Preseleccionar aduana si viene por parámetro de URL (?aduana=manzanillo)
  const urlParams = new URLSearchParams(window.location.search);
  const aduanaParam = urlParams.get('aduana');
  const aduanaSelect = document.getElementById('quoteAduana');
  if (aduanaParam && aduanaSelect) {
    const valLower = aduanaParam.toLowerCase();
    for (const opt of aduanaSelect.options) {
      if (opt.value.toLowerCase().includes(valLower)) {
        aduanaSelect.value = opt.value;
        break;
      }
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('quoteName')?.value.trim();
    const email = document.getElementById('quoteEmail')?.value.trim();
    const phone = document.getElementById('quotePhone')?.value.trim();
    const service = document.getElementById('quoteService')?.value;
    const aduana = document.getElementById('quoteAduana')?.value;
    const notes = document.getElementById('quoteNotes')?.value.trim();

    if (!name || !email) {
      showToast('Por favor completa tu Nombre y Correo.');
      return;
    }

    const subject = encodeURIComponent(`Solicitud de Cotización: ${service} - ${name}`);
    const body = encodeURIComponent(
`Hola CORPORATIVO EN COMERCIO EXTERIOR CNN, S.A. DE C.V.,

Deseo solicitar información y cotización para operaciones de comercio exterior:

• Cliente / Empresa: ${name}
• Correo de contacto: ${email}
• Teléfono: ${phone || 'No especificado'}
• Servicio de Interés: ${service}
• Aduana Preferente: ${aduana}
• Detalles / Requerimientos:
${notes || 'Sin observaciones adicionales'}

Atentamente,
${name}`
    );

    window.location.href = `mailto:contacto@corpextcnn.com?subject=${subject}&body=${body}`;
    showToast('¡Formulario preparado! Se abrirá su cliente de correo.');
  });
}

/* --------------------------------------------------------------------------
   8. Number Counters Animation (index.html)
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'));
          let count = 0;
          const speed = Math.ceil(target / 35);
          const updateCount = () => {
            count += speed;
            if (count >= target) {
              counter.innerText = target;
            } else {
              counter.innerText = count;
              setTimeout(updateCount, 30);
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.2 });

  const heroStats = document.querySelector('.hero-stats-banner');
  if (heroStats) observer.observe(heroStats);
}

function initFAQ() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('active');
    });
  });
}

/* --------------------------------------------------------------------------
   9. Auto Dynamic Dates & Years
   -------------------------------------------------------------------------- */
function initYearAndDates() {
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('#year, .year-auto').forEach(el => {
    el.textContent = currentYear;
  });

  const printDateEl = document.getElementById('printDate');
  if (printDateEl) {
    printDateEl.textContent = new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

/* --------------------------------------------------------------------------
   10. Toast Notifications
   -------------------------------------------------------------------------- */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="material-symbols-outlined" style="color:var(--accent-cyan)">check_circle</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* --------------------------------------------------------------------------
   11. Scroll Reading Progress & Hero Parallax
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  /* 1. Barra de progreso de lectura en Header */
  const header = document.querySelector('.header');
  if (header && !header.querySelector('.scroll-progress-bar')) {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    header.appendChild(progressBar);

    const updateProgressBar = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
    };

    window.addEventListener('scroll', updateProgressBar, { passive: true });
    updateProgressBar();
  }

  /* 2. Parallax suave en la imagen del Hero (Desktop > 1024px) */
  const heroImg = document.querySelector('.hero-img-wrapper img');
  const heroCard = document.querySelector('.hero-metric-float');

  if (heroImg || heroCard) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.innerWidth > 1024) {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollY < 900) {
              if (heroImg) {
                heroImg.style.transform = `translateY(${scrollY * 0.08}px) scale(1.04)`;
              }
              if (heroCard) {
                heroCard.style.transform = `translateY(${scrollY * -0.04}px)`;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

/* --------------------------------------------------------------------------
   12. Editorial Split Layout Tabs: Misión, Visión y Política de Calidad
   -------------------------------------------------------------------------- */
function initPrincipiosTabs() {
  const container = document.querySelector('.principios-split-container');
  if (!container) return;

  const tabButtons = container.querySelectorAll('.principios-tab-btn');
  const panels = container.querySelectorAll('.principios-tab-panel');
  if (!tabButtons.length || !panels.length) return;

  function switchTab(btn) {
    const targetId = btn.getAttribute('data-tab');
    const targetPanel = container.querySelector(`#panel-${targetId}`);
    if (!targetPanel) return;

    tabButtons.forEach(b => {
      const isTarget = (b === btn);
      b.classList.toggle('is-active', isTarget);
      b.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    panels.forEach(p => {
      if (p === targetPanel) {
        p.style.display = 'block';
        p.offsetHeight;
        p.classList.add('is-active');
      } else {
        p.classList.remove('is-active');
        p.style.display = 'none';
      }
    });
  }

  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => switchTab(btn));

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (index + 1) % tabButtons.length;
        tabButtons[nextIndex].focus();
        switchTab(tabButtons[nextIndex]);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        tabButtons[prevIndex].focus();
        switchTab(tabButtons[prevIndex]);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   13. Infinite Horizontal Services Slider & Interactive Controls
   -------------------------------------------------------------------------- */
function initInfiniteServicesSlider() {
  const containers = document.querySelectorAll('.services-slider-container');
  if (!containers.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  containers.forEach(container => {
    const track = container.querySelector('.infinite-services-track');
    const viewport = container.querySelector('.services-slider-viewport') || container;
    const prevBtn = container.querySelector('.slider-arrow-prev');
    const nextBtn = container.querySelector('.slider-arrow-next');
    if (!track) return;

    // Desactivar animación CSS para dar control total al motor continuo por requestAnimationFrame
    track.style.animation = 'none';

    let currentX = 0;
    let targetX = 0;
    let isPaused = false;
    let isTransitioning = false;
    let autoSpeed = prefersReducedMotion ? 0 : 0.85; // ~51px por segundo en pantallas de 60fps
    let animationFrameId = null;
    let resumeTimeout = null;

    let repeatWidth = 0;
    let cardStep = 0;

    function updateDimensions() {
      const allCards = track.querySelectorAll('.service-card');
      if (allCards.length >= 10) {
        // La serie 2 inicia exactamente en la tarjeta 10 (índice 9, clon de la tarjeta 1)
        const diffClone = allCards[9].offsetLeft - allCards[0].offsetLeft;
        const diffStep = allCards[1].offsetLeft - allCards[0].offsetLeft;
        if (diffClone > 0) repeatWidth = diffClone;
        if (diffStep > 0) cardStep = diffStep;
      }
      if (!repeatWidth || repeatWidth <= 0) {
        repeatWidth = (track.scrollWidth / 2) || 3636;
        cardStep = (allCards[0] ? allCards[0].offsetWidth + 24 : 404);
      }
    }

    // Medición inicial y en carga de recursos
    updateDimensions();
    window.addEventListener('load', updateDimensions, { passive: true });
    window.addEventListener('resize', updateDimensions, { passive: true });

    // Bucle continuo de animación de alto rendimiento a 60/120fps
    let lastTime = performance.now();
    function tick(now) {
      const elapsed = now - lastTime;
      lastTime = now;

      // Evitar saltos de posición si el usuario cambia de pestaña
      if (elapsed > 100) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      const delta = Math.min(elapsed / 16.67, 2.5); // Normalizar a 60fps

      if (isTransitioning) {
        // Easing de interpolación suave al presionar flechas
        const diff = targetX - currentX;
        if (Math.abs(diff) > 0.6) {
          currentX += diff * 0.14 * delta;
        } else {
          currentX = targetX;
          isTransitioning = false;
        }
      } else if (!isPaused && autoSpeed > 0) {
        // Desplazamiento automático continuo
        currentX -= autoSpeed * delta;
        targetX = currentX;
      }

      // Rebobinado infinito sin interrupciones ni parpadeos en ambas direcciones
      if (repeatWidth > 0) {
        if (currentX <= -repeatWidth) {
          currentX += repeatWidth;
          targetX += repeatWidth;
        } else if (currentX > 0) {
          currentX -= repeatWidth;
          targetX -= repeatWidth;
        }
      }

      track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
      animationFrameId = requestAnimationFrame(tick);
    }

    animationFrameId = requestAnimationFrame(tick);

    // Pausar desplazamiento automático cuando el cursor pasa sobre las tarjetas
    viewport.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    viewport.addEventListener('mouseleave', () => {
      if (!isTransitioning) {
        isPaused = false;
      }
    });

    // Desplazamiento manual mediante flechas de navegación
    function step(direction) {
      updateDimensions();
      isPaused = true;
      isTransitioning = true;

      // Si se hace clic consecutivo, acumular el avance hacia la siguiente tarjeta
      if (Math.abs(targetX - currentX) < 2) {
        targetX = currentX - (direction * cardStep);
      } else {
        targetX -= (direction * cardStep);
      }

      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        isTransitioning = false;
        const isHovered = container.matches(':hover') || viewport.matches(':hover');
        if (!isHovered) {
          isPaused = false;
        }
      }, 2500);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        step(1); // Avanzar (desplaza hacia la izquierda)
      });
      nextBtn.addEventListener('mouseenter', () => {
        isPaused = true;
      });
      nextBtn.addEventListener('mouseleave', () => {
        if (!isTransitioning && !viewport.matches(':hover')) {
          isPaused = false;
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        step(-1); // Retroceder (desplaza hacia la derecha)
      });
      prevBtn.addEventListener('mouseenter', () => {
        isPaused = true;
      });
      prevBtn.addEventListener('mouseleave', () => {
        if (!isTransitioning && !viewport.matches(':hover')) {
          isPaused = false;
        }
      });
    }

    // Soporte para gestos táctiles (Swipe) en dispositivos móviles
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouching = false;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isTouching = true;
      isPaused = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isTouching) return;
      isTouching = false;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          step(1); // Deslizar hacia la izquierda -> Siguiente tarjeta
        } else {
          step(-1); // Deslizar hacia la derecha -> Tarjeta anterior
        }
      } else {
        setTimeout(() => {
          isPaused = false;
        }, 1200);
      }
    }, { passive: true });
  });
}
