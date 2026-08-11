/* ==========================================================================
   Zen - Landing Page Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initHeaderScroll();
  initMobileMenu();
  initBeforeAfterSlider();
  initPortfolioFilters();
  initPortfolioCarousel();
  initNurseryCarousel();
  initContactForm();
  initScrollReveal();
});

/**
 * 1. Header Scroll Effect
 * Toggles header background transparency and shadows on scroll.
 */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('bg-botanico/95', 'backdrop-blur-md', 'shadow-lg', 'py-3');
      header.classList.remove('bg-transparent', 'py-5');
    } else {
      header.classList.remove('bg-botanico/95', 'backdrop-blur-md', 'shadow-lg', 'py-3');
      header.classList.add('bg-transparent', 'py-5');
    }
  };

  // Run on load and on scroll
  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

/**
 * 2. Mobile Menu Toggle
 * Opens and closes the responsive navigation menu.
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  
  if (!menuBtn || !mobileNav) return;

  const menuIcons = menuBtn.querySelectorAll('svg'); // [hamburgerIcon, closeIcon]

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    
    // Toggle state
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileNav.classList.toggle('translate-x-0');
    mobileNav.classList.toggle('translate-x-full');
    
    // Toggle body overflow to prevent background scrolling
    document.body.classList.toggle('overflow-hidden');

    // Toggle icons
    if (menuIcons.length >= 2) {
      if (isExpanded) {
        menuIcons[0].classList.remove('hidden'); // Show hamburger
        menuIcons[1].classList.add('hidden');    // Hide close
      } else {
        menuIcons[0].classList.add('hidden');    // Hide hamburger
        menuIcons[1].classList.remove('hidden'); // Show close
      }
    }
  });

  // Close menu when clicking a link
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileNav.classList.add('translate-x-full');
      mobileNav.classList.remove('translate-x-0');
      document.body.classList.remove('overflow-hidden');
      if (menuIcons.length >= 2) {
        menuIcons[0].classList.remove('hidden');
        menuIcons[1].classList.add('hidden');
      }
    });
  });
}

/**
 * 3. Before & After Slider
 * Updates the clip-path of the top image based on range input value.
 */
function initBeforeAfterSlider() {
  const slider = document.getElementById('before-after-slider');
  const input = document.getElementById('slider-range-input');
  const sliderLine = document.getElementById('slider-line');

  if (!slider || !input || !sliderLine) return;

  const updateSlider = (value) => {
    slider.style.setProperty('--slider-pos', `${value}%`);
    sliderLine.style.left = `${value}%`;
  };

  input.addEventListener('input', (e) => {
    updateSlider(e.target.value);
  });

  // Initial update
  updateSlider(input.value);
}

/**
 * 4. Portfolio Filters
 * Filters masonry grid items based on chosen category with CSS animations.
 */
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterButtons.length === 0 || portfolioItems.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active class on buttons
      filterButtons.forEach(btn => {
        btn.classList.remove('bg-arena', 'text-white');
        btn.classList.add('bg-white/10', 'text-white/80', 'hover:bg-white/20');
      });
      button.classList.add('bg-arena', 'text-white');
      button.classList.remove('bg-white/10', 'text-white/80', 'hover:bg-white/20');

      const filterValue = button.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          // Show item
          item.classList.remove('hidden');
          // Trigger a minor browser repaint to ensure smooth animation
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          // Hide item
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          // Delay display-none until animation ends
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });
}

/**
 * 4b. Portfolio Carousel Interactions
 * Handles dragging to scroll and the scroll progress bar.
 */
