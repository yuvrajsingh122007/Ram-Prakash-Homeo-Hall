// Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  function openMenu(){ mobileMenu.classList.add('open'); mobileMenu.setAttribute('aria-hidden','false'); menuBtn.setAttribute('aria-expanded','true'); }
  function closeMenu(){ mobileMenu.classList.remove('open'); mobileMenu.setAttribute('aria-hidden','true'); menuBtn.setAttribute('aria-expanded','false'); }
  menuBtn.addEventListener('click', openMenu);
  closeMenuBtn.addEventListener('click', closeMenu);
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMenu));

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if(!isOpen) item.classList.add('open');
    });
  });

  // Gallery lightbox
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  let currentIndex = 0;
  function showImage(i){
    currentIndex = (i + items.length) % items.length;
    const el = items[currentIndex];
    lbImage.src = el.querySelector('img').src;
    lbImage.alt = el.querySelector('img').alt;
    lbCaption.textContent = el.dataset.caption + ' — ' + el.dataset.cat;
  }
  items.forEach((el, i) => {
    el.addEventListener('click', () => { showImage(i); lightbox.classList.add('open'); });
  });
  document.getElementById('lbClose').addEventListener('click', () => lightbox.classList.remove('open'));
  document.getElementById('lbPrev').addEventListener('click', () => showImage(currentIndex - 1));
  document.getElementById('lbNext').addEventListener('click', () => showImage(currentIndex + 1));
  lightbox.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', (e) => {
    if(!lightbox.classList.contains('open')) return;
    if(e.key === 'Escape') lightbox.classList.remove('open');
    if(e.key === 'ArrowRight') showImage(currentIndex + 1);
    if(e.key === 'ArrowLeft') showImage(currentIndex - 1);
  });

  // Contact form -> WhatsApp handoff
  const form = document.getElementById('enquiryForm');
  const success = document.getElementById('formSuccess');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const date = document.getElementById('date').value;
    const message = document.getElementById('message').value.trim();
    if(!name || !phone){ return; }
    const text = `Hello Ram Krishna Homeo Hall & Clinic,%0A%0AI would like to enquire about a consultation.%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0APreferred date: ${encodeURIComponent(date || 'Not specified')}%0AMessage: ${encodeURIComponent(message || 'None')}`;
    const waUrl = `https://wa.me/910000000000?text=${text}`;
    window.open(waUrl, '_blank', 'noopener');
    success.classList.add('show');
  });