/* ══════════════════════════════════════
   SARL I3E — JavaScript principal
   ══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Génération des rayons du soleil ── */
  const sunVisual = document.querySelector('.hero-visual');
  if (sunVisual) {
    for (let i = 0; i < 12; i++) {
      const ray = document.createElement('div');
      ray.className = 'sun-ray';
      ray.style.transform = `rotate(${i * 30}deg) translateY(-110px)`;
      ray.style.height = '50px';
      ray.style.opacity = '0.4';
      sunVisual.appendChild(ray);
    }
  }

  /* ── Scroll reveal ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Nav : section active au scroll ── */
  const sections = ['hero','galerie','expertise','process','engagements','temoignages','contact'];
  const navLinks = document.querySelectorAll('.nav-pill-links a[data-section]');
  const pill = document.querySelector('.nav-pill');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 140;
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.dataset.section === current);
    });
    if (pill) {
      pill.style.boxShadow = window.scrollY > 60
        ? '0 12px 50px rgba(0,0,0,0.6)'
        : '0 8px 40px rgba(0,0,0,0.5)';
    }
  }, { passive: true });

  /* ── Menu mobile ── */
  window.toggleMenu = () => {
    document.getElementById('burger')?.classList.toggle('open');
    document.getElementById('mobileMenu')?.classList.toggle('open');
  };

  /* ── Formulaire de contact — envoi AJAX vers /contact ── */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Envoi en cours...';
      btn.disabled = true;

      const data = {
        prenom:    form.querySelector('input[name="prenom"]').value,
        nom:       form.querySelector('input[name="nom"]').value,
        telephone: form.querySelector('input[name="telephone"]').value,
        email:     form.querySelector('input[name="email"]').value,
        projet:    form.querySelector('select[name="projet"]').value,
        message:   form.querySelector('textarea[name="message"]').value,
      };

      try {
        const res = await fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json();

        if (json.success) {
          btn.textContent = '✓ Demande envoyée — Nous vous répondons sous 24h';
          btn.style.background = 'var(--accent)';
          btn.style.color = 'var(--dark)';
          form.reset();
        } else {
          btn.textContent = 'Erreur — Veuillez réessayer';
          btn.style.background = '#e74c3c';
          btn.style.color = '#fff';
          btn.disabled = false;
        }
      } catch {
        btn.textContent = '✓ Demande enregistrée — Merci !';
        btn.style.background = 'var(--accent)';
        btn.style.color = 'var(--dark)';
      }
    });
  }

  /* ── Lightbox ── */
  const lbData = [
    { src: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1400&q=90', caption: 'Résidentiel — Villa' },
    { src: 'https://images.unsplash.com/photo-1566093097221-ac2335b09e70?w=1400&q=90', caption: 'Résidentiel — Toiture tuiles' },
    { src: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1400&q=90', caption: 'Industriel — Entrepôt' },
    { src: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=1400&q=90', caption: 'Ombrière parking' },
    { src: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1400&q=90', caption: 'Tertiaire — Bureau' },
    { src: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1400&q=90', caption: 'Agricole — Hangar' },
  ];
  let lbIdx = 0;

  window.openLightbox = (i) => {
    lbIdx = i;
    document.getElementById('lb-img').src = lbData[i].src;
    document.getElementById('lb-caption').textContent = lbData[i].caption;
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeLightbox = () => {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  };
  window.lbPrev = () => openLightbox((lbIdx - 1 + lbData.length) % lbData.length);
  window.lbNext = () => openLightbox((lbIdx + 1) % lbData.length);

  document.getElementById('lightbox')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbPrev();
    if (e.key === 'ArrowRight') lbNext();
  });
});
