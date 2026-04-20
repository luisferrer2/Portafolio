// ── Scroll reveal ──────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ── Nav shrink on scroll ───────────────────────────────────
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Nav "Book Now" scrolls to form ────────────────────────
document.getElementById('navBookBtn').addEventListener('click', () => {
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
});

// ── Set min date for date input ───────────────────────────
const dateInput = document.getElementById('fdate');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
  dateInput.value = today;
}

// ── Toast helpers ─────────────────────────────────────────
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
let toastTimer;

function showToast(msg) {
  toastMsg.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 5000);
}

document.getElementById('toastClose').addEventListener('click', () => {
  toast.classList.remove('show');
});


const WHATSAPP_NUMBER = '573136943159';
// ── Booking form submit → abre WhatsApp ──────────────────
document.getElementById('confirmBtn').addEventListener('click', () => {
  const name    = document.getElementById('fname').value.trim();
  const phone   = document.getElementById('fphone').value.trim();
  const service = document.getElementById('fservice').value;
  const barber  = document.getElementById('fbarber').value;
  const date    = document.getElementById('fdate').value;
  const time    = document.getElementById('ftime').value;

  if (!name)    { highlight('fname',  'Please enter your name.');         return; }
  if (!phone)   { highlight('fphone', 'Please enter your phone number.'); return; }
  if (!service) { showToast('⚠️ Please select a service.'); return; }

  const dateLabel = date
    ? new Date(date + 'T00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'TBD';

  // Armar el mensaje
  const msg =
    `✂️ *New Appointment — Kings Cut*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `💈 *Service:* ${service}\n` +
    `🧔 *Barber:* ${barber}\n` +
    `📅 *Date:* ${dateLabel}\n` +
    `🕐 *Time:* ${time}\n\n` +
    `_Sent from kingscut.com_`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  // Abrir WhatsApp inmediatamente (dentro del mismo click event, sin delay)
  window.open(url, '_blank');
  showToast(`✅ Opening WhatsApp... confirm your booking, ${name}!`);

  // Reset form
  document.getElementById('fname').value    = '';
  document.getElementById('fphone').value   = '';
  document.getElementById('fservice').value = '';
});

function highlight(id, msg) {
  const el = document.getElementById(id);
  el.style.borderColor = '#e05050';
  el.focus();
  el.addEventListener('input', () => el.style.borderColor = '', { once: true });
  showToast('⚠️ ' + msg);
}

// ── Service cards → pre-fill booking form ────────────────
const serviceMap = {
  'Classic Cut':          'Classic Cut — $25',
  'Straight Razor Shave': 'Straight Razor Shave — $30',
  'The King Package':     'The King Package — $60',
  'Beard Sculpt':         'Beard Sculpt — $20',
  'Hair Color':           'Hair Color — $45',
  'Kids Cut':             'Kids Cut — $18'
};

document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.querySelector('.service-name').textContent;
    const sel  = document.getElementById('fservice');
    if (serviceMap[name]) {
      sel.value = serviceMap[name];
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    }
  });
});