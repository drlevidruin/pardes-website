/* Newsletter Grid — fetches data/newsletters.json and renders cards */
(function () {
  'use strict';

  var grid = document.getElementById('newsletter-grid');
  var empty = document.getElementById('newsletter-empty');

  if (!grid || !empty) return;

  fetch('../data/newsletters.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var issues = data.issues || [];

      if (issues.length === 0) {
        grid.style.display = 'none';
        empty.style.display = '';
        return;
      }

      empty.style.display = 'none';
      grid.style.display = '';

      issues.forEach(function (issue, idx) {
        var card = document.createElement('div');
        card.className = 'newsletter-card';
        card.setAttribute('data-index', idx);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Open ' + (issue.title || 'newsletter'));

        /* Cover image */
        var cover = document.createElement('div');
        cover.className = 'newsletter-card__cover';

        if (issue.pages && issue.pages.length > 0) {
          var img = document.createElement('img');
          img.src = '../' + issue.pages[0];
          img.alt = issue.title || 'Newsletter cover';
          img.loading = 'lazy';
          cover.appendChild(img);
        }

        /* Title */
        var title = document.createElement('h3');
        title.className = 'newsletter-card__title';
        title.textContent = issue.title || '';

        /* Description */
        var desc = document.createElement('p');
        desc.className = 'newsletter-card__desc';
        desc.textContent = issue.description || '';

        card.appendChild(cover);
        card.appendChild(title);
        card.appendChild(desc);

        /* Click / keyboard open */
        function openViewer() {
          if (window.NewsletterViewer) {
            window.NewsletterViewer.open(issue);
          }
        }
        card.addEventListener('click', openViewer);
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openViewer();
          }
        });

        grid.appendChild(card);
      });
    })
    .catch(function () {
      grid.style.display = 'none';
      empty.style.display = '';
    });
})();
