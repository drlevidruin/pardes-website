(function () {
  'use strict';

  // Determine current page slug from the filename
  var path = window.location.pathname;
  var filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
  // Handle index/homepage
  if (!filename || filename === 'index') filename = 'home';

  function createEl(tag, className, textContent) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent) el.textContent = textContent;
    return el;
  }

  function renderPullQuote(t) {
    var section = createEl('section', 'testimonial-pullquote-section');
    var container = createEl('div', 'container');
    var quote = createEl('div', 'testimonial-pullquote');
    quote.setAttribute('data-reveal', '');

    var deco = createEl('span', 'testimonial-pullquote__deco', '\u201C');
    quote.appendChild(deco);

    var text = createEl('p', 'testimonial-pullquote__text');
    text.textContent = '\u201C' + t.quote + '\u201D';
    quote.appendChild(text);

    var attr = createEl('p', 'testimonial-pullquote__attr');
    var nameSpan = createEl('span', 'testimonial-pullquote__name', t.name);
    attr.appendChild(nameSpan);
    if (t.since_year) {
      var since = createEl('span', 'testimonial-pullquote__since', ' \u00B7 since ' + t.since_year);
      attr.appendChild(since);
    }
    quote.appendChild(attr);

    var detail = createEl('p', 'testimonial-pullquote__detail', t.detail);
    quote.appendChild(detail);

    container.appendChild(quote);
    section.appendChild(container);
    return section;
  }

  function renderStoryCards(stories) {
    var section = createEl('section', 'sub-section');
    var container = createEl('div', 'container');

    var intro = createEl('div', 'section-intro');
    intro.setAttribute('data-reveal', '');
    var label = createEl('span', 'section-label', 'What Parents Say');
    var heading = createEl('h2', '', 'Real families. Real stories.');
    intro.appendChild(label);
    intro.appendChild(heading);
    container.appendChild(intro);

    var grid = createEl('div', 'testimonial-stories');
    grid.setAttribute('data-reveal', '');

    stories.forEach(function (t) {
      var card = createEl('article', 'story-card');

      // Avatar or photo
      var avatarWrap = createEl('div', 'story-card__avatar-wrap');
      if (t.family_photo) {
        var photo = document.createElement('img');
        photo.className = 'story-card__photo';
        photo.src = '../' + t.family_photo;
        photo.alt = t.name;
        photo.loading = 'lazy';
        avatarWrap.appendChild(photo);
      } else {
        var avatar = createEl('div', 'story-card__initials', t.initials || '');
        avatarWrap.appendChild(avatar);
      }

      var quoteEl = createEl('blockquote', 'story-card__quote');
      quoteEl.textContent = '\u201C' + t.quote + '\u201D';
      card.appendChild(quoteEl);

      if (t.story) {
        var storyEl = createEl('p', 'story-card__story', t.story);
        card.appendChild(storyEl);
      }

      var footer = createEl('div', 'story-card__footer');
      footer.appendChild(avatarWrap);
      var info = createEl('div', 'story-card__info');
      info.appendChild(createEl('strong', 'story-card__name', t.name));
      var detailLine = t.detail;
      if (t.since_year) detailLine += ' \u00B7 since ' + t.since_year;
      info.appendChild(createEl('span', 'story-card__detail', detailLine));
      footer.appendChild(info);
      card.appendChild(footer);

      grid.appendChild(card);
    });

    container.appendChild(grid);
    section.appendChild(container);
    return section;
  }

  fetch('../data/testimonials.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data.testimonials) return;

      var quotes = [];
      var stories = [];

      data.testimonials.forEach(function (t) {
        var type = t.type || 'quote';
        var pages = t.pages || [];
        if (pages.indexOf(filename) === -1) return;

        if (type === 'story') {
          stories.push(t);
        } else {
          quotes.push(t);
        }
      });

      // Insert pull quotes before the soft-cta section
      var softCta = document.querySelector('.soft-cta');
      if (quotes.length > 0 && softCta) {
        // Insert only the first matching quote to keep it clean
        softCta.parentNode.insertBefore(renderPullQuote(quotes[0]), softCta);
      }

      // Insert story cards before the soft-cta (or before the form on admissions)
      if (stories.length > 0) {
        var insertPoint = document.getElementById('request-info') || softCta;
        if (insertPoint) {
          insertPoint.parentNode.insertBefore(renderStoryCards(stories), insertPoint);
        }
      }
    })
    .catch(function () {
      // Silently fail — testimonials are optional enhancement
    });
})();
