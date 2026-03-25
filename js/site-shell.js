(function () {
  'use strict';

  var LOGO_PLACEHOLDER = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2064%2064'%20role='img'%20aria-label='Pardes%20Day%20School'%3e%3crect%20width='64'%20height='64'%20rx='14'%20fill='%23343e85'/%3e%3cpath%20d='M20%2014h16c8.837%200%2016%207.163%2016%2016s-7.163%2016-16%2016h-8v12h-8V14zm8%208v16h8c4.418%200%208-3.582%208-8s-3.582-8-8-8h-8z'%20fill='%23fefefe'/%3e%3c/svg%3e";
  var INSTAGRAM_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"></rect><circle cx="12" cy="12" r="5"></circle><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"></circle></svg>';
  var ROUTES = {
    root: {
      home: 'index.html',
      preschool: 'pages/preschool.html',
      elementary: 'pages/elementary.html',
      middle: 'pages/middle-school.html',
      staff: 'pages/staff.html',
      admissions: 'pages/admissions.html',
      studentLife: 'pages/student-life.html',
      parents: 'pages/parents.html',
      support: 'pages/support.html',
      contact: 'pages/contact.html',
      tour: 'pages/admissions.html#schedule-tour'
    },
    subpage: {
      home: '../index.html',
      preschool: '../pages/preschool.html',
      elementary: '../pages/elementary.html',
      middle: '../pages/middle-school.html',
      staff: '../pages/staff.html',
      admissions: '../pages/admissions.html',
      studentLife: '../pages/student-life.html',
      parents: '../pages/parents.html',
      support: '../pages/support.html',
      contact: '../pages/contact.html',
      tour: '../pages/admissions.html#schedule-tour'
    }
  };
  var CTA_CONFIG = {
    team: {
      label: 'Meet the Team',
      hrefKey: 'staff'
    },
    tour: {
      label: 'Schedule a Tour',
      hrefKey: 'tour'
    }
  };

  function requireAttributeValue(element, name, allowedValues) {
    var value = element.getAttribute(name);
    var tagName = element.tagName.toLowerCase();
    if (!value) {
      throw new Error('<' + tagName + '> requires the ' + name + ' attribute.');
    }
    if (allowedValues.indexOf(value) === -1) {
      throw new Error(
        '<' + tagName + '> has invalid ' + name + '="' + value + '". Expected one of: ' + allowedValues.join(', ') + '.'
      );
    }
    return value;
  }

  function getRoutes(context) {
    if (!ROUTES[context]) {
      throw new Error('Unsupported site shell context: ' + context);
    }
    return ROUTES[context];
  }

  function renderHeaderMarkup(routes, ctaKey) {
    var cta = CTA_CONFIG[ctaKey];

    return '' +
      '<header class="site-header">' +
      '  <div class="container header-inner">' +
      '    <a class="brand" href="' + routes.home + '" aria-label="Pardes Day School home">' +
      '      <img data-logo src="' + LOGO_PLACEHOLDER + '" alt="Pardes Day School logo" />' +
      '      <span class="brand__text">Pardes Day School</span>' +
      '    </a>' +
      '    <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-label="Toggle navigation">' +
      '      <span aria-hidden="true">Menu</span>' +
      '    </button>' +
      '    <nav class="site-nav" data-site-nav aria-label="Primary navigation">' +
      '      <ul class="nav-list">' +
      '        <li><a data-nav-link href="' + routes.home + '">Home</a></li>' +
      '        <li class="nav-group">' +
      '          <span class="nav-group__label">About Us</span>' +
      '          <div class="nav-dropdown">' +
      '            <a data-nav-link href="' + routes.preschool + '">Preschool</a>' +
      '            <a data-nav-link href="' + routes.elementary + '">Elementary</a>' +
      '            <a data-nav-link href="' + routes.middle + '">Middle School</a>' +
      '            <a data-nav-link href="' + routes.staff + '">Our Team</a>' +
      '          </div>' +
      '        </li>' +
      '        <li><a data-nav-link href="' + routes.admissions + '">Admissions</a></li>' +
      '        <li><a data-nav-link href="' + routes.studentLife + '">Student Life</a></li>' +
      '        <li class="nav-group">' +
      '          <span class="nav-group__label">Community</span>' +
      '          <div class="nav-dropdown">' +
      '            <a data-nav-link href="' + routes.parents + '">Parents</a>' +
      '            <a data-nav-link href="' + routes.support + '">Support Pardes</a>' +
      '            <a data-nav-link href="' + routes.contact + '">Contact</a>' +
      '          </div>' +
      '        </li>' +
      '      </ul>' +
      '    </nav>' +
      '    <div class="header-actions">' +
      '      <a class="btn btn-primary" href="' + routes[cta.hrefKey] + '">' + cta.label + '</a>' +
      '    </div>' +
      '  </div>' +
      '</header>';
  }

  function renderFooterMarkup(routes) {
    return '' +
      '<footer class="site-footer">' +
      '  <div class="container footer-grid">' +
      '    <section>' +
      '      <h3 class="footer-title">Pardes Day School</h3>' +
      '      <div class="footer-campus">' +
      '        <p class="footer-campus__name"><strong>Preschool &amp; Elementary Campus</strong></p>' +
      '        <p class="footer-campus__address">1211 Marseille Dr<br>Miami Beach, FL 33141</p>' +
      '        <p class="footer-campus__contact"><a href="tel:+13056902548">(305) 690-2548</a></p>' +
      '        <p class="footer-campus__contact"><a href="mailto:office@pardesdayschool.org">office@pardesdayschool.org</a></p>' +
      '      </div>' +
      '      <div class="footer-campus">' +
      '        <p class="footer-campus__name"><strong>MSAP Campus (Middle School)</strong></p>' +
      '        <p class="footer-campus__address">7055 Bonita Dr<br>Miami Beach, FL 33141</p>' +
      '        <p class="footer-campus__contact"><a href="tel:+17867908662">(786) 790-8662</a></p>' +
      '        <p class="footer-campus__contact"><a href="mailto:msapoffice@pardesdayschool.org">msapoffice@pardesdayschool.org</a></p>' +
      '      </div>' +
      '    </section>' +
      '    <section>' +
      '      <h3 class="footer-title">Quick Links</h3>' +
      '      <ul class="footer-links">' +
      '        <li><a href="' + routes.admissions + '">Admissions</a></li>' +
      '        <li><a href="' + routes.studentLife + '">Student Life</a></li>' +
      '        <li><a href="' + routes.parents + '">Parents</a></li>' +
      '        <li><a href="' + routes.support + '">Support Pardes</a></li>' +
      '        <li><a href="' + routes.contact + '">Contact</a></li>' +
      '      </ul>' +
      '    </section>' +
      '    <section>' +
      '      <h3 class="footer-title">Divisions</h3>' +
      '      <ul class="footer-links">' +
      '        <li><a href="' + routes.preschool + '">Preschool (Gan Katan)</a></li>' +
      '        <li><a href="' + routes.elementary + '">Elementary (K-5)</a></li>' +
      '        <li><a href="' + routes.middle + '">Middle School (6-8)</a></li>' +
      '      </ul>' +
      '    </section>' +
      '    <section>' +
      '      <h3 class="footer-title">Follow Us</h3>' +
      '      <p style="font-size: .85rem; color: rgba(255,255,255,0.6); margin-bottom: .8rem;">Stay connected with our community.</p>' +
      '      <div class="social-row" aria-label="Social media links">' +
      '        <a class="social-dot" href="https://www.instagram.com/pardesdayschool/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">' + INSTAGRAM_ICON + '</a>' +
      '      </div>' +
      '    </section>' +
      '  </div>' +
      '  <div class="container legal-line">' +
      '    <p>&copy; 2026 Pardes Day School. All rights reserved.</p>' +
      '  </div>' +
      '</footer>';
  }

  function renderShell(element, markup) {
    if (element.dataset.siteShellRendered === 'true') {
      return;
    }
    element.innerHTML = markup;
    element.dataset.siteShellRendered = 'true';
  }

  function SiteHeader() {
    return Reflect.construct(HTMLElement, [], SiteHeader);
  }

  SiteHeader.prototype = Object.create(HTMLElement.prototype);
  SiteHeader.prototype.constructor = SiteHeader;
  Object.setPrototypeOf(SiteHeader, HTMLElement);

  SiteHeader.prototype.connectedCallback = function () {
    var context = requireAttributeValue(this, 'data-context', ['root', 'subpage']);
    var cta = requireAttributeValue(this, 'data-cta', ['team', 'tour']);
    renderShell(this, renderHeaderMarkup(getRoutes(context), cta));
  };

  function SiteFooter() {
    return Reflect.construct(HTMLElement, [], SiteFooter);
  }

  SiteFooter.prototype = Object.create(HTMLElement.prototype);
  SiteFooter.prototype.constructor = SiteFooter;
  Object.setPrototypeOf(SiteFooter, HTMLElement);

  SiteFooter.prototype.connectedCallback = function () {
    var context = requireAttributeValue(this, 'data-context', ['root', 'subpage']);
    renderShell(this, renderFooterMarkup(getRoutes(context)));
  };

  if (!window.customElements.get('site-header')) {
    window.customElements.define('site-header', SiteHeader);
  }

  if (!window.customElements.get('site-footer')) {
    window.customElements.define('site-footer', SiteFooter);
  }
})();
