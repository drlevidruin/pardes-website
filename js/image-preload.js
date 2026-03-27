/* image-preload.js — fetch lazy images 300px before viewport
   Prevents the "double wait" of loading=lazy + reveal animation.
   Images start downloading before the reveal observer fires. */
(function () {
  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var img = entry.target;
      if (img.loading === 'lazy') {
        img.loading = 'eager';
      }
      observer.unobserve(img);
    });
  }, { rootMargin: '300px 0px' });

  document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
    observer.observe(img);
  });
})();
