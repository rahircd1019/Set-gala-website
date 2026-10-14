// ==========================================================================
// 1. Friend Presets: Barkada Gala & Friendly Date / Catch-Up
// ==========================================================================
const TEMPLATES = {
  gala: {
    theme: 'sky',
    badge: 'DRAWING NO MORE! TARA NA!',
    title: 'Swimming with the Barkada: Poolside Hangout',
    tagline: 'A fun-filled day of swimming, laughter, and bonding with the barkada! Bring your swimsuits, towels, and good vibes for a memorable poolside hangout.',
    host: 'rahircd1019',
    date: '2050-10-24',
    start: '14:00',
    end: '22:00',
    dress: 'Just be you! Swimsuit, comfy clothes, and slippers are all good.',
    venue: 'Splash Island Waterpark',
    address: 'Splash Island Waterpark, Brgy. Sta. Cruz, Biñan, Laguna'
  },
  date: {
    theme: 'matcha',
    badge: 'LONG OVERDUE LIFE UPDATE',
    title: 'Coffee, Pastries & Chika Date',
    tagline: 'A chill afternoon catch-up with the besties! Good iced coffee, cozy cafe vibes, photo booth snaps, and non-stop life updates.',
    host: 'rahircd1019',
    date: '2050-10-25',
    start: '15:00',
    end: '19:30',
    dress: 'Smart Casual + Comfy Sneakers',
    venue: 'Yardstick Coffee — Legazpi Village',
    address: '106 Esteban, Legazpi Village, Makati, Metro Manila'
  }
};

// Initial Sample Squad Entries
let guests = [
  {
    name: 'John Doe',
    status: 'attending',
    count: 1,
    diet: 'Samgyeopsal & BBQ ',
    note: 'Walang male-late please! '
  }
];

// ==========================================================================
// 2. Live Update & Template Controls
// ==========================================================================
function loadTemplate(key) {
  const t = TEMPLATES[key];
  if (!t) return;

  document.getElementById('preset-gala').classList.toggle('active', key === 'gala');
  document.getElementById('preset-date').classList.toggle('active', key === 'date');

  document.getElementById('theme-select').value = t.theme;
  document.getElementById('input-badge').value = t.badge;
  document.getElementById('input-title').value = t.title;
  document.getElementById('input-tagline').value = t.tagline;
  document.getElementById('input-host').value = t.host;
  document.getElementById('input-date').value = t.date;
  document.getElementById('input-start').value = t.start;
  document.getElementById('input-end').value = t.end;
  document.getElementById('input-dress').value = t.dress;
  document.getElementById('input-venue').value = t.venue;
  document.getElementById('input-address').value = t.address;

  changeTheme(t.theme);
  updateInvitation();
}

function changeTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
}

