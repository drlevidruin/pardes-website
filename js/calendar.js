(function () {
  'use strict';

  var container = document.getElementById('school-calendar');
  if (!container) return;

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  var TYPE_LABELS = {
    holiday: 'Holiday',
    no_school: 'No School',
    early_dismissal: 'Early Dismissal',
    event: 'Event'
  };

  function formatDate(dateStr) {
    var parts = dateStr.split('-');
    var month = parseInt(parts[1], 10);
    var day = parseInt(parts[2], 10);
    return MONTHS[month - 1] + ' ' + day;
  }

  function formatDateRange(start, end) {
    if (!end) return formatDate(start);
    var s = start.split('-');
    var e = end.split('-');
    if (s[1] === e[1]) {
      return MONTHS[parseInt(s[1], 10) - 1] + ' ' + parseInt(s[2], 10) + '\u2013' + parseInt(e[2], 10);
    }
    return formatDate(start) + ' \u2013 ' + formatDate(end);
  }

  function getMonthKey(dateStr) {
    var parts = dateStr.split('-');
    return parts[0] + '-' + parts[1];
  }

  function getMonthName(dateStr) {
    var parts = dateStr.split('-');
    return MONTHS[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
  }

  function createEl(tag, className, textContent) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent) el.textContent = textContent;
    return el;
  }

  fetch('../data/calendar.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data.dates || data.dates.length === 0) {
        container.appendChild(createEl('p', 'calendar-empty', 'Calendar dates will be posted soon.'));
        return;
      }

      // Group by month
      var months = {};
      var monthOrder = [];
      data.dates.forEach(function (entry) {
        var key = getMonthKey(entry.date);
        if (!months[key]) {
          months[key] = [];
          monthOrder.push(key);
        }
        months[key].push(entry);
      });

      // PDF download link
      if (data.pdf_url) {
        var link = createEl('a', 'calendar-download', 'Download Full Calendar (PDF)');
        link.href = '../' + data.pdf_url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        container.appendChild(link);
      }

      monthOrder.forEach(function (key) {
        var entries = months[key];
        var monthName = getMonthName(entries[0].date);

        var monthDiv = createEl('div', 'calendar-month');
        monthDiv.appendChild(createEl('h3', 'calendar-month__title', monthName));

        entries.forEach(function (entry) {
          var dateDisplay = formatDateRange(entry.date, entry.end_date);
          var row = createEl('div', 'calendar-date');
          row.appendChild(createEl('span', 'calendar-date__when', dateDisplay));
          row.appendChild(createEl('span', 'calendar-date__label', entry.label));
          row.appendChild(createEl('span', 'calendar-date__badge calendar-date__badge--' + entry.type, TYPE_LABELS[entry.type]));
          monthDiv.appendChild(row);
        });

        container.appendChild(monthDiv);
      });
    })
    .catch(function () {
      container.appendChild(createEl('p', 'calendar-empty', 'Calendar dates will be posted soon.'));
    });
})();
