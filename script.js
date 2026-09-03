document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     MOBILE MENU
  ========================================= */

  const menuBtn = document.getElementById('menuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function openMenu() {
    if (!mobileMenu || !menuBtn) return;

    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');

    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!mobileMenu || !menuBtn) return;

    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');

    document.body.style.overflow = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', openMenu);
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu);
  }

  // Close mobile menu when a navigation link is clicked
  document.querySelectorAll('#mobileMenu .nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close mobile menu with Escape
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });


  /* =========================================
     FAQ ACCORDION
  ========================================= */

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-q');

    if (!question) return;

    question.setAttribute('aria-expanded', 'false');

    question.addEventListener('click', () => {

      const isCurrentlyOpen = item.classList.contains('open');

      // Close all FAQ items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('open');

        const otherQuestion = otherItem.querySelector('.faq-q');

        if (otherQuestion) {
          otherQuestion.setAttribute('aria-expanded', 'false');
        }
      });

      // Open clicked item
      if (!isCurrentlyOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* =========================================
     GALLERY LIGHTBOX
  ========================================= */

  const galleryItems = Array.from(
    document.querySelectorAll('.gallery-item')
  );

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lbImage');
  const lightboxCaption = document.getElementById('lbCaption');

  const closeLightboxBtn = document.getElementById('lbClose');
  const previousBtn = document.getElementById('lbPrev');
  const nextBtn = document.getElementById('lbNext');

  let currentImageIndex = 0;

  function showImage(index) {

    if (!galleryItems.length) return;

    currentImageIndex =
      (index + galleryItems.length) % galleryItems.length;

    const item = galleryItems[currentImageIndex];
    const image = item.querySelector('img');

    if (!image) return;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt || '';

    const caption = item.dataset.caption || '';
    const category = item.dataset.cat || '';

    lightboxCaption.textContent =
      category ? `${caption} — ${category}` : caption;
  }

  function openLightbox(index) {

    if (!lightbox) return;

    showImage(index);

    lightbox.classList.add('open');

    document.body.style.overflow = 'hidden';

    if (closeLightboxBtn) {
      closeLightboxBtn.focus();
    }
  }

  function closeLightbox() {

    if (!lightbox) return;

    lightbox.classList.remove('open');

    document.body.style.overflow = '';

    // Stop image loading when closed
    if (lightboxImage) {
      lightboxImage.src = '';
    }
  }

  galleryItems.forEach((item, index) => {

    item.addEventListener('click', () => {
      openLightbox(index);
    });

    // Keyboard accessibility
    item.setAttribute('tabindex', '0');

    item.addEventListener('keydown', event => {

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(index);
      }

    });
  });

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', closeLightbox);
  }

  if (previousBtn) {
    previousBtn.addEventListener('click', () => {
      showImage(currentImageIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showImage(currentImageIndex + 1);
    });
  }

  // Close by clicking outside the image
  if (lightbox) {
    lightbox.addEventListener('click', event => {

      if (event.target === lightbox) {
        closeLightbox();
      }

    });
  }

  // Lightbox keyboard controls
  document.addEventListener('keydown', event => {

    if (!lightbox || !lightbox.classList.contains('open')) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key === 'ArrowLeft') {
      showImage(currentImageIndex - 1);
    }

    if (event.key === 'ArrowRight') {
      showImage(currentImageIndex + 1);
    }

  });


  /* =========================================
     CONTACT FORM → WHATSAPP
  ========================================= */

  const form = document.getElementById('enquiryForm');
  const successMessage = document.getElementById('formSuccess');

  if (form) {

    form.addEventListener('submit', event => {

      event.preventDefault();

      const name =
        document.getElementById('name')?.value.trim() || '';

      const phone =
        document.getElementById('phone')?.value.trim() || '';

      const date =
        document.getElementById('date')?.value || '';

      const message =
        document.getElementById('message')?.value.trim() || '';

      /* -----------------------------
         Validation
      ----------------------------- */

      if (!name) {
        alert('Please enter your name.');
        document.getElementById('name')?.focus();
        return;
      }

      if (!phone) {
        alert('Please enter your phone number.');
        document.getElementById('phone')?.focus();
        return;
      }

      // Basic Indian phone number validation
      const cleanPhone = phone.replace(/\D/g, '');

      if (cleanPhone.length < 10) {
        alert('Please enter a valid phone number.');
        document.getElementById('phone')?.focus();
        return;
      }


      /* -----------------------------
         Format preferred date
      ----------------------------- */

      let formattedDate = 'Not specified';

      if (date) {

        const selectedDate = new Date(date + 'T00:00:00');

        formattedDate = selectedDate.toLocaleDateString(
          'en-IN',
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }
        );
      }


      /* -----------------------------
         Create WhatsApp message
      ----------------------------- */

      const whatsappMessage =
`Hello Ram Krishna Homeo Hall & Clinic,

I would like to enquire about a consultation.

Name: ${name}
Phone: ${phone}
Preferred Date: ${formattedDate}
Message: ${message || 'None'}

Thank you.`;


      /* -----------------------------
         Encode entire message ONCE
      ----------------------------- */

      const encodedMessage =
        encodeURIComponent(whatsappMessage);


      /* -----------------------------
         Clinic WhatsApp number
      ----------------------------- */

      const whatsappNumber = '917765971510';


      /* -----------------------------
         Create WhatsApp URL
      ----------------------------- */

      const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;


      /* -----------------------------
         Open WhatsApp
      ----------------------------- */

      window.open(whatsappURL, '_blank');


      /* -----------------------------
         Show success message
      ----------------------------- */

      if (successMessage) {
        successMessage.classList.add('show');
      }

    });

  }


  /* =========================================
     SET MINIMUM DATE FOR APPOINTMENT
  ========================================= */

  const dateInput = document.getElementById('date');

  if (dateInput) {

    // Prevent selecting a date in the past
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    dateInput.min = `${year}-${month}-${day}`;
  }


  /* =========================================
     PHONE NUMBER INPUT
  ========================================= */

  const phoneInput = document.getElementById('phone');

  if (phoneInput) {

    phoneInput.addEventListener('input', () => {

      // Keep numbers, spaces, +, -, and parentheses
      phoneInput.value = phoneInput.value.replace(
        /[^0-9+\-\s()]/g,
        ''
      );

    });

  }

});