function formatReadableDate(dateStr) {
  if (!dateStr) return 'Date TBD';
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatReadableTime(timeStr) {
  if (!timeStr) return '';
  const [hourStr, minute] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

function updateInvitation() {
  const badge = document.getElementById('input-badge').value;
  const title = document.getElementById('input-title').value;
  const tagline = document.getElementById('input-tagline').value;
  const host = document.getElementById('input-host').value;
  const dateVal = document.getElementById('input-date').value;
  const startVal = document.getElementById('input-start').value;
  const endVal = document.getElementById('input-end').value;
  const dress = document.getElementById('input-dress').value;
  const venue = document.getElementById('input-venue').value;
  const address = document.getElementById('input-address').value;

  document.getElementById('display-badge').textContent = badge;
  document.getElementById('display-title').textContent = title;
  document.getElementById('display-tagline').textContent = tagline;
  document.getElementById('display-host').textContent = host;
  document.getElementById('display-date').textContent = formatReadableDate(dateVal);
  document.getElementById('display-time').textContent =
    `${formatReadableTime(startVal)} – ${formatReadableTime(endVal)}`;
  document.getElementById('display-dress').textContent = dress;
  document.getElementById('display-venue').textContent = venue;
  document.getElementById('display-address').textContent = address;

  // Update Google Maps Embed & Directions Link
  const encodedQuery = encodeURIComponent(`${venue}, ${address}`);
  document.getElementById('map-iframe').src =
    `https://maps.google.com/maps?q=${encodedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  document.getElementById('directions-link').href =
    `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

  updateCountdown();
}

// ==========================================================================
// 3. Countdown Timer
// ==========================================================================
function updateCountdown() {
  const dateVal = document.getElementById('input-date').value;
  const startVal = document.getElementById('input-start').value || '14:00';
  if (!dateVal) return;

  const target = new Date(`${dateVal}T${startVal}:00`).getTime();
  const now = new Date().getTime();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / 1000 / 60) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}

setInterval(updateCountdown, 1000);

// ==========================================================================
// 4. Calendar Integration
// ==========================================================================
function getCalendarDates() {
  const dateVal = document.getElementById('input-date').value.replace(/-/g, '');
  const startVal = (document.getElementById('input-start').value || '14:00').replace(':', '') + '00';
  const endVal = (document.getElementById('input-end').value || '22:00').replace(':', '') + '00';
  return {
    start: `${dateVal}T${startVal}`,
    end: `${dateVal}T${endVal}`
  };
}

function addToGoogleCalendar() {
  const title = encodeURIComponent(document.getElementById('input-title').value);
  const details = encodeURIComponent(document.getElementById('input-tagline').value);
  const location = encodeURIComponent(
    `${document.getElementById('input-venue').value}, ${document.getElementById('input-address').value}`
  );
  const { start, end } = getCalendarDates();

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  window.open(url, '_blank');
}

function downloadICS() {
  const title = document.getElementById('input-title').value;
  const desc = document.getElementById('input-tagline').value;
  const location = `${document.getElementById('input-venue').value}, ${document.getElementById('input-address').value}`;
  const { start, end } = getCalendarDates();

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.ics`;
  link.click();
}

// ==========================================================================
// 5. Squad Roll Call (RSVP) & Confetti
// ==========================================================================
function renderGuestbook() {
  const listEl = document.getElementById('guest-list');
  listEl.innerHTML = '';

  let totalFriends = 0;
  guests.forEach((g) => {
    if (g.status === 'attending' || g.status === 'late') {
      totalFriends += Number(g.count);
    }

    let badgeIcon = '🔥 G!';
    if (g.status === 'late') badgeIcon = '🏃‍♂️ Humabol';
    if (g.status === 'declined') badgeIcon = '😭 Pass Muna';

    const item = document.createElement('div');
    item.className = 'guest-item';
    item.innerHTML = `
      <div class="guest-info">
        <h4>${g.name} (${badgeIcon})</h4>
        <p>${g.note || 'See you guys there!'}</p>
      </div>
      <span class="guest-meta">
        ${g.status !== 'declined' ? `${g.count} Pax • ${g.diet || 'Kahit saan!'}` : 'Next Time'}
      </span>
    `;
    listEl.appendChild(item);
  });

  document.getElementById('total-headcount').textContent = `${totalFriends} Friends Going`;
}

function submitRSVP(e) {
  e.preventDefault();
  const name = document.getElementById('rsvp-name').value.trim();
  const status = document.getElementById('rsvp-status').value;
  const count = document.getElementById('rsvp-guests').value;
  const diet = document.getElementById('rsvp-diet').value.trim();
  const note = document.getElementById('rsvp-note').value.trim();

  if (!name) return;

  guests.unshift({ name, status, count, diet, note });
  renderGuestbook();
  document.getElementById('rsvp-form').reset();

  generateAndCopyShareableURL();

  if (status !== 'declined') {
    launchConfetti();
    showToast(`✅ Added ${name}! Updated link copied—send it back to the GC!`);
  } else {
    showToast(`Awts ${name}! Updated link copied—send it back to the GC!`);
  }
}

// ==========================================================================
// 6. UI Helpers
// ==========================================================================
function toggleDrawer() {
  document.getElementById('custom-drawer').classList.toggle('open');
}

function toggleGuestView(enable) {
  document.getElementById('top-bar').classList.toggle('hidden', enable);
  document.getElementById('exit-guest-btn').classList.toggle('hidden', !enable);
  if (enable) {
    document.getElementById('custom-drawer').classList.remove('open');
  }
}

function copyAddress() {
  const address = `${document.getElementById('input-venue').value}, ${document.getElementById('input-address').value}`;
  navigator.clipboard.writeText(address);
  showToast('Meetup spot copied to clipboard!');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    size: Math.random() * 8 + 4,
    speedY: Math.random() * 3.5 + 2,
    speedX: (Math.random() - 0.5) * 2.5,
    color: ['#ff7a45', '#38bdf8', '#4c8c5c', '#facc15'][Math.floor(Math.random() * 4)]
  }));

  let frames = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    frames++;
    if (frames < 150) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animate();
}

// ==========================================================================
// 7. Save, Shareable URL Generator & Load Logic
// ==========================================================================
const STORAGE_KEY = 'saved_barkada_hangout';
const GUESTS_STORAGE_KEY = 'saved_barkada_guests';

function getFormDetails() {
  return {
    theme: document.getElementById('theme-select').value,
    badge: document.getElementById('input-badge').value,
    title: document.getElementById('input-title').value,
    tagline: document.getElementById('input-tagline').value,
    host: document.getElementById('input-host').value,
    date: document.getElementById('input-date').value,
    start: document.getElementById('input-start').value,
    end: document.getElementById('input-end').value,
    dress: document.getElementById('input-dress').value,
    venue: document.getElementById('input-venue').value,
    address: document.getElementById('input-address').value
  };
}

function applyDetailsToForm(data) {
  if (!data) return;
  document.getElementById('theme-select').value = data.theme || 'sky';
  document.getElementById('input-badge').value = data.badge || '';
  document.getElementById('input-title').value = data.title || '';
  document.getElementById('input-tagline').value = data.tagline || '';
  document.getElementById('input-host').value = data.host || '';
  document.getElementById('input-date').value = data.date || '';
  document.getElementById('input-start').value = data.start || '';
  document.getElementById('input-end').value = data.end || '';
  document.getElementById('input-dress').value = data.dress || '';
  document.getElementById('input-venue').value = data.venue || '';
  document.getElementById('input-address').value = data.address || '';

  changeTheme(data.theme || 'sky');
}

function generateAndCopyShareableURL() {
  const details = getFormDetails();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
  localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(guests));

  const params = new URLSearchParams(details);
  params.set('view', 'guest');
  params.set('rsvps', JSON.stringify(guests));

  const shareableURL = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

  window.history.replaceState({}, '', shareableURL);

  navigator.clipboard.writeText(shareableURL).catch(() => {
    prompt('Copy this updated link and send it to your GC:', shareableURL);
  });

  return shareableURL;
}

function saveAndShareHangout() {
  generateAndCopyShareableURL();
  updateInvitation();
  toggleDrawer();
  showToast('🔗 Saved! Shareable invite link copied to clipboard!');
}

function loadHangoutFromURLOrStorage() {
  const params = new URLSearchParams(window.location.search);

  // 1. Check if the link has shared URL parameters
  if (params.has('title') || params.has('venue')) {
    const urlData = {
      theme: params.get('theme'),
      badge: params.get('badge'),
      title: params.get('title'),
      tagline: params.get('tagline'),
      host: params.get('host'),
      date: params.get('date'),
      start: params.get('start'),
      end: params.get('end'),
      dress: params.get('dress'),
      venue: params.get('venue'),
      address: params.get('address')
    };
    applyDetailsToForm(urlData);

    if (params.has('rsvps')) {
      try {
        guests = JSON.parse(params.get('rsvps'));
      } catch (e) {
        console.error('Could not parse shared RSVPs:', e);
      }
    }

    if (params.get('view') === 'guest') {
      toggleGuestView(true);
    }
    return;
  }

  // 2. Otherwise, load from browser's localStorage
  const savedDetails = localStorage.getItem(STORAGE_KEY);
  if (savedDetails) {
    applyDetailsToForm(JSON.parse(savedDetails));
  } else {
    // Load your default 'gala' template on first visit
    loadTemplate('gala');
  }

  const savedGuests = localStorage.getItem(GUESTS_STORAGE_KEY);
  if (savedGuests) {
    guests = JSON.parse(savedGuests);
  }
}

function resetHangoutDetails() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(GUESTS_STORAGE_KEY);
  guests = [
    {
      name: 'John Doe',
      status: 'attending',
      count: 1,
      diet: 'Samgyeopsal & BBQ ',
      note: 'Walang male-late please! '
    }
  ];
  window.history.replaceState({}, '', window.location.pathname);
  loadTemplate('gala');
  renderGuestbook();
  showToast('🔄 Reset to default Barkada Gala!');
}

// ==========================================================================
// 8. Single Page Load Initialization (Fixed!)
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
  loadHangoutFromURLOrStorage();
  updateInvitation();
  renderGuestbook();
});