// Loader
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  setTimeout(() => loader && loader.classList.add('hidden'), 800);
});

// Mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('open');
  });

  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('open');
    });
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const section = document.querySelector(targetId);
    if (!section) return;
    e.preventDefault();
    const offset = 80;
    const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Back to top
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 260) backToTop?.classList.add('active');
  else backToTop?.classList.remove('active');
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Dark mode
const darkToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;

const applyDarkPreference = () => {
  const stored = localStorage.getItem('joyous-dark-mode');
  if (stored === 'true') body.classList.add('dark-mode');
  else if (stored === 'false') body.classList.remove('dark-mode');
};

applyDarkPreference();

darkToggle?.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  localStorage.setItem('joyous-dark-mode', body.classList.contains('dark-mode'));
});

// Scroll spy
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

window.addEventListener('scroll', () => {
  let currentId = '';
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.pageYOffset - 120;
    if (window.pageYOffset >= sectionTop) currentId = section.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    if (href.substring(1) === currentId) link.classList.add('active');
  });
});

// Contact form -> Vercel API
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contact-status');

if (contactForm && contactStatus) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    contactStatus.textContent = "Sending...";
    contactStatus.style.color = "inherit";

    const formData = new FormData(contactForm);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    try {
      const res = await fetch('/api/contact', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        contactStatus.textContent =
          data.message || "Thank you for your message! We will contact you soon.";
        contactStatus.style.color = "var(--success)";
        contactForm.reset();
      } else {
        contactStatus.textContent =
          data.message || "There was a problem sending your message.";
        contactStatus.style.color = "var(--accent)";
      }
    } catch (err) {
      contactStatus.textContent = "Network error. Please try again.";
      contactStatus.style.color = "var(--accent)";
    }
  });
}

// Newsletter
const newsletterForm = document.getElementById('newsletterForm');

newsletterForm?.addEventListener('submit', e => {
  e.preventDefault();
  const input = newsletterForm.querySelector('input[type="email"]');
  if (!input || !input.value.trim()) return;
  const existing = newsletterForm.querySelector('.newsletter-success');
  if (existing) existing.remove();
  const tag = document.createElement('div');
  tag.className = 'newsletter-success';
  tag.textContent = 'Thank you for subscribing!';
  tag.style.marginTop = '8px';
  tag.style.fontSize = '0.8rem';
  tag.style.color = '#a7f3d0';
  newsletterForm.appendChild(tag);
  input.value = '';
  setTimeout(() => tag.remove(), 4000);
});

// Particles
const particlesContainer = document.getElementById('particles-js');

if (particlesContainer) {
  const createParticles = () => {
    const total = 55;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.style.position = 'absolute';
      const size = 2 + Math.random() * 4;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.borderRadius = '999px';
      dot.style.background = 'rgba(248,250,252,0.75)';
      dot.style.top = Math.random() * 100 + '%';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.opacity = (0.3 + Math.random() * 0.7).toString();
      const duration = 14 + Math.random() * 16;
      const delay = Math.random() * 6;
      dot.style.animation = `float ${duration}s ${delay}s infinite ease-in-out`;
      particlesContainer.appendChild(dot);
    }
  };
  window.addEventListener('load', createParticles);
}