function initPortfolioCarousel() {
  const carousel = document.getElementById('portfolio-carousel');
  const progressBar = document.getElementById('carousel-progress');
  if (!carousel || !progressBar) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  // 1. Mouse Drag-to-Scroll (Desktop)
  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.classList.remove('cursor-grab');
    carousel.classList.add('cursor-grabbing');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.classList.remove('cursor-grabbing');
    carousel.classList.add('cursor-grab');
  });

  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('cursor-grabbing');
    carousel.classList.add('cursor-grab');
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed
    carousel.scrollLeft = scrollLeft - walk;
  });

  // 2. Update Progress Bar
  const updateProgress = () => {
    const scrollWidth = carousel.scrollWidth;
    const clientWidth = carousel.clientWidth;
    const maxScroll = scrollWidth - clientWidth;
    
    // Hide progress bar container if content fits without scrolling
    if (maxScroll <= 1) {
      progressBar.parentElement.classList.add('opacity-0');
      progressBar.parentElement.classList.remove('opacity-100');
      return;
    } else {
      progressBar.parentElement.classList.remove('opacity-0');
      progressBar.parentElement.classList.add('opacity-100');
    }

    const percentage = carousel.scrollLeft / maxScroll;
    const visibleRatio = clientWidth / scrollWidth;
    const barWidth = visibleRatio * 100;
    const leftOffset = percentage * (1 - visibleRatio) * 100;
    
    progressBar.style.width = `${visibleRatio > 0 ? barWidth : 0}%`;
    progressBar.style.transform = `translateX(${leftOffset / visibleRatio}%)`;
  };

  // Run on scroll
  carousel.addEventListener('scroll', updateProgress);

  // Run on window resize (since clientWidth changes)
  window.addEventListener('resize', updateProgress);

  // Initial call
  setTimeout(updateProgress, 300);

  // 3. Listen to filter buttons to update progress bar when grid changes
  const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Wait for the hidden/shown transition animations to finish, then recalculate
      setTimeout(updateProgress, 350);
    });
  });
}

/**
 * 5. Boutique Nursery Carousel
 * Scrolls the product container via navigation buttons.
 */
function initNurseryCarousel() {
  const carousel = document.getElementById('nursery-carousel');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (!carousel || !prevBtn || !nextBtn) return;

  const getScrollOffset = () => {
    const card = carousel.querySelector('.carousel-card');
    if (!card) return 300;
    // Card width + padding/gap
    return card.offsetWidth + 24; 
  };

  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({
      left: -getScrollOffset(),
      behavior: 'smooth'
    });
  });

  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({
      left: getScrollOffset(),
      behavior: 'smooth'
    });
  });

  // Enable/disable buttons based on scroll position (optional visual feedback)
  const toggleButtonStates = () => {
    const isAtStart = carousel.scrollLeft <= 5;
    const isAtEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 5;

    prevBtn.style.opacity = isAtStart ? '0.4' : '1';
    prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';

    nextBtn.style.opacity = isAtEnd ? '0.4' : '1';
    nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
  };

  carousel.addEventListener('scroll', toggleButtonStates);
  window.addEventListener('resize', toggleButtonStates);
  
  // Call once on init (with slight timeout to let DOM render)
  setTimeout(toggleButtonStates, 100);
}

/**
 * 6. Contact Form Submission
 * Performs validation and sends a POST request to a mock/prod webhook.
 */
function initContactForm() {
  const form = document.getElementById('lead-form');
  const formSubmit = document.getElementById('form-submit-btn');
  const successMessage = document.getElementById('form-success-msg');
  const errorMessage = document.getElementById('form-error-msg');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset feedback messages
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');

    // Validation
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const projectType = document.getElementById('form-project-type').value;
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !phone || !projectType || !message) {
      showFeedback(errorMessage, 'Por favor, completa todos los campos requeridos.');
      return;
    }

    // Set loading state
    setLoading(true);

    // Form data payload
    const payload = {
      name,
      email,
      phone,
      projectType,
      message,
      submittedAt: new Date().toISOString(),
      source: 'Landing Page Zen'
    };

    try {
      // Mock or actual Webhook endpoint. Using httpbin.org/post for a real 200 OK test response
      const webhookUrl = 'https://httpbin.org/post'; 
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Success
        form.reset();
        showFeedback(successMessage, '¡Gracias! Hemos recibido tu solicitud. Un arquitecto de Zen se contactará contigo en breve.');
      } else {
        throw new Error('Server response error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      showFeedback(errorMessage, 'Ocurrió un error al enviar el formulario. Por favor, intenta de nuevo o comunícate vía WhatsApp.');
    } finally {
      setLoading(false);
    }
  });

  function setLoading(isLoading) {
    if (!formSubmit) return;
    const btnText = formSubmit.querySelector('.btn-text');
    const btnSpinner = formSubmit.querySelector('.btn-spinner');

    if (isLoading) {
      formSubmit.disabled = true;
      if (btnText) btnText.classList.add('opacity-0');
      if (btnSpinner) btnSpinner.classList.remove('hidden');
    } else {
      formSubmit.disabled = false;
      if (btnText) btnText.classList.remove('opacity-0');
      if (btnSpinner) btnSpinner.classList.add('hidden');
    }
  }

  function showFeedback(element, text) {
    element.textContent = text;
    element.classList.remove('hidden');
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * 7. Scroll Reveal Animation
 * Adds 'active' class to elements when they enter the viewport.
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.15 // trigger when 15% of element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animate, stop observing this element
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    observer.observe(element);
  });
}
