document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const lockBody = () => document.body.classList.add('no-scroll');

  const unlockBody = () => {
    if (
      !$('#mobileMenu.open') &&
      !$('#lightbox.open') &&
      !$('#enquiryModal.open')
    ) {
      document.body.classList.remove('no-scroll');
    }
  };

  /* =========================================
     MOBILE MENU
  ========================================= */

  const menuBtn = $('#menuBtn');
  const closeMenuBtn = $('#closeMenuBtn');
  const mobileMenu = $('#mobileMenu');

  const setMenu = open => {
    if (!mobileMenu || !menuBtn) return;

    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));

    open ? lockBody() : unlockBody();

    (open ? closeMenuBtn : menuBtn)?.focus();
  };

  menuBtn?.addEventListener('click', () => setMenu(true));

  closeMenuBtn?.addEventListener('click', () => setMenu(false));

  $$('#mobileMenu .nav-link').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });


  /* =========================================
     FAQ ACCORDION
  ========================================= */

  const faqItems = $$('.faq-item');

  faqItems.forEach((item, index) => {
    const question = $('.faq-q', item);
    const answer = $('.faq-a', item);

    if (!question || !answer) return;

    const answerId = `faq-answer-${index + 1}`;

    answer.id = answerId;

    question.type = 'button';
    question.setAttribute('aria-controls', answerId);
    question.setAttribute('aria-expanded', 'false');

    question.addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');

      faqItems.forEach(other => {
        other.classList.remove('open');

        $('.faq-q', other)?.setAttribute(
          'aria-expanded',
          'false'
        );
      });

      item.classList.toggle('open', willOpen);

      question.setAttribute(
        'aria-expanded',
        String(willOpen)
      );
    });
  });


  /* =========================================
     GALLERY LIGHTBOX
  ========================================= */

  const galleryItems = $$('.gallery-item');
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lbImage');
  const lightboxCaption = $('#lbCaption');
  const lbClose = $('#lbClose');

  let currentImageIndex = 0;
  let lastGalleryTrigger = null;

  const showImage = index => {
    if (!galleryItems.length || !lightboxImage) return;

    currentImageIndex =
      (index + galleryItems.length) % galleryItems.length;

    const item = galleryItems[currentImageIndex];
    const image = $('img', item);

    if (!image) return;

    lightboxImage.src =
      image.currentSrc || image.src;

    lightboxImage.alt =
      image.alt || '';

    const caption =
      item.dataset.caption || '';

    const category =
      item.dataset.cat || '';

    if (lightboxCaption) {
      lightboxCaption.textContent =
        category
          ? `${caption} — ${category}`
          : caption;
    }
  };


  const openLightbox = index => {
    if (!lightbox) return;

    lastGalleryTrigger =
      galleryItems[index];

    showImage(index);

    lightbox.classList.add('open');

    lightbox.setAttribute(
      'aria-hidden',
      'false'
    );

    lockBody();

    lbClose?.focus();
  };


  const closeLightbox = () => {
    if (!lightbox) return;

    lightbox.classList.remove('open');

    lightbox.setAttribute(
      'aria-hidden',
      'true'
    );

    if (lightboxImage) {
      lightboxImage.src = '';
    }

    unlockBody();

    lastGalleryTrigger?.focus();
  };


  galleryItems.forEach((item, index) => {
    item.tabIndex = 0;
    item.setAttribute('role', 'button');

    item.setAttribute(
      'aria-label',
      `Open image: ${
        item.dataset.caption ||
        `Gallery image ${index + 1}`
      }`
    );


    item.addEventListener('click', () => {
      openLightbox(index);
    });


    item.addEventListener('keydown', event => {
      if (
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });


  lbClose?.addEventListener(
    'click',
    closeLightbox
  );


  $('#lbPrev')?.addEventListener(
    'click',
    () => showImage(currentImageIndex - 1)
  );


  $('#lbNext')?.addEventListener(
    'click',
    () => showImage(currentImageIndex + 1)
  );


  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });


  /* =========================================
     DATE INPUT
  ========================================= */

  const dateInput = $('#date');

  if (dateInput) {
    const today = new Date();

    const localDate = new Date(
      today.getTime() -
      today.getTimezoneOffset() * 60000
    );

    dateInput.min =
      localDate.toISOString().split('T')[0];
  }


  /* =========================================
     PHONE INPUT
  ========================================= */

  const phoneInput = $('#phone');

  phoneInput?.addEventListener('input', () => {
    phoneInput.value =
      phoneInput.value.replace(
        /[^\d+\-\s()]/g,
        ''
      );
  });


  /* =========================================
     ENQUIRY FORM
  ========================================= */

  const form = $('#enquiryForm');
  const successMessage = $('#formSuccess');
  const enquiryModal = $('#enquiryModal');
  const modalClose = $('#enquiryModalClose');

  let enquiryData = null;
  let lastModalTrigger = null;


  const formatDate = date => {
    if (!date) return 'Not specified';

    const parsed =
      new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
      return 'Not specified';
    }

    return parsed.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    );
  };


  const createEnquiryMessage = ({
    name,
    phone,
    formattedDate,
    message
  }) => `Hello Ram Krishna Homeo Hall & Clinic,

I would like to enquire about a consultation.

Name: ${name}
Phone: ${phone}
Preferred Date: ${formattedDate}
Message: ${message || 'None'}

Thank you.`;


  /* =========================================
     ENQUIRY MODAL
  ========================================= */

  const setModal = open => {
    if (!enquiryModal) return;

    enquiryModal.classList.toggle(
      'open',
      open
    );

    enquiryModal.setAttribute(
      'aria-hidden',
      String(!open)
    );

    open ? lockBody() : unlockBody();

    if (open) {
      lastModalTrigger =
        document.activeElement;

      modalClose?.focus();
    } else {
      lastModalTrigger?.focus?.();
    }
  };


  const showSuccess = text => {
    if (!successMessage) return;

    successMessage.textContent = text;

    successMessage.classList.add('show');
  };


  /* =========================================
     FORM SUBMISSION
  ========================================= */

  form?.addEventListener(
    'submit',
    event => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const data =
        new FormData(form);

      const name =
        String(data.get('name') || '').trim();

      const phone =
        String(data.get('phone') || '').trim();

      const date =
        String(data.get('date') || '');

      const message =
        String(data.get('message') || '').trim();

      const cleanPhone =
        phone.replace(/\D/g, '');


      if (
        cleanPhone.length < 10 ||
        cleanPhone.length > 15
      ) {
        phoneInput?.setCustomValidity(
          'Please enter a valid phone number.'
        );

        phoneInput?.reportValidity();
        phoneInput?.focus();

        return;
      }


      phoneInput?.setCustomValidity('');


      enquiryData = {
        name,
        phone,
        date,
        formattedDate: formatDate(date),
        message
      };


      setModal(true);
    }
  );


  phoneInput?.addEventListener(
    'input',
    () => phoneInput.setCustomValidity('')
  );


  /* =========================================
     SEND VIA WHATSAPP
  ========================================= */

  $('#sendWhatsApp')?.addEventListener(
    'click',
    () => {
      if (!enquiryData) return;

      const url =
        `https://wa.me/917765971510?text=${
          encodeURIComponent(
            createEnquiryMessage(enquiryData)
          )
        }`;


      setModal(false);

      window.open(
        url,
        '_blank',
        'noopener,noreferrer'
      );


      showSuccess(
        'Your enquiry is ready in WhatsApp. Review it and tap Send to contact the clinic.'
      );
    }
  );


  /* =========================================
     SEND VIA EMAIL
  ========================================= */

  $('#sendEmail')?.addEventListener(
    'click',
    () => {
      if (!enquiryData) return;

      const subject =
        'Consultation Enquiry - Ram Krishna Homeo Hall & Clinic';

      const body =
        createEnquiryMessage(enquiryData);


      setModal(false);


      window.location.href =
        `mailto:ramkrishnahomeo@gmail.com?subject=${
          encodeURIComponent(subject)
        }&body=${
          encodeURIComponent(body)
        }`;


      showSuccess(
        'Your email draft is ready. Review it and tap Send.'
      );
    }
  );


  /* =========================================
     CLOSE ENQUIRY MODAL
  ========================================= */

  modalClose?.addEventListener(
    'click',
    () => setModal(false)
  );


  $('#enquiryCancel')?.addEventListener(
    'click',
    () => setModal(false)
  );


  $('#enquiryModalBackdrop')?.addEventListener(
    'click',
    () => setModal(false)
  );


  /* =========================================
     GLOBAL KEYBOARD CONTROLS
  ========================================= */

  document.addEventListener(
    'keydown',
    event => {

      if (event.key === 'Escape') {

        if (
          enquiryModal?.classList.contains('open')
        ) {
          return setModal(false);
        }


        if (
          lightbox?.classList.contains('open')
        ) {
          return closeLightbox();
        }


        if (
          mobileMenu?.classList.contains('open')
        ) {
          return setMenu(false);
        }
      }


      if (
        !lightbox?.classList.contains('open')
      ) {
        return;
      }


      if (event.key === 'ArrowLeft') {
        showImage(
          currentImageIndex - 1
        );
      }


      if (event.key === 'ArrowRight') {
        showImage(
          currentImageIndex + 1
        );
      }
    }
  );
});