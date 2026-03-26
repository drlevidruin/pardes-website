/**
 * Staff Lightbox
 * Opens a full-screen modal with a larger view of a staff member's photo,
 * name, and role when their card is clicked.
 * Only cards with an <img> photo (not avatar initials) are clickable.
 */
(function () {
  'use strict';

  /* ---- Build the lightbox DOM using safe DOM methods ---- */
  var overlay = document.createElement('div');
  overlay.className = 'staff-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Staff photo viewer');
  overlay.hidden = true;

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

  infoDiv.appendChild(nameEl);
  infoDiv.appendChild(roleEl);
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

    photo.src = img.src;
    photo.alt = img.alt || '';
    nameEl.textContent  = name ? name.textContent : '';
    roleEl.textContent  = role ? role.textContent : '';

    previousFocus = document.activeElement;
    overlay.hidden = false;

    // Force reflow so the fade-in transition triggers
    void overlay.offsetHeight;
    overlay.classList.add('staff-lightbox--open');

    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  /* ---- Close ---- */
  function close() {
    overlay.classList.remove('staff-lightbox--open');
    var handler = function () {
      overlay.hidden = true;
      overlay.removeEventListener('transitionend', handler);
    };
    overlay.addEventListener('transitionend', handler);

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
    if (e.key === 'Escape' && !overlay.hidden) {
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
    card.setAttribute('aria-label', 'View photo of ' + (card.querySelector('.staff-card__name') ? card.querySelector('.staff-card__name').textContent : ''));

    card.addEventListener('click', function () { open(this); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(this);
      }
    });
  }
})();
