// --- LANGUAGE TOGGLE ---
let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  document.getElementById('langToggle').textContent = lang === 'en' ? 'PT' : 'EN';

  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) el.textContent = text;
  });
}

document.getElementById('langToggle').addEventListener('click', () => {
  setLanguage(currentLang === 'en' ? 'pt' : 'en');
});

// --- NAV SCROLL BEHAVIOR ---
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// --- REVEAL ON SCROLL ---
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// --- SMOOTH NAV LINKS ---
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --- CONTACT FORM (Formspree) ---
const FORMSPREE_ID = 'xgojaqdj';

const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', async () => {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    alert(currentLang === 'en'
      ? 'Please fill in all fields.'
      : 'Por favor, preencha todos os campos.');
    return;
  }

  const originalText = sendBtn.textContent;
  sendBtn.textContent = currentLang === 'en' ? 'Sending…' : 'Enviando…';
  sendBtn.disabled = true;

  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    if (res.ok) {
      sendBtn.textContent = currentLang === 'en' ? 'Message sent ✓' : 'Mensagem enviada ✓';
      document.getElementById('name').value    = '';
      document.getElementById('email').value   = '';
      document.getElementById('message').value = '';
      setTimeout(() => {
        sendBtn.textContent = originalText;
        sendBtn.disabled    = false;
      }, 3000);
    } else {
      throw new Error('Server error');
    }
  } catch {
    sendBtn.textContent = currentLang === 'en'
      ? 'Failed — try emailing me directly'
      : 'Falhou — tente me enviar um e-mail';
    sendBtn.disabled = false;
    setTimeout(() => { sendBtn.textContent = originalText; }, 4000);
  }
});