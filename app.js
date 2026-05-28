/* Portfolio Interactivity Logic for Nabil Kardad */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initActiveNavLinkOnScroll();
  initSkillsAnimation();
  initProjectFiltering();
  initPDFModal();
});

/* Sticky Header on Scroll */
function initNavbarScroll() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* Mobile Hamburger Menu */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      toggleBtn.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        toggleBtn.classList.remove('active');
      });
    });
  }
}

/* Highlight Active Link on Scroll */
function initActiveNavLinkOnScroll() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* Animate Skills Progress Bars when Visible */
function initSkillsAnimation() {
  const skillsSection = document.getElementById('competences');
  const fillBars = document.querySelectorAll('.skill-bar-fill');

  if (skillsSection && fillBars.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
          });
          // Unobserve once animated
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    observer.observe(skillsSection);
  }
}

/* Filter Projects by Category */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active classes on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* Open PDFs in a full-screen dynamic modal */
function initPDFModal() {
  const modal = document.getElementById('pdf-modal');
  const modalContainer = modal ? modal.querySelector('.modal-container') : null;
  const modalIframe = document.getElementById('modal-iframe');
  const modalTitle = document.getElementById('modal-doc-title');
  const closeBtn = document.getElementById('modal-close');
  const docBtns = document.querySelectorAll('.doc-btn, [data-pdf]');

  if (!modal || !modalIframe || !closeBtn) return;

  // Open modal handler
  const openModal = (pdfPath, title) => {
    // Set title and source
    modalTitle.textContent = title || "Visualisation du document";
    
    // For PDFs, we can add '#toolbar=0' to make it cleaner or use the path directly.
    modalIframe.src = `${pdfPath}#toolbar=1&navpanes=0`;
    
    // Activate modal animation
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  // Close modal handler
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
    // Clear iframe src after transition to stop any background downloads/rendering
    setTimeout(() => {
      modalIframe.src = '';
    }, 300);
  };

  // Attach event to buttons
  docBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Look up PDF filename
      const pdfPath = btn.getAttribute('data-pdf');
      if (!pdfPath) return;

      // Determine clean title
      let docTitle = "";
      const card = btn.closest('.doc-card') || btn.closest('.glass-card') || btn.closest('.hero-left');
      if (card) {
        const titleEl = card.querySelector('.doc-title') || card.querySelector('.timeline-title') || card.querySelector('h3');
        docTitle = titleEl ? titleEl.textContent : "Document PDF";
      } else {
        docTitle = "Document PDF";
      }

      openModal(pdfPath, docTitle);
    });
  });

  // Close on button click
  closeBtn.addEventListener('click', closeModal);

  // Close on clicking outside the modal box
  modal.addEventListener('click', (e) => {
    if (!modalContainer.contains(e.target)) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
