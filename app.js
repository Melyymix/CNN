/* ==========================================================================
   CORPORATIVO EN COMERCIO EXTERIOR CNN, S.A. DE C.V.
   JavaScript Multi-Page App Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  setActiveNavLink();
  initChecklistTool();
  initCopyButtons();
  initContactForm();
  initCounters();
  initScrollAnimations();
  initFAQ();
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
    showToast(`Modo ${newTheme === 'dark' ? 'Oscuro' : 'Claro'} activado`);
  });
}

function updateThemeIcon(btn, theme) {
  btn.innerHTML = theme === 'dark' 
    ? `<span class="material-symbols-outlined">light_mode</span>` 
    : `<span class="material-symbols-outlined">dark_mode</span>`;
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
   3. Scroll Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. Interactive Document Checklist Tool (requisitos.html)
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
    cb.addEventListener('change', updateChecklistProgress);
  });

  const selectAllBtn = document.getElementById('selectAllDocs');
  const deselectAllBtn = document.getElementById('deselectAllDocs');

  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', () => {
      const activeTab = document.querySelector('.tab-content.active');
      if (activeTab) {
        activeTab.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
        updateChecklistProgress();
        showToast('Todos los documentos marcados');
      }
    });
  }

  if (deselectAllBtn) {
    deselectAllBtn.addEventListener('click', () => {
      const activeTab = document.querySelector('.tab-content.active');
      if (activeTab) {
        activeTab.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
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

  const total = activeTab.querySelectorAll('input[type="checkbox"]').length;
  const checked = activeTab.querySelectorAll('input[type="checkbox"]:checked').length;
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
   5. Copy to Clipboard Utility (consignacion.html)
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetText = btn.getAttribute('data-copy');
      if (targetText) {
        navigator.clipboard.writeText(targetText).then(() => {
          showToast(`Copiado al portapapeles: ${targetText}`);
        }).catch(err => {
          console.error('Copy error:', err);
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Contact / Quote Form Logic (contacto.html)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;

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
`Hola Corporativo en Comercio Exterior CNN,

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

    window.location.href = `mailto:Gabriel.gutierrez@corpextcnn.com?subject=${subject}&body=${body}`;
    showToast('¡Formulario preparado! Se abrirá su cliente de correo.');
  });
}

/* --------------------------------------------------------------------------
   7. Number Counters Animation (index.html)
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
          const speed = Math.ceil(target / 40);
          const updateCount = () => {
            count += speed;
            if (count > target) {
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
  }, { threshold: 0.5 });

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

/* Toast Notifications */
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
