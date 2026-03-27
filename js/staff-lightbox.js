/**
 * Staff Lightbox
 * Opens a full-screen modal with a larger view of a staff member's photo,
 * name, role, bio, and standout detail when their card is clicked.
 * Only cards with an <img> photo (not avatar initials) are clickable.
 */
(function () {
  'use strict';

  /* ---- Staff data (bios) ---- */
  var staffData = {};

  function loadStaffData() {
    // Determine path prefix based on page location
    var prefix = window.location.pathname.indexOf('/pages/') !== -1 ? '../' : '';
    fetch(prefix + 'data/staff-leadership.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.members) {
          data.members.forEach(function (m) {
            staffData[m.name] = m;
          });
        }
      })
      .catch(function () { /* bios are optional */ });
  }

  loadStaffData();

  /* ---- Build the lightbox DOM ---- */
  var overlay = document.createElement('div');
  overlay.className = 'staff-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Staff member details');

  var inner = document.createElement('div');
  inner.className = 'staff-lightbox__inner';

  var closeBtn = document.createElement('button');
  closeBtn.className = 'staff-lightbox__close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '\u00D7';

  var photo = document.createElement('img');
  photo.className = 'staff-lightbox__photo';
  photo.src = '';
  photo.alt = '';

  var infoDiv = document.createElement('div');
  infoDiv.className = 'staff-lightbox__info';

  var nameEl = document.createElement('h3');
  nameEl.className = 'staff-lightbox__name';

  var roleEl = document.createElement('p');
  roleEl.className = 'staff-lightbox__role';

  var bioEl = document.createElement('p');
  bioEl.className = 'staff-lightbox__bio';

  var standoutEl = document.createElement('div');
  standoutEl.className = 'staff-lightbox__standout';

  infoDiv.appendChild(nameEl);
  infoDiv.appendChild(roleEl);
  infoDiv.appendChild(bioEl);
  infoDiv.appendChild(standoutEl);
  inner.appendChild(closeBtn);
  inner.appendChild(photo);
  inner.appendChild(infoDiv);
  overlay.appendChild(inner);
  document.body.appendChild(overlay);

  var previousFocus = null;

  /* ---- Open ---- */
  function open(card) {
    var img  = card.querySelector('.staff-card__photo');
    if (!img) return;

    var name = card.querySelector('.staff-card__name');
    var role = card.querySelector('.staff-card__role');

    var staffName = name ? name.textContent : '';
    var member = staffData[staffName] || {};

    photo.src = img.src;
    photo.alt = img.alt || '';
    nameEl.textContent  = staffName;
    roleEl.textContent  = role ? role.textContent : '';

    // Bio
    if (member.bio) {
      bioEl.textContent = member.bio;
      bioEl.style.display = '';
    } else {
      bioEl.textContent = '';
      bioEl.style.display = 'none';
    }

    // Standout detail
    if (member.standout) {
      standoutEl.textContent = member.standout;
      standoutEl.style.display = '';
    } else {
      standoutEl.textContent = '';
      standoutEl.style.display = 'none';
    }

    previousFocus = document.activeElement;

    // Force reflow, then add open class for transition
    void overlay.offsetHeight;
    overlay.classList.add('staff-lightbox--open');

    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  /* ---- Close ---- */
  function close() {
    overlay.classList.remove('staff-lightbox--open');
    document.body.style.overflow = '';
    if (previousFocus) {
      previousFocus.focus();
      previousFocus = null;
    }
  }

  /* ---- Event listeners ---- */
  closeBtn.addEventListener('click', close);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('staff-lightbox--open')) {
      close();
    }
  });

  // Trap focus inside the modal
  overlay.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    closeBtn.focus();
  });

  /* ---- Make photo-cards clickable ---- */
  var cards = document.querySelectorAll('.staff-card');
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    if (!card.querySelector('.staff-card__photo')) continue;

    card.classList.add('staff-card--has-lightbox');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'View details for ' + (card.querySelector('.staff-card__name') ? card.querySelector('.staff-card__name').textContent : ''));

    card.addEventListener('click', function () { open(this); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(this);
      }
    });
  }
})();
