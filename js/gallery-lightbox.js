/**
 * Gallery Lightbox
 * Full-screen modal viewer for gallery photos and videos.
 * Supports prev/next navigation via arrow keys and on-screen buttons.
 *
 * API (exposed on window.GalleryLightbox):
 *   setItems(arr)        — store the full items array for navigation
 *   open(index)           — open lightbox at the given item index
 */
(function () {
  'use strict';

  var items = [];
  var currentIndex = -1;
  var previousFocus = null;

  /* ---- Build the lightbox DOM ---- */
  var overlay = document.createElement('div');
  overlay.className = 'gallery-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Gallery photo viewer');

  var inner = document.createElement('div');
  inner.className = 'gallery-lightbox__inner';

  var closeBtn = document.createElement('button');
  closeBtn.className = 'gallery-lightbox__close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '\u00D7';

  var prevBtn = document.createElement('button');
  prevBtn.className = 'gallery-lightbox__prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.textContent = '\u2039';

  var nextBtn = document.createElement('button');
  nextBtn.className = 'gallery-lightbox__next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.textContent = '\u203A';

  var mediaWrap = document.createElement('div');
  mediaWrap.className = 'gallery-lightbox__media';

  var photo = document.createElement('img');
  photo.className = 'gallery-lightbox__photo';

  var iframe = document.createElement('iframe');
  iframe.className = 'gallery-lightbox__video';
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'autoplay; encrypted-media');
  iframe.style.display = 'none';

  var caption = document.createElement('p');
  caption.className = 'gallery-lightbox__caption';

  mediaWrap.appendChild(photo);
  mediaWrap.appendChild(iframe);
  inner.appendChild(closeBtn);
  inner.appendChild(prevBtn);
  inner.appendChild(mediaWrap);
  inner.appendChild(caption);
  inner.appendChild(nextBtn);
  overlay.appendChild(inner);
  document.body.appendChild(overlay);

  /* ---- Helpers ---- */
  function showItem(index) {
    if (index < 0 || index >= items.length) return;
    currentIndex = index;
    var item = items[index];

    if (item.type === 'video' && item.embed) {
      photo.style.display = 'none';
      iframe.style.display = 'block';
      iframe.src = item.embed;
    } else {
      iframe.style.display = 'none';
      iframe.src = '';
      photo.style.display = '';
      photo.src = '../' + item.src;
      photo.alt = item.alt || item.caption || '';
    }

    caption.textContent = item.caption || item.alt || '';

    prevBtn.style.display = index > 0 ? '' : 'none';
    nextBtn.style.display = index < items.length - 1 ? '' : 'none';
  }

  /* ---- Open ---- */
  function open(index) {
    if (!items.length) return;
    previousFocus = document.activeElement;
    showItem(index);

    void overlay.offsetHeight;
    overlay.classList.add('gallery-lightbox--open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  /* ---- Close ---- */
  function close() {
    overlay.classList.remove('gallery-lightbox--open');
    document.body.style.overflow = '';
    iframe.src = '';
    iframe.style.display = 'none';
    if (previousFocus) {
      previousFocus.focus();
      previousFocus = null;
    }
  }

  /* ---- Navigation ---- */
  function prev() {
    if (currentIndex > 0) showItem(currentIndex - 1);
  }

  function next() {
    if (currentIndex < items.length - 1) showItem(currentIndex + 1);
  }

  /* ---- Set items ---- */
  function setItems(arr) {
    items = arr || [];
  }

  /* ---- Event listeners ---- */
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
  nextBtn.addEventListener('click', function (e) { e.stopPropagation(); next(); });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('gallery-lightbox--open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Trap focus inside the modal
  overlay.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    closeBtn.focus();
  });

  /* ---- Public API ---- */
  window.GalleryLightbox = {
    open: open,
    setItems: setItems
  };
})();
