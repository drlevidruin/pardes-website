/**
 * Announcement Banner System
 * Reads /data/alerts.json and displays a dismissible banner at the top of every page.
 *
 * JSON format:
 *   {
 *     "active": true,
 *     "type": "info" | "success" | "urgent",
 *     "message": "Banner text here",
 *     "link": { "text": "Link label", "url": "relative-or-absolute-url" },  // optional
 *     "dismissible": true  // optional, defaults to true
 *   }
 *
 * Set "active" to false or remove the message to hide the banner.
 */
(function () {
  'use strict';

  // Resolve the path to alerts.json relative to this script's location.
  // Works from both / (index.html) and /pages/ subdirectory.
  var isSubpage = window.location.pathname.indexOf('/pages/') !== -1;
  var basePath = isSubpage ? '../' : '';
  var jsonPath = basePath + 'data/alerts.json';

  // Dismiss key uses the message text so a new message reappears even if the old one was dismissed.
  var STORAGE_PREFIX = 'pardes_alert_dismissed_';

  function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  function createBanner(data) {
    var type = data.type || 'info';
    var dismissible = data.dismissible !== false;
    var dismissKey = STORAGE_PREFIX + hashCode(data.message);

    // Check if this specific message was already dismissed
    if (dismissible && sessionStorage.getItem(dismissKey)) {
      return;
    }

    var banner = document.createElement('div');
    banner.className = 'site-alert site-alert--' + type;
    banner.setAttribute('role', 'alert');

    var inner = document.createElement('div');
    inner.className = 'site-alert__inner';

    var text = document.createElement('p');
    text.className = 'site-alert__message';
    text.textContent = data.message;

    if (data.link && data.link.url && data.link.text) {
      var linkUrl = data.link.url;
      // Fix relative links when on a subpage
      if (isSubpage && linkUrl.indexOf('http') !== 0 && linkUrl.indexOf('../') !== 0) {
        linkUrl = '../' + linkUrl;
      }
      var a = document.createElement('a');
      a.href = linkUrl;
      a.className = 'site-alert__link';
      a.textContent = data.link.text;
      text.appendChild(document.createTextNode(' '));
      text.appendChild(a);
    }

    inner.appendChild(text);

    if (dismissible) {
      var btn = document.createElement('button');
      btn.className = 'site-alert__close';
      btn.setAttribute('aria-label', 'Dismiss announcement');
      btn.textContent = '\u00D7'; // multiplication sign (x) character
      btn.addEventListener('click', function () {
        banner.style.maxHeight = '0';
        banner.style.padding = '0';
        banner.style.opacity = '0';
        sessionStorage.setItem(dismissKey, '1');
        setTimeout(function () { banner.remove(); }, 300);
      });
      inner.appendChild(btn);
    }

    banner.appendChild(inner);

    // Insert at the very top of <body>, before the skip link
    document.body.insertBefore(banner, document.body.firstChild);

    // Trigger animation
    requestAnimationFrame(function () {
      banner.classList.add('site-alert--visible');
    });
  }

  // Fetch and render
  fetch(jsonPath)
    .then(function (res) {
      if (!res.ok) return null;
      return res.json();
    })
    .then(function (data) {
      if (data && data.active && data.message) {
        createBanner(data);
      }
    })
    .catch(function () {
      // Silently fail. No banner is fine.
    });
})();
