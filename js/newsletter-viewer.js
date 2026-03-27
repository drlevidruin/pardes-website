/* Newsletter Viewer Modal — vanilla JS, no dependencies */
(function () {
  'use strict';

  var overlay = null;
  var titleEl = null;
  var scrollEl = null;

  function build() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'newsletter-viewer';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Newsletter viewer');

    var inner = document.createElement('div');
    inner.className = 'newsletter-viewer__inner';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'newsletter-viewer__close';
    closeBtn.setAttribute('aria-label', 'Close viewer');
    closeBtn.textContent = '\u00D7';
    closeBtn.addEventListener('click', close);

    titleEl = document.createElement('h2');
    titleEl.className = 'newsletter-viewer__title';

    scrollEl = document.createElement('div');
    scrollEl.className = 'newsletter-viewer__scroll';

    inner.appendChild(closeBtn);
    inner.appendChild(titleEl);
    inner.appendChild(scrollEl);
    overlay.appendChild(inner);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    document.body.appendChild(overlay);
  }

  function open(issue) {
    build();

    titleEl.textContent = issue.title || 'Newsletter';

    /* Clear previous pages */
    while (scrollEl.firstChild) {
      scrollEl.removeChild(scrollEl.firstChild);
    }

    var pages = issue.pages || [];
    for (var i = 0; i < pages.length; i++) {
      var img = document.createElement('img');
      img.src = '../' + pages[i];
      img.alt = (issue.title || 'Newsletter') + ' — page ' + (i + 1);
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.className = 'newsletter-viewer__page';
      scrollEl.appendChild(img);
    }

    overlay.classList.add('newsletter-viewer--open');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.newsletter-viewer__close').focus();
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('newsletter-viewer--open');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  window.NewsletterViewer = { open: open };
})();
