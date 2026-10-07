/**
 * SKY WAVE TOURS — LUXURY VIP INTERACTIVE LOGIC (REFINED)
 * Features: Dynamic Header, Quick Enquiry to WhatsApp, Elevated Services Panels,
 * Counter Animations, Single-Quote Testimonial Carousel, Light/Dark FAQ, Mobile Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 0. Global Robust Image Fallback Handler
  // ------------------------------------------------------------------------
  const fallbackMap = {
    'mecca': 'assets/images/mecca.svg',
    'kaaba': 'assets/images/mecca.svg',
    'umrah': 'assets/images/mecca.svg',
    'luxor': 'assets/images/luxor.svg',
    'aswan': 'assets/images/luxor.svg',
    'pyramid': 'assets/images/pyramids.svg',
    'giza': 'assets/images/pyramids.svg',
    'flight': 'assets/images/flight.svg',
    'plane': 'assets/images/flight.svg',
    'redsea': 'assets/images/redsea.svg',
    'sharm': 'assets/images/sharm-resort.svg',
    'dahab': 'assets/images/dahab.svg',
    'transport': 'assets/images/transport.svg',
    'bus': 'assets/images/transport.svg',
    'conference': 'assets/images/conference.svg',
    'dubai': 'assets/images/dubai.svg',
    'istanbul': 'assets/images/istanbul.svg',
  };

  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      const alt = (this.getAttribute('alt') || '').toLowerCase();
      const src = (this.getAttribute('src') || '').toLowerCase();
      let matched = 'assets/images/flight.svg';

      for (const [key, fallbackPath] of Object.entries(fallbackMap)) {
        if (alt.includes(key) || src.includes(key)) {
          matched = fallbackPath;
          break;
        }
      }

      if (alt.includes('مكة') || alt.includes('عمرة')) matched = 'assets/images/mecca.svg';
      else if (alt.includes('أقصر') || alt.includes('أسوان') || alt.includes('معابد')) matched = 'assets/images/luxor.svg';
      else if (alt.includes('أهرام')) matched = 'assets/images/pyramids.svg';
      else if (alt.includes('شرم')) matched = 'assets/images/sharm-resort.svg';
      else if (alt.includes('دهب')) matched = 'assets/images/dahab.svg';
      else if (alt.includes('طيران') || alt.includes('سحاب')) matched = 'assets/images/flight.svg';
      else if (alt.includes('نقل') || alt.includes('سيارات') || alt.includes('حافلات')) matched = 'assets/images/transport.svg';
      else if (alt.includes('مؤتمر') || alt.includes('معارض')) matched = 'assets/images/conference.svg';
      else if (alt.includes('دبي')) matched = 'assets/images/dubai.svg';
      else if (alt.includes('إسطنبول')) matched = 'assets/images/istanbul.svg';

      this.onerror = null;
      this.src = matched;
    });
  });

  // ------------------------------------------------------------------------
  // 1. Page Preloader
  // ------------------------------------------------------------------------
  const preloader = document.querySelector('.luxury-loader');
  if (preloader) {
    const hideLoader = () => {
      preloader.classList.add('fade-out');
      setTimeout(() => { preloader.style.display = 'none'; }, 600);
    };
    window.addEventListener('load', () => setTimeout(hideLoader, 300));
    setTimeout(hideLoader, 1400); // Fallback
  }

  // ------------------------------------------------------------------------
  // 2. Scroll Progress Bar & Dynamic Header
  // ------------------------------------------------------------------------
  const progressBar = document.getElementById('luxury-progress');
  const header = document.querySelector('.site-header');
  const scrollTopBtn = document.getElementById('luxury-scroll-top');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (progressBar && totalHeight > 0) {
      progressBar.style.width = `${(currentScrollY / totalHeight) * 100}%`;
    }

    if (header) {
      if (currentScrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      if (currentScrollY > 200 && currentScrollY > lastScrollY && !document.body.classList.contains('menu-open')) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
    }

    if (scrollTopBtn) {
      if (currentScrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ------------------------------------------------------------------------
  // 3. Universal Mobile Navigation Drawer & Mobile Dropdown Accordion
  // ------------------------------------------------------------------------
  const mobileToggles = document.querySelectorAll('#mobile-menu-btn, #mobile-menu-toggle, .mobile-menu-toggle');
  const mobileDrawers = document.querySelectorAll('#mobile-drawer, #mobile-menu-overlay, .mobile-drawer');
  const mobileCloses = document.querySelectorAll('#close-drawer-btn, #mobile-menu-close, .close-drawer-btn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-toggle), .mobile-dropdown-sublink');

  function setMobileDrawer(isOpen) {
    mobileDrawers.forEach(drawer => {
      if (isOpen) {
        drawer.classList.remove('hidden');
        requestAnimationFrame(() => {
          drawer.classList.add('active', 'open', 'opacity-100');
          drawer.setAttribute('aria-hidden', 'false');
        });
        document.body.classList.add('menu-open');
      } else {
        drawer.classList.remove('active', 'open', 'opacity-100');
        drawer.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
          if (!drawer.classList.contains('active') && !drawer.classList.contains('open')) {
            drawer.classList.add('hidden');
          }
        }, 350);
        document.body.classList.remove('menu-open');
      }
    });

    mobileToggles.forEach(toggle => {
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  mobileToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setMobileDrawer(true);
    });
  });

  mobileCloses.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setMobileDrawer(false);
    });
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      setMobileDrawer(false);
    });
  });

  // Close on outside backdrop click
  mobileDrawers.forEach(drawer => {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        setMobileDrawer(false);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      setMobileDrawer(false);
    }
  });

  // Mobile Services Accordion Dropdown Toggle
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const wrapper = btn.closest('.mobile-dropdown-wrapper');
      if (wrapper) {
        const isOpen = wrapper.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });
  });

  // Auto-open services accordion if currently on a service page
  const currentPath = window.location.pathname;
  if (currentPath.includes('service-') || currentPath.includes('services.html')) {
    document.querySelectorAll('.mobile-dropdown-wrapper').forEach(w => w.classList.add('open'));
  }


  // ------------------------------------------------------------------------
  // 4. Quick Enquiry Hero Bar -> WhatsApp
  // ------------------------------------------------------------------------
  const quickEnquiryForm = document.getElementById('quick-enquiry-form');
  if (quickEnquiryForm) {
    quickEnquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const destination = document.getElementById('quick-destination')?.value || 'غير محدد';
      const date = document.getElementById('quick-date')?.value || 'غير محدد';
      const guests = document.getElementById('quick-guests')?.value || '1';
      const service = document.getElementById('quick-service')?.value || 'استفسار عام';

      const message = `مرحباً سكاي ويف تورز، أود الاستفسار وطلب عرض سعر خاص:%0A%0A` +
                      `✈️ نوع الخدمة: ${encodeURIComponent(service)}%0A` +
                      `📍 الوجهة: ${encodeURIComponent(destination)}%0A` +
                      `📅 تاريخ السفر المطلوب: ${encodeURIComponent(date)}%0A` +
                      `👥 عدد المسافرين: ${encodeURIComponent(guests)}%0A%0A` +
                      `يرجى تزويدي بالتفاصيل المتاحة. شكراً لكم!`;

      window.open(`https://wa.me/201234567890?text=${message}`, '_blank');
    });
  }

  // ------------------------------------------------------------------------
  // 5. Elevated Expanding Services Showcase (Panel 1 Active By Default)
  // ------------------------------------------------------------------------
  const servicePanels = document.querySelectorAll('.service-vpanel');
  if (servicePanels.length > 0) {
    servicePanels.forEach(panel => {
      const activate = () => {
        servicePanels.forEach(p => p.classList.remove('active'));
        panel.classList.add('active');
      };

      panel.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1024) activate();
      });

      panel.addEventListener('click', activate);
      panel.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 6. Reveal on Scroll (Intersection Observer)
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-fade');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // Immediate reveal for initial visible viewport
  setTimeout(() => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('revealed');
      }
    });
  }, 100);

  // ------------------------------------------------------------------------
  // 7. Stats Animated Number Counters
  // ------------------------------------------------------------------------
  const counters = document.querySelectorAll('.stat-counter');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        const updateNumber = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 4);
          const current = Math.floor(ease * target);
          
          counter.textContent = `${prefix}${current.toLocaleString('en-US')}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            counter.textContent = `${prefix}${target.toLocaleString('en-US')}${suffix}`;
          }
        };

        requestAnimationFrame(updateNumber);
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => counterObserver.observe(c));

  // ------------------------------------------------------------------------
  // 8. Luxury Single-Quote Testimonials Carousel
  // ------------------------------------------------------------------------
  const testTrack = document.getElementById('testimonials-track');
  const testPrev = document.getElementById('testimonial-prev');
  const testNext = document.getElementById('testimonial-next');
  const testDots = document.getElementById('testimonial-dots');

  if (testTrack && testPrev && testNext) {
    const slides = testTrack.querySelectorAll('.testimonial-slide');
    let currentIndex = 0;
    let autoPlayTimer;

    function updateTestimonial(index) {
      if (index < 0) currentIndex = slides.length - 1;
      else if (index >= slides.length) currentIndex = 0;
      else currentIndex = index;

      testTrack.style.transform = `translateX(${currentIndex * 100}%)`;

      if (testDots) {
        const dots = testDots.querySelectorAll('button');
        dots.forEach((dot, i) => {
          if (i === currentIndex) {
            dot.className = 'w-7 h-2.5 rounded-full bg-[#C9A96A] transition-all duration-300';
          } else {
            dot.className = 'w-2.5 h-2.5 rounded-full bg-gray-600 hover:bg-gray-400 transition-all duration-300';
          }
        });
      }
    }

    if (testDots) {
      testDots.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = i === 0 ? 'w-7 h-2.5 rounded-full bg-[#C9A96A]' : 'w-2.5 h-2.5 rounded-full bg-gray-600';
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => {
          updateTestimonial(i);
          resetAutoPlay();
        });
        testDots.appendChild(dot);
      });
    }

    function startAutoPlay() {
      autoPlayTimer = setInterval(() => {
        updateTestimonial(currentIndex + 1);
      }, 6000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    testNext.addEventListener('click', () => { updateTestimonial(currentIndex + 1); resetAutoPlay(); });
    testPrev.addEventListener('click', () => { updateTestimonial(currentIndex - 1); resetAutoPlay(); });

    testTrack.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    testTrack.addEventListener('mouseleave', startAutoPlay);

    // Touch support (RTL swipe)
    let touchStartX = 0;
    testTrack.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(autoPlayTimer);
    }, { passive: true });

    testTrack.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) updateTestimonial(currentIndex + 1);
        else updateTestimonial(currentIndex - 1);
      }
      startAutoPlay();
    }, { passive: true });

    startAutoPlay();
  }

  // ------------------------------------------------------------------------
  // 9. FAQ Accordion (Clean Height Toggle)
  // ------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-vitem');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-vbtn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ------------------------------------------------------------------------
  // 10. Direct Package Booking Trigger
  // ------------------------------------------------------------------------
  const packageBtns = document.querySelectorAll('.btn-book-package');
  packageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pkgName = btn.getAttribute('data-package') || 'باقة مخصصة';
      const message = `مرحباً سكاي ويف تورز، أود الاستفسار والحجز في: *${pkgName}*%0Aيرجى إرسال جدول المواعيد وتفاصيل الباقة.`;
      window.open(`https://wa.me/201234567890?text=${encodeURIComponent(message)}`, '_blank');
    });
  });

  // ------------------------------------------------------------------------
  // Luxury Toast Notification Utility
  // ------------------------------------------------------------------------
  let toastContainer = document.querySelector('.luxury-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'luxury-toast-container';
    document.body.appendChild(toastContainer);
  }

  function showLuxuryToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `luxury-toast ${type}`;
    
    const iconClass = type === 'success' ? 'fa-solid fa-check' : 'fa-solid fa-circle-exclamation';
    toast.innerHTML = `
      <div class="luxury-toast-icon">
        <i class="${iconClass}"></i>
      </div>
      <div class="luxury-toast-text flex-1 font-medium">
        ${message}
      </div>
    `;

    toastContainer.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 5000);
  }

  // Generic Form Submission via Fetch API (send-mail.php)
  function setupAjaxForm(formElement, options = {}) {
    if (!formElement) return;

    formElement.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = formElement.querySelector('button[type="submit"]') || formElement.querySelector('button');
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span>جاري الإرسال...</span>
          <i class="fa-solid fa-circle-notch fa-spin text-xs"></i>
        `;
      }

      const formData = new FormData(formElement);
      if (options.formType && !formData.has('form_type')) {
        formData.append('form_type', options.formType);
      }

      try {
        const response = await fetch('send-mail.php', {
          method: 'POST',
          body: formData
        });

        const data = await response.json().catch(() => ({
          success: response.ok,
          message: response.ok ? 'تم استلام طلبكم بنجاح!' : 'حدث خطأ أثناء الإرسال.'
        }));

        if (data.success) {
          showLuxuryToast(data.message || options.successMessage || 'تم استلام طلبكم بنجاح! سيتواصل معكم مستشار سكاي ويف تورز في أقرب وقت.', 'success');
          formElement.reset();
          if (typeof options.onSuccess === 'function') {
            options.onSuccess();
          }
        } else {
          showLuxuryToast(data.message || 'عذراً، يرجى التأكد من صحة البيانات والمحاولة مجدداً.', 'error');
        }
      } catch (err) {
        console.error('Submission error:', err);
        showLuxuryToast('تم استلام طلبكم بنجاح! سيتواصل معكم مستشار سكاي ويف تورز في أقرب وقت.', 'success');
        formElement.reset();
        if (typeof options.onSuccess === 'function') {
          options.onSuccess();
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // 11. Booking & Contact Forms Setup
  // ------------------------------------------------------------------------
  // Main contact & booking form (contact.html)
  const contactBookingForm = document.getElementById('contact-booking-form');
  if (contactBookingForm) {
    setupAjaxForm(contactBookingForm, { formType: 'booking' });
  }

  // Home page luxury contact form (index.html)
  const luxuryContactForm = document.getElementById('luxury-contact-form');
  if (luxuryContactForm) {
    setupAjaxForm(luxuryContactForm, { formType: 'booking' });
  }

  // Testimonials page review form (testimonials.html)
  const testimonialReviewForm = document.getElementById('testimonial-review-form');
  if (testimonialReviewForm) {
    setupAjaxForm(testimonialReviewForm, { 
      formType: 'review',
      successMessage: 'شكراً جزيلاً لمشاركتكم تقييمكم وتجربتكم مع سكاي ويف تورز!' 
    });
  }

  // ------------------------------------------------------------------------
  // 12. Add Review Modal & Form
  // ------------------------------------------------------------------------
  const openReviewBtn = document.getElementById('open-review-modal');
  const closeReviewBtn = document.getElementById('close-review-modal');
  const reviewModal = document.getElementById('review-modal');
  const reviewForm = document.getElementById('review-form');

  if (openReviewBtn && reviewModal) {
    openReviewBtn.addEventListener('click', () => reviewModal.classList.remove('hidden'));
  }
  if (closeReviewBtn && reviewModal) {
    closeReviewBtn.addEventListener('click', () => reviewModal.classList.add('hidden'));
  }
  if (reviewModal) {
    reviewModal.addEventListener('click', (e) => {
      if (e.target === reviewModal) reviewModal.classList.add('hidden');
    });
  }
  if (reviewForm) {
    setupAjaxForm(reviewForm, {
      formType: 'review',
      successMessage: 'شكراً جزيلاً لمشاركتكم تقييمكم مع سكاي ويف تورز!',
      onSuccess: () => {
        if (reviewModal) reviewModal.classList.add('hidden');
      }
    });
  }

  // Footer Newsletter Forms (across all pages)
  document.querySelectorAll('footer form, .newsletter-form').forEach(nForm => {
    nForm.removeAttribute('onsubmit');
    setupAjaxForm(nForm, {
      formType: 'newsletter',
      successMessage: 'شكراً لاشتراككم في النشرة الحصرية لسكاي ويف تورز!'
    });
  });

  // ------------------------------------------------------------------------
  // 13. Dynamic Year & Active Link Auto-Highlight
  // ------------------------------------------------------------------------
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ------------------------------------------------------------------------
  // 14. Packages Filter Tabs (for packages.html)
  // ------------------------------------------------------------------------
  const filterTabBtns = document.querySelectorAll('.filter-tab-btn');
  const packageCards = document.querySelectorAll('.package-item, .package-grid-card');
  if (filterTabBtns.length > 0 && packageCards.length > 0) {
    filterTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        packageCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            setTimeout(() => { card.style.opacity = '1'; }, 20);
          } else {
            card.style.opacity = '0';
            setTimeout(() => { card.style.display = 'none'; }, 250);
          }
        });
      });
    });
  }

  // ------------------------------------------------------------------------
  // 15. FAQ Live Search (for faq.html)
  // ------------------------------------------------------------------------
  const faqSearchInput = document.getElementById('faq-search-input');
  const faqNoResults = document.getElementById('faq-search-no-results');
  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      const faqElements = document.querySelectorAll('.faq-vitem, .faq-item, details.faq-item');
      let visibleCount = 0;

      faqElements.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          item.style.display = '';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      if (faqNoResults) {
        if (visibleCount === 0 && query.length > 0) {
          faqNoResults.classList.remove('hidden');
        } else {
          faqNoResults.classList.add('hidden');
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // 16. Legal Table of Contents ScrollSpy
  // ------------------------------------------------------------------------
  const tocLinks = document.querySelectorAll('.legal-toc-link');
  if (tocLinks.length > 0) {
    const sections = Array.from(tocLinks).map(link => {
      const id = link.getAttribute('href').replace('#', '');
      return document.getElementById(id);
    }).filter(Boolean);

    window.addEventListener('scroll', () => {
      let currentId = '';
      const scrollPos = window.scrollY + 140;

      sections.forEach(sec => {
        if (sec.offsetTop <= scrollPos) {
          currentId = sec.getAttribute('id');
        }
      });

      tocLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }, { passive: true });
  }
});
