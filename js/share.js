/**
 * Share Button (Web Share API)
 * Adds a "Share This Page" button to designated sections.
 *
 * Usage: Add <div data-share-button></div> anywhere in your HTML.
 * The script will inject a styled share button into that container.
 *
 * On mobile (where Web Share API is supported), tapping opens the
 * phone's native share sheet (WhatsApp, iMessage, etc.).
 * On desktop (no Web Share API), it copies the URL to clipboard.
 */
(function () {
  'use strict';

  function createShareButton(container) {
    var btn = document.createElement('button');
    btn.className = 'share-btn';
    btn.setAttribute('aria-label', 'Share this page');

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', '#343e85');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');

    var path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8');
    var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', '16 6 12 2 8 6');
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '12');
    line.setAttribute('y1', '2');
    line.setAttribute('x2', '12');
    line.setAttribute('y2', '15');

    svg.appendChild(path1);
    svg.appendChild(polyline);
    svg.appendChild(line);

    var label = document.createElement('span');
    label.textContent = 'Share This Page';

    btn.appendChild(svg);
    btn.appendChild(label);

    btn.addEventListener('click', function () {
      var pageTitle = document.title;
      var pageUrl = window.location.href;

      // Use native share on mobile if available
      if (navigator.share) {
        navigator.share({
          title: pageTitle,
          url: pageUrl
        }).catch(function () {
          // User cancelled share. That's fine.
        });
      } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(pageUrl).then(function () {
          btn.classList.add('share-btn--copied');
          label.textContent = 'Link Copied!';
          setTimeout(function () {
            btn.classList.remove('share-btn--copied');
            label.textContent = 'Share This Page';
          }, 2000);
        }).catch(function () {
          // Clipboard API failed. Try legacy approach.
          var textArea = document.createElement('textarea');
          textArea.value = pageUrl;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            btn.classList.add('share-btn--copied');
            label.textContent = 'Link Copied!';
            setTimeout(function () {
              btn.classList.remove('share-btn--copied');
              label.textContent = 'Share This Page';
            }, 2000);
          } catch (e) {
            label.textContent = 'Copy failed';
          }
          document.body.removeChild(textArea);
        });
      }
    });

    var wrapper = document.createElement('div');
    wrapper.className = 'share-btn-container';
    wrapper.appendChild(btn);
    container.appendChild(wrapper);
  }

  // Find all share button containers
  var containers = document.querySelectorAll('[data-share-button]');
  for (var i = 0; i < containers.length; i++) {
    createShareButton(containers[i]);
  }
})();
