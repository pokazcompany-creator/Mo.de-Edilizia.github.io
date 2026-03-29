const header = document.querySelector('.header');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.header nav');
const navLinks = Array.from(document.querySelectorAll('.header nav a[href^="#"]'));

if (header && nav && navLinks.length) {
  const mobileBreakpoint = window.matchMedia('(max-width: 768px)');
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setMenuState = (isOpen) => {
    header.classList.toggle('nav-open', isOpen);

    if (navToggle) {
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Chiudi il menu' : 'Apri il menu');
    }
  };

  const closeMenu = () => {
    if (mobileBreakpoint.matches) {
      setMenuState(false);
    }
  };

  const getHeaderOffset = () => {
    const style = window.getComputedStyle(header);
    const marginTop = Number.parseFloat(style.marginTop) || 0;
    return header.offsetHeight + marginTop + 16;
  };

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const scrollToSection = (section) => {
    const top = section.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: 'smooth'
    });
  };

  const getCurrentSection = () => {
    const offset = getHeaderOffset() + 24;
    let currentSection = sections[0];

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - offset) {
        currentSection = section;
      }
    });

    return currentSection;
  };

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = !header.classList.contains('nav-open');
      setMenuState(isOpen);
    });
  }

  navLinks.forEach((link) => {
    const targetSection = document.querySelector(link.getAttribute('href'));

    if (!targetSection) {
      return;
    }

    link.addEventListener('click', (event) => {
      event.preventDefault();

      const targetId = targetSection.id;
      setActiveLink(targetId);
      closeMenu();
      scrollToSection(targetSection);
      window.history.replaceState(null, '', `#${targetId}`);
    });
  });

  const syncActiveLink = () => {
    const currentSection = getCurrentSection();

    if (currentSection) {
      setActiveLink(currentSection.id);
    }
  };

  window.addEventListener('scroll', syncActiveLink, { passive: true });
  window.addEventListener('resize', () => {
    if (!mobileBreakpoint.matches) {
      setMenuState(false);
    }

    syncActiveLink();
  });

  window.addEventListener('hashchange', () => {
    const targetSection = document.querySelector(window.location.hash);

    if (targetSection) {
      setActiveLink(targetSection.id);
      closeMenu();
      scrollToSection(targetSection);
    }
  });

  document.addEventListener('click', (event) => {
    if (!mobileBreakpoint.matches || !header.classList.contains('nav-open')) {
      return;
    }

    if (!header.contains(event.target)) {
      closeMenu();
    }
  });

  setMenuState(false);

  if (window.location.hash) {
    const targetSection = document.querySelector(window.location.hash);

    if (targetSection) {
      setActiveLink(targetSection.id);
      window.requestAnimationFrame(() => scrollToSection(targetSection));
    } else {
      syncActiveLink();
    }
  } else {
    syncActiveLink();
  }
}
