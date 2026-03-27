/**
 * Gallery Page
 * Fetches gallery.json, renders photo/video cards into #gallery-grid,
 * builds category filter pills, and wires up lightbox clicks.
 */
(function () {
  'use strict';

  var grid = document.getElementById('gallery-grid');
  var filtersContainer = document.getElementById('gallery-filters');
  if (!grid) return;

  var allItems = [];
  var activeCategory = 'All';

  /* ---- Fetch data ---- */
  fetch('../data/gallery.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      allItems = data.items || [];
      buildFilters(allItems);
      renderGrid(allItems);
      if (window.GalleryLightbox) {
        window.GalleryLightbox.setItems(allItems);
      }
    })
    .catch(function (err) {
      console.error('Gallery: failed to load gallery.json', err);
      var msg = document.createElement('p');
      msg.style.textAlign = 'center';
      msg.style.color = 'var(--text-body)';
      msg.textContent = 'Gallery could not be loaded. Please try again later.';
      grid.appendChild(msg);
    });

  /* ---- Build filter buttons ---- */
  function buildFilters(items) {
    if (!filtersContainer) return;

    var categories = ['All'];
    items.forEach(function (item) {
      if (item.category && categories.indexOf(item.category) === -1) {
        categories.push(item.category);
      }
    });

    categories.forEach(function (cat) {
      var btn = document.createElement('button');
      btn.className = 'gallery-filter' + (cat === 'All' ? ' gallery-filter--active' : '');
      btn.textContent = cat;
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-pressed', cat === 'All' ? 'true' : 'false');
      btn.addEventListener('click', function () { filterBy(cat); });
      filtersContainer.appendChild(btn);
    });
  }

  /* ---- Filter handler ---- */
  function filterBy(category) {
    activeCategory = category;

    // Update button states
    var buttons = filtersContainer.querySelectorAll('.gallery-filter');
    for (var i = 0; i < buttons.length; i++) {
      var isActive = buttons[i].textContent === category;
      buttons[i].classList.toggle('gallery-filter--active', isActive);
      buttons[i].setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }

    // Filter visible items
    var filtered = category === 'All'
      ? allItems
      : allItems.filter(function (item) { return item.category === category; });

    renderGrid(filtered);

    // Update lightbox items to match filtered set
    if (window.GalleryLightbox) {
      window.GalleryLightbox.setItems(filtered);
    }
  }

  /* ---- Render grid ---- */
  function renderGrid(items) {
    // Clear existing children safely
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    items.forEach(function (item, index) {
      var card = document.createElement('div');
      card.className = 'gallery-item' + (item.type === 'video' ? ' gallery-item--video' : '');
      card.setAttribute('data-category', item.category || '');

      if (item.type === 'video') {
        var thumb = document.createElement('div');
        thumb.className = 'gallery-item__thumb';

        var img = document.createElement('img');
        img.src = '../' + (item.thumbnail || item.src);
        img.alt = item.caption || item.alt || '';
        img.loading = 'lazy';

        var play = document.createElement('div');
        play.className = 'gallery-item__play';
        play.textContent = '\u25B6';

        thumb.appendChild(img);
        thumb.appendChild(play);
        card.appendChild(thumb);
      } else {
        var photoImg = document.createElement('img');
        photoImg.src = '../' + item.src;
        photoImg.alt = item.alt || '';
        photoImg.loading = 'lazy';
        card.appendChild(photoImg);

        if (item.caption) {
          var cap = document.createElement('div');
          cap.className = 'gallery-item__caption';
          cap.textContent = item.caption;
          card.appendChild(cap);
        }
      }

      // Accessibility
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'View: ' + (item.caption || item.alt || 'gallery item'));

      // Open lightbox on click
      card.addEventListener('click', function () {
        if (window.GalleryLightbox) window.GalleryLightbox.open(index);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (window.GalleryLightbox) window.GalleryLightbox.open(index);
        }
      });

      grid.appendChild(card);
    });
  }
})();
